<?php

use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\LandlordController;
use App\Http\Controllers\Web\SocialiteController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Test helpers (testing env only) ───────────────────────
if (app()->environment('testing')) {
    Route::post('/test/db/reset', function () {
        Artisan::call('migrate:fresh', ['--force' => true]);
        return response()->json(['ok' => true]);
    })->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
}

// ── Public ────────────────────────────────────────────────
Route::get('/', fn () => Inertia::render('Landing'))->name('home');

// ── Auth (guests only) ────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/auth/google',          [SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
    Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback'])->name('auth.google.callback');
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
        Route::get('/landlord/parking-spots',                                    [LandlordController::class, 'parkingSpots'])->name('dashboard.landlord.parking-spots');
        Route::post('/landlord/parking-spots',                                   [LandlordController::class, 'storeParkingSpot'])->name('dashboard.landlord.parking-spots.store');
        Route::delete('/landlord/parking-spots/images/{image}',                  [LandlordController::class, 'destroyImage'])->name('dashboard.landlord.parking-spots.image.destroy');
        Route::delete('/landlord/parking-spots/availability/{availability}',     [LandlordController::class, 'destroyAvailability'])->name('dashboard.landlord.parking-spots.availability.destroy');
        Route::get('/landlord/parking-spots/{spot}',                             [LandlordController::class, 'show'])->name('dashboard.landlord.parking-spots.show');
        Route::get('/landlord/parking-spots/{spot}/edit',                        [LandlordController::class, 'edit'])->name('dashboard.landlord.parking-spots.edit');
        Route::post('/landlord/parking-spots/{spot}',                            [LandlordController::class, 'updateParkingSpot'])->name('dashboard.landlord.parking-spots.update');
        Route::post('/landlord/parking-spots/{spot}/images',                     [LandlordController::class, 'storeImages'])->name('dashboard.landlord.parking-spots.images.store');
        Route::post('/landlord/parking-spots/{spot}/availability',               [LandlordController::class, 'storeAvailability'])->name('dashboard.landlord.parking-spots.availability.store');
    });
});
