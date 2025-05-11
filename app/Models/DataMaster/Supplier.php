<?php

namespace App\Models\DataMaster;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    /** @use HasFactory<\Database\Factories\DataMaster\SupplierFactory> */
    use HasFactory;

    protected $table = 'supplier';
    protected $guarded = [];

}
