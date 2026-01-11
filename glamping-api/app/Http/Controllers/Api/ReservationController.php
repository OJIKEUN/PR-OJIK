<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Create a new reservation
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'required|string|max:20',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests_count' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $package = Package::find($request->package_id);

        // Check capacity
        if ($request->guests_count > $package->capacity) {
            return response()->json([
                'success' => false,
                'message' => 'Number of guests exceeds package capacity (' . $package->capacity . ' guests max)',
            ], 422);
        }

        // Check availability
        $conflicting = Reservation::where('package_id', $request->package_id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($request) {
                $query->whereBetween('check_in_date', [$request->check_in_date, $request->check_out_date])
                    ->orWhereBetween('check_out_date', [$request->check_in_date, $request->check_out_date])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('check_in_date', '<=', $request->check_in_date)
                            ->where('check_out_date', '>=', $request->check_out_date);
                    });
            })
            ->exists();

        if ($conflicting) {
            return response()->json([
                'success' => false,
                'message' => 'Selected dates are not available. Please choose different dates.',
            ], 422);
        }

        // Calculate total price
        $checkIn = \Carbon\Carbon::parse($request->check_in_date);
        $checkOut = \Carbon\Carbon::parse($request->check_out_date);
        $nights = $checkIn->diffInDays($checkOut);
        $totalPrice = $package->price_per_night * $nights;

        $reservation = Reservation::create([
            'package_id' => $request->package_id,
            'guest_name' => $request->guest_name,
            'guest_email' => $request->guest_email,
            'guest_phone' => $request->guest_phone,
            'check_in_date' => $request->check_in_date,
            'check_out_date' => $request->check_out_date,
            'guests_count' => $request->guests_count,
            'total_price' => $totalPrice,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        $reservation->load('package.location');

        return response()->json([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => $reservation,
        ], 201);
    }

    /**
     * Check reservation status by booking code and email
     */
    public function check(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'booking_code' => 'required|string',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $reservation = Reservation::with('package.location')
            ->where('booking_code', $request->booking_code)
            ->where('guest_email', $request->email)
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found. Please check your booking code and email.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation,
        ]);
    }
}
