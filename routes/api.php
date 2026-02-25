<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;

Route::get('/test', function () {
    return 'test';
});

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [UserAuthController::class, 'login']);
    Route::post('refresh', [UserAuthController::class, 'refresh']);

    // Protected routes
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
    });
});

// Protected routes
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('user', [UserAuthController::class, 'user']);
});

