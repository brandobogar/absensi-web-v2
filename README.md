# 📱 Aplikasi Absensi Pegawai

Aplikasi absensi pegawai berbasis web yang dikembangkan untuk mendukung proses pencatatan kehadiran secara **digital, terstruktur, dan terintegrasi**.

Aplikasi dirancang dengan konsep **multi-OPD**, sehingga dapat digunakan oleh beberapa Organisasi Perangkat Daerah (OPD) dengan pengelolaan pegawai, konfigurasi jam absensi, lokasi kantor, radius absensi, serta hak akses administrator.

---

## 🚀 Teknologi

### Frontend

* **React**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Leaflet**
* **React Leaflet**

### Backend

* **Google Apps Script**
* **Google Spreadsheet** sebagai database

### Deployment

* **Vercel** untuk deployment frontend
* Google Apps Script sebagai backend/API

---

## ✨ Fitur Utama

### 👤 Pegawai

* Login pegawai
* Identitas pegawai
* Username dan password
* Nomor Induk Pegawai (NIP)
* Status akun aktif/nonaktif
* Perubahan username
* Perubahan password
* Reset password oleh administrator
* Pencatatan absensi

### 📍 Absensi Berbasis Lokasi

Aplikasi menggunakan koordinat GPS perangkat untuk menentukan jarak pegawai dari lokasi kantor.

Fitur yang tersedia:

* Pengambilan lokasi GPS
* Perhitungan jarak ke kantor
* Radius absensi yang dapat dikonfigurasi
* Informasi lokasi kantor
* Validasi lokasi sebelum absensi
* Dukungan bypass radius untuk pegawai tertentu

Perhitungan jarak menggunakan metode **Haversine** pada sisi aplikasi.

> Pengembangan berikutnya akan memperkuat validasi lokasi pada sisi backend untuk mencegah manipulasi request dari client.

---

## ⏰ Manajemen Sesi Absensi

Sistem mendukung beberapa sesi absensi:

* Masuk
* Istirahat
* Pulang

Jam absensi dapat dikonfigurasi berdasarkan OPD.

Konfigurasi juga mendukung perbedaan jadwal antara:

* Senin–Kamis
* Jumat

Setiap sesi memiliki:

* Jam mulai
* Jam selesai

---

## 🏢 Multi-OPD

Aplikasi menggunakan konsep multi-OPD.

Setiap OPD memiliki konfigurasi tersendiri, antara lain:

* ID OPD
* Nama OPD
* Status OPD
* Radius absensi
* Latitude kantor
* Longitude kantor
* Jadwal absensi

Contoh ID OPD:

```text
OPD000
```

---

## 👨‍💼 Manajemen Pegawai

Administrator dapat mengelola data pegawai.

Struktur data pegawai:

| Field           | Keterangan          |
| --------------- | ------------------- |
| `id_pegawai`    | ID unik pegawai     |
| `opd_id`        | ID OPD              |
| `nama`          | Nama pegawai        |
| `username`      | Username login      |
| `password`      | Password            |
| `nip`           | Nomor Induk Pegawai |
| `status_aktif`  | Status akun         |
| `bypass_radius` | Pengecualian radius |
| `bypass_sesi`   | Pengecualian sesi   |

Format ID pegawai:

```text
peg-0001
peg-0002
peg-0003
...
```

---

# 🔐 Security

Keamanan merupakan salah satu bagian yang sedang dikembangkan secara bertahap.

## Authentication

Fitur keamanan login yang telah diterapkan:

* Validasi username dan password
* Validasi status akun
* Pemisahan login administrator dan pegawai
* Penghapusan log password dari sisi aplikasi
* Validasi akun nonaktif

### Device ID

Setiap perangkat yang digunakan untuk login mendapatkan `device_id` yang disimpan pada `localStorage`.

Contoh:

```text
5156babe-7a2f-41b3-b694-d83d6ecdb27b
```

Device ID digunakan untuk membatasi penggunaan satu akun pada perangkat yang berbeda dalam periode tertentu.

---

## 🔒 Device Login Lock

Sistem telah menerapkan mekanisme **Device Lock selama 30 menit**.

Ketika seorang pegawai login:

```text
Login
  ↓
Validasi username & password
  ↓
Validasi status akun
  ↓
Cek device_id
  ↓
Device sama?
  ├── Ya → Login diterima
  │
  └── Tidak
       ↓
   Masih dalam 30 menit?
       ├── Ya → Login ditolak
       └── Tidak → Login diterima
```

Aktivitas login dicatat pada sheet:

```text
aktivitas_login
```

Dengan struktur:

| Field           | Keterangan              |
| --------------- | ----------------------- |
| `Timestamp`     | Waktu aktivitas         |
| `id_pegawai`    | ID pegawai              |
| `username`      | Username                |
| `device_id`     | Identitas perangkat     |
| `status`        | DITERIMA / DITOLAK      |
| `keterangan`    | Informasi aktivitas     |
| `waktu_expired` | Batas waktu device lock |

Contoh:

```text
DITERIMA
Login berhasil
```

atau:

```text
DITOLAK
Akun masih digunakan pada perangkat lain
```

### Status Security

| Komponen                   | Status               |
| -------------------------- | -------------------- |
| Authentication             | 🟡 Berjalan          |
| Device ID                  | ✅ Selesai            |
| Device Lock 30 menit       | ✅ Selesai            |
| Login Activity             | ✅ Selesai            |
| Session Token              | ⏳ Dalam pengembangan |
| Password Hashing           | ⏳ Dalam pengembangan |
| Backend Authorization      | ⏳ Dalam pengembangan |
| Server-side GPS Validation | ⏳ Dalam pengembangan |
| API Security               | ⏳ Dalam pengembangan |

---

# 🗄️ Struktur Database

Aplikasi menggunakan Google Spreadsheet sebagai database.

Beberapa sheet utama:

```text
config
pegawai
absensi
aktivitas_login
```

## `config`

Menyimpan konfigurasi OPD dan jadwal absensi.

```text
opd_id
nama_opd
status_opd
radius
kantorLat
kantorLng
senin_masuk_mulai
senin_masuk_selesai
senin_istirahat_mulai
senin_istirahat_selesai
senin_pulang_mulai
senin_pulang_selesai
jumat_masuk_mulai
jumat_masuk_selesai
jumat_istirahat_mulai
jumat_istirahat_selesai
jumat_pulang_mulai
jumat_pulang_selesai
```

## `pegawai`

Menyimpan akun dan data pegawai.

## `absensi`

Menyimpan riwayat absensi:

```text
Timestamp
id_pegawai
Nama Pegawai
opd_id
sesi
latitude
longitude
jarak_dari_kantor
status
```

## `aktivitas_login`

Menyimpan aktivitas login dan device lock.

---

# 🔄 Arsitektur Sederhana

```text
┌─────────────────────┐
│     React + Vite    │
│      Frontend       │
└──────────┬──────────┘
           │
           │ API Request
           ▼
┌─────────────────────┐
│  Google Apps Script │
│       Backend       │
└──────────┬──────────┘
           │
           │ Read / Write
           ▼
┌─────────────────────┐
│   Google Spreadsheet │
│      Database       │
└─────────────────────┘
```

---

# 📁 Struktur Frontend

Struktur project secara umum:

```text
src/
├── api.js
├── assets/
├── components/
├── pages/
│   ├── Login.jsx
│   ├── Beranda.jsx
│   ├── Absen.jsx
│   └── Riwayat.jsx
└── ...
```

Beberapa komponen admin digunakan untuk:

```text
Manajemen OPD
Manajemen Pegawai
Manajemen Admin
Manajemen Sesi
```

---

# ⚙️ Instalasi

Clone repository:

```bash
git clone https://github.com/brandobogar/absensi-web-v2.git
```

Masuk ke folder:

```bash
cd absensi-web-v2
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

---

# 🌐 Deployment

Frontend dapat di-build menggunakan:

```bash
npm run build
```

Hasil build berada pada:

```text
dist/
```

Folder `dist` dapat digunakan untuk deployment pada layanan hosting seperti Vercel atau hosting berbasis cPanel.

Backend tetap berjalan melalui:

```text
Google Apps Script
```

---

# 🔀 Branch Development

Pengembangan menggunakan branch terpisah untuk menjaga branch utama tetap stabil.

Branch utama:

```text
main
```

Branch pengembangan security:

```text
improves-security
```

Alur pengembangan:

```text
main
  │
  └── improves-security
          │
          ├── Authentication
          ├── Device Lock
          ├── Session Token
          ├── Authorization
          └── Security Hardening
```

---

# 🛣️ Roadmap

Pengembangan aplikasi dilakukan secara bertahap.

### Phase 1 — Authentication

* [x] Login administrator
* [x] Login pegawai
* [x] Validasi akun aktif
* [x] Perubahan password
* [ ] Password hashing
* [ ] Login attempt control

### Phase 2 — Device Security

* [x] Generate device ID
* [x] Persistent device ID
* [x] Device lock
* [x] Lock selama 30 menit
* [x] Deteksi device berbeda
* [x] Expired device lock
* [x] Login activity logging

### Phase 3 — Session Security

* [ ] Generate session token
* [ ] Token validation
* [ ] Token expiration
* [ ] Protected API request
* [ ] Logout invalidation

### Phase 4 — Authorization

* [ ] Role validation pada backend
* [ ] Pembatasan admin berdasarkan OPD
* [ ] Superadmin access
* [ ] Validasi `opd_id` pada backend
* [ ] Validasi `id_pegawai` pada backend

### Phase 5 — Attendance Security

* [ ] Server-side distance calculation
* [ ] Server-side session validation
* [ ] Validasi identitas pegawai
* [ ] Validasi OPD
* [ ] Pencegahan manipulasi request

### Phase 6 — API & Data Security

* [ ] Validasi seluruh parameter API
* [ ] Minimalisasi data response
* [ ] Perlindungan data sensitif
* [ ] Audit endpoint
* [ ] Security cleanup

---

# 📌 Prinsip Pengembangan

Pengembangan aplikasi dilakukan dengan prinsip:

> **Build → Test → Verify → Commit → Continue**

Setiap perubahan fitur atau security dilakukan secara bertahap untuk meminimalkan risiko merusak fitur yang sudah berjalan.

Perubahan yang telah diuji akan di-commit ke branch pengembangan sebelum digabungkan ke `main`.

---

# 👥 Development

Project ini dikembangkan sebagai aplikasi absensi berbasis web dengan fokus pada:

* Digitalisasi absensi pegawai
* Pengelolaan multi-OPD
* Validasi lokasi
* Manajemen sesi absensi
* Pengelolaan pegawai
* Keamanan autentikasi
* Device security
* Pengembangan sistem secara bertahap

---

## 📄 License

Project ini dikembangkan untuk kebutuhan pengembangan sistem/aplikasi internal.

Penggunaan, distribusi, dan modifikasi kode mengikuti kebijakan dan izin dari pemilik project.
