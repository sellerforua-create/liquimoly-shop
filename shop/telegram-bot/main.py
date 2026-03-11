"""
Telegram бот для дропшиппинг магазина.
Команды: /start, /catalog, /search, /cart, /order
"""
import asyncio
import os
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, ReplyKeyboardMarkup, KeyboardButton
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import httpx
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())


class OrderState(StatesGroup):
    waiting_name = State()
    waiting_phone = State()
    waiting_confirm = State()


# Главное меню
def main_menu():
    return ReplyKeyboardMarkup(keyboard=[
        [KeyboardButton(text="🛍 Каталог"), KeyboardButton(text="🔍 Поиск")],
        [KeyboardButton(text="🛒 Корзина"), KeyboardButton(text="📞 Контакты")],
    ], resize_keyboard=True)


@dp.message(Command("start"))
async def cmd_start(msg: types.Message):
    await msg.answer(
        f"👋 Привет, {msg.from_user.first_name}!\n\n"
        "Добро пожаловать в наш магазин автохимии Liqui Moly.\n"
        "Выберите что вас интересует:",
        reply_markup=main_menu()
    )


@dp.message(F.text == "🛍 Каталог")
async def catalog(msg: types.Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/categories/list")
        if r.status_code != 200:
            await msg.answer("Каталог временно недоступен.")
            return
        categories = r.json()

    if not categories:
        await msg.answer("Каталог пуст. Скоро добавим товары!")
        return

    buttons = []
    for cat in categories[:10]:  # максимум 10 категорий
        buttons.append([InlineKeyboardButton(
            text=f"{cat['name']} ({cat['count']})",
            callback_data=f"cat:{cat['name']}"
        )])

    await msg.answer("📦 Выберите категорию:", reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))


@dp.callback_query(F.data.startswith("cat:"))
async def show_category(callback: types.CallbackQuery):
    category = callback.data.split(":", 1)[1]
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/", params={"category": category, "limit": 5})
        if r.status_code != 200:
            await callback.answer("Ошибка загрузки")
            return
        data = r.json()

    items = data.get("items", [])
    if not items:
        await callback.message.answer("Товары не найдены.")
        return

    for product in items:
        text = (
            f"*{product['name']}*\n"
            f"💰 {product['price']} ₴\n"
            f"🏷 {product.get('vendor', '')}\n"
        )
        buttons = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text="🛒 В корзину", callback_data=f"add:{product['id']}"),
            InlineKeyboardButton(text="📋 Подробнее", callback_data=f"detail:{product['id']}")
        ]])
        if product.get("image_url"):
            await callback.message.answer_photo(product["image_url"], caption=text, parse_mode="Markdown", reply_markup=buttons)
        else:
            await callback.message.answer(text, parse_mode="Markdown", reply_markup=buttons)

    await callback.answer()


@dp.message(F.text == "🔍 Поиск")
async def search_prompt(msg: types.Message, state: FSMContext):
    await msg.answer("Введите название товара или артикул:")


@dp.message(F.text == "📞 Контакты")
async def contacts(msg: types.Message):
    await msg.answer(
        "📞 *Контакты*\n\n"
        "Telegram: @zero\\_scam\n"
        "Работаем: Пн-Пт 9:00-18:00\n\n"
        "По вопросам заказов пишите нам!",
        parse_mode="Markdown"
    )


@dp.message(F.text == "🛒 Корзина")
async def cart(msg: types.Message):
    # TODO: реализовать корзину через FSM/Redis
    await msg.answer("Корзина пока в разработке. Вы можете сделать заказ написав нам!")


async def main():
    print(f"[bot] Запуск бота...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
