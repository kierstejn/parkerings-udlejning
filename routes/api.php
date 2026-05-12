<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\ParkingSpotController;

Route::get('/test', function () {
    return 'test';
});

Route::post('register', [UserAuthController::class, 'register']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [UserAuthController::class, 'login']);
    Route::post('refresh', [UserAuthController::class, 'refresh']);

    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
        Route::post('verify-landlord', [UserAuthController::class, 'verifyLandlord']);
    });
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('user', [UserAuthController::class, 'user']);
    Route::get('parking-spots', [ParkingSpotController::class, 'index']);
    Route::post('parking-spots', [ParkingSpotController::class, 'store']);
});
