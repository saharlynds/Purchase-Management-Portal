import React from 'react';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#eee' }}>
      <span>خوش آمدید, {user.sub} (نقش: {user.role})</span>
      <button onClick={logout}>خروج</button>
    </header>
  );
}

export default Header;