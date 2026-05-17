<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParkingSpotAvailability extends Model
{
    protected $fillable = [
        'parking_spot_id',
        'starts_at',
        'ends_at',
        'is_active',
        'booking_type',
        'price',
        'min_duration',
        'max_duration',
        'day_start_time',
        'day_end_time',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at'   => 'datetime',
            'price'     => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function parkingSpot(): BelongsTo
    {
        return $this->belongsTo(ParkingSpot::class);
    }
}
