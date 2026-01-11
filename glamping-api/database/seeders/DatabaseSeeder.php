<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Package;
use App\Models\Gallery;
use App\Models\Page;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@glamping.com',
            'password' => Hash::make('password123'),
        ]);

        // Create Locations
        $locations = [
            [
                'name' => 'Puncak Highlands',
                'address' => 'Jl. Raya Puncak KM 85, Cisarua, Bogor, Jawa Barat',
                'description' => 'Lokasi glamping di dataran tinggi Puncak dengan pemandangan gunung yang spektakuler. Udara sejuk dan suasana alam yang menenangkan.',
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6!2d106.9!3d-6.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDInMDAuMCJTIDEwNsKwNTQnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890',
                'image' => '/images/locations/puncak.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Bandung Valley',
                'address' => 'Jl. Dago Pakar, Ciburial, Cimenyan, Bandung, Jawa Barat',
                'description' => 'Terletak di lembah Bandung dengan panorama kota di malam hari. Akses mudah dari pusat kota dengan suasana pegunungan yang asri.',
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.6!2d107.6!3d-6.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTEnMDAuMCJTIDEwN8KwMzYnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890',
                'image' => '/images/locations/bandung.jpg',
                'is_active' => true,
            ],
        ];

        foreach ($locations as $locationData) {
            Location::create($locationData);
        }

        // Create Packages
        $packages = [
            [
                'location_id' => 1,
                'name' => 'Romantic Dome Tent',
                'slug' => 'romantic-dome-tent',
                'description' => 'Nikmati pengalaman glamping romantis dengan pasangan Anda di tent dome transparan kami. Dilengkapi dengan tempat tidur king size, AC, dan pemandangan bintang langsung dari kasur Anda. Paket ini cocok untuk honeymoon atau anniversary.',
                'short_description' => 'Tent dome transparan untuk pengalaman romantis dengan pemandangan bintang.',
                'price_per_night' => 1500000,
                'capacity' => 2,
                'facilities' => ['Tempat tidur King Size', 'AC', 'Kamar mandi dalam', 'Mini bar', 'Sarapan', 'Welcome drink', 'BBQ dinner'],
                'images' => ['/images/packages/romantic-1.jpg', '/images/packages/romantic-2.jpg', '/images/packages/romantic-3.jpg'],
                'is_active' => true,
            ],
            [
                'location_id' => 1,
                'name' => 'Family Safari Tent',
                'slug' => 'family-safari-tent',
                'description' => 'Tent safari besar yang cocok untuk keluarga dengan 2 kamar tidur terpisah. Dilengkapi dengan ruang keluarga, dapur mini, dan teras dengan pemandangan pegunungan. Aktivitas outdoor tersedia untuk anak-anak.',
                'short_description' => 'Tent safari luas dengan 2 kamar untuk keluarga.',
                'price_per_night' => 2500000,
                'capacity' => 5,
                'facilities' => ['2 Kamar tidur', 'Ruang keluarga', 'Dapur mini', 'AC', 'Kamar mandi dalam', 'Sarapan keluarga', 'Kids activity', 'Teras privat'],
                'images' => ['/images/packages/family-1.jpg', '/images/packages/family-2.jpg'],
                'is_active' => true,
            ],
            [
                'location_id' => 1,
                'name' => 'Luxury Treehouse',
                'slug' => 'luxury-treehouse',
                'description' => 'Rumah pohon mewah dengan interior modern. Terletak di ketinggian dengan akses tangga kayu. Pemandangan 360 derajat hutan dan pegunungan. Pengalaman unik yang tidak terlupakan.',
                'short_description' => 'Rumah pohon mewah dengan pemandangan 360 derajat.',
                'price_per_night' => 3500000,
                'capacity' => 2,
                'facilities' => ['Tempat tidur Queen Size', 'AC', 'Jacuzzi outdoor', 'Mini bar', 'Sarapan floating', 'Dinner romantico', 'Private balcony'],
                'images' => ['/images/packages/treehouse-1.jpg', '/images/packages/treehouse-2.jpg'],
                'is_active' => true,
            ],
            [
                'location_id' => 2,
                'name' => 'Mountain View Bell Tent',
                'slug' => 'mountain-view-bell-tent',
                'description' => 'Bell tent klasik dengan sentuhan modern. Terletak di lereng gunung dengan pemandangan kota Bandung di kejauhan. Ideal untuk pasangan atau solo traveler yang mencari ketenangan.',
                'short_description' => 'Bell tent dengan pemandangan gunung dan kota Bandung.',
                'price_per_night' => 1200000,
                'capacity' => 2,
                'facilities' => ['Tempat tidur Double', 'Kipas angin', 'Kamar mandi sharing', 'Breakfast', 'Campfire area', 'Hiking trail'],
                'images' => ['/images/packages/bell-tent-1.jpg', '/images/packages/bell-tent-2.jpg'],
                'is_active' => true,
            ],
        ];

        foreach ($packages as $packageData) {
            Package::create($packageData);
        }

        // Create Galleries
        $galleries = [
            ['image' => '/images/gallery/glamping-1.jpg', 'caption' => 'Sunset view dari tent dome kami', 'guest_name' => 'Rina & Andi', 'is_featured' => true, 'sort_order' => 1],
            ['image' => '/images/gallery/glamping-2.jpg', 'caption' => 'Morning coffee with a view', 'guest_name' => 'Sarah', 'is_featured' => true, 'sort_order' => 2],
            ['image' => '/images/gallery/glamping-3.jpg', 'caption' => 'BBQ night bersama keluarga', 'guest_name' => 'Keluarga Budi', 'is_featured' => true, 'sort_order' => 3],
            ['image' => '/images/gallery/glamping-4.jpg', 'caption' => 'Stargazing experience', 'guest_name' => 'Mike & Lisa', 'is_featured' => true, 'sort_order' => 4],
            ['image' => '/images/gallery/glamping-5.jpg', 'caption' => 'Floating breakfast experience', 'guest_name' => 'Diana', 'is_featured' => false, 'sort_order' => 5],
            ['image' => '/images/gallery/glamping-6.jpg', 'caption' => 'Bonfire night', 'guest_name' => null, 'is_featured' => false, 'sort_order' => 6],
        ];

        foreach ($galleries as $galleryData) {
            Gallery::create($galleryData);
        }

        // Create Pages
        $pages = [
            [
                'slug' => 'terms',
                'title' => 'Syarat dan Ketentuan',
                'content' => "<h2>Syarat dan Ketentuan Reservasi</h2>
<h3>1. Pemesanan</h3>
<p>Pemesanan dapat dilakukan melalui website kami atau menghubungi customer service. Pemesanan dianggap sah setelah menerima konfirmasi dari pihak kami.</p>

<h3>2. Pembayaran</h3>
<p>Pembayaran dapat dilakukan melalui transfer bank ke rekening yang tertera pada konfirmasi pemesanan. Pembayaran harus dilakukan dalam waktu 24 jam setelah pemesanan untuk menjamin ketersediaan.</p>

<h3>3. Pembatalan</h3>
<ul>
<li>Pembatalan H-7: Pengembalian 100%</li>
<li>Pembatalan H-3 sampai H-6: Pengembalian 50%</li>
<li>Pembatalan H-2 atau kurang: Tidak ada pengembalian</li>
</ul>

<h3>4. Check-in dan Check-out</h3>
<p>Check-in: 14:00 WIB | Check-out: 12:00 WIB</p>
<p>Early check-in atau late check-out dapat diatur dengan biaya tambahan, tergantung ketersediaan.</p>",
            ],
            [
                'slug' => 'policy',
                'title' => 'Kebijakan Penyewaan',
                'content' => "<h2>Kebijakan Penyewaan Glamping</h2>

<h3>Peraturan Umum</h3>
<ul>
<li>Dilarang membawa hewan peliharaan</li>
<li>Dilarang merokok di dalam tent</li>
<li>Dilarang membuat kebisingan setelah pukul 22:00</li>
<li>Dilarang membawa minuman beralkohol dari luar</li>
</ul>

<h3>Kerusakan</h3>
<p>Tamu bertanggung jawab atas segala kerusakan yang terjadi pada fasilitas glamping selama masa menginap. Biaya perbaikan akan dibebankan sesuai dengan tingkat kerusakan.</p>

<h3>Keamanan</h3>
<p>Kami menyediakan keamanan 24 jam. Namun, kami tidak bertanggung jawab atas kehilangan barang berharga tamu. Harap simpan barang berharga dengan aman.</p>

<h3>Force Majeure</h3>
<p>Dalam kondisi force majeure (bencana alam, pandemi, dll), penjadwalan ulang dapat dilakukan tanpa biaya tambahan.</p>",
            ],
            [
                'slug' => 'about',
                'title' => 'Tentang Kami',
                'content' => "<h2>GlampyCamp - Pengalaman Glamping Terbaik</h2>
<p>GlampyCamp adalah penyedia layanan glamping premium di Indonesia. Kami menghadirkan pengalaman berkemah mewah dengan sentuhan alam yang autentik.</p>

<h3>Visi Kami</h3>
<p>Menjadi destinasi glamping terbaik yang memberikan pengalaman alam tak terlupakan dengan kenyamanan premium.</p>

<h3>Misi Kami</h3>
<ul>
<li>Menyediakan akomodasi glamping berkualitas tinggi</li>
<li>Menjaga kelestarian alam sekitar</li>
<li>Memberikan pelayanan terbaik untuk setiap tamu</li>
</ul>",
            ],
        ];

        foreach ($pages as $pageData) {
            Page::create($pageData);
        }

        // Create Settings
        $settings = [
            ['key' => 'site_name', 'value' => 'GlampyCamp'],
            ['key' => 'site_tagline', 'value' => 'Experience Nature in Luxury'],
            ['key' => 'contact_email', 'value' => 'hello@glampycamp.com'],
            ['key' => 'contact_phone', 'value' => '+62 812 3456 7890'],
            ['key' => 'contact_whatsapp', 'value' => '6281234567890'],
            ['key' => 'instagram', 'value' => '@glampycamp'],
            ['key' => 'facebook', 'value' => 'GlampyCamp'],
        ];

        foreach ($settings as $settingData) {
            Setting::create($settingData);
        }
    }
}
