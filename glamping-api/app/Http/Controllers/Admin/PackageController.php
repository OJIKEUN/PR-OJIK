<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
            'facilities' => 'nullable|string', // JSON string
            'is_active' => 'nullable',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Handle is_active as boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        // Handle facilities JSON
        if ($request->has('facilities')) {
            $validated['facilities'] = json_decode($request->input('facilities'), true) ?? [];
        }

        // Handle image uploads
        $images = [];

        // Process new image uploads - store relative paths only
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $file->store('packages', 'public');
                $images[] = $path; // Store relative path only
            }
        }

        $validated['images'] = $images;

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
            'facilities' => 'nullable|string', // JSON string
            'existing_images' => 'nullable|string', // JSON string of URLs to keep
            'is_active' => 'nullable',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle is_active as boolean
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        // Handle facilities JSON
        if ($request->has('facilities')) {
            $validated['facilities'] = json_decode($request->input('facilities'), true) ?? [];
        }

        // Handle images
        $images = [];

        // Keep existing images - extract relative paths from full URLs
        if ($request->has('existing_images')) {
            $existingImages = json_decode($request->input('existing_images'), true) ?? [];
            foreach ($existingImages as $existingUrl) {
                // Extract relative path from URL
                if (preg_match('/storage\/(.+)$/', $existingUrl, $matches)) {
                    $images[] = $matches[1];
                } elseif (preg_match('/packages\/[^/]+$/', $existingUrl, $matches)) {
                    $images[] = $matches[0];
                } else {
                    // Keep as-is if can't parse (old format)
                    $images[] = $existingUrl;
                }
            }
        }

        // Process new image uploads - store relative paths only
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $file->store('packages', 'public');
                $images[] = $path; // Store relative path only
            }
        }

        // Only update images if we have processed any
        if ($request->has('existing_images') || $request->hasFile('new_images')) {
            $validated['images'] = $images;
        }

        // Remove temporary validation fields
        unset($validated['existing_images']);

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
