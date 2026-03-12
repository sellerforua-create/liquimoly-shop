"""Адмін-панель: розсилка, статистика, замовлення."""
from aiogram import Router, F, types, Bot
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from handlers.info import get_all_users
import httpx, os

router = Router()
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))
BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")


def is_admin(user_id: int) -> bool:
    return user_id == ADMIN_ID


class BroadcastFSM(StatesGroup):
    waiting_message = State()


@router.message(Command("admin"))
async def admin_panel(msg: types.Message):
    if not is_admin(msg.from_user.id):
        return
    users = get_all_users()
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/orders/")
        orders_count = len(r.json()) if r.status_code == 200 else "?"

    await msg.answer(
        f"🔧 *Адмін-панель*\n\n"
        f"👥 Користувачів: {len(users)}\n"
        f"📦 Замовлень: {orders_count}\n\n"
        f"Команди:\n"
        f"/broadcast — розсилка всім користувачам\n"
        f"/orders\\_list — список замовлень",
        parse_mode="Markdown"
    )


@router.message(Command("broadcast"))
async def start_broadcast(msg: types.Message, state: FSMContext):
    if not is_admin(msg.from_user.id):
        return
    users = get_all_users()
    await state.set_state(BroadcastFSM.waiting_message)
    await msg.answer(
        f"📢 Введіть текст розсилки.\n"
        f"Буде надіслано *{len(users)}* користувачам.\n\n"
        f"Підтримується Markdown форматування.",
        parse_mode="Markdown"
    )


@router.message(BroadcastFSM.waiting_message)
async def do_broadcast(msg: types.Message, state: FSMContext):
    if not is_admin(msg.from_user.id):
        return
    await state.clear()
    users = get_all_users()

    if not users:
        await msg.answer("Немає користувачів для розсилки.")
        return

    bot = Bot(token=BOT_TOKEN)
    sent = 0
    failed = 0
    status_msg = await msg.answer(f"⏳ Відправляю... 0/{len(users)}")

    for i, user_id in enumerate(users):
        try:
            await bot.send_message(user_id, msg.text, parse_mode="Markdown")
            sent += 1
        except:
            failed += 1
        if (i + 1) % 10 == 0:
            await status_msg.edit_text(f"⏳ Відправляю... {i+1}/{len(users)}")

    await bot.session.close()
    await status_msg.edit_text(
        f"✅ Розсилка завершена!\n"
        f"📨 Відправлено: {sent}\n"
        f"❌ Помилок: {failed}"
    )


@router.message(Command("orders_list"))
async def orders_list(msg: types.Message):
    if not is_admin(msg.from_user.id):
        return
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/orders/")
        if r.status_code != 200:
            await msg.answer("Помилка завантаження замовлень.")
            return
        orders = r.json()

    if not orders:
        await msg.answer("Замовлень ще немає.")
        return

    text = f"📦 *Останні замовлення ({len(orders)}):*\n\n"
    for o in orders[-10:]:
        text += f"#{o['id']} | {o.get('customer_name','?')} | {o.get('customer_phone','?')} | {o.get('total_price','?')}₴\n"

    await msg.answer(text, parse_mode="Markdown")
