'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { getCsrfToken } from '@/lib/api';

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
        console.log('起動時の認証トークン:', token ? `${token.substring(0, 10)}...` : 'なし');
        if (token) {
          try {
            const response = await api.get('/user');
            console.log('ユーザー情報取得成功:', response.data);
            setUser(response.data);
          } catch (userError) {
            console.error('ユーザー情報取得エラー:', userError);
            localStorage.removeItem('auth_token');
            console.log('無効なトークンを削除しました');
          }
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
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
      // CSRFトークン取得
      await getCsrfToken();

      // ログインリクエスト
      const response = await api.post('/login', { email, password });
      console.log('ログインレスポンス全体:', response.data);

      // レスポンスの構造を詳細にログ出力
      console.log('レスポンス内のトークン:',
        response.data.token ||
        response.data.access_token ||
        response.data.data?.token ||
        'トークンが見つかりません'
      );

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('トークンを保存しました (token):', response.data.token.substring(0, 10) + '...');
      } else if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        console.log('トークンを保存しました (access_token):', response.data.access_token.substring(0, 10) + '...');
      } else {
        console.warn('トークンがレスポンスに含まれていません');
      }

      // 保存後に確認
      const savedToken = localStorage.getItem('auth_token');
      console.log('localStorage確認:', savedToken ? '保存成功' : '保存失敗');

      setUser(response.data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('ログインエラー:', error);
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
