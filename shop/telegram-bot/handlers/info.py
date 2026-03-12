"""Команди допомоги та інформації."""
from aiogram import Router, F, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import httpx, os

router = Router()
API_URL = os.getenv("NEXT_PUBLIC_API_URL", "http://localhost:8000")
ADMIN_ID = int(os.getenv("ADMIN_CHAT_ID", "455255915"))

# Зберігаємо ID всіх користувачів для розсилки
_users: set[int] = set()

def register_user(user_id: int):
    _users.add(user_id)

def get_all_users() -> list[int]:
    return list(_users)


@router.message(Command("help"))
async def cmd_help(msg: types.Message):
    register_user(msg.from_user.id)
    await msg.answer(
        "ℹ️ *Як користуватись магазином:*\n\n"
        "🛍 *Каталог* — перегляд всіх товарів по категоріях\n"
        "🔍 *Пошук* — знайти товар за назвою або артикулом\n"
        "🛒 *Кошик* — ваші вибрані товари\n"
        "❤️ *Обране* — збережені товари\n\n"
        "*Команди:*\n"
        "/start — головне меню\n"
        "/help — ця довідка\n"
        "/favorites — мої збережені товари\n"
        "/orders — мої замовлення\n\n"
        "📞 *Питання?* Пишіть нам — відповімо швидко!",
        parse_mode="Markdown"
    )


@router.message(Command("orders"))
async def cmd_orders(msg: types.Message):
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/api/orders/", params={"telegram_id": msg.from_user.id})
        if r.status_code != 200:
            await msg.answer("Не вдалось завантажити замовлення.")
            return
        orders = r.json()

    if not orders:
        await msg.answer("У вас ще немає замовлень.\n\nПерейдіть в 🛍 Каталог щоб зробити перше замовлення!")
        return

    text = "📦 *Ваші замовлення:*\n\n"
    for o in orders[-5:]:  # останні 5
        status_emoji = {"new": "🆕", "confirmed": "✅", "shipped": "🚚", "done": "✔️", "cancelled": "❌"}.get(o.get("status","new"), "🆕")
        text += f"{status_emoji} Замовлення #{o['id']} — {o.get('total_price', '?')}₴\n"
        text += f"   {o.get('created_at','')[:10]}\n\n"

    await msg.answer(text, parse_mode="Markdown")
