<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificacionSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $d = fn ($daysAgo) => (clone $now)->subDays($daysAgo);

        DB::table('notificaciones')->insert([
            // Leídas (históricas)
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Bienvenido a INVENTEX',                     'mensaje' => 'Sistema inicializado correctamente. Versión 1.0.0',                         'leida' => true, 'created_at' => $d(28), 'updated_at' => $d(27)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Compra registrada: OC-2026-001',            'mensaje' => 'Se registró una compra de 3 productos por S/ 295.00',                        'leida' => true, 'created_at' => $d(28), 'updated_at' => $d(28)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Compra registrada: OC-2026-002',            'mensaje' => 'Se registraron 100 unidades de Agua Mineral 625ml',                          'leida' => true, 'created_at' => $d(27), 'updated_at' => $d(27)],
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Reporte semanal disponible',                'mensaje' => 'El reporte de movimientos de la semana ya está listo.',                      'leida' => true, 'created_at' => $d(24), 'updated_at' => $d(24)],
            // No leídas — stock bajo
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock crítico: Azúcar Blanca 1Kg',         'mensaje' => 'Quedan 3 unidades. Reposición urgente.',                                     'leida' => false, 'created_at' => $d(17), 'updated_at' => $d(17)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock bajo: Lavavajillas 500ml',           'mensaje' => 'Quedan 8 unidades (mínimo 12).',                                             'leida' => false, 'created_at' => $d(13), 'updated_at' => $d(13)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock crítico: Jugo de Naranja 1L',        'mensaje' => 'Producto agotado. 0 unidades en stock.',                                     'leida' => false, 'created_at' => $d(4),  'updated_at' => $d(4)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock crítico: Martillo de Uña 16oz',      'mensaje' => 'Producto agotado. 0 unidades en stock.',                                     'leida' => false, 'created_at' => $d(3),  'updated_at' => $d(3)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock bajo: Destornillador Phillips',      'mensaje' => 'Quedan 22 unidades (mínimo 10). No es urgente pero monitorear.',             'leida' => false, 'created_at' => $d(2),  'updated_at' => $d(2)],
            // No leídas — movimientos recientes
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Venta registrada: V-2026-055',             'mensaje' => 'Se vendieron 5 unidades de Arroz Superior 1Kg por S/ 22.50.',                'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Venta registrada: V-2026-056',             'mensaje' => 'Se vendieron 12 unidades de Agua Mineral 625ml por S/ 30.00.',               'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Reabastecimiento: OC-2026-010',            'mensaje' => 'Se reabasteció Azúcar Blanca 1Kg con 50 unidades.',                           'leida' => false, 'created_at' => $d(1),  'updated_at' => $d(1)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Devolución registrada: DEV-2026-001',      'mensaje' => 'Cliente devolvió 5 unidades de Teclado Mecánico RGB.',                        'leida' => false, 'created_at' => $d(8),  'updated_at' => $d(8)],
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Backup completado',                        'mensaje' => 'Copia de seguridad diaria realizada con éxito.',                              'leida' => false, 'created_at' => $d(1),  'updated_at' => $d(1)],
        ]);
    }
}
