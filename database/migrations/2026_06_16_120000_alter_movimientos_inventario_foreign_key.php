<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Eliminar la FK antigua con cascadeOnDelete y re-aplicarla con restrictOnDelete
        // para blindar la trazabilidad financiera: no se puede eliminar un producto
        // si existen movimientos de inventario que lo referencian.
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            // MySQL nombra la FK como movimientos_inventario_producto_id_foreign
            $table->dropForeign(['producto_id']);
            $table->foreign('producto_id')
                  ->references('id')
                  ->on('productos')
                  ->restrictOnDelete();
        });

        // Aprovechar para agregar un índice compuesto optimizado para consultas
        // de agregación del dashboard (created_at + tipo + cantidad)
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->index(['created_at', 'tipo', 'cantidad'], 'movimientos_aggregation_idx');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropIndex('movimientos_aggregation_idx');
            $table->dropForeign(['producto_id']);
            $table->foreign('producto_id')
                  ->references('id')
                  ->on('productos')
                  ->cascadeOnDelete();
        });
    }
};
