'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import Alert from '@/components/UI/Alert';
import Navbar from '@/components/Layout/Navbar';
import { getErrorMessage } from '@/lib/errorHandler';

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function Categories() {
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      fetchCategories();
    }
  }, [loading, user]);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      const errorData = getErrorMessage(err);
      setError(errorData.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      const errorData = getErrorMessage(err);
      setError(errorData.message);
    }
  };

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
          <h1 className="text-2xl font-bold mb-4 md:mb-0">カテゴリー管理</h1>
          <Link
            href="/categories/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            新規カテゴリー作成
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/categories/${category.id}/edit`}>
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm('このカテゴリーを削除してもよろしいですか？関連するタスクからもこのカテゴリーが削除されます。')) {
                          deleteCategory(category.id);
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">カテゴリーがありません</h3>
            <p className="mt-1 text-sm text-gray-500">
              カテゴリーを作成してタスクを整理しましょう。
            </p>
            <div className="mt-6">
              <Link
                href="/categories/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                新規カテゴリー作成
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
