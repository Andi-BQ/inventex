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
                'nombre' => 'Comercializadora Andina S.A.C.',
                'contacto' => 'Ana Torres',
                'telefono' => '+51 998 111 222',
                'email' => 'ventas@comercializadoraandina.pe',
                'direccion' => 'Av. La Marina 340, Pueblo Libre, Lima',
                'ruc' => '20111222333',
                'sitio_web' => 'https://comercializadoraandina.pe',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Importaciones del Pacífico S.A.',
                'contacto' => 'Diego Lumbreras',
                'telefono' => '+51 997 654 000',
                'email' => 'compras@importpacifico.com',
                'direccion' => 'Jr. Amazonas 567, Miraflores, Lima',
                'ruc' => '20444555222',
                'sitio_web' => 'https://importpacifico.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Distribuidora Pets & Co E.I.R.L.',
                'contacto' => 'Carmen Flores',
                'telefono' => '+51 996 333 444',
                'email' => 'pedidos@petsandco.pe',
                'direccion' => 'Calle Los Olivos 123, San Isidro, Lima',
                'ruc' => '20777888999',
                'sitio_web' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Industrial del Hogar S.A.',
                'contacto' => 'Ricardo Guerra',
                'telefono' => '+51 995 222 111',
                'email' => 'info@industrialhogar.com',
                'direccion' => 'Carretera Central Km 14, Ate, Lima',
                'ruc' => '20333444555',
                'sitio_web' => 'https://industrialhogar.com',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
