<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Laravel enum() on PostgreSQL = varchar + CHECK constraint
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_type_check');
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_size_check');
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_price_unit_check');

        DB::statement("UPDATE parking_spots SET type       = 'outdoor' WHERE type       = 'udendoers'");
        DB::statement("UPDATE parking_spots SET type       = 'indoor'  WHERE type       = 'indendoers'");
        DB::statement("UPDATE parking_spots SET size       = 'compact' WHERE size       = 'kompakt'");
        DB::statement("UPDATE parking_spots SET size       = 'large'   WHERE size       = 'stor'");
        DB::statement("UPDATE parking_spots SET price_unit = 'hour'    WHERE price_unit = 'time'");
        DB::statement("UPDATE parking_spots SET price_unit = 'day'     WHERE price_unit = 'dag'");
        DB::statement("UPDATE parking_spots SET price_unit = 'month'   WHERE price_unit = 'md'");

        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_type_check       CHECK (type       IN ('carport','garage','outdoor','indoor'))");
        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_size_check       CHECK (size       IN ('compact','standard','large'))");
        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_price_unit_check CHECK (price_unit IN ('hour','day','month'))");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_type_check');
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_size_check');
        DB::statement('ALTER TABLE parking_spots DROP CONSTRAINT IF EXISTS parking_spots_price_unit_check');

        DB::statement("UPDATE parking_spots SET type       = 'udendoers'  WHERE type       = 'outdoor'");
        DB::statement("UPDATE parking_spots SET type       = 'indendoers' WHERE type       = 'indoor'");
        DB::statement("UPDATE parking_spots SET size       = 'kompakt'    WHERE size       = 'compact'");
        DB::statement("UPDATE parking_spots SET size       = 'stor'       WHERE size       = 'large'");
        DB::statement("UPDATE parking_spots SET price_unit = 'time'       WHERE price_unit = 'hour'");
        DB::statement("UPDATE parking_spots SET price_unit = 'dag'        WHERE price_unit = 'day'");
        DB::statement("UPDATE parking_spots SET price_unit = 'md'         WHERE price_unit = 'month'");

        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_type_check       CHECK (type       IN ('carport','garage','udendoers','indendoers'))");
        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_size_check       CHECK (size       IN ('kompakt','standard','stor'))");
        DB::statement("ALTER TABLE parking_spots ADD CONSTRAINT parking_spots_price_unit_check CHECK (price_unit IN ('time','dag','md'))");
    }
};
