<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ParkingSpot>
 */
class ParkingSpotFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title'   => $this->faker->words(3, true),
            'address' => $this->faker->streetAddress() . ', 2100 København',
            'type'    => $this->faker->randomElement(['outdoor', 'indoor', 'carport', 'garage']),
            'size'    => $this->faker->randomElement(['compact', 'standard', 'large']),
        ];
    }
}
