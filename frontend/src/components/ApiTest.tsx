'use client';

import React, { useState } from 'react';
import api, { getCsrfToken } from '@/lib/api';

export default function ApiTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCsrfToken = async () => {
    setLoading(true);
    setError(null);

    try {
      // 直接getCsrfToken関数を使用
      await getCsrfToken();
      setResult({ success: true, message: 'CSRFトークンの取得に成功しました' });
    } catch (err: any) {
      console.error('エラー:', err);
      setError(err.message || 'CSRFトークンの取得に失敗しました');
      setResult({ success: false, error: err });
    } finally {
      setLoading(false);
    }
  };

  const testApiEndpoint = async () => {
    setLoading(true);
    setError(null);

    try {
      // api.getメソッドを直接使用（testGetではなく）
      const response = await api.get('/api/test');
      setResult(response.data);
    } catch (err: any) {
      console.error('エラー:', err);
      setError(err.message || 'APIリクエストに失敗しました');
      setResult({ success: false, error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      <h2 className="text-xl font-bold mb-4">API接続テスト</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={testCsrfToken}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          CSRFトークン取得テスト
        </button>

        <button
          onClick={testApiEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          APIエンドポイントテスト
        </button>
      </div>

      {loading && <p className="text-gray-600">処理中...</p>}

      {error && (
        <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-700 mb-4">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">結果:</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
