<?php

namespace App\Http\Controllers;

use App\Http\Requests\MovimientoRequest;
use App\Models\Movimiento;
use App\Models\Producto;
use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MovimientoController extends Controller
{
    public function paginaIndex(Request $request)
    {
        $query = Movimiento::with(['producto:id,codigo,nombre,unidad_medida', 'usuario:id,nombre_completo,email']);

        if ($request->filled('tipo')) $query->where('tipo', $request->tipo);
        if ($search = $request->query('search')) {
            $query->whereHas('producto', function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")->orWhere('codigo', 'like', "%{$search}%");
            });
        }

        $paginator = $query->orderByDesc('created_at')->paginate(20);

        return Inertia::render('Movimientos', [
            'movimientos' => [
                'data' => $paginator->items(),
                'pagination' => [
                    'total' => $paginator->total(),
                    'page' => $paginator->currentPage(),
                    'totalPages' => $paginator->lastPage(),
                ],
            ],
        ]);
    }

    public function inertiaStore(MovimientoRequest $request)
    {
        $data = $request->validated();

        try {
            DB::transaction(function () use ($data, $request) {
                $producto = Producto::where('id', $data['producto_id'])->lockForUpdate()->first();

                if (!$producto) {
                    throw new \Symfony\Component\HttpKernel\Exception\HttpException(404, 'El producto no existe.');
                }
                if (!$producto->activo) {
                    throw new \Symfony\Component\HttpKernel\Exception\HttpException(400, 'El producto está inactivo.');
                }

                $stockAnterior = $producto->stock_actual;
                $delta = $data['tipo'] === 'entrada' ? $data['cantidad'] : -$data['cantidad'];
                $stockNuevo = $stockAnterior + $delta;

                if ($stockNuevo < 0) {
                    throw new \Symfony\Component\HttpKernel\Exception\HttpException(400, "Stock insuficiente. Disponible: {$stockAnterior} {$producto->unidad_medida}.");
                }

                Movimiento::create([
                    'producto_id' => $data['producto_id'],
                    'usuario_id' => $request->user()->id,
                    'tipo' => $data['tipo'],
                    'cantidad' => $data['cantidad'],
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'precio_compra_momento' => $producto->precio_compra,
                    'precio_venta_momento' => $producto->precio_venta,
                    'motivo' => $data['motivo'] ?? null,
                    'observaciones' => $data['observaciones'] ?? null,
                ]);

                $producto->update(['stock_actual' => $stockNuevo]);

                if ($stockNuevo <= $producto->stock_minimo) {
                    $admins = User::where('rol', 'administrador')->where('activo', true)->get();
                    foreach ($admins as $admin) {
                        Notificacion::create([
                            'usuario_id' => $admin->id,
                            'tipo' => 'stock_bajo',
                            'titulo' => $stockNuevo === 0 ? "Producto agotado: {$producto->nombre}" : "Stock bajo: {$producto->nombre}",
                            'mensaje' => $stockNuevo === 0
                                ? "El producto \"{$producto->nombre}\" se ha agotado."
                                : "El producto \"{$producto->nombre}\" tiene {$stockNuevo} {$producto->unidad_medida} (mínimo: {$producto->stock_minimo}).",
                        ]);
                    }
                }
            });

            return redirect('/movimientos')->with('success', 'Movimiento registrado correctamente.');
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return redirect('/movimientos/crear')->with('error', $e->getMessage());
        }
    }

    public function paginaCrear()
    {
        return Inertia::render('Movimientos/Crear', [
            'productos' => Producto::where('activo', true)->orderBy('nombre')->get(['id', 'codigo', 'nombre', 'stock_actual']),
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Movimiento::with([
            'producto:id,codigo,nombre,unidad_medida',
            'usuario:id,nombre_completo,email',
        ]);

        if ($request->filled('producto_id')) {
            $query->where('producto_id', $request->producto_id);
        }
        if ($request->filled('usuario_id')) {
            $query->where('usuario_id', $request->usuario_id);
        }
        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }
        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }
        if ($search = $request->query('search')) {
            $query->whereHas('producto', function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                  ->orWhere('codigo', 'like', "%{$search}%");
            })->orWhere('motivo', 'like', "%{$search}%");
        }

        $page = max(1, (int) ($request->query('page', 1)));
        $limit = max(1, min(100, (int) ($request->query('limit', 20))));

        $paginator = $query->orderByDesc('created_at')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(MovimientoRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!in_array($data['tipo'], ['entrada', 'salida', 'ajuste'])) {
            return response()->json(['error' => 'Tipo de movimiento inválido.'], 400);
        }

        try {
            $result = DB::transaction(function () use ($data, $request) {
                $producto = Producto::where('id', $data['producto_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$producto) {
                    abort(404, 'El producto no existe.');
                }

                if (!$producto->activo) {
                    abort(400, 'El producto está inactivo.');
                }

                $stockAnterior = $producto->stock_actual;
                $cantidadReal = $data['cantidad'];
                $stockNuevo = $stockAnterior;

                if ($data['tipo'] === 'ajuste') {
                    $cantidadReal = abs($data['cantidad'] - $stockAnterior);
                    $stockNuevo = $data['cantidad'];
                } else {
                    $delta = $data['tipo'] === 'entrada' ? $data['cantidad'] : -$data['cantidad'];
                    $stockNuevo = $stockAnterior + $delta;
                }

                if ($stockNuevo < 0) {
                    abort(400, "Stock insuficiente. Disponible: {$stockAnterior} {$producto->unidad_medida}.");
                }

                $movimiento = Movimiento::create([
                    'producto_id' => $data['producto_id'],
                    'usuario_id' => $request->user()->id,
                    'tipo' => $data['tipo'],
                    'cantidad' => $cantidadReal,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'motivo' => $data['motivo'] ?? null,
                    'referencia' => $data['referencia'] ?? null,
                ]);

                $producto->update(['stock_actual' => $stockNuevo]);

                if ($stockNuevo <= $producto->stock_minimo) {
                    $titulo = $stockNuevo === 0
                        ? "Producto agotado: {$producto->nombre}"
                        : "Stock bajo: {$producto->nombre}";

                    $mensaje = $stockNuevo === 0
                        ? "El producto \"{$producto->nombre}\" se ha agotado (0 {$producto->unidad_medida} disponibles)."
                        : "El producto \"{$producto->nombre}\" tiene {$stockNuevo} {$producto->unidad_medida} (mínimo: {$producto->stock_minimo}).";

                    $admins = User::where('rol', 'administrador')->where('activo', true)->get();

                    foreach ($admins as $admin) {
                        Notificacion::create([
                            'usuario_id' => $admin->id,
                            'tipo' => 'stock_bajo',
                            'titulo' => $titulo,
                            'mensaje' => $mensaje,
                        ]);
                    }
                }

                return [
                    'id' => $movimiento->id,
                    'stock_anterior' => $stockAnterior,
                    'stock_nuevo' => $stockNuevo,
                    'producto' => [
                        'id' => $producto->id,
                        'nombre' => $producto->nombre,
                        'codigo' => $producto->codigo,
                        'unidad_medida' => $producto->unidad_medida,
                    ],
                ];
            });

            return response()->json([
                'mensaje' => "Movimiento de {$data['tipo']} registrado correctamente.",
                'data' => $result,
            ], 201);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            return response()->json(['error' => $e->getMessage()], $e->getStatusCode());
        }
    }

    public function mios(Request $request): JsonResponse
    {
        $query = Movimiento::with([
            'producto:id,codigo,nombre,unidad_medida',
        ])->where('usuario_id', $request->user()->id);

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }
        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        $page = max(1, (int) ($request->query('page', 1)));
        $limit = max(1, min(100, (int) ($request->query('limit', 20))));

        $paginator = $query->orderByDesc('created_at')->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'totalPages' => $paginator->lastPage(),
            ],
        ]);
    }

    public function estadisticasSemana(): JsonResponse
    {
        $data = app(\App\Services\DashboardService::class)->getMovimientosSemana();

        return response()->json(['data' => $data]);
    }

    public function resumenMes(): JsonResponse
    {
        $data = Movimiento::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->selectRaw("
                COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0) as total_entradas,
                COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0) as total_salidas,
                COUNT(*) as total_movimientos
            ")
            ->first();

        return response()->json([
            'data' => [
                'total_entradas' => (int) ($data->total_entradas ?? 0),
                'total_salidas' => (int) ($data->total_salidas ?? 0),
                'total_movimientos' => (int) ($data->total_movimientos ?? 0),
            ],
        ]);
    }
}
