<?php

namespace App\Exports;

use App\Models\Producto;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AlertasReposicionExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    public function collection()
    {
        return Producto::with(['categoria:id,nombre', 'proveedor:id,nombre'])
            ->where('activo', true)
            ->whereColumn('stock_actual', '<=', 'stock_minimo')
            ->orderBy('stock_actual')
            ->limit(100)
            ->get()
            ->map(fn ($p) => [
                $p->codigo,
                $p->nombre,
                $p->categoria?->nombre ?? '-',
                $p->proveedor?->nombre ?? '-',
                $p->stock_actual,
                $p->stock_minimo,
                $p->stock_minimo - $p->stock_actual,
            ]);
    }

    public function headings(): array
    {
        return ['Código', 'Producto', 'Categoría', 'Proveedor', 'Stock Actual', 'Stock Mínimo', 'Faltante'];
    }
}
