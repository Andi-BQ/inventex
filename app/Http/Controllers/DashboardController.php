<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Movimiento;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {
        $stats = $this->dashboardService->getStats();
        $actividadReciente = $this->dashboardService->getActividadReciente();
        $alertasStock = $this->dashboardService->getAlertasStock();

        $diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        $ventasSemana = Movimiento::where('tipo', 'salida')
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw("
                DATE(created_at) as fecha,
                SUM(cantidad * precio_venta_momento) as total_venta,
                SUM(cantidad) as unidades
            ")
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('fecha')
            ->get()
            ->keyBy('fecha');

        $ventasSemanaData = [];
        for ($i = 6; $i >= 0; $i--) {
            $fecha = today()->subDays($i);
            $key = $fecha->toDateString();
            $found = $ventasSemana->get($key);
            $ventasSemanaData[] = [
                'dia' => $diasSemana[$fecha->dayOfWeek],
                'fecha' => $key,
                'total_venta' => (float) ($found->total_venta ?? 0),
                'unidades' => (int) ($found->unidades ?? 0),
            ];
        }

        $topProductos = Movimiento::where('tipo', 'salida')
            ->selectRaw('
                producto_id,
                SUM(cantidad) as total_unidades,
                SUM(cantidad * precio_venta_momento) as total_ingreso,
                COUNT(*) as num_transacciones
            ')
            ->groupBy('producto_id')
            ->orderByDesc('total_unidades')
            ->limit(5)
            ->with('producto:id,codigo,nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->producto_id,
                'nombre' => $m->producto?->nombre ?? 'Producto #' . $m->producto_id,
                'codigo' => $m->producto?->codigo ?? '',
                'total_unidades' => (int) $m->total_unidades,
                'total_ingreso' => (float) $m->total_ingreso,
                'num_transacciones' => (int) $m->num_transacciones,
            ]);

        $distribucionCategorias = Producto::where('productos.activo', true)
            ->join('categorias', 'productos.categoria_id', '=', 'categorias.id')
            ->selectRaw('
                categorias.id,
                categorias.nombre,
                categorias.color,
                COUNT(productos.id) as total_productos,
                COALESCE(SUM(productos.stock_actual * productos.precio_compra), 0) as valor_inventario
            ')
            ->groupBy('categorias.id', 'categorias.nombre', 'categorias.color')
            ->orderByDesc('total_productos')
            ->get()
            ->toArray();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'actividadReciente' => $actividadReciente,
            'alertasStock' => $alertasStock,
            'ventasSemana' => $ventasSemanaData,
            'topProductos' => $topProductos,
            'distribucionCategorias' => $distribucionCategorias,
        ]);
    }

    public function stats(): JsonResponse
    {
        $data = $this->dashboardService->getStats();
        return response()->json(['data' => $data]);
    }

    public function movimientosSemana(): JsonResponse
    {
        $data = $this->dashboardService->getMovimientosSemana();
        return response()->json(['data' => $data]);
    }

    public function alertasStock(): JsonResponse
    {
        $data = $this->dashboardService->getAlertasStock();
        return response()->json(['data' => $data]);
    }

    public function actividadReciente(): JsonResponse
    {
        $data = $this->dashboardService->getActividadReciente();
        return response()->json(['data' => $data]);
    }

    public function topProductos(): JsonResponse
    {
        $data = $this->dashboardService->getTopProductos();
        return response()->json(['data' => $data]);
    }

    public function empleado(Request $request): JsonResponse
    {
        $data = $this->dashboardService->getEmpleado($request->user()->id);
        return response()->json(['data' => $data]);
    }
}
