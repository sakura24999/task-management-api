'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api, { getCsrfToken } from '@/lib/api';

// バリデーションスキーマ
const taskSchema = z.object({
  title: z.string().min(3, 'タイトルは3文字以上で入力してください'),
  description: z.string().optional(),
  status: z.enum(['未着手', '進行中', '完了']),
  priority: z.enum(['低', '中', '高']),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください'),
  category_ids: z.array(z.number()).optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function NewTask() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: '未着手',
      priority: '中',
      due_date: new Date().toISOString().split('T')[0],
      category_ids: [],
    }
  });

  useEffect(() => {
    // コンポーネントのマウント時にCSRFトークンを取得
    const initializeData = async () => {
      try {
        await getCsrfToken(); // CSRFトークンを取得
        fetchCategories();
      } catch (error) {
        console.error('初期化エラー:', error);
      }
    };

    initializeData();
  }, []);

  const fetchCategories = async () => {
    try {
      // auth_tokenがあるか確認（デバッグ用）
      const token = localStorage.getItem('auth_token');
      console.log('認証トークン:', token ? 'あり' : 'なし');

      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('カテゴリ取得エラー:', error);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    try {
      // CSRFトークン取得
      await getCsrfToken();

      // タスク作成リクエスト
      console.log('タスク作成リクエスト', data);
      const response = await api.post('/tasks', data);
      console.log('タスク作成成功:', response.data);
      router.push('/dashboard');
    } catch (error) {
      console.error('タスク作成エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規タスク作成</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            タイトル *
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.title ? 'border-red-500' : ''}`}
            id="title"
            type="text"
            placeholder="タスクのタイトル"
            {...register('title')}
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            説明
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="タスクの説明"
            rows={4}
            {...register('description')}
          />
        </div>

        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              ステータス
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status"
              {...register('status')}
            >
              <option value="未着手">未着手</option>
              <option value="進行中">進行中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              優先度
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="priority"
              {...register('priority')}
            >
              <option value="低">低</option>
              <option value="中">中</option>
              <option value="高">高</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">
              期日
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.due_date ? 'border-red-500' : ''}`}
              id="due_date"
              type="date"
              {...register('due_date')}
            />
            {errors.due_date && (
              <p className="text-red-500 text-xs italic">{errors.due_date.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            カテゴリー
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <label key={category.id} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={category.id}
                  className="form-checkbox h-5 w-5"
                  onChange={(e) => {
                    const currentCategoryIds = register('category_ids').value || [];
                    if (e.target.checked) {
                      setValue('category_ids', [...currentCategoryIds, category.id]);
                    } else {
                      setValue('category_ids', currentCategoryIds.filter((id: number) => id !== category.id));
                    }
                  }}
                />
                <span
                  className="ml-2 px-2 py-1 rounded-full text-xs"
                  style={{ backgroundColor: category.color, color: '#fff' }}
                >
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : '保存する'}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => router.back()}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
