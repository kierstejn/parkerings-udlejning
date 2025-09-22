<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserAuthController;

/*Route::get('/test', function (Request $request) {
    return "test6";
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login',[UserAuthController::class,'login']);
Route::post('/logout',[UserAuthController::class,'logout'])
    ->middleware('auth:sanctum');*/


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

