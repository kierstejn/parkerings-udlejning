<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use Laravel\Sanctum\PersonalAccessToken;

class UserAuthController extends Controller
{

    public function login(Request $request): \Illuminate\Http\JsonResponse
    {
        $loginUserData = $request->validate([
            'email'=>'required|string|email',
            'password'=>'required'
        ]);

        $user = User::where('email',$loginUserData['email'])->first();

        if(!$user || !Hash::check($loginUserData['password'],$user->password)){
            return response()->json([
                'message' => 'Invalid Credentials'
            ],401);
        }
        $token = $user->createToken('access_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => config('sanctum.expiration') ? config('sanctum.expiration') * 60 : 86400,
            'user' => $user
        ])->cookie($this->getRefreshCookie($refreshToken));
    }

    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('access_token')->plainTextToken;
        $refreshToken = $user->createToken('refresh_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'expires_in'   => config('sanctum.expiration') ? config('sanctum.expiration') * 60 : 86400,
            'user'         => $user,
        ], 201)->cookie($this->getRefreshCookie($refreshToken));
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token not found'], 401);
        }

        // Get token from database
        [$id, $token] = explode('|', $refreshToken, 2);

        $tokenModel = PersonalAccessToken::find($id);

        if (!$tokenModel) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        // Verify the token matches
        if (!hash_equals($tokenModel->token, hash('sha256', $token))) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }


        if ($tokenModel->name !== 'refresh_token') {
            return response()->json(['message' => 'Invalid token type'], 401);
        }

        // Get user and create new tokens
        $user = $tokenModel->tokenable;

        // Delete old refresh token
        $tokenModel->delete();

        // Create new access token
        $accessToken = $user->createToken('access_token')->plainTextToken;

        // Create new refresh token
        $newRefreshToken = $user->createToken('refresh_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => config('sanctum.expiration') * 60
        ])->cookie($this->getRefreshCookie($newRefreshToken));
    }

    public function logout(Request $request)
    {
        // Revoke access token
        $request->user()->currentAccessToken()->delete();

        // Revoke refresh token if exists
        $refreshToken = $request->cookie('refresh_token');

        if ($refreshToken) {
            [$id] = explode('|', $refreshToken, 2);
            if ($token = PersonalAccessToken::find($id)) {
                $token->delete();
            }
        }

        return response()->json([
            'message' => 'Successfully logged out'
        ])->cookie($this->getRefreshCookie('', true));
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function verifyUdlejer(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();
        $user->udlejer_verified = true;
        $user->save();

        return response()->json($user);
    }

    protected function getRefreshCookie($token, $clear = false)
    {
        return Cookie::make(
            'refresh_token',
            $token,
            $clear ? -1 : 10080, // 7 days in minutes
            'api/auth/refresh',
            null,
            config('app.env') === 'production', // secure in production
            true, // httpOnly
            false,
            'lax' // sameSite
        );
    }

}
