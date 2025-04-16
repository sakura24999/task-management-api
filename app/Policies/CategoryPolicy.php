<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    /**
     * カテゴリー一覧の取得を許可するか
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * 特定のカテゴリーの閲覧を許可するか
     */
    public function view(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    /**
     * カテゴリーの作成を許可するか
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * カテゴリーの更新を許可するか
     */
    public function update(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    /**
     * カテゴリーの削除を許可するか
     */
    public function delete(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }
}
