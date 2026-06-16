<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductoRequest;
use App\Models\Categoria;
use App\Models\Proveedor;
use App\Services\ProductoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function __construct(
        private ProductoService $productoService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return $this->listar($request);
    }

    private function getCategoriasActivas()
    {
        return Cache::remember('categorias_activas', 300, function () {
            return Categoria::where('activo', true)->orderBy('nombre')->get();
        });
    }

    private function getProveedoresActivos()
    {
        return Cache::remember('proveedores_activos', 300, function () {
            return Proveedor::where('activo', true)->orderBy('nombre')->get();
        });
    }

    public function paginaIndex(Request $request)
    {
        $result = $this->productoService->listar($request->all());

        return Inertia::render('Productos', [
            'productos' => $result,
            'categorias' => $this->getCategoriasActivas(),
            'proveedores' => $this->getProveedoresActivos(),
        ]);
    }

    public function paginaCrear()
    {
        return Inertia::render('Productos/Crear', [
            'producto' => null,
            'categorias' => $this->getCategoriasActivas(),
            'proveedores' => $this->getProveedoresActivos(),
        ]);
    }

    public function inertiaStore(ProductoRequest $request)
    {
        $this->productoService->create($request->validated());
        Cache::forget('categorias_activas');
        Cache::forget('proveedores_activos');

        return redirect('/productos')->with('success', 'Producto creado correctamente.');
    }

    public function inertiaUpdate(ProductoRequest $request, int $id)
    {
        try {
            $this->productoService->update($id, $request->validated());
            Cache::forget('categorias_activas');
            Cache::forget('proveedores_activos');

            return redirect('/productos')->with('success', 'Producto actualizado correctamente.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect('/productos')->with('error', 'Producto no encontrado.');
        }
    }

    public function paginaEditar(int $id)
    {
        $producto = $this->productoService->getById($id);

        if (!$producto) {
            return redirect('/productos')->with('error', 'Producto no encontrado.');
        }

        return Inertia::render('Productos/Crear', [
            'producto' => $producto,
            'categorias' => $this->getCategoriasActivas(),
            'proveedores' => $this->getProveedoresActivos(),
        ]);
    }

    public function listar(Request $request): JsonResponse
    {
        $isEmpleado = $request->user()?->rol === 'empleado';

        $result = $this->productoService->listar($request->all());

        if ($isEmpleado) {
            $result['data'] = array_map(function ($p) {
                return [
                    'id' => $p['id'],
                    'codigo' => $p['codigo'],
                    'nombre' => $p['nombre'],
                    'descripcion' => $p['descripcion'],
                    'stock_actual' => $p['stock_actual'],
                    'stock_minimo' => $p['stock_minimo'],
                    'unidad_medida' => $p['unidad_medida'],
                    'imagen_url' => $p['imagen_url'],
                    'categoria_id' => $p['categoria_id'],
                    'categoria_nombre' => $p['categoria']['nombre'] ?? null,
                    'categoria_color' => $p['categoria']['color'] ?? null,
                    'categoria_icono' => $p['categoria']['icono'] ?? null,
                    'activo' => $p['activo'],
                ];
            }, $result['data']);
        }

        return response()->json($result);
    }

    public function show(int $id): JsonResponse
    {
        $producto = $this->productoService->getById($id);

        if (!$producto) {
            return response()->json(['error' => 'Producto no encontrado.'], 404);
        }

        return response()->json(['data' => $producto]);
    }

    public function store(ProductoRequest $request): JsonResponse
    {
        $producto = $this->productoService->create($request->validated());

        return response()->json([
            'mensaje' => 'Producto creado correctamente.',
            'data' => $producto,
        ], 201);
    }

    public function update(ProductoRequest $request, int $id): JsonResponse
    {
        try {
            $producto = $this->productoService->update($id, $request->validated());

            return response()->json([
                'mensaje' => 'Producto actualizado correctamente.',
                'data' => $producto,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Producto no encontrado.'], 404);
        }
    }

    public function toggleActivo(int $id): JsonResponse
    {
        try {
            $producto = $this->productoService->toggleActivo($id);

            return response()->json([
                'mensaje' => $producto->activo ? 'Producto activado correctamente.' : 'Producto desactivado correctamente.',
                'data' => $producto,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Producto no encontrado.'], 404);
        }
    }

    public function autocomplete(Request $request): JsonResponse
    {
        $term = $request->get('q', '');
        $data = $this->productoService->buscarAutocomplete($term);

        return response()->json(['data' => $data]);
    }

    public function inertiaDestroy(int $id)
    {
        try {
            $producto = $this->productoService->getById($id);
            if (!$producto) {
                return redirect('/productos')->with('error', 'Producto no encontrado.');
            }
            $producto->delete();
            Cache::forget('categorias_activas');
            Cache::forget('proveedores_activos');
            return redirect('/productos')->with('success', 'Producto eliminado correctamente.');
        } catch (\Exception $e) {
            return redirect('/productos')->with('error', 'Error al eliminar el producto: ' . $e->getMessage());
        }
    }

    public function bajoStock(): JsonResponse
    {
        $data = $this->productoService->getBajoStock();

        return response()->json(['data' => $data]);
    }

    public function valorInventario(): JsonResponse
    {
        $data = $this->productoService->getValorInventario();

        return response()->json(['data' => $data]);
    }
}
