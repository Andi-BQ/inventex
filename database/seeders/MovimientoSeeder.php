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
            // Semana 1 — Compras grandes (30-25 días atrás)
            ['producto_id' => 1,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 50, 'stock_anterior' => 70,  'stock_nuevo' => 120, 'precio_compra_momento' => 3.20,  'precio_venta_momento' => 4.50,  'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-001', 'created_at' => $d(28, 9, 15)],
            ['producto_id' => 2,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 30, 'stock_anterior' => 55,  'stock_nuevo' => 85,  'precio_compra_momento' => 8.50,  'precio_venta_momento' => 12.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-001', 'created_at' => $d(28, 9, 20)],
            ['producto_id' => 6,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 100,'stock_anterior' => 140, 'stock_nuevo' => 240, 'precio_compra_momento' => 1.20,  'precio_venta_momento' => 2.50,  'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-002', 'created_at' => $d(27, 11, 0)],
            ['producto_id' => 10, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 15, 'stock_anterior' => 30,  'stock_nuevo' => 45,  'precio_compra_momento' => 18.00, 'precio_venta_momento' => 35.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-003', 'created_at' => $d(26, 14, 30)],

            // Semana 2 — Ventas varias (24-18 días atrás)
            ['producto_id' => 1,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 8,  'stock_anterior' => 128, 'stock_nuevo' => 120, 'precio_compra_momento' => 3.20,  'precio_venta_momento' => 4.50,  'motivo' => 'Venta',                       'referencia' => 'V-2026-045', 'created_at' => $d(24, 10, 5)],
            ['producto_id' => 13, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 80, 'stock_anterior' => 120, 'stock_nuevo' => 200, 'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.50,  'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-004', 'created_at' => $d(22, 8, 45)],
            ['producto_id' => 5,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 40, 'stock_anterior' => 55,  'stock_nuevo' => 95,  'precio_compra_momento' => 5.20,  'precio_venta_momento' => 8.00,  'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-004', 'created_at' => $d(22, 8, 50)],
            ['producto_id' => 4,  'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 25, 'stock_anterior' => 35,  'stock_nuevo' => 60,  'precio_compra_momento' => 2.50,  'precio_venta_momento' => 3.80,  'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-005', 'created_at' => $d(21, 15, 10)],
            ['producto_id' => 8,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 25, 'stock_anterior' => 45,  'stock_nuevo' => 70,  'precio_compra_momento' => 6.80,  'precio_venta_momento' => 10.50, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-006', 'created_at' => $d(20, 10, 30)],

            // Semana 3 — Salidas fuertes (17-11 días atrás)
            ['producto_id' => 3,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 22, 'stock_anterior' => 25,  'stock_nuevo' => 3,   'precio_compra_momento' => 2.80,  'precio_venta_momento' => 4.00,  'motivo' => 'Venta al por mayor',          'referencia' => 'V-2026-046', 'created_at' => $d(17, 11, 20)],
            ['producto_id' => 5,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 12, 'stock_anterior' => 107, 'stock_nuevo' => 95,  'precio_compra_momento' => 5.20,  'precio_venta_momento' => 8.00,  'motivo' => 'Venta',                       'referencia' => 'V-2026-047', 'created_at' => $d(16, 16, 0)],
            ['producto_id' => 8,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 5,  'stock_anterior' => 75,  'stock_nuevo' => 70,  'precio_compra_momento' => 6.80,  'precio_venta_momento' => 10.50, 'motivo' => 'Venta',                       'referencia' => 'V-2026-048', 'created_at' => $d(15, 9, 30)],
            ['producto_id' => 11, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 3,  'stock_anterior' => 15,  'stock_nuevo' => 12,  'precio_compra_momento' => 95.00, 'precio_venta_momento' => 169.00,'motivo' => 'Venta',                       'referencia' => 'V-2026-049', 'created_at' => $d(14, 12, 15)],
            ['producto_id' => 9,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 4,  'stock_anterior' => 12,  'stock_nuevo' => 8,   'precio_compra_momento' => 4.20,  'precio_venta_momento' => 7.00,  'motivo' => 'Venta',                       'referencia' => 'V-2026-050', 'created_at' => $d(13, 10, 0)],
            ['producto_id' => 10, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 2,  'stock_anterior' => 47,  'stock_nuevo' => 45,  'precio_compra_momento' => 18.00, 'precio_venta_momento' => 35.00, 'motivo' => 'Venta',                       'referencia' => 'V-2026-051', 'created_at' => $d(12, 15, 45)],

            // Semana 4 — Ajustes y devoluciones (10-4 días atrás)
            ['producto_id' => 12, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 4,  'stock_anterior' => 2,   'stock_nuevo' => 6,   'precio_compra_momento' => 380.00,'precio_venta_momento' => 549.00,'motivo' => 'Ajuste de inventario',        'referencia' => 'AJ-2026-001', 'created_at' => $d(10, 9, 0)],
            ['producto_id' => 11, 'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 5,  'stock_anterior' => 7,   'stock_nuevo' => 12,  'precio_compra_momento' => 95.00, 'precio_venta_momento' => 169.00,'motivo' => 'Devolución de cliente',        'referencia' => 'DEV-2026-001','created_at' => $d(8, 11, 30)],
            ['producto_id' => 14, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 10, 'stock_anterior' => 25,  'stock_nuevo' => 35,  'precio_compra_momento' => 8.00,  'precio_venta_momento' => 14.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-007', 'created_at' => $d(6, 14, 0)],
            ['producto_id' => 16, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 30, 'stock_anterior' => 0,   'stock_nuevo' => 30,  'precio_compra_momento' => 45.00, 'precio_venta_momento' => 79.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-008', 'created_at' => $d(5, 10, 15)],
            ['producto_id' => 7,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 20, 'stock_anterior' => 20,  'stock_nuevo' => 0,   'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.00,  'motivo' => 'Venta',                       'referencia' => 'V-2026-052', 'created_at' => $d(4, 16, 20)],

            // Últimos 3 días — Actividad reciente para el dashboard
            ['producto_id' => 15, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 8,  'stock_anterior' => 8,   'stock_nuevo' => 0,   'precio_compra_momento' => 22.00, 'precio_venta_momento' => 38.00, 'motivo' => 'Venta',                       'referencia' => 'V-2026-053', 'created_at' => $d(3, 11, 0)],
            ['producto_id' => 18, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 20, 'stock_anterior' => 0,   'stock_nuevo' => 20,  'precio_compra_momento' => 7.50,  'precio_venta_momento' => 13.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-009', 'created_at' => $d(3, 9, 30)],
            ['producto_id' => 13, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 25, 'stock_anterior' => 200, 'stock_nuevo' => 175, 'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.50,  'motivo' => 'Venta al por mayor',          'referencia' => 'V-2026-054', 'created_at' => $d(2, 10, 15)],
            ['producto_id' => 3,  'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 50, 'stock_anterior' => 3,   'stock_nuevo' => 53,  'precio_compra_momento' => 2.90,  'precio_venta_momento' => 4.20,  'motivo' => 'Reabastecimiento urgente',    'referencia' => 'OC-2026-010', 'created_at' => $d(1, 8, 0)],
            ['producto_id' => 21, 'usuario_id' => 2, 'tipo' => 'entrada', 'cantidad' => 15, 'stock_anterior' => 0,   'stock_nuevo' => 15,  'precio_compra_momento' => 12.00, 'precio_venta_momento' => 18.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-011', 'created_at' => $d(1, 14, 0)],
            ['producto_id' => 9,  'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 20, 'stock_anterior' => 8,   'stock_nuevo' => 28,  'precio_compra_momento' => 4.20,  'precio_venta_momento' => 7.00,  'motivo' => 'Reabastecimiento',            'referencia' => 'OC-2026-012', 'created_at' => $d(1, 14, 30)],
            ['producto_id' => 22, 'usuario_id' => 3, 'tipo' => 'entrada', 'cantidad' => 10, 'stock_anterior' => 22,  'stock_nuevo' => 32,  'precio_compra_momento' => 7.50,  'precio_venta_momento' => 13.00, 'motivo' => 'Compra a proveedor',           'referencia' => 'OC-2026-013', 'created_at' => $d(1, 15, 0)],

            // Hoy — Actividad del día actual
            ['producto_id' => 1,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 5,  'stock_anterior' => 120, 'stock_nuevo' => 115, 'precio_compra_momento' => 3.20,  'precio_venta_momento' => 4.50,  'motivo' => 'Venta',                       'referencia' => 'V-2026-055', 'created_at' => $d(0, 9, 0)],
            ['producto_id' => 6,  'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 12, 'stock_anterior' => 240, 'stock_nuevo' => 228, 'precio_compra_momento' => 1.20,  'precio_venta_momento' => 2.50,  'motivo' => 'Venta',                       'referencia' => 'V-2026-056', 'created_at' => $d(0, 10, 30)],
            ['producto_id' => 16, 'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 2,  'stock_anterior' => 18,  'stock_nuevo' => 16,  'precio_compra_momento' => 45.00, 'precio_venta_momento' => 79.00, 'motivo' => 'Venta',                       'referencia' => 'V-2026-057', 'created_at' => $d(0, 11, 15)],
            ['producto_id' => 13, 'usuario_id' => 2, 'tipo' => 'salida',  'cantidad' => 10, 'stock_anterior' => 175, 'stock_nuevo' => 165, 'precio_compra_momento' => 4.50,  'precio_venta_momento' => 7.50,  'motivo' => 'Venta',                       'referencia' => 'V-2026-058', 'created_at' => $d(0, 15, 0)],
            ['producto_id' => 5,  'usuario_id' => 3, 'tipo' => 'salida',  'cantidad' => 6,  'stock_anterior' => 95,  'stock_nuevo' => 89,  'precio_compra_momento' => 5.20,  'precio_venta_momento' => 8.00,  'motivo' => 'Venta',                       'referencia' => 'V-2026-059', 'created_at' => $d(0, 16, 45)],
        ];

        DB::table('movimientos_inventario')->insert($movements);
    }
}
