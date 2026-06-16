<?php

namespace App\Http\Controllers;

use App\Exports\AlertasReposicionExport;
use App\Exports\MovimientosPeriodoExport;
use App\Exports\ProductosTopExport;
use App\Exports\ValorizacionExport;
use App\Models\Movimiento;
use App\Models\Producto;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ReporteController extends Controller
{
    public function exportar(Request $request, string $reporte, string $formato)
    {
        $desde = $request->query('desde');
        $hasta = $request->query('hasta');

        $nombre = match ($reporte) {
            'movimientos' => 'movimientos-periodo',
            'top-productos' => 'productos-mas-rotados',
            'valorizacion' => 'valorizacion-inventario',
            'alertas' => 'alertas-reposicion',
            default => abort(404),
        };

        if ($formato === 'excel') {
            $export = match ($reporte) {
                'movimientos' => new MovimientosPeriodoExport($desde, $hasta),
                'top-productos' => new ProductosTopExport,
                'valorizacion' => new ValorizacionExport,
                'alertas' => new AlertasReposicionExport,
            };

            return Excel::download($export, "{$nombre}.xlsx");
        }

        if ($formato === 'pdf') {
            $data = match ($reporte) {
                    'movimientos' => [
                        'movimientos' => Movimiento::with(['producto:id,codigo,nombre', 'usuario:id,nombre_completo'])
                            ->entreFechas($desde, $hasta)
                            ->latest()
                            ->limit(2000)
                            ->get(),
                        'desde' => $desde,
                        'hasta' => $hasta,
                    ],
                'top-productos' => [
                    'productos' => Movimiento::selectRaw('
                            producto_id,
                            SUM(cantidad) as total_salidas,
                            COUNT(*) as num_movimientos
                        ')
                        ->where('tipo', 'salida')
                        ->where('created_at', '>=', now()->startOfMonth())
                        ->where('created_at', '<=', now()->endOfMonth())
                        ->groupBy('producto_id')
                        ->orderByDesc('total_salidas')
                        ->limit(50)
                        ->with(['producto:id,codigo,nombre,categoria_id,precio_venta', 'producto.categoria:id,nombre'])
                        ->get(),
                ],
                'valorizacion' => [
                    'productos' => Producto::with('categoria:id,nombre')
                        ->where('activo', true)
                        ->orderBy('nombre')
                        ->limit(2000)
                        ->get(),
                    'totalProductos' => Producto::where('activo', true)->count(),
                    'valorTotal' => Producto::where('activo', true)
                        ->selectRaw('COALESCE(SUM(stock_actual * precio_compra), 0) as total')
                        ->value('total') ?? 0,
                    'valorVenta' => Producto::where('activo', true)
                        ->selectRaw('COALESCE(SUM(stock_actual * precio_venta), 0) as total')
                        ->value('total') ?? 0,
                ],
                'alertas' => [
                    'productos' => Producto::with(['categoria:id,nombre', 'proveedor:id,nombre'])
                        ->where('activo', true)
                        ->whereColumn('stock_actual', '<=', 'stock_minimo')
                        ->orderBy('stock_actual')
                        ->limit(100)
                        ->get(),
                ],
            };

            $pdf = Pdf::loadView("pdf.{$nombre}", $data);
            return $pdf->download("{$nombre}.pdf");
        }

        abort(404);
    }
}
