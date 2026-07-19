/* ====== ZEUS — FULL APPLICATION ====== */

// ====== STATE ======
var STATE = {
  currentUser: null,
  users: JSON.parse(localStorage.getItem('zu')) || [],
  products: JSON.parse(localStorage.getItem('zp')) || [],
  orders: JSON.parse(localStorage.getItem('zo')) || [],
  payments: JSON.parse(localStorage.getItem('zpay')) || [],
  favorites: JSON.parse(localStorage.getItem('zf')) || [],
  notifications: JSON.parse(localStorage.getItem('zn')) || [],
  tickets: JSON.parse(localStorage.getItem('zt')) || [],
  categories: JSON.parse(localStorage.getItem('zc')) || [],
  announcements: JSON.parse(localStorage.getItem('za')) || [],
  walletTx: JSON.parse(localStorage.getItem('zw')) || [],
  isAdmin: false
};
var ADMIN_CODE = 'admin@zeus2026';

function save() {
  var map = {zu:STATE.users,zp:STATE.products,zo:STATE.orders,zpay:STATE.payments,zf:STATE.favorites,zn:STATE.notifications,zt:STATE.tickets,zc:STATE.categories,za:STATE.announcements,zw:STATE.walletTx};
  for (var k in map) { try { localStorage.setItem(k, JSON.stringify(map[k])); } catch(e) {} }
}

function uid() { return '_' + Date.now().toString(36) + Math.random().toString(36).substr(2,5); }

// ====== INIT ======
document.addEventListener('DOMContentLoaded', function() {
  if (STATE.categories.length === 0) {
    STATE.categories = [
      {id:'c1',name:'Social Media',icon:'📱',desc:'Facebook, Instagram, TikTok, WhatsApp, Telegram'},
      {id:'c2',name:'Messaging',icon:'💬',desc:'WhatsApp, Telegram, Signal, Discord'},
      {id:'c3',name:'Email',icon:'📧',desc:'Gmail, Outlook, Yahoo, ProtonMail'},
      {id:'c4',name:'Gaming',icon:'🎮',desc:'Steam, Epic, Xbox, PlayStation, Roblox'},
      {id:'c5',name:'Websites',icon:'🌐',desc:'Ready-made websites'},
      {id:'c6',name:'Domains',icon:'🔗',desc:'Premium domain names'},
      {id:'c7',name:'Digital Services',icon:'⚡',desc:'Graphics, marketing, development'},
      {id:'c8',name:'Other Digital',icon:'📦',desc:'E-books, templates, source code'}
    ];
    save();
  }

  if (STATE.products.length === 0) {
    STATE.products = [
      {id:'p1',lid:'0001',title:'Facebook Profile (Example)',cat:'Social Media',price:1000,status:'Active',img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',tags:['facebook'],age:'1 Year',seller:'zeus_admin',trans:true,delivery:'24 hours',rating:4.5,date:'2026-01-15',desc:'Aged Facebook profile with 1 year of activity.'},
      {id:'p2',lid:'0002',title:'Facebook Profile (Aged)',cat:'Social Media',price:2000,status:'Active',img:'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',tags:['facebook'],age:'2 Years',seller:'zeus_admin',trans:true,delivery:'24 hours',rating:4.8,date:'2026-02-10',desc:'Established Facebook profile with 2 years.'},
      {id:'p3',lid:'0003',title:'Instagram Business Profile',cat:'Social Media',price:2500,status:'Active',img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400',tags:['instagram'],age:'1 Year',seller:'zeus_admin',trans:true,delivery:'48 hours',rating:4.6,date:'2026-03-05',desc:'Instagram business profile with followers.'},
      {id:'p4',lid:'0004',title:'Telegram Channel',cat:'Messaging',price:3000,status:'Active',img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',tags:['telegram'],age:'6 Months',seller:'zeus_admin',trans:true,delivery:'12 hours',rating:4.7,date:'2026-04-20',desc:'Active Telegram channel with subscribers.'},
      {id:'p5',lid:'0005',title:'WhatsApp Business Account',cat:'Messaging',price:3500,status:'Active',img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400',tags:['whatsapp'],age:'1 Year',seller:'zeus_admin',trans:true,delivery:'24 hours',rating:4.9,date:'2026-05-01',desc:'Verified WhatsApp Business account.'},
      {id:'p6',lid:'0006',title:'TikTok Creator Account',cat:'Social Media',price:4500,status:'Active',img:'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400',tags:['tiktok'],age:'8 Months',seller:'zeus_admin',trans:true,delivery:'48 hours',rating:4.3,date:'2026-05-15',desc:'TikTok creator account with followers.'},
      {id:'p7',lid:'0007',title:'Telegram Group (500+ Members)',cat:'Messaging',price:5000,status:'Active',img:'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400',tags:['telegram'],age:'1 Year',seller:'zeus_admin',trans:true,delivery:'24 hours',rating:4.4,date:'2026-06-01',desc:'Active Telegram group with 500+ members.'},
      {id:'p8',lid:'0008',title:'Twitter/X Premium Account',cat:'Social Media',price:6000,status:'Active',img:'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400',tags:['twitter'],age:'2 Years',seller:'zeus_admin',trans:false,delivery:'48 hours',rating:4.2,date:'2026-06-10',desc:'Twitter/X account with premium features.'},
      {id:'p9',lid:'0100',title:'Premium Domain (business.ng)',cat:'Domains',price:15000,status:'Active',img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',tags:['domain'],age:'New',seller:'zeus_admin',trans:true,delivery:'24 hours',rating:5.0,date:'2026-06-20',desc:'Premium .ng domain.'},
      {id:'p10',lid:'0250',title:'E-commerce Website Template',cat:'Websites',price:8500,status:'Active',img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',tags:['template'],age:'New',seller:'zeus_admin',trans:true,delivery:'Instant',rating:4.6,date:'2026-07-01',desc:'Modern e-commerce website template.'}
    ];
    save();
  }

  if (!STATE.users.find(function(u){return u.username==='demo_user'})) {
    STATE.users.push({id:'u1',username:'demo_user',email:'user@demo.com',pass:btoa('User@123456'),name:'Demo User',role:'USER',wallet:25000,phone:'',banned:false});
    save();
  }
  if (!STATE.users.find(function(u){return u.username==='zeus_admin'})) {
    STATE.users.push({id:'u2',username:'zeus_admin',email:'admin@zeus.com',pass:btoa('Admin@123456'),name:'Admin',role:'ADMIN',wallet:0,phone:'',banned:false});
    save();
  }

  // Hide loading
  document.getElementById('loadingScreen').classList.add('hidden');

  var saved = localStorage.getItem('zs');
  if (saved) {
    var user = STATE.users.find(function(u){ return u.id === saved; });
    if (user && !user.banned) {
      STATE.currentUser = user;
      boot();
      return;
    }
  }
  showAuth();
});

function boot() {
  document.getElementById('app').style.display = 'block';
  updateUI();
  renderCats();
  renderProds();
  renderFAQ();
  renderOrders();
  renderFavs();
  renderNotifs();
  renderTickets();
  renderStats();
  go('home');
  if (STATE.currentUser && STATE.currentUser.role === 'ADMIN') {
    var b = document.querySelector('.admin-btn');
    if (b) b.style.display = 'flex';
  }
}

function showAuth() { document.getElementById('authModal').style.display = 'flex'; }
function closeAuth() { document.getElementById('authModal').style.display = 'none'; }
function closeModal(id) { var e = document.getElementById(id); if (e) e.style.display = 'none'; }

function switchTab(tab) {
  var tabs = document.querySelectorAll('.auth-tab');
  var forms = document.querySelectorAll('.auth-form');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < forms.length; i++) forms[i].classList.remove('active');
  document.getElementById('forgotForm').style.display = 'none';
  if (tab === 'login') {
    tabs[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    tabs[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
}

function showForgot() {
  var forms = document.querySelectorAll('.auth-form');
  for (var i = 0; i < forms.length; i++) forms[i].classList.remove('active');
  document.getElementById('forgotForm').style.display = 'flex';
  document.getElementById('forgotForm').classList.add('active');
}

function togglePass(id) {
  var el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

// ====== AUTH ======
function handleLogin(e) {
  e.preventDefault();
  var u = document.getElementById('loginUsername').value.trim();
  var p = document.getElementById('loginPassword').value;
  var rm = document.getElementById('rememberMe').checked;
  var user = null;
  for (var i = 0; i < STATE.users.length; i++) {
    if ((STATE.users[i].username === u || STATE.users[i].email === u) && atob(STATE.users[i].pass) === p) {
      user = STATE.users[i];
      break;
    }
  }
  if (!user) return showToast('Invalid credentials', 'error');
  if (user.banned) return showToast('Account suspended', 'error');
  STATE.currentUser = user;
  if (rm) localStorage.setItem('zs', user.id);
  closeAuth();
  boot();
  showToast('Welcome back, ' + user.username + '!', 'success');
}

function handleRegister(e) {
  e.preventDefault();
  var username = document.getElementById('regUsername').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var password = document.getElementById('regPassword').value;
  var confirm = document.getElementById('regConfirm').value;
  if (password !== confirm) return showToast('Passwords do not match', 'error');
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].username === username) return showToast('Username taken', 'error');
    if (STATE.users[i].email === email) return showToast('Email registered', 'error');
  }
  var user = {id:uid(),username:username,email:email,pass:btoa(password),name:'',role:'USER',wallet:0,phone:'',banned:false};
  STATE.users.push(user);
  save();
  STATE.currentUser = user;
  localStorage.setItem('zs', user.id);
  closeAuth();
  boot();
  showToast('Account created!', 'success');
}

function handleForgot(e) {
  e.preventDefault();
  showToast('Reset link sent! (Demo: User@123456)', 'success');
}

function logout() {
  STATE.currentUser = null;
  STATE.isAdmin = false;
  localStorage.removeItem('zs');
  document.getElementById('app').style.display = 'none';
  showAuth();
  showToast('Logged out', 'info');
}

function updateUI() {
  if (!STATE.currentUser) return;
  var u = STATE.currentUser;
  var c = u.username.charAt(0).toUpperCase();
  var na = document.getElementById('navAvatar');
  var pa = document.getElementById('profileAvatar');
  if (na) na.textContent = c;
  if (pa) pa.textContent = c;
  var nu = document.getElementById('navUsername');
  if (nu) nu.textContent = u.username;
  var pu = document.getElementById('profileUsername');
  if (pu) pu.value = u.username;
  var pn = document.getElementById('profileName');
  if (pn) pn.value = u.name || '';
  var pe = document.getElementById('profileEmail');
  if (pe) pe.value = u.email || '';
  var pp = document.getElementById('profilePhone');
  if (pp) pp.value = u.phone || '';
  var payU = document.getElementById('payUsername');
  if (payU) payU.value = u.username;
}

// ====== ADMIN PASS ======
function openAdminPass() {
  if (!STATE.currentUser) return showAuth();
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminPassError').style.display = 'none';
  document.getElementById('adminPassModal').style.display = 'flex';
}

function verifyAdmin() {
  var pass = document.getElementById('adminPassInput').value;
  if (pass === ADMIN_CODE) {
    STATE.isAdmin = true;
    closeModal('adminPassModal');
    go('admin');
    adminTab('payments');
    renderStats();
    showToast('Admin access granted', 'success');
  } else {
    document.getElementById('adminPassError').style.display = 'block';
    showToast('Access Denied!', 'error');
  }
}

// ====== NAV ======
function go(page) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
  var navs = document.querySelectorAll('.nav-link, .bottom-link');
  for (var i = 0; i < navs.length; i++) navs[i].classList.remove('active');

  var t = document.getElementById('page-' + page);
  if (t) t.classList.add('active');

  var actives = document.querySelectorAll('[onclick*="go(\'' + page + '\')"], [onclick*="go(\\\'' + page + '\\\')"]');
  for (var i = 0; i < actives.length; i++) actives[i].classList.add('active');

  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({top: 0, behavior: 'smooth'});

  if (page === 'marketplace') renderProds();
  if (page === 'orders') renderOrders();
  if (page === 'favorites') renderFavs();
  if (page === 'notifications') renderNotifs();
  if (page === 'admin' && STATE.isAdmin) { adminTab('payments'); renderStats(); }
  if (page === 'categories') renderCats();
  if (page === 'support' || page === 'faq') renderFAQ();
  if (page === 'tickets') renderTickets();
  if (page === 'wallet') renderWallet();
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

// ====== CATEGORIES ======
function renderCats() {
  var grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  var html = '';
  for (var i = 0; i < STATE.categories.length; i++) {
    var c = STATE.categories[i];
    html += '<div class="category-card" onclick="filterCat(\'' + c.name + '\')">';
    html += '<span class="cat-icon">' + c.icon + '</span><h3>' + c.name + '</h3><p>' + c.desc + '</p></div>';
  }
  grid.innerHTML = html;

  var sel = document.getElementById('filterCategory');
  if (sel) {
    var opts = '<option value="all">All Categories</option>';
    for (var i = 0; i < STATE.categories.length; i++) {
      opts += '<option value="' + STATE.categories[i].name + '">' + STATE.categories[i].name + '</option>';
    }
    sel.innerHTML = opts;
  }
}

function filterCat(name) {
  go('marketplace');
  var sel = document.getElementById('filterCategory');
  if (sel) sel.value = name;
  filterProds();
}

// ====== PRODUCTS ======
function renderProds(filtered) {
  var grid = document.getElementById('marketplaceGrid');
  var no = document.getElementById('noProducts');
  if (!grid || !no) return;

  var items = filtered || [];
  if (!filtered) {
    items = [];
    for (var i = 0; i < STATE.products.length; i++) {
      if (STATE.products[i].status === 'Active') items.push(STATE.products[i]);
    }
  }

  if (items.length === 0) {
    grid.innerHTML = '';
    no.style.display = 'block';
    return;
  }
  no.style.display = 'none';

  var html = '';
  for (var i = 0; i < items.length; i++) {
    var p = items[i];
    var fav = STATE.currentUser ? STATE.favorites.some(function(f){ return f.pid === p.id && f.uid === STATE.currentUser.id; }) : false;

    html += '<div class="product-card" onclick="showDetail(\'' + p.id + '\')">';
    html += '<img class="product-card-image" src="' + p.img + '" alt="' + p.title + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2230%22>📦</text></svg>\'" />';
    html += '<div class="product-card-body">';
    html += '<div class="product-card-id">#' + p.lid + '</div>';
    html += '<div class="product-card-title">' + p.title + '</div>';
    html += '<div class="product-card-category">' + p.cat + (p.age ? ' • ' + p.age : '') + '</div>';
    html += '<div class="product-card-footer">';
    html += '<div class="product-card-price">₦' + p.price.toLocaleString() + '</div>';
    html += '<div class="product-card-actions">';
    html += '<button class="card-action-btn' + (fav ? ' favorited' : '') + '" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button>';
    html += '<button class="card-action-btn" onclick="event.stopPropagation();shareProd(\'' + p.id + '\')"><i class="fas fa-share-alt"></i></button>';
    html += '<button class="card-action-btn" onclick="event.stopPropagation();buyNow(\'' + p.id + '\')" style="background:rgba(0,212,255,0.15);color:var(--neon-blue);"><i class="fas fa-shopping-cart"></i></button>';
    html += '</div></div></div></div>';
  }
  grid.innerHTML = html;
}

function filterProds() {
  var search = (document.getElementById('marketSearch') ? document.getElementById('marketSearch').value : '').toLowerCase();
  var category = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : 'all';
  var price = document.getElementById('filterPrice') ? document.getElementById('filterPrice').value : 'all';
  var sort = document.getElementById('filterSort') ? document.getElementById('filterSort').value : 'newest';

  var items = [];
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].status === 'Active') items.push(STATE.products[i]);
  }

  if (search) {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      var p = items[i];
      if (p.title.toLowerCase().indexOf(search) >= 0 || p.lid.indexOf(search) >= 0) {
        filtered.push(p);
      } else {
        for (var j = 0; j < p.tags.length; j++) {
          if (p.tags[j].toLowerCase().indexOf(search) >= 0) { filtered.push(p); break; }
        }
      }
    }
    items = filtered;
  }

  if (category !== 'all') {
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].cat === category) filtered.push(items[i]);
    }
    items = filtered;
  }

  if (price !== 'all') {
    var parts = price.split('-');
    var min = parseInt(parts[0]);
    var max = parts[1] ? parseInt(parts[1]) : Infinity;
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].price >= min && items[i].price <= max) filtered.push(items[i]);
    }
    items = filtered;
  }

  if (sort === 'newest') items.sort(function(a,b){ return new Date(b.date) - new Date(a.date); });
  else if (sort === 'oldest') items.sort(function(a,b){ return new Date(a.date) - new Date(b.date); });
  else if (sort === 'lowest') items.sort(function(a,b){ return a.price - b.price; });
  else if (sort === 'highest') items.sort(function(a,b){ return b.price - a.price; });
  else if (sort === 'rating') items.sort(function(a,b){ return b.rating - a.rating; });

  renderProds(items);
}

// ====== PRODUCT DETAIL ======
function showDetail(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === id) { p = STATE.products[i]; break; }
  }
  if (!p) return;

  var c = document.getElementById('productDetail');
  if (!c) return;

  var tags = '';
  for (var i = 0; i < p.tags.length; i++) {
    tags += '<span class="tag">#' + p.tags[i] + '</span>';
  }

  c.innerHTML = '<div class="product-detail-grid">' +
    '<div><img class="product-detail-image" src="' + p.img + '" alt="' + p.title + '" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22400%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2260%22>📦</text></svg>\'" /></div>' +
    '<div class="product-detail-info">' +
    '<div style="color:var(--neon-blue);font-family:monospace;font-size:12px;">#' + p.lid + '</div>' +
    '<h2>' + p.title + '</h2>' +
    '<div class="price-lg">₦' + p.price.toLocaleString() + '</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<span style="font-size:13px;color:var(--text-secondary);">📁 ' + p.cat + '</span>' +
    (p.age ? '<span style="font-size:13px;color:var(--text-secondary);">⏱ ' + p.age + '</span>' : '') +
    '<span style="font-size:13px;color:var(--text-secondary);">⭐ ' + p.rating + '</span>' +
    '<span style="font-size:13px;color:var(--text-secondary);">👤 ' + p.seller + '</span>' +
    '<span style="font-size:13px;color:var(--neon-green);">' + (p.trans ? '✅ Transferable' : '❌ Non-transferable') + '</span></div>' +
    '<p>' + p.desc + '</p>' +
    '<div class="product-tags">' + tags + '</div>' +
    '<p style="font-size:13px;color:var(--text-secondary);">Delivery: ' + p.delivery + '</p>' +
    '<div style="display:flex;gap:12px;margin-top:8px;">' +
    '<button class="btn-primary" onclick="buyNow(\'' + p.id + '\')" style="flex:1;"><i class="fas fa-shopping-cart"></i> Buy Now</button>' +
    '<button class="btn-secondary" onclick="toggleFav(\'' + p.id + '\')" style="flex:0.5;"><i class="fas fa-heart"></i></button></div></div></div>';

  go('product');
}

// ====== CHECKOUT ======
function buyNow(id) {
  if (!STATE.currentUser) return showAuth();
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === id) { p = STATE.products[i]; break; }
  }
  if (!p) return;

  document.getElementById('payProduct').value = p.lid + ' - ' + p.title;
  document.getElementById('payAmount').value = p.price;
  document.getElementById('payDate').value = new Date().toISOString().split('T')[0];

  var cp = document.getElementById('checkoutProduct');
  if (cp) {
    cp.innerHTML = '<div class="glass-sm" style="padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:16px;">' +
      '<img src="' + p.img + '" style="width:60px;height:60px;border-radius:8px;object-fit:cover;" />' +
      '<div><h4>#' + p.lid + ' - ' + p.title + '</h4><p style="color:var(--neon-green);font-weight:700;">₦' + p.price.toLocaleString() + '</p></div></div>';
  }
  go('checkout');
}

function submitPayment(e) {
  e.preventDefault();
  if (!STATE.currentUser) return showAuth();

  var fullName = document.getElementById('payFullName') ? document.getElementById('payFullName').value.trim() : '';
  var product = document.getElementById('payProduct') ? document.getElementById('payProduct').value : '';
  var ref = document.getElementById('payRef') ? document.getElementById('payRef').value.trim() : '';
  var date = document.getElementById('payDate') ? document.getElementById('payDate').value : '';
  var notes = document.getElementById('payNotes') ? document.getElementById('payNotes').value.trim() : '';
  var fi = document.getElementById('payScreenshot');
  var ss = (fi && fi.files[0]) ? URL.createObjectURL(fi.files[0]) : '';
  var amount = parseFloat(document.getElementById('payAmount') ? document.getElementById('payAmount').value : 0) || 0;

  var order = {
    id: uid(),
    num: 'ORD-' + Date.now().toString(36).toUpperCase(),
    pid: '',
    product: product,
    buyer: STATE.currentUser.id,
    buyerName: STATE.currentUser.username,
    amount: amount,
    status: 'Payment Submitted',
    date: new Date().toISOString()
  };
  STATE.orders.push(order);

  STATE.payments.push({
    id: uid(),
    oid: order.id,
    uid: STATE.currentUser.id,
    name: fullName,
    amount: amount,
    ref: ref,
    pdate: date,
    notes: notes,
    screen: ss,
    status: 'SUBMITTED',
    date: new Date().toISOString()
  });

  save();
  showToast('Payment submitted! Waiting for verification.', 'success');
  go('orders');
  renderOrders();

  var form = document.getElementById('paymentForm');
  if (form) form.reset();
  var pd = document.getElementById('payDate');
  if (pd) pd.value = new Date().toISOString().split('T')[0];
}

// ====== ORDERS ======
function renderOrders() {
  var list = document.getElementById('ordersList');
  if (!list || !STATE.currentUser) return;

  var uo = [];
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].buyer === STATE.currentUser.id) uo.push(STATE.orders[i]);
  }

  if (uo.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>No Orders Yet</h3></div>';
    return;
  }

  uo.reverse();
  var html = '';
  for (var i = 0; i < uo.length; i++) {
    var o = uo[i];
    html += '<div class="order-card glass-sm">' +
      '<div class="order-info"><h4>' + o.product + '</h4>' +
      '<p>#' + o.num + ' • ' + new Date(o.date).toLocaleDateString() + '</p>' +
      '<p style="font-weight:700;color:var(--neon-green);">₦' + o.amount.toLocaleString() + '</p></div>' +
      '<span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></div>';
  }
  list.innerHTML = html;
}

function sClass(s) {
  var map = {'Pending':'status-pending','Payment Submitted':'status-submitted','Under Review':'status-review','Approved':'status-approved','Delivered':'status-delivered','Completed':'status-completed'};
  return map[s] || 'status-pending';
}

// ====== FAVORITES ======
function toggleFav(pid) {
  if (!STATE.currentUser) return showAuth();
  var idx = -1;
  for (var i = 0; i < STATE.favorites.length; i++) {
    if (STATE.favorites[i].pid === pid && STATE.favorites[i].uid === STATE.currentUser.id) { idx = i; break; }
  }
  if (idx >= 0) {
    STATE.favorites.splice(idx, 1);
    showToast('Removed', 'info');
  } else {
    STATE.favorites.push({id:uid(), uid:STATE.currentUser.id, pid: pid});
    showToast('Added!', 'success');
  }
  save();
  renderProds();
  renderFavs();
}

function renderFavs() {
  var grid = document.getElementById('favoritesGrid');
  if (!grid || !STATE.currentUser) return;

  var fp = [];
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    for (var j = 0; j < STATE.favorites.length; j++) {
      if (STATE.favorites[j].pid === p.id && STATE.favorites[j].uid === STATE.currentUser.id) {
        fp.push(p); break;
      }
    }
  }

  if (fp.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>No Favorites</h3></div>';
    return;
  }

  var html = '';
  for (var i = 0; i < fp.length; i++) {
    var p = fp[i];
    html += '<div class="product-card" onclick="showDetail(\'' + p.id + '\')">' +
      '<img class="product-card-image" src="' + p.img + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2230%22>📦</text></svg>\'" />' +
      '<div class="product-card-body"><div class="product-card-id">#' + p.lid + '</div>' +
      '<div class="product-card-title">' + p.title + '</div>' +
      '<div class="product-card-category">' + p.cat + '</div>' +
      '<div class="product-card-footer"><div class="product-card-price">₦' + p.price.toLocaleString() + '</div>' +
      '<button class="card-action-btn favorited" onclick="event.stopPropagation();toggleFav(\'' + p.id + '\')"><i class="fas fa-heart"></i></button></div></div></div>';
  }
  grid.innerHTML = html;
}

function shareProd(id) {
  var p = null;
  for (var i = 0; i < STATE.products.length; i++) {
    if (STATE.products[i].id === id) { p = STATE.products[i]; break; }
  }
  if (!p) return;
  var text = 'ZEUS - ' + p.title + ': ₦' + p.price;
  if (navigator.share) navigator.share({title:p.title, text:text, url:window.location.href});
  else { navigator.clipboard.writeText(text); showToast('Copied!', 'success'); }
}

// ====== NOTIFICATIONS ======
function addNotif(msg, type) {
  if (!STATE.currentUser) return;
  STATE.notifications.unshift({id:uid(), uid:STATE.currentUser.id, msg:msg, type:type||'info', read:false, date:new Date().toISOString()});
  save();
  renderNotifs();
}

function renderNotifs() {
  var list = document.getElementById('notificationsList');
  if (!list || !STATE.currentUser) return;

  var n = [];
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].uid === STATE.currentUser.id) n.push(STATE.notifications[i]);
  }

  if (n.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-bell"></i><h3>No Notifications</h3></div>';
    return;
  }

  var html = '';
  for (var i = 0; i < n.length; i++) {
    var x = n[i];
    html += '<div class="notif-item' + (x.read ? '' : ' notif-unread') + '" onclick="readNotif(\'' + x.id + '\')">' +
      '<i class="fas ' + (x.type==='success'?'fa-check-circle':x.type==='error'?'fa-exclamation-circle':'fa-info-circle') + '"></i>' +
      '<div><p>' + x.msg + '</p><span class="notif-time">' + timeAgo(x.date) + '</span></div></div>';
  }
  list.innerHTML = html;
}

function readNotif(id) {
  for (var i = 0; i < STATE.notifications.length; i++) {
    if (STATE.notifications[i].id === id) { STATE.notifications[i].read = true; break; }
  }
  save();
  renderNotifs();
}

function timeAgo(d) {
  var m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  var h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

// ====== WALLET ======
function renderWallet() {
  var b = document.getElementById('walletBalance');
  if (b) b.textContent = (STATE.currentUser ? STATE.currentUser.wallet || 0 : 0).toLocaleString();
  var list = document.getElementById('walletHistory');
  if (!list) return;

  var tx = [];
  if (STATE.currentUser) {
    for (var i = 0; i < STATE.walletTx.length; i++) {
      if (STATE.walletTx[i].uid === STATE.currentUser.id) tx.push(STATE.walletTx[i]);
    }
  }

  if (tx.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No transactions</p>';
    return;
  }

  tx.reverse();
  var html = '';
  for (var i = 0; i < tx.length; i++) {
    var t = tx[i];
    html += '<div class="glass-sm" style="padding:12px;display:flex;justify-content:space-between;align-items:center;">' +
      '<div><p style="font-size:13px;">' + t.desc + '</p><span style="font-size:11px;color:var(--text-muted);">' + timeAgo(t.date) + '</span></div>' +
      '<span style="font-weight:700;color:' + (t.type==='credit'?'var(--neon-green)':'var(--danger)') + '">' +
      (t.type==='credit'?'+':'-') + '₦' + t.amount.toLocaleString() + '</span></div>';
  }
  list.innerHTML = html;
}

// ====== FAQ ======
function renderFAQ() {
  var faqs = [
    {q:'How do I make a purchase?',a:'Browse, click Buy Now, follow payment instructions, upload proof, wait for verification.'},
    {q:'How long does delivery take?',a:'Stated on each listing. Typically 12-48 hours after verification.'},
    {q:'What payment methods?',a:'OPay to the account details at checkout.'},
    {q:'Can I get a refund?',a:'Sales are final. Refund if not delivered within 7 days.'},
    {q:'How to contact support?',a:'Submit a ticket, use live chat, or email us.'},
    {q:'Is my account safe?',a:'Yes! Encrypted storage and secure sessions.'}
  ];

  var ids = ['faqList', 'faqFullList'];
  for (var j = 0; j < ids.length; j++) {
    var el = document.getElementById(ids[j]);
    if (!el) continue;
    var html = '';
    for (var i = 0; i < faqs.length; i++) {
      html += '<div class="faq-item glass-sm" onclick="this.classList.toggle(\'open\')">' +
        '<h4>' + faqs[i].q + ' <i class="fas fa-chevron-down" style="font-size:12px;transition:transform 0.3s;"></i></h4>' +
        '<p>' + faqs[i].a + '</p></div>';
    }
    el.innerHTML = html;
  }
}

// ====== TICKETS ======
function openTicket() {
  if (!STATE.currentUser) return showAuth();
  document.getElementById('ticketModal').style.display = 'flex';
}

function submitTicket(e) {
  e.preventDefault();
  var s = document.getElementById('ticketSubject') ? document.getElementById('ticketSubject').value.trim() : '';
  var pr = document.getElementById('ticketPriority') ? document.getElementById('ticketPriority').value : 'NORMAL';
  var d = document.getElementById('ticketDescription') ? document.getElementById('ticketDescription').value.trim() : '';

  STATE.tickets.push({
    id:uid(), uid:STATE.currentUser.id, username:STATE.currentUser.username,
    subject:s, desc:d, priority:pr, status:'OPEN', date:new Date().toISOString()
  });
  save();
  closeModal('ticketModal');
  var ts = document.getElementById('ticketSubject'); if (ts) ts.value = '';
  var td = document.getElementById('ticketDescription'); if (td) td.value = '';
  showToast('Ticket submitted!', 'success');
  renderTickets();
}

function renderTickets() {
  var list = document.getElementById('ticketsList');
  if (!list || !STATE.currentUser) return;

  var t = [];
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].uid === STATE.currentUser.id) t.push(STATE.tickets[i]);
  }

  if (t.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-ticket-alt"></i><h3>No Tickets</h3></div>';
    return;
  }

  t.reverse();
  var html = '';
  for (var i = 0; i < t.length; i++) {
    var x = t[i];
    html += '<div class="ticket-card glass-sm">' +
      '<div style="display:flex;justify-content:space-between;"><h4>' + x.subject + '</h4>' +
      '<span class="status-badge ' + (x.status==='OPEN'?'status-pending':'status-approved') + '">' + x.status + '</span></div>' +
      '<p>' + x.desc.substring(0,100) + (x.desc.length>100?'...':'') + '</p>' +
      '<p style="font-size:11px;color:var(--text-muted);margin-top:4px;">' + timeAgo(x.date) + ' • ' + x.priority + '</p></div>';
  }
  list.innerHTML = html;
}

// ====== ADMIN ======
function renderStats() {
  var ue = document.getElementById('statUsers');
  var pe = document.getElementById('statProducts');
  var ppe = document.getElementById('statPending');
  var re = document.getElementById('statRevenue');
  if (ue) ue.textContent = STATE.users.length;
  if (pe) pe.textContent = STATE.products.length;
  var pend = 0;
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].status === 'SUBMITTED') pend++;
  }
  if (ppe) ppe.textContent = pend;
  var rev = 0;
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].status === 'Delivered' || STATE.orders[i].status === 'Completed') rev += STATE.orders[i].amount;
  }
  if (re) re.textContent = '₦' + rev.toLocaleString();
}

function adminTab(tab) {
  var tabs = document.querySelectorAll('.admin-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  var tb = document.querySelector('.admin-tab[onclick*="\'"+tab+"\'"], .admin-tab[onclick*='+tab+']');
  // simpler: just find by text content matching logic
  var adminTabs = document.querySelectorAll('.admin-tab');
  var labels = {payments:'Payments',orders:'Orders',users:'Users',products:'Products',analytics:'Analytics',tickets:'Tickets',announce:'Announcements'};
  for (var i = 0; i < adminTabs.length; i++) {
    if (adminTabs[i].textContent.trim() === labels[tab]) { adminTabs[i].classList.add('active'); break; }
  }

  var c = document.getElementById('adminContent');
  if (!c) return;

  if (tab === 'payments') adminPayments(c);
  else if (tab === 'orders') adminOrders(c);
  else if (tab === 'users') adminUsers(c);
  else if (tab === 'products') adminProducts(c);
  else if (tab === 'analytics') adminAnalytics(c);
  else if (tab === 'tickets') adminTickets(c);
  else if (tab === 'announce') adminAnnounce(c);
}

function adminPayments(c) {
  var pend = [];
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].status === 'SUBMITTED') pend.push(STATE.payments[i]);
  }

  var phtml = '';
  if (pend.length > 0) {
    phtml = '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>Amount</th><th>Ref</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < pend.length; i++) {
      var x = pend[i];
      phtml += '<tr><td>' + x.name + '</td><td>₦' + x.amount.toLocaleString() + '</td><td>' + x.ref + '</td>' +
        '<td style="display:flex;gap:4px;">' +
        '<button class="action-btn approve-btn" onclick="approvePay(\'' + x.id + '\')">✔</button>' +
        '<button class="action-btn reject-btn" onclick="rejectPay(\'' + x.id + '\')">✘</button></td></tr>';
    }
    phtml += '</tbody></table></div>';
  } else {
    phtml = '<p style="color:var(--text-muted);margin-bottom:20px;">No pending payments</p>';
  }

  var allhtml = '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>';
  var allp = STATE.payments.slice().reverse();
  for (var i = 0; i < allp.length; i++) {
    var x = allp[i];
    allhtml += '<tr><td>' + x.name + '</td><td>₦' + x.amount.toLocaleString() + '</td>' +
      '<td><span class="status-badge ' + (x.status==='VERIFIED'?'status-approved':x.status==='REJECTED'?'status-pending':'status-submitted') + '">' + x.status + '</span></td>' +
      '<td>' + new Date(x.date).toLocaleDateString() + '</td></tr>';
  }
  allhtml += '</tbody></table></div>';

  c.innerHTML = '<h3 style="margin-bottom:12px;">Pending (' + pend.length + ')</h3>' + phtml +
    '<h3 style="margin:20px 0 12px;">All Payments</h3>' + allhtml;
}

function approvePay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'VERIFIED';
      // Update order
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].id === STATE.payments[i].oid) {
          STATE.orders[j].status = 'Approved';
          // Credit wallet
          for (var k = 0; k < STATE.users.length; k++) {
            if (STATE.users[k].id === STATE.payments[i].uid) {
              STATE.users[k].wallet = (STATE.users[k].wallet || 0) + STATE.payments[i].amount;
              STATE.walletTx.push({id:uid(), uid:STATE.users[k].id, amount:STATE.payments[i].amount, type:'credit', desc:'Payment verified', date:new Date().toISOString()});
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
  adminPayments(document.getElementById('adminContent'));
  renderStats();
  showToast('Approved!', 'success');
}

function rejectPay(id) {
  for (var i = 0; i < STATE.payments.length; i++) {
    if (STATE.payments[i].id === id) {
      STATE.payments[i].status = 'REJECTED';
      for (var j = 0; j < STATE.orders.length; j++) {
        if (STATE.orders[j].id === STATE.payments[i].oid) { STATE.orders[j].status = 'Pending'; break; }
      }
      break;
    }
  }
  save();
  adminPayments(document.getElementById('adminContent'));
  renderStats();
  showToast('Rejected', 'error');
}

function adminOrders(c) {
  var html = '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  var ords = STATE.orders.slice().reverse();
  for (var i = 0; i < ords.length; i++) {
    var o = ords[i];
    html += '<tr><td>' + o.num + '</td><td>' + o.product + '</td><td>' + o.buyerName + '</td><td>₦' + o.amount.toLocaleString() + '</td>' +
      '<td><span class="status-badge ' + sClass(o.status) + '">' + o.status + '</span></td>' +
      '<td>' + (o.status === 'Approved' ? '<button class="action-btn approve-btn" onclick="deliver(\'' + o.id + '\')">Deliver</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>';
  c.innerHTML = html;
}

function deliver(id) {
  for (var i = 0; i < STATE.orders.length; i++) {
    if (STATE.orders[i].id === id) { STATE.orders[i].status = 'Delivered'; break; }
  }
  save();
  adminOrders(document.getElementById('adminContent'));
  showToast('Delivered!', 'success');
}

function adminUsers(c) {
  c.innerHTML = '<div class="input-group" style="margin-bottom:16px;"><input type="text" id="userSearch" placeholder="Search..." oninput="searchU()" /></div>' +
    '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.users.length; i++) {
    var u = STATE.users[i];
    c.innerHTML += '<tr class="user-row"><td>' + u.username + '</td><td>' + u.email + '</td><td>' + u.role + '</td><td>₦' + (u.wallet||0).toLocaleString() + '</td>' +
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
  adminUsers(document.getElementById('adminContent'));
  showToast('Banned', 'info');
}

function unbanU(id) {
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id === id) { STATE.users[i].banned = false; break; }
  }
  save();
  adminUsers(document.getElementById('adminContent'));
  showToast('Unbanned', 'success');
}

function delU(id) {
  if (!confirm('Delete this user?')) return;
  var users = [];
  for (var i = 0; i < STATE.users.length; i++) {
    if (STATE.users[i].id !== id) users.push(STATE.users[i]);
  }
  STATE.users = users;
  save();
  adminUsers(document.getElementById('adminContent'));
  renderStats();
  showToast('Deleted', 'info');
}

function adminProducts(c) {
  c.innerHTML = '<h3 style="margin-bottom:12px;">All Products (' + STATE.products.length + ')</h3>' +
    '<div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  for (var i = 0; i < STATE.products.length; i++) {
    var p = STATE.products[i];
    c.innerHTML += '<tr><td>#' + p.lid + '</td><td>' + p.title + '</td><td>₦' + p.price.toLocaleString() + '</td><td>' + p.cat + '</td>' +
      '<td><span style="color:' + (p.status==='Active'?'var(--success)':'var(--text-muted)') + '">' + p.status + '</span></td>' +
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
  adminProducts(document.getElementById('adminContent'));
  renderStats();
  showToast('Deleted', 'info');
}

function adminAnalytics(c) {
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

  c.innerHTML = '<div class="admin-stats grid-4" style="margin-bottom:24px;">' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">₦' + rev.toLocaleString() + '</h3><p>Revenue</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-blue);">' + STATE.orders.length + '</h3><p>Orders</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-purple);">' + STATE.users.length + '</h3><p>Users</p></div>' +
    '<div class="stat-card glass-sm"><h3 style="color:var(--neon-pink);">' + STATE.products.length + '</h3><p>Products</p></div></div>' +
    '<h3>Recent Activity</h3>' + (recent || '<p style="color:var(--text-muted);">No orders yet</p>') +
    '<h3 style="margin-top:20px;">Export</h3>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-secondary" onclick="exportCSV(\'users\')"><i class="fas fa-download"></i> Users</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'orders\')"><i class="fas fa-download"></i> Orders</button>' +
    '<button class="btn-secondary" onclick="exportCSV(\'products\')"><i class="fas fa-download"></i> Products</button></div>';
}

function adminTickets(c) {
  if (STATE.tickets.length === 0) {
    c.innerHTML = '<h3 style="margin-bottom:12px;">Tickets</h3><p style="color:var(--text-muted);">None</p>';
    return;
  }
  var html = '<h3 style="margin-bottom:12px;">Tickets</h3><div style="overflow-x:auto;"><table class="admin-table"><thead><tr><th>User</th><th>Subject</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>';
  var t = STATE.tickets.slice().reverse();
  for (var i = 0; i < t.length; i++) {
    var x = t[i];
    html += '<tr><td>' + x.username + '</td><td>' + x.subject + '</td><td>' + x.priority + '</td>' +
      '<td><span class="status-badge ' + (x.status==='OPEN'?'status-pending':'status-approved') + '">' + x.status + '</span></td>' +
      '<td>' + (x.status === 'OPEN' ? '<button class="action-btn approve-btn" onclick="resolveT(\'' + x.id + '\')">Resolve</button>' : '') + '</td></tr>';
  }
  html += '</tbody></table></div>';
  c.innerHTML = html;
}

function resolveT(id) {
  for (var i = 0; i < STATE.tickets.length; i++) {
    if (STATE.tickets[i].id === id) { STATE.tickets[i].status = 'RESOLVED'; break; }
  }
  save();
  adminTickets(document.getElementById('adminContent'));
  showToast('Resolved', 'success');
}

function adminAnnounce(c) {
  var list = '';
  var a = STATE.announcements.slice().reverse();
  for (var i = 0; i < a.length; i++) {
    list += '<div class="glass-sm" style="padding:12px;margin-bottom:8px;"><h4>' + a[i].title + '</h4>' +
      '<p style="font-size:13px;color:var(--text-secondary);">' + a[i].content + '</p>' +
      '<span style="font-size:11px;color:var(--text-muted);">' + new Date(a[i].date || Date.now()).toLocaleDateString() + '</span></div>';
  }

  c.innerHTML = '<h3 style="margin-bottom:12px;">Post Announcement</h3>' +
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
  STATE.announcements.unshift({id:uid(), title:title, content:content, date:new Date().toISOString()});
  save();
  if (document.getElementById('annTitle')) document.getElementById('annTitle').value = '';
  if (document.getElementById('annContent')) document.getElementById('annContent').value = '';
  adminAnnounce(document.getElementById('adminContent'));
  // Notify all users
  for (var i = 0; i < STATE.users.length; i++) {
    STATE.notifications.unshift({id:uid(), uid:STATE.users[i].id, msg:'📢 ' + title, type:'info', read:false, date:new Date().toISOString()});
  }
  save();
  showToast('Posted!', 'success');
}

// ====== PROFILE ======
function updateProfile() {
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

(function() {
  var s = localStorage.getItem('zt');
  if (s) document.documentElement.setAttribute('data-theme', s);
  var t = document.getElementById('darkModeToggle');
  if (t) t.checked = s === 'light';
})();

// ====== EXPORT ======
function exportCSV(type) {
  var data, filename;
  if (type === 'users') {
    data = [];
    for (var i = 0; i < STATE.users.length; i++) {
      data.push({Username:STATE.users[i].username, Email:STATE.users[i].email, Role:STATE.users[i].role, Balance:'₦'+(STATE.users[i].wallet||0)});
    }
    filename = 'zeus_users.csv';
  } else if (type === 'orders') {
    data = [];
    for (var i = 0; i < STATE.orders.length; i++) {
      data.push({Order:STATE.orders[i].num, Product:STATE.orders[i].product, Buyer:STATE.orders[i].buyerName, Amount:'₦'+STATE.orders[i].amount, Status:STATE.orders[i].status});
    }
    filename = 'zeus_orders.csv';
  } else if (type === 'products') {
    data = [];
    for (var i = 0; i < STATE.products.length; i++) {
      data.push({ID:STATE.products[i].lid, Title:STATE.products[i].title, Price:'₦'+STATE.products[i].price, Category:STATE.products[i].cat, Status:STATE.products[i].status});
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

  var blob = new Blob(['\uFEFF' + rows.join('\n')], {type:'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(filename + ' downloaded!', 'success');
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

// ====== MODAL CLOSE ======
var modals = document.querySelectorAll('.modal-overlay');
for (var i = 0; i < modals.length; i++) {
  modals[i].addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
}

// ====== ESC ======
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var ms = document.querySelectorAll('.modal-overlay');
    for (var i = 0; i < ms.length; i++) ms[i].style.display = 'none';
  }
});

console.log('⚡ ZEUS loaded!');
console.log('Demo: demo_user / User@123456');
console.log('Admin: Click "Admin Only" → passcode: admin@zeus2026');
