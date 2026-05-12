<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\LandlordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public ────────────────────────────────────────────────
Route::get('/', fn () => Inertia::render('Landing'))->name('home');

// ── Auth (guests only) ────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

// ── Logout ────────────────────────────────────────────────
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// ── Dashboard (authenticated) ─────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile',   [DashboardController::class, 'profile'])->name('dashboard.profile');
    Route::get('/bookings',  [DashboardController::class, 'bookings'])->name('dashboard.bookings');

    Route::get('/landlord',         [LandlordController::class, 'index'])->name('dashboard.landlord');
    Route::post('/landlord/verify', [LandlordController::class, 'verify'])->name('dashboard.landlord.verify');

    Route::middleware('landlord')->group(function () {
        Route::get('/landlord/parking-spots',                        [LandlordController::class, 'parkingSpots'])->name('dashboard.landlord.parking-spots');
        Route::post('/landlord/parking-spots',                       [LandlordController::class, 'storeParkingSpot'])->name('dashboard.landlord.parking-spots.store');
        Route::post('/landlord/parking-spots/{spot}',                [LandlordController::class, 'updateParkingSpot'])->name('dashboard.landlord.parking-spots.update');
        Route::delete('/landlord/parking-spots/images/{image}',      [LandlordController::class, 'destroyImage'])->name('dashboard.landlord.parking-spots.image.destroy');
    });
});
