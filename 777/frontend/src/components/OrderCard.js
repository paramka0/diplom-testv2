import React from 'react';

const serviceTypes = {
  general: 'Генеральная уборка',
  deep: 'Глубокая уборка',
  post_construction: 'После ремонта',
  carpet: 'Чистка ковров'
};

const paymentTypes = {
  cash: 'Наличные',
  card: 'Карта'
};

const statusTypes = {
  new: 'Новая',
  done: 'Выполнена',
  canceled: 'Отменена'
};

const statusColors = {
  new: '#2196F3',
  done: '#4CAF50',
  canceled: '#F44336'
};

function OrderCard({ order, onStatusChange, isAdmin }) {
  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(order.id, e.target.value);
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Заказ #{order.id}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: statusColors[order.status] }}
        >
          {statusTypes[order.status]}
        </span>
      </div>

      <div className="order-details">
        <p><strong>Услуга:</strong> {serviceTypes[order.service]}</p>
        <p><strong>Адрес:</strong> {order.address}</p>
        <p><strong>Дата:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Оплата:</strong> {paymentTypes[order.payment]}</p>
        {isAdmin && order.name && (
          <p><strong>Клиент:</strong> {order.name}</p>
        )}
        {isAdmin && order.phone && (
          <p><strong>Телефон:</strong> {order.phone}</p>
        )}
      </div>

      {isAdmin && onStatusChange && (
        <div className="order-actions">
          <select 
            value={order.status} 
            onChange={handleStatusChange}
            className="status-select"
          >
            {Object.entries(statusTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      <style jsx>{`
        .order-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .order-header h3 {
          margin: 0;
          color: #333;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .order-details {
          margin-bottom: 1rem;
        }

        .order-details p {
          margin: 0.5rem 0;
          color: #666;
        }

        .order-details strong {
          color: #333;
        }

        .order-actions {
          border-top: 1px solid #eee;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .status-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
          color: #333;
          font-size: 0.875rem;
        }

        .status-select:focus {
          outline: none;
          border-color: #2196F3;
        }
      `}</style>
    </div>
  );
}

export default OrderCard; 