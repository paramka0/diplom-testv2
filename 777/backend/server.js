const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Ошибка при подключении к базе данных:', err);
  } else {
    console.log('Подключение к базе данных SQLite успешно установлено');
    initDatabase();
  }
});

// Инициализация базы данных
function initDatabase() {
  db.serialize(() => {
    // Создание таблицы пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE,
      email TEXT UNIQUE,
      login TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )`);

    // Создание таблицы заявок
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      address TEXT,
      service TEXT CHECK(service IN ('general', 'deep', 'post_construction', 'carpet')),
      date TEXT,
      payment TEXT CHECK(payment IN ('cash', 'card')),
      status TEXT CHECK(status IN ('new', 'done', 'canceled')),
      FOREIGN KEY(userId) REFERENCES users(id)
    )`);

    // Создание администратора по умолчанию
    const bcrypt = require('bcrypt');
    bcrypt.hash('password', 10, (err, hash) => {
      if (err) {
        console.error('Ошибка при хешировании пароля:', err);
        return;
      }
      db.run(`INSERT OR IGNORE INTO users (login, password, role, name, email) 
              VALUES (?, ?, ?, ?, ?)`,
        ['adminka', hash, 'admin', 'Администратор', 'admin@example.com'],
        (err) => {
          if (err) {
            console.error('Ошибка при создании администратора:', err);
          } else {
            console.log('Администратор создан или уже существует');
          }
        });
    });
  });
}

// Подключение маршрутов
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 