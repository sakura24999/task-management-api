<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * カテゴリー一覧を表示
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = auth()->user()->categories;

        return CategoryResource::collection($categories);
    }

    /**
     * カテゴリーを新規作成
     *
     * @param  \App\Http\Requests\StoreCategoryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = auth()->user()->categories()->create($request->validated());

        return new CategoryResource($category);
    }

    /**
     * 特定のカテゴリーを表示
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        // 自分のカテゴリーかチェック
        $this->authorize('view', $category);

        return new CategoryResource($category);
    }

    /**
     * カテゴリーを更新
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        // 自分のカテゴリーかチェック
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'color' => 'sometimes|required|string|max:7',
        ]);

        $category->update($validated);

        return new CategoryResource($category);
    }

    /**
     * カテゴリーを削除
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        // 自分のカテゴリーかチェック
        $this->authorize('delete', $category);

        $category->delete();

        return response()->json([
            'message' => 'カテゴリーを削除しました。'
        ]);
    }
}
