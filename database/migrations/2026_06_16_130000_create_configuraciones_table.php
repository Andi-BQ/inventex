<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();
            $table->string('clave', 150)->unique();
            $table->text('valor')->nullable();
            $table->string('tipo', 50)->default('string');
            $table->timestamps();

            $table->index('clave');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};
