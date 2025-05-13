<?php

namespace Database\Seeders;

use App\Models\DataMaster\Barang;
use App\Models\DataMaster\Kategori;
use App\Models\DataMaster\Supplier;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Str;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 200; $i++) {
            $now = Carbon::now();
            $enamPuluhHariLalu = $now->copy()->subDays(60);
            $tanggal = $faker->dateTimeBetween($enamPuluhHariLalu, $now);
            $tanggalUpdate = $faker->dateTimeBetween($tanggal, $now);
            $tahun = $tanggal->format('Y');
            $bulan = $tanggal->format('m');
            $waktu = $tanggal->format('Hi');

            $kategori = Kategori::inRandomOrder()->first()->id;
            $supplier = Supplier::inRandomOrder()->first()->id;
            $nama = $faker->randomElement([
                $faker->word,
                ($faker->word . ' ' . $faker->word),
                ($faker->word . ' ' . $faker->word . ' ' . $faker->word),
            ]);

            $namaSingkat = Str::upper(Str::substr($nama, 0, 3));
            $kode_barang = sprintf(
                'K%dS%d%s%s%s%s',
                $kategori,
                $supplier,
                $namaSingkat,
                $tahun,
                $bulan,
                $waktu
            );

            $stok = random_int(1, 20);
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
