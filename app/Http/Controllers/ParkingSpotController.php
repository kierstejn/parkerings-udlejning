<?php

namespace App\Http\Controllers;

use App\Models\ParkingSpot;
use Illuminate\Http\Request;

class ParkingSpotController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $spots = $request->user()->parkingSpots()->latest()->get();

        return response()->json($spots);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        if (!$request->user()->udlejer_verified) {
            return response()->json(['message' => 'Du skal verificeres med MitID for at oprette parkeringspladser.'], 403);
        }

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,udendoers,indendoers',
            'size'        => 'required|in:kompakt,standard,stor',
            'price'       => 'required|numeric|min:0',
            'price_unit'  => 'required|in:time,dag,md',
            'description' => 'nullable|string|max:2000',
        ]);

        $spot = $request->user()->parkingSpots()->create($data);

        return response()->json($spot, 201);
    }
}
