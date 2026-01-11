<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    /**
     * List all packages
     */
    public function index(): JsonResponse
    {
        $packages = Package::with('location')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $packages,
        ]);
    }

    /**
     * Store a new package
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price_per_night' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'facilities' => 'nullable|array',
            'images' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $package = Package::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Package created successfully',
            'data' => $package,
        ], 201);
    }

    /**
     * Get package detail
     */
    public function show(int $id): JsonResponse
    {
        $package = Package::with('location')->find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Package not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $package,
        ]);
    }

    /**
     * Update a package
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Package not found',
            ], 404);
        }

        $validated = $request->validate([
            'location_id' => 'sometimes|exists:locations,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'price_per_night' => 'sometimes|numeric|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'facilities' => 'nullable|array',
            'images' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $package->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Package updated successfully',
            'data' => $package->fresh(),
        ]);
    }

    /**
     * Delete a package
     */
    public function destroy(int $id): JsonResponse
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Package not found',
            ], 404);
        }

        $package->delete();

        return response()->json([
            'success' => true,
            'message' => 'Package deleted successfully',
        ]);
    }
}
