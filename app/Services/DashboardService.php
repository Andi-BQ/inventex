<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\Movimiento;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(): array
    {
        $productosStats = Producto::where('activo', true)
            ->selectRaw('
                COUNT(*) as total_productos,
                COALESCE(SUM(CASE WHEN stock_actual <= stock_minimo THEN 1 ELSE 0 END), 0) as bajo_stock,
                COALESCE(SUM(CASE WHEN stock_actual = 0 THEN 1 ELSE 0 END), 0) as sin_stock,
                COALESCE(SUM(stock_actual * precio_compra), 0) as valor_total,
                COALESCE(SUM(stock_actual * precio_venta), 0) as valor_venta,
                COALESCE(SUM(stock_actual), 0) as total_unidades
            ')
            ->first();

        $hoy = Movimiento::whereDate('created_at', today())
            ->selectRaw("
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0) as entradas_hoy,
                COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0) as salidas_hoy,
                COUNT(*) as total_hoy
            ")
            ->first();

        return [
            'total_productos' => (int) ($productosStats->total_productos ?? 0),
            'productos_bajo_stock' => (int) ($productosStats->bajo_stock ?? 0),
            'productos_sin_stock' => (int) ($productosStats->sin_stock ?? 0),
            'entradas_hoy' => (int) ($hoy->entradas_hoy ?? 0),
            'salidas_hoy' => (int) ($hoy->salidas_hoy ?? 0),
            'movimientos_hoy' => (int) ($hoy->total_hoy ?? 0),
            'valor_inventario' => (float) ($productosStats->valor_total ?? 0),
            'valor_venta' => (float) ($productosStats->valor_venta ?? 0),
            'total_unidades' => (int) ($productosStats->total_unidades ?? 0),
        ];
    }

    public function getMovimientosSemana(): array
    {
        $rows = Movimiento::where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw("
                DATE(created_at) as fecha,
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0) as entradas,
                COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0) as salidas
            ")
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('fecha')
            ->get()
            ->keyBy('fecha');

        $result = [];
        for ($i = 6; $i >= 0; $i--) {
            $fecha = today()->subDays($i)->toDateString();
            $found = $rows->get($fecha);
            $result[] = [
                'fecha' => $fecha,
                'entradas' => (int) ($found->entradas ?? 0),
                'salidas' => (int) ($found->salidas ?? 0),
            ];
        }

        return $result;
    }

    public function getAlertasStock(): array
    {
        return Producto::with(['categoria:id,nombre,color,icono', 'proveedor:id,nombre'])
            ->where('activo', true)
            ->whereColumn('stock_actual', '<=', 'stock_minimo')
            ->orderBy('stock_actual')
            ->limit(10)
            ->get()
            ->toArray();
    }

    public function getActividadReciente(): array
    {
        return Movimiento::with([
            'producto:id,codigo,nombre',
            'usuario:id,nombre_completo',
        ])
            ->latest()
            ->limit(8)
            ->get()
            ->toArray();
    }

    public function getTopProductos(int $limit = 5): array
    {
        return Movimiento::selectRaw('
                producto_id,
                SUM(cantidad) as total_salidas,
                COUNT(*) as num_movimientos
            ')
            ->where('tipo', 'salida')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->groupBy('producto_id')
            ->orderByDesc('total_salidas')
            ->limit($limit)
            ->with('producto:id,codigo,nombre')
            ->get()
            ->toArray();
    }

    public function getEmpleado(int $usuarioId): array
    {
        $disponibles = Producto::where('activo', true)->where('stock_actual', '>', 0)->count();
        $bajoStock = Producto::where('activo', true)->whereColumn('stock_actual', '<=', 'stock_minimo')->count();

        $misMovHoy = Movimiento::where('usuario_id', $usuarioId)
            ->whereDate('created_at', today())
            ->count();

        $misMovMes = Movimiento::where('usuario_id', $usuarioId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->selectRaw("
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0) as entradas,
                COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0) as salidas
            ")
            ->first();

        return [
            'productos_disponibles' => $disponibles,
            'productos_bajo_stock' => $bajoStock,
            'mis_movimientos_hoy' => $misMovHoy,
            'mis_entradas_mes' => (int) ($misMovMes->entradas ?? 0),
            'mis_salidas_mes' => (int) ($misMovMes->salidas ?? 0),
        ];
    }
}
