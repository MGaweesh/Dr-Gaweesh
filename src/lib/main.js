/* ═══════════════════════════════════════════════════════════════════
   MAIN — boot, theme, menu, pointer behaviour, small human touches
   ═══════════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const body = document.body;

  /* ═══ curtain ════════════════════════════════════════════════════ */
  const curtain = document.getElementById("curtain");
  let raised = false;
  const raise = () => {
    if (raised) return;
    raised = true;
    curtain?.classList.add("done");
    body.classList.remove("booting");
    dispatchEvent(new Event("mg:boot"));         // releases the reveals
  };
  addEventListener("load", () => setTimeout(raise, reduced ? 0 : 1150));
  setTimeout(raise, 4200);                       // never trap the page

  /* ═══ mobile drawer ══════════════════════════════════════════════ */
  const burger = document.getElementById("burger");
  const drawer = document.getElementById("drawer");
  const setDrawer = (open) => {
    burger?.classList.toggle("open", open);
    drawer?.classList.toggle("open", open);
    burger?.setAttribute("aria-expanded", String(open));
    body.classList.toggle("is-locked", open);
  };
  burger?.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
  drawer?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

  /* ═══ Cairo clock + a line that knows what time it is ════════════ */
  const cairo = (opts) => new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo", hour12: false, ...opts
  }).format(new Date());

  const cairoDisplay = (opts) => new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo", hour12: true, ...opts
  }).format(new Date());

  const say = (h) => {
    if (h >= 5 && h < 12)  return "and the tea's on";
    if (h >= 12 && h < 17) return "and I'm deep in something";
    if (h >= 17 && h < 22) return "and these are the good hours";
    return "and I'm probably still up";
  };

  const greeting = document.querySelector("[data-greeting]");
  if (greeting) {
    const hour = Number(cairo({ hour: "2-digit" }));
    greeting.innerHTML = `it's <span data-clock>--:--</span>, ${say(hour)}`;
  }

  /* re-queried each tick so the rewritten greeting node stays live */
  const tickClock = () => {
    const t = cairoDisplay({ hour: "numeric", minute: "2-digit" });
    document.querySelectorAll("[data-clock]").forEach((el) => { el.textContent = t; });
  };
  tickClock();
  setInterval(tickClock, 20000);

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ═══ testimonials ═══════════════════════════════════════════════ */
  const says = [
    {
      quote: "Muhammad understood our requirements and delivered exactly what we needed. The site represents our brand well and has helped us attract new clients.",
      who: "Obelisk Solutions",
      role: "International consulting firm"
    },
    {
      quote: "He created a beautiful, professional site that showcases my work perfectly. The Arabic content displays correctly and the platform is easy to update.",
      who: "Prof. Amal Kamal",
      role: "Vice Dean for Graduate Studies"
    },
    {
      quote: "He made launching our online business simple, built the complete store, and taught us how to operate it. Customers find exactly what they need.",
      who: "Sarah Ahmed",
      role: "Business owner, Mamlakty"
    }
  ];

  const qText = document.getElementById("quoteText");
  const qWho = document.getElementById("quoteAuthor");
  const qRole = document.getElementById("quoteRole");
  const qNum = document.getElementById("quoteIndex");
  let qi = 0;

  const showQuote = (i) => {
    if (!qText) return;
    qText.classList.add("swap");
    setTimeout(() => {
      const s = says[i];
      qText.textContent = s.quote;
      qWho.textContent = s.who;
      qRole.textContent = s.role;
      qNum.textContent = String(i + 1).padStart(2, "0");
      qText.classList.remove("swap");
    }, reduced ? 0 : 260);
  };

  document.getElementById("quoteNext")?.addEventListener("click", () => {
    qi = (qi + 1) % says.length;
    showQuote(qi);
  });
  document.getElementById("quotePrev")?.addEventListener("click", () => {
    qi = (qi - 1 + says.length) % says.length;
    showQuote(qi);
  });

  /* ═══ pointer behaviour (fine pointers only) ═════════════════════ */
  if (fine && !reduced) {
    /* — cursor — */
    const cursor = document.querySelector(".cursor");
    const cLabel = cursor?.querySelector(".cursor-label");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;

    addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor?.classList.add("on");
    }, { passive: true });
    document.addEventListener("mouseleave", () => cursor?.classList.remove("on"));

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor?.classList.add("wide");
        if (cLabel) cLabel.textContent = el.dataset.cursor;
      });
      el.addEventListener("mouseleave", () => {
        cursor?.classList.remove("wide");
        if (cLabel) cLabel.textContent = "";
      });
    });

    /* — magnetic buttons — */
    const magnets = [...document.querySelectorAll("[data-magnetic]")].map((el) => ({
      el, x: 0, y: 0, tx: 0, ty: 0
    }));
    magnets.forEach((m) => {
      m.el.addEventListener("pointermove", (e) => {
        const r = m.el.getBoundingClientRect();
        m.tx = (e.clientX - r.left - r.width / 2) * 0.28;
        m.ty = (e.clientY - r.top - r.height / 2) * 0.42;
      });
      m.el.addEventListener("pointerleave", () => { m.tx = 0; m.ty = 0; });
    });

    /* — spring tilt on framed things — */
    const tilts = [...document.querySelectorAll("[data-tilt]")].map((el) => ({
      el, rx: 0, ry: 0, tx: 0, ty: 0, live: false,
      base: el.dataset.tiltBase || ""            // keeps hand-placed rotations
    }));
    tilts.forEach((t) => {
      t.el.addEventListener("pointermove", (e) => {
        const r = t.el.getBoundingClientRect();
        t.tx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        t.ty = ((e.clientX - r.left) / r.width - 0.5) * 7;
        t.live = true;
      });
      t.el.addEventListener("pointerleave", () => { t.tx = 0; t.ty = 0; t.live = false; });
    });

    const ease = (a, b, t) => a + (b - a) * t;

    const pointerLoop = () => {
      requestAnimationFrame(pointerLoop);

      cx = ease(cx, mx, 0.19);
      cy = ease(cy, my, 0.19);
      if (cursor) cursor.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

      magnets.forEach((m) => {
        m.x = ease(m.x, m.tx, 0.16);
        m.y = ease(m.y, m.ty, 0.16);
        m.el.style.transform = Math.abs(m.x) + Math.abs(m.y) < 0.05
          ? ""
          : `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
      });

      tilts.forEach((t) => {
        t.rx = ease(t.rx, t.tx, 0.1);
        t.ry = ease(t.ry, t.ty, 0.1);
        if (!t.live && Math.abs(t.rx) + Math.abs(t.ry) < 0.02) {
          t.el.style.transform = "";               // falls back to the stylesheet
          return;
        }
        t.el.style.transform =
          `perspective(1100px) ${t.base} rotateX(${t.rx.toFixed(3)}deg) rotateY(${t.ry.toFixed(3)}deg)`;
      });
    };
    pointerLoop();
  }
})();
