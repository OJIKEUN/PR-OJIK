<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * List all galleries
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
     * Store a new gallery
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'caption' => 'nullable|string|max:255',
            'guest_name' => 'nullable|string|max:255',
            'is_featured' => 'in:true,false,0,1',
            'sort_order' => 'integer',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $validated['is_featured'] = filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN);

        $gallery = Gallery::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item created successfully',
            'data' => $gallery,
        ], 201);
    }

    /**
     * Get gallery detail
     */
    public function show(int $id): JsonResponse
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $gallery,
        ]);
    }

    /**
     * Update a gallery
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found',
            ], 404);
        }

        $rules = [
            'caption' => 'nullable|string|max:255',
            'guest_name' => 'nullable|string|max:255',
            'is_featured' => 'in:true,false,0,1',
            'sort_order' => 'integer',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
        } else {
            $rules['image'] = 'sometimes|string';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('galleries', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        if ($request->has('is_featured')) {
            $validated['is_featured'] = filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN);
        }

        $gallery->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gallery item updated successfully',
            'data' => $gallery->fresh(),
        ]);
    }

    /**
     * Delete a gallery
     */
    public function destroy(int $id): JsonResponse
    {
        $gallery = Gallery::find($id);

        if (!$gallery) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found',
            ], 404);
        }

        // Delete image file if exists
        if ($gallery->image) {
            // Check if image path starts with host URL (from accessor)
            $path = str_replace(url('/storage') . '/', '', $gallery->image);
            // Or if it was stored as /storage/galleries/...
            $path = str_replace('/storage/', '', $path);

            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $gallery->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gallery item deleted successfully',
        ]);
    }
}
