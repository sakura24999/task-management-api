import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // CORSでクッキーを送信するために必要
});

// リクエストインターセプター（認証トークンの追加など）
api.interceptors.request.use(
  (config) => {
    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API リクエスト:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API リクエストエラー:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    console.log('API レスポンス:', response.status, response.statusText);
    return response;
  },
  (error) => {
    console.error('API レスポンスエラー:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
