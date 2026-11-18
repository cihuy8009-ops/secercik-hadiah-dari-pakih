# Spesifikasi Teknis & Konsep Web Ulang Tahun: "Buku Kenangan, Kucing & Bunga"

Dokumen ini disusun sebagai panduan implementasi teknis (*System Requirements Document*) untuk AI Coding Agent atau developer web.

---

## 1. Ringkasan Proyek & Visual Design Tokens

Website ini adalah aplikasi interaktif personal satu halaman (*Single Page Application*) yang mengusung konsep buku cerita digital bergaya *scrapbook* kenangan, dihiasi ilustrasi kucing lucu (*cat doodles*) dan ornamen bunga lembut (*soft floral*).

### Palet Warna (Color Palette)
- **Background Utama (Base Canvas):** `#FFFDF9` (Warm Cream / Kertas Buku Tua)
- **Aksen Bunga (Primary Floral):** `#E29578` (Soft Peach / Blush)
- **Aksen Daun & Alam (Foliage):** `#83A482` (Sage Green)
- **Warna Teks Utama:** `#2D3142` (Deep Charcoal Soft)
- **Warna Aksen Tambahan:** `#F5EDE4` (Vanilla Washi Tape)

### Tipografi
- **Headings / Buku:** `Playfair Display` atau `Lora` (Google Fonts - Serif aesthetic)
- **Body & Keterangan:** `Inter` atau `Poppins` (Sans-serif - bersih & mudah dibaca)
- **Teks Surat Personal:** `Caveat` atau `Patrick Hand` (Google Fonts - Handwriting realistis)

---

## 2. Alur Pengguna (User Journey & State Management)

Aplikasi memiliki 4 *scene* utama yang bertransisi secara mulus:

```
[Scene 1: Cover/Amplop] 
       ↓ (Klik "Buka Buku" -> Play BGM)
[Scene 2: Scrapbook Kenangan Foto] 
       ↓ (Halaman Terakhir Selesai)
[Scene 3: Kue Ulang Tahun & Lilin] 
       ↓ (Klik "Tiup Lilin" -> Confetti)
[Scene 4: Secarik Kertas Surat Ucapan]
```

### Scene 1: Gerbang Masuk (The Welcoming Cover)
- **Tampilan:** Sampul buku bersampul pita pastel atau amplop bertekstur, dihiasi doodle kucing yang memegang setangkai bunga.
- **Interaksi Utama:** Tombol CTA `"Buka Buku Kenangan Kita"`.
- **Logika Audio:** Klik pada tombol ini wajib memicu `audio.play()` untuk memutar lagu latar (*background music*) agar mematuhi aturan browser autoplay policy.

### Scene 2: Buku Kenangan Virtual (Photo Scrapbook)
- **Tampilan:** Format lembaran buku/kartu geser (*interactive flip/slide*).
- **Elemen Foto:**
  - Foto berdua dengan frame polaroid putih, sudut miring realistis (-2deg / +3deg).
  - Aksen selotip transparan (*washi tape*) di pojok foto.
  - Jejak telapak kucing (*paw prints*) yang menghubungkan foto satu dengan foto lainnya.
  - Tanggal dan caption singkat di bawah foto.
- **Struktur Data:** Gunakan array data JavaScript yang mudah dimodifikasi:
  ```json
  [
    {
      "image": "url-foto-1.jpg",
      "date": "14 Februari 2024",
      "caption": "Momen pertama kali kita jalan bareng..."
    }
  ]
  ```

### Scene 3: Puncak Perayaan (Kue & Lilin Interaktif)
- **Tampilan:** Ilustrasi kue ulang tahun aesthetic bertingkat dengan aksen bunga krim dan satu lilin di tengah.
- **Logika State Lilin (`isBlown = false`):**
  - Lilin menyala dengan animasi CSS `@keyframes flicker`.
  - Tombol aksi: `"Make a Wish & Tiup Lilin"`.
  - Saat tombol diklik:
    1. Api lilin padam (`opacity: 0`).
    2. Muncul animasi kepulan asap kecil naik ke atas.
    3. Memicu animasi kelopak bunga/confetti jatuh menggunakan `canvas-confetti`.
    4. Menampilkan teks transisi: *"Semoga semua impianmu terkabul..."*.
    5. Otomatis membuka Scene 4 setelah 2 detik.

### Scene 4: Secarik Kertas Surat (The Love Letter)
- **Tampilan:** Kertas surat bertekstur lusuh/hangat yang terbuka dengan animasi lipatan (*unfold effect*).
- **Konten:** Teks ucapan personal bertulisan tangan (*handwriting font*).
- **Ornamen Akhir:** Cap lilin segel (*wax seal*) bermotif telapak kucing di bagian bawah surat.

---

## 3. Komponen Tambahan & Spesifikasi Teknis

1. **Floating Audio Controller:**
   - Ikon piringan hitam mini atau speaker mengambang di pojok kanan atas.
   - Fitur toggle play/pause dan indikator volume.
2. **Mobile First Responsive:**
   - Di layar *mobile* (< 768px): Buku beralih ke format *card swipe* atau *vertical aesthetic scroll*.
   - Di layar desktop: Format *side-by-side open book* (2 halaman berdampingan).
3. **Efek Confetti Bunga:**
   - Menggunakan library `canvas-confetti` dengan kustomisasi warna pastel (peach, pink, sage green, cream).

---

## 4. Draf Ucapan Surat Ulang Tahun (Template Isi Surat)

```text
Selamat Ulang Tahun, Sayangku! ✨🎂

Melihat kembali lembaran-lembaran foto tadi, aku cuma mau bilang terima kasih. Terima kasih sudah hadir, terima kasih untuk setiap tawa, obrolan random, dan kehangatan yang selalu kamu bawa ke duniaku.

Semoga di usiamu yang baru ini:
- Hatimu selalu dipenuhi rasa bahagia yang tenang,
- Langkahmu selalu dimudahkan menuju impian-impianmu,
- Dan harimu selalu dikelilingi cinta (serta kehangatan semanis pelukan kucing!).

Aku beruntung punya kamu. Selamat bertumbuh bersama hari-hari baru, ya!

Dengan penuh cinta,
[Nama Kamu] 🐾🌸
```