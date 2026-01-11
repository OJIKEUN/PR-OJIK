<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;

class GalleryController extends Controller
{
    /**
     * Get all galleries
     */
    public function index(): JsonResponse
    {
        $galleries = Gallery::ordered()->get();

        return response()->json([
            'success' => true,
            'data' => $galleries,
        ]);
    }

    /**
     * Get featured galleries for homepage
     */
    public function featured(): JsonResponse
    {
        $galleries = Gallery::featured()
            ->ordered()
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $galleries,
        ]);
    }
}
