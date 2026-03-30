'use strict';
/* ================================================================
   OutfitKart — CATEGORIES NAV PATCH v1.0
   ================================================================
   Kya karta hai:
   1. Bottom nav mein "Shop" → "Categories" icon + label change
   2. Flipkart-style Categories page inject karta hai:
      — Left: category sidebar (Men, Women, Accessories, etc.)
      — Right: us category ke subcategories grid
   3. Navigate system ke saath fully compatible hai
   4. Existing kuch bhi nahi tootega

   INDEX.HTML MEIN ADD KARO (giveaway-patch.js ke BAAD):
     <script src="categories-nav-patch.js"></script>
   ================================================================ */

(function _outfitkartCategoriesNav() {

  /* ────────────────────────────────────────────────────────────────
     1. CSS
  ──────────────────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.id = 'ok-catnav-css';
  style.textContent = `

    /* ── Categories View ── */
    #view-categories {
      position: fixed;
      inset: 0;
      z-index: 35;
      background: #f7f7f7;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #view-categories.hidden { display: none !important; }

    /* ── Header ── */
    #ok-catpage-header {
      background: white;
      height: 56px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    #ok-catpage-header h2 {
      font-size: 1.1rem;
      font-weight: 900;
      color: #111827;
      margin: 0;
      letter-spacing: -0.02em;
    }

    /* ── Body: Left sidebar + Right content ── */
    #ok-catpage-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── Left Sidebar ── */
    #ok-cat-sidebar {
      width: 110px;
      flex-shrink: 0;
      background: #f0f0f0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    #ok-cat-sidebar::-webkit-scrollbar { display: none; }

    .ok-cat-sidebar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 14px 8px;
      cursor: pointer;
      border-left: 3px solid transparent;
      text-align: center;
      transition: background 0.15s, border-color 0.15s;
      gap: 6px;
      position: relative;
    }
    .ok-cat-sidebar-item:active { background: #e5e5e5; }
    .ok-cat-sidebar-item.active {
      background: white;
      border-left-color: #e11d48;
    }
    .ok-cat-sidebar-img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e5e7eb;
      transition: border-color 0.15s;
    }
    .ok-cat-sidebar-item.active .ok-cat-sidebar-img {
      border-color: #e11d48;
    }
    .ok-cat-sidebar-label {
      font-size: 10px;
      font-weight: 700;
      color: #4b5563;
      line-height: 1.2;
      word-break: break-word;
    }
    .ok-cat-sidebar-item.active .ok-cat-sidebar-label {
      color: #e11d48;
    }

    /* ── Right Content Panel ── */
    #ok-cat-right {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: white;
      padding: 12px;
    }

    /* ── Section title in right panel ── */
    .ok-catright-section-title {
      font-size: 10px;
      font-weight: 800;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 4px 0 8px;
      margin-top: 4px;
    }

    /* ── Subcategory grid ── */
    .ok-subcat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 16px;
    }

    /* ── Subcategory card ── */
    .ok-subcat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 8px 4px;
      border-radius: 10px;
      transition: background 0.15s;
      text-align: center;
    }
    .ok-subcat-card:active { background: #fff1f2; }
    .ok-subcat-img {
      width: 68px;
      height: 76px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: #f3f4f6;
    }
    .ok-subcat-label {
      font-size: 10px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1.2;
    }

    /* ── "View All" card ── */
    .ok-subcat-viewall {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff1f2;
      border: 1.5px solid #fecdd3;
      border-radius: 12px;
      padding: 12px 16px;
      cursor: pointer;
      margin-bottom: 12px;
      transition: background 0.15s;
    }
    .ok-subcat-viewall:active { background: #ffe4e6; }
    .ok-subcat-viewall span {
      font-size: 13px;
      font-weight: 800;
      color: #e11d48;
    }
    .ok-subcat-viewall i { color: #e11d48; font-size: 14px; }

    /* ── Bottom nav active state for categories ── */
    #ok-nav-categories.ok-nav-active {
      color: #e11d48 !important;
    }
    #ok-nav-categories.ok-nav-active i {
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);


  /* ────────────────────────────────────────────────────────────────
     2. CATEGORY DATA
     — Yahan OutfitKart ki categories aur unki subcategories hain
     — Script automatically products se bhi detect karta hai
  ──────────────────────────────────────────────────────────────── */
  const CAT_CONFIG = [
    {
      name: 'Men',
      img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'T-Shirts',   img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=150&h=180&fit=crop&q=80' },
        { name: 'Shirts',     img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=180&fit=crop&q=80' },
        { name: 'Jeans',      img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&h=180&fit=crop&q=80' },
        { name: 'Trousers',   img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=150&h=180&fit=crop&q=80' },
        { name: 'Jackets',    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=150&h=180&fit=crop&q=80' },
        { name: 'Kurtas',     img: 'https://images.unsplash.com/photo-1604969095725-00c7b4d45fdf?w=150&h=180&fit=crop&q=80' },
        { name: 'Shorts',     img: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=150&h=180&fit=crop&q=80' },
        { name: 'Sneakers',   img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=180&fit=crop&q=80' },
        { name: 'Hoodies',    img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: 'Women',
      img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Kurtis',     img: 'https://images.unsplash.com/photo-1610189352649-ff58ea8ffe71?w=150&h=180&fit=crop&q=80' },
        { name: 'Sarees',     img: 'https://images.unsplash.com/photo-1641944503168-2dec6ada8e5e?w=150&h=180&fit=crop&q=80' },
        { name: 'Dresses',    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=150&h=180&fit=crop&q=80' },
        { name: 'Tops',       img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=150&h=180&fit=crop&q=80' },
        { name: 'Lehengas',   img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=150&h=180&fit=crop&q=80' },
        { name: 'Jeans',      img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&h=180&fit=crop&q=80' },
        { name: 'Suits',      img: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=150&h=180&fit=crop&q=80' },
        { name: 'Jackets',    img: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=150&h=180&fit=crop&q=80' },
        { name: 'Heels',      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: 'Accessories',
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Watches',    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=180&fit=crop&q=80' },
        { name: 'Belts',      img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=150&h=180&fit=crop&q=80' },
        { name: 'Wallets',    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&h=180&fit=crop&q=80' },
        { name: 'Bags',       img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=150&h=180&fit=crop&q=80' },
        { name: 'Sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=180&fit=crop&q=80' },
        { name: 'Jewellery',  img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: 'Footwear',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Sneakers',   img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=180&fit=crop&q=80' },
        { name: 'Sandals',    img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=150&h=180&fit=crop&q=80' },
        { name: 'Boots',      img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=150&h=180&fit=crop&q=80' },
        { name: 'Loafers',    img: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=150&h=180&fit=crop&q=80' },
        { name: 'Heels',      img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=150&h=180&fit=crop&q=80' },
        { name: 'Slippers',   img: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: 'Combos 🎁',
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Men Combos',    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=150&h=180&fit=crop&q=80' },
        { name: 'Women Combos',  img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=180&fit=crop&q=80' },
        { name: 'Couple Sets',   img: 'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=150&h=180&fit=crop&q=80' },
        { name: 'Gift Sets',     img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: 'Perfumes ✨',
      img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Men Perfumes',    img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=150&h=180&fit=crop&q=80' },
        { name: 'Women Perfumes',  img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop&q=80' },
        { name: 'Attars',          img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=150&h=180&fit=crop&q=80' },
        { name: 'Gift Sets',       img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=150&h=180&fit=crop&q=80' },
      ]
    },
    {
      name: '⭐ Gold',
      img: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=200&h=200&fit=crop&q=80',
      subcats: [
        { name: 'Men Gold',    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=150&h=180&fit=crop&q=80' },
        { name: 'Women Gold',  img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=180&fit=crop&q=80' },
        { name: 'Luxury Sets', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&h=180&fit=crop&q=80' },
      ]
    },
  ];

  let _activeCatIndex = 0;


  /* ────────────────────────────────────────────────────────────────
     3. BUILD THE CATEGORIES PAGE
  ──────────────────────────────────────────────────────────────── */
  function _buildCatPage() {
    if (document.getElementById('view-categories')) return;

    const page = document.createElement('div');
    page.id = 'view-categories';
    page.className = 'hidden';
    page.innerHTML = `
      <!-- Header -->
      <div id="ok-catpage-header">
        <h2>Categories</h2>
      </div>

      <!-- Body -->
      <div id="ok-catpage-body">
        <!-- Left Sidebar -->
        <div id="ok-cat-sidebar">
          ${CAT_CONFIG.map((cat, i) => `
            <div class="ok-cat-sidebar-item ${i === 0 ? 'active' : ''}"
                 onclick="_okSelectCategory(${i})"
                 data-cat-index="${i}">
              <img class="ok-cat-sidebar-img"
                   src="${cat.img}"
                   alt="${cat.name}"
                   onerror="this.src='https://placehold.co/52x52/f3f4f6/9ca3af?text=${encodeURIComponent(cat.name.charAt(0))}'">
              <span class="ok-cat-sidebar-label">${cat.name}</span>
            </div>
          `).join('')}
        </div>

        <!-- Right Panel -->
        <div id="ok-cat-right">
          <!-- Filled dynamically -->
        </div>
      </div>
    `;

    // main content ke andar ya body ke andar add karo
    const main = document.getElementById('app-content') || document.querySelector('main') || document.body;
    main.appendChild(page);

    // Pehli category render karo
    _renderRightPanel(0);
  }


  /* ────────────────────────────────────────────────────────────────
     4. RENDER RIGHT PANEL FOR SELECTED CATEGORY
  ──────────────────────────────────────────────────────────────── */
  window._okSelectCategory = function(index) {
    _activeCatIndex = index;
    const cat = CAT_CONFIG[index];
    if (!cat) return;

    // Sidebar active state update karo
    document.querySelectorAll('.ok-cat-sidebar-item').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });

    // Scroll sidebar item into view
    const activeItem = document.querySelector(`.ok-cat-sidebar-item[data-cat-index="${index}"]`);
    if (activeItem) activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    _renderRightPanel(index);
  };

  function _renderRightPanel(index) {
    const right = document.getElementById('ok-cat-right');
    if (!right) return;
    const cat = CAT_CONFIG[index];
    if (!cat) return;

    // Gold category → navigate to gold view
    const isGold = cat.name.includes('Gold');

    // "View All" button
    const catNameClean = cat.name.replace(/[^a-zA-Z]/g, '').trim() || cat.name;
    const viewAllAction = isGold
      ? `navigate('gold')`
      : `openCategoryPage('${catNameClean}')`;

    const subcatHTML = cat.subcats.map(sub => {
      // Subcategory click action determine karo
      const subAction = isGold
        ? `navigate('gold')`
        : `openSubcatProducts('${catNameClean}', '${sub.name.replace(/'/g, "\\'")}')`;

      return `
        <div class="ok-subcat-card" onclick="${subAction}; _closeCategories();">
          <img class="ok-subcat-img"
               src="${sub.img}"
               alt="${sub.name}"
               loading="lazy"
               onerror="this.src='https://placehold.co/68x76/f3f4f6/9ca3af?text=${encodeURIComponent(sub.name.charAt(0))}'">
          <span class="ok-subcat-label">${sub.name}</span>
        </div>
      `;
    }).join('');

    right.innerHTML = `
      <div class="ok-subcat-viewall" onclick="${viewAllAction}; _closeCategories();">
        <span><i class="fas fa-th-large mr-2"></i>View All ${cat.name}</span>
        <i class="fas fa-chevron-right"></i>
      </div>

      <div class="ok-catright-section-title">Browse ${cat.name}</div>

      <div class="ok-subcat-grid">
        ${subcatHTML}
      </div>
    `;

    // Right panel ko top pe scroll karo
    right.scrollTop = 0;
  }


  /* ────────────────────────────────────────────────────────────────
     5. OPEN / CLOSE CATEGORIES VIEW
  ──────────────────────────────────────────────────────────────── */
  window._openCategories = function() {
    // Saari dusri views hide karo
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));

    const catView = document.getElementById('view-categories');
    if (catView) {
      catView.classList.remove('hidden');
    }

    // Bottom nav active state
    _updateCatNavActive(true);

    window.currentView = 'categories';
  };

  window._closeCategories = function() {
    const catView = document.getElementById('view-categories');
    if (catView) catView.classList.add('hidden');
  };


  /* ────────────────────────────────────────────────────────────────
     6. BOTTOM NAV — "Shop" → "Categories"
  ──────────────────────────────────────────────────────────────── */
  function _patchBottomNav() {
    const nav = document.querySelector('nav.fixed.bottom-0');
    if (!nav) { setTimeout(_patchBottomNav, 300); return; }

    // Shop nav item dhundo
    const navItems = nav.querySelectorAll('[onclick]');
    let shopItem = null;

    navItems.forEach(el => {
      const oc = el.getAttribute('onclick') || '';
      if (oc.includes("navigate('shop')") && !oc.includes('gold') && !oc.includes('cart') && !oc.includes('profile') && !oc.includes('home')) {
        shopItem = el;
      }
    });

    if (!shopItem) {
      // Fallback: text se dhundo
      navItems.forEach(el => {
        if (el.textContent && el.textContent.trim().toLowerCase().includes('shop')) {
          shopItem = el;
        }
      });
    }

    if (shopItem) {
      // ID add karo
      shopItem.id = 'ok-nav-categories';
      // Click handler change karo
      shopItem.setAttribute('onclick', '_openCategories()');
      // Icon change karo (fa-tshirt → fa-th-large)
      const icon = shopItem.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-th-large text-lg';
      }
      // Label change karo
      const spans = shopItem.querySelectorAll('span');
      spans.forEach(sp => {
        if (sp.textContent.trim().toLowerCase() === 'shop') {
          sp.textContent = 'Categories';
        }
      });
      console.log('[CatNavPatch] ✅ Bottom nav: Shop → Categories done');
    } else {
      console.warn('[CatNavPatch] ⚠️ Shop nav item nahi mila, manual inject kar raha hoon...');
      _injectCatNavItem(nav);
    }
  }

  function _injectCatNavItem(nav) {
    // Agar shop item nahi mila toh manually doosra item add karo
    // (yeh fallback hai)
    const existing = document.getElementById('ok-nav-categories');
    if (existing) return;
    const div = document.createElement('div');
    div.id = 'ok-nav-categories';
    div.className = 'flex flex-col items-center gap-1 cursor-pointer hover:text-rose-600 transition-colors';
    div.setAttribute('onclick', '_openCategories()');
    div.innerHTML = `<i class="fas fa-th-large text-lg"></i><span>Categories</span>`;

    // Home ke baad insert karo
    const homeBtn = Array.from(nav.querySelectorAll('[onclick]'))
      .find(el => (el.getAttribute('onclick') || '').includes("navigate('home')"));
    if (homeBtn && homeBtn.nextSibling) {
      nav.insertBefore(div, homeBtn.nextSibling);
    } else {
      nav.insertBefore(div, nav.firstChild.nextSibling);
    }
  }

  function _updateCatNavActive(active) {
    const btn = document.getElementById('ok-nav-categories');
    if (!btn) return;
    if (active) {
      btn.style.color = '#e11d48';
    } else {
      btn.style.color = '';
    }
  }


  /* ────────────────────────────────────────────────────────────────
     7. NAVIGATE PATCH — categories view ke liye
  ──────────────────────────────────────────────────────────────── */
  function _patchNavigateForCategories() {
    if (window._catNavPatchApplied) return;
    window._catNavPatchApplied = true;

    const origNav = window.navigate;
    if (!origNav) return;

    window.navigate = function(view, ...args) {
      // Categories view se kisi aur view pe jaate waqt cat view hide karo
      if (view !== 'categories') {
        _closeCategories();
        _updateCatNavActive(false);
      }
      return origNav(view, ...args);
    };

    console.log('[CatNavPatch] ✅ Navigate patch applied');
  }


  /* ────────────────────────────────────────────────────────────────
     8. DYNAMIC SUBCAT DETECTION FROM PRODUCTS
     (Agar products load ho jaayein toh real subcats use karo)
  ──────────────────────────────────────────────────────────────── */
  function _enrichSubcatsFromProducts() {
    const products = window.products || window.allProducts || window._allProducts || [];
    if (!products.length) { setTimeout(_enrichSubcatsFromProducts, 2000); return; }

    products.forEach(p => {
      const cat = p.category || p.cat || '';
      const subcat = p.subcategory || p.subcat || p.sub_category || '';
      if (!cat || !subcat) return;

      const catObj = CAT_CONFIG.find(c =>
        c.name.replace(/[^a-zA-Z]/g,'').toLowerCase() === cat.replace(/[^a-zA-Z]/g,'').toLowerCase()
        || c.name.toLowerCase().includes(cat.toLowerCase())
      );
      if (!catObj) return;

      const exists = catObj.subcats.find(s =>
        s.name.toLowerCase() === subcat.toLowerCase()
      );
      if (!exists) {
        const img = (p.imgs && p.imgs[0]) || p.img || p.image || '';
        catObj.subcats.unshift({ name: subcat, img });
      }
    });

    // Re-render current panel with updated subcats
    _renderRightPanel(_activeCatIndex);
    console.log('[CatNavPatch] ✅ Subcats enriched from products');
  }


  /* ────────────────────────────────────────────────────────────────
     9. INIT
  ──────────────────────────────────────────────────────────────── */
  function _init() {
    _buildCatPage();
    _patchBottomNav();

    // Navigate patch — wait for navigate to be defined
    const waitNav = setInterval(() => {
      if (typeof window.navigate === 'function') {
        clearInterval(waitNav);
        _patchNavigateForCategories();
      }
    }, 300);

    // Products se subcat enrich karo
    setTimeout(_enrichSubcatsFromProducts, 3000);

    console.log('%c🗂️ OutfitKart Categories Nav Patch v1.0 ✅', 'background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 400));
  } else {
    setTimeout(_init, 400);
  }

  // Global exports
  window._openCategories = window._openCategories;
  window._closeCategories = window._closeCategories;
  window._okSelectCategory = window._okSelectCategory;

})();
