/* ============================================
   ZEUS PDM v2 — Firebase Edition
   Real-time sync across all devices
   Google Sign-In + Email Verification
   ============================================ */

// ====== FIREBASE CONFIG (Your Project) ======
var firebaseConfig = {
  apiKey: "AIzaSyDeYimmmxGHwX8884bYvRd5zCFDFkl155M",
  authDomain: "zeus-pdm.firebaseapp.com",
  projectId: "zeus-pdm",
  storageBucket: "zeus-pdm.firebasestorage.app",
  messagingSenderId: "728784954995",
  appId: "1:728784954995:web:0e7c63ef92660d96f1ac06",
  measurementId: "G-JWVH6LTE1Q"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

// Enable offline + multi-tab sync
db.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
  console.log('Firestore persistence:', err.code);
});

// ====== STATE ======
var STATE = {
  users: [], currentUser: null, products: [], orders: [],
  payments: [], deposits: [], withdrawals: [], favorites: [],
  tickets: [], notifications: [], announcements: [], chatMessages: [],
  _initialized: false
};

// ====== UTILITIES ======
function uid() { return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2,8); }
function sClass(s) {
  if (s === 'Pending' || s === 'OPEN' || s === 'PENDING') return 'status-pending';
  if (s === 'Approved' || s === 'Delivered' || s === 'Completed' || s === 'RESOLVED' || s === 'VERIFIED' || s === 'PAID' || s === 'Completed') return 'status-approved';
  if (s === 'Rejected' || s === 'REJECTED') return 'status-rejected';
  return 'status-pending';
}
function closeModal(id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; }

function showToast(msg, type) {
  var c = document.getElementById('toastContainer');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  var i = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  t.innerHTML = '<i class="fas ' + i + '"></i> ' + msg;
  c.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0'; t.style.transform = 'translateX(100%)';
    t.style.transition = 'all 0.3s';
    setTimeout(function() { t.remove(); }, 300);
  }, 4000);
}
function copyText(text) {
  if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { showToast('Copied!', 'success'); }); }
  else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('Copied!', 'success'); }
}
function hideLoading() {
  var ls = document.getElementById('loadingScreen');
  if (ls) { ls.style.opacity = '0'; ls.style.transition = 'opacity 0.5s'; setTimeout(function() { ls.style.display = 'none'; }, 500); }
}
function docToObj(doc) { var d = doc.data(); d.id = doc.id; return d; }

// ====== FIREBASE REAL-TIME LISTENERS ======
function startListeners() {
  if (STATE._initialized) return;
  STATE._initialized = true;

  db.collection('products').onSnapshot(function(snap) {
    snap.docChanges().forEach(function(c) {
      if (c.type === 'added' || c.type === 'modified') {
        var p = docToObj(c.doc);
        var found = false;
        for (var i = 0; i < STATE.products.length; i++) {
          if (STATE.products[i].id === p.id) { STATE.products[i] = p; found = true; break; }
        }
        if (!found) STATE.products.push(p);
      }
      if (c.type === 'removed') STATE.products = STATE.products.filter(function(p) { return p.id !== c.doc.id; });
    });
    var a = document.querySelector('.page.active');
    if (a) { if (a.id === 'page-marketplace') renderMarket(); if (a.id === 'page-welcome') renderFeatured(); }
    updateUI();
  });

  db.collection('users').onSnapshot(function(snap) {
    STATE.users = [];
    snap.forEach(function(doc) { STATE.users.push(docToObj(doc)); });
    updateUI();
  });

  db.collection('orders').onSnapshot(function(snap) {
    STATE.orders = [];
    snap.forEach(function(doc) { STATE.orders.push(docToObj(doc)); });
    var a = document.querySelector('.page.active');
    if (a) { if (a.id === 'page-orders') renderOrders(); if (a.id === 'page-admin') { var t = document.querySelector('.admin-tab.active'); if (t) switchAdmin(t.textContent.trim().toLowerCase()); } }
    updateUI(); renderWalletHistory();
  });

  db.collection('payments').onSnapshot(function(snap) {
    STATE.payments = [];
    snap.forEach(function(doc) { STATE.payments.push(docToObj(doc)); });
  });

  db.collection('deposits').onSnapshot(function(snap) {
    STATE.deposits = [];
    snap.forEach(function(doc) { STATE.deposits.push(docToObj(doc)); });
  });

  db.collection('withdrawals').onSnapshot(function(snap) {
    STATE.withdrawals = [];
    snap.forEach(function(doc) { STATE.withdrawals.push(docToObj(doc)); });
  });

  db.collection('tickets').onSnapshot(function(snap) {
    STATE.tickets = [];
    snap.forEach(function(doc) { STATE.tickets.push(docToObj(doc)); });
  });

  db.collection('favorites').onSnapshot(function(snap) {
    STATE.favorites = [];
    snap.forEach(function(doc) { STATE.favorites.push(docToObj(doc)); });
  });

  db.collection('notifications').onSnapshot(function(snap) {
    STATE.notifications = [];
    snap.forEach(function(doc) { STATE.notifications.push(docToObj(doc)); });
    updateUI();
    var a = document.querySelector('.page.active');
    if (a && a.id === 'page-notifications' && STATE.currentUser) renderNotifications();
  });

  db.collection('announcements').onSnapshot(function(snap) {
    STATE.announcements = [];
    snap.forEach(function(doc) { STATE.announcements.push(docToObj(doc)); });
    renderAnnouncements();
  });

  db.collection('chatMessages').orderBy('date').onSnapshot(function(snap) {
    STATE.chatMessages = [];
    snap.forEach(function(doc) { STATE.chatMessages.push(docToObj(doc)); });
    var a = document.querySelector('.page.active');
    if (a && a.id === 'page-chat') renderChat();
  });
}

// ====== SEED PRODUCTS (runs once) ======
function seedProducts() {
  db.collection('products').limit(1).get().then(function(snap) {
    if (!snap.empty) return;
    var products = [
      { lid:'0001', title:'Facebook Profile (1 Year Active)', cat:'Facebook Profile', price:1000, desc:'Aged Facebook profile, 1 year old, active user with posts. Transfer permitted. Email and password included. Good for advertising and networking.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 1*86400000).toISOString(), sales:0 },
      { lid:'0002', title:'Facebook Profile (2 Years Aged)', cat:'Facebook Profile', price:2000, desc:'Well-established Facebook profile with 2 years of activity. Friends, photos, timeline intact.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 2*86400000).toISOString(), sales:0 },
      { lid:'0003', title:'Instagram Business Profile', cat:'Instagram Business', price:2500, desc:'Instagram business account with followers and engagement. Perfect for affiliate marketing.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 3*86400000).toISOString(), sales:0 },
      { lid:'0004', title:'Telegram Channel (1,000+ Members)', cat:'Telegram Channel', price:3000, desc:'Active Telegram channel with 1000+ real members. Niche topic with high engagement.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 4*86400000).toISOString(), sales:0 },
      { lid:'0005', title:'Telegram Account (Aged 2 Years)', cat:'Telegram Account', price:1500, desc:'Aged Telegram account with groups and contacts. Includes cloud chat history.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 5*86400000).toISOString(), sales:0 },
      { lid:'0006', title:'WhatsApp Account (Business Ready)', cat:'WhatsApp Account', price:1800, desc:'WhatsApp account ready for business use. Verified with SMS. Can be linked to WhatsApp Business API.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.9, seller:'zeus_admin', date:new Date(Date.now() - 6*86400000).toISOString(), sales:0 },
      { lid:'0007', title:'TikTok Creator Account (5K Followers)', cat:'TikTok Account', price:3500, desc:'TikTok creator account with 5,000+ followers. Monetization eligible.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 7*86400000).toISOString(), sales:0 },
      { lid:'0008', title:'Facebook Business Page (10K Likes)', cat:'Facebook Page', price:4000, desc:'Facebook business page with 10,000+ page likes. Admin access transferred.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 8*86400000).toISOString(), sales:0 },
      { lid:'0009', title:'Twitter/X Account (Aged + Followers)', cat:'Twitter Account', price:2000, desc:'Aged Twitter/X account with organic followers. Good reputation score.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.2, seller:'zeus_admin', date:new Date(Date.now() - 9*86400000).toISOString(), sales:0 },
      { lid:'0010', title:'YouTube Channel (1,000 Subs)', cat:'YouTube Channel', price:5000, desc:'YouTube channel with 1,000+ subscribers. Monetization eligible. Full admin access.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:3, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 10*86400000).toISOString(), sales:0 },
      { lid:'0011', title:'LinkedIn Premium Account', cat:'LinkedIn Account', price:3000, desc:'LinkedIn Premium account with sales navigator. Great for B2B.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 11*86400000).toISOString(), sales:0 },
      { lid:'0012', title:'TikTok Music Promotion (5K Plays)', cat:'Promotion Services', price:2500, desc:'Promote your music on TikTok with 5,000+ guaranteed plays.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 12*86400000).toISOString(), sales:0 },
      { lid:'0013', title:'Instagram Story Ads Design', cat:'Design Services', price:1500, desc:'Professional Instagram Story ad design. Animated or static.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 13*86400000).toISOString(), sales:0 },
      { lid:'0014', title:'Snapchat Account (Aged)', cat:'Snapchat Account', price:1200, desc:'Aged Snapchat account with streaks and friends.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.1, seller:'zeus_admin', date:new Date(Date.now() - 14*86400000).toISOString(), sales:0 },
      { lid:'0015', title:'Facebook Group (5K Members)', cat:'Facebook Group', price:3500, desc:'Facebook group with 5,000+ members in a specific niche.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 15*86400000).toISOString(), sales:0 },
      { lid:'0016', title:'Pinterest Business Account', cat:'Pinterest Account', price:1800, desc:'Pinterest business account with boards and followers.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 16*86400000).toISOString(), sales:0 },
      { lid:'0017', title:'WhatsApp Group Invites (100)', cat:'Promotion Services', price:2000, desc:'100 WhatsApp group invite links in your niche.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 17*86400000).toISOString(), sales:0 },
      { lid:'0018', title:'Telegram Stars / Premium', cat:'Telegram Account', price:2500, desc:'Telegram account with premium features.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 18*86400000).toISOString(), sales:0 },
      { lid:'0019', title:'TikTok Followers (1,000)', cat:'Growth Services', price:1500, desc:'1,000 real TikTok followers. No password needed.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:3, status:'Available', rating:4.2, seller:'zeus_admin', date:new Date(Date.now() - 19*86400000).toISOString(), sales:0 },
      { lid:'0020', title:'Instagram Followers (500)', cat:'Growth Services', price:1000, desc:'500 real Instagram followers. Safe delivery.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.0, seller:'zeus_admin', date:new Date(Date.now() - 20*86400000).toISOString(), sales:0 },
      { lid:'0021', title:'Domain + Hosting (1 Year)', cat:'Web Services', price:8000, desc:'Custom domain + hosting for 1 year. SSL included.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.9, seller:'zeus_admin', date:new Date(Date.now() - 21*86400000).toISOString(), sales:0 },
      { lid:'0022', title:'Email Marketing List (500 Leads)', cat:'Marketing Services', price:3000, desc:'500 targeted email leads in your niche. Verified emails.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 22*86400000).toISOString(), sales:0 },
      { lid:'0023', title:'Logo Design (Professional)', cat:'Design Services', price:5000, desc:'Professional logo design with 3 concepts. Vector files.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:3, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 23*86400000).toISOString(), sales:0 },
      { lid:'0024', title:'Facebook Ads Manager Setup', cat:'Marketing Services', price:2000, desc:'Professional Facebook Ads Manager setup. Pixel installation.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 24*86400000).toISOString(), sales:0 },
      { lid:'0025', title:'Discord Server Setup (Custom)', cat:'Web Services', price:3000, desc:'Custom Discord server setup with bots, roles, channels.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 25*86400000).toISOString(), sales:0 },
      { lid:'0026', title:'Facebook Post Engagement (50)', cat:'Promotion Services', price:1000, desc:'50 real Facebook post engagements (likes, comments, shares).', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.1, seller:'zeus_admin', date:new Date(Date.now() - 26*86400000).toISOString(), sales:0 },
      { lid:'0027', title:'TikTok Live Stream Setup', cat:'Marketing Services', price:2500, desc:'Complete TikTok live stream setup with OBS configuration.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 27*86400000).toISOString(), sales:0 },
      { lid:'0028', title:'Viral Video Script (Custom)', cat:'Design Services', price:1500, desc:'Custom viral video script tailored to your niche.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 28*86400000).toISOString(), sales:0 }
    ];
    var batch = db.batch();
    products.forEach(function(p) {
      var ref = db.collection('products').doc();
      p.id = ref.id;
      batch.set(ref, p);
    });
    batch.commit().then(function() { console.log('Products seeded'); });
  }).catch(function() {});
}

// ====== AUTH FUNCTIONS ======
function switchAuth(tab) {
  if (tab === 'login') {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('verifyNotice').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
  } else {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('verifyNotice').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
  }
}

function register(e) {
  e.preventDefault();
  var username = document.getElementById('regUsername').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var whatsapp = document.getElementById('regWhatsapp').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;
  if (!username || !email || !whatsapp || !password || !confirm) { showToast('Fill all fields', 'error'); return; }
  if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (password.length < 8) { showToast('Password must be at least 8 characters', 'error'); return; }

  auth.createUserWithEmailAndPassword(email, password)
    .then(function(cred) {
      cred.user.sendEmailVerification().catch(function() {});
      return db.collection('users').doc(cred.user.uid).set({
        uid: cred.user.uid, username: username, email: email, whatsapp: whatsapp,
        password: password, role: 'user', wallet: 0, banned: false, joined: new Date().toISOString()
      });
    })
    .then(function() {
      showToast('Account created! Check email to verify.', 'success');
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('verifyNotice').style.display = 'block';
      setTimeout(function() { switchAuth('login'); }, 3000);
    })
    .catch(function(err) {
      var msg = err.message;
      if (err.code === 'auth/email-already-in-use') msg = 'Email already registered';
      else if (err.code === 'auth/weak-password') msg = 'Password too weak';
      showToast(msg, 'error');
    });
}

function login(e) {
  e.preventDefault();
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value;
  if (!username || !password) { showToast('Enter username/email and password', 'error'); return; }

  var isEmail = username.indexOf('@') > -1;
  if (isEmail) {
    auth.signInWithEmailAndPassword(username, password)
      .then(function(cred) { handleLoginSuccess(cred.user); })
      .catch(function(err) { showToast('Invalid email or password. Try demo_user / User@123456', 'error'); });
  } else {
    // Check demo user
    if (username === 'demo_user' && password === 'User@123456') {
      // Sign in to demo account or create it
      auth.signInWithEmailAndPassword('demo@zeus.demo.com', password).catch(function() {
        return auth.createUserWithEmailAndPassword('demo@zeus.demo.com', password).then(function(cred) {
          return db.collection('users').doc(cred.user.uid).set({
            uid: cred.user.uid, username: 'demo_user', email: 'demo@zeus.demo.com', whatsapp: '23409066760078',
            password: 'User@123456', role: 'user', wallet: 100000, banned: false, joined: new Date().toISOString()
          });
        });
      }).then(function() { return auth.signInWithEmailAndPassword('demo@zeus.demo.com', password); })
      .then(function(cred) {
        handleLoginSuccess(cred.user);
        showToast('Welcome Demo User! You have NGN 100,000 wallet', 'success');
      });
      return;
    }
    db.collection('users').where('username', '==', username).get()
      .then(function(snap) {
        if (snap.empty) { showToast('Username not found. Try your email.', 'error'); return null; }
        var u = null;
        snap.forEach(function(d) { u = docToObj(d); });
        if (!u) return null;
        return auth.signInWithEmailAndPassword(u.email, password);
      })
      .then(function(cred) { if (cred && cred.user) handleLoginSuccess(cred.user); })
      .catch(function(err) { showToast('Login failed. Try demo_user / User@123456', 'error'); });
  }
}

function googleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(function(result) {
      var user = result.user;
      return db.collection('users').doc(user.uid).get().then(function(doc) {
        if (!doc.exists) {
          return db.collection('users').doc(user.uid).set({
            uid: user.uid, username: user.displayName || 'google_' + user.uid.substr(0,6),
            email: user.email, whatsapp: user.phoneNumber || '', password: '',
            role: 'user', wallet: 0, banned: false, joined: new Date().toISOString()
          });
        }
      }).then(function() { handleLoginSuccess(user); });
    })
    .catch(function(err) { showToast('Google Sign-In failed', 'error'); });
}

function handleLoginSuccess(firebaseUser) {
  db.collection('users').doc(firebaseUser.uid).get().then(function(doc) {
    if (!doc.exists) { showToast('User data not found', 'error'); return; }
    STATE.currentUser = docToObj(doc);
    startListeners();
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('app').style.display = '';
    afterLogin();
    showPage('welcome');
    showToast('Welcome back, ' + STATE.currentUser.username + '!', 'success');
  });
}

function logout() {
  auth.signOut().then(function() {
    STATE.currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('authModal').style.display = 'flex';
    showToast('Logged out', 'info');
    switchAuth('login');
  });
}

// ====== AFTER LOGIN UI ======
function afterLogin() {
  var u = STATE.currentUser;
  document.getElementById('sidebarName').textContent = u.username;
  document.getElementById('sidebarAvatar').textContent = u.username.charAt(0).toUpperCase();
  document.getElementById('sidebarRole').textContent = u.role.toUpperCase();
  document.getElementById('profileAvatar').textContent = u.username.charAt(0).toUpperCase();
  document.getElementById('profUsername').textContent = u.username;
  document.getElementById('profEmail').textContent = u.email;
  document.getElementById('profWhatsapp').textContent = u.whatsapp || 'N/A';
  document.getElementById('profRole').textContent = u.role.toUpperCase();
  document.getElementById('profJoined').textContent = u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A';
  var ev = document.getElementById('profVerified');
  var vb = document.getElementById('verifyBtn');
  if (auth.currentUser && auth.currentUser.emailVerified) {
    ev.textContent = 'Yes ✓'; ev.style.color = 'var(--success)';
    if (vb) vb.style.display = 'none';
  } else {
    ev.textContent = 'No — Check inbox'; ev.style.color = 'var(--warning)';
    if (vb) vb.style.display = '';
  }
  document.getElementById('adminSidebarLinks').style.display = u.role === 'admin' ? '' : 'none';
  updateUI();
}

function updateUI() {
  var bal = STATE.currentUser ? (STATE.currentUser.wallet || 0) : 0;
  document.getElementById('topBalance').textContent = 'NGN ' + bal.toLocaleString();
  document.getElementById('walletBalance').textContent = 'NGN ' + bal.toLocaleString();
  var unread = 0;
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.notifications.length; i++) {
      if (STATE.notifications[i].uid === STATE.currentUser.uid && !STATE.notifications[i].read) unread++;
    }
  }
  var badge = document.getElementById('notifBadge');
  if (unread > 0) { badge.style.display = ''; badge.textContent = unread; }
  else badge.style.display = 'none';
  document.getElementById('heroProducts').textContent = STATE.products.length;
  document.getElementById('heroOrders').textContent = STATE.orders.length;
  document.getElementById('heroUsers').textContent = STATE.users.length;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
  var p = document.getElementById('page-' + name);
  if (p) {
    p.classList.add('active');
    if (name === 'marketplace') renderMarket();
    else if (name === 'welcome') { renderFeatured(); renderAnnouncements(); }
    else if (name === 'orders') renderOrders();
    else if (name === 'favorites') renderFavorites();
    else if (name === 'wallet') renderWalletHistory();
    else if (name === 'notifications') renderNotifications();
    else if (name === 'chat') renderChat();
    else if (name === 'support') renderTicketList();
    else if (name === 'admin') {
      if (STATE.currentUser && STATE.currentUser.role === 'admin') switchAdmin('overview');
      else { showToast('Admin access only', 'error'); showPage('welcome'); return; }
    }
  }
  document.getElementById('sidebar').classList.remove('open');
}

// ====== MARKETPLACE ======
function renderMarket() {
  var grid = document.getElementById('marketGrid');
  var empty = document.getElementById('marketEmpty');
  var filter = document.getElementById('catFilter').value;
  grid.innerHTML = '';
  var filtered = [];
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    if (filter === 'all' || p.cat === filter) filtered.push(p);
  }
  var cats = {};
  for (var i = 0; i < STATE.products.length; i++) cats[STATE.products[i].cat] = true;
  var sel = document.getElementById('catFilter');
  sel.innerHTML = '<option value="all">All Categories</option>';
  var ck = Object.keys(cats).sort();
  for (var i = 0; i < ck.length; i++) sel.innerHTML += '<option value="' + ck[i] + '">' + ck[i] + '</option>';
  sel.value = filter;

  if (filtered.length === 0) { empty.style.display = ''; return; }
  empty.style.display = 'none';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var stars = '';
    var r = p.rating || 4.5;
    for (var s = 0; s < 5; s++) stars += s < Math.round(r) ? '★' : '☆';
    var inFav = false;
    if (STATE.currentUser) { for (var f = 0; f < STATE.favorites.length; f++) { if (STATE.favorites[f].pid === p.id && STATE.favorites[f].uid === STATE.currentUser.uid) { inFav = true; break; } } }
    grid.innerHTML += '<div class="product-card" onclick="showDetail(\'' + p.id + '\')">' +
      '<img class="product-img" src="' + p.img + '" alt="..." loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop\'" />' +
      '<div class="product-body"><div class="product-cat">' + p.cat + '</div>' +
      '<div class="product-title">' + p.title + '</div>' +
      '<div class="product-price">NGN ' + p.price.toLocaleString() + '</div>' +
      '<div class="product-meta"><span class="product-rating">' + stars + '</span><span class="product-status">' + (p.days||1) + ' day</span></div>' +
      '<div class="product-actions"><button class="btn-primary" style="flex:1;padding:8px;font-size:12px;" onclick="event.stopPropagation();buyProduct(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy</button>' +
      '<button class="btn-secondary" style="padding:8px 12px;font-size:12px;" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas ' + (inFav ? 'fa-heart' : 'fa-heart-o') + '" style="color:' + (inFav ? 'var(--danger)' : '') + '"></i></button></div></div></div>';
  }
}

function renderFeatured() {
  var grid = document.getElementById('featuredGrid');
  grid.innerHTML = '';
  var featured = STATE.products.slice(0, 8);
  for (var i = 0; i < featured.length; i++) {
    var p = featured[i];
    var stars = '';
    var r = p.rating || 4.5;
    for (var s = 0; s < 5; s++) stars += s < Math.round(r) ? '★' : '☆';
    grid.innerHTML += '<div class="product-card" onclick="showDetail(\'' + p.id + '\')">' +
      '<img class="product-img" src="' + p.img + '" alt="..." loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop\'" />' +
      '<div class="product-body"><div class="product-cat">' + p.cat + '</div>' +
      '<div class="product-title">' + p.title + '</div>' +
      '<div class="product-price">NGN ' + p.price.toLocaleString() + '</div>' +
      '<div class="product-meta"><span class="product-rating">' + stars + '</span><span>' + (p.sales||0) + ' sold</span></div></div></div>';
  }
}

function renderAnnouncements() {
  var sec = document.getElementById('announcementSection');
  var list = document.getElementById('announcementList');
  if (STATE.announcements.length === 0) { sec.style.display = 'none'; return; }
  sec.style.display = '';
  list.innerHTML = '';
  for (var i = 0; i < STATE.announcements.length; i++) {
    var a = STATE.announcements[i];
    list.innerHTML += '<div class="glass-sm" style="padding:16px;margin-bottom:8px;"><h4 style="color:var(--neon-gold);">' + a.title + '</h4><p style="font-size:13px;">' + a.content + '</p><span style="font-size:11px;color:var(--text-muted);">' + new Date(a.date).toLocaleDateString() + '</span></div>';
  }
}

function showDetail(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) { if (STATE.products[i].id === id) { p = STATE.products[i]; break; } }
  if (!p) return;
  var stars = '';
  for (var s = 0; s < 5; s++) stars += s < Math.round(p.rating || 4.5) ? '★' : '☆';
  var inFav = false;
  if (STATE.currentUser) { for (var f = 0; f < STATE.favorites.length; f++) { if (STATE.favorites[f].pid === p.id && STATE.favorites[f].uid === STATE.currentUser.uid) { inFav = true; break; } } }
  document.getElementById('detailContent').innerHTML =
    '<img src="' + p.img + '" style="width:100%;height:200px;object-fit:cover;border-radius:12px;margin-bottom:16px;" onerror="this.src=\'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop\'" />' +
    '<div class="product-cat">' + p.cat + '</div>' +
    '<h3 style="margin:8px 0;">' + p.title + '</h3>' +
    '<div style="font-size:24px;font-weight:700;color:var(--neon-green);margin-bottom:12px;">NGN ' + p.price.toLocaleString() + '</div>' +
    '<div style="display:flex;gap:12px;font-size:13px;color:var(--text-muted);margin-bottom:12px;"><span class="product-rating">' + stars + '</span><span>Delivery: ' + (p.days||1) + ' day(s)</span><span>' + (p.sales||0) + ' sold</span></div>' +
    '<p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">' + (p.desc||'') + '</p>' +
    '<button class="btn-primary" onclick="closeModal(\'detailModal\');buyProduct(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy Now</button>' +
    '<button class="btn-secondary" style="margin-top:8px;" onclick="toggleFav(\'' + p.id + '\')"><i class="fas ' + (inFav ? 'fa-heart' : 'fa-heart-o') + '"></i> ' + (inFav ? 'Remove from Favorites' : 'Add to Favorites') + '</button>';
  document.getElementById('detailModal').style.display = 'flex';
}

// ====== FAVORITES ======
function toggleFav(pid) {
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var idx = -1;
  for (var i = 0; i < STATE.favorites.length; i++) {
    if (STATE.favorites[i].pid === pid && STATE.favorites[i].uid === STATE.currentUser.uid) { idx = i; break; }
  }
  if (idx >= 0) {
    db.collection('favorites').doc(STATE.favorites[idx].id).delete().then(function() { showToast('Removed from favorites', 'info'); renderMarket(); renderFavorites(); });
  } else {
    db.collection('favorites').add({ pid: pid, uid: STATE.currentUser.uid, date: new Date().toISOString() }).then(function() { showToast('Added to favorites!', 'success'); renderMarket(); });
  }
}

function renderFavorites() {
  var list = document.getElementById('favList');
  list.innerHTML = '';
  var myFavs = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.favorites.length; i++) {
      if (STATE.favorites[i].uid === STATE.currentUser.uid) myFavs.push(STATE.favorites[i]);
    }
  }
  if (myFavs.length === 0) { list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No favorites yet.</p>'; return; }
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    for (var j = 0; j < myFavs.length; j++) {
      if (myFavs[j].pid === p.id) {
        list.innerHTML += '<div class="order-card"><div style="display:flex;justify-content:space-between;align-items:center;"><div><strong>' + p.title + '</strong><br><span style="font-size:12px;color:var(--text-muted);">NGN ' + p.price.toLocaleString() + '</span></div><div><button class="btn-primary" style="padding:8px 16px;font-size:12px;" onclick="buyProduct(\'' + p.id + '\')">Buy</button><button class="btn-secondary" style="padding:8px;font-size:12px;margin-left:4px;" onclick="toggleFav(\'' + p.id + '\')"><i class="fas fa-trash"></i></button></div></div></div>';
      }
    }
  }
}

// ====== BUY ======
function buyProduct(pid) {
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) { if (STATE.products[i].id === pid) { p = STATE.products[i]; break; } }
  if (!p) { showToast('Product not found', 'error'); return; }
  if (p.status !== 'Available') { showToast('Not available', 'error'); return; }
  document.getElementById('paymentProductId').value = pid;
  document.getElementById('paymentTitle').textContent = 'Buy: ' + p.title;
  var bal = STATE.currentUser.wallet || 0;
  document.getElementById('paymentInfo').innerHTML =
    '<p><strong>Price:</strong> <span style="color:var(--neon-green);font-weight:700;">NGN ' + p.price.toLocaleString() + '</span></p>' +
    '<p><strong>Balance:</strong> NGN ' + bal.toLocaleString() + '</p>' +
    '<p id="payError" style="color:var(--danger);display:' + (bal < p.price ? '' : 'none') + ';">Insufficient balance. <a href="#" onclick="closeModal(\'paymentModal\');showDeposit();return false;" style="color:var(--neon-blue);">Deposit funds</a></p>';
  document.getElementById('payBtn').disabled = bal < p.price;
  document.getElementById('payBtn').style.opacity = bal < p.price ? '0.5' : '1';
  document.getElementById('paymentModal').style.display = 'flex';
}

function processPayment(e) {
  e.preventDefault();
  var pid = document.getElementById('paymentProductId').value;
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) { if (STATE.products[i].id === pid) { p = STATE.products[i]; break; } }
  if (!p) return;
  var bal = STATE.currentUser.wallet || 0;
  if (bal < p.price) { showToast('Insufficient balance', 'error'); return; }
  var newBalance = bal - p.price;
  var orderNum = String(STATE.orders.length + 1).padStart(4, '0');

  db.collection('users').doc(STATE.currentUser.uid).update({ wallet: newBalance })
    .then(function() { return db.collection('payments').add({ pid: p.id, uid: STATE.currentUser.uid, name: STATE.currentUser.username, product: p.title, amount: p.price, ref: 'WALLET_' + Date.now(), status: 'Completed', date: new Date().toISOString() }); })
    .then(function() { return db.collection('orders').add({ num: orderNum, pid: p.id, product: p.title, amount: p.price, uid: STATE.currentUser.uid, buyerName: STATE.currentUser.username, buyerEmail: STATE.currentUser.email, status: 'Approved', date: new Date().toISOString(), deliveryLogin: '', deliveryMsg: '', deliveryDate: '' }); })
    .then(function() {
      db.collection('notifications').add({ uid: 'admin', msg: 'New order #' + orderNum + ' from ' + STATE.currentUser.username + ': ' + p.title + ' (NGN ' + p.price.toLocaleString() + ')', type: 'info', read: false, date: new Date().toISOString() });
      STATE.currentUser.wallet = newBalance;
      closeModal('paymentModal');
      showToast('Order #' + orderNum + ' created! Admin will deliver.', 'success');
      updateUI();
    }).catch(function(err) { showToast('Error: ' + err.message, 'error'); });
}

// ====== ORDERS ======
function renderOrders() {
  var list = document.getElementById('ordersList');
  list.innerHTML = '';
  var myOrders = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.orders.length; i++) {
      if (STATE.orders[i].uid === STATE.currentUser.uid) myOrders.push(STATE.orders[i]);
    }
  }
  if (myOrders.length === 0) { list.innerHTML = '<p style="color:var(--text-muted);">No orders yet.</p>'; return; }
  for (var i = myOrders.length - 1; i >= 0; i--) {
    var o = myOrders[i];
    list.innerHTML += '<div class="order-card" onclick="showOrderDetail(\'' + o.id + '\')">' +
      '<div class="order-header"><span class="order-num">#' + o.num + '</span><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div>' +
      '<div style="font-size:13px;margin-bottom:4px;">' + o.product + '</div>' +
      '<div style="font-size:12px;color:var(--text-muted);">NGN ' + o.amount.toLocaleString() + ' | ' + new Date(o.date).toLocaleDateString() + '</div></div>';
  }
}

function showOrderDetail(id) {
  var o = null;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].id === id) { o = STATE.orders[i]; break; } }
  if (!o) return;
  document.getElementById('orderDetailContent').innerHTML =
    '<div style="text-align:center;margin-bottom:16px;"><h3>Order #' + o.num + '</h3><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div>' +
    '<p><strong>Product:</strong> ' + o.product + '</p><p><strong>Amount:</strong> NGN ' + o.amount.toLocaleString() + '</p>' +
    '<p><strong>Date:</strong> ' + new Date(o.date).toLocaleDateString() + '</p>' +
    (o.deliveryLogin ? '<div style="margin-top:16px;padding:12px;background:var(--glass);border-radius:12px;border:1px solid var(--success);"><p style="color:var(--success);font-weight:700;">Delivery Info:</p><p style="font-size:13px;margin-top:8px;">' + o.deliveryLogin.replace(/\n/g,'<br/>') + '</p></div>' : '') +
    '<button class="btn-secondary" style="margin-top:16px;" onclick="closeModal(\'orderModal\')">Close</button>';
  document.getElementById('orderModal').style.display = 'flex';
}

// ====== WALLET ======
function showDeposit() { document.getElementById('depositModal').style.display = 'flex'; }
function showWithdraw() { document.getElementById('withdrawModal').style.display = 'flex'; }

function submitDeposit(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var amount = parseInt(document.getElementById('depAmount').value);
  var ref = document.getElementById('depRef').value.trim();
  if (!amount || amount < 100) { showToast('Minimum: NGN 100', 'error'); return; }
  if (!ref) { showToast('Enter reference', 'error'); return; }
  db.collection('deposits').add({ uid: STATE.currentUser.uid, name: STATE.currentUser.username, whatsapp: STATE.currentUser.whatsapp||'', amount: amount, ref: ref, status: 'PENDING', date: new Date().toISOString() })
    .then(function() {
      closeModal('depositModal');
      document.getElementById('depAmount').value = '';
      document.getElementById('depRef').value = '';
      showToast('Deposit submitted! Admin will verify.', 'success');
      db.collection('notifications').add({ uid: 'admin', msg: 'New deposit: NGN ' + amount.toLocaleString() + ' from ' + STATE.currentUser.username + ' (Ref: ' + ref + ')', type: 'info', read: false, date: new Date().toISOString() });
    });
}

function submitWithdraw(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var amount = parseInt(document.getElementById('witAmount').value);
  var whatsapp = document.getElementById('witWhatsapp').value.trim();
  var name = document.getElementById('witName').value.trim();
  if (!amount || amount < 100) { showToast('Minimum: NGN 100', 'error'); return; }
  if (!whatsapp || !name) { showToast('Fill all fields', 'error'); return; }
  var bal = STATE.currentUser.wallet || 0;
  if (amount > bal) { showToast('Insufficient balance', 'error'); return; }
  db.collection('users').doc(STATE.currentUser.uid).update({ wallet: bal - amount })
    .then(function() { return db.collection('withdrawals').add({ uid: STATE.currentUser.uid, name: name, whatsapp: whatsapp, amount: amount, status: 'PENDING', date: new Date().toISOString() }); })
    .then(function() {
      STATE.currentUser.wallet = bal - amount;
      closeModal('withdrawModal');
      document.getElementById('witAmount').value = '';
      document.getElementById('witWhatsapp').value = '';
      document.getElementById('witName').value = '';
      showToast('Withdrawal requested! Admin will process.', 'success');
      db.collection('notifications').add({ uid: 'admin', msg: 'New withdrawal: NGN ' + amount.toLocaleString() + ' to ' + name + ' (' + whatsapp + ')', type: 'info', read: false, date: new Date().toISOString() });
      updateUI();
    });
}

function renderWalletHistory() {
  var div = document.getElementById('walletHistory');
  var all = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.deposits.length; i++) {
      if (STATE.deposits[i].uid === STATE.currentUser.uid) all.push({ type: 'Deposit', amount: STATE.deposits[i].amount, status: STATE.deposits[i].status, date: STATE.deposits[i].date });
    }
    for (var i = 0; i < STATE.withdrawals.length; i++) {
      if (STATE.withdrawals[i].uid === STATE.currentUser.uid) all.push({ type: 'Withdrawal', amount: STATE.withdrawals[i].amount, status: STATE.withdrawals[i].status, date: STATE.withdrawals[i].date });
    }
  }
  all.sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  if (all.length === 0) { div.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No transactions</p>'; return; }
  div.innerHTML = '';
  for (var i = 0; i < all.length; i++) {
    div.innerHTML += '<div style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid var(--glass-border);font-size:13px;">' +
      '<div><span style="font-weight:600;">' + all[i].type + '</span><br><span style="color:var(--text-muted);font-size:11px;">' + new Date(all[i].date).toLocaleDateString() + '</span></div>' +
      '<div style="text-align:right;"><span style="font-weight:700;color:' + (all[i].type === 'Deposit' ? 'var(--neon-green)' : 'var(--neon-pink)') + ';">NGN ' + all[i].amount.toLocaleString() + '</span><br><span class="status-badge ' + sClass(all[i].status) + '" style="font-size:10px;">' + all[i].status + '</span></div></div>';
  }
}

// ====== TICKETS ======
function submitTicket(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var subject = document.getElementById('ticketSubject').value.trim();
  var priority = document.getElementById('ticketPriority').value;
  var message = document.getElementById('ticketMessage').value.trim();
  if (!subject || !priority || !message) { showToast('Fill all fields', 'error'); return; }
  db.collection('tickets').add({ uid: STATE.currentUser.uid, username: STATE.currentUser.username, whatsapp: STATE.currentUser.whatsapp||'', email: STATE.currentUser.email, subject: subject, priority: priority, message: message, status: 'OPEN', date: new Date().toISOString() })
    .then(function() {
      document.getElementById('ticketSubject').value = '';
      document.getElementById('ticketPriority').value = '';
      document.getElementById('ticketMessage').value = '';
      showToast('Ticket submitted!', 'success');
      db.collection('notifications').add({ uid: 'admin', msg: 'New ' + priority + ' ticket from ' + STATE.currentUser.username + ': ' + subject, type: 'info', read: false, date: new Date().toISOString() });
    });
}

function renderTicketList() {
  var list = document.getElementById('ticketList');
  list.innerHTML = '';
  var myTickets = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.tickets.length; i++) {
      if (STATE.tickets[i].uid === STATE.currentUser.uid) myTickets.push(STATE.tickets[i]);
    }
  }
  if (myTickets.length === 0) { list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No tickets</p>'; return; }
  for (var i = myTickets.length - 1; i >= 0; i--) {
    var t = myTickets[i];
    list.innerHTML += '<div class="order-card"><div class="order-header"><strong style="font-size:13px;">' + t.subject + '</strong><span class="status-badge ' + sClass(t.status) + '">' + t.status + '</span></div><p style="font-size:13px;color:var(--text-secondary);">' + t.message.substring(0,80) + '</p><div style="font-size:11px;color:var(--text-muted);">Priority: ' + t.priority + ' | ' + new Date(t.date).toLocaleDateString() + '</div></div>';
  }
}

// ====== CHAT ======
function sendChatMsg(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Sign in first', 'error'); return; }
  var msg = document.getElementById('chatInput').value.trim();
  if (!msg) return;
  db.collection('chatMessages').add({ uid: STATE.currentUser.uid, username: STATE.currentUser.username, msg: STATE.currentUser.username + ': ' + msg, date: new Date().toISOString() })
    .then(function() {
      document.getElementById('chatInput').value = '';
      db.collection('notifications').add({ uid: 'admin', msg: 'Chat from ' + STATE.currentUser.username + ': ' + msg.substring(0,50), type: 'info', read: false, date: new Date().toISOString() });
    });
}

function renderChat() {
  var div = document.getElementById('chatMessages');
  div.innerHTML = '';
  var msgs = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.chatMessages.length; i++) {
      if (STATE.chatMessages[i].uid === STATE.currentUser.uid || STATE.chatMessages[i].uid === 'admin' || STATE.chatMessages[i].msg.indexOf('Admin:') === 0) msgs.push(STATE.chatMessages[i]);
    }
  }
  if (msgs.length === 0) { div.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No messages.</p>'; return; }
  for (var i = 0; i < msgs.length; i++) {
    var isAdmin = msgs[i].uid === 'admin' || msgs[i].msg.indexOf('Admin:') === 0;
    div.innerHTML += '<div class="chat-bubble' + (isAdmin ? '' : ' admin') + '"><strong style="font-size:11px;color:var(--neon-blue);">' + (isAdmin ? 'Admin' : 'You') + '</strong><br/>' + (msgs[i].msg.replace(/^.*?: /, '')) + '</div>';
  }
  div.scrollTop = div.scrollHeight;
}

// ====== NOTIFICATIONS ======
function renderNotifications() {
  var list = document.getElementById('notifList');
  list.innerHTML = '';
  var myNotifs = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.notifications.length; i++) {
      if (STATE.notifications[i].uid === STATE.currentUser.uid || STATE.notifications[i].uid === 'admin') myNotifs.push(STATE.notifications[i]);
    }
  }
  if (myNotifs.length === 0) { list.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No notifications</p>'; return; }
  for (var i = myNotifs.length - 1; i >= 0; i--) {
    var n = myNotifs[i];
    var icon = n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    var color = n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : 'var(--neon-blue)';
    list.innerHTML += '<div class="order-card" style="opacity:' + (n.read ? '0.6' : '1') + ';"><div style="display:flex;gap:12px;align-items:center;"><i class="fas ' + icon + '" style="color:' + color + ';font-size:18px;"></i><div><p style="font-size:13px;">' + n.msg + '</p><span style="font-size:11px;color:var(--text-muted);">' + new Date(n.date).toLocaleDateString() + '</span></div></div></div>';
  }
}

// ====== ADMIN ======
function switchAdmin(tab) {
  var tabs = document.querySelectorAll('.admin-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].textContent.trim().toLowerCase() === tab.toLowerCase()) { tabs[i].classList.add('active'); break; }
  }
  if (tab === 'overview') renderAdminOverview();
  else if (tab === 'payments') adminPayments();
  else if (tab === 'deposits') adminDeposits();
  else if (tab === 'withdrawals') adminWithdrawals();
  else if (tab === 'orders') adminOrders();
  else if (tab === 'users') adminUsers();
  else if (tab === 'products') adminProducts();
  else if (tab === 'tickets') adminTickets();
  else if (tab === 'broadcast') adminAnnounce();
  else if (tab === 'analytics') adminAnalytics();
}

function renderAdminOverview() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var rev = 0;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount; }
  var pd = 0, pw = 0, ot = 0;
  for (var i = 0; i < STATE.deposits.length; i++) { if (STATE.deposits[i].status === 'PENDING') pd++; }
  for (var i = 0; i < STATE.withdrawals.length; i++) { if (STATE.withdrawals[i].status === 'PENDING') pw++; }
  for (var i = 0; i < STATE.tickets.length; i++) { if (STATE.tickets[i].status === 'OPEN') ot++; }
  c.innerHTML = '<div class="dash-stats">' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">NGN ' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-blue);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-purple);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-pink);">' + STATE.products.length + '</h3><p>Products</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--warning);">' + pd + '</h3><p>Pending Dep.</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-gold);">' + pw + '</h3><p>Pending With.</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--danger);">' + ot + '</h3><p>Open Tickets</p></div>' +
    '</div><div style="margin-top:20px;"><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">' +
    '<button class="btn-secondary" onclick="switchAdmin(\'deposits\')" style="width:auto;">Verify Deposits (' + pd + ')</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'withdrawals\')" style="width:auto;">Withdrawals (' + pw + ')</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'orders\')" style="width:auto;">Deliver Orders</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'tickets\')" style="width:auto;">Tickets (' + ot + ')</button>' +
    '</div></div>';
}

function adminPayments() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>Payment History (' + STATE.payments.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>Product</th><th>Amount</th><th>Ref</th><th>Date</th><th>Status</th></tr></thead><tbody>';
  for (var i = STATE.payments.length - 1; i >= 0; i--) {
    var p = STATE.payments[i];
    html += '<tr><td>' + (p.name||'') + '</td><td>' + (p.product||'').substr(0,25) + '</td><td>NGN ' + (p.amount||0).toLocaleString() + '</td><td>' + (p.ref||'') + '</td><td>' + new Date(p.date).toLocaleDateString() + '</td><td><span class="status-badge status-approved">Completed</span></td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function adminDeposits() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>Deposit Requests</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>WhatsApp</th><th>Amount</th><th>Ref</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.deposits.length - 1; i >= 0; i--) {
    var d = STATE.deposits[i];
    html += '<tr><td>' + d.name + '</td><td>' + (d.whatsapp||'') + '</td><td>NGN ' + d.amount.toLocaleString() + '</td><td>' + d.ref + '</td><td>' + new Date(d.date).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + (d.status === 'VERIFIED' ? 'status-approved' : d.status === 'REJECTED' ? 'status-rejected' : 'status-pending') + '">' + d.status + '</span></td>' +
      '<td>' + (d.status === 'PENDING' ? '<button class="action-btn approve-btn" onclick="approveDep(\'' + d.id + '\')">Approve</button><button class="action-btn reject-btn" style="margin-left:4px;" onclick="rejectDep(\'' + d.id + '\')">Reject</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function approveDep(id) {
  db.collection('deposits').doc(id).get().then(function(doc) {
    if (!doc.exists) return;
    var d = docToObj(doc);
    db.collection('users').doc(d.uid).get().then(function(uDoc) {
      if (!uDoc.exists) return;
      var u = uDoc.data();
      var bal = (u.wallet || 0) + (d.amount || 0);
      db.collection('users').doc(d.uid).update({ wallet: bal });
      db.collection('deposits').doc(id).update({ status: 'VERIFIED' });
      db.collection('notifications').add({ uid: d.uid, msg: 'Deposit of NGN ' + d.amount.toLocaleString() + ' verified! Wallet credited.', type: 'success', read: false, date: new Date().toISOString() });
      showToast('Deposit verified!', 'success');
    });
  });
}

function rejectDep(id) {
  db.collection('deposits').doc(id).update({ status: 'REJECTED' });
  showToast('Deposit rejected', 'error');
}

function adminWithdrawals() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>Withdrawal Requests</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>WhatsApp</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.withdrawals.length - 1; i >= 0; i--) {
    var w = STATE.withdrawals[i];
    html += '<tr><td>' + w.name + '</td><td>' + w.whatsapp + '</td><td>NGN ' + w.amount.toLocaleString() + '</td><td>' + new Date(w.date).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + (w.status === 'PAID' ? 'status-approved' : w.status === 'REJECTED' ? 'status-rejected' : 'status-pending') + '">' + (w.status||'PENDING') + '</span></td>' +
      '<td>' + (w.status==='PENDING'?'<button class="action-btn approve-btn" onclick="approveWit(\''+w.id+'\')">Mark Paid</button>':'') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function approveWit(id) {
  db.collection('withdrawals').doc(id).get().then(function(doc) {
    if (!doc.exists) return;
    var w = docToObj(doc);
    db.collection('withdrawals').doc(id).update({ status: 'PAID' });
    db.collection('notifications').add({ uid: w.uid, msg: 'Withdrawal of NGN ' + w.amount.toLocaleString() + ' sent to ' + w.whatsapp + ' via OPay.', type: 'success', read: false, date: new Date().toISOString() });
    showToast('Marked as paid!', 'success');
  });
}

function adminOrders() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>All Orders</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>WhatsApp</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.orders.length - 1; i >= 0; i--) {
    var o = STATE.orders[i];
    var wa = '';
    for (var j = 0; j < STATE.users.length; j++) { if (STATE.users[j].uid === o.uid) { wa = STATE.users[j].whatsapp || ''; break; } }
    html += '<tr><td>#' + o.num + '</td><td>' + o.product.substr(0,25) + '</td><td>' + o.buyerName + '</td><td>NGN ' + o.amount.toLocaleString() + '</td><td>' + wa + '</td>' +
      '<td><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></td>' +
      '<td>' + (o.status === 'Approved' ? '<button class="action-btn approve-btn" onclick="openDelivery(\'' + o.id + '\')">Deliver</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function openDelivery(id) {
  var o = null;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].id === id) { o = STATE.orders[i]; break; } }
  if (!o) return;
  var wa = '';
  for (var j = 0; j < STATE.users.length; j++) { if (STATE.users[j].uid === o.uid) { wa = STATE.users[j].whatsapp || ''; break; } }
  document.getElementById('deliveryInfo').innerHTML = '<p><strong>Order #' + o.num + ':</strong> ' + o.product + '</p><p><strong>Buyer WhatsApp:</strong> ' + wa + '</p>';
  document.getElementById('deliveryOrderId').value = id;
  document.getElementById('deliveryWhatsapp').value = wa;
  document.getElementById('deliveryLogin').value = '';
  document.getElementById('deliveryMessage').value = 'Your login details for ' + o.product + ' are ready. Thank you for your purchase!';
  document.getElementById('deliveryModal').style.display = 'flex';
}

function sendDelivery(e) {
  e.preventDefault();
  var oid = document.getElementById('deliveryOrderId').value;
  var wa = document.getElementById('deliveryWhatsapp').value.trim();
  var login = document.getElementById('deliveryLogin').value.trim();
  var msg = document.getElementById('deliveryMessage').value.trim();
  if (!wa || !login) { showToast('Fill WhatsApp and login details', 'error'); return; }

  db.collection('orders').doc(oid).update({ status: 'Delivered', deliveryLogin: login, deliveryMsg: msg, deliveryDate: new Date().toISOString() })
    .then(function() {
      return db.collection('orders').doc(oid).get();
    })
    .then(function(doc) {
      if (!doc.exists) return;
      var o = docToObj(doc);
      db.collection('notifications').add({ uid: o.uid, msg: 'Your order ' + o.product + ' has been delivered! Login details: ' + login, type: 'success', read: false, date: new Date().toISOString() });
      closeModal('deliveryModal');
      showToast('Delivered! WhatsApp sent.', 'success');
      var clean = wa.replace('+','').replace(/[^0-9]/g,'');
      window.open('https://wa.me/' + clean + '?text=' + encodeURIComponent(msg + '\n\nLogin Details:\n' + login + '\n\n- ZEUS Admin'), '_blank');
    });
}

function adminUsers() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>User Management (' + STATE.users.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Username</th><th>Email</th><th>WhatsApp</th><th>Balance</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.users.length; i++) {
    var u = STATE.users[i];
    html += '<tr><td>' + u.username + '</td><td>' + u.email + '</td><td>' + (u.whatsapp||'-') + '</td><td>NGN ' + (u.wallet||0).toLocaleString() + '</td><td>' + (u.role||'user') + '</td>' +
      '<td>' + (u.banned ? '<span style="color:var(--danger);">Banned</span>' : '<span style="color:var(--success);">Active</span>') + '</td>' +
      '<td>' + (u.banned ? '<button class="action-btn approve-btn" onclick="unbanU(\'' + u.uid + '\')">Unban</button>' : '<button class="action-btn reject-btn" onclick="banU(\'' + u.uid + '\')">Ban</button>') +
      ' <button class="action-btn" style="background:var(--neon-blue);color:#000;" onclick="waU(\'' + u.uid + '\')">WA</button></td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function banU(uid) { db.collection('users').doc(uid).update({ banned: true }); showToast('User banned', 'info'); }
function unbanU(uid) { db.collection('users').doc(uid).update({ banned: false }); showToast('User unbanned', 'success'); }
function waU(uid) {
  for (var i = 0; i < STATE.users.length; i++) { if (STATE.users[i].uid === uid) { var wa = STATE.users[i].whatsapp || '23409066760078'; window.open('https://wa.me/' + wa.replace('+','').replace(/[^0-9]/g,''), '_blank'); break; } }
}

function adminProducts() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>Products (' + STATE.products.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th><th>Status</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    html += '<tr><td>#' + p.lid + '</td><td>' + p.title + '</td><td>NGN ' + p.price.toLocaleString() + '</td><td>' + p.cat + '</td><td><span style="color:' + (p.status==='Available'?'var(--success)':'var(--text-muted)') + '">' + p.status + '</span></td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function adminTickets() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>Tickets (' + STATE.tickets.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>WhatsApp</th><th>Subject</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.tickets.length - 1; i >= 0; i--) {
    var t = STATE.tickets[i];
    var pc = t.priority === 'URGENT' ? 'var(--danger)' : t.priority === 'HIGH' ? 'var(--warning)' : 'var(--text-muted)';
    html += '<tr><td>' + t.username + '</td><td>' + (t.whatsapp||'') + '</td><td>' + t.subject + '</td><td><span style="color:' + pc + ';">' + t.priority + '</span></td>' +
      '<td><span class="status-badge ' + sClass(t.status) + '">' + t.status + '</span></td>' +
      '<td>' + (t.status === 'OPEN' ? '<button class="action-btn approve-btn" onclick="resolveT(\'' + t.id + '\')">Resolve</button><button class="action-btn" style="background:var(--neon-blue);color:#000;margin-left:4px;" onclick="contactTWA(\'' + t.id + '\')">WA</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}

function resolveT(id) {
  db.collection('tickets').doc(id).get().then(function(doc) {
    if (!doc.exists) return;
    var t = docToObj(doc);
    db.collection('tickets').doc(id).update({ status: 'RESOLVED' });
    db.collection('notifications').add({ uid: t.uid, msg: 'Your ticket "' + t.subject + '" has been resolved.', type: 'success', read: false, date: new Date().toISOString() });
    showToast('Ticket resolved', 'success');
  });
}

function contactTWA(id) {
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].id === id) {
      var wa = STATE.tickets[i].whatsapp || '23409066760078';
      window.open('https://wa.me/' + wa.replace('+','').replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent('ZEUS Support: Ticket "' + STATE.tickets[i].subject + '"'), '_blank');
      break;
    }
  }
}

function adminAnnounce() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var list = '';
  for (var i = STATE.announcements.length - 1; i >= 0; i--) {
    var a = STATE.announcements[i];
    list += '<div class="glass-sm" style="padding:12px;margin-bottom:8px;"><h4 style="color:var(--neon-gold);">' + a.title + '</h4><p style="font-size:13px;">' + a.content + '</p><span style="font-size:11px;color:var(--text-muted);">' + new Date(a.date).toLocaleDateString() + '</span></div>';
  }
  c.innerHTML = '<h3>Broadcast Announcement</h3><form onsubmit="createAnn(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' +
    '<div class="input-group"><input type="text" id="annTitle" placeholder="Title" required /></div>' +
    '<div class="input-group"><textarea id="annContent" placeholder="Message" rows="3" required></textarea></div>' +
    '<button class="btn-primary" type="submit"><i class="fas fa-bullhorn"></i> Broadcast to All Users</button></form>' +
    '<div id="annList">' + (list || '<p style="color:var(--text-muted);">No announcements</p>') + '</div>';
}

function createAnn(e) {
  e.preventDefault();
  var title = document.getElementById('annTitle').value.trim();
  var content = document.getElementById('annContent').value.trim();
  if (!title || !content) { showToast('Fill all fields', 'error'); return; }
  db.collection('announcements').add({ title: title, content: content, date: new Date().toISOString() }).then(function() {
    // Notify all users
    var batch = db.batch();
    STATE.users.forEach(function(u) {
      var ref = db.collection('notifications').doc();
      batch.set(ref, { uid: u.uid, msg: '📢 ' + title + ' - ' + content, type: 'info', read: false, date: new Date().toISOString() });
    });
    batch.commit().then(function() {
      document.getElementById('annTitle').value = '';
      document.getElementById('annContent').value = '';
      showToast('Broadcast sent to ' + STATE.users.length + ' users!', 'success');
    });
  });
}

function adminAnalytics() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var rev = 0;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount; }
  var recent = '';
  var ords = STATE.orders.slice().reverse();
  var max = ords.length > 10 ? 10 : ords.length;
  for (var i = 0; i < max; i++) {
    var o = ords[i];
    recent += '<div style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid var(--glass-border);font-size:12px;"><span>#' + o.num + ' - ' + o.product.substr(0,25) + '</span><span class="status-badge ' + sClass(o.status) + '" style="font-size:10px;">' + o.status + '</span></div>';
  }
  c.innerHTML = '<div class="dash-stats" style="margin-bottom:24px;">' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">NGN ' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-blue);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-purple);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-pink);">' + STATE.products.length + '</h3><p>Products</p></div></div>' +
    '<h3>Recent Orders</h3><div style="margin-bottom:20px;">' + (recent || '<p style="color:var(--text-muted);">No orders</p>') + '</div>' +
    '<h3>Export Data</h3><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">' +
    '<button class="btn-secondary" onclick="exportCSV(\'users\')" style="width:auto;"><i class="fas fa-download"></i> Users</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'orders\')" style="width:auto;"><i class="fas fa-download"></i> Orders</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'products\')" style="width:auto;"><i class="fas fa-download"></i> Products</button></div>';
}

function exportCSV(type) {
  var data, filename;
  if (type === 'users') { data = STATE.users.map(function(u){return{Username:u.username,Email:u.email,WhatsApp:u.whatsapp||'',Role:u.role||'user',Balance:'NGN '+(u.wallet||0)}}); filename='zeus_users.csv'; }
  else if (type === 'orders') { data = STATE.orders.map(function(o){return{Order:o.num,Product:o.product,Buyer:o.buyerName,Amount:'NGN '+o.amount,Status:o.status}}); filename='zeus_orders.csv'; }
  else if (type === 'products') { data = STATE.products.map(function(p){return{ID:p.lid,Title:p.title,Price:'NGN '+p.price,Category:p.cat,Status:p.status}}); filename='zeus_products.csv'; }
  else return;
  if (!data || !data.length) { showToast('No data', 'info'); return; }
  var headers = Object.keys(data[0]);
  var rows = [headers.join(',')];
  for (var i = 0; i < data.length; i++) {
    var vals = [];
    for (var j = 0; j < headers.length; j++) { vals.push('"' + String(data[i][headers[j]]||'').replace(/"/g,'""') + '"'); }
    rows.push(vals.join(','));
  }
  var blob = new Blob(['\uFEFF' + rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(filename + ' downloaded!', 'success');
}

// ====== MODAL CLOSE ======
document.addEventListener('click', function(e) { if (e.target.classList.contains('modal-overlay')) e.target.style.display = 'none'; });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { var ms = document.querySelectorAll('.modal-overlay'); for (var i = 0; i < ms.length; i++) ms[i].style.display = 'none'; } });

// ====== INIT ======
(function init() {
  // Check if user is already signed in
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in — load profile
      db.collection('users').doc(user.uid).get().then(function(doc) {
        if (doc.exists) {
          STATE.currentUser = docToObj(doc);
          startListeners();
          document.getElementById('authModal').style.display = 'none';
          document.getElementById('app').style.display = '';
          afterLogin();
          showPage('welcome');
        }
      });
    } else {
      // Not signed in — show auth
      document.getElementById('authModal').style.display = 'flex';
    }
    setTimeout(hideLoading, 1200);
  });

  seedProducts();
  console.log('ZEUS PDM v2 — Firebase Edition loaded');
  console.log('Demo login: demo_user / User@123456');
  console.log('Admin: Set role=admin in Firestore for your account');
  console.log('WhatsApp: 09066760078');
})();
