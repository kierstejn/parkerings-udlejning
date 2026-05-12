<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function profile()
    {
        return Inertia::render('Dashboard/Profile');
    }

    public function bookings()
    {
        return Inertia::render('Dashboard/Bookings');
    }
}
