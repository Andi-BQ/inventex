<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('productos')->insert([
            // Lácteos y Huevos (categoria_id=1) — proveedor 1
            ['codigo' => 'LEC-001', 'nombre' => 'Leche Entera 1L',              'descripcion' => 'Leche fresca pasteurizada, bolsa 1 litro',                              'precio_compra' => 3.80,  'precio_venta' => 5.50,  'stock_actual' => 180, 'stock_minimo' => 30, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'LEC-002', 'nombre' => 'Yogurt Natural 1Kg',           'descripcion' => 'Yogurt natural sin azúcar, envase 1 kilogramo',                        'precio_compra' => 6.50,  'precio_venta' => 9.90,  'stock_actual' => 45,  'stock_minimo' => 12, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'LEC-003', 'nombre' => 'Queso Fresco 500g',            'descripcion' => 'Queso fresco pasteurizado, bloque 500 gramos',                         'precio_compra' => 8.20,  'precio_venta' => 12.50, 'stock_actual' => 28,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 1],
            ['codigo' => 'LEC-004', 'nombre' => 'Mantequilla 250g',             'descripcion' => 'Mantequilla de crema de leche, barra 250 gramos',                       'precio_compra' => 5.00,  'precio_venta' => 7.80,  'stock_actual' => 62,  'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 1, 'proveedor_id' => 2],
            ['codigo' => 'LEC-005', 'nombre' => 'Huevos de Granja x30',         'descripcion' => 'Huevos de gallina libres de jaula, caja 30 unidades',                  'precio_compra' => 11.00, 'precio_venta' => 16.50, 'stock_actual' => 4,   'stock_minimo' => 20, 'unidad_medida' => 'caja', 'categoria_id' => 1, 'proveedor_id' => 1],

            // Snacks y Golosinas (categoria_id=2) — proveedor 1
            ['codigo' => 'SNC-001', 'nombre' => 'Papas Fritas 150g',            'descripcion' => 'Papas fritas sabor original, bolsa 150 gramos',                         'precio_compra' => 3.20,  'precio_venta' => 5.00,  'stock_actual' => 210, 'stock_minimo' => 40, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 1],
            ['codigo' => 'SNC-002', 'nombre' => 'Galletas de Soda x4',          'descripcion' => 'Galletas de soda livianas, paquete 4 unidades',                         'precio_compra' => 1.90,  'precio_venta' => 3.20,  'stock_actual' => 150, 'stock_minimo' => 30, 'unidad_medida' => 'paquete', 'categoria_id' => 2, 'proveedor_id' => 1],
            ['codigo' => 'SNC-003', 'nombre' => 'Chocolate 70% Cacao 100g',     'descripcion' => 'Chocolate oscuro 70% cacao, tableta 100 gramos',                        'precio_compra' => 7.00,  'precio_venta' => 11.50, 'stock_actual' => 35,  'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 2],
            ['codigo' => 'SNC-004', 'nombre' => 'Chicles Menta x50',            'descripcion' => 'Chicles de menta sin azúcar, frasco 50 unidades',                       'precio_compra' => 4.50,  'precio_venta' => 7.00,  'stock_actual' => 88,  'stock_minimo' => 20, 'unidad_medida' => 'frasco', 'categoria_id' => 2, 'proveedor_id' => 2],
            ['codigo' => 'SNC-005', 'nombre' => 'Mix Frutos Secos 200g',        'descripcion' => 'Mezcla de almendras, nueces y pasas, bolsa 200 gramos',                 'precio_compra' => 9.00,  'precio_venta' => 14.00, 'stock_actual' => 0,   'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 2, 'proveedor_id' => 1],

            // Cuidado Personal (categoria_id=3) — proveedor 2
            ['codigo' => 'CUI-001', 'nombre' => 'Shampoo Reparador 400ml',      'descripcion' => 'Shampoo para cabello dañado, botella 400 ml',                           'precio_compra' => 12.00, 'precio_venta' => 19.90, 'stock_actual' => 55,  'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 2],
            ['codigo' => 'CUI-002', 'nombre' => 'Jabón Líquido 250ml',          'descripcion' => 'Jabón líquido antibacterial, botella 250 ml',                          'precio_compra' => 4.80,  'precio_venta' => 7.50,  'stock_actual' => 120, 'stock_minimo' => 25, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 2],
            ['codigo' => 'CUI-003', 'nombre' => 'Desodorante Spray 150ml',      'descripcion' => 'Desodorante en spray protección 48h, 150 ml',                           'precio_compra' => 9.50,  'precio_venta' => 15.00, 'stock_actual' => 7,   'stock_minimo' => 15, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 2],
            ['codigo' => 'CUI-004', 'nombre' => 'Crema Dental 120g',            'descripcion' => 'Pasta dental blanqueadora con flúor, tubo 120 gramos',                  'precio_compra' => 3.50,  'precio_venta' => 5.90,  'stock_actual' => 200, 'stock_minimo' => 30, 'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 2],
            ['codigo' => 'CUI-005', 'nombre' => 'Protector Solar 200ml',        'descripcion' => 'Protector solar FPS 50 resistente al agua, 200 ml',                     'precio_compra' => 22.00, 'precio_venta' => 34.00, 'stock_actual' => 15,  'stock_minimo' => 8,  'unidad_medida' => 'unidad', 'categoria_id' => 3, 'proveedor_id' => 2],

            // Mascotas (categoria_id=4) — proveedor 3
            ['codigo' => 'MAS-001', 'nombre' => 'Alimento Perro Adulto 15Kg',   'descripcion' => 'Alimento balanceado para perro adulto, bolsa 15 kilogramos',            'precio_compra' => 55.00, 'precio_venta' => 79.00, 'stock_actual' => 22,  'stock_minimo' => 5,  'unidad_medida' => 'bolsa', 'categoria_id' => 4, 'proveedor_id' => 3],
            ['codigo' => 'MAS-002', 'nombre' => 'Alimento Gato Esterilizado 7Kg','descripcion' => 'Alimento para gato esterilizado, bolsa 7 kilogramos',                  'precio_compra' => 42.00, 'precio_venta' => 62.00, 'stock_actual' => 10,  'stock_minimo' => 4,  'unidad_medida' => 'bolsa', 'categoria_id' => 4, 'proveedor_id' => 3],
            ['codigo' => 'MAS-003', 'nombre' => 'Arena Sanitaria Gato 5Kg',     'descripcion' => 'Arena sanitaria aglomerante para gato, bolsa 5 kilogramos',             'precio_compra' => 8.00,  'precio_venta' => 13.00, 'stock_actual' => 40,  'stock_minimo' => 10, 'unidad_medida' => 'bolsa', 'categoria_id' => 4, 'proveedor_id' => 3],
            ['codigo' => 'MAS-004', 'nombre' => 'Snacks Perro Premiun 250g',    'descripcion' => 'Snacks naturales para perro, bolsa 250 gramos',                         'precio_compra' => 6.50,  'precio_venta' => 10.00, 'stock_actual' => 33,  'stock_minimo' => 8,  'unidad_medida' => 'unidad', 'categoria_id' => 4, 'proveedor_id' => 3],

            // Cocina y Hogar (categoria_id=5) — proveedor 4
            ['codigo' => 'COC-001', 'nombre' => 'Sartén Antiadherente 28cm',    'descripcion' => 'Sartén de aluminio con recubrimiento antiadherente, 28 cm',             'precio_compra' => 28.00, 'precio_venta' => 45.00, 'stock_actual' => 14,  'stock_minimo' => 6,  'unidad_medida' => 'unidad', 'categoria_id' => 5, 'proveedor_id' => 4],
            ['codigo' => 'COC-002', 'nombre' => 'Juego Cubiertos x24',          'descripcion' => 'Juego de cubiertos de acero inoxidable, 24 piezas',                     'precio_compra' => 35.00, 'precio_venta' => 55.00, 'stock_actual' => 5,   'stock_minimo' => 5,  'unidad_medida' => 'juego', 'categoria_id' => 5, 'proveedor_id' => 4],
            ['codigo' => 'COC-003', 'nombre' => 'Bolsas de Basura x50',         'descripcion' => 'Bolsas para basura resistentes 60 litros, paquete 50 unidades',         'precio_compra' => 4.20,  'precio_venta' => 6.80,  'stock_actual' => 75,  'stock_minimo' => 20, 'unidad_medida' => 'paquete', 'categoria_id' => 5, 'proveedor_id' => 4],
            ['codigo' => 'COC-004', 'nombre' => 'Filtro de Agua Repuesto',      'descripcion' => 'Cartucho filtrante para jarra purificadora, repuesto estándar',          'precio_compra' => 15.00, 'precio_venta' => 24.00, 'stock_actual' => 0,   'stock_minimo' => 10, 'unidad_medida' => 'unidad', 'categoria_id' => 5, 'proveedor_id' => 4],

            // Ferretería (categoria_id=6) — proveedor 4
            ['codigo' => 'FER-001', 'nombre' => 'Taladro Eléctrico 600W',       'descripcion' => 'Taladro percutor 600W con mandril sin llave, 13mm',                    'precio_compra' => 85.00, 'precio_venta' => 139.00,'stock_actual' => 8,   'stock_minimo' => 4,  'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
            ['codigo' => 'FER-002', 'nombre' => 'Sierra Manual Profesional',    'descripcion' => 'Sierra de arco profesional con hoja bimetal 12 pulgadas',               'precio_compra' => 32.00, 'precio_venta' => 52.00, 'stock_actual' => 3,   'stock_minimo' => 5,  'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
            ['codigo' => 'FER-003', 'nombre' => 'Cautín de Soldadura 30W',      'descripcion' => 'Cautín para soldadura eléctrica 30W con punta de repuesto',             'precio_compra' => 18.00, 'precio_venta' => 29.00, 'stock_actual' => 12,  'stock_minimo' => 5,  'unidad_medida' => 'unidad', 'categoria_id' => 6, 'proveedor_id' => 4],
        ]);
    }
}
