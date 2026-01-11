<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Reservation;
use App\Models\Location;
use App\Models\Gallery;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index(): JsonResponse
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $stats = [
            'total_packages' => Package::count(),
            'active_packages' => Package::active()->count(),
            'total_locations' => Location::count(),
            'total_galleries' => Gallery::count(),
            'total_reservations' => Reservation::count(),
            'pending_reservations' => Reservation::pending()->count(),
            'confirmed_reservations' => Reservation::confirmed()->count(),
            'upcoming_checkins' => Reservation::where('check_in_date', '>=', $today)
                ->whereIn('status', ['pending', 'confirmed'])
                ->count(),
            'this_month_reservations' => Reservation::where('created_at', '>=', $thisMonth)->count(),
            'this_month_revenue' => Reservation::where('created_at', '>=', $thisMonth)
                ->where('status', 'confirmed')
                ->sum('total_price'),
        ];

        $recentReservations = Reservation::with('package')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $upcomingCheckIns = Reservation::with('package')
            ->where('check_in_date', '>=', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('check_in_date')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'recent_reservations' => $recentReservations,
                'upcoming_checkins' => $upcomingCheckIns,
            ],
        ]);
    }
}
