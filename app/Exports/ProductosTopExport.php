<?php

namespace App\Exports;

use App\Models\Movimiento;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ProductosTopExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function collection()
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
            ->limit(50)
            ->with(['producto:id,codigo,nombre,categoria_id,precio_venta', 'producto.categoria:id,nombre'])
            ->get()
            ->map(fn ($m) => [
                $m->producto?->codigo,
                $m->producto?->nombre,
                $m->producto?->categoria?->nombre ?? '-',
                $m->total_salidas,
                $m->num_movimientos,
                '$' . number_format($m->producto?->precio_venta ?? 0, 2),
            ]);
    }

    public function headings(): array
    {
        return ['Código', 'Producto', 'Categoría', 'Unidades Vendidas', 'Veces Vendido', 'Precio Venta'];
    }
}
