from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from app.core.database import get_db, engine
from app.models.product import Product
import httpx
import xml.etree.ElementTree as ET
import os

router = APIRouter()

PRICE_MARKUP = float(os.getenv("PRICE_MARKUP", "20")) / 100
FEED_URL = "https://api.dropshipping.ua/api/feeds/3411.xml"

@router.post("/import")
async def trigger_import():
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.get(FEED_URL)

    root = ET.fromstring(resp.text)
    shop = root.find("shop")
    if shop is None:
        return {"error": "no shop element"}
    offers = shop.find("offers")
    if offers is None:
        return {"error": "no offers element"}

    rows = []
    for offer in offers.findall("offer"):
        ext_id = offer.get("id")
        name_el = offer.find("name")
        price_el = offer.find("price")
        if name_el is None or price_el is None:
            continue
        name = (name_el.text or "").replace("'", "''")
        try:
            supplier_price = float(price_el.text or 0)
        except:
            continue
        price = round(supplier_price * (1 + PRICE_MARKUP), 2)
        desc_el = offer.find("description")
        description = (desc_el.text or "").replace("'", "''") if desc_el is not None else ""
        cat_el = offer.find("categoryId")
        category = (cat_el.text or "").replace("'", "''") if cat_el is not None else ""
        vendor_el = offer.find("vendor")
        vendor = (vendor_el.text or "").replace("'", "''") if vendor_el is not None else ""
        pic_el = offer.find("picture")
        image_url = (pic_el.text or "").replace("'", "''") if pic_el is not None else ""
        avail = "true" if offer.get("available", "true") == "true" else "false"
        rows.append((ext_id, name, description, price, supplier_price, category, vendor, image_url, avail))

    async with engine.begin() as conn:
        for (ext_id, name, description, price, supplier_price, category, vendor, image_url, avail) in rows:
            await conn.execute(text("""
                INSERT INTO products (external_id, name, description, price, category_name, vendor, image_url, available, xml_feed_id)
                VALUES (:ext_id, :name, :desc, :price, :cat, :vendor, :img, :avail, 3411)
                ON CONFLICT (external_id) DO UPDATE SET
                    price = EXCLUDED.price,
                    available = EXCLUDED.available
            """), {
                "ext_id": ext_id, "name": name, "desc": description,
                "price": price, "cat": category,
                "vendor": vendor, "img": image_url, "avail": avail == "true"
            })

    return {"imported": len(rows)}

@router.get("/stats")
async def stats(db: AsyncSession = Depends(get_db)):
    count = await db.execute(select(func.count(Product.id)))
    return {"products": count.scalar()}
