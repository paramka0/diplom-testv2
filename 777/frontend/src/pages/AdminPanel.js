import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderCard from '../components/OrderCard';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/all${search ? `?search=${search}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
      setError('');
    } catch (error) {
      setError('Ошибка при получении заказов');
      console.error('Ошибка при получении заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Панель администратора</h1>

        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по ФИО или телефону"
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Поиск
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Загрузка заказов...
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            Заказы не найдены
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                isAdmin={true}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-panel {
          padding: 2rem 0;
          background-color: #f5f5f5;
          min-height: calc(100vh - 64px);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        h1 {
          margin: 0 0 1.5rem;
          color: #333;
        }

        .search-container {
          margin-bottom: 2rem;
        }

        .search-form {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #2196F3;
        }

        .search-btn {
          background-color: #2196F3;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .search-btn:hover {
          background-color: #1976D2;
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-orders {
          text-align: center;
          padding: 2rem;
          color: #666;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}

export default AdminPanel; 