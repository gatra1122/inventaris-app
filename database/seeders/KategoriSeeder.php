<?php

namespace Database\Seeders;

use App\Models\DataMaster\Kategori;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        $kategori_brg = [
            $faker->randomElement([$faker->word, $faker->word . ' ' . $faker->word]),
            $faker->randomElement([$faker->word, $faker->word . ' ' . $faker->word]),
            $faker->randomElement([$faker->word, $faker->word . ' ' . $faker->word]),
            $faker->randomElement([$faker->word, $faker->word . ' ' . $faker->word]),
            $faker->randomElement([$faker->word, $faker->word . ' ' . $faker->word]),
        ];

        foreach ($kategori_brg as $kat) {
            Kategori::create([
                'kategori' => $kat,
            ]);
        }
    }
}
