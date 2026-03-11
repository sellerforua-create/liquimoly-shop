"""Простая корзина в памяти (по user_id)."""
from dataclasses import dataclass, field
from typing import Dict, List

@dataclass
class CartItem:
    product_id: int
    name: str
    price: float
    quantity: int = 1

_carts: Dict[int, List[CartItem]] = {}

def add_item(user_id: int, product_id: int, name: str, price: float):
    cart = _carts.setdefault(user_id, [])
    for item in cart:
        if item.product_id == product_id:
            item.quantity += 1
            return
    cart.append(CartItem(product_id, name, price))

def remove_item(user_id: int, product_id: int):
    cart = _carts.get(user_id, [])
    _carts[user_id] = [i for i in cart if i.product_id != product_id]

def get_cart(user_id: int) -> List[CartItem]:
    return _carts.get(user_id, [])

def clear_cart(user_id: int):
    _carts[user_id] = []

def get_total(user_id: int) -> float:
    return sum(i.price * i.quantity for i in get_cart(user_id))
