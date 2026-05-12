<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function profil()
    {
        return Inertia::render('Dashboard/Profil');
    }

    public function bookinger()
    {
        return Inertia::render('Dashboard/Bookinger');
    }
}
