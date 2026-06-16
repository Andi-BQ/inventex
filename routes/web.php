<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\MovimientoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ConfiguracionController;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'loginWeb']);
});

// Authenticated routes (Inertia pages + API)
Route::middleware(['auth:sanctum'])->group(function () {
    // Web - Inertia pages
    Route::get('/', fn () => redirect('/dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/productos', [ProductoController::class, 'paginaIndex']);
    Route::get('/productos/crear', [ProductoController::class, 'paginaCrear']);
    Route::get('/productos/{id}/editar', [ProductoController::class, 'paginaEditar']);

    Route::get('/categorias', [CategoriaController::class, 'paginaIndex']);
    Route::get('/categorias/crear', [CategoriaController::class, 'paginaCrear']);
    Route::get('/categorias/{id}/editar', [CategoriaController::class, 'paginaEditar']);

    Route::get('/proveedores', [ProveedorController::class, 'paginaIndex']);
    Route::get('/proveedores/crear', [ProveedorController::class, 'paginaCrear']);
    Route::get('/proveedores/{id}/editar', [ProveedorController::class, 'paginaEditar']);

    Route::get('/movimientos', [MovimientoController::class, 'paginaIndex']);
    Route::get('/movimientos/crear', [MovimientoController::class, 'paginaCrear']);

    Route::get('/usuarios', [UsuarioController::class, 'paginaIndex'])->middleware('role:administrador');
    Route::get('/usuarios/crear', [UsuarioController::class, 'paginaCrear'])->middleware('role:administrador');
    Route::get('/usuarios/{id}/editar', [UsuarioController::class, 'paginaEditar'])->middleware('role:administrador');

    Route::get('/reportes', fn () => Inertia::render('Reportes', [
        'filters' => ['fecha_inicio' => request('fecha_inicio'), 'fecha_fin' => request('fecha_fin')],
    ]));
    Route::get('/reportes/exportar/{reporte}/{formato}', [ReporteController::class, 'exportar']);
    Route::get('/configuracion', [ConfiguracionController::class, 'index']);
    Route::post('/configuracion/general', [ConfiguracionController::class, 'updateGeneral'])->name('configuracion.general');
    Route::post('/configuracion/perfil', [ConfiguracionController::class, 'updatePerfil'])->name('configuracion.perfil');
    Route::put('/configuracion/password', [ConfiguracionController::class, 'updatePassword'])->name('configuracion.password');
    Route::put('/configuracion/preferencias', [ConfiguracionController::class, 'updatePreferencias'])->name('configuracion.preferencias');
    Route::put('/configuracion/tema', [ConfiguracionController::class, 'updateTema'])->name('configuracion.tema');

    Route::get('/perfil', [AuthController::class, 'perfil']);
    Route::put('/perfil/password', [AuthController::class, 'cambiarPassword']);

    Route::post('/logout', [AuthController::class, 'loginWebLogout']);

    // Web CRUD — Inertia form submissions (POST/PUT/DELETE)
    Route::post('/productos', [ProductoController::class, 'inertiaStore']);
    Route::put('/productos/{id}', [ProductoController::class, 'inertiaUpdate']);
    Route::delete('/productos/{id}', [ProductoController::class, 'inertiaDestroy']);

    Route::post('/categorias', [CategoriaController::class, 'inertiaStore']);
    Route::put('/categorias/{id}', [CategoriaController::class, 'inertiaUpdate']);
    Route::delete('/categorias/{id}', [CategoriaController::class, 'inertiaDestroy']);

    Route::post('/proveedores', [ProveedorController::class, 'inertiaStore']);
    Route::put('/proveedores/{id}', [ProveedorController::class, 'inertiaUpdate']);
    Route::delete('/proveedores/{id}', [ProveedorController::class, 'inertiaDestroy']);

    Route::post('/movimientos', [MovimientoController::class, 'inertiaStore']);

    Route::post('/usuarios', [UsuarioController::class, 'inertiaStore'])->middleware('role:administrador');
    Route::put('/usuarios/{id}', [UsuarioController::class, 'inertiaUpdate'])->middleware('role:administrador');
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'inertiaDestroy'])->middleware('role:administrador');

    // API - JSON endpoints (backward compat)
    Route::prefix('api')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/movimientos-semana', [DashboardController::class, 'movimientosSemana']);
        Route::get('/dashboard/alertas-stock', [DashboardController::class, 'alertasStock']);
        Route::get('/dashboard/actividad-reciente', [DashboardController::class, 'actividadReciente']);
        Route::get('/dashboard/top-productos', [DashboardController::class, 'topProductos']);
        Route::get('/dashboard/empleado', [DashboardController::class, 'empleado']);

        Route::get('/productos', [ProductoController::class, 'index']);
        Route::post('/productos', [ProductoController::class, 'store']);
        Route::get('/productos/{id}', [ProductoController::class, 'show']);
        Route::put('/productos/{id}', [ProductoController::class, 'update']);
        Route::patch('/productos/{id}/toggle', [ProductoController::class, 'toggleActivo']);
        Route::get('/productos/bajo-stock', [ProductoController::class, 'bajoStock']);
        Route::get('/productos/valor-inventario', [ProductoController::class, 'valorInventario']);
        Route::get('/productos/autocomplete', [ProductoController::class, 'autocomplete']);

        Route::get('/categorias', [CategoriaController::class, 'index']);
        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
        Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
        Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

        Route::get('/proveedores', [ProveedorController::class, 'index']);
        Route::post('/proveedores', [ProveedorController::class, 'store']);
        Route::get('/proveedores/{id}', [ProveedorController::class, 'show']);
        Route::put('/proveedores/{id}', [ProveedorController::class, 'update']);
        Route::get('/proveedores/{id}/productos', [ProveedorController::class, 'showWithProducts']);
        Route::patch('/proveedores/{id}/toggle', [ProveedorController::class, 'toggleActivo']);

        Route::get('/movimientos', [MovimientoController::class, 'index']);
        Route::post('/movimientos', [MovimientoController::class, 'store']);
        Route::get('/movimientos/mios', [MovimientoController::class, 'mios']);
        Route::get('/movimientos/estadisticas-semana', [MovimientoController::class, 'estadisticasSemana']);
        Route::get('/movimientos/resumen-mes', [MovimientoController::class, 'resumenMes']);

        Route::get('/usuarios', [UsuarioController::class, 'index'])->middleware('role:administrador');
        Route::post('/usuarios', [UsuarioController::class, 'store'])->middleware('role:administrador');
        Route::get('/usuarios/{id}', [UsuarioController::class, 'show'])->middleware('role:administrador');
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->middleware('role:administrador');

        Route::get('/notificaciones', [NotificacionController::class, 'index']);
        Route::get('/notificaciones/no-leidas', [NotificacionController::class, 'noLeidas']);
        Route::patch('/notificaciones/{id}/leida', [NotificacionController::class, 'marcarLeida']);
        Route::patch('/notificaciones/leidas-todas', [NotificacionController::class, 'marcarTodasLeidas']);
        Route::delete('/notificaciones/{id}', [NotificacionController::class, 'destroy']);

        Route::get('/auth/me', [AuthController::class, 'me']);
    });
});
