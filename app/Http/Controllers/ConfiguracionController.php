<?php

namespace App\Http\Controllers;

use App\Models\Configuracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // 1. Intentamos obtener de forma segura las configuraciones de la tabla
        $configs = [];
        try {
            $configs = Configuracion::pluck('valor', 'clave')->toArray();
        } catch (\Exception $e) {
            // Previene fallos si la tabla física aún no existe en producción
            $configs = [];
        }

        // 2. Valores por defecto (Fallback) indispensables para que React no rompa si la BD está vacía
        $defaultConfigs = [
            'nombre_sistema' => 'Inventex',
            'moneda_simbolo' => '$',
            'limite_stock_critico' => '5',
        ];

        // Combinamos manteniendo las prioridades de la base de datos si ya tiene registros
        $configs = array_merge($defaultConfigs, $configs);

        return Inertia::render('Configuracion', [
            'configs' => $configs,
            'userPrefs' => [
                'tema' => $user->tema ?? 'light',
                'preferencias_notificaciones' => $user->preferencias_notificaciones ?? [
                    'stock_bajo' => true,
                    'movimientos' => true,
                    'sistema' => true,
                    'email' => false,
                ],
            ],
        ]);
    }

    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'nombre_sistema' => 'nullable|string|max:255',
            'moneda_simbolo' => 'nullable|string|max:10',
            'limite_stock_critico' => 'nullable|integer|min:0',
        ]);

        foreach ($validated as $clave => $valor) {
            if ($valor !== null) {
                Configuracion::updateOrCreate(
                    ['clave' => $clave],
                    ['valor' => $valor, 'tipo' => is_numeric($valor) ? 'int' : 'string']
                );
            }
        }

        // Limpieza estricta de la caché de configuraciones para producción
        cache()->forget('configuraciones_sistema');

        return back()->with('success', 'Configuración general actualizada correctamente.');
    }

    public function updatePerfil(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nombre_completo' => 'required|string|max:150',
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('users')->ignore($user->id),
            ],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $user->nombre_completo = $validated['nombre_completo'];
        $user->email = $validated['email'];

        if ($request->hasFile('avatar')) {
            if ($user->avatar_url) {
                Storage::disk('public')->delete($user->avatar_url);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_url = $path;
        }

        $user->save();

        return back()->with('success', 'Perfil actualizado correctamente.');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|different:current_password|confirmed',
        ]);

        $user = $request->user();

        if (!password_verify($validated['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'La contraseña actual es incorrecta.',
            ]);
        }

        $user->password = $validated['new_password'];
        $user->save();

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }

    public function updatePreferencias(Request $request)
    {
        $validated = $request->validate([
            'stock_bajo' => 'required|boolean',
            'movimientos' => 'required|boolean',
            'sistema' => 'required|boolean',
            'email' => 'required|boolean',
        ]);

        $user = $request->user();
        $user->preferencias_notificaciones = $validated;
        $user->save();

        return back()->with('success', 'Preferencias de notificación actualizadas.');
    }

    public function updateTema(Request $request)
    {
        $validated = $request->validate([
            'tema' => 'required|string|in:light,dark',
        ]);

        $user = $request->user();
        $user->tema = $validated['tema'];
        $user->save();

        return back()->with('success', 'Tema actualizado correctamente.');
    }
}