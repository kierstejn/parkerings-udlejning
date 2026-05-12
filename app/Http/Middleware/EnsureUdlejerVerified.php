<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUdlejerVerified
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()?->udlejer_verified) {
            return redirect()->route('dashboard.udlejer');
        }

        return $next($request);
    }
}
