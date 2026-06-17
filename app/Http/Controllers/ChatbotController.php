<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Producto;
use App\Models\Movimiento;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ChatbotController extends Controller
{
    public function consultar(Request $request): JsonResponse
    {
        $request->validate(['mensaje' => 'required|string']);
        $userMessage = $request->input('mensaje');

        $groqKey = trim(env('GROQ_API_KEY') ?? '');

        if (empty($groqKey)) {
            return response()->json([
                'respuesta' => 'Error de configuración: La variable GROQ_API_KEY no está definida o está vacía.'
            ], 401);
        }

        $tools = [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'consultarModuloSistema',
                    'description' => 'Permite consultar información agregada y en tiempo real de los diferentes módulos del ERP (productos, categorias, proveedores, movimientos, dashboard_general).',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'modulo' => [
                                'type' => 'string',
                                'description' => 'El módulo a consultar. Valores permitidos: productos, categorias, proveedores, movimientos, dashboard.',
                            ],
                            'filtro' => [
                                'type' => 'string',
                                'description' => 'Contexto específico opcional (ej. "mas_caro", "stock_critico", "ultimos_diez", "por_proveedor", "resumen").',
                            ]
                        ],
                        'required' => ['modulo']
                    ]
                ]
            ]
        ];

        try {
            $url = 'https://api.groq.com/openai/v1/chat/completions';

            $response = Http::withToken($groqKey)
                ->timeout(30)
                ->post($url, [
                    'model' => 'llama-3.3-70b-versatile',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Eres INVENTEX-AI, un asistente de operaciones para el ERP. Responde con amabilidad, brevedad y tono profesional. Está estrictamente prohibido inventar datos: si la información no se encuentra en los resultados de las funciones del sistema, debes decir que no cuentas con ese registro. Usa tablas Markdown para listas y viñetas para resúmenes numéricos.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $userMessage,
                        ],
                    ],
                    'tools' => $tools,
                    'tool_choice' => 'auto',
                ])->json();

            Log::info('Respuesta Paso 1 de Groq:', (array)$response);

            if (isset($response['error'])) {
                return response()->json([
                    'respuesta' => 'Error de Groq: ' . ($response['error']['message'] ?? 'Error desconocido.'),
                ]);
            }

            $message = $response['choices'][0]['message'] ?? null;

            if (!$message) {
                return response()->json([
                    'respuesta' => 'No se obtuvo respuesta del asistente.',
                ]);
            }

            if (isset($message['tool_calls'])) {
                $toolCall = $message['tool_calls'][0];
                $functionName = $toolCall['function']['name'];
                $arguments = json_decode($toolCall['function']['arguments'], true) ?? [];

                $resultadoData = $this->ejecutarFuncionInterna($functionName, $arguments);

                $finalResponse = Http::withToken($groqKey)
                    ->timeout(30)
                    ->post($url, [
                        'model' => 'llama-3.3-70b-versatile',
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => 'Eres INVENTEX-AI, un asistente de operaciones para el ERP. Responde con amabilidad, brevedad y tono profesional. Está estrictamente prohibido inventar datos: si la información no se encuentra en los resultados de las funciones del sistema, debes decir que no cuentas con ese registro. Usa tablas Markdown para listas y viñetas para resúmenes numéricos.',
                            ],
                            [
                                'role' => 'user',
                                'content' => $userMessage,
                            ],
                            $message,
                            [
                                'role' => 'tool',
                                'tool_call_id' => $toolCall['id'],
                                'content' => json_encode($resultadoData),
                            ],
                        ],
                    ])->json();

                Log::info('Respuesta Paso 2 de Groq:', (array)$finalResponse);

                if (isset($finalResponse['error'])) {
                    return response()->json([
                        'respuesta' => 'Error al generar el reporte: ' . ($finalResponse['error']['message'] ?? 'Error desconocido.'),
                    ]);
                }

                $textoFinal = $finalResponse['choices'][0]['message']['content'] ?? 'No se pudo estructurar el informe.';
                return response()->json(['respuesta' => $textoFinal]);
            }

            return response()->json([
                'respuesta' => $message['content'] ?? 'No comprendí la consulta.',
            ]);

        } catch (\Exception $e) {
            Log::error('Error crítico en ChatbotController: ' . $e->getMessage());
            return response()->json(['error' => 'Error en el procesamiento: ' . $e->getMessage()], 500);
        }
    }

    private function ejecutarFuncionInterna(string $nombre, array $params)
    {
        if ($nombre !== 'consultarModuloSistema') return null;

        $modulo = $params['modulo'] ?? '';
        $filtro = $params['filtro'] ?? '';

        switch ($modulo) {
            case 'productos':
                if ($filtro === 'mas_caro') {
                    return Producto::orderBy('precio_venta', 'desc')->select('codigo', 'nombre', 'precio_venta', 'stock_actual')->first();
                }
                if ($filtro === 'stock_critico') {
                    return Producto::whereRaw('stock_actual <= stock_minimo')
                        ->select('codigo', 'nombre', 'stock_actual', 'stock_minimo', 'precio_venta')
                        ->get()->toArray();
                }
                $productos = Producto::select('codigo', 'nombre', 'stock_actual', DB::raw('COALESCE(stock_minimo, 0) as stock_minimo'), 'precio_venta')
                    ->orderBy('nombre')
                    ->get()->toArray();
                return [
                    'total_productos' => count($productos),
                    'productos' => $productos,
                ];

            case 'categorias':
                return DB::table('categorias')
                    ->leftJoin('productos', 'categorias.id', '=', 'productos.categoria_id')
                    ->select('categorias.nombre', DB::raw('count(productos.id) as total_productos'))
                    ->groupBy('categorias.id', 'categorias.nombre')
                    ->get()->toArray();

            case 'proveedores':
                return DB::table('proveedores')
                    ->select('id', 'ruc', 'nombre as razon_social', 'telefono', 'contacto')
                    ->get()->toArray();

            case 'movimientos':
                return Movimiento::join('productos', 'movimientos_inventario.producto_id', '=', 'productos.id')
                    ->orderBy('movimientos_inventario.created_at', 'desc')
                    ->take(10)
                    ->select('movimientos_inventario.created_at', 'productos.nombre as producto', 'movimientos_inventario.tipo', 'movimientos_inventario.cantidad', 'movimientos_inventario.precio')
                    ->get()->toArray();

            case 'dashboard':
                $valorInventario = Producto::sum(DB::raw('stock_actual * precio_compra')) ?? 0;
                $ingresosHoy = Movimiento::where('tipo', 'salida')->where('created_at', '>=', Carbon::today())->sum(DB::raw('cantidad * precio')) ?? 0;
                $totalProductos = Producto::count();
                $totalProveedores = DB::table('proveedores')->count();

                return [
                    'resumen_dashboard' => [
                        'valor_total_almacen_pen' => round($valorInventario, 2),
                        'ingresos_ventas_hoy_pen' => round($ingresosHoy, 2),
                        'total_productos_catalogados' => $totalProductos,
                        'total_proveedores_asociados' => $totalProveedores
                    ]
                ];

            default:
                return ['mensaje' => 'Módulo no reconocido en el sistema ERP.'];
        }
    }
}
