<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\ParkingSpot;
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

    public function storeParkingSpot(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'address'     => 'required|string|max:255',
            'type'        => 'required|in:carport,garage,outdoor,indoor',
            'size'        => 'required|in:compact,standard,large',
            'price'       => 'required|numeric|min:0',
            'price_unit'  => 'required|in:hour,day,month',
            'description' => 'nullable|string|max:2000',
            'images'      => 'nullable|array|max:10',
            'images.*'    => 'image|max:5120',
        ]);

        $spot = $request->user()->parkingSpots()->create($data);

        foreach ($request->file('images', []) as $i => $file) {
            $path = $file->store("spots/{$spot->id}", 's3');
            $spot->images()->create(['path' => $path, 'order' => $i]);
        }

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
            'price'       => 'required|numeric|min:0',
            'price_unit'  => 'required|in:hour,day,month',
            'description' => 'nullable|string|max:2000',
            'images'      => 'nullable|array|max:10',
            'images.*'    => 'image|max:5120',
        ]);

        $spot->update($data);

        $existingCount = $spot->images()->count();
        foreach ($request->file('images', []) as $i => $file) {
            $path = $file->store("spots/{$spot->id}", 's3');
            $spot->images()->create(['path' => $path, 'order' => $existingCount + $i]);
        }

        return redirect()->route('dashboard.landlord.parking-spots')
            ->with('success', 'Parking spot updated.');
    }

    public function destroyImage(Request $request, ParkingSpotImage $image)
    {
        abort_if($image->parkingSpot->user_id !== $request->user()->id, 403);

        Storage::disk('s3')->delete($image->path);
        $image->delete();

        return redirect()->back();
    }
}
