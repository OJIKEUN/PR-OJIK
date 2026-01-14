<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Package extends Model
{
    protected $fillable = [
        'location_id',
        'name',
        'slug',
        'description',
        'short_description',
        'price_per_night',
        'capacity',
        'facilities',
        'images',
        'is_active',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'capacity' => 'integer',
        'facilities' => 'array',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($package) {
            if (empty($package->slug)) {
                $package->slug = Str::slug($package->name);
            }
        });
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getFirstImageAttribute()
    {
        $images = $this->images;
        return $images[0] ?? null;
    }

    /**
     * Mutator: Encode images array to JSON when saving
     */
    public function setImagesAttribute($value)
    {
        $this->attributes['images'] = is_array($value) ? json_encode($value) : $value;
    }

    /**
     * Transform images array to full URLs
     */
    public function getImagesAttribute($value)
    {
        // Handle both JSON string and already decoded array
        if (is_string($value)) {
            $images = json_decode($value, true) ?? [];
        } else {
            $images = $value ?? [];
        }

        // Get base URL with correct port from request context, or fallback to config
        $baseUrl = request() ? request()->getSchemeAndHttpHost() : config('app.url');

        return array_map(function ($image) use ($baseUrl) {
            // If already a full URL, return as is
            if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
                return $image;
            }

            // If it's a storage path (from new uploads like "packages/filename.jpg")
            if (str_starts_with($image, 'packages/') || str_starts_with($image, 'locations/') || str_starts_with($image, 'galleries/')) {
                return $baseUrl . '/storage/' . $image;
            }

            // For old relative paths like /images/packages/...
            if (str_starts_with($image, '/')) {
                return $baseUrl . $image;
            }

            // Fallback
            return $baseUrl . '/storage/' . $image;
        }, $images);
    }
}
