from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import httpx, asyncio, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "../.env"))

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())


class OrderState(StatesGroup):
    waiting_name = State()
    waiting_phone = State()
    waiting_confirm = State()


def main_menu():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="🛍 Каталог"), KeyboardButton(text="🔍 Пошук")],
        [KeyboardButton(text="🛒 Кошик"), KeyboardButton(text="📞 Контакти")],
    ], resize_keyboard=True)


@dp.message(Command("start"))
async def cmd_start(msg: types.Message):
    await msg.answer(
        f"👋 Привіт, {msg.from_user.first_name}!\n\n"
        "🛢️ Ласкаво просимо до магазину автохімії *Liqui Moly*!\n\n"
        "400+ товарів в наявності\n"
        "✅ Доставка Nova Poshta по всій Україні\n"
        "✅ Оригінальна продукція з гарантією",
        parse_mode="Markdown",
        reply_markup=main_menu()
    )


@dp.message(F.text == "🛍 Каталог")
async def catalog(msg: types.Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/categories/list")
        if r.status_code != 200:
            await msg.answer("Каталог тимчасово недоступний.")
            return
        categories = r.json()

    if not categories:
        await msg.answer("Каталог порожній. Скоро додамо товари!")
        return

    buttons = [[InlineKeyboardButton(
        text=f"{cat['name']} ({cat['count']})",
        callback_data=f"cat:{cat['name'][:40]}"
    )] for cat in categories[:12]]

    await msg.answer("📦 Оберіть категорію:", reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))


@dp.callback_query(F.data.startswith("cat:"))
async def show_category(callback: types.CallbackQuery):
    category = callback.data.split(":", 1)[1]
    await show_products_page(callback.message, category, page=0)
    await callback.answer()


async def show_products_page(msg, category: str, page: int = 0):
    limit = 5
    offset = page * limit
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/", params={"category": category, "limit": limit, "page": page + 1})
        if r.status_code != 200:
            await msg.answer("Помилка завантаження")
            return
        data = r.json()

    items = data.get("items", [])
    total = data.get("total", 0)

    if not items:
        await msg.answer("Товари не знайдені.")
        return

    await msg.answer(f"📦 *{category}* — {total} товарів, сторінка {page+1}", parse_mode="Markdown")

    for p in items:
        avail = "✅ В наявності" if p.get("available") else "❌ Немає"
        caption = f"*{p['name']}*\n💰 {p['price']} ₴\n{avail}"
        buttons = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text="🛒 До кошика", callback_data=f"add:{p['id']}")
        ]])
        if p.get("image_url"):
            try:
                await msg.answer_photo(p["image_url"], caption=caption, parse_mode="Markdown", reply_markup=buttons)
                continue
            except:
                pass
        await msg.answer(caption, parse_mode="Markdown", reply_markup=buttons)

    # Кнопка "Ще"
    if offset + limit < total:
        remaining = total - offset - limit
        nav = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text=f"Ще {remaining} товарів →", callback_data=f"page:{category}:{page+1}")
        ]])
        await msg.answer(f"Показано {offset+len(items)} з {total}", reply_markup=nav)


@dp.callback_query(F.data.startswith("page:"))
async def next_page(callback: types.CallbackQuery):
    _, category, page = callback.data.split(":", 2)
    await show_products_page(callback.message, category, page=int(page))
    await callback.answer()



async def contacts(msg: types.Message):
    await msg.answer(
        "📞 *Контакти*\n\n"
        "Telegram: @Liquimolli\\_bot\n"
        "Працюємо: цілодобово 🕐\n\n"
        "З питань замовлень пишіть нам!",
        parse_mode="Markdown"
    )


@dp.message(F.text == "🛒 Кошик")
async def show_cart_msg(msg: types.Message):
    from handlers.cart import show_cart_content
    await show_cart_content(msg)


# Синоніми для розумного пошуку
SYNONYMS = {
    "масло": ["масло", "олива", "oil", "öl"],
    "олива": ["масло", "олива", "oil"],
    "тормоз": ["тормоз", "гальм", "brake"],
    "тормозна": ["тормоз", "гальм", "brake"],
    "гальм": ["тормоз", "гальм", "brake"],
    "присадка": ["присадка", "additiv", "additive"],
    "очисник": ["очисник", "очищувач", "reiniger", "cleaner"],
    "антифриз": ["антифриз", "охолод", "kühl"],
    "трансмісія": ["трансмісія", "трансмисс", "gear", "getriebe"],
    "кондиціонер": ["кондиц", "klimaanlage", "climate"],
}

def expand_query(text: str) -> list[str]:
    """Розширює пошуковий запит синонімами."""
    text_lower = text.lower()
    terms = [text]
    for key, synonyms in SYNONYMS.items():
        if key in text_lower:
            terms.extend(synonyms)
    return list(set(terms))


async def search_products(query: str, page: int = 0) -> dict:
    """Пошук товарів з підтримкою синонімів."""
    limit = 5
    terms = expand_query(query)
    
    async with httpx.AsyncClient() as client:
        # Пробуємо кожен термін і збираємо результати
        all_items = {}
        total = 0
        
        for term in terms[:3]:  # максимум 3 терміни
            r = await client.get(f"{API_URL}/api/products/",
                params={"search": term, "limit": 20, "page": 1})
            if r.status_code == 200:
                data = r.json()
                for item in data.get("items", []):
                    all_items[item["id"]] = item
                if not total:
                    total = data.get("total", 0)
        
        items = list(all_items.values())
        # Пагінація вручну
        start = page * limit
        return {
            "items": items[start:start+limit],
            "total": len(items),
            "page": page
        }


@dp.message(F.text == "🔍 Пошук")
async def search_prompt(msg: types.Message, state: FSMContext):
    await state.set_state(SearchState.waiting_query)
    await msg.answer("🔍 Введіть назву, артикул або тип товару:\n\nНаприклад: *5w30*, *масло*, *гальмівна рідина*, *3078*",
                     parse_mode="Markdown")


class SearchState(StatesGroup):
    waiting_query = State()


@dp.message(SearchState.waiting_query)
async def handle_search_fsm(msg: types.Message, state: FSMContext):
    await state.clear()
    await do_search(msg, msg.text, page=0)


async def do_search(msg, query: str, page: int = 0):
    data = await search_products(query, page)
    items = data.get("items", [])
    total = data.get("total", 0)

    if not items:
        await msg.answer(f"😕 По запиту «{query}» нічого не знайдено.\n\nСпробуйте: *масло*, *5w30*, *присадка*",
                         parse_mode="Markdown")
        return

    await msg.answer(f"🔍 «{query}» — знайдено {total} товарів:", parse_mode="Markdown")

    for p in items:
        avail = "✅ В наявності" if p.get("available") else "❌ Немає"
        caption = f"*{p['name']}*\n💰 {p['price']} ₴\n{avail}"
        buttons = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text="🛒 До кошика", callback_data=f"add:{p['id']}")
        ]])
        if p.get("image_url"):
            try:
                await msg.answer_photo(p["image_url"], caption=caption, parse_mode="Markdown", reply_markup=buttons)
                continue
            except:
                pass
        await msg.answer(caption, parse_mode="Markdown", reply_markup=buttons)

    limit = 5
    if page * limit + limit < total:
        remaining = total - (page + 1) * limit
        nav = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(
                text=f"Ще {min(remaining, limit)} з {remaining} →",
                callback_data=f"search:{query}:{page+1}"
            )
        ]])
        await msg.answer(f"Показано {page*limit + len(items)} з {total}", reply_markup=nav)


@dp.callback_query(F.data.startswith("search:"))
async def search_next_page(callback: types.CallbackQuery):
    parts = callback.data.split(":")
    page = int(parts[-1])
    query = ":".join(parts[1:-1])
    await do_search(callback.message, query, page=page)
    await callback.answer()


@dp.message(F.text & ~F.text.startswith("/"))
async def handle_text_search(msg: types.Message, state: FSMContext):
    if msg.text in ["🛍 Каталог", "🛒 Кошик", "📞 Контакти", "🔍 Пошук"]:
        return
    if len(msg.text) < 2:
        return
    await do_search(msg, msg.text, page=0)


async def main():
    from handlers import cart as cart_handler, order as order_handler
    dp.include_router(cart_handler.router)
    dp.include_router(order_handler.router)
    print(f"[bot] @Liquimolli_bot запущений ✅")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())

