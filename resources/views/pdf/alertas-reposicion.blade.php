<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Alertas de Reposición</title>
<style>
    body { font-family: sans-serif; font-size: 11px; color: #333; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .sub { color: #666; font-size: 12px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e293b; color: #fff; padding: 8px 6px; text-align: left; font-size: 10px; }
    td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .danger { color: #dc2626; font-weight: 700; }
</style></head>
<body>
    <h1>Alertas de Reposición</h1>
    <p class="sub">Productos con stock por debajo del mínimo — {{ now()->format('d/m/Y') }}</p>
    <table>
        <thead><tr>
            <th>Código</th><th>Producto</th><th>Categoría</th><th>Proveedor</th><th>Stock Actual</th><th>Stock Mínimo</th><th>Faltante</th>
        </tr></thead>
        <tbody>
            @forelse($productos as $p)
            <tr>
                <td>{{ $p->codigo }}</td>
                <td>{{ $p->nombre }}</td>
                <td>{{ $p->categoria?->nombre ?? '-' }}</td>
                <td>{{ $p->proveedor?->nombre ?? '-' }}</td>
                <td class="danger">{{ $p->stock_actual }}</td>
                <td>{{ $p->stock_minimo }}</td>
                <td class="danger">{{ $p->stock_minimo - $p->stock_actual }}</td>
            </tr>
            @empty
            <tr><td colspan="7" style="text-align:center;color:#999;">Sin productos con stock bajo</td></tr>
            @endforelse
        </tbody>
    </table>
    <p style="margin-top:12px;font-size:9px;color:#999;">Generado el {{ now()->format('d/m/Y H:i') }}</p>
</body></html>
