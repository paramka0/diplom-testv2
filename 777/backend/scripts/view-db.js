const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.db'));

console.log('Содержимое таблицы users:');
db.all('SELECT id, name, phone, email, login, role FROM users', [], (err, rows) => {
  if (err) {
    console.error('Ошибка при получении данных пользователей:', err);
  } else {
    console.table(rows);
  }

  console.log('\nСодержимое таблицы orders:');
  db.all(`
    SELECT o.*, u.name as user_name, u.phone as user_phone 
    FROM orders o 
    LEFT JOIN users u ON o.userId = u.id
  `, [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении данных заказов:', err);
    } else {
      console.table(rows);
    }
    db.close();
  });
}); 