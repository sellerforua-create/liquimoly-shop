from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.product import Product

router = APIRouter()

@router.get("/")
async def get_products(
    db: AsyncSession = Depends(get_db),
    page: int = 1,
    limit: int = 20,
    category: str = None,
    search: str = None,
    min_price: float = None,
    max_price: float = None,
):
    query = select(Product).where(Product.available == True)
    if category:
        query = query.where(Product.category_name == category)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
    if min_price:
        query = query.where(Product.price >= min_price)
    if max_price:
        query = query.where(Product.price <= max_price)

    total = await db.scalar(select(func.count()).select_from(query.subquery()))
    result = await db.execute(query.offset((page - 1) * limit).limit(limit))
    products = result.scalars().all()

    return {"items": products, "total": total, "page": page, "pages": (total + limit - 1) // limit}

@router.get("/{product_id}")
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories/list")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product.category_name, func.count(Product.id))
        .where(Product.available == True)
        .group_by(Product.category_name)
        .order_by(func.count(Product.id).desc())
    )
    return [{"name": row[0], "count": row[1]} for row in result.all()]
