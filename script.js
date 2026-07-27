(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const loader = document.getElementById("loader");
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  body.classList.add("loading");
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("done");
      body.classList.remove("loading");
    }, reducedMotion ? 0 : 1050);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  const cairoTime = document.getElementById("cairoTime");
  const updateCairoTime = () => {
    if (!cairoTime) return;
    cairoTime.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Cairo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  };
  updateCairoTime();
  window.setInterval(updateCairoTime, 1000);

  const toggleMenu = (open) => {
    menuButton.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    body.style.overflow = open ? "hidden" : "";
  };

  menuButton.addEventListener("click", () => {
    toggleMenu(!mobileMenu.classList.contains("open"));
  });
  mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => toggleMenu(false)));

  if (!reducedMotion) {
    document.addEventListener("pointerdown", (event) => {
      if (!event.target.closest("a, button")) return;
      const ripple = document.createElement("span");
      ripple.className = "motion-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
  }

  const teaSignature = document.querySelector(".tea-signature");
  teaSignature?.addEventListener("click", () => {
    teaSignature.classList.remove("is-brewing");
    void teaSignature.offsetWidth;
    teaSignature.classList.add("is-brewing");
    window.setTimeout(() => teaSignature.classList.remove("is-brewing"), 950);
  });

  document.querySelector(".back-to-top")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (reducedMotion) {
      window.scrollTo(0, 0);
      return;
    }
    const start = window.scrollY;
    const startedAt = performance.now();
    const duration = 850;
    root.style.scrollBehavior = "auto";
    const scrollHome = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      window.scrollTo(0, start * (1 - eased));
      if (progress < 1) {
        requestAnimationFrame(scrollHome);
      } else {
        root.style.removeProperty("scroll-behavior");
      }
    };
    requestAnimationFrame(scrollHome);
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  const root = document.documentElement;
  const scrollHudValue = document.querySelector(".scroll-hud-value");
  const scrollHudLabel = document.querySelector(".scroll-hud-label");
  const heroMain = document.querySelector(".hero-main");
  const heroStage = document.querySelector(".hero-stage");
  const projectVisuals = [...document.querySelectorAll(".project-visual")];
  const architectureModel = document.getElementById("architecture3D");
  const trackedSections = [...document.querySelectorAll("main > section")];
  const manifesto = document.getElementById("manifesto");
  const manifestoSticky = document.querySelector(".manifesto-sticky");
  const manifestoWords = [...document.querySelectorAll("[data-manifesto-word]")];
  const manifestoCube = document.querySelector(".manifesto-cube");
  const manifestoPhase = document.querySelector(".manifesto-topline b");
  const velocityReadout = document.querySelector("[data-velocity-readout]");
  let scrollY = window.scrollY;
  let smoothScrollY = scrollY;
  let lastScrollY = scrollY;
  let targetVelocity = 0;
  let smoothVelocity = 0;
  let scrollFrame;
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  if (!reducedMotion) body.classList.add("motion-active");

  const renderScrollChoreography = () => {
    smoothScrollY += (scrollY - smoothScrollY) * 0.1;
    smoothVelocity += (targetVelocity - smoothVelocity) * 0.16;
    targetVelocity *= 0.83;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(smoothScrollY / maxScroll, 1);
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    root.style.setProperty("--scroll-velocity", (smoothVelocity / 60).toFixed(4));
    if (scrollHudValue) scrollHudValue.textContent = `${String(Math.round(progress * 100)).padStart(3, "0")}%`;

    let activeSection = 0;
    trackedSections.forEach((section, index) => {
      if (smoothScrollY + window.innerHeight * 0.48 >= section.offsetTop) activeSection = index;
    });
    if (scrollHudLabel) scrollHudLabel.textContent = `SYSTEM / ${String(activeSection).padStart(2, "0")}`;

    if (!reducedMotion) {
      const heroProgress = Math.min(smoothScrollY / Math.max(window.innerHeight, 1), 1.25);
      if (heroMain) {
        heroMain.style.transform = `translate3d(0, ${heroProgress * 38}px, 0)`;
        heroMain.style.opacity = String(Math.max(1 - heroProgress * 0.68, 0));
      }
      if (heroStage) heroStage.style.setProperty("--hero-scroll", heroProgress.toFixed(3));

      projectVisuals.forEach((visual, index) => {
        const rect = visual.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const shift = Math.max(-1, Math.min(1, centerOffset)) * (index % 2 ? -22 : 22);
        visual.style.transform = `perspective(1300px) translate3d(0, ${shift}px, 0) rotateX(${centerOffset * -1.5}deg)`;
      });

      if (architectureModel) {
        const rect = architectureModel.getBoundingClientRect();
        const local = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight));
        architectureModel.style.setProperty("--lab-y", `${local * -3.5}deg`);
      }

      if (manifesto && manifestoSticky) {
        const range = Math.max(manifesto.offsetHeight - window.innerHeight, 1);
        const sceneProgress = clamp((smoothScrollY - manifesto.offsetTop) / range);
        manifestoSticky.style.setProperty("--manifesto-progress", sceneProgress.toFixed(4));

        manifestoWords.forEach((word, index) => {
          const enterStart = index * 0.22 - 0.05;
          const enter = clamp((sceneProgress - enterStart) / 0.24);
          const exit = index < manifestoWords.length - 1
            ? clamp((sceneProgress - (enterStart + 0.48)) / 0.18)
            : 0;
          const translateY = (1 - enter) * 105 - exit * 24;
          const translateZ = (1 - enter) * -300 + exit * 65;
          const rotateX = (1 - enter) * -17 + smoothVelocity * 0.025;
          const scale = 0.76 + enter * 0.24 - exit * 0.025;
          word.style.opacity = String(clamp(enter * (1 - exit * 0.48)));
          word.style.filter = `blur(${((1 - enter) * 12 + exit * 2.5).toFixed(2)}px)`;
          word.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, ${translateZ.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        });

        if (manifestoCube) {
          const cubeX = -16 + sceneProgress * 185 - smoothVelocity * 0.11;
          const cubeY = 24 + sceneProgress * 390 + smoothVelocity * 0.16;
          manifestoCube.style.setProperty("--cube-x", `${cubeX.toFixed(2)}deg`);
          manifestoCube.style.setProperty("--cube-y", `${cubeY.toFixed(2)}deg`);
        }
        if (manifestoPhase) manifestoPhase.textContent = `${String(Math.min(3, Math.floor(sceneProgress * 3) + 1)).padStart(2, "0")} / 03`;
        if (velocityReadout) {
          const velocity = smoothVelocity / 10;
          velocityReadout.textContent = `${velocity >= 0 ? "+" : ""}${velocity.toFixed(2)}`;
        }
      }
    }

    if (Math.abs(scrollY - smoothScrollY) > 0.1 || Math.abs(smoothVelocity) > 0.015 || Math.abs(targetVelocity) > 0.015) {
      scrollFrame = requestAnimationFrame(renderScrollChoreography);
    } else {
      cancelAnimationFrame(scrollFrame);
    }
  };

  window.addEventListener("scroll", () => {
    const nextScrollY = window.scrollY;
    targetVelocity = clamp(nextScrollY - lastScrollY, -60, 60);
    lastScrollY = nextScrollY;
    scrollY = nextScrollY;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(renderScrollChoreography);
  }, { passive: true });
  renderScrollChoreography();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -24px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const metrics = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const start = performance.now();
      const duration = 1200;
      const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        entry.target.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.7 });
  metrics.forEach((metric) => counterObserver.observe(metric));

  document.querySelectorAll(".project").forEach((project) => {
    project.style.setProperty("--project-accent", project.dataset.projectColor);
  });

  if (!reducedMotion && matchMedia("(pointer: fine)").matches) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let previousRingX = 0;
    let previousRingY = 0;
    let cursorStretch = 0;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;
    });

    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      const deltaX = ringX - previousRingX;
      const deltaY = ringY - previousRingY;
      const speed = Math.hypot(deltaX, deltaY);
      const targetStretch = Math.min(speed / 22, 0.38);
      cursorStretch += (targetStretch - cursorStretch) * 0.24;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      ring.style.transform = `translate(${ringX - ring.offsetWidth / 2}px, ${ringY - ring.offsetHeight / 2}px) rotate(${angle.toFixed(2)}deg) scale(${(1 + cursorStretch).toFixed(3)}, ${(1 - cursorStretch * 0.18).toFixed(3)})`;
      previousRingX = ringX;
      previousRingY = ringY;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    document.querySelectorAll("a, button, [data-tilt]").forEach((element) => {
      element.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      element.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });

    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.12}px, ${y * 0.15}px)`;
      });
      element.addEventListener("mouseleave", () => {
        element.style.transform = "translate(0, 0)";
      });
    });

    const springTilts = [];
    const initializeSpringTilt = (selector, intensity, perspective, lift) => {
      document.querySelectorAll(selector).forEach((element) => {
        const state = {
          element,
          intensity,
          perspective,
          lift,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          targetX: 0,
          targetY: 0,
          active: false,
          running: false,
          media: element.querySelector(".vault-media img")
        };

        element.addEventListener("mousemove", (event) => {
          const rect = element.getBoundingClientRect();
          state.targetX = ((event.clientY - rect.top) / rect.height - 0.5) * -intensity;
          state.targetY = ((event.clientX - rect.left) / rect.width - 0.5) * intensity;
          state.active = true;
          state.running = true;
        });
        element.addEventListener("mouseleave", () => {
          state.targetX = 0;
          state.targetY = 0;
          state.active = false;
          state.running = true;
        });
        springTilts.push(state);
      });
    };

    initializeSpringTilt("[data-tilt]", 4.5, 900, 2);
    initializeSpringTilt("[data-depth-card]", 6, 1100, 10);

    const renderSpringTilts = () => {
      springTilts.forEach((state) => {
        if (!state.running) return;
        state.vx = (state.vx + (state.targetX - state.x) * 0.085) * 0.74;
        state.vy = (state.vy + (state.targetY - state.y) * 0.085) * 0.74;
        state.x += state.vx;
        state.y += state.vy;
        const elevation = state.active ? state.lift : 0;
        state.element.style.transform = `perspective(${state.perspective}px) rotateX(${state.x.toFixed(3)}deg) rotateY(${state.y.toFixed(3)}deg) translateZ(${elevation}px)`;
        if (state.media) {
          state.media.style.transform = `translate3d(${(state.y * 1.25).toFixed(2)}px, ${(state.x * -1.25).toFixed(2)}px, 22px) scale(1.065)`;
        }

        const settled = !state.active
          && Math.abs(state.x) < 0.01
          && Math.abs(state.y) < 0.01
          && Math.abs(state.vx) < 0.01
          && Math.abs(state.vy) < 0.01;
        if (settled) {
          state.x = 0;
          state.y = 0;
          state.running = false;
          state.element.style.removeProperty("transform");
          state.media?.style.removeProperty("transform");
        }
      });
      requestAnimationFrame(renderSpringTilts);
    };
    renderSpringTilts();

    if (architectureModel) {
      architectureModel.addEventListener("mousemove", (event) => {
        const rect = architectureModel.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        architectureModel.style.setProperty("--lab-x", `${x * 9}deg`);
        architectureModel.style.setProperty("--lab-y", `${y * -7}deg`);
      });
      architectureModel.addEventListener("mouseleave", () => {
        architectureModel.style.setProperty("--lab-x", "0deg");
        architectureModel.style.setProperty("--lab-y", "0deg");
      });
    }
  }

  const loopSteps = [...document.querySelectorAll(".loop-step")];
  let activeLoop = 0;
  if (!reducedMotion && loopSteps.length) {
    window.setInterval(() => {
      loopSteps[activeLoop].classList.remove("active");
      activeLoop = (activeLoop + 1) % loopSteps.length;
      loopSteps[activeLoop].classList.add("active");
    }, 2200);
  }
  loopSteps.forEach((step, index) => {
    step.addEventListener("mouseenter", () => {
      loopSteps.forEach((item) => item.classList.remove("active"));
      activeLoop = index;
      step.classList.add("active");
    });
  });

  const testimonials = [
    {
      quote: "Muhammad understood our requirements and delivered exactly what we needed. The site represents our brand well and has helped us attract new clients.",
      author: "Obelisk Solutions",
      role: "International Consulting Firm"
    },
    {
      quote: "He created a beautiful, professional site that showcases my work perfectly. The Arabic content displays correctly and the platform is easy to update.",
      author: "Prof. Amal Kamal",
      role: "Vice Dean for Graduate Studies"
    },
    {
      quote: "He made launching our online business simple, built the complete store, and taught us how to operate it. Customers can easily find exactly what they need.",
      author: "Sarah Ahmed",
      role: "Business Owner, Mamlakty"
    }
  ];

  let quoteIndex = 0;
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const quoteRole = document.getElementById("quoteRole");
  const quoteCounter = document.getElementById("quoteIndex");

  const showQuote = (index) => {
    quoteText.classList.add("changing");
    window.setTimeout(() => {
      const testimonial = testimonials[index];
      quoteText.textContent = testimonial.quote;
      quoteAuthor.textContent = testimonial.author;
      quoteRole.textContent = testimonial.role;
      quoteCounter.textContent = String(index + 1).padStart(2, "0");
      quoteText.classList.remove("changing");
    }, reducedMotion ? 0 : 220);
  };

  document.getElementById("quoteNext").addEventListener("click", () => {
    quoteIndex = (quoteIndex + 1) % testimonials.length;
    showQuote(quoteIndex);
  });
  document.getElementById("quotePrev").addEventListener("click", () => {
    quoteIndex = (quoteIndex - 1 + testimonials.length) % testimonials.length;
    showQuote(quoteIndex);
  });

  const initializeHero3D = () => {
    const stage = document.querySelector(".hero-stage");
    const heroCanvas = document.getElementById("hero3DCanvas");
    if (!stage || !heroCanvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const system = new THREE.Group();
    system.position.set(-0.42, 0.38, 0);
    system.scale.setScalar(0.92);
    scene.add(system);

    const coreGeometry = new THREE.IcosahedronGeometry(1.12, 2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0b2b22,
      emissive: 0x123d31,
      emissiveIntensity: 0.48,
      roughness: 0.32,
      metalness: 0.65,
      transparent: true,
      opacity: 0.82,
      wireframe: false
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    system.add(core);

    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 36, 36),
      new THREE.MeshPhysicalMaterial({
        color: 0x6cf5c2,
        emissive: 0x6cf5c2,
        emissiveIntensity: 1.25,
        roughness: 0.18,
        metalness: 0.35,
        transparent: true,
        opacity: 0.78
      })
    );
    system.add(innerCore);

    const coreCage = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.76, 1),
      new THREE.MeshBasicMaterial({
        color: 0xd9ff47,
        wireframe: true,
        transparent: true,
        opacity: 0.32
      })
    );
    system.add(coreCage);

    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(1.36, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x6cf5c2,
        transparent: true,
        opacity: 0.075,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    system.add(coreGlow);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x6cf5c2,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireCore = new THREE.Mesh(new THREE.IcosahedronGeometry(1.19, 2), wireMaterial);
    system.add(wireCore);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.72, 0.018, 160, 12, 3, 5),
      new THREE.MeshBasicMaterial({ color: 0x6cf5c2, transparent: true, opacity: 0.62 })
    );
    knot.rotation.x = Math.PI * 0.35;
    system.add(knot);

    const ringOne = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.008, 6, 180),
      new THREE.MeshBasicMaterial({ color: 0x6cf5c2, transparent: true, opacity: 0.38 })
    );
    ringOne.rotation.set(1.05, 0.25, 0.1);
    system.add(ringOne);

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.006, 6, 180),
      new THREE.MeshBasicMaterial({ color: 0x8eb9ff, transparent: true, opacity: 0.2 })
    );
    ringTwo.rotation.set(0.15, 1.16, 0.42);
    system.add(ringTwo);

    const satelliteGeometry = new THREE.OctahedronGeometry(0.1, 0);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xd9ff47, wireframe: true });
    const satellites = new THREE.Group();
    for (let index = 0; index < 9; index += 1) {
      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      const angle = (index / 9) * Math.PI * 2;
      const radius = 2.1 + (index % 3) * 0.18;
      satellite.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.3) * 1.35, Math.sin(angle) * radius);
      satellite.scale.setScalar(0.65 + (index % 3) * 0.2);
      satellites.add(satellite);
    }
    system.add(satellites);

    const connectionPositions = [];
    satellites.children.forEach((satellite, index) => {
      const next = satellites.children[(index + 1) % satellites.children.length];
      connectionPositions.push(
        satellite.position.x, satellite.position.y, satellite.position.z,
        next.position.x, next.position.y, next.position.z
      );
    });
    const connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute("position", new THREE.Float32BufferAttribute(connectionPositions, 3));
    const connections = new THREE.LineSegments(
      connectionGeometry,
      new THREE.LineBasicMaterial({ color: 0x6cf5c2, transparent: true, opacity: 0.13 })
    );
    satellites.add(connections);

    const modules = new THREE.Group();
    const moduleGeometry = new THREE.PlaneGeometry(0.72, 0.42);
    for (let index = 0; index < 6; index += 1) {
      const angle = (index / 6) * Math.PI * 2;
      const module = new THREE.Group();
      const panel = new THREE.Mesh(
        moduleGeometry,
        new THREE.MeshBasicMaterial({
          color: index % 2 ? 0x8eb9ff : 0x6cf5c2,
          transparent: true,
          opacity: 0.055,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(moduleGeometry),
        new THREE.LineBasicMaterial({
          color: index % 2 ? 0x8eb9ff : 0x6cf5c2,
          transparent: true,
          opacity: 0.48
        })
      );
      const node = new THREE.Mesh(
        new THREE.CircleGeometry(0.025, 12),
        new THREE.MeshBasicMaterial({ color: 0xd9ff47, side: THREE.DoubleSide })
      );
      node.position.set(0.27, 0.13, 0.012);
      module.add(panel, edges, node);
      module.position.set(Math.cos(angle) * 2.8, Math.sin(angle * 1.4) * 1.55, Math.sin(angle) * 1.8);
      module.lookAt(0, 0, 0);
      module.userData.baseY = module.position.y;
      module.userData.phase = index * 0.75;
      modules.add(module);
    }
    system.add(modules);

    const particleCount = window.innerWidth < 700 ? 220 : 420;
    const positions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const radius = 2.4 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x6cf5c2, size: 0.018, transparent: true, opacity: 0.58 })
    );
    system.add(particles);

    scene.add(new THREE.AmbientLight(0x6cf5c2, 0.72));
    const light = new THREE.PointLight(0x6cf5c2, 2.4, 20);
    light.position.set(3, 3, 5);
    scene.add(light);
    const blueLight = new THREE.PointLight(0x5d8cff, 1.4, 15);
    blueLight.position.set(-4, -2, 3);
    scene.add(blueLight);

    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let heroVisible = true;

    stage.addEventListener("mousemove", (event) => {
      const rect = stage.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.9;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.7;
    });
    stage.addEventListener("mouseleave", () => {
      pointerX = 0;
      pointerY = 0;
    });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
    }, { rootMargin: "200px" });
    visibilityObserver.observe(stage);

    const resize = () => {
      const canvasRect = heroCanvas.getBoundingClientRect();
      const width = Math.max(Math.round(canvasRect.width), 1);
      const height = Math.max(Math.round(canvasRect.height), 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (!heroVisible || document.hidden) return;
      const elapsed = clock.getElapsedTime();
      currentX += (pointerX - currentX) * 0.045;
      currentY += (pointerY - currentY) * 0.045;
      const scrollRotation = window.scrollY * 0.0014;
      system.rotation.y = elapsed * 0.1 + currentX + scrollRotation;
      system.rotation.x = currentY + Math.sin(elapsed * 0.35) * 0.08;
      wireCore.rotation.y = -elapsed * 0.16;
      wireCore.rotation.z = elapsed * 0.08;
      coreCage.rotation.x = elapsed * 0.2;
      coreCage.rotation.y = -elapsed * 0.26;
      knot.rotation.z = elapsed * 0.075 - scrollRotation * 0.5;
      ringOne.rotation.z = elapsed * 0.12;
      ringTwo.rotation.y = 1.16 - elapsed * 0.08;
      satellites.rotation.y = -elapsed * 0.11 - scrollRotation;
      connections.material.opacity = 0.1 + Math.sin(elapsed * 1.25) * 0.035;
      modules.rotation.y = elapsed * 0.055 + scrollRotation * 0.35;
      modules.children.forEach((module) => {
        module.position.y = module.userData.baseY + Math.sin(elapsed * 0.8 + module.userData.phase) * 0.08;
      });
      particles.rotation.y = elapsed * 0.018;
      core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.025);
      innerCore.scale.setScalar(1 + Math.sin(elapsed * 2.05) * 0.07);
      innerCore.material.opacity = 0.68 + Math.sin(elapsed * 2.05) * 0.1;
      coreGlow.scale.setScalar(1 + Math.sin(elapsed * 1.1) * 0.055);
      renderer.render(scene, camera);
    };

    resize();
    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }
    window.addEventListener("resize", resize);
  };

  initializeHero3D();

  const canvas = document.getElementById("networkCanvas");
  const context = canvas.getContext("2d");
  let points = [];
  let animationFrame;
  const networkPointer = { x: -1000, y: -1000, active: false };

  window.addEventListener("pointermove", (event) => {
    networkPointer.x = event.clientX;
    networkPointer.y = event.clientY;
    networkPointer.active = true;
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    networkPointer.active = false;
  });

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const pointCount = Math.min(42, Math.floor(window.innerWidth / 35));
    points = Array.from({ length: pointCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12
    }));
  };

  const drawNetwork = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    points.forEach((point, index) => {
      if (networkPointer.active) {
        const pointerX = point.x - networkPointer.x;
        const pointerY = point.y - networkPointer.y;
        const pointerDistance = Math.hypot(pointerX, pointerY);
        if (pointerDistance > 0 && pointerDistance < 145) {
          const force = (1 - pointerDistance / 145) * 0.015;
          point.vx += (pointerX / pointerDistance) * force;
          point.vy += (pointerY / pointerDistance) * force;
        }
      }
      point.vx *= 0.996;
      point.vy *= 0.996;
      point.vy -= smoothVelocity * 0.000015;
      const speed = Math.hypot(point.vx, point.vy);
      if (speed > 0.34) {
        point.vx = (point.vx / speed) * 0.34;
        point.vy = (point.vy / speed) * 0.34;
      }
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
      if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;

      context.beginPath();
      context.arc(point.x, point.y, 1.1, 0, Math.PI * 2);
      context.fillStyle = "rgba(108,245,194,.45)";
      context.fill();

      for (let next = index + 1; next < points.length; next += 1) {
        const other = points[next];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance < 135) {
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(108,245,194,${0.09 * (1 - distance / 135)})`;
          context.stroke();
        }
      }
    });
    animationFrame = requestAnimationFrame(drawNetwork);
  };

  resizeCanvas();
  if (!reducedMotion) drawNetwork();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resizeCanvas();
    if (!reducedMotion) drawNetwork();
  });
})();
