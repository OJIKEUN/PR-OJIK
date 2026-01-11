<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PackageController extends Controller
{
    /**
     * Get all active packages
     */
    public function index(Request $request): JsonResponse
    {
        $query = Package::with('location')->active();

        if ($request->has('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $packages = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $packages,
        ]);
    }

    /**
     * Get featured packages for homepage
     */
    public function featured(): JsonResponse
    {
        $packages = Package::with('location')
            ->active()
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $packages,
        ]);
    }

    /**
     * Get package detail by slug
     */
    public function show(string $slug): JsonResponse
    {
        $package = Package::with('location')
            ->where('slug', $slug)
            ->active()
            ->first();

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
     * Get availability calendar for a package
     */
    public function availability(int $id, Request $request): JsonResponse
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Package not found',
            ], 404);
        }

        $startDate = $request->get('start_date', now()->toDateString());
        $endDate = $request->get('end_date', now()->addMonths(3)->toDateString());

        // Get booked dates
        $reservations = $package->reservations()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('check_out_date', '>=', $startDate)
            ->where('check_in_date', '<=', $endDate)
            ->get(['check_in_date', 'check_out_date', 'status']);

        $bookedDates = [];
        foreach ($reservations as $reservation) {
            $current = $reservation->check_in_date->copy();
            // Include both check-in and check-out dates as booked
            while ($current <= $reservation->check_out_date) {
                $bookedDates[] = [
                    'date' => $current->toDateString(),
                    'status' => $reservation->status,
                ];
                $current->addDay();
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'package_id' => $id,
                'booked_dates' => $bookedDates,
            ],
        ]);
    }
}
