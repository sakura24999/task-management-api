<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// 認証不要のエンドポイント
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 認証が必要なエンドポイント
Route::middleware('auth:sanctum')->group(function () {
    // ユーザー関連
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // タスク関連
    Route::apiResource('tasks', TaskController::class);

    // カテゴリー関連
    Route::apiResource('categories', CategoryController::class);
});

// テスト用エンドポイント（認証不要）
Route::get('/test', function () {
    return response()->json([
        'message' => 'APIサーバーに接続できました',
        'status' => 'success',
        'timestamp' => now()->toDateTimeString(),
        'server_info' => [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ]
    ]);
});

