<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    /**
     * List all locations
     */
    public function index(): JsonResponse
    {
        $locations = Location::withCount('packages')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $locations,
        ]);
    }

    /**
     * Store a new location
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
            'map_embed_url' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'nullable',
        ]);

        // Handle is_active as boolean (comes as string from FormData)
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('locations', 'public');
            $validated['image'] = $path;
        }

        $location = Location::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Location created successfully',
            'data' => $location,
        ], 201);
    }

    /**
     * Get location detail
     */
    public function show(int $id): JsonResponse
    {
        $location = Location::withCount('packages')->find($id);

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

    /**
     * Update a location
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'nullable|string',
            'description' => 'nullable|string',
            'map_embed_url' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'is_active' => 'nullable',
        ]);

        // Handle is_active as boolean (comes as string from FormData)
        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($location->image && Storage::disk('public')->exists($location->getRawOriginal('image'))) {
                Storage::disk('public')->delete($location->getRawOriginal('image'));
            }

            $path = $request->file('image')->store('locations', 'public');
            $validated['image'] = $path;
        } else {
            // If not uploading new image, prevent overwriting with null/string if handled by frontend logic
            unset($validated['image']);
        }

        $location->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully',
            'data' => $location->fresh(),
        ]);
    }

    /**
     * Delete a location
     */
    public function destroy(int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }

        if ($location->packages()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete location with existing packages',
            ], 422);
        }

        $location->delete();

        return response()->json([
            'success' => true,
            'message' => 'Location deleted successfully',
        ]);
    }
}
