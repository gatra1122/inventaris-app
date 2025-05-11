<?php

namespace App\Models\DataMaster;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    /** @use HasFactory<\Database\Factories\DataMaster\KategoriFactory> */
    use HasFactory;

    protected $table = 'kategori';
    protected $guarded = [];
}
