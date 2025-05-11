<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    // Register user
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'confirmed',
                Password::min(4)
                // ->letters()
                // ->symbols()
                // ->numbers()
            ]
        ]);
        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        return response([
            'status' => true,
            'message' => 'Berhasil register'
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|string',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response([
                'status' => false,
                'message' => 'Email atau password salah !'
            ], 400);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('myToken')->plainTextToken;
        return response([
            'status' => true,
            'message' => 'Berhasil masuk',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // $request->user()->tokens->each(function ($token) {
        //     $token->delete();
        // });

        $accessToken = $request->bearerToken();

        if ($accessToken) {
            $token = PersonalAccessToken::findToken($accessToken);
            if ($token && $token->tokenable_id === $request->user()->id) {
                $token->delete();
            }
        }

        return response()->json([
            'status' => true,
            'message' => 'Berhasil keluar'
        ]);
    }

    public function me()
    {
        $user = Auth::user();

        return response()->json([
            'status' => true,
            'message' => 'Authenticated user data',
            'user' => $user
        ]);
    }
}
