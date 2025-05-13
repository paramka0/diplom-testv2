const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Регистрация
router.post('/register', async (req, res) => {
  const { name, phone, email, login, password } = req.body;

  // Валидация
  if (!name || !phone || !email || !login || !password) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  // Проверка формата телефона
  const phoneRegex = /^\+?[1-9]\d{10,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Неверный формат телефона' });
  }

  // Проверка формата email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Неверный формат email' });
  }

  try {
    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверка уникальности email и login
    db.get('SELECT * FROM users WHERE email = ? OR login = ?', [email, login], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при проверке пользователя' });
      }
      if (user) {
        return res.status(400).json({ message: 'Пользователь с таким email или логином уже существует' });
      }

      // Создание пользователя
      db.run(
        'INSERT INTO users (name, phone, email, login, password) VALUES (?, ?, ?, ?, ?)',
        [name, phone, email, login, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Ошибка при создании пользователя' });
          }
          res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при регистрации' });
  }
});

// Авторизация
router.post('/login', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Логин и пароль обязательны' });
  }

  db.get('SELECT * FROM users WHERE login = ?', [login], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при поиске пользователя' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при авторизации' });
    }
  });
});

module.exports = router; 