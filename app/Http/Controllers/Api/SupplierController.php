<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataMaster\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $search = $request->query('search');

        $query = Supplier::query()
            ->when($search, fn($q) => $q->where('supplier', 'ILIKE', "%{$search}%"))
            ->orderByDesc('updated_at');
        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'message' => 'Semua data supplier berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Supplier $supplier)
    {
        Gate::authorize('create', $supplier);

        $validated = $request->validate([
            'supplier' => 'required|string|max:100',
            'alamat' => 'string|nullable|max:255',
            'kontak' => 'required|max:20|regex:/^[0-9\+\-\(\)\s]*$/',
            'email' => 'string|nullable|email|max:255',
            'deskripsi' => 'string|nullable|max:255'
        ]);
        $data = Supplier::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data supplier berhasil ditambahkan.',
            'data' => $data,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Supplier::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'Data supplier berhasil diambil.',
            'data' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier, string $id)
    {
        Gate::authorize('update', $supplier);

        $data = Supplier::findOrFail($id);

        $validated = $request->validate([
            'supplier' => 'required|string|max:100',
            'alamat' => 'string|nullable|max:255',
            'kontak' => 'required|max:20|regex:/^[0-9\+\-\(\)\s]*$/',
            'email' => 'string|nullable|email|max:255',
            'deskripsi' => 'string|nullable|max:255'
        ]);

        $data->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data supplier berhasil diubah.',
            'data' => $data,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier, string $id)
    {
        Gate::authorize('delete', $supplier);

        $data = Supplier::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data supplier berhasil dihapus.',
        ]);
    }
}