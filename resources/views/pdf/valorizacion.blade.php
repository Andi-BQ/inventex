<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Valorización de Inventario</title>
<style>
    body { font-family: sans-serif; font-size: 11px; color: #333; }
    h1 { font-size: 18px; margin-bottom: 4px; }
    .sub { color: #666; font-size: 12px; margin-bottom: 16px; }
    .summary { display: flex; gap: 16px; margin-bottom: 16px; }
    .box { background: #f1f5f9; border-radius: 8px; padding: 10px 14px; flex: 1; }
    .box .label { font-size: 9px; color: #64748b; text-transform: uppercase; }
    .box .value { font-size: 16px; font-weight: 700; color: #1e293b; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e293b; color: #fff; padding: 8px 6px; text-align: left; font-size: 9px; }
    td { padding: 5px 6px; border-bottom: 1px solid #e2e8f0; font-size: 9px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .total { font-weight: 700; background: #e2e8f0 !important; }
</style></head>
<body>
    <h1>Valorización de Inventario</h1>
    <p class="sub">Al {{ now()->format('d/m/Y') }} &middot; {{ $productos->count() }} productos activos</p>

    <div class="summary">
        <div class="box"><div class="label">Total Productos</div><div class="value">{{ $totalProductos }}</div></div>
        <div class="box"><div class="label">Valor Costo Total</div><div class="value">${{ number_format($valorTotal, 2) }}</div></div>
        <div class="box"><div class="label">Valor Venta Total</div><div class="value">${{ number_format($valorVenta, 2) }}</div></div>
    </div>

    <table>
        <thead><tr>
            <th>Código</th><th>Producto</th><th>Categoría</th><th>Stock</th><th>Stock Mín.</th><th>Costo U.</th><th>Precio V.</th><th>Valor Costo</th><th>Valor Venta</th>
        </tr></thead>
        <tbody>
            @forelse($productos as $p)
            <tr>
                <td>{{ $p->codigo }}</td>
                <td>{{ $p->nombre }}</td>
                <td>{{ $p->categoria?->nombre ?? '-' }}</td>
                <td>{{ $p->stock_actual }}</td>
                <td>{{ $p->stock_minimo }}</td>
                <td>${{ number_format($p->precio_compra ?? 0, 2) }}</td>
                <td>${{ number_format($p->precio_venta ?? 0, 2) }}</td>
                <td>${{ number_format($p->stock_actual * $p->precio_compra, 2) }}</td>
                <td>${{ number_format($p->stock_actual * $p->precio_venta, 2) }}</td>
            </tr>
            @empty
            <tr><td colspan="9" style="text-align:center;color:#999;">Sin productos activos</td></tr>
            @endforelse
        </tbody>
    </table>
    <p style="margin-top:12px;font-size:9px;color:#999;">Generado el {{ now()->format('d/m/Y H:i') }}</p>
</body></html>
