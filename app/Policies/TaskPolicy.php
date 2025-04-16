<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * タスク一覧の取得を許可するか
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * 特定のタスクの閲覧を許可するか
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * タスクの作成を許可するか
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * タスクの更新を許可するか
     */
    public function update(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * タスクの削除を許可するか
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }
}
