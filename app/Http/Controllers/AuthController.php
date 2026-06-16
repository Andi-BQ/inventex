<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\Notificacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function loginForm()
    {
        return Inertia::render('Login');
    }

    public function loginWeb(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt(
            ['email' => strtolower(trim($credentials['email'])), 'password' => $credentials['password']],
            (bool) ($credentials['remember'] ?? false)
        )) {
            return back()->withErrors(['error' => 'Credenciales inválidas.']);
        }

        $user = Auth::user();
        if (!$user->activo) {
            Auth::logout();
            return back()->withErrors(['error' => 'Tu cuenta está desactivada.']);
        }

        $request->session()->regenerate();
        $user->update(['ultimo_login' => now()]);

        return redirect('/dashboard');
    }

    public function loginWebLogout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::where('email', strtolower(trim($credentials['email'])))->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'error' => 'Credenciales inválidas. Verifica tu email y contraseña.',
            ], 401);
        }

        if (!$user->activo) {
            return response()->json([
                'error' => 'Tu cuenta está desactivada. Contacta al administrador del sistema.',
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->update(['ultimo_login' => now()]);

        try {
            Notificacion::create([
                'usuario_id' => $user->id,
                'tipo' => 'sistema',
                'titulo' => 'Inicio de sesión exitoso',
                'mensaje' => "Hola {$user->nombre_completo}, tu sesión se inició correctamente.",
            ]);
        } catch (\Exception $e) {
            // No crítico
        }

        return response()->json([
            'mensaje' => 'Inicio de sesión exitoso.',
            'accessToken' => $token,
            'token_type' => 'Bearer',
            'usuario' => $this->sanitizeUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['mensaje' => 'Sesión cerrada correctamente.']);
    }

    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json(['mensaje' => 'Todas las sesiones fueron cerradas.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'usuario' => $this->sanitizeUser($user),
        ]);
    }

    public function perfil(Request $request)
    {
        return Inertia::render('Perfil', [
            'auth' => ['user' => $this->sanitizeUser($request->user())],
        ]);
    }

    public function cambiarPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|different:current_password|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $request->expectsJson()
                ? response()->json(['error' => 'La contraseña actual es incorrecta.'], 400)
                : back()->withErrors(['error' => 'La contraseña actual es incorrecta.']);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return $request->expectsJson()
            ? response()->json(['mensaje' => 'Contraseña actualizada correctamente.'])
            : back()->with('success', 'Contraseña actualizada correctamente.');
    }

    private function sanitizeUser(User $user): array
    {
        return [
            'id' => $user->id,
            'nombre_completo' => $user->nombre_completo,
            'email' => $user->email,
            'rol' => $user->rol,
            'avatar_url' => $user->avatar_url,
            'activo' => $user->activo,
            'ultimo_login' => $user->ultimo_login,
        ];
    }
}
