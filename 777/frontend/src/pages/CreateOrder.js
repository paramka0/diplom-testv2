import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderCard from '../components/OrderCard';

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

function CreateOrder() {
  const [formData, setFormData] = useState({
    service: '',
    address: '',
    date: '',
    payment: ''
  });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Заказ успешно создан');
      setFormData({
        service: '',
        address: '',
        date: '',
        payment: ''
      });
      fetchOrders();
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Произошла ошибка при создании заказа. Пожалуйста, попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <div className="container">
        <div className="order-form-container">
          <h1>Создать заявку</h1>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-group">
              <label htmlFor="service">Тип услуги</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Выберите услугу</option>
                {Object.entries(serviceTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Введите адрес уборки"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Дата</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={loading}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="payment">Способ оплаты</label>
              <select
                id="payment"
                name="payment"
                value={formData.payment}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Выберите способ оплаты</option>
                {Object.entries(paymentTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать заявку'}
            </button>
          </form>
        </div>

        <div className="orders-list">
          <h2>Мои заявки</h2>
          {orders.length === 0 ? (
            <p className="no-orders">У вас пока нет заявок</p>
          ) : (
            orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .create-order-page {
          padding: 2rem 0;
          background-color: #f5f5f5;
          min-height: calc(100vh - 64px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: 1fr;
          }
        }

        .order-form-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        h1 {
          margin: 0 0 1.5rem;
          color: #333;
        }

        h2 {
          margin: 0 0 1rem;
          color: #333;
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .order-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          color: #666;
          font-size: 0.875rem;
        }

        input, select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus, select:focus {
          outline: none;
          border-color: #2196F3;
        }

        input:disabled, select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .submit-btn {
          background-color: #2196F3;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 1rem;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #1976D2;
        }

        .submit-btn:disabled {
          background-color: #90CAF9;
          cursor: not-allowed;
        }

        .orders-list {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .no-orders {
          color: #666;
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}

export default CreateOrder; 