// ====== STATE ======
var STATE = {
  users: [],
  currentUser: null,
  listings: [],
  orders: [],
  payments: [],
  favorites: [],
  tickets: [],
  notifications: [],
  announcements: [],
  products: []
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
      STATE.favorites = p.favorites || [];
      STATE.tickets = p.tickets || [];
      STATE.notifications = p.notifications || [];
      STATE.announcements = p.announcements || [];
    }
  } catch(e) { console.log('Load error', e); }
}

function save() {
  try {
    localStorage.setItem('zeusDB', JSON.stringify({
      users: STATE.users,
      currentUser: STATE.currentUser,
      products: STATE.products,
      orders: STATE.orders,
      payments: STATE.payments,
      favorites: STATE.favorites,
      tickets: STATE.tickets,
      notifications: STATE.notifications,
      announcements: STATE.announcements
    }));
  } catch(e) { console.log('Save error', e); }
}

// ====== UTILITY ======
function uid() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function sClass(s) {
  if (s === 'Pending' || s === 'OPEN') return 'status-pending';
  if (s === 'Approved' || s === 'Delivered' || s === 'Completed' || s === 'RESOLVED') return 'status-approved';
  if (s === 'Rejected') return 'status-rejected';
  return 'status-pending';
}

// ====== SEED DATA ======
function seedData() {
  if (STATE.products.length > 0) return;

  var cats = [
    { name: 'Telegram Channel', icon: 'fab fa-telegram' },
    { name: 'Telegram Account', icon: 'fab fa-telegram' },
    { name: 'WhatsApp Account', icon: 'fab fa-whatsapp' },
    { name: 'TikTok Account', icon: 'fab fa-tiktok' },
    { name: 'Facebook Profile', icon: 'fab fa-facebook' },
    { name: 'Facebook Page', icon: 'fab fa-facebook' },
    { name: 'Instagram Profile', icon: 'fab fa-instagram' },
    { name: 'Instagram Business', icon: 'fab fa-instagram' },
    { name: 'Twitter/X Account', icon: 'fab fa-twitter' },
    { name: 'YouTube Channel', icon: 'fab fa-youtube' },
    { name: 'Snapchat Account', icon: 'fab fa-snapchat' },
    { name: 'Discord Account', icon: 'fab fa-discord' },
    { name: 'LinkedIn Account', icon: 'fab fa-linkedin' },
    { name: 'Pinterest Account', icon: 'fab fa-pinterest' },
    { name: 'Website', icon: 'fas fa-globe' },
    { name: 'Domain', icon: 'fas fa-earth' },
    { name: 'Software License', icon: 'fas fa-code' },
    { name: 'Graphics', icon: 'fas fa-palette' },
    { name: 'E-book', icon: 'fas fa-book' },
    { name: 'Course', icon: 'fas fa-graduation-cap' }
  ];

  var products = [
    { lid:'0001', title:'Facebook Profile (1 Year)', cat:'Facebook Profile', price:1000, desc:'Aged Facebook profile, 1 year old, active user, transfer permitted.', days:1, status:'Available' },
    { lid:'0002', title:'Facebook Profile (2 Years)', cat:'Facebook Profile', price:2000, desc:'Aged Facebook profile, 2 years old, good standing, ready for transfer.', days:1, status:'Available' },
    { lid:'0003', title:'Instagram Business Profile', cat:'Instagram Business', price:2500, desc:'Instagram business account with followers, ready for ownership transfer.', days:2, status:'Available' },
    { lid:'0004', title:'Telegram Channel (1k Members)', cat:'Telegram Channel', price:3000, desc:'Telegram channel with 1000+ real members, active community.', days:1, status:'Available' },
    { lid:'0005', title:'Telegram Account (Aged)', cat:'Telegram Account', price:1500, desc:'Aged Telegram account with groups, ready for use.', days:1, status:'Available' },
    { lid:'0006', title:'WhatsApp Account (Aged)', cat:'WhatsApp Account', price:1800, desc:'Aged WhatsApp account with contacts, verified.', days:1, status:'Available' },
    { lid:'0007', title:'TikTok Account (Followers)', cat:'TikTok Account', price:3500, desc:'TikTok account with followers, active profile, transferable.', days:2, status:'Available' },
    { lid:'0008', title:'Facebook Page (Business)', cat:'Facebook Page', price:4000, desc:'Facebook business page with likes and engagement.', days:2, status:'Available' },
    { lid:'0009', title:'Twitter/X Account (Aged)', cat:'Twitter/X Account', price:2200, desc:'Aged Twitter account with followers, good reputation.', days:1, status:'Available' },
    { lid:'0010', title:'YouTube Channel (Monetized)', cat:'YouTube Channel', price:15000, desc:'Monetized YouTube channel with watch hours and subscribers.', days:3, status:'Available' },
    { lid:'0011', title:'Snapchat Account', cat:'Snapchat Account', price:1200, desc:'Snapchat account with streaks and snap score.', days:1, status:'Available' },
    { lid:'0012', title:'Discord Account (Nitro)', cat:'Discord Account', price:2500, desc:'Discord account with Nitro, servers, and high level.', days:1, status:'Available' },
    { lid:'0013', title:'LinkedIn Account (Professional)', cat:'LinkedIn Account', price:3000, desc:'LinkedIn account with connections, professional network.', days:2, status:'Available' },
    { lid:'0014', title:'Pinterest Account (Followers)', cat:'Pinterest Account', price:1500, desc:'Pinterest account with followers and boards.', days:1, status:'Available' },
    { lid:'0015', title:'Instagram Profile (Personal)', cat:'Instagram Profile', price:2000, desc:'Instagram personal account with reels and posts.', days:1, status:'Available' },
    { lid:'0016', title:'Telegram Channel (Premium)', cat:'Telegram Channel', price:5000, desc:'Premium Telegram channel with premium members.', days:2, status:'Available' },
    { lid:'0017', title:'WhatsApp Business Account', cat:'WhatsApp Account', price:2800, desc:'WhatsApp Business account with catalogue set up.', days:1, status:'Available' },
    { lid:'0018', title:'TikTok Business Account', cat:'TikTok Account', price:4500, desc:'TikTok business account with ads manager access.', days:2, status:'Available' },
    { lid:'0019', title:'Facebook Group (Active)', cat:'Facebook Profile', price:3200, desc:'Facebook group with active members, niche community.', days:2, status:'Available' },
    { lid:'0020', title:'Custom Website Template', cat:'Website', price:5500, desc:'Premium HTML/CSS website template, fully responsive, modern design.', days:0, status:'Available' },
    { lid:'0021', title:'.com Domain (Premium)', cat:'Domain', price:8000, desc:'Premium .com domain name, short and memorable.', days:0, status:'Available' },
    { lid:'0022', title:'Software License (Antivirus)', cat:'Software License', price:6000, desc:'1-year antivirus software license, multi-device.', days:0, status:'Available' },
    { lid:'0023', title:'Graphics Pack (100+ Assets)', cat:'Graphics', price:3500, desc:'100+ premium graphics assets, commercial use.', days:0, status:'Available' },
    { lid:'0024', title:'E-book (Digital Marketing)', cat:'E-book', price:2000, desc:'Complete digital marketing guide e-book, PDF format.', days:0, status:'Available' },
    { lid:'0025', title:'Online Course (Web Dev)', cat:'Course', price:12000, desc:'Complete web development course, 50+ hours of video.', days:0, status:'Available' }
  ];

  STATE.products = products;
  save();
}

// ====== HIDE LOADING ======
function hideLoading() {
  var ls = document.getElementById('loadingScreen');
  if (ls) ls.classList.add('hidden');
}

// ====== TOAST ======
function showToast(msg, type) {
  var container = document.getElementById('toastContainer');
  if (!container) return;
  var t = document.createElement('div');
  t.className = 'toast ' + (type || 'info');
  var icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  t.innerHTML = '<i class="fas ' + icon + '"></i> ' + msg;
  container.appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transform = 'translateX(100%)';
    t.style.transition = 'all 0.3s';
    setTimeout(function() { t.remove(); }, 300);
  }, 4000);
}

// ====== COPY ======
function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { showToast('Copied!', 'success'); });
  } else {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!', 'success');
  }
}

// ====== AUTH ======
function closeAuth() {
  document.getElementById('authModal').style.display = 'none';
}

function openAuth() {
  document.getElementById('authModal').style.display = 'flex';
}

function switchTab(tab) {
  var tabs = document.querySelectorAll('.auth-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  if (tab === 'login') {
    tabs[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').style.display = 'none';
  } else {
    tabs[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('forgotForm').style.display = 'none';
  }
}

function showForgot() {
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('registerForm').classList.remove('active');
  document.getElementById('forgotForm').style.display = 'block';
}

function togglePass(id) {
  var inp = document.getElementById(id);
  if (inp.type === 'password') inp.type = 'text';
  else inp.type = 'password';
}

// ====== HANDLE REGISTER ======
function handleRegister(e) {
  e.preventDefault();
  var username = document.getElementById('regUsername').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;
  var terms = document.getElementById('regTerms').checked;

  if (!username || !email || !password || !confirm) {
    showToast('Please fill all fields', 'error');
    return;
  }
  if (password.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    return;
  }
  if (password !== confirm) {
    showToast('Passwords do not match', 'error');
    return;
  }
  if (!terms) {
    showToast('You must agree to the Terms & Conditions', 'error');
    return;
  }

  // Check if username already exists
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].username.toLowerCase() === username.toLowerCase()) {
      showToast('Username already exists', 'error');
      return;
    }
  }

  var newUser = {
    id: uid(),
    username: username,
    email: email,
    password: password,
    role: 'member',
    wallet: 0,
    name: username,
    phone: '',
    banned: false,
    createdAt: new Date().toISOString()
  };

  STATE.users.push(newUser);
  STATE.currentUser = newUser;

  // Welcome notification
  STATE.notifications.unshift({
    id: uid(),
    uid: newUser.id,
    msg: 'Welcome to ZEUS, ' + username + '! Start exploring the marketplace.',
    type: 'info',
    read: false,
    date: new Date().toISOString()
  });

  save();
  afterLogin();
  closeAuth();
  showToast('Account created successfully! Welcome to ZEUS!', 'success');
}

// ====== HANDLE LOGIN ======
function handleLogin(e) {
  e.preventDefault();
  var username = document.getElementById('loginUsername').value.trim();
  var password = document.getElementById('loginPassword').value;
  var remember = document.getElementById('rememberMe').checked;

  // Demo login
  if (username === 'demo_user' && password === 'User@123456') {
    // Find or create demo user
    var found = null;
    for (var i = 0; i < STATE.users.length; i++) {
      if (STATE.users[i].username === 'demo_user') {
        found = STATE.users[i];
        break;
      }
    }
    if (!found) {
      found = {
        id: uid(),
        username: 'demo_user',
        email: 'demo@zeus.com',
        password: 'User@123456',
        role: 'member',
        wallet: 25000,
        name: 'Demo User',
        phone: '09066760078',
        banned: false,
        createdAt: new Date().toISOString()
      };
      STATE.users.push(found);
    }
    STATE.currentUser = found;
    save();
    afterLogin();
    closeAuth();
    showToast('Welcome back, ' + found.username + '!', 'success');
    return;
  }

  // Regular login
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].username.toLowerCase() === username.toLowerCase() && STATE.users[i].password === password) {
      if (STATE.users[i].banned) {
        showToast('This account has been banned.', 'error');
        return;
      }
      STATE.currentUser = STATE.users[i];
      save();
      afterLogin();
      closeAuth();
      showToast('Welcome back, ' + STATE.users[i].username + '!', 'success');
      return;
    }
  }

  showToast('Invalid username or password', 'error');
}

// ====== HANDLE FORGOT ======
function handleForgot(e) {
  e.preventDefault();
  var email = document.getElementById('forgotEmail').value.trim();
  showToast('Password reset link sent to ' + email + ' (demo mode)', 'success');
}

// ====== AFTER LOGIN ======
function afterLogin() {
  var app = document.getElementById('app');
  if (app) app.style.display = 'flex';
  updateUI();
  showPage('welcome');
  // Show admin button
  document.getElementById('adminBtnSidebar').style.display = '';
  document.getElementById('adminBtnWelcome').style.display = '';
}

// ====== UPDATE UI ======
function updateUI() {
  if (!STATE.currentUser) return;
  document.getElementById('sidebarUsername').textContent = STATE.currentUser.username;
  document.getElementById('sidebarRole').textContent = STATE.currentUser.role === 'admin' ? 'Administrator' : 'Member';
  document.getElementById('sidebarAvatar').textContent = STATE.currentUser.username.charAt(0).toUpperCase();
  document.getElementById('profileAvatar').textContent = STATE.currentUser.username.charAt(0).toUpperCase();
  document.getElementById('profileNameDisplay').textContent = STATE.currentUser.name || STATE.currentUser.username;
  document.getElementById('profileEmailDisplay').textContent = STATE.currentUser.email;
  if (document.getElementById('profileName')) document.getElementById('profileName').value = STATE.currentUser.name || '';
  if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = STATE.currentUser.email || '';
  if (document.getElementById('profilePhone')) document.getElementById('profilePhone').value = STATE.currentUser.phone || '';

  // Unread notifications
  var unread = 0;
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid === STATE.currentUser.id && !STATE.notifications[i].read) unread++;
  }
  var badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? '' : 'none';
  }

  // Wallet
  var wa = document.getElementById('walletAmount');
  if (wa) wa.textContent = '₦' + (STATE.currentUser.wallet || 0).toLocaleString();
}

// ====== LOGOUT ======
function logout() {
  STATE.currentUser = null;
  save();
  document.getElementById('app').style.display = 'none';
  document.getElementById('authModal').style.display = 'flex';
  showToast('Logged out successfully', 'info');
}

// ====== SIDEBAR ======
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ====== SHOW PAGE ======
function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('active');
  }
  var target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');

  // Update sidebar
  var items = document.querySelectorAll('.sidebar-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove('active');
  }

  // Render page content
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

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ====== CATEGORIES ======
function getCategories() {
  var cats = [];
  for (var i = 0; i < STATE.products.length; i++) {
    if (cats.indexOf(STATE.products[i].cat) < 0) {
      cats.push(STATE.products[i].cat);
    }
  }
  return cats;
}

// ====== RENDER CATEGORIES BAR ======
function renderCategoriesBar() {
  var bar = document.getElementById('categoriesBar');
  if (!bar) return;
  var cats = getCategories();
  var html = '<button class="cat-chip active" onclick="filterCat(\'all\')"><i class="fas fa-th"></i> All</button>';
  for (var i = 0; i < cats.length; i++) {
    var icon = 'fab fa-telegram';
    if (cats[i].indexOf('WhatsApp') >= 0) icon = 'fab fa-whatsapp';
    else if (cats[i].indexOf('TikTok') >= 0) icon = 'fab fa-tiktok';
    else if (cats[i].indexOf('Facebook') >= 0) icon = 'fab fa-facebook';
    else if (cats[i].indexOf('Instagram') >= 0) icon = 'fab fa-instagram';
    else if (cats[i].indexOf('Twitter') >= 0) icon = 'fab fa-twitter';
    else if (cats[i].indexOf('YouTube') >= 0) icon = 'fab fa-youtube';
    else if (cats[i].indexOf('Snapchat') >= 0) icon = 'fab fa-snapchat';
    else if (cats[i].indexOf('Discord') >= 0) icon = 'fab fa-discord';
    else if (cats[i].indexOf('LinkedIn') >= 0) icon = 'fab fa-linkedin';
    else if (cats[i].indexOf('Pinterest') >= 0) icon = 'fab fa-pinterest';
    else if (cats[i].indexOf('Website') >= 0) icon = 'fas fa-globe';
    else if (cats[i].indexOf('Domain') >= 0) icon = 'fas fa-earth';
    else if (cats[i].indexOf('Software') >= 0) icon = 'fas fa-code';
    else if (cats[i].indexOf('Graphics') >= 0) icon = 'fas fa-palette';
    else if (cats[i].indexOf('E-book') >= 0) icon = 'fas fa-book';
    else if (cats[i].indexOf('Course') >= 0) icon = 'fas fa-graduation-cap';
    else icon = 'fas fa-tag';
    html += '<button class="cat-chip" onclick="filterCat(\'' + cats[i] + '\')"><i class="' + icon + '"></i> ' + cats[i] + '</button>';
  }
  bar.innerHTML = html;

  // Populate filter dropdown
  var sel = document.getElementById('filterCategory');
  if (sel) {
    sel.innerHTML = '<option value="all">All Categories</option>';
    for (var i = 0; i < cats.length; i++) {
      sel.innerHTML += '<option value="' + cats[i] + '">' + cats[i] + '</option>';
    }
  }
}

var currentFilter = 'all';

function filterCat(cat) {
  currentFilter = cat;
  var chips = document.querySelectorAll('.cat-chip');
  for (var i = 0; i < chips.length; i++) {
    chips[i].classList.remove('active');
  }
  // Find and activate clicked chip
  var allChips = document.querySelectorAll('.cat-chip');
  for (var i = 0; i < allChips.length; i++) {
    if (allChips[i].textContent.trim().indexOf(cat === 'all' ? 'All' : cat) >= 0) {
      allChips[i].classList.add('active');
    }
  }
  document.getElementById('filterCategory').value = cat;
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
    if (search && p.title.toLowerCase().indexOf(search) < 0 && p.desc.toLowerCase().indexOf(search) < 0) continue;
    filtered.push(p);
  }

  // Sort
  if (sort === 'low') filtered.sort(function(a,b) { return a.price - b.price; });
  else if (sort === 'high') filtered.sort(function(a,b) { return b.price - a.price; });
  else if (sort === 'oldest') filtered.sort(function(a,b) { return parseInt(a.lid) - parseInt(b.lid); });
  else filtered.sort(function(a,b) { return parseInt(b.lid) - parseInt(a.lid); });

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-search" style="font-size:40px;margin-bottom:12px;display:block;"></i>No products found</div>';
    return;
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    var isFav = false;
    for (var j = 0; j < STATE.favorites.length; j++) {
      if (STATE.favorites[j].pid === p.id && STATE.favorites[j].uid === (STATE.currentUser ? STATE.currentUser.id : '')) {
        isFav = true;
        break;
      }
    }
    var icon = 'fas fa-tag';
    var c = p.cat;
    if (c.indexOf('Telegram') >= 0) icon = 'fab fa-telegram';
    else if (c.indexOf('WhatsApp') >= 0) icon = 'fab fa-whatsapp';
    else if (c.indexOf('TikTok') >= 0) icon = 'fab fa-tiktok';
    else if (c.indexOf('Facebook') >= 0) icon = 'fab fa-facebook';
    else if (c.indexOf('Instagram') >= 0) icon = 'fab fa-instagram';
    else if (c.indexOf('Twitter') >= 0) icon = 'fab fa-twitter';
    else if (c.indexOf('YouTube') >= 0) icon = 'fab fa-youtube';
    else if (c.indexOf('Snapchat') >= 0) icon = 'fab fa-snapchat';
    else if (c.indexOf('Discord') >= 0) icon = 'fab fa-discord';
    else if (c.indexOf('LinkedIn') >= 0) icon = 'fab fa-linkedin';
    else if (c.indexOf('Pinterest') >= 0) icon = 'fab fa-pinterest';
    else if (c.indexOf('Website') >= 0) icon = 'fas fa-globe';
    else if (c.indexOf('Domain') >= 0) icon = 'fas fa-earth';
    else if (c.indexOf('Software') >= 0) icon = 'fas fa-code';
    else if (c.indexOf('Graphics') >= 0) icon = 'fas fa-palette';
    else if (c.indexOf('E-book') >= 0) icon = 'fas fa-book';
    else if (c.indexOf('Course') >= 0) icon = 'fas fa-graduation-cap';

    html += '<div class="product-card" onclick="showProduct(\'' + p.id + '\')">' +
      '<div class="pc-badge">#' + p.lid + '</div>' +
      '<div class="pc-category"><i class="' + icon + '"></i> ' + p.cat + '</div>' +
      '<div class="pc-title">' + p.title + '</div>' +
      '<div class="pc-price">₦' + p.price.toLocaleString() + '</div>' +
      '<div class="pc-desc">' + p.desc + '</div>' +
      '<div class="pc-meta">' +
      '<span><i class="fas fa-clock"></i> ' + (p.days > 0 ? p.days + ' day delivery' : 'Instant') + '</span>' +
      '<span><i class="fas fa-circle" style="color:' + (p.status === 'Available' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + p.status + '</span>' +
      '</div>' +
      '<div class="pc-actions">' +
      '<button class="btn-primary" onclick="event.stopPropagation();showPayment(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy</button>' +
      '<button class="' + (isFav ? 'faved' : '') + '" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button>' +
      '<button onclick="event.stopPropagation();shareProduct(\'' + p.id + '\')"><i class="fas fa-share-nodes"></i></button>' +
      '</div></div>';
  }
  grid.innerHTML = html;
}

// ====== SHOW PRODUCT ======
function showProduct(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === id) { p = STATE.products[i]; break; }
  }
  if (!p) return;

  var div = document.getElementById('productDetail');
  var isFav = false;
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.favorites.length; i++) {
      if (STATE.favorites[i].pid === p.id && STATE.favorites[i].uid === STATE.currentUser.id) {
        isFav = true;
        break;
      }
    }
  }

  var icon = 'fas fa-tag';
  var c = p.cat;
  if (c.indexOf('Telegram') >= 0) icon = 'fab fa-telegram';
  else if (c.indexOf('WhatsApp') >= 0) icon = 'fab fa-whatsapp';
  else if (c.indexOf('TikTok') >= 0) icon = 'fab fa-tiktok';
  else if (c.indexOf('Facebook') >= 0) icon = 'fab fa-facebook';
  else if (c.indexOf('Instagram') >= 0) icon = 'fab fa-instagram';
  else if (c.indexOf('Twitter') >= 0) icon = 'fab fa-twitter';
  else if (c.indexOf('YouTube') >= 0) icon = 'fab fa-youtube';
  else if (c.indexOf('Snapchat') >= 0) icon = 'fab fa-snapchat';

  div.innerHTML = '<div class="prod-detail">' +
    '<div class="pc-category"><i class="' + icon + '"></i> ' + p.cat + ' <span class="pc-badge" style="position:relative;top:0;right:0;display:inline-block;">#' + p.lid + '</span></div>' +
    '<div class="pd-title">' + p.title + '</div>' +
    '<div class="pd-price">₦' + p.price.toLocaleString() + '</div>' +
    '<div class="pd-desc">' + p.desc + '</div>' +
    '<div class="pd-meta">' +
    '<span><i class="fas fa-clock"></i> ' + (p.days > 0 ? p.days + ' day delivery' : 'Instant') + '</span>' +
    '<span><i class="fas fa-circle" style="color:' + (p.status === 'Available' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + p.status + '</span>' +
    '</div>' +
    '<div class="pd-tags"><span>#' + p.lid + '</span><span>' + p.cat + '</span></div>' +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn-primary" onclick="closeModal(\'productModal\');showPayment(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy Now</button>' +
    '<button class="btn-secondary" onclick="toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i> ' + (isFav ? 'Unfavorite' : 'Favorite') + '</button>' +
    '<button class="btn-secondary" onclick="shareProduct(\'' + p.id + '\')"><i class="fas fa-share-nodes"></i> Share</button>' +
    '</div></div>';

  document.getElementById('productModal').style.display = 'flex';
}

// ====== SHARE ======
function shareProduct(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === id) { p = STATE.products[i]; break; }
  }
  if (!p) return;
  var text = 'Check out this product on ZEUS: ' + p.title + ' - ₦' + p.price.toLocaleString();
  if (navigator.share) {
    navigator.share({ title: p.title, text: text, url: window.location.href });
  } else {
    copyText(text);
  }
}

// ====== FAVORITES ======
function toggleFav(pid) {
  if (!STATE.currentUser) {
    showToast('Please login first', 'error');
    openAuth();
    return;
  }
  var found = -1;
  for (var i = 0; i < STATE.favorites.length; i++) {
    if (STATE.favorites[i].pid === pid && STATE.favorites[i].uid === STATE.currentUser.id) {
      found = i;
      break;
    }
  }
  if (found >= 0) {
    STATE.favorites.splice(found, 1);
    showToast('Removed from favorites', 'info');
  } else {
    STATE.favorites.push({ id: uid(), pid: pid, uid: STATE.currentUser.id, date: new Date().toISOString() });
    showToast('Added to favorites!', 'success');
  }
  save();
  renderMarket();
}

// ====== RENDER FAVORITES ======
function renderFavorites() {
  var grid = document.getElementById('favoritesGrid');
  if (!grid) return;
  if (!STATE.currentUser) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">Please login to see favorites</div>';
    return;
  }

  var favIds = [];
  for (var i = 0; i < STATE.favorites.length; i++) {
    if (STATE.favorites[i].uid === STATE.currentUser.id) {
      favIds.push(STATE.favorites[i].pid);
    }
  }

  if (favIds.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-heart" style="font-size:40px;margin-bottom:12px;display:block;"></i>No favorites yet</div>';
    return;
  }

  var filtered = [];
  for (var i = 0; i < STATE.products.length; i++) {
    for (var j = 0; j < favIds.length; j++) {
      if (STATE.products[i].id === favIds[j]) {
        filtered.push(STATE.products[i]);
        break;
      }
    }
  }

  var html = '';
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    html += '<div class="product-card" onclick="showProduct(\'' + p.id + '\')">' +
      '<div class="pc-badge">#' + p.lid + '</div>' +
      '<div class="pc-category"><i class="fas fa-tag"></i> ' + p.cat + '</div>' +
      '<div class="pc-title">' + p.title + '</div>' +
      '<div class="pc-price">₦' + p.price.toLocaleString() + '</div>' +
      '<div class="pc-desc">' + p.desc + '</div>' +
      '<div class="pc-actions">' +
      '<button class="btn-primary" onclick="event.stopPropagation();showPayment(\'' + p.id + '\')"><i class="fas fa-shopping-cart"></i> Buy</button>' +
      '<button class="faved" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button>' +
      '</div></div>';
  }
  grid.innerHTML = html;
}

// ====== PAYMENT ======
function showPayment(pid) {
  if (!STATE.currentUser) {
    showToast('Please login first', 'error');
    openAuth();
    return;
  }

  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === pid) { p = STATE.products[i]; break; }
  }
  if (!p) return;

  document.getElementById('payProductId').value = p.id;
  document.getElementById('payProduct').value = p.title;
  document.getElementById('payAmount').value = p.price;
  document.getElementById('payName').value = STATE.currentUser.name || STATE.currentUser.username;
  document.getElementById('payUsername').value = STATE.currentUser.username;

  // Set today's date
  var today = new Date().toISOString().split('T')[0];
  document.getElementById('payDate').value = today;

  document.getElementById('paymentModal').style.display = 'flex';
}

function submitPayment(e) {
  e.preventDefault();
  var pid = document.getElementById('payProductId').value;
  var name = document.getElementById('payName').value.trim();
  var username = document.getElementById('payUsername').value.trim();
  var product = document.getElementById('payProduct').value;
  var amount = parseFloat(document.getElementById('payAmount').value);
  var ref = document.getElementById('payRef').value.trim();
  var date = document.getElementById('payDate').value;
  var notes = document.getElementById('payNotes').value.trim();

  if (!name || !username || !product || !amount || !ref || !date) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  var payment = {
    id: uid(),
    pid: pid,
    uid: STATE.currentUser.id,
    name: name,
    username: username,
    product: product,
    amount: amount,
    ref: ref,
    date: date,
    notes: notes,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  STATE.payments.push(payment);

  // Create order
  var order = {
    id: uid(),
    num: String(STATE.orders.length + 1).padStart(4, '0'),
    pid: pid,
    uid: STATE.currentUser.id,
    product: product,
    amount: amount,
    buyerName: name,
    buyerUsername: username,
    status: 'Pending',
    paymentId: payment.id,
    createdAt: new Date().toISOString()
  };
  STATE.orders.push(order);

  // Notify
  STATE.notifications.unshift({
    id: uid(),
    uid: STATE.currentUser.id,
    msg: 'Payment submitted for ' + product + '. Waiting for admin verification.',
    type: 'info',
    read: false,
    date: new Date().toISOString()
  });

  save();
  closeModal('paymentModal');
  showToast('Payment submitted! Waiting for verification.', 'success');

  // Reset form
  document.getElementById('paymentForm').reset();
  updateUI();
}

// ====== ORDERS ======
function renderOrders() {
  var div = document.getElementById('ordersList');
  if (!div) return;
  if (!STATE.currentUser) {
    div.innerHTML = '<p style="color:var(--text-muted);">Please login</p>';
    return;
  }

  var userOrders = [];
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].uid === STATE.currentUser.id) {
      userOrders.push(STATE.orders[i]);
    }
  }

  if (userOrders.length === 0) {
    div.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-truck" style="font-size:40px;margin-bottom:12px;display:block;"></i>No orders yet</div>';
    return;
  }

  var html = '';
  for (var i = userOrders.length - 1; i >= 0; i--) {
    var o = userOrders[i];
    html += '<div class="order-item">' +
      '<div class="order-info"><h4>' + o.product + '</h4><p>Order #' + o.num + ' - ₦' + o.amount.toLocaleString() + '</p></div>' +
      '<div><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div></div>';
  }
  div.innerHTML = html;
}

// ====== DASHBOARD ======
function renderDashboard() {
  if (!STATE.currentUser) return;
  var stats = document.getElementById('dashStats');
  var activity = document.getElementById('dashActivity');

  var totalOrders = 0;
  var totalSpent = 0;
  var completedOrders = 0;
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].uid === STATE.currentUser.id) {
      totalOrders++;
      totalSpent += STATE.orders[i].amount;
      if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') completedOrders++;
    }
  }

  stats.innerHTML = '<div class="stat-card glass-sm"><h3 style="color:var(--neon-blue);">' + totalOrders + '</h3><p>Orders</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">₦' + totalSpent.toLocaleString() + '</h3><p>Total Spent</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-purple);">' + completedOrders + '</h3><p>Delivered</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-pink);">₦' + (STATE.currentUser.wallet || 0).toLocaleString() + '</h3><p>Wallet</p></div>';

  // Activity
  var notifs = [];
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid === STATE.currentUser.id) {
      notifs.push(STATE.notifications[i]);
    }
  }
  if (notifs.length === 0) {
    activity.innerHTML = '<p style="color:var(--text-muted);">No recent activity</p>';
  } else {
    var html = '';
    var max = notifs.length > 5 ? 5 : notifs.length;
    for (var i = 0; i < max; i++) {
      var n = notifs[i];
      html += '<div class="glass-sm" style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">' +
        '<i class="fas fa-circle" style="font-size:8px;color:var(--neon-blue);"></i>' +
        '<span style="font-size:13px;">' + n.msg + '</span>' +
        '<span style="font-size:11px;color:var(--text-muted);margin-left:auto;">' + new Date(n.date).toLocaleDateString() + '</span></div>';
    }
    activity.innerHTML = html;
  }
}

// ====== WALLET ======
function renderWallet() {
  if (!STATE.currentUser) return;
  var wa = document.getElementById('walletAmount');
  if (wa) wa.textContent = '₦' + (STATE.currentUser.wallet || 0).toLocaleString();

  var hist = document.getElementById('walletHistory');
  var transactions = [];
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].uid === STATE.currentUser.id) {
      transactions.push({ type: 'debit', amount: STATE.orders[i].amount, desc: STATE.orders[i].product, date: STATE.orders[i].createdAt, status: STATE.orders[i].status });
    }
  }
  if (transactions.length === 0) {
    hist.innerHTML = '<p style="color:var(--text-muted);margin-top:12px;">No transactions</p>';
  } else {
    var html = '';
    for (var i = transactions.length - 1; i >= 0; i--) {
      var t = transactions[i];
      html += '<div class="glass-sm" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<div><span style="font-size:13px;">' + t.desc + '</span><br><span style="font-size:11px;color:var(--text-muted);">' + new Date(t.date).toLocaleDateString() + '</span></div>' +
        '<div style="text-align:right;"><span style="font-weight:700;color:var(--danger);">-₦' + t.amount.toLocaleString() + '</span><br><span class="status-badge ' + sClass(t.status) + '">' + t.status + '</span></div></div>';
    }
    hist.innerHTML = html;
  }
}

// ====== NOTIFICATIONS ======
function renderNotifs() {
  var div = document.getElementById('notificationsList');
  if (!div) return;
  if (!STATE.currentUser) {
    div.innerHTML = '<p style="color:var(--text-muted);">Please login</p>';
    return;
  }

  var userNotifs = [];
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid === STATE.currentUser.id) {
      userNotifs.push(STATE.notifications[i]);
    }
  }

  // Mark all as read
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid === STATE.currentUser.id) {
      STATE.notifications[i].read = true;
    }
  }
  save();
  updateUI();

  if (userNotifs.length === 0) {
    div.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);"><i class="fas fa-bell" style="font-size:40px;margin-bottom:12px;display:block;"></i>No notifications</div>';
    return;
  }

  var html = '';
  for (var i = userNotifs.length - 1; i >= 0; i--) {
    var n = userNotifs[i];
    var icon = n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    html += '<div class="notif-item">' +
      '<div class="notif-icon"><i class="fas ' + icon + '"></i></div>' +
      '<div><div class="notif-msg">' + n.msg + '</div><div class="notif-date">' + new Date(n.date).toLocaleDateString() + '</div></div></div>';
  }
  div.innerHTML = html;
}

function clearNotifs() {
  if (!STATE.currentUser) return;
  var remaining = [];
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid !== STATE.currentUser.id) {
      remaining.push(STATE.notifications[i]);
    }
  }
  STATE.notifications = remaining;
  save();
  renderNotifs();
  updateUI();
  showToast('Notifications cleared', 'info');
}

// ====== SUPPORT ======
function switchSupport(tab) {
  var tabs = document.querySelectorAll('.support-tab');
  var contents = document.querySelectorAll('.support-content');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < contents.length; i++) contents[i].classList.remove('active');

  if (tab === 'faq') { tabs[0].classList.add('active'); document.getElementById('faqContent').classList.add('active'); renderFAQ(); }
  else if (tab === 'tickets') { tabs[1].classList.add('active'); document.getElementById('ticketsContent').classList.add('active'); renderTickets(); }
  else if (tab === 'contact') { tabs[2].classList.add('active'); document.getElementById('contactContent').classList.add('active'); renderContact(); }
}

function renderFAQ() {
  var div = document.getElementById('faqContent');
  var faqs = [
    { q: 'How do I buy a product?', a: 'Browse the marketplace, click Buy on any product, follow the payment instructions to send payment to the provided OPay account, then submit the payment form with your proof.' },
    { q: 'How long does delivery take?', a: 'Delivery time varies by product. Digital products are typically delivered within 24 hours after payment verification. Check the product page for estimated delivery time.' },
    { q: 'What payment methods do you accept?', a: 'We accept OPay transfers. Bank: OPay, Account Name: CHRISTIANA GODWIN OKON, Account Number: 9066760078.' },
    { q: 'Can I get a refund?', a: 'We offer a 7-day refund policy if the product is not as described or if delivery fails. Contact support to initiate a refund.' },
    { q: 'How do I contact support?', a: 'You can open a support ticket, email us, or message us on WhatsApp at 09066760078.' },
    { q: 'What is a digital product?', a: 'Digital products are non-physical items like social media accounts, software licenses, templates, e-books, courses, domains, and websites that can be delivered electronically.' },
    { q: 'Is my information secure?', a: 'Yes, ZEUS uses secure storage and encryption to protect your data. We never share your personal information with third parties.' }
  ];

  var html = '';
  for (var i = 0; i < faqs.length; i++) {
    html += '<div class="faq-item">' +
      '<button class="faq-q" onclick="toggleFaq(this)">' + faqs[i].q + ' <i class="fas fa-chevron-down"></i></button>' +
      '<div class="faq-a">' + faqs[i].a + '</div></div>';
  }
  div.innerHTML = html;
}

function toggleFaq(btn) {
  btn.classList.toggle('open');
  var answer = btn.nextElementSibling;
  answer.classList.toggle('open');
}

function renderTickets() {
  var div = document.getElementById('ticketsContent');
  if (!STATE.currentUser) {
    div.innerHTML = '<p style="color:var(--text-muted);">Please login</p>';
    return;
  }

  var html = '<h3>Submit a Ticket</h3>' +
    '<form onsubmit="submitTicket(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' +
    '<div class="input-group"><input type="text" id="ticketSubject" placeholder="Subject" required /></div>' +
    '<div class="input-group"><textarea id="ticketMessage" placeholder="Describe your issue..." rows="3" required></textarea></div>' +
    '<div class="input-group"><select id="ticketPriority"><option value="LOW">Low Priority</option><option value="MEDIUM">Medium Priority</option><option value="HIGH">High Priority</option></select></div>' +
    '<button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Submit Ticket</button></form>';

  // Show existing tickets
  var myTickets = [];
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].uid === STATE.currentUser.id) {
      myTickets.push(STATE.tickets[i]);
    }
  }
  if (myTickets.length > 0) {
    html += '<h3>Your Tickets</h3>';
    for (var i = myTickets.length - 1; i >= 0; i--) {
      var t = myTickets[i];
      html += '<div class="glass-sm" style="margin-bottom:8px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<span style="font-weight:600;font-size:14px;">' + t.subject + '</span>' +
        '<span class="status-badge ' + (t.status === 'OPEN' ? 'status-pending' : 'status-approved') + '">' + t.status + '</span></div>' +
        '<p style="font-size:13px;color:var(--text-secondary);">' + t.message + '</p>' +
        '<span style="font-size:11px;color:var(--text-muted);">' + new Date(t.date).toLocaleDateString() + ' - ' + t.priority + '</span></div>';
    }
  }

  div.innerHTML = html;
}

function submitTicket(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showToast('Please login', 'error'); return; }
  var subject = document.getElementById('ticketSubject').value.trim();
  var message = document.getElementById('ticketMessage').value.trim();
  var priority = document.getElementById('ticketPriority').value;
  if (!subject || !message) { showToast('Fill all fields', 'error'); return; }

  STATE.tickets.push({
    id: uid(),
    uid: STATE.currentUser.id,
    username: STATE.currentUser.username,
    subject: subject,
    message: message,
    priority: priority,
    status: 'OPEN',
    date: new Date().toISOString()
  });

  STATE.notifications.unshift({
    id: uid(),
    uid: STATE.currentUser.id,
    msg: 'Ticket "' + subject + '" submitted. We will respond shortly.',
    type: 'info',
    read: false,
    date: new Date().toISOString()
  });

  save();
  document.getElementById('ticketSubject').value = '';
  document.getElementById('ticketMessage').value = '';
  renderTickets();
  updateUI();
  showToast('Ticket submitted!', 'success');
}

function renderContact() {
  var div = document.getElementById('contactContent');
  div.innerHTML = '<div style="max-width:500px;">' +
    '<h3>Contact Us</h3>' +
    '<div class="glass-sm" style="margin-bottom:16px;">' +
    '<p style="margin-bottom:8px;"><i class="fab fa-whatsapp" style="color:var(--neon-green);margin-right:8px;"></i> WhatsApp: <strong>09066760078</strong> <button class="link-btn" onclick="copyText(\'09066760078\')">Copy</button></p>' +
    '<p><i class="fas fa-envelope" style="color:var(--neon-blue);margin-right:8px;"></i> Email: support@zeusmarket.com</p>' +
    '</div>' +
    '<form onsubmit="sendContact(event)">' +
    '<div class="input-group"><input type="text" id="contactName" placeholder="Your Name" required /></div>' +
    '<div class="input-group"><input type="email" id="contactEmail" placeholder="Your Email" required /></div>' +
    '<div class="input-group"><textarea id="contactMsg" placeholder="Your Message" rows="3" required></textarea></div>' +
    '<button type="submit" class="btn-primary"><i class="fas fa-paper-plane"></i> Send Message</button></form></div>';
}

function sendContact(e) {
  e.preventDefault();
  showToast('Message sent! We will get back to you.', 'success');
  document.getElementById('contactMsg').value = '';
}

// ====== PROFILE ======
function updateProfile(e) {
  e.preventDefault();
  if (!STATE.currentUser) return;
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id === STATE.currentUser.id) {
      STATE.users[i].name = document.getElementById('profileName') ? document.getElementById('profileName').value : '';
      STATE.users[i].email = document.getElementById('profileEmail') ? document.getElementById('profileEmail').value : '';
      STATE.users[i].phone = document.getElementById('profilePhone') ? document.getElementById('profilePhone').value : '';
      STATE.currentUser = STATE.users[i];
      break;
    }
  }
  save();
  updateUI();
  showToast('Profile updated!', 'success');
}

// ====== THEME ======
function toggleTheme() {
  var h = document.documentElement;
  var n = h.getAttribute('data-theme') === 'light' ? '' : 'light';
  h.setAttribute('data-theme', n);
  localStorage.setItem('zt', n);
  var t = document.getElementById('darkModeToggle');
  if (t) t.checked = n === 'light';
}

// ====== CLOSE MODAL ======
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// ====== ADMIN ======
function openAdminPass() {
  document.getElementById('adminPassModal').style.display = 'flex';
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminPassError').style.display = 'none';
}

function verifyAdmin() {
  var code = document.getElementById('adminPassInput').value;
  if (code === 'admin@zeus2026') {
    closeModal('adminPassModal');
    // Make user admin
    if (STATE.currentUser) {
      for (var i = 0; i < STATE.users.length; i++) {
        if (STATE.users[i].id === STATE.currentUser.id) {
          STATE.users[i].role = 'admin';
          STATE.currentUser = STATE.users[i];
          break;
        }
      }
      save();
      updateUI();
    }
    showPage('admin');
    showToast('Admin access granted!', 'success');
  } else {
    document.getElementById('adminPassError').style.display = 'block';
    setTimeout(function() {
      document.getElementById('adminPassError').style.display = 'none';
    }, 3000);
  }
}

// ====== ADMIN SWITCH ======
function switchAdmin(tab) {
  var tabs = document.querySelectorAll('.admin-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].textContent.trim().toLowerCase() === tab) {
        tabs[i].classList.add('active');
        break;
      }
    }
  }

  if (tab === 'overview') renderAdminOverview();
  else if (tab === 'payments') adminPayments();
  else if (tab === 'orders') adminOrders();
  else if (tab === 'users') adminUsers();
  else if (tab === 'products') adminProducts();
  else if (tab === 'announce') adminAnnounce();
  else if (tab === 'tickets') adminTickets();
  else if (tab === 'analytics') adminAnalytics();
}

function renderAdminOverview() {
  var c = document.getElementById('adminContent');
  var rev = 0;
  var pendPay = 0;
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].status === 'PENDING') pendPay++;
  }
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount;
  }

  c.innerHTML = '<div class="admin-stats grid-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px;">' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-blue);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">' + STATE.products.length + '</h3><p>Products</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-purple);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-pink);">' + pendPay + '</h3><p>Pending Payments</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">₦' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--info);">' + STATE.tickets.length + '</h3><p>Tickets</p></div>' +
    '</div>' +
    '<h3>Quick Actions</h3>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-primary" onclick="switchAdmin(\'payments\')" style="width:auto;"><i class="fas fa-credit-card"></i> Review Payments</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'orders\')"><i class="fas fa-truck"></i> Orders</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'users\')"><i class="fas fa-users"></i> Users</button>' +
    '<button class="btn-secondary" onclick="switchAdmin(\'announce\')"><i class="fas fa-bullhorn"></i> Announce</button></div>';
}

function adminPayments() {
  var c = document.getElementById('adminContent');
  if (STATE.payments.length === 0) {
    c.innerHTML = '<h3>Payments</h3><p style="color:var(--text-muted);">No payments yet</p>';
    return;
  }

  var html = '<h3>Payment Submissions</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Name</th><th>Product</th><th>Amount</th><th>Ref</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  for (var i = STATE.payments.length - 1; i >= 0; i--) {
    var p = STATE.payments[i];
    html += '<tr><td>' + p.name + '</td><td>' + p.product + '</td><td>₦' + p.amount.toLocaleString() + '</td><td>' + p.ref + '</td>' +
      '<td><span class="status-badge ' + (p.status === 'PENDING' ? 'status-pending' : p.status === 'APPROVED' ? 'status-approved' : 'status-rejected') + '">' + p.status + '</span></td>' +
      '<td style="display:flex;gap:4px;">' +
      (p.status === 'PENDING' ? '<button class="action-btn approve-btn" onclick="approvePay(\'' + p.id + '\')">Approve</button><button class="action-btn reject-btn" onclick="rejectPay(\'' + p.id + '\')">Reject</button>' : '') +
      '</td></tr>';
  }
  html += '</tbody></table></div>';
  c.innerHTML = html;
}

function approvePay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'APPROVED';
      // Update order
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].paymentId === id) {
          STATE.orders[j].status = 'Approved';
          // Notify buyer
          STATE.notifications.unshift({
            id: uid(),
            uid: STATE.orders[j].uid,
            msg: 'Payment for ' + STATE.orders[j].product + ' approved! Awaiting delivery.',
            type: 'success',
            read: false,
            date: new Date().toISOString()
          });
          // Credit wallet
          for (var k = 0; k < STATE.users.length; k++) {
            if (STATE.users[k].id === STATE.orders[j].uid) {
              STATE.users[k].wallet = (STATE.users[k].wallet || 0) + STATE.orders[j].amount;
              if (STATE.currentUser && STATE.currentUser.id === STATE.users[k].id) STATE.currentUser = STATE.users[k];
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }
  save();
  adminPayments();
  renderAdminOverview();
  updateUI();
  showToast('Payment Approved!', 'success');
}

function rejectPay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'REJECTED';
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].paymentId === id) {
          STATE.orders[j].status = 'Pending';
          STATE.notifications.unshift({
            id: uid(),
            uid: STATE.orders[j].uid,
            msg: 'Payment for ' + STATE.orders[j].product + ' was rejected. Please contact support.',
            type: 'error',
            read: false,
            date: new Date().toISOString()
          });
          break;
        }
      }
      break;
    }
  }
  save();
  adminPayments();
  updateUI();
  showToast('Payment Rejected', 'error');
}

function adminOrders() {
  var c = document.getElementById('adminContent');
  var html = '<h3>All Orders</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  var ords = STATE.orders.slice().reverse();
  for (var i = 0; i < ords.length; i++) {
    var o = ords[i];
    html += '<tr><td>#' + o.num + '</td><td>' + o.product + '</td><td>' + o.buyerName + '</td><td>₦' + o.amount.toLocaleString() + '</td>' +
      '<td><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></td>' +
      '<td>' + (o.status === 'Approved' ? '<button class="action-btn approve-btn" onclick="deliver(\'' + o.id + '\')">Deliver</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>';
  c.innerHTML = html;
}

function deliver(id) {
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].id === id) {
      STATE.orders[i].status = 'Delivered';
      STATE.notifications.unshift({
        id: uid(),
        uid: STATE.orders[i].uid,
        msg: STATE.orders[i].product + ' has been delivered! Check your orders.',
        type: 'success',
        read: false,
        date: new Date().toISOString()
      });
      break;
    }
  }
  save();
  adminOrders();
  updateUI();
  showToast('Order Delivered!', 'success');
}

function adminUsers() {
  var c = document.getElementById('adminContent');
  c.innerHTML = '<h3>User Management</h3>' +
    '<div class="input-group" style="margin-bottom:16px;"><input type="text" id="userSearch" placeholder="Search users..." oninput="searchU()" /></div>' +
    '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.users.length; i++) {
    var u = STATE.users[i];
    c.innerHTML += '<tr class="user-row"><td>' + u.username + '</td><td>' + u.email + '</td><td>' + u.role + '</td><td>₦' + (u.wallet || 0).toLocaleString() + '</td>' +
      '<td>' + (u.banned ? '<span style="color:var(--danger);">Banned</span>' : '<span style="color:var(--success);">Active</span>') + '</td>' +
      '<td style="display:flex;gap:4px;">' +
      (u.banned ? '<button class="action-btn approve-btn" onclick="unbanU(\'' + u.id + '\')">Unban</button>' : '<button class="action-btn reject-btn" onclick="banU(\'' + u.id + '\')">Ban</button>') +
      '<button class="action-btn reject-btn" onclick="delU(\'' + u.id + '\')">Delete</button></td></tr>';
  }
  c.innerHTML += '</tbody></table></div>';
}

function searchU() {
  var q = (document.getElementById('userSearch') ? document.getElementById('userSearch').value : '').toLowerCase();
  var rows = document.querySelectorAll('.user-row');
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.display = rows[i].textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none';
  }
}

function banU(id) {
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id === id) { STATE.users[i].banned = true; break; }
  }
  save();
  adminUsers();
  showToast('User Banned', 'info');
}

function unbanU(id) {
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id === id) { STATE.users[i].banned = false; break; }
  }
  save();
  adminUsers();
  showToast('User Unbanned', 'success');
}

function delU(id) {
  if (!confirm('Delete this user?')) return;
  var users = [];
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id !== id) users.push(STATE.users[i]);
  }
  STATE.users = users;
  save();
  adminUsers();
  renderAdminOverview();
  showToast('User Deleted', 'info');
}

function adminProducts() {
  var c = document.getElementById('adminContent');
  c.innerHTML = '<h3>All Products (' + STATE.products.length + ')</h3>' +
    '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    c.innerHTML += '<tr><td>#' + p.lid + '</td><td>' + p.title + '</td><td>₦' + p.price.toLocaleString() + '</td><td>' + p.cat + '</td>' +
      '<td><span style="color:' + (p.status === 'Available' ? 'var(--success)' : 'var(--text-muted)') + '">' + p.status + '</span></td>' +
      '<td><button class="action-btn reject-btn" onclick="delProd(\'' + p.id + '\')">Delete</button></td></tr>';
  }
  c.innerHTML += '</tbody></table></div>';
}

function delProd(id) {
  if (!confirm('Delete this product?')) return;
  var prods = [];
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id !== id) prods.push(STATE.products[i]);
  }
  STATE.products = prods;
  save();
  adminProducts();
  renderAdminOverview();
  showToast('Product Deleted', 'info');
}

function adminTickets() {
  var c = document.getElementById('adminContent');
  if (STATE.tickets.length === 0) {
    c.innerHTML = '<h3>Support Tickets</h3><p style="color:var(--text-muted);">No tickets</p>';
    return;
  }
  var html = '<h3>Support Tickets</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>Subject</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  var t = STATE.tickets.slice().reverse();
  for (var i = 0; i < t.length; i++) {
    var x = t[i];
    html += '<tr><td>' + x.username + '</td><td>' + x.subject + '</td><td>' + x.priority + '</td>' +
      '<td><span class="status-badge ' + (x.status === 'OPEN' ? 'status-pending' : 'status-approved') + '">' + x.status + '</span></td>' +
      '<td>' + (x.status === 'OPEN' ? '<button class="action-btn approve-btn" onclick="resolveT(\'' + x.id + '\')">Resolve</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>';
  c.innerHTML = html;
}

function resolveT(id) {
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].id === id) {
      STATE.tickets[i].status = 'RESOLVED';
      STATE.notifications.unshift({
        id: uid(),
        uid: STATE.tickets[i].uid,
        msg: 'Your ticket "' + STATE.tickets[i].subject + '" has been resolved.',
        type: 'success',
        read: false,
        date: new Date().toISOString()
      });
      break;
    }
  }
  save();
  adminTickets();
  updateUI();
  showToast('Ticket Resolved', 'success');
}

function adminAnnounce() {
  var c = document.getElementById('adminContent');
  var list = '';
  var a = STATE.announcements.slice().reverse();
  for (var i = 0; i < a.length; i++) {
    list += '<div class="glass-sm" style="padding:12px;margin-bottom:8px;"><h4>' + a[i].title + '</h4>' +
      '<p style="font-size:13px;color:var(--text-secondary);">' + a[i].content + '</p>' +
      '<span style="font-size:11px;color:var(--text-muted);">' + new Date(a[i].date).toLocaleDateString() + '</span></div>';
  }

  c.innerHTML = '<h3>Post Announcement</h3>' +
    '<form onsubmit="createAnn(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' +
    '<div class="input-group"><input type="text" id="annTitle" placeholder="Title" required /></div>' +
    '<div class="input-group"><textarea id="annContent" placeholder="Content" rows="3" required></textarea></div>' +
    '<button class="btn-primary" type="submit"><i class="fas fa-bullhorn"></i> Post</button></form>' +
    '<div id="annList">' + (list || '<p style="color:var(--text-muted);">No announcements</p>') + '</div>';
}

function createAnn(e) {
  e.preventDefault();
  var title = document.getElementById('annTitle') ? document.getElementById('annTitle').value.trim() : '';
  var content = document.getElementById('annContent') ? document.getElementById('annContent').value.trim() : '';
  if (!title || !content) { showToast('Fill all fields', 'error'); return; }

  STATE.announcements.unshift({id: uid(), title: title, content: content, date: new Date().toISOString()});

  // Notify all users
  for (var i = 0; i < STATE.users.length; i++) {
    STATE.notifications.unshift({
      id: uid(),
      uid: STATE.users[i].id,
      msg: '📢 ' + title + ' - ' + content,
      type: 'info',
      read: false,
      date: new Date().toISOString()
    });
  }

  save();
  if (document.getElementById('annTitle')) document.getElementById('annTitle').value = '';
  if (document.getElementById('annContent')) document.getElementById('annContent').value = '';
  adminAnnounce();
  updateUI();
  showToast('Announcement posted!', 'success');
}

function adminAnalytics() {
  var c = document.getElementById('adminContent');
  var rev = 0;
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount;
  }

  var recent = '';
  var ords = STATE.orders.slice().reverse();
  var max = ords.length > 5 ? 5 : ords.length;
  for (var i = 0; i < max; i++) {
    var o = ords[i];
    recent += '<div class="glass-sm" style="padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;">' +
      '<span style="font-size:13px;">' + o.product + ' - ' + o.buyerName + '</span>' +
      '<span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div>';
  }

  c.innerHTML = '<div class="admin-stats grid-4" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:24px;">' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">₦' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-blue);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-purple);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-pink);">' + STATE.products.length + '</h3><p>Products</p></div></div>' +
    '<h3>Recent Orders</h3>' + (recent || '<p style="color:var(--text-muted);">No orders yet</p>') +
    '<h3 style="margin-top:20px;">Export Data</h3>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-secondary" onclick="exportCSV(\'users\')"><i class="fas fa-download"></i> Users CSV</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'orders\')"><i class="fas fa-download"></i> Orders CSV</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'products\')"><i class="fas fa-download"></i> Products CSV</button></div>';
}

// ====== EXPORT CSV ======
function exportCSV(type) {
  var data, filename;
  if (type === 'users') {
    data = [];
    for (var i = 0; i < STATE.users.length; i++) {
      data.push({
        Username: STATE.users[i].username,
        Email: STATE.users[i].email,
        Role: STATE.users[i].role,
        Balance: '₦' + (STATE.users[i].wallet || 0)
      });
    }
    filename = 'zeus_users.csv';
  } else if (type === 'orders') {
    data = [];
    for (var i = 0; i < STATE.orders.length; i++) {
      data.push({
        Order: STATE.orders[i].num,
        Product: STATE.orders[i].product,
        Buyer: STATE.orders[i].buyerName,
        Amount: '₦' + STATE.orders[i].amount,
        Status: STATE.orders[i].status
      });
    }
    filename = 'zeus_orders.csv';
  } else if (type === 'products') {
    data = [];
    for (var i = 0; i < STATE.products.length; i++) {
      data.push({
        ID: STATE.products[i].lid,
        Title: STATE.products[i].title,
        Price: '₦' + STATE.products[i].price,
        Category: STATE.products[i].cat,
        Status: STATE.products[i].status
      });
    }
    filename = 'zeus_products.csv';
  } else return;

  if (!data || data.length === 0) return showToast('No data', 'info');

  var headers = Object.keys(data[0]);
  var rows = [headers.join(',')];
  for (var i = 0; i < data.length; i++) {
    var vals = [];
    for (var j = 0; j < headers.length; j++) {
      vals.push('"' + String(data[i][headers[j]] || '').replace(/"/g, '""') + '"');
    }
    rows.push(vals.join(','));
  }

  var blob = new Blob(['\uFEFF' + rows.join('\n')], {type: 'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(filename + ' downloaded!', 'success');
}

// ====== MODAL CLOSE ON OVERLAY CLICK ======
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
  }
});

// ====== ESC KEY ======
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var ms = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < ms.length; i++) ms[i].style.display = 'none';
  }
});

// ====== SIDEBAR TOGGLE ON MOBILE ======
document.getElementById('sidebarToggle') && document.getElementById('sidebarToggle').addEventListener('click', function() {
  document.getElementById('sidebar').classList.toggle('open');
});

// ====== INIT ======
(function init() {
  load();
  seedData();

  // Check if user is logged in
  if (STATE.currentUser) {
    var app = document.getElementById('app');
    if (app) app.style.display = 'flex';
    afterLogin();
    showPage('welcome');
  } else {
    // Show auth modal
    setTimeout(function() {
      document.getElementById('authModal').style.display = 'flex';
    }, 800);
  }

  // Hide loading
  setTimeout(hideLoading, 1500);

  // Apply theme
  var saved = localStorage.getItem('zt');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  console.log('⚡ ZEUS Marketplace loaded!');
  console.log('Demo: demo_user / User@123456');
  console.log('Admin passcode: admin@zeus2026');
})();
