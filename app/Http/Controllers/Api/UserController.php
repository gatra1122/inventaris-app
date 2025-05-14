<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = User::query()
            ->when($search, fn($q) => $q->where('name', 'ILIKE', "%{$search}%"))
            ->orderByDesc('updated_at');
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data user berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user)
    {
        Gate::authorize('create', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:admin,user',
            'password' => 'required|string|min:4|confirmed',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $data = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = User::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, string $id)
    {
        Gate::authorize('update', $user);

        $data = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:4|confirmed',
        ]);


        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil diubah.',
            'data' => $data,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, string $id)
    {
        Gate::authorize('delete', $user);

        $data = User::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data user berhasil dihapus.',
        ]);
    }
}
