<?php

namespace App\Exports;

use App\Models\Producto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ValorizacionExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function collection()
    {
        return Producto::with(['categoria:id,nombre'])
            ->where('activo', true)
            ->orderBy('categoria_id')
            ->orderBy('nombre')
            ->get()
            ->map(fn ($p) => [
                $p->codigo,
                $p->nombre,
                $p->categoria?->nombre ?? '-',
                $p->stock_actual,
                $p->stock_minimo,
                '$' . number_format($p->precio_compra ?? 0, 2),
                '$' . number_format($p->precio_venta ?? 0, 2),
                '$' . number_format(($p->stock_actual * $p->precio_compra), 2),
                '$' . number_format(($p->stock_actual * $p->precio_venta), 2),
            ]);
    }

    public function headings(): array
    {
        return ['Código', 'Producto', 'Categoría', 'Stock Actual', 'Stock Mín.', 'Costo Unit.', 'Precio Vta.', 'Valor Costo', 'Valor Venta'];
    }
}
