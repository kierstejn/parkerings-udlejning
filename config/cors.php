<?php

// config/cors.php
return [
    'paths' => [
        'api/*',           // covers /api/auth/login
        'auth/*',          // if you also call /auth/refresh etc.
        'sanctum/csrf-cookie',
        'login', 'logout', 'register', // if you have top-level routes
    ],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000', // add this too — dev servers sometimes use 127.0.0.1
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],   // or include specific: 'Content-Type','Authorization','X-Requested-With'
    'exposed_headers' => [],
    'supports_credentials' => true,
    'max_age' => 0,
];
