# Prima40+ 🧠🫀

**Prima40+** adalah aplikasi web pendamping kesehatan interaktif yang dirancang khusus untuk memenuhi kebutuhan fisiologis, nutrisi, dan gaya hidup sehat bagi individu berusia 40 tahun ke atas. Aplikasi ini mengutamakan kenyamanan pengguna melalui antarmuka *glassmorphism* modern, responsif, dan ringan tanpa dependensi pustaka luar (pure Vanilla JS, CSS, HTML).

---

## ✨ Fitur Utama

### 1. Dashboard Ringkasan & Personalisasi
*   **Salam Dinamis:** Menyesuaikan waktu hari (Pagi/Siang/Sore/Malam) dan kelompok dekade usia Anda (Dekade 40-an, 50-an, atau Emas Senior 60+) lengkap dengan pesan edukasi preventif geriatri.
*   **Daily Progress Ring:** Pantau pemenuhan cairan harian, latihan aktif (target 30 menit harian), serta pilar kebiasaan sehat utama.

### 2. Kalkulator Analisis Tubuh 40+
*   **BMI (Indeks Massa Tubuh) Gauge:** Dilengkapi dial jarum pengukur dinamis dan interpretasi skala warna.
*   **BMR & TDEE Calculator:** Mengestimasi kebutuhan metabolisme harian (metabolisme melambat 3-5% setiap dekade setelah usia 40).
*   **Target Zat Gizi Makro:** Menghitung asupan protein harian (RDA disesuaikan 1.0 - 1.2g/kg untuk mencegah Sarkopenia/penyusutan otot) serta kebutuhan air minum minimal.
*   **Risk Assessment Meter:** Menghitung faktor risiko penyakit degeneratif kronis berdasarkan gaya hidup dan riwayat keluhan (nyeri sendi, kestabilan gula/tensi).

### 3. Program Olahraga & Timer Terarah
*   **Katalog Gerakan Low-Impact:** Pilihan gerakan aman sendi seperti *Chair Squat*, *Wall Push-Up*, *Brisk Walking*, *Cobra Stretch*, dan *Calf Raises*.
*   **Guided Exercise Timer:** Penghitung waktu mundur interaktif dengan visual progres sirkular dan isyarat audio (*beep sounds*) otomatis sebelum sesi latihan selesai memanfaatkan Web Audio API.

### 4. Menu & Diet Sehat 40+
*   **Porsi Ideal "Piring Sehat 40+":** Visualisasi porsi makan ideal (50% sayur/buah, 25% protein rendah lemak, 25% karbohidrat kompleks).
*   **Rencana Menu Harian:** Inspirasi menu kaya serat dan zat gizi mikro dari pagi hingga malam.
*   **Superfood Lokal & Pantangan:** Edukasi praktis mengenai bahan makanan ramah hormon/tulang (kelor, tempe, ikan kembung) serta bahan makanan pemicu inflamasi yang wajib dibatasi (gula kemasan, minyak trans).

### 5. Jurnal Harian & Grafik Riwayat
*   Pencatatan cepat asupan air minum (+250ml, +600ml, +1000ml), olahraga manual, dan pilar kebiasaan sehat.
*   **SVG Bar Chart:** Visualisasi persentase kepatuhan hidup sehat selama 7 hari terakhir yang dihitung secara dinamis dari penyimpanan lokal (`localStorage`).

---

## 🛠️ Teknologi yang Digunakan

*   **HTML5 & CSS3 (Custom Variables):** Menyediakan struktur semantik SEO dan visual efek kaca (*glassmorphic design*) dengan transisi halus serta dukungan Mode Gelap (Dark) dan Terang (Light).
*   **Vanilla JavaScript (ES6+):** Mengatur logika navigasi Single Page Application (SPA), penghitungan matematis, manipulasi DOM, pemutar suara, serta interaksi grafik SVG.
*   **Web Audio API:** Menghasilkan bunyi instrumen ketukan secara dinamis di peramban tanpa memerlukan berkas audio eksternal.
*   **HTML5 Web Storage (`localStorage`):** Menyimpan profil pengguna, status pemeriksaan kesehatan, dan riwayat jurnal harian secara luring.

---

## 📂 Struktur Berkas

```text
fit40plus/
├── index.html   # Struktur utama halaman web & komponen modal
├── style.css    # Desain, tema terang/gelap, layout grid, dan animasi
├── app.js       # Logika penghitungan, timer, diagram SVG, dan local storage
└── README.md    # Dokumentasi proyek (berkas ini)
```

---

## 🚀 Cara Menjalankan Aplikasi di Perangkat Lokal

Aplikasi ini dapat dijalankan langsung di peramban tanpa memerlukan kompilasi. Berikut adalah cara membukanya menggunakan server lokal melalui terminal (seperti Termux atau Linux):

1.  Masuk ke direktori proyek:
    ```bash
    cd /data/data/com.termux/files/home/fit40plus
    ```
2.  Jalankan server HTTP bawaan menggunakan Python:
    ```bash
    python3 -m http.server 8080
    ```
3.  Buka peramban di ponsel atau PC Anda, kemudian kunjungi alamat:
    ```text
    http://localhost:8080
    ```

---

## 📝 Catatan Kesehatan & Disclaimer
*Aplikasi ini dikembangkan untuk tujuan edukasi pencegahan kesehatan dan pemantauan mandiri (self-monitoring) harian di usia emas. Informasi yang disajikan bukan merupakan pengganti saran medis profesional, diagnosis, atau perawatan klinis dari dokter. Selalu konsultasikan dengan dokter atau spesialis geriatri sebelum mengubah pola diet secara drastis atau memulai program latihan kekuatan fisik baru.*
