<?php

namespace Database\Seeders;

use App\Models\DataMaster\Supplier;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 5; $i++) {
            Supplier::create([
                'supplier' => $faker->name,
                'alamat' => $faker->address,
                'kontak' => $faker->phoneNumber,
                'email' => $faker->email,
                'deskripsi' => $faker->sentence,
            ]);
        }
    }
}