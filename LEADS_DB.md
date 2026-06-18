# Leads Database

Заявки сохраняются в SQLite файл `data/leads.db`, который создаётся автоматически при первом запросе.

## Установка

```bash
npm install
# или если уже установлено
npm install better-sqlite3 @types/better-sqlite3
```

## Структура таблицы

```sql
CREATE TABLE leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  tour_id    TEXT NOT NULL,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT NOT NULL,
  locale     TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## API

### POST /api/leads
Сохраняет заявку в БД + отправляет email (если настроен SMTP).

Ответ: `{ ok: true, leadId: 1, sent: false, placeholder: true }`

### GET /api/leads?limit=100
Возвращает список заявок. **В продакшене добавить авторизацию!**

Ответ: `{ ok: true, total: 42, leads: [...] }`

## Просмотр базы вручную

```bash
sqlite3 data/leads.db
sqlite> SELECT * FROM leads ORDER BY created_at DESC;
sqlite> .quit
```
