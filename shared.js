// QFV Shared Logic — loaded on every page
// No DOM injection. Nav is inline HTML. This handles interactivity only.

const QFV = {
  ADMIN_CID: '1870124',
  CONTACTS: { p: atob('c291dGhlZXdlc3R5MTIzQGdtYWlsLmNvbQ=='), v: atob('U2ZsZWlzaG1hbkBkYXZpbmZvcmdlLmNvbQ==') },

  // ── SESSION ───────────────────────────────────────────
  session: {
    get cid(){ return sessionStorage.getItem('qfv_cid')||'' },
    get name(){ return sessionStorage.getItem('qfv_name')||'' },
    get logged(){ return !!sessionStorage.getItem('qfv_cid') },
    isAdmin(){ return sessionStorage.getItem('qfv_cid') === QFV.ADMIN_CID },
    login(cid, name){ sessionStorage.setItem('qfv_cid',cid); sessionStorage.setItem('qfv_name',name); },
    logout(){ sessionStorage.removeItem('qfv_cid'); sessionStorage.removeItem('qfv_name'); location.reload(); }
  },

  // ── FLIGHT LOG (localStorage) ──────────────────────
  flights: {
    KEY: 'qfv_flights',
    getAll(){
      try { return JSON.parse(localStorage.getItem(this.KEY)||'[]'); } catch(e){ return []; }
    },
    add(f){
      const all = this.getAll();
      f.id = Date.now().toString();
      f.logged = new Date().toISOString().split('T')[0];
      all.unshift(f);
      localStorage.setItem(this.KEY, JSON.stringify(all.slice(0,500)));
      return f;
    },
    remove(id){
      const all = this.getAll().filter(f=>f.id!==id);
      localStorage.setItem(this.KEY, JSON.stringify(all));
    },
    stats(){
      const all = this.getAll();
      const now = new Date(); const d90 = new Date(now - 90*86400000);
      const recent = all.filter(f => new Date(f.logged) >= d90);
      const totalMins = all.reduce((s,f)=>s+QFV.flights.parseMins(f.block),0);
      return { total: all.length, recent: recent.length, hours: Math.floor(totalMins/60), mins: totalMins%60 };
    },
    parseMins(block){
      if(!block) return 0;
      const m = block.match(/(\d+)h\s*(\d+)?m?/);
      if(!m) return 0;
      return parseInt(m[1]||0)*60 + parseInt(m[2]||0);
    }
  },

  // ── ROSTER (localStorage) ─────────────────────────
  roster: {
    KEY: 'qfv_roster',
    DEFAULT: [
      {id:'QFV001',name:'President',cid:'1870124',rating:'PPL (P1)',rank:'Chief Pilot',status:'active'},
      {id:'QFV002',name:'Vice President',cid:'—',rating:'Training (P0)',rank:'Cadet',status:'active'},
      {id:'QFV003',name:'Pilot 3',cid:'—',rating:'Training (P0)',rank:'Cadet',status:'active'},
      {id:'QFV004',name:'Pilot 4',cid:'—',rating:'Training (P0)',rank:'Cadet',status:'active'},
      {id:'QFV005',name:'Pilot 5',cid:'—',rating:'Training (P0)',rank:'Cadet',status:'active'},
    ],
    getAll(){
      try { return JSON.parse(localStorage.getItem(this.KEY))||this.DEFAULT; } catch(e){ return this.DEFAULT; }
    },
    save(roster){ localStorage.setItem(this.KEY, JSON.stringify(roster)); },
    add(p){ const r=this.getAll(); r.push(p); this.save(r); },
    remove(id){ this.save(this.getAll().filter(p=>p.id!==id)); },
    update(id, data){ this.save(this.getAll().map(p=>p.id===id?{...p,...data}:p)); }
  },

  // ── COOKIE CONSENT ────────────────────────────────
  cookies: {
    accepted(){ return localStorage.getItem('qfv_cc') },
    accept(){ localStorage.setItem('qfv_cc','1'); QFV.ui.hideCookieBanner(); },
    decline(){ localStorage.setItem('qfv_cc','0'); QFV.ui.hideCookieBanner(); }
  },

  // ── UI HELPERS ────────────────────────────────────
  ui: {
    hideCookieBanner(){ const b=document.getElementById('cookie-banner'); if(b) b.style.display='none'; },
    showModal(id){ const m=document.getElementById(id); if(m){ m.style.display='flex'; m.offsetHeight; m.classList.add('open'); }},
    hideModal(id){ const m=document.getElementById(id); if(m){ m.classList.remove('open'); setTimeout(()=>m.style.display='none',250); }},
    toast(msg, type='success'){
      const t = document.createElement('div');
      t.className = 'qfv-toast ' + type;
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(()=>t.classList.add('show'),10);
      setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, 3200);
    }
  },

  // ── INIT ──────────────────────────────────────────
  init(){
    // Update nav login state
    const loginBtn = document.getElementById('nav-login-btn');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const adminBadge = document.getElementById('nav-admin-badge');
    if(this.session.logged){
      if(loginBtn) loginBtn.style.display='none';
      if(logoutBtn){ logoutBtn.style.display='flex'; logoutBtn.textContent='↩ '+this.session.cid.slice(-4); }
      if(adminBadge && this.session.isAdmin()) adminBadge.style.display='flex';
    } else {
      if(loginBtn) loginBtn.style.display='flex';
      if(logoutBtn) logoutBtn.style.display='none';
      if(adminBadge) adminBadge.style.display='none';
    }
    // Cookie banner
    if(!this.cookies.accepted()){
      const b = document.getElementById('cookie-banner');
      if(b) b.style.display='flex';
    }
    // Admin panel
    if(this.session.isAdmin()){
      const ap = document.getElementById('admin-panel');
      if(ap) ap.style.display='block';
    }
    // Scroll animations
    this.initAOS();
    // Accordion
    this.initAccordion();
    // Active nav link
    const page = location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.nav-link').forEach(a=>{
      if(a.getAttribute('href')===page) a.classList.add('active');
    });
  },

  initAOS(){
    const els = document.querySelectorAll('[data-aos]');
    if(!els.length) return;
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('aos-in'); obs.unobserve(e.target); }});
    },{threshold:0.08});
    els.forEach(el=>obs.observe(el));
  },

  initAccordion(){
    document.querySelectorAll('.acc-head').forEach(h=>{
      h.addEventListener('click',()=>{
        const b=h.nextElementSibling;
        const open=b.classList.contains('open');
        document.querySelectorAll('.acc-body').forEach(x=>x.classList.remove('open'));
        document.querySelectorAll('.acc-head').forEach(x=>x.classList.remove('open'));
        if(!open){ b.classList.add('open'); h.classList.add('open'); }
      });
    });
  }
};

// Login form handler
function qfvLogin(e){
  e.preventDefault();
  const cid = document.getElementById('login-cid').value.trim();
  const name = document.getElementById('login-name').value.trim();
  if(!/^\d{6,8}$/.test(cid)){
    document.getElementById('login-err').textContent='Invalid CID — must be 6–8 digits';
    document.getElementById('login-err').style.display='block';
    return;
  }
  QFV.session.login(cid, name);
  QFV.ui.hideModal('login-modal');
  setTimeout(()=>location.reload(), 200);
}

// Contact form
function qfvContact(e){
  e.preventDefault();
  const name=document.getElementById('cf-name').value.trim();
  const cid=document.getElementById('cf-cid').value.trim();
  const cat=document.getElementById('cf-cat').value;
  const subj=document.getElementById('cf-subj').value.trim();
  const msg=document.getElementById('cf-msg').value.trim();
  const urgent=['Appeal a Decision','Complaint / Report','Partnership Proposal'];
  const to = urgent.includes(cat) ? QFV.CONTACTS.p : QFV.CONTACTS.v;
  const body=encodeURIComponent(`Name: ${name}\nVATSIM CID: ${cid||'N/A'}\nCategory: ${cat}\n\n${msg}\n\n---\nQFV Support Form`);
  const subject=encodeURIComponent(`[QFV ${cat}] ${subj}`);
  window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
  QFV.ui.toast('Email client opening — send the pre-filled message from there.');
}

// Tab switcher
function qfvTab(group, id, btn){
  document.querySelectorAll(`[data-group="${group}"]`).forEach(p=>p.hidden=true);
  document.querySelectorAll(`[data-tbg="${group}"]`).forEach(b=>b.classList.remove('active'));
  const p=document.getElementById(`tab-${id}`);
  if(p) p.hidden=false;
  if(btn) btn.classList.add('active');
}

window.addEventListener('DOMContentLoaded', ()=>QFV.init());
