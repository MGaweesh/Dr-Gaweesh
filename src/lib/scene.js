/* ═══════════════════════════════════════════════════════════════════
   SCENE — one field of points, six formations, the whole page long

   ~2,700 points live for the entire scroll. Where you are on the page
   decides what they become, and every position is solved in the vertex
   shader from (lattice slot, layer, index, seed, time):

     0  cloud       an unresolved drift                  — hero, at rest
     1  stack       four clean tiers of a full-stack     — hero resolved
     2  stream      a horizontal current                 — the sideways rail
     3  rings       four turning loops                   — the build loop
     4  sphere      a calm fibonacci shell               — about
     5  funnel      a spiral converging to one point     — contact

   Two formations are evaluated per vertex and blended, with a per-point
   stagger so the field reforms in a wave rather than snapping.
   ═══════════════════════════════════════════════════════════════════ */
import { Color, BufferGeometry, BufferAttribute, Vector3, Quaternion, ShaderMaterial, WebGLRenderer, Scene, PerspectiveCamera, Group, Points, Clock } from "three";

(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;

  const readVar = (name, fallback) => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return new Color(v || fallback);
  };

  /* ── the lattice every formation is derived from ───────────────── */
  const LAYERS = 4;
  const SIDE = window.innerWidth < 760 ? 16 : 26;
  const SPREAD = 3.1;
  const GAP = 0.62;
  const COUNT = LAYERS * SIDE * SIDE;

  const slot = new Float32Array(COUNT * 3);
  const aLayer = new Float32Array(COUNT);
  const aSeed = new Float32Array(COUNT);
  const aIndex = new Float32Array(COUNT);

  let n = 0;
  for (let l = 0; l < LAYERS; l += 1) {
    const y = (LAYERS - 1) / 2 * GAP - l * GAP;
    for (let i = 0; i < SIDE; i += 1) {
      for (let j = 0; j < SIDE; j += 1) {
        slot[n * 3]     = (i / (SIDE - 1) - 0.5) * SPREAD;
        slot[n * 3 + 1] = y;
        slot[n * 3 + 2] = (j / (SIDE - 1) - 0.5) * SPREAD;
        aLayer[n] = l;
        aSeed[n] = Math.random();
        aIndex[n] = n;
        n += 1;
      }
    }
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(slot, 3));
  geo.setAttribute("aLayer", new BufferAttribute(aLayer, 1));
  geo.setAttribute("aSeed", new BufferAttribute(aSeed, 1));
  geo.setAttribute("aIndex", new BufferAttribute(aIndex, 1));

  /* ── shaders ───────────────────────────────────────────────────── */
  const NOISE = /* glsl */`
    vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `;

  const VERT = /* glsl */`
    uniform float uTime;
    uniform float uFormA;
    uniform float uFormB;
    uniform float uBlend;
    uniform float uCount;
    uniform float uSize;
    uniform vec3  uPointer;
    uniform float uPointerOn;
    uniform float uWarmA;
    uniform float uWarmB;

    attribute float aLayer;
    attribute float aSeed;
    attribute float aIndex;

    varying float vWarm;
    varying float vAlpha;

    ${NOISE}

    /* xyz = position, w = a per-point fade (used where points recycle) */

    vec4 fCloud(vec3 s, float seed, float t){
      vec3 q = s * 0.42 + vec3(0.0, t * 0.05, 0.0);
      vec3 drift = vec3(
        snoise(q),
        snoise(q + vec3(31.7, 11.3, 4.2)),
        snoise(q + vec3(7.1, 43.9, 19.4))
      );
      float sw = t * 0.1 + seed * 6.2831;
      return vec4(s + drift * 1.85 + vec3(sin(sw), cos(sw * 0.7) * 0.6, cos(sw)) * 0.42, 1.0);
    }

    vec4 fStack(vec3 s, float t){
      vec3 p = s;
      p.y += sin(t * 0.55 + s.x * 1.1 + s.z * 0.8) * 0.035;
      return vec4(p, 1.0);
    }

    vec4 fStream(vec3 s, float seed, float t){
      /* points recycle left→right; fade at both ends hides the wrap */
      float k = fract(seed + t * 0.05);
      float x = k * 8.6 - 4.3;
      float y = s.y * 1.45 + sin(x * 0.7 + t * 0.5) * 0.3;
      float fade = smoothstep(0.0, 0.09, k) * smoothstep(1.0, 0.91, k);
      return vec4(x, y, s.z * 0.7, fade);
    }

    vec4 fRings(float layer, float seed, float t){
      float rad = 0.9 + layer * 0.44;
      float ang = seed * 6.2831 + t * (0.2 - layer * 0.032);
      float y = (layer - 1.5) * 0.24 + sin(ang * 3.0 + t) * 0.06;
      return vec4(cos(ang) * rad, y, sin(ang) * rad, 1.0);
    }

    vec4 fSphere(float idx, float count, float t){
      float i = idx + 0.5;
      float phi = acos(1.0 - 2.0 * i / count);
      float th = 3.883222077 * i + t * 0.05;
      float r = 1.8;
      return vec4(r * sin(phi) * cos(th), r * cos(phi), r * sin(phi) * sin(th), 1.0);
    }

    vec4 fFunnel(float seed, float t){
      float k = fract(seed * 1.7 + t * 0.075);
      float rad = (1.0 - k) * 2.0 + 0.03;
      float ang = seed * 41.0 + k * 8.5 + t * 0.35;
      float fade = smoothstep(0.0, 0.07, k) * smoothstep(1.0, 0.88, k);
      return vec4(cos(ang) * rad, 1.75 - k * 3.4, sin(ang) * rad, fade);
    }

    /* Branchless selection. Any conditionally-assigned result makes
       ANGLE's HLSL pass emit X4000 ("potentially uninitialized"), so the
       formations are weighted instead — one unconditional expression.
       id always arrives as a whole number, so exactly one weight is 1.
       Six evaluations per call sounds wasteful but only fCloud touches
       noise; the rest are trig, and this is 2.7k vertices. */
    vec4 formation(float id, vec3 s, float layer, float seed, float idx, float t){
      float w0 = step(abs(id - 0.0), 0.5);
      float w1 = step(abs(id - 1.0), 0.5);
      float w2 = step(abs(id - 2.0), 0.5);
      float w3 = step(abs(id - 3.0), 0.5);
      float w4 = step(abs(id - 4.0), 0.5);
      float w5 = step(abs(id - 5.0), 0.5);
      return fCloud(s, seed, t)          * w0
           + fStack(s, t)                * w1
           + fStream(s, seed, t)         * w2
           + fRings(layer, seed, t)      * w3
           + fSphere(idx, uCount, t)     * w4
           + fFunnel(seed, t)            * w5;
    }

    void main(){
      vec4 A = formation(uFormA, position, aLayer, aSeed, aIndex, uTime);
      vec4 B = formation(uFormB, position, aLayer, aSeed, aIndex, uTime);

      /* stagger so the field reforms as a wave, not a snap */
      float stag = aLayer / 3.0 * 0.55 + aSeed * 0.45;
      float bl = clamp(uBlend * 1.85 - stag * 0.85, 0.0, 1.0);
      bl = bl * bl * (3.0 - 2.0 * bl);

      vec3 p = mix(A.xyz, B.xyz, bl);
      float fade = mix(A.w, B.w, bl);
      vWarm = mix(uWarmA, uWarmB, bl);

      /* cursor pushes the field — proof it is live, not a loop */
      vec3 away = p - uPointer;
      float d = length(away);
      p += normalize(away + 0.0001) * uPointerOn * 0.5 * exp(-d * d * 0.6);

      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = uSize * mix(1.3, 0.85, 1.0 - vWarm) * (7.0 / -mv.z);
      vAlpha = mix(0.82, 0.42, vWarm) * fade;
      gl_Position = projectionMatrix * mv;
    }
  `;

  const FRAG = /* glsl */`
    uniform vec3  uInk;
    uniform vec3  uAccent;
    uniform float uPresence;

    varying float vWarm;
    varying float vAlpha;

    void main(){
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float mask = smoothstep(0.5, 0.12, d);
      vec3 col = mix(uInk, uAccent, vWarm * 0.85);
      gl_FragColor = vec4(col, mask * vAlpha * uPresence);
    }
  `;

  const uniforms = {
    uTime:      { value: 0 },
    uFormA:     { value: 0 },
    uFormB:     { value: 1 },
    uBlend:     { value: 0 },
    uCount:     { value: COUNT },
    uSize:      { value: 4 },
    uPointer:   { value: new Vector3(999, 999, 999) },
    uPointerOn: { value: 0 },
    uWarmA:     { value: 1 },
    uWarmB:     { value: 0 },
    uPresence:  { value: 1 },
    uInk:       { value: readVar("--ink", "#17140f") },
    uAccent:    { value: readVar("--accent", "#c34f22") }
  };

  const material = new ShaderMaterial({
    uniforms, vertexShader: VERT, fragmentShader: FRAG,
    transparent: true, depthTest: false, depthWrite: false
  });

  /* antialias is redundant here — every point is already self-masked by
     the frag shader's smoothstep circle, so MSAA only adds GPU cost with
     no visible gain. Pixel ratio is capped lower on touch devices, which
     are usually the ones paying for it in battery, not visible softness
     at this point size. low-power hints the browser off the discrete GPU
     where the OS has one, since this is a decorative background layer. */
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);
  const rig = new Group();
  rig.add(new Points(geo, material));
  scene.add(rig);

  /* ── per-formation look: warmth, presence, where it sits on screen ──
     x is in world units; negative is left of centre. Presence is how
     loudly the field reads behind that section's text.               */
  const LOOK = [
    //                                                    rx = tilt, so each
    //                                                    shape reads properly
    { warm: 1.00, presence: 1.00, x:  1.50, y:  0.10, rx: 0.38 },  // 0 cloud
    { warm: 0.00, presence: 0.92, x:  1.50, y:  0.10, rx: 0.42 },  // 1 stack — tiers need tilt
    { warm: 0.45, presence: 0.62, x:  0.00, y: -0.10, rx: 0.16 },  // 2 stream — near side-on
    { warm: 0.28, presence: 0.78, x: -1.35, y:  0.00, rx: 0.85 },  // 3 rings — steep, or they flatten
    { warm: 0.15, presence: 0.26, x:  1.55, y:  0.05, rx: 0.20 },  // 4 sphere — quiet behind text
    { warm: 0.65, presence: 0.95, x:  1.30, y: -0.05, rx: 0.12 }   // 5 funnel — side-on cone
  ];

  /* ── the scroll → stage timeline ───────────────────────────────── */
  const el = (s) => document.querySelector(s);
  const docTop = (node) => node.getBoundingClientRect().top + window.scrollY;

  let stops = [];
  const buildTimeline = () => {
    const vh = innerHeight;
    const work = el(".work"), archive = el(".archive");
    const approach = el(".approach"), about = el(".about"), contact = el(".contact");
    if (!work || !archive || !approach || !about || !contact) return;

    const archTop = docTop(archive);
    const archSpan = Math.max(archive.offsetHeight - vh, 1);
    const apprTop = docTop(approach);
    const apprSpan = Math.max(approach.offsetHeight - vh, 1);
    const aboutTop = docTop(about);
    const contactTop = docTop(contact);

    /* [scrollY, stage] — linearly interpolated between stops */
    stops = [
      [0, 0],
      [vh * 0.85, 1],
      [archTop - vh * 0.55, 1],
      [archTop + archSpan * 0.28, 2],
      [apprTop - vh * 0.45, 2],
      [apprTop + apprSpan * 0.22, 3],
      [aboutTop - vh * 0.35, 3],
      [aboutTop + vh * 0.35, 4],
      [contactTop - vh * 0.5, 4],
      [contactTop + vh * 0.25, 5]
    ];
    /* keep it monotonic even on very short viewports */
    for (let i = 1; i < stops.length; i += 1) {
      if (stops[i][0] <= stops[i - 1][0]) stops[i][0] = stops[i - 1][0] + 1;
    }
  };

  const stageAt = (y) => {
    if (!stops.length) return 0;
    if (y <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i += 1) {
      const [y0, s0] = stops[i - 1];
      const [y1, s1] = stops[i];
      if (y <= y1) return s0 + (s1 - s0) * ((y - y0) / (y1 - y0));
    }
    return stops[stops.length - 1][1];
  };

  /* ── interaction ───────────────────────────────────────────────── */
  let pxN = 0, pyN = 0, pointerLive = 0;
  if (!coarse) {
    addEventListener("pointermove", (e) => {
      pxN = (e.clientX / innerWidth) * 2 - 1;
      pyN = -((e.clientY / innerHeight) * 2 - 1);
      pointerLive = 1;
    }, { passive: true });
    addEventListener("pointerleave", () => { pointerLive = 0; });
  }

  const legend = [...document.querySelectorAll("[data-layer]")];
  const settleOf = (order, layer) => Math.min(Math.max(order * 1.85 - (layer / 3 * 0.55) * 0.85, 0), 1);

  /* ── layout ────────────────────────────────────────────────────── */
  let wide = true;
  const layout = () => {
    const w = Math.max(canvas.clientWidth, 1);
    const h = Math.max(canvas.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wide = w / h > 1.05;
    rig.scale.setScalar(wide ? 1 : 0.72);
    uniforms.uSize.value = renderer.getPixelRatio() * (wide ? 4.0 : 3.2);
    buildTimeline();
  };

  /* ── loop ──────────────────────────────────────────────────────── */
  const clock = new Clock();
  let ex = 0, ey = 0, easedOn = 0;
  let stage = 0, rigX = 1.5, rigY = 0.1, rigRX = 0.38, presence = 1;
  const tmp = new Vector3();
  const tmpQ = new Quaternion();

  const frame = () => {
    requestAnimationFrame(frame);
    if (document.hidden) return;

    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    /* where the page is decides what the field becomes */
    const target = stageAt(window.scrollY);
    stage += (target - stage) * 0.055;

    const a = Math.min(Math.floor(stage), LOOK.length - 1);
    const b = Math.min(a + 1, LOOK.length - 1);
    const bl = stage - a;

    uniforms.uFormA.value = a;
    uniforms.uFormB.value = b;
    uniforms.uBlend.value = bl;
    uniforms.uWarmA.value = LOOK[a].warm;
    uniforms.uWarmB.value = LOOK[b].warm;

    presence += (LOOK[a].presence + (LOOK[b].presence - LOOK[a].presence) * bl - presence) * 0.06;
    uniforms.uPresence.value = presence;

    /* the field drifts across the page as the formation changes */
    const tx = wide ? LOOK[a].x + (LOOK[b].x - LOOK[a].x) * bl : 0;
    const ty = LOOK[a].y + (LOOK[b].y - LOOK[a].y) * bl;
    const trx = LOOK[a].rx + (LOOK[b].rx - LOOK[a].rx) * bl;
    rigX += (tx - rigX) * 0.05;
    rigY += (ty - rigY) * 0.05;
    rigRX += (trx - rigRX) * 0.05;
    rig.position.set(rigX, rigY, 0);

    /* hero legend: lit by the same maths the shader staggers with */
    if (legend.length && stage < 1.6) {
      legend.forEach((li, i) => li.classList.toggle("on", settleOf(Math.min(stage, 1), i) > 0.5));
    }

    ex += (pxN - ex) * 0.05;
    ey += (pyN - ey) * 0.05;
    easedOn += (pointerLive - easedOn) * 0.06;
    uniforms.uPointerOn.value = easedOn;

    tmp.set(ex * 4.2, ey * 2.6, 0.6).sub(rig.position)
       .applyQuaternion(tmpQ.copy(rig.quaternion).invert());
    uniforms.uPointer.value.copy(tmp);

    rig.rotation.y = t * 0.055 + ex * 0.3;
    rig.rotation.x = rigRX + ey * -0.12;

    renderer.render(scene, camera);
  };

  layout();
  addEventListener("resize", layout);
  addEventListener("load", buildTimeline);

  if (reduced) {
    uniforms.uFormA.value = 1;
    uniforms.uFormB.value = 1;
    uniforms.uBlend.value = 0;
    uniforms.uWarmA.value = 0;
    uniforms.uWarmB.value = 0;
    uniforms.uTime.value = 1.5;
    legend.forEach((li) => li.classList.add("on"));
    renderer.render(scene, camera);
  } else {
    frame();
  }

  window.__scene = { renderer, scene, camera, rig, uniforms, COUNT, LOOK, stageAt, buildTimeline };
})();
