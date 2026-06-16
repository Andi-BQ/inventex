<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Productos Más Rotados</title>
<style>
    body { font-family: sans-serif; font-size: 11px; color: #333; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .sub { color: #666; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e293b; color: #fff; padding: 8px 6px; text-align: left; font-size: 10px; }
    td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    tr:nth-child(even) td { background: #f8fafc; }
</style></head>
<body>
    <h1>Productos Más Rotados</h1>
    <p class="sub">{{ now()->format('F Y') }}</p>
    <table>
        <thead><tr>
            <th>#</th><th>Código</th><th>Producto</th><th>Categoría</th><th>Unidades Vend.</th><th>Veces Vendido</th><th>Precio Venta</th>
        </tr></thead>
        <tbody>
            @forelse($productos as $i => $m)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $m->producto?->codigo }}</td>
                <td>{{ $m->producto?->nombre }}</td>
                <td>{{ $m->producto?->categoria?->nombre ?? '-' }}</td>
                <td>{{ $m->total_salidas }}</td>
                <td>{{ $m->num_movimientos }}</td>
                <td>${{ number_format($m->producto?->precio_venta ?? 0, 2) }}</td>
            </tr>
            @empty
            <tr><td colspan="7" style="text-align:center;color:#999;">Sin datos este mes</td></tr>
            @endforelse
        </tbody>
    </table>
    <p style="margin-top:12px;font-size:9px;color:#999;">Generado el {{ now()->format('d/m/Y H:i') }}</p>
</body></html>
