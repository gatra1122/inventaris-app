<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMaster\Barang;
use App\Models\DataMaster\Kategori;
use App\Models\DataMaster\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use Illuminate\Support\Str;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Barang::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'ILIKE', "%{$search}%")
                        ->orWhere('kode', 'ILIKE', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data barang berhasil diambil.',
            'data' => $data,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Barang $barang)
    {
        Gate::authorize('create', $barang);

        $tanggal = Carbon::now();
        $tahun = $tanggal->format('Y');
        $bulan = $tanggal->format('m');
        $waktu = $tanggal->format('Hi');

        $namaSingkat = Str::upper(Str::substr($request->nama, 0, 3));
        $kode_barang = sprintf(
            'K%dS%d%s%s%s%s',
            $request->kategori_id,
            $request->supplier_id,
            $namaSingkat,
            $tahun,
            $bulan,
            $waktu
        );
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kategori_id' => 'required|numeric',
            'supplier_id' => 'required|numeric',
            'merk' => 'required|nullable|string|max:255',
            'spesifikasi' => 'required|nullable|string|max:255',
            'satuan' => 'required|string|max:255',
            'stok' => 'required|numeric',
            'stok_minimum' => 'required|numeric',
            'gambar' => 'nullable|string',
        ]);
        $validated['kode'] = $kode_barang;
        $data = Barang::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    public function listKategori()
    {
        $data = Kategori::select('id', 'kategori')->get();
        return response()->json([
            'success' => true,
            'message' => 'Daftar kategori berhasil diambil.',
            'data' => $data,
        ]);
    }
    public function listSupplier()
    {
        $data = Supplier::select('id', 'supplier')->get();
        return response()->json([
            'success' => true,
            'message' => 'Daftar supplier berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Barang::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Barang $barang, string $id)
    {
        Gate::authorize('update', $barang);

        $data = Barang::findOrFail($id);

        $validated = $request->validate([
            'kode' => 'required|string',
            'nama' => 'required|string|max:255',
            'kategori_id' => 'required|numeric',
            'supplier_id' => 'required|numeric',
            'merk' => 'required|nullable|string|max:255',
            'spesifikasi' => 'required|nullable|string|max:255',
            'satuan' => 'required|string|max:255',
            'stok' => 'required|numeric',
            'stok_minimum' => 'required|numeric',
            'gambar' => 'nullable|string',
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil diubah.',
            'data' => $data,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Barang $barang, string $id)
    {
        Gate::authorize('delete', $barang);

        $data = Barang::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data barang berhasil dihapus.',
        ]);
    }
}
