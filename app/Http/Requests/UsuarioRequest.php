<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $usuarioId = $this->route('usuario');

        $rules = [
            'nombre_completo' => 'required|string|max:150',
            'email' => "required|email|max:150|unique:users,email,{$usuarioId}",
            'rol' => 'sometimes|string|in:administrador,empleado',
            'activo' => 'sometimes|boolean',
            'avatar_url' => 'nullable|string|max:500',
        ];

        if ($this->isMethod('POST')) {
            $rules['password'] = 'required|string|min:6|max:100';
            $rules['rol'] = 'required|string|in:administrador,empleado';
            unset($rules['password_confirmation']);
        } else {
            $rules['password'] = 'nullable|string|min:6|max:100';
            $rules['password_confirmation'] = 'nullable|string|same:password';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nombre_completo.required' => 'El nombre completo es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.unique' => 'Ya existe un usuario con ese correo electrónico.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'rol.required' => 'El rol es obligatorio.',
            'rol.in' => 'El rol debe ser administrador o empleado.',
        ];
    }
}
