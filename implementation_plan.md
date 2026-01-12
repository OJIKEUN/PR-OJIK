# Implementation Plan: Glamping Reservation System

Website reservasi glamping dengan **React.js** sebagai frontend client dan **Laravel** sebagai backend API + Admin Panel.

---

## Project Structure

```
📁 c:\wamp64\www\PR-OJIK\
├── 📁 glamping-api/          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── Api/          # Public API Controllers
│   │   │   └── Admin/        # Admin Controllers
│   │   ├── Models/
│   │   └── Services/
│   ├── database/migrations/
│   ├── resources/views/admin/ # Admin Blade Templates
│   └── routes/
│       ├── api.php           # Public API routes
│       └── web.php           # Admin web routes
│
└── 📁 glamping-web/          # React.js Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/         # API calls
    │   └── assets/
    └── public/
```

---

## Database Schema (MySQL)

### Table: `locations`

| Column        | Type         | Description            |
| ------------- | ------------ | ---------------------- |
| id            | bigint       | Primary key            |
| name          | varchar(255) | Nama lokasi            |
| address       | text         | Alamat lengkap         |
| description   | text         | Deskripsi lokasi       |
| map_embed_url | text         | Google Maps embed URL  |
| image         | varchar(255) | Foto lokasi            |
| is_active     | boolean      | Status aktif           |
| timestamps    |              | created_at, updated_at |

### Table: `packages`

| Column            | Type          | Description            |
| ----------------- | ------------- | ---------------------- |
| id                | bigint        | Primary key            |
| location_id       | bigint FK     | Relasi ke locations    |
| name              | varchar(255)  | Nama paket             |
| slug              | varchar(255)  | URL-friendly name      |
| description       | text          | Deskripsi lengkap      |
| short_description | varchar(500)  | Deskripsi singkat      |
| price_per_night   | decimal(12,2) | Harga per malam        |
| capacity          | integer       | Kapasitas tamu         |
| facilities        | json          | Daftar fasilitas       |
| images            | json          | Array foto paket       |
| is_active         | boolean       | Status aktif           |
| timestamps        |               | created_at, updated_at |

### Table: `reservations`

| Column         | Type          | Description                              |
| -------------- | ------------- | ---------------------------------------- |
| id             | bigint        | Primary key                              |
| booking_code   | varchar(20)   | Kode unik booking                        |
| package_id     | bigint FK     | Relasi ke packages                       |
| guest_name     | varchar(255)  | Nama tamu                                |
| guest_email    | varchar(255)  | Email tamu                               |
| guest_phone    | varchar(20)   | No. telepon                              |
| check_in_date  | date          | Tanggal check-in                         |
| check_out_date | date          | Tanggal check-out                        |
| guests_count   | integer       | Jumlah tamu                              |
| total_price    | decimal(12,2) | Total harga                              |
| notes          | text          | Catatan tamu                             |
| status         | enum          | pending, confirmed, cancelled, completed |
| timestamps     |               | created_at, updated_at                   |

### Table: `galleries`

| Column      | Type         | Description            |
| ----------- | ------------ | ---------------------- |
| id          | bigint       | Primary key            |
| image       | varchar(255) | Path foto              |
| caption     | varchar(255) | Caption/testimoni      |
| guest_name  | varchar(255) | Nama tamu (opsional)   |
| is_featured | boolean      | Tampil di homepage     |
| sort_order  | integer      | Urutan tampil          |
| timestamps  |              | created_at, updated_at |

### Table: `pages`

| Column     | Type         | Description            |
| ---------- | ------------ | ---------------------- |
| id         | bigint       | Primary key            |
| slug       | varchar(100) | terms, policy, about   |
| title      | varchar(255) | Judul halaman          |
| content    | longtext     | Konten (HTML/Markdown) |
| timestamps |              | created_at, updated_at |

### Table: `settings`

| Column     | Type         | Description            |
| ---------- | ------------ | ---------------------- |
| id         | bigint       | Primary key            |
| key        | varchar(100) | Nama setting           |
| value      | text         | Nilai setting          |
| timestamps |              | created_at, updated_at |

---

## API Endpoints

### Public Endpoints

| Method | Endpoint                          | Description                  |
| ------ | --------------------------------- | ---------------------------- |
| GET    | `/api/packages`                   | List semua paket             |
| GET    | `/api/packages/{slug}`            | Detail paket                 |
| GET    | `/api/packages/{id}/availability` | Ketersediaan tanggal         |
| GET    | `/api/locations`                  | List lokasi                  |
| GET    | `/api/galleries`                  | List gallery                 |
| GET    | `/api/pages/{slug}`               | Konten halaman (S&K, Policy) |
| POST   | `/api/reservations`               | Buat booking baru            |
| GET    | `/api/reservations/check`         | Cek status booking           |

### Admin Endpoints

| Resource     | Routes                                     |
| ------------ | ------------------------------------------ |
| Dashboard    | `/admin/dashboard`                         |
| Packages     | `/admin/packages` (CRUD)                   |
| Locations    | `/admin/locations` (CRUD)                  |
| Reservations | `/admin/reservations` (List, View, Update) |
| Galleries    | `/admin/galleries` (CRUD)                  |
| Pages        | `/admin/pages` (Edit)                      |
| Settings     | `/admin/settings` (Edit)                   |

---

## Frontend Pages (React.js)

| Page               | Route              | Description                   |
| ------------------ | ------------------ | ----------------------------- |
| HomePage           | `/`                | Landing page + paket unggulan |
| PackagesPage       | `/packages`        | Daftar semua paket            |
| PackageDetailPage  | `/packages/:slug`  | Detail + kalender + booking   |
| GalleryPage        | `/gallery`         | Galeri foto + testimoni       |
| LocationsPage      | `/locations`       | Daftar lokasi                 |
| TermsPage          | `/terms`           | Syarat & Ketentuan            |
| PolicyPage         | `/policy`          | Kebijakan Penyewaan           |
| CheckBookingPage   | `/check-booking`   | Cek status booking            |
| BookingSuccessPage | `/booking/success` | Konfirmasi sukses             |

---

## Frontend Components

| Component   | Description                    |
| ----------- | ------------------------------ |
| Navbar      | Navigation bar responsif       |
| Footer      | Footer dengan kontak info      |
| PackageCard | Card paket dengan hover effect |
| Calendar    | Kalender reservasi interaktif  |
| BookingForm | Form data tamu                 |
| GalleryGrid | Grid foto dengan lightbox      |
| HeroSection | Hero banner homepage           |

---

## Admin Panel (Laravel Blade)

```
resources/views/admin/
├── layouts/app.blade.php
├── dashboard.blade.php
├── packages/
│   ├── index.blade.php
│   ├── create.blade.php
│   └── edit.blade.php
├── locations/
│   ├── index.blade.php
│   ├── create.blade.php
│   └── edit.blade.php
├── reservations/
│   ├── index.blade.php
│   └── show.blade.php
├── galleries/
│   ├── index.blade.php
│   └── create.blade.php
├── pages/edit.blade.php
└── settings/index.blade.php
```

---

## Tech Stack

| Layer         | Technology                    |
| ------------- | ----------------------------- |
| Backend       | Laravel 11 + PHP 8.2          |
| Frontend      | React 18 + Vite               |
| Database      | MySQL                         |
| Auth          | Laravel Sanctum               |
| Admin Styling | Bootstrap 5                   |
| Calendar      | React Calendar / FullCalendar |

---

## Implementation Order

| Phase       | Description                   |
| ----------- | ----------------------------- |
| 1. Setup    | Init Laravel + React projects |
| 2. Database | Migrations, Models, Seeders   |
| 3. API      | Controllers, Routes, Auth     |
| 4. Admin    | CRUD Views, Dashboard         |
| 5. Frontend | All pages + components        |
| 6. Testing  | Integration testing           |

---

## Booking Flow (Client)

```
1. Pilih Paket → 2. Lihat Kalender → 3. Pilih Tanggal → 4. Isi Form
                                                              ↓
    7. Selesai ← 6. Terima Kode Booking ← 5. Submit Booking
```

## Cek Status Booking

```
Input Email + Kode Booking → Tampilkan Status Reservasi
```
