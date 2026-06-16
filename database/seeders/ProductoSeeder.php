<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('productos')->insert([
            // Alimentos (categoria_id=1)
            ['codigo' => 'ALI-001', 'nombre' => 'Arroz Superior 1Kg',      'descripcion' => 'Arroz extra de primera calidad, bolsa de 1 kilogramo',         'precio_compra' => 3.20,  'precio_venta' => 4.50,  'stock_actual' => 120, 'stock_minimo' => 20, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'ALI-002', 'nombre' => 'Aceite Vegetal 1L',       'descripcion' => 'Aceite vegetal puro, botella 1 litro',                          'precio_compra' => 8.50,  'precio_venta' => 12.00, 'stock_actual' => 85,  'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'ALI-003', 'nombre' => 'Azúcar Blanca 1Kg',      'descripcion' => 'Azúcar blanca refinada, bolsa 1 kilogramo',                      'precio_compra' => 2.80,  'precio_venta' => 4.00,  'stock_actual' => 3,   'stock_minimo' => 25, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'ALI-004', 'nombre' => 'Fideos Spaghetti 500g',  'descripcion' => 'Fideos tipo spaghetti, paquete 500 gramos',                      'precio_compra' => 2.50,  'precio_venta' => 3.80,  'stock_actual' => 60,  'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 3],
            ['codigo' => 'ALI-005', 'nombre' => 'Lentejas 500g',          'descripcion' => 'Lentejas seleccionadas, bolsa 500 gramos',                        'precio_compra' => 4.00,  'precio_venta' => 6.50,  'stock_actual' => 45,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'ALI-006', 'nombre' => 'Sal de Mesa 1Kg',        'descripcion' => 'Sal yodada de mesa, bolsa 1 kilogramo',                           'precio_compra' => 1.20,  'precio_venta' => 2.00,  'stock_actual' => 90,  'stock_minimo' => 30, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 3],
            // Bebidas (categoria_id=2)
            ['codigo' => 'BEB-001', 'nombre' => 'Gaseosa Cola 1.5L',      'descripcion' => 'Bebida gaseosa sabor cola, botella 1.5 litros',                  'precio_compra' => 5.20,  'precio_venta' => 8.00,  'stock_actual' => 95,  'stock_minimo' => 20, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 3],
            ['codigo' => 'BEB-002', 'nombre' => 'Agua Mineral 625ml',     'descripcion' => 'Agua mineral sin gas, botella 625 ml',                            'precio_compra' => 1.20,  'precio_venta' => 2.50,  'stock_actual' => 240, 'stock_minimo' => 50, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 3],
            ['codigo' => 'BEB-003', 'nombre' => 'Jugo de Naranja 1L',     'descripcion' => 'Jugo de naranja natural, botella 1 litro',                        'precio_compra' => 4.50,  'precio_venta' => 7.00,  'stock_actual' => 0,   'stock_minimo' => 20, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 3],
            ['codigo' => 'BEB-004', 'nombre' => 'Cerveza Artesanal 330ml','descripcion' => 'Cerveza artesanal rubia, botella 330 ml',                         'precio_compra' => 8.00,  'precio_venta' => 15.00, 'stock_actual' => 48,  'stock_minimo' => 12, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 1],
            // Limpieza (categoria_id=3)
            ['codigo' => 'LIM-001', 'nombre' => 'Detergente 1Kg',         'descripcion' => 'Detergente en polvo concentrado, bolsa 1 kilogramo',             'precio_compra' => 6.80,  'precio_venta' => 10.50, 'stock_actual' => 70,  'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 4],
            ['codigo' => 'LIM-002', 'nombre' => 'Lavavajillas 500ml',     'descripcion' => 'Detergente líquido para vajilla, botella 500 ml',                'precio_compra' => 4.20,  'precio_venta' => 7.00,  'stock_actual' => 8,   'stock_minimo' => 12, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 4],
            ['codigo' => 'LIM-003', 'nombre' => 'Desinfectante 1L',       'descripcion' => 'Desinfectante multiusos aroma lavanda, botella 1 litro',         'precio_compra' => 5.50,  'precio_venta' => 9.00,  'stock_actual' => 34,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 4],
            ['codigo' => 'LIM-004', 'nombre' => 'Papel Higiénico x4',     'descripcion' => 'Papel higiénico doble hoja, paquete 4 unidades',                 'precio_compra' => 6.00,  'precio_venta' => 10.00, 'stock_actual' => 110, 'stock_minimo' => 25, 'unidad_medida' => 'paquete', 'categoria_id' => 3, 'proveedor_id' => 4],
            // Electrónica (categoria_id=4)
            ['codigo' => 'ELE-001', 'nombre' => 'Mouse Inalámbrico',      'descripcion' => 'Mouse óptico inalámbrico USB, color negro',                      'precio_compra' => 18.00, 'precio_venta' => 35.00, 'stock_actual' => 45,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 4, 'proveedor_id' => 2],
            ['codigo' => 'ELE-002', 'nombre' => 'Teclado Mecánico RGB',   'descripcion' => 'Teclado mecánico gamer con iluminación RGB',                     'precio_compra' => 95.00, 'precio_venta' => 169.00,'stock_actual' => 12,  'stock_minimo' => 5,  'unidad_medida' => 'unidad', 'categoria_id' => 4, 'proveedor_id' => 2],
            ['codigo' => 'ELE-003', 'nombre' => 'Monitor LED 24"',        'descripcion' => 'Monitor LED 24 pulgadas Full HD HDMI',                            'precio_compra' => 380.00,'precio_venta' => 549.00,'stock_actual' => 6,   'stock_minimo' => 5,  'unidad_medida' => 'unidad', 'categoria_id' => 4, 'proveedor_id' => 2],
            ['codigo' => 'ELE-004', 'nombre' => 'Auriculares Bluetooth',  'descripcion' => 'Auriculares inalámbricos Bluetooth con micrófono',               'precio_compra' => 45.00, 'precio_venta' => 79.00, 'stock_actual' => 18,  'stock_minimo' => 8,  'unidad_medida' => 'unidad', 'categoria_id' => 4, 'proveedor_id' => 2],
            // Papelería (categoria_id=5)
            ['codigo' => 'PAP-001', 'nombre' => 'Cuaderno Universitario 100h', 'descripcion' => 'Cuaderno universitario tamaño A4, 100 hojas cuadriculadas','precio_compra' => 4.50,  'precio_venta' => 7.50,  'stock_actual' => 200, 'stock_minimo' => 30, 'unidad_medida' => 'unidad', 'categoria_id' => 5, 'proveedor_id' => 4],
            ['codigo' => 'PAP-002', 'nombre' => 'Lapicero Azul x10',     'descripcion' => 'Lapiceros tinta azul, caja 10 unidades',                          'precio_compra' => 3.00,  'precio_venta' => 5.50,  'stock_actual' => 85,  'stock_minimo' => 20, 'unidad_medida' => 'caja', 'categoria_id' => 5, 'proveedor_id' => 4],
            ['codigo' => 'PAP-003', 'nombre' => 'Resma Papel Bond A4',    'descripcion' => 'Papel bond tamaño A4, resma 500 hojas, 75g',                     'precio_compra' => 12.00, 'precio_venta' => 18.00, 'stock_actual' => 30,  'stock_minimo' => 10, 'unidad_medida' => 'resma', 'categoria_id' => 5, 'proveedor_id' => 4],
            // Herramientas (categoria_id=6)
            ['codigo' => 'HER-001', 'nombre' => 'Destornillador Phillips','descripcion' => 'Destornillador estrella Phillips #2, mango ergonómico',            'precio_compra' => 8.00,  'precio_venta' => 14.00, 'stock_actual' => 35,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
            ['codigo' => 'HER-002', 'nombre' => 'Martillo de Uña 16oz',   'descripcion' => 'Martillo de uña profesional 16 onzas con mango de madera',        'precio_compra' => 22.00, 'precio_venta' => 38.00, 'stock_actual' => 0,   'stock_minimo' => 8,  'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
            ['codigo' => 'HER-003', 'nombre' => 'Cinta Métrica 5m',       'descripcion' => 'Cinta métrica metálica de 5 metros con freno',                    'precio_compra' => 7.50,  'precio_venta' => 13.00, 'stock_actual' => 22,  'stock_minimo' => 8,  'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
        ]);
    }
}
