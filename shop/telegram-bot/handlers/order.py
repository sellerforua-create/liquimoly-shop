from aiogram import Router, F, types, Bot
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from services import cart as cart_service
import httpx, os

router = Router()
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))
BOT_TOKEN = os.getenv("BOT_TOKEN")


class OrderFSM(StatesGroup):
    waiting_name = State()
    waiting_phone = State()
    waiting_confirm = State()


@router.callback_query(F.data == "checkout")
async def start_order(callback: types.CallbackQuery, state: FSMContext):
    items = cart_service.get_cart(callback.from_user.id)
    if not items:
        await callback.answer("Кошик порожній!")
        return
    await state.set_state(OrderFSM.waiting_name)
    await callback.message.answer(
        "📝 Введіть ваше *прізвище та ім'я:*\n\nНаприклад: Іваненко Іван",
        parse_mode="Markdown"
    )


@router.message(OrderFSM.waiting_name)
async def got_name(msg: types.Message, state: FSMContext):
    await state.update_data(name=msg.text)
    await state.set_state(OrderFSM.waiting_phone)
    await msg.answer(
        "📞 Введіть номер телефону:\n\nФормат: *+380XXXXXXXXX*",
        parse_mode="Markdown"
    )


@router.message(OrderFSM.waiting_phone)
async def got_phone(msg: types.Message, state: FSMContext):
    phone = msg.text.strip()
    # Валідація
    digits = phone.replace("+", "").replace(" ", "").replace("-", "")
    if not digits.isdigit() or len(digits) < 10:
        await msg.answer("⚠️ Невірний формат. Введіть номер у форматі *+380XXXXXXXXX*", parse_mode="Markdown")
        return

    await state.update_data(phone=phone)
    data = await state.get_data()
    items = cart_service.get_cart(msg.from_user.id)
    total = cart_service.get_total(msg.from_user.id)

    summary = "\n".join([f"  • {i.name[:40]}\n    {i.quantity} шт × {i.price:.0f}₴ = {i.price*i.quantity:.0f}₴" for i in items])
    text = (
        f"📋 *Підтвердіть замовлення:*\n\n"
        f"👤 {data['name']}\n"
        f"📞 {data['phone']}\n\n"
        f"🛒 *Товари:*\n{summary}\n\n"
        f"💰 *Разом: {total:.0f}₴*"
    )
    buttons = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Підтвердити", callback_data="confirm_order")],
        [InlineKeyboardButton(text="❌ Скасувати", callback_data="cancel_order")],
    ])
    await state.set_state(OrderFSM.waiting_confirm)
    await msg.answer(text, parse_mode="Markdown", reply_markup=buttons)


@router.callback_query(F.data == "confirm_order", OrderFSM.waiting_confirm)
async def confirm_order(callback: types.CallbackQuery, state: FSMContext):
    data = await state.get_data()
    items = cart_service.get_cart(callback.from_user.id)
    total = cart_service.get_total(callback.from_user.id)
    user = callback.from_user

    order_data = {
        "customer_name": data["name"],
        "customer_phone": data["phone"],
        "customer_telegram_id": user.id,
        "items": [{"product_id": i.product_id, "product_name": i.name, "price": i.price, "quantity": i.quantity} for i in items],
    }

    async with httpx.AsyncClient() as client:
        r = await client.post(f"{API_URL}/api/orders/", json=order_data)

    if r.status_code == 200:
        order = r.json()
        cart_service.clear_cart(callback.from_user.id)

        # Повідомлення клієнту
        await callback.message.answer(
            f"🎉 *Замовлення #{order['id']} прийнято!*\n\n"
            f"Ми зв'яжемось з вами найближчим часом для підтвердження.\n"
            f"Доставка Nova Poshta — 1-2 дні по Україні 🚚\n\n"
            f"Дякуємо за покупку! 🙏",
            parse_mode="Markdown"
        )

        # Повідомлення адміну 🔔
        summary = "\n".join([f"• {i.name[:45]} ×{i.quantity} = {i.price*i.quantity:.0f}₴" for i in items])
        tg_link = f"@{user.username}" if user.username else f"tg://user?id={user.id}"
        admin_text = (
            f"🛒 *НОВЕ ЗАМОВЛЕННЯ #{order['id']}*\n\n"
            f"👤 {data['name']}\n"
            f"📞 {data['phone']}\n"
            f"💬 Telegram: {tg_link}\n\n"
            f"📦 *Товари:*\n{summary}\n\n"
            f"💰 *Сума: {total:.0f}₴*"
        )
        try:
            bot = Bot(token=BOT_TOKEN)
            await bot.send_message(ADMIN_ID, admin_text, parse_mode="Markdown")
            await bot.session.close()
        except Exception as e:
            print(f"[admin notify] error: {e}")
    else:
        await callback.message.answer("❌ Помилка при оформленні замовлення. Спробуйте пізніше.")

    await state.clear()


@router.callback_query(F.data == "cancel_order")
async def cancel_order(callback: types.CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.answer("Замовлення скасовано. Кошик збережено.")
