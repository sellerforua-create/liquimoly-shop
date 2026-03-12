from aiogram import Router, F, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from services import cart as cart_service
import httpx, os

router = Router()
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")


@router.callback_query(F.data.startswith("add:"))
async def add_to_cart(callback: types.CallbackQuery):
    product_id = int(callback.data.split(":")[1])
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/products/{product_id}")
        if r.status_code != 200:
            await callback.answer("Ошибка загрузки товара")
            return
        p = r.json()
    cart_service.add_item(callback.from_user.id, p["id"], p["name"], p["price"])
    await callback.answer(f"✅ Добавлено: {p['name'][:30]}")


@router.message(F.text == "🛒 Корзина")
async def show_cart(msg: types.Message):
    items = cart_service.get_cart(msg.from_user.id)
    if not items:
        await msg.answer("Корзина пуста. Перейдите в каталог и добавьте товары!")
        return

    text = "🛒 *Ваша корзина:*\n\n"
    buttons = []
    for item in items:
        text += f"• {item.name[:40]} — {item.price}₴ x{item.quantity}\n"
        buttons.append([InlineKeyboardButton(
            text=f"❌ Убрать {item.name[:20]}",
            callback_data=f"remove:{item.product_id}"
        )])

    total = cart_service.get_total(msg.from_user.id)
    text += f"\n💰 *Итого: {total:.2f}₴*"
    buttons.append([InlineKeyboardButton(text="✅ Оформить заказ", callback_data="checkout")])
    buttons.append([InlineKeyboardButton(text="🗑 Очистить корзину", callback_data="clear_cart")])

    await msg.answer(text, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup(inline_keyboard=buttons))


@router.callback_query(F.data.startswith("remove:"))
async def remove_from_cart(callback: types.CallbackQuery):
    product_id = int(callback.data.split(":")[1])
    cart_service.remove_item(callback.from_user.id, product_id)
    await callback.answer("Товар удалён")
    await show_cart(callback.message)


@router.callback_query(F.data == "clear_cart")
async def clear_cart(callback: types.CallbackQuery):
    cart_service.clear_cart(callback.from_user.id)
    await callback.message.edit_text("Корзина очищена.")
