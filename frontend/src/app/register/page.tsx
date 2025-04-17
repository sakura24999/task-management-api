'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/UI/Alert';
import api from '@/lib/api';

// バリデーションスキーマ
const registerSchema = z.object({
  name: z.string().min(2, '名前は2文字以上で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  password_confirmation: z.string().min(8, 'パスワード確認は8文字以上で入力してください')
}).refine((data) => data.password === data.password_confirmation, {
  message: "パスワードとパスワード確認が一致しません",
  path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // フィールド名を日本語に変換するヘルパー関数
  const getFieldName = (field: string): string => {
    const fieldNames: {[key: string]: string} = {
      'name': '名前',
      'email': 'メールアドレス',
      'password': 'パスワード',
      'password_confirmation': 'パスワード確認'
    };

    return fieldNames[field] || field;
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('登録処理を開始...');
      // CSRFトークンを取得（Sanctumを使用している場合）
      await api.get('/sanctum/csrf-cookie');

      // 現在のデータをコンソールに出力
      console.log('送信するデータ:', {
        name: data.name,
        email: data.email,
        password: '********', // セキュリティのため表示しない
        password_confirmation: '********' // セキュリティのため表示しない
      });

      // APIリクエストを直接送信してみる
      const response = await api.post('/register', data);
      console.log('成功レスポンス:', response.data);

      // 登録成功時の処理
      localStorage.setItem('auth_token', response.data.access_token);
      await authRegister(data.name, data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);

      // エラーメッセージの処理を改善
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          // バリデーションエラーの具体的なメッセージを取得
          const errorMessages = [];
          for (const field in err.response.data.errors) {
            if (err.response.data.errors[field].length > 0) {
              errorMessages.push(`・${getFieldName(field)}: ${err.response.data.errors[field][0]}`);
            }
          }
          setError(errorMessages.join('\n'));
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('登録中にエラーが発生しました。入力内容を確認してください。');
        }
      } else {
        setError('サーバーに接続できませんでした。ネットワーク接続を確認してください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            新規アカウント登録
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            タスク管理アプリで生産性を向上させましょう
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex h-1 w-16 rounded bg-blue-500"></span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-gray-100">
          {error && (
            <Alert type="error" message={error} onClose={() => setError(null)} />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                お名前
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`pl-10 appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="例：山田 太郎"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`pl-10 appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`pl-10 appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="8文字以上で入力してください"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                パスワード確認
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  className={`pl-10 appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="パスワードを再入力してください"
                  {...register('password_confirmation')}
                />
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.password_confirmation.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    アカウント作成中...
                  </>
                ) : (
                  'アカウントを作成する'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  または
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div>
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  ログインページへ
                </Link>
              </div>
              <div>
                <Link
                  href="/"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          登録すると、利用規約とプライバシーポリシーに同意したことになります
        </p>
      </div>
    </div>
  );
}
