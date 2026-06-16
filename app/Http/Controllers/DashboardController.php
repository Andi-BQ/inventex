<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {
        $stats = $this->dashboardService->getStats();
        $actividadReciente = $this->dashboardService->getActividadReciente();
        $alertasStock = $this->dashboardService->getAlertasStock();
        $movimientosSemana = $this->dashboardService->getMovimientosSemana();
        $topProductos = $this->dashboardService->getTopProductos();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'actividadReciente' => $actividadReciente,
            'alertasStock' => $alertasStock,
            'movimientosSemana' => $movimientosSemana,
            'topProductos' => $topProductos,
        ]);
    }

    public function stats(): JsonResponse
    {
        $data = $this->dashboardService->getStats();

        return response()->json(['data' => $data]);
    }

    public function movimientosSemana(): JsonResponse
    {
        $data = $this->dashboardService->getMovimientosSemana();

        return response()->json(['data' => $data]);
    }

    public function alertasStock(): JsonResponse
    {
        $data = $this->dashboardService->getAlertasStock();

        return response()->json(['data' => $data]);
    }

    public function actividadReciente(): JsonResponse
    {
        $data = $this->dashboardService->getActividadReciente();

        return response()->json(['data' => $data]);
    }

    public function topProductos(): JsonResponse
    {
        $data = $this->dashboardService->getTopProductos();

        return response()->json(['data' => $data]);
    }

    public function empleado(Request $request): JsonResponse
    {
        $data = $this->dashboardService->getEmpleado($request->user()->id);

        return response()->json(['data' => $data]);
    }
}
