/* ═══════════════════════════════════════════════════════════
   QFV UI  —  ui.js
   Shared UI: nav, footer, modals, toasts, components
═══════════════════════════════════════════════════════════ */

const UI = {

  /* ── TOAST ───────────────────────────────────────────────── */
  toast(msg, type='success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${msg}</span><button onclick="this.parentNode.remove()">✕</button>`;
    let c = document.getElementById('toast-container');
    if(!c){ c=document.createElement('div'); c.id='toast-container'; document.body.appendChild(c); }
    c.appendChild(t);
    setTimeout(()=>t.classList.add('show'),10);
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, 4000);
  },

  /* ── MODAL ───────────────────────────────────────────────── */
  modal(id)  { const m=document.getElementById(id); if(m){ m.style.display='flex'; requestAnimationFrame(()=>m.classList.add('open')); }},
  close(id)  { const m=document.getElementById(id); if(m){ m.classList.remove('open'); setTimeout(()=>m.style.display='none',250); }},
  closeAll() { document.querySelectorAll('.modal-ov.open').forEach(m=>{ m.classList.remove('open'); setTimeout(()=>m.style.display='none',250); }); },

  /* ── CONFIRM ─────────────────────────────────────────────── */
  confirm(msg) { return window.confirm(msg); },

  /* ── NAV ─────────────────────────────────────────────────── */
  buildNav(activePage) {
    const s    = DB.settings();
    const sess = Auth.session;
    const links = [
      ['index.html',     'Home'],
      ['fleet.html',     'Fleet'],
      ['routes.html',    'Routes'],
      ['training.html',  'Training'],
      ['military.html',  'Military'],
      ['atc.html',       'ATC'],
      ['ranks.html',     'Ranks'],
      ['roster.html',    'Roster'],
    ];
    const li = links.map(([h,l])=>`<li><a href="${h}" class="nav-link${h===activePage?' active':''}">${l}</a></li>`).join('');

    const authArea = sess ? `
      <a href="dashboard.html" class="nav-link${activePage==='dashboard.html'?' active':''}" style="color:var(--go)">
        ✈ ${sess.pilotId||sess.name||sess.cid}
      </a>
      ${Auth.isAdmin ? `<a href="admin.html" class="nav-btn" style="background:var(--au);color:var(--k)${activePage==='admin.html'?' outline:2px solid #fff':''}" >ADMIN</a>` : ''}
      <button class="nav-btn-ghost" onclick="Auth.logout()">LOG OUT</button>
    ` : `<button class="nav-btn-ghost" onclick="UI.modal('login-modal')">LOG IN</button>`;

    const notice = s.site_notice ? `<div class="site-notice">${s.site_notice}</div>` : '';
    const maint  = s.maintenance  ? `<div class="site-notice maint">⚠ SITE MAINTENANCE IN PROGRESS</div>` : '';

    return `
    ${maint}${notice}
    <nav id="qnav">
      <a class="nav-logo" href="index.html">
        <div class="nav-mark">Q</div>
        <span class="nav-wm"><b>QANTAS</b> VIRTUAL</span>
      </a>
      <ul class="nav-links">${li}</ul>
      <div class="nav-right">
        <div class="nav-live">VAA ACTIVE</div>
        ${authArea}
        <a href="join.html" class="nav-btn">JOIN</a>
      </div>
    </nav>`;
  },

  /* ── FOOTER ──────────────────────────────────────────────── */
  buildFooter() {
    return `
    <footer>
      <div class="footer-grid">
        <div>
          <div class="footer-logo">QFV</div>
          <p class="footer-tagline">Independent virtual airline on VATSIM. Three divisions — Civilian, Military, ATC Training.</p>
          <p class="footer-dis mt16">Not affiliated with Qantas Airways or VATSIM · Simulation use only</p>
        </div>
        <div class="footer-col">
          <h4>Fly</h4>
          <a href="fleet.html">Fleet</a>
          <a href="routes.html">Routes</a>
          <a href="roster.html">Pilot Roster</a>
          <a href="dashboard.html">My Dashboard</a>
          <a href="join.html">Join QFV</a>
        </div>
        <div class="footer-col">
          <h4>Learn</h4>
          <a href="training.html">Pilot Training</a>
          <a href="military.html">Military Division</a>
          <a href="atc.html">ATC Training</a>
          <a href="ranks.html">Rank Structure</a>
          <a href="${DB.settings().moodle_url}" target="_blank">Moodle LMS ↗</a>
        </div>
        <div class="footer-col">
          <h4>Info</h4>
          <a href="about.html">About QFV</a>
          <a href="support.html">Support</a>
          <a href="privacy.html">Privacy Policy</a>
          <a href="https://vatsim.net" target="_blank">VATSIM ↗</a>
          <a href="https://simbrief.com" target="_blank">SimBrief ↗</a>
          <a href="https://github.com/Qantas-Virtual-Airline" target="_blank">GitHub ↗</a>
        </div>
      </div>
      <div class="footer-bot">
        <p>© 2025 Qantas Virtual (QFV). All rights reserved.</p>
        <p class="footer-dis">NOT AFFILIATED WITH QANTAS AIRWAYS LIMITED OR VATSIM · FOR SIMULATION USE ONLY</p>
      </div>
    </footer>`;
  },

  /* ── LOGIN MODAL ─────────────────────────────────────────── */
  buildLoginModal() {
    const s = DB.settings();
    return `
    <div class="modal-ov" id="login-modal" onclick="if(event.target===this)UI.close('login-modal')">
      <div class="modal">
        <button class="modal-x" onclick="UI.close('login-modal')">✕</button>
        <div class="modal-logo">QFV</div>
        <h2>PILOT LOGIN</h2>
        <p>Access your pilot dashboard, log flights, and track your progress.</p>
        ${s.vatsim_oauth_on && s.vatsim_client_id ? `
        <button class="btn btn-vatsim" onclick="Auth.startVatsimOAuth()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12l2.5 2.5L16 9"/></svg>
          Login with VATSIM
        </button>
        <div class="or-divider"><span>or</span></div>` : ''}
        <form class="form" id="manual-login-form" onsubmit="handleManualLogin(event)">
          <div class="fld">
            <label class="flbl">VATSIM CID</label>
            <input class="finp" id="l-cid" type="text" placeholder="e.g. 1234567" required autocomplete="off"/>
          </div>
          <div class="fld">
            <label class="flbl">SimBrief Username</label>
            <input class="finp" id="l-sb" type="text" placeholder="Your SimBrief username"/>
            <span class="fhint">Used to auto-fill flight logs from SimBrief OFPs</span>
          </div>
          <div class="fld">
            <label class="flbl">Display Name</label>
            <input class="finp" id="l-name" type="text" placeholder="Your name or callsign" required/>
          </div>
          <div class="ferr" id="l-err"></div>
          <button type="submit" class="btn btn-r btn-full">Access Pilot Area</button>
        </form>
        <p class="modal-note">CID stored in browser session only. Not sent to any server. <a href="privacy.html">Privacy Policy</a></p>
      </div>
    </div>`;
  },

  /* ── LOG FLIGHT MODAL ─────────────────────────────────────── */
  buildLogModal() {
    return `
    <div class="modal-ov" id="log-modal" onclick="if(event.target===this)UI.close('log-modal')">
      <div class="modal modal-wide">
        <button class="modal-x" onclick="UI.close('log-modal')">✕</button>
        <h2>LOG FLIGHT</h2>
        <p>Record a completed flight. SimBrief OFP is mandatory.</p>
        <div class="sb-fetch-bar">
          <input class="finp" id="lf-sb-user" placeholder="SimBrief username (auto-filled if set)"/>
          <button class="btn btn-a btn-sm" type="button" onclick="fetchFromSimbrief()">
            Fetch Latest OFP
          </button>
        </div>
        <div id="sb-preview" class="sb-preview" style="display:none"></div>
        <form class="form" id="log-flight-form" onsubmit="submitFlightLog(event)">
          <div class="frow">
            <div class="fld"><label class="flbl">Flight Number</label><input class="finp" id="lf-fn" placeholder="QFV401" required/></div>
            <div class="fld"><label class="flbl">Aircraft</label>
              <select class="fsel" id="lf-ac">
                <option>B738</option><option>A21N</option><option>A332</option>
                <option>A333</option><option>B789</option><option>A388</option><option>Other</option>
              </select>
            </div>
          </div>
          <div class="frow">
            <div class="fld"><label class="flbl">Departure ICAO</label><input class="finp" id="lf-dep" placeholder="YSSY" maxlength="4" style="text-transform:uppercase" required/></div>
            <div class="fld"><label class="flbl">Arrival ICAO</label><input class="finp" id="lf-arr" placeholder="YMML" maxlength="4" style="text-transform:uppercase" required/></div>
          </div>
          <div class="frow">
            <div class="fld"><label class="flbl">Block Time</label><input class="finp" id="lf-block" placeholder="1h 25m" required/></div>
            <div class="fld"><label class="flbl">Date Flown</label><input class="finp" id="lf-date" type="date" required/></div>
          </div>
          <div class="fld">
            <label class="flbl">SimBrief OFP Used?</label>
            <select class="fsel" id="lf-sb-confirm" required>
              <option value="yes">✓ Yes — SimBrief OFP generated and loaded</option>
              <option value="no">✗ No SimBrief OFP</option>
            </select>
          </div>
          <div class="frow">
            <div class="fld"><label class="flbl">Network</label>
              <select class="fsel" id="lf-network">
                <option value="VATSIM">VATSIM Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div class="fld"><label class="flbl">Notes</label><input class="finp" id="lf-notes" placeholder="e.g. Full ATC, smooth landing"/></div>
          </div>
          <div class="ferr" id="lf-err"></div>
          <button type="submit" class="btn btn-r btn-full">Submit Flight Log</button>
        </form>
      </div>
    </div>`;
  },

  /* ── COOKIE BANNER ───────────────────────────────────────── */
  buildCookieBanner() {
    if(localStorage.getItem('qfv_cc')) return '';
    return `
    <div id="cookie-banner">
      <p>We use session cookies only. No tracking. See our <a href="privacy.html">Privacy Policy</a>.</p>
      <div class="ck-btns">
        <button onclick="localStorage.setItem('qfv_cc','1');this.closest('#cookie-banner').remove()">Accept</button>
        <button onclick="localStorage.setItem('qfv_cc','0');this.closest('#cookie-banner').remove()" class="secondary">Decline</button>
      </div>
    </div>`;
  },

  /* ── PAGE INIT ───────────────────────────────────────────── */
  init(page) {
    // Nav
    const ns = document.getElementById('nav-slot');
    if(ns) ns.innerHTML = this.buildNav(page);
    // Footer
    const fs = document.getElementById('footer-slot');
    if(fs) fs.innerHTML = this.buildFooter();
    // Modals
    const ms = document.getElementById('modals-slot');
    if(ms) ms.innerHTML = this.buildLoginModal() + this.buildLogModal();
    // Cookie
    const cs = document.getElementById('cookie-slot');
    if(cs) cs.innerHTML = this.buildCookieBanner();
    // Accordion
    initAccordions();
    // AOS
    initAOS();
    // Escape key
    document.addEventListener('keydown', e=> { if(e.key==='Escape') this.closeAll(); });
    // Update log modal SimBrief username if logged in
    const sbInput = document.getElementById('lf-sb-user');
    if(sbInput && Auth.session?.simbrief) sbInput.value = Auth.session.simbrief;
  },
};

/* ── ACCORDION ───────────────────────────────────────────── */
function initAccordions() {
  document.querySelectorAll('.acc-head').forEach(h=>{
    h.onclick = () => {
      const b = h.nextElementSibling;
      const open = b.classList.contains('open');
      document.querySelectorAll('.acc-body').forEach(x=>x.classList.remove('open'));
      document.querySelectorAll('.acc-head').forEach(x=>x.setAttribute('aria-expanded','false'));
      if(!open){ b.classList.add('open'); h.setAttribute('aria-expanded','true'); }
    };
  });
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('aos-in'); obs.unobserve(e.target); }
    });
  },{threshold:0.07});
  els.forEach(el=>{ el.classList.add('aos-pre'); obs.observe(el); });
}

/* ── LOGIN HANDLER ───────────────────────────────────────── */
function handleManualLogin(e) {
  e.preventDefault();
  const cid      = document.getElementById('l-cid').value.trim();
  const simbrief = document.getElementById('l-sb').value.trim();
  const name     = document.getElementById('l-name').value.trim();
  const err      = document.getElementById('l-err');
  if(!/^\d{5,8}$/.test(cid)){
    err.textContent='Invalid CID — must be 5–8 digits.';
    err.style.display='block'; return;
  }
  Auth.loginManual(cid, name, simbrief);
  UI.close('login-modal');
  UI.toast(`Welcome, ${name}! You are logged in.`);
  setTimeout(()=>location.reload(), 400);
}

/* ── SIMBRIEF FETCH (Log Modal) ──────────────────────────── */
async function fetchFromSimbrief() {
  const user = document.getElementById('lf-sb-user')?.value?.trim()
            || Auth.session?.simbrief;
  if(!user){ UI.toast('Enter your SimBrief username first.','error'); return; }
  const btn = document.querySelector('[onclick="fetchFromSimbrief()"]');
  if(btn){ btn.textContent='Fetching...'; btn.disabled=true; }
  try {
    const d = await Auth.fetchSimbriefData(user);
    if(btn){ btn.textContent='Fetch Latest OFP'; btn.disabled=false; }
    if(!d || !d.valid){ UI.toast('Could not fetch SimBrief data. Check username.','error'); return; }
    // Auto-fill form
    if(d.dep)      document.getElementById('lf-dep').value   = d.dep;
    if(d.arr)      document.getElementById('lf-arr').value   = d.arr;
    if(d.aircraft) document.getElementById('lf-ac').value    = d.aircraft;
    if(d.airline && d.flightnum)
      document.getElementById('lf-fn').value = d.airline + d.flightnum;
    // Show preview
    const prev = document.getElementById('sb-preview');
    prev.innerHTML = `
      <div class="sb-badge">✓ SimBrief OFP loaded</div>
      <div class="sb-detail">
        <span><b>Route:</b> ${d.dep||'?'} → ${d.arr||'?'}</span>
        <span><b>Aircraft:</b> ${d.aircraft||'?'}</span>
        <span><b>Fuel:</b> ${d.fuelPlan ? (parseInt(d.fuelPlan)/1000).toFixed(1)+'t' : '?'}</span>
        <span><b>Generated:</b> ${d.ofp_time ? new Date(parseInt(d.ofp_time)*1000).toLocaleTimeString() : '?'}</span>
      </div>`;
    prev.style.display='block';
    document.getElementById('lf-sb-confirm').value='yes';
    UI.toast('SimBrief OFP data loaded!');
  } catch(err) {
    if(btn){ btn.textContent='Fetch Latest OFP'; btn.disabled=false; }
    UI.toast('SimBrief fetch failed. Fill in manually.','error');
  }
}

/* ── SUBMIT FLIGHT ───────────────────────────────────────── */
function submitFlightLog(e) {
  e.preventDefault();
  if(!Auth.logged){ UI.modal('login-modal'); return; }
  const sb  = document.getElementById('lf-sb-confirm').value;
  const err = document.getElementById('lf-err');
  if(sb!=='yes'){
    err.textContent='SimBrief OFP is mandatory. Flight not logged.';
    err.style.display='block'; return;
  }
  const f = {
    pilotId:  Auth.session.pilotId || Auth.session.cid,
    pilotName:Auth.session.name || Auth.session.cid,
    fn:       document.getElementById('lf-fn').value.trim().toUpperCase(),
    ac:       document.getElementById('lf-ac').value,
    dep:      document.getElementById('lf-dep').value.trim().toUpperCase(),
    arr:      document.getElementById('lf-arr').value.trim().toUpperCase(),
    block:    document.getElementById('lf-block').value.trim(),
    date:     document.getElementById('lf-date').value,
    network:  document.getElementById('lf-network').value,
    notes:    document.getElementById('lf-notes').value.trim(),
    simbrief: true,
  };
  if(!f.fn||!f.dep||!f.arr||!f.block||!f.date){
    err.textContent='Please fill in all required fields.';
    err.style.display='block'; return;
  }
  DB.logFlight(f);
  UI.close('log-modal');
  UI.toast(`✓ Flight logged: ${f.fn} ${f.dep}→${f.arr} (${f.block})`);
  err.style.display='none';
  document.getElementById('log-flight-form').reset();
  document.getElementById('sb-preview').style.display='none';
  document.getElementById('lf-date').value = today();
  if(typeof refreshDashboard==='function') refreshDashboard();
}

/* ── OPEN LOG MODAL ─────────────────────────────────────── */
function openLogModal() {
  if(!Auth.logged){ UI.modal('login-modal'); return; }
  document.getElementById('lf-date').value = today();
  const sbUser = Auth.session?.simbrief;
  if(sbUser){ const el=document.getElementById('lf-sb-user'); if(el) el.value=sbUser; }
  UI.modal('log-modal');
}
