# Клининг-Портал

Веб-приложение для управления заказами клининговой компании.

## Технологии

### Frontend
- React (SPA)
- React Router DOM
- Axios
- CSS-in-JS

### Backend
- Node.js
- Express
- SQLite3
- JWT
- Bcrypt

## Установка и запуск

### Предварительные требования
- Node.js (версия 18 или выше)
- npm (версия 8 или выше)

### Установка зависимостей

1. Скачайте или клонируйте репозиторий и перейдите в директорию проекта:
```bash
cd cleaning-portal
```

2. Установите зависимости для backend:
```bash
cd backend
npm install
```

3. Установите зависимости для frontend:
```bash
cd ../frontend
npm install
```

### Запуск приложения

1. Запустите backend сервер:
```bash
cd backend
npm run dev
```
Сервер будет доступен по адресу: http://localhost:5000

2. В отдельном терминале запустите frontend:
```bash
cd frontend
npm start
```
Приложение будет доступно по адресу: http://localhost:3000

## Доступ к приложению

### Администратор
- Логин: adminka
- Пароль: password

### Пользователь
Для доступа к функционалу пользователя необходимо зарегистрироваться через форму регистрации.

## Функциональность

### Пользователь
- Регистрация и авторизация
- Создание заявок на уборку
- Просмотр истории своих заявок
- Отслеживание статуса заявок

### Администратор
- Просмотр всех заявок
- Поиск заявок по ФИО и телефону
- Изменение статуса заявок
- Управление пользователями

## Структура проекта

```
cleaning-portal/
├── frontend/           # React приложение
│   ├── public/        # Публичные файлы
│   │   ├── index.html # HTML шаблон
│   │   └── manifest.json # Манифест приложения
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   │   └── Notification.js # Компонент уведомлений
│   │   ├── context/   # React контексты
│   │   │   └── NotificationContext.js # Контекст уведомлений
│   │   ├── styles/    # Стили приложения
│   │   │   └── global.css # Глобальные стили
│   │   ├── pages/     # Страницы приложения
│   │   └── App.js     # Корневой компонент
│   └── package.json
│
├── backend/           # Node.js сервер
│   ├── routes/       # Маршруты API
│   ├── models/       # Модели данных
│   ├── scripts/      # Скрипты для работы с БД
│   ├── database.db   # База данных SQLite
│   ├── server.js     # Точка входа сервера
│   └── package.json
│
└── README.md
```

## API Endpoints

### Аутентификация
- POST /api/auth/register - Регистрация нового пользователя
- POST /api/auth/login - Авторизация пользователя

### Заказы
- POST /api/orders - Создание нового заказа
- GET /api/orders/my - Получение заказов текущего пользователя
- GET /api/orders/all - Получение всех заказов (только для админа)
- PATCH /api/orders/:orderId/status - Изменение статуса заказа (только для админа) 