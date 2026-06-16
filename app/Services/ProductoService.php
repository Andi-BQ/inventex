<?php

namespace App\Services;

use App\Models\Producto;
use App\Models\Movimiento;
use Illuminate\Support\Facades\DB;

class ProductoService
{
    public function listar(array $filters = []): array
    {
        $query = Producto::with(['categoria:id,nombre,color,icono', 'proveedor:id,nombre'])
            ->activo();

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }
        if (!empty($filters['categoria_id'])) {
            $query->where('categoria_id', $filters['categoria_id']);
        }
        if (!empty($filters['proveedor_id'])) {
            $query->where('proveedor_id', $filters['proveedor_id']);
        }
        if (!empty($filters['estado_stock'])) {
            match ($filters['estado_stock']) {
                'sin_stock' => $query->sinStock(),
                'bajo' => $query->bajoStock(),
                default => null,
            };
        }

        $allowedOrder = ['nombre', 'codigo', 'stock_actual', 'precio_venta', 'created_at'];
        $orderBy = $filters['orderBy'] ?? 'nombre';
        $orderBy = in_array($orderBy, $allowedOrder) ? $orderBy : 'nombre';
        $orderDir = strtoupper($filters['orderDir'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';

        $page = max(1, (int) ($filters['page'] ?? 1));
        $limit = max(1, min(100, (int) ($filters['limit'] ?? 20)));

        $paginator = $query->orderBy($orderBy, $orderDir)->paginate($limit, ['*'], 'page', $page);

        return [
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ];
    }

    public function getById(int $id): ?Producto
    {
        return Producto::with(['categoria:id,nombre,color,icono', 'proveedor:id,nombre'])->find($id);
    }

    public function create(array $data): Producto
    {
        return DB::transaction(function () use ($data) {
            return Producto::create($data);
        });
    }

    public function update(int $id, array $data): Producto
    {
        return DB::transaction(function () use ($id, $data) {
            $producto = Producto::findOrFail($id);
            $producto->update($data);
            return $producto->fresh()->load(['categoria:id,nombre,color,icono', 'proveedor:id,nombre']);
        });
    }

    public function toggleActivo(int $id): Producto
    {
        return DB::transaction(function () use ($id) {
            $producto = Producto::findOrFail($id);
            $producto->update(['activo' => !$producto->activo]);
            return $producto->fresh();
        });
    }

    public function buscarAutocomplete(string $term): array
    {
        if (strlen($term) < 2) return [];

        return Producto::with(['categoria:id,nombre,color,icono', 'proveedor:id,nombre'])
            ->where('activo', true)
            ->where('stock_actual', '>', 0)
            ->where(function ($q) use ($term) {
                $q->where('nombre', 'like', "%{$term}%")
                  ->orWhere('codigo', 'like', "%{$term}%");
            })
            ->orderBy('nombre')
            ->limit(8)
            ->get()
            ->toArray();
    }

    public function getBajoStock(): array
    {
        return Producto::with(['categoria:id,nombre,color,icono', 'proveedor:id,nombre'])
            ->where('activo', true)
            ->whereColumn('stock_actual', '<=', 'stock_minimo')
            ->orderBy('stock_actual')
            ->limit(50)
            ->get()
            ->toArray();
    }

    public function getValorInventario(): array
    {
        $result = Producto::where('activo', true)
            ->selectRaw('
                COALESCE(SUM(stock_actual * precio_compra), 0) as valor_total,
                COALESCE(SUM(stock_actual * precio_venta), 0) as valor_venta,
                COUNT(*) as total_productos,
                COALESCE(SUM(stock_actual), 0) as total_unidades
            ')
            ->first();

        return [
            'valor_total' => (float) ($result->valor_total ?? 0),
            'valor_venta' => (float) ($result->valor_venta ?? 0),
            'total_productos' => (int) ($result->total_productos ?? 0),
            'total_unidades' => (int) ($result->total_unidades ?? 0),
        ];
    }

    public function updateStock(\Illuminate\Database\Eloquent\Model $producto, int $nuevoStock): void
    {
        $producto->update(['stock_actual' => $nuevoStock]);
    }
}
