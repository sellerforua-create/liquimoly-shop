"""
XML/YML импортёр товаров от dropshipping.ua → PostgreSQL
Запуск: python import_xml.py
"""
import asyncio
import httpx
import xml.etree.ElementTree as ET
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, update
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import String, Float, Integer, Boolean, JSON, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from dotenv import load_dotenv
import os
import sys

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/shop_db")
PRICE_MARKUP = float(os.getenv("PRICE_MARKUP", "30")) / 100  # наценка в долях

XML_FEEDS = [
    {"id": 3410, "url": "https://api.dropshipping.ua/api/feeds/3410.xml", "name": "9921"},
    {"id": 3411, "url": "https://api.dropshipping.ua/api/feeds/3411.xml", "name": "liqui_moly"},
    {"id": 3412, "url": "https://api.dropshipping.ua/api/feeds/3412.xml", "name": "feed_1"},
    {"id": 3413, "url": "https://api.dropshipping.ua/api/feeds/3413.xml", "name": "sto"},
]

engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    external_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
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


def parse_yml(xml_content: str, feed_id: int, categories: dict) -> list[dict]:
    root = ET.fromstring(xml_content)
    shop = root.find("shop")
    if shop is None:
        return []

    # Парсим категории
    for cat in shop.findall(".//category"):
        cat_id = cat.get("id")
        if cat_id:
            categories[cat_id] = cat.text or ""

    products = []
    for offer in shop.findall(".//offer"):
        offer_id = offer.get("id")
        available = offer.get("available", "true").lower() != "false"

        name = offer.findtext("name") or ""
        description = offer.findtext("description") or ""
        vendor = offer.findtext("vendor") or ""
        vendor_code = offer.findtext("vendorCode") or ""
        picture = offer.findtext("picture") or ""
        category_id = offer.findtext("categoryId") or ""
        currency_id = offer.findtext("currencyId") or "UAH"

        try:
            supplier_price = float(offer.findtext("price") or 0)
            price = round(supplier_price * (1 + PRICE_MARKUP), 2)
        except ValueError:
            price = 0.0

        # Все картинки
        images = [p.text for p in offer.findall("picture") if p.text]

        products.append({
            "external_id": offer_id,
            "name": name,
            "description": description,
            "price": price,
            "old_price": None,
            "currency": currency_id,
            "category_id": int(category_id) if category_id.isdigit() else None,
            "category_name": categories.get(category_id, ""),
            "vendor": vendor,
            "vendor_code": vendor_code,
            "image_url": picture,
            "images": images,
            "available": available,
            "xml_feed_id": feed_id,
        })

    return products


async def import_feed(feed: dict, session: AsyncSession):
    print(f"[import] Скачиваю фид {feed['name']} ({feed['url']})...")
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.get(feed["url"])
        r.raise_for_status()
        xml_content = r.text

    categories = {}
    products = parse_yml(xml_content, feed["id"], categories)
    print(f"[import] Найдено {len(products)} товаров в {feed['name']}")

    added = updated = 0
    for p in products:
        # Проверяем есть ли уже товар
        result = await session.execute(
            select(Product).where(
                Product.external_id == p["external_id"],
                Product.xml_feed_id == p["xml_feed_id"]
            )
        )
        existing = result.scalar_one_or_none()

        if existing:
            # Обновляем цену и наличие
            existing.price = p["price"]
            existing.available = p["available"]
            existing.image_url = p["image_url"]
            updated += 1
        else:
            session.add(Product(**p))
            added += 1

    await session.commit()
    print(f"[import] {feed['name']}: добавлено {added}, обновлено {updated}")
    return added, updated


async def main():
    print("[import] Создаём таблицы если нет...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Импортируем конкретный фид или все
    feed_id = int(sys.argv[1]) if len(sys.argv) > 1 else None
    feeds = [f for f in XML_FEEDS if feed_id is None or f["id"] == feed_id]

    total_added = total_updated = 0
    async with SessionLocal() as session:
        for feed in feeds:
            added, updated = await import_feed(feed, session)
            total_added += added
            total_updated += updated

    print(f"\n✅ Импорт завершён: добавлено {total_added}, обновлено {total_updated}")


if __name__ == "__main__":
    asyncio.run(main())
