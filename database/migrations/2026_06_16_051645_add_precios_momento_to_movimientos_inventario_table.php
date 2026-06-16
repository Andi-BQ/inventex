<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->decimal('precio_compra_momento', 10, 2)->nullable()->after('stock_nuevo');
            $table->decimal('precio_venta_momento', 10, 2)->nullable()->after('precio_compra_momento');
            $table->text('observaciones')->nullable()->after('referencia');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_inventario', function (Blueprint $table) {
            $table->dropColumn(['precio_compra_momento', 'precio_venta_momento', 'observaciones']);
        });
    }
};
