<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMaster\Kategori;
use Illuminate\Http\Request;
use App\Http\Requests\StoreKategoriRequest;
use App\Http\Requests\UpdateKategoriRequest;
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
        $kategori = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diambil.',
            'data' => $kategori,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKategoriRequest $request)
    {
        $validated = $request->validated();
        $kategori = Kategori::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil ditambahkan.',
            'data' => $kategori,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kat = Kategori::findOrFail($id);
        return response()->json($kat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKategoriRequest $request, string $id)
    {
        $kat = Kategori::findOrFail($id);
        $validated = $request->validated();
        $kat->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil diubah.',
            'data' => $kat,
        ]);
    }

    // public function update(Request $request, string $id)
    // {
    //     $kat = Kategori::findOrFail($id);

    //     if ($request->has('kategori')) {
    //         $kat->kategori = $request->input('kategori');
    //         $kat->save();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Data kategori berhasil diubah.',
    //             'data' => $kat,
    //         ]);
    //     } else {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Field "kategori" tidak ditemukan dalam request.',
    //         ], 400);
    //     }
    // }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kat = Kategori::findOrFail($id);
        $kat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data kategori berhasil dihapus.',
        ]);
    }
}
