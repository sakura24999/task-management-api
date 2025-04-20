'use client';

import React from 'react';
import ApiTest from '@/components/ApiTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">API接続テスト</h1>
        <ApiTest />

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-2">使用方法</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              「CSRFトークン取得テスト」ボタンをクリックして、Sanctumルートが正しく設定されているか確認します。
              成功すれば、CSRFトークンがブラウザのCookieに保存されます。
            </li>
            <li>
              「APIエンドポイントテスト」ボタンをクリックして、APIサーバーへの接続が正常に機能するか確認します。
              このテストは認証なしで実行できる簡単なAPIエンドポイントを呼び出します。
            </li>
          </ol>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>注意:</strong> テストが失敗する場合は、ブラウザのデベロッパーツールを開いて、
              ネットワークタブのエラーを確認してください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
