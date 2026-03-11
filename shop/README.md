# Дропшиппинг магазин

## Структура проекта
- `backend/` — FastAPI API сервер
- `frontend/` — Next.js интернет-магазин  
- `telegram-bot/` — Telegram бот
- `scripts/` — Утилиты (импорт XML, синхронизация)
- `common/` — Общие типы и утилиты

## Запуск (локально)
```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev

# Bot
cd telegram-bot && python main.py
```

## Статус разработки
- [x] Структура проекта создана
- [ ] Модели БД
- [ ] XML импорт
- [ ] API endpoints
- [ ] Frontend
- [ ] Telegram бот
- [ ] Деплой
