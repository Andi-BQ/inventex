<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autorizado. Debes iniciar sesión.'], 401);
        }

        if (!in_array($user->rol, $roles)) {
            return response()->json([
                'error' => 'Acceso denegado. Se requiere rol: ' . implode(' o ', $roles),
            ], 403);
        }

        return $next($request);
    }
}
