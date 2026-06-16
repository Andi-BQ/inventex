<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productoId = $this->route('producto');

        return [
            'codigo' => "required|string|max:50|unique:productos,codigo,{$productoId}",
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:500',
            'precio_compra' => 'required|numeric|min:0|max:9999999.99',
            'precio_venta' => 'required|numeric|min:0|max:9999999.99',
            'stock_actual' => 'sometimes|integer|min:0|max:999999',
            'stock_minimo' => 'required|integer|min:0|max:999999',
            'unidad_medida' => 'sometimes|string|max:30',
            'imagen_url' => 'nullable|string|max:500',
            'categoria_id' => 'nullable|integer|exists:categorias,id',
            'proveedor_id' => 'nullable|integer|exists:proveedores,id',
            'activo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'codigo.required' => 'El código del producto es obligatorio.',
            'codigo.unique' => 'Ya existe un producto con ese código.',
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'precio_compra.required' => 'El precio de compra es obligatorio.',
            'precio_venta.required' => 'El precio de venta es obligatorio.',
            'precio_compra.min' => 'El precio de compra no puede ser negativo.',
            'precio_venta.min' => 'El precio de venta no puede ser negativo.',
            'categoria_id.exists' => 'La categoría seleccionada no existe.',
            'proveedor_id.exists' => 'El proveedor seleccionado no existe.',
        ];
    }
}
