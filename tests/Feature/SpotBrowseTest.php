<?php

namespace Tests\Feature;

use App\Models\ParkingSpot;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SpotBrowseTest extends TestCase
{
    use RefreshDatabase;

    // ── Helpers ───────────────────────────────────────────────────

    private function activeSpot(array $attrs = []): ParkingSpot
    {
        return ParkingSpot::factory()->create(array_merge(['is_active' => true], $attrs));
    }

    // ── Visibility ────────────────────────────────────────────────

    public function test_browse_shows_active_spots(): void
    {
        $spot = $this->activeSpot(['title' => 'Visible Spot']);

        $this->get('/spots')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->where('spots.data.0.id', $spot->id)
            );
    }

    public function test_browse_excludes_inactive_spots(): void
    {
        ParkingSpot::factory()->create(['is_active' => false, 'title' => 'Hidden Spot']);

        $this->get('/spots')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->where('spots.data', [])
            );
    }

    // ── Type filter ───────────────────────────────────────────────

    public function test_browse_filters_by_type(): void
    {
        $outdoor = $this->activeSpot(['type' => 'outdoor']);
        $this->activeSpot(['type' => 'garage']);

        $this->get('/spots?type=outdoor')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->has('spots.data', 1)
                ->where('spots.data.0.id', $outdoor->id)
            );
    }

    // ── Address text filter ───────────────────────────────────────

    public function test_browse_filters_by_address_text(): void
    {
        // Fake geocoding so it returns no result → controller falls back to LIKE search
        Http::fake(['*' => Http::response(['features' => []], 200)]);

        $match = $this->activeSpot(['address' => 'Nørrebrogade 20, 2200 København N']);
        $this->activeSpot(['address' => 'Vesterbrogade 5, 1620 København V']);

        $this->get('/spots?address=Nørrebrogade')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->has('spots.data', 1)
                ->where('spots.data.0.id', $match->id)
            );
    }

    // ── Coordinate / radius filter ────────────────────────────────

    public function test_browse_returns_spot_within_radius(): void
    {
        // Copenhagen city centre — 0 km from search point
        $nearby = $this->activeSpot(['lat' => 55.6761, 'lng' => 12.5683]);
        // Roskilde — ~30 km away, outside default 15 km
        $this->activeSpot(['lat' => 55.6415, 'lng' => 12.0873]);

        $this->get('/spots?lat=55.6761&lng=12.5683&radius=15')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->has('spots.data', 1)
                ->where('spots.data.0.id', $nearby->id)
            );
    }

    public function test_browse_excludes_spot_outside_radius(): void
    {
        // Roskilde — ~30 km from Copenhagen
        $this->activeSpot(['lat' => 55.6415, 'lng' => 12.0873]);

        $this->get('/spots?lat=55.6761&lng=12.5683&radius=15')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->where('spots.data', [])
            );
    }

    public function test_browse_radius_param_is_respected(): void
    {
        // ~6 km north of search point — inside 10 km radius, outside 5 km radius
        $spot = $this->activeSpot(['lat' => 55.7300, 'lng' => 12.5683]);

        $this->get('/spots?lat=55.6761&lng=12.5683&radius=5')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->where('spots.data', [])
            );

        $this->get('/spots?lat=55.6761&lng=12.5683&radius=10')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->has('spots.data', 1)
                ->where('spots.data.0.id', $spot->id)
            );
    }

    // ── Filters echoed back ───────────────────────────────────────

    public function test_applied_filters_are_returned_in_props(): void
    {
        $this->get('/spots?type=garage&radius=20&lat=55.6761&lng=12.5683')
            ->assertInertia(fn ($page) => $page
                ->component('Spots')
                ->where('filters.type', 'garage')
                ->where('filters.radius', '20')
            );
    }
}
