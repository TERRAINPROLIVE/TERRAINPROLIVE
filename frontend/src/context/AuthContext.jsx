import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "terrainpro:token";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // user: null = checking, false = unauthenticated, object = authenticated
  const [user, setUser] = useState(null);

  const applyToken = useCallback((t) => {
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const fetchMe = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setUser(false);
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      setUser(data);
    } catch {
      applyToken(null);
      setUser(false);
    }
  }, [applyToken]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const register = async (payload) => {
    const { data } = await axios.post(`${API}/auth/register`, payload);
    applyToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    const { data } = await axios.post(`${API}/auth/login`, payload);
    applyToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    applyToken(null);
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, refresh: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}
