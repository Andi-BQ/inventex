<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsuarioRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function paginaIndex(Request $request)
    {
        $query = User::query();
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre_completo', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }
        $data = $query->orderBy('nombre_completo')->get()->map(fn($u) => $this->sanitize($u));

        return Inertia::render('Usuarios', ['usuarios' => $data]);
    }

    public function paginaCrear()
    {
        return Inertia::render('Usuarios/Crear', ['usuario' => null]);
    }

    public function inertiaStore(UsuarioRequest $request)
    {
        $data = $request->validated();
        // El cast 'hashed' del modelo User se encarga de aplicar Hash::make automáticamente
        $user = new User();
        $user->fill($data)->save();

        return redirect('/usuarios')->with('success', 'Usuario creado correctamente.');
    }

    public function inertiaUpdate(UsuarioRequest $request, int $id)
    {
        $user = User::find($id);
        if (!$user) return redirect('/usuarios')->with('error', 'Usuario no encontrado.');

        $data = $request->validated();

        if ((int) $id === (int) $request->user()->id) {
            if (isset($data['activo']) && !$data['activo']) {
                return redirect('/usuarios')->with('error', 'No puedes desactivar tu propia cuenta.');
            }
            if (isset($data['rol']) && $data['rol'] !== $request->user()->rol) {
                return redirect('/usuarios')->with('error', 'No puedes cambiar tu propio rol.');
            }
        }

        if (isset($data['activo']) && !$data['activo'] && $user->rol === 'administrador') {
            $adminCount = User::where('rol', 'administrador')->where('activo', true)->count();
            if ($adminCount <= 1) {
                return redirect('/usuarios')->with('error', 'No se puede desactivar al único administrador activo.');
            }
        }

        // Si no se envió password, lo removemos para no sobrescribir el hash existente.
        // Si se envió, el cast 'hashed' del modelo se encarga de aplicar Hash::make.
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->fill($data)->save();

        return redirect('/usuarios')->with('success', 'Usuario actualizado correctamente.');
    }

    public function inertiaDestroy(Request $request, int $id)
    {
        $user = User::find($id);
        if (!$user) return redirect('/usuarios')->with('error', 'Usuario no encontrado.');

        if ((int) $id === (int) $request->user()->id) {
            return redirect('/usuarios')->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        if ($user->rol === 'administrador') {
            $adminCount = User::where('rol', 'administrador')->where('activo', true)->count();
            if ($adminCount <= 1) {
                return redirect('/usuarios')->with('error', 'No se puede eliminar al único administrador.');
            }
        }

        if ($user->movimientos()->exists()) {
            return redirect('/usuarios')->with('error', 'No se puede eliminar el usuario porque tiene movimientos de inventario asociados.');
        }

        $user->delete();
        return redirect('/usuarios')->with('success', 'Usuario eliminado correctamente.');
    }

    public function paginaEditar(int $id)
    {
        $user = User::find($id);
        if (!$user) return redirect('/usuarios')->with('error', 'Usuario no encontrado.');
        return Inertia::render('Usuarios/Crear', ['usuario' => $this->sanitize($user)]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nombre_completo', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($rol = $request->query('rol')) {
            $query->where('rol', $rol);
        }
        if ($request->has('activo')) {
            $query->where('activo', $request->boolean('activo'));
        }

        $data = $query->orderBy('nombre_completo')->get()->map(fn ($u) => $this->sanitize($u));

        return response()->json(['data' => $data]);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 404);
        }

        return response()->json(['data' => $this->sanitize($user)]);
    }

    public function store(UsuarioRequest $request): JsonResponse
    {
        $data = $request->validated();
        // El cast 'hashed' del modelo se encarga de aplicar Hash::make automáticamente
        $user = User::create($data);

        return response()->json([
            'mensaje' => 'Usuario creado correctamente.',
            'data' => $this->sanitize($user),
        ], 201);
    }

    public function update(UsuarioRequest $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 404);
        }

        $data = $request->validated();

        // El usuario no puede desactivarse ni cambiarse el rol a sí mismo
        if ((int) $id === (int) $request->user()->id) {
            if (isset($data['activo']) && !$data['activo']) {
                return response()->json(['error' => 'No puedes desactivar tu propia cuenta.'], 400);
            }
            if (isset($data['rol']) && $data['rol'] !== $request->user()->rol) {
                return response()->json(['error' => 'No puedes cambiar tu propio rol.'], 400);
            }
        }

        // No permitir desactivar al único admin
        if (isset($data['activo']) && !$data['activo'] && $user->rol === 'administrador') {
            $adminCount = User::where('rol', 'administrador')->where('activo', true)->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'error' => 'No se puede desactivar al único administrador activo del sistema.',
                ], 400);
            }
        }

        // No permitir cambiar el rol del único admin
        if (isset($data['rol']) && $data['rol'] !== 'administrador' && $user->rol === 'administrador') {
            $adminCount = User::where('rol', 'administrador')->where('activo', true)->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'error' => 'No se puede cambiar el rol del único administrador activo del sistema.',
                ], 400);
            }
        }

        // Si no se envió password, lo removemos para no sobrescribir el hash existente.
        // Si se envió, el cast 'hashed' del modelo se encarga de hashearlo.
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->fill($data)->save();

        return response()->json([
            'mensaje' => 'Usuario actualizado correctamente.',
            'data' => $this->sanitize($user->fresh()),
        ]);
    }

    private function sanitize(User $user): array
    {
        return [
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'email' => $user->email,
            'rol' => $user->rol,
            'avatar_url' => $user->avatar_url,
            'activo' => $user->activo,
            'ultimo_login' => $user->ultimo_login,
            'created_at' => $user->created_at,
        ];
    }
}
