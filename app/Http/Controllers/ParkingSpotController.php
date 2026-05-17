<?php

namespace App\Http\Controllers;

use App\Models\ParkingSpot;
use Illuminate\Http\Request;

class ParkingSpotController extends Controller
{
    public function nearby(): \Illuminate\Http\JsonResponse
    {
        $spots = ParkingSpot::with('images')
            ->latest()
            ->get();

        return response()->json($spots);
    }

    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $spots = $request->user()->parkingSpots()->latest()->get();

        return response()->json($spots);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!$request->user()->landlord_verified) {
            return response()->json(['message' => 'You must be verified with MitID to create parking spots.'], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,outdoor,indoor',
            'size'        => 'required|in:compact,standard,large',
            'price'       => 'required|numeric|min:0',
            'price_unit'  => 'required|in:hour,day,month',
            'description' => 'nullable|string|max:2000',
        ]);

        $spot = $request->user()->parkingSpots()->create($data);

        return response()->json($spot, 201);
    }
}
