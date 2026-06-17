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
        $productoId = $this->route('producto') ?? $this->route('id');

        return [
            'codigo' => "required|string|max:50|unique:productos,codigo,{$productoId}",
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string|max:500',
            'precio_compra' => 'required|numeric|min:0',
            'precio_venta' => 'required|numeric|min:0',
            'stock_actual' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'unidad_medida' => 'required|string|max:30',
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
            'stock_actual.required' => 'El stock actual es obligatorio.',
            'stock_minimo.required' => 'El stock mínimo es obligatorio.',
            'unidad_medida.required' => 'La unidad de medida es obligatoria.',
        ];
    }
}
