<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre_completo',
        'email',
        'password',
        'rol',
        'activo',
        'avatar_url',
        'ultimo_login',
        'tema',
        'preferencias_notificaciones',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'ultimo_login' => 'datetime',
            'password' => 'hashed',
            'tema' => 'string',
            'preferencias_notificaciones' => 'array',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->rol === 'administrador';
    }

    public function isEmpleado(): bool
    {
        return $this->rol === 'empleado';
    }

    public function movimientos()
    {
        return $this->hasMany(Movimiento::class, 'usuario_id');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'usuario_id');
    }
}
