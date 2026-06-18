# Climatour

**Climatour** — веб-сайт для поиска туров с погодной фильтрацией. Пользователь выбирает даты, бюджет и сценарий отдыха, а сайт показывает направления с реальным прогнозом погоды и понятным выводом о комфорте поездки.

## Возможности

- Каталог туров по 6 направлениям: Анталья, Дубай, Шарм-эль-Шейх, Бали, Сочи и Пхукет.
- Поиск и фильтрация по направлению, датам, бюджету и сценарию отдыха: пляж, прогулки, экскурсии, семья.
- Погодные фильтры по температуре, вероятности дождя и силе ветра.
- Погодная рекомендация для выбранного сценария: оценка комфорта, причины, предупреждения и советы по сборам.
- Реальный прогноз через [Open-Meteo API](https://open-meteo.com/) на детальной странице тура, с fallback на моковые данные.
- Прогноз на 5 дней, текущая погода, средние метрики по температуре, дождю, ветру и влажности.
- Сравнение до 3 туров в таблице.
- Детальная страница тура с описанием отеля, включенными услугами, лучшим сезоном и погодным выводом.
- Форма заявки с валидацией телефона и email: заявка сохраняется в SQLite и при настройке SMTP отправляется на email.
- API для создания и просмотра заявок.
- Поддержка двух языков: русский и английский.

## Стек

- **Next.js 16.x** (App Router, `^16.0.0`)
- **React 19.2.x** и **React DOM 19.2.x**
- **TypeScript 5.9.x**
- **ESLint 9.39.x** + **eslint-config-next 16.x**
- **better-sqlite3 12.11.x** — локальная SQLite-база заявок
- **Nodemailer 7.0.x** — отправка email при новой заявке
- **Open-Meteo** — погодное API без ключа

## Системные требования

- **Node.js >= 20.9.0** — минимальная версия для Next.js 16. Локально проект также запускается на Node.js `v26.0.0`.
- **npm** — в проекте зафиксирован `package-lock.json`, поэтому для воспроизводимой установки используйте `npm install` или `npm ci`.
- **SQLite** не нужно устанавливать отдельно для работы приложения: база создаётся через `better-sqlite3`. CLI `sqlite3` нужен только для ручного просмотра файла `data/leads.db`.
- **Нативная сборка для better-sqlite3** обычно не требуется, потому что пакет ставит готовые бинарники. Если для вашей платформы бинарника нет, понадобятся стандартные build tools: Python, `make` и C/C++ compiler.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл окружения
cp .env.example .env.local
# Заполнить переменные (см. раздел ниже)

# 3. Запустить в режиме разработки
npm run dev
```

Сайт откроется на [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните значения:

```env
# SMTP для отправки заявок (Gmail)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # App Password, не пароль аккаунта
LEADS_FROM_EMAIL=your@gmail.com
LEADS_TO_EMAIL=manager@example.com       # Куда приходят заявки

# Погодные пороги для рекомендаций (можно оставить по умолчанию)
NEXT_PUBLIC_WEATHER_BEACH_MIN_TEMP=24
NEXT_PUBLIC_WEATHER_BEACH_MAX_TEMP=31
NEXT_PUBLIC_WEATHER_WALK_MIN_TEMP=16
NEXT_PUBLIC_WEATHER_WALK_MAX_TEMP=27
NEXT_PUBLIC_WEATHER_EXCURSION_MIN_TEMP=18
NEXT_PUBLIC_WEATHER_EXCURSION_MAX_TEMP=26
NEXT_PUBLIC_WEATHER_FAMILY_MIN_TEMP=22
NEXT_PUBLIC_WEATHER_FAMILY_MAX_TEMP=28
NEXT_PUBLIC_WEATHER_MAX_RAIN_PROBABILITY=35
NEXT_PUBLIC_WEATHER_MAX_WIND_SPEED=9
NEXT_PUBLIC_WEATHER_MAX_HUMIDITY=75
```

> **Gmail App Password:** в аккаунте Google включите двухфакторную аутентификацию, затем создайте App Password в разделе «Безопасность» → «Пароли приложений».

## Структура проекта

```
climatour/
├── app/
│   ├── layout.tsx            # Корневой лейаут
│   ├── page.tsx              # Главная страница
│   ├── tours/[id]/page.tsx   # Страница тура
│   └── api/leads/route.ts    # API: сохранение и получение заявок
├── components/
│   ├── HomePage.tsx          # Главный UI: фильтры + список туров
│   ├── TourCard.tsx          # Карточка тура
│   ├── ComparisonTable.tsx   # Таблица сравнения
│   ├── ForecastStrip.tsx     # Прогноз на 5 дней
│   ├── WeatherBadge.tsx      # Бейдж с погодой
│   ├── LeadForm.tsx          # Форма заявки
│   └── LanguageSwitcher.tsx  # Переключатель RU/EN
├── data/
│   ├── destinations.ts       # Данные о направлениях (координаты, описания)
│   ├── mockTours.ts          # Туры (моковые данные)
│   └── mockWeather.ts        # Погода (моковые данные для разработки)
├── lib/
│   ├── weather/
│   │   ├── openmeteo.ts      # Запросы к Open-Meteo API
│   │   ├── recommendation.ts # Логика погодных рекомендаций
│   │   └── config.ts         # Пороговые значения погоды
│   ├── email/
│   │   └── sendLeadEmail.ts  # Отправка email через Nodemailer
│   ├── db/
│   │   └── leads.ts          # Работа с SQLite (better-sqlite3)
│   └── i18n/
│       └── dictionaries.ts   # Переводы RU/EN
├── types/
│   └── travel.ts             # TypeScript-типы
├── public/
│   ├── destinations/         # Фото направлений
│   └── fonts/                # Шрифты Gropled и Ziyad Askar
├── .env.example
├── ASSET_ATTRIBUTION.md      # Лицензии на фото
└── LEADS_DB.md               # Документация по базе заявок
```

## База данных заявок

Заявки сохраняются в `data/leads.db` (SQLite), файл создаётся автоматически при первом запросе.

**API:**

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/leads` | Создать заявку |
| `GET` | `/api/leads?limit=100` | Получить список заявок |

> ⚠️ Эндпоинт `GET /api/leads` не защищён авторизацией — добавьте её перед деплоем в продакшен.

Просмотр базы вручную:

```bash
sqlite3 data/leads.db "SELECT * FROM leads ORDER BY created_at DESC;"
```

## Команды

```bash
npm run dev        # Режим разработки
npm run build      # Продакшен-сборка
npm run start      # Запуск продакшен-сервера
npm run lint       # ESLint
npm run typecheck  # Проверка типов TypeScript
```

## Направления

На сайте представлены 6 направлений: Анталья, Дубай, Шарм-эль-Шейх, Бали, Сочи, Пхукет.

## Лицензии на фотографии

Фотографии направлений взяты с Wikimedia Commons. Полный список авторов и лицензий — в файле [`ASSET_ATTRIBUTION.md`](./ASSET_ATTRIBUTION.md).
