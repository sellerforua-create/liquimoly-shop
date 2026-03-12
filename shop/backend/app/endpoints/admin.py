from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.core.database import get_db, engine
import httpx
import xml.etree.ElementTree as ET
import os

router = APIRouter()

PRICE_MARKUP = float(os.getenv("PRICE_MARKUP", "20")) / 100
FEED_URL = "https://api.dropshipping.ua/api/feeds/3411.xml"


@router.post("/import")
async def trigger_import():
    """Download XML feed and insert all products into DB."""

    # 1. Fetch XML
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.get(FEED_URL)

    root = ET.fromstring(resp.text)
    shop = root.find("shop")
    if shop is None:
        return {"error": "no <shop> element in XML"}
    offers_el = shop.find("offers")
    if offers_el is None:
        return {"error": "no <offers> element in XML"}

    # 2. Parse offers
    offers = offers_el.findall("offer")
    if not offers:
        return {"error": "0 offers found"}

    # 3. Drop and recreate table to avoid schema mismatch
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS products CASCADE"))
        await conn.execute(text("""
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                external_id VARCHAR(255),
                name TEXT NOT NULL,
                description TEXT,
                price FLOAT NOT NULL,
                old_price FLOAT,
                supplier_price FLOAT,
                currency VARCHAR(10) DEFAULT 'UAH',
                category_id INTEGER,
                category_name VARCHAR(255),
                vendor VARCHAR(255),
                vendor_code VARCHAR(255),
                image_url TEXT,
                images JSONB,
                available BOOLEAN DEFAULT true,
                xml_feed_id INTEGER,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        """))

    # 4. Insert products
    inserted = 0
    async with engine.begin() as conn:
        for offer in offers:
            ext_id = offer.get("id", "")
            name_el = offer.find("name")
            price_el = offer.find("price")
            if name_el is None or price_el is None:
                continue
            name = name_el.text or ""
            try:
                supplier_price = float(price_el.text or 0)
            except (ValueError, TypeError):
                continue
            price = round(supplier_price * (1 + PRICE_MARKUP), 2)

            desc = ""
            d = offer.find("description")
            if d is not None and d.text:
                desc = d.text

            category = ""
            c = offer.find("categoryId")
            if c is not None and c.text:
                category = c.text

            vendor = ""
            v = offer.find("vendor")
            if v is not None and v.text:
                vendor = v.text

            image_url = ""
            p = offer.find("picture")
            if p is not None and p.text:
                image_url = p.text

            avail = offer.get("available", "true") == "true"

            await conn.execute(text(
                "INSERT INTO products "
                "(external_id, name, description, price, supplier_price, "
                "category_name, vendor, image_url, available, xml_feed_id, currency) "
                "VALUES (:eid, :name, :desc, :price, :sp, :cat, :ven, :img, :avail, 3411, 'UAH')"
            ), {
                "eid": ext_id, "name": name, "desc": desc,
                "price": price, "sp": supplier_price,
                "cat": category, "ven": vendor, "img": image_url,
                "avail": avail,
            })
            inserted += 1

    return {"imported": inserted}


@router.get("/stats")
async def stats():
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT COUNT(*) FROM products"))
        count = result.scalar()
    return {"products": count}
