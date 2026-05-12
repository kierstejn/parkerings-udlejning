<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ParkingSpotImage extends Model
{
    protected $fillable = ['parking_spot_id', 'path', 'order'];

    protected $appends = ['url'];

    public function getUrlAttribute(): string
    {
        return Storage::disk('s3')->url($this->path);
    }

    public function parkingSpot(): BelongsTo
    {
        return $this->belongsTo(ParkingSpot::class);
    }
}
