<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMaster\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class KategoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Kategori::query()
            ->when($search, fn($q) => $q->where('kategori', 'ILIKE', "%{$search}%"))
            ->orderByDesc('updated_at');
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data kategori berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Kategori $kategori)
    {
        Gate::authorize('create', $kategori);

        $validated = $request->validate([
            'kategori' => 'required|string',
        ]);
        $data = Kategori::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Kategori::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kategori $kategori, string $id)
    {
        Gate::authorize('update', $kategori);

        $data = Kategori::findOrFail($id);

        $validated = $request->validate([
            'kategori' => 'required|string',
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diubah.',
            'data' => $data,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kategori $kategori, string $id)
    {
        Gate::authorize('delete', $kategori);

        $kat = Kategori::findOrFail($id);
        $kat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil dihapus.',
        ]);
    }
}
