<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Notificacion;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'nombre_completo' => $request->user()->nombre_completo,
                    'email' => $request->user()->email,
                    'rol' => $request->user()->rol,
                    'avatar_url' => $request->user()->avatar_url,
                    'activo' => $request->user()->activo,
                    'ultimo_login' => $request->user()->ultimo_login,
                    'tema' => $request->user()->tema ?? 'light',
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
