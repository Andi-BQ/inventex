<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Movimientos por Período</title>
<style>
    body { font-family: sans-serif; font-size: 11px; color: #333; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .sub { color: #666; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e293b; color: #fff; padding: 8px 6px; text-align: left; font-size: 9px; }
    td { padding: 5px 6px; border-bottom: 1px solid #e2e8f0; font-size: 9px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .tag { display: inline-block; padding: 1px 6px; border-radius: 999px; font-size: 8px; font-weight: 700; }
    .entrada { background: #dcfce7; color: #166534; }
    .salida { background: #fee2e2; color: #991b1b; }
    .ajuste { background: #fef3c7; color: #92400e; }
</style></head>
<body>
    <h1>Movimientos por Período</h1>
    <p class="sub">{{ $desde ?: '—' }} al {{ $hasta ?: '—' }} &middot; {{ count($movimientos) }} registros</p>
    <table>
        <thead><tr>
            <th>Fecha</th><th>Tipo</th><th>Producto</th><th>Cant.</th><th>Costo U.</th><th>Precio V.</th><th>Stock Ant.</th><th>Stock Nuevo</th><th>Motivo</th><th>Usuario</th>
        </tr></thead>
        <tbody>
            @forelse($movimientos as $m)
            <tr>
                <td>{{ $m->created_at->format('d/m/Y H:i') }}</td>
                <td><span class="tag {{ $m->tipo === 'entrada' ? 'entrada' : ($m->tipo === 'salida' ? 'salida' : 'ajuste') }}">{{ ucfirst($m->tipo) }}</span></td>
                <td>{{ $m->producto?->codigo }} - {{ $m->producto?->nombre }}</td>
                <td>{{ $m->cantidad }}</td>
                <td>${{ number_format($m->precio_compra_momento ?? 0, 2) }}</td>
                <td>${{ number_format($m->precio_venta_momento ?? 0, 2) }}</td>
                <td>{{ $m->stock_anterior }}</td>
                <td>{{ $m->stock_nuevo }}</td>
                <td>{{ $m->motivo }}</td>
                <td>{{ $m->usuario?->nombre_completo }}</td>
            </tr>
            @empty
            <tr><td colspan="10" style="text-align:center;color:#999;">Sin movimientos en este período</td></tr>
            @endforelse
        </tbody>
    </table>
    <p style="margin-top:12px;font-size:9px;color:#999;">Generado el {{ now()->format('d/m/Y H:i') }}</p>
</body></html>
