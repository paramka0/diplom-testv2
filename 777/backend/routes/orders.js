const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware для проверки JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Middleware для проверки прав администратора
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен' });
  }
  next();
};

// Создание нового заказа
router.post('/', authMiddleware, (req, res) => {
  const { address, service, date, payment } = req.body;
  const userId = req.user.id;

  if (!address || !service || !date || !payment) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  db.run(
    'INSERT INTO orders (userId, address, service, date, payment, status) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, address, service, date, payment, 'new'],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при создании заказа' });
      }
      res.status(201).json({ 
        message: 'Заказ успешно создан',
        orderId: this.lastID 
      });
    }
  );
});

// Получение заказов пользователя
router.get('/my', authMiddleware, (req, res) => {
  const userId = req.user.id;
  
  db.all(
    'SELECT * FROM orders WHERE userId = ? ORDER BY date DESC',
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при получении заказов' });
      }
      res.json(orders);
    }
  );
});

// Получение всех заказов (только для админа)
router.get('/all', [authMiddleware, adminMiddleware], (req, res) => {
  const { search } = req.query;
  let query = `
    SELECT o.*, u.name, u.phone 
    FROM orders o 
    JOIN users u ON o.userId = u.id 
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (u.name LIKE ? OR u.phone LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY o.date DESC';

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при получении заказов' });
    }
    res.json(orders);
  });
});

// Изменение статуса заказа (только для админа)
router.patch('/:orderId/status', [authMiddleware, adminMiddleware], (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!['new', 'done', 'canceled'].includes(status)) {
    return res.status(400).json({ message: 'Неверный статус заказа' });
  }

  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Ошибка при обновлении статуса' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Заказ не найден' });
      }
      res.json({ message: 'Статус заказа обновлен' });
    }
  );
});

module.exports = router; 