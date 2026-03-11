from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.order import Order
from pydantic import BaseModel
from typing import List
import os
import httpx

router = APIRouter()

class OrderItem(BaseModel):
    product_id: int
    product_name: str
    price: float
    quantity: int = 1

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_telegram_id: int | None = None
    items: List[OrderItem]
    notes: str | None = None

@router.post("/")
async def create_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)):
    total = sum(item.price * item.quantity for item in order_data.items)
    order = Order(
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_telegram_id=order_data.customer_telegram_id,
        items=[item.dict() for item in order_data.items],
        total_price=total,
        notes=order_data.notes,
        status="new"
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Уведомление в Telegram
    await notify_admin(order)
    return order

async def notify_admin(order: Order):
    bot_token = os.getenv("BOT_TOKEN")
    admin_id = os.getenv("ADMIN_CHAT_ID", "455255915")
    if not bot_token:
        return
    items_text = "\n".join([f"• {i['product_name']} x{i['quantity']} — {i['price']}₴" for i in order.items])
    text = (
        f"🛒 Новый заказ #{order.id}\n"
        f"👤 {order.customer_name}\n"
        f"📞 {order.customer_phone}\n"
        f"📦 Товары:\n{items_text}\n"
        f"💰 Итого: {order.total_price}₴\n"
        f"📝 {order.notes or '—'}"
    )
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://api.telegram.org/bot{bot_token}/sendMessage",
            json={"chat_id": admin_id, "text": text}
        )

@router.get("/")
async def get_orders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).order_by(Order.created_at.desc()).limit(50))
    return result.scalars().all()
