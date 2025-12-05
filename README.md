SafeUrLungs 🫁
Real-Time Air Quality Monitoring & Exercise Tracking Application
📱 Deskripsi Produk
SafeUrLungs adalah aplikasi mobile berbasis React Native yang menggabungkan monitoring kualitas udara real-time dengan pelacakan aktivitas olahraga. Aplikasi ini membantu pengguna untuk:

📍 Memantau kualitas udara di berbagai lokasi secara real-time dengan visualisasi peta interaktif
🏃 Melacak aktivitas olahraga (lari, bersepeda, jalan kaki, yoga, berenang, gym)
😊 Menilai kondisi kesehatan setelah berolahraga dengan emoji mood tracker
📊 Melihat statistik total lokasi yang dipantau dan lokasi aman untuk berolahraga
🗺️ Navigasi ke lokasi dengan kualitas udara terbaik menggunakan Google Maps
💾 Menyimpan data aktivitas dan lokasi secara persistent

🛠️ Komponen Pembangun Produk
Frontend (Mobile App)

React Native - Framework utama untuk pengembangan aplikasi mobile cross-platform
Expo - Platform untuk mempermudah development dan deployment
React Navigation - Untuk navigasi antar screen (Bottom Tabs, Stack Navigator)
TypeScript - Type-safe JavaScript untuk code quality yang lebih baik
Expo Location - Untuk mendapatkan koordinat GPS pengguna
React Native Maps - Komponen peta interaktif

Backend & Database

Firebase Realtime Database - Database NoSQL real-time untuk menyimpan:

Data lokasi monitoring (/points)
Data aktivitas olahraga (/exercises)
Sinkronisasi real-time antar devices



Web Dashboard

HTML5 + CSS3 - Struktur dan styling web map
Leaflet.js - Library untuk peta interaktif di web
Firebase SDK - Integrasi database real-time
Font Awesome - Icon library
Google Fonts (Inter) - Typography

API & Services

AQICN API - Untuk mendapatkan data Air Quality Index real-time
Google Maps API - Untuk navigasi dan routing
OpenStreetMap - Basemap untuk visualisasi peta

📊 Sumber Data

Air Quality Data

API: World Air Quality Index (AQICN)
Endpoint: https://api.waqi.info/feed/geo:{lat};{lng}/?token={API_KEY}
Data: AQI value, kategori kualitas udara, PM2.5, PM10, CO, NO2, O3


Location Data

Expo Location API - GPS coordinates dari device pengguna
Accuracy: Koordinat dengan akurasi tinggi untuk tracking presisi


Map Tiles

OpenStreetMap: Basemap tiles
URL: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png


User Data Storage

Firebase Realtime Database
Structure:



     /points
       /{pointId}
         - name: string
         - coordinates: string (lat,lng)
         - aqi: number
         - aqiCategory: string
         - emoji: string
         - accuracy: number
     
     /exercises
       /{exerciseId}
         - activityType: string
         - duration: number
         - location: string
         - distance: number
         - calories: number
         - aqi: number
         - mood: string
         - timestamp: number
📸 Tangkapan Layar Komponen Penting
1. Log Exercise Screen (Gambar 1 - Kiri)
Fitur pencatatan aktivitas olahraga dengan komponen:

✅ Pemilihan jenis aktivitas (Running, Cycling, Walking, Yoga, Swimming, Gym)
⏱️ Input durasi olahraga (menit)
📍 Pencatatan lokasi otomatis via GPS
📏 Input jarak tempuh (km)
🔥 Kalkulasi kalori otomatis
🌫️ Monitoring AQI real-time saat berolahraga
😊 Mood tracker dengan emoji selector
📷 Upload foto aktivitas (opsional)

2. Air Quality Map Screen (Gambar 2 - Tengah)
Dashboard peta monitoring kualitas udara dengan fitur:

🗺️ Peta interaktif dengan marker lokasi monitoring
🎨 Color-coded markers berdasarkan AQI:

😊 Hijau (Excellent): AQI 0-50
🙂 Hijau muda (Good): AQI 51-100
😐 Kuning (Moderate): AQI 101-150
😷 Orange (Unhealthy): AQI 151-200
⚠️ Merah (Hazardous): AQI 201+


📊 Header statistics: Total Locations & Real Locations
🧭 Navigate button untuk routing ke lokasi terpilih
🗑️ Delete button untuk menghapus lokasi monitoring
🔄 Toggle layers untuk menampilkan/sembunyikan markers

3. My Locations Screen (Gambar 3 - Tengah Kanan)
List view lokasi yang sudah dipantau:

📋 Card-based list dengan informasi lengkap:

Nama lokasi
Kategori AQI dengan emoji status
Nilai AQI numerik
Koordinat lengkap


🎨 Color-coded cards sesuai kualitas udara
🧭 Quick navigate button per lokasi
✏️ Edit functionality
🗑️ Delete functionality
➕ Floating Action Button untuk tambah lokasi baru

4. Exercise Journal Screen (Gambar 4 - Kanan)
Detail history aktivitas olahraga dengan:

📅 Track your healthy activities
📊 Weekly statistics:

Total Workouts: 2
This Week: 2
Hours: 0


🗺️ Route visualization dengan polyline
📝 Detail aktivitas:

Tanggal & waktu (Dec 9, 2025 at 6:20 AM)
Durasi (30 minutes)
Lokasi (Wisdom Park)
Jarak (5 km)
Kalori (242 kcal)
AQI saat olahraga (404.69)


😊 Mood indicator
📌 Notes section
🗑️ Delete button untuk hapus record

🎯 Fitur Utama
Air Quality Monitoring

Real-time AQI data dari AQICN API
Visualisasi peta dengan Leaflet.js
Color-coded markers untuk identifikasi cepat
Detail popup dengan informasi lengkap
Auto-refresh data setiap beberapa menit

Exercise Tracking

6 jenis aktivitas olahraga
GPS tracking untuk lokasi akurat
Kalkulasi otomatis kalori
Monitoring AQI saat berolahraga
Mood tracking dengan emoji
Photo upload support

Data Persistence

Firebase Realtime Database
Sync antar devices
Offline capability
Cloud backup otomatis

Navigation & Maps

Integrasi Google Maps untuk routing
Interactive map dengan zoom/pan
Marker clustering untuk performa optimal
Custom marker icons

🚀 Cara Menjalankan Aplikasi
Prerequisites
bash- Node.js >= 18
- npm atau yarn
- Expo CLI
- Android Studio / Xcode (untuk emulator)
- Expo Go app (untuk testing di device fisik)
Installation

Clone repository

bash   git clone [repository-url]
   cd SafeUrLungs

Install dependencies

bash   npm install
```

3. **Setup environment variables**
   Buat file `.env` dan tambahkan:
```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_AQICN_API_KEY=your_aqicn_api_key

Start development server

bash   npx expo start

Run on device/emulator

Scan QR code dengan Expo Go (Android/iOS)
Press a untuk Android emulator
Press i untuk iOS simulator
Press w untuk web browser



Build Production
bash# Android APK
npx expo build:android

# iOS IPA
npx expo build:ios
```

## 📁 Struktur Project
```
SafeUrLungs/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Map screen
│   │   ├── locations.tsx  # My locations screen
│   │   ├── exercise.tsx   # Exercise journal
│   │   └── labs.tsx       # Labs/settings
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 screen
├── components/            # Reusable components
├── constants/             # App constants
├── hooks/                 # Custom hooks
├── assets/               # Images, fonts, icons
├── web-map/              # Web dashboard files
│   └── index.html        # Leaflet web map
├── firebase.config.js    # Firebase configuration
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
🔐 Keamanan & Privacy

API keys disimpan di environment variables
Firebase Security Rules untuk protect data
Location permission handling yang proper
Data encryption in transit (HTTPS)

<img width="1148" height="582" alt="image" src="https://github.com/user-attachments/assets/853c7d57-0994-47e4-955e-c166b09dd758" />
