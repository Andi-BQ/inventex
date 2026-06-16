<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoriaId = $this->route('categoria');

        return [
            'nombre' => "required|string|max:100|unique:categorias,nombre,{$categoriaId}",
            'descripcion' => 'nullable|string|max:255',
            'icono' => 'sometimes|string|max:50',
            'color' => 'sometimes|string|max:7',
            'activo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la categoría es obligatorio.',
            'nombre.unique' => 'Ya existe una categoría con ese nombre.',
            'nombre.max' => 'El nombre no debe exceder 100 caracteres.',
        ];
    }
}
