<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProveedorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('proveedores')->insert([
            [
                'nombre' => 'Distribuidora La Norteña S.A.C.',
                'contacto' => 'Roberto Sánchez',
                'telefono' => '+51 999 888 777',
                'email' => 'ventas@lanortena.pe',
                'direccion' => 'Av. Industrial 1234, Lima',
                'ruc' => '20123456789',
                'sitio_web' => 'https://lanortena.pe',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'TechParts International',
                'contacto' => 'Elena Martínez',
                'telefono' => '+51 987 654 321',
                'email' => 'contacto@techparts.com',
                'direccion' => 'Jr. Los Pinos 456, San Isidro',
                'ruc' => '20987654321',
                'sitio_web' => 'https://techparts.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Alimentos del Sur E.I.R.L.',
                'contacto' => 'Pedro Ramírez',
                'telefono' => '+51 977 123 456',
                'email' => 'pedidos@alimentosdelsur.pe',
                'direccion' => 'Calle Las Flores 789, Surco',
                'ruc' => '20555666777',
                'sitio_web' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Suministros Globales S.A.',
                'contacto' => 'Laura Torres',
                'telefono' => '+51 966 555 444',
                'email' => 'info@suministrosglobales.com',
                'direccion' => 'Av. Javier Prado 234, San Borja',
                'ruc' => '20444555666',
                'sitio_web' => 'https://suministrosglobales.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
