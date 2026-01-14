<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Package;

echo "Fixing package images...\n";

$packages = Package::all();
foreach ($packages as $package) {
    $raw = $package->getRawOriginal('images');
    $images = json_decode($raw, true) ?? [];

    $fixed = array_map(function ($img) {
        // Extract relative path from full URL
        if (preg_match('/storage\/(.+)$/', $img, $matches)) {
            return $matches[1];
        }
        // Already relative path
        return $img;
    }, $images);

    // Update directly in DB to bypass accessor
    \DB::table('packages')
        ->where('id', $package->id)
        ->update(['images' => json_encode($fixed)]);

    echo "Fixed package ID: {$package->id}\n";
}

echo "Done!\n";
