<?php

namespace App\Services;

use App\Models\Notificacion;
use App\Models\User;

class NotificationService
{
    public function getNoLeidas(int $usuarioId, int $limit = 20): array
    {
        return Notificacion::paraUsuario($usuarioId)
            ->noLeidas()
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getAll(int $usuarioId, int $limit = 50): array
    {
        return Notificacion::paraUsuario($usuarioId)
            ->orderBy('leida')
            ->latest()
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function marcarLeida(int $id, int $usuarioId): bool
    {
        $affected = Notificacion::paraUsuario($usuarioId)
            ->where('id', $id)
            ->update(['leida' => true]);

        return $affected > 0;
    }

    public function marcarTodasLeidas(int $usuarioId): int
    {
        return Notificacion::paraUsuario($usuarioId)
            ->noLeidas()
            ->update(['leida' => true]);
    }

    public function countNoLeidas(int $usuarioId): int
    {
        return Notificacion::paraUsuario($usuarioId)
            ->noLeidas()
            ->count();
    }

    public function eliminar(int $id, int $usuarioId): bool
    {
        $notification = Notificacion::paraUsuario($usuarioId)->where('id', $id)->first();
        if (!$notification) return false;
        return $notification->delete();
    }

    public function createGlobal(string $tipo, string $titulo, string $mensaje): Notificacion
    {
        return Notificacion::create([
            'usuario_id' => null,
            'tipo' => $tipo,
            'titulo' => $titulo,
            'mensaje' => $mensaje,
        ]);
    }

    public function notifyAdmins(string $tipo, string $titulo, string $mensaje): void
    {
        $admins = User::where('rol', 'administrador')->where('activo', true)->get();

        foreach ($admins as $admin) {
            Notificacion::create([
                'usuario_id' => $admin->id,
                'tipo' => $tipo,
                'titulo' => $titulo,
                'mensaje' => $mensaje,
            ]);
        }
    }
}
