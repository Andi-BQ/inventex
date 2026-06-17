<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MovimientoSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $d = fn ($daysAgo, $hour = 10, $min = 0) => (clone $now)->subDays($daysAgo)->setTime($hour, $min, rand(0, 59));

        $movements = [
            // Semana 1 — Compras de apertura (28-24 días atrás)
            ['producto_id' => 1,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 200, 'stock_anterior' => 0,   'stock_nuevo' => 200, 'precio_compra_momento' => 3.80,  'precio_venta_momento' => 5.50,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-001', 'created_at' => $d(28, 9, 0)],
            ['producto_id' => 2,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 60,  'stock_anterior' => 0,   'stock_nuevo' => 60,  'precio_compra_momento' => 6.50,  'precio_venta_momento' => 9.90,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-001', 'created_at' => $d(28, 9, 10)],
            ['producto_id' => 5,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 30,  'stock_anterior' => 0,   'stock_nuevo' => 30,  'precio_compra_momento' => 11.00, 'precio_venta_momento' => 16.50, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-001', 'created_at' => $d(28, 9, 20)],
            ['producto_id' => 6,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 250, 'stock_anterior' => 0,   'stock_nuevo' => 250, 'precio_compra_momento' => 3.20,  'precio_venta_momento' => 5.00,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-002', 'created_at' => $d(27, 11, 0)],
            ['producto_id' => 7,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 180, 'stock_anterior' => 0,   'stock_nuevo' => 180, 'precio_compra_momento' => 1.90,  'precio_venta_momento' => 3.20,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-002', 'created_at' => $d(27, 11, 15)],
            ['producto_id' => 14, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 250, 'stock_anterior' => 0,   'stock_nuevo' => 250, 'precio_compra_momento' => 3.50,  'precio_venta_momento' => 5.90,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-003', 'created_at' => $d(26, 8, 30)],
            ['producto_id' => 24, 'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 12,  'stock_anterior' => 0,   'stock_nuevo' => 12,  'precio_compra_momento' => 85.00, 'precio_venta_momento' => 139.00,'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-003', 'created_at' => $d(26, 9, 0)],

            // Semana 2 — Más compras y primeras ventas (22-16 días atrás)
            ['producto_id' => 3,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 40,  'stock_anterior' => 0,   'stock_nuevo' => 40,  'precio_compra_momento' => 8.20,  'precio_venta_momento' => 12.50, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-004', 'created_at' => $d(22, 10, 0)],
            ['producto_id' => 4,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 80,  'stock_anterior' => 0,   'stock_nuevo' => 80,  'precio_compra_momento' => 5.00,  'precio_venta_momento' => 7.80,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-004', 'created_at' => $d(22, 10, 15)],
            ['producto_id' => 8,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 50,  'stock_anterior' => 0,   'stock_nuevo' => 50,  'precio_compra_momento' => 7.00,  'precio_venta_momento' => 11.50, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-005', 'created_at' => $d(20, 14, 0)],
            ['producto_id' => 1,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 20,  'stock_anterior' => 200, 'stock_nuevo' => 180, 'precio_compra_momento' => 3.80,  'precio_venta_momento' => 5.50,  'motivo' => 'Venta',                         'referencia' => 'V-2026-001', 'created_at' => $d(19, 11, 30)],
            ['producto_id' => 6,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 40,  'stock_anterior' => 250, 'stock_nuevo' => 210, 'precio_compra_momento' => 3.20,  'precio_venta_momento' => 5.00,  'motivo' => 'Venta',                         'referencia' => 'V-2026-002', 'created_at' => $d(19, 15, 0)],
            ['producto_id' => 7,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 30,  'stock_anterior' => 180, 'stock_nuevo' => 150, 'precio_compra_momento' => 1.90,  'precio_venta_momento' => 3.20,  'motivo' => 'Venta al por mayor',            'referencia' => 'V-2026-003', 'created_at' => $d(18, 10, 45)],

            // Semana 3 — Nuevas entradas de otras categorías (15-10 días atrás)
            ['producto_id' => 11, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 70,  'stock_anterior' => 0,   'stock_nuevo' => 70,  'precio_compra_momento' => 12.00, 'precio_venta_momento' => 19.90, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-006', 'created_at' => $d(15, 9, 30)],
            ['producto_id' => 12, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 150, 'stock_anterior' => 0,   'stock_nuevo' => 150, 'precio_compra_momento' => 4.80,  'precio_venta_momento' => 7.50,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-006', 'created_at' => $d(15, 10, 0)],
            ['producto_id' => 16, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 30,  'stock_anterior' => 0,   'stock_nuevo' => 30,  'precio_compra_momento' => 55.00, 'precio_venta_momento' => 79.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-007', 'created_at' => $d(14, 11, 0)],
            ['producto_id' => 17, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 15,  'stock_anterior' => 0,   'stock_nuevo' => 15,  'precio_compra_momento' => 42.00, 'precio_venta_momento' => 62.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-007', 'created_at' => $d(14, 11, 15)],
            ['producto_id' => 18, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 60,  'stock_anterior' => 0,   'stock_nuevo' => 60,  'precio_compra_momento' => 8.00,  'precio_venta_momento' => 13.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-008', 'created_at' => $d(13, 8, 0)],


            // Semana 4 — Ventas y salidas (9-3 días atrás)
            ['producto_id' => 2,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 15,  'stock_anterior' => 60,  'stock_nuevo' => 45,  'precio_compra_momento' => 6.50,  'precio_venta_momento' => 9.90,  'motivo' => 'Venta',                         'referencia' => 'V-2026-004', 'created_at' => $d(9, 10, 0)],
            ['producto_id' => 3,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 12,  'stock_anterior' => 40,  'stock_nuevo' => 28,  'precio_compra_momento' => 8.20,  'precio_venta_momento' => 12.50, 'motivo' => 'Venta',                         'referencia' => 'V-2026-005', 'created_at' => $d(9, 15, 20)],
            ['producto_id' => 4,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 18,  'stock_anterior' => 80,  'stock_nuevo' => 62,  'precio_compra_momento' => 5.00,  'precio_venta_momento' => 7.80,  'motivo' => 'Venta',                         'referencia' => 'V-2026-006', 'created_at' => $d(8, 16, 0)],
            ['producto_id' => 10, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 20,  'stock_anterior' => 20,  'stock_nuevo' => 0,   'precio_compra_momento' => 9.00,  'precio_venta_momento' => 14.00, 'motivo' => 'Venta al por mayor',            'referencia' => 'V-2026-007', 'created_at' => $d(7, 11, 10)],
            ['producto_id' => 9,  'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 100, 'stock_anterior' => 0,   'stock_nuevo' => 100, 'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.00,  'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-010', 'created_at' => $d(7, 9, 0)],
            ['producto_id' => 14, 'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 50,  'stock_anterior' => 250, 'stock_nuevo' => 200, 'precio_compra_momento' => 3.50,  'precio_venta_momento' => 5.90,  'motivo' => 'Venta al por mayor',            'referencia' => 'V-2026-008', 'created_at' => $d(6, 14, 30)],
            ['producto_id' => 5,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 26,  'stock_anterior' => 30,  'stock_nuevo' => 4,   'precio_compra_momento' => 11.00, 'precio_venta_momento' => 16.50, 'motivo' => 'Venta al por mayor',            'referencia' => 'V-2026-009', 'created_at' => $d(5, 9, 45)],
            ['producto_id' => 8,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 15,  'stock_anterior' => 50,  'stock_nuevo' => 35,  'precio_compra_momento' => 7.00,  'precio_venta_momento' => 11.50, 'motivo' => 'Venta',                         'referencia' => 'V-2026-010', 'created_at' => $d(4, 10, 15)],
            ['producto_id' => 11, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 15,  'stock_anterior' => 70,  'stock_nuevo' => 55,  'precio_compra_momento' => 12.00, 'precio_venta_momento' => 19.90, 'motivo' => 'Venta',                         'referencia' => 'V-2026-011', 'created_at' => $d(3, 16, 0)],
            ['producto_id' => 12, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 30,  'stock_anterior' => 150, 'stock_nuevo' => 120, 'precio_compra_momento' => 4.80,  'precio_venta_momento' => 7.50,  'motivo' => 'Venta',                         'referencia' => 'V-2026-012', 'created_at' => $d(3, 16, 30)],

            // Últimos 2 días — Ajustes, devoluciones y actividad reciente
            ['producto_id' => 23, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 15,  'stock_anterior' => 0,   'stock_nuevo' => 15,  'precio_compra_momento' => 15.00, 'precio_venta_momento' => 24.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-011', 'created_at' => $d(2, 10, 0)],
            ['producto_id' => 13, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 18,  'stock_anterior' => 25,  'stock_nuevo' => 7,   'precio_compra_momento' => 9.50,  'precio_venta_momento' => 15.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-013', 'created_at' => $d(2, 15, 10)],
            ['producto_id' => 15, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 30,  'stock_anterior' => 0,   'stock_nuevo' => 30,  'precio_compra_momento' => 22.00, 'precio_venta_momento' => 34.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-012', 'created_at' => $d(1, 9, 0)],
            ['producto_id' => 23, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 15,  'stock_anterior' => 15,  'stock_nuevo' => 0,   'precio_compra_momento' => 15.00, 'precio_venta_momento' => 24.00, 'motivo' => 'Venta al por mayor',            'referencia' => 'V-2026-014', 'created_at' => $d(1, 14, 20)],

            // Hoy — Actividad del día actual
            ['producto_id' => 16, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 8,   'stock_anterior' => 30,  'stock_nuevo' => 22,  'precio_compra_momento' => 55.00, 'precio_venta_momento' => 79.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-015', 'created_at' => $d(0, 9, 5)],
            ['producto_id' => 18, 'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 20,  'stock_anterior' => 60,  'stock_nuevo' => 40,  'precio_compra_momento' => 8.00,  'precio_venta_momento' => 13.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-016', 'created_at' => $d(0, 10, 30)],

            ['producto_id' => 9,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 12,  'stock_anterior' => 100, 'stock_nuevo' => 88,  'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.00,  'motivo' => 'Venta',                         'referencia' => 'V-2026-019', 'created_at' => $d(0, 16, 45)],

            // Entradas faltantes para productos sin stock inicial
            ['producto_id' => 25, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 10,  'stock_anterior' => 0,   'stock_nuevo' => 10,  'precio_compra_momento' => 32.00, 'precio_venta_momento' => 52.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-014', 'created_at' => $d(0, 8, 0)],
            ['producto_id' => 26, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 15,  'stock_anterior' => 0,   'stock_nuevo' => 15,  'precio_compra_momento' => 18.00, 'precio_venta_momento' => 29.00, 'motivo' => 'Compra a proveedor',             'referencia' => 'OC-2026-014', 'created_at' => $d(0, 8, 15)],
            ['producto_id' => 24, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 4,   'stock_anterior' => 12,  'stock_nuevo' => 8,   'precio_compra_momento' => 85.00, 'precio_venta_momento' => 139.00,'motivo' => 'Venta',                         'referencia' => 'V-2026-020', 'created_at' => $d(0, 17, 0)],

            ['producto_id' => 25, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 7,   'stock_anterior' => 10,  'stock_nuevo' => 3,   'precio_compra_momento' => 32.00, 'precio_venta_momento' => 52.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-022', 'created_at' => $d(0, 17, 45)],
            ['producto_id' => 26, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 3,   'stock_anterior' => 15,  'stock_nuevo' => 12,  'precio_compra_momento' => 18.00, 'precio_venta_momento' => 29.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-023', 'created_at' => $d(0, 18, 0)],

            // Ajuste de inventario
            ['producto_id' => 13, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 25,  'stock_anterior' => 0,   'stock_nuevo' => 25,  'precio_compra_momento' => 9.50,  'precio_venta_momento' => 15.00, 'motivo' => 'Ajuste de inventario',          'referencia' => 'AJ-2026-001', 'created_at' => $d(3, 8, 0)],
            ['producto_id' => 10, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 20,  'stock_anterior' => 0,   'stock_nuevo' => 20,  'precio_compra_momento' => 9.00,  'precio_venta_momento' => 14.00, 'motivo' => 'Ajuste de inventario',          'referencia' => 'AJ-2026-002', 'created_at' => $d(8, 9, 0)],
            ['producto_id' => 15, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 15,  'stock_anterior' => 30,  'stock_nuevo' => 15,  'precio_compra_momento' => 22.00, 'precio_venta_momento' => 34.00, 'motivo' => 'Venta',                         'referencia' => 'V-2026-024', 'created_at' => $d(0, 18, 30)],
        ];

        DB::table('movimientos_inventario')->insert($movements);
    }
}
