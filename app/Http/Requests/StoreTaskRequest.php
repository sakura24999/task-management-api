<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:not_started,in_progress,completed',
            'priority' => 'sometimes|string|in:low,medium,high',
            'due_date' => 'nullable|date',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タスクのタイトルは必須です。',
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'status.in' => 'ステータスの値が不正です。',
            'priority.in' => '優先度の値が不正です。',
            'due_date.date' => '期日は有効な日付を指定してください。',
            'category_ids.array' => 'カテゴリーIDは配列形式で指定してください。',
            'category_ids.*.exists' => '指定されたカテゴリーIDは存在しません。'
        ];
    }
}
