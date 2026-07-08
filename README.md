# RSS агрегатор

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pavel4991_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pavel4991_frontend-project-11)
[![Actions Status](https://github.com/Pavel4991/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pavel4991/frontend-project-11/actions)

**RSS агрегатор** — веб-приложение для чтения RSS-лент с автоматическим обновлением постов. Проект выполнен в рамках обучения на платформе [Hexlet](https://hexlet.io).

🔗 **[Демо](https://frontend-project-11-sable-one.vercel.app/)**

---

## Возможности

- 📥 **Добавление RSS-лент** — добавление фидов по URL
- 🔄 **Автообновление** — новые посты появляются каждые 5 секунд без перезагрузки
- 👁️ **Отметка прочитанного** — просмотренные посты выделяются визуально
- 🪟 **Просмотр постов** — детальный просмотр в модальном окне
- ✅ **Валидация URL** — проверка на пустую строку, невалидный адрес и дубликат
- 🌐 **Локализация** — интерфейс на русском языке
- 📱 **Адаптивный дизайн** — Bootstrap 5

---

## Технологии

| Технология | Назначение |
|---|---|
| **Vite** | Сборка |
| **Bootstrap 5** | UI-компоненты |
| **Valtio** | Реактивное состояние |
| **i18next** | Интернационализация |
| **Axios** | HTTP-запросы |
| **Yup** | Валидация форм |
| **ESLint / Stylelint** | Линтеры |

---

## Установка и запуск

```bash
# Установка зависимостей
make install

# Режим разработки
npm run dev

# Сборка под production
npm run build
```

---

## Команды

| Команда | Описание |
|---|---|
| `make install` | Установка зависимостей |
| `make lint` | Проверка линтером |
| `npm run dev` | Режим разработки (Vite HMR) |
| `npm run build` | Сборка под production |

---

## Структура проекта

```
frontend-project-11/
├── src/
│   ├── main.js              # Точка входа
│   ├── styles/              # Стили (Bootstrap)
│   ├── locales/             # Переводы (i18next)
│   └── scripts/
│       ├── init.js          # Инициализация и подписки
│       ├── view.js          # Реактивный рендер DOM
│       ├── validation.js    # Валидация URL
│       ├── parser.js        # Парсинг RSS (DOMParser)
│       └── makeRequest.js   # HTTP-запросы (allorigins)
├── index.html
├── package.json
└── Makefile
```

RSS-запросы проксируются через сервис `allorigins.hexlet.app` для обхода CORS.
