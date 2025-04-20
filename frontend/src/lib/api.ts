import axios from 'axios';

// バックエンドURLの設定
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // CORSでクッキーを送信するために必要
});

// CSRFトークンを取得する関数を追加
export const getCsrfToken = async (): Promise<void> => {
  try {
    console.log('CSRFトークンを取得します...');
    await api.get('/sanctum/csrf-cookie');
    console.log('CSRFトークンの取得に成功しました');
  } catch (error) {
    console.error('CSRFトークン取得エラー:', error);
    throw error;
  }
};

// リクエストインターセプター
api.interceptors.request.use(
  async (config) => {
    // Sanctumルートには/apiプレフィックスをつけない
    if (config.url?.startsWith('/sanctum')) {
    return config;
    }

    // APIエンドポイントへのリクエストの場合は/apiプレフィックスを追加
    if (!config.url?.startsWith('/api')) {
      const url = config.url?.startsWith('/') ? config.url : `/${config.url}`;
      config.url = `/api${url}`;
    }

    // ローカルストレージからトークンを取得
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Bearer プレフィックスが既に含まれているかチェック
      if (token.startsWith('Bearer ')) {
        config.headers.Authorization = token;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('認証ヘッダー設定:', config.headers.Authorization.substring(0, 20) + '...');
    } else {
      console.log('認証トークンがありません');
    }

    console.log('リクエスト先:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
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

// APIメソッドオブジェクト
export const ApiService = {
  // CSRFトークン取得 (テスト用)
  testCsrf: async () => {
    try {
      await getCsrfToken();
      return { success: true, message: 'CSRFトークンの取得に成功しました' };
    } catch (error) {
      return { success: false, message: 'CSRFトークンの取得に失敗しました', error };
    }
  },

  // テスト用GETリクエスト
  testGet: async (path: string) => {
    try {
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ユーザー登録
  register: async (userData: any) => {
    try {
      await getCsrfToken(); // 登録前にCSRFトークンを取得
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ログイン
  login: async (credentials: any) => {
    try {
      await getCsrfToken(); // ログイン前にCSRFトークンを取得
      const response = await api.post('/login', credentials);

      // トークンをローカルストレージに保存
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ログアウト
  logout: async () => {
    try {
      const response = await api.post('/logout');
      localStorage.removeItem('auth_token'); // トークンを削除
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ユーザー情報取得
  getUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// 重要: ApiServiceオブジェクトをエクスポートするだけでなく
// カスタムメソッドを持つAPIインスタンスとしてエクスポート
const apiWithMethods = {
  ...api,
  testCsrf: ApiService.testCsrf,
  testGet: ApiService.testGet,
  register: ApiService.register,
  login: ApiService.login,
  logout: ApiService.logout,
  getUser: ApiService.getUser
};

export default apiWithMethods;
