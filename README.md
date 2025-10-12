SkyNow - Aplikasi Cuaca Animate & Real-time
Your Weather, Alive on Screen.

SkyNow adalah aplikasi cuaca berbasis web yang modern dan interaktif, dirancang untuk memberikan informasi cuaca secara real-time dengan antarmuka yang indah dan dinamis. Aplikasi ini dibangun menggunakan teknologi web modern seperti React, Vite, dan Tailwind CSS, serta terintegrasi dengan WeatherAPI.com untuk data cuaca yang akurat di seluruh dunia.

[Gambar dari Antarmuka SkyNow]
(Disarankan untuk menambahkan screenshot aplikasi di sini)

✨ Fitur Utama
Cuaca Real-time: Dapatkan data cuaca terkini, termasuk suhu, kelembapan, kecepatan angin, serta suhu minimum dan maksimum untuk hari ini.

Prakiraan Cuaca Detail: Lihat prakiraan cuaca per jam untuk 24 jam ke depan dan prakiraan harian untuk 3 hari ke depan dalam bentuk grafik yang mudah dibaca.

Pencarian Lokasi Cerdas: Cari kota atau daerah mana pun di dunia dengan fitur autocomplete yang memberikan saran lokasi saat Anda mengetik.

Latar Belakang Dinamis: Latar belakang aplikasi berubah secara otomatis menyesuaikan kondisi cuaca saat ini (cerah, berawan, hujan, badai, atau malam hari) untuk pengalaman visual yang imersif.

Personalisasi: Sesuaikan unit suhu antara Celsius (°C) dan Fahrenheit (°F) sesuai preferensi Anda.

Riwayat Pencarian: Akses cepat lokasi yang terakhir kali Anda cari.

🛠️ Tumpukan Teknologi (Tech Stack)
Proyek ini dibangun menggunakan serangkaian teknologi modern untuk memastikan performa yang cepat, skalabilitas, dan kemudahan pengembangan.

Framework: React & Vite

Manajemen State: Zustand

Styling: Tailwind CSS

Komponen UI: shadcn/ui & Radix UI

Animasi: Framer Motion

Grafik: Recharts

Ikon: Lucide React

Sumber Data: WeatherAPI.com

🚀 Instalasi dan Menjalankan Proyek
Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

Prasyarat
Node.js (versi 18.x atau lebih tinggi)

npm atau yarn

Langkah-langkah
Clone Repositori (Jika sudah ada, lewati langkah ini)

git clone [https://github.com/username/skynow-app.git](https://github.com/username/skynow-app.git)
cd skynow-app

Instalasi Dependensi
Buka terminal di direktori proyek dan jalankan perintah:

npm install

Konfigurasi API Key (Langkah Penting!)
Aplikasi ini memerlukan API key dari WeatherAPI.com untuk berfungsi.

Daftar untuk mendapatkan API key gratis di WeatherAPI.com.

Buka file src/store/weatherStore.ts.

Cari baris berikut dan ganti 'MASUKKAN_API_KEY_ANDA_DI_SINI' dengan API key Anda.

const API_KEY = 'MASUKKAN_API_KEY_ANDA_DI_SINI';

Lakukan hal yang sama pada file src/components/SearchScreen.tsx.

Jalankan Server Pengembangan
Setelah instalasi dan konfigurasi selesai, jalankan server dengan perintah:

npm run dev

Aplikasi akan tersedia di http://localhost:3000 (atau port lain jika 3000 sudah digunakan).

📂 Struktur Proyek
Struktur folder proyek ini dirancang agar mudah dipahami dan dikelola.

/
├── src/
│   ├── components/       # Komponen React
│   │   ├── ui/           # Komponen UI dasar (Button, Card, dll.)
│   │   ├── App.tsx       # Komponen utama & router
│   │   ├── HomeScreen.tsx
│   │   └── ...           # Komponen layar lainnya
│   ├── store/
│   │   └── weatherStore.ts # Logic & state management (Zustand)
│   └── ...               # File utama lainnya (main.tsx, styles)
└── package.json          # Konfigurasi & dependensi proyek

📄 Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file LICENSE untuk detail lebih lanjut.