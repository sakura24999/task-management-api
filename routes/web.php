<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// ワイルドカードミドルウェアグループを追加
Route::middleware('web')->group(function () {
    // Sanctumルートを明示的に登録
    Route::get('/sanctum/csrf-cookie', function () {
        return Response::json(['message' => 'CSRF cookie set'], 200);
    });
});
