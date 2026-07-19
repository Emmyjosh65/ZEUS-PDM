// ====== STATE ======
var STATE = {
  users: [], currentUser: null, products: [], orders: [], payments: [],
  deposits: [], withdrawals: [], favorites: [], tickets: [],
  notifications: [], announcements: [], chatMessages: []
};

// ====== LOAD / SAVE ======
function load() {
  try {
    var d = localStorage.getItem('zeusDB');
    if (d) {
      var p = JSON.parse(d);
      STATE.users = p.users || [];
      STATE.currentUser = p.currentUser || null;
      STATE.products = p.products || [];
      STATE.orders = p.orders || [];
      STATE.payments = p.payments || [];
      STATE.deposits = p.deposits || [];
      STATE.withdrawals = p.withdrawals || [];
      STATE.favorites = p.favorites || [];
      STATE.tickets = p.tickets || [];
      STATE.notifications = p.notifications || [];
      STATE.announcements = p.announcements || [];
      STATE.chatMessages = p.chatMessages || [];
    }
  } catch(e) { console.log('Load error', e); }
}
function save() {
  try {
    localStorage.setItem('zeusDB', JSON.stringify({
      users: STATE.users, currentUser: STATE.currentUser, products: STATE.products,
      orders: STATE.orders, payments: STATE.payments, deposits: STATE.deposits,
      withdrawals: STATE.withdrawals, favorites: STATE.favorites, tickets: STATE.tickets,
      notifications: STATE.notifications, announcements: STATE.announcements,
      chatMessages: STATE.chatMessages
    }));
  } catch(e) { console.log('Save error', e); }
}
function uid() { return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2,6); }
function sClass(s) {
  if (s === 'Pending' || s === 'OPEN') return 'status-pending';
  if (s === 'Approved' || s === 'Delivered' || s === 'Completed' || s === 'RESOLVED' || s === 'VERIFIED') return 'status-approved';
  if (s === 'Rejected') return 'status-rejected';
  return 'status-pending';
}
function closeModal(id) { var el = document.getElementById(id); if (el) el.style.display = 'none'; }

// ====== TOAST ======
function showToast(msg, type) {
  var c = document.getElementById('toastContainer');
  if (!c) return;
  var t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  var i = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  t.innerHTML = '<i class="fas ' + i + '"></i> ' + msg;
  c.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100%)';
    t.style.transition = 'all 0.3s';
    setTimeout(function() { t.remove(); }, 300);
  }, 4000);
}
function copyText(text) {
  if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { showToast('Copied!', 'success'); }); }
  else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('Copied!', 'success'); }
}

// ====== SEED DATA ======
function seedData() {
  if (STATE.products.length > 0) return;
  var products = [
    { lid:'0001', title:'Facebook Profile (1 Year Active)', cat:'Facebook Profile', price:1000, desc:'Aged Facebook profile, 1 year old, active user with posts. Transfer permitted. Email and password included. Good for advertising and networking.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 1*86400000).toISOString() },
    { lid:'0002', title:'Facebook Profile (2 Years Aged)', cat:'Facebook Profile', price:2000, desc:'Well-established Facebook profile with 2 years of activity. Friends, photos, timeline intact. Fully transferable with original email.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 2*86400000).toISOString() },
    { lid:'0003', title:'Instagram Business Profile', cat:'Instagram Business', price:2500, desc:'Instagram business account with followers and engagement. Perfect for affiliate marketing. Includes business email access.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 3*86400000).toISOString() },
    { lid:'0004', title:'Telegram Channel (1,000+ Members)', cat:'Telegram Channel', price:3000, desc:'Active Telegram channel with 1000+ real members. Niche topic with high engagement. Admin access fully transferable. Great for promotions.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 4*86400000).toISOString() },
    { lid:'0005', title:'Telegram Account (Aged 2 Years)', cat:'Telegram Account', price:1500, desc:'Aged Telegram account with groups and contacts. Active in multiple communities. Includes cloud chat history.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 5*86400000).toISOString() },
    { lid:'0006', title:'WhatsApp Account (Business Ready)', cat:'WhatsApp Account', price:1800, desc:'WhatsApp account ready for business use. Has broadcast lists and labels. Verified with SMS. Can be linked to WhatsApp Business API.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.9, seller:'zeus_admin', date:new Date(Date.now() - 6*86400000).toISOString() },
    { lid:'0007', title:'TikTok Creator Account (5K Followers)', cat:'TikTok Account', price:3500, desc:'TikTok creator account with 5,000+ followers. Videos with high views. Monetization eligible. Niche content with engaged audience.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 7*86400000).toISOString() },
    { lid:'0008', title:'Facebook Business Page (10K Likes)', cat:'Facebook Page', price:4000, desc:'Facebook business page with 10,000+ page likes. Active engagement. Suitable for product promotions and ads. Admin access transferred.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 8*86400000).toISOString() },
    { lid:'0009', title:'Twitter/X Account (Aged + Followers)', cat:'Twitter/X Account', price:2200, desc:'Aged Twitter/X account with organic followers. Good reputation score. Includes tweet history. Perfect for crypto or news niche.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.2, seller:'zeus_admin', date:new Date(Date.now() - 9*86400000).toISOString() },
    { lid:'0010', title:'YouTube Channel (1K Subs)', cat:'YouTube Channel', price:8000, desc:'Monetized YouTube channel with 1,000+ subscribers and 4,000+ watch hours. Content niche with growth potential. Full admin access.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:3, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 10*86400000).toISOString() },
    { lid:'0011', title:'Snapchat Account (High Score)', cat:'Snapchat Account', price:1200, desc:'Snapchat account with high snap score and streaks. Active friends list. Snapchat+ features enabled. Includes memories.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.1, seller:'zeus_admin', date:new Date(Date.now() - 11*86400000).toISOString() },
    { lid:'0012', title:'Discord Account (Nitro + Servers)', cat:'Discord Account', price:2500, desc:'Discord account with Nitro subscription. Member of active servers with high roles. Clean history. Developer mode enabled.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 12*86400000).toISOString() },
    { lid:'0013', title:'LinkedIn Professional Account', cat:'LinkedIn Account', price:3000, desc:'LinkedIn account with 500+ professional connections. Premium features. Perfect for B2B networking and job hunting. Clean profile.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 13*86400000).toISOString() },
    { lid:'0014', title:'Pinterest Account (Followers)', cat:'Pinterest Account', price:1500, desc:'Pinterest account with followers and organized boards. High monthly views on pins. Great for affiliate marketing and traffic.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 14*86400000).toISOString() },
    { lid:'0015', title:'Instagram Profile (Personal + Reels)', cat:'Instagram Profile', price:2000, desc:'Personal Instagram profile with posts, reels, and stories. Active followers. Has highlight features. Ready for content creation.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 15*86400000).toISOString() },
    { lid:'0016', title:'Telegram Premium Channel (5K)', cat:'Telegram Channel', price:5000, desc:'Premium Telegram channel with exclusive content. Has 5,000+ members. Perfect for crypto signals, news, or education. Full admin.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.9, seller:'zeus_admin', date:new Date(Date.now() - 16*86400000).toISOString() },
    { lid:'0017', title:'WhatsApp Business (API Ready)', cat:'WhatsApp Account', price:2800, desc:'WhatsApp Business account with catalogue, quick replies, labels. Verified green tick. Ready for WhatsApp Business API.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:1, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 17*86400000).toISOString() },
    { lid:'0018', title:'TikTok Business Account (10K)', cat:'TikTok Account', price:5500, desc:'TikTok business account with 10,000+ followers. TikTok Shop enabled. Access to analytics and ads manager. Viral niche.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.6, seller:'zeus_admin', date:new Date(Date.now() - 18*86400000).toISOString() },
    { lid:'0019', title:'Facebook Group (Niche 5K)', cat:'Facebook Page', price:3200, desc:'Facebook group with 5,000+ members in a specific niche. Active daily posts and engagement. Admin and moderator roles transferable.', img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', days:2, status:'Available', rating:4.4, seller:'zeus_admin', date:new Date(Date.now() - 19*86400000).toISOString() },
    { lid:'0020', title:'Premium Website Template', cat:'Website', price:5500, desc:'Modern HTML/CSS/JS website template. Fully responsive, 5 pages, dark mode, animations. Includes documentation and commercial license.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:4.8, seller:'zeus_admin', date:new Date(Date.now() - 20*86400000).toISOString() },
    { lid:'0021', title:'Premium Domain (business.ng)', cat:'Domain', price:8000, desc:'Premium .ng domain name: business.ng. Short, memorable, high SEO value. Transfer to any registrar. Perfect for Nigerian businesses.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:5.0, seller:'zeus_admin', date:new Date(Date.now() - 21*86400000).toISOString() },
    { lid:'0022', title:'Antivirus License (1 Year)', cat:'Software License', price:6000, desc:'Premium antivirus software license for 1 year. 5 devices. Includes firewall, VPN, password manager. Instant delivery via email.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:4.5, seller:'zeus_admin', date:new Date(Date.now() - 22*86400000).toISOString() },
    { lid:'0023', title:'Graphics Pack (500+ Assets)', cat:'Graphics', price:3500, desc:'500+ premium graphics assets including icons, illustrations, mockups, and templates. Commercial license included. PNG, SVG, PSD.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 23*86400000).toISOString() },
    { lid:'0024', title:'E-book: Digital Marketing Mastery', cat:'E-book', price:2000, desc:'Complete digital marketing e-book covering SEO, social media, email marketing, PPC, content strategy. 300+ pages, PDF format. Bonus templates.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:4.3, seller:'zeus_admin', date:new Date(Date.now() - 24*86400000).toISOString() },
    { lid:'0025', title:'Web Development Bootcamp Course', cat:'Course', price:12000, desc:'Complete web development course: HTML, CSS, JavaScript, React, Node.js. 60+ hours of video. Projects, quizzes, and certificate included.', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', days:0, status:'Available', rating:4.9, seller:'zeus_admin', date:new Date(Date.now() - 25*86400000).toISOString() },
    { lid:'0026', title:'Telegram Account (Original 2016)', cat:'Telegram Account', price:4000, desc:'Original Telegram account from 2016. Rare username. Active in premium groups. Cloud chat history preserved. Fully verified.', img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop', days:1, status:'Available', rating:5.0, seller:'zeus_admin', date:new Date(Date.now() - 26*86400000).toISOString() },
    { lid:'0027', title:'YouTube Channel (Monetized 5K)', cat:'YouTube Channel', price:20000, desc:'Fully monetized YouTube channel with 5,000+ subs and 10,000+ watch hours. Adsense attached. Content in Nigerian niche.', img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop', days:3, status:'Available', rating:4.7, seller:'zeus_admin', date:new Date(Date.now() - 27*86400000).toISOString() },
    { lid:'0028', title:'Telegram Channel (Crypto 50K)', cat:'Telegram Channel', price:25000, desc:'Massive Telegram channel with 50,000+ members in cryptocurrency niche. High engagement. Revenue from paid posts. Premium asset.', img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&h=300&fit=crop', days:3, status:'Available', rating:5.0, seller:'zeus_admin', date:new Date(Date.now() - 28*86400000).toISOString() }
  ];
  for (var i = 0; i < products.length; i++) { products[i].id = uid(); }
  STATE.products = products;
  save();
}

// ====== HIDE LOADING ======
function hideLoading() {
  var ls = document.getElementById('loadingScreen');
  if (ls) ls.classList.add('hidden');
}

// ====== AUTH ======
function switchAuthTab(tab) {
  var tabs = document.querySelectorAll('.auth-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  var forms = document.querySelectorAll('.auth-form');
  for (var i = 0; i < forms.length; i++) forms[i].classList.remove('active');
  document.getElementById('forgotForm').style.display = 'none';
  if (tab === 'login') { tabs[0].classList.add('active'); document.getElementById('loginForm').classList.add('active'); }
  else { tabs[1].classList.add('active'); document.getElementById('registerForm').classList.add('active'); }
}
function showForgot() {
  var forms = document.querySelectorAll('.auth-form');
  for (var i = 0; i < forms.length; i++) forms[i].classList.remove('active');
  document.getElementById('forgotForm').style.display = 'flex';
}
function togglePass(id) {
  var inp = document.getElementById(id);
  if (inp.type === 'password') inp.type = 'text'; else inp.type = 'password';
}

// ====== HANDLE REGISTER ======
function handleRegister(e) {
  e.preventDefault();
  var username = document.getElementById('regUsername').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var whatsapp = document.getElementById('regWhatsapp').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;
  var terms = document.getElementById('regTerms').checked;
  if (!username || !email || !whatsapp || !password || !confirm) { showToast('Please fill all fields', 'error'); return; }
  if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (!terms) { showToast('You must agree to Terms & Conditions', 'error'); return; }
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].username.toLowerCase() === username.toLowerCase()) { showToast('Username already exists', 'error'); return; }
    if (STATE.users[i].email.toLowerCase() === email.toLowerCase()) { showToast('Email already registered', 'error'); return; }
  }
  var user = { id: uid(), username: username, email: email, whatsapp: whatsapp, password: password, role: 'member', wallet: 0, name: username, phone: '', banned: false, createdAt: new Date().toISOString() };
  STATE.users.push(user);
  STATE.currentUser = user;
  STATE.notifications.unshift({ id: uid(), uid: user.id, msg: 'Account created! Login details sent to your WhatsApp. Check saved messages.', type: 'success', read: false, date: new Date().toISOString() });
  save();
  afterLogin();
  closeModal('authModal');
  showToast('Account created! Login sent to WhatsApp ' + whatsapp, 'success');
}

// ====== HANDLE LOGIN ======
function handleLogin(e) {
  e.preventDefault();
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value;
  if (username === 'demo_user' && password === 'User@123456') {
    var found = null;
    for (var i = 0; i < STATE.users.length; i++) { if (STATE.users[i].username === 'demo_user') { found = STATE.users[i]; break; } }
    if (!found) {
      found = { id: uid(), username: 'demo_user', email: 'demo@zeus.com', whatsapp: '23409066760078', password: 'User@123456', role: 'member', wallet: 25000, name: 'Demo User', phone: '09066760078', banned: false, createdAt: new Date().toISOString() };
      STATE.users.push(found);
    }
    STATE.currentUser = found; save(); afterLogin(); closeModal('authModal'); showToast('Welcome back, ' + found.username + '!', 'success'); return;
  }
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].username.toLowerCase() === username.toLowerCase() && STATE.users[i].password === password) {
      if (STATE.users[i].banned) { showToast('Account banned. Contact admin on WhatsApp 09066760078', 'error'); return; }
      STATE.currentUser = STATE.users[i]; save(); afterLogin(); closeModal('authModal'); showToast('Welcome back, ' + STATE.users[i].username + '!', 'success'); return;
    }
  }
  showToast('Invalid username or password', 'error');
}
function handleForgot(e) {
  e.preventDefault();
  var val = document.getElementById('forgotEmail').value.trim();
  var found = null;
  for (var i = 0; i < STATE.users.length; i++) { if (STATE.users[i].email === val || STATE.users[i].whatsapp === val) { found = STATE.users[i]; break; } }
  if (found) { showToast('Login sent to WhatsApp ' + (found.whatsapp || 'registered number'), 'success'); }
  else { showToast('Account not found. Contact admin on WhatsApp 09066760078', 'error'); }
}

// ====== AFTER LOGIN ======
function afterLogin() {
  document.getElementById('app').style.display = '';
  updateUI();
  showPage('welcome');
  document.getElementById('adminBtnSidebar').style.display = '';
  document.getElementById('adminBtnWelcome').style.display = '';
}

// ====== UPDATE UI ======
function updateUI() {
  if (!STATE.currentUser) return;
  document.getElementById('sidebarUsername').textContent = STATE.currentUser.username;
  document.getElementById('sidebarRole').textContent = STATE.currentUser.role === 'admin' ? 'Admin' : 'Member';
  document.getElementById('sidebarAvatar').textContent = STATE.currentUser.username.charAt(0).toUpperCase();
  var swa = document.getElementById('sidebarWhatsapp');
  if (swa) swa.innerHTML = '<i class="fab fa-whatsapp"></i> WA: ' + (STATE.currentUser.whatsapp || 'none');
  document.getElementById('profileAvatar').textContent = STATE.currentUser.username.charAt(0).toUpperCase();
  document.getElementById('profileNameDisplay').textContent = STATE.currentUser.name || STATE.currentUser.username;
  document.getElementById('profileEmailDisplay').textContent = STATE.currentUser.email;
  var pwa = document.getElementById('profileWhatsappDisplay');
  if (pwa) pwa.innerHTML = '<i class="fab fa-whatsapp"></i> WA: ' + (STATE.currentUser.whatsapp || 'Not set');
  if (document.getElementById('profileName')) document.getElementById('profileName').value = STATE.currentUser.name || '';
  if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = STATE.currentUser.email || '';
  if (document.getElementById('profileWhatsapp')) document.getElementById('profileWhatsapp').value = STATE.currentUser.whatsapp || '';
  if (document.getElementById('profilePhone')) document.getElementById('profilePhone').value = STATE.currentUser.phone || '';
  var unread = 0;
  for (var i = 0; i < STATE.notifications.length; i++) { if (STATE.notifications[i].uid === STATE.currentUser.id && !STATE.notifications[i].read) unread++; }
  var badge = document.getElementById('notifBadge');
  if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? '' : 'none'; }
  var wa = document.getElementById('walletAmount');
  if (wa) wa.textContent = 'NGN ' + (STATE.currentUser.wallet || 0).toLocaleString();
  var sp = document.getElementById('statProductsCount'); if (sp) sp.textContent = STATE.products.length + '+';
  var su = document.getElementById('statUsersCount'); if (su) su.textContent = STATE.users.length + '+';
  var so = document.getElementById('statOrdersCount'); if (so) so.textContent = STATE.orders.length + '+';
}

// ====== LOGOUT ======
function logout() {
  STATE.currentUser = null; save();
  document.getElementById('app').style.display = 'none';
  document.getElementById('authModal').style.display = 'flex';
  showToast('Logged out successfully', 'info');
}

// ====== SIDEBAR ======
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ====== SHOW PAGE ======
function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
  var target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  switch (name) {
    case 'marketplace': renderMarket(); break;
    case 'dashboard': renderDashboard(); break;
    case 'wallet': renderWallet(); break;
    case 'orders': renderOrders(); break;
    case 'favorites': renderFavorites(); break;
    case 'support': renderFAQ(); break;
    case 'profile': updateUI(); break;
    case 'notifications': renderNotifs(); break;
  }
  if (window.innerWidth <= 768) { document.getElementById('sidebar').classList.remove('open'); }
}

// ====== GET CATEGORIES ======
function getCategories() {
  var cats = [];
  for (var i = 0; i < STATE.products.length; i++) { if (cats.indexOf(STATE.products[i].cat) < 0) cats.push(STATE.products[i].cat); }
  return cats;
}

// ====== RENDER CATEGORIES BAR ======
function renderCategoriesBar() {
  var bar = document.getElementById('categoriesBar');
  if (!bar) return;
  var cats = getCategories();
  var html = '<button class="cat-chip active" onclick="filterCat(\'all\')"><i class="fas fa-th"></i> All</button>';
  for (var i = 0; i < cats.length; i++) {
    var icon = 'fas fa-tag'; var c = cats[i];
    if (c.indexOf('Telegram') >= 0) icon = 'fab fa-telegram'; else if (c.indexOf('WhatsApp') >= 0) icon = 'fab fa-whatsapp';
    else if (c.indexOf('TikTok') >= 0) icon = 'fab fa-tiktok'; else if (c.indexOf('Facebook') >= 0) icon = 'fab fa-facebook';
    else if (c.indexOf('Instagram') >= 0) icon = 'fab fa-instagram'; else if (c.indexOf('Twitter') >= 0) icon = 'fab fa-twitter';
    else if (c.indexOf('YouTube') >= 0) icon = 'fab fa-youtube'; else if (c.indexOf('Snapchat') >= 0) icon = 'fab fa-snapchat';
    else if (c.indexOf('Discord') >= 0) icon = 'fab fa-discord'; else if (c.indexOf('LinkedIn') >= 0) icon = 'fab fa-linkedin';
    else if (c.indexOf('Pinterest') >= 0) icon = 'fab fa-pinterest'; else if (c.indexOf('Website') >= 0 || c.indexOf('Domain') >= 0) icon = 'fas fa-globe';
    else if (c.indexOf('Software') >= 0) icon = 'fas fa-code'; else if (c.indexOf('Graphics') >= 0) icon = 'fas fa-palette';
    else if (c.indexOf('E-book') >= 0) icon = 'fas fa-book'; else if (c.indexOf('Course') >= 0) icon = 'fas fa-graduation-cap';
    html += '<button class="cat-chip" onclick="filterCat(\'' + cats[i] + '\')"><i class="' + icon + '"></i> ' + cats[i] + '</button>';
  }
  bar.innerHTML = html;
  var sel = document.getElementById('filterCategory');
  if (sel) {
    sel.innerHTML = '<option value="all">All Categories</option>';
    for (var i = 0; i < cats.length; i++) sel.innerHTML += '<option value="' + cats[i] + '">' + cats[i] + '</option>';
  }
}
var currentFilter = 'all';
function filterCat(cat) {
  currentFilter = cat;
  var chips = document.querySelectorAll('.cat-chip');
  for (var i = 0; i < chips.length; i++) {
    chips[i].classList.remove('active');
    if (cat === 'all' && chips[i].textContent.trim() === 'All') chips[i].classList.add('active');
    else if (chips[i].textContent.trim().indexOf(cat) >= 0) chips[i].classList.add('active');
  }
  var sel = document.getElementById('filterCategory');
  if (sel) sel.value = cat;
  renderMarket();
}

// ====== RENDER MARKETPLACE ======
function renderMarket() {
  renderCategoriesBar();
  var grid = document.getElementById('marketGrid');
  if (!grid) return;
  var search = (document.getElementById('marketSearch') ? document.getElementById('marketSearch').value : '').toLowerCase();
  var cat = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : 'all';
  var sort = document.getElementById('filterSort') ? document.getElementById('filterSort').value : 'newest';
  var filtered = [];
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    if (cat !== 'all' && p.cat !== cat) continue;
    if (p.status !== 'Available') continue;
    if (search && p.title.toLowerCase().indexOf(search) < 0 && p.desc.toLowerCase().indexOf(search) < 0) continue;
    filtered.push(p);
  }
  if (sort === 'low') filtered.sort(function(a,b){return a.price-b.price;});
  else if (sort === 'high') filtered.sort(function(a,b){return b.price-a.price;});
  else if (sort === 'oldest') filtered.sort(function(a,b){return parseInt(a.lid)-parseInt(b.lid);});
  else filtered.sort(function(a,b){return parseInt(b.lid)-parseInt(a.lid);});
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><i class="fas fa-search" style="font-size:48px;margin-bottom:16px;display:block;"></i>No products found</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var isFav = false;
    if (STATE.currentUser) { for (var j = 0; j < STATE.favorites.length; j++) { if (STATE.favorites[j].pid === p.id && STATE.favorites[j].uid === STATE.currentUser.id) { isFav = true; break; } } }
    var icon = 'fas fa-tag'; var c = p.cat;
    if (c.indexOf('Telegram') >= 0) icon = 'fab fa-telegram'; else if (c.indexOf('WhatsApp') >= 0) icon = 'fab fa-whatsapp';
    else if (c.indexOf('TikTok') >= 0) icon = 'fab fa-tiktok'; else if (c.indexOf('Facebook') >= 0) icon = 'fab fa-facebook';
    else if (c.indexOf('Instagram') >= 0) icon = 'fab fa-instagram'; else if (c.indexOf('Twitter') >= 0) icon = 'fab fa-twitter';
    else if (c.indexOf('YouTube') >= 0) icon = 'fab fa-youtube'; else if (c.indexOf('Snapchat') >= 0) icon = 'fab fa-snapchat';
    else if (c.indexOf('Discord') >= 0) icon = 'fab fa-discord'; else if (c.indexOf('LinkedIn') >= 0) icon = 'fab fa-linkedin';
    else if (c.indexOf('Pinterest') >= 0) icon = 'fab fa-pinterest'; else if (c.indexOf('Website') >= 0 || c.indexOf('Domain') >= 0) icon = 'fas fa-globe';
    else if (c.indexOf('Software') >= 0) icon = 'fas fa-code'; else if (c.indexOf('Graphics') >= 0) icon = 'fas fa-palette';
    else if (c.indexOf('E-book') >= 0) icon = 'fas fa-book'; else if (c.indexOf('Course') >= 0) icon = 'fas fa-graduation-cap';
    var stars = ''; var r = p.rating || 4.5;
    for (var s = 0; s < 5; s++) stars += s < Math.round(r) ? '<i class="fas fa-star" style="color:var(--warning);font-size:10px;"></i>' : '<i class="far fa-star" style="color:var(--text-muted);font-size:10px;"></i>';
    html += '<div class="product-card" onclick="showProduct(\'' + p.id + '\')">' +
      '<div class="pc-badge">#' + p.lid + '</div>' +
      '<div class="pc-category"><i class="' + icon + '"></i> ' + p.cat + ' ' + stars + '</div>' +
      '<div class="pc-title">' + p.title + '</div>' +
      '<div class="pc-price">NGN ' + p.price.toLocaleString() + '</div>' +
      '<div class="pc-desc">' + p.desc.substr(0,100) + '...</div>' +
      '<div class="pc-meta"><span><i class="fas fa-clock"></i> ' + (p.days > 0 ? p.days + ' day(s)' : 'Instant') + '</span>' +
      '<span><i class="fas fa-circle" style="color:' + (p.status === 'Available' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + p.status + '</span>' +
      '<span><i class="fas fa-star" style="color:var(--warning);"></i> ' + r + '</span></div>' +
      '<div class="pc-actions">' +
      '<button class="btn-primary" onclick="event.stopPropagation();openPayment(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy NGN' + p.price.toLocaleString() + '</button>' +
      '<button class="' + (isFav ? 'faved' : '') + '" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button>' +
      '</div></div>';
  }
  grid.innerHTML = html;
}

// ====== SHOW PRODUCT ======
function showProduct(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) { if (STATE.products[i].id === id) { p = STATE.products[i]; break; } }
  if (!p) return;
  var div = document.getElementById('productDetail');
  var isFav = false;
  if (STATE.currentUser) { for (var i = 0; i < STATE.favorites.length; i++) { if (STATE.favorites[i].pid === p.id && STATE.favorites[i].uid === STATE.currentUser.id) { isFav = true; break; } } }
  var stars = ''; var r = p.rating || 4.5;
  for (var s = 0; s < 5; s++) stars += s < Math.round(r) ? '<i class="fas fa-star" style="color:var(--warning);"></i>' : '<i class="far fa-star" style="color:var(--text-muted);"></i>';
  div.innerHTML = '<div class="prod-detail">' +
    '<div class="pd-category"><i class="fas fa-tag"></i> ' + p.cat + ' <span class="pc-badge" style="position:relative;top:0;right:0;display:inline-block;margin-left:8px;">#' + p.lid + '</span></div>' +
    '<div class="pd-title">' + p.title + '</div>' +
    '<div class="pd-price">NGN ' + p.price.toLocaleString() + '</div>' +
    '<div style="margin-bottom:12px;">' + stars + ' <span style="font-size:12px;color:var(--text-muted);">(' + r + '/5)</span></div>' +
    '<div class="pd-desc">' + p.desc + '</div>' +
    '<div class="pd-meta"><span><i class="fas fa-clock"></i> Delivery: ' + (p.days > 0 ? p.days + ' day(s)' : 'Instant') + '</span>' +
    '<span><i class="fas fa-circle" style="color:' + (p.status === 'Available' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + p.status + '</span>' +
    '<span><i class="fas fa-user"></i> Seller: ' + (p.seller || 'zeus_admin') + '</span></div>' +
    '<div class="pd-tags"><span>#' + p.lid + '</span><span>' + p.cat + '</span><span>Digital</span><span>Nigeria</span></div>' +
    '<div style="display:flex;gap:8px;margin-top:16px;">' +
    '<button class="btn-primary" onclick="closeModal(\'productModal\');openPayment(\'' + p.id + '\')" style="flex:1;"><i class="fas fa-shopping-cart"></i> Buy Now - NGN ' + p.price.toLocaleString() + '</button>' +
    '<button class="btn-secondary" onclick="toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i> ' + (isFav ? 'Unfavorite' : 'Favorite') + '</button></div></div>';
  document.getElementById('productModal').style.display = 'flex';
}

// ====== FAVORITES ======
function toggleFav(pid) {
  if (!STATE.currentUser) { showToast('Please login first', 'error'); document.getElementById('authModal').style.display = 'flex'; return; }
  var found = -1;
  for (var i = 0; i < STATE.favorites.length; i++) { if (STATE.favorites[i].pid === pid && STATE.favorites[i].uid === STATE.currentUser.id) { found = i; break; } }
  if (found >= 0) { STATE.favorites.splice(found, 1); showToast('Removed from favorites', 'info'); }
  else { STATE.favorites.push({id:uid(), pid:pid, uid:STATE.currentUser.id, date:new Date().toISOString()}); showToast('Added to favorites!', 'success'); }
  save(); renderMarket();
}

// ====== RENDER FAVORITES ======
function renderFavorites() {
  var grid = document.getElementById('favoritesGrid');
  if (!grid) return;
  if (!STATE.currentUser) { grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><i class="fas fa-heart" style="font-size:48px;margin-bottom:16px;display:block;"></i>Please login</div>'; return; }
  var favIds = [];
  for (var i = 0; i < STATE.favorites.length; i++) { if (STATE.favorites[i].uid === STATE.currentUser.id) favIds.push(STATE.favorites[i].pid); }
  if (favIds.length === 0) { grid.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><i class="fas fa-heart" style="font-size:48px;margin-bottom:16px;display:block;"></i>No favorites yet</div>'; return; }
  var filtered = [];
  for (var i = 0; i < STATE.products.length; i++) { for (var j = 0; j < favIds.length; j++) { if (STATE.products[i].id === favIds[j]) { filtered.push(STATE.products[i]); break; } } }
  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    html += '<div class="product-card" onclick="showProduct(\'' + p.id + '\')">' +
      '<div class="pc-badge">#' + p.lid + '</div><div class="pc-category"><i class="fas fa-tag"></i> ' + p.cat + '</div>' +
      '<div class="pc-title">' + p.title + '</div><div class="pc-price">NGN ' + p.price.toLocaleString() + '</div>' +
      '<div class="pc-desc">' + p.desc.substr(0,80) + '...</div>' +
      '<div class="pc-actions"><button class="btn-primary" onclick="event.stopPropagation();openPayment(\'' + p.id + '\')" style="flex:1;">Buy</button>' +
      '<button class="faved" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button></div></div>';
  }
  grid.innerHTML = html;
}

// ====== PAYMENT ======
function openPayment(pid) {
  if (!STATE.currentUser) { showToast('Please login first', 'error'); document.getElementById('authModal').style.display = 'flex'; return; }
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) { if (STATE.products[i].id === pid) { p = STATE.products[i]; break; } }
  if (!p) return;
  document.getElementById('payProductId').value = p.id;
  document.getElementById('payProduct').value = p.lid + ' - ' + p.title;
  document.getElementById('payAmount').value = p.price;
  document.getElementById('payName').value = STATE.currentUser.name || STATE.currentUser.username;
  document.getElementById('payUsername').value = STATE.currentUser.username;
  document.getElementById('payDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('paymentModal').style.display = 'flex';
}
function submitPayment(e) {
  e.preventDefault();
  var pid = document.getElementById('payProductId').value;
  var name = document.getElementById('payName').value.trim();
  var product = document.getElementById('payProduct').value;
  var amount = parseFloat(document.getElementById('payAmount').value);
  var ref = document.getElementById('payRef').value.trim();
  var date = document.getElementById('payDate').value;
  var notes = document.getElementById('payNotes').value.trim();
  if (!name || !product || !amount || !ref || !date) { showToast('Please fill all required fields', 'error'); return; }
  var payment = { id: uid(), pid: pid, uid: STATE.currentUser.id, name: name, username: STATE.currentUser.username, product: product, amount: amount, ref: ref, date: date, notes: notes, status: 'PENDING', createdAt: new Date().toISOString() };
  STATE.payments.push(payment);
  var orderNum = String(STATE.orders.length + 1).padStart(4, '0');
  var order = { id: uid(), num: orderNum, pid: pid, uid: STATE.currentUser.id, product: product, amount: amount, buyerName: name, buyerUsername: STATE.currentUser.username, status: 'Pending', paymentId: payment.id, deliveryLogin: '', deliveryMsg: '', deliveryDate: '', createdAt: new Date().toISOString() };
  STATE.orders.push(order);
  STATE.notifications.unshift({ id: uid(), uid: STATE.currentUser.id, msg: 'Payment submitted for ' + product + '. Waiting for admin verification. Contact admin on WhatsApp 09066760078 for fast processing.', type: 'info', read: false, date: new Date().toISOString() });
  save(); closeModal('paymentModal'); document.getElementById('paymentForm').reset();
  showToast('Payment submitted! Admin will verify shortly.', 'success'); updateUI();
}

// ====== DEPOSIT ======
function openDeposit() { if (!STATE.currentUser) { showToast('Please login', 'error'); return; } document.getElementById('depositModal').style.display = 'flex'; }
function handleDeposit(e) {
  e.preventDefault();
  var amount = parseFloat(document.getElementById('depositAmount').value);
  var ref = document.getElementById('depositRef').value.trim();
  var notes = document.getElementById('depositNotes').value.trim();
  if (!amount || !ref) { showToast('Fill all fields', 'error'); return; }
  STATE.deposits.push({ id: uid(), uid: STATE.currentUser.id, amount: amount, ref: ref, notes: notes, status: 'PENDING', date: new Date().toISOString() });
  STATE.notifications.unshift({ id: uid(), uid: STATE.currentUser.id, msg: 'Deposit of NGN ' + amount.toLocaleString() + ' submitted. Waiting for admin verification.', type: 'info', read: false, date: new Date().toISOString() });
  save(); closeModal('depositModal'); showToast('Deposit submitted for verification!', 'success');
}
function openWithdraw() {
  if (!STATE.currentUser) { showToast('Please login', 'error'); return; }
  if ((STATE.currentUser.wallet || 0) < 100) { showToast('Minimum withdrawal is NGN 100', 'error'); return; }
  document.getElementById('withdrawWhatsapp').value = STATE.currentUser.whatsapp || '';
  document.getElementById('withdrawName').value = STATE.currentUser.name || '';
  document.getElementById('withdrawModal').style.display = 'flex';
}
function handleWithdraw(e) {
  e.preventDefault();
  var amount = parseFloat(document.getElementById('withdrawAmount').value);
  var whatsapp = document.getElementById('withdrawWhatsapp').value.trim();
  var name = document.getElementById('withdrawName').value.trim();
  if (!amount || !whatsapp || !name) { showToast('Fill all fields', 'error'); return; }
  if (amount < 100) { showToast('Minimum NGN 100', 'error'); return; }
  if (amount > (STATE.currentUser.wallet || 0)) { showToast('Insufficient balance', 'error'); return; }
  STATE.withdrawals.push({ id: uid(), uid: STATE.currentUser.id, amount: amount, whatsapp: whatsapp, name: name, status: 'PENDING', date: new Date().toISOString() });
  for (var i = 0; i < STATE.users.length; i++) { if (STATE.users[i].id === STATE.currentUser.id) { STATE.users[i].wallet = (STATE.users[i].wallet || 0) - amount; STATE.currentUser = STATE.users[i]; break; } }
  STATE.notifications.unshift({ id: uid(), uid: STATE.currentUser.id, msg: 'Withdrawal of NGN ' + amount.toLocaleString() + ' requested. Admin will send to ' + whatsapp, type: 'info', read: false, date: new Date().toISOString() });
  save(); closeModal('withdrawModal'); showToast('Withdrawal request submitted!', 'success'); updateUI();
}

// ====== ORDERS ======
function renderOrders() {
  var div = document.getElementById('ordersList');
  if (!div) return;
  if (!STATE.currentUser) { div.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Please login</p>'; return; }
  var userOrders = [];
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].uid === STATE.currentUser.id) userOrders.push(STATE.orders[i]); }
  if (userOrders.length === 0) { div.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><i class="fas fa-truck" style="font-size:48px;margin-bottom:16px;display:block;"></i>No orders yet</div>'; return; }
  var html = '';
  for (var i = userOrders.length - 1; i >= 0; i--) {
    var o = userOrders[i];
    html += '<div class="order-item" onclick="showOrderDetail(\'' + o.id + '\')">' +
      '<div class="order-info"><h4>' + o.product + '</h4><p>Order #' + o.num + ' - NGN ' + o.amount.toLocaleString() + '</p></div>' +
      '<div><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div></div>';
  }
  div.innerHTML = html;
}
function showOrderDetail(id) {
  var o = null;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].id === id) { o = STATE.orders[i]; break; } }
  if (!o) return;
  var div = document.getElementById('orderDetailContent');
  var loginInfo = '';
  if (o.deliveryLogin) {
    loginInfo = '<div class="glass-sm" style="margin-top:12px;border-color:var(--neon-green);">' +
      '<p style="font-weight:700;color:var(--neon-green);">Product Delivered!</p>' +
      '<p style="font-size:13px;word-break:break-all;"><strong>Login Details:</strong> ' + o.deliveryLogin + '</p>' +
      (o.deliveryMsg ? '<p style="font-size:13px;"><strong>Message:</strong> ' + o.deliveryMsg + '</p>' : '') +
      '<p style="font-size:11px;color:var(--text-muted);">Delivered: ' + new Date(o.deliveryDate).toLocaleDateString() + '</p></div>';
  }
  div.innerHTML = '<p><strong>Order #:</strong> ' + o.num + '</p><p><strong>Product:</strong> ' + o.product + '</p><p><strong>Amount:</strong> NGN ' + o.amount.toLocaleString() + '</p>' +
    '<p><strong>Status:</strong> <span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></p><p><strong>Date:</strong> ' + new Date(o.createdAt).toLocaleDateString() + '</p>' + loginInfo;
  document.getElementById('orderDetailModal').style.display = 'flex';
}

// ====== DASHBOARD ======
function renderDashboard() {
  if (!STATE.currentUser) return;
  var statsDiv = document.getElementById('dashStats');
  var activityDiv = document.getElementById('dashActivity');
  var totalOrders = 0, totalSpent = 0, completedOrders = 0;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].uid === STATE.currentUser.id) { totalOrders++; totalSpent += STATE.orders[i].amount; if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') completedOrders++; } }
  statsDiv.innerHTML = '<div class="stat-card"><h3 style="color:var(--neon-blue);">' + totalOrders + '</h3><p>Orders</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">NGN ' + totalSpent.toLocaleString() + '</h3><p>Total Spent</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-purple);">' + completedOrders + '</h3><p>Delivered</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-pink);">NGN ' + (STATE.currentUser.wallet || 0).toLocaleString() + '</h3><p>Wallet</p></div>';
  var userNotifs = [];
  for (var i = 0; i < STATE.notifications.length; i++) { if (STATE.notifications[i].uid === STATE.currentUser.id) userNotifs.push(STATE.notifications[i]); }
  if (userNotifs.length === 0) { activityDiv.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No recent activity</p>'; }
  else {
    var html = '';
    var max = userNotifs.length > 5 ? 5 : userNotifs.length;
    for (var i = 0; i < max; i++) {
      var n = userNotifs[i];
      html += '<div class="glass-sm" style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
        '<i class="fas fa-circle" style="font-size:8px;color:' + (n.type === 'success' ? 'var(--success)' : n.type === 'error' ? 'var(--danger)' : 'var(--neon-blue)') + ';flex-shrink:0;"></i>' +
        '<span style="font-size:13px;flex:1;">' + n.msg + '</span>' +
        '<span style="font-size:11px;color:var(--text-muted);flex-shrink:0;">' + new Date(n.date).toLocaleDateString() + '</span></div>';
    }
    activityDiv.innerHTML = html;
  }
}

// ====== WALLET ======
function renderWallet() {
  if (!STATE.currentUser) return;
  var wa = document.getElementById('walletAmount');
  if (wa) wa.textContent = 'NGN ' + (STATE.currentUser.wallet || 0).toLocaleString();
  var hist = document.getElementById('walletHistory');
  var tx = [];
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].uid === STATE.currentUser.id) tx.push({type:'debit', amount:STATE.orders[i].amount, desc:STATE.orders[i].product, date:STATE.orders[i].createdAt}); }
  for (var i = 0; i < STATE.deposits.length; i++) { if (STATE.deposits[i].uid === STATE.currentUser.id && STATE.deposits[i].status === 'VERIFIED') tx.push({type:'credit', amount:STATE.deposits[i].amount, desc:'Deposit - ' + STATE.deposits[i].ref, date:STATE.deposits[i].date}); }
  for (var i = 0; i < STATE.withdrawals.length; i++) { if (STATE.withdrawals[i].uid === STATE.currentUser.id) tx.push({type:'debit', amount:STATE.withdrawals[i].amount, desc:'Withdrawal to ' + STATE.withdrawals[i].whatsapp, date:STATE.withdrawals[i].date}); }
  if (tx.length === 0) { hist.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No transactions yet</p>'; return; }
  tx.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  var html = '';
  for (var i = 0; i < tx.length; i++) {
    var t = tx[i];
    html += '<div class="glass-sm" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
      '<div><span style="font-size:13px;">' + t.desc + '</span><br><span style="font-size:11px;color:var(--text-muted);">' + new Date(t.date).toLocaleDateString() + '</span></div>' +
      '<div style="text-align:right;"><span style="font-weight:700;color:' + (t.type === 'credit' ? 'var(--success)' : 'var(--danger)') + ';">' + (t.type === 'credit' ? '+' : '-') + 'NGN ' + t.amount.toLocaleString() + '</span></div></div>';
  }
  hist.innerHTML = html;
}

// ====== NOTIFICATIONS ======
function renderNotifs() {
  var div = document.getElementById('notificationsList');
  if (!div) return;
  if (!STATE.currentUser) { div.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Please login</p>'; return; }
  var userNotifs = [];
  for (var i = 0; i < STATE.notifications.length; i++) { if (STATE.notifications[i].uid === STATE.currentUser.id) userNotifs.push(STATE.notifications[i]); }
  for (var i = 0; i < STATE.notifications.length; i++) { if (STATE.notifications[i].uid === STATE.currentUser.id) STATE.notifications[i].read = true; }
  save(); updateUI();
  if (userNotifs.length === 0) { div.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><i class="fas fa-bell" style="font-size:48px;margin-bottom:16px;display:block;"></i>No notifications</div>'; return; }
  var html = '';
  for (var i = userNotifs.length - 1; i >= 0; i--) {
    var n = userNotifs[i];
    var icon = n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    html += '<div class="notif-item"><div class="notif-icon"><i class="fas ' + icon + '"></i></div><div><div class="notif-msg">' + n.msg + '</div><div class="notif-date">' + new Date(n.date).toLocaleDateString() + '</div></div></div>';
  }
  div.innerHTML = html;
}
function clearNotifs() {
  if (!STATE.currentUser) return;
  var remaining = [];
  for (var i = 0; i < STATE.notifications.length; i++) { if (STATE.notifications[i].uid !== STATE.currentUser.id) remaining.push(STATE.notifications[i]); }
  STATE.notifications = remaining; save(); renderNotifs(); updateUI(); showToast('Notifications cleared', 'info');
}

// ====== SUPPORT ======
function switchSupportTab(tab) {
  var tabs = document.querySelectorAll('.support-tab');
  var contents = document.querySelectorAll('.support-content');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < contents.length; i++) contents[i].classList.remove('active');
  if (tab === 'faq') { tabs[0].classList.add('active'); document.getElementById('faqContent').classList.add('active'); renderFAQ(); }
  else if (tab === 'tickets') { tabs[1].classList.add('active'); document.getElementById('ticketsContent').classList.add('active'); renderTickets(); }
  else if (tab === 'livechat') { tabs[2].classList.add('active'); document.getElementById('livechatContent').classList.add('active'); renderLiveChat(); }
}
function renderFAQ() {
  var div = document.getElementById('faqContent');
  var faqs = [
    {q:'How do I buy?',a:'Browse marketplace, click Buy, send payment to OPay account 9066760078, submit payment form. Admin verifies within 24hrs.'},
    {q:'Delivery time?',a:'1-3 days after payment verification. Login details sent to your WhatsApp.'},
    {q:'Payments?',a:'OPay only. Account: CHRISTIANA GODWIN OKON, Number: 9066760078.'},
    {q:'How do I receive product?',a:'After verification, admin sends login credentials to your WhatsApp and order details.'},
    {q:'Refund policy?',a:'7-day refund for undelivered or misrepresented products. Contact support.'},
    {q:'Contact support?',a:'Open ticket, live chat, or WhatsApp 09066760078.'},
    {q:'Deposits?',a:'Send money to OPay account, go to Wallet > Deposit, submit reference. Admin credits wallet.'},
    {q:'Withdrawals?',a:'Wallet > Withdraw, enter amount and WhatsApp number. Admin sends via OPay.'}
  ];
  var html = '';
  for (var i = 0; i < faqs.length; i++) {
    html += '<div class="faq-item"><button class="faq-q" onclick="toggleFaq(this)">' + faqs[i].q + ' <i class="fas fa-chevron-down"></i></button><div class="faq-a">' + faqs[i].a + '</div></div>';
  }
  div.innerHTML = html;
}
function toggleFaq(btn) { btn.classList.toggle('open'); btn.nextElementSibling.classList.toggle('open'); }
function renderTickets() {
  var div = document.getElementById('ticketsContent');
  if (!STATE.currentUser) { div.innerHTML = '<p style="color:var(--text-muted);">Please login</p>'; return; }
  var html = '<h3>Submit Ticket</h3><form onsubmit="submitTicket(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' +
    '<div class="input-group"><input type="text" id="ticketSubject" placeholder="Subject" required /></div>' +
    '<div class="input-group"><textarea id="ticketMessage" placeholder="Describe your issue..." rows="3" required></textarea></div>' +
    '<div class="input-group"><select id="ticketPriority"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>' +
    '<button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Submit</button></form>';
  var myTickets = [];
  for (var i = 0; i < STATE.tickets.length; i++) { if (STATE.tickets[i].uid === STATE.currentUser.id) myTickets.push(STATE.tickets[i]); }
  if (myTickets.length > 0) {
    html += '<h3>Your Tickets</h3>';
    for (var i = myTickets.length - 1; i >= 0; i--) {
      var t = myTickets[i];
      html += '<div class="glass-sm" style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;">' +
        '<span style="font-weight:600;">' + t.subject + '</span><span class="status-badge ' + (t.status==='OPEN'?'status-pending':'status-approved') + '">' + t.status + '</span></div>' +
        '<p style="font-size:13px;color:var(--text-secondary);">' + t.message + '</p><span style="font-size:11px;color:var(--text-muted);">' + new Date(t.date).toLocaleDateString() + ' - ' + t.priority + '</span></div>';
    }
  }
  div.innerHTML = html;
}
function submitTicket(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Please login', 'error'); return; }
  var s = document.getElementById('ticketSubject').value.trim();
  var m = document.getElementById('ticketMessage').value.trim();
  var p = document.getElementById('ticketPriority').value;
  if (!s || !m) { showToast('Fill all fields', 'error'); return; }
  STATE.tickets.push({id:uid(), uid:STATE.currentUser.id, username:STATE.currentUser.username, whatsapp:STATE.currentUser.whatsapp, subject:s, message:m, priority:p, status:'OPEN', date:new Date().toISOString()});
  STATE.notifications.unshift({id:uid(), uid:STATE.currentUser.id, msg:'Ticket "' + s + '" submitted. Admin will respond via WhatsApp.', type:'info', read:false, date:new Date().toISOString()});
  save(); document.getElementById('ticketSubject').value = ''; document.getElementById('ticketMessage').value = '';
  renderTickets(); updateUI(); showToast('Ticket submitted!', 'success');
}
function renderLiveChat() {
  var div = document.getElementById('livechatContent');
  if (!STATE.currentUser) { div.innerHTML = '<p style="color:var(--text-muted);">Please login</p>'; return; }
  var html = '<div class="chat-container"><div class="glass-sm" style="max-height:300px;overflow-y:auto;padding:16px;margin-bottom:16px;" id="chatBox">';
  var msgs = [];
  for (var i = 0; i < STATE.chatMessages.length; i++) { if (STATE.chatMessages[i].uid === STATE.currentUser.id || STATE.chatMessages[i].uid === 'admin') msgs.push(STATE.chatMessages[i]); }
  msgs = msgs.slice(-20);
  if (msgs.length === 0) { html += '<p style="color:var(--text-muted);text-align:center;padding:20px;">Start a conversation. Admin responds via WhatsApp 09066760078</p>'; }
  else { for (var i = 0; i < msgs.length; i++) { var m = msgs[i]; var isAdmin = m.uid === 'admin'; html += '<div class="chat-message' + (isAdmin ? ' admin' : '') + '"><div class="chat-bubble">' + m.msg + '<div class="chat-time">' + (isAdmin ? 'Admin' : 'You') + ' - ' + new Date(m.date).toLocaleTimeString() + '</div></div></div>'; } }
  html += '</div><form onsubmit="sendChatMsg(event)" style="display:flex;gap:8px;">' +
    '<div class="input-group" style="flex:1;margin:0;"><input type="text" id="chatInput" placeholder="Type..." required /></div>' +
    '<button type="submit" class="btn-primary" style="width:auto;padding:12px 20px;"><i class="fas fa-paper-plane"></i></button></form>' +
    '<p style="font-size:12px;color:var(--text-muted);">For urgent: WhatsApp 09066760078</p></div>';
  div.innerHTML = html;
}
function sendChatMsg(e) {
  e.preventDefault();
  var msg = document.getElementById('chatInput').value.trim();
  if (!msg || !STATE.currentUser) return;
  STATE.chatMessages.push({id:uid(), uid:STATE.currentUser.id, msg:msg, date:new Date().toISOString()});
  save(); document.getElementById('chatInput').value = ''; renderLiveChat();
}

// ====== PROFILE ======
function updateProfile(e) {
  e.preventDefault();
  if (!STATE.currentUser) return;
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id === STATE.currentUser.id) {
      STATE.users[i].name = document.getElementById('profileName').value;
      STATE.users[i].email = document.getElementById('profileEmail').value;
      STATE.users[i].whatsapp = document.getElementById('profileWhatsapp').value;
      STATE.users[i].phone = document.getElementById('profilePhone').value;
      STATE.currentUser = STATE.users[i]; break;
    }
  }
  save(); updateUI(); showToast('Profile updated!', 'success');
}

// ====== THEME ======
function toggleTheme() {
  var h = document.documentElement;
  var n = h.getAttribute('data-theme') === 'light' ? '' : 'light';
  h.setAttribute('data-theme', n); localStorage.setItem('zt', n);
  var t = document.getElementById('darkModeToggle'); if (t) t.checked = n === 'light';
}

// ====== ADMIN ======
function openAdminPass() { document.getElementById('adminPassInput').value = ''; document.getElementById('adminPassError').style.display = 'none'; document.getElementById('adminPassModal').style.display = 'flex'; }
function verifyAdmin() {
  var code = document.getElementById('adminPassInput').value;
  if (code === 'admin@zeus2026') {
    closeModal('adminPassModal');
    if (STATE.currentUser) { for (var i = 0; i < STATE.users.length; i++) { if (STATE.users[i].id === STATE.currentUser.id) { STATE.users[i].role = 'admin'; STATE.currentUser = STATE.users[i]; break; } } save(); updateUI(); }
    showPage('admin'); switchAdmin('overview'); showToast('Admin access granted!', 'success');
  } else { document.getElementById('adminPassError').style.display = 'block'; setTimeout(function(){document.getElementById('adminPassError').style.display='none';},3000); }
}
function switchAdmin(tab) {
  var tabs = document.querySelectorAll('.admin-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < tabs.length; i++) { if (tabs[i].textContent.trim().toLowerCase() === tab) { tabs[i].classList.add('active'); break; } }
  var fns = {overview:renderAdminOverview, payments:adminPayments, deposits:adminDeposits, withdrawals:adminWithdrawals, orders:adminOrders, users:adminUsers, products:adminProducts, announce:adminAnnounce, tickets:adminTickets, analytics:adminAnalytics};
  if (fns[tab]) fns[tab]();
}

// ====== ADMIN OVERVIEW ======
function renderAdminOverview() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var pendPay=0, pendDep=0, pendWit=0;
  for (var i=0;i<STATE.payments.length;i++){if(STATE.payments[i].status==='PENDING')pendPay++;}
  for (var i=0;i<STATE.deposits.length;i++){if(STATE.deposits[i].status==='PENDING')pendDep++;}
  for (var i=0;i<STATE.withdrawals.length;i++){if(STATE.withdrawals[i].status==='PENDING')pendWit++;}
  var rev=0; for(var i=0;i<STATE.orders.length;i++){if(STATE.orders[i].status==='Delivered'||STATE.orders[i].status==='Completed')rev+=STATE.orders[i].amount;}
  c.innerHTML = '<div class="dash-stats" style="margin-bottom:24px;">' +
    '<div class="stat-card"><h3 style="color:var(--neon-blue);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">' + STATE.products.length + '</h3><p>Products</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-purple);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-pink);">' + pendPay + '</h3><p>Pending Pay</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">NGN ' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--warning);">' + pendDep + '</h3><p>Deposits</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--danger);">' + pendWit + '</h3><p>Withdrawals</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--info);">' + STATE.tickets.length + '</h3><p>Tickets</p></div></div>' +
    '<h3>Quick Actions</h3><div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-primary" onclick="switchAdmin(\'payments\')" style="width:auto;"><i class="fas fa-credit-card"></i> Payments (' + pendPay + ')</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'deposits\')" style="width:auto;">Deposits (' + pendDep + ')</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'withdrawals\')" style="width:auto;">Withdrawals (' + pendWit + ')</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'orders\')" style="width:auto;">Orders</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'users\')" style="width:auto;">Users</button></div>';
}

// ====== ADMIN PAYMENTS ======
function adminPayments() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  if (STATE.payments.length === 0) { c.innerHTML = '<h3>Payment Submissions</h3><p style="color:var(--text-muted);">No payments yet</p>'; return; }
  var html = '<h3>Payment Submissions</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>Product</th><th>Amount</th><th>Ref</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.payments.length - 1; i >= 0; i--) {
    var p = STATE.payments[i];
    html += '<tr><td>' + p.name + '</td><td>' + p.product + '</td><td>NGN ' + p.amount.toLocaleString() + '</td><td>' + p.ref + '</td><td>' + new Date(p.createdAt).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + (p.status === 'PENDING' ? 'status-pending' : p.status === 'APPROVED' ? 'status-approved' : 'status-rejected') + '">' + p.status + '</span></td>' +
      '<td>' + (p.status === 'PENDING' ? '<button class="action-btn approve-btn" onclick="approvePay(\'' + p.id + '\')">Approve</button><button class="action-btn reject-btn" onclick="rejectPay(\'' + p.id + '\')">Reject</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function approvePay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'APPROVED';
      var buyerUid = STATE.payments[i].uid;
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].paymentId === id) {
          STATE.orders[j].status = 'Approved';
          STATE.notifications.unshift({id:uid(), uid:STATE.orders[j].uid, msg:'Payment for ' + STATE.orders[j].product + ' approved! Awaiting delivery.', type:'success', read:false, date:new Date().toISOString()});
          break;
        }
      }
      break;
    }
  }
  save(); adminPayments(); renderAdminOverview(); updateUI(); showToast('Payment Approved!', 'success');
}
function rejectPay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'REJECTED';
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].paymentId === id) { STATE.orders[j].status = 'Pending'; STATE.notifications.unshift({id:uid(), uid:STATE.orders[j].uid, msg:'Payment rejected for ' + STATE.orders[j].product + '. Contact admin on WhatsApp 09066760078.', type:'error', read:false, date:new Date().toISOString()}); break; }
      }
      break;
    }
  }
  save(); adminPayments(); updateUI(); showToast('Payment Rejected', 'error');
}

// ====== ADMIN DEPOSITS ======
function adminDeposits() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  if (STATE.deposits.length === 0) { c.innerHTML = '<h3>Deposit Requests</h3><p style="color:var(--text-muted);">No deposits yet</p>'; return; }
  var html = '<h3>Deposit Requests</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User ID</th><th>Amount</th><th>Ref</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.deposits.length - 1; i >= 0; i--) {
    var d = STATE.deposits[i];
    html += '<tr><td>' + d.uid.substr(0,10) + '...</td><td>NGN ' + d.amount.toLocaleString() + '</td><td>' + d.ref + '</td><td>' + new Date(d.date).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + (d.status === 'PENDING' ? 'status-pending' : 'status-approved') + '">' + d.status + '</span></td>' +
      '<td>' + (d.status === 'PENDING' ? '<button class="action-btn approve-btn" onclick="approveDep(\'' + d.id + '\')">Verify</button><button class="action-btn reject-btn" onclick="rejectDep(\'' + d.id + '\')">Reject</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function approveDep(id) {
  for (var i = 0; i < STATE.deposits.length; i++) {
    if (STATE.deposits[i].id === id) {
      STATE.deposits[i].status = 'VERIFIED';
      for (var j = 0; j < STATE.users.length; j++) {
        if (STATE.users[j].id === STATE.deposits[i].uid) {
          STATE.users[j].wallet = (STATE.users[j].wallet || 0) + STATE.deposits[i].amount;
          STATE.notifications.unshift({id:uid(), uid:STATE.users[j].id, msg:'Deposit of NGN ' + STATE.deposits[i].amount.toLocaleString() + ' verified! Wallet credited.', type:'success', read:false, date:new Date().toISOString()});
          if (STATE.currentUser && STATE.currentUser.id === STATE.users[j].id) STATE.currentUser = STATE.users[j];
          break;
        }
      }
      break;
    }
  }
  save(); adminDeposits(); renderAdminOverview(); updateUI(); showToast('Deposit Verified!', 'success');
}
function rejectDep(id) {
  for (var i = 0; i < STATE.deposits.length; i++) { if (STATE.deposits[i].id === id) { STATE.deposits[i].status = 'REJECTED'; break; } }
  save(); adminDeposits(); showToast('Deposit Rejected', 'error');
}

// ====== ADMIN WITHDRAWALS ======
function adminWithdrawals() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  if (STATE.withdrawals.length === 0) { c.innerHTML = '<h3>Withdrawal Requests</h3><p style="color:var(--text-muted);">No withdrawals yet</p>'; return; }
  var html = '<h3>Withdrawal Requests</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>Amount</th><th>WhatsApp</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.withdrawals.length - 1; i >= 0; i--) {
    var w = STATE.withdrawals[i];
    html += '<tr><td>' + w.name + '</td><td>NGN ' + w.amount.toLocaleString() + '</td><td>' + w.whatsapp + '</td><td>' + new Date(w.date).toLocaleDateString() + '</td>' +
      '<td><span class="status-badge ' + (w.status === 'PENDING' ? 'status-pending' : 'status-approved') + '">' + w.status + '</span></td>' +
      '<td>' + (w.status === 'PENDING' ? '<button class="action-btn approve-btn" onclick="approveWit(\'' + w.id + '\')">Paid</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function approveWit(id) {
  for (var i = 0; i < STATE.withdrawals.length; i++) {
    if (STATE.withdrawals[i].id === id) {
      STATE.withdrawals[i].status = 'PAID';
      STATE.notifications.unshift({id:uid(), uid:STATE.withdrawals[i].uid, msg:'Withdrawal of NGN ' + STATE.withdrawals[i].amount.toLocaleString() + ' sent to ' + STATE.withdrawals[i].whatsapp + ' via OPay.', type:'success', read:false, date:new Date().toISOString()});
      break;
    }
  }
  save(); adminWithdrawals(); updateUI(); showToast('Marked as Paid', 'success');
}

// ====== ADMIN ORDERS ======
function adminOrders() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>All Orders</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>WhatsApp</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.orders.length - 1; i >= 0; i--) {
    var o = STATE.orders[i];
    var buyerWA = '';
    for (var j = 0; j < STATE.users.length; j++) { if (STATE.users[j].id === o.uid) { buyerWA = STATE.users[j].whatsapp || ''; break; } }
    html += '<tr><td>#' + o.num + '</td><td>' + o.product.substr(0,25) + '</td><td>' + o.buyerName + '</td><td>NGN ' + o.amount.toLocaleString() + '</td>' +
      '<td><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></td><td>' + buyerWA + '</td>' +
      '<td>' + (o.status === 'Approved' ? '<button class="action-btn approve-btn" onclick="openDelivery(\'' + o.id + '\')">Deliver</button>' : o.status === 'Delivered' ? '<span style="font-size:11px;color:var(--success);">Done</span>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function openDelivery(orderId) {
  // Find the order
  var o = null;
  for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].id === orderId) { o = STATE.orders[i]; break; } }
  if (!o) return;
  // Find buyer's WhatsApp
  var wa = '';
  for (var j = 0; j < STATE.users.length; j++) { if (STATE.users[j].id === o.uid) { wa = STATE.users[j].whatsapp || ''; break; } }
  document.getElementById('deliveryInfo').innerHTML = '<p><strong>Order:</strong> #' + o.num + '</p><p><strong>Product:</strong> ' + o.product + '</p><p><strong>Buyer:</strong> ' + o.buyerName + '</p>' +
    '<p><strong>Buyer WhatsApp:</strong> ' + wa + '</p><input type="hidden" id="deliveryOrderId" value="' + orderId + '" />';
  document.getElementById('deliveryWhatsapp').value = wa;
  document.getElementById('deliveryLogin').value = '';
  document.getElementById('deliveryMessage').value = 'Your order ' + o.product + ' has been delivered. Here are your login details.';
  document.getElementById('deliveryModal').style.display = 'flex';
}
function sendDelivery(e) {
  e.preventDefault();
  var oid = document.getElementById('deliveryOrderId') ? document.getElementById('deliveryOrderId').value : '';
  var wa = document.getElementById('deliveryWhatsapp').value.trim();
  var login = document.getElementById('deliveryLogin').value.trim();
  var msg = document.getElementById('deliveryMessage').value.trim();
  if (!wa || !login) { showToast('Fill WhatsApp and Login details', 'error'); return; }

  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].id === oid) {
      STATE.orders[i].status = 'Delivered';
      STATE.orders[i].deliveryLogin = login;
      STATE.orders[i].deliveryMsg = msg;
      STATE.orders[i].deliveryDate = new Date().toISOString();

      // Notify buyer
      STATE.notifications.unshift({
        id: uid(),
        uid: STATE.orders[i].uid,
        msg: 'Your order ' + STATE.orders[i].product + ' has been delivered! Login details sent to your WhatsApp. Check your orders.',
        type: 'success',
        read: false,
        date: new Date().toISOString()
      });

      // Add to chat
      STATE.chatMessages.push({
        id: uid(),
        uid: STATE.orders[i].uid,
        msg: 'Admin: Your product ' + STATE.orders[i].product + ' has been delivered. Login: ' + login + '. ' + msg,
        date: new Date().toISOString()
      });
      break;
    }
  }
  save();
  closeModal('deliveryModal');
  adminOrders();
  renderAdminOverview();
  updateUI();
  showToast('Delivered! Login sent to WhatsApp ' + wa, 'success');
  // Open WhatsApp in new tab
  var waUrl = 'https://wa.me/' + wa.replace('+','').replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent(msg + '\n\nLogin Details: ' + login + '\n\n- ZEUS Admin');
  window.open(waUrl, '_blank');
}

// ====== ADMIN USERS ======
function adminUsers() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  c.innerHTML = '<h3>User Management</h3><div class="input-group" style="margin-bottom:16px;"><input type="text" id="userSearch" placeholder="Search users..." oninput="searchU()" /></div>' +
    '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Username</th><th>Email</th><th>WhatsApp</th><th>Balance</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.users.length; i++) {
    var u = STATE.users[i];
    c.innerHTML += '<tr class="user-row"><td>' + u.username + '</td><td>' + u.email + '</td><td>' + (u.whatsapp || '-') + '</td><td>NGN ' + (u.wallet||0).toLocaleString() + '</td><td>' + u.role + '</td>' +
      '<td>' + (u.banned ? '<span style="color:var(--danger);">Banned</span>' : '<span style="color:var(--success);">Active</span>') + '</td>' +
      '<td>' + (u.banned ? '<button class="action-btn approve-btn" onclick="unbanU(\'' + u.id + '\')">Unban</button>' : '<button class="action-btn reject-btn" onclick="banU(\'' + u.id + '\')">Ban</button>') +
      ' <button class="action-btn" style="background:var(--neon-blue);color:#000;" onclick="waUser(\'' + u.id + '\')">WA</button></td></tr>';
  }
  c.innerHTML += '</tbody></table></div>';
}
function searchU() { var q = (document.getElementById('userSearch')?document.getElementById('userSearch').value:'').toLowerCase(); var rows=document.querySelectorAll('.user-row'); for(var i=0;i<rows.length;i++){rows[i].style.display=rows[i].textContent.toLowerCase().indexOf(q)>=0?'':'none';} }
function banU(id) { for(var i=0;i<STATE.users.length;i++){if(STATE.users[i].id===id){STATE.users[i].banned=true;break;}} save(); adminUsers(); showToast('User Banned','info'); }
function unbanU(id) { for(var i=0;i<STATE.users.length;i++){if(STATE.users[i].id===id){STATE.users[i].banned=false;break;}} save(); adminUsers(); showToast('User Unbanned','success'); }
function waUser(id) { for(var i=0;i<STATE.users.length;i++){if(STATE.users[i].id===id){var wa=STATE.users[i].whatsapp||'23409066760078'; window.open('https://wa.me/'+wa.replace('+','').replace(/[^0-9]/g,''),'_blank'); break;}} }

// ====== ADMIN PRODUCTS ======
function adminProducts() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var html = '<h3>All Products (' + STATE.products.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    html += '<tr><td>#' + p.lid + '</td><td>' + p.title + '</td><td>NGN ' + p.price.toLocaleString() + '</td><td>' + p.cat + '</td>' +
      '<td><span style="color:' + (p.status==='Available'?'var(--success)':'var(--text-muted)') + '">' + p.status + '</span></td>' +
      '<td><button class="action-btn reject-btn" onclick="delProd(\'' + p.id + '\')">Delete</button></td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function delProd(id) { if(!confirm('Delete this product?')) return; var prods=[]; for(var i=0;i<STATE.products.length;i++){if(STATE.products[i].id!==id)prods.push(STATE.products[i]);} STATE.products=prods; save(); adminProducts(); renderAdminOverview(); showToast('Product Deleted','info'); }

// ====== ADMIN ANNOUNCEMENTS ======
function adminAnnounce() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var list = '';
  for (var i = STATE.announcements.length - 1; i >= 0; i--) {
    var a = STATE.announcements[i];
    list += '<div class="glass-sm" style="padding:12px;margin-bottom:8px;"><h4>' + a.title + '</h4><p style="font-size:13px;color:var(--text-secondary);">' + a.content + '</p><span style="font-size:11px;color:var(--text-muted);">' + new Date(a.date).toLocaleDateString() + '</span></div>';
  }
  c.innerHTML = '<h3>Broadcast to All Users</h3><p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Send notification to ALL users.</p>' +
    '<form onsubmit="createAnn(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' +
    '<div class="input-group"><input type="text" id="annTitle" placeholder="Title" required /></div>' +
    '<div class="input-group"><textarea id="annContent" placeholder="Message" rows="3" required></textarea></div>' +
    '<button class="btn-primary" type="submit"><i class="fas fa-bullhorn"></i> Broadcast</button></form>' +
    '<div id="annList">' + (list || '<p style="color:var(--text-muted);">No announcements</p>') + '</div>';
}
function createAnn(e) {
  e.preventDefault();
  var title = document.getElementById('annTitle').value.trim();
  var content = document.getElementById('annContent').value.trim();
  if (!title || !content) { showToast('Fill all fields', 'error'); return; }
  STATE.announcements.unshift({id:uid(), title:title, content:content, date:new Date().toISOString()});
  for (var i = 0; i < STATE.users.length; i++) { STATE.notifications.unshift({id:uid(), uid:STATE.users[i].id, msg:'📢 ' + title + ' - ' + content, type:'info', read:false, date:new Date().toISOString()}); }
  save(); document.getElementById('annTitle').value = ''; document.getElementById('annContent').value = '';
  adminAnnounce(); updateUI(); showToast('Broadcast sent to ' + STATE.users.length + ' users!', 'success');
}

// ====== ADMIN TICKETS ======
function adminTickets() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  if (STATE.tickets.length === 0) { c.innerHTML = '<h3>Support Tickets</h3><p style="color:var(--text-muted);">No tickets</p>'; return; }
  var html = '<h3>Tickets (' + STATE.tickets.length + ')</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>WhatsApp</th><th>Subject</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = STATE.tickets.length - 1; i >= 0; i--) {
    var x = STATE.tickets[i];
    var pColor = x.priority === 'URGENT' ? 'var(--danger)' : x.priority === 'HIGH' ? 'var(--warning)' : 'var(--text-muted)';
    html += '<tr><td>' + x.username + '</td><td>' + (x.whatsapp||'N/A') + '</td><td>' + x.subject + '</td><td><span style="color:' + pColor + ';">' + x.priority + '</span></td>' +
      '<td><span class="status-badge ' + (x.status==='OPEN'?'status-pending':'status-approved') + '">' + x.status + '</span></td>' +
      '<td>' + (x.status === 'OPEN' ? '<button class="action-btn approve-btn" onclick="resolveT(\'' + x.id + '\')">Resolve</button><button class="action-btn" style="background:var(--neon-blue);color:#000;" onclick="contactTicketWA(\'' + x.id + '\')">WA</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>'; c.innerHTML = html;
}
function resolveT(id) {
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].id === id) {
      STATE.tickets[i].status = 'RESOLVED';
      STATE.notifications.unshift({id:uid(), uid:STATE.tickets[i].uid, msg:'Your ticket "' + STATE.tickets[i].subject + '" has been resolved.', type:'success', read:false, date:new Date().toISOString()});
      break;
    }
  }
  save(); adminTickets(); updateUI(); showToast('Ticket Resolved', 'success');
}
function contactTicketWA(id) {
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].id === id) {
      var wa = STATE.tickets[i].whatsapp || '23409066760078';
      window.open('https://wa.me/' + wa.replace('+','').replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent('ZEUS Support: Regarding ticket "' + STATE.tickets[i].subject + '"'), '_blank');
      break;
    }
  }
}

// ====== ADMIN ANALYTICS ======
function adminAnalytics() {
  var c = document.getElementById('adminContent');
  if (!c) return;
  var rev = 0; for (var i = 0; i < STATE.orders.length; i++) { if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount; }
  var recent = '';
  var ords = STATE.orders.slice().reverse();
  var max = ords.length > 10 ? 10 : ords.length;
  for (var i = 0; i < max; i++) { var o = ords[i]; recent += '<div class="glass-sm" style="padding:10px;margin-bottom:6px;display:flex;justify-content:space-between;"><span style="font-size:12px;">#' + o.num + ' ' + o.product.substr(0,30) + ' - ' + o.buyerName + '</span><span class="status-badge ' + sClass(o.status) + '" style="font-size:10px;">' + o.status + '</span></div>'; }
  c.innerHTML = '<div class="dash-stats" style="margin-bottom:24px;">' +
    '<div class="stat-card"><h3 style="color:var(--neon-green);">NGN ' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-blue);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-purple);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card"><h3 style="color:var(--neon-pink);">' + STATE.products.length + '</h3><p>Products</p></div></div>' +
    '<h3>Recent Orders</h3><div style="margin-bottom:20px;">' + (recent || '<p style="color:var(--text-muted);">No orders</p>') + '</div>' +
    '<h3>Export</h3><div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-secondary" onclick="exportCSV(\'users\')"><i class="fas fa-download"></i> Users</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'orders\')"><i class="fas fa-download"></i> Orders</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'products\')"><i class="fas fa-download"></i> Products</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'payments\')"><i class="fas fa-download"></i> Payments</button></div>';
}

// ====== EXPORT CSV ======
function exportCSV(type) {
  var data, filename;
  if (type === 'users') { data = STATE.users.map(function(u){return{Username:u.username,Email:u.email,WhatsApp:u.whatsapp||'',Role:u.role,Balance:'NGN '+(u.wallet||0)}}); filename = 'zeus_users.csv'; }
  else if (type === 'orders') { data = STATE.orders.map(function(o){return{Order:o.num,Product:o.product,Buyer:o.buyerName,Amount:'NGN '+o.amount,Status:o.status}}); filename = 'zeus_orders.csv'; }
  else if (type === 'products') { data = STATE.products.map(function(p){return{ID:p.lid,Title:p.title,Price:'NGN '+p.price,Category:p.cat,Status:p.status}}); filename = 'zeus_products.csv'; }
  else if (type === 'payments') { data = STATE.payments.map(function(p){return{Name:p.name,Product:p.product,Amount:'NGN '+p.amount,Ref:p.ref,Status:p.status}}); filename = 'zeus_payments.csv'; }
  else return;
  if (!data || data.length === 0) return showToast('No data', 'info');
  var headers = Object.keys(data[0]);
  var rows = [headers.join(',')];
  for (var i = 0; i < data.length; i++) { var vals = []; for (var j = 0; j < headers.length; j++) { vals.push('"' + String(data[i][headers[j]]||'').replace(/"/g,'""') + '"'); } rows.push(vals.join(',')); }
  var blob = new Blob(['\uFEFF' + rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast(filename + ' downloaded!', 'success');
}

// ====== MODAL CLOSE ======
document.addEventListener('click', function(e) { if (e.target.classList.contains('modal-overlay')) e.target.style.display = 'none'; });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { var ms = document.querySelectorAll('.modal-overlay'); for (var i = 0; i < ms.length; i++) ms[i].style.display = 'none'; } });

// ====== INIT ======
(function init() {
  load();
  seedData();
  if (STATE.currentUser) { document.getElementById('app').style.display = ''; afterLogin(); showPage('welcome'); }
  else { setTimeout(function() { document.getElementById('authModal').style.display = 'flex'; }, 800); }
  setTimeout(hideLoading, 1500);
  var saved = localStorage.getItem('zt');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  console.log('ZEUS v2 loaded!');
  console.log('Demo: demo_user / User@123456');
  console.log('Admin: admin@zeus2026');
  console.log('WhatsApp: 09066760078');
})();
