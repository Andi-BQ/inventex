<?php

namespace App\Exports;

use App\Models\Movimiento;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class MovimientosPeriodoExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected $desde;
    protected $hasta;

    public function __construct(?string $desde, ?string $hasta)
    {
        $this->desde = $desde;
        $this->hasta = $hasta;
    }

    public function collection()
    {
        return Movimiento::with(['producto:id,codigo,nombre', 'usuario:id,nombre_completo'])
            ->entreFechas($this->desde, $this->hasta)
            ->latest()
            ->get()
            ->map(fn ($m) => [
                $m->created_at->format('d/m/Y H:i'),
                ucfirst($m->tipo),
                $m->producto?->codigo . ' - ' . $m->producto?->nombre,
                $m->cantidad,
                '$' . number_format($m->precio_compra_momento ?? 0, 2),
                '$' . number_format($m->precio_venta_momento ?? 0, 2),
                $m->stock_anterior,
                $m->stock_nuevo,
                $m->motivo,
                $m->usuario?->nombre_completo,
                $m->observaciones,
            ]);
    }

    public function headings(): array
    {
        return ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Costo Unit.', 'Precio Vta.', 'Stock Ant.', 'Stock Nuevo', 'Motivo', 'Usuario', 'Observaciones'];
    }
}
