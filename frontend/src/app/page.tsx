'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        setChecking(false);
      }
    }
  }, [user, loading, router]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* ヘッダーナビゲーション - 固定ヘッダー */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            タスク管理アプリ
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-transparent rounded-md font-medium transition-colors duration-200"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-md font-medium shadow-sm transition-colors duration-200"
            >
              新規登録
            </Link>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="py-20 md:py-28 px-4 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                シンプルで<span className="text-blue-600">使いやすい</span><br />
                タスク管理
              </h2>
              <p className="mt-6 text-xl text-gray-600 max-w-xl">
                あなたの日々のタスクを効率的に管理し、生産性を向上させましょう。シンプルで直感的なインターフェースで、タスク管理が楽しくなります。
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg md:py-4 md:text-lg md:px-10 transition-all duration-200"
                >
                  今すぐ始める
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center px-8 py-3 border border-blue-500 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">今日のタスク</h3>
                      <span className="text-sm font-medium text-blue-600">3/5 完了</span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-900 line-through">プロジェクト計画の作成</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              完了
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-900 line-through">チームミーティング</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              完了
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-900">デザイン確認</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              進行中
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-900">資料作成</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              高優先
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 border-2 border-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm font-medium text-gray-900 line-through">メール返信</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              完了
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        新規タスク
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              シンプルで強力な機能
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              タスク管理に必要な全ての機能を、シンプルで使いやすいインターフェースで提供します
            </p>
            <div className="mt-4 flex justify-center">
              <span className="inline-flex h-1 w-24 rounded bg-blue-500"></span>
            </div>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">タスク管理</h3>
                <p className="text-gray-600">
                  タスクを簡単に作成・編集・削除できます。優先度や期限を設定して効率的に作業を進めましょう。
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    期限・優先度設定
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    詳細な説明追加
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ドラッグ＆ドロップ操作
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">カテゴリー分類</h3>
                <p className="text-gray-600">
                  タスクをカテゴリーごとに分類して整理できます。カスタムカラーでわかりやすく視覚化しましょう。
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    カスタムカテゴリー作成
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    カラーコード設定
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    複数カテゴリーの適用
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-blue-100">
                <div className="text-blue-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">進捗管理</h3>
                <p className="text-gray-600">
                  タスクの進捗状況をひと目で確認できます。未着手・進行中・完了の状態を簡単に切り替えられます。
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ステータス管理
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    フィルター機能
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    進捗レポート
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            さあ、始めましょう
          </h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            タスク管理アプリで、あなたの生産性を大幅にアップさせましょう。無料で始められます。
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200 shadow-lg"
            >
              無料で登録する
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                タスク管理アプリ
              </h3>
              <p className="text-gray-400 mb-4">
                シンプルで使いやすいタスク管理ツール。<br />
                あなたの生産性向上をサポートします。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">リンク</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">ホーム</Link></li>
                <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors duration-200">ログイン</Link></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors duration-200">新規登録</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">お問い合わせ</h3>
              <p className="text-gray-400">
                ご質問やフィードバックがございましたら、お気軽にお問い合わせください。
              </p>
              <div className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:contact@task-app.example.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                  contact@task-app.example.com
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 タスク管理アプリ - Laravel & Next.js</p>
          </div>
        </div>
      </footer>

      {/* アニメーション用のスタイル */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
