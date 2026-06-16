<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $limit = (int) ($request->query('limit', 50));
        $data = $this->notificationService->getAll($request->user()->id, $limit);

        return response()->json(['data' => $data]);
    }

    public function noLeidas(Request $request): JsonResponse
    {
        $limit = (int) ($request->query('limit', 20));
        $data = $this->notificationService->getNoLeidas($request->user()->id, $limit);
        $total = $this->notificationService->countNoLeidas($request->user()->id);

        return response()->json(['data' => $data, 'total' => $total]);
    }

    public function marcarLeida(Request $request, int $id): JsonResponse
    {
        $affected = $this->notificationService->marcarLeida($id, $request->user()->id);

        if (!$affected) {
            return response()->json(['error' => 'Notificación no encontrada.'], 404);
        }

        return response()->json(['mensaje' => 'Notificación marcada como leída.']);
    }

    public function marcarTodasLeidas(Request $request): JsonResponse
    {
        $affected = $this->notificationService->marcarTodasLeidas($request->user()->id);

        return response()->json([
            'mensaje' => 'Notificaciones marcadas como leídas.',
            'total_actualizadas' => $affected,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $deleted = $this->notificationService->eliminar($id, $request->user()->id);

        if (!$deleted) {
            return response()->json(['error' => 'Notificación no encontrada.'], 404);
        }

        return response()->json(['mensaje' => 'Notificación eliminada.']);
    }
}
