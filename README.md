# 📱 Aplikasi Absensi Pegawai

Aplikasi absensi pegawai berbasis web yang dikembangkan untuk mendukung proses pencatatan kehadiran secara **digital, terstruktur, terintegrasi, dan berbasis multi-OPD**.

Aplikasi dirancang agar setiap Organisasi Perangkat Daerah (OPD) dapat memiliki konfigurasi masing-masing, termasuk data OPD, profil pimpinan, pegawai, administrator, lokasi kantor, radius absensi, serta jadwal sesi absensi.

Sistem menggunakan **React + Vite** pada sisi frontend, **Google Apps Script** sebagai backend/API, dan **Google Spreadsheet** sebagai penyimpanan data.

---

# 🚀 Teknologi

## Frontend

* **React**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Leaflet**
* **React Leaflet**

## Backend

* **Google Apps Script**
* **Google Spreadsheet** sebagai database

## Deployment

* **Vercel** untuk deployment frontend
* **Google Apps Script** sebagai backend/API

---

# ✨ Fitur Utama

## 👤 Pegawai

Aplikasi menyediakan pengelolaan akun dan data pegawai yang terintegrasi dengan OPD.

Fitur meliputi:

* Login pegawai
* Identitas pegawai
* Username dan password
* Nomor Induk Pegawai (NIP)
* Status akun aktif/nonaktif
* Perubahan username
* Perubahan password
* Reset password oleh administrator
* Pencatatan absensi
* Pembatasan penggunaan akun berdasarkan perangkat
* Dukungan bypass radius untuk pegawai tertentu

---

# 🏢 Manajemen OPD

Administrator dengan hak akses yang sesuai dapat mengelola data OPD.

Data OPD meliputi:

* ID OPD
* Nama OPD
* Status OPD
* Radius absensi
* Latitude kantor
* Longitude kantor
* Jadwal sesi absensi
* Profil pimpinan OPD

Pengaturan OPD dapat dilakukan melalui satu antarmuka **Edit OPD**.

Perubahan konfigurasi hanya dikirim apabila terdapat perubahan pada data sehingga mengurangi request yang tidak diperlukan.

---

# 👔 Profil Pimpinan OPD

Setiap OPD selain `OPD000` dapat memiliki profil pimpinan.

Data profil meliputi:

| Field           | Keterangan                    |
| --------------- | ----------------------------- |
| `lokasi`        | Lokasi/keterangan wilayah OPD |
| `jabatan`       | Jabatan pimpinan              |
| `nama_pimpinan` | Nama pimpinan OPD             |
| `pangkat`       | Pangkat/golongan pimpinan     |
| `nip`           | Nomor Induk Pegawai           |

Pilihan jabatan yang tersedia:

* Sekretaris Daerah
* Kepala Dinas
* Kepala Badan
* Inspektur Daerah
* Kepala Satuan
* Kepala Pelaksana

Pilihan pangkat/golongan:

* Penata Tingkat I/III-d
* Pembina/IV-a
* Pembina Tingkat I/IV-b
* Pembina Utama Muda/IV-c
* Pembina Utama Madya/IV-d
* Pembina Utama/IV-e

NIP divalidasi sebagai **18 digit** dan ditampilkan menggunakan format:

```text
19971010 202506 1 004
```

Profil OPD dapat:

* Dibuat ketika OPD baru ditambahkan
* Dilihat oleh administrator yang memiliki akses terhadap OPD
* Diedit melalui Manajemen OPD
* Diperbarui secara parsial hanya pada field yang berubah

---

# 📍 Absensi Berbasis Lokasi

Aplikasi menggunakan koordinat GPS perangkat untuk menentukan jarak pegawai dari lokasi kantor.

Fitur yang tersedia:

* Pengambilan lokasi GPS
* Perhitungan jarak ke kantor
* Radius absensi yang dapat dikonfigurasi
* Informasi koordinat lokasi kantor
* Validasi lokasi sebelum absensi
* Dukungan bypass radius
* Pencatatan latitude dan longitude saat absensi
* Pencatatan jarak pegawai dari kantor

Perhitungan jarak menggunakan metode **Haversine**.

Konfigurasi lokasi kantor terdiri dari:

```text
kantorLat
kantorLng
radius
```

> Validasi lokasi pada sisi backend masih menjadi bagian dari pengembangan security lanjutan untuk memperkuat perlindungan terhadap manipulasi request dari client.

---

# ⏰ Manajemen Sesi Absensi

Sistem mendukung beberapa sesi absensi:

* Masuk
* Istirahat
* Pulang

Jadwal dapat dikonfigurasi berdasarkan OPD.

Sistem membedakan jadwal:

```text
Senin - Kamis
Jumat
```

Setiap sesi memiliki:

* Jam mulai
* Jam selesai

Struktur konfigurasi sesi:

```text
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

---

# 👨‍💼 Manajemen Pegawai

Administrator dapat mengelola data pegawai sesuai dengan hak aksesnya.

Struktur data pegawai:

| Field           | Keterangan                    |
| --------------- | ----------------------------- |
| `id_pegawai`    | ID unik pegawai               |
| `opd_id`        | ID OPD                        |
| `nama`          | Nama pegawai                  |
| `username`      | Username login                |
| `password`      | Password                      |
| `nip`           | Nomor Induk Pegawai           |
| `status_aktif`  | Status akun                   |
| `bypass_radius` | Pengecualian validasi radius  |
| `bypass_sesi`   | Konfigurasi pengecualian sesi |

Format ID pegawai:

```text
peg-0001
peg-0002
peg-0003
...
```

## Hak Akses Pengelolaan Pegawai

### Super Admin

Super Admin dapat:

* Mengelola pegawai lintas OPD
* Memilih OPD ketika menambahkan pegawai
* Mengubah data pegawai
* Mengubah status aktif
* Mengatur bypass radius
* Melakukan reset password

### Admin OPD

Admin OPD mengelola pegawai pada OPD yang menjadi kewenangannya.

Saat menambahkan pegawai, OPD tidak perlu dipilih karena otomatis menggunakan OPD administrator tersebut.

---

# 👨‍💻 Manajemen Admin

Sistem mendukung pengelolaan administrator dengan konsep hak akses berdasarkan OPD.

Administrator dapat memiliki cakupan akses terhadap OPD tertentu, sedangkan **Super Admin** memiliki cakupan akses khusus untuk pengelolaan sistem.

Pembatasan akses tidak hanya dilakukan pada frontend, tetapi juga diperiksa pada backend melalui validasi session dan scope OPD.

---

# 🔐 Security

Keamanan aplikasi dikembangkan secara bertahap dengan pendekatan:

```text
Authentication
      ↓
Device Security
      ↓
Session Security
      ↓
Backend Authorization
      ↓
API Security
      ↓
Attendance Security
```

---

## 🔑 Authentication

Fitur autentikasi yang telah diterapkan:

* Validasi username dan password
* Validasi status akun
* Pemisahan login administrator dan pegawai
* Validasi akun aktif/nonaktif
* Penghapusan pencatatan password dari aktivitas login
* Pembuatan identitas perangkat saat login

---

# 📱 Device ID

Setiap perangkat yang digunakan untuk login mendapatkan `device_id`.

Device ID disimpan pada sisi client dan digunakan untuk mengenali perangkat yang digunakan oleh akun.

Contoh:

```text
5156babe-7a2f-41b3-b694-d83d6ecdb27b
```

Device ID digunakan sebagai salah satu mekanisme keamanan untuk membatasi penggunaan akun pada perangkat yang berbeda dalam periode tertentu.

---

# 🔒 Device Login Lock

Sistem menerapkan **Device Lock selama 30 menit**.

Alur secara umum:

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

Struktur data:

| Field           | Keterangan              |
| --------------- | ----------------------- |
| `Timestamp`     | Waktu aktivitas         |
| `id_pegawai`    | ID pegawai              |
| `username`      | Username                |
| `device_id`     | Identitas perangkat     |
| `status`        | DITERIMA / DITOLAK      |
| `keterangan`    | Informasi aktivitas     |
| `waktu_expired` | Batas waktu device lock |

Contoh aktivitas:

```text
DITERIMA
Login berhasil
```

atau:

```text
DITOLAK
Akun masih digunakan pada perangkat lain
```

---

# 🎫 Session Token

Aplikasi telah menerapkan mekanisme **session token** setelah proses login.

Token session digunakan untuk mengidentifikasi session yang sedang aktif pada request API yang dilindungi.

Karakteristik session:

* Session token dibuat saat login
* Token menggunakan nilai yang dihasilkan secara aman pada backend
* Token disimpan bersama informasi session
* Token memiliki waktu kedaluwarsa
* API yang membutuhkan autentikasi melakukan validasi session
* Session memiliki informasi perangkat dan waktu login
* Request dengan token yang tidak valid ditolak

Session menggunakan waktu kedaluwarsa:

```text
8 jam
```

Contoh data session yang divalidasi:

```text
session_id
device_id
waktu_login
waktu_expired
```

Token yang tidak valid akan menghasilkan penolakan request.

---

# 🛡️ Backend Authorization

Sistem mulai menerapkan pembatasan akses pada sisi backend.

Validasi mencakup:

* Validasi session token
* Validasi session aktif
* Validasi cakupan OPD administrator
* Pembatasan akses berdasarkan role
* Validasi `opd_id`
* Pembatasan data yang dapat diakses administrator

Contoh konsep validasi:

```text
Request API
     ↓
Validasi Session
     ↓
Session valid?
 ├── Tidak → Request ditolak
 │
 └── Ya
      ↓
Validasi Role
      ↓
Validasi Scope OPD
      ↓
Request diproses
```

Dengan pendekatan ini, keamanan tidak hanya bergantung pada pembatasan menu di frontend.

---

# 🔐 Status Security

| Komponen                   | Status          |
| -------------------------- | --------------- |
| Authentication             | ✅ Diterapkan    |
| Validasi akun aktif        | ✅ Selesai       |
| Device ID                  | ✅ Selesai       |
| Persistent Device ID       | ✅ Selesai       |
| Device Lock 30 menit       | ✅ Selesai       |
| Login Activity             | ✅ Selesai       |
| Session Token              | ✅ Diterapkan    |
| Session Expiration         | ✅ Diterapkan    |
| Session Validation         | ✅ Diterapkan    |
| Protected API              | 🟡 Bertahap     |
| Backend Authorization      | 🟡 Bertahap     |
| Role Validation            | 🟡 Bertahap     |
| OPD Scope Validation       | 🟡 Bertahap     |
| Server-side GPS Validation | ⏳ Belum selesai |
| Password Hashing           | ⏳ Belum selesai |
| Login Attempt Control      | ⏳ Belum selesai |
| API Security Hardening     | 🟡 Bertahap     |

---

# 🗄️ Struktur Database

Aplikasi menggunakan **Google Spreadsheet** sebagai database.

Sheet utama yang digunakan:

```text
config
pegawai
admin
absensi
aktivitas_login
session
profil_opd
```

---

## `config`

Menyimpan konfigurasi OPD dan jadwal absensi.

Struktur:

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

---

## `profil_opd`

Menyimpan informasi profil pimpinan masing-masing OPD.

Struktur:

```text
opd_id
lokasi
jabtan
nama_piimpinan
pangkat
nip
```

> Nama header pada spreadsheet mengikuti struktur yang telah digunakan oleh aplikasi. Pembacaan data backend dilakukan berdasarkan posisi kolom.

---

## `pegawai`

Menyimpan akun dan data pegawai.

Struktur utama:

```text
id_pegawai
opd_id
nama
username
password
nip
status_aktif
bypass_radius
bypass_sesi
```

---

## `admin`

Menyimpan akun administrator dan informasi hak akses administrator.

Administrator dapat memiliki cakupan akses berdasarkan OPD dan role.

---

## `absensi`

Menyimpan riwayat absensi pegawai.

Struktur:

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

---

## `aktivitas_login`

Menyimpan aktivitas autentikasi dan device lock.

Digunakan untuk mencatat:

* Login diterima
* Login ditolak
* Device yang digunakan
* Informasi aktivitas
* Waktu kedaluwarsa device lock

---

## `session`

Menyimpan informasi session aktif.

Digunakan untuk proses:

* Validasi session token
* Validasi perangkat
* Validasi waktu session
* Perlindungan API

---

# 🔄 Arsitektur Sistem

Arsitektur sederhana aplikasi:

```text
┌─────────────────────────┐
│       React + Vite      │
│        Frontend         │
└────────────┬────────────┘
             │
             │ HTTPS / API Request
             ▼
┌─────────────────────────┐
│    Google Apps Script   │
│        Backend          │
│                         │
│ Authentication          │
│ Session Validation      │
│ Authorization           │
│ Business Logic          │
└────────────┬────────────┘
             │
             │ Read / Write
             ▼
┌─────────────────────────┐
│    Google Spreadsheet   │
│        Database         │
└─────────────────────────┘
```

---

# 🔁 Alur Request Terproteksi

Request API yang membutuhkan autentikasi secara umum mengikuti alur:

```text
Frontend
   │
   │ session_token
   ▼
Google Apps Script
   │
   ├── Validasi session
   │
   ├── Validasi expiration
   │
   ├── Validasi role
   │
   ├── Validasi scope OPD
   │
   └── Proses request
          │
          ▼
     Spreadsheet
```

---

# 📁 Struktur Frontend

Struktur project secara umum:

```text
src/
├── api.js
├── assets/
├── components/
│   ├── PetaModal.jsx
│   ├── SesiModal.jsx
│   ├── ProfilOpdModal.jsx
│   ├── TambahOpdModal.jsx
│   ├── EditOpdModal.jsx
│   ├── ManajemenAdmin.jsx
│   ├── AbsenStatusModal.jsx
│   └── ResetPasswordPegawaiModal.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Beranda.jsx
│   ├── Absen.jsx
│   └── Riwayat.jsx
│
└── ...
```

Komponen administrasi digunakan untuk mengelola:

```text
Manajemen OPD
Manajemen Pegawai
Manajemen Admin
Profil OPD
Lokasi Kantor
Sesi Absensi
```

---

# 🏷️ Konsep OPD

Aplikasi menggunakan ID OPD sebagai identitas utama organisasi.

Contoh:

```text
OPD000
OPD001
OPD002
OPD003
...
```

`OPD000` digunakan sebagai lingkungan **Super Admin** dan tidak memiliki profil OPD seperti OPD lainnya.

OPD lainnya memiliki konfigurasi dan profil masing-masing.

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
          ├── Device ID
          ├── Device Lock
          ├── Session Token
          ├── Session Validation
          ├── Authorization
          └── Security Hardening
```

Perubahan yang telah diuji dapat digabungkan kembali ke:

```text
main
```

---

# 🛣️ Roadmap

Pengembangan aplikasi dilakukan secara bertahap.

## Phase 1 — Authentication

* [x] Login administrator
* [x] Login pegawai
* [x] Validasi akun aktif
* [x] Validasi akun nonaktif
* [x] Perubahan password
* [x] Login activity logging
* [ ] Password hashing
* [ ] Login attempt control

---

## Phase 2 — Device Security

* [x] Generate device ID
* [x] Persistent device ID
* [x] Device lock
* [x] Lock selama 30 menit
* [x] Deteksi device berbeda
* [x] Expired device lock
* [x] Login activity

---

## Phase 3 — Session Security

* [x] Generate session token
* [x] Session token validation
* [x] Session expiration
* [x] Validasi device pada session
* [x] Protected API validation
* [ ] Logout invalidation menyeluruh

---

## Phase 4 — Authorization

* [x] Role validation pada backend
* [x] Pembatasan admin berdasarkan OPD
* [x] Super Admin access
* [x] Validasi `opd_id`
* [x] Validasi session sebelum operasi terproteksi
* [x] Pembatasan akses data berdasarkan scope OPD
* [ ] Audit seluruh endpoint secara menyeluruh

---

## Phase 5 — Attendance Security

* [x] Validasi sesi absensi
* [x] Validasi akun aktif
* [x] Validasi OPD
* [x] Validasi identitas pegawai
* [x] Validasi device/session
* [ ] Server-side distance calculation
* [ ] Server-side GPS validation yang lebih kuat
* [ ] Pencegahan manipulasi koordinat
* [ ] Hardening request absensi

---

## Phase 6 — API & Data Security

* [x] Validasi parameter pada endpoint yang telah diaudit
* [x] Session validation pada endpoint terproteksi
* [x] Pembatasan akses berdasarkan role
* [x] Pembatasan akses berdasarkan OPD
* [x] Audit `doPost` secara bertahap
* [ ] Audit seluruh endpoint
* [ ] Minimalisasi data response
* [ ] Perlindungan data sensitif
* [ ] Security cleanup
* [ ] Standardisasi response API

---

# 🧪 Prinsip Pengembangan

Pengembangan aplikasi dilakukan dengan prinsip:

> **Build → Test → Verify → Commit → Continue**

Setiap perubahan fitur atau security dilakukan secara bertahap untuk meminimalkan risiko merusak fitur yang sudah berjalan.

Prinsip utama pengembangan:

1. **Satu perubahan dalam satu tahap**
2. **Test setelah perubahan**
3. **Mempertahankan fitur yang sudah berjalan**
4. **Tidak mengubah komponen yang tidak berkaitan**
5. **Melakukan audit sebelum meningkatkan security**
6. **Commit setelah perubahan berhasil diuji**

---

# 🔍 Prinsip Security

Keamanan sistem tidak hanya mengandalkan frontend.

Frontend digunakan untuk:

```text
UI
UX
Form Validation
Navigation
```

Sedangkan backend bertanggung jawab terhadap:

```text
Authentication
Session Validation
Authorization
Role
OPD Scope
Data Access
Business Logic
```

Dengan demikian, request dari client tetap harus melalui pemeriksaan backend sebelum operasi yang dilindungi dijalankan.

---

# 👥 Development

Project ini dikembangkan sebagai aplikasi absensi berbasis web dengan fokus pada:

* Digitalisasi absensi pegawai
* Pengelolaan multi-OPD
* Validasi lokasi
* Manajemen sesi absensi
* Manajemen OPD
* Profil pimpinan OPD
* Manajemen pegawai
* Manajemen administrator
* Authentication
* Session security
* Device security
* Backend authorization
* Pengembangan sistem secara bertahap

---

# 📌 Status Project

Aplikasi saat ini berada pada tahap **pengembangan dan penguatan security**.

Fitur utama seperti:

```text
Multi-OPD
Manajemen Pegawai
Manajemen Admin
Manajemen OPD
Profil OPD
Lokasi Kantor
Sesi Absensi
Absensi
Device Security
Session Token
Session Validation
```

telah dikembangkan secara bertahap dan diuji selama proses pengembangan.

Pengembangan berikutnya difokuskan pada **audit endpoint, penguatan authorization, keamanan API, dan peningkatan validasi absensi pada sisi backend**.

---

## 📄 License

Project ini dikembangkan untuk kebutuhan pengembangan sistem/aplikasi internal.

Penggunaan, distribusi, dan modifikasi kode mengikuti kebijakan dan izin dari pemilik project.
