<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Alimentos', 'descripcion' => 'Productos de alimentación y consumo masivo', 'icono' => 'Apple', 'color' => '#22c55e', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Bebidas', 'descripcion' => 'Bebidas gaseosas, jugos y agua embotellada', 'icono' => 'CupSoda', 'color' => '#06b6d4', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Limpieza', 'descripcion' => 'Productos de limpieza e higiene del hogar', 'icono' => 'Sparkles', 'color' => '#8b5cf6', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Electrónica', 'descripcion' => 'Dispositivos electrónicos y accesorios', 'icono' => 'Laptop', 'color' => '#2563eb', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Papelería', 'descripcion' => 'Útiles de escritorio, libretas y material de oficina', 'icono' => 'Pencil', 'color' => '#f59e0b', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Herramientas', 'descripcion' => 'Herramientas manuales y eléctricas', 'icono' => 'Wrench', 'color' => '#ef4444', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
