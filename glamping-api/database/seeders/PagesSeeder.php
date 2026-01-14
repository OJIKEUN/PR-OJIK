<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PagesSeeder extends Seeder
{
    /**
     * Seed the pages table.
     */
    public function run(): void
    {
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
            Page::updateOrCreate(
                ['slug' => $pageData['slug']],
                $pageData
            );
        }
    }
}
