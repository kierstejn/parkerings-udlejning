<?php

namespace Tests\Feature;

use App\Models\ParkingSpot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpotDetailTest extends TestCase
{
    use RefreshDatabase;

    // ── Visibility ────────────────────────────────────────────────

    public function test_show_renders_active_spot(): void
    {
        $spot = ParkingSpot::factory()->create(['is_active' => true]);

        $this->get("/spots/{$spot->id}")
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('SpotDetail')
                ->where('spot.id', $spot->id)
            );
    }

    public function test_show_returns_404_for_inactive_spot(): void
    {
        $spot = ParkingSpot::factory()->create(['is_active' => false]);

        $this->get("/spots/{$spot->id}")->assertStatus(404);
    }

    // ── Availabilities ────────────────────────────────────────────

    public function test_show_includes_active_future_availabilities(): void
    {
        $spot  = ParkingSpot::factory()->create(['is_active' => true]);
        $avail = $spot->availabilities()->create([
            'starts_at'    => now()->addDays(1),
            'ends_at'      => now()->addDays(30),
            'booking_type' => 'day',
            'price'        => 150,
            'is_active'    => true,
        ]);

        $this->get("/spots/{$spot->id}")
            ->assertInertia(fn ($page) => $page
                ->has('spot.availabilities', 1)
                ->where('spot.availabilities.0.id', $avail->id)
            );
    }

    public function test_show_excludes_deactivated_availabilities(): void
    {
        $spot = ParkingSpot::factory()->create(['is_active' => true]);
        $spot->availabilities()->create([
            'starts_at'    => now()->addDays(1),
            'ends_at'      => now()->addDays(30),
            'booking_type' => 'day',
            'price'        => 150,
            'is_active'    => false,
        ]);

        $this->get("/spots/{$spot->id}")
            ->assertInertia(fn ($page) => $page
                ->where('spot.availabilities', [])
            );
    }

    public function test_show_excludes_past_availabilities(): void
    {
        $spot = ParkingSpot::factory()->create(['is_active' => true]);
        $spot->availabilities()->create([
            'starts_at'    => now()->subDays(30),
            'ends_at'      => now()->subDays(1),
            'booking_type' => 'day',
            'price'        => 150,
            'is_active'    => true,
        ]);

        $this->get("/spots/{$spot->id}")
            ->assertInertia(fn ($page) => $page
                ->where('spot.availabilities', [])
            );
    }
}
