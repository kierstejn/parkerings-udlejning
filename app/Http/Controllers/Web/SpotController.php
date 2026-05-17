<?php

namespace App\Http\Controllers\Web;

use App\Models\ParkingSpot;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class SpotController
{
    public function index(Request $request): Response
    {
        $query = ParkingSpot::query()
            ->where('is_active', true)
            ->with('images');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = (float) $request->lat;
            $lng = (float) $request->lng;
            $query->whereRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) < 15',
                [$lat, $lng, $lat]
            );
        } elseif ($request->filled('address')) {
            $query->where('address', 'like', '%' . $request->address . '%');
        }

        $spots = $query->cursorPaginate(12)->withQueryString();

        return Inertia::render('Spots', [
            'spots'   => $spots,
            'filters' => collect($request->only(['type', 'address', 'lat', 'lng']))->filter()->all(),
        ]);
    }

    public function show(ParkingSpot $spot): Response
    {
        abort_unless($spot->is_active, 404);

        $spot->load(['images', 'availabilities' => function ($q) {
            $q->where('ends_at', '>=', Carbon::now())->orderBy('starts_at');
        }]);

        return Inertia::render('SpotDetail', [
            'spot' => $spot,
        ]);
    }
}
