/* =========================================================
   HIMASANTIKA
   CINEMATIC HERO SCRIPT
   GSAP + SCROLLTRIGGER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* =======================================================
     CONFIG
  ======================================================= */

  const CONFIG = {
    desktopBreakpoint: 768,

    heroScrollDistance: 3200,

    smoothScrub: 1.2,

    modelRotationStage1: 0,
    modelRotationStage2: 12,
    modelRotationStage3: -12,

    enableParticles: true,

    particleCount: 65
  };


  /* =======================================================
     DOM
  ======================================================= */

  const body = document.body;

  const loader = document.getElementById("pageLoader");

  const navbar = document.getElementById("navbar");

  const navToggle = document.getElementById("navToggle");

  const navMenu = document.getElementById("navMenu");

  const navLinks = document.querySelectorAll(".navbar__link");

  const hero = document.querySelector(".hero-cinematic");

  const heroPin = document.querySelector(".hero-pin");

  const emblemSystem = document.querySelector("[data-emblem-system]");

  const emblemMove = document.querySelector("[data-emblem-move]");

  const heroModel = document.getElementById("heroModel");

  const heroBadge = document.querySelector("[data-badge]");

  const emblemGlow = document.querySelector(".emblem-glow");

  const heroBg = document.querySelector(".hero-bg");

  const stages = {
    stage1: document.querySelector('[data-stage="1"]'),
    stage2: document.querySelector('[data-stage="2"]'),
    stage3: document.querySelector('[data-stage="3"]')
  };

  const stageContents = {
    stage1: stages.stage1?.querySelector(".stage-content"),
    stage2: stages.stage2?.querySelector(".stage-content"),
    stage3: stages.stage3?.querySelector(".stage-content")
  };

  const imageSets = {
    set1: document.querySelector('[data-image-set="1"]'),
    set2: document.querySelector('[data-image-set="2"]'),
    set3: document.querySelector('[data-image-set="3"]')
  };

  const heroProgressFill = document.getElementById("heroProgressFill");

  const progressNumber =
    document.querySelector(".hero-progress__number");

  const scrollCue =
    document.querySelector("[data-scroll-cue]");


  /* =======================================================
     CHECK GSAP
  ======================================================= */

  const hasGSAP =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";


  if (hasGSAP) {

    gsap.registerPlugin(ScrollTrigger);

  } else {

    console.warn(
      "GSAP atau ScrollTrigger tidak berhasil dimuat."
    );

  }


  /* =======================================================
     LOADER
  ======================================================= */

  function hideLoader() {

    if (!loader) return;

    window.setTimeout(() => {

      loader.classList.add("is-hidden");

      window.setTimeout(() => {

        loader.remove();

      }, 700);

    }, 450);

  }


  window.addEventListener(
    "load",
    hideLoader
  );


  /*
    Safety fallback.
    Jika ada asset yang lambat/error,
    loader tetap tidak mengunci website.
  */

  window.setTimeout(() => {

    if (loader && !loader.classList.contains("is-hidden")) {

      hideLoader();

    }

  }, 5000);


  /* =======================================================
     NAVBAR
  ======================================================= */

  function updateNavbar() {

    if (!navbar) return;

    const scrollY =
      window.scrollY || window.pageYOffset;

    navbar.classList.toggle(
      "is-scrolled",
      scrollY > 30
    );

  }


  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  updateNavbar();


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  if (navToggle && navMenu) {

    navToggle.addEventListener("click", () => {

      const isOpen =
        navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navMenu.classList.toggle(
        "is-open",
        !isOpen
      );

    });

  }


  navLinks.forEach((link) => {

    link.addEventListener("click", () => {

      if (navMenu) {

        navMenu.classList.remove("is-open");

      }

      if (navToggle) {

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });

  });


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  function setupActiveNavigation() {

    if (!hasGSAP) return;

    const sections =
      document.querySelectorAll(
        "main section[id]"
      );


    sections.forEach((section) => {

      ScrollTrigger.create({

        trigger: section,

        start: "top center",

        end: "bottom center",

        onEnter: () => {

          setActiveLink(section.id);

        },

        onEnterBack: () => {

          setActiveLink(section.id);

        }

      });

    });

  }


  function setActiveLink(id) {

    navLinks.forEach((link) => {

      const href =
        link.getAttribute("href");

      link.classList.toggle(
        "is-active",
        href === `#${id}`
      );

    });

  }


  /* =======================================================
     HERO HELPERS
  ======================================================= */

  function isMobile() {

    return (
      window.innerWidth <
      CONFIG.desktopBreakpoint
    );

  }


  /*
    Blur reveal harus lebih ringan di mobile
    supaya tetap smooth (lihat prioritas performa).
  */

  function entryBlur(px) {

    return isMobile()
      ? "blur(0px)"
      : `blur(${px}px)`;

  }


  /* =======================================================
     TITLE LINE SPLIT

     Membungkus setiap baris heading (dipisah oleh <br>)
     ke dalam mask + inner span, murni di runtime, agar
     bisa direveal per baris (cinematic mask reveal).

     Teks asli, <br>, dan <span> aksen warna TIDAK diubah —
     hanya dibungkus. Idempotent (aman dipanggil berulang
     saat resize) lewat data-lines-wrapped.
  ======================================================= */

  function wrapTitleLines() {

    if (!hero) return;

    const titles =
      hero.querySelectorAll(".stage-title");

    titles.forEach((titleEl) => {

      if (titleEl.dataset.linesWrapped === "true") return;

      const childNodes =
        Array.from(titleEl.childNodes);

      const lines = [];

      let current = [];

      childNodes.forEach((node) => {

        if (node.nodeName === "BR") {

          lines.push(current);

          current = [];

        } else {

          current.push(node);

        }

      });

      lines.push(current);

      titleEl.innerHTML = "";

      lines.forEach((lineNodes) => {

        const hasContent = lineNodes.some((node) => {

          return (
            node.nodeType !== Node.TEXT_NODE ||
            node.textContent.trim().length > 0
          );

        });

        if (!hasContent) return;

        const mask =
          document.createElement("span");

        mask.className = "title-line-mask";

        const inner =
          document.createElement("span");

        inner.className = "title-line-inner";

        lineNodes.forEach((node) => {

          inner.appendChild(node);

        });

        mask.appendChild(inner);

        titleEl.appendChild(mask);

      });

      titleEl.dataset.linesWrapped = "true";

    });

  }


  function getLineInners(titleEl) {

    if (!titleEl) return [];

    return Array.from(
      titleEl.querySelectorAll(".title-line-inner")
    );

  }


  function getModelPositions() {

    /*
      Posisi memakai xPercent agar
      model bergerak berdasarkan ukuran layar.
    */

    if (isMobile()) {

      return {

        stage1: {
          xPercent: -50,
          yPercent: -50,
          scale: 1
        },

        stage2: {
          xPercent: -50,
          yPercent: -30,
          scale: 0.92
        },

        stage3: {
          xPercent: -50,
          yPercent: -30,
          scale: 0.92
        }

      };

    }


    return {

      /*
        CENTER
      */

      stage1: {
        xPercent: -50,
        yPercent: -50,
        scale: 1
      },


      /*
        RIGHT

        emblem-system tetap di tengah.
        Kita hanya menggeser dengan xPercent.
      */

      stage2: {
        xPercent: 18,
        yPercent: -50,
        scale: 0.94
      },


      /*
        LEFT
      */

      stage3: {
        xPercent: -118,
        yPercent: -50,
        scale: 0.94
      }

    };

  }


  /* =======================================================
     RESET HERO
  ======================================================= */

  function resetHeroState() {

    if (!hasGSAP) return;


    const positions =
      getModelPositions();


    /*
      STAGE 1
    */

    gsap.set(
      stages.stage1,
      {
        autoAlpha: 1
      }
    );


    gsap.set(
      stageContents.stage1,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1
      }
    );


    /*
      STAGE 2
    */

    gsap.set(
      stages.stage2,
      {
        autoAlpha: 0
      }
    );


    gsap.set(
      stageContents.stage2,
      {
        autoAlpha: 0,
        x: -60
      }
    );


    /*
      STAGE 3
    */

    gsap.set(
      stages.stage3,
      {
        autoAlpha: 0
      }
    );


    gsap.set(
      stageContents.stage3,
      {
        autoAlpha: 0,
        x: 60
      }
    );


    /*
      IMAGE SETS
    */

    gsap.set(
      imageSets.set1,
      {
        autoAlpha: 1
      }
    );


    gsap.set(
      imageSets.set2,
      {
        autoAlpha: 0
      }
    );


    gsap.set(
      imageSets.set3,
      {
        autoAlpha: 0
      }
    );


    /*
      MODEL

      SANGAT PENTING:

      Hanya container yang bergerak.

      Tidak ada clone.
      Tidak ada model baru.
      Tidak ada ring baru.
    */

    gsap.set(
      emblemMove,
      {
        xPercent:
          positions.stage1.xPercent,

        yPercent:
          positions.stage1.yPercent,

        scale:
          positions.stage1.scale,

        rotation:
          CONFIG.modelRotationStage1
      }
    );


    /*
      Progress
    */

    if (heroProgressFill) {

      gsap.set(
        heroProgressFill,
        {
          width: "33%"
        }
      );

    }


    if (progressNumber) {

      progressNumber.textContent =
        "01";

    }


    /*
      Scroll cue
    */

    if (scrollCue) {

      gsap.set(
        scrollCue,
        {
          autoAlpha: 1,
          y: 0
        }
      );

    }

  }


  /* =======================================================
     PHOTO ANIMATION HELPERS
  ======================================================= */

  function getCards(set) {

    if (!set) return [];

    return Array.from(
      set.querySelectorAll(".photo-card")
    );

  }


  function animateCardsIn(
    timeline,
    cards,
    startTime
  ) {

    if (!cards.length) return;

    /*
      Rotasi asli tiap kartu berasal dari CSS
      (transform: rotate(...)). GSAP membaca matrix
      transform yang sudah ada dan hanya mengubah
      properti yang kita sebut (scale/y/autoAlpha),
      jadi rotasi CSS tetap utuh — tidak perlu wrapper.

      Filter blur() dihapus dari sini karena blur yang
      dianimasikan bersamaan pada 4 gambar (dengan
      box-shadow) adalah operasi repaint yang berat dan
      menyebabkan animasi terasa patah/tidak smooth,
      terutama saat di-scrub mengikuti scroll.
    */

    timeline.fromTo(
      cards,

      {
        autoAlpha: 0,
        scale: 0.86,
        y: 46
      },

      {
        autoAlpha: 1,
        scale: 1,
        y: 0,

        duration: 0.9,

        stagger: 0.08,

        ease:
          "power3.out"
      },

      startTime
    );

  }


  function animateCardsOut(
    timeline,
    cards,
    startTime,
    direction = 1
  ) {

    if (!cards.length) return;

    timeline.to(
      cards,

      {
        autoAlpha: 0,

        scale: 0.88,

        x: 70 * direction,

        y: -12,

        duration: 0.5,

        stagger: 0.05,

        ease:
          "power2.inOut"
      },

      startTime
    );

  }


  /* =======================================================
     HERO TIMELINE
  ======================================================= */

  let heroTimeline = null;


  function setupHeroAnimation() {

    if (
      !hasGSAP ||
      !hero ||
      !emblemMove
    ) {

      return;

    }


    /*
      Bersihkan animation lama
      saat resize.
    */

    if (heroTimeline) {

      heroTimeline.kill();

      heroTimeline = null;

    }


    ScrollTrigger.getAll()
      .filter((trigger) => {

        return trigger.vars?.id ===
          "himasantikaHero";

      })

      .forEach((trigger) => {

        trigger.kill();

      });


    resetHeroState();

    wrapTitleLines();


    const positions =
      getModelPositions();


    const cards1 =
      getCards(imageSets.set1);

    const cards2 =
      getCards(imageSets.set2);

    const cards3 =
      getCards(imageSets.set3);


    /*
      MASTER TIMELINE
    */

    heroTimeline =
      gsap.timeline({

        defaults: {
          ease: "power3.inOut"
        },

        scrollTrigger: {

          id:
            "himasantikaHero",

          trigger:
            hero,

          start:
            "top top",

          end:
            `+=${CONFIG.heroScrollDistance}`,

          scrub:
            CONFIG.smoothScrub,

          pin:
            heroPin,

          anticipatePin:
            1,

          invalidateOnRefresh:
            true,

          onUpdate(self) {

            updateHeroProgress(
              self.progress
            );

          }

        }

      });


    /* =====================================================
       STAGE 1
       INITIAL HOLD
    ===================================================== */

    heroTimeline.to(
      {},
      {
        duration: 1
      }
    );


    /* =====================================================
       STAGE 1 → STAGE 2

       TEXT 1 OUT
    ===================================================== */

    heroTimeline.to(
      stageContents.stage1,
      {
        autoAlpha: 0,

        y: -70,

        scale: 0.96,

        duration: 0.65
      }
    );


    heroTimeline.to(
      stages.stage1,
      {
        autoAlpha: 0,

        duration: 0.2
      },

      "<0.45"
    );


    /*
      IMAGE SET 1 OUT
    */

    animateCardsOut(
      heroTimeline,
      cards1,
      "<",
      -1
    );


    /*
      IMAGE SET 1 CONTAINER OUT
    */

    heroTimeline.to(
      imageSets.set1,
      {
        autoAlpha: 0,
        duration: 0.2
      },

      "<0.25"
    );


    /*
      MODEL

      CENTER → RIGHT
    */

    heroTimeline.to(
      emblemMove,
      {
        xPercent:
          positions.stage2.xPercent,

        yPercent:
          positions.stage2.yPercent,

        scale:
          positions.stage2.scale,

        rotation:
          CONFIG.modelRotationStage2,

        duration:
          1.1,

        ease:
          "power4.inOut"
      },

      "<0.1"
    );


    /*
      IMAGE SET 2 CONTAINER
    */

    heroTimeline.to(
      imageSets.set2,
      {
        autoAlpha: 1,

        duration:
          0.25
      },

      "<0.45"
    );


    /*
      IMAGE SET 2 CARDS
    */

    animateCardsIn(
      heroTimeline,
      cards2,
      "<"
    );


    /*
      STAGE 2 IN
    */

    heroTimeline.to(
      stages.stage2,
      {
        autoAlpha: 1,

        duration:
          0.2
      },

      "<0.25"
    );


    heroTimeline.to(
      stageContents.stage2,
      {
        autoAlpha: 1,

        x: 0,

        duration:
          0.8,

        ease:
          "power3.out"
      },

      "<"
    );


    /*
      TEXT 2 — CINEMATIC LINE REVEAL

      Berjalan berbarengan dengan slide masuk
      di atas, memberi lapisan (layered) choreography
      tanpa mengganggu gerak container utama.
    */

    const stage2TitleLines = getLineInners(
      stages.stage2?.querySelector(".stage-title")
    );

    if (stage2TitleLines.length) {

      heroTimeline.fromTo(
        stage2TitleLines,
        {
          yPercent: 115,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,

          duration: 0.75,

          stagger: 0.08,

          ease:
            "expo.out"
        },
        "<0.05"
      );

    }


    /*
      STAGE 2 HOLD
    */

    heroTimeline.to(
      {},
      {
        duration:
          1.2
      }
    );


    /* =====================================================
       STAGE 2 → STAGE 3
    ===================================================== */


    /*
      TEXT 2 OUT
    */

    heroTimeline.to(
      stageContents.stage2,
      {
        autoAlpha: 0,

        x: -70,

        duration:
          0.65
      }
    );


    heroTimeline.to(
      stages.stage2,
      {
        autoAlpha: 0,

        duration:
          0.2
      },

      "<0.4"
    );


    /*
      IMAGE SET 2 OUT
    */

    animateCardsOut(
      heroTimeline,
      cards2,
      "<",
      1
    );


    heroTimeline.to(
      imageSets.set2,
      {
        autoAlpha: 0,

        duration:
          0.2
      },

      "<0.25"
    );


    /*
      MODEL

      RIGHT → LEFT

      Tetap SATU model yang sama.
    */

    heroTimeline.to(
      emblemMove,
      {
        xPercent:
          positions.stage3.xPercent,

        yPercent:
          positions.stage3.yPercent,

        scale:
          positions.stage3.scale,

        rotation:
          CONFIG.modelRotationStage3,

        duration:
          1.3,

        ease:
          "power4.inOut"
      },

      "<0.1"
    );


    /*
      IMAGE SET 3
    */

    heroTimeline.to(
      imageSets.set3,
      {
        autoAlpha: 1,

        duration:
          0.25
      },

      "<0.4"
    );


    animateCardsIn(
      heroTimeline,
      cards3,
      "<"
    );


    /*
      STAGE 3 TEXT
    */

    heroTimeline.to(
      stages.stage3,
      {
        autoAlpha: 1,

        duration:
          0.2
      },

      "<0.2"
    );


    heroTimeline.to(
      stageContents.stage3,
      {
        autoAlpha: 1,

        x: 0,

        duration:
          0.8,

        ease:
          "power3.out"
      },

      "<"
    );


    /*
      TEXT 3 — CINEMATIC LINE REVEAL
    */

    const stage3TitleLines = getLineInners(
      stages.stage3?.querySelector(".stage-title")
    );

    if (stage3TitleLines.length) {

      heroTimeline.fromTo(
        stage3TitleLines,
        {
          yPercent: 115,
          autoAlpha: 0
        },
        {
          yPercent: 0,
          autoAlpha: 1,

          duration: 0.75,

          stagger: 0.08,

          ease:
            "expo.out"
        },
        "<0.05"
      );

    }


    /*
      SCROLL CUE OUT
    */

    if (scrollCue) {

      heroTimeline.to(
        scrollCue,
        {
          autoAlpha: 0,

          y: 20,

          duration:
            0.4
        },

        0.4
      );

    }


    /*
      FINAL HOLD
    */

    heroTimeline.to(
      {},
      {
        duration:
          1
      }
    );


  }


  /* =======================================================
     INTRO REVEAL — STAGE 1 FIRST PAINT

     Sequence satu kali saat halaman dibuka:
     background -> badge -> model -> photo cards -> teks -> CTA.

     Timeline ini TERPISAH dari heroTimeline (scroll/pin).
     Ia hanya menganimasikan elemen dari kondisi "hidden"
     menuju nilai akhir yang SAMA dengan yang sudah diberikan
     resetHeroState()/positions.stage1, jadi begitu selesai,
     scroll timeline melanjutkan dari state yang konsisten.
  ======================================================= */

  let introPlayed = false;

  function setupIntroReveal() {

    if (
      !hasGSAP ||
      !hero ||
      !emblemMove ||
      introPlayed
    ) {

      return;

    }

    introPlayed = true;

    wrapTitleLines();

    /*
      Kunci scroll sangat singkat (~2.3s) supaya
      choreography intro tidak tabrakan dengan
      scroll-scrubbed heroTimeline jika user langsung
      scroll cepat. Dilepas otomatis saat timeline
      selesai, dengan fallback keamanan seperti loader.
    */

    const previousOverflowY =
      document.body.style.overflowY;

    document.body.style.overflowY = "hidden";

    let scrollUnlocked = false;

    function unlockScroll() {

      if (scrollUnlocked) return;

      scrollUnlocked = true;

      document.body.style.overflowY =
        previousOverflowY || "";

    }

    window.setTimeout(unlockScroll, 2600);

    const positions =
      getModelPositions();

    const cards1 =
      getCards(imageSets.set1);

    const stage1Title =
      stages.stage1?.querySelector(".stage-title");

    const stage1Lines =
      getLineInners(stage1Title);

    const stage1Eyebrow =
      stages.stage1?.querySelector(".stage-eyebrow");

    const stage1Desc =
      stages.stage1?.querySelector(".stage-description");

    const stage1Actions =
      stages.stage1?.querySelector(".stage-actions--hero");

    const intro =
      gsap.timeline({
        defaults: {
          ease: "power3.out"
        },

        delay: 0.3
      });


    /*
      A. BACKGROUND
    */

    if (heroBg) {

      intro.fromTo(
        heroBg,
        {
          autoAlpha: 0,
          scale: 1.05
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out"
        },
        0
      );

    }


    /*
      B. BADGE
    */

    if (heroBadge) {

      intro.fromTo(
        heroBadge,
        {
          autoAlpha: 0,
          y: -18,
          scale: 0.9,
          filter: entryBlur(6)
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: entryBlur(0),
          duration: 0.8
        },
        0.25
      );

    }


    /*
      C. 3D MODEL

      Model tetap SATU elemen yang sama.
      Kita hanya menambah opacity/y/blur di atas
      posisi (xPercent/yPercent/scale) yang sudah
      diset resetHeroState() — properti lain tidak
      disentuh, jadi tidak ada konflik.
    */

    if (emblemGlow) {

      intro.fromTo(
        emblemGlow,
        {
          autoAlpha: 0,
          scale: 0.72
        },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.3,
          ease: "power2.out"
        },
        0.15
      );

    }

    /*
      Model 3D masuk dari ukuran kecil (scale 0.35x)
      lalu membesar ke ukuran akhirnya — bukan hanya
      sedikit lebih kecil seperti sebelumnya. Filter
      blur dihapus karena berat untuk elemen model-viewer
      (WebGL) dan bisa membuat animasi terasa patah.
    */

    intro.fromTo(
      emblemMove,
      {
        autoAlpha: 0,
        y: 30,
        scale: positions.stage1.scale * 0.35
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: positions.stage1.scale,
        duration: 1.4,
        ease: "expo.out"
      },
      0.3
    );


    /*
      D. PHOTO CARDS

      Animasi IN dihilangkan sesuai permintaan —
      4 foto langsung tampil normal tanpa
      entrance animation (opacity/scale/y).

      cards1 tetap dideklarasikan di atas karena
      dipakai fungsi lain (mis. animateCardsOut
      saat transisi Stage 1 -> Stage 2 di
      heroTimeline, yang tidak diubah).
    */


    /*
      E. TEXT — eyebrow -> title (per baris) -> deskripsi
    */

    if (stage1Eyebrow) {

      intro.fromTo(
        stage1Eyebrow,
        {
          autoAlpha: 0,
          y: 16
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6
        },
        0.9
      );

    }

   // ============================================================
// TYPING LOOP — HIMASANTIKA
// Ketik → pause → hapus → pause → ulangi
// ============================================================

const typingTitle = document.querySelector(".stage--1 .stage-title");

if (typingTitle) {
  const originalText = typingTitle.textContent.trim();

  // Pastikan tidak ada animasi line reveal lama yang mengganggu
  typingTitle.innerHTML = "";

  // Cursor typing
  const cursor = document.createElement("span");
  cursor.className = "typing-cursor";

  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typingTitle) return;

    if (!isDeleting) {
      // MENGETIK
      typingTitle.textContent = originalText.slice(0, charIndex);
      typingTitle.appendChild(cursor);

      charIndex++;

      if (charIndex > originalText.length) {
        // Selesai mengetik → tunggu sebelum menghapus
        setTimeout(() => {
          isDeleting = true;
          typeLoop();
        }, 2200);

        return;
      }

      setTimeout(typeLoop, 130);
    } else {
      // MENGHAPUS
      typingTitle.textContent = originalText.slice(0, charIndex);
      typingTitle.appendChild(cursor);

      charIndex--;

      if (charIndex < 0) {
        charIndex = 0;
        isDeleting = false;

        // Jeda sebentar sebelum mengetik lagi
        setTimeout(typeLoop, 700);

        return;
      }

      setTimeout(typeLoop, 75);
    }
  }

  // Mulai dari kosong
  typingTitle.style.opacity = "1";
  typingTitle.style.transform = "none";

  setTimeout(typeLoop, 500);
}

    if (stage1Desc) {

      intro.fromTo(
        stage1Desc,
        {
          autoAlpha: 0,
          y: 20
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7
        },
        1.35
      );

    }


    /*
      F. CTA — paling akhir, sedikit spring-like
    */

    if (stage1Actions) {

      intro.fromTo(
        Array.from(stage1Actions.children),
        {
          autoAlpha: 0,
          y: 22,
          scale: 0.94
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.5)"
        },
        1.6
      );

    }

    if (scrollCue) {

      intro.fromTo(
        scrollCue,
        {
          autoAlpha: 0,
          y: 14
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6
        },
        1.95
      );

    }

    intro.eventCallback(
      "onComplete",
      unlockScroll
    );

  }


  /* =======================================================
     AMBIENT MICRO-ANIMATION

     Sangat halus, tidak boleh mengganggu fokus utama.
     Menggunakan properti yang berbeda dari tween scroll
     (scale/opacity, bukan x/y) agar tidak bentrok dengan
     setupBackgroundMotion().
  ======================================================= */

  function setupAmbientMotion() {

    if (!hasGSAP) return;

    if (heroBadge) {

      gsap.to(
        heroBadge,
        {
          y: -5,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );

    }

    if (scrollCue) {

      const cueIcon =
        scrollCue.querySelector("i");

      if (cueIcon) {

        gsap.to(
          cueIcon,
          {
            x: 6,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }
        );

      }

    }

    const glows =
      hero
        ? hero.querySelectorAll(".bg-glow")
        : [];

    glows.forEach((glow, index) => {

      gsap.to(
        glow,
        {
          scale: 1.08,
          opacity:
            "+=0.05",
          duration:
            6 + index * 1.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay:
            index * 0.6
        }
      );

    });

  }


  /* =======================================================
     HERO PROGRESS
  ======================================================= */

  function updateHeroProgress(progress) {

    if (!heroProgressFill) return;


    const percentage =
      Math.min(
        100,
        Math.max(
          0,
          progress * 100
        )
      );


    /*
      Progress visual
    */

    heroProgressFill.style.width =
      `${Math.max(33, percentage)}%`;


    /*
      Stage number
    */

    if (progressNumber) {

      let number = "01";


      if (progress >= 0.66) {

        number = "03";

      } else if (progress >= 0.33) {

        number = "02";

      }


      progressNumber.textContent =
        number;

    }

  }


  /* =======================================================
     FLOATING PHOTO MOTION

     Sangat halus.

     Hanya berjalan setelah
     main GSAP animation dibuat.
  ======================================================= */

  function setupFloatingPhotos() {

    if (!hasGSAP) return;


    const cards =
      document.querySelectorAll(
        ".photo-card"
      );


    cards.forEach((card, index) => {

      /*
        Tidak memakai transform rotate di sini
        agar tidak merusak rotasi CSS card.

        Hanya menggunakan y.
      */

      gsap.to(
        card,
        {
          y:
            index % 2 === 0
              ? -8
              : 8,

          /*
            Diperlambat ~2x agar gerakan goyang
            foto terasa lebih tenang & halus.
          */
          duration:
            4.8 + index * 0.4,

          repeat:
            -1,

          yoyo:
            true,

          ease:
            "sine.inOut",

          delay:
            index * 0.3
        }
      );

    });

  }


  /* =======================================================
     PARTICLE CANVAS
  ======================================================= */

  function setupParticles() {

    if (!CONFIG.enableParticles) return;


    const canvas =
      document.getElementById("particles");


    if (!canvas) return;


    const context =
      canvas.getContext("2d");


    let width = 0;

    let height = 0;

    let particles = [];

    let animationFrame = null;


    function resize() {

      const rect =
        canvas.getBoundingClientRect();


      width =
        rect.width;


      height =
        rect.height;


      const ratio =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );


      canvas.width =
        width * ratio;


      canvas.height =
        height * ratio;


      context.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );


      createParticles();

    }


    function createParticles() {

      particles = [];


      const count =
        isMobile()
          ? 30
          : CONFIG.particleCount;


      for (
        let i = 0;
        i < count;
        i++
      ) {

        particles.push({

          x:
            Math.random() * width,

          y:
            Math.random() * height,

          size:
            Math.random() * 1.8 + 0.5,

          speedX:
            (Math.random() - 0.5) * 0.18,

          speedY:
            (Math.random() - 0.5) * 0.18,

          alpha:
            Math.random() * 0.35 + 0.08

        });

      }

    }


    function draw() {

      context.clearRect(
        0,
        0,
        width,
        height
      );


      particles.forEach((particle) => {

        particle.x +=
          particle.speedX;


        particle.y +=
          particle.speedY;


        if (
          particle.x < 0 ||
          particle.x > width
        ) {

          particle.speedX *= -1;

        }


        if (
          particle.y < 0 ||
          particle.y > height
        ) {

          particle.speedY *= -1;

        }


        context.beginPath();


        context.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );


        context.fillStyle =
          `rgba(11, 79, 156, ${particle.alpha})`;


        context.fill();

      });


      animationFrame =
        requestAnimationFrame(draw);

    }


    resize();

    draw();


    window.addEventListener(
      "resize",
      () => {

        cancelAnimationFrame(
          animationFrame
        );

        resize();

        draw();

      }
    );

  }


  /* =======================================================
     MODEL VIEWER READY
  ======================================================= */

  if (heroModel) {

    heroModel.addEventListener(
      "load",
      () => {

        console.log(
          "3D HIMASANTIKA berhasil dimuat."
        );

      }
    );


    heroModel.addEventListener(
      "error",
      (event) => {

        console.error(
          "Gagal memuat logo.glb:",
          event
        );

      }
    );

  }


  /* =======================================================
     MODEL AUTO ROTATION ENHANCEMENT
  ======================================================= */

  function setupModelMotion() {

    if (
      !hasGSAP ||
      !heroModel
    ) {

      return;

    }


    /*
      Kita TIDAK membuat objek baru.

      Hanya memberi sedikit rotasi
      pada container visual.

      Model-viewer tetap memakai
      auto-rotate miliknya sendiri.
    */

    gsap.to(
      heroModel,
      {
        y: -8,

        duration: 2.8,

        repeat: -1,

        yoyo: true,

        ease: "sine.inOut"
      }
    );

  }


  /* =======================================================
     REVEAL NORMAL SECTIONS
  ======================================================= */

  function setupSectionReveal() {

    if (!hasGSAP) return;


    const sections =
      document.querySelectorAll(
        ".content-section"
      );


    sections.forEach((section) => {

      const heading =
        section.querySelector(
          ".section-heading"
        );


      const placeholder =
        section.querySelector(
          ".section-placeholder, .section-body"
        );


      const timeline =
        gsap.timeline({

          scrollTrigger: {

            trigger:
              section,

            start:
              "top 75%",

            once:
              true

          }

        });


      if (heading) {

        timeline.from(
          heading.children,
          {
            y: 35,

            autoAlpha: 0,

            duration:
              0.7,

            stagger:
              0.12,

            ease:
              "power3.out"
          }
        );

      }


      if (placeholder) {

        timeline.from(
          placeholder,
          {
            y: 50,

            scale:
              0.97,

            autoAlpha:
              0,

            duration:
              0.8,

            ease:
              "power3.out"
          },

          "-=0.35"
        );

      }

    });

  }


  /* =======================================================
     PARALLAX BACKGROUND
  ======================================================= */

  function setupBackgroundMotion() {

    if (!hasGSAP || !hero) return;


    const glows =
      hero.querySelectorAll(
        ".bg-glow"
      );


    glows.forEach(
      (glow, index) => {

        gsap.to(
          glow,
          {
            x:
              index % 2 === 0
                ? 80
                : -80,

            y:
              index % 2 === 0
                ? 40
                : -40,

            scrollTrigger: {

              trigger:
                hero,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub:
                2
            }
          }
        );

      }
    );

  }


  /* =======================================================
     ZOOM TRANSITION — BERANDA → KEGIATAN

     Saat pengguna scroll keluar dari hero menuju section
     Kegiatan, hero seolah "di-zoom" mendekat kamera sambil
     memudar, sementara section Kegiatan muncul dari sedikit
     diperbesar menuju ukuran normal. Efek ini scrub mengikuti
     scroll, terpisah dari reveal umum di setupSectionReveal().
  ======================================================= */

  function setupHeroKegiatanZoom() {

    if (!hasGSAP || !hero) return;

    const kegiatanSection =
      document.getElementById("kegiatan");

    if (!kegiatanSection) return;

    gsap.set(hero, {
      transformOrigin: "50% 50%"
    });

    gsap.set(kegiatanSection, {
      transformOrigin: "50% 50%"
    });

    gsap.timeline({

      scrollTrigger: {

        trigger:
          kegiatanSection,

        start:
          "top bottom",

        end:
          "top 15%",

        scrub:
          1
      }

    })

      .fromTo(
        hero,
        {
          scale: 1,
          autoAlpha: 1
        },
        {
          scale: 1.22,
          autoAlpha: 0,
          ease: "none"
        },
        0
      )

      .fromTo(
        kegiatanSection,
        {
          scale: 1.12,
          autoAlpha: 0.3
        },
        {
          scale: 1,
          autoAlpha: 1,
          ease: "none"
        },
        0
      );

  }


  /* =======================================================
     RESIZE HANDLER
  ======================================================= */

  let resizeTimer = null;

  let previousWidth =
    window.innerWidth;


  window.addEventListener(
    "resize",
    () => {

      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(() => {

          /*
            Hindari rebuild berlebihan
            pada perubahan tinggi mobile.
          */

          if (
            Math.abs(
              window.innerWidth -
              previousWidth
            ) < 40
          ) {

            return;

          }


          previousWidth =
            window.innerWidth;


          if (hasGSAP) {

            setupHeroAnimation();

            ScrollTrigger.refresh();

          }

        },
        250
      );

    }
  );


  /* =======================================================
     REDUCED MOTION
  ======================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* =======================================================
     INITIALIZE
  ======================================================= */

  if (!prefersReducedMotion) {

    if (hasGSAP) {

      setupHeroAnimation();

      setupActiveNavigation();

      setupFloatingPhotos();

      setupSectionReveal();

      setupBackgroundMotion();

      setupHeroKegiatanZoom();

      setupIntroReveal();

      setupAmbientMotion();

    }


    setupParticles();

    setupModelMotion();

  } else {

    /*
      Jika user memakai reduced motion,
      website tetap tampil normal
      tanpa cinematic scroll animation.
    */

    if (hasGSAP) {

      resetHeroState();

    }

  }


  /* =======================================================
     FINAL REFRESH

     Penting karena model-viewer
     dapat mengubah ukuran setelah load.
  ======================================================= */

  if (hasGSAP) {

    window.setTimeout(() => {

      ScrollTrigger.refresh();

    }, 500);


    window.setTimeout(() => {

      ScrollTrigger.refresh();

    }, 1500);

  }


});
/* =========================================================
   WEBSITE EFFECTS — dari script(6).js (project tanpa akhiran "1")
   Drift Wall (Kegiatan), reveal Cerita Kami, flip cards Divisi,
   dan tahun footer. Modul terpisah / namespace sendiri supaya
   tidak bentrok dengan variabel di dalam cinematic hero script
   di atas.
========================================================= */
(() => {
  "use strict";

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     DRIFT WALL — vanilla DOM/rAF gallery wall (Kegiatan section)
     ============================================================ */
  class DriftWall {
    constructor(container, opts = {}) {
      this.container = container;
      this.opts = Object.assign({
        items: [],
        columns: 5,
        tileWidth: 200,
        tileHeight: 132,
        gap: 18,
        radius: 14,
        tilt: 16,
        turn: -14,
        roll: 0,
        perspective: 1200,
        depth: 120,
        speed: 42,
        direction: 'up',
        variance: 0.45,
        parallax: 0.6,
        pauseOnHover: false,
        lift: 64,
        fade: 0.6,
        dim: 0.55,
        grayscale: false,
        overlayColor: '#000000'
      }, opts);

      this.reduced = prefersReducedMotion();
      this.offsets = [];
      this.velocities = [];
      this.trackEls = [];
      this.hoveredCol = -1;
      this.wallHovered = false;
      this.pointer = { x: 0, y: 0 };
      this.pointerDamped = { x: 0, y: 0 };
      this.lastTs = null;
      this.rafId = null;
      this.activeId = null;

      this._onPointerMove = this._handlePointerMove.bind(this);
      this._onPointerEnter = () => { this.wallHovered = true; };
      this._onPointerLeave = this._handlePointerLeave.bind(this);

      this._build();
      this._ro = new ResizeObserver(([entry]) => {
        this.containerHeight = entry.contentRect.height || 600;
        this._layoutColumns();
      });
      this._ro.observe(this.container);

      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', (e) => { this.reduced = e.matches; });

      this._start();
    }

    static _columnFactor(index, variance) {
      const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
      return 1 + variance * pseudo;
    }

    _build() {
      const o = this.opts;
      this.container.classList.add('drift-wall');
      if (this.reduced) this.container.classList.add('drift-wall--reduced');
      this.container.style.setProperty('--dw-tile-w', `${o.tileWidth}px`);
      this.container.style.setProperty('--dw-tile-h', `${o.tileHeight}px`);
      this.container.style.setProperty('--dw-gap', `${o.gap}px`);
      this.container.style.setProperty('--dw-radius', `${o.radius}px`);
      this.container.style.setProperty('--dw-perspective', `${o.perspective}px`);
      this.container.style.setProperty('--dw-lift', `${o.lift}px`);
      this.container.style.setProperty('--dw-dim', o.dim);
      this.container.style.setProperty('--dw-gray', o.grayscale ? 1 : 0);
      this.container.style.setProperty('--dw-overlay', o.overlayColor);
      this.container.style.setProperty('--dw-edge', `${Math.max(0, (1 - o.fade) * 100)}%`);

      this.plane = document.createElement('div');
      this.plane.className = 'drift-wall__plane';
      this.container.innerHTML = '';
      this.container.appendChild(this.plane);

      this.columnItems = Array.from({ length: o.columns }, () => []);
      o.items.forEach((item, i) => this.columnItems[i % o.columns].push(item));
      this.columnItems = this.columnItems.map((col) => (col.length ? col : o.items.slice(0, 1)));

      this.baseVelocities = this.columnItems.map((_, c) => {
        const dirSign = o.direction === 'up' ? 1 : -1;
        const altSign = c % 2 === 0 ? 1 : -1;
        return o.speed * DriftWall._columnFactor(c, o.variance) * dirSign * altSign;
      });

      this.columnItems.forEach((col, c) => {
        const colEl = document.createElement('div');
        colEl.className = 'drift-wall__col';
        const track = document.createElement('div');
        track.className = 'drift-wall__track';
        colEl.appendChild(track);
        this.plane.appendChild(colEl);
        this.trackEls[c] = track;
      });

      this.containerHeight = this.container.clientHeight || 600;
      this._layoutColumns();

      this.container.addEventListener('pointermove', this._onPointerMove);
      this.container.addEventListener('pointerenter', this._onPointerEnter);
      this.container.addEventListener('pointerleave', this._onPointerLeave);

      this._applyPlaneTransform(0, 0);
    }

    _layoutColumns() {
      const o = this.opts;
      const unit = o.tileHeight + o.gap;
      this.columnMeta = this.columnItems.map((col) => {
        const copyHeight = Math.max(unit, col.length * unit);
        const copies = Math.max(2, Math.ceil((this.containerHeight * 1.6) / copyHeight) + 1);
        return { copyHeight, copies };
      });

      this.offsets = this.columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
      this.velocities = this.columnItems.map(() => 0);

      this.columnItems.forEach((col, c) => {
        const track = this.trackEls[c];
        const meta = this.columnMeta[c];
        track.innerHTML = '';
        for (let copyIndex = 0; copyIndex < meta.copies; copyIndex++) {
          col.forEach((item, itemIndex) => {
            track.appendChild(this._renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c));
          });
        }
      });
    }

    _renderTile(item, id, colIndex) {
      const isLink = !!item.href;
      const el = document.createElement(isLink ? 'a' : 'div');
      el.className = 'drift-wall__tile';
      el.dataset.tileId = id;
      el.dataset.col = String(colIndex);
      if (isLink) {
        el.href = item.href;
        el.target = '_blank';
        el.rel = 'noreferrer noopener';
      } else {
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', item.title || 'tile');
      }
      el.addEventListener('focus', () => this._activate(id, colIndex));
      el.addEventListener('blur', () => this._release());

      const inner = document.createElement('div');
      inner.className = 'drift-wall__inner';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      inner.appendChild(img);

      const overlay = document.createElement('div');
      overlay.className = 'drift-wall__overlay';

      el.appendChild(inner);
      el.appendChild(overlay);
      return el;
    }

    _activate(id, colIndex) {
      this.activeId = id;
      this.hoveredCol = colIndex;
      this._refreshActiveClasses();
    }
    _release() {
      this.activeId = null;
      this.hoveredCol = -1;
      this._refreshActiveClasses();
    }
    _refreshActiveClasses() {
      this.trackEls.forEach((track) => {
        track.querySelectorAll('.drift-wall__tile').forEach((tile) => {
          tile.classList.toggle('is-active', tile.dataset.tileId === this.activeId);
        });
      });
    }

    _applyPlaneTransform(px, py) {
      const o = this.opts;
      this.plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${o.tilt + py}deg) rotateY(${o.turn + px}deg) rotateZ(${o.roll}deg) ` +
        `translateZ(${-o.depth}px)`;
    }

    _handlePointerMove(e) {
      const o = this.opts;
      const rect = this.container.getBoundingClientRect();
      if (o.parallax > 0 && !this.reduced) {
        this.pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
        this.pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === this.activeId) return;
      this._activate(id, Number(tile.dataset.col));
    }

    _handlePointerLeave() {
      this.wallHovered = false;
      this.pointer = { x: 0, y: 0 };
      this._release();
    }

    _start() {
      const animate = (ts) => {
        if (this.lastTs === null) this.lastTs = ts;
        const dt = Math.min(0.05, Math.max(0, ts - this.lastTs) / 1000);
        this.lastTs = ts;
        const o = this.opts;

        const maxTilt = o.parallax * 8;
        const targetX = this.pointer.x * maxTilt;
        const targetY = -this.pointer.y * maxTilt;
        const damp = 1 - Math.exp(-dt / 0.12);
        this.pointerDamped.x += (targetX - this.pointerDamped.x) * damp;
        this.pointerDamped.y += (targetY - this.pointerDamped.y) * damp;
        this._applyPlaneTransform(this.pointerDamped.x, this.pointerDamped.y);

        if (!this.reduced) {
          for (let c = 0; c < this.trackEls.length; c++) {
            const meta = this.columnMeta[c];
            if (!meta) continue;
            const paused = this.wallHovered && o.pauseOnHover;
            const factor = paused || this.hoveredCol === c ? 0 : 1;
            const target = this.baseVelocities[c] * factor;
            const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
            this.velocities[c] += (target - this.velocities[c]) * ease;
            let next = (this.offsets[c] || 0) + this.velocities[c] * dt;
            next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
            this.offsets[c] = next;
            const el = this.trackEls[c];
            if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
          }
        } else {
          for (let c = 0; c < this.trackEls.length; c++) {
            const el = this.trackEls[c];
            const meta = this.columnMeta[c];
            if (el && meta) el.style.transform = `translate3d(0, ${-(this.offsets[c] || 0)}px, 0)`;
          }
        }
        this.rafId = requestAnimationFrame(animate);
      };
      this.rafId = requestAnimationFrame(animate);
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this._ro.disconnect();
      this.container.removeEventListener('pointermove', this._onPointerMove);
      this.container.removeEventListener('pointerenter', this._onPointerEnter);
      this.container.removeEventListener('pointerleave', this._onPointerLeave);
    }
  }

  function initDriftWall() {
    const driftContainer = document.getElementById('driftWall');
    if (!driftContainer) return;
    const items = [
      { image: 'img/1.png', title: 'Kegiatan 1' },
      { image: 'img/2.png', title: 'Kegiatan 2' },
      { image: 'img/3.png', title: 'Kegiatan 3' },
      { image: 'img/4.png', title: 'Kegiatan 4' },
      { image: 'img/5.png', title: 'Kegiatan 5' },
      { image: 'img/6.png', title: 'Kegiatan 6' },
      { image: 'img/7.png', title: 'Kegiatan 7' },
      { image: 'img/8.png', title: 'Kegiatan 8' },
      { image: 'img/9.png', title: 'Kegiatan 9' },
      { image: 'img/10.png', title: 'Kegiatan 10' }
    ];
    new DriftWall(driftContainer, {
      items,
      columns: 5,
      tileWidth: 200,
      tileHeight: 132,
      gap: 20,
      tilt: 16,
      turn: -5,
      perspective: 1200,
      depth: 120,
      speed: 22,
      direction: 'up',
      variance: 0.45,
      parallax: 0.6,
      lift: 64,
      fade: 0.6,
      dim: 0.55,
      overlayColor: '#f4f7fb',
      radius: 14,
      pauseOnHover: false,
      grayscale: false
    });
  }

  /* ============================================================
     CERITA KAMI — reveal each overlapping panel as it becomes
     the active sticky one
     ============================================================ */
  function initCeritaReveal() {
    const ceritaPanels = document.querySelectorAll('.cerita__panel');
    if (!ceritaPanels.length) return;
    const ceritaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-active');
        });
      },
      { threshold: 0.15 }
    );
    ceritaPanels.forEach((panel) => ceritaObserver.observe(panel));
  }

  /* ============================================================
     DIVISI — flip cards (tap support for touch devices)
     ============================================================ */
  function initDivisiFlipCards() {
    document.querySelectorAll('.divisi-card').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      });
    });
  }

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDriftWall();
    initCeritaReveal();
    initDivisiFlipCards();
    initFooterYear();
  });
})();