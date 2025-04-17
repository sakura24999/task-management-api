'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Layout/Navbar';
import Alert from '@/components/UI/Alert';
import { getErrorMessage } from '@/lib/errorHandler';

// 一般的なカラーパレット
const colorPalette = [
  '#F87171', // 赤
  '#FB923C', // オレンジ
  '#FBBF24', // 黄色
  '#4ADE80', // 緑
  '#60A5FA', // 青
  '#818CF8', // インディゴ
  '#A78BFA', // 紫
  '#F472B6', // ピンク
  '#94A3B8', // スレート
  '#78716C', // ストーン
];

// バリデーションスキーマ
const categorySchema = z.object({
  name: z.string().min(2, 'カテゴリー名は2文字以上で入力してください'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, '有効なカラーコードを入力してください'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function NewCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: colorPalette[0], // デフォルトカラー
    }
  });

  // 選択中のカラーをwatchする
  const selectedColor = watch('color');

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      await api.post('/categories', data);
      router.push('/categories');
    } catch (err: any) {
      const errorData = getErrorMessage(err);
      setError(errorData.message);

      // APIからのバリデーションエラーを処理
      if (errorData.errors) {
        const formattedErrors: Record<string, string> = {};

        // Laravel のバリデーションエラーを整形
        Object.entries(errorData.errors).forEach(([key, messages]) => {
          formattedErrors[key] = Array.isArray(messages) ? messages[0] : messages.toString();
        });

        setValidationErrors(formattedErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">新規カテゴリー作成</h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg px-6 py-8 mb-4 max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              カテゴリー名 <span className="text-red-500">*</span>
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                (errors.name || validationErrors.name) ? 'border-red-500' : 'border-gray-300'
              }`}
              id="name"
              type="text"
              placeholder="カテゴリー名を入力"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic mt-1">{errors.name.message}</p>
            )}
            {validationErrors.name && (
              <p className="text-red-500 text-xs italic mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              カラー <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {colorPalette.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full cursor-pointer ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-blue-500'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setValue('color', color)}
                />
              ))}
            </div>
            <div className="flex items-center mt-4">
              <label className="text-sm text-gray-600 mr-2" htmlFor="color">
                カスタムカラー:
              </label>
              <input
                type="color"
                id="color"
                className="h-8 w-12 cursor-pointer"
                value={selectedColor}
                onChange={(e) => setValue('color', e.target.value)}
              />
              <input
                type="text"
                className={`ml-2 shadow appearance-none border rounded py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  (errors.color || validationErrors.color) ? 'border-red-500' : 'border-gray-300'
                }`}
                value={selectedColor}
                onChange={(e) => setValue('color', e.target.value)}
              />
            </div>
            {errors.color && (
              <p className="text-red-500 text-xs italic mt-1">{errors.color.message}</p>
            )}
            {validationErrors.color && (
              <p className="text-red-500 text-xs italic mt-1">{validationErrors.color}</p>
            )}
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 font-medium mb-2">プレビュー:</p>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: selectedColor }}></div>
              <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: selectedColor, color: '#fff' }}>
                {watch('name') || 'カテゴリー名'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? '保存中...' : '保存する'}
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => router.back()}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
