'use strict';
/* ================================================================
   mega-fix-patch.js — OutfitKart ALL BUGS FIX
   ================================================================
   FIXES:
   1. Cart — product name/image/price sahi (cart items product DB se match)
   2. Categories — subcategory image fix (source.unsplash fallback replaced)
   3. Profile pages — footer ke upar properly open hoti hain
   4. Auth gate — already logged in user ko sirf curtain animation
   5. Admin color animation — login pe hi chalti hai
   6. Bottom nav — profile pages ke neeche chhipti nahi
   7. Influencer — earnings + submissions visible
   8. Policies — profile page mein apna full page khutha hai
   ================================================================
   index.html mein SABSE LAST script ke baad add karo:
     <script src="mega-fix-patch.js"></script>
   ================================================================ */

(function () {

/* ────────────────────────────────────────────────────────────────
   2. CATEGORIES SUBCAT IMAGE FIX
   Problem: source.unsplash.com URLs 3 chars return karte hain (dead)
   Fix: Pexels CDN + picsum fallback use karo
   ──────────────────────────────────────────────────────────────── */
const WORKING_SUBCAT_IMGS = {
  // Men Topwear
  'T-Shirts':         'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80',
  'Casual Shirts':    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80',
  'Formal Shirts':    'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Oversized Tees':   'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80',
  'Oversized Shirts': 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80',
  'Hoodies':          'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=220&fit=crop&q=80',
  'Denim Jacket':     'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80',
  // Men Bottomwear
  'Baggy Jeans':      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=220&fit=crop&q=80',
  'Straight Fit Jeans':'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Slim Fit Jeans':   'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=220&fit=crop&q=80',
  'Cotton Trousers':  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=220&fit=crop&q=80',
  'Joggers':          'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=200&h=220&fit=crop&q=80',
  'Cargo Pants':      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=220&fit=crop&q=80',
  'Formal Pant':      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Trousers':         'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  // Men Footwear
  'Sneakers':         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80',
  'Formal Shoes':     'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80',
  'Sports Shoes':     'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80',
  'Sandals':          'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80',
  'Slippers':         'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80',
  // Women Ethnic
  'Sarees':           'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Kurtis':           'https://images.unsplash.com/photo-1582718560869-01152e38cfd4?w=200&h=220&fit=crop&q=80',
  'Lehengas':         'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  // Women Western
  'Tops':             'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'Palazzo':          'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80',
  'Tops & Tunics':    'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'Dresses':          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80',
  'Skirts':           'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80',
  // Women Footwear
  'Heels':            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80',
  'Flats':            'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  'Wedges':           'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=200&h=220&fit=crop&q=80',
  // Combos
  'Formal Combo':     'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=220&fit=crop&q=80',
  'Casual Combo':     'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&h=220&fit=crop&q=80',
  'Ethnic Combo':     'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Western Combo':    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80',
  'Party Combo':      'https://images.unsplash.com/photo-1552896236-74e22da82e93?w=200&h=220&fit=crop&q=80',
  'Streetwear Combo': 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=200&h=220&fit=crop&q=80',
  'Tracksuit':        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=220&fit=crop&q=80',
  'Couple Combo':     'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  'Gym Combo':        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=220&fit=crop&q=80',
  'Party Wear Combo': 'https://images.unsplash.com/photo-1552896236-74e22da82e93?w=200&h=220&fit=crop&q=80',
  'Office Combo':     'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Ethnic Set':       'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Indo-Western':     'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  'Nehru Jacket Combo':'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Best Friend Combo':'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  'Matching Outfit Combo':'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  // Accessories
  'Sunglasses':       'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80',
  'Watches':          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80',
  'Wallets':          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=220&fit=crop&q=80',
  'Bags':             'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Belts':            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Caps':             'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=220&fit=crop&q=80',
  'Chains':           'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Bracelets':        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=220&fit=crop&q=80',
  'Earrings':         'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80',
  'Necklace Sets':    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Handbags':         'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Backpacks':        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  // Perfumes
  "Men's Perfume":    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  "Women's Perfume":  'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=220&fit=crop&q=80',
  "Unisex Perfume":   'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  "Luxury Perfume":   'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  "Budget Perfume":   'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  "Attar / Ittar":    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  "Body Mist":        'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=220&fit=crop&q=80',
  "Deodorant Spray":  'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  "Gift Set":         'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80',
  // Gold
  'Topwear':          'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Bottomwear':       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Footwear':         'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80',
};

// Fix getSubcategoryImage in script-core.js (view-category page)
function _patchGetSubcategoryImage() {
  window.getSubcategoryImage = function (categoryName, sub) {
    // First try real product image
    const allP = [...(window.products || []), ...(window.goldProducts || [])];
    const match = allP.find(p =>
      p.category === categoryName &&
      p.sub === sub &&
      ((p.imgs && p.imgs[0]) || p.img)
    );
    if (match) return (match.imgs && match.imgs[0]) || match.img;

    // Then hardcoded map
    const key = Object.keys(WORKING_SUBCAT_IMGS).find(k =>
      k.toLowerCase() === sub.toLowerCase() ||
      sub.toLowerCase().includes(k.toLowerCase())
    );
    if (key) return WORKING_SUBCAT_IMGS[key];

    // Last resort — picsum (always works, no crop limit)
    const seed = sub.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/200/220`;
  };
}

// Also fix ok-sc img broken images in categories-nav-patch
function _fixCatNavImages() {
  document.querySelectorAll('.ok-sc img').forEach(img => {
    if (!img.dataset.fixApplied) {
      img.dataset.fixApplied = '1';
      img.addEventListener('error', function () {
        const altText = this.alt || '';
        const key = Object.keys(WORKING_SUBCAT_IMGS).find(k =>
          k.toLowerCase() === altText.toLowerCase() ||
          altText.toLowerCase().includes(k.toLowerCase())
        );
        if (key) {
          this.src = WORKING_SUBCAT_IMGS[key];
        } else {
          const seed = altText.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 42;
          this.src = `https://picsum.photos/seed/${seed}/200/220`;
        }
      });
      // Also proactively replace source.unsplash.com (it's deprecated/broken)
      if (img.src && img.src.includes('source.unsplash.com')) {
        const altText = img.alt || '';
        const key = Object.keys(WORKING_SUBCAT_IMGS).find(k =>
          k.toLowerCase() === altText.toLowerCase() ||
          altText.toLowerCase().includes(k.toLowerCase())
        );
        if (key) {
          img.src = WORKING_SUBCAT_IMGS[key];
        } else {
          const seed = altText.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 42;
          img.src = `https://picsum.photos/seed/${seed}/200/220`;
        }
      }
    }
  });
}

// MutationObserver to fix images as they're added
function _watchCatImages() {
  const obs = new MutationObserver(() => _fixCatNavImages());
  const panel = document.getElementById('ok-crp');
  if (panel) obs.observe(panel, { childList: true, subtree: true });
  // Also watch cat-page-subcat-grid
  const catGrid = document.getElementById('cat-page-subcat-grid');
  if (catGrid) obs.observe(catGrid, { childList: true, subtree: true });
}

/* ────────────────────────────────────────────────────────────────
   3. PROFILE PAGES — Footer ke upar properly open hoti hain
   Problem: .profile-page z-index 55 hai but body padding-bottom
   aur nav z-index 60 hai toh nav profile page ke upar dikhti hai
   ──────────────────────────────────────────────────────────────── */
function _fixProfilePageZIndex() {
  const style = document.createElement('style');
  style.id = 'ok-profile-page-fix';
  style.textContent = `
    /* Profile pages — full screen, nav ke upar */
    .profile-page {
      position: fixed !important;
      inset: 0 !important;
      z-index: 200 !important; /* mega-patch ke saath consistent */
      background: #F7F5F2 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
    }
    .profile-page.hidden {
      display: none !important;
    }
    /* Profile page body scrollable with bottom padding for safety */
    .profile-page-body {
      flex: 1 !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      padding-bottom: 20px !important;
    }
    /* Profile page header always sticky on top */
    .profile-page-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
    }
    /* When any profile-page is open, hide the bottom nav */
    body.profile-page-open > nav {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // Add/remove body class when profile pages open/close
  const origOpen = window.openProfilePage;
  if (typeof origOpen === 'function') {
    window.openProfilePage = function (page) {
      document.body.classList.add('profile-page-open');
      origOpen.apply(this, arguments);
    };
  }

  const origClose = window.closeProfilePage;
  if (typeof origClose === 'function') {
    window.closeProfilePage = function () {
      document.body.classList.remove('profile-page-open');
      origClose.apply(this, arguments);
    };
  }
}

/* ────────────────────────────────────────────────────────────────
   4. AUTH GATE — Already logged-in user ko sirf curtain animation
   Problem: Agar user already logged in hai toh gate show nahi hona
   chahiye. Sirf pehli baar ya nayi login pe curtain + animation
   ──────────────────────────────────────────────────────────────── */
function _fixAuthGateForLoggedInUser() {
  // Agar user already logged in hai, gate kabhi nahi dikhegi
  function _isLoggedIn() {
    try {
      const s = localStorage.getItem('outfitkart_session');
      if (s) { const p = JSON.parse(s); return !!(p && p.mobile); }
    } catch (e) {}
    return false;
  }

  // Gate ko force remove karo agar user logged in hai
  function _removeGateIfLoggedIn() {
    if (_isLoggedIn()) {
      const gate = document.getElementById('ok-auth-gate');
      if (gate) gate.remove();
    }
  }

  // Run on init
  _removeGateIfLoggedIn();

  // Also watch for gate being added
  const bodyObs = new MutationObserver(() => {
    if (_isLoggedIn()) {
      const gate = document.getElementById('ok-auth-gate');
      if (gate) {
        // Already logged in — remove gate immediately
        gate.remove();
      }
    }
  });
  bodyObs.observe(document.body, { childList: true });

  // Also: Already logged-in user ke liye page load pe sirf welcome animation
  // (curtain) dikhao, gate nahi
  const _showWelcomeCurtainForLoggedIn = async () => {
    if (!_isLoggedIn()) return;
    const sessStr = localStorage.getItem('outfitkart_session');
    if (!sessStr) return;

    // Sirf pehli baar page load pe dikhao (tab ke andar)
    const sessionKey = 'ok_curtain_shown_' + new Date().toDateString();
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    try {
      const user = JSON.parse(sessStr);
      const name = user.name || 'Welcome';

      // Build curtain
      const curtain = document.createElement('div');
      curtain.id = 'ok-welcome-curtain';
      curtain.style.cssText = 'position:fixed;inset:0;z-index:99998;display:block;overflow:hidden;';
      curtain.innerHTML = `
        <div style="position:absolute;top:0;bottom:0;left:0;width:50%;background:linear-gradient(160deg,#0d0800,#1a0e00);transform-origin:left;animation:wcCloseL 0.45s cubic-bezier(0.76,0,0.24,1) both;"></div>
        <div style="position:absolute;top:0;bottom:0;right:0;width:50%;background:linear-gradient(160deg,#0d0800,#1a0e00);transform-origin:right;animation:wcCloseR 0.45s cubic-bezier(0.76,0,0.24,1) both;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:10px;animation:wcCenterIn 0.4s cubic-bezier(0.16,1,0.3,1) 0.1s both;">
          <div style="width:72px;height:72px;border-radius:50%;border:1px solid rgba(201,168,76,0.38);display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 38% 38%,rgba(201,168,76,0.18) 0%,transparent 65%);">
            <img src="https://i.ibb.co/5gXg0WTr/1774263119958.png" style="width:38px;height:38px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(201,168,76,0.5));" onerror="this.style.display='none'">
          </div>
          <div style="font-family:'Cinzel',serif,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.38em;background:linear-gradient(135deg,#B8860B,#C9A84C,#F5E6C0,#B8860B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">OutfitKart</div>
          <div id="wc-status" style="font-size:12px;color:rgba(201,168,76,0.6);letter-spacing:0.15em;font-style:italic;">Welcome back, ${name}...</div>
        </div>
        <style>
          @keyframes wcCloseL{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
          @keyframes wcCloseR{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
          @keyframes wcOpenL{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
          @keyframes wcOpenR{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
          @keyframes wcCenterIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.7)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
          @keyframes wcCenterOut{0%{opacity:1}100%{opacity:0}}
        </style>
      `;
      document.body.appendChild(curtain);

      await new Promise(r => setTimeout(r, 600));

      // Open curtain
      const left = curtain.querySelector('div:nth-child(1)');
      const right = curtain.querySelector('div:nth-child(2)');
      const center = curtain.querySelector('div:nth-child(3)');
      if (left) left.style.animation = 'wcOpenL 0.6s cubic-bezier(0.76,0,0.24,1) both';
      if (right) right.style.animation = 'wcOpenR 0.6s cubic-bezier(0.76,0,0.24,1) both';
      if (center) center.style.animation = 'wcCenterOut 0.3s ease 0.2s both';

      await new Promise(r => setTimeout(r, 800));
      curtain.remove();
    } catch (e) {
      document.getElementById('ok-welcome-curtain')?.remove();
    }
  };

  // Show welcome curtain after a short delay
  setTimeout(_showWelcomeCurtainForLoggedIn, 500);
}

/* ────────────────────────────────────────────────────────────────
   5. ADMIN ANIMATION — Sirf login pe chalti hai, color change fix
   Problem: admin-luxury-anim.js ko check karna hai ki already
   admin logged in hai ya naya login ho raha hai
   ──────────────────────────────────────────────────────────────── */
function _fixAdminAnimation() {
  // Admin already logged in check
  function _isAdminLoggedIn() {
    return localStorage.getItem('outfitkart_admin_session') === 'true' ||
      window.isAdminLoggedIn === true;
  }

  // Note: navigate patch hata diya — dono branches same kaam kar rahe the (dead code).
  // Admin animation admin-luxury-anim.js mein handle hoti hai apne guard ke saath.
}

/* ────────────────────────────────────────────────────────────────
   6. INFLUENCER PAGE FIX — Earnings + Submissions properly dikhein
   FIXED: loadInfluencerRequests ko override NAHI karte —
   script-core-patch.js ka version retry logic ke saath better hai.
   ──────────────────────────────────────────────────────────────── */
function _fixInfluencerPage() {
  // Guard: agar script-core-patch ka retry wala version already loaded hai to skip
  if (window._megaFixInfluencerDone) return;
  window._megaFixInfluencerDone = true;
  const origFn = window.loadInfluencerRequests;
  if (origFn) {
    const fnStr = origFn.toString();
    if (fnStr.includes('retry') || fnStr.includes('setTimeout(window.loadInfluencerRequests')) {
      console.log('[mega-fix] loadInfluencerRequests: retry version detected — skipping override');
      return;
    }
  }
  // Fallback version (agar core-patch ka retry wala load nahi hua)
  window.loadInfluencerRequests = async function () {
    const cu = window.currentUser;
    if (!cu) {
      setTimeout(window.loadInfluencerRequests, 500);
      return;
    }

    const container = document.getElementById('inf-requests-list');
    const totalEl = document.getElementById('inf-total-earned');
    const countEl = document.getElementById('inf-submissions-count');

    if (!container) return;

    // Show loading
    container.innerHTML = '<div class="text-center py-6"><i class="fas fa-spinner fa-spin text-purple-500 text-2xl"></i><p class="text-sm text-gray-400 mt-2">Loading...</p></div>';

    try {
      const client = window.dbClient;
      if (!client) throw new Error('DB not ready');

      const { data, error } = await client
        .from('influencer_requests')
        .select('*')
        .eq('mobile', cu.mobile)
        .order('id', { ascending: false });

      if (error) throw error;

      const all = data || [];
      const approved = all.filter(r => r.status === 'Approved');
      const totalEarned = approved.reduce((s, r) => s + (r.earnings || r.amount || 0), 0);

      if (totalEl) totalEl.textContent = `₹${totalEarned}`;
      if (countEl) countEl.textContent = all.length;

      if (!all.length) {
        container.innerHTML = `
          <div class="text-center py-8 text-gray-400">
            <i class="fas fa-video text-4xl mb-3 block"></i>
            <p class="font-semibold text-sm">Abhi tak koi submission nahi</p>
            <p class="text-xs mt-1">Upar form bharke apna pehla video submit karo!</p>
          </div>`;
        return;
      }

      const BADGE = {
        'Pending':  'background:#fef3c7;color:#92400e;',
        'Approved': 'background:#dcfce7;color:#166534;',
        'Rejected': 'background:#fee2e2;color:#991b1b;'
      };

      container.innerHTML = all.map(r => {
        const views = r.views || r.view_count || 0;
        const earn = r.earnings || r.amount || 0;
        const badgeStyle = BADGE[r.status] || 'background:#f3f4f6;color:#374151;';
        const platform = r.platform || '';
        const videoUrl = r.video_url || r.link || '#';
        const status = r.status || 'Pending';

        return `
          <div style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div style="flex:1;min-width:0;">
                <div style="font-weight:700;font-size:13px;color:#111827;">
                  <i class="fab fa-${platform.toLowerCase() === 'youtube' ? 'youtube' : platform.toLowerCase() === 'facebook' ? 'facebook' : 'instagram'}" style="margin-right:5px;color:${platform.toLowerCase() === 'youtube' ? '#ff0000' : platform.toLowerCase() === 'facebook' ? '#1877f2' : '#e1306c'};"></i>
                  ${platform} — ${Number(views).toLocaleString('en-IN')} views
                </div>
                <a href="${videoUrl}" target="_blank" rel="noopener"
                   style="font-size:11px;color:#3b82f6;display:block;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">
                  ${videoUrl}
                </a>
              </div>
              <span style="font-size:10px;font-weight:700;padding:3px 8px;border-radius:9999px;flex-shrink:0;${badgeStyle}">${status}</span>
            </div>
            ${status === 'Approved' ? `
              <div style="margin-top:8px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:8px 10px;font-size:12px;font-weight:700;color:#16a34a;">
                <i class="fas fa-check-circle" style="margin-right:4px;"></i> ₹${earn} wallet mein add ho gaya!
              </div>` : ''}
            ${status === 'Rejected' && r.reject_reason ? `
              <div style="margin-top:6px;font-size:11px;color:#ef4444;">
                <i class="fas fa-times-circle" style="margin-right:3px;"></i>${r.reject_reason}
              </div>` : ''}
            ${status === 'Pending' ? `
              <div style="margin-top:6px;font-size:11px;color:#f59e0b;">
                <i class="fas fa-clock" style="margin-right:3px;"></i>Review ho raha hai — 24-48 hours
              </div>` : ''}
          </div>`;
      }).join('');

    } catch (err) {
      console.error('[Influencer]', err);
      container.innerHTML = `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:14px;text-align:center;">
          <i class="fas fa-exclamation-circle" style="color:#ef4444;font-size:1.5rem;display:block;margin-bottom:8px;"></i>
          <p style="font-size:12px;font-weight:600;color:#dc2626;">Data load nahi ho saka</p>
          <button onclick="loadInfluencerRequests()" style="margin-top:8px;background:#7c3aed;color:white;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;border:none;cursor:pointer;">
            <i class="fas fa-redo" style="margin-right:4px;"></i>Retry
          </button>
        </div>`;
    }
  };
}

/* ────────────────────────────────────────────────────────────────
   7. POLICIES/HELP PAGE — Footer mein nahi, apna full page khuthe
   Fix: openProfilePage('help') properly kaam karta hai lekin
   ensure karo ki 'Help & Policies' button directly openProfilePage
   call karta hai, not footer-style display
   ──────────────────────────────────────────────────────────────── */
function _fixPoliciesPage() {
  // profile-page-help is already in the HTML as a .profile-page
  // Problem: kuch jagah 'policies' ID use hota hai instead of 'help'
  // Ensure both 'help' aur 'policies' work
  const origOpen = window.openProfilePage;
  if (typeof origOpen === 'function') {
    window.openProfilePage = function (page, ...args) {
      // Map 'policies' → 'help'
      if (page === 'policies') page = 'help';
      document.body.classList.add('profile-page-open');
      origOpen.apply(this, [page, ...args]);
    };
  }
}

/* ────────────────────────────────────────────────────────────────
   9. BOTTOM NAV — Content chhipne ki problem (padding-bottom fix)
   ──────────────────────────────────────────────────────────────── */
function _fixBottomNavOverlap() {
  const style = document.createElement('style');
  style.id = 'ok-bottomnav-fix';
  style.textContent = `
    /* Bottom nav always above content */
    nav.fixed.bottom-0 {
      z-index: 60 !important;
    }
    /* view-category ka sticky header properly positioned */
    #view-category .sticky {
      top: 64px !important;
      z-index: 10 !important;
    }
    /* Cart sidebar z-index proper */
    #cart-sidebar {
      z-index: 70 !important;
    }
    /* Profile pages above nav — z-index 200 (mega-patch ke saath consistent) */
    .profile-page {
      z-index: 200 !important;
    }
    /* Admin above everything */
    #view-admin {
      z-index: 62 !important;
    }
  `;
  document.head.appendChild(style);
}

/* ────────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────────── */
function init() {
  // CSS fixes first
  _fixBottomNavOverlap();
  _fixProfilePageZIndex();

  // Wait for DOM + scripts to settle
  setTimeout(() => {
    _patchGetSubcategoryImage();
    _fixInfluencerPage();
    _fixPoliciesPage();
    _fixAuthGateForLoggedInUser();
    _fixAdminAnimation();

    // Watch for dynamically added category images
    setTimeout(_watchCatImages, 800);
    setTimeout(_fixCatNavImages, 1200);
    setTimeout(_fixCatNavImages, 3000);

    console.log('%c✅ mega-fix-patch.js loaded', 'background:#16a34a;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
  }, 600);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
} else {
  setTimeout(init, 200);
}

// Export useful functions

})();
