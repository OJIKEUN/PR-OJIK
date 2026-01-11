<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    /**
     * Get all active locations
     */
    public function index(): JsonResponse
    {
        $locations = Location::with(['packages' => function ($query) {
            $query->active();
        }])
            ->active()
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $locations,
        ]);
    }

    /**
     * Get location detail
     */
    public function show(int $id): JsonResponse
    {
        $location = Location::with(['packages' => function ($query) {
            $query->active();
        }])
            ->active()
            ->find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $location,
        ]);
    }
}
