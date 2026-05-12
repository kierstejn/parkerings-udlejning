<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UdlejerController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->udlejer_verified) {
            return redirect()->route('dashboard.udlejer.parkeringspladser');
        }

        return Inertia::render('Dashboard/Udlejer/Index');
    }

    public function verify(Request $request)
    {
        $user = $request->user();
        $user->udlejer_verified = true;
        $user->save();

        return redirect()->route('dashboard.udlejer.parkeringspladser');
    }

    public function parkeringspladser(Request $request)
    {
        $spots = $request->user()->parkingSpots()->latest()->get();

        return Inertia::render('Dashboard/Udlejer/Parkeringspladser', [
            'spots' => $spots,
        ]);
    }

    public function storeParkeringsplads(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,udendoers,indendoers',
            'size'        => 'required|in:kompakt,standard,stor',
            'price'       => 'required|numeric|min:0',
            'price_unit'  => 'required|in:time,dag,md',
            'description' => 'nullable|string|max:2000',
        ]);

        $request->user()->parkingSpots()->create($data);

        return redirect()->route('dashboard.udlejer.parkeringspladser')
            ->with('success', 'Parkeringsplads oprettet.');
    }
}
