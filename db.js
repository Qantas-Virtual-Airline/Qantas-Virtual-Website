/* ═══════════════════════════════════════════════════════════
   QFV BACKEND v4  —  db.js
   Single source of truth. localStorage as database.
═══════════════════════════════════════════════════════════ */

const DB = {
  K: {
    PILOTS:   'qfv_pilots',
    FLIGHTS:  'qfv_flights',
    APPS:     'qfv_applications',
    SESSION:  'qfv_session',
    SETTINGS: 'qfv_settings',
    ANNOUNCE: 'qfv_announcements',
    TICKETS:  'qfv_tickets',
  },

  _load(key, fallback) {
    const store = key === 'qfv_session' ? sessionStorage : localStorage;
    try { return JSON.parse(store.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  _save(key, val) {
    const store = key === 'qfv_session' ? sessionStorage : localStorage;
    store.setItem(key, JSON.stringify(val));
  },

  /* ══════════════════════════════════════════════════════════
     SETTINGS
  ══════════════════════════════════════════════════════════ */
  DEFAULT_SETTINGS: {
    apps_open:           true,
    military_open:       true,
    roster_public:       true,
    maintenance:         false,
    discord_invite:      'https://discord.gg/XR7h7Ybk5y',
    moodle_url:          'https://moodle.YOUR-DOMAIN.com',
    vatsim_client_id:    '',
    vatsim_oauth_on:     false,
    site_notice:         '',
    // Scheduled downtime
    downtime_scheduled:  false,
    downtime_start:      '',
    downtime_end:        '',
    downtime_reason:     'Scheduled maintenance',
    downtime_banner:     true,
  },
  settings() { return { ...this.DEFAULT_SETTINGS, ...this._load(this.K.SETTINGS, {}) }; },
  saveSetting(key, val) {
    const s = this.settings(); s[key] = val; this._save(this.K.SETTINGS, s);
  },
  saveSettings(obj) {
    const s = { ...this.settings(), ...obj };
    this._save(this.K.SETTINGS, s);
  },

  /* ══════════════════════════════════════════════════════════
     PILOTS
  ══════════════════════════════════════════════════════════ */
  DEFAULT_PILOTS: [
    { id:'QFV001', name:'President',      cid:'1870124', simbrief:'',  rating:'PPL (P1)', rank:'Chief Pilot',  div:'civilian', status:'active', joined:'2025-01-01' },
    { id:'QFV002', name:'Vice President', cid:'',        simbrief:'',  rating:'Training', rank:'Cadet',        div:'civilian', status:'active', joined:'2025-01-01' },
  ],
  pilots()       { return this._load(this.K.PILOTS, this.DEFAULT_PILOTS); },
  savePilots(p)  { this._save(this.K.PILOTS, p); },
  addPilot(p) {
    const all  = this.pilots();
    const nums = all.map(x => parseInt(x.id.replace('QFV',''))).filter(n => !isNaN(n));
    const next = (Math.max(0, ...nums) + 1).toString().padStart(3,'0');
    p.id     = 'QFV' + next;
    p.joined = p.joined || new Date().toISOString().split('T')[0];
    p.status = p.status || 'active';
    all.push(p);
    this.savePilots(all);
    return p;
  },
  updatePilot(id, data) { this.savePilots(this.pilots().map(p => p.id===id ? {...p,...data} : p)); },
  removePilot(id)        { this.savePilots(this.pilots().filter(p => p.id!==id)); },
  getPilot(cid)          { return this.pilots().find(p => p.cid===cid); },
  getPilotById(id)       { return this.pilots().find(p => p.id===id); },

  /* ══════════════════════════════════════════════════════════
     FLIGHTS
  ══════════════════════════════════════════════════════════ */
  flights()      { return this._load(this.K.FLIGHTS, []); },
  saveFlights(f) { this._save(this.K.FLIGHTS, f); },
  logFlight(f) {
    const all = this.flights();
    f.id     = Date.now().toString(36) + Math.random().toString(36).slice(2,5);
    f.logged = new Date().toISOString();
    f.fn     = (f.fn||'').toUpperCase().trim();
    f.dep    = (f.dep||'').toUpperCase().trim();
    f.arr    = (f.arr||'').toUpperCase().trim();
    all.unshift(f);
    this._save(this.K.FLIGHTS, all.slice(0, 2000));
    return f;
  },
  removeFlight(id)    { this.saveFlights(this.flights().filter(f => f.id!==id)); },
  flightsFor(pilotId) { return this.flights().filter(f => f.pilotId===pilotId); },
  recentFlights(days=90) {
    const cut = Date.now() - days*86400000;
    return this.flights().filter(f => new Date(f.logged).getTime() >= cut);
  },
  pilotStats(pilotId) {
    const all  = this.flightsFor(pilotId);
    const r90  = this.recentFlights(90).filter(f => f.pilotId===pilotId);
    const mins = all.reduce((s,f) => s + parseMins(f.block), 0);
    return { total:all.length, recent90:r90.length, hours:Math.floor(mins/60), mins:mins%60 };
  },
  networkStats() {
    const all   = this.flights();
    const r90   = this.recentFlights(90);
    const mins  = all.reduce((s,f) => s + parseMins(f.block), 0);
    const p90   = new Set(r90.map(f => f.pilotId)).size;
    return { total:all.length, recent90:r90.length, pilots90:p90, hours:Math.floor(mins/60) };
  },

  /* ══════════════════════════════════════════════════════════
     APPLICATIONS
  ══════════════════════════════════════════════════════════ */
  apps()      { return this._load(this.K.APPS, []); },
  submitApp(a) {
    const all = this.apps();
    a.id     = Date.now().toString(36);
    a.date   = new Date().toISOString().split('T')[0];
    a.status = 'pending';
    all.unshift(a);
    this._save(this.K.APPS, all);
    return a;
  },
  approveApp(id) {
    const all = this.apps();
    const app = all.find(a => a.id===id);
    if (!app) return null;
    app.status = 'approved';
    this._save(this.K.APPS, all);
    return this.addPilot({
      name: app.name, cid: app.cid, simbrief: app.simbrief||'',
      rating: 'Training (P0)', rank: 'Cadet', div: 'civilian',
      status: 'active', joined: app.date,
    });
  },
  rejectApp(id, reason='') {
    const all = this.apps();
    const app = all.find(a => a.id===id);
    if (app) { app.status='rejected'; app.rejectReason=reason; }
    this._save(this.K.APPS, all);
  },

  /* ══════════════════════════════════════════════════════════
     ANNOUNCEMENTS
  ══════════════════════════════════════════════════════════ */
  announcements()      { return this._load(this.K.ANNOUNCE, []); },
  addAnnouncement(a) {
    const all = this.announcements();
    a.id   = Date.now().toString(36);
    a.date = new Date().toISOString().split('T')[0];
    all.unshift(a);
    this._save(this.K.ANNOUNCE, all.slice(0,20));
  },
  removeAnnouncement(id) {
    this._save(this.K.ANNOUNCE, this.announcements().filter(a => a.id!==id));
  },

  /* ══════════════════════════════════════════════════════════
     SUPPORT TICKETS
  ══════════════════════════════════════════════════════════ */
  tickets()      { return this._load(this.K.TICKETS, []); },
  saveTickets(t) { this._save(this.K.TICKETS, t); },

  submitTicket(t) {
    const all = this.tickets();
    const num = (Math.max(0, ...all.map(x => parseInt(x.num)||0)) + 1)
                .toString().padStart(4,'0');
    t.id      = Date.now().toString(36) + Math.random().toString(36).slice(2,4);
    t.num     = num;
    t.date    = new Date().toISOString();
    t.status  = 'open';
    t.replies = [];
    all.unshift(t);
    this._save(this.K.TICKETS, all.slice(0, 500));
    return t;
  },

  getTicket(id) { return this.tickets().find(t => t.id===id); },

  updateTicket(id, data) {
    this.saveTickets(this.tickets().map(t => t.id===id ? {...t,...data} : t));
  },

  addReply(ticketId, reply) {
    const all = this.tickets();
    const t   = all.find(x => x.id===ticketId);
    if (!t) return;
    reply.date = new Date().toISOString();
    reply.id   = Date.now().toString(36);
    t.replies  = t.replies || [];
    t.replies.push(reply);
    if (reply.fromStaff && t.status==='open') t.status = 'replied';
    if (reply.fromStaff && t.status==='waiting') t.status = 'replied';
    this.saveTickets(all);
  },

  closeTicket(id)  { this.updateTicket(id, { status:'closed',  closedAt: new Date().toISOString() }); },
  reopenTicket(id) { this.updateTicket(id, { status:'open' }); },

  ticketsFor(cid) { return this.tickets().filter(t => t.cid===cid); },

  ticketStats() {
    const all = this.tickets();
    return {
      open:    all.filter(t => t.status==='open').length,
      replied: all.filter(t => t.status==='replied').length,
      waiting: all.filter(t => t.status==='waiting').length,
      closed:  all.filter(t => t.status==='closed').length,
      total:   all.length,
    };
  },
};

/* ── SHARED HELPERS ──────────────────────────────────────── */
function parseMins(block) {
  if (!block) return 0;
  const m = String(block).match(/(\d+)h\s*(\d+)?m?/);
  return m ? parseInt(m[1]||0)*60 + parseInt(m[2]||0) : 0;
}
function fmtHours(mins) { return `${Math.floor(mins/60)}h ${mins%60}m`; }
function today()        { return new Date().toISOString().split('T')[0]; }
function fmtDate(iso)   {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-AU', {day:'2-digit',month:'short',year:'numeric'}); }
  catch { return iso; }
}
function fmtDateTime(iso) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-AU', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}); }
  catch { return iso; }
}
function timeAgo(iso) {
  if (!iso) return '';
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d/60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}

/* ── DOWNTIME CHECK ──────────────────────────────────────── */
function checkDowntime() {
  const s = DB.settings();
  if (!s.downtime_scheduled) return null;
  const now   = Date.now();
  const start = new Date(s.downtime_start).getTime();
  const end   = new Date(s.downtime_end).getTime();
  if (!start || !end) return null;
  if (now >= start && now <= end) return { active: true, end: s.downtime_end, reason: s.downtime_reason };
  if (now < start) return { active: false, start: s.downtime_start, end: s.downtime_end, reason: s.downtime_reason };
  return null;
}
