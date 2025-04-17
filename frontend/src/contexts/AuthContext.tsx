'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ページ読み込み時にユーザー情報を取得
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await api.get('/user');
          setUser(response.data);
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {

      console.log('登録を開始します...');
      console.log('APIのベースURL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
      // CSRFトークンを取得
      console.log('CSRFトークンを取得します...');
      await api.get('/sanctum/csrf-cookie');
      console.log('CSRFトークン取得成功');

      // 登録リクエスト
      console.log('登録リクエストを送信します:', { name, email, password: '********' });
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: password, // 同じ値を送信
      });

      console.log('登録成功:', response.data);
      localStorage.setItem('auth_token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/logout');
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
