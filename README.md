# 🐾🌸 Buku Kenangan Kita — Website Ulang Tahun

Website interaktif satu halaman bergaya *soft scrapbook / storybook*:
kucing lucu, bunga lembut, foto kenangan, kue ulang tahun, dan surat cinta.

## ▶️ Cara Menjalankan

Cara paling gampang:

1. Letakkan foto di `assets/photos/`, lagu di `assets/bgm.mp3`
2. Buka `index.html` dengan klik dua kali (langsung jalan di browser)

Atau jalankan server lokal supaya mulus (disarankan, agar audio & font optimal):

```bash
# dari folder ini
python -m http.server 8000
# lalu buka http://localhost:8000
```

## 📁 Struktur File

```
ultah/
├── index.html          ← struktur halaman + ilustrasi SVG (kucing, kue, bunga)
├── css/styles.css      ← semua gaya/animasi (palet pastel, buku, surat)
├── js/data.js          ← ⬅️ UBAH FOTO, LAGU, & ISI SURAT DI SINI
├── js/main.js          ← logika 4 scene, audio, confetti
└── assets/
    ├── bgm.mp3         ← ⬅️ letakkan lagu latar di sini
    └── photos/
        ├── photo-1.jpg …   ← ⬅️ foto buku kenangan (MEMORIES)
        └── falling/        ← ⬅️ foto khusus hujan polaroid (FALLING_PHOTOS)
```

## ✏️ Yang Perlu Anda Ganti (semua di `js/data.js`)

### 1. Foto kenangan → array `MEMORIES`

```js
const MEMORIES = [
  {
    image: "assets/photos/photo-1.jpg",   // path/URL foto
    date: "14 Februari 2024",             // tanggal di bawah foto
    caption: "Momen pertama kali kita jalan bareng… 🐾",  // kata-kata manis
  },
  // … tambah/hapus item sesuka hati (urutan = urutan halaman)
];
```

Foto belum diganti? Akan tampil placeholder lucu bertuliskan “Foto ke-N — ganti di js/data.js”.

### 2. Lagu latar → `SITE.bgm`

```js
const SITE = {
  bgm: "assets/bgm.mp3",   // atau URL lengkap: "https://…/lagu.mp3"
};
```

Lagu otomatis diputar saat tombol **“Buka Buku Kenangan Kita”** ditekan
(sesuai aturan autoplay browser). Bisa juga lewat tombol play di dock kanan atas.

### 3. Isi surat → `LETTER`

```js
const LETTER = {
  heading: "Selamat Ulang Tahun, Sayangku! ✨🎂",
  blocks: [
    { type: "p",    text: "Paragraf biasa…" },
    { type: "list", items: ["poin 1", "poin 2"] },
    { type: "sign", from: "Dengan penuh cinta,", name: "[Nama Kamu] 🐾🌸" },
  ],
};
```

### 4. Teks setelah tiup lilin → `WISH_MESSAGE`

### 5. Hujan polaroid (efek setelah tiup lilin) → `FALLING_PHOTOS` & `FALLING_CONFIG`

Foto ini **terpisah** dari buku kenangan — hanya berjatuhan sebagai efek:

```js
const FALLING_PHOTOS = [
  { image: "assets/photos/falling/fall-1.jpg" },   // letakkan filenya di folder itu
  // …boleh lebih sedikit dari 9, akan diulang otomatis
];

const FALLING_CONFIG = {
  count: 9,            // perkiraan foto tampil bersamaan
  interval: null,      // detik antar foto (null = otomatis)
  minDuration: 7,      // jatuh paling cepat (detik)
  maxDuration: 13,     // jatuh paling pelan (detik)
  swaySeconds: 3,      // periode goyang kiri-kanan
};
```

Selama file belum ada, yang berjatuhan adalah bingkai polaroid kosong berhias doodle kucing.

## 🎬 Alur 4 Scene

1. **Cover** — klik “Buka Buku Kenangan Kita” → BGM menyala + masuk ke buku
2. **Scrapbook** — foto polaroid + washi tape + jejak kucing; geser/panah/titik halaman
3. **Make a Wish** — tombol mematikan lilin → asap → confetti kelopak bunga 🌸 + hujan polaroid (foto terpisah dari buku kenangan, goyang kiri-kanan, berlanjut di belakang surat) → surat terbuka otomatis 2 detik kemudian
4. **Love Letter** — surat terbuka dengan animasi unfold + cap lilin telapak kucing

## 🎨 Kustomisasi Cepat

- **Warna** → variabel `:root` di bagian atas `css/styles.css`
- **Font** → tautan Google Fonts di `index.html` (Playfair Display / Inter / Caveat)
- **Confetti** → `PASTEL_COLORS` di `js/main.js`
- **Ornamen kucing & bunga** → simbol SVG di bagian `<defs>` `index.html`
