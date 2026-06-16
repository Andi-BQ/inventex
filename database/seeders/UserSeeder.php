<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'nombre_completo' => 'Carlos Mendoza',
                'email' => 'admin@inventex.com',
                'password' => Hash::make('Admin123!'),
                'rol' => 'administrador',
                'activo' => true,
                'avatar_url' => 'https://i.pravatar.cc/150?img=12',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_completo' => 'María García',
                'email' => 'maria@inventex.com',
                'password' => Hash::make('Empleado123!'),
                'rol' => 'empleado',
                'activo' => true,
                'avatar_url' => 'https://i.pravatar.cc/150?img=47',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_completo' => 'Juan Pérez',
                'email' => 'juan@inventex.com',
                'password' => Hash::make('Empleado123!'),
                'rol' => 'empleado',
                'activo' => true,
                'avatar_url' => 'https://i.pravatar.cc/150?img=33',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
