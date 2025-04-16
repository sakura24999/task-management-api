<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'color' => 'sometimes|string|max:7|regex:/^#[0-9A-F]{6}$/i',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'カテゴリー名は必須です。',
            'name.max' => 'カテゴリー名は255文字以内で入力してください。',
            'color.max' => 'カラーコードは7文字以内で入力してください。',
            'color.regex' => 'カラーコードは有効な16進数カラーコード（例: #FF5733）で入力してください。'
        ];
    }
}
