<?php

namespace App\Http\Controllers\Web;

use App\Models\ParkingSpot;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
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

        $radius = max(1, min(50, (int) ($request->radius ?? 15)));

        if ($request->filled('lat') && $request->filled('lng')) {
            $lat = (float) $request->lat;
            $lng = (float) $request->lng;
            $query->whereRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) < ?',
                [$lat, $lng, $lat, $radius]
            );
        } elseif ($request->filled('address')) {
            $geocoded = $this->geocodeAddress($request->address);
            if ($geocoded) {
                [$lat, $lng] = $geocoded;
                $query->whereRaw(
                    '(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) < ?',
                    [$lat, $lng, $lat, $radius]
                );
            } else {
                $query->where('address', 'like', '%' . $request->address . '%');
            }
        }

        $spots = $query->cursorPaginate(12)->withQueryString();

        return Inertia::render('Spots', [
            'spots'   => $spots,
            'filters' => collect($request->only(['type', 'address', 'lat', 'lng', 'radius']))->filter()->all(),
        ]);
    }

    private function geocodeAddress(string $address): ?array
    {
        $apiKey = env('GEOAPIFY_API_KEY');
        if (!$apiKey) return null;

        $response = Http::timeout(5)->get('https://api.geoapify.com/v1/geocode/search', [
            'text'    => $address,
            'filter'  => 'countrycode:dk',
            'limit'   => 1,
            'apiKey'  => $apiKey,
        ]);

        $feature = $response->json('features.0');
        if (!$feature) return null;

        return [$feature['properties']['lat'], $feature['properties']['lon']];
    }

    public function show(ParkingSpot $spot): Response
    {
        abort_unless($spot->is_active, 404);

        $spot->load(['images', 'availabilities' => function ($q) {
            $q->where('ends_at', '>=', Carbon::now())
              ->where('is_active', true)
              ->orderBy('starts_at');
        }]);

        return Inertia::render('SpotDetail', [
            'spot' => $spot,
        ]);
    }
}
