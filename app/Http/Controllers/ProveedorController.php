<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    public function paginaIndex(Request $request)
    {
        $query = Proveedor::withCount('productos');
        if ($search = $request->query('search')) {
            $query->search($search);
        }
        $data = $query->orderBy('nombre')->get();

        return Inertia::render('Proveedores', ['proveedores' => $data]);
    }

    public function paginaCrear()
    {
        return Inertia::render('Proveedores/Crear', ['proveedor' => null]);
    }

    public function inertiaStore(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:150',
            'contacto' => 'nullable|string|max:150',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string',
            'activo' => 'sometimes|boolean',
        ]);

        Proveedor::create($validated);
        Cache::forget('proveedores_activos');

        return redirect('/proveedores')->with('success', 'Proveedor creado correctamente.');
    }

    public function inertiaUpdate(Request $request, int $id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) return redirect('/proveedores')->with('error', 'Proveedor no encontrado.');

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:150',
            'contacto' => 'nullable|string|max:150',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string',
            'activo' => 'sometimes|boolean',
        ]);

        $proveedor->update($validated);
        Cache::forget('proveedores_activos');

        return redirect('/proveedores')->with('success', 'Proveedor actualizado correctamente.');
    }

    public function inertiaDestroy(int $id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) return redirect('/proveedores')->with('error', 'Proveedor no encontrado.');

        $proveedor->delete();
        Cache::forget('proveedores_activos');

        return redirect('/proveedores')->with('success', 'Proveedor eliminado correctamente.');
    }

    public function paginaEditar(int $id)
    {
        $proveedor = Proveedor::withCount('productos')->find($id);
        if (!$proveedor) return redirect('/proveedores')->with('error', 'Proveedor no encontrado.');
        return Inertia::render('Proveedores/Crear', ['proveedor' => $proveedor->toArray()]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = Proveedor::withCount('productos');

        if ($request->query('activos') === 'true') {
            $query->where('activo', true);
        }

        if ($search = $request->query('search')) {
            $query->search($search);
        }

        $data = $query->orderBy('nombre')->get();

        return response()->json(['data' => $data]);
    }

    public function show(int $id): JsonResponse
    {
        $proveedor = Proveedor::withCount('productos')->find($id);

        if (!$proveedor) {
            return response()->json(['error' => 'Proveedor no encontrado.'], 404);
        }

        return response()->json(['data' => $proveedor]);
    }

    public function showWithProducts(int $id): JsonResponse
    {
        $proveedor = Proveedor::withCount('productos')->find($id);

        if (!$proveedor) {
            return response()->json(['error' => 'Proveedor no encontrado.'], 404);
        }

        $productos = Producto::where('proveedor_id', $id)
            ->select('id', 'codigo', 'nombre', 'precio_venta', 'stock_actual', 'stock_minimo', 'activo')
            ->orderBy('nombre')
            ->get();

        return response()->json([
            'data' => array_merge($proveedor->toArray(), ['productos' => $productos]),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:150',
            'contacto' => 'nullable|string|max:150',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string',
            'ruc' => 'nullable|string|max:20',
            'sitio_web' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        $proveedor = Proveedor::create($validated);

        return response()->json([
            'mensaje' => 'Proveedor creado correctamente.',
            'data' => $proveedor,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $proveedor = Proveedor::find($id);

        if (!$proveedor) {
            return response()->json(['error' => 'Proveedor no encontrado.'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:150',
            'contacto' => 'nullable|string|max:150',
            'telefono' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'direccion' => 'nullable|string',
            'ruc' => 'nullable|string|max:20',
            'sitio_web' => 'nullable|string|max:255',
            'activo' => 'sometimes|boolean',
        ]);

        $proveedor->update($validated);
        $proveedor->loadCount('productos');

        return response()->json([
            'mensaje' => 'Proveedor actualizado correctamente.',
            'data' => $proveedor,
        ]);
    }

    public function toggleActivo(int $id): JsonResponse
    {
        $proveedor = Proveedor::find($id);

        if (!$proveedor) {
            return response()->json(['error' => 'Proveedor no encontrado.'], 404);
        }

        $proveedor->update(['activo' => !$proveedor->activo]);

        return response()->json([
            'mensaje' => $proveedor->activo ? 'Proveedor activado.' : 'Proveedor desactivado.',
            'data' => $proveedor->fresh()->loadCount('productos'),
        ]);
    }
}
