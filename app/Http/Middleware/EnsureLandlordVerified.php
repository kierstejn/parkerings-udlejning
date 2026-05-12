<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureLandlordVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()?->landlord_verified) {
            return redirect()->route('dashboard.landlord');
        }

        return $next($request);
    }
}
