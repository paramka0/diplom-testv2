import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    login: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      showError('Пароли не совпадают');
      return false;
    }

    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      showError('Неверный формат телефона');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Неверный формат email');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      // Автоматический вход после регистрации
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        login: formData.login,
        password: formData.password
      });
      
      onLogin(loginResponse.data.user, loginResponse.data.token);
      showSuccess('Регистрация успешно завершена! Добро пожаловать в систему.');
      navigate('/');
    } catch (error) {
      showError(
        error.response?.data?.message || 
        'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container fade-in">
        <h1 className="form-title">Регистрация</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">ФИО</label>
            <input
              className="form-input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Введите ваше полное имя"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Телефон</label>
            <input
              className="form-input"
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7XXXXXXXXXX"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="example@mail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login">Логин</label>
            <input
              className="form-input"
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Придумайте логин"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Пароль</label>
            <input
              className="form-input"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Придумайте пароль"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              className="form-input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Повторите пароль"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-link">
          Уже есть аккаунт?{' '}
          <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 