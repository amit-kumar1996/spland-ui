import { createContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('spland_user');
    return raw ? JSON.parse(raw) : null;
  });

  function login({token, user}) {
    localStorage.setItem("spland_token", token);
    localStorage.setItem('spland_user', JSON.stringify(user));
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("spland_token");
    localStorage.removeItem('spland_user');
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);