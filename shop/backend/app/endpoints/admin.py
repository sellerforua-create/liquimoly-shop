from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db, engine
from app.models.product import Product
import httpx
import xml.etree.ElementTree as ET
import os
import asyncio

router = APIRouter()

PRICE_MARKUP = float(os.getenv("PRICE_MARKUP", "20")) / 100
XML_FEEDS = [
    {"id": 3411, "url": "https://api.dropshipping.ua/api/feeds/3411.xml"},
]

@router.post("/import")
async def trigger_import():
    async with engine.begin() as conn:
        # ensure table exists
        from app.core.database import Base
        await conn.run_sync(Base.metadata.create_all)

    async with httpx.AsyncClient(timeout=120) as client:
        total = 0
        for feed in XML_FEEDS:
            resp = await client.get(feed["url"])
            root = ET.fromstring(resp.text)
            shop = root.find("shop")
            if shop is None:
                continue
            offers = shop.find("offers")
            if offers is None:
                continue

            from sqlalchemy.ext.asyncio import AsyncSession
            from app.core.database import async_session

            async with async_session() as db:
                for offer in offers.findall("offer"):
                    ext_id = offer.get("id")
                    name_el = offer.find("name")
                    price_el = offer.find("price")
                    if name_el is None or price_el is None:
                        continue
                    name = name_el.text or ""
                    try:
                        supplier_price = float(price_el.text or 0)
                    except:
                        continue
                    price = round(supplier_price * (1 + PRICE_MARKUP), 2)
                    desc_el = offer.find("description")
                    description = desc_el.text if desc_el is not None else None
                    cat_el = offer.find("categoryId")
                    category = cat_el.text if cat_el is not None else None
                    vendor_el = offer.find("vendor")
                    vendor = vendor_el.text if vendor_el is not None else None
                    pic_el = offer.find("picture")
                    image_url = pic_el.text if pic_el is not None else None
                    avail = offer.get("available", "true") == "true"

                    existing = await db.execute(select(Product).where(Product.external_id == ext_id))
                    existing = existing.scalar_one_or_none()
                    if existing:
                        existing.price = price
                        existing.supplier_price = supplier_price
                        existing.available = avail
                    else:
                        db.add(Product(
                            external_id=ext_id,
                            name=name,
                            description=description,
                            price=price,
                            supplier_price=supplier_price,
                            old_price=None,
                            category_name=category,
                            vendor=vendor,
                            image_url=image_url,
                            available=avail,
                            xml_feed_id=feed["id"],
                        ))
                    total += 1
                await db.commit()

    return {"imported": total}

@router.get("/stats")
async def stats(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import func
    count = await db.execute(select(func.count(Product.id)))
    return {"products": count.scalar()}
