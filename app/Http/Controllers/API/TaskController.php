<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * タスク一覧を表示
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = auth()->user()->tasks();

        // ステータスでフィルタリング
        if ($request->has('status') && in_array($request->status, ['not_started', 'in_progress', 'completed'])) {
            $query->where('status', $request->status);
        }

        // 優先度でフィルタリング
        if ($request->has('priority') && in_array($request->priority, ['low', 'medium', 'high'])) {
            $query->where('priority', $request->priority);
        }

        // 並び替え
        $sortField = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';

        if (in_array($sortField, ['title', 'due_date', 'status', 'priority', 'created_at'])) {
            $query->orderBy($sortField, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        $tasks = $query->with('categories')->paginate(10);

        return TaskResource::collection($tasks);
    }

    /**
     * タスクを新規作成
     *
     * @param  \App\Http\Requests\StoreTaskRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTaskRequest $request)
    {
        $task = auth()->user()->tasks()->create($request->validated());

        // カテゴリーがある場合は関連付け
        if ($request->has('category_ids')) {
            // ユーザーが所有するカテゴリーのIDのみを取得
            $userCategoryIds = auth()->user()->categories()->whereIn('id', $request->category_ids)->pluck('id');
            $task->categories()->sync($userCategoryIds);
        }

        return new TaskResource($task->load('categories'));
    }

    /**
     * 特定のタスクを表示
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        // 自分のタスクかチェック
        $this->authorize('view', $task);

        return new TaskResource($task->load('categories'));
    }

    /**
     * タスクを更新
     *
     * @param  \App\Http\Requests\UpdateTaskRequest  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        // 自分のタスクかチェック
        $this->authorize('update', $task);

        $task->update($request->validated());

        // カテゴリーの更新
        if ($request->has('category_ids')) {
            // ユーザーが所有するカテゴリーのIDのみを取得
            $userCategoryIds = auth()->user()->categories()->whereIn('id', $request->category_ids)->pluck('id');
            $task->categories()->sync($userCategoryIds);
        }

        return new TaskResource($task->load('categories'));
    }

    /**
     * タスクを削除
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        // 自分のタスクかチェック
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json([
            'message' => 'タスクを削除しました。'
        ]);
    }
}
