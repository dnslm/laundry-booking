# Frontend

React + TypeScript + Vite. Роутинг на React Router, стили в CSS Modules, без UI-библиотек.
Шрифт Golos Text подключён локально через `@fontsource/golos-text`.

## Запуск

Из корня репозитория:

```bash
yarn install
yarn workspace frontend dev
```

Приложение откроется на `http://localhost:5173`. Перед запуском скопируйте
`frontend/.env.example` в `frontend/.env`, если нужен свой `VITE_API_URL`.

## Команды

| Команда                             | Что делает        |
| ----------------------------------- | ----------------- |
| `yarn workspace frontend dev`       | dev-сервер с HMR  |
| `yarn workspace frontend typecheck` | проверка типов    |
| `yarn workspace frontend build`     | production-сборка |
| `yarn workspace frontend preview`   | просмотр сборки   |

## Авторизация на заглушках

Пока бэкенда нет, `src/api/auth.ts` работает на моках из `src/api/mocks.ts`.
Пользователи и токен хранятся в `localStorage`.

Демо-аккаунты:

- `student` / `student123` — студент;
- `admin` / `admin123` — студсовет.

Регистрация создаёт нового студента и сразу входит в аккаунт. Чтобы сбросить моки,
очистите `localStorage` в DevTools.

## Страницы

- `/login` и `/register` — готовы.
- `/booking`, `/my`, `/admin` — временные заглушки до этапа 2.
