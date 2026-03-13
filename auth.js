/* ═══════════════════════════════════════════════════════════
   QFV AUTH  —  auth.js
   Session management, VATSIM OAuth (stub + real flow),
   SimBrief username validation.
═══════════════════════════════════════════════════════════ */

const ADMIN_CID   = '1870124';
const VATSIM_AUTH = 'https://auth.vatsim.net/oauth/authorize';
const VATSIM_API  = 'https://api.vatsim.net/v2/members/';

const Auth = {

  /* ── CURRENT SESSION ──────────────────────────────────── */
  get session() {
    try { return JSON.parse(sessionStorage.getItem('qfv_session')) || null; }
    catch { return null; }
  },
  set session(v) {
    if(v) sessionStorage.setItem('qfv_session', JSON.stringify(v));
    else  sessionStorage.removeItem('qfv_session');
  },
  get logged()  { return !!this.session; },
  get isAdmin() { return this.session?.cid === ADMIN_CID; },
  get pilot()   { return this.session ? DB.getPilot(this.session.cid) : null; },

  /* ── LOGIN WITH CID (manual fallback) ──────────────────── */
  loginManual(cid, name, simbrief='') {
    const existing = DB.getPilot(cid);
    const sess = {
      cid,
      name:     existing?.name || name,
      simbrief: existing?.simbrief || simbrief,
      pilotId:  existing?.id || null,
      loginAt:  Date.now(),
      method:   'manual',
    };
    this.session = sess;
    if(existing && simbrief && !existing.simbrief) {
      DB.updatePilot(existing.id, { simbrief });
    }
    return sess;
  },

  /* ── VATSIM OAUTH FLOW ─────────────────────────────────── */
  // Step 1: Redirect to VATSIM (called from login button)
  startVatsimOAuth() {
    const s = DB.settings();
    if(!s.vatsim_client_id) {
      UI.toast('VATSIM OAuth not configured. Use manual login.', 'error');
      return false;
    }
    const params = new URLSearchParams({
      response_type: 'code',
      client_id:     s.vatsim_client_id,
      redirect_uri:  location.origin + location.pathname.replace(/[^/]*$/, '') + 'oauth-callback.html',
      scope:         'full_name vatsim_details email',
      state:         Math.random().toString(36).slice(2),
    });
    sessionStorage.setItem('oauth_state', params.get('state'));
    window.location.href = VATSIM_AUTH + '?' + params.toString();
    return true;
  },

  // Step 2: Handle callback (oauth-callback.html calls this)
  async handleOAuthCallback(code) {
    // In production: exchange code for token server-side
    // GitHub Pages can't do this directly — needs a backend proxy
    // For now, simulate successful auth with the code
    UI.toast('VATSIM OAuth callback received. Backend proxy needed for full implementation.', 'info');
    return null;
  },

  // Simulate VATSIM data fetch (for testing without real OAuth)
  async fetchVatsimData(cid) {
    // Real call: fetch(VATSIM_API + cid)
    // Simulated response:
    return {
      id:           cid,
      name_full:    'VATSIM Member ' + cid,
      rating:       { short: 'PPL', long: 'Private Pilot' },
      pilotrating:  { short: 'P1', long: 'Private Pilot' },
      country:      { name: 'Australia', id: 'AU' },
      reg_date:     '2020-01-01',
    };
  },

  /* ── SIMBRIEF LOOKUP ─────────────────────────────────────── */
  async fetchSimbriefData(username) {
    if(!username) return null;
    // SimBrief CORS-friendly endpoint
    const url = `https://www.simbrief.com/api/xml.fetcher.php?username=${encodeURIComponent(username)}&json=1`;
    try {
      const r = await fetch(url, { mode: 'cors' });
      if(!r.ok) return null;
      const d = await r.json();
      return {
        userid:     d.params?.user_id,
        username:   d.params?.username || username,
        airline:    d.general?.icao_airline,
        flightnum:  d.general?.flight_number,
        dep:        d.origin?.icao_code,
        arr:        d.destination?.icao_code,
        aircraft:   d.aircraft?.icaocode,
        pax:        d.weights?.pax_count_actual,
        fuelPlan:   d.fuel?.plan_ramp,
        route:      d.general?.route,
        ofp_time:   d.params?.time_generated,
        valid:      true,
      };
    } catch {
      return { valid: false, username };
    }
  },

  /* ── LOGOUT ──────────────────────────────────────────────── */
  logout() {
    this.session = null;
    location.href = 'index.html';
  },
};
