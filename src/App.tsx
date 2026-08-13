import { useEffect } from "react";
import type { CSSProperties } from "react";

/* Case articles use a CSS custom property (--i) for staggered reveal timing.
   TS's CSSProperties doesn't know custom props, so this narrows just enough
   to pass one through without losing type-checking on the rest of the object. */
const caseStyle = (i: number): CSSProperties => ({ "--i": i } as CSSProperties);

export default function App() {
  /* scene.js/motion.js/main.js are the original vanilla DOM/IIFE scripts,
     untouched apart from scene.js importing three.js as a module instead of
     a global. They query the page by id/class, so they must only run after
     this component's JSX has actually painted into the DOM — a useEffect
     with an empty dependency array is the one guarantee for that timing
     (unlike script-tag ordering, which raced the three.js CDN fetch before). */
  useEffect(() => {
    import("./lib/scene.js");
    import("./lib/motion.js");
    import("./lib/main.js");
  }, []);

  return (
    <>
      {/* ══ grain + curtain ══════════════════════════════════════════════ */}
      <div className="grain" aria-hidden="true"></div>

      {/* the particle field: one continuous scene behind the whole page */}
      <canvas id="scene" aria-hidden="true"></canvas>

      <div className="curtain" id="curtain" aria-hidden="true">
        <div className="curtain-inner">
          <span className="curtain-mark">
            <svg viewBox="0 0 64 64" className="cup-mark"><use href="#cupmark"></use></svg>
          </span>
          <span className="curtain-word"><em>one</em> second</span>
          <span className="curtain-rule"><i></i></span>
        </div>
      </div>

      {/* shared logo symbol */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="cupmark" viewBox="0 0 64 64">
          <path className="logo-steam steam-a" d="M24 16c-5-5 5-7 0-13"></path>
          <path className="logo-steam steam-b" d="M37 16c-5-5 5-7 0-13"></path>
          <rect className="logo-monitor" x="7" y="18" width="45" height="35" rx="4"></rect>
          <path className="logo-cup" d="M14 31h29v8c0 8-5 12-14 12S14 47 14 39z"></path>
          <path className="logo-handle" d="M43 34h4c7 0 7 11 0 11h-4"></path>
          <path className="logo-base" d="M20 58h24M27 53v5M37 53v5"></path>
          <path className="logo-code" d="m11 25-4 3 4 3"></path>
        </symbol>
      </svg>

      <div className="cursor" aria-hidden="true"><span className="cursor-label"></span></div>

      {/* ══ header ═══════════════════════════════════════════════════════ */}
      <header className="header" id="header">
        <a className="brand" href="#top" aria-label="Muhammad Gaweesh — back to top">
          <span className="brand-cup"><svg viewBox="0 0 64 64" className="cup-mark"><use href="#cupmark"></use></svg></span>
          <span className="brand-text">
            <strong>Muhammad Gaweesh</strong>
            <small>Pharmacist · software &amp; web apps</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#work" data-nav>Work</a>
          <a href="#approach" data-nav>Approach</a>
          <a href="#about" data-nav>About</a>
          <a href="#contact" data-nav>Contact</a>
        </nav>

        <div className="header-side">
          <a className="header-mail" href="mailto:gawesh1112@gmail.com" data-cursor="write">
            <span className="header-mail-dot"></span> Open for work
          </a>
          <button className="burger" id="burger" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu">
            <span></span><span></span>
          </button>
        </div>
      </header>

      <div className="drawer" id="drawer">
        <a href="#work"><em>01</em> Work</a>
        <a href="#approach"><em>02</em> Approach</a>
        <a href="#about"><em>03</em> About</a>
        <a href="#contact"><em>04</em> Contact</a>
        <p className="drawer-foot">Cairo, Egypt · <span data-clock>--:--</span></p>
      </div>

      <main id="top">

        {/* ══ hero ═══════════════════════════════════════════════════════ */}
        <section className="hero" id="hero">
          <div className="hero-copy">
            <p className="place" data-lift>
              <span className="place-dot"></span>
              Cairo, Egypt
              <span className="place-sep">—</span>
              <span data-greeting>it's <span data-clock>--:--</span> here</span>
            </p>

            <h1 className="hero-title">
              <span className="line" data-mask><span>I trained as a pharmacist.</span></span>
              <span className="line" data-mask><span>I build software</span></span>
              <span className="line" data-mask><span className="pen-wrap">the <em>same way.</em>
                <svg className="pen" viewBox="0 0 420 28" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 19C64 8 149 5 232 9c50 2 108 8 184 3" pathLength="1"></path>
                  <path d="M18 25C82 15 168 12 251 16c46 2 99 6 151 2" pathLength="1" className="pen-2"></path>
                </svg>
              </span></span>
            </h1>

            <div className="hero-bottom">
              <p className="lead" data-lift>
                I build software and web apps end to end. Check the interactions before
                you dispense — then stay long enough to hear what broke.
              </p>

              <div className="hero-actions" data-lift>
                <a className="btn" href="#work" data-magnetic data-cursor="look">
                  <span>See what I've built</span>
                  <svg viewBox="0 0 24 24" className="btn-arrow" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
                <a className="link-quiet" href="mailto:gawesh1112@gmail.com" data-cursor="say hi">
                  or just say hello
                </a>
              </div>
            </div>

            <p className="scribble scribble-hero" data-lift>
              yes — both at once.<br />it makes more sense than it sounds
              <svg className="arrow-doodle" viewBox="0 0 80 60" aria-hidden="true">
                <path d="M6 4c14 26 30 40 58 44" pathLength="1"></path>
                <path d="M50 52c8-1 13 0 14-4M60 39c2 6 4 10 4 13" pathLength="1"></path>
              </svg>
            </p>
          </div>

          <ul className="tally" aria-label="A few numbers">
            <li data-lift><strong data-count="9">0</strong><span>products shipped &amp; still running</span></li>
            <li data-lift><strong data-count="4">0</strong><span>platforms built end to end</span></li>
            <li data-lift><strong data-count="5">0</strong><span>industries I had to learn fast</span></li>
            <li data-lift><strong className="tally-odd">2am</strong><span>when most of it got written</span></li>
          </ul>

          {/* names the four layers the particles resolve into as you scroll */}
          <ol className="layers" aria-hidden="true">
            <li data-layer="0"><i></i>Interface</li>
            <li data-layer="1"><i></i>Services</li>
            <li data-layer="2"><i></i>Data</li>
            <li data-layer="3"><i></i>Infrastructure</li>
          </ol>
        </section>

        {/* ══ belt of opinions ═══════════════════════════════════════════ */}
        <section className="belt" id="beliefs" aria-label="Things I believe about building software">
          <div className="belt-track" data-belt>
            <span>clarity over cleverness</span><i>✳</i>
            <span>ship it, then listen</span><i>✳</i>
            <span>read the error message</span><i>✳</i>
            <span>boring tech, interesting problems</span><i>✳</i>
            <span>the demo is not the product</span><i>✳</i>
            <span>name things properly</span><i>✳</i>
          </div>
        </section>

        {/* ══ selected work — sticky stack ═══════════════════════════════ */}
        <section className="work" id="work">
          <div className="head" data-reveal>
            <p className="kicker"><i></i>Selected work</p>
            <h2>Things that outlived<br /><span className="pen-wrap">the <em>launch post.</em>
              <svg className="pen" viewBox="0 0 420 28" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 19C64 8 149 5 232 9c50 2 108 8 184 3" pathLength="1"></path>
                <path className="pen-2" d="M18 25C82 15 168 12 251 16c46 2 99 6 151 2" pathLength="1"></path>
              </svg>
            </span></h2>
            <p className="head-note">
              Four I'm proud of, written out honestly — what was actually wrong,
              what I built, and what I'd do differently.
            </p>
          </div>

          <div className="stack">

            <article className="case" data-case="1" style={caseStyle(0)}>
              <span className="case-ghost" aria-hidden="true">01</span>
              <div className="case-inner">
                <div className="case-visual" data-cursor="visit">
                  <a href="https://medcorex.org" target="_blank" rel="noopener" data-tilt>
                    <span className="frame">
                      <img src="/medcorex.webp" srcSet="/medcorex-700.webp 700w, /medcorex.webp 1100w" sizes="(min-width: 1180px) 45vw, 92vw" alt="MedCoreX clinical platform" loading="lazy" data-parallax />
                    </span>
                    <span className="visit">Visit&nbsp;→</span>
                  </a>
                  <p className="scribble scribble-case">I've stood behind<br />that counter at 3am.<br />every screen shows it.</p>
                </div>

                <div className="case-copy">
                  <p className="case-no">01 <em>—</em> Healthcare</p>
                  <h3>MedCoreX</h3>
                  <dl className="case-story">
                    <dt>What was wrong</dt>
                    <dd>Pharmacists — my own people — were doing dose calculations on paper, at 3am, for patients who couldn't wait for a second opinion.</dd>
                    <dt>What I built</dt>
                    <dd>A clinical decision-support platform — therapy monitoring, dosing, antimicrobial stewardship, and alerts that fire <em>before</em> the mistake, not after.</dd>
                    <dt>What it cost me</dt>
                    <dd>Six rewrites of the alert logic. Too many alerts is the same as none — the hard part was deciding what stays quiet.</dd>
                  </dl>
                  <ul className="chips"><li>React</li><li>Node.js</li><li>MongoDB</li><li>Docker</li></ul>
                </div>
              </div>
            </article>

            <article className="case" data-case="2" style={caseStyle(1)}>
              <span className="case-ghost" aria-hidden="true">02</span>
              <div className="case-inner">
                <div className="case-visual" data-cursor="visit">
                  <a href="https://sci-bridge.org" target="_blank" rel="noopener" data-tilt>
                    <span className="frame">
                      <img src="/sci-bridge.webp" srcSet="/sci-bridge-700.webp 700w, /sci-bridge.webp 1100w" sizes="(min-width: 1180px) 45vw, 92vw" alt="Sci Bridge learning platform" loading="lazy" data-parallax />
                    </span>
                    <span className="visit">Visit&nbsp;→</span>
                  </a>
                  <p className="scribble scribble-case">the certificate PDF took<br />three days. worth it —<br />it's the part people share.</p>
                </div>

                <div className="case-copy">
                  <p className="case-no">02 <em>—</em> Education</p>
                  <h3>Sci Bridge</h3>
                  <dl className="case-story">
                    <dt>What was wrong</dt>
                    <dd>A team of scientists had courses, live sessions, payments and certificates spread across five tools that never spoke to each other.</dd>
                    <dt>What I built</dt>
                    <dd>One platform: on-demand courses, interactive cases, live rooms, payments, email automation, and certificates that generate the moment someone finishes.</dd>
                    <dt>What I learned</dt>
                    <dd>Nobody cares about your architecture. They care that the live session starts on time and the receipt arrives.</dd>
                  </dl>
                  <ul className="chips"><li>Jitsi</li><li>Fawaterak</li><li>Brevo</li><li>PDF automation</li></ul>
                </div>
              </div>
            </article>

            <article className="case" data-case="3" style={caseStyle(2)}>
              <span className="case-ghost" aria-hidden="true">03</span>
              <div className="case-inner">
                <div className="case-visual" data-cursor="visit">
                  <a href="https://tahfizquran.org/" target="_blank" rel="noopener" data-tilt>
                    <span className="frame">
                      <img src="/tahfiz.webp" srcSet="/tahfiz-700.webp 700w, /tahfiz.webp 1100w" sizes="(min-width: 1180px) 45vw, 92vw" alt="Tahfiz Quran Academy platform" loading="lazy" data-parallax />
                    </span>
                    <span className="visit">Visit&nbsp;→</span>
                  </a>
                  <p className="scribble scribble-case">a teacher's memory,<br />finally written down.</p>
                </div>

                <div className="case-copy">
                  <p className="case-no">03 <em>—</em> Newest · Education</p>
                  <h3>Tahfiz Quran Academy</h3>
                  <dl className="case-story">
                    <dt>What was wrong</dt>
                    <dd>One-to-one Qur'an teaching across a dozen time zones was running on messages and memory. One teacher held every student's mistakes in his head, and a certificate was only as good as the word behind it.</dd>
                    <dt>What I built</dt>
                    <dd>A bilingual platform for one-to-one lessons: a free trial booking that does the timezone maths for you, recurring weekly slots, subscriptions across three programmes, and certificates you can actually verify.</dd>
                    <dt>The part I'd defend</dt>
                    <dd>Mistakes are recorded <em>against the verse they happened on</em>, and revision is generated from them. You practise what you personally keep getting wrong — not a generic schedule someone printed once.</dd>
                  </dl>
                  <ul className="chips"><li>Bilingual RTL</li><li>Scheduling &amp; timezones</li><li>Subscriptions</li><li>Zoom</li></ul>
                </div>
              </div>
            </article>

            <article className="case" data-case="4" style={caseStyle(3)}>
              <span className="case-ghost" aria-hidden="true">04</span>
              <div className="case-inner">
                <div className="case-visual" data-cursor="visit">
                  <a href="https://bta3al3ab.online/" target="_blank" rel="noopener" data-tilt>
                    <span className="frame">
                      <img src="/techno-core.webp" srcSet="/techno-core-700.webp 700w, /techno-core.webp 1100w" sizes="(min-width: 1180px) 45vw, 92vw" alt="Techno Core Arabic gaming platform" loading="lazy" data-parallax />
                    </span>
                    <span className="visit">Visit&nbsp;→</span>
                  </a>
                  <p className="scribble scribble-case">no framework.<br />just me and MySQL.<br />still holds up.</p>
                </div>

                <div className="case-copy">
                  <p className="case-no">04 <em>—</em> Gaming</p>
                  <h3>Techno Core</h3>
                  <dl className="case-story">
                    <dt>What was wrong</dt>
                    <dd>Arabic gaming content lived in scattered forum posts and reposts. To find out whether a game would run on your machine, you were reading a five-year-old thread.</dd>
                    <dt>What I built</dt>
                    <dd>An Arabic discovery hub for games, system requirements and community — with the content modelled properly so search could actually reach it. Plain PHP and MySQL, no framework.</dd>
                    <dt>What it taught me</dt>
                    <dd>It's the one I still open on my own phone, and the project that taught me most about writing right-to-left for someone on a bad connection.</dd>
                  </dl>
                  <ul className="chips"><li>PHP</li><li>MySQL</li><li>Arabic RTL</li><li>SEO</li></ul>
                </div>
              </div>
            </article>

          </div>
        </section>

        {/* ══ archive — horizontal scroll ════════════════════════════════ */}
        <section className="archive" id="archive" aria-label="More work">
          <div className="archive-pin">
            <div className="archive-head">
              <p className="kicker"><i></i>The rest of the shelf</p>
              <h2>Five more, <span className="pen-wrap"><em>briefly.</em>
                <svg className="pen" viewBox="0 0 420 28" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 19C64 8 149 5 232 9c50 2 108 8 184 3" pathLength="1"></path>
                  <path className="pen-2" d="M18 25C82 15 168 12 251 16c46 2 99 6 151 2" pathLength="1"></path>
                </svg>
              </span></h2>
              <p className="archive-hint"><span className="archive-hint-bar"><i data-rail></i></span> keep scrolling — this one moves sideways</p>
            </div>

            <div className="rail" data-rail-track>
              <a className="card" href="https://obelisk-solutions.com/" target="_blank" rel="noopener" data-cursor="visit">
                <span className="card-media"><img src="/Ob.webp" alt="Obelisk Solutions website" loading="lazy" /></span>
                <span className="card-body">
                  <em>05 — Consulting</em>
                  <strong>Obelisk Solutions</strong>
                  <span>A focused multilingual site for an international consultancy. Half the work was deleting — enquiries now arrive already knowing what they want.</span>
                  <b>Information architecture · Multilingual · SEO</b>
                </span>
              </a>
              <a className="card" href="https://mamlakty.com/" target="_blank" rel="noopener" data-cursor="visit">
                <span className="card-media"><img src="/ma.webp" alt="Mamlakty e-commerce" loading="lazy" /></span>
                <span className="card-body">
                  <em>06 — Commerce</em>
                  <strong>Mamlakty</strong>
                  <span>A mobile-first shop for mothers and children. Built around finding the thing fast, then getting out.</span>
                  <b>WooCommerce · Payments · SEO</b>
                </span>
              </a>
              <a className="card" href="https://profamalkamal.com/" target="_blank" rel="noopener" data-cursor="visit">
                <span className="card-media"><img src="/prof.webp" alt="Prof. Amal Kamal academic platform" loading="lazy" /></span>
                <span className="card-body">
                  <em>07 — Academia</em>
                  <strong>Prof. Amal Kamal</strong>
                  <span>A bilingual home for research, lectures and training news — and a publishing flow she can run without me.</span>
                  <b>CMS · Arabic RTL · Content IA</b>
                </span>
              </a>
              <a className="card" href="https://ahmedos.pages.dev/" target="_blank" rel="noopener" data-cursor="visit">
                <span className="card-media"><img src="/ah.webp" alt="Dr. Ahmed Osama portfolio" loading="lazy" /></span>
                <span className="card-body">
                  <em>08 — Personal brand</em>
                  <strong>Dr. Ahmed Osama</strong>
                  <span>A fast, quiet professional presence. Loads in under a second on hotel wifi — that was the brief.</span>
                  <b>Frontend · Performance · Cloudflare</b>
                </span>
              </a>
              <a className="card" href="https://drmyahia.pages.dev/" target="_blank" rel="noopener" data-cursor="visit">
                <span className="card-media"><img src="/mo.webp" alt="Dr. Mohamed Yahia medical site" loading="lazy" /></span>
                <span className="card-body">
                  <em>09 — Medical</em>
                  <strong>Dr. Mohamed Yahia</strong>
                  <span>Patient information and booking, written for someone worried and in a hurry.</span>
                  <b>Medical UX · Booking · Edge deploy</b>
                </span>
              </a>
              <div className="card card-end">
                <span className="card-end-inner">
                  <em>and the next one</em>
                  <strong>Yours?</strong>
                  <a href="mailto:gawesh1112@gmail.com" data-cursor="write">Start a conversation →</a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ approach — pinned narrative ════════════════════════════════ */}
        <section className="approach" id="approach">
          <div className="approach-pin">
            <div className="approach-grid">
              <div className="approach-left">
                <p className="kicker"><i></i>How I work</p>
                <p className="approach-count"><b data-step-no>01</b><span>/ 04</span></p>
                <p className="scribble scribble-approach">four words.<br />took me years<br />to get here.</p>
                <svg className="thread" viewBox="0 0 120 420" aria-hidden="true">
                  <path className="thread-line" d="M60 8c-38 60 38 92 0 152s38 92 0 152v100" pathLength="1"></path>
                  <circle className="thread-bead" r="6" cx="60" cy="8"></circle>
                </svg>
              </div>

              <ol className="steps">
                <li data-step>
                  <h3><span>Listen</span></h3>
                  <p>Before a line of code: who is actually suffering, and what have they already tried? Most briefs describe a solution. I go looking for the problem underneath it.</p>
                </li>
                <li data-step>
                  <h3><span>Simplify</span></h3>
                  <p>Then I remove things. The best version of a feature is often a smaller one that ships this month instead of a perfect one that ships never.</p>
                </li>
                <li data-step>
                  <h3><span>Ship</span></h3>
                  <p>Real users, real data, early. A staging environment has never once told me the truth about how something feels to use.</p>
                </li>
                <li data-step>
                  <h3><span>Stay</span></h3>
                  <p>Launch is the middle, not the end. I care about month three — when the edge cases show up and the person using it is tired.</p>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* ══ about ══════════════════════════════════════════════════════ */}
        <section className="about" id="about">
          <div className="about-grid">
            <div className="portrait" data-reveal>
              <span className="tape tape-a"></span>
              <span className="tape tape-b"></span>
              <span className="portrait-shot" data-tilt data-tilt-base="rotate(-1.6deg)">
                <img src="/image.jpg" alt="Muhammad Gaweesh" loading="lazy" data-parallax />
              </span>
              <p className="portrait-cap">Cairo · somewhere near the end of a shift</p>
            </div>

            <div className="about-copy" data-reveal>
              <p className="kicker"><i></i>About</p>
              <h2>I care about what happens<br /><span className="pen-wrap"><em>after</em>
                <svg className="pen" viewBox="0 0 420 28" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 19C64 8 149 5 232 9c50 2 108 8 184 3" pathLength="1"></path>
                  <path className="pen-2" d="M18 25C82 15 168 12 251 16c46 2 99 6 151 2" pathLength="1"></path>
                </svg>
              </span> the demo.</h2>

              <p className="about-lead">
                I'm Muhammad. I studied pharmacy, and somewhere between shifts I started
                writing the tools I wished existed. I never really stopped.
              </p>
              <p>
                Pharmacy gave me a habit that turned out to be the whole job: before you
                hand anything over, check what it interacts with. Nothing is ever one
                thing on its own — not a prescription, not a feature, not a dependency.
              </p>
              <p>
                I build software and web apps for healthcare, education, commerce and
                consulting. That range taught me to walk into an unfamiliar field, ask
                better questions than expected, and design around the person doing the
                work rather than around whatever stack is fashionable this year.
              </p>

              <p className="scribble scribble-about">still read the leaflet<br />before the docs. old habit.</p>

              <ul className="offclock">
                {/* ✏️ EDIT ME: swap these for whatever's actually true this month */}
                <li><em>Reading</em> anything about how systems fail</li>
                <li><em>Tea</em> always on the desk, never allowed to go cold</li>
                <li><em>Weak spot</em> naming variables · I'll rename it four times</li>
                <li><em>Best hours</em> 11pm — 3am, no notifications</li>
              </ul>
            </div>
          </div>

          {/* ══ testimonials ══ */}
          <figure className="says" data-reveal>
            <div className="says-quote">
              <span className="says-mark">"</span>
              <blockquote><p id="quoteText">Muhammad understood our requirements and delivered exactly what we needed. The site represents our brand well and has helped us attract new clients.</p></blockquote>
              <figcaption>
                <strong id="quoteAuthor">Obelisk Solutions</strong>
                <span id="quoteRole">International consulting firm</span>
              </figcaption>
            </div>
            <div className="says-nav">
              <button id="quotePrev" type="button" aria-label="Previous">←</button>
              <span><b id="quoteIndex">01</b> / 03</span>
              <button id="quoteNext" type="button" aria-label="Next">→</button>
            </div>
          </figure>
        </section>

        {/* ══ contact ════════════════════════════════════════════════════ */}
        <section className="contact" id="contact">
          <div className="contact-inner" data-reveal>
            <p className="kicker"><i></i>Let's talk</p>
            <h2 className="contact-title">
              <span data-mask><span>Got something</span></span>
              <span data-mask><span>worth <em>building?</em></span></span>
            </h2>
            <p className="contact-lead">
              Tell me what you're working on and where it's stuck. I'll reply with what
              I'd actually do next — even if the honest answer is that you don't need me
              for this one.
            </p>

            <a className="mail" href="mailto:gawesh1112@gmail.com" data-magnetic data-cursor="write">
              <span className="mail-text">gawesh1112@gmail.com</span>
              <span className="mail-icon">→</span>
            </a>

            <ul className="contact-facts">
              <li><em>Usually replies in</em> a day, often the same evening</li>
              <li><em>Good fits</em> healthcare tools · SaaS · rescuing something half-built</li>
              <li><em>Booking</em> autumn 2026 onward</li>
            </ul>

            <p className="scribble scribble-contact">
              no forms. no funnel.<br />just an inbox I read.
            </p>
          </div>
        </section>
      </main>

      {/* ══ footer ═══════════════════════════════════════════════════════ */}
      <footer className="footer">
        {/* Muhammad's own line, kept as he wrote it years ago */}
        <div className="creed">
          <span className="creed-cup" aria-hidden="true"><svg viewBox="0 0 64 64" className="cup-mark"><use href="#cupmark"></use></svg></span>
          <p className="creed-line">
            <span data-mask><span>Tea in hand.</span></span>
            <span data-mask><span><em>Code on fire.</em></span></span>
            <span data-mask><span>Ideas everywhere.</span></span>
          </p>
          <small className="creed-note">the same line since day one</small>
        </div>

        <div className="footer-top">
          <a className="footer-mark" href="#top" data-cursor="top">
            <span className="footer-cup"><svg viewBox="0 0 64 64" className="cup-mark"><use href="#cupmark"></use></svg></span>
            <span className="footer-name">Muhammad<br /><em>Gaweesh</em></span>
          </a>

          <div className="footer-cols">
            <div>
              <h3>Elsewhere</h3>
              <a href="https://github.com/MGaweesh" target="_blank" rel="noopener">GitHub</a>
              <a href="https://linkedin.com/in/muhammad-gaweesh-780396174/" target="_blank" rel="noopener">LinkedIn</a>
              <a href="https://fb.com/mohamedgaweshking" target="_blank" rel="noopener">Facebook</a>
            </div>
            <div>
              <h3>Here</h3>
              <a href="#work">Work</a>
              <a href="#approach">Approach</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h3>Now</h3>
              <p className="footer-now">Cairo, Egypt<br /><span data-clock>--:--</span> local time</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© <span data-year></span> Muhammad Gaweesh</p>
          <p className="colophon">Powered by tea that never runs out and code that wouldn't wait till morning.</p>
          <a href="#top" className="to-top" data-cursor="top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
