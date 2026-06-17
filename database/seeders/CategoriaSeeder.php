<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Lácteos y Huevos', 'descripcion' => 'Productos lácteos, huevos y derivados refrigerados', 'icono' => 'Milk', 'color' => '#f472b6', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Snacks y Golosinas', 'descripcion' => 'Botanas, dulces, chocolates y frutos secos', 'icono' => 'Candy', 'color' => '#eab308', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Cuidado Personal', 'descripcion' => 'Higiene personal, cosméticos y cuidado de la piel', 'icono' => 'Sparkles', 'color' => '#a855f7', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Mascotas', 'descripcion' => 'Alimento y accesorios para perros y gatos', 'icono' => 'Cat', 'color' => '#f97316', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Cocina y Hogar', 'descripcion' => 'Utensilios de cocina, organización y limpieza del hogar', 'icono' => 'Home', 'color' => '#06b6d4', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Ferretería', 'descripcion' => 'Herramientas eléctricas, manuales y accesorios', 'icono' => 'Hammer', 'color' => '#dc2626', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
