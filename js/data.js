/* =========================================================
   ⬇⬇⬇  KONFIGURASI — GANTI ISI FILE INI SESUKANYA  ⬇⬇⬇
   ---------------------------------------------------------
   1. SITE.bgm     → path file lagu latar (BGM)
   2. MEMORIES     → daftar foto, tanggal, dan caption
   3. LETTER       → isi surat ucapan ulang tahun
   4. WISH_MESSAGE → teks yang muncul setelah lilin ditiup
   ========================================================= */

/* ---------- 1. Pengaturan umum & lagu latar ---------- */
const SITE = {
  // Path file audio. Letakkan filenya di assets/bgm.mp3
  // (bisa juga pakai URL lengkap: "https://domain.com/lagu.mp3")
  bgm: "assets/music/backsound.mp3",
};

/* ---------- 2. Foto kenangan (scrapbook) ----------
   - image : path/URL foto  (letakkan file di assets/photos/)
   - date  : tanggal tampil di bawah foto
   - caption : kata-kata manis di bawah tanggal
   Tambah/hapus item sesuai kebutuhan, urutan = urutan halaman. */
const MEMORIES = [
  {
    image: "assets/photos/photo-1.jpg",
    date: "19 September 2026",
    caption: "Momen pertama kali kita jalan bareng… 🐾",
  },
  {
    image: "assets/photos/photo-2.jpg",
    date: "02 Oktober 2026",
    caption: "Pertama kali ama ngajak aku ke kopken, abis itu foto booth pake laptop aku hehe ☕",
  },
  {
    image: "assets/photos/photo-3.jpg",
    date: "03 Oktober 2026",
    caption: "Kita berdua nyore di Sejuta Pohon Kelapa...",
  },
  {
    image: "assets/photos/photo-4.jpg",
    date: "15 Oktober 2026",
    caption: "Kita ngopi sambil nugas di manao, disini ama cantik banget 😘",
  },
  {
    image: "assets/photos/photo-5.jpg",
    date: "31 Oktober 2026",
    caption: "Kamu nemenin aku main sehabis aku lomba 💕",
  },
  {
    image: "assets/photos/photo-6.jpg",
    date: "04 November 2026",
    caption: "Perjalanan menemukan casing buat hp baru ama 💌",
  },
];

/* ---------- 3. Isi surat cinta ----------
   Tipe blok yang tersedia:
   - { type: "p",    text: "…" }                 → paragraf biasa
   - { type: "list", items: ["…", "…"] }         → daftar berpoin
   - { type: "sign", from: "…", name: "…" }       → penutup surat
   Anda boleh memakai tag HTML sederhana seperti <em> atau <br>. */
const LETTER = {
  heading: "Selamat Ulang Tahun, Sayangku! ✨🎂",
  blocks: [
    {
      type: "p",
      text:
        "Melihat kembali lembaran-lembaran foto tadi, aku cuma mau bilang terima kasih. Terima kasih sudah hadir, terima kasih untuk setiap tawa, obrolan random, dan kehangatan yang selalu kamu bawa ke duniaku.",
    },
    {
      type: "p",
      text: "Semoga di usiamu yang baru ini:",
    },
    {
      type: "list",
      items: [
        "Hatimu selalu dipenuhi rasa bahagia yang tenang,",
        "Langkahmu selalu dimudahkan menuju impian-impianmu,",
        "Dan harimu selalu dikelilingi cinta (serta kehangatan semanis pelukan kucing!).",
      ],
    },
    {
      type: "p",
      text: "Aku beruntung punya kamu. Selamat bertumbuh bersama hari-hari baru, ya!",
    },
    {
      type: "sign",
      from: "Dengan penuh cinta,",
      name: "Faqih Asy'Ari 🐾🌸",
    },
  ],
};

/* ---------- 4. Teks setelah tiup lilin ---------- */
const WISH_MESSAGE = "Semoga semua impianmu terkabul… 🌸✨";

/* ---------- 5. Hujan polaroid (khusus efek setelah tiup lilin) ----------
   TERPISAH dari MEMORIES — foto ini hanya berjatuhan sebagai efek,
   tidak muncul di buku kenangan.
   Letakkan file di assets/photos/falling/ (fall-1.jpg, fall-2.jpg, …)
   Boleh lebih sedikit dari jumlah count — akan diulang otomatis. */
const FALLING_PHOTOS = [
  { image: "assets/photos/falling/fall-1.jpg" },
  { image: "assets/photos/falling/fall-2.jpg" },
  { image: "assets/photos/falling/fall-3.jpg" },
  { image: "assets/photos/falling/fall-4.jpg" },
  { image: "assets/photos/falling/fall-5.jpg" },
  { image: "assets/photos/falling/fall-6.jpg" },
  { image: "assets/photos/falling/fall-7.jpg" },
  { image: "assets/photos/falling/fall-8.jpg" },
  { image: "assets/photos/falling/fall-9.jpg" },
];

/* Pengaturan hujan foto:
   - count      : perkiraan jumlah foto tampil bersamaan (default 9)
   - interval   : detik antar foto (kosongkan untuk otomatis: rata-rata durasi ÷ count)
   - minDuration/maxDuration : kecepatan jatuh dalam detik (makin besar makin pelan)
   - swaySeconds: periode goyang kiri-kanan */
const FALLING_CONFIG = {
  count: 9,
  interval: null,
  minDuration: 7,
  maxDuration: 13,
  swaySeconds: 3,
};
