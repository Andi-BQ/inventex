<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // UserSeeder::class, // Se ejecuta por separado para preservar datos
            CategoriaSeeder::class,
            ProveedorSeeder::class,
            ProductoSeeder::class,
            MovimientoSeeder::class,
            NotificacionSeeder::class,
        ]);
    }
}
