// ── SHARED NAV ────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: 'index.html',    label: 'Home' },
  { href: 'about.html',    label: 'About' },
  { href: 'fleet.html',    label: 'Fleet' },
  { href: 'routes.html',   label: 'Routes' },
  { href: 'training.html', label: 'Training' },
  { href: 'military.html', label: 'Military' },
  { href: 'atc.html',      label: 'ATC' },
  { href: 'ranks.html',    label: 'Ranks' },
  { href: 'support.html',  label: 'Support' },
];

function buildNav(activePage) {
  const links = NAV_LINKS.map(l =>
    `<li><a href="${l.href}" ${l.href === activePage ? 'class="active"' : ''}>${l.label}</a></li>`
  ).join('');
  return `
  <nav id="qnav">
    <a class="qnav-logo" href="index.html">
      <div class="q-icon">Q</div>
      <span>QANTAS</span> VIRTUAL
    </a>
    <ul class="qnav-links">${links}</ul>
    <div class="qnav-right">
      <div class="qnav-live">VATSIM VAA ACTIVE</div>
      <a href="join.html" class="btn-nav">JOIN NOW</a>
    </div>
  </nav>`;
}

// ── SHARED FOOTER ─────────────────────────────────────────────────
function buildFooter() {
  return `
  <qfooter>
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="fl"><span>Q</span>ANTAS VIRTUAL</div>
        <p>Australia's virtual airline on VATSIM. Professional simulation, real Qantas routes. ICAO: QFV</p>
      </div>
      <div class="footer-col">
        <h4>Navigation</h4>
        <a href="index.html">Home</a>
        <a href="about.html">About QFV</a>
        <a href="fleet.html">Fleet</a>
        <a href="routes.html">Route Network</a>
        <a href="join.html">Join Us</a>
      </div>
      <div class="footer-col">
        <h4>Training</h4>
        <a href="training.html">Pilot Training</a>
        <a href="military.html">Military Division</a>
        <a href="atc.html">ATC Training</a>
        <a href="ranks.html">Rank Structure</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="support.html">Support</a>
        <a href="https://www.simbrief.com" target="_blank">SimBrief</a>
        <a href="https://vatsim.net" target="_blank">VATSIM</a>
        <a href="https://github.com/Qantas-Virtual-Airline" target="_blank">GitHub</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Qantas Virtual (QFV) — VATSIM Virtual Airline Affiliate</p>
      <p class="fdis">NOT AFFILIATED WITH QANTAS AIRWAYS LIMITED · FOR SIMULATION USE ONLY</p>
    </div>
  </qfooter>`;
}

// ── CURRICULUM ACCORDION ──────────────────────────────────────────
function initAccordion() {
  document.querySelectorAll('.cphase-head').forEach(head => {
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const isOpen = body.classList.contains('open');
      document.querySelectorAll('.cphase-body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.cphase-head').forEach(h => h.classList.remove('open'));
      if (!isOpen) { body.classList.add('open'); head.classList.add('open'); }
    });
  });
}

// ── ROUTE TABS ────────────────────────────────────────────────────
function showTab(id) {
  document.querySelectorAll('.rtab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.rtab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  event.target.classList.add('active');
}

// ── ANIMATE ON SCROLL ─────────────────────────────────────────────
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity .6s ease ${el.dataset.delay || 0}ms, transform .6s ease ${el.dataset.delay || 0}ms`;
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initAOS();
});
