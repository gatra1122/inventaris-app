<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            $id = $i+1;
            User::create([
                'name' => $faker->name,
                'email' => "user{$id}@email.com",
                'email_verified_at' => now(),
                'password' => bcrypt('1234'),
                'role' => 'user',
                // 'remember_token' => Str::random(10),
            ]);
        }

        for ($i = 0; $i < 2; $i++) {
            $id = $i+1;
            User::create([
                'name' => $faker->name,
                'email' => "admin{$id}@email.com",
                'email_verified_at' => now(),
                'password' => bcrypt('1234'), 
                'role' => 'admin',
                // 'remember_token' => Str::random(10),
            ]);
        }
    }
}