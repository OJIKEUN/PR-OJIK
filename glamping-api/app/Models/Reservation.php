<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Reservation extends Model
{
    protected $fillable = [
        'booking_code',
        'package_id',
        'guest_name',
        'guest_email',
        'guest_phone',
        'check_in_date',
        'check_out_date',
        'guests_count',
        'total_price',
        'notes',
        'status',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'guests_count' => 'integer',
        'total_price' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($reservation) {
            if (empty($reservation->booking_code)) {
                $reservation->booking_code = self::generateBookingCode();
            }
        });
    }

    public static function generateBookingCode(): string
    {
        do {
            $code = 'GC-' . strtoupper(Str::random(8));
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function getNightsCountAttribute(): int
    {
        return $this->check_in_date->diffInDays($this->check_out_date);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in_date', '>=', now()->toDateString());
    }
}
