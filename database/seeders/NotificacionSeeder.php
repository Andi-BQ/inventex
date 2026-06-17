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
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Sistema INVENTEX iniciado',                     'mensaje' => 'Sistema actualizado correctamente. Versión 2.0.0',                              'leida' => true, 'created_at' => $d(28), 'updated_at' => $d(27)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Compra registrada: OC-2026-001',                'mensaje' => 'Se registró compra de Leche Entera, Yogurt Natural y Huevos por S/ 1,183.00',   'leida' => true, 'created_at' => $d(28), 'updated_at' => $d(28)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Compra registrada: OC-2026-002',                'mensaje' => 'Se registraron 430 unidades de snacks y galletas',                               'leida' => true, 'created_at' => $d(27), 'updated_at' => $d(27)],
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Reporte semanal disponible',                    'mensaje' => 'El reporte de movimientos de la semana ya está disponible.',                      'leida' => true, 'created_at' => $d(24), 'updated_at' => $d(24)],

            // No leídas — stock bajo / crítico
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock crítico: Huevos de Granja x30',          'mensaje' => 'Quedan 4 cajas (mínimo 20). Reposición urgente.',                                'leida' => false, 'created_at' => $d(5),  'updated_at' => $d(5)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock agotado: Mix Frutos Secos 200g',         'mensaje' => 'Producto agotado. 0 unidades en stock.',                                          'leida' => false, 'created_at' => $d(7),  'updated_at' => $d(7)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock bajo: Desodorante Spray 150ml',          'mensaje' => 'Quedan 7 unidades (mínimo 15).',                                                 'leida' => false, 'created_at' => $d(2),  'updated_at' => $d(2)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock agotado: Filtro de Agua Repuesto',       'mensaje' => 'Producto agotado. 0 unidades en stock.',                                          'leida' => false, 'created_at' => $d(1),  'updated_at' => $d(1)],
            ['usuario_id' => 1, 'tipo' => 'stock_bajo', 'titulo' => 'Stock bajo: Sierra Manual Profesional',        'mensaje' => 'Quedan 3 unidades (mínimo 5).',                                                   'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],

            // No leídas — movimientos recientes
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Venta registrada: V-2026-015',                  'mensaje' => 'Se vendieron 8 bolsas de Alimento Perro Adulto por S/ 632.00.',                   'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Venta registrada: V-2026-016',                  'mensaje' => 'Se vendieron 20 bolsas de Arena Sanitaria por S/ 260.00.',                        'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Nueva compra: OC-2026-014',                     'mensaje' => 'Se registró compra de Sierra Manual y Cautín de Soldadura.',                       'leida' => false, 'created_at' => $d(0),  'updated_at' => $d(0)],
            ['usuario_id' => 1, 'tipo' => 'movimiento', 'titulo' => 'Ajuste: AJ-2026-001',                          'mensaje' => 'Se ajustó inventario de Desodorante Spray (+25 unidades).',                        'leida' => false, 'created_at' => $d(3),  'updated_at' => $d(3)],
            ['usuario_id' => 1, 'tipo' => 'sistema',    'titulo' => 'Backup completado',                             'mensaje' => 'Copia de seguridad diaria realizada con éxito.',                                   'leida' => false, 'created_at' => $d(1),  'updated_at' => $d(1)],
        ]);
    }
}
