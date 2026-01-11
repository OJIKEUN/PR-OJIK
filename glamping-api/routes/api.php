<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Admin\LocationController as AdminLocationController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\SettingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public API Routes
Route::prefix('v1')->group(function () {
    // Packages
    Route::get('/packages', [PackageController::class, 'index']);
    Route::get('/packages/featured', [PackageController::class, 'featured']);
    Route::get('/packages/{slug}', [PackageController::class, 'show']);
    Route::get('/packages/{id}/availability', [PackageController::class, 'availability']);

    // Locations
    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/locations/{id}', [LocationController::class, 'show']);

    // Reservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/check', [ReservationController::class, 'check']);

    // Galleries
    Route::get('/galleries', [GalleryController::class, 'index']);
    Route::get('/galleries/featured', [GalleryController::class, 'featured']);

    // Pages
    Route::get('/pages/{slug}', [PageController::class, 'show']);
});

// Admin API Routes
Route::prefix('admin')->group(function () {
    // Auth
    Route::post('/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Packages CRUD
        Route::get('/packages', [AdminPackageController::class, 'index']);
        Route::post('/packages', [AdminPackageController::class, 'store']);
        Route::get('/packages/{id}', [AdminPackageController::class, 'show']);
        Route::put('/packages/{id}', [AdminPackageController::class, 'update']);
        Route::delete('/packages/{id}', [AdminPackageController::class, 'destroy']);

        // Locations CRUD
        Route::get('/locations', [AdminLocationController::class, 'index']);
        Route::post('/locations', [AdminLocationController::class, 'store']);
        Route::get('/locations/{id}', [AdminLocationController::class, 'show']);
        Route::put('/locations/{id}', [AdminLocationController::class, 'update']);
        Route::delete('/locations/{id}', [AdminLocationController::class, 'destroy']);

        // Galleries CRUD
        Route::get('/galleries', [AdminGalleryController::class, 'index']);
        Route::post('/galleries', [AdminGalleryController::class, 'store']);
        Route::get('/galleries/{id}', [AdminGalleryController::class, 'show']);
        Route::put('/galleries/{id}', [AdminGalleryController::class, 'update']);
        Route::delete('/galleries/{id}', [AdminGalleryController::class, 'destroy']);

        // Pages
        Route::get('/pages', [AdminPageController::class, 'index']);
        Route::get('/pages/{id}', [AdminPageController::class, 'show']);
        Route::put('/pages/{id}', [AdminPageController::class, 'update']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);

        // Reservations
        Route::get('/reservations', [AdminReservationController::class, 'index']);
        Route::get('/reservations/{id}', [AdminReservationController::class, 'show']);
        Route::patch('/reservations/{id}/status', [AdminReservationController::class, 'updateStatus']);
    });
});
