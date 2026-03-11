from sqlalchemy import String, Float, Integer, JSON, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from datetime import datetime
import enum


class OrderStatus(str, enum.Enum):
    new = "new"
    confirmed = "confirmed"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_name: Mapped[str] = mapped_column(String)
    customer_phone: Mapped[str] = mapped_column(String)
    customer_telegram_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    items: Mapped[list] = mapped_column(JSON)
    total_price: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String, default=OrderStatus.new)
    notes: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
