'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Alert from '@/components/UI/Alert';
import Navbar from '@/components/Layout/Navbar';
import { getErrorMessage } from '@/lib/errorHandler';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && user) {
      fetchTasks();
      fetchCategories();
    }
  }, [loading, user]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      const errorData = getErrorMessage(err);
      setError(errorData.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      // カテゴリー取得エラーは致命的ではないので無視
      console.error('カテゴリー取得エラー:', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      const errorData = getErrorMessage(err);
      setError(errorData.message);
    }
  };

  // フィルタリングされたタスクのリスト
  const filteredTasks = tasks.filter(task => {
    let statusMatch = true;
    let priorityMatch = true;
    let categoryMatch = true;

    if (filterStatus) {
      statusMatch = task.status === filterStatus;
    }

    if (filterPriority) {
      priorityMatch = task.priority === filterPriority;
    }

    if (filterCategory) {
      categoryMatch = task.categories.some(cat => cat.id === filterCategory);
    }

    return statusMatch && priorityMatch && categoryMatch;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">タスク一覧</h1>
          <Link
            href="/tasks/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            新規タスク作成
          </Link>
        </div>

        {/* フィルターセクション - モバイルではアコーディオン形式 */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <details className="md:hidden">
            <summary className="font-semibold cursor-pointer">フィルター</summary>
            <div className="mt-4 space-y-4">
              {/* モバイル用フィルター */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">すべて</option>
                  <option value="未着手">未着手</option>
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  value={filterPriority || ''}
                  onChange={(e) => setFilterPriority(e.target.value || null)}
                >
                  <option value="">すべて</option>
                  <option value="低">低</option>
                  <option value="中">中</option>
                  <option value="高">高</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm"
                  value={filterCategory || ''}
                  onChange={(e) => setFilterCategory(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">すべて</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </details>

          {/* デスクトップ用フィルター - 常に表示 */}
          <div className="hidden md:flex md:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
              <select
                className="rounded-md border-gray-300 shadow-sm"
                value={filterStatus || ''}
                onChange={(e) => setFilterStatus(e.target.value || null)}
              >
                <option value="">すべて</option>
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
              <select
                className="rounded-md border-gray-300 shadow-sm"
                value={filterPriority || ''}
                onChange={(e) => setFilterPriority(e.target.value || null)}
              >
                <option value="">すべて</option>
                <option value="低">低</option>
                <option value="中">中</option>
                <option value="高">高</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
              <select
                className="rounded-md border-gray-300 shadow-sm"
                value={filterCategory || ''}
                onChange={(e) => setFilterCategory(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">すべて</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* カテゴリーセクション */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">カテゴリー</h2>
            <Link
              href="/categories/new"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 新規カテゴリー
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(filterCategory === category.id ? null : category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filterCategory === category.id
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : ''
                }`}
                style={{
                  backgroundColor: category.color,
                  color: '#fff',
                  opacity: filterCategory && filterCategory !== category.id ? 0.7 : 1
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* タスクリスト */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map(task => (
              <div key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold truncate">{task.title}</h3>
                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    <Link href={`/tasks/${task.id}/edit`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('このタスクを削除してもよろしいですか？')) {
                          deleteTask(task.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{task.description}</p>
                <div className="mt-3 text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">ステータス:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      task.status === '完了'
                        ? 'bg-green-100 text-green-800'
                        : task.status === '進行中'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">優先度:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      task.priority === '高'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === '中'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="font-medium mr-1">期日:</span>
                    <span className="text-gray-700">
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {task.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {task.categories.map(category => (
                      <span
                        key={category.id}
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: category.color, color: '#fff' }}
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">タスクがありません</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus || filterPriority || filterCategory
                ? 'フィルター条件に合うタスクがありません。条件を変更するか、新しいタスクを作成してください。'
                : '新しいタスクを作成して始めましょう。'}
            </p>
            <div className="mt-6">
              <Link
                href="/tasks/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                新規タスク作成
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
