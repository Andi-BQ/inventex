<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoriaRequest;
use App\Models\Categoria;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    public function paginaIndex(Request $request)
    {
        $query = Categoria::withCount('productos');
        if ($search = $request->query('search')) {
            $query->search($search);
        }
        $data = $query->orderBy('nombre')->get();

        return Inertia::render('Categorias', ['categorias' => $data]);
    }

    public function paginaCrear()
    {
        return Inertia::render('Categorias/Crear', ['categoria' => null]);
    }

    public function inertiaStore(CategoriaRequest $request)
    {
        Categoria::create($request->validated());
        Cache::forget('categorias_activas');

        return redirect('/categorias')->with('success', 'Categoría creada correctamente.');
    }

    public function inertiaUpdate(CategoriaRequest $request, int $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) return redirect('/categorias')->with('error', 'Categoría no encontrada.');

        $categoria->update($request->validated());
        Cache::forget('categorias_activas');

        return redirect('/categorias')->with('success', 'Categoría actualizada correctamente.');
    }

    public function inertiaDestroy(int $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) return redirect('/categorias')->with('error', 'Categoría no encontrada.');

        $totalProductos = $categoria->productos()->count();
        if ($totalProductos > 0) {
            return redirect('/categorias')->with('error', "No se puede eliminar. La categoría tiene {$totalProductos} producto(s) asociado(s).");
        }

        $categoria->delete();
        Cache::forget('categorias_activas');

        return redirect('/categorias')->with('success', 'Categoría eliminada correctamente.');
    }

    public function paginaEditar(int $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) return redirect('/categorias')->with('error', 'Categoría no encontrada.');
        return Inertia::render('Categorias/Crear', ['categoria' => $categoria]);
    }

    public function index(Request $request): JsonResponse
    {
        $soloActivas = $request->query('activas') === 'true' || $request->user()?->rol === 'empleado';

        $query = Categoria::withCount('productos');

        if ($soloActivas) {
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
        $categoria = Categoria::withCount('productos')->find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada.'], 404);
        }

        return response()->json(['data' => $categoria]);
    }

    public function store(CategoriaRequest $request): JsonResponse
    {
        $categoria = Categoria::create($request->validated());

        return response()->json([
            'mensaje' => 'Categoría creada correctamente.',
            'data' => $categoria,
        ], 201);
    }

    public function update(CategoriaRequest $request, int $id): JsonResponse
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada.'], 404);
        }

        $categoria->update($request->validated());
        $categoria->loadCount('productos');

        return response()->json([
            'mensaje' => 'Categoría actualizada correctamente.',
            'data' => $categoria,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $categoria = Categoria::find($id);

        if (!$categoria) {
            return response()->json(['error' => 'Categoría no encontrada.'], 404);
        }

        $totalProductos = $categoria->productos()->count();

        if ($totalProductos > 0) {
            return response()->json([
                'error' => "No se puede eliminar. La categoría tiene {$totalProductos} producto(s) asociado(s). Desactívala o reasigna los productos primero.",
            ], 400);
        }

        $categoria->delete();

        return response()->json(['mensaje' => 'Categoría eliminada correctamente.']);
    }
}
