/* =========================================================
   BUKU KENANGAN KITA — logika interaksi 4 scene
   (vanilla JS, tanpa build step)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- referensi DOM ---------- */
  const scenes = Array.from(document.querySelectorAll(".scene"));
  const bgm = document.getElementById("bgm");
  const audioDock = document.getElementById("audioDock");
  const playBtn = document.getElementById("playBtn");
  const muteBtn = document.getElementById("muteBtn");

  const openBookBtn = document.getElementById("openBookBtn");
  const coverBook = document.getElementById("coverBook");

  const bookSpread = document.getElementById("bookSpread");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const bookDots = document.getElementById("bookDots");
  const bookCounter = document.getElementById("bookCounter");
  const bookFinish = document.getElementById("bookFinish");
  const toCakeBtn = document.getElementById("toCakeBtn");
  const bookNav = document.querySelector(".book__nav");
  const pagePaw = document.getElementById("pagePaw");

  const cakeSvg = document.getElementById("cakeSvg");
  const wishBtn = document.getElementById("wishBtn");
  const wishMessage = document.getElementById("wishMessage");

  const letter = document.getElementById("letter");
  const letterBody = document.getElementById("letterBody");
  const restartBtn = document.getElementById("restartBtn");

  /* ---------- state ---------- */
  let currentScene = 1;
  let pageIndex = 0;
  let isBlown = false;
  let autoOpenTimer = null;

  const memories = Array.isArray(window.MEMORIES) ? MEMORIES : (typeof MEMORIES !== "undefined" ? MEMORIES : []);

  /* true bila layar lebar (mode buku terbuka 2 halaman) */
  function isDesktop() {
    if (typeof window.matchMedia === "function") {
      return window.matchMedia("(min-width: 768px)").matches;
    }
    return window.innerWidth >= 768;
  }

  /* =========================================================
     MANAJEMEN SCENE
     ========================================================= */
  function goToScene(n) {
    if (n === currentScene) return;
    currentScene = n;

    scenes.forEach((s) => {
      s.classList.toggle("is-active", Number(s.dataset.scene) === n);
    });

    window.scrollTo({ top: 0, behavior: "auto" });

    if (n === 4) openLetter();
  }

  /* =========================================================
     SCENE 1 — COVER (trigger autoplay BGM)
     ========================================================= */
  function startJourney() {
    playBgm();
    goToScene(2);
    renderBook();
  }

  openBookBtn.addEventListener("click", startJourney);
  coverBook.addEventListener("click", startJourney);
  coverBook.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startJourney();
    }
  });

  /* =========================================================
     AUDIO — BGM + floating controller
     ========================================================= */
  function setSrcBgm() {
    const src = typeof SITE !== "undefined" ? SITE.bgm : "";
    if (src) {
      bgm.src = src;
    } else {
      markAudioMissing();
    }
  }

  function markAudioMissing() {
    audioDock.dataset.missing = "true";
    playBtn.title = "Lagu belum ditemukan — letakkan file di assets/bgm.mp3";
    playBtn.setAttribute("aria-label", "Lagu belum ditemukan");
  }

  bgm.addEventListener("error", markAudioMissing);
  bgm.addEventListener("playing", () => {
    document.body.classList.add("is-playing");
    playBtn.title = "Jeda musik";
    playBtn.setAttribute("aria-label", "Jeda musik");
  });
  bgm.addEventListener("pause", () => {
    document.body.classList.remove("is-playing");
    playBtn.title = "Putar musik";
    playBtn.setAttribute("aria-label", "Putar musik");
  });

  function playBgm() {
    if (!bgm.src) return;
    bgm.volume = 0.75;
    const p = bgm.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        /* file belum ada / diblokir browser — biarkan UI tetap tenang */
      });
    }
  }

  function togglePlay() {
    if (bgm.paused) {
      playBgm();
    } else {
      bgm.pause();
    }
  }

  function toggleMute() {
    bgm.muted = !bgm.muted;
    document.body.classList.toggle("is-muted", bgm.muted);
    muteBtn.title = bgm.muted ? "Nyalakan suara" : "Bisukan suara";
    muteBtn.setAttribute("aria-label", muteBtn.title);
  }

  playBtn.addEventListener("click", togglePlay);
  muteBtn.addEventListener("click", toggleMute);

  /* =========================================================
     SCENE 2 — BUKU KENANGAN
     ========================================================= */
  const TILTS = ["-2.5deg", "3deg", "-1.6deg", "2.4deg", "-3deg", "1.8deg"];

  function pageSize() {
    return isDesktop() ? 2 : 1;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(memories.length / pageSize()));
  }

  function polaroidHTML(m, i) {
    const tilt = TILTS[i % TILTS.length];
    const safeCaption = (m.caption || "").replace(/</g, "&lt;");
    const safeDate = (m.date || "").replace(/</g, "&lt;");
    return `
      <figure class="polaroid" style="--tilt:${tilt}">
        <span class="tape tape--l" aria-hidden="true"></span>
        <span class="tape tape--r" aria-hidden="true"></span>
        <div class="polaroid__frame">
          <img src="${m.image}" alt="${safeCaption}" loading="lazy" />
          <div class="photo-placeholder" hidden>
            <svg viewBox="0 0 100 90" aria-hidden="true"><use href="#icon-catface" /></svg>
            <strong>Foto ke-${i + 1}</strong>
            <span>ganti di js/data.js → MEMORIES</span>
          </div>
        </div>
        <figcaption class="polaroid__caption">
          <time class="polaroid__date">${safeDate}</time>
          <p class="polaroid__text">${safeCaption}</p>
        </figcaption>
      </figure>`;
  }

  function emptyPageHTML() {
    return `
      <div class="book__page book__page--empty">
        <svg viewBox="0 0 100 90" aria-hidden="true"><use href="#icon-catface" /></svg>
        <p>Halaman kosong…<br>tambahkan foto lain di <strong>js/data.js</strong> 🐾</p>
      </div>`;
  }

  function buildSheetInner(pageIdx) {
    const size = pageSize();
    const start = pageIdx * size;
    const slice = memories.slice(start, start + size);

    let html = "";
    let filledPages = 0;
    slice.forEach((m, idx) => {
      html += `
        <div class="book__page">
          ${polaroidHTML(m, start + idx)}
          <span class="page-no">— ${pageIdx * size + idx + 1} —</span>
        </div>`;
      filledPages++;
    });
    while (filledPages < size) {
      html += emptyPageHTML();
      filledPages++;
    }
    return html;
  }

  function clampPage() {
    const pages = totalPages();
    if (pageIndex > pages - 1) pageIndex = pages - 1;
    if (pageIndex < 0) pageIndex = 0;
  }

  function updateControls() {
    const pages = totalPages();

    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex >= pages - 1;
    bookCounter.textContent = `Halaman ${pageIndex + 1} dari ${pages}`;
    bookFinish.hidden = pageIndex < pages - 1;

    // titik halaman
    bookDots.innerHTML = "";
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot" + (i === pageIndex ? " is-active" : "");
      dot.setAttribute("aria-label", `Ke halaman ${i + 1}`);
      dot.addEventListener("click", () => goToPage(i));
      bookDots.appendChild(dot);
    }
  }

  /* render instan tanpa animasi — dipakai saat inisialisasi & resize */
  function renderBook() {
    cleanupFlip();
    clampPage();
    bookSpread.innerHTML = `<div class="book__sheet is-current">${buildSheetInner(pageIndex)}</div>`;
    bindImageFallbacks(bookSpread);
    updateControls();
  }

  /* =========================================================
     ANIMASI PAGE-TURN — halaman dibalik tangan (±1,1 detik)
     FLIP_MS harus sama dengan durasi di css/styles.css (1.1s)
     ========================================================= */
  const FLIP_MS = 1100;
  const FLIP_PAD = 250; // jeda aman untuk timer cadangan
  let isFlipping = false;
  let flipTimer = null;

  function flipToPage(target, direction) {
    if (isFlipping) return;

    // user yang minta kurangi animasi → pindah instan
    if (prefersReducedMotion()) {
      pageIndex = target;
      renderBook();
      return;
    }

    isFlipping = true;
    pageIndex = target;

    // halaman lama (akan dibalik) & halaman baru (menunggu di bawahnya)
    const leaving = bookSpread.querySelector(".book__sheet.is-current");

    const entering = document.createElement("div");
    entering.className = "book__sheet is-entering";
    entering.innerHTML = buildSheetInner(target);
    bookSpread.appendChild(entering);
    bindImageFallbacks(entering);

    if (leaving) {
      leaving.classList.remove("is-current");
      leaving.classList.add("is-leaving");
      if (direction === "prev") leaving.classList.add("is-prev");
      leaving.addEventListener("animationend", (e) => {
        if (
          e.target === leaving &&
          (e.animationName === "pageTurnNext" || e.animationName === "pageTurnPrev")
        ) {
          finishFlip();
        }
      });
    }

    // kaki kucing menyapu mengikuti arah balikan
    if (pagePaw) {
      pagePaw.classList.remove("is-sweeping-next", "is-sweeping-prev");
      void pagePaw.offsetWidth; // paksa animasi dimulai ulang
      pagePaw.classList.add(direction === "prev" ? "is-sweeping-prev" : "is-sweeping-next");
    }

    if (bookNav) bookNav.classList.add("is-busy");
    updateControls();

    // timer cadangan: animasi CSS bisa tak terkirim (tab di background, dsb.)
    flipTimer = setTimeout(finishFlip, FLIP_MS + FLIP_PAD);
  }

  /* bersihkan state flip — idempoten (aman dipanggil berkali-kali) */
  function finishFlip() {
    if (!isFlipping) return;
    isFlipping = false;

    if (flipTimer) {
      clearTimeout(flipTimer);
      flipTimer = null;
    }

    bookSpread.querySelectorAll(".book__sheet.is-leaving").forEach((el) => el.remove());

    const entering = bookSpread.querySelector(".book__sheet.is-entering");
    if (entering) {
      entering.classList.remove("is-entering");
      entering.classList.add("is-current");
    }

    if (bookNav) bookNav.classList.remove("is-busy");
    if (pagePaw) pagePaw.classList.remove("is-sweeping-next", "is-sweeping-prev");
  }

  /* paksa bereskan sisa animasi (dipakai renderBook/resize) */
  function cleanupFlip() {
    if (flipTimer) {
      clearTimeout(flipTimer);
      flipTimer = null;
    }
    isFlipping = false;
    bookSpread
      .querySelectorAll(".book__sheet.is-leaving, .book__sheet.is-entering")
      .forEach((el) => el.remove());
    if (bookNav) bookNav.classList.remove("is-busy");
    if (pagePaw) pagePaw.classList.remove("is-sweeping-next", "is-sweeping-prev");
  }

  function bindImageFallbacks(root) {
    (root || bookSpread).querySelectorAll(".polaroid__frame img").forEach((img) => {
      const showPlaceholder = () => {
        img.style.display = "none";
        const ph = img.parentElement.querySelector(".photo-placeholder");
        if (ph) ph.hidden = false;
      };
      img.addEventListener("error", showPlaceholder);
      // jaga-jaga bila gambar sudah error sejak sebelum listener terpasang
      if (img.complete && img.naturalWidth === 0) showPlaceholder();
    });
  }

  function goToPage(i) {
    if (isFlipping) return; // abaikan input selama halaman sedang dibalik
    const pages = totalPages();
    const target = Math.min(Math.max(i, 0), pages - 1);
    if (target === pageIndex) return;
    flipToPage(target, target > pageIndex ? "next" : "prev");
  }

  prevBtn.addEventListener("click", () => goToPage(pageIndex - 1));
  nextBtn.addEventListener("click", () => goToPage(pageIndex + 1));
  toCakeBtn.addEventListener("click", () => goToScene(3));

  // panah keyboard saat di scene buku
  document.addEventListener("keydown", (e) => {
    if (currentScene !== 2) return;
    if (e.key === "ArrowLeft") goToPage(pageIndex - 1);
    if (e.key === "ArrowRight") goToPage(pageIndex + 1);
  });

  // swipe (mobile)
  let touchX = 0;
  let touchY = 0;
  const bookEl = document.getElementById("book");
  bookEl.addEventListener(
    "touchstart",
    (e) => {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );
  bookEl.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) goToPage(pageIndex + 1);
      else goToPage(pageIndex - 1);
    },
    { passive: true }
  );

  // ubah tata letak saat layar melewati batas desktop
  let wasDesktop = isDesktop();
  window.addEventListener("resize", () => {
    const desktop = isDesktop();
    if (desktop !== wasDesktop) {
      wasDesktop = desktop;
      pageIndex = desktop ? Math.floor(pageIndex / 2) * 2 : pageIndex * 2;
      if (currentScene === 2) renderBook();
    }
  });

  /* =========================================================
     SCENE 3 — KUE, LILIN, ASAP & CONFETTI KELOPAK BUNGA
     ========================================================= */
  const PASTEL_COLORS = ["#E29578", "#F4A9A8", "#83A482", "#D4E2D4", "#F5EDE4", "#FCEADE"];

  function petalShape() {
    // kelopak bunga via path SVG (fallback ke lingkaran bila tidak didukung)
    if (typeof confetti !== "undefined" && typeof confetti.shapeFromPath === "function") {
      try {
        return confetti.shapeFromPath({ path: "M12 0 C19 7 19 15 12 22 C5 15 5 7 12 0 Z" });
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  function flowerConfetti() {
    if (typeof confetti !== "undefined" && typeof confetti.shapeFromText === "function") {
      try {
        return confetti.shapeFromText({ text: "🌸", scalar: 1.6 });
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  function launchConfetti() {
    if (typeof confetti === "undefined") return;

    const petal = petalShape();
    const flower = flowerConfetti();
    const shapes = flower ? [flower, petal || "circle", petal || "circle"] : petal ? [petal, "circle"] : ["circle", "square"];

    const base = {
      colors: PASTEL_COLORS,
      disableForReducedMotion: true,
      scalar: 1.15,
      ticks: 260,
    };

    // ledakan utama dari atas kue
    confetti({ ...base, shapes, particleCount: 90, spread: 100, startVelocity: 52, origin: { x: 0.5, y: 0.55 } });

    // kembang api dari kiri & kanan
    setTimeout(() => {
      confetti({ ...base, shapes, particleCount: 55, spread: 70, angle: 62, origin: { x: 0.12, y: 0.75 } });
      confetti({ ...base, shapes, particleCount: 55, spread: 70, angle: 118, origin: { x: 0.88, y: 0.75 } });
    }, 320);

    // hujan kelopak dari atas
    setTimeout(() => {
      confetti({ ...base, shapes, particleCount: 70, spread: 160, startVelocity: 28, gravity: 0.75, origin: { x: 0.5, y: -0.05 } });
    }, 900);
  }

  function blowCandles() {
    if (isBlown) return;
    isBlown = true;

    // 1. api padam + asap muncul
    cakeSvg.classList.add("is-blown");

    // 2. sembunyikan tombol
    wishBtn.classList.add("is-hidden");
    wishBtn.disabled = true;

    // 3. teks transisi
    const msg = typeof WISH_MESSAGE !== "undefined" ? WISH_MESSAGE : "Semoga semua impianmu terkabul… 🌸";
    wishMessage.textContent = msg;
    wishMessage.hidden = false;
    requestAnimationFrame(() => wishMessage.classList.add("is-visible"));

    // 4. confetti kelopak bunga + hujan polaroid (berlanjut di belakang surat)
    launchConfetti();
    startFallingPhotos();

    // 5. buka surat setelah 2 detik
    autoOpenTimer = setTimeout(() => goToScene(4), 2000);
  }

  wishBtn.addEventListener("click", blowCandles);

  /* =========================================================
     HUJAN POLAROID (efek setelah tiup lilin)
     TERPISAH dari MEMORIES — memakai FALLING_PHOTOS di js/data.js
     ========================================================= */
  const fallingLayer = document.querySelector(".falling-layer");
  let fallingActive = false;
  let fallingTimer = null;
  let fallingPool = [];
  let fallingIndex = 0;
  let fallingCfg = null;

  function prefersReducedMotion() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function readFallingConfig() {
    const c = typeof FALLING_CONFIG !== "undefined" && FALLING_CONFIG ? FALLING_CONFIG : {};
    const minDuration = Number(c.minDuration) || 7;
    const maxDuration = Number(c.maxDuration) || 13;
    const count = Number(c.count) || 9;
    const avgSeconds = (minDuration + maxDuration) / 2;
    const intervalSeconds = c.interval ? Number(c.interval) : avgSeconds / count;
    return {
      minDuration: minDuration,
      maxDuration: maxDuration,
      swaySeconds: Number(c.swaySeconds) || 3,
      count: count,
      intervalMs: Math.max(250, intervalSeconds * 1000),
    };
  }

  function nextFallingSrc() {
    if (!fallingPool.length) return null;
    const src = fallingPool[fallingIndex % fallingPool.length];
    fallingIndex++;
    return src;
  }

  function miniPolaroidHTML(src) {
    if (src) {
      const safe = String(src).replace(/"/g, "&quot;");
      return `<div class="mini-polaroid"><img class="mini-polaroid__photo" src="${safe}" alt="" /></div>`;
    }
    return `<div class="mini-polaroid mini-polaroid--empty">
        <svg viewBox="0 0 100 90" aria-hidden="true"><use href="#icon-catface" /></svg>
        <span>isi assets/photos/falling</span>
      </div>`;
  }

  function spawnFallingOne(cfg) {
    if (!fallingLayer) return;

    const el = document.createElement("div");
    el.className = "falling-photo";
    el.style.setProperty("--x", rand(5, 95).toFixed(1) + "%");
    el.style.setProperty("--size", rand(84, 118).toFixed(0) + "px");
    el.style.setProperty("--dur", rand(cfg.minDuration, cfg.maxDuration).toFixed(1) + "s");
    el.style.setProperty("--sway", rand(cfg.swaySeconds - 0.5, cfg.swaySeconds + 0.7).toFixed(2) + "s");
    el.style.setProperty("--rot", rand(-14, 14).toFixed(1) + "deg");

    const inner = document.createElement("div");
    inner.className = "falling-photo__inner";
    inner.innerHTML = miniPolaroidHTML(nextFallingSrc());

    // foto belum ada / gagal muat → tukar dengan bingkai kosong berhias kucing
    const img = inner.querySelector("img");
    if (img) {
      img.addEventListener("error", () => {
        inner.innerHTML = miniPolaroidHTML(null);
      });
    }

    el.appendChild(inner);
    fallingLayer.appendChild(el);

    // bersihkan setelah animasi jatuh selesai
    // (event dari elemen anak ikut mengebubble, jadi harus difilter)
    el.addEventListener("animationend", (e) => {
      if (e.target === el) el.remove();
    });
  }

  function scheduleFalling(delayMs) {
    if (!fallingActive) return;
    fallingTimer = setTimeout(() => {
      if (!fallingActive) return;
      spawnFallingOne(fallingCfg);
      scheduleFalling(fallingCfg.intervalMs);
    }, delayMs);
  }

  function startFallingPhotos() {
    if (prefersReducedMotion()) return;

    const source = typeof FALLING_PHOTOS !== "undefined" && Array.isArray(FALLING_PHOTOS) ? FALLING_PHOTOS : [];
    fallingPool = shuffle(source.map((p) => (p && p.image) || null));
    fallingIndex = 0;
    fallingCfg = readFallingConfig();
    fallingActive = true;

    scheduleFalling(0);
  }

  function clearFallingPhotos() {
    fallingActive = false;
    if (fallingTimer) clearTimeout(fallingTimer);
    fallingTimer = null;
    if (fallingLayer) fallingLayer.innerHTML = "";
  }

  /* =========================================================
     SCENE 4 — SURAT CINTA (unfold) + render konten
     ========================================================= */
  function renderLetter() {
    if (typeof LETTER === "undefined") return;

    let html = `<h2 class="letter__heading">${LETTER.heading || ""}</h2>`;

    (LETTER.blocks || []).forEach((b) => {
      if (b.type === "p") {
        html += `<p>${b.text}</p>`;
      } else if (b.type === "list") {
        html += `<ul>${(b.items || []).map((i) => `<li>${i}</li>`).join("")}</ul>`;
      } else if (b.type === "sign") {
        html += `<p class="letter__sign">${b.from || ""}<strong>${b.name || ""}</strong></p>`;
      }
    });

    letterBody.innerHTML = html;
  }

  function openLetter() {
    letter.classList.remove("is-open");
    // double rAF agar transisi terpicu setelah display scene berubah
    requestAnimationFrame(() => {
      requestAnimationFrame(() => letter.classList.add("is-open"));
    });
  }

  restartBtn.addEventListener("click", () => {
    if (autoOpenTimer) clearTimeout(autoOpenTimer);

    // reset kue
    isBlown = false;
    cakeSvg.classList.remove("is-blown");
    wishBtn.classList.remove("is-hidden");
    wishBtn.disabled = false;
    wishMessage.classList.remove("is-visible");
    wishMessage.hidden = true;

    // reset surat
    letter.classList.remove("is-open");

    // bersihkan sisa confetti & hujan foto
    clearFallingPhotos();
    if (typeof confetti !== "undefined" && typeof confetti.reset === "function") {
      confetti.reset();
    }

    goToScene(1);
  });

  /* =========================================================
     INIT
     ========================================================= */
  setSrcBgm();
  renderLetter();
  renderBook();
})();
