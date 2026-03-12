/* ═══════════════════════════════════════════════
   QFV SHARED SCRIPTS
   - Navigation builder
   - Footer builder
   - Login / CID Auth system
   - Admin panel (CID 1870124 only)
   - GDPR cookie consent
   - Accordion / tabs
═══════════════════════════════════════════════ */

// ── CONSTANTS ────────────────────────────────────────────
const ADMIN_CID = '1870124';
const NAV = [
  {h:'index.html',     l:'Home'},
  {h:'about.html',     l:'About'},
  {h:'fleet.html',     l:'Fleet'},
  {h:'routes.html',    l:'Routes'},
  {h:'training.html',  l:'Training'},
  {h:'military.html',  l:'Military'},
  {h:'atc.html',       l:'ATC'},
  {h:'ranks.html',     l:'Ranks'},
  {h:'roster.html',    l:'Roster'},
  {h:'support.html',   l:'Support'},
];

// ── SESSION ───────────────────────────────────────────────
const Session = {
  get cid(){ return sessionStorage.getItem('qfv_cid')||'' },
  set cid(v){ sessionStorage.setItem('qfv_cid',v) },
  get name(){ return sessionStorage.getItem('qfv_name')||'' },
  set name(v){ sessionStorage.setItem('qfv_name',v) },
  get logged(){ return !!this.cid },
  isAdmin(){ return this.cid === ADMIN_CID },
  logout(){
    sessionStorage.removeItem('qfv_cid');
    sessionStorage.removeItem('qfv_name');
    location.reload();
  }
};

// ── NAV BUILDER ───────────────────────────────────────────
function buildNav(active){
  const links = NAV.map(n =>
    `<li><a href="${n.h}" ${n.h===active?'class="act"':''}>${n.l}</a></li>`
  ).join('');
  const authBtn = Session.logged
    ? `<span class="tb-login" onclick="Session.logout()" style="color:var(--r);border-color:rgba(200,16,46,.35)">
        LOG OUT ${Session.cid.slice(-4)}
       </span>`
    : `<button class="tb-login" onclick="openLogin()">LOG IN</button>`;
  return `
  <div id="topbar">
    <a class="tb-logo" href="index.html">
      <div class="tb-mark">Q</div>
      <span class="tb-wm"><b>QANTAS</b> VIRTUAL</span>
    </a>
    <ul class="tb-nav">${links}</ul>
    <div class="tb-right">
      <div class="tb-live">VAA ACTIVE</div>
      ${authBtn}
      <a href="join.html" class="tb-join">Join</a>
    </div>
  </div>`;
}

// ── FOOTER BUILDER ────────────────────────────────────────
function buildFooter(){
  return `
  <footer>
    <div class="footer-grid">
      <div>
        <div class="footer-logo">
          <svg width="180" height="54" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,20 L55,10 L70,20 L70,80 L55,110 L10,80 Z" fill="#C8102E" opacity=".9"/>
            <path d="M22,38 L45,28 L58,38 L58,72 L45,88 L22,72 Z" fill="#07090B"/>
            <circle cx="40" cy="58" r="4" fill="#C8102E"/>
            <circle cx="40" cy="58" r="1.8" fill="white"/>
            <text x="82" y="76" font-family="'Bebas Neue','Impact',sans-serif" font-size="62" letter-spacing="4" fill="white">QFV</text>
            <rect x="82" y="80" width="220" height="1.5" fill="#C8102E" opacity=".5"/>
            <text x="83" y="96" font-family="'Space Mono','Courier New',monospace" font-size="10" letter-spacing="5" fill="#C8102E">QANTAS VIRTUAL</text>
          </svg>
        </div>
        <p class="footer-tagline">An independent virtual airline community on the VATSIM simulation network. Three divisions — Civilian, Military, and ATC Training.</p>
      </div>
      <div class="footer-col">
        <h4>Navigate</h4>
        <a href="index.html">Home</a>
        <a href="about.html">About QFV</a>
        <a href="fleet.html">Fleet</a>
        <a href="routes.html">Routes</a>
        <a href="roster.html">Pilot Roster</a>
        <a href="join.html">Join Us</a>
      </div>
      <div class="footer-col">
        <h4>Training</h4>
        <a href="training.html">Pilot Training</a>
        <a href="military.html">Military Wing</a>
        <a href="atc.html">ATC Training</a>
        <a href="ranks.html">Rank Structure</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="support.html">Support</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="https://www.simbrief.com" target="_blank" rel="noopener">SimBrief ↗</a>
        <a href="https://vatsim.net" target="_blank" rel="noopener">VATSIM ↗</a>
        <a href="https://github.com/Qantas-Virtual-Airline" target="_blank" rel="noopener">GitHub ↗</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Qantas Virtual (QFV) — Independent virtual airline community. All rights reserved.</p>
      <p class="footer-dis">NOT AFFILIATED WITH QANTAS AIRWAYS, VATSIM, OR ANY REAL-WORLD AVIATION ENTITY · SIMULATION USE ONLY</p>
    </div>
  </footer>`;
}

// ── LOGIN MODAL ───────────────────────────────────────────
function buildLoginModal(){
  return `
  <div class="modal-overlay" id="login-modal">
    <div class="modal">
      <button class="modal-close" onclick="closeLogin()">✕</button>
      <h2 class="cr">LOGIN</h2>
      <p>Enter your VATSIM CID and display name to access member features. VATSIM OAuth integration coming soon.</p>
      <form class="form" id="login-form" onsubmit="doLogin(event)">
        <div class="fld">
          <label class="flbl">VATSIM CID</label>
          <input class="finp" type="text" id="l-cid" placeholder="e.g. 1234567" required autocomplete="off"/>
        </div>
        <div class="fld">
          <label class="flbl">Display Name / Callsign</label>
          <input class="finp" type="text" id="l-name" placeholder="e.g. John Smith" required/>
        </div>
        <div id="login-err" style="display:none;font-size:.82rem;color:var(--r);margin-top:-6px"></div>
        <button type="submit" class="btn btn-r" style="margin-top:4px">ACCESS MEMBER AREA</button>
      </form>
      <p style="font-size:.75rem;color:var(--m);margin-top:16px;line-height:1.6">
        Your CID is only used locally in your browser session. No data is transmitted or stored on our servers.
        Full VATSIM OAuth login coming in a future update.
      </p>
    </div>
  </div>`;
}

function openLogin(){
  document.getElementById('login-modal').classList.add('open');
}
function closeLogin(){
  document.getElementById('login-modal').classList.remove('open');
}
function doLogin(e){
  e.preventDefault();
  const cid = document.getElementById('l-cid').value.trim();
  const name = document.getElementById('l-name').value.trim();
  const err = document.getElementById('login-err');
  if(!/^\d{6,8}$/.test(cid)){
    err.textContent = 'Invalid CID format. Must be 6–8 digits.';
    err.style.display = 'block';
    return;
  }
  Session.cid = cid;
  Session.name = name;
  closeLogin();
  location.reload();
}

// ── ADMIN PANEL ───────────────────────────────────────────
const FEATURES = {
  maintenance_mode: {label:'Maintenance Mode', val: false},
  show_roster: {label:'Show Roster Page', val: true},
  show_military: {label:'Military Division', val: true},
  join_open: {label:'Applications Open', val: true},
  show_stats: {label:'Live Stats Bar', val: true},
};

function buildAdminPanel(){
  if(!Session.isAdmin()) return '';
  const items = Object.entries(FEATURES).map(([k,f]) => `
    <div class="ap-item">
      <span class="ap-label">${f.label}</span>
      <div class="ap-toggle">
        <button class="ap-btn ap-btn-on ${f.val?'active':''}" onclick="toggleFeature('${k}',true)">ON</button>
        <button class="ap-btn ap-btn-off ${!f.val?'active':''}" onclick="toggleFeature('${k}',false)">OFF</button>
      </div>
    </div>`).join('');
  return `
  <div id="admin-panel" class="visible">
    <div class="ap-head">
      <h3>ADMIN PANEL</h3>
      <button onclick="document.getElementById('admin-panel').classList.toggle('visible')"
        style="background:none;border:none;color:#fff;cursor:pointer;font-size:1rem">✕</button>
    </div>
    <div class="ap-body">
      <div class="ap-user">// Logged in as CID ${Session.cid} — President</div>
      ${items}
      <div style="margin-top:12px;display:flex;gap:6px">
        <button class="btn btn-r btn-sm" style="flex:1;clip-path:none" onclick="alert('Admin dashboard — full version coming with VATSIM OAuth')">Dashboard</button>
        <button class="btn btn-o btn-sm" style="clip-path:none" onclick="Session.logout()">Logout</button>
      </div>
    </div>
  </div>`;
}

function toggleFeature(key, val){
  FEATURES[key].val = val;
  // Re-render panel
  const p = document.getElementById('admin-panel');
  if(p) p.outerHTML = buildAdminPanel();
}

// ── GDPR COOKIE BANNER ────────────────────────────────────
function buildCookieBanner(){
  if(localStorage.getItem('qfv_cookie_consent')) return '';
  return `
  <div id="cookie-banner">
    <p>
      We use essential cookies to keep your session active. By continuing to use this site,
      you consent to our use of cookies in accordance with our
      <a href="privacy.html">Privacy Policy</a>.
      QFV does not sell or share your data with third parties.
    </p>
    <div class="cookie-btns">
      <button id="cookie-accept" onclick="acceptCookies()">Accept</button>
      <button id="cookie-decline" onclick="declineCookies()">Decline</button>
    </div>
  </div>`;
}
function acceptCookies(){
  localStorage.setItem('qfv_cookie_consent','accepted');
  document.getElementById('cookie-banner').style.display='none';
}
function declineCookies(){
  localStorage.setItem('qfv_cookie_consent','declined');
  document.getElementById('cookie-banner').style.display='none';
}

// ── ACCORDION ─────────────────────────────────────────────
function initAccordion(){
  document.querySelectorAll('.cph-head').forEach(h => {
    h.addEventListener('click', () => {
      const body = h.nextElementSibling;
      const isOpen = body.classList.contains('open');
      document.querySelectorAll('.cph-body').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.cph-head').forEach(x => x.classList.remove('open'));
      if(!isOpen){ body.classList.add('open'); h.classList.add('open'); }
    });
  });
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────
function initAOS(){
  const els = document.querySelectorAll('[data-aos]');
  if(!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity='1';
        e.target.style.transform='translateY(0) translateX(0)';
      }
    });
  }, {threshold:0.08});
  els.forEach(el => {
    el.style.opacity='0';
    el.style.transform='translateY(28px)';
    el.style.transition=`opacity .65s ease ${el.dataset.delay||0}ms, transform .65s ease ${el.dataset.delay||0}ms`;
    obs.observe(el);
  });
}

// ── TABS ──────────────────────────────────────────────────
function showTab(groupId, tabId, btn){
  document.querySelectorAll(`[data-group="${groupId}"]`).forEach(p => p.style.display='none');
  document.querySelectorAll(`[data-tab-group="${groupId}"]`).forEach(b => {
    b.style.background='var(--p)'; b.style.color='var(--m)'; b.style.borderColor='rgba(255,255,255,.08)';
  });
  const panel = document.getElementById(`tab-${tabId}`);
  if(panel) panel.style.display='block';
  if(btn){ btn.style.background='var(--r)'; btn.style.color='#fff'; btn.style.borderColor='var(--r)'; }
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Inject nav
  const ns = document.getElementById('navslot');
  if(ns) ns.innerHTML = buildNav(ns.dataset.page||'');
  // Inject footer
  const fs = document.getElementById('footslot');
  if(fs) fs.innerHTML = buildFooter();
  // Inject login modal
  const ms = document.getElementById('modalslot');
  if(ms) ms.innerHTML = buildLoginModal();
  // Inject admin panel
  const as = document.getElementById('adminslot');
  if(as) as.innerHTML = buildAdminPanel();
  // Inject cookie banner
  const cs = document.getElementById('cookieslot');
  if(cs) cs.innerHTML = buildCookieBanner();
  // Init features
  initAccordion();
  initAOS();
  // Close modal on overlay click
  document.addEventListener('click', e => {
    if(e.target.id === 'login-modal') closeLogin();
  });
  // Escape key
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') closeLogin();
  });
});
