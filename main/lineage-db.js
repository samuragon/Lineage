/* =====================================================================
   LINEAGE — SHARED JSON "DATABASE"
   ---------------------------------------------------------------------
   Everything the app needs (accounts, employees, role history, session)
   lives in ONE JSON object, persisted to localStorage under LS_KEY.
   Every page (landing, login/register, dashboard, profile) includes
   this file and talks to it through the `DB` object below — nothing
   reads or writes hardcoded arrays anymore.

   NOTE: this is a client-side demo "database" (JSON in localStorage),
   not a real server + real password hashing. Good for prototyping /
   demoing the product end-to-end in a browser with no backend.
===================================================================== */

const LS_KEY = 'lineage_db_v1';
const DEMO_PASSWORD = 'Lineage123!';

/* ---------------------- seed data (first run only) ------------------- */
function seedDatabase() {
  return {
    currentUserId: null,
    importLog: [],

    roles: [
      { id: 'role-se', title: 'Software Engineer', department: 'Technology', history: [
        { year: 2022, title: 'Junior Software Engineer', reportingTo: 'Nadia Rahman (Eng. Manager)', headcount: 3, occupant: 'amir', event: 'Role created' },
        { year: 2023, title: 'Junior Software Engineer', reportingTo: 'Nadia Rahman (Eng. Manager)', headcount: 4, occupant: 'amir', event: 'Headcount increased' },
        { year: 2024, title: 'Software Engineer', reportingTo: 'Farid Iskandar (Tech Lead)', headcount: 5, occupant: 'amir', event: 'Redesignated; reporting line moved to Tech Lead' },
        { year: 2025, title: 'Senior Software Engineer', reportingTo: 'Farid Iskandar (Tech Lead)', headcount: null, occupant: 'amir', event: 'Title promoted — headcount not yet reported' },
      ]},
      { id: 'role-pm', title: 'Product Manager', department: 'Product', history: [
        { year: 2022, title: 'Associate Product Manager', reportingTo: 'Suresh Kumar (Head of Product)', headcount: 2, occupant: 'ain', event: 'Role created' },
        { year: 2023, title: 'Product Manager', reportingTo: 'Suresh Kumar (Head of Product)', headcount: 2, occupant: 'ain', event: 'Promotion' },
        { year: 2024, title: 'Product Manager', reportingTo: null, headcount: 3, occupant: 'ain', event: 'Reporting line vacant — Head of Product role open' },
        { year: 2025, title: 'Senior Product Manager', reportingTo: 'Wei Ling (VP Product)', headcount: 3, occupant: 'ain', event: 'Reporting line moved to VP Product' },
      ]},
      { id: 'role-ds', title: 'Data Analyst', department: 'Technology', history: [
        { year: 2023, title: 'Data Analyst', reportingTo: 'Farid Iskandar (Tech Lead)', headcount: 2, occupant: 'haziq', event: 'Role created' },
        { year: 2024, title: 'Data Analyst', reportingTo: 'Farid Iskandar (Tech Lead)', headcount: 2, occupant: null, event: 'No occupant on file for this year' },
        { year: 2025, title: 'Senior Data Analyst', reportingTo: 'Farid Iskandar (Tech Lead)', headcount: 2, occupant: 'haziq', event: 'Promotion; role re-filled' },
      ]},
    ],

    employees: [
      mkUser({ id:'zul', name:'Zul Hassan', title:'CEO', department:'Leadership', managerId:null, joinYear:2019, joinDate:'11 Feb 2019', salary:'$9,200', status:'Active',
        leaveBalance:18, leaveTaken:4, attendanceRate:98, leaveRequests:[], performanceReviews:[],
        history:[{year:2019, title:'CEO', department:'Leadership', manager:null, event:'Founded / took over leadership'}] }),

      mkUser({ id:'farid', name:'Farid Iskandar', title:'Tech Lead', department:'Technology', managerId:'zul', joinYear:2020, joinDate:'03 Jun 2020', salary:'$5,400', status:'Active',
        leaveBalance:10, leaveTaken:8, attendanceRate:95,
        leaveRequests:[{type:'Annual leave', dates:'12–14 Aug 2026', status:'approved'}],
        performanceReviews:[{cycle:'H1 2026', score:4.5, reviewer:'Zul Hassan', summary:'Strong technical leadership through the platform migration.'}],
        history:[
          {year:2020, title:'Senior Software Engineer', department:'Engineering', manager:'Zul Hassan', event:'Joined'},
          {year:2023, title:'Tech Lead', department:'Technology', manager:'Zul Hassan', event:'Promoted; took reporting line for Engineering redesign'},
        ]}),

      mkUser({ id:'weiling', name:'Wei Ling', title:'VP Product', department:'Product', managerId:'zul', joinYear:2021, joinDate:'20 Sep 2021', salary:'$6,800', status:'Active',
        leaveBalance:14, leaveTaken:3, attendanceRate:97, leaveRequests:[],
        performanceReviews:[{cycle:'H1 2026', score:4.7, reviewer:'Zul Hassan', summary:'Rebuilt the product org after the Head of Product departure.'}],
        history:[
          {year:2021, title:'Senior Product Manager', department:'Product', manager:'Suresh Kumar', event:'Joined'},
          {year:2025, title:'VP Product', department:'Product', manager:'Zul Hassan', event:'Promoted after Suresh Kumar departed'},
        ]}),

      mkUser({ id:'nadia', name:'Nadia Rahman', title:'Engineering Manager', department:'Technology', managerId:'zul', joinYear:2019, joinDate:'02 Apr 2019', salary:'$5,100', status:'On Leave',
        leaveBalance:6, leaveTaken:12, attendanceRate:89,
        leaveRequests:[{type:'Medical leave', dates:'2–3 Jul 2026', status:'approved'}],
        performanceReviews:[{cycle:'H2 2025', score:3.2, reviewer:'Zul Hassan', summary:'Team restructured; direct reports moved under the new Tech Lead line.'}],
        history:[
          {year:2019, title:'Engineering Manager', department:'Engineering', manager:'Zul Hassan', event:'Joined'},
          {year:2024, title:'Engineering Manager', department:'Engineering', manager:'Zul Hassan', event:'Team moved under Tech Lead reporting line — 0 direct reports currently'},
        ]}),

      mkUser({ id:'amir', name:'Amir Mahmud', title:'Senior Software Engineer', department:'Technology', managerId:'farid', joinYear:2022, joinDate:'14 Mar 2022', salary:'$3,600', status:'Active',
        leaveBalance:9, leaveTaken:6, attendanceRate:96,
        leaveRequests:[
          {type:'Annual leave', dates:'20–22 Aug 2026', status:'pending'},
          {type:'Annual leave', dates:'3–5 Mar 2026', status:'approved'},
        ],
        performanceReviews:[
          {cycle:'H1 2026', score:4.3, reviewer:'Farid Iskandar', summary:'Promoted to Senior; led the redesignation of the SE role cleanly.'},
          {cycle:'H2 2025', score:4.0, reviewer:'Farid Iskandar', summary:'Consistent delivery, ready for more scope.'},
        ],
        history:[
          { year:2022, title:'Junior Software Engineer', department:'Engineering', manager:'Nadia Rahman', event:'Joined as Junior Software Engineer' },
          { year:2023, title:'Junior Software Engineer', department:'Engineering', manager:'Nadia Rahman', event:'Confirmed after probation' },
          { year:2024, title:'Software Engineer', department:'Technology', manager:'Farid Iskandar', event:'Transferred from Engineering to Technology + promoted' },
          { year:2025, title:'Senior Software Engineer', department:'Technology', manager:null, event:'Promoted to Senior — manager record missing for 2025' },
        ],
        bio:'Admin overseeing HR operations and people analytics at Lineage.', location:'Kuala Lumpur, MY' }),

      mkUser({ id:'haziq', name:'Haziq', title:'Senior Data Analyst', department:'Technology', managerId:'farid', joinYear:2023, joinDate:'07 Jan 2023', salary:'$3,300', status:'Active',
        leaveBalance:15, leaveTaken:2, attendanceRate:99,
        leaveRequests:[{type:'Annual leave', dates:'1–2 Sep 2026', status:'pending'}],
        performanceReviews:[{cycle:'H1 2026', score:4.6, reviewer:'Farid Iskandar', summary:'Promoted to Senior; strongest data quality record on the team.'}],
        history:[
          { year:2023, title:'Data Analyst', department:'Technology', manager:'Farid Iskandar', event:'Joined as Data Analyst' },
          { year:2025, title:'Senior Data Analyst', department:'Technology', manager:'Farid Iskandar', event:'Promoted to Senior — 2024 record missing entirely' },
        ]}),

      mkUser({ id:'ain', name:'Ain', title:'Senior Product Manager', department:'Product', managerId:'weiling', joinYear:2022, joinDate:'29 Oct 2022', salary:'$4,200', status:'On Leave',
        leaveBalance:11, leaveTaken:5, attendanceRate:94,
        leaveRequests:[{type:'Annual leave', dates:'15–19 Sep 2026', status:'rejected'}],
        performanceReviews:[
          {cycle:'H1 2026', score:4.4, reviewer:'Wei Ling', summary:'Promoted to Senior; owns the roadmap end to end now.'},
          {cycle:'H2 2025', score:3.8, reviewer:'Suresh Kumar', summary:'Solid quarter despite manager transition.'},
        ],
        history:[
          { year:2022, title:'Associate Product Manager', department:'Product', manager:'Suresh Kumar', event:'Joined as Associate PM' },
          { year:2023, title:'Product Manager', department:'Product', manager:'Suresh Kumar', event:'Promoted to Product Manager' },
          { year:2024, title:'Product Manager', department:'Product', manager:null, event:'Manager departed; backfill pending' },
          { year:2025, title:'Senior Product Manager', department:'Product', manager:'Wei Ling', event:'Promoted; now reports to VP Product' },
        ]}),
    ],
  };
}

/* fills in the account-side fields (email/password/prefs/etc.) that
   every user needs, shared by all seeded employees */
function mkUser(base) {
  const first = base.name.split(' ')[0].toLowerCase();
  return Object.assign({
    email: `${first}@lineage.io`,
    password: DEMO_PASSWORD,
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur, MY',
    bio: `${base.title} at Lineage.`,
    language: 'English',
    timezone: 'GMT+8 — Kuala Lumpur',
    notifications: { leaveRequests:true, performanceReviews:true, orgChanges:false, weeklyDigest:true, desktop:true, mobilePush:false },
    security: { authApp:true, sms:false, loginAlerts:true },
    sessions: [{ device:'This browser', location:'Kuala Lumpur, MY', when:'Active now', current:true }],
    createdAt: new Date().toISOString(),
  }, base);
}

/* ------------------------------ storage ------------------------------ */
function loadDB() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.warn('Lineage DB: failed to parse stored JSON, reseeding.', e); }
  const fresh = seedDatabase();
  saveDB(fresh);
  return fresh;
}

function saveDB(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

/* -------------------------------- API --------------------------------- */
const DB = {

  /** returns the whole JSON database */
  getDB() { return loadDB(); },

  /** overwrite the whole JSON database (e.g. after an import) */
  setDB(db) { saveDB(db); },

  /** raw JSON string of the database — useful for exporting / inspecting */
  exportJSON() { return JSON.stringify(loadDB(), null, 2); },

  /** wipes everything and reseeds the demo data */
  resetDB() { const fresh = seedDatabase(); saveDB(fresh); return fresh; },

  getRoles() { return loadDB().roles; },

  getEmployees() { return loadDB().employees; },

  getImportLog() { return loadDB().importLog || []; },

  /**
   * Upserts a batch of plain-object records (as parsed from an HR CSV)
   * into the JSON employee table. Recognised keys per record: name,
   * email, title, department, managerEmail, joinDate, salary, status.
   * Existing employees are matched — and updated — by email; anything
   * new is created with default account fields.
   * Returns {ok, added, updated, errors, total}.
   */
  importEmployees(records, fileName) {
    const db = loadDB();
    let added = 0, updated = 0;
    const errors = [];

    (records || []).forEach((r, idx) => {
      const rowNum = idx + 2; // +1 header row, +1 to make it 1-based
      const email = (r.email || '').trim().toLowerCase();
      const name = (r.name || '').trim();
      if (!email || !name) {
        errors.push(`Row ${rowNum}: missing "name" or "email" — skipped.`);
        return;
      }

      const existing = db.employees.find(e => e.email.toLowerCase() === email);
      const managerEmail = r.managerEmail ? r.managerEmail.trim().toLowerCase() : null;

      if (existing) {
        if (r.name) existing.name = r.name.trim();
        if (r.title) existing.title = r.title.trim();
        if (r.department) existing.department = r.department.trim();
        if (r.joinDate) existing.joinDate = r.joinDate.trim();
        if (r.salary) existing.salary = r.salary.trim();
        if (r.status) existing.status = r.status.trim();
        if (managerEmail) existing._pendingManagerEmail = managerEmail;
        updated++;
      } else {
        const id = 'csv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + idx;
        const newEmp = mkUser({
          id, name, email,
          title: (r.title || 'Employee').trim(),
          department: (r.department || 'Unassigned').trim(),
          managerId: null,
          joinYear: r.joinDate ? (new Date(r.joinDate).getFullYear() || new Date().getFullYear()) : new Date().getFullYear(),
          joinDate: (r.joinDate && r.joinDate.trim()) || new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),
          salary: (r.salary || '—').trim(),
          status: (r.status || 'Active').trim(),
          leaveRequests: [], performanceReviews: [],
          history: [{ year: new Date().getFullYear(), title: (r.title || 'Employee').trim(), department: (r.department || 'Unassigned').trim(), manager: null, event: 'Imported via CSV' }],
        });
        if (managerEmail) newEmp._pendingManagerEmail = managerEmail;
        db.employees.push(newEmp);
        added++;
      }
    });

    // second pass: resolve manager-by-email references into managerId now that everyone exists
    db.employees.forEach(e => {
      if (e._pendingManagerEmail) {
        const mgr = db.employees.find(m => m.email.toLowerCase() === e._pendingManagerEmail);
        if (mgr) e.managerId = mgr.id;
        else errors.push(`"${e.name}": manager email "${e._pendingManagerEmail}" not found — left unassigned.`);
        delete e._pendingManagerEmail;
      }
    });

    db.importLog = db.importLog || [];
    db.importLog.unshift({
      fileName: fileName || 'import.csv',
      when: new Date().toISOString(),
      added, updated, errorCount: errors.length,
    });
    db.importLog = db.importLog.slice(0, 10);

    saveDB(db);
    return { ok: true, added, updated, errors, total: db.employees.length };
  },

  findByEmail(email) {
    if (!email) return null;
    const db = loadDB();
    return db.employees.find(e => e.email.toLowerCase() === email.toLowerCase()) || null;
  },

  /** returns {ok:true, user} or {ok:false, error} */
  login(email, password) {
    const db = loadDB();
    const user = db.employees.find(e => e.email.toLowerCase() === (email || '').toLowerCase());
    if (!user) return { ok:false, error:'No account found with that email.' };
    if (user.password !== password) return { ok:false, error:'Incorrect password.' };
    db.currentUserId = user.id;
    saveDB(db);
    return { ok:true, user };
  },

  /** returns {ok:true, user} or {ok:false, error} */
  register({ name, email, password }) {
    const db = loadDB();
    if (!name || !email || !password) return { ok:false, error:'Please fill in every field.' };
    if (db.employees.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      return { ok:false, error:'An account with that email already exists.' };
    }
    const id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const newUser = mkUser({
      id, name, email, password,
      title:'New Employee', department:'Unassigned', managerId:null,
      joinYear:new Date().getFullYear(), joinDate:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),
      salary:'—', status:'Active',
      leaveBalance:14, leaveTaken:0, attendanceRate:100,
      leaveRequests:[], performanceReviews:[],
      history:[{ year:new Date().getFullYear(), title:'New Employee', department:'Unassigned', manager:null, event:'Joined via self sign-up' }],
    });
    db.employees.push(newUser);
    db.currentUserId = newUser.id;
    saveDB(db);
    return { ok:true, user:newUser };
  },

  logout() {
    const db = loadDB();
    db.currentUserId = null;
    saveDB(db);
  },

  isLoggedIn() { return !!loadDB().currentUserId; },

  getCurrentUser() {
    const db = loadDB();
    if (!db.currentUserId) return null;
    return db.employees.find(e => e.id === db.currentUserId) || null;
  },

  /** merges `patch` into the logged-in user's record and persists it */
  updateCurrentUser(patch) {
    const db = loadDB();
    const idx = db.employees.findIndex(e => e.id === db.currentUserId);
    if (idx === -1) return { ok:false, error:'Not logged in.' };
    db.employees[idx] = Object.assign({}, db.employees[idx], patch);
    saveDB(db);
    return { ok:true, user: db.employees[idx] };
  },

  /** returns {ok:true} or {ok:false, error} */
  changePassword(currentPassword, newPassword) {
    const db = loadDB();
    const idx = db.employees.findIndex(e => e.id === db.currentUserId);
    if (idx === -1) return { ok:false, error:'Not logged in.' };
    if (db.employees[idx].password !== currentPassword) return { ok:false, error:'Current password is incorrect.' };
    if (!newPassword || newPassword.length < 8) return { ok:false, error:'New password must be at least 8 characters.' };
    db.employees[idx].password = newPassword;
    saveDB(db);
    return { ok:true };
  },

  deleteCurrentUser() {
    const db = loadDB();
    db.employees = db.employees.filter(e => e.id !== db.currentUserId);
    db.currentUserId = null;
    saveDB(db);
  },

  /** call at the top of protected pages; sends the visitor to `redirectTo` if not logged in */
  requireAuth(redirectTo) {
    if (!this.isLoggedIn()) {
      window.location.href = redirectTo || 'loginregister.html';
      return null;
    }
    return this.getCurrentUser();
  },

  initials(name) {
    return (name || '?').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  },
};

// make sure the DB exists as soon as this script loads
loadDB();