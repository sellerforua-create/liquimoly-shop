"""Обране — збереження та перегляд улюблених товарів."""
from aiogram import Router, F, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import httpx, os

router = Router()
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")

# Обране в пам'яті: {user_id: {product_id: product_data}}
_favorites: dict[int, dict] = {}


def toggle_favorite(user_id: int, product_id: int, product_data: dict) -> bool:
    """Додає або видаляє з обраного. Повертає True якщо додано."""
    favs = _favorites.setdefault(user_id, {})
    if product_id in favs:
        del favs[product_id]
        return False
    else:
        favs[product_id] = product_data
        return True


def get_favorites(user_id: int) -> list:
    return list(_favorites.get(user_id, {}).values())


@router.message(Command("favorites"))
@router.message(F.text == "❤️ Обране")
async def show_favorites(msg: types.Message):
    items = get_favorites(msg.from_user.id)
    if not items:
        await msg.answer(
            "❤️ Обране порожнє.\n\n"
            "Натискайте ❤️ на товарах щоб зберігати їх тут!"
        )
        return

    await msg.answer(f"❤️ *Ваше обране ({len(items)} товарів):*", parse_mode="Markdown")
    for p in items:
        caption = f"*{p['name']}*\n💰 {p['price']} ₴"
        buttons = InlineKeyboardMarkup(inline_keyboard=[[
            InlineKeyboardButton(text="🛒 До кошика", callback_data=f"add:{p['id']}"),
            InlineKeyboardButton(text="💔 Видалити", callback_data=f"unfav:{p['id']}"),
        ]])
        if p.get("image_url"):
            try:
                await msg.answer_photo(p["image_url"], caption=caption, parse_mode="Markdown", reply_markup=buttons)
                continue
            except:
                pass
        await msg.answer(caption, parse_mode="Markdown", reply_markup=buttons)


@router.callback_query(F.data.startswith("fav:"))
async def add_favorite(callback: types.CallbackQuery):
    product_id = int(callback.data.split(":")[1])
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/{product_id}")
        if r.status_code != 200:
            await callback.answer("Помилка")
            return
        p = r.json()

    added = toggle_favorite(callback.from_user.id, product_id, p)
    if added:
        await callback.answer(f"❤️ Додано до обраного!")
    else:
        await callback.answer(f"💔 Видалено з обраного")


@router.callback_query(F.data.startswith("unfav:"))
async def remove_favorite(callback: types.CallbackQuery):
    product_id = int(callback.data.split(":")[1])
    toggle_favorite(callback.from_user.id, product_id, {})
    await callback.answer("💔 Видалено з обраного")
    await show_favorites(callback.message)
