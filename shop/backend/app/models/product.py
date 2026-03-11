from sqlalchemy import String, Float, Integer, Boolean, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from datetime import datetime


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    external_id: Mapped[str] = mapped_column(String, index=True, nullable=True)
    name: Mapped[str] = mapped_column(String, index=True)
    description: Mapped[str | None] = mapped_column(String, nullable=True)
    price: Mapped[float] = mapped_column(Float)
    old_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String, default="UAH")
    category_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    category_name: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    vendor: Mapped[str | None] = mapped_column(String, nullable=True)
    vendor_code: Mapped[str | None] = mapped_column(String, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String, nullable=True)
    images: Mapped[list | None] = mapped_column(JSON, nullable=True)
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    xml_feed_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
