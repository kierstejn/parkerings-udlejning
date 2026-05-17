<?php

namespace Tests\Feature;

use App\Models\ParkingSpot;
use App\Models\ParkingSpotAvailability;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LandlordParkingSpotTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');
    }

    // ── Helpers ───────────────────────────────────────────────────

    private function landlord(): User
    {
        return User::factory()->landlord()->create();
    }

    private function spotData(array $overrides = []): array
    {
        return array_merge([
            'title'       => 'Test Spot',
            'address'     => 'Østerbrogade 1, 2100 København',
            'type'        => 'outdoor',
            'size'        => 'standard',
            'description' => '',
        ], $overrides);
    }

    // ── Create ────────────────────────────────────────────────────

    public function test_landlord_can_create_parking_spot(): void
    {
        $user = $this->landlord();

        $response = $this->actingAs($user)
            ->post('/landlord/parking-spots', $this->spotData());

        $response->assertRedirect('/landlord/parking-spots');
        $this->assertDatabaseHas('parking_spots', [
            'user_id' => $user->id,
            'title'   => 'Test Spot',
        ]);
    }

    public function test_guest_cannot_create_parking_spot(): void
    {
        $response = $this->post('/landlord/parking-spots', $this->spotData());

        $response->assertRedirect('/login');
    }

    public function test_unverified_user_cannot_create_parking_spot(): void
    {
        $user = User::factory()->create(['landlord_verified' => false]);

        $response = $this->actingAs($user)
            ->post('/landlord/parking-spots', $this->spotData());

        $response->assertRedirect('/landlord');
    }

    // ── Edit ──────────────────────────────────────────────────────

    public function test_landlord_can_edit_own_spot(): void
    {
        $user = $this->landlord();
        $spot = ParkingSpot::factory()->for($user)->create();

        $response = $this->actingAs($user)
            ->post("/landlord/parking-spots/{$spot->id}", $this->spotData(['title' => 'Updated Title']));

        $response->assertRedirect("/landlord/parking-spots/{$spot->id}");
        $this->assertDatabaseHas('parking_spots', [
            'id'    => $spot->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_landlord_cannot_edit_others_spot(): void
    {
        $owner = $this->landlord();
        $other = $this->landlord();
        $spot  = ParkingSpot::factory()->for($owner)->create();

        $response = $this->actingAs($other)
            ->post("/landlord/parking-spots/{$spot->id}", $this->spotData());

        $response->assertStatus(403);
    }

    // ── Delete ────────────────────────────────────────────────────

    public function test_landlord_can_delete_own_spot(): void
    {
        $user = $this->landlord();
        $spot = ParkingSpot::factory()->for($user)->create();

        $response = $this->actingAs($user)
            ->delete("/landlord/parking-spots/{$spot->id}");

        $response->assertRedirect('/landlord/parking-spots');
        $this->assertDatabaseMissing('parking_spots', ['id' => $spot->id]);
    }

    public function test_landlord_cannot_delete_others_spot(): void
    {
        $owner = $this->landlord();
        $other = $this->landlord();
        $spot  = ParkingSpot::factory()->for($owner)->create();

        $response = $this->actingAs($other)
            ->delete("/landlord/parking-spots/{$spot->id}");

        $response->assertStatus(403);
    }

    // ── Availability ──────────────────────────────────────────────

    public function test_landlord_can_create_availability(): void
    {
        $user = $this->landlord();
        $spot = ParkingSpot::factory()->for($user)->create();

        $response = $this->actingAs($user)
            ->post("/landlord/parking-spots/{$spot->id}/availability", [
                'starts_at'    => '2027-06-01T00:00:00.000000Z',
                'ends_at'      => '2027-09-01T00:00:00.000000Z',
                'booking_type' => 'day',
                'price'        => '150',
            ]);

        $response->assertRedirect("/landlord/parking-spots/{$spot->id}");
        $this->assertDatabaseHas('parking_spot_availabilities', [
            'parking_spot_id' => $spot->id,
            'booking_type'    => 'day',
        ]);
    }

    public function test_landlord_cannot_add_availability_to_others_spot(): void
    {
        $owner = $this->landlord();
        $other = $this->landlord();
        $spot  = ParkingSpot::factory()->for($owner)->create();

        $response = $this->actingAs($other)
            ->post("/landlord/parking-spots/{$spot->id}/availability", [
                'starts_at'    => '2027-06-01T00:00:00.000000Z',
                'ends_at'      => '2027-09-01T00:00:00.000000Z',
                'booking_type' => 'day',
                'price'        => '150',
            ]);

        $response->assertStatus(403);
    }

    public function test_availability_end_must_be_after_start(): void
    {
        $user = $this->landlord();
        $spot = ParkingSpot::factory()->for($user)->create();

        $response = $this->actingAs($user)
            ->post("/landlord/parking-spots/{$spot->id}/availability", [
                'starts_at'    => '2027-09-01T00:00:00.000000Z',
                'ends_at'      => '2027-06-01T00:00:00.000000Z',
                'booking_type' => 'day',
                'price'        => '150',
            ]);

        $response->assertSessionHasErrors('ends_at');
    }

    public function test_landlord_can_delete_availability(): void
    {
        $user  = $this->landlord();
        $spot  = ParkingSpot::factory()->for($user)->create();
        $avail = $spot->availabilities()->create([
            'starts_at'    => '2027-06-01 00:00:00',
            'ends_at'      => '2027-09-01 00:00:00',
            'booking_type' => 'day',
            'price'        => 100,
        ]);

        $response = $this->actingAs($user)
            ->delete("/landlord/parking-spots/availability/{$avail->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('parking_spot_availabilities', ['id' => $avail->id]);
    }

    public function test_landlord_cannot_delete_others_availability(): void
    {
        $owner = $this->landlord();
        $other = $this->landlord();
        $spot  = ParkingSpot::factory()->for($owner)->create();
        $avail = $spot->availabilities()->create([
            'starts_at'    => '2027-06-01 00:00:00',
            'ends_at'      => '2027-09-01 00:00:00',
            'booking_type' => 'day',
            'price'        => 100,
        ]);

        $this->actingAs($other)
            ->delete("/landlord/parking-spots/availability/{$avail->id}")
            ->assertStatus(403);
    }

    public function test_landlord_can_deactivate_availability(): void
    {
        $user  = $this->landlord();
        $spot  = ParkingSpot::factory()->for($user)->create();
        $avail = $spot->availabilities()->create([
            'starts_at'    => '2027-06-01 00:00:00',
            'ends_at'      => '2027-09-01 00:00:00',
            'booking_type' => 'day',
            'price'        => 100,
            'is_active'    => true,
        ]);

        $this->actingAs($user)
            ->patch("/landlord/parking-spots/availability/{$avail->id}/toggle")
            ->assertRedirect();

        $this->assertDatabaseHas('parking_spot_availabilities', [
            'id'        => $avail->id,
            'is_active' => false,
        ]);
    }

    public function test_landlord_can_reactivate_availability(): void
    {
        $user  = $this->landlord();
        $spot  = ParkingSpot::factory()->for($user)->create();
        $avail = $spot->availabilities()->create([
            'starts_at'    => '2027-06-01 00:00:00',
            'ends_at'      => '2027-09-01 00:00:00',
            'booking_type' => 'day',
            'price'        => 100,
            'is_active'    => false,
        ]);

        $this->actingAs($user)
            ->patch("/landlord/parking-spots/availability/{$avail->id}/toggle")
            ->assertRedirect();

        $this->assertDatabaseHas('parking_spot_availabilities', [
            'id'        => $avail->id,
            'is_active' => true,
        ]);
    }

    public function test_landlord_cannot_toggle_others_availability(): void
    {
        $owner = $this->landlord();
        $other = $this->landlord();
        $spot  = ParkingSpot::factory()->for($owner)->create();
        $avail = $spot->availabilities()->create([
            'starts_at'    => '2027-06-01 00:00:00',
            'ends_at'      => '2027-09-01 00:00:00',
            'booking_type' => 'day',
            'price'        => 100,
        ]);

        $this->actingAs($other)
            ->patch("/landlord/parking-spots/availability/{$avail->id}/toggle")
            ->assertStatus(403);
    }
}
