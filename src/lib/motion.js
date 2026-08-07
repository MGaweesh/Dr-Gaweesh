/* ═══════════════════════════════════════════════════════════════════
   MOTION — the scroll engine
   One rAF loop drives everything. Nothing here uses a library.

   Behaviours, in order down the page:
     1. smoothed scrolling (virtual target → window.scrollTo, so
        position:sticky keeps working natively)
     2. entrance reveals (masked lines, lifts, staggered blocks)
     3. count-up tallies
     4. a belt that speeds up, slows and flips with your scroll
     5. sticky card stack that squashes as it gets buried
     6. horizontal rail driven by vertical scroll
     7. pinned narrative with a bead travelling an SVG path
     8. parallax inside image frames
     9. header state + current-section nav
   ═══════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  /* ═══ 1. smoothed scrolling ═══════════════════════════════════════
     Lerps a virtual target into the real scroll position each frame.
     Native scrolling stays authoritative, so sticky/anchors/find-in-page
     all behave — it only softens the wheel.
     ═════════════════════════════════════════════════════════════════ */
  const smooth = {
    on: !reduced && matchMedia("(pointer: fine)").matches,
    target: window.scrollY,
    current: window.scrollY,
    velocity: 0
  };

  const limit = () => Math.max(document.documentElement.scrollHeight - innerHeight, 0);

  if (smooth.on) {
    document.documentElement.classList.add("lenis-on");

    addEventListener("wheel", (e) => {
      if (e.ctrlKey) return;                       // let the browser zoom
      if (document.body.classList.contains("is-locked")) { e.preventDefault(); return; }
      if (e.target.closest?.("[data-native-scroll]")) return;
      e.preventDefault();
      const step = e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? innerHeight : 1;
      smooth.target = clamp(smooth.target + e.deltaY * step, 0, limit());
    }, { passive: false });

    /* keyboard + anchors + anything else that moves the page natively */
    const resync = () => {
      if (Math.abs(window.scrollY - smooth.current) > 6) {
        smooth.target = window.scrollY;
        smooth.current = window.scrollY;
      }
    };
    addEventListener("keydown", () => requestAnimationFrame(resync));
    addEventListener("touchstart", resync, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const dest = document.querySelector(id);
        if (!dest) return;
        e.preventDefault();
        smooth.target = clamp(docTop(dest) - (id === "#top" ? 0 : 72), 0, limit());
        history.replaceState(null, "", id);
      });
    });
  }

  /* ═══ 2. reveals ═════════════════════════════════════════════════
     Held until the intro curtain is out of the way, otherwise the hero
     would finish animating behind it and appear already-arrived.
     ═════════════════════════════════════════════════════════════════ */
  const watched = document.querySelectorAll(
    "[data-lift], [data-mask], [data-reveal], .pen, .head, .archive-head, .contact-inner"
  );

  let revealsLive = false;
  const startReveals = () => {
    if (revealsLive) return;
    revealsLive = true;
    if (!("IntersectionObserver" in window)) {
      watched.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.querySelectorAll?.(".pen, .kicker").forEach((n) => n.classList.add("in"));
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    watched.forEach((el) => io.observe(el));
  };

  if (document.body.classList.contains("booting")) {
    addEventListener("mg:boot", startReveals, { once: true });
    setTimeout(startReveals, 4600);              // fallback: never stall
  } else {
    startReveals();
  }

  /* ═══ 3. tallies ═════════════════════════════════════════════════ */
  const tallies = document.querySelectorAll("[data-count]");
  if (tallies.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const to = Number(el.dataset.count);
        const started = performance.now();
        const run = (now) => {
          const p = clamp((now - started) / 1400);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    tallies.forEach((el) => io.observe(el));
  }

  /* ═══ 4. the belt ════════════════════════════════════════════════ */
  const belt = document.querySelector("[data-belt]");
  let beltX = 0;
  let beltSpan = 0;
  if (belt) {
    belt.innerHTML += belt.innerHTML;               // seamless loop
    const measure = () => { beltSpan = belt.scrollWidth / 2; };
    measure();
    addEventListener("resize", measure);
    if (document.fonts) document.fonts.ready.then(measure);
  }

  /* ═══ 5. sticky stack ════════════════════════════════════════════ */
  const cases = [...document.querySelectorAll(".case")];

  /* ═══ 6. horizontal rail ═════════════════════════════════════════ */
  const archive = document.querySelector(".archive");
  const rail = document.querySelector("[data-rail-track]");
  const railBar = document.querySelector("[data-rail]");
  let railX = 0;

  /* The section's height is what converts vertical scroll into sideways
     travel, so derive it from the rail's real width instead of hard-coding
     a vh value — add or remove a card and the pacing stays ~1:1. */
  const sizeArchive = () => {
    if (!archive || !rail || reduced) return;
    const travel = Math.max(rail.scrollWidth - innerWidth, 0);
    archive.style.height = `${Math.round(innerHeight + travel + innerHeight * 0.15)}px`;
    window.__scene?.buildTimeline?.();   // its stage map depends on this height
  };
  sizeArchive();
  addEventListener("resize", sizeArchive);
  addEventListener("load", sizeArchive);
  if (document.fonts) document.fonts.ready.then(sizeArchive);

  /* ═══ 7. pinned narrative ════════════════════════════════════════ */
  const approach = document.querySelector(".approach");
  const steps = [...document.querySelectorAll("[data-step]")];
  const stepNo = document.querySelector("[data-step-no]");
  const threadLine = document.querySelector(".thread-line");
  const threadBead = document.querySelector(".thread-bead");
  const threadLen = threadLine?.getTotalLength?.() ?? 0;
  let liveStep = -1;

  /* ═══ 8. parallax ════════════════════════════════════════════════ */
  const floats = [...document.querySelectorAll("[data-parallax]")];

  /* ═══ 9. header ══════════════════════════════════════════════════ */
  const header = document.getElementById("header");
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  let lastY = window.scrollY;

  /* ═══ the loop ═══════════════════════════════════════════════════ */
  let raf;

  const tick = () => {
    raf = requestAnimationFrame(tick);

    /* — scroll position —
       After our own scrollTo, scrollY tracks smooth.current. So if they
       have drifted apart at the top of a frame, something else moved the
       page (find-in-page, scroll restoration, a script) and we adopt it
       instead of yanking the reader back. */
    if (smooth.on) {
      if (Math.abs(window.scrollY - smooth.current) > 3) {
        smooth.current = window.scrollY;
        smooth.target = window.scrollY;
      }
      smooth.target = clamp(smooth.target, 0, limit());
      const next = lerp(smooth.current, smooth.target, 0.105);
      smooth.velocity = next - smooth.current;
      smooth.current = next;
      if (Math.abs(smooth.target - smooth.current) > 0.06) {
        window.scrollTo(0, smooth.current);
      } else {
        smooth.current = smooth.target;
      }
    } else {
      smooth.velocity = window.scrollY - smooth.current;
      smooth.current = window.scrollY;
    }

    const y = window.scrollY;
    const vh = innerHeight;
    const v = smooth.velocity;

    /* — 4. belt: base drift, pushed by scroll, direction follows you —
       (JS transforms ignore CSS overrides, so honour the pref here) */
    if (belt && beltSpan && !reduced) {
      beltX -= 0.42 + v * 0.55;
      if (beltX <= -beltSpan) beltX += beltSpan;
      if (beltX > 0) beltX -= beltSpan;
      const skew = clamp(v * 0.16, -7, 7);
      belt.style.transform = `translate3d(${beltX.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
    }

    /* — 5. sticky stack: each card squashes as the next buries it —
       read every rect first, then write, so we don't thrash layout */
    if (cases.length > 1) {
      const tops = cases.map((c) => c.getBoundingClientRect().top);
      for (let i = 0; i < cases.length - 1; i += 1) {
        const el = cases[i];
        const squash = clamp(1 - (tops[i + 1] - tops[i] - 16) / Math.max(el.offsetHeight, 1));
        el.style.setProperty("--squash", squash.toFixed(3));
        el.dataset.buried = squash > 0.35 ? "1" : "0";
      }
    }

    /* — 6. rail: vertical scroll becomes horizontal travel — */
    if (archive && rail) {
      const start = docTop(archive);
      const span = Math.max(archive.offsetHeight - vh, 1);
      const p = clamp((y - start) / span);
      const travel = Math.max(rail.scrollWidth - innerWidth, 0);
      railX = lerp(railX, -p * travel, 0.14);
      rail.style.transform = `translate3d(${railX.toFixed(2)}px,0,0)`;
      if (railBar) railBar.style.transform = `scaleX(${p.toFixed(3)})`;
    }

    /* — 7. narrative: bands of scroll advance the step + the bead — */
    if (approach && steps.length) {
      const start = docTop(approach);
      const span = Math.max(approach.offsetHeight - vh, 1);
      const p = clamp((y - start) / span);
      const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));

      if (idx !== liveStep) {
        steps.forEach((s, i) => s.classList.toggle("on", i === idx));
        if (stepNo) stepNo.textContent = String(idx + 1).padStart(2, "0");
        liveStep = idx;
      }
      if (threadBead && threadLen) {
        const pt = threadLine.getPointAtLength(p * threadLen);
        threadBead.setAttribute("cx", pt.x);
        threadBead.setAttribute("cy", pt.y);
      }
    }

    /* — 8. parallax inside frames — */
    if (!reduced) floats.forEach((img) => {
      const r = img.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const off = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = `translate3d(0, ${(off * -7).toFixed(2)}%, 0)`;
    });

    /* — 9. header: shrink on scroll, hide on the way down — */
    if (header) {
      header.classList.toggle("stuck", y > 40);
      const goingDown = y > lastY + 2;
      header.classList.toggle("hidden", goingDown && y > vh * 0.9 && !document.body.classList.contains("is-locked"));
      lastY = y;

      let current = -1;
      sections.forEach((s, i) => {
        if (y + vh * 0.42 >= docTop(s)) current = i;
      });
      navLinks.forEach((a, i) => a.classList.toggle("current", i === current));
    }
  };

  tick();
  addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { lastY = window.scrollY; tick(); }
  });

  /* expose a little, for main.js and for stepping the loop by hand */
  window.__motion = {
    tick,
    scrollTo(px) {
      if (smooth.on) smooth.target = clamp(px, 0, limit());
      else window.scrollTo({ top: px, behavior: "smooth" });
    },
    get velocity() { return smooth.velocity; }
  };
})();
