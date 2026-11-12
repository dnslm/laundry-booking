# Laundry Booking

Система бронирования стиральных машин в общежитии. Учебный командный проект по веб-разработке.

## Стек (уточняется)

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- БД: SQLite или PostgreSQL, ORM уточняется
- Качество: ESLint, Prettier, husky, lint-staged, GitHub Actions

## Структура

```text
backend/   сервер и работа с БД
frontend/  клиентское приложение
docs/      контракт API, схема БД, заметки
```

## Быстрый старт

Нужны Node.js версии из `.nvmrc` и Corepack (идёт вместе с Node).

```bash
git clone <ссылка-на-репозиторий>
cd laundry-booking
fnm use            # или nvm use
corepack enable
yarn install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## Команды

| Команда             | Что делает                                |
| ------------------- | ----------------------------------------- |
| `yarn lint`         | проверка ESLint                           |
| `yarn lint:fix`     | ESLint с автоисправлением                 |
| `yarn format`       | форматирование Prettier                   |
| `yarn format:check` | проверка форматирования (то же делает CI) |
| `yarn types`        | проверка типов во всех пакетах            |
| `yarn tests`        | тесты во всех пакетах                     |
| `yarn build:all`    | сборка всех пакетов                       |

## Как работаем

Правила командной работы: [CONTRIBUTING.md](CONTRIBUTING.md). Контракт API: [docs/api.md](docs/api.md).
Проверка процесса
