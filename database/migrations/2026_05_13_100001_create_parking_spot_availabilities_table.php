<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parking_spot_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parking_spot_id')->constrained()->cascadeOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->enum('booking_type', ['long', 'hour', 'day']);
            $table->decimal('price', 8, 2);
            // Optional min/max booking duration (hours for 'hour' type, days for 'day' type)
            $table->unsignedSmallInteger('min_duration')->nullable();
            $table->unsignedSmallInteger('max_duration')->nullable();
            // Daily time window — only relevant for 'day' type
            $table->time('day_start_time')->nullable();
            $table->time('day_end_time')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parking_spot_availabilities');
    }
};
