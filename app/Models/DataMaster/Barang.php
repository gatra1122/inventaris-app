<?php

namespace App\Models\DataMaster;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    /** @use HasFactory<\Database\Factories\DataMaster\BarangFactory> */
    use HasFactory;

    protected $table = 'barang';
    protected $guarded = [];

    public function kategori()
    {
        // return $this->belongsTo(Kategori::class, 'kategori_id');
        return $this->belongsTo(Kategori::class, 'kategori_id')->withDefault([
            'kategori' => 'Tanpa Kategori',
        ]);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id')->withDefault([
            'kategori' => 'Tanpa Supplier',
        ]);
    }
}
