'use strict';
/* ================================================================
   outfitkart-super-patch.js — OutfitKart SUPER FIX PATCH v1.0
   ================================================================
   FIXES:
   1. _pdpSmartBack — global window function expose
   2. ok-promo-banner-strip REMOVE — purana carousel banner hi rahega
      (final-fix-patch ka _replaceBanners wala banner use hoga)
   3. Double categories page FIX — view-category hide, sirf
      view-categories (bottom nav wala) rahega
   4. openCategoryPage → ab view-categories kholta hai (not view-category)
   5. Categories page UI — improved design, search bar, featured badges
   6. Bug fixes — back button, nav state, scroll issues
   ================================================================ */

(function _okSuperPatch() {

/* ================================================================
   PART 1 — CSS IMPROVEMENTS
================================================================ */
(function(){
  if (document.getElementById('ok-sp-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-sp-css';
  s.textContent = `
    /* ── HIDE old view-category page completely ── */
    #view-category { display: none !important; }

    /* ── HIDE promo banner strip (replaced by carousel) ── */
    #ok-promo-banner-strip { display: none !important; }

    /* ── CATEGORIES PAGE IMPROVEMENTS ── */
    #view-categories {
      position: fixed; inset: 0; z-index: 52;
      background: #f8f9fa;
      display: flex; flex-direction: column; overflow: hidden;
    }
    #view-categories.hidden { display: none !important; }

    /* Header */
    #ok-cph {
      background: linear-gradient(135deg, #1a0030 0%, #2d0050 50%, #1a0030 100%) !important;
      height: 58px;
      display: flex; align-items: center;
      padding: 0 14px; gap: 10px;
      border-bottom: 1px solid rgba(225,29,72,0.4);
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      flex-shrink: 0;
    }
    #ok-cph h2 {
      font-size: 1.05rem; font-weight: 900; margin: 0; flex: 1;
      background: linear-gradient(135deg, #f9a8d4, #e11d48, #f9a8d4);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.02em;
    }
    #ok-back-btn {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: white; font-size: 15px; flex-shrink: 0;
    }
    #ok-back-btn:active { background: rgba(255,255,255,0.2); }

    /* Search bar */
    #ok-cat-search-wrap {
      padding: 8px 12px 6px;
      background: white;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
    }
    #ok-cat-search {
      width: 100%; padding: 8px 12px 8px 34px;
      border: 1.5px solid #e5e7eb; border-radius: 99px;
      font-size: 12px; font-weight: 600; color: #374151;
      background: #f9fafb; outline: none;
      box-sizing: border-box;
    }
    #ok-cat-search:focus { border-color: #e11d48; background: white; }
    #ok-cat-search-icon {
      position: absolute; left: 22px; top: 50%; transform: translateY(-50%);
      color: #9ca3af; font-size: 11px; pointer-events: none;
    }
    #ok-cat-search-wrap { position: relative; }

    /* Body */
    #ok-cpbody { display: flex; flex: 1; overflow: hidden; }

    /* Left sidebar */
    #ok-csb {
      width: 86px; flex-shrink: 0;
      background: #f3f4f6;
      overflow-y: auto; -webkit-overflow-scrolling: touch;
      scrollbar-width: none; border-right: 1px solid #e5e7eb;
    }
    #ok-csb::-webkit-scrollbar { display: none; }

    .ok-si {
      display: flex; flex-direction: column; align-items: center;
      padding: 11px 5px; cursor: pointer;
      border-left: 3px solid transparent;
      text-align: center; gap: 5px;
      transition: background 0.18s;
    }
    .ok-si.active {
      background: white;
      border-left-color: #e11d48;
    }
    .ok-si img {
      width: 46px; height: 46px; border-radius: 50%;
      object-fit: cover; border: 2px solid #e5e7eb;
      transition: border-color 0.18s;
    }
    .ok-si.active img { border-color: #e11d48; }
    .ok-si span {
      font-size: 9px; font-weight: 800; color: #374151;
      line-height: 1.2; word-break: break-word;
    }
    .ok-si.active span { color: #e11d48; }

    /* Also style ok-si-extra same */
    .ok-si-extra {
      display: flex; flex-direction: column; align-items: center;
      padding: 11px 5px; cursor: pointer;
      border-left: 3px solid transparent;
      text-align: center; gap: 5px;
      transition: background 0.18s;
    }
    .ok-si-extra.active { background: white; border-left-color: #e11d48; }
    .ok-si-extra .ok-si-icon {
      width: 46px; height: 46px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; background: #efe6ff;
      border: 2px solid #e5e7eb; transition: all 0.18s;
    }
    .ok-si-extra.active .ok-si-icon { border-color: #e11d48; background: #fff1f2; }
    .ok-si-extra span {
      font-size: 9px; font-weight: 800; color: #374151;
      line-height: 1.2; word-break: break-word;
    }
    .ok-si-extra.active span { color: #e11d48; }

    /* Right panel */
    #ok-crp {
      flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
      background: white; padding: 10px;
    }

    /* View All button */
    .ok-vabtn {
      display: flex; align-items: center; justify-content: space-between;
      background: linear-gradient(135deg, #fff1f2, #ffe4e6);
      border: 1.5px solid #fecdd3; border-radius: 14px;
      padding: 13px 16px; cursor: pointer; margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(225,29,72,0.1);
      transition: all 0.18s;
    }
    .ok-vabtn:active { background: #ffe4e6; transform: scale(0.98); }
    .ok-vabtn span { font-size: 12px; font-weight: 900; color: #e11d48; }

    /* Group label */
    .ok-glbl {
      font-size: 10px; font-weight: 900; color: #374151;
      background: linear-gradient(90deg, #f9fafb, transparent);
      border-radius: 8px; padding: 6px 10px; margin: 10px 0 6px;
      border-left: 3px solid #e11d48;
      letter-spacing: 0.04em;
    }

    /* Subcategory grid — 3 columns */
    .ok-scg {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 6px; margin-bottom: 10px;
    }

    /* Subcategory card */
    .ok-sc {
      display: flex; flex-direction: column; align-items: center;
      gap: 5px; cursor: pointer; padding: 8px 4px;
      border-radius: 12px; text-align: center;
      border: 1.5px solid #f3f4f6;
      background: #fafafa;
      transition: all 0.18s;
      position: relative;
    }
    .ok-sc:active { background: #fff1f2; border-color: #fca5a5; transform: scale(0.96); }
    .ok-sc img {
      width: 64px; height: 72px; object-fit: cover;
      border-radius: 8px; border: 1px solid #e5e7eb;
    }
    .ok-sc span {
      font-size: 9.5px; font-weight: 700; color: #1f2937;
      line-height: 1.3; width: 100%;
    }

    /* New badge on subcats */
    .ok-sc-new {
      position: absolute; top: 4px; right: 4px;
      background: #e11d48; color: white;
      font-size: 7px; font-weight: 900;
      padding: 2px 5px; border-radius: 99px;
      letter-spacing: 0.04em;
    }

    /* Ads strip */
    .ok-ads-s {
      display: flex; gap: 8px; overflow-x: auto;
      scrollbar-width: none; padding-bottom: 4px; margin-bottom: 12px;
    }
    .ok-ads-s::-webkit-scrollbar { display: none; }
    .ok-adc {
      flex-shrink: 0; width: 190px; border-radius: 10px;
      overflow: hidden; border: 1px solid #e5e7eb; cursor: pointer; position: relative;
    }
    .ok-adc img { width: 100%; height: 76px; object-fit: cover; display: block; }
    .ok-adbg {
      position: absolute; top: 5px; right: 5px;
      background: rgba(0,0,0,.5); color: white;
      font-size: 7px; font-weight: 800;
      padding: 2px 5px; border-radius: 99px;
    }

    /* Featured categories strip at top of right panel */
    #ok-featured-strip {
      display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none;
      padding-bottom: 10px; margin-bottom: 10px;
      border-bottom: 1px solid #f3f4f6;
    }
    #ok-featured-strip::-webkit-scrollbar { display: none; }
    .ok-feat-chip {
      flex-shrink: 0; padding: 6px 12px;
      border-radius: 99px; font-size: 10px; font-weight: 800;
      cursor: pointer; white-space: nowrap; border: 1.5px solid;
      transition: all 0.18s;
    }
    .ok-feat-chip:active { transform: scale(0.95); }

    /* No results */
    #ok-cat-no-results {
      text-align: center; padding: 32px 16px; color: #9ca3af;
      font-size: 13px; font-weight: 600;
    }
  `;
  document.head.appendChild(s);
})();

/* ================================================================
   PART 2 — EXPOSE _pdpSmartBack AS GLOBAL FUNCTION
   (Wraps existing _pdpGoBack with smart context)
================================================================ */
window._pdpSmartBack = function() {
  // If _pdpGoBack exists (from final-fix-patch), use it
  if (typeof window._pdpGoBack === 'function') {
    window._pdpGoBack();
    return;
  }
  // Fallback: use _pdpReturnState manually
  const st = window._pdpReturnState;
  if (!st || st.view === 'home' || !st.view) {
    if (typeof window.navigate === 'function') window.navigate('home');
    return;
  }
  if (st.view === 'categories') {
    window._openCategories && window._openCategories();
    return;
  }
  if (st.view === 'electronics') {
    window._openElectronics && window._openElectronics();
    return;
  }
  if (st.view === 'shop' || st.view === 'category') {
    if (st.cat) {
      window.currentCategoryFilter = st.cat;
      window.currentSubFilter = st.sub || null;
      document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
      window.currentView = 'shop';
      const shopView = document.getElementById('view-shop');
      if (shopView) shopView.classList.remove('hidden');
      if (typeof window.renderShopProducts === 'function') window.renderShopProducts();
      if (typeof window.renderShopSubcategories === 'function') window.renderShopSubcategories();
      if (typeof window.updateBottomNav === 'function') window.updateBottomNav();
      window.scrollTo(0, 0);
    } else {
      window.navigate('shop');
    }
    return;
  }
  if (typeof window.navigate === 'function') window.navigate(st.view || 'home');
};

/* ================================================================
   PART 3 — REDIRECT openCategoryPage TO USE view-categories
   (old view-category completely replace)
================================================================ */
function _patchOpenCategoryPage() {
  if (window._ocpPatched) return;
  if (typeof window.openCategoryPage !== 'function') return;
  window._ocpPatched = true;

  const _origOCP = window.openCategoryPage;

  window.openCategoryPage = function(categoryName) {
    // If categories panel available, open it and select that category
    const useCatPanel = document.getElementById('view-categories') || true;

    if (useCatPanel && typeof window._openCategories === 'function') {
      window._openCategories();
      // Find and select the matching category tab
      setTimeout(() => {
        const items = document.querySelectorAll('#ok-csb .ok-si[data-ci]');
        let found = false;
        items.forEach(item => {
          const sp = (item.querySelector('span')?.textContent || '').replace(/[^a-zA-Z]/g,'').toLowerCase().trim();
          const cl = categoryName.replace(/[^a-zA-Z]/g,'').toLowerCase().trim();
          if (sp === cl || sp.includes(cl) || cl.includes(sp)) {
            const ci = parseInt(item.getAttribute('data-ci'));
            if (!isNaN(ci) && typeof window._okCatSel === 'function') {
              window._okCatSel(ci);
              found = true;
            }
          }
        });
        // Also check extra sidebar items (Bags, Jewellery, Electronics)
        if (!found) {
          const extraItems = document.querySelectorAll('#ok-csb .ok-si-extra');
          extraItems.forEach(item => {
            const sp = (item.querySelector('span')?.textContent || '').replace(/[^a-zA-Z]/g,'').toLowerCase().trim();
            const cl = categoryName.replace(/[^a-zA-Z]/g,'').toLowerCase().trim();
            if (sp === cl || sp.includes(cl) || cl.includes(sp)) {
              item.click();
            }
          });
        }
      }, 150);
      return;
    }

    // Fallback to original
    _origOCP(categoryName);
  };
}

/* ================================================================
   PART 4 — IMPROVED CATEGORIES PAGE BUILD
   (Replaces categories-nav-patch rendering with better UI)
================================================================ */
function _patchCatPageUI() {
  // Patch _buildCatPage to add search bar
  const _addSearchBar = () => {
    const catPage = document.getElementById('view-categories');
    if (!catPage || catPage.getAttribute('data-searchpatched')) return;
    catPage.setAttribute('data-searchpatched', '1');

    const header = document.getElementById('ok-cph');
    if (!header) return;

    // Add search bar after header
    const existing = document.getElementById('ok-cat-search-wrap');
    if (existing) return;

    const searchWrap = document.createElement('div');
    searchWrap.id = 'ok-cat-search-wrap';
    searchWrap.innerHTML = `
      <i class="fas fa-search ok-cat-search-icon" id="ok-cat-search-icon"></i>
      <input type="text" id="ok-cat-search" placeholder="Search categories..." autocomplete="off"
        oninput="_okCatSearch(this.value)" />
    `;

    // Insert after header, before body
    const body = document.getElementById('ok-cpbody');
    if (body) catPage.insertBefore(searchWrap, body);
  };

  // Search functionality
  window._okCatSearch = function(query) {
    const q = query.toLowerCase().trim();
    const right = document.getElementById('ok-crp');
    if (!right) return;

    if (!q) {
      // Restore normal view for current active category
      const activeTab = document.querySelector('#ok-csb .ok-si.active, #ok-csb .ok-si-extra.active');
      if (activeTab) activeTab.click();
      return;
    }

    // Search across all CATS
    const CATS_DATA = window._okCatsData || [];
    let results = [];
    CATS_DATA.forEach(cat => {
      (cat.groups || []).forEach(grp => {
        (grp.subs || []).forEach(sub => {
          if (sub.n.toLowerCase().includes(q)) {
            results.push({ cat: cat.key, sub: sub.n, img: sub.img, catLabel: cat.label });
          }
        });
      });
    });

    if (!results.length) {
      right.innerHTML = `<div id="ok-cat-no-results">
        <i class="fas fa-search" style="font-size:2rem;margin-bottom:8px;opacity:0.3;display:block;"></i>
        No results for "<b>${query}</b>"
      </div>`;
      return;
    }

    right.innerHTML = `
      <div style="font-size:11px;font-weight:800;color:#6b7280;margin-bottom:8px;">${results.length} results for "${query}"</div>
      <div class="ok-scg">
        ${results.map(r => `
          <div class="ok-sc" onclick="openSubcatProducts('${r.cat}','${r.sub.replace(/'/g,"\\'")}');window._closeCategories()">
            <img src="${r.img}" alt="${r.sub}" loading="lazy"
              onerror="this.src='https://placehold.co/64x72/f3f4f6/9ca3af?text=${encodeURIComponent(r.sub[0])}'">
            <span>${r.sub}</span>
            <div style="font-size:8px;color:#9ca3af;font-weight:700;">${r.catLabel}</div>
          </div>`).join('')}
      </div>`;
  };

  // Patch _renderRight to add featured strip and better visuals
  const _patchRenderRight = () => {
    if (window._renderRightPatched) return;
    window._renderRightPatched = true;

    const origRenderRight = window._okRenderRight || null;

    // Override _renderRight if accessible — add NEW badge to trending subcats
    const NEW_SUBCATS = new Set(['Oversized Tees','Oversized Shirts','Cargo Pants','Dresses','Baggy Jeans','Joggers']);

    // Patch ok-sc cards after render to add new badges
    const _addNewBadges = () => {
      document.querySelectorAll('.ok-sc').forEach(card => {
        const span = card.querySelector('span');
        if (!span) return;
        if (NEW_SUBCATS.has(span.textContent.trim()) && !card.querySelector('.ok-sc-new')) {
          const badge = document.createElement('div');
          badge.className = 'ok-sc-new';
          badge.textContent = 'NEW';
          card.appendChild(badge);
        }
      });
    };

    // MutationObserver to patch cards whenever right panel updates
    const right = document.getElementById('ok-crp');
    if (right) {
      new MutationObserver(_addNewBadges).observe(right, { childList: true, subtree: false });
    }
  };

  // Run after categories page builds
  const _tryPatch = () => {
    _addSearchBar();
    _patchRenderRight();
  };

  // Watch for view-categories to appear
  if (document.getElementById('view-categories')) {
    _tryPatch();
  } else {
    new MutationObserver((_, obs) => {
      if (document.getElementById('view-categories')) {
        obs.disconnect();
        _tryPatch();
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
}

/* ================================================================
   PART 5 — STORE CATS DATA FOR SEARCH (expose from categories-nav-patch)
================================================================ */
function _exposeCatsData() {
  // Read CATS from categories-nav-patch via DOM after page builds
  const _tryExpose = () => {
    if (window._okCatsData && window._okCatsData.length > 0) return;
    const catPage = document.getElementById('view-categories');
    if (!catPage) return;

    // Try to get CATS from existing sidebar items
    const sidebarItems = document.querySelectorAll('#ok-csb .ok-si[data-ci]');
    if (!sidebarItems.length) return;

    // Rebuild cats data from DOM + window if available
    // We expose a minimal structure for search
    if (!window._okCatsData) {
      window._okCatsData = _buildCatsFromScript();
    }
  };

  // Full CATS definition for search (mirrors categories-nav-patch CATS)
  function _buildCatsFromScript() {
    return [
      { key:'Men', label:'Men', groups:[
        { label:'Topwear', subs:[
          {n:'T-Shirts',img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80'},
          {n:'Casual Shirts',img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80'},
          {n:'Formal Shirts',img:'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80'},
          {n:'Oversized Tees',img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80'},
          {n:'Oversized Shirts',img:'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80'},
          {n:'Hoodies',img:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=220&fit=crop&q=80'},
          {n:'Denim Jacket',img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Bottomwear', subs:[
          {n:'Baggy Jeans',img:'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=220&fit=crop&q=80'},
          {n:'Straight Fit Jeans',img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
          {n:'Slim Fit Jeans',img:'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=220&fit=crop&q=80'},
          {n:'Cotton Trousers',img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=220&fit=crop&q=80'},
          {n:'Joggers',img:'https://images.unsplash.com/photo-1556906781-9a412961a28b?w=200&h=220&fit=crop&q=80'},
          {n:'Cargo Pants',img:'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=200&h=220&fit=crop&q=80'},
          {n:'Formal Pant',img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
          {n:'Trousers',img:'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Footwear', subs:[
          {n:'Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
          {n:'Formal Shoes',img:'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80'},
          {n:'Sports Shoes',img:'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80'},
          {n:'Sandals',img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
          {n:'Slippers',img:'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Women', label:'Women', groups:[
        { label:'Ethnic', subs:[
          {n:'Sarees',img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
          {n:'Kurtis',img:'https://images.unsplash.com/photo-1582718560869-01152e38cfd4?w=200&h=220&fit=crop&q=80'},
          {n:'Lehengas',img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Western', subs:[
          {n:'Tops',img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
          {n:'Dresses',img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
          {n:'Skirts',img:'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80'},
          {n:'Tops & Tunics',img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
          {n:'Palazzo',img:'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Bottomwear', subs:[
          {n:'Straight Fit Jeans',img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
          {n:'Baggy Jeans',img:'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=200&h=220&fit=crop&q=80'},
          {n:'Skinny Fit Jeans',img:'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=200&h=220&fit=crop&q=80'},
          {n:'Cargo Jeans',img:'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=200&h=220&fit=crop&q=80'},
          {n:'Trousers',img:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Footwear', subs:[
          {n:'Heels',img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80'},
          {n:'Flats',img:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=220&fit=crop&q=80'},
          {n:'Sandals',img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
          {n:'Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
          {n:'Wedges',img:'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Perfumes', label:'Perfumes', groups:[
        { label:'For Her', subs:[
          {n:"Women's Perfume",img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=220&fit=crop&q=80'},
          {n:'Body Mist',img:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=220&fit=crop&q=80'},
          {n:'Gift Set',img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'For Him', subs:[
          {n:"Men's Perfume",img:'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=220&fit=crop&q=80'},
          {n:'Attar / Ittar',img:'https://images.unsplash.com/photo-1594913862946-f6da68f9bdde?w=200&h=220&fit=crop&q=80'},
          {n:'Deodorant Spray',img:'https://images.unsplash.com/photo-1582903942568-e67dc6bab25d?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Unisex', subs:[
          {n:'Unisex Perfume',img:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80'},
          {n:'Luxury Perfume',img:'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80'},
          {n:'Budget Perfume',img:'https://images.unsplash.com/photo-1547887538-047f28cce9b4?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Combos', label:'Combos', groups:[
        { label:'Men Combos', subs:[
          {n:'Casual Combo',img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80'},
          {n:'Party Wear Combo',img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=220&fit=crop&q=80'},
          {n:'Gym Combo',img:'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=220&fit=crop&q=80'},
          {n:'Streetwear Combo',img:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=220&fit=crop&q=80'},
          {n:'Office Combo',img:'https://images.unsplash.com/photo-1600091166971-7f9faad6c498?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:'Women Combos', subs:[
          {n:'Casual Outfit Combo',img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80'},
          {n:'Party Combo',img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
          {n:'Ethnic Combo',img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
          {n:'Western Combo',img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
          {n:'College Wear Combo',img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Accessories', label:'Accessories', groups:[
        { label:"Men's", subs:[
          {n:'Sunglasses',img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80'},
          {n:'Watches',img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80'},
          {n:'Wallets',img:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=220&fit=crop&q=80'},
          {n:'Belts',img:'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=220&fit=crop&q=80'},
          {n:'Caps',img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=220&fit=crop&q=80'},
          {n:'Chains',img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=220&fit=crop&q=80'},
          {n:'Bracelets',img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
          {n:'Socks',img:'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&h=220&fit=crop&q=80'},
        ]},
        { label:"Women's", subs:[
          {n:'Handbags',img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
          {n:'Clutches',img:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&h=220&fit=crop&q=80'},
          {n:'Earrings',img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
          {n:'Necklace Sets',img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
          {n:'Bangles',img:'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=200&h=220&fit=crop&q=80'},
          {n:'Hair Accessories',img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=220&fit=crop&q=80'},
          {n:'Scrunchies',img:'https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Bags', label:'Bags', groups:[
        { label:'Bags & Luggage', subs:[
          {n:'Backpacks',img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
          {n:'Tote Bags',img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
          {n:'Sling Bags',img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80'},
          {n:'Travel Bags',img:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=220&fit=crop&q=80'},
          {n:'Gym Bags',img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
      { key:'Jewellery', label:'Jewellery', groups:[
        { label:'Jewellery', subs:[
          {n:'Earrings',img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
          {n:'Necklaces',img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
          {n:'Rings',img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=220&fit=crop&q=80'},
          {n:'Bracelets',img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
          {n:'Anklets',img:'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=200&h=220&fit=crop&q=80'},
        ]},
      ]},
    ];
  }

  setTimeout(_tryExpose, 800);
  setTimeout(_tryExpose, 2000);
}

/* ================================================================
   PART 6 — FIX _closeCategories TO ALSO RESTORE HOME NAV STATE
================================================================ */
function _patchCloseCategories() {
  if (window._closeCatPatched) return;
  window._closeCatPatched = true;

  const _orig = window._closeCategories;
  window._closeCategories = function() {
    // Clear search input
    const searchInput = document.getElementById('ok-cat-search');
    if (searchInput) searchInput.value = '';

    if (typeof _orig === 'function') _orig();

    // Fix nav highlight
    const catBtn = document.getElementById('ok-nav-categories');
    if (catBtn) catBtn.style.color = '';
  };
}

/* ================================================================
   PART 7 — FIX BACK BUTTON IN view-categories TO GO BACK PROPERLY
================================================================ */
function _patchCatBackBtn() {
  const _tryFix = () => {
    const backBtn = document.getElementById('ok-back-btn');
    if (!backBtn || backBtn.getAttribute('data-smartback')) return;
    backBtn.setAttribute('data-smartback', '1');
    backBtn.onclick = function() {
      window._closeCategories && window._closeCategories();
      // Go back to previous view, not always home
      const prev = window._prevViewBeforeCat || 'home';
      if (prev !== 'categories' && typeof window.navigate === 'function') {
        window.navigate(prev);
      } else {
        window.navigate('home');
      }
    };
  };
  setTimeout(_tryFix, 600);
  setTimeout(_tryFix, 1500);
  new MutationObserver(_tryFix).observe(document.body, { childList: true, subtree: true });
}

/* ================================================================
   PART 8 — TRACK PREVIOUS VIEW FOR SMART BACK
================================================================ */
function _trackViewHistory() {
  if (window._viewHistoryTracked) return;
  if (typeof window.navigate !== 'function') return;
  window._viewHistoryTracked = true;

  const orig = window.navigate;
  window.navigate = function(view, ...args) {
    if (view === 'categories') {
      window._prevViewBeforeCat = window.currentView || 'home';
    }
    if (view === 'product') {
      window._pdpReturnState = {
        view: window.currentView || 'home',
        cat: window.currentCategoryFilter || null,
        sub: window.currentSubFilter || null,
      };
    }
    return orig(view, ...args);
  };
}

/* ================================================================
   BOOT
================================================================ */
function _init() {
  _patchCatPageUI();
  _exposeCatsData();
  _patchCloseCategories();
  _patchCatBackBtn();

  // Wait for navigate to be ready
  const wNav = setInterval(() => {
    if (typeof window.navigate === 'function') {
      clearInterval(wNav);
      _trackViewHistory();
      _patchOpenCategoryPage();
    }
  }, 200);

  console.log('%c🚀 SuperPatch v1.0 ✅', 'background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 600));
} else {
  setTimeout(_init, 600);
}

})();
