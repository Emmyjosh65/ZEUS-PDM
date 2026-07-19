/* ====== ZEUS — Complete Application Logic ====== */

// ====== STATE ======
const STATE = {
  currentUser: null,
  users: JSON.parse(localStorage.getItem('zeus_users')) || [],
  products: JSON.parse(localStorage.getItem('zeus_products')) || [],
  orders: JSON.parse(localStorage.getItem('zeus_orders')) || [],
  payments: JSON.parse(localStorage.getItem('zeus_payments')) || [],
  favorites: JSON.parse(localStorage.getItem('zeus_favorites')) || [],
  notifications: JSON.parse(localStorage.getItem('zeus_notifications')) || [],
  tickets: JSON.parse(localStorage.getItem('zeus_tickets')) || [],
  categories: JSON.parse(localStorage.getItem('zeus_categories')) || [],
  announcements: JSON.parse(localStorage.getItem('zeus_announcements')) || [],
  reviews: JSON.parse(localStorage.getItem('zeus_reviews')) || [],
  walletTx: JSON.parse(localStorage.getItem('zeus_wallet_tx')) || [],
  isAdmin: false,
};

const ADMIN_PASSCODE = 'admin@zeus2026';

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  try {
    initDefaultData();
    checkSession();
    renderCategories();
    renderProducts();
    renderFAQ();
    initFilters();
  } catch (e) {
    console.error('ZEUS init error:', e);
    // Force hide loading screen even on error
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('authModal').style.display = 'flex';
  }
});

function initDefaultData() {
  if (STATE.categories.length === 0) {
    STATE.categories = [
      { id: 'cat1', name: 'Social Media', icon: '📱', desc: 'Facebook, Instagram, TikTok, Twitter, WhatsApp, Telegram' },
      { id: 'cat2', name: 'Messaging', icon: '💬', desc: 'WhatsApp, Telegram, Signal, Discord' },
      { id: 'cat3', name: 'Email', icon: '📧', desc: 'Gmail, Outlook, Yahoo, ProtonMail' },
      { id: 'cat4', name: 'Gaming', icon: '🎮', desc: 'Steam, Epic, Xbox, PlayStation, Roblox' },
      { id: 'cat5', name: 'Websites', icon: '🌐', desc: 'Ready-made websites & landing pages' },
      { id: 'cat6', name: 'Domains', icon: '🔗', desc: 'Premium domain names' },
      { id: 'cat7', name: 'Digital Services', icon: '⚡', desc: 'Graphics, writing, marketing, development' },
      { id: 'cat8', name: 'Other Digital Assets', icon: '📦', desc: 'E-books, templates, source code & more' },
    ];
    saveState();
  }

  if (STATE.products.length === 0) {
    const defaultProducts = [
      { id: 'p1', listingId: '0001', title: 'Facebook Profile (Example)', category: 'Social Media', price: 1000, status: 'Active', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', tags: ['facebook', 'profile', 'aged'], age: '1 Year', seller: 'zeus_admin', isTransferable: true, deliveryTime: '24 hours', rating: 4.5, reviewCount: 12, date: '2026-01-15', description: 'Aged Facebook profile with 1 year of activity. Has friends, posts, and activity history.' },
      { id: 'p2', listingId: '0002', title: 'Facebook Profile (Aged)', category: 'Social Media', price: 2000, status: 'Active', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', tags: ['facebook', 'aged', 'premium'], age: '2 Years', seller: 'zeus_admin', isTransferable: true, deliveryTime: '24 hours', rating: 4.8, reviewCount: 24, date: '2026-02-10', description: 'Established Facebook profile with 2 years of activity.' },
      { id: 'p3', listingId: '0003', title: 'Instagram Business Profile', category: 'Social Media', price: 2500, status: 'Active', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400', tags: ['instagram', 'business', 'marketing'], age: '1 Year', seller: 'zeus_admin', isTransferable: true, deliveryTime: '48 hours', rating: 4.6, reviewCount: 18, date: '2026-03-05', description: 'Instagram business profile with followers and engagement.' },
      { id: 'p4', listingId: '0004', title: 'Telegram Channel', category: 'Messaging', price: 3000, status: 'Active', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400', tags: ['telegram', 'channel', 'community'], age: '6 Months', seller: 'zeus_admin', isTransferable: true, deliveryTime: '12 hours', rating: 4.7, reviewCount: 9, date: '2026-04-20', description: 'Active Telegram channel with subscribers.' },
      { id: 'p5', listingId: '0005', title: 'WhatsApp Business Account', category: 'Messaging', price: 3500, status: 'Active', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400', tags: ['whatsapp', 'business', 'messaging'], age: '1 Year', seller: 'zeus_admin', isTransferable: true, deliveryTime: '24 hours', rating: 4.9, reviewCount: 31, date: '2026-05-01', description: 'Verified WhatsApp Business account.' },
      { id: 'p6', listingId: '0006', title: 'TikTok Creator Account', category: 'Social Media', price: 4500, status: 'Active', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400', tags: ['tiktok', 'creator', 'viral'], age: '8 Months', seller: 'zeus_admin', isTransferable: true, deliveryTime: '48 hours', rating: 4.3, reviewCount: 7, date: '2026-05-15', description: 'TikTok creator account with followers.' },
      { id: 'p7', listingId: '0007', title: 'Telegram Group (500+ Members)', category: 'Messaging', price: 5000, status: 'Active', image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400', tags: ['telegram', 'group', 'community'], age: '1 Year', seller: 'zeus_admin', isTransferable: true, deliveryTime: '24 hours', rating: 4.4, reviewCount: 15, date: '2026-06-01', description: 'Active Telegram group with 500+ members.' },
      { id: 'p8', listingId: '0008', title: 'Twitter/X Premium Account', category: 'Social Media', price: 6000, status: 'Active', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400', tags: ['twitter', 'premium', 'social'], age: '2 Years', seller: 'zeus_admin', isTransferable: false, deliveryTime: '48 hours', rating: 4.2, reviewCount: 11, date: '2026-06-10', description: 'Twitter/X account with premium features.' },
      { id: 'p9', listingId: '0100', title: 'Premium Domain (business.ng)', category: 'Domains', price: 15000, status: 'Active', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', tags: ['domain', 'premium', 'business'], age: 'New', seller: 'zeus_admin', isTransferable: true, deliveryTime: '24 hours', rating: 5.0, reviewCount: 3, date: '2026-06-20', description: 'Premium .ng domain.' },
      { id: 'p10', listingId: '0250', title: 'E-commerce Website Template', category: 'Websites', price: 8500, status: 'Active', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400', tags: ['template', 'ecommerce', 'website'], age: 'New', seller: 'zeus_admin', isTransferable: true, deliveryTime: 'Instant', rating: 4.6, reviewCount: 22, date: '2026-07-01', description: 'Modern e-commerce website template.' },
    ];
    STATE.products = defaultProducts;
    saveState();
  }

  if (!STATE.users.find(u => u.username === 'demo_user')) {
    STATE.users.push({
      id: 'u1', username: 'demo_user', email: 'user@demo.com',
      password: btoa('User@123456'), fullName: 'Demo User',
      role: 'USER', isVerified: true, walletBalance: 25000,
      referralCode: 'DEMO2026', phone: '', isBanned: false,
    });
    saveState();
  }
  if (!STATE.users.find(u => u.username === 'zeus_admin')) {
    STATE.users.push({
      id: 'u2', username: 'zeus_admin', email: 'admin@zeus.com',
      password: btoa('Admin@123456'), fullName: 'ZEUS Administrator',
      role: 'ADMIN', isVerified: true, walletBalance: 0,
      referralCode: 'ADMIN2026', phone: '', isBanned: false,
    });
    saveState();
  }
}

function saveState() {
  try {
    localStorage.setItem('zeus_users', JSON.stringify(STATE.users));
    localStorage.setItem('zeus_products', JSON.stringify(STATE.products));
    localStorage.setItem('zeus_orders', JSON.stringify(STATE.orders));
    localStorage.setItem('zeus_payments', JSON.stringify(STATE.payments));
    localStorage.setItem('zeus_favorites', JSON.stringify(STATE.favorites));
    localStorage.setItem('zeus_notifications', JSON.stringify(STATE.notifications));
    localStorage.setItem('zeus_tickets', JSON.stringify(STATE.tickets));
    localStorage.setItem('zeus_categories', JSON.stringify(STATE.categories));
    localStorage.setItem('zeus_announcements', JSON.stringify(STATE.announcements));
    localStorage.setItem('zeus_reviews', JSON.stringify(STATE.reviews));
    localStorage.setItem('zeus_wallet_tx', JSON.stringify(STATE.walletTx));
  } catch(e) { /* localStorage may be full */ }
}

function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// ====== SESSION ======
function checkSession() {
  try {
    const saved = localStorage.getItem('zeus_session');
    if (saved) {
      const user = STATE.users.find(u => u.id === saved);
      if (user && !user.isBanned) {
        STATE.currentUser = user;
        bootApp();
        return;
      }
    }
  } catch(e) {}
  showAuth();
}

function bootApp() {
  document.getElementById('loadingScreen').classList.add('hidden');
  document.getElementById('app').style.display = 'block';
  updateUserUI();
  navigate('home');
  renderOrders();
  renderFavorites();
  renderNotifications();
  renderTickets();
  renderAdminStats();
  if (STATE.currentUser && STATE.currentUser.role === 'ADMIN') {
    document.querySelector('.admin-btn').style.display = 'flex';
  }
}

function showAuth() {
  const el = document.getElementById('loadingScreen');
  if (el) el.classList.add('hidden');
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'flex';
}

function closeAuth() {
  document.getElementById('authModal').style.display = 'none';
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('forgotForm').style.display = 'none';
  if (tab === 'login') {
    document.querySelector('.auth-tab:nth-child(1)').classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.querySelector('.auth-tab:nth-child(2)').classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
}

function showForgotPassword() {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  document.getElementById('forgotForm').style.display = 'flex';
  document.getElementById('forgotForm').classList.add('active');
}

function showLoginForm() { switchAuthTab('login'); }

function togglePass(id) {
  const inp = document.getElementById(id);
  if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ====== AUTH HANDLERS ======
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe').checked;

  const user = STATE.users.find(u =>
    (u.username === username || u.email === username) &&
    atob(u.password) === password
  );

  if (!user) { showToast('Invalid username or password', 'error'); return; }
  if (user.isBanned) { showToast('Your account has been suspended', 'error'); return; }

  STATE.currentUser = user;
  if (remember) localStorage.setItem('zeus_session', user.id);
  else sessionStorage.setItem('zeus_session_temp', user.id);

  closeAuth();
  bootApp();
  showToast('Welcome back, ' + user.username + '! ⚡', 'success');
}

function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
  if (STATE.users.find(u => u.username === username)) { showToast('Username already taken', 'error'); return; }
  if (STATE.users.find(u => u.email === email)) { showToast('Email already registered', 'error'); return; }

  const newUser = {
    id: generateId(), username, email, password: btoa(password),
    fullName: '', role: 'USER', isVerified: true, walletBalance: 0,
    referralCode: username.toUpperCase() + Math.floor(1000 + Math.random() * 9000),
    phone: '', isBanned: false,
  };

  STATE.users.push(newUser);
  saveState();
  STATE.currentUser = newUser;
  localStorage.setItem('zeus_session', newUser.id);
  closeAuth();
  bootApp();
  showToast('Account created successfully! 🚀', 'success');
}

function handleGoogleLogin() {
  showToast('Google Sign-In coming soon! Use Login for now.', 'info');
}

function handleForgotPassword(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim();
  const user = STATE.users.find(u => u.email === email);
  showToast(user ? 'Password reset link sent! (Demo: User@123456)' : 'Email not found', user ? 'success' : 'error');
}

function handleLogout() {
  STATE.currentUser = null;
  STATE.isAdmin = false;
  localStorage.removeItem('zeus_session');
  sessionStorage.removeItem('zeus_session_temp');
  document.getElementById('app').style.display = 'none';
  showAuth();
  showToast('Logged out successfully', 'info');
}

function updateUserUI() {
  if (!STATE.currentUser) return;
  const u = STATE.currentUser;
  const initial = u.username.charAt(0).toUpperCase();
  document.getElementById('navAvatar').textContent = initial;
  document.getElementById('navUsername').textContent = u.username;
  document.getElementById('profileAvatar').textContent = initial;
  document.getElementById('profileUsername').value = u.username;
  document.getElementById('profileName').value = u.fullName || '';
  document.getElementById('profileEmail').value = u.email || '';
  document.getElementById('profilePhone').value = u.phone || '';
  document.getElementById('payUsername').value = u.username;
}

// ====== ADMIN PASSCODE ======
function openAdminPassModal() {
  if (!STATE.currentUser) { showAuth(); return; }
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminPassError').style.display = 'none';
  document.getElementById('adminPassModal').style.display = 'flex';
}

function verifyAdminPass() {
  const pass = document.getElementById('adminPassInput').value;
  if (pass === ADMIN_PASSCODE) {
    STATE.isAdmin = true;
    closeModal('adminPassModal');
    navigate('admin');
    showToast('Admin access granted', 'success');
  } else {
    document.getElementById('adminPassError').style.display = 'block';
    showToast('Access Denied! Invalid passcode.', 'error');
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

// ====== NAVIGATION ======
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll('.bottom-link').forEach(l => l.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll(`.nav-link[onclick*="'${page}'"]`).forEach(l => l.classList.add('active'));
  document.querySelectorAll(`.bottom-link[onclick*="'${page}'"]`).forEach(l => l.classList.add('active'));

  document.getElementById('sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'marketplace') renderProducts();
  if (page === 'orders') renderOrders();
  if (page === 'favorites') renderFavorites();
  if (page === 'notifications') renderNotifications();
  if (page === 'admin' && STATE.isAdmin) { renderAdminDashboard(); renderAdminStats(); }
  if (page === 'categories') renderCategories();
  if (page === 'support') renderFAQ();
  if (page === 'faq') renderFAQ();
  if (page === 'tickets') renderTickets();
  if (page === 'wallet') renderWallet();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ====== CATEGORIES ======
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;
  grid.innerHTML = STATE.categories.map(cat => `
    <div class="category-card" onclick="filterByCategory('${cat.name}')">
      <span class="cat-icon">${cat.icon}</span>
      <h3>${cat.name}</h3>
      <p>${cat.desc}</p>
    </div>
  `).join('');

  const sel = document.getElementById('filterCategory');
  if (sel) {
    sel.innerHTML = '<option value="all">All Categories</option>' +
      STATE.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }
}

function filterByCategory(name) {
  navigate('marketplace');
  const sel = document.getElementById('filterCategory');
  if (sel) sel.value = name;
  filterProducts();
}

// ====== PRODUCTS ======
function renderProducts(filtered) {
  const grid = document.getElementById('marketplaceGrid');
  const noProducts = document.getElementById('noProducts');
  if (!grid || !noProducts) return;

  const products = filtered || STATE.products.filter(p => p.status === 'Active');

  if (products.length === 0) {
    grid.innerHTML = '';
    noProducts.style.display = 'block';
    return;
  }
  noProducts.style.display = 'none';

  grid.innerHTML = products.map(p => {
    const isFav = STATE.currentUser && STATE.favorites.some(f => f.productId === p.id && f.userId === STATE.currentUser.id);
    return `
      <div class="product-card" onclick="showProductDetail('${p.id}')">
        <img class="product-card-image" src="${p.image}" alt="${p.title}" loading="lazy"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2230%22>📦</text></svg>'">
        <div class="product-card-body">
          <div class="product-card-id">#${p.listingId}</div>
          <div class="product-card-title">${p.title}</div>
          <div class="product-card-category">${p.category} ${p.age ? '• ' + p.age : ''}</div>
          <div class="product-card-footer">
            <div class="product-card-price">₦${p.price.toLocaleString()}</div>
            <div class="product-card-actions">
              <button class="card-action-btn ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${p.id}')">
                <i class="fas fa-heart"></i>
              </button>
              <button class="card-action-btn" onclick="event.stopPropagation(); shareProduct('${p.id}')">
                <i class="fas fa-share-alt"></i>
              </button>
              <button class="card-action-btn" onclick="event.stopPropagation(); buyNow('${p.id}')" style="background:rgba(0,212,255,0.15);color:var(--neon-blue);">
                <i class="fas fa-shopping-cart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterProducts() {
  const search = (document.getElementById('marketSearch')?.value || '').toLowerCase();
  const category = document.getElementById('filterCategory')?.value || 'all';
  const price = document.getElementById('filterPrice')?.value || 'all';
  const sort = document.getElementById('filterSort')?.value || 'newest';

  let filtered = STATE.products.filter(p => p.status === 'Active');

  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.listingId.includes(search) ||
      p.tags.some(t => t.toLowerCase().includes(search))
    );
  }
  if (category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (price !== 'all') {
    const [min, max] = price.split('-');
    if (max) filtered = filtered.filter(p => p.price >= parseInt(min) && p.price <= parseInt(max));
    else filtered = filtered.filter(p => p.price >= parseInt(min.replace('+', '')));
  }
  if (sort === 'newest') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sort === 'oldest') filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sort === 'lowest') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'highest') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  renderProducts(filtered);
}

function initFilters() {
  const el = document.getElementById('marketSearch');
  if (el) el.addEventListener('input', filterProducts);
}

// ====== PRODUCT DETAIL ======
function showProductDetail(id) {
  const product = STATE.products.find(p => p.id === id);
  if (!product) return;

  const container = document.getElementById('productDetail');
  if (!container) return;

  container.innerHTML = `
    <div class="product-detail-grid">
      <div>
        <img class="product-detail-image" src="${product.image}" alt="${product.title}"
          onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22400%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2260%22>📦</text></svg>'">
      </div>
      <div class="product-detail-info">
        <div style="color:var(--neon-blue);font-family:monospace;font-size:12px;">#${product.listingId}</div>
        <h2>${product.title}</h2>
        <div class="price-lg">₦${product.price.toLocaleString()}</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <span style="font-size:13px;color:var(--text-secondary);">📁 ${product.category}</span>
          ${product.age ? `<span style="font-size:13px;color:var(--text-secondary);">⏱ ${product.age}</span>` : ''}
          <span style="font-size:13px;color:var(--text-secondary);">⭐ ${product.rating}</span>
          <span style="font-size:13px;color:var(--text-secondary);">👤 ${product.seller}</span>
          <span style="font-size:13px;color:var(--neon-green);">${product.isTransferable ? '✅ Transferable' : '❌ Non-transferable'}</span>
        </div>
        <p>${product.description}</p>
        <div class="product-tags">${product.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
        <p style="font-size:13px;color:var(--text-secondary);">Delivery: ${product.deliveryTime}</p>
        <div style="display:flex;gap:12px;margin-top:8px;">
          <button class="btn-primary" onclick="buyNow('${product.id}')" style="flex:1;"><i class="fas fa-shopping-cart"></i> Buy Now</button>
          <button class="btn-secondary" onclick="toggleFavorite('${product.id}')" style="flex:0.5;">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  navigate('product');
}

// ====== CHECKOUT ======
function buyNow(id) {
  if (!STATE.currentUser) { showAuth(); return; }
  const product = STATE.products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('payProduct').value = `${product.listingId} - ${product.title}`;
  document.getElementById('payAmount').value = product.price;
  document.getElementById('payDate').value = new Date().toISOString().split('T')[0];

  const cp = document.getElementById('checkoutProduct');
  if (cp) {
    cp.innerHTML = `
      <div class="glass-sm" style="padding:16px;display:flex;align-items:center;gap:16px;margin-bottom:16px;">
        <img src="${product.image}" style="width:60px;height:60px;border-radius:8px;object-fit:cover;" />
        <div>
          <h4>#${product.listingId} - ${product.title}</h4>
          <p style="color:var(--neon-green);font-weight:700;">₦${product.price.toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  navigate('checkout');
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  if (!STATE.currentUser) { showAuth(); return; }

  const fullName = document.getElementById('payFullName')?.value.trim() || '';
  const productPurchased = document.getElementById('payProduct')?.value || '';
  const ref = document.getElementById('payRef')?.value.trim() || '';
  const date = document.getElementById('payDate')?.value || '';
  const notes = document.getElementById('payNotes')?.value.trim() || '';
  const fileInput = document.getElementById('payScreenshot');
  const screenshot = fileInput && fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : '';

  const product = STATE.products.find(p => `${p.listingId} - ${p.title}` === productPurchased);
  const amount = parseFloat(document.getElementById('payAmount')?.value) || (product ? product.price : 0);

  const order = {
    id: generateId(), orderNumber: 'ORD-' + Date.now().toString(36).toUpperCase(),
    productId: product?.id || '', productTitle: productPurchased,
    buyerId: STATE.currentUser.id, buyerName: STATE.currentUser.username,
    amount: amount, status: 'Payment Submitted', createdAt: new Date().toISOString(),
  };
  STATE.orders.push(order);

  const payment = {
    id: generateId(), orderId: order.id, userId: STATE.currentUser.id,
    fullName, amount, transactionRef: ref, paymentDate: date,
    notes, screenshot, status: 'SUBMITTED', createdAt: new Date().toISOString(),
  };
  STATE.payments.push(payment);
  saveState();

  showToast('Payment submitted! Waiting for admin verification.', 'success');
  navigate('orders');
  renderOrders();

  // Reset form
  document.getElementById('paymentForm')?.reset();
  document.getElementById('payDate').value = new Date().toISOString().split('T')[0];
}

// ====== ORDERS ======
function renderOrders() {
  const list = document.getElementById('ordersList');
  if (!list || !STATE.currentUser) return;

  const userOrders = STATE.orders.filter(o => o.buyerId === STATE.currentUser.id);
  if (userOrders.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><h3>No Orders Yet</h3><p>Browse the marketplace to make your first purchase</p></div>';
    return;
  }

  list.innerHTML = userOrders.reverse().map(o => `
    <div class="order-card">
      <div class="order-info">
        <h4>${o.productTitle}</h4>
        <p>Order #${o.orderNumber} • ${new Date(o.createdAt).toLocaleDateString()}</p>
        <p style="font-weight:700;color:var(--neon-green);">₦${o.amount.toLocaleString()}</p>
      </div>
      <span class="status-badge ${getStatusClass(o.status)}">${o.status}</span>
    </div>
  `).join('');
}

function getStatusClass(status) {
  const map = {
    'Pending': 'status-pending', 'Payment Submitted': 'status-submitted',
    'Under Review': 'status-review', 'Approved': 'status-approved',
    'Delivered': 'status-delivered', 'Completed': 'status-completed',
  };
  return map[status] || 'status-pending';
}

// ====== FAVORITES ======
function toggleFavorite(productId) {
  if (!STATE.currentUser) { showAuth(); return; }
  const idx = STATE.favorites.findIndex(f => f.productId === productId && f.userId === STATE.currentUser.id);
  if (idx >= 0) {
    STATE.favorites.splice(idx, 1);
    showToast('Removed from favorites', 'info');
  } else {
    STATE.favorites.push({ id: generateId(), userId: STATE.currentUser.id, productId });
    showToast('Added to favorites! ❤️', 'success');
  }
  saveState();
  renderProducts();
  renderFavorites();
}

function renderFavorites() {
  const grid = document.getElementById('favoritesGrid');
  if (!grid || !STATE.currentUser) return;

  const favProducts = STATE.products.filter(p =>
    STATE.favorites.some(f => f.productId === p.id && f.userId === STATE.currentUser.id)
  );

  if (favProducts.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>No Favorites Yet</h3></div>';
    return;
  }
  renderProductsGrid(grid, favProducts);
}

function renderProductsGrid(grid, products) {
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="showProductDetail('${p.id}')">
      <img class="product-card-image" src="${p.image}" alt="${p.title}" loading="lazy"
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%231a1a2e%22 width=%22400%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 fill=%22%2300d4ff%22 font-size=%2230%22>📦</text></svg>'">
      <div class="product-card-body">
        <div class="product-card-id">#${p.listingId}</div>
        <div class="product-card-title">${p.title}</div>
        <div class="product-card-category">${p.category}</div>
        <div class="product-card-footer">
          <div class="product-card-price">₦${p.price.toLocaleString()}</div>
          <button class="card-action-btn favorited" onclick="event.stopPropagation(); toggleFavorite('${p.id}')">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function shareProduct(id) {
  const product = STATE.products.find(p => p.id === id);
  if (!product) return;
  if (navigator.share) {
    navigator.share({ title: product.title, text: `ZEUS - ${product.title}: ₦${product.price}`, url: window.location.href });
  } else {
    navigator.clipboard.writeText(`ZEUS - ${product.title}: ₦${product.price}`);
    showToast('Link copied to clipboard!', 'success');
  }
}

// ====== NOTIFICATIONS ======
function addNotification(message, type) {
  if (!STATE.currentUser) return;
  STATE.notifications.unshift({
    id: generateId(), userId: STATE.currentUser.id, message, type: type || 'info',
    isRead: false, createdAt: new Date().toISOString(),
  });
  saveState();
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notificationsList');
  if (!list || !STATE.currentUser) return;

  const userNotifs = STATE.notifications.filter(n => n.userId === STATE.currentUser.id);
  if (userNotifs.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-bell"></i><h3>No Notifications</h3></div>';
    return;
  }

  list.innerHTML = userNotifs.map(n => `
    <div class="notif-item ${n.isRead ? '' : 'notif-unread'}" onclick="markNotifRead('${n.id}')">
      <i class="fas ${n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <div>
        <p>${n.message}</p>
        <span class="notif-time">${timeAgo(n.createdAt)}</span>
      </div>
    </div>
  `).join('');
}

function markNotifRead(id) {
  const n = STATE.notifications.find(x => x.id === id);
  if (n) { n.isRead = true; saveState(); renderNotifications(); }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

// ====== WALLET ======
function renderWallet() {
  const balance = STATE.currentUser?.walletBalance || 0;
  const el = document.getElementById('walletBalance');
  if (el) el.textContent = balance.toLocaleString();

  const list = document.getElementById('walletHistory');
  if (!list) return;

  const tx = STATE.walletTx.filter(t => t.userId === STATE.currentUser?.id);
  if (tx.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No transactions yet</p>';
    return;
  }

  list.innerHTML = tx.reverse().map(t => `
    <div class="glass-sm" style="padding:12px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <p style="font-size:13px;">${t.description}</p>
        <span style="font-size:11px;color:var(--text-muted);">${timeAgo(t.createdAt)}</span>
      </div>
      <span style="font-weight:700;color:${t.type === 'credit' ? 'var(--neon-green)' : 'var(--danger)'}">
        ${t.type === 'credit' ? '+' : '-'}₦${t.amount.toLocaleString()}
      </span>
    </div>
  `).join('');
}

// ====== SUPPORT ======
function renderFAQ() {
  const faqs = [
    { q: 'How do I make a purchase?', a: 'Browse the marketplace, click "Buy Now", follow payment instructions, upload proof, wait for verification.' },
    { q: 'How long does delivery take?', a: 'Delivery time is stated on each listing. Typically 12-48 hours after payment verification.' },
    { q: 'What payment methods are accepted?', a: 'Payments are made via OPay to the account details provided at checkout.' },
    { q: 'Can I get a refund?', a: 'All sales are final for digital goods. Refunds apply if product is not delivered within 7 days.' },
    { q: 'How do I contact support?', a: 'Submit a support ticket, use live chat, or email us. Response within 24 hours.' },
    { q: 'Is my account safe?', a: 'Yes! We use encrypted storage and secure sessions.' },
    { q: 'Can I sell on ZEUS?', a: 'Seller registration opening soon. Contact support for early access.' },
  ];

  ['faqList', 'faqFullList'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = faqs.map((f, i) => `
      <div class="faq-item glass-sm" onclick="toggleFaq(this)">
        <h4>${f.q} <i class="fas fa-chevron-down" style="font-size:12px;transition:transform 0.3s;"></i></h4>
        <p>${f.a}</p>
      </div>
    `).join('');
  });
}

function toggleFaq(el) {
  el.classList.toggle('open');
  const icon = el.querySelector('i.fa-chevron-down');
  if (icon) icon.style.transform = el.classList.contains('open') ? 'rotate(180deg)' : '';
}

// ====== TICKETS ======
function openTicketModal() {
  if (!STATE.currentUser) { showAuth(); return; }
  document.getElementById('ticketModal').style.display = 'flex';
}

function submitTicket(e) {
  e.preventDefault();
  const subject = document.getElementById('ticketSubject')?.value.trim() || '';
  const priority = document.getElementById('ticketPriority')?.value || 'NORMAL';
  const description = document.getElementById('ticketDescription')?.value.trim() || '';

  const ticket = {
    id: generateId(), userId: STATE.currentUser.id, username: STATE.currentUser.username,
    subject, description, priority, status: 'OPEN', createdAt: new Date().toISOString(),
  };
  STATE.tickets.push(ticket);
  saveState();

  closeModal('ticketModal');
  ['ticketSubject', 'ticketDescription'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  showToast('Support ticket submitted!', 'success');
  renderTickets();
}

function renderTickets() {
  const list = document.getElementById('ticketsList');
  if (!list || !STATE.currentUser) return;

  const userTickets = STATE.tickets.filter(t => t.userId === STATE.currentUser.id);
  if (userTickets.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="fas fa-ticket-alt"></i><h3>No Tickets</h3></div>';
    return;
  }

  list.innerHTML = userTickets.reverse().map(t => `
    <div class="ticket-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4>${t.subject}</h4>
        <span class="status-badge ${t.status === 'OPEN' ? 'status-pending' : 'status-approved'}">${t.status}</span>
      </div>
      <p>${t.description.substring(0, 100)}${t.description.length > 100 ? '...' : ''}</p>
      <p style="font-size:11px;color:var(--text-muted);margin-top:4px;">${timeAgo(t.createdAt)} • Priority: ${t.priority}</p>
    </div>
  `).join('');
}

// ====== ADMIN ======
function renderAdminDashboard() {
  document.querySelector('.admin-btn').style.display = 'flex';
  switchAdminTab('payments');
}

function renderAdminStats() {
  const ue = document.getElementById('statTotalUsers');
  const pe = document.getElementById('statTotalProducts');
  const ppe = document.getElementById('statPendingPayments');
  const re = document.getElementById('statRevenue');
  if (ue) ue.textContent = STATE.users.length;
  if (pe) pe.textContent = STATE.products.length;
  if (ppe) ppe.textContent = STATE.payments.filter(p => p.status === 'SUBMITTED').length;
  const revenue = STATE.orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').reduce((s, o) => s + o.amount, 0);
  if (re) re.textContent = '₦' + revenue.toLocaleString();
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.admin-tab[onclick*="${tab}"]`)?.classList.add('active');
  const content = document.getElementById('adminContent');
  if (!content) return;

  const handlers = {
    payments: renderAdminPayments, orders: renderAdminOrders,
    users: renderAdminUsers, products: renderAdminProducts,
    analytics: renderAdminAnalytics, tickets: renderAdminTickets,
    announcements: renderAdminAnnouncements,
  };
  if (handlers[tab]) handlers[tab](content);
}

function renderAdminPayments(container) {
  const pending = STATE.payments.filter(p => p.status === 'SUBMITTED');
  container.innerHTML = `
    <h3 style="margin-bottom:12px;">Pending Payments (${pending.length})</h3>
    ${pending.length === 0 ? '<p style="color:var(--text-muted);margin-bottom:20px;">No pending payments</p>' : `
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>User</th><th>Product</th><th>Amount</th><th>Ref</th><th>Actions</th></tr></thead>
        <tbody>${pending.map(p => {
          const ord = STATE.orders.find(o => o.id === p.orderId);
          return `<tr>
            <td>${p.fullName}</td>
            <td>${ord ? ord.productTitle : 'N/A'}</td>
            <td>₦${p.amount.toLocaleString()}</td>
            <td>${p.transactionRef}</td>
            <td style="display:flex;gap:4px;">
              <button class="action-btn approve-btn" onclick="approvePayment('${p.id}')">Approve</button>
              <button class="action-btn reject-btn" onclick="rejectPayment('${p.id}')">Reject</button>
            </td>
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>`}
    <h3 style="margin:20px 0 12px;">All Payments</h3>
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>${STATE.payments.slice().reverse().map(p => `
          <tr>
            <td>${p.fullName}</td>
            <td>₦${p.amount.toLocaleString()}</td>
            <td><span class="status-badge ${p.status === 'VERIFIED' ? 'status-approved' : p.status === 'REJECTED' ? 'status-pending' : 'status-submitted'}">${p.status}</span></td>
            <td>${new Date(p.createdAt).toLocaleDateString()}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>
  `;
}

function approvePayment(paymentId) {
  const payment = STATE.payments.find(p => p.id === paymentId);
  if (!payment) return;
  payment.status = 'VERIFIED';
  const order = STATE.orders.find(o => o.id === payment.orderId);
  if (order) {
    order.status = 'Approved';
    const user = STATE.users.find(u => u.id === payment.userId);
    if (user) {
      user.walletBalance = (user.walletBalance || 0) + payment.amount;
      STATE.walletTx.push({ id: generateId(), userId: user.id, amount: payment.amount, type: 'credit', description: 'Payment verified', createdAt: new Date().toISOString() });
    }
  }
  saveState();
  renderAdminPayments(document.getElementById('adminContent'));
  renderAdminStats();
  showToast('Payment approved ✅', 'success');
}

function rejectPayment(paymentId) {
  const payment = STATE.payments.find(p => p.id === paymentId);
  if (!payment) return;
  payment.status = 'REJECTED';
  const order = STATE.orders.find(o => o.id === payment.orderId);
  if (order) order.status = 'Pending';
  saveState();
  renderAdminPayments(document.getElementById('adminContent'));
  renderAdminStats();
  showToast('Payment rejected', 'error');
}

function renderAdminOrders(container) {
  container.innerHTML = `
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>Order#</th><th>Product</th><th>Buyer</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>${STATE.orders.slice().reverse().map(o => `
          <tr>
            <td>${o.orderNumber}</td>
            <td>${o.productTitle}</td>
            <td>${o.buyerName}</td>
            <td>₦${o.amount.toLocaleString()}</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${o.status}</span></td>
            <td>${o.status === 'Approved' ? `<button class="action-btn approve-btn" onclick="markDelivered('${o.id}')">Deliver</button>` : ''}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>
  `;
}

function markDelivered(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (order) { order.status = 'Delivered'; saveState(); renderAdminOrders(document.getElementById('adminContent')); showToast('Order delivered!', 'success'); }
}

function renderAdminUsers(container) {
  container.innerHTML = `
    <div class="input-group" style="margin-bottom:16px;">
      <input type="text" id="adminUserSearch" placeholder="Search users..." oninput="searchAdminUsers()" />
    </div>
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${STATE.users.map(u => `
          <tr class="admin-user-row">
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td>${u.role}</td>
            <td>₦${(u.walletBalance || 0).toLocaleString()}</td>
            <td>${u.isBanned ? '<span style="color:var(--danger);">Banned</span>' : '<span style="color:var(--success);">Active</span>'}</td>
            <td style="display:flex;gap:4px;">
              ${u.isBanned ? `<button class="action-btn approve-btn" onclick="unbanUser('${u.id}')">Unban</button>` : `<button class="action-btn reject-btn" onclick="banUser('${u.id}')">Ban</button>`}
              <button class="action-btn reject-btn" onclick="deleteUser('${u.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>
  `;
}

function searchAdminUsers() {
  const q = (document.getElementById('adminUserSearch')?.value || '').toLowerCase();
  document.querySelectorAll('.admin-user-row').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function banUser(id) { const u = STATE.users.find(x => x.id === id); if (u) { u.isBanned = true; saveState(); renderAdminUsers(document.getElementById('adminContent')); showToast('User banned', 'info'); } }
function unbanUser(id) { const u = STATE.users.find(x => x.id === id); if (u) { u.isBanned = false; saveState(); renderAdminUsers(document.getElementById('adminContent')); showToast('User unbanned', 'success'); } }
function deleteUser(id) { if (!confirm('Delete this user?')) return; STATE.users = STATE.users.filter(u => u.id !== id); saveState(); renderAdminUsers(document.getElementById('adminContent')); renderAdminStats(); showToast('User deleted', 'info'); }

function renderAdminProducts(container) {
  container.innerHTML = `
    <h3 style="margin-bottom:12px;">All Products (${STATE.products.length})</h3>
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>${STATE.products.map(p => `
          <tr>
            <td>#${p.listingId}</td>
            <td>${p.title}</td>
            <td>₦${p.price.toLocaleString()}</td>
            <td>${p.category}</td>
            <td><span style="color:${p.status === 'Active' ? 'var(--success)' : 'var(--text-muted)'}">${p.status}</span></td>
            <td style="display:flex;gap:4px;">
              <button class="action-btn reject-btn" onclick="deleteProduct('${p.id}')">Delete</button>
            </td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>
  `;
}

function deleteProduct(id) { if (!confirm('Delete this product?')) return; STATE.products = STATE.products.filter(p => p.id !== id); saveState(); renderAdminProducts(document.getElementById('adminContent')); renderAdminStats(); showToast('Product deleted', 'info'); }

function renderAdminAnalytics(container) {
  const totalRevenue = STATE.orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').reduce((s, o) => s + o.amount, 0);
  container.innerHTML = `
    <div class="admin-stats grid-4" style="margin-bottom:24px;">
      <div class="stat-card glass-sm"><h3 style="color:var(--neon-green);">₦${totalRevenue.toLocaleString()}</h3><p>Revenue</p></div>
      <div class="stat-card glass-sm"><h3 style="color:var(--neon-blue);">${STATE.orders.length}</h3><p>Orders</p></div>
      <div class="stat-card glass-sm"><h3 style="color:var(--neon-purple);">${STATE.users.length}</h3><p>Users</p></div>
      <div class="stat-card glass-sm"><h3 style="color:var(--neon-pink);">${STATE.products.length}</h3><p>Products</p></div>
    </div>
    <h3>Recent Activity</h3>
    ${STATE.orders.length === 0 ? '<p style="color:var(--text-muted);">No orders yet</p>' :
      STATE.orders.slice(-5).reverse().map(o => `
        <div class="glass-sm" style="padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;">
          <span style="font-size:13px;">${o.productTitle} - ${o.buyerName}</span>
          <span class="status-badge ${getStatusClass(o.status)}">${o.status}</span>
        </div>
      `).join('')}
    <h3 style="margin-top:20px;">Export Data</h3>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button class="btn-secondary" onclick="exportCSV('users')"><i class="fas fa-download"></i> Users</button>
      <button class="btn-secondary" onclick="exportCSV('orders')"><i class="fas fa-download"></i> Orders</button>
      <button class="btn-secondary" onclick="exportCSV('products')"><i class="fas fa-download"></i> Products</button>
    </div>
  `;
}

function renderAdminTickets(container) {
  container.innerHTML = `
    <h3 style="margin-bottom:12px;">All Support Tickets</h3>
    ${STATE.tickets.length === 0 ? '<p style="color:var(--text-muted);">No tickets</p>' : `
    <div style="overflow-x:auto;">
      <table class="admin-table">
        <thead><tr><th>User</th><th>Subject</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>${STATE.tickets.slice().reverse().map(t => `
          <tr>
            <td>${t.username}</td>
            <td>${t.subject}</td>
            <td>${t.priority}</td>
            <td><span class="status-badge ${t.status === 'OPEN' ? 'status-pending' : 'status-approved'}">${t.status}</span></td>
            <td>${t.status === 'OPEN' ? `<button class="action-btn approve-btn" onclick="resolveTicket('${t.id}')">Resolve</button>` : ''}</td>
          </tr>
        `).join('')}</tbody>
      </table>
    </div>`}
  `;
}

function resolveTicket(id) { const t = STATE.tickets.find(x => x.id === id); if (t) { t.status = 'RESOLVED'; saveState(); renderAdminTickets(document.getElementById('adminContent')); showToast('Ticket resolved', 'success'); } }

function renderAdminAnnouncements(container) {
  container.innerHTML = `
    <h3 style="margin-bottom:12px;">Post Announcement</h3>
    <form onsubmit="createAnnouncement(event)" style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">
      <div class="input-group"><input type="text" id="announceTitle" placeholder="Title" required /></div>
      <div class="input-group"><textarea id="announceContent" placeholder="Content" rows="3" required></textarea></div>
      <button class="btn-primary" type="submit"><i class="fas fa-bullhorn"></i> Post</button>
    </form>
    <div id="announcementsList">
      ${STATE.announcements.length === 0 ? '<p style="color:var(--text-muted);">No announcements</p>' :
        STATE.announcements.slice().reverse().map(a => `
          <div class="glass-sm" style="padding:12px;margin-bottom:8px;">
            <h4>${a.title}</h4>
            <p style="font-size:13px;color:var(--text-secondary);">${a.content}</p>
            <span style="font-size:11px;color:var(--text-muted);">${new Date(a.createdAt).toLocaleDateString()}</span>
          </div>
        `).join('')}
    </div>
  `;
}

function createAnnouncement(e) {
  e.preventDefault();
  const title = document.getElementById('announceTitle')?.value.trim() || '';
  const content = document.getElementById('announceContent')?.value.trim() || '';
  STATE.announcements.unshift({ id: generateId(), title, content, createdAt: new Date().toISOString() });
  saveState();
  document.getElementById('announceTitle').value = '';
  document.getElementById('announceContent').value = '';
  renderAdminAnnouncements(document.getElementById('adminContent'));
  STATE.users.forEach(u => {
    STATE.notifications.unshift({ id: generateId(), userId: u.id, message: '📢 ' + title, type: 'info', isRead: false, createdAt: new Date().toISOString() });
  });
  saveState();
  showToast('Announcement posted!', 'success');
}

// ====== PROFILE ======
function updateProfile() {
  if (!STATE.currentUser) return;
  const user = STATE.users.find(u => u.id === STATE.currentUser.id);
  if (user) {
    user.fullName = document.getElementById('profileName')?.value || '';
    user.email = document.getElementById('profileEmail')?.value || '';
    user.phone = document.getElementById('profilePhone')?.value || '';
    STATE.currentUser = user;
    saveState();
    updateUserUI();
    showToast('Profile updated! ✅', 'success');
  }
}

// ====== SETTINGS ======
function toggleDarkMode() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || '';
  const next = current === 'light' ? '' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('zeus_theme', next);
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = next === 'light';
}

function toggle2FA() {
  const checked = document.getElementById('tfaToggle')?.checked;
  showToast(checked ? '2FA Enabled' : '2FA Disabled', checked ? 'success' : 'info');
}

// ====== EXPORT CSV ======
function exportCSV(type) {
  let data, filename;
  switch(type) {
    case 'users':
      data = STATE.users.map(u => ({ Username: u.username, Email: u.email, Role: u.role, Balance: '₦' + (u.walletBalance || 0) }));
      filename = 'zeus_users.csv';
      break;
    case 'orders':
      data = STATE.orders.map(o => ({ Order: o.orderNumber, Product: o.productTitle, Buyer: o.buyerName, Amount: '₦' + o.amount, Status: o.status }));
      filename = 'zeus_orders.csv';
      break;
    case 'products':
      data = STATE.products.map(p => ({ ID: p.listingId, Title: p.title, Price: '₦' + p.price, Category: p.category, Status: p.status }));
      filename = 'zeus_products.csv';
      break;
    default: return;
  }

  if (!data || data.length === 0) { showToast('No data to export', 'info'); return; }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map(h => {
      const val = row[h] || '';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(filename + ' downloaded!', 'success');
}

// ====== TOAST ======
function showToast(message, type) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type || 'info'}`;
  const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ====== COPY ======
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Account number copied!', 'success'))
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Account number copied!', 'success');
    });
}

// ====== THEME ======
(function initTheme() {
  const saved = localStorage.getItem('zeus_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) toggle.checked = saved === 'light';
})();

// ====== MODAL CLOSE ======
document.querySelectorAll('.modal-overlay').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) this.style.display = 'none';
  });
});

// ====== ESC KEY ======
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
  }
});

console.log('⚡ ZEUS Marketplace loaded!');
console.log('👤 Demo: demo_user / User@123456');
console.log('🔐 Admin: Click "Admin Only" → passcode: admin@zeus2026');
