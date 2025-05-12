<?php

namespace App\Policies;

use App\Models\DataMaster\Kategori;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class KategoriPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kategori $kategori): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat membuat Kategori.');
    }
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Kategori $kategori): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat mengubah data Kategori.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kategori $kategori): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus Kategori.');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Kategori $kategori): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat memulihkan Kategori.');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Kategori $kategori): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Akses ditolak: hanya admin yang dapat menghapus Kategori secara permanen.');
    }
}
