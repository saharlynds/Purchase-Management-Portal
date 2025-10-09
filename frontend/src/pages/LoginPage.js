import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await api.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const token = response.data.access_token;
      login(token);
      
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div>
      <h2>پورتال ورود داده و گزارش‌دهی</h2>
      {/* این خط مهم‌ترین بخش است: onSubmit={handleLogin} */}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">نام کاربری:</label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div>
          <label htmlFor="password">رمز عبور:</label>
          <input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ورود</button>
      </form>
    </div>
  );
}

export default LoginPage;