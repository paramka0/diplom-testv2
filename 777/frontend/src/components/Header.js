import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            Клининг-Портал
          </Link>
          
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/create-order" className="nav-link">
                  Создать заявку
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link">
                    Панель администратора
                  </Link>
                )}
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Выйти
                </button>
                <span className="user-info">
                  {user.name}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Войти
                </Link>
                <Link to="/register" className="nav-link">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      <style jsx>{`
        .header {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 1rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-size: 1rem;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #333;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #666;
          padding: 0;
        }

        .logout-btn:hover {
          color: #333;
        }

        .user-info {
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>
    </header>
  );
}

export default Header; 