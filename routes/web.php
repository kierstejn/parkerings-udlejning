<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\UdlejerController;
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
    Route::get('/profil',    [DashboardController::class, 'profil'])->name('dashboard.profil');
    Route::get('/bookinger', [DashboardController::class, 'bookinger'])->name('dashboard.bookinger');

    Route::get('/udlejer',         [UdlejerController::class, 'index'])->name('dashboard.udlejer');
    Route::post('/udlejer/verify', [UdlejerController::class, 'verify'])->name('dashboard.udlejer.verify');

    Route::middleware('udlejer')->group(function () {
        Route::get('/udlejer/parkeringspladser',  [UdlejerController::class, 'parkeringspladser'])->name('dashboard.udlejer.parkeringspladser');
        Route::post('/udlejer/parkeringspladser', [UdlejerController::class, 'storeParkeringsplads'])->name('dashboard.udlejer.parkeringspladser.store');
    });
});
