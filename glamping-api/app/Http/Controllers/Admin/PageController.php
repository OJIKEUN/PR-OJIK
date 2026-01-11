<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    /**
     * List all pages
     */
    public function index(): JsonResponse
    {
        $pages = Page::orderBy('slug')->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
        ]);
    }

    /**
     * Get page detail
     */
    public function show(int $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page,
        ]);
    }

    /**
     * Update a page
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'nullable|string',
        ]);

        $page->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Page updated successfully',
            'data' => $page->fresh(),
        ]);
    }
}
