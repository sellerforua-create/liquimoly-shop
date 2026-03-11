from aiogram import Router, F, types
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from telegram_bot.services import cart as cart_service
import httpx, os

router = Router()
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))


class OrderFSM(StatesGroup):
    waiting_name = State()
    waiting_phone = State()
    waiting_confirm = State()


@router.callback_query(F.data == "checkout")
async def start_order(callback: types.CallbackQuery, state: FSMContext):
    items = cart_service.get_cart(callback.from_user.id)
    if not items:
        await callback.answer("Корзина пуста!")
        return
    await state.set_state(OrderFSM.waiting_name)
    await callback.message.answer("📝 Введите ваше имя:")


@router.message(OrderFSM.waiting_name)
async def got_name(msg: types.Message, state: FSMContext):
    await state.update_data(name=msg.text)
    await state.set_state(OrderFSM.waiting_phone)
    await msg.answer("📞 Введите номер телефона (например: +380501234567):")


@router.message(OrderFSM.waiting_phone)
async def got_phone(msg: types.Message, state: FSMContext):
    await state.update_data(phone=msg.text)
    data = await state.get_data()
    items = cart_service.get_cart(msg.from_user.id)
    total = cart_service.get_total(msg.from_user.id)

    summary = "\n".join([f"• {i.name[:40]} x{i.quantity} — {i.price*i.quantity:.2f}₴" for i in items])
    text = (
        f"📋 *Подтвердите заказ:*\n\n"
        f"👤 {data['name']}\n"
        f"📞 {data['phone']}\n\n"
        f"{summary}\n\n"
        f"💰 *Итого: {total:.2f}₴*"
    )
    buttons = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Подтвердить", callback_data="confirm_order")],
        [InlineKeyboardButton(text="❌ Отмена", callback_data="cancel_order")],
    ])
    await state.set_state(OrderFSM.waiting_confirm)
    await msg.answer(text, parse_mode="Markdown", reply_markup=buttons)


@router.callback_query(F.data == "confirm_order", OrderFSM.waiting_confirm)
async def confirm_order(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    items = cart_service.get_cart(callback.from_user.id)
    total = cart_service.get_total(callback.from_user.id)

    order_data = {
        "customer_name": data["name"],
        "customer_phone": data["phone"],
        "customer_telegram_id": callback.from_user.id,
        "items": [{"product_id": i.product_id, "product_name": i.name, "price": i.price, "quantity": i.quantity} for i in items],
    }

    async with httpx.AsyncClient() as client:
        r = await client.post(f"{API_URL}/api/orders/", json=order_data)

    if r.status_code == 200:
        order = r.json()
        cart_service.clear_cart(callback.from_user.id)
        await callback.message.answer(
            f"✅ *Заказ #{order['id']} оформлен!*\n\n"
            f"Мы свяжемся с вами по номеру {data['phone']}.\n"
            f"Спасибо за покупку! 🙏",
            parse_mode="Markdown"
        )
    else:
        await callback.message.answer("❌ Ошибка при оформлении заказа. Попробуйте позже.")

    await state.clear()


@router.callback_query(F.data == "cancel_order")
async def cancel_order(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.answer("Заказ отменён.")
