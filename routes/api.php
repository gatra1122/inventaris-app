<?php

use App\Http\Controllers\API\AuthController as Auth;
use App\Http\Controllers\Api\UsersController as Users;
use App\Http\Controllers\Api\BarangController as Barang;
use App\Http\Controllers\Api\KategoriController  as Kategori;
use App\Http\Controllers\Api\SupplierController as Supplier;
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

// Public routes
Route::post('register', [Auth::class, 'register']);
Route::post('login', [Auth::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::controller(Auth::class)->group(function () {
        Route::post('logout', 'logout');
        Route::get('me', 'me');
    });

    // Users routes
    // Route::controller(Users::class)->group(function () {
    //     Route::get('users', 'index');
    //     Route::get('users/{id}', 'show');
    //     Route::put('users/{id}', 'update');
    //     Route::delete('users/{id}', 'destroy');
    // });

    // Barang routes
    // Route::controller(Barang::class)->group(function () {
    //     Route::get('barang', 'index');
    //     Route::get('barang/{id}', 'show');
    //     Route::put('barang/{id}', 'update');
    //     Route::delete('barang/{id}', 'destroy');
    // });

    // Kategori routes
    Route::controller(Kategori::class)->group(function () {
        Route::get('kategori', 'index');
        Route::get('kategori/{id}', 'show');
        Route::post('kategori', 'store');
        Route::put('kategori/{id}', 'update');
        Route::delete('kategori/{id}', 'destroy');
    });
    // Supplier routes
    Route::controller(Supplier::class)->group(function () {
        Route::get('supplier', 'index');
        Route::get('supplier/{id}', 'show');
        Route::post('supplier', 'store');
        Route::put('supplier/{id}', 'update');
        Route::delete('supplier/{id}', 'destroy');
    });
});
