# ClipStudio AI v1

PWA editor video lokal untuk Android/browser. Tidak memerlukan backend atau akun berbayar.

## Fitur yang benar-benar tersedia di v1
- Memilih video dari perangkat
- Pratinjau dengan rasio 9:16, 1:1, 16:9, 4:5, atau rasio sumber
- Memotong waktu mulai/akhir
- Overlay teks sederhana di pratinjau (belum tertanam pada ekspor)
- Ekspor MP4 melalui FFmpeg.wasm single-thread/core browser
- Batas durasi ekspor 120 detik untuk mengurangi risiko memori

## Batasan
- Memerlukan internet saat pertama kali memuat FFmpeg dari CDN.
- Browser/HP harus memiliki memori cukup; video panjang/1080p bisa gagal.
- MP4 H.264/AAC diharapkan bekerja dengan input umum, tetapi codec/container input tertentu mungkin tidak didukung.
- PWA bukan APK native. Instalasi tergantung dukungan browser.
- Subtitle otomatis, musik, timeline multi-klip, transisi, dan AI belum termasuk.
- Ekspor overlay teks belum aktif pada versi awal. Pratinjau teks hanya visual.
- Belum diuji di semua perangkat; jangan anggap ekspor pasti berhasil sampai diuji pada perangkat sasaran.

## GitHub Pages
1. Buat repository baru bernama `ClipStudio-AI`.
2. Upload `index.html`, `manifest.webmanifest`, dan `sw.js` ke root repository.
3. Settings > Pages > Deploy from a branch > pilih `main` (atau branch utama yang dipakai) dan folder `/ (root)`.
4. Simpan, tunggu deployment, buka URL Pages.
5. Di Chrome Android: menu ⋮ > Tambahkan ke layar utama / Install app jika tersedia.

Untuk menguji pertama kali, pilih video MP4 pendek 10–15 detik. Jika gagal, catat pesan error lengkap.
