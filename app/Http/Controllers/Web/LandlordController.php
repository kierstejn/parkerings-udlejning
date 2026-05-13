<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ParkingSpot;
use App\Models\ParkingSpotAvailability;
use App\Models\ParkingSpotImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandlordController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->landlord_verified) {
            return redirect()->route('dashboard.landlord.parking-spots');
        }

        return Inertia::render('Dashboard/Landlord/Index');
    }

    public function verify(Request $request)
    {
        $user = $request->user();
        $user->landlord_verified = true;
        $user->save();

        return redirect()->route('dashboard.landlord.parking-spots');
    }

    public function parkingSpots(Request $request)
    {
        $spots = $request->user()->parkingSpots()->with('images')->latest()->get();

        return Inertia::render('Dashboard/Landlord/ParkingSpots', [
            'spots' => $spots,
        ]);
    }

    public function show(Request $request, ParkingSpot $spot)
    {
        abort_if($spot->user_id !== $request->user()->id, 403);

        $spot->load(['images', 'availabilities' => fn ($q) => $q->orderBy('starts_at')]);

        return Inertia::render('Dashboard/Landlord/ParkingSpotDetail', [
            'spot' => $spot,
        ]);
    }

    public function edit(Request $request, ParkingSpot $spot)
    {
        abort_if($spot->user_id !== $request->user()->id, 403);

        $spot->load('images');

        return Inertia::render('Dashboard/Landlord/ParkingSpotEdit', [
            'spot' => $spot,
        ]);
    }

    public function storeParkingSpot(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,outdoor,indoor',
            'size'        => 'required|in:compact,standard,large',
            'description' => 'nullable|string|max:2000',
        ]);

        $request->user()->parkingSpots()->create($data);

        return redirect()->route('dashboard.landlord.parking-spots')
            ->with('success', 'Parking spot created.');
    }

    public function updateParkingSpot(Request $request, ParkingSpot $spot)
    {
        abort_if($spot->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,outdoor,indoor',
            'size'        => 'required|in:compact,standard,large',
            'description' => 'nullable|string|max:2000',
        ]);

        $spot->update($data);

        return redirect()->route('dashboard.landlord.parking-spots.show', $spot)
            ->with('success', 'Parking spot updated.');
    }

    public function storeImages(Request $request, ParkingSpot $spot)
    {
        abort_if($spot->user_id !== $request->user()->id, 403);

        $request->validate([
            'images'   => 'required|array|max:10',
            'images.*' => 'image|max:5120',
        ]);

        $existingCount = $spot->images()->count();
        foreach ($request->file('images') as $i => $file) {
            $path = $file->store("spots/{$spot->id}/public-images", 's3');
            $spot->images()->create(['path' => $path, 'order' => $existingCount + $i]);
        }

        return redirect()->back();
    }

    public function destroyImage(Request $request, ParkingSpotImage $image)
    {
        abort_if($image->parkingSpot->user_id !== $request->user()->id, 403);

        Storage::disk('s3')->delete($image->path);
        $image->delete();

        return redirect()->back();
    }

    public function storeAvailability(Request $request, ParkingSpot $spot)
    {
        abort_if($spot->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'starts_at'      => 'required|date|before:ends_at',
            'ends_at'        => 'required|date|after:starts_at',
            'booking_type'   => 'required|in:long,hour,day',
            'price'          => 'required|numeric|min:0',
            'min_duration'   => 'nullable|integer|min:1',
            'max_duration'   => 'nullable|integer|min:1|gte:min_duration',
            'day_start_time' => 'nullable|date_format:H:i|required_with:day_end_time',
            'day_end_time'   => 'nullable|date_format:H:i|after:day_start_time',
        ]);

        $spot->availabilities()->create($data);

        return redirect()->route('dashboard.landlord.parking-spots.show', $spot)
            ->with('success', 'Availability added.');
    }

    public function destroyAvailability(Request $request, ParkingSpotAvailability $availability)
    {
        abort_if($availability->parkingSpot->user_id !== $request->user()->id, 403);

        $availability->delete();

        return redirect()->back();
    }
}
