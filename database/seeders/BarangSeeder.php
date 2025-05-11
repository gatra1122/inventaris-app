<?php

namespace Database\Seeders;

use App\Models\DataMaster\Barang;
use App\Models\DataMaster\BarangModel;
use App\Models\DataMaster\Kategori;
use App\Models\DataMaster\KategoriModel;
use App\Models\DataMaster\Supplier;
use App\Models\DataMaster\SupplierModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 200; $i++) {
            $tanggal = $faker->dateTimeBetween('-60 days', 'now');
            $tanggalUpdate = $faker->dateTimeBetween($tanggal, '+10 days');
            $tahun = $tanggal->format('Y');
            $bulan = $tanggal->format('m');

            $kategori = Kategori::inRandomOrder()->first()->id;
            $supplier = Supplier::inRandomOrder()->first()->id;
            $nama = $faker->randomElement([
                $faker->word,
                ($faker->word . ' ' . $faker->word),
                ($faker->word . ' ' . $faker->word . ' ' . $faker->word),
            ]);

            $kode_barang = sprintf('K%dS%d%02d%s%s', $kategori, $supplier, $i + 1, $tahun, $bulan);

            $stok = random_int(1,20);
            $stok_min = random_int(1, $stok);

            Barang::create([
                'kode' => $kode_barang,
                'nama' => $nama,
                'kategori_id' => $kategori,
                'supplier_id' => $supplier,
                'merk' => $faker->word,
                'spesifikasi' => $faker->sentence,
                'satuan' => $faker->randomElement(['KG', 'Pcs', 'Unit']),
                'stok' => $stok,
                'stok_minimum' => $stok_min,
                'gambar' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/300/300',
                'updated_at' => $tanggalUpdate,
                'created_at' => $tanggal,
            ]);
        }
    }
}