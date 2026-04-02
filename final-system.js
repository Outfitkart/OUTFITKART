/* ================================================================
   OutfitKart — FINAL SYSTEM JS
   Merged from all patch files in correct load order:
   mega-patch → script-core-patch → giveaway-patch →
   categories-nav-patch → outfitkart-final-patch →
   mega-fix-patch → final-fix-patch → outfitkart-super-patch
   ================================================================ */

'use strict';
/* ================================================================
   OUTFITKART MEGA-PATCH — COMPLETE MERGED VERSION
   Includes: v5.1 + v6 + All Fixes
   
   FIXES INCLUDED:
   ✅ 1. Profile back button z-index (visible above header)
   ✅ 2. Influencer submissions showing correctly  
   ✅ 3. AI Search bar working with real product search
   ✅ 4. PDP product name/size properly sized
   ✅ 5. PDP image fullscreen lightbox + thumbnail strip
   ✅ 6. PWA install popup stays + header button works
   ✅ 7. Ads Section (Supabase connected)
   ✅ 8. User Level Badge
   ✅ 9. Auto-login after signup
   ✅ 10. Footer ivory background
   ✅ 11. Home sections (trust strip, categories, unbeatable)
   ✅ 12. Cancel/Exchange with wallet refund
   ✅ 13. Referral channels UI
   ✅ 14. Footer + Policy pages
   ✅ 15. Profile stats fix
   ✅ 16. Voice welcome (Indian girl voice)
   ================================================================ */

/* ═══════════════════════════════════════════════════════════════
   SECTION 0 — CSS INJECTION (All styles merged)
   ═══════════════════════════════════════════════════════════════ */
(function _injectAllCSS() {
  if (document.getElementById('ok-merged-css')) return;
  const style = document.createElement('style');
  style.id = 'ok-merged-css';
  style.textContent = `

    /* ── FIX 1: Profile page z-index ABOVE header (z-50) ── */
    .profile-page {
      position: fixed !important;
      inset: 0 !important;
      z-index: 200 !important;
      background: #F7F5F2 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      animation: fadeIn 0.25s ease both !important;
    }
    .profile-page.hidden { display: none !important; }
    .profile-page-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 210 !important;
      background: white !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 0 16px !important;
      height: 56px !important;
      border-bottom: 1px solid #E5E2DC !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
      flex-shrink: 0 !important;
    }
    .profile-page-header h2 {
      font-size: 1.05rem !important;
      font-weight: 800 !important;
      color: #1C1C1E !important;
      margin: 0 !important;
    }
    .profile-page-header .back-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: #F7F5F2;
      border: 1px solid #E5E2DC;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #1C1C1E; font-size: 14px;
      transition: all 0.2s;
    }
    .profile-page-header .back-btn:hover { background: #e11d48; color: white; }
    .profile-page-header .action-btn {
      background: #C8102E; color: white; border: none;
      border-radius: 20px; padding: 6px 16px;
      font-size: 12px; font-weight: 700; cursor: pointer;
    }
    .profile-page-body {
      flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
    }
    .profile-menu-item { transition: background 0.15s; }
    .profile-menu-item:active { background: #f3f4f6 !important; }

    /* ── FIX 4: PDP sizing ── */
    #pdp-container h1 {
      font-size: 1.15rem !important;
      font-weight: 900 !important;
      line-height: 1.3 !important;
    }
    #pdp-container .text-3xl { font-size: 1.15rem !important; }
    #pdp-container .text-3xl.font-bold { font-size: 1.4rem !important; }

    /* ── FIX 5: PDP Lightbox ── */
    #ok-lightbox-overlay {
      position: fixed; inset: 0; z-index: 9000;
      background: rgba(0,0,0,0.97);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    #ok-lightbox-overlay.hidden { display: none !important; }
    #ok-lightbox-img-wrap {
      flex: 1; display: flex; align-items: center; justify-content: center;
      width: 100%; overflow: hidden; position: relative;
    }
    #ok-lightbox-img {
      max-width: 100vw; max-height: calc(100vh - 130px);
      object-fit: contain; border-radius: 8px; user-select: none;
      transition: opacity 0.2s ease;
    }
    #ok-lightbox-close {
      position: absolute; top: 16px; right: 16px;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
      color: white; font-size: 18px; display: flex; align-items: center;
      justify-content: center; cursor: pointer; z-index: 10; transition: background 0.2s;
    }
    #ok-lightbox-close:hover { background: rgba(225,29,72,0.7); }
    #ok-lightbox-counter {
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.55); color: white; font-size: 12px; font-weight: 700;
      padding: 4px 12px; border-radius: 99px; z-index: 10;
    }
    #ok-lightbox-prev, #ok-lightbox-next {
      position: absolute; top: 50%; transform: translateY(-50%);
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      color: white; font-size: 16px; display: flex; align-items: center;
      justify-content: center; cursor: pointer; transition: background 0.2s; z-index: 5;
    }
    #ok-lightbox-prev { left: 12px; }
    #ok-lightbox-next { right: 12px; }
    #ok-lightbox-prev:hover, #ok-lightbox-next:hover { background: rgba(225,29,72,0.6); }
    #ok-lightbox-thumbs {
      display: flex; gap: 8px; overflow-x: auto; padding: 12px 16px;
      background: rgba(0,0,0,0.6); width: 100%; flex-shrink: 0;
      scrollbar-width: none; -ms-overflow-style: none;
    }
    #ok-lightbox-thumbs::-webkit-scrollbar { display: none; }
    .ok-lb-thumb {
      width: 56px; height: 68px; object-fit: cover; border-radius: 8px;
      flex-shrink: 0; border: 2px solid transparent; cursor: pointer;
      opacity: 0.5; transition: all 0.2s;
    }
    .ok-lb-thumb.active { border-color: #e11d48; opacity: 1; transform: scale(1.05); }
    .ok-lb-thumb:hover { opacity: 0.85; }
    .pdp-img-tap-hint {
      position: absolute; bottom: 10px; right: 10px;
      background: rgba(0,0,0,0.55); color: white; font-size: 10px;
      font-weight: 700; padding: 4px 10px; border-radius: 99px;
      pointer-events: none; display: flex; align-items: center; gap: 5px; z-index: 5;
    }

    /* ── Footer ── */
    #ok-site-footer {
      background: #FDFCFA !important;
      border-top: 1px solid #E5E2DC !important;
      color: #6B6A68 !important;
    }
    #ok-site-footer .footer-brand {
      background: linear-gradient(135deg,#C9A84C,#B8860B) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    #ok-site-footer .footer-links a { color: #6B6A68 !important; }
    #ok-site-footer .footer-links a:hover { color: #1C1C1E !important; }
    #ok-site-footer .footer-copy { color: #A09D98 !important; }

    /* ── Search Overlay ── */
    #ok-search-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
      display: flex; flex-direction: column; align-items: stretch;
    }
    #ok-search-overlay.hidden { display: none !important; }
    #ok-search-bar-panel {
      background: white; padding: 14px 16px 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    }
    #ok-search-input-wrap {
      display: flex; align-items: center;
      background: #F7F5F2; border: 1.5px solid #E5E2DC;
      border-radius: 9999px; padding: 0 6px 0 14px; gap: 8px;
      transition: border-color 0.2s, background 0.2s;
    }
    #ok-search-input-wrap:focus-within {
      border-color: #e11d48; background: white;
      box-shadow: 0 0 0 3px rgba(225,29,72,0.1);
    }
    #ok-search-input-inner {
      flex: 1; background: transparent; border: none !important;
      outline: none !important; font-size: 15px !important;
      color: #1C1C1E; padding: 11px 0; font-weight: 500;
    }
    #ok-search-input-inner::placeholder { color: #A09D98; }
    #ok-search-close-btn {
      width: 34px; height: 34px; border-radius: 50%;
      background: #F7F5F2; border: 1px solid #E5E2DC;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; font-size: 13px; color: #6B6A68;
      transition: all 0.2s;
    }
    #ok-search-close-btn:hover { background: #e11d48; color: white; border-color: #e11d48; }
    #ok-search-results-panel {
      background: white; flex: 1; overflow-y: auto;
      -webkit-overflow-scrolling: touch; max-height: calc(100vh - 80px);
    }
    .ok-sr-item {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 16px; border-bottom: 1px solid #F7F5F2;
      cursor: pointer; transition: background 0.15s;
    }
    .ok-sr-item:hover { background: #FFF5F6; }
    .ok-sr-img {
      width: 46px; height: 56px; object-fit: cover;
      border-radius: 9px; border: 1px solid #E5E2DC; flex-shrink: 0;
    }
    .ok-sr-name { font-weight: 700; font-size: 13px; color: #1C1C1E; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ok-sr-cat  { font-size: 10px; color: #9ca3af; margin-top: 2px; }
    .ok-sr-price { font-weight: 900; font-size: 13px; color: #e11d48; margin-top: 3px; }

    /* ── User Level Badge ── */
    #ok-user-level-badge {
      margin: 0 16px 12px;
      padding: 10px 14px;
      background: white;
      border-radius: 14px;
      border: 1px solid #E5E2DC;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      display: flex; align-items: center; gap: 10px;
    }
    .ok-level-icon {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; flex-shrink: 0;
    }
    .ok-level-text { flex: 1; min-width: 0; }
    .ok-level-name { font-weight: 900; font-size: 13px; }
    .ok-level-sub  { font-size: 10px; color: #9ca3af; margin-top: 1px; }
    .ok-level-bar  { height: 4px; border-radius: 99px; background: #F3F4F6; margin-top: 6px; overflow: hidden; }
    .ok-level-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }

    /* ── Mobile search trigger ── */
    #ok-mobile-search-trigger {
      display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 50%;
      background: #F7F5F2; border: 1px solid #E5E2DC;
      color: #6B6A68; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    #ok-mobile-search-trigger:hover { background: #e11d48; color: white; border-color: #e11d48; }
    @media(min-width: 768px) { #ok-mobile-search-trigger { display: none !important; } }

    /* Hide old mobile search bar on home */
    #view-home .md\\:hidden.p-3.bg-white.z-20 { display: none !important; }

    /* ── ADS Section ── */
    #ok-ads-section {
      margin: 0 0 4px; background: #FDFCFA;
      border-top: 1px solid #E5E2DC; border-bottom: 1px solid #E5E2DC;
    }
    .ok-ad-banner {
      border-radius: 12px; overflow: hidden; cursor: pointer;
      display: block; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
      position: relative; background: white; border: 1px solid #E5E2DC;
    }
    .ok-ad-banner:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .ok-ad-banner img { width: 100%; height: 110px; object-fit: cover; display: block; }
    .ok-ad-badge {
      position: absolute; top: 7px; right: 7px;
      background: rgba(0,0,0,0.55); color: white;
      font-size: 8px; font-weight: 800; padding: 2px 6px;
      border-radius: 99px; letter-spacing: 0.1em;
    }

    /* ── Cancel/Exchange slide up ── */
    @keyframes okSlideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

    /* ── Home sections ── */
    #view-home { background: #f8f8f8; }
    #ok-trust-strip { display:flex;align-items:center;justify-content:space-around;background:white;padding:14px 12px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;flex-wrap:wrap;gap:8px; }
    .ok-trust-item { display:flex;align-items:center;gap:8px;font-size:11px;color:#374151;min-width:120px; }
    .ok-trust-item i { font-size:18px;color:#111827; }
    .ok-trust-item strong { display:block;font-size:12px;font-weight:800;color:#111827; }
    .ok-trust-item span { font-size:10px;color:#6b7280; }
    #ok-shopco-cats { padding:28px 16px;background:white;margin-top:4px; }
    #ok-shopco-cats h2 { text-align:center;font-size:1.4rem;font-weight:900;color:#111827;margin-bottom:20px;letter-spacing:-0.02em; }
    .ok-cat-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:12px; }
    @media(min-width:640px){ .ok-cat-grid { grid-template-columns:repeat(4,1fr); } }
    .ok-cat-card { border-radius:14px;overflow:hidden;cursor:pointer;position:relative;aspect-ratio:3/4;background:#f3f4f6;transition:transform 0.25s ease,box-shadow 0.25s ease;border:1px solid #e5e7eb; }
    .ok-cat-card:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.12); }
    .ok-cat-card img { width:100%;height:100%;object-fit:cover;display:block; }
    .ok-cat-card-label { position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,0.95);padding:10px 14px;font-size:13px;font-weight:800;color:#111827;text-align:center; }
    .ok-viewall-btn { display:block;width:fit-content;margin:16px auto 0;background:#111827;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.2s; }
    #ok-promo-banner-strip { background:#111827;color:white;text-align:center;padding:10px;font-size:12px;font-weight:600;letter-spacing:0.03em; }
    #ok-promo-banner-strip strong { color:#fbbf24; }
    #ok-unbeatable-section { margin-top:16px;padding:24px 16px 28px;position:relative;overflow:hidden; }
    .ok-unbeat-card { flex-shrink:0;width:145px;cursor:pointer; }
    .ok-unbeat-card-img-wrap { border-radius:14px;overflow:hidden;border:1px solid rgba(201,168,76,0.2);background:#1a1200;position:relative; }
    .ok-unbeat-card img { width:100%;height:175px;object-fit:cover;display:block; }
    .ok-hscroll { display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:12px;padding-bottom:8px; }
    .ok-hscroll::-webkit-scrollbar { display:none; }

    /* ── Referral channels ── */
    #ok-ref-channel-box { margin:16px;background:linear-gradient(135deg,#0d0821,#1a0e00);border-radius:18px;padding:16px; }

    /* ── PWA popup ── */
    #ok-pwa-overlay { position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.75);backdrop-filter:blur(10px); }

    /* ── Get App button ── */
    #ok-get-app-btn {
      display:flex;align-items:center;gap:5px;
      background:linear-gradient(135deg,#e11d48,#be123c);
      color:white;border:none;border-radius:99px;
      padding:7px 13px;font-size:10px;font-weight:800;
      cursor:pointer;white-space:nowrap;letter-spacing:0.04em;
      box-shadow:0 3px 12px rgba(225,29,72,0.45);
      position:relative;overflow:hidden;
    }
    @keyframes appShimmer { 0%{left:-60%} 100%{left:160%} }
    #ok-get-app-btn::before {
      content:'';position:absolute;top:-50%;left:-60%;
      width:40%;height:200%;background:rgba(255,255,255,0.2);
      transform:skewX(-20deg); animation:appShimmer 2.5s infinite;
    }

    /* ── Share button ── */
    .share-outfitkart-btn { background:linear-gradient(135deg,#e11d48,#be123c) !important; }
    @keyframes sharePulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(225,29,72,0.4); } 50% { box-shadow: 0 0 0 8px rgba(225,29,72,0); } }

    /* ── Level card in profile ── */
    #ok-profile-level-card { border-radius:16px;padding:16px;margin:12px 16px;border:2px solid;position:relative;overflow:hidden; }

    /* ── Influencer card ── */
    .inf-submit-card {
      background: white; border: 1px solid #e5e7eb;
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }

    /* ── Policy pages ── */
    .ok-policy-section { max-width:700px;margin:0 auto;padding:16px; }
    .ok-policy-section h2 { font-size:1.3rem;font-weight:900;color:#111827;margin:24px 0 8px; }
    .ok-policy-section h3 { font-size:1rem;font-weight:800;color:#374151;margin:16px 0 6px; }
    .ok-policy-section p { font-size:13px;color:#4b5563;line-height:1.7;margin:6px 0; }
    .ok-policy-section ul,ol { padding-left:18px;margin:6px 0; }
    .ok-policy-section li { font-size:13px;color:#4b5563;line-height:1.7;margin:4px 0; }
    .ok-policy-section .highlight-box { background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:14px;margin:12px 0; }
    .ok-policy-section .warning-box { background:#fef2f2;border:1.5px solid #fca5a5;border-radius:12px;padding:14px;margin:12px 0; }
    .ok-policy-section .info-box { background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:14px;margin:12px 0; }

    /* ── Supplier ID row ── */
    .supplier-id-row.saved { transition:all 0.3s ease; }

    /* ── Admin Ads tab ── */
    #admin-tab-ads .ad-card-admin {
      background: white; border: 1px solid #E5E2DC;
      border-radius: 14px; padding: 14px; margin-bottom: 12px;
    }
    .ok-ads-sql-info { background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
  `;
  document.head.appendChild(style);
})();


/* ═══════════════════════════════════════════════════════════════
   SECTION 1 — PRODUCTS ACCESSOR
   ═══════════════════════════════════════════════════════════════ */
function _getAllProducts() {
  const c = [window.products, window.allProducts, window._allProducts, window.shopProducts, window.productList];
  for (const x of c) { if (Array.isArray(x) && x.length > 0) return x; }
  return [];
}
function _getAllGoldProducts() {
  const c = [window.goldProducts, window.allGoldProducts, window._goldProducts];
  for (const x of c) { if (Array.isArray(x) && x.length > 0) return x; }
  return [];
}
function _waitForProducts(cb, maxMs = 8000) {
  const start = Date.now();
  function check() {
    const p = _getAllProducts();
    if (p.length > 0) { cb(p); return; }
    if (Date.now() - start > maxMs) { cb([]); return; }
    setTimeout(check, 300);
  }
  check();
}
function _openProduct(p, isGold) {
  const id = p.id;
  const fns = [
    () => typeof openProductPage === 'function' && openProductPage(id, isGold),
    () => typeof viewProduct === 'function' && viewProduct(id),
    () => typeof navigate === 'function' && navigate('product', id),
  ];
  for (const fn of fns) { try { const r = fn(); if (r !== false) break; } catch {} }
  if (typeof closeSearchOverlay === 'function') closeSearchOverlay();
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 2 — PROFILE PAGE SYSTEM (Fixed z-index)
   ═══════════════════════════════════════════════════════════════ */
// ── Profile Page Overlay (kisi bhi view se kaam kare) ──────────
(function _setupProfileOverlay() {
  if (document.getElementById('ok-profile-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'ok-profile-overlay';
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:9999',
    'background:#F7F5F2', 'display:none',
    'flex-direction:column', 'overflow:hidden',
    'animation:fadeIn 0.2s ease both'
  ].join(';');
  document.body.appendChild(overlay);
})();

window.openProfilePage = function(pageName) {
  // Pehle saare profile pages hide karo
  document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));

  const page = document.getElementById('profile-page-' + pageName);
  if (!page) { console.warn('[OutfitKart] Profile page not found:', pageName); return; }

  const overlay = document.getElementById('ok-profile-overlay');
  if (!overlay) return;

  // Page ka clone overlay mein dikhao (original apni jagah safe rahe)
  overlay.innerHTML = '';
  const clone = page.cloneNode(true);
  clone.classList.remove('hidden');
  clone.style.cssText = 'position:static;display:flex;flex-direction:column;height:100%;animation:fadeIn 0.2s ease both;background:#F7F5F2;';

  // Clone ke back buttons ko fix karo
  clone.querySelectorAll('.back-btn, [onclick*="closeProfilePage"]').forEach(btn => {
    btn.onclick = window.closeProfilePage;
  });

  overlay.appendChild(clone);
  overlay.style.display = 'flex';
  overlay.scrollTop = 0;

  const loaders = {
    orders:     () => _loadProfileOrders(),
    wishlist:   () => _loadProfileWishlist(),
    wallet:     () => _loadProfileWallet(),
    referrals:  () => _loadProfileReferrals(),
    influencer: () => _loadProfileInfluencer(),
    info:       () => _loadProfileInfo(),
  };
  if (loaders[pageName]) loaders[pageName]();
};

window.closeProfilePage = function() {
  const overlay = document.getElementById('ok-profile-overlay');
  if (overlay) overlay.style.display = 'none';
  document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
};

function _loadProfileOrders() {
  const fns = ['loadUserOrders', 'renderUserOrders', 'renderOrdersList', 'fetchUserOrders'];
  for (const fn of fns) { if (typeof window[fn] === 'function') { window[fn](); return; } }
  _fallbackLoadOrders();
}
function _loadProfileWishlist() {
  const fns = ['loadWishlist', 'renderWishlist'];
  for (const fn of fns) { if (typeof window[fn] === 'function') { window[fn](); return; } }
}
function _loadProfileWallet() {
  const fns = ['loadWalletTransactions', 'loadWalletData'];
  for (const fn of fns) { if (typeof window[fn] === 'function') { window[fn](); return; } }
}
function _loadProfileReferrals() {
  const fns = ['loadReferrals', 'loadUserReferrals'];
  for (const fn of fns) { if (typeof window[fn] === 'function') { window[fn](); return; } }
}
function _loadProfileInfluencer() {
  // Use the patched version
  if (typeof window.loadInfluencerRequests === 'function') window.loadInfluencerRequests();
}
function _loadProfileInfo() {
  const userData = _getStoredUser();
  if (!userData) return;
  const fields = { 'prof-name': userData.name || userData.full_name || '', 'prof-email': userData.email || '', 'prof-gender': userData.gender || '', 'prof-address': userData.address || '' };
  Object.entries(fields).forEach(([id, val]) => { const el = document.getElementById(id); if (el && val) el.value = val; });
  const rcEl = document.getElementById('user-referral-code');
  if (rcEl && userData.referral_code) rcEl.textContent = userData.referral_code;
  if (userData.avatar_url) {
    ['user-avatar-img', 'prof-avatar-img2'].forEach(id => { const img = document.getElementById(id); if (img) img.src = userData.avatar_url; });
  }
}

async function _fallbackLoadOrders() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;
  const userData = _getStoredUser();
  if (!userData) { container.innerHTML = '<div class="text-center py-8 text-gray-400">Please login to view orders</div>'; return; }
  container.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-rose-500"></i></div>';
  try {
    const client = window.dbClient || window.supabase;
    if (!client) return;
    const mobile = userData.mobile || userData.phone;
    const { data: orders, error } = await client.from('orders').select('*').eq('mobile', mobile).order('created_at', { ascending: false });
    if (error) throw error;
    if (!orders || !orders.length) {
      container.innerHTML = `<div class="text-center py-16"><i class="fas fa-box-open text-5xl text-gray-200 mb-4 block"></i><p class="font-bold text-gray-500">No orders yet</p><button onclick="closeProfilePage();navigate('shop')" class="mt-4 bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Shop Now</button></div>`;
      return;
    }
    container.innerHTML = orders.map(order => {
      const items = Array.isArray(order.items) ? order.items : [];
      const sc = (window.STATUS_BADGE || {})[order.status] || 'bg-gray-100 text-gray-700';
      const oidStr = String(order.id || '').replace(/'/g, "\\'");
      return `<div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
        <div class="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div><span class="text-xs font-black text-gray-400 uppercase">Order</span><div class="font-bold text-sm text-gray-800">${order.order_id || order.id}</div></div>
          <div class="text-right"><span class="text-xs font-black px-2.5 py-1 rounded-full ${sc}">${order.status || 'Processing'}</span><div class="text-xs text-gray-400 mt-1">${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}</div></div>
        </div>
        <div class="px-4 py-3">
          ${items.slice(0,2).map(item => `<div class="flex gap-3 mb-2"><img src="${item.img || item.imgs?.[0] || 'https://placehold.co/48x60/f3f4f6/9ca3af?text=?'}" class="w-12 h-14 object-cover rounded-lg border flex-shrink-0"><div class="flex-1 min-w-0"><div class="font-semibold text-xs text-gray-800 truncate">${item.name || 'Product'}</div><div class="text-xs text-gray-500">Qty: ${item.qty || 1}${item.size ? ' · ' + item.size : ''}</div><div class="font-bold text-xs text-rose-600">₹${(item.price || 0).toLocaleString('en-IN')}</div></div></div>`).join('')}
          ${items.length > 2 ? `<div class="text-xs text-gray-400">+${items.length-2} more</div>` : ''}
          <div class="flex items-center justify-between mt-3 pt-3 border-t">
            <span class="font-black text-sm text-gray-800">₹${(order.total || order.amount || 0).toLocaleString('en-IN')}</span>
            <button onclick="openTrackingModal && openTrackingModal('${oidStr}')" class="text-xs bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg font-bold border border-rose-200">Track</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const countEl = document.getElementById('stat-orders-count');
    if (countEl) countEl.textContent = orders.length;
  } catch (err) {
    container.innerHTML = `<div class="text-center py-8 text-red-400 text-sm">Error: ${err.message}</div>`;
  }
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 3 — USER LEVEL BADGE
   ═══════════════════════════════════════════════════════════════ */
const OK_LEVELS = [
  { name:'Bronze', emoji:'🥉', min:0,  max:2,  color:'#92400e', bg:'#fffbeb', fill:'#d97706' },
  { name:'Silver', emoji:'🥈', min:3,  max:5,  color:'#374151', bg:'#f9fafb', fill:'#9ca3af' },
  { name:'Gold ⭐', emoji:'🥇', min:6,  max:10, color:'#92400e', bg:'#fffbeb', fill:'#C9A84C' },
  { name:'Platinum', emoji:'💎', min:11, max:20, color:'#1e3a5f', bg:'#eff6ff', fill:'#3b82f6' },
  { name:'Diamond 💎', emoji:'✨', min:21, max:999, color:'#5b21b6', bg:'#faf5ff', fill:'#8b5cf6' },
];
function _getUserLevel(orderCount) {
  let lvl = OK_LEVELS[0];
  OK_LEVELS.forEach(l => { if (orderCount >= l.min) lvl = l; });
  return lvl;
}
function _injectLevelBadge(orderCount) {
  document.getElementById('ok-user-level-badge')?.remove();
  const lvl = _getUserLevel(orderCount);
  const dash = document.getElementById('user-dashboard');
  if (!dash) return;
  const next = OK_LEVELS.find(l => l.min > orderCount);
  const needMore = next ? (next.min - orderCount) : 0;
  const progressPct = next ? Math.min(100, Math.round(((orderCount - lvl.min) / (next.min - lvl.min)) * 100)) : 100;
  const badge = document.createElement('div');
  badge.id = 'ok-user-level-badge';
  badge.innerHTML = `
    <div class="ok-level-icon" style="background:${lvl.bg};">${lvl.emoji}</div>
    <div class="ok-level-text">
      <div class="ok-level-name" style="color:${lvl.color};">${lvl.name}</div>
      <div class="ok-level-sub">${needMore > 0 ? needMore + ' orders → next level' : '🏆 Top Member!'}</div>
      <div class="ok-level-bar"><div class="ok-level-fill" style="width:${progressPct}%;background:${lvl.fill};"></div></div>
    </div>
    <div style="text-align:right;flex-shrink:0;">
      <div style="font-size:11px;font-weight:900;color:${lvl.color};">${orderCount}</div>
      <div style="font-size:9px;color:#9ca3af;font-weight:600;">orders</div>
    </div>`;
  const menuSection = dash.querySelector('.bg-white.rounded-2xl.shadow-sm.border.overflow-hidden.mb-4');
  if (menuSection) menuSection.insertAdjacentElement('afterend', badge);
  else dash.querySelector('#profile-home')?.appendChild(badge);
}
function _watchOrderCount() {
  const el = document.getElementById('stat-orders-count');
  if (!el) { setTimeout(_watchOrderCount, 500); return; }
  _injectLevelBadge(parseInt(el.textContent) || 0);
  new MutationObserver(() => _injectLevelBadge(parseInt(el.textContent) || 0)).observe(el, { childList: true, characterData: true, subtree: true });
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 4 — SMART AI SEARCH (Fixed & Working)
   ═══════════════════════════════════════════════════════════════ */
const HINGLISH_MAP = {
  kurta:['kurta','kurtis','ethnic'], kurti:['kurtis','kurta'],
  shirt:['shirt','t-shirt'], tshirt:['t-shirt','shirt'],
  jeans:['jeans','pants','denim'], pant:['pants','jeans','trouser'],
  dress:['dress','gown'], lehnga:['lehenga'], lehenga:['lehenga'],
  saree:['saree','sari'], sari:['saree'],
  jacket:['jacket','blazer'], coat:['coat','jacket'],
  shorts:['shorts','cargo'], cargo:['cargo','shorts'],
  hoodie:['hoodie','sweatshirt'], sweater:['sweater','hoodie'],
  suit:['suit','blazer'], blazer:['blazer','suit'],
  mard:['men'], ladke:['men'], aurat:['women'], ladki:['women'],
  perfume:['perfumes'], attar:['perfumes'], fragrance:['perfumes'],
  watch:['watches','accessories'], bag:['bags','accessories'],
  lal:'red', neela:'blue', hara:'green', kala:'black', safed:'white',
};

function _searchProductsMain(raw) {
  if (!raw || raw.trim().length < 2) return [];
  const q = raw.toLowerCase().trim();
  const all = [..._getAllProducts(), ..._getAllGoldProducts()];
  const seen = new Set();
  const unique = all.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });

  const scored = unique.map(p => {
    let score = 0;
    const name = (p.name || '').toLowerCase();
    const brand = (p.brand || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const sub = (p.sub || '').toLowerCase();
    const desc = (p.description || p.desc || '').toLowerCase();

    // Direct matches
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 60;
    else if (name.includes(q)) score += 40;
    if (brand.includes(q)) score += 25;
    if (cat.includes(q)) score += 20;
    if (sub.includes(q)) score += 20;
    if (desc.includes(q)) score += 5;

    // Hinglish token matching
    const tokens = q.split(/\s+/);
    tokens.forEach(token => {
      const mapped = HINGLISH_MAP[token];
      if (Array.isArray(mapped)) {
        mapped.forEach(v => {
          if (name.includes(v) || cat.includes(v) || sub.includes(v)) score += 15;
        });
      }
    });

    if (p.istrending) score += 3;
    if (p.is_gold) score += 1;
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  return scored.map(x => x.p);
}

function _renderSearchResults(hits, query) {
  const panel = document.getElementById('ok-search-results-panel');
  if (!panel) return;
  const goldIds = new Set(_getAllGoldProducts().map(p => p.id));

  if (!hits.length) {
    panel.innerHTML = `
      <div style="text-align:center;padding:40px 16px;color:#A09D98;">
        <i class="fas fa-search-minus" style="font-size:2.5rem;color:#FECDD3;display:block;margin-bottom:12px;"></i>
        "<strong>${query}</strong>" ke liye koi product nahi mila<br>
        <span style="font-size:11px;color:#e11d48;margin-top:6px;display:block;">Try: shirt, jeans, kurta, perfume...</span>
      </div>`;
    return;
  }

  const shown = hits.slice(0, 15);
  panel.innerHTML = `
    <div style="padding:8px 16px 4px;font-size:10px;font-weight:800;color:#A09D98;text-transform:uppercase;letter-spacing:0.1em;background:#FAFAFA;border-bottom:1px solid #F3F4F6;">
      ${hits.length} results for "<strong style="color:#e11d48;">${query}</strong>"
    </div>
    ${shown.map(p => {
      const img = p.imgs?.[0] || p.img || 'https://placehold.co/46x56/f3f4f6/9ca3af?text=?';
      const isGold = goldIds.has(p.id) || !!p.is_gold;
      const disc = p.oldprice && p.oldprice > p.price ? Math.round((1 - p.price / p.oldprice) * 100) : 0;
      return `
        <div class="ok-sr-item" onclick="_openProduct({id:${JSON.stringify(p.id)}},${isGold})">
          <img src="${img}" class="ok-sr-img" onerror="this.src='https://placehold.co/46x56/f3f4f6/9ca3af?text=?'" alt="${p.name||''}">
          <div style="flex:1;min-width:0;">
            ${isGold ? '<div style="font-size:9px;font-weight:900;color:#B8860B;margin-bottom:1px;">⭐ GOLD</div>' : ''}
            <div class="ok-sr-name">${p.name || 'Product'}</div>
            <div class="ok-sr-cat">${p.brand ? p.brand + ' · ' : ''}${p.category || ''}${p.sub ? ' › ' + p.sub : ''}</div>
            <div class="ok-sr-price">₹${(p.price||0).toLocaleString('en-IN')}
              ${p.oldprice && p.oldprice > p.price ? `<span style="text-decoration:line-through;font-size:11px;color:#aaa;font-weight:500;margin-left:4px;">₹${p.oldprice}</span>` : ''}
              ${disc >= 10 ? `<span style="margin-left:4px;font-size:9px;font-weight:800;color:#16a34a;background:#f0fdf4;padding:1px 5px;border-radius:99px;">${disc}% OFF</span>` : ''}
            </div>
          </div>
          <i class="fas fa-chevron-right" style="color:#E5E2DC;font-size:11px;flex-shrink:0;"></i>
        </div>`;
    }).join('')}
    ${hits.length > 15 ? `<button onclick="_okSearchFullPage('${query}')" style="width:100%;padding:14px;text-align:center;background:none;border:none;border-top:1px solid #F3F4F6;font-size:12px;font-weight:800;color:#e11d48;cursor:pointer;">View All ${hits.length} Results →</button>` : ''}
  `;
}

let _searchDebounce = null;
let _autoNavDebounce = null;
function _okSearchHandler(e) {
  const q = (e.target?.value || '').trim();
  const panel = document.getElementById('ok-search-results-panel');
  if (!panel) return;
  if (q.length < 2) {
    panel.innerHTML = `<div style="text-align:center;padding:40px 16px;color:#A09D98;"><i class="fas fa-magic" style="font-size:2.5rem;color:#FECDD3;display:block;margin-bottom:10px;"></i>Search karo — kurta, jeans, perfume, shirt...</div>`;
    return;
  }
  clearTimeout(_searchDebounce);
  clearTimeout(_autoNavDebounce);
  panel.innerHTML = `<div style="text-align:center;padding:24px;color:#9ca3af;"><i class="fas fa-spinner fa-spin" style="color:#e11d48;font-size:1.5rem;display:block;margin-bottom:8px;"></i>Searching...</div>`;

  // Overlay mein bhi results dikhao
  _searchDebounce = setTimeout(() => {
    const products = _getAllProducts();
    if (products.length > 0) {
      _renderSearchResults(_searchProductsMain(q), q);
    } else {
      _waitForProducts(() => _renderSearchResults(_searchProductsMain(q), q));
    }
  }, 280);

  // 500ms baad automatically full page search pe navigate karo (bina Enter dabaye)
  _autoNavDebounce = setTimeout(() => {
    _okSearchFullPage(q);
  }, 500);
}

function _okSearchFullPage(q) {
  if (typeof closeSearchOverlay === 'function') closeSearchOverlay();
  const i1 = document.getElementById('mobile-search'), i2 = document.getElementById('desktop-search');
  if (i1) i1.value = q;
  if (i2) i2.value = q;
  if (typeof handleSearch === 'function') handleSearch(q);
  document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
  const sv = document.getElementById('view-search') || document.getElementById('view-shop');
  if (sv) { sv.classList.remove('hidden'); window.currentView = 'search'; }
  if (typeof updateBottomNav === 'function') updateBottomNav();
  window.scrollTo(0, 0);
}

function _okVoiceSearch() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { typeof showToast === 'function' && showToast('Voice not supported'); return; }
  const r = new SR(); r.lang = 'hi-IN'; r.interimResults = false;
  typeof showToast === 'function' && showToast('🎙️ Bol rahe hain...');
  r.start();
  r.onresult = e => {
    const q = e.results[0][0].transcript;
    const inp = document.getElementById('ok-search-input-inner');
    if (inp) { inp.value = q; _okSearchHandler({ target: inp }); }
  };
  r.onerror = () => typeof showToast === 'function' && showToast('Voice failed');
}

window.openSearchOverlay = function() {};  // will be set by _initSearchOverlay
window.closeSearchOverlay = function() {};

function _initSearchOverlay() {
  document.getElementById('ok-search-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'ok-search-overlay';
  overlay.className = 'hidden';
  overlay.innerHTML = `
    <div id="ok-search-bar-panel">
      <div id="ok-search-input-wrap">
        <i class="fas fa-search" style="color:#e11d48;font-size:14px;flex-shrink:0;"></i>
        <input type="text" id="ok-search-input-inner" placeholder="Search kurta, jeans, perfume..." autocomplete="off" autocorrect="off" spellcheck="false">
        <button onclick="_okVoiceSearch()" title="Voice" style="width:30px;height:30px;border-radius:50%;background:none;border:none;cursor:pointer;color:#9ca3af;flex-shrink:0;display:flex;align-items:center;justify-content:center;"><i class="fas fa-microphone" style="font-size:13px;"></i></button>
        <button id="ok-search-close-btn" onclick="closeSearchOverlay()"><i class="fas fa-times" style="font-size:12px;"></i></button>
      </div>
    </div>
    <div id="ok-search-results-panel">
      <div style="text-align:center;padding:40px 16px;color:#A09D98;"><i class="fas fa-magic" style="font-size:2.5rem;color:#FECDD3;display:block;margin-bottom:10px;"></i>Search karo — kurta, jeans, perfume, shirt...</div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearchOverlay(); });
  const input = document.getElementById('ok-search-input-inner');
  if (input) {
    input.addEventListener('input', _okSearchHandler);
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearchOverlay();
      if (e.key === 'Enter' && input.value.trim().length >= 2) _okSearchFullPage(input.value.trim());
    });
  }

  window.openSearchOverlay = function() {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    const inp = document.getElementById('ok-search-input-inner');
    if (inp) {
      inp.value = '';
      setTimeout(() => inp.focus(), 80);
      const p = document.getElementById('ok-search-results-panel');
      if (p) p.innerHTML = `<div style="text-align:center;padding:40px 16px;color:#A09D98;"><i class="fas fa-magic" style="font-size:2.5rem;color:#FECDD3;display:block;margin-bottom:10px;"></i>Search karo...</div>`;
    }
  };
  window.closeSearchOverlay = function() {
    overlay.classList.add('hidden');
    overlay.style.display = '';
    document.body.style.overflow = '';
  };
}

function _injectMobileSearchTrigger() {
  if (document.getElementById('ok-mobile-search-trigger')) return;
  const headerBtns = document.querySelector('header .flex.items-center.gap-3');
  if (!headerBtns) return;
  const btn = document.createElement('button');
  btn.id = 'ok-mobile-search-trigger';
  btn.onclick = () => typeof openSearchOverlay === 'function' && openSearchOverlay();
  btn.title = 'Search';
  btn.innerHTML = '<i class="fas fa-search" style="font-size:15px;"></i>';
  headerBtns.insertBefore(btn, headerBtns.firstChild);
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 5 — PDP LIGHTBOX
   ═══════════════════════════════════════════════════════════════ */
let _lbImages = [], _lbIdx = 0;

function _initLightbox() {
  if (document.getElementById('ok-lightbox-overlay')) return;
  const lb = document.createElement('div');
  lb.id = 'ok-lightbox-overlay';
  lb.className = 'hidden';
  lb.innerHTML = `
    <button id="ok-lightbox-close" onclick="closeLightbox()"><i class="fas fa-times"></i></button>
    <div id="ok-lightbox-counter"></div>
    <div id="ok-lightbox-img-wrap">
      <button id="ok-lightbox-prev" onclick="lightboxNav(-1)"><i class="fas fa-chevron-left"></i></button>
      <img id="ok-lightbox-img" src="" alt="Product">
      <button id="ok-lightbox-next" onclick="lightboxNav(1)"><i class="fas fa-chevron-right"></i></button>
    </div>
    <div id="ok-lightbox-thumbs"></div>`;
  document.body.appendChild(lb);
  lb.addEventListener('click', e => { if (e.target === lb || e.target.id === 'ok-lightbox-img-wrap') closeLightbox(); });
  let startX = 0;
  lb.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) lightboxNav(dx < 0 ? 1 : -1); }, { passive: true });
  document.addEventListener('keydown', e => {
    if (document.getElementById('ok-lightbox-overlay')?.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
    if (e.key === 'Escape') closeLightbox();
  });
}

window.openLightbox = function(images, startIdx) {
  _initLightbox();
  _lbImages = images || [];
  _lbIdx = startIdx || 0;
  _lbRender();
  const lb = document.getElementById('ok-lightbox-overlay');
  if (lb) { lb.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
};
window.closeLightbox = function() {
  document.getElementById('ok-lightbox-overlay')?.classList.add('hidden');
  document.body.style.overflow = '';
};
window.lightboxNav = function(dir) {
  _lbIdx = (_lbIdx + dir + _lbImages.length) % _lbImages.length;
  _lbRender();
};

function _lbRender() {
  const imgEl = document.getElementById('ok-lightbox-img');
  const counter = document.getElementById('ok-lightbox-counter');
  const thumbsEl = document.getElementById('ok-lightbox-thumbs');
  const prev = document.getElementById('ok-lightbox-prev');
  const next = document.getElementById('ok-lightbox-next');
  if (imgEl) { imgEl.style.opacity = '0'; setTimeout(() => { imgEl.src = _lbImages[_lbIdx] || ''; imgEl.style.opacity = '1'; }, 80); }
  if (counter) counter.textContent = `${_lbIdx + 1} / ${_lbImages.length}`;
  if (prev) prev.style.display = _lbImages.length > 1 ? 'flex' : 'none';
  if (next) next.style.display = _lbImages.length > 1 ? 'flex' : 'none';
  if (thumbsEl) {
    if (_lbImages.length > 1) {
      thumbsEl.innerHTML = _lbImages.map((src, i) => `<img src="${src}" class="ok-lb-thumb ${i === _lbIdx ? 'active' : ''}" onclick="window.lightboxNav(${i - _lbIdx})" onerror="this.style.display='none'">`).join('');
      setTimeout(() => { thumbsEl.querySelector('.ok-lb-thumb.active')?.scrollIntoView({ behavior: 'smooth', inline: 'center' }); }, 100);
    } else {
      thumbsEl.innerHTML = '';
    }
  }
}

function _attachLightboxToPDP(id) {
  const all = [..._getAllProducts(), ..._getAllGoldProducts()];
  const p = all.find(x => x.id === id);
  if (!p) return;
  const imgList = p.imgs?.length ? p.imgs : (p.img ? [p.img] : []);
  if (!imgList.length) return;

  const slider = document.getElementById(`pdp-slider-${id}`);
  if (slider) {
    slider.style.cursor = 'zoom-in';
    slider.querySelectorAll('img').forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.onclick = () => window.openLightbox(imgList, i);
    });
    // Add tap hint
    const wrap = slider.parentElement;
    if (wrap && !wrap.querySelector('.pdp-img-tap-hint')) {
      if (wrap.style.position !== 'relative') wrap.style.position = 'relative';
      const hint = document.createElement('div');
      hint.className = 'pdp-img-tap-hint';
      hint.innerHTML = '<i class="fas fa-expand-alt" style="font-size:10px;"></i> Tap to expand';
      wrap.appendChild(hint);
      setTimeout(() => { hint.style.cssText += 'opacity:0;transition:opacity 0.5s;'; }, 2500);
    }
  }
  // Single image
  const singleImgs = document.querySelectorAll('#pdp-container .rounded-lg.overflow-hidden img');
  singleImgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.onclick = () => window.openLightbox(imgList, i);
  });
  // Thumbs - double click
  document.getElementById(`pdp-thumbs-${id}`)?.querySelectorAll('.pdp-thumb').forEach((thumb, i) => {
    thumb.ondblclick = () => window.openLightbox(imgList, i);
  });
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 6 — PWA INSTALL (Real install)
   ═══════════════════════════════════════════════════════════════ */
function _fixPWAInstall() {
  if (!window._pwaEventCaptured) {
    window._pwaEventCaptured = true;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      window.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      window.deferredPrompt = null;
      localStorage.setItem('ok_pwa_installed', '1');
      document.getElementById('ok-get-app-btn')?.remove();
      typeof showToast === 'function' && showToast('🎉 OutfitKart installed!');
    });
  }

  // Fix header install button
  setTimeout(() => {
    const btn = document.getElementById('ok-get-app-btn');
    if (btn) {
      btn.onclick = function() {
        if (window.deferredPrompt) {
          window.deferredPrompt.prompt();
          window.deferredPrompt.userChoice.then(c => {
            if (c.outcome === 'accepted') { window.deferredPrompt = null; btn.remove(); typeof showToast === 'function' && showToast('✅ Installing...'); }
          }).catch(() => {});
        } else {
          window._showPWAPopup();
        }
      };
    }
  }, 1000);

  // Fix _triggerPWAInstall in popup
  window._triggerPWAInstall = async function() {
    const btn = document.getElementById('ok-pwa-install-btn');
    const btnText = document.getElementById('ok-pwa-btn-text');
    const progressWrap = document.getElementById('ok-pwa-progress-wrap');
    const progressBar = document.getElementById('ok-pwa-progress-bar');
    const progressLabel = document.getElementById('ok-pwa-progress-label');
    if (btn) btn.disabled = true;
    if (btnText) btnText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Installing...';
    if (progressWrap) progressWrap.style.display = 'block';

    if (window.deferredPrompt) {
      try {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          if (progressBar) progressBar.style.width = '100%';
          if (progressLabel) progressLabel.textContent = '✅ Installing!';
          if (btnText) btnText.innerHTML = '✅ Installing! Use APP10';
          if (btn) { btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)'; btn.style.opacity = '1'; }
          window.deferredPrompt = null;
          setTimeout(() => {
            document.getElementById('ok-pwa-overlay')?.remove();
            document.getElementById('ok-get-app-btn')?.remove();
            typeof showToast === 'function' && showToast('🎉 App installed! Use APP10 for 10% off!');
          }, 1500);
        } else {
          // Keep popup open, just reset button
          if (btnText) btnText.innerHTML = '<i class="fas fa-download mr-2"></i>Install OutfitKart';
          if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
          if (progressWrap) progressWrap.style.display = 'none';
          typeof showToast === 'function' && showToast('Baad mein install kar sakte ho!');
        }
      } catch {
        if (btnText) btnText.innerHTML = '<i class="fas fa-download mr-2"></i>Install OutfitKart';
        if (btn) { btn.disabled = false; }
        if (progressWrap) progressWrap.style.display = 'none';
      }
    } else {
      // No prompt — show manual instructions
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (progressBar) {
        let pct = 0;
        const iv = setInterval(() => { pct = Math.min(pct + 10, 100); progressBar.style.width = pct + '%'; if (pct >= 100) clearInterval(iv); }, 80);
      }
      if (progressLabel) progressLabel.innerHTML = isIOS ? '📱 Safari → Share → "Add to Home Screen"' : '⚙️ Browser menu → "Add to Home Screen"';
      if (btnText) btnText.innerHTML = '📱 Add to Home Screen';
      if (btn) { btn.disabled = false; }
    }
  };
}

window._showPWAPopup = function() {
  if (document.getElementById('ok-pwa-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'ok-pwa-overlay';
  overlay.innerHTML = `
    <div id="ok-pwa-card" style="width:calc(100%-32px);max-width:400px;background:linear-gradient(145deg,#0a0a0f,#12001a,#001020);border-radius:28px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);box-shadow:0 40px 80px rgba(0,0,0,0.8);position:relative;animation:fadeIn 0.35s ease both;">
      <button onclick="document.getElementById('ok-pwa-overlay').remove()" style="position:absolute;top:16px;right:16px;z-index:10;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.6);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
      <div style="background:linear-gradient(135deg,#1a0010,#0a0030,#001a10);padding:36px 28px 24px;text-align:center;">
        <div style="width:80px;height:80px;margin:0 auto 18px;border-radius:22px;background:linear-gradient(135deg,#e11d48,#be123c);display:flex;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(225,29,72,0.5);"><i class="fas fa-shopping-bag" style="color:white;font-size:32px;"></i></div>
        <h2 style="color:white;font-size:1.4rem;font-weight:900;margin:0 0 6px;">OutfitKart</h2>
        <p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 16px;">Premium Fashion App</p>
        <div style="display:flex;justify-content:center;gap:12px;">
          <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">🚀 Fast</div>
          <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">📦 COD</div>
          <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">🔔 Alerts</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg,#1a0800,#2d0a00);padding:12px 28px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.05);">
        <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#C9A84C,#B8860B);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">🎁</div>
        <div><div style="font-size:12px;font-weight:900;color:#C9A84C;">Install karo, 10% OFF pao!</div><div style="font-size:10px;color:rgba(255,255,255,0.4);">Code <span style="font-family:monospace;color:#F5E6C0;font-weight:800;">APP10</span> first order pe</div></div>
      </div>
      <div style="padding:20px 28px 28px;">
        <button id="ok-pwa-install-btn" onclick="window._triggerPWAInstall()" style="width:100%;background:linear-gradient(135deg,#e11d48,#be123c);color:white;border:none;padding:16px;border-radius:16px;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 8px 32px rgba(225,29,72,0.4);">
          <span id="ok-pwa-btn-text"><i class="fas fa-download" style="margin-right:8px;"></i>Install OutfitKart</span>
        </button>
        <div id="ok-pwa-progress-wrap" style="display:none;padding:12px 0 0;">
          <div id="ok-pwa-progress-track" style="height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin-bottom:8px;"><div id="ok-pwa-progress-bar" style="height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,#e11d48,#C9A84C);transition:width 0.3s ease;"></div></div>
          <div id="ok-pwa-progress-label" style="font-size:11px;color:rgba(255,255,255,0.5);text-align:center;">Preparing...</div>
        </div>
        <p style="text-align:center;font-size:10px;color:rgba(255,255,255,0.25);margin-top:12px;">No app store needed • Works on all devices</p>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
};


/* ═══════════════════════════════════════════════════════════════
   SECTION 7 — INFLUENCER SUBMISSIONS (Fixed)
   ═══════════════════════════════════════════════════════════════ */
window.loadInfluencerRequests = async function() {
  if (!window.currentUser) return;
  const container = document.getElementById('inf-requests-list');
  const totalEl = document.getElementById('inf-total-earned');
  const countEl = document.getElementById('inf-submissions-count');
  if (!container) return;
  container.innerHTML = '<div class="text-center py-6"><i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i></div>';
  try {
    const client = window.dbClient || window.supabase;
    if (!client) throw new Error('DB not ready');
    const { data, error } = await client.from('influencer_requests').select('*').eq('mobile', window.currentUser.mobile).order('id', { ascending: false });
    if (error) throw error;
    const all = data || [];
    const approved = all.filter(r => r.status === 'Approved');
    const totalEarned = approved.reduce((s, r) => s + (r.earnings || 0), 0);
    if (totalEl) totalEl.textContent = `₹${totalEarned}`;
    if (countEl) countEl.textContent = all.length;
    if (!all.length) {
      container.innerHTML = `<div class="text-center py-10 text-gray-400"><i class="fas fa-video text-4xl mb-3 block opacity-40"></i><p class="font-semibold text-sm">Abhi tak koi submission nahi</p><p class="text-xs mt-1 text-gray-400">Upar form se request submit karo</p></div>`;
      return;
    }
    const BADGE = { Pending:'bg-amber-100 text-amber-700', Approved:'bg-green-100 text-green-700', Rejected:'bg-red-100 text-red-600' };
    const ICON = { Pending:'⏳', Approved:'✅', Rejected:'❌' };
    container.innerHTML = all.map(r => `
      <div class="inf-submit-card">
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="font-bold text-sm text-gray-800">${r.platform || '—'}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE[r.status] || 'bg-gray-100 text-gray-500'}">${ICON[r.status] || ''} ${r.status}</span>
            </div>
            <div class="text-xs text-gray-500 mb-1">👁 ${(r.views || 0).toLocaleString()} views${r.submitted_at ? ' · ' + new Date(r.submitted_at).toLocaleDateString('en-IN') : ''}</div>
            ${r.video_url ? `<a href="${r.video_url}" target="_blank" rel="noopener" class="text-xs text-blue-600 hover:underline block truncate">${r.video_url}</a>` : ''}
            ${r.description ? `<p class="text-xs text-gray-500 mt-1 italic">"${r.description}"</p>` : ''}
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-base font-black ${r.status === 'Approved' ? 'text-green-600' : 'text-gray-400'}">₹${r.earnings || 0}</div>
          </div>
        </div>
        ${r.status === 'Approved' ? `<div class="text-xs text-green-600 font-semibold mt-2 bg-green-50 rounded-lg px-3 py-1.5">✅ ₹${r.earnings} wallet mein credit ho gaya</div>` : ''}
        ${r.status === 'Rejected' && r.reject_reason ? `<div class="text-xs text-red-500 mt-2 bg-red-50 rounded-lg px-3 py-1.5">❌ ${r.reject_reason}</div>` : ''}
      </div>`).join('');
  } catch (err) {
    container.innerHTML = `<div class="text-center py-6 text-red-400 text-sm"><i class="fas fa-exclamation-circle mb-2 block text-2xl"></i>${err.message}</div>`;
  }
};


/* ═══════════════════════════════════════════════════════════════
   SECTION 8 — AUTH / STORED USER
   ═══════════════════════════════════════════════════════════════ */
function _getStoredUser() {
  try {
    const keys = ['outfitkart_user', 'ok_user', 'user_data', 'currentUser', 'outfitkart_session'];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) { try { return JSON.parse(raw); } catch {} }
    }
    return null;
  } catch { return null; }
}

function _showProfileDashboard(userData) {
  const authForms = document.getElementById('auth-forms');
  const dashboard = document.getElementById('user-dashboard');
  if (!authForms || !dashboard) return;
  authForms.classList.add('hidden');
  dashboard.classList.remove('hidden');
  const name = userData.name || userData.full_name || 'User';
  const mobile = userData.mobile || userData.phone || '';
  const greetEl = document.getElementById('user-greeting');
  if (greetEl) greetEl.textContent = name;
  const mobEl = document.getElementById('user-mobile-display');
  if (mobEl) mobEl.textContent = mobile ? '+91 ' + mobile : '';
  const navEl = document.getElementById('nav-profile-text');
  if (navEl) navEl.textContent = name.split(' ')[0];
  const walletBal = userData.wallet || 0;
  const statWal = document.getElementById('stat-wallet-bal');
  if (statWal) statWal.textContent = '₹' + walletBal;
  const menuWalletBadge = document.getElementById('menu-wallet-badge');
  if (menuWalletBadge && walletBal > 0) { menuWalletBadge.textContent = '₹' + walletBal; menuWalletBadge.classList.remove('hidden'); }
  const orderCount = parseInt(document.getElementById('stat-orders-count')?.textContent) || 0;
  setTimeout(() => _injectLevelBadge(orderCount), 300);
}

function _patchAuthFunctions() {
  if (window._authPatched) return;
  window._authPatched = true;
  // Watch navigate for profile
  const origNav = window.navigate;
  if (origNav) {
    window.navigate = function(view, ...args) {
      origNav(view, ...args);
      if (view === 'profile') {
        setTimeout(() => { const u = _getStoredUser(); if (u) _showProfileDashboard(u); }, 200);
        setTimeout(() => _injectLevelBadge(parseInt(document.getElementById('stat-orders-count')?.textContent)||0), 400);
      }
      if (view === 'product') setTimeout(() => { const id = window.viewingProductId; if (id) _attachLightboxToPDP(id); }, 400);
    };
  }
  // Watch localStorage for auth
  const origSet = localStorage.setItem.bind(localStorage);
  if (!window._lsPatched) {
    window._lsPatched = true;
    localStorage.setItem = function(key, value) {
      origSet(key, value);
      if (['outfitkart_session','outfitkart_user','ok_user','currentUser'].includes(key)) {
        setTimeout(() => {
          try {
            const u = JSON.parse(value);
            if (u && document.getElementById('user-dashboard')?.classList.contains('hidden')) _showProfileDashboard(u);
          } catch {}
        }, 200);
      }
    };
  }
  setTimeout(() => { const u = _getStoredUser(); if (u) _showProfileDashboard(u); }, 500);
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 9 — ADS SYSTEM
   ═══════════════════════════════════════════════════════════════ */
window.loadAdsForHome = async function() {
  try {
    const client = window.dbClient || window.supabase;
    if (!client) return;
    const { data } = await client.from('ads').select('*').eq('is_active', true).order('id', { ascending: false });
    const ads = (data || []).filter(a => a.position === 'home' || a.position === 'all');
    _renderFrontendAds(ads);
  } catch { _renderFrontendAds([]); }
};

function _renderFrontendAds(ads) {
  document.getElementById('ok-ads-section')?.remove();
  if (!ads.length) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const section = document.createElement('div');
  section.id = 'ok-ads-section';
  section.innerHTML = `
    <div style="padding:16px 16px 12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <h3 style="font-size:1rem;font-weight:900;color:#1C1C1E;margin:0;">💳 Offers & Partnerships</h3>
        <span style="font-size:9px;font-weight:800;color:#9ca3af;background:#F7F5F2;padding:3px 8px;border-radius:99px;letter-spacing:0.08em;text-transform:uppercase;border:1px solid #E5E2DC;">AD</span>
      </div>
      <div class="ok-hscroll">
        ${ads.map(ad => `
          <a href="${ad.link || '#'}" ${ad.link ? 'target="_blank" rel="noopener"' : ''} onclick="window._trackAdClick && window._trackAdClick(${ad.id});${!ad.link ? 'return false;' : ''}" class="ok-ad-banner" style="flex-shrink:0;width:210px;">
            <div style="position:relative;">
              <img src="${ad.img}" alt="${ad.title}" style="width:100%;height:110px;object-fit:cover;display:block;" onerror="this.style.display='none'">
              <span class="ok-ad-badge">AD</span>
              ${ad.badge ? `<span style="position:absolute;bottom:7px;left:7px;background:rgba(0,0,0,0.6);color:white;font-size:9px;font-weight:800;padding:2px 8px;border-radius:99px;">${ad.badge}</span>` : ''}
            </div>
            <div style="padding:9px 12px 11px;">
              <div style="font-weight:800;font-size:12px;color:#1C1C1E;">${ad.title}</div>
              ${ad.subtitle ? `<div style="font-size:10px;color:#6B6A68;margin-top:2px;">${ad.subtitle}</div>` : ''}
              <div style="margin-top:7px;font-size:10px;font-weight:700;color:#e11d48;">Learn More →</div>
            </div>
          </a>`).join('')}
      </div>
    </div>`;
  const anchor = homeView.querySelector('.mt-4.bg-white.p-4');
  if (anchor) anchor.insertAdjacentElement('afterend', section);
  else homeView.appendChild(section);
}

window._trackAdClick = async function(id) {
  try {
    const client = window.dbClient || window.supabase;
    if (!client) return;
    const { data } = await client.from('ads').select('clicks').eq('id', id).maybeSingle();
    if (data) await client.from('ads').update({ clicks: (data.clicks || 0) + 1 }).eq('id', id);
  } catch {}
};

window.copyAdsSQLv6 = function() {
  const sql = `CREATE TABLE IF NOT EXISTS public.ads (id BIGSERIAL PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT, img TEXT NOT NULL, link TEXT, badge TEXT, position TEXT DEFAULT 'home', is_active BOOLEAN DEFAULT true, clicks INTEGER DEFAULT 0, created_by TEXT, created_at TIMESTAMPTZ DEFAULT NOW());\nALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "public_read" ON public.ads FOR SELECT USING (true);\nCREATE POLICY "admin_write" ON public.ads FOR ALL USING (true) WITH CHECK (true);`;
  navigator.clipboard?.writeText(sql).then(() => typeof showToast === 'function' && showToast('✅ SQL copied!')).catch(() => {});
};

window.loadAdminAds = async function() {
  const container = document.getElementById('admin-ads-list');
  if (!container) return;
  container.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i></div>';
  try {
    const client = window.dbClient || window.supabase;
    if (!client) throw new Error('DB not ready');
    const { data, error } = await client.from('ads').select('*').order('id', { ascending: false });
    if (error) throw error;
    const all = data || [];
    if (!all.length) { container.innerHTML = '<div class="text-center py-10 text-gray-400"><i class="fas fa-ad text-4xl mb-3"></i><p>No ads yet.</p></div>'; return; }
    container.innerHTML = all.map(ad => `
      <div class="ad-card-admin">
        <div class="flex gap-3">
          <img src="${ad.img}" onerror="this.src='https://placehold.co/80x60/f3f4f6/9ca3af?text=Ad'" style="width:80px;height:60px;object-fit:cover;border-radius:8px;border:1px solid #E5E2DC;flex-shrink:0;">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1"><span class="font-bold text-sm truncate">${ad.title}</span><span class="text-[10px] font-bold px-2 py-0.5 rounded-full border ${ad.is_active ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-400 bg-gray-50 border-gray-200'}">${ad.is_active ? '● Active' : '○ Inactive'}</span></div>
            <div class="text-[10px] text-gray-400">Position: <strong>${ad.position}</strong> · Clicks: <strong>${ad.clicks||0}</strong></div>
          </div>
        </div>
        <div class="flex gap-2 mt-3">
          <button onclick="window.toggleAdActiveV6 && window.toggleAdActiveV6(${ad.id},${!ad.is_active})" class="flex-1 text-xs py-2 rounded-lg font-bold border ${ad.is_active ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}">${ad.is_active ? 'Deactivate' : 'Activate'}</button>
          <button onclick="window.deleteAdV6 && window.deleteAdV6(${ad.id})" class="flex-1 text-xs py-2 rounded-lg font-bold bg-gray-50 text-gray-600 border border-gray-200">Delete</button>
        </div>
      </div>`).join('');
  } catch (err) { container.innerHTML = `<div class="text-center text-red-500 py-6"><p>${err.message}</p><button onclick="copyAdsSQLv6()" class="mt-3 text-xs bg-rose-600 text-white px-4 py-2 rounded-lg font-bold">📋 SQL Copy karo</button></div>`; }
};

window.toggleAdActiveV6 = async function(id, isActive) {
  try { await (window.dbClient||window.supabase).from('ads').update({is_active:isActive}).eq('id',id); typeof showToast === 'function' && showToast(isActive ? '✅ Ad activated' : '🔴 Ad deactivated'); window.loadAdminAds(); window.loadAdsForHome(); } catch (err) { typeof showToast === 'function' && showToast('❌ ' + err.message); }
};
window.deleteAdV6 = async function(id) {
  if (!confirm('Delete this ad?')) return;
  try { await (window.dbClient||window.supabase).from('ads').delete().eq('id',id); typeof showToast === 'function' && showToast('🗑️ Deleted'); window.loadAdminAds(); window.loadAdsForHome(); } catch (err) { typeof showToast === 'function' && showToast('❌ ' + err.message); }
};
window.adminCreateAdV6 = async function() {
  const title = document.getElementById('new-ad-title')?.value.trim();
  const img = document.getElementById('new-ad-img')?.value.trim();
  if (!title || !img) return typeof showToast === 'function' && showToast('Title aur image required');
  const payload = { title, img, subtitle: document.getElementById('new-ad-subtitle')?.value.trim()||null, link: document.getElementById('new-ad-link')?.value.trim()||null, badge: document.getElementById('new-ad-badge')?.value.trim()||null, position: document.getElementById('new-ad-position')?.value||'home', is_active: true };
  try {
    const { error } = await (window.dbClient||window.supabase).from('ads').insert([payload]);
    if (error) throw error;
    typeof showToast === 'function' && showToast('✅ Ad created!');
    ['new-ad-title','new-ad-subtitle','new-ad-img','new-ad-link','new-ad-badge'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    window.loadAdminAds(); window.loadAdsForHome();
  } catch (err) { typeof showToast === 'function' && showToast('❌ ' + err.message); }
};
window.uploadAdImageV6 = async function(event) {
  const file = event.target.files[0]; if (!file) return;
  const statusEl = document.getElementById('ad-upload-status');
  if (statusEl) statusEl.classList.remove('hidden');
  const fd = new FormData(); fd.append('image', file);
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${window.IMGBB_KEY || '3949e4873d8510691ee63026d22eeb75'}`, { method:'POST', body:fd });
    const json = await res.json();
    if (json.success) { const inp = document.getElementById('new-ad-img'); if (inp) inp.value = json.data.url; typeof showToast === 'function' && showToast('✅ Uploaded!'); }
  } catch {} finally { if (statusEl) statusEl.classList.add('hidden'); event.target.value = ''; }
};


/* ═══════════════════════════════════════════════════════════════
   SECTION 10 — HOME SECTIONS (v5 features)
   ═══════════════════════════════════════════════════════════════ */
function _renderHomePromoBanner() {
  if (document.getElementById('ok-promo-banner-strip')) return;
  const homeView = document.getElementById('view-home'); if (!homeView) return;
  const banner = document.createElement('div');
  banner.id = 'ok-promo-banner-strip';
  banner.innerHTML = `<strong>FREE SHIPPING</strong> ON ORDERS OVER <strong>₹500</strong> &nbsp;•&nbsp; NEW STYLES JUST ARRIVED! &nbsp;•&nbsp; <strong>COD AVAILABLE</strong>`;
  homeView.insertBefore(banner, homeView.firstChild);
}

function _renderTrustStrip() {
  if (document.getElementById('ok-trust-strip')) return;
  const homeView = document.getElementById('view-home'); if (!homeView) return;
  const strip = document.createElement('div');
  strip.id = 'ok-trust-strip';
  strip.innerHTML = `<div class="ok-trust-item"><i class="fas fa-truck"></i><div><strong>Free Shipping</strong><span>Orders over ₹500</span></div></div><div class="ok-trust-item"><i class="fas fa-undo-alt"></i><div><strong>Easy Exchange</strong><span>7 day policy</span></div></div><div class="ok-trust-item"><i class="fas fa-tag"></i><div><strong>Daily Deals</strong><span>Save up to 60% off</span></div></div><div class="ok-trust-item"><i class="fas fa-headset"></i><div><strong>24/7 Support</strong><span>We're here to help</span></div></div>`;
  const carousel = document.getElementById('banner-carousel');
  if (carousel) carousel.insertAdjacentElement('afterend', strip);
}

function _renderShopByCategorySection() {
  if (document.getElementById('ok-shopco-cats')) return;
  const homeView = document.getElementById('view-home'); if (!homeView) return;
  const catData = [
    { name:'Men', img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=533&fit=crop&q=80', action:"openCategoryPage('Men')" },
    { name:'Women', img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop&q=80', action:"openCategoryPage('Women')" },
    { name:'Footwear', img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&q=80', action:"openSubcatProducts('Men','Sneakers')" },
    { name:'Accessories', img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80', action:"openCategoryPage('Accessories')" },
  ];
  const section = document.createElement('div');
  section.id = 'ok-shopco-cats';
  section.innerHTML = `<h2>Shop By Category</h2><div class="ok-cat-grid">${catData.map(c=>`<div class="ok-cat-card" onclick="${c.action}"><img src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.src='https://placehold.co/300x400/f3f4f6/9ca3af?text=${c.name}'"><div class="ok-cat-card-label">${c.name}</div></div>`).join('')}</div><button class="ok-viewall-btn" onclick="navigate('shop')">View All Categories</button>`;
  const trustStrip = document.getElementById('ok-trust-strip');
  if (trustStrip) trustStrip.insertAdjacentElement('afterend', section);
}

function _renderUnbeatableSection() {
  if (document.getElementById('ok-unbeatable-section')) return;
  const homeView = document.getElementById('view-home'); if (!homeView) return;
  const cheap = [...(_getAllProducts())].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 12);
  if (!cheap.length) return;
  const section = document.createElement('div');
  section.id = 'ok-unbeatable-section';
  section.style.cssText = 'background:linear-gradient(135deg,#0a0a0a,#1a1200,#0a0a0a);';
  section.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
      <div><div style="font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:4px;">AI Curated</div><h3 style="font-size:1.2rem;font-weight:900;color:white;margin:0;line-height:1.15;">🔥 Unbeatable Low Prices</h3></div>
      <button onclick="navigate('shop')" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;border:none;padding:8px 16px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;">View All →</button>
    </div>
    <div class="ok-hscroll">
      ${cheap.map(p => {
        const img = p.imgs?.[0]||p.img||'https://placehold.co/145x175/1a1200/C9A84C?text=OK';
        const oldP = p.oldprice||Math.round(p.price*1.4);
        const disc = Math.round(((oldP-p.price)/oldP)*100);
        return `<div class="ok-unbeat-card" onclick="openProductPage(${p.id})"><div class="ok-unbeat-card-img-wrap"><img src="${img}" loading="lazy" onerror="this.src='https://placehold.co/145x175'"><div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#e11d48,#be123c);color:white;font-size:9px;font-weight:900;padding:3px 7px;border-radius:99px;">${disc}% OFF</div></div><div style="padding:8px 4px;"><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div><div style="display:flex;align-items:center;gap:5px;margin-top:3px;"><span style="font-size:13px;font-weight:900;color:#C9A84C;">₹${p.price}</span><span style="font-size:10px;text-decoration:line-through;color:rgba(255,255,255,0.35);">₹${oldP}</span></div></div></div>`;
      }).join('')}
    </div>`;
  const trending = homeView.querySelector('.mt-4.bg-white.p-4');
  if (trending) trending.insertAdjacentElement('beforebegin', section);
  else homeView.appendChild(section);
}

function _renderFooter() {
  if (document.getElementById('ok-site-footer')) return;
  const main = document.getElementById('app-content'); if (!main) return;
  const footer = document.createElement('div');
  footer.id = 'ok-site-footer';
  footer.style.cssText = 'padding:28px 20px 120px;text-align:center;';
  footer.innerHTML = `<span class="footer-brand" style="font-size:1.1rem;font-weight:900;display:block;margin-bottom:8px;">OutfitKart</span><p style="font-size:11px;color:#9ca3af;margin:0 0 8px;">Premium Fashion at Best Prices</p><div class="footer-links" style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 0;"><a href="#" onclick="openProfilePage('about');return false;">About Us</a><a href="#" onclick="openProfilePage('terms');return false;">Terms</a><a href="#" onclick="openProfilePage('privacy');return false;">Privacy</a><a href="#" onclick="openProfilePage('exchange-policy');return false;">Exchange Policy</a><a href="#" onclick="openWhatsAppSupport&&openWhatsAppSupport();return false;">Support</a></div><div style="display:flex;justify-content:center;gap:16px;margin:12px 0;"><a href="https://www.instagram.com/outfitkart_official?igsh=MTdlaG1jem56YWRpeQ==" target="_blank" style="color:#e1306c;font-size:20px;"><i class="fab fa-instagram"></i></a><a href="https://t.me/outfitkart" target="_blank" style="color:#0088cc;font-size:20px;"><i class="fab fa-telegram"></i></a><a href="https://youtube.com/@outfitkart-official?si=SJOr76KDH_H99JDt" target="_blank" style="color:#ff0000;font-size:20px;"><i class="fab fa-youtube"></i></a></div><div class="footer-copy" style="font-size:10px;margin-top:10px;">© 2026 OutfitKart. All rights reserved. Made with ❤️ in India 🇮🇳</div>`;
  main.appendChild(footer);
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 11 — CANCEL/EXCHANGE (v5 patched versions)
   ═══════════════════════════════════════════════════════════════ */
const CANCEL_REASONS_V = ['Product ki zarurat nahi rahi','Galat product order ho gaya','Better price mili kahin aur','Delivery time zyada lag rahi','Duplicate order ho gaya','Address galat daal diya','Kuch aur reason'];
const EXCHANGE_REASONS_V = ['Size theek nahi tha','Color pasand nahi aaya','Quality expectations se alag','Product damaged tha','Galat product mila','Kuch aur reason'];

window.cancelOrder = async function(orderId) {
  orderId = String(orderId || '').trim();
  if (!orderId) { typeof showToast === 'function' && showToast('❌ Invalid order'); return; }
  const order = (window.ordersDb || []).find(o => String(o.id) === orderId);
  if (!order) return typeof showToast === 'function' && showToast('Order not found.');
  if (order.status !== 'Processing') return typeof showToast === 'function' && showToast('Only Processing orders can be cancelled.');
  _showCancelReasonModalV(orderId, order);
};

function _showCancelReasonModalV(orderId, order) {
  document.getElementById('ok-cancel-v-modal')?.remove();
  const paymode = (order.paymentmode || '').toUpperCase();
  const isPaid = ['UPI','CARD','WALLET','WALLET-PAY'].includes(paymode);
  const refundInfo = isPaid ? `<div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:10px 14px;margin-bottom:16px;font-size:11px;color:#1e40af;"><i class="fas fa-wallet" style="margin-right:4px;"></i>Aapka <strong>₹${order.total}</strong> refund <strong>OutfitKart Wallet</strong> mein credit hoga (24-48 hrs).</div>` : '';
  const modal = document.createElement('div');
  modal.id = 'ok-cancel-v-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:500;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  modal.innerHTML = `<div style="background:white;border-radius:24px 24px 0 0;padding:24px;width:100%;max-width:480px;animation:okSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both;max-height:85vh;overflow-y:auto;">
    <div style="width:40px;height:4px;background:#e5e7eb;border-radius:99px;margin:0 auto 20px;"></div>
    <h3 style="font-weight:900;font-size:1rem;color:#111827;margin:0 0 16px;">Cancel Reason</h3>
    <select id="cancel-reason-v-sel" style="width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;background:white;outline:none;color:#111827;margin-bottom:10px;" onchange="document.getElementById('cancel-custom-v').style.display=this.value==='Kuch aur reason'?'block':'none'">
      <option value="">-- Reason chuniye --</option>
      ${CANCEL_REASONS_V.map(r => `<option value="${r}">${r}</option>`).join('')}
    </select>
    <textarea id="cancel-custom-v" placeholder="Apna reason likhein..." style="display:none;width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;height:80px;outline:none;resize:none;margin-bottom:10px;box-sizing:border-box;"></textarea>
    ${refundInfo}
    <div style="display:flex;gap:10px;">
      <button onclick="document.getElementById('ok-cancel-v-modal').remove()" style="flex:1;border:2px solid #e5e7eb;background:white;color:#374151;padding:14px;border-radius:14px;font-weight:800;font-size:14px;cursor:pointer;">Back</button>
      <button onclick="_submitCancelV('${orderId}')" style="flex:1;background:linear-gradient(135deg,#e11d48,#be123c);color:white;padding:14px;border-radius:14px;font-weight:900;font-size:14px;border:none;cursor:pointer;">Cancel Order</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

window._submitCancelV = async function(orderId) {
  const sel = document.getElementById('cancel-reason-v-sel');
  const cust = document.getElementById('cancel-custom-v');
  let reason = sel?.value || '';
  if (reason === 'Kuch aur reason') reason = cust?.value.trim() || 'Kuch aur reason';
  if (!reason) return typeof showToast === 'function' && showToast('Please select a reason');
  document.getElementById('ok-cancel-v-modal')?.remove();
  const SUPABASE_URL = window.SUPABASE_URL || '';
  const SUPABASE_KEY = window.SUPABASE_KEY || '';
  const order = (window.ordersDb || []).find(o => String(o.id) === orderId);
  if (!order) return;
  typeof showToast === 'function' && showToast('⏳ Cancelling...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Prefer': 'return=representation' },
      body: JSON.stringify({ status: 'Cancelled', cancel_reason: reason, refund_status: 'pending_wallet', cancelled_at: new Date().toISOString() })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (typeof cancelReferralForOrder === 'function') await cancelReferralForOrder(orderId);
    const cancelModal = document.getElementById('order-cancel-modal');
    const refundEl = document.getElementById('cancel-refund-msg');
    if (refundEl) { refundEl.textContent = `💰 ₹${order.total} aapke OutfitKart Wallet mein credit hoga (24-48 hrs).`; refundEl.classList.remove('hidden'); }
    if (cancelModal) { cancelModal.classList.remove('hidden'); cancelModal.classList.add('flex'); }
    if (typeof renderOrdersList === 'function') renderOrdersList();
  } catch (err) { typeof showToast === 'function' && showToast('❌ ' + err.message); }
};

window.startExchange = function(orderId) {
  orderId = String(orderId || '').trim();
  const order = (window.ordersDb || []).find(o => String(o.id) === orderId);
  if (!order || order.status !== 'Delivered') return typeof showToast === 'function' && showToast('Exchange only for delivered orders.');
  const oldPrice = order.total || 0;
  window._pendingExchangeOrder = order;
  window._pendingExchangeOldPrice = oldPrice;
  const modal = document.getElementById('exchange-confirm-modal');
  const infoEl = document.getElementById('exchange-confirm-info');
  if (infoEl) infoEl.textContent = `Order #${orderId} · Exchange Value: ₹${oldPrice}`;
  if (modal) { modal.classList.remove('hidden'); modal.classList.add('flex'); }
};


/* ═══════════════════════════════════════════════════════════════
   SECTION 12 — PROFILE STATS FIX
   ═══════════════════════════════════════════════════════════════ */
function _refreshProfileStats() {
  try {
    const user = window.currentUser || _getStoredUser();
    if (!user) return;
    const orders = window.ordersDb || [];
    const orderCount = orders.filter(o => o.status !== 'Cancelled').length;
    const elOrders = document.getElementById('stat-orders-count');
    if (elOrders) elOrders.textContent = orderCount;
    const wallet = user.wallet != null ? user.wallet : (window.walletBalance || 0);
    const elWallet = document.getElementById('stat-wallet-bal');
    if (elWallet) { elWallet.textContent = '₹' + wallet; elWallet.style.color = '#2563eb'; }
    const profWallet = document.getElementById('prof-wallet');
    if (profWallet) profWallet.textContent = '₹' + wallet;
    const menuWalletBadge = document.getElementById('menu-wallet-badge');
    if (menuWalletBadge) { menuWalletBadge.textContent = '₹' + wallet; if (wallet > 0) menuWalletBadge.classList.remove('hidden'); }
    const checkoutWallet = document.getElementById('checkout-wallet-balance');
    if (checkoutWallet) checkoutWallet.textContent = '₹' + wallet;
    let refEarnings = 0;
    if (window.referralsDb?.length) refEarnings = window.referralsDb.filter(r => r.status === 'confirmed').reduce((s, r) => s + (r.commission || 0), 0);
    else refEarnings = user.referral_earnings || 0;
    const elRef = document.getElementById('stat-referral-earn');
    if (elRef) { elRef.textContent = '₹' + refEarnings; elRef.style.color = '#16a34a'; }
    const refBadge = document.getElementById('referral-earnings-badge');
    if (refBadge) refBadge.textContent = '₹' + refEarnings;
  } catch {}
}
window._refreshProfileStats = _refreshProfileStats;

// Hook into checkAuthUI
(function() {
  const waitFn = setInterval(() => {
    if (typeof window.checkAuthUI !== 'function') return;
    clearInterval(waitFn);
    if (window._statsCheckAuthHooked) return;
    window._statsCheckAuthHooked = true;
    const orig = window.checkAuthUI;
    window.checkAuthUI = async function() {
      const r = await orig.apply(this, arguments);
      setTimeout(_refreshProfileStats, 400);
      setTimeout(_refreshProfileStats, 1200);
      return r;
    };
  }, 120);
})();


/* ═══════════════════════════════════════════════════════════════
   SECTION 13 — REFERRAL CHANNELS IN PROFILE
   ═══════════════════════════════════════════════════════════════ */
function _injectChannelsInProfile() {
  const profileHome = document.getElementById('profile-home');
  if (!profileHome || document.getElementById('ok-profile-channels')) return;
  const channelDiv = document.createElement('div');
  channelDiv.id = 'ok-profile-channels';
  channelDiv.style.cssText = 'margin: 0 16px 16px;';
  channelDiv.innerHTML = `<div id="ok-ref-channel-box"><div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🔔 Exclusive Deals & Codes</div><p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0 0 12px;line-height:1.5;">Hamare channels join karo — flash sales, promo codes & early access pao!</p><div style="display:flex;gap:10px;"><a href="https://t.me/outfitkart" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);"><i class="fab fa-telegram"></i> Telegram</a><a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);"><i class="fab fa-whatsapp"></i> WhatsApp</a></div><div style="display:flex;gap:10px;margin-top:10px;"><a href="https://www.instagram.com/outfitkart_official?igsh=MTdlaG1jem56YWRpeQ==" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);"><i class="fab fa-instagram"></i> Instagram</a><a href="https://youtube.com/@outfitkart-official?si=SJOr76KDH_H99JDt" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#ff0000,#cc0000);"><i class="fab fa-youtube"></i> YouTube</a></div></div></div>`;
  const lastSection = profileHome.querySelectorAll('.bg-white.rounded-2xl.shadow-sm.border.overflow-hidden.mb-4')[2];
  if (lastSection) lastSection.insertAdjacentElement('beforebegin', channelDiv);
  else profileHome.appendChild(channelDiv);
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 14 — VOICE WELCOME
   ═══════════════════════════════════════════════════════════════ */
(function _setupVoiceWelcome() {
  if (window._voiceWelcomeReady) return;
  window._voiceWelcomeReady = true;
  function _speakWelcome(userName, isNew) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const msg = isNew
        ? 'Welcome to Outfit Kart, ' + userName + '! We are so happy to have you here. Explore our amazing fashion collection!'
        : 'Welcome back to Outfit Kart, ' + userName + '! Great to see you again. Happy shopping!';
      function _doSpeak() {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = 'en-IN'; utterance.rate = 0.90; utterance.pitch = 1.3; utterance.volume = 1.0;
        const voices = window.speechSynthesis.getVoices();
        const tests = [
          v => v.lang === 'en-IN' && /female|woman|girl/i.test(v.name),
          v => v.lang === 'en-IN' && /raveena|neerja|heera|priya|aditi/i.test(v.name),
          v => v.lang === 'en-IN',
          v => v.lang.startsWith('en') && /female|woman|samantha|victoria|karen|susan|zira/i.test(v.name),
          v => v.lang.startsWith('en'),
        ];
        let chosen = null;
        for (const test of tests) { chosen = voices.find(test); if (chosen) break; }
        if (chosen) utterance.voice = chosen;
        window.speechSynthesis.speak(utterance);
      }
      if (window.speechSynthesis.getVoices().length > 0) _doSpeak();
      else { window.speechSynthesis.addEventListener('voiceschanged', function _onV() { window.speechSynthesis.removeEventListener('voiceschanged', _onV); _doSpeak(); }); setTimeout(_doSpeak, 500); }
    } catch {}
  }
  window._speakWelcome = _speakWelcome;
  let _prevMobile = (function() { try { const s = localStorage.getItem('outfitkart_session'); return s ? JSON.parse(s).mobile : null; } catch { return null; } })();
  const origSet2 = localStorage.setItem.bind(localStorage);
  if (!window._voiceLsPatched) {
    window._voiceLsPatched = true;
    localStorage.setItem = function(key, value) {
      origSet2(key, value);
      if (key === 'outfitkart_session') {
        try {
          const curr = JSON.parse(value);
          if (curr && curr.mobile && curr.mobile !== _prevMobile) {
            const isNew = !_prevMobile;
            _prevMobile = curr.mobile;
            setTimeout(() => _speakWelcome(curr.name || 'Friend', isNew), 1500);
          }
        } catch {}
      }
    };
  }
})();


/* ═══════════════════════════════════════════════════════════════
   SECTION 15 — ADMIN ADS TAB INJECTION
   ═══════════════════════════════════════════════════════════════ */
function _injectAdminAdsTab() {
  if (!document.getElementById('btn-admin-ads')) {
    const payoutBtn = document.getElementById('btn-admin-payout');
    if (payoutBtn) {
      const btn = document.createElement('button');
      btn.id = 'btn-admin-ads';
      btn.onclick = () => typeof switchAdminTab === 'function' && switchAdminTab('ads');
      btn.className = 'admin-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all';
      btn.innerHTML = `<span class="nav-icon"><i class="fas fa-ad"></i></span><span class="flex-1 text-left">Advertisements</span><span class="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">ADS</span>`;
      payoutBtn.insertAdjacentElement('beforebegin', btn);
    }
  }
  if (!document.getElementById('admin-tab-ads')) {
    const adminContent = document.querySelector('#view-admin .flex-1.p-4, #view-admin .flex-1.p-4.md\\:p-6');
    if (adminContent) {
      const tab = document.createElement('div');
      tab.id = 'admin-tab-ads';
      tab.className = 'admin-content-tab hidden space-y-4';
      tab.innerHTML = `<div class="bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg text-blue-700 flex items-center gap-2"><i class="fas fa-ad"></i> Advertisement Manager</h3>
          <div class="flex gap-2">
            <button onclick="loadAdminAds()" class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold border border-blue-200"><i class="fas fa-sync-alt mr-1"></i>Refresh</button>
            <button onclick="copyAdsSQLv6()" class="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold border border-gray-200"><i class="fas fa-database mr-1"></i>SQL</button>
          </div>
        </div>
        <div class="ok-ads-sql-info mb-4"><p class="text-xs font-bold text-blue-800 mb-1"><i class="fas fa-database mr-1"></i>Supabase ads table chahiye</p><button onclick="copyAdsSQLv6()" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">Copy SQL</button></div>
        <div class="bg-gray-50 border rounded-xl p-4 mb-4">
          <h4 class="font-bold text-sm mb-3 flex items-center gap-2"><i class="fas fa-plus-circle text-blue-500"></i> New Advertisement</h4>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Title *</label><input type="text" id="new-ad-title" placeholder="e.g. HDFC Card" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"></div>
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Subtitle</label><input type="text" id="new-ad-subtitle" placeholder="₹500 cashback" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"></div>
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Image URL *</label><input type="url" id="new-ad-img" placeholder="https://..." class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"></div>
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Link URL</label><input type="url" id="new-ad-link" placeholder="https://..." class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"></div>
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Badge</label><input type="text" id="new-ad-badge" placeholder="2% Cashback" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"></div>
            <div><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Position</label><select id="new-ad-position" class="w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none"><option value="home">Home</option><option value="shop">Shop</option><option value="all">All</option></select></div>
          </div>
          <div class="mb-3"><label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Upload Image</label><input type="file" accept="image/*" onchange="uploadAdImageV6(event)" class="w-full border rounded-xl p-2 text-sm bg-white cursor-pointer"><div id="ad-upload-status" class="text-xs font-bold text-blue-500 mt-1 hidden"><i class="fas fa-spinner fa-spin mr-1"></i>Uploading...</div></div>
          <button onclick="adminCreateAdV6()" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95"><i class="fas fa-plus mr-2"></i>Create Ad</button>
        </div>
        <div id="admin-ads-list"><div class="text-center py-10 text-gray-400"><i class="fas fa-ad text-4xl mb-3"></i><p>Click Refresh to load ads</p></div></div>
      </div>`;
      adminContent.appendChild(tab);
    }
  }
  // Patch switchAdminTab for ads
  const orig = window.switchAdminTab;
  if (orig && !window._adsSwitchPatched) {
    window._adsSwitchPatched = true;
    window.switchAdminTab = function(tab) {
      if (tab === 'ads') {
        document.querySelectorAll('.admin-content-tab').forEach(el => { el.style.display='none'; el.classList.add('hidden'); });
        const t = document.getElementById('admin-tab-ads');
        if (t) { t.style.display='block'; t.classList.remove('hidden'); }
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-admin-ads')?.classList.add('active');
        window.loadAdminAds();
        return;
      }
      orig(tab);
    };
  }
}


/* ═══════════════════════════════════════════════════════════════
   SECTION 16 — MUTATION OBSERVER & NAVIGATE PATCHES
   ═══════════════════════════════════════════════════════════════ */
function _initObservers() {
  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type !== 'attributes' || m.attributeName !== 'class') return;
      const el = m.target;
      if (el.id === 'user-dashboard' && !el.classList.contains('hidden')) {
        setTimeout(() => { _injectChannelsInProfile(); _injectLevelBadge(parseInt(document.getElementById('stat-orders-count')?.textContent)||0); }, 200);
      }
      if (el.id === 'view-home' && !el.classList.contains('hidden')) {
        setTimeout(() => { _renderHomePromoBanner(); _renderTrustStrip(); _renderShopByCategorySection(); }, 200);
        setTimeout(() => _renderUnbeatableSection(), 800);
        setTimeout(() => loadAdsForHome(), 1000);
      }
      if (el.id === 'profile-page-influencer' && !el.classList.contains('hidden')) {
        setTimeout(() => window.loadInfluencerRequests(), 100);
      }
    });
  });
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
}

function _patchNavigateForAll() {
  if (window._navPatchedFull) return;
  window._navPatchedFull = true;
  const origNav = window.navigate;
  if (!origNav) return;
  window.navigate = function(view, ...args) {
    origNav(view, ...args);
    if (view === 'home') {
      setTimeout(() => { _renderHomePromoBanner(); _renderTrustStrip(); _renderShopByCategorySection(); }, 300);
      setTimeout(() => _renderUnbeatableSection(), 800);
      setTimeout(() => window.loadAdsForHome(), 1000);
      setTimeout(_renderFooter, 500);
    }
    if (view === 'profile') {
      setTimeout(() => { const u = _getStoredUser(); if (u) _showProfileDashboard(u); }, 200);
      setTimeout(() => _injectLevelBadge(parseInt(document.getElementById('stat-orders-count')?.textContent)||0), 400);
      setTimeout(_injectChannelsInProfile, 300);
      setTimeout(_refreshProfileStats, 500);
      setTimeout(_refreshProfileStats, 1500);
    }
    if (view === 'product') {
      setTimeout(() => { const id = window.viewingProductId; if (id) _attachLightboxToPDP(id); }, 400);
    }
    if (typeof closeSearchOverlay === 'function') closeSearchOverlay();
  };
}


/* ═══════════════════════════════════════════════════════════════
   MASTER INIT
   ═══════════════════════════════════════════════════════════════ */
function _initMergedPatch() {
  // 1. Profile z-index fix
  document.querySelectorAll('.profile-page').forEach(p => { p.style.zIndex = '200'; });

  // 2. Search overlay
  _initSearchOverlay();
  _injectMobileSearchTrigger();
  // Hide old mobile search
  const oldBar = document.querySelector('#view-home .md\\:hidden.p-3.bg-white.z-20');
  if (oldBar) oldBar.style.display = 'none';

  // 3. Lightbox
  _initLightbox();

  // 4. PWA fix
  _fixPWAInstall();

  // 5. Auth patches
  _patchAuthFunctions();

  // 6. Level badge watch
  _watchOrderCount();

  // 7. Admin ads tab
  setTimeout(_injectAdminAdsTab, 700);

  // 8. Home sections
  setTimeout(() => {
    _renderHomePromoBanner();
    _renderTrustStrip();
    _renderShopByCategorySection();
    _renderFooter();
  }, 500);
  setTimeout(() => {
    _renderUnbeatableSection();
    window.loadAdsForHome();
  }, 1200);

  // 9. Navigate patches
  _patchNavigateForAll();

  // 10. Observers
  _initObservers();

  // 11. Profile stats polling
  setTimeout(_refreshProfileStats, 1500);
  setTimeout(_refreshProfileStats, 3500);
  setTimeout(_refreshProfileStats, 7000);

  // 12. Influencer submissions on page open
  const infPage = document.getElementById('profile-page-influencer');
  if (infPage) {
    new MutationObserver(() => {
      if (!infPage.classList.contains('hidden')) setTimeout(window.loadInfluencerRequests, 100);
    }).observe(infPage, { attributes: true, attributeFilter: ['class'] });
  }

  // 13. PDP lightbox on product open
  const origOpenPP = window.openProductPage;
  if (origOpenPP && !window._pdpLbPatched) {
    window._pdpLbPatched = true;
    window.openProductPage = async function(id, isGold) {
      await origOpenPP(id, isGold);
      setTimeout(() => _attachLightboxToPDP(id), 350);
    };
  }

  console.log('%c🛍️ OutfitKart MegaPatch MERGED v5+v6+Fixes ✅ ALL SYSTEMS GO', 'background:#e11d48;color:white;font-weight:900;font-size:12px;padding:4px 12px;border-radius:6px;');
}

/* Boot */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_initMergedPatch, 600));
} else {
  setTimeout(_initMergedPatch, 600);
}

/* Global exports */
Object.assign(window, {
  openProfilePage: window.openProfilePage,
  closeProfilePage: window.closeProfilePage,
  openSearchOverlay, closeSearchOverlay,
  openLightbox: window.openLightbox,
  closeLightbox: window.closeLightbox,
  lightboxNav: window.lightboxNav,
  loadAdsForHome: window.loadAdsForHome,
  loadAdminAds: window.loadAdminAds,
  adminCreateAdV6: window.adminCreateAdV6,
  copyAdsSQLv6: window.copyAdsSQLv6,
  toggleAdActiveV6: window.toggleAdActiveV6,
  deleteAdV6: window.deleteAdV6,
  uploadAdImageV6: window.uploadAdImageV6,
  _trackAdClick: window._trackAdClick,
  _okSearchHandler,
  _okSearchFullPage,
  _okVoiceSearch,
  _refreshProfileStats,
  loadInfluencerRequests: window.loadInfluencerRequests,
  cancelOrder: window.cancelOrder,
  startExchange: window.startExchange,
});

/* ================================================================
   SECTION: script-core-patch.js
   ================================================================ */
/* ================================================================
   OutfitKart — FIX PATCH v1.0
   ================================================================
   IS FILE KO mega-patch.js KE BILKUL END MEIN ADD KARO
   YA EK ALAG <script> TAG MEIN LOAD KARO (mega-patch.js ke baad)
   ================================================================

   FIX 1 — Combos category home section mein add
   FIX 2 — Influencer history reliable load (user late-ready fix)
   FIX 3 — Admin panel mein Influencer Requests tab inject
   ================================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────
     FIX 1 — COMBOS CATEGORY HOME SECTION
     Problem: mega-patch ke _renderShopByCategorySection mein
              'Combos' entry missing thi, isliye home se click nahi
              hota tha.
     Solution: Existing section ko rebuild karo Combos ke saath.
  ─────────────────────────────────────────────────────────────── */
  function _fixShopByCategoryWithCombos() {
    // Pehle purana section hata do (agar render ho chuka hai)
    const old = document.getElementById('ok-shopco-cats');
    if (old) old.remove();

    const homeView = document.getElementById('view-home');
    if (!homeView) return;

    const catData = [
      {
        name: 'Men',
        img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=533&fit=crop&q=80',
        action: "openCategoryPage('Men')",
      },
      {
        name: 'Women',
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop&q=80',
        action: "openCategoryPage('Women')",
      },
      {
        name: 'Footwear',
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&q=80',
        action: "openSubcatProducts('Men','Sneakers')",
      },
      {
        name: 'Accessories',
        img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80',
        action: "openCategoryPage('Accessories')",
      },
      // ✅ FIX 1 — Combos yahan add kiya
      {
        name: 'Combos 🎁',
        img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=533&fit=crop&q=80',
        action: "openCategoryPage('Combos')",
      },
    {
    name: 'Perfumes ✨',
    img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=533&fit=crop&q=80',
    action: "openCategoryPage('Perfumes')"
}, 

    ];

    const section = document.createElement('div');
    section.id = 'ok-shopco-cats';
    section.innerHTML = `
      <h2>Shop By Category</h2>
      <div class="ok-cat-grid">
        ${catData
          .map(
            (c) => `
          <div class="ok-cat-card" onclick="${c.action}">
            <img src="${c.img}" alt="${c.name}" loading="lazy"
                 onerror="this.src='https://placehold.co/300x400/f3f4f6/9ca3af?text=${encodeURIComponent(c.name)}'">
            <div class="ok-cat-card-label">${c.name}</div>
          </div>`
          )
          .join('')}
      </div>
      <button class="ok-viewall-btn" onclick="navigate('shop')">View All Categories</button>`;

    const trustStrip = document.getElementById('ok-trust-strip');
    if (trustStrip) {
      trustStrip.insertAdjacentElement('afterend', section);
    } else {
      homeView.appendChild(section);
    }
    console.log('[FIX-PATCH] ✅ Fix 1: Combos category section rebuild ho gaya');
  }

  /* ──────────────────────────────────────────────────────────────
     FIX 2 — INFLUENCER HISTORY RELIABLE LOADER
     Problem: loadInfluencerRequests silently return kar deta tha
              agar window.currentUser abhi ready nahi tha.
     Solution: _getStoredUser se fallback, aur retry mechanism.
  ─────────────────────────────────────────────────────────────── */
  window.loadInfluencerRequests = async function () {
    // currentUser ready nahi toh localStorage se try karo
    if (!window.currentUser) {
      const keys = [
        'outfitkart_user',
        'ok_user',
        'user_data',
        'currentUser',
        'outfitkart_session',
      ];
      for (const k of keys) {
        try {
          const raw = localStorage.getItem(k);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.mobile) {
              window.currentUser = parsed;
              break;
            }
          }
        } catch (_) {}
      }
    }

    if (!window.currentUser) {
      console.warn('[FIX-PATCH] loadInfluencerRequests: user not ready, retrying...');
      setTimeout(window.loadInfluencerRequests, 500);
      return;
    }

    const container = document.getElementById('inf-requests-list');
    const totalEl = document.getElementById('inf-total-earned');
    const countEl = document.getElementById('inf-submissions-count');
    if (!container) return;

    container.innerHTML =
      '<div class="text-center py-6"><i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i></div>';

    try {
      const client = window.dbClient || window.supabase;
      if (!client) throw new Error('DB not ready');

      const { data, error } = await client
        .from('influencer_requests')
        .select('*')
        .eq('mobile', window.currentUser.mobile)
        .order('id', { ascending: false });

      if (error) throw error;

      const all = data || [];
      const approved = all.filter((r) => r.status === 'Approved');
      const totalEarned = approved.reduce((s, r) => s + (r.earnings || 0), 0);

      if (totalEl) totalEl.textContent = `₹${totalEarned}`;
      if (countEl) countEl.textContent = all.length;

      if (!all.length) {
        container.innerHTML = `
          <div class="text-center py-10 text-gray-400">
            <i class="fas fa-video text-4xl mb-3 block opacity-40"></i>
            <p class="font-semibold text-sm">Abhi tak koi submission nahi</p>
            <p class="text-xs mt-1 text-gray-400">Upar form se request submit karo</p>
          </div>`;
        return;
      }

      const BADGE = {
        Pending: 'bg-amber-100 text-amber-700',
        Approved: 'bg-green-100 text-green-700',
        Rejected: 'bg-red-100 text-red-600',
      };
      const ICON = { Pending: '⏳', Approved: '✅', Rejected: '❌' };

      container.innerHTML = all
        .map(
          (r) => `
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
                <span style="font-weight:700;font-size:14px;color:#1f2937;">${r.platform || '—'}</span>
                <span class="${BADGE[r.status] || 'bg-gray-100 text-gray-500'}" style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:9999px;">${ICON[r.status] || ''} ${r.status}</span>
              </div>
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">👁 ${(r.views || 0).toLocaleString()} views${r.submitted_at ? ' · ' + new Date(r.submitted_at).toLocaleDateString('en-IN') : ''}</div>
              ${r.video_url ? `<a href="${r.video_url}" target="_blank" rel="noopener" style="font-size:12px;color:#2563eb;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.video_url}</a>` : ''}
              ${r.description ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;font-style:italic;">"${r.description}"</p>` : ''}
            </div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:16px;font-weight:900;color:${r.status === 'Approved' ? '#16a34a' : '#9ca3af'};">₹${r.earnings || 0}</div>
            </div>
          </div>
          ${r.status === 'Approved' ? `<div style="font-size:12px;color:#16a34a;font-weight:600;margin-top:8px;background:#f0fdf4;border-radius:8px;padding:6px 12px;">✅ ₹${r.earnings} wallet mein credit ho gaya</div>` : ''}
          ${r.status === 'Rejected' && r.reject_reason ? `<div style="font-size:12px;color:#ef4444;margin-top:8px;background:#fef2f2;border-radius:8px;padding:6px 12px;">❌ ${r.reject_reason}</div>` : ''}
        </div>`
        )
        .join('');
    } catch (err) {
      if (container)
        container.innerHTML = `
          <div class="text-center py-6 text-red-400 text-sm">
            <i class="fas fa-exclamation-circle mb-2 block text-2xl"></i>
            ${err.message}
          </div>`;
    }
  };

  console.log('[FIX-PATCH] ✅ Fix 2: loadInfluencerRequests patched with retry + fallback');

  /* ──────────────────────────────────────────────────────────────
     FIX 3 — ADMIN PANEL INFLUENCER REQUESTS TAB
     Problem: Admin ke paas influencer_requests approve/reject
              karne ke liye koi UI nahi tha.
     Solution: Ads tab ki tarah ek naya tab inject karo.
  ─────────────────────────────────────────────────────────────── */

  // Admin side: influencer requests load + approve/reject
  window.loadAdminInfluencer = async function () {
    const container = document.getElementById('admin-inf-list');
    if (!container) return;
    container.innerHTML =
      '<div class="text-center py-8 text-gray-400"><i class="fas fa-spinner fa-spin text-2xl"></i></div>';
    try {
      const client = window.dbClient || window.supabase;
      if (!client) throw new Error('DB not ready');

      const { data, error } = await client
        .from('influencer_requests')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      const all = data || [];

      if (!all.length) {
        container.innerHTML =
          '<div class="text-center py-10 text-gray-400"><i class="fas fa-video text-4xl mb-3 block opacity-40"></i><p>Koi request nahi mili</p></div>';
        return;
      }

      // Stats
      const pending = all.filter((r) => r.status === 'Pending').length;
      const approved = all.filter((r) => r.status === 'Approved').length;
      const totalPayout = all
        .filter((r) => r.status === 'Approved')
        .reduce((s, r) => s + (r.earnings || 0), 0);

      const BADGE_STYLE = {
        Pending: 'background:#fef3c7;color:#92400e;',
        Approved: 'background:#dcfce7;color:#15803d;',
        Rejected: 'background:#fee2e2;color:#dc2626;',
      };

      container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
          <div style="background:#fef3c7;border-radius:12px;padding:12px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:#92400e;">${pending}</div>
            <div style="font-size:11px;font-weight:700;color:#a16207;">Pending</div>
          </div>
          <div style="background:#dcfce7;border-radius:12px;padding:12px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:#15803d;">${approved}</div>
            <div style="font-size:11px;font-weight:700;color:#166534;">Approved</div>
          </div>
          <div style="background:#ede9fe;border-radius:12px;padding:12px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:#7c3aed;">₹${totalPayout}</div>
            <div style="font-size:11px;font-weight:700;color:#6d28d9;">Total Paid</div>
          </div>
        </div>
        ${all
          .map(
            (r) => `
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;">
              <div style="flex:1;min-width:0;">
                <div style="font-weight:800;font-size:14px;color:#111827;margin-bottom:2px;">${r.name || '—'} <span style="font-size:11px;color:#6b7280;font-weight:500;">· ${r.platform || ''}</span></div>
                <div style="font-size:12px;color:#6b7280;">📱 ${r.mobile || '—'}</div>
                <div style="font-size:12px;color:#6b7280;">👁 ${(r.views || 0).toLocaleString()} views · 💰 ₹${r.earnings || 0} potential</div>
                ${r.video_url ? `<a href="${r.video_url}" target="_blank" rel="noopener" style="font-size:11px;color:#2563eb;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:4px;">${r.video_url}</a>` : ''}
                ${r.profile_url ? `<a href="${r.profile_url}" target="_blank" rel="noopener" style="font-size:11px;color:#7c3aed;display:block;margin-top:2px;">🔗 Profile link</a>` : ''}
                ${r.description ? `<p style="font-size:11px;color:#6b7280;margin-top:4px;font-style:italic;">"${r.description}"</p>` : ''}
              </div>
              <span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:9999px;flex-shrink:0;${BADGE_STYLE[r.status] || 'background:#f3f4f6;color:#374151;'}">${r.status}</span>
            </div>
            ${
              r.status === 'Pending'
                ? `<div style="display:flex;gap:8px;margin-top:8px;">
                    <button onclick="adminApproveInfluencer(${r.id},${r.earnings || 0},'${r.mobile}')"
                      style="flex:1;background:#16a34a;color:#fff;border:none;padding:9px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;">
                      ✅ Approve & Credit ₹${r.earnings || 0}
                    </button>
                    <button onclick="adminRejectInfluencer(${r.id})"
                      style="flex:1;background:#ef4444;color:#fff;border:none;padding:9px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;">
                      ❌ Reject
                    </button>
                  </div>`
                : r.status === 'Approved'
                ? `<div style="font-size:12px;color:#16a34a;font-weight:600;background:#f0fdf4;border-radius:8px;padding:6px 12px;">✅ ₹${r.earnings} credited</div>`
                : `<div style="font-size:12px;color:#ef4444;background:#fef2f2;border-radius:8px;padding:6px 12px;">❌ Rejected${r.reject_reason ? ': ' + r.reject_reason : ''}</div>`
            }
          </div>`
          )
          .join('')}`;
    } catch (err) {
      if (container)
        container.innerHTML = `<div class="text-center py-6 text-red-400 text-sm"><i class="fas fa-exclamation-circle mb-2 block text-xl"></i>${err.message}</div>`;
    }
  };

  // Admin: Approve karo aur wallet mein credit karo
  window.adminApproveInfluencer = async function (id, earnings, mobile) {
    if (!confirm(`₹${earnings} approve karein aur wallet mein credit karein?`)) return;
    try {
      const client = window.dbClient || window.supabase;
      // 1. Status update karo
      const { error: e1 } = await client
        .from('influencer_requests')
        .update({ status: 'Approved' })
        .eq('id', id);
      if (e1) throw e1;

      // 2. Wallet credit karo (wallet_balance increment)
      const { data: userData } = await client
        .from('users')
        .select('wallet_balance')
        .eq('mobile', mobile)
        .single();

      if (userData) {
        const newBalance = (userData.wallet_balance || 0) + earnings;
        await client.from('users').update({ wallet_balance: newBalance }).eq('mobile', mobile);
      }

      typeof showToast === 'function' && showToast(`✅ Approved! ₹${earnings} credited to ${mobile}`);
      window.loadAdminInfluencer();
    } catch (err) {
      typeof showToast === 'function' && showToast('❌ ' + err.message);
    }
  };

  // Admin: Reject karo with reason
  window.adminRejectInfluencer = async function (id) {
    const reason = prompt('Rejection reason likhein (optional):') || 'Does not meet requirements';
    try {
      const client = window.dbClient || window.supabase;
      const { error } = await client
        .from('influencer_requests')
        .update({ status: 'Rejected', reject_reason: reason })
        .eq('id', id);
      if (error) throw error;
      typeof showToast === 'function' && showToast('🔴 Request rejected');
      window.loadAdminInfluencer();
    } catch (err) {
      typeof showToast === 'function' && showToast('❌ ' + err.message);
    }
  };

  // Admin tab inject karo
  function _injectAdminInfluencerTab() {
    // Nav button add karo
    if (!document.getElementById('btn-admin-influencer')) {
      // Ads button ke baad insert karo, ya payout ke baad
      const anchor =
        document.getElementById('btn-admin-ads') ||
        document.getElementById('btn-admin-payout');
      if (anchor) {
        const btn = document.createElement('button');
        btn.id = 'btn-admin-influencer';
        btn.className =
          'admin-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all';
        btn.innerHTML = `
          <span class="nav-icon"><i class="fas fa-star"></i></span>
          <span class="flex-1 text-left">Influencer Requests</span>
          <span style="font-size:10px;background:#ede9fe;color:#7c3aed;padding:2px 8px;border-radius:9999px;font-weight:700;" id="inf-pending-badge">...</span>`;
        btn.onclick = () =>
          typeof switchAdminTab === 'function' && switchAdminTab('influencer');
        anchor.insertAdjacentElement('afterend', btn);
        // Pending count badge refresh
        _refreshInfPendingBadge();
      }
    }

    // Tab content inject karo
    if (!document.getElementById('admin-tab-influencer')) {
      const adminContent = document.querySelector(
        '#view-admin .flex-1.p-4, #view-admin .flex-1.p-4.md\\:p-6, #view-admin > div > div:last-child'
      );
      if (adminContent) {
        const tab = document.createElement('div');
        tab.id = 'admin-tab-influencer';
        tab.className = 'admin-content-tab hidden space-y-4';
        tab.innerHTML = `
          <div style="background:#fff;padding:20px;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid #f3f4f6;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
              <h3 style="font-weight:800;font-size:18px;color:#7c3aed;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-star"></i> Influencer Requests
              </h3>
              <button onclick="loadAdminInfluencer()"
                style="font-size:12px;background:#ede9fe;color:#7c3aed;padding:6px 14px;border-radius:10px;font-weight:700;border:1px solid #ddd6fe;cursor:pointer;">
                <i class="fas fa-sync-alt" style="margin-right:4px;"></i>Refresh
              </button>
            </div>
            <div id="admin-inf-list">
              <div class="text-center py-10 text-gray-400">
                <i class="fas fa-star text-4xl mb-3 block opacity-30"></i>
                <p>Click Refresh to load requests</p>
              </div>
            </div>
          </div>`;
        adminContent.appendChild(tab);
      }
    }

    // switchAdminTab patch karo influencer ke liye
    const origSwitch = window.switchAdminTab;
    if (origSwitch && !window._infSwitchPatched) {
      window._infSwitchPatched = true;
      window.switchAdminTab = function (tab) {
        if (tab === 'influencer') {
          document.querySelectorAll('.admin-content-tab').forEach((el) => {
            el.style.display = 'none';
            el.classList.add('hidden');
          });
          const t = document.getElementById('admin-tab-influencer');
          if (t) {
            t.style.display = 'block';
            t.classList.remove('hidden');
          }
          document
            .querySelectorAll('.admin-nav-btn')
            .forEach((b) => b.classList.remove('active'));
          document.getElementById('btn-admin-influencer')?.classList.add('active');
          window.loadAdminInfluencer();
          return;
        }
        origSwitch(tab);
      };
    }

    console.log('[FIX-PATCH] ✅ Fix 3: Admin Influencer tab injected');
  }

  // Pending badge count refresh
  async function _refreshInfPendingBadge() {
    const badge = document.getElementById('inf-pending-badge');
    if (!badge) return;
    try {
      const client = window.dbClient || window.supabase;
      if (!client) return;
      const { data } = await client
        .from('influencer_requests')
        .select('id', { count: 'exact' })
        .eq('status', 'Pending');
      const count = data?.length || 0;
      badge.textContent = count > 0 ? count + ' New' : '0';
      badge.style.background = count > 0 ? '#fef3c7' : '#f3f4f6';
      badge.style.color = count > 0 ? '#92400e' : '#6b7280';
    } catch (_) {
      badge.textContent = '—';
    }
  }

  /* ──────────────────────────────────────────────────────────────
     FIX 4 — MICRO CATEGORY BADGE ON PRODUCT CARDS
     Problem: Product cards pe sub-category (Micro Category) nahi
              dikh rahi thi.
     Solution: renderProductCard ko patch karo + MutationObserver
               se existing cards mein badge inject karo.
  ─────────────────────────────────────────────────────────────── */

  // CSS inject
  (function _injectMicroCatCSS() {
    if (document.getElementById('ok-microcat-css')) return;
    const s = document.createElement('style');
    s.id = 'ok-microcat-css';
    s.textContent = `
      .ok-micro-cat-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: linear-gradient(135deg, #ede9fe, #f5f3ff);
        color: #6d28d9;
        border: 1px solid #ddd6fe;
        border-radius: 99px;
        font-size: 9px;
        font-weight: 800;
        padding: 2px 8px;
        margin-top: 4px;
        letter-spacing: 0.02em;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(s);
  })();

  // Product card ke p-3 div mein badge inject karna
  function _injectMicroCatOnCard(card) {
    if (card.dataset.microcatDone) return;
    card.dataset.microcatDone = '1';

    // onclick se product id nikalo
    const onclick = card.getAttribute('onclick') || '';
    const match = onclick.match(/\d+/);
    if (!match) return;
    const pid = parseInt(match[0]);

    // Product find karo
    const all = [
      ...(window.products || []),
      ...(window.allProducts || []),
      ...(window._allProducts || []),
      ...(window.goldProducts || []),
      ...(window.allGoldProducts || []),
    ];
    const p = all.find(x => x.id === pid);
    if (!p || !p.sub) return;

    // p-3 div (product info section) find karo
    const infoDiv = card.querySelector('.p-3');
    if (!infoDiv) return;

    // Already badge nahi hai to add karo
    if (infoDiv.querySelector('.ok-micro-cat-badge')) return;

    const badge = document.createElement('div');
    badge.className = 'ok-micro-cat-badge';
    badge.title = 'Micro Category';
    badge.innerHTML = `<i class="fas fa-tag" style="font-size:7px;opacity:0.7;"></i> ${p.sub}`;
    infoDiv.appendChild(badge);
  }

  function _injectMicroCatOnAllCards() {
    document.querySelectorAll('.product-card[onclick]').forEach(_injectMicroCatOnCard);
  }

  // MutationObserver — naye cards aate hi badge lagao
  function _startMicroCatObserver() {
    const shopGrid = document.getElementById('shop-grid');
    if (!shopGrid) return;

    new MutationObserver(() => {
      setTimeout(_injectMicroCatOnAllCards, 100);
    }).observe(shopGrid, { childList: true, subtree: true });

    // Existing cards pe bhi lagao
    setTimeout(_injectMicroCatOnAllCards, 300);
    console.log('[FIX-PATCH] ✅ Fix 4: Micro Category observer started');
  }

  /* ──────────────────────────────────────────────────────────────
     INIT — Saare fixes ko sahi time pe lagao
  ─────────────────────────────────────────────────────────────── */
  function _applyAllFixes() {
    // Fix 1 — Combos section
    setTimeout(_fixShopByCategoryWithCombos, 800);

    // Fix 3 — Admin Influencer tab
    setTimeout(_injectAdminInfluencerTab, 1200);

    // Fix 2 — Influencer page observer
    const infPage = document.getElementById('profile-page-influencer');
    if (infPage && !infPage._fixObserverAttached) {
      infPage._fixObserverAttached = true;
      new MutationObserver(() => {
        if (!infPage.classList.contains('hidden')) {
          setTimeout(window.loadInfluencerRequests, 150);
        }
      }).observe(infPage, { attributes: true, attributeFilter: ['class'] });
    }

    // Fix 4 — Micro Category badges
    setTimeout(_startMicroCatObserver, 1000);
    // Navigate patch se bhi refresh ho
    const origNavigate = window.navigate;
    if (origNavigate && !window._combosNavPatched) {
      window._combosNavPatched = true;
      window.navigate = function (view, ...args) {
        const result = origNavigate(view, ...args);
        if (view === 'home') {
          setTimeout(_fixShopByCategoryWithCombos, 600);
        }
        if (view === 'shop') {
          setTimeout(_injectMicroCatOnAllCards, 800);
          setTimeout(_injectMicroCatOnAllCards, 1500);
        }
        return result;
      };
    }

    console.log(
      '%c🛍️ OutfitKart FIX PATCH v1.1 ✅ Combos + Influencer + Admin + MicroCat all fixed!',
      'background:#7c3aed;color:white;font-weight:900;font-size:12px;padding:4px 14px;border-radius:6px;'
    );
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_applyAllFixes, 700));
  } else {
    setTimeout(_applyAllFixes, 700);
  }

  // Global exports
  Object.assign(window, {
    loadAdminInfluencer: window.loadAdminInfluencer,
    adminApproveInfluencer: window.adminApproveInfluencer,
    adminRejectInfluencer: window.adminRejectInfluencer,
    loadInfluencerRequests: window.loadInfluencerRequests,
    injectMicroCatOnAllCards: _injectMicroCatOnAllCards,
  });
})();

/* ================================================================
   SECTION: giveaway-patch.js
   ================================================================ */
/* ================================================================
   OutfitKart — GIVEAWAY BANNER + YOUTUBE PATCH v1.0
   ================================================================
   INSTRUCTIONS:
   Is file ko mega-patch.js ke BAAD load karo:
   <script src="giveaway-patch.js"></script>
   ================================================================ */

'use strict';

(function _outfitkartGiveawayYT() {

  /* ── 1. CSS Inject ── */
  const style = document.createElement('style');
  style.id = 'ok-giveaway-css';
  style.textContent = `
    /* Giveaway ticker bar */
    #ok-giveaway-bar {
      position: fixed;
      top: 64px;
      left: 0; right: 0;
      z-index: 48;
      background: linear-gradient(90deg, #7c3aed 0%, #e11d48 50%, #f59e0b 100%);
      color: white;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      height: 32px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      letter-spacing: 0.01em;
      animation: okGwSlideDown 0.5s ease both;
    }
    @keyframes okGwSlideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #ok-giveaway-bar .gw-marquee {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
    #ok-giveaway-bar .gw-marquee span {
      display: inline-block;
      animation: okGwMarquee 18s linear infinite;
    }
    @keyframes okGwMarquee {
      0%   { transform: translateX(100vw); }
      100% { transform: translateX(-100%); }
    }
    #ok-giveaway-bar .gw-close {
      margin-left: 8px;
      font-size: 14px;
      opacity: 0.8;
      flex-shrink: 0;
      cursor: pointer;
      padding: 4px;
    }

    /* Giveaway floating popup card */
    #ok-giveaway-popup {
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      z-index: 300;
      width: min(360px, 92vw);
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 0 0 3px #e11d48;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    #ok-giveaway-popup.ok-gw-open {
      opacity: 1;
      pointer-events: all;
      transform: translateX(-50%) scale(1);
    }
    #ok-giveaway-popup .gw-header {
      background: linear-gradient(135deg, #7c3aed, #e11d48);
      color: white;
      padding: 16px 16px 12px;
      position: relative;
      text-align: center;
    }
    #ok-giveaway-popup .gw-emoji {
      font-size: 36px;
      display: block;
      margin-bottom: 4px;
      animation: okGwBounce 1s ease infinite alternate;
    }
    @keyframes okGwBounce {
      from { transform: scale(1) rotate(-5deg); }
      to   { transform: scale(1.12) rotate(5deg); }
    }
    #ok-giveaway-popup .gw-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 0.02em;
    }
    #ok-giveaway-popup .gw-sub {
      font-size: 11px;
      opacity: 0.85;
      margin-top: 2px;
    }
    #ok-giveaway-popup .gw-close-btn {
      position: absolute;
      top: 8px; right: 10px;
      font-size: 18px;
      cursor: pointer;
      opacity: 0.7;
    }
    #ok-giveaway-popup .gw-body {
      padding: 16px;
    }
    #ok-giveaway-popup .gw-step {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }
    #ok-giveaway-popup .gw-step-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: #e11d48;
      color: white;
      font-size: 11px;
      font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #ok-giveaway-popup .gw-step-text {
      font-size: 12px;
      color: #374151;
      line-height: 1.4;
    }
    #ok-giveaway-popup .gw-step-text strong {
      color: #111827;
      font-weight: 800;
    }
    #ok-giveaway-popup .gw-counter {
      background: #fff1f2;
      border: 1.5px solid #fecdd3;
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      margin-bottom: 14px;
    }
    #ok-giveaway-popup .gw-counter-num {
      font-size: 22px;
      font-weight: 900;
      color: #e11d48;
    }
    #ok-giveaway-popup .gw-counter-label {
      font-size: 10px;
      color: #9ca3af;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    #ok-giveaway-popup .gw-btns {
      display: flex;
      gap: 8px;
    }
    #ok-giveaway-popup .gw-btn-ig {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 800;
      color: white;
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      background: linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);
    }
    #ok-giveaway-popup .gw-btn-yt {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 800;
      color: white;
      border: none;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 5px;
      background: linear-gradient(135deg,#ff0000,#cc0000);
    }

    /* Profile social card */
    #ok-profile-social-card {
      margin: 0 16px 16px;
      border-radius: 16px;
      overflow: hidden;
      background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 40%, #16213e 100%);
      border: 1.5px solid rgba(255,255,255,0.08);
    }
    #ok-profile-social-card .psc-header {
      padding: 14px 16px 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    #ok-profile-social-card .psc-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg,#e11d48,#7c3aed);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      color: white;
      flex-shrink: 0;
    }
    #ok-profile-social-card .psc-title {
      font-size: 13px;
      font-weight: 900;
      color: white;
    }
    #ok-profile-social-card .psc-sub {
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      margin-top: 1px;
    }
    #ok-profile-social-card .psc-gw-box {
      margin: 0 12px;
      background: linear-gradient(90deg, rgba(225,29,72,0.15), rgba(124,58,237,0.15));
      border: 1px solid rgba(225,29,72,0.3);
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    #ok-profile-social-card .psc-gw-emoji { font-size: 22px; flex-shrink:0; }
    #ok-profile-social-card .psc-gw-text {
      font-size: 11px;
      color: rgba(255,255,255,0.85);
      line-height: 1.4;
    }
    #ok-profile-social-card .psc-gw-text strong { color:white; font-weight:800; }
    #ok-profile-social-card .psc-gw-badge {
      margin-left: auto;
      background: #e11d48;
      color: white;
      font-size: 9px;
      font-weight: 800;
      padding: 3px 7px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
      animation: okGwPulse 1.5s infinite;
    }
    @keyframes okGwPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(225,29,72,0.5); }
      50%      { box-shadow: 0 0 0 5px rgba(225,29,72,0); }
    }
    #ok-profile-social-card .psc-links {
      display: flex;
      gap: 8px;
      padding: 10px 12px 14px;
    }
    #ok-profile-social-card .psc-link {
      flex: 1;
      padding: 9px 6px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 800;
      color: white;
      text-decoration: none;
      display: flex; align-items: center; justify-content: center; gap: 4px;
      transition: opacity 0.2s, transform 0.15s;
    }
    #ok-profile-social-card .psc-link:active { transform: scale(0.96); }
    #ok-profile-social-card .psc-link-ig  { background: linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045); }
    #ok-profile-social-card .psc-link-yt  { background: linear-gradient(135deg,#ff0000,#cc0000); }
    #ok-profile-social-card .psc-link-tg  { background: linear-gradient(135deg,#0088cc,#00b0f4); }
    #ok-profile-social-card .psc-link-wa  { background: linear-gradient(135deg,#25D366,#128C7E); }
  `;
  document.head.appendChild(style);

  /* ── 2. Constants ── */
  const INSTAGRAM_URL = 'https://www.instagram.com/outfitkart_official?igsh=MTdlaG1jem56YWRpeQ==';
  const YOUTUBE_URL   = 'https://youtube.com/@outfitkart-official?si=SJOr76KDH_H99JDt';
  const GIVEAWAY_TARGET = 150;

  /* ── 3. Ticker Bar ── */
  function _injectGiveawayBar() {
    if (document.getElementById('ok-giveaway-bar')) return;
    if (sessionStorage.getItem('ok_gw_bar_closed')) return;
    const bar = document.createElement('div');
    bar.id = 'ok-giveaway-bar';
    bar.innerHTML = `
      <div class="gw-marquee">
        <span>🎁✨ GIVEAWAY ALERT! Instagram par 150 followers hone par 2 lucky winners ko special prize milega! 🎉 — Follow @outfitkart_official &amp; Subscribe @outfitkart-official on YouTube — 🎁✨ GIVEAWAY ALERT! Instagram par 150 followers hone par 2 lucky winners ko special prize milega!</span>
      </div>
      <span class="gw-close" id="ok-gw-bar-close" title="Close">✕</span>
    `;
    bar.addEventListener('click', (e) => {
      if (e.target.id === 'ok-gw-bar-close') {
        bar.remove();
        sessionStorage.setItem('ok_gw_bar_closed', '1');
        return;
      }
      _openGiveawayPopup();
    });
    document.body.appendChild(bar);
    // Push main content down
    const mainEl = document.querySelector('main') || document.getElementById('app-content');
    if (mainEl) mainEl.style.paddingTop = (parseInt(mainEl.style.paddingTop||0)||64) + 32 + 'px';
  }

  /* ── 4. Giveaway Popup ── */
  function _injectGiveawayPopup() {
    if (document.getElementById('ok-giveaway-popup')) return;
    const pop = document.createElement('div');
    pop.id = 'ok-giveaway-popup';
    pop.innerHTML = `
      <div class="gw-header">
        <span class="gw-emoji">🎁</span>
        <div class="gw-title">Giveaway Time! ✨</div>
        <div class="gw-sub">150 followers → 2 winners ko prize!</div>
        <span class="gw-close-btn" id="ok-gw-pop-close">✕</span>
      </div>
      <div class="gw-body">
        <div class="gw-counter">
          <div class="gw-counter-num" id="ok-gw-counter">150</div>
          <div class="gw-counter-label">Instagram Followers Goal 🎯</div>
        </div>
        <div class="gw-step">
          <div class="gw-step-num">1</div>
          <div class="gw-step-text"><strong>Instagram Follow karo</strong> — @outfitkart_official ko follow karo</div>
        </div>
        <div class="gw-step">
          <div class="gw-step-num">2</div>
          <div class="gw-step-text"><strong>YouTube Subscribe karo</strong> — @outfitkart-official channel subscribe karo</div>
        </div>
        <div class="gw-step">
          <div class="gw-step-num">3</div>
          <div class="gw-step-text"><strong>150 followers hone par</strong> randomly <strong>2 followers choose</strong> karke unhe prize diya jaega 🎉</div>
        </div>
        <div class="gw-btns">
          <button class="gw-btn-ig" onclick="window.open('${INSTAGRAM_URL}','_blank')">
            <i class="fab fa-instagram"></i> Instagram Follow
          </button>
          <button class="gw-btn-yt" onclick="window.open('${YOUTUBE_URL}','_blank')">
            <i class="fab fa-youtube"></i> YouTube Subscribe
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(pop);
    document.getElementById('ok-gw-pop-close').addEventListener('click', _closeGiveawayPopup);
    pop.addEventListener('click', (e) => { if (e.target === pop) _closeGiveawayPopup(); });
  }

  function _openGiveawayPopup() {
    _injectGiveawayPopup();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('ok-giveaway-popup')?.classList.add('ok-gw-open');
      });
    });
  }
  function _closeGiveawayPopup() {
    document.getElementById('ok-giveaway-popup')?.classList.remove('ok-gw-open');
  }
  window.openGiveawayPopup = _openGiveawayPopup;

  /* ── 5. Profile Social Card ── */
  function _injectProfileSocialCard() {
    if (document.getElementById('ok-profile-social-card')) return;
    const profileHome = document.getElementById('profile-home');
    if (!profileHome) return;

    const card = document.createElement('div');
    card.id = 'ok-profile-social-card';
    card.innerHTML = `
      <div class="psc-header">
        <div class="psc-icon"><i class="fas fa-share-alt"></i></div>
        <div>
          <div class="psc-title">Follow & Subscribe 🔔</div>
          <div class="psc-sub">Hamare saath connect raho — offers &amp; giveaway pao!</div>
        </div>
      </div>
      <div class="psc-gw-box" onclick="openGiveawayPopup()">
        <span class="psc-gw-emoji">🎁</span>
        <div class="psc-gw-text">
          <strong>Giveaway Coming Soon!</strong><br>
          150 Instagram followers → 2 winners ko prize!
        </div>
        <span class="psc-gw-badge">LIVE 🎯</span>
      </div>
      <div class="psc-links">
        <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener" class="psc-link psc-link-ig">
          <i class="fab fa-instagram"></i> Instagram
        </a>
        <a href="${YOUTUBE_URL}" target="_blank" rel="noopener" class="psc-link psc-link-yt">
          <i class="fab fa-youtube"></i> YouTube
        </a>
        <a href="https://t.me/outfitkart" target="_blank" rel="noopener" class="psc-link psc-link-tg">
          <i class="fab fa-telegram"></i> Telegram
        </a>
        <a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener" class="psc-link psc-link-wa">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    `;

    // Insert after stats/level badge — profile stats ke baad, menus se pehle
    const levelBadge = profileHome.querySelector('#ok-user-level-badge');
    if (levelBadge) levelBadge.insertAdjacentElement('afterend', card);
    else {
      const firstMenu = profileHome.querySelector('.bg-white.rounded-2xl');
      if (firstMenu) firstMenu.insertAdjacentElement('beforebegin', card);
      else profileHome.appendChild(card);
    }
  }

  /* ── 6. Patch navigate to inject on profile open ── */
  function _patchNavigateForGiveaway() {
    const origNav = window.navigate;
    if (!origNav || window._okGwNavPatched) return;
    window._okGwNavPatched = true;
    window.navigate = function(view, ...args) {
      origNav(view, ...args);
      if (view === 'profile') {
        setTimeout(_injectProfileSocialCard, 350);
      }
      if (view === 'home') {
        setTimeout(_injectGiveawayBar, 400);
      }
    };
  }

  /* ── 7. Auto-show popup once per session on home ── */
  function _autoShowPopupOnce() {
    if (sessionStorage.getItem('ok_gw_shown')) return;
    sessionStorage.setItem('ok_gw_shown', '1');
    setTimeout(_openGiveawayPopup, 3500);
  }

  /* ── 8. Init ── */
  function _initGiveaway() {
    _injectGiveawayBar();
    _patchNavigateForGiveaway();
    // _autoShowPopupOnce(); — AUTO POPUP DISABLED: sirf bar click se open hoga
    // If already on profile page
    const profileHome = document.getElementById('profile-home');
    if (profileHome && !profileHome.classList.contains('hidden')) {
      setTimeout(_injectProfileSocialCard, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_initGiveaway, 800));
  } else {
    setTimeout(_initGiveaway, 800);
  }

  console.log('%c🎁 OutfitKart Giveaway Patch v1.0 LOADED ✅', 'background:#e11d48;color:white;font-weight:900;font-size:12px;padding:4px 12px;border-radius:6px;');

})();

/* ================================================================
   SECTION: categories-nav-patch.js
   ================================================================ */
'use strict';
/* ================================================================
   OutfitKart — CATEGORIES NAV PATCH v5.0
   - Bottom nav "Categories" already set in index.html
   - Har subcat ka real Unsplash image hardcoded hai
   - Products load hone pe real product images replace kar denge
   - Cart page Flipkart style (empty bug fixed)
   ================================================================ */

(function _okCatPatch() {

/* ── CSS ── */
(function(){
  if (document.getElementById('ok-cnp5-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-cnp5-css';
  s.textContent = `
  #view-categories{position:fixed;inset:0;z-index:52;background:#f5f5f5;display:flex;flex-direction:column;overflow:hidden;}
  #view-categories.hidden{display:none!important;}
  #ok-cph{background:white;height:56px;display:flex;align-items:center;padding:0 16px;gap:12px;border-bottom:1px solid #e5e7eb;box-shadow:0 1px 6px rgba(0,0,0,.08);flex-shrink:0;}
  #ok-cph h2{font-size:1.05rem;font-weight:900;color:#111827;margin:0;flex:1;}
  #ok-back-btn{width:36px;height:36px;border-radius:50%;background:#f3f4f6;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#374151;font-size:15px;flex-shrink:0;transition:background 0.2s;}
  #ok-back-btn:active{background:#e5e7eb;}
  #ok-cpbody{display:flex;flex:1;overflow:hidden;}
  #ok-csb{width:90px;flex-shrink:0;background:#efefef;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  #ok-csb::-webkit-scrollbar{display:none;}
  .ok-si{display:flex;flex-direction:column;align-items:center;padding:12px 6px;cursor:pointer;border-left:3px solid transparent;text-align:center;gap:5px;}
  .ok-si.active{background:white;border-left-color:#e11d48;}
  .ok-si img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;}
  .ok-si.active img{border-color:#e11d48;}
  .ok-si span{font-size:9.5px;font-weight:800;color:#111827;line-height:1.2;word-break:break-word;}
  .ok-si.active span{color:#e11d48;}
  #ok-crp{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;background:white;padding:10px;}
  .ok-vabtn{display:flex;align-items:center;justify-content:space-between;background:#fff1f2;border:1.5px solid #fecdd3;border-radius:12px;padding:11px 14px;cursor:pointer;margin-bottom:10px;}
  .ok-vabtn:active{background:#ffe4e6;}
  .ok-vabtn span{font-size:12px;font-weight:800;color:#e11d48;}
  .ok-glbl{font-size:10px;font-weight:800;color:#374151;background:#f9fafb;border-radius:8px;padding:6px 10px;margin:8px 0 6px;border-left:3px solid #e11d48;}
  .ok-scg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px;}
  .ok-sc{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:7px 3px;border-radius:10px;text-align:center;}
  .ok-sc:active{background:#fff1f2;}
  .ok-sc img{width:66px;height:74px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;}
  .ok-sc span{font-size:9.5px;font-weight:700;color:#1f2937;line-height:1.2;}
  .ok-ads-s{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:10px;}
  .ok-ads-s::-webkit-scrollbar{display:none;}
  .ok-adc{flex-shrink:0;width:190px;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;cursor:pointer;position:relative;}
  .ok-adc img{width:100%;height:76px;object-fit:cover;display:block;}
  .ok-adbg{position:absolute;top:5px;right:5px;background:rgba(0,0,0,.5);color:white;font-size:7px;font-weight:800;padding:2px 5px;border-radius:99px;}
  `;
  document.head.appendChild(s);
})();

/* ────────────────────────────────────────────────────────────────
   CATEGORIES DATA — script-core.js ke exact groups + subcats
   Har subcat ka real Unsplash image hardcoded hai
──────────────────────────────────────────────────────────────── */
const CATS = [
  {
    key:'Men', label:'Men',
    photo:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👕 Topwear', subs:[
        {n:'T-Shirts',        img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80'},
        {n:'Casual Shirts',   img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Shirts',   img:'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80'},
        {n:'Oversized Tees',  img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80'},
        {n:'Oversized Shirts',img:'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80'},
        {n:'Hoodies',         img:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=220&fit=crop&q=80'},
        {n:'Denim Jacket',    img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👖 Bottomwear', subs:[
        {n:'Baggy Jeans',         img:'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80'},
        {n:'Straight Fit Jeans',  img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
        {n:'Slim Fit Jeans',      img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
        {n:'Cotton Trousers',     img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
        {n:'Joggers',             img:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200&h=220&fit=crop&q=80'},
        {n:'Cargo Pants',         img:'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Pant',         img:'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80'},
        {n:'Trousers',            img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👟 Footwear', subs:[
        {n:'Sneakers',      img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
        {n:'Formal Shoes',  img:'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80'},
        {n:'Sports Shoes',  img:'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80'},
        {n:'Sandals',       img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
        {n:'Slippers',      img:'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Women', label:'Women',
    photo:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'🥻 Ethnic', subs:[
        {n:'Sarees',   img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
        {n:'Kurtis',   img:'https://images.unsplash.com/photo-1610189352649-ff58ea8ffe71?w=200&h=220&fit=crop&q=80'},
        {n:'Lehengas', img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👖 Bottomwear', subs:[
        {n:'Straight Fit Jeans', img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
        {n:'Trousers',           img:'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80'},
        {n:'Baggy Jeans',        img:'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=200&h=220&fit=crop&q=80'},
        {n:'Cargo Jeans',        img:'https://images.unsplash.com/photo-1624204386084-dd374f78d12e?w=200&h=220&fit=crop&q=80'},
        {n:'Skinny Fit Jeans',   img:'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=200&h=220&fit=crop&q=80'},
        {n:'Slim Fit Jeans',     img:'https://images.unsplash.com/photo-1565084888279-aca607bb7fe9?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Western', subs:[
        {n:'Tops',          img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&h=220&fit=crop&q=80'},
        {n:'Palazzo',       img:'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80'},
        {n:'Tops & Tunics', img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
        {n:'Dresses',       img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
        {n:'Skirts',        img:'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👠 Footwear', subs:[
        {n:'Heels',   img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80'},
        {n:'Flats',   img:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=220&fit=crop&q=80'},
        {n:'Sandals', img:'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80'},
        {n:'Sneakers',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
        {n:'Wedges',  img:'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Perfumes', label:'Perfumes',
    photo:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'🌸 For Her', subs:[
        {n:"Women's Perfume", img:'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=220&fit=crop&q=80'},
        {n:'Body Mist',       img:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=220&fit=crop&q=80'},
        {n:'Gift Set',        img:'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'💼 For Him', subs:[
        {n:"Men's Perfume",   img:'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=220&fit=crop&q=80'},
        {n:'Attar / Ittar',   img:'https://images.unsplash.com/photo-1594913862946-f6da68f9bdde?w=200&h=220&fit=crop&q=80'},
        {n:'Deodorant Spray', img:'https://images.unsplash.com/photo-1582903942568-e67dc6bab25d?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'✨ Unisex', subs:[
        {n:'Unisex Perfume',  img:'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80'},
        {n:'Luxury Perfume',  img:'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80'},
        {n:'Budget Perfume',  img:'https://images.unsplash.com/photo-1547887538-047f28cce9b4?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Combos', label:'Combos 🎁',
    photo:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👕 Men Combos', subs:[
        {n:'Casual Combo',      img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80'},
        {n:'Party Wear Combo',  img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=220&fit=crop&q=80'},
        {n:'Gym Combo',         img:'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=220&fit=crop&q=80'},
        {n:'Streetwear Combo',  img:'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=220&fit=crop&q=80'},
        {n:'Office Combo',      img:'https://images.unsplash.com/photo-1600091166971-7f9faad6c498?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Women Combos', subs:[
        {n:'Casual Outfit Combo',img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80'},
        {n:'Party Combo',        img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80'},
        {n:'Ethnic Combo',       img:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80'},
        {n:'Western Combo',      img:'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80'},
        {n:'College Wear Combo', img:'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👫 Unisex Combos', subs:[
        {n:'Couple Combo',       img:'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=200&h=220&fit=crop&q=80'},
        {n:'Best Friend Combo',  img:'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=220&fit=crop&q=80'},
        {n:'Matching Outfit Combo',img:'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Accessories', label:'Accessories',
    photo:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:"👨 Men's", subs:[
        {n:'Sunglasses', img:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80'},
        {n:'Watches',    img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80'},
        {n:'Wallets',    img:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=220&fit=crop&q=80'},
        {n:'Bags',       img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80'},
        {n:'Belts',      img:'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=220&fit=crop&q=80'},
        {n:'Caps',       img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=220&fit=crop&q=80'},
        {n:'Chains',     img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=220&fit=crop&q=80'},
        {n:'Bracelets',  img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
        {n:'Socks',      img:'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:"👩 Women's", subs:[
        {n:'Watches',          img:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=220&fit=crop&q=80'},
        {n:'Handbags',         img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
        {n:'Clutches',         img:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&h=220&fit=crop&q=80'},
        {n:'Earrings',         img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
        {n:'Necklace Sets',    img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
        {n:'Bangles',          img:'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=200&h=220&fit=crop&q=80'},
        {n:'Hair Accessories', img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=220&fit=crop&q=80'},
        {n:'Scrunchies',       img:'https://images.unsplash.com/photo-1617369120004-4fc70312c5e6?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'✨ Unisex & Tech', subs:[
        {n:'Unisex Sunglasses',img:'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=220&fit=crop&q=80'},
        {n:'Earbuds',          img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=220&fit=crop&q=80'},
        {n:'Power Banks',      img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=220&fit=crop&q=80'},
        {n:'Phone Cases',      img:'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=220&fit=crop&q=80'},
        {n:'Backpacks',        img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
  {
    key:'Gold', label:'⭐ Gold',
    photo:'https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=120&h=120&fit=crop&q=80',
    groups:[
      { label:'👔 Men Gold', subs:[
        {n:'Topwear',    img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80'},
        {n:'Bottomwear', img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
        {n:'Footwear',   img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80'},
      ]},
      { label:'👗 Women Gold', subs:[
        {n:'Topwear',    img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80'},
        {n:'Bottomwear', img:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80'},
        {n:'Footwear',   img:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80'},
      ]},
    ]
  },
];

/* Short display names */
const SHORT={'Formal Combo (Shirt+Trouser+Belt+Tie)':'Formal Combo','Casual Combo (Tee+Baggy Jeans+Locket)':'Casual Combo','Streetwear Combo (Oversized Tee+Cargo+Chain)':'Streetwear Combo','Tracksuit (Full Upper & Lower)':'Tracksuit','Ethnic Combo (Kurta+Pant+Dupatta)':'Ethnic Combo','Sherwani Set (Sherwani+Pant+Dupatta)':'Sherwani Set','Ethnic Set (Kurti+Pant+Dupatta)':'Ethnic Set','Western Combo (Top+Straight Jeans+Belt)':'Western Combo','Party Combo (Saree+Blouse+Belt)':'Party Combo','Indo-Western (Top+Palazzo+Shrug)':'Indo-Western'};
const _d=n=>SHORT[n]||n;

let _activeCat=0;

/* Get real product image for subcat if available */


/* ── BUILD CATEGORIES PAGE ── */
function _buildCatPage(){
  if(document.getElementById('view-categories'))return;
  const page=document.createElement('div');
  page.id='view-categories';page.className='hidden';
  page.innerHTML=`
    <div id="ok-cph">
      <button id="ok-back-btn" onclick="_closeCategories();navigate('home');" aria-label="Back"><i class="fas fa-arrow-left"></i></button>
      <h2>Categories</h2>
    </div>
    <div id="ok-cpbody">
      <div id="ok-csb">
        ${CATS.map((c,i)=>`
          <div class="ok-si ${i===0?'active':''}" onclick="_okCatSel(${i})" data-ci="${i}">
            <img src="${c.photo}" alt="${c.label}" onerror="this.src='https://placehold.co/48x48/f3f4f6/9ca3af?text=${encodeURIComponent(c.label[0])}'">
            <span>${c.label}</span>
          </div>`).join('')}
      </div>
      <div id="ok-crp"></div>
    </div>`;
  (document.getElementById('app-content')||document.querySelector('main')||document.body).appendChild(page);
  _renderRight(0);
}

window._okCatSel=function(i){
  _activeCat=i;
  document.querySelectorAll('.ok-si').forEach((el,j)=>el.classList.toggle('active',j===i));
  document.querySelector(`.ok-si[data-ci="${i}"]`)?.scrollIntoView({block:'nearest',behavior:'smooth'});
  _renderRight(i);
};

function _renderRight(i){
  const right=document.getElementById('ok-crp');
  if(!right)return;
  const cat=CATS[i];if(!cat)return;
  const isGold=cat.key==='Gold';
  const cleanLabel=cat.label.replace(/[^\w\s]/g,'').trim();

  /* Ads */
  const ads=(window._okAdsData||[]).filter(a=>a.active&&(a.position==='all'||a.position==='home'||a.position==='categories'));
  const adsHtml=ads.length?`<div class="ok-ads-s">${ads.slice(0,4).map(ad=>`
    <div class="ok-adc" onclick="${ad.link_url?`window.open('${ad.link_url}','_blank')`:''}">
      <img src="${ad.image_url||''}" onerror="this.parentElement.style.display='none'">
      ${ad.badge?`<div class="ok-adbg">${ad.badge}</div>`:''}
    </div>`).join('')}</div>`:'';

  const vaAct=isGold?`navigate('gold');_closeCategories();`:`openCategoryPage('${cat.key}');_closeCategories();`;

  let groupsHtml='';
  cat.groups.forEach(grp=>{
    const cards=grp.subs.map(sub=>{
      const imgSrc=sub.img;
      const act=isGold?`navigate('gold');_closeCategories();`:`openSubcatProducts('${cat.key}','${sub.n.replace(/'/g,"\\'")}');_closeCategories();`;
      return `<div class="ok-sc" onclick="${act}">
        <img src="${imgSrc}" alt="${_d(sub.n)}" loading="lazy" onerror="this.src='${sub.img}'">
        <span>${_d(sub.n)}</span>
      </div>`;
    }).join('');
    groupsHtml+=`<div class="ok-glbl">${grp.label}</div><div class="ok-scg">${cards}</div>`;
  });

  right.innerHTML=`${adsHtml}
    <div class="ok-vabtn" onclick="${vaAct}">
      <span><i class="fas fa-th-large" style="margin-right:6px;"></i>View All ${cleanLabel}</span>
      <i class="fas fa-chevron-right"></i>
    </div>${groupsHtml}`;
  right.scrollTop=0;
}

/* _openCategories — turant define, _init se pehle bhi kaam kare */
window._openCategories=function(){
  if(!document.getElementById('view-categories')){_buildCatPage();}
  document.querySelectorAll('.view-section').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-categories')?.classList.remove('hidden');
  _navActive(true);window.currentView='categories';
};
window._closeCategories=function(){
  document.getElementById('view-categories')?.classList.add('hidden');
};

function _navActive(on){
  const btn=document.getElementById('ok-nav-categories');
  if(btn)btn.style.color=on?'#e11d48':'';
}

function _patchNavigate(){
  if(window._cnp5done)return;
  if(!window.navigate)return;
  window._cnp5done=true;
  const orig=window.navigate;
  window.navigate=function(view,...args){
    if(view!=='categories'){_closeCategories();_navActive(false);}
    return orig(view,...args);
  };
}

/* ── INIT ── */
function _init(){
  _buildCatPage();

  const wn=setInterval(()=>{if(typeof window.navigate==='function'){clearInterval(wn);_patchNavigate();}},300);
  

  console.log('%c🗂️ CatNav v5.1 ✅','background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(_init,500));
else setTimeout(_init,500);

/* Already assigned on window above */

})();

/* ================================================================
   SECTION: outfitkart-final-patch.js
   ================================================================ */
'use strict';
/* ================================================================
   outfitkart-final-patch.js — OutfitKart FINAL PATCH
   ================================================================
   CHANGES:
   1. Footer — sirf brand info + support logos rahega
              policy links REMOVED
   2. Profile Help & Policies — saari policies properly add ki
              (Privacy, Shipping, Refund, T&C, FAQs, About)
   3. Categories — properly kholti hai images ke saath
   4. Bottom nav — profile pages ke neeche nahi chhipti
   5. Images — sab properly load honge, broken fallback fix
   ================================================================ */

(function () {

/* ================================================================
   1. FOOTER FIX
   Footer se sirf policy links hatao
   Brand info + support + copyright remain karo
   ================================================================ */
function _fixFooter() {
  // Home view ke andar koi footer inject hua ho toh hatao
  // Ya fir footer HTML mein policy section ho
  const style = document.createElement('style');
  style.id = 'ok-footer-fix';
  style.textContent = `
    /* Footer policy links hide karo */
    footer .footer-policy-links,
    footer [data-policy],
    footer a[href*="policy"],
    footer a[href*="privacy"],
    footer a[href*="terms"],
    footer a[href*="refund"],
    footer a[href*="shipping"],
    .ok-footer-policy-row { display: none !important; }

    /* Footer sirf brand info dikhao */
    footer { padding-bottom: max(5.5rem, calc(4.5rem + env(safe-area-inset-bottom))) !important; }
  `;
  document.head.appendChild(style);

  // Agar koi dynamically inject hua footer hai toh usse fix karo
  function _cleanFooter() {
    // Remove any injected policy footer sections
    document.querySelectorAll('.ok-footer-policy-row, [id*="footer-policies"]').forEach(el => el.remove());
    
    // home view mein agar koi footer hai usse check karo
    const homeView = document.getElementById('view-home');
    if (!homeView) return;
    
    // Find footer within home or main
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
      // Policy links ko remove karo footer se
      const links = footer.querySelectorAll('a');
      links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const text = (link.textContent || '').toLowerCase();
        if (
          href.includes('policy') || href.includes('privacy') ||
          href.includes('terms') || href.includes('refund') ||
          href.includes('shipping') || href.includes('return') ||
          text.includes('privacy') || text.includes('policy') ||
          text.includes('terms & conditions') || text.includes('refund') ||
          text.includes('shipping policy') || text.includes('return policy')
        ) {
          // Sirf link hatao, parent ko nahi
          const parent = link.parentElement;
          link.remove();
          // Agar parent empty hai toh usse bhi hatao
          if (parent && parent.children.length === 0 && parent.tagName !== 'FOOTER') {
            parent.remove();
          }
        }
      });

      // Policy headings/sections ko hatao
      footer.querySelectorAll('div, section, ul, li').forEach(el => {
        const text = (el.textContent || '').toLowerCase().trim();
        if (
          (text.includes('privacy policy') || text.includes('terms of service') ||
           text.includes('refund policy') || text.includes('shipping policy') ||
           text.includes('return policy') || text.includes('cookie policy')) &&
          el.children.length === 0 // sirf text nodes
        ) {
          el.remove();
        }
      });
    });
  }

  // Pehle run karo
  setTimeout(_cleanFooter, 500);
  setTimeout(_cleanFooter, 1500);
  setTimeout(_cleanFooter, 3000);

  // Also watch for dynamically added content
  const obs = new MutationObserver(() => {
    setTimeout(_cleanFooter, 100);
  });
  obs.observe(document.body, { childList: true, subtree: true });
}


/* ================================================================
   2. HELP & POLICIES PAGE — Saari policies add karo
   ================================================================ */
function _enhanceHelpPoliciesPage() {
  const helpPage = document.getElementById('profile-page-help');
  if (!helpPage) return;

  const body = helpPage.querySelector('.profile-page-body');
  if (!body) return;

  // Replace entire help page content with comprehensive policies
  const container = body.querySelector('.max-w-lg') || body.firstElementChild;
  if (!container) return;

  container.innerHTML = `
    <!-- About OutfitKart -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 font-bold flex justify-between items-center text-sm text-rose-700"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>🛍️ About OutfitKart</span>
        <i class="fas fa-chevron-down text-rose-400 text-xs transition-transform"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-2 border-t hidden">
        <p>OutfitKart ek premium fashion e-commerce platform hai jo trendy aur affordable clothing, perfumes, accessories aur combos offer karta hai.</p>
        <p><strong>Humare Saath:</strong> Cash on Delivery available hai. Safe delivery guaranteed. Authentic products, best prices.</p>
        <p><strong>Contact:</strong> WhatsApp: +91 8982296773 | Email: outfitkartpremiumfashion@gmail.com</p>
        <p><strong>Follow Us:</strong> Instagram @outfitkart_official | Telegram @outfitkart</p>
      </div>
    </div>

    <!-- FAQs -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>❓ FAQs</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Delivery kitne din mein hogi?</p>
          <p>A: Standard delivery 3–5 working days mein hogi. Remote areas mein 5–7 din lag sakte hain.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: COD (Cash on Delivery) available hai?</p>
          <p>A: Haan! Sabhi orders pe Cash on Delivery available hai. ₹9 COD handling fee lagti hai jo non-refundable hai.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Exchange kaise karein?</p>
          <p>A: Delivered order ke 7 din andar "My Orders" mein jaake Exchange request kar sakte hain. Unused aur original condition mein hona chahiye.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Wallet balance kaise earn karein?</p>
          <p>A: Referral links share karke har referral purchase pe 5% commission wallet mein milta hai.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Referral commission kab milega?</p>
          <p>A: Order ke 30 din baad commission confirm hota hai — delivery + return window complete hone ke baad.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Size guide kahan milega?</p>
          <p>A: Product page pe size chart available hai. Agar confusion ho toh WhatsApp pe help lo.</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="font-bold text-gray-800 mb-1">Q: Promo codes kahan milenge?</p>
          <p>A: Telegram @outfitkart aur WhatsApp Channel pe exclusive promo codes milte hain.</p>
        </div>
      </div>
    </div>

    <!-- Shipping Policy -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>🚚 Shipping Policy</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <div class="flex items-start gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
          <i class="fas fa-check-circle text-green-500 mt-0.5 flex-shrink-0"></i>
          <div><strong class="text-gray-800">FREE Delivery</strong><p class="text-xs mt-0.5">Sabhi orders pe free shipping available hai. Koi minimum order nahi.</p></div>
        </div>
        <p><strong>Processing Time:</strong> Order place karne ke baad 24–48 hours mein process hoga.</p>
        <p><strong>Delivery Time:</strong> 3–5 working days (Metro cities). 5–7 working days (Other areas).</p>
        <p><strong>COD Handling:</strong> ₹9 handling fee COD orders pe lagti hai.</p>
        <p><strong>Tracking:</strong> "My Orders" mein jaake real-time tracking check kar sakte hain.</p>
        <p><strong>Packaging:</strong> Sabhi items safely packed karke bheje jaate hain. Damage hone pe turant contact karo.</p>
      </div>
    </div>

    <!-- Return & Refund Policy -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>↩️ Return &amp; Refund Policy</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="font-bold text-blue-800 mb-1"><i class="fas fa-info-circle mr-1"></i>7-Day Exchange Policy</p>
          <p class="text-xs text-blue-700">OutfitKart Exchange policy follow karta hai, direct return nahi. Delivery ke 7 din ke andar exchange request kar sakte hain.</p>
        </div>
        <p><strong>Exchange Conditions:</strong></p>
        <ul class="list-disc list-inside space-y-1 text-xs pl-2">
          <li>Item unused aur original condition mein hona chahiye</li>
          <li>Original tags aur packaging intact honi chahiye</li>
          <li>Delivery ke 7 din ke andar request karni hogi</li>
          <li>Wrong size ya defective item ke liye free exchange</li>
        </ul>
        <p><strong>Refund (Cancellation):</strong> Order sirf "Processing" status mein cancel ho sakta hai. UPI/Card se pay kiya ho toh refund 5–7 working days mein milega. COD ₹9 fee non-refundable hai.</p>
        <p><strong>Wallet Refund:</strong> Wallet se pay kiye orders cancel hone pe turant wallet mein refund hota hai.</p>
        <p><strong>Non-Returnable Items:</strong> Innerwear, perfumes (opened), customised items return nahi honge.</p>
      </div>
    </div>

    <!-- Privacy Policy -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>🔒 Privacy Policy</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <p><strong>Data Collection:</strong> Hum sirf wahi data collect karte hain jo aapke orders aur account ke liye zaroori hai — naam, mobile number, delivery address.</p>
        <p><strong>Data Usage:</strong> Aapka data sirf order processing, delivery tracking, aur customer support ke liye use hoga. Kisi third party ko data share nahi kiya jaayega.</p>
        <p><strong>Payment Security:</strong> Payment Razorpay ke secure gateway se hoti hai. OutfitKart aapki card/UPI details store nahi karta.</p>
        <p><strong>Cookies:</strong> Hum basic cookies use karte hain — cart data, preferences, aur session management ke liye.</p>
        <p><strong>Data Deletion:</strong> Account delete karna chahte hain? WhatsApp pe request karo — 7 working days mein data delete kar diya jaayega.</p>
        <p class="text-xs text-gray-400">Last updated: January 2026</p>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>📋 Terms &amp; Conditions</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <p><strong>General:</strong> OutfitKart use karne se aap in terms se agree karte hain. 18+ users hi account bana sakte hain.</p>
        <p><strong>Orders:</strong> Order place karne ke baad cancel karna sirf "Processing" status mein possible hai. Delivered orders exchange ke liye eligible hain (7 days).</p>
        <p><strong>Referral Program:</strong> Commission 5% per referral. 30 din baad confirm hota hai. Fake referrals pe permanent ban. Ek mobile number se ek account allowed hai.</p>
        <p><strong>Wallet:</strong> Minimum withdrawal ₹120. Processing 24–48 hours. Wallet balance non-transferable hai aur cash mein convert nahi hoga.</p>
        <p><strong>Influencer Program:</strong> Payment sirf approved submissions pe milega. Views verified honge. Fake views pe account ban.</p>
        <p><strong>Prohibited:</strong> Fraudulent orders, fake accounts, system manipulation strictly banned hai.</p>
        <p><strong>Changes:</strong> OutfitKart in-app notification se policy changes inform karega.</p>
        <p class="text-xs text-gray-400">Last updated: January 2026</p>
      </div>
    </div>

    <!-- Contact & Support -->
    <div class="border rounded-xl overflow-hidden mb-3">
      <button class="w-full text-left px-4 py-3.5 bg-gray-50 hover:bg-gray-100 font-bold flex justify-between items-center text-sm"
        onclick="this.nextElementSibling.classList.toggle('hidden')">
        <span>📞 Contact &amp; Support</span>
        <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
      </button>
      <div class="p-4 bg-white text-sm text-gray-600 space-y-3 border-t hidden">
        <a href="https://wa.me/918982296773" target="_blank" rel="noopener"
          class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 active:scale-95 transition-all">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fab fa-whatsapp text-green-500 text-lg"></i>
          </div>
          <div><div class="font-bold text-sm text-gray-800">WhatsApp Support</div><div class="text-xs text-gray-500">+91 8982296773 · 10am–8pm</div></div>
          <i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i>
        </a>
        <a href="mailto:outfitkartpremiumfashion@gmail.com" target="_blank" rel="noopener"
          class="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 active:scale-95 transition-all">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fas fa-envelope text-blue-500 text-lg"></i>
          </div>
          <div><div class="font-bold text-sm text-gray-800">Email Support</div><div class="text-xs text-gray-500">outfitkartpremiumfashion@gmail.com</div></div>
          <i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i>
        </a>
        <a href="https://t.me/outfitkart" target="_blank" rel="noopener"
          class="flex items-center gap-3 rounded-xl p-3 active:scale-95 transition-all border"
          style="background:linear-gradient(135deg,#e8f4fd,#dbeafe);border-color:#93c5fd;">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#e0f2fe;">
            <i class="fab fa-telegram text-blue-500 text-lg"></i>
          </div>
          <div><div class="font-bold text-sm text-gray-800">Telegram Channel</div><div class="text-xs text-gray-500">Promo codes + updates</div></div>
          <i class="fas fa-chevron-right text-gray-300 text-xs ml-auto"></i>
        </a>
      </div>
    </div>

    <!-- App Version -->
    <div class="text-center py-4 text-xs text-gray-400 space-y-1">
      <p class="font-bold text-gray-500">OutfitKart v2.0</p>
      <p>Premium Fashion at Best Prices</p>
      <p>© 2026 OutfitKart. All rights reserved.</p>
      <p>Made with ❤️ in India 🇮🇳</p>
    </div>
  `;
}


/* ================================================================
   3. FOOTER — Cleanup + proper copyright-only footer banana
   ================================================================ */
function _injectCleanFooter() {
  // Remove any existing injected footer policy blocks
  document.querySelectorAll('[id^="ok-footer"], .ok-footer-policies').forEach(el => el.remove());

  // Agar main footer DOM mein hai toh usse clean karo
  const footer = document.querySelector('footer');
  if (!footer) return;

  // Footer mein policy links/sections hain toh remove karo
  // Sirf copyright + brand + support info rakho
  const policySelectors = [
    'a[href*="privacy"]', 'a[href*="terms"]', 'a[href*="policy"]',
    'a[href*="refund"]', 'a[href*="shipping"]', 'a[href*="return"]',
  ];
  policySelectors.forEach(sel => {
    footer.querySelectorAll(sel).forEach(el => {
      const parent = el.closest('li') || el.closest('div:not(footer)');
      if (parent && parent !== footer) parent.remove();
      else el.remove();
    });
  });
}


/* ================================================================
   4. BOTTOM NAV FIX — Always visible, profile pages ke upar
   ================================================================ */
function _fixBottomNav() {
  const style = document.createElement('style');
  style.id = 'ok-bottomnav-final-fix';
  style.textContent = `
    /* Bottom nav always visible */
    nav.fixed.bottom-0 {
      z-index: 60 !important;
      display: flex !important;
    }

    /* Profile pages — nav ke upar */
    .profile-page {
      position: fixed !important;
      inset: 0 !important;
      z-index: 65 !important;
      background: #F7F5F2 !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
    }
    .profile-page.hidden {
      display: none !important;
    }
    .profile-page-body {
      flex: 1 !important;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
      padding-bottom: 24px !important;
    }
    .profile-page-header {
      position: sticky !important;
      top: 0 !important;
      z-index: 10 !important;
      flex-shrink: 0 !important;
    }

    /* Admin view — nav hide */
    body.admin-active > nav.fixed.bottom-0 { display: none !important; }

    /* Categories/Cart popup — above nav */
    #view-categories { z-index: 62 !important; }
    #view-cart-page  { z-index: 63 !important; }
    #cart-sidebar    { z-index: 70 !important; }

    /* Body padding bottom — nav ke liye */
    body:not(.admin-active) {
      padding-bottom: max(5rem, calc(4rem + env(safe-area-inset-bottom))) !important;
    }
  `;
  document.head.appendChild(style);

  // openProfilePage patch — policy aliases fix
  const _patchProfileFns = () => {
    const origOpen = window.openProfilePage;
    if (typeof origOpen === 'function' && !origOpen._patched) {
      window.openProfilePage = function (page, ...args) {
        // Policy aliases — sab Help & Policies pe jaayenge
        const policyMap = {'policies':'help','about':'help','terms':'help','privacy':'help','exchange-policy':'help','shipping':'help'};
        const scrollMap = {'about':'About','terms':'Terms','privacy':'Privacy','exchange-policy':'Return','shipping':'Shipping'};
        const mappedPage = policyMap[page] || page;
        const scrollLabel = scrollMap[page];
        const result = origOpen.apply(this, [mappedPage, ...args]);
        if (scrollLabel) {
          setTimeout(() => {
            const helpBody = document.querySelector('#profile-page-help .profile-page-body');
            if (!helpBody) return;
            const btns = helpBody.querySelectorAll('button');
            for (const btn of btns) {
              if (btn.textContent.includes(scrollLabel)) {
                const content = btn.nextElementSibling;
                if (content && content.classList.contains('hidden')) content.classList.remove('hidden');
                btn.scrollIntoView({behavior:'smooth', block:'start'});
                break;
              }
            }
          }, 400);
        }
        return result;
      };
      window.openProfilePage._patched = true;
    }
  };

  setTimeout(_patchProfileFns, 800);
  setTimeout(_patchProfileFns, 2000);
}


/* ================================================================
   5. CATEGORIES FIX — Page properly khulle aur images load hoon
   ================================================================ */
const SUBCAT_IMGS = {
  // Men Topwear
  'T-Shirts':           'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80',
  'Casual Shirts':      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80',
  'Formal Shirts':      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Oversized Tees':     'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80',
  'Oversized Shirts':   'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80',
  'Hoodies':            'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=220&fit=crop&q=80',
  'Denim Jacket':       'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80',
  // Men Bottomwear
  'Baggy Jeans':        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80',
  'Straight Fit Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Slim Fit Jeans':     'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Cotton Trousers':    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Joggers':            'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200&h=220&fit=crop&q=80',
  'Cargo Pants':        'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=200&h=220&fit=crop&q=80',
  'Formal Pant':        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Trousers':           'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  // Men Footwear
  'Sneakers':           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80',
  'Formal Shoes':       'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80',
  'Sports Shoes':       'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80',
  'Sandals':            'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80',
  'Slippers':           'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80',
  // Women Ethnic
  'Sarees':             'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Kurtis':             'https://images.unsplash.com/photo-1582718560869-01152e38cfd4?w=200&h=220&fit=crop&q=80',
  'Lehengas':           'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  // Women Western
  'Tops':               'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'Palazzo':            'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80',
  'Tops & Tunics':      'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'Dresses':            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80',
  'Skirts':             'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80',
  // Women Footwear
  'Heels':              'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80',
  'Flats':              'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  'Wedges':             'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=200&h=220&fit=crop&q=80',
  // Women Bottomwear
  'Cargo Jeans':        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80',
  'Skinny Fit Jeans':   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  // Accessories
  'Sunglasses':         'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80',
  'Watches':            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80',
  'Wallets':            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=220&fit=crop&q=80',
  'Bags':               'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Belts':              'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Caps':               'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&h=220&fit=crop&q=80',
  'Chains':             'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Bracelets':          'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=220&fit=crop&q=80',
  'Socks':              'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80',
  'Handbags':           'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Clutches':           'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Earrings':           'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80',
  'Necklace Sets':      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Bangles':            'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=220&fit=crop&q=80',
  'Hair Accessories':   'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  'Scrunchies':         'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  'Unisex Sunglasses':  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80',
  'Earbuds':            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=220&fit=crop&q=80',
  'Power Banks':        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=220&fit=crop&q=80',
  'Phone Cases':        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=220&fit=crop&q=80',
  'Backpacks':          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  // Perfumes
  "Men's Perfume":      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  "Women's Perfume":    'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=220&fit=crop&q=80',
  'Unisex Perfume':     'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  'Luxury Perfume':     'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  'Budget Perfume':     'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  'Attar / Ittar':      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  'Body Mist':          'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&h=220&fit=crop&q=80',
  'Deodorant Spray':    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  'Gift Set':           'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80',
  // Combos
  'Casual Combo':       'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&h=220&fit=crop&q=80',
  'Party Wear Combo':   'https://images.unsplash.com/photo-1552896236-74e22da82e93?w=200&h=220&fit=crop&q=80',
  'Gym Combo':          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=220&fit=crop&q=80',
  'Streetwear Combo':   'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=200&h=220&fit=crop&q=80',
  'Office Combo':       'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Casual Outfit Combo':'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&h=220&fit=crop&q=80',
  'Party Combo':        'https://images.unsplash.com/photo-1552896236-74e22da82e93?w=200&h=220&fit=crop&q=80',
  'Ethnic Combo':       'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Western Combo':      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=220&fit=crop&q=80',
  'College Wear Combo': 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=200&h=220&fit=crop&q=80',
  'Couple Combo':       'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  'Best Friend Combo':  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  'Matching Outfit Combo':'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=220&fit=crop&q=80',
  'Formal Combo':       'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=220&fit=crop&q=80',
  'Ethnic Set':         'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Indo-Western':       'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  'Tracksuit':          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=220&fit=crop&q=80',
  'Nehru Jacket Combo': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Sherwani Set':       'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  // Gold
  'Topwear':            'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'Bottomwear':         'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Footwear':           'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80',
  // Bags
  'Casual Backpacks':   'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Laptop Backpacks':   'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=200&h=220&fit=crop&q=80',
  'Anti-Theft Bags':    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Stylish Backpacks':  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Tote Bags':          'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=220&fit=crop&q=80',
  'Mini Backpacks':     'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Sling Bags':         'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80',
  'Travel Bags':        'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=200&h=220&fit=crop&q=80',
  'Waist Bags':         'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80',
  'Gym Bags':           'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=220&fit=crop&q=80',
  'Duffle Bags':        'https://images.unsplash.com/photo-1581553673739-c4906b5d0de8?w=200&h=220&fit=crop&q=80',
  // Jewellery
  'Necklaces':          'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Rings':              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=220&fit=crop&q=80',
  'Bracelets & Bangles':'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=220&fit=crop&q=80',
  'Jewelry Sets':       'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Chains':             'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Men Bracelets':      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=220&fit=crop&q=80',
  'Men Rings':          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=220&fit=crop&q=80',
  'Pendants':           'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Kundan':             'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Temple Jewelry':     'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  'Bridal Sets':        'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  'Minimal Jewelry':    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Layered Necklaces':  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80',
  'Statement Pieces':   'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80',
  'Nose Pins':          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80',
  'Hair Jewelry':       'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  // Electronics
  'Phone Cases':        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=220&fit=crop&q=80',
  'Charging Cables':    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&h=220&fit=crop&q=80',
  'Power Banks':        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=220&fit=crop&q=80',
  'Selfie Sticks':      'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=220&fit=crop&q=80',
  'Screen Protectors':  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&h=220&fit=crop&q=80',
  'Mobile Holders':     'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=220&fit=crop&q=80',
  'USB Hubs':           'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=220&fit=crop&q=80',
  'Wireless Headphones':'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=220&fit=crop&q=80',
  'Wired Headphones':   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=220&fit=crop&q=80',
  'Bluetooth Speakers': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=220&fit=crop&q=80',
  'Neckbands':          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=220&fit=crop&q=80',
  'Gaming Controllers': 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=220&fit=crop&q=80',
  'Gaming Headsets':    'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=200&h=220&fit=crop&q=80',
  'Gaming Mouse':       'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=220&fit=crop&q=80',
  'Gaming Keyboards':   'https://images.unsplash.com/photo-1561316441-1bb013b2cef9?w=200&h=220&fit=crop&q=80',
  'Gaming Chairs':      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=200&h=220&fit=crop&q=80',
  'Smartwatches':       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80',
  'Smart Bands':        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=220&fit=crop&q=80',
  'Smart Glasses':      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=220&fit=crop&q=80',
  'Mini Projectors':    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=220&fit=crop&q=80',
  'Smart Plugs':        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=220&fit=crop&q=80',
  'Laptop Stands':      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=220&fit=crop&q=80',
  'Keyboard & Mouse Combos':'https://images.unsplash.com/photo-1561316441-1bb013b2cef9?w=200&h=220&fit=crop&q=80',
  'Webcams':            'https://images.unsplash.com/photo-1591238372338-f73c0f6e9a74?w=200&h=220&fit=crop&q=80',
  'USB Drives':         'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=220&fit=crop&q=80',
  'Mouse Pads':         'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=220&fit=crop&q=80',
  'LED Strip Lights':   'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?w=200&h=220&fit=crop&q=80',
  'Table Fans':         'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=220&fit=crop&q=80',
  'Desk Lamps':         'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=220&fit=crop&q=80',
  'Digital Clocks':     'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=200&h=220&fit=crop&q=80',
  'Air Purifiers':      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=220&fit=crop&q=80',
  'Ring Lights':        'https://images.unsplash.com/photo-1614623447622-c6d5c9a6fe69?w=200&h=220&fit=crop&q=80',
  'Tripods':            'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=220&fit=crop&q=80',
  'Green Screens':      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=220&fit=crop&q=80',
  'Lavalier Mics':      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=200&h=220&fit=crop&q=80',
  'Camera Lens Kits':   'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=220&fit=crop&q=80',
  // Women Shirts
  'Shirts':             'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80',
};

function _getSubImg(sub) {
  // Exact match
  if (SUBCAT_IMGS[sub]) return SUBCAT_IMGS[sub];
  // Partial match (case insensitive)
  const lsub = sub.toLowerCase();
  const key = Object.keys(SUBCAT_IMGS).find(k =>
    k.toLowerCase() === lsub || lsub.includes(k.toLowerCase()) || k.toLowerCase().includes(lsub)
  );
  if (key) return SUBCAT_IMGS[key];
  // Picsum fallback (always works)
  const seed = sub.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed + 100}/200/220`;
}

function _fixCategoryImages() {
  // Fix getSubcategoryImage globally
  if (!window._okImgPatched) {
    window._okImgPatched = true;
    window.getSubcategoryImage = function (categoryName, sub) {
      // Try real product image first
      const allP = [...(window.products || []), ...(window.goldProducts || [])];
      const match = allP.find(p =>
        p.category === categoryName && p.sub === sub && ((p.imgs && p.imgs[0]) || p.img)
      );
      if (match) return (match.imgs && match.imgs[0]) || match.img;
      return _getSubImg(sub);
    };
  }

  // Fix all broken images currently in DOM
  document.querySelectorAll('.ok-sc img, #cat-page-subcat-grid img').forEach(img => {
    if (img.dataset.okFixed) return;
    img.dataset.okFixed = '1';

    // Fix source.unsplash.com (deprecated, returns tiny images)
    if (img.src && (img.src.includes('source.unsplash.com') || img.src.includes('placehold.co'))) {
      img.src = _getSubImg(img.alt || '');
    }

    img.addEventListener('error', function () {
      if (this.dataset.errFixed) return;
      this.dataset.errFixed = '1';
      this.src = _getSubImg(this.alt || '');
    });
  });
}

function _watchCategoryImages() {
  const obs = new MutationObserver(() => setTimeout(_fixCategoryImages, 50));
  ['ok-crp', 'cat-page-subcat-grid'].forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el, { childList: true, subtree: true });
  });
  // Also watch body for new elements
  obs.observe(document.body, { childList: true, subtree: true });
}

function _fixCategories() {
  _fixCategoryImages();
  _watchCategoryImages();

  // Run again after products load
  setTimeout(_fixCategoryImages, 1500);
  setTimeout(_fixCategoryImages, 3000);
  setTimeout(_fixCategoryImages, 6000);
}


/* ================================================================
   6. PRODUCT CARD IMAGES — Proper loading har jagah
   ================================================================ */
function _fixProductImages() {
  const style = document.createElement('style');
  style.id = 'ok-img-fix';
  style.textContent = `
    /* Product card images — proper sizing */
    .product-card img {
      height: 180px !important;
      width: 100% !important;
      object-fit: cover !important;
      background: #f3f4f6;
    }
    @media (min-width: 640px)  { .product-card img { height: 200px !important; } }
    @media (min-width: 1024px) { .product-card img { height: 220px !important; } }

    /* PDP slider images */
    .pdp-img-slider img {
      height: 320px !important;
      object-fit: cover !important;
    }
    @media (min-width: 768px) { .pdp-img-slider img { height: 420px !important; } }

    /* Category page subcat images */
    #cat-page-subcat-grid img {
      width: 56px !important;
      height: 56px !important;
      object-fit: cover !important;
      border-radius: 10px !important;
    }

    /* Categories nav panel images */
    .ok-sc img {
      width: 66px !important;
      height: 74px !important;
      object-fit: cover !important;
      border-radius: 8px !important;
    }

    /* Category bubbles on home */
    #category-bubbles img {
      width: 56px !important;
      height: 56px !important;
      object-fit: cover !important;
      border-radius: 50% !important;
    }

    /* Prevent layout shift */
    img { max-width: 100%; }
    .product-card { height: 100%; }
  `;
  document.head.appendChild(style);

  // Global error handler for product images
  document.addEventListener('error', function (e) {
    const img = e.target;
    if (img.tagName !== 'IMG') return;
    if (img.dataset.errHandled) return;
    img.dataset.errHandled = '1';

    const src = img.src || '';
    // Don't retry placeholders
    if (src.includes('placehold.co') || src.includes('picsum.photos')) return;

    // Fallback
    img.src = 'https://placehold.co/200x220/f3f4f6/9ca3af?text=🛍️';
  }, true);
}


/* ================================================================
   INIT — Sab kuch boot karo
   ================================================================ */
function _init() {
  // CSS aur image fixes turant
  _fixBottomNav();
  _fixProductImages();

  // Baki fixes DOM ready hone ke baad
  setTimeout(() => {
    _fixFooter();
    _fixCategories();
    _injectCleanFooter();

    // Help page enhance karo — thoda baad mein taaki DOM fully loaded ho
    const _tryEnhanceHelp = () => {
      const hp = document.getElementById('profile-page-help');
      if (hp) {
        _enhanceHelpPoliciesPage();
      } else {
        setTimeout(_tryEnhanceHelp, 500);
      }
    };
    _tryEnhanceHelp();

    console.log('%c✅ OutfitKart Final Patch Loaded', 'background:#e11d48;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:5px;');
  }, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 300));
} else {
  setTimeout(_init, 300);
}

})();

/* ================================================================
   SECTION: mega-fix-patch.js
   ================================================================ */
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
  'Baggy Jeans':      'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80',
  'Straight Fit Jeans':'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Slim Fit Jeans':   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Cotton Trousers':  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Joggers':          'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200&h=220&fit=crop&q=80',
  'Cargo Pants':      'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4-bc9910d016b7?w=200&h=220&fit=crop&q=80',
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
  'Formal Combo':     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=220&fit=crop&q=80',
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
      z-index: 65 !important;
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

  // Agar admin already logged in hai aur admin panel open kar raha hai
  // toh sirf opening animation dikhao, full re-login nahi
  const origNavigate = window.navigate;
  if (typeof origNavigate === 'function') {
    window.navigate = function (view, ...args) {
      if (view === 'admin' && _isAdminLoggedIn() && window.isAdminLoggedIn) {
        // Already logged in — sirf navigate, no login gate
        return origNavigate.apply(this, [view, ...args]);
      }
      return origNavigate.apply(this, [view, ...args]);
    };
  }
}

/* ────────────────────────────────────────────────────────────────
   6. INFLUENCER PAGE FIX — Earnings + Submissions properly dikhein
   Problem: loadInfluencerRequests table 'influencer_requests' se
   data fetch karta hai, column names mismatch ho sakta hai
   ──────────────────────────────────────────────────────────────── */
function _fixInfluencerPage() {
  // Override loadInfluencerRequests with robust version
  window.loadInfluencerRequests = async function () {
    const cu = window.currentUser;
    if (!cu) return;

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
    /* Profile pages above nav */
    .profile-page {
      z-index: 65 !important;
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

/* ================================================================
   SECTION: final-fix-patch.js
   ================================================================ */
'use strict';
/* ================================================================
   OutfitKart — FINAL FIX PATCH v2.0
   1. PDP Back → exact page jahan se khula (home/category/subcat/electronics)
   2. Banner replacement — Gold hata ke Electronics + Refer&Earn + fresh banners
   3. Subcat images fix — Hoodies, Joggers, Formal Pant, Kurtis, Lehengas + all dupes
   4. Electronics back → Home
   5. Premium Store Header
   6. Electronics page (OutfitKart Electronics)
   7. Categories page → Bags, Jewellery, Electronics sidebar
   8. Home "View All Categories" → categories page
   ================================================================ */

(function _okFinalFix() {

/* ================================================================
   CSS
================================================================ */
(function(){
  if (document.getElementById('ok-ffp2-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-ffp2-css';
  s.textContent = `
    /* ── PREMIUM HEADER ── */
    #app-header, header.fixed, header.sticky {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%) !important;
      border-bottom: 1.5px solid rgba(99,102,241,0.35) !important;
      box-shadow: 0 2px 20px rgba(99,102,241,0.18) !important;
    }

    /* ── ELECTRONICS PAGE ── */
    #view-electronics {
      position: fixed; inset: 0; z-index: 60;
      background: #0f172a;
      display: flex; flex-direction: column; overflow: hidden;
    }
    #view-electronics.hidden { display: none !important; }
    #ok-elec-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
      border-bottom: 2px solid #3b82f6;
      padding: 0 16px; height: 60px;
      display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(59,130,246,0.3);
    }
    #ok-elec-header h2 {
      font-size: 1.05rem; font-weight: 900; margin: 0; flex: 1;
      background: linear-gradient(135deg, #60a5fa, #93c5fd, #60a5fa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ok-elec-back {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(59,130,246,0.2); border: 1px solid #3b82f6;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #60a5fa; font-size: 14px; flex-shrink: 0;
    }
    #ok-elec-body { display: flex; flex: 1; overflow: hidden; }
    #ok-elec-sidebar {
      width: 88px; flex-shrink: 0; background: #0d1b2e;
      overflow-y: auto; -webkit-overflow-scrolling: touch;
      scrollbar-width: none; border-right: 1px solid #1e3a5f;
    }
    #ok-elec-sidebar::-webkit-scrollbar { display: none; }
    .ok-elec-si {
      display: flex; flex-direction: column; align-items: center;
      padding: 11px 4px; cursor: pointer;
      border-left: 3px solid transparent;
      text-align: center; gap: 4px; transition: all 0.2s;
    }
    .ok-elec-si.active { background: rgba(59,130,246,0.15); border-left-color: #3b82f6; }
    .ok-elec-icon {
      width: 44px; height: 44px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; background: #1e3a5f;
      border: 2px solid #1e3a5f; transition: all 0.2s;
    }
    .ok-elec-si.active .ok-elec-icon { background: rgba(59,130,246,0.25); border-color: #3b82f6; }
    .ok-elec-si span { font-size: 8.5px; font-weight: 800; color: #94a3b8; line-height: 1.2; word-break: break-word; }
    .ok-elec-si.active span { color: #60a5fa; }
    #ok-elec-right { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; background: #111827; padding: 10px; }
    .ok-elec-glbl { font-size: 10px; font-weight: 800; color: #60a5fa; background: rgba(59,130,246,0.1); border-radius: 8px; padding: 6px 10px; margin: 8px 0 6px; border-left: 3px solid #3b82f6; }
    .ok-elec-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; margin-bottom: 10px; }
    .ok-elec-card { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 7px 3px; border-radius: 10px; text-align: center; background: #1e293b; border: 1px solid #1e3a5f; transition: all 0.2s; }
    .ok-elec-card:active { background: rgba(59,130,246,0.2); border-color: #3b82f6; }
    .ok-elec-card img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #1e3a5f; }
    .ok-elec-card span { font-size: 9px; font-weight: 700; color: #cbd5e1; line-height: 1.2; }
    .ok-elec-vaBtn { display: flex; align-items: center; justify-content: space-between; background: rgba(59,130,246,0.15); border: 1.5px solid #3b82f6; border-radius: 12px; padding: 11px 14px; cursor: pointer; margin-bottom: 10px; color: #60a5fa; font-size: 12px; font-weight: 800; }

    /* ── PDP SMART BACK HEADER ── */
    #ok-pdp-smart-header {
      position: sticky; top: 64px; z-index: 30;
      background: white; border-bottom: 1px solid #f3f4f6;
      padding: 10px 16px; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    #ok-pdp-back-btn {
      width: 36px; height: 36px; border-radius: 50%; background: #f3f4f6;
      border: none; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    #ok-pdp-breadcrumb {
      font-size: 12px; font-weight: 700; color: #6b7280;
      flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
    }

    /* ── CATEGORIES EXTRA SIDEBAR ── */
    .ok-si-extra { display: flex; flex-direction: column; align-items: center; padding: 12px 6px; cursor: pointer; border-left: 3px solid transparent; text-align: center; gap: 5px; }
    .ok-si-extra.active { background: white; border-left-color: #e11d48; }
    .ok-si-extra .ok-si-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; background: #f3f4f6; border: 2px solid #e5e7eb; }
    .ok-si-extra.active .ok-si-icon { border-color: #e11d48; background: #fff1f2; }
    .ok-si-extra span { font-size: 9.5px; font-weight: 800; color: #111827; line-height: 1.2; word-break: break-word; }
    .ok-si-extra.active span { color: #e11d48; }
  `;
  document.head.appendChild(s);
})();

/* ================================================================
   PART 1 — PREMIUM HEADER
================================================================ */
function _patchHeader() {
  const tryPatch = () => {
    ['#app-header', 'header.fixed', 'header.sticky', '#ok-header', '.ok-header'].forEach(sel => {
      document.querySelectorAll(sel).forEach(h => {
        if (h.getAttribute('data-prem')) return;
        h.setAttribute('data-prem', '1');
        h.style.setProperty('background', 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)', 'important');
        h.style.setProperty('border-bottom', '1.5px solid rgba(99,102,241,0.35)', 'important');
        h.style.setProperty('box-shadow', '0 2px 20px rgba(99,102,241,0.18)', 'important');
        // Logo gradient
        const logo = h.querySelector('[id*="logo"], .logo-text, [class*="logo"], img[alt*="OutfitKart"]');
        if (logo && logo.tagName !== 'IMG') {
          logo.style.background = 'linear-gradient(135deg, #a78bfa, #818cf8, #c084fc)';
          logo.style.webkitBackgroundClip = 'text';
          logo.style.webkitTextFillColor = 'transparent';
          logo.style.backgroundClip = 'text';
        }
      });
    });
  };
  tryPatch();
  setTimeout(tryPatch, 800);
  setTimeout(tryPatch, 2000);
}

/* ================================================================
   PART 2 — BANNER REPLACEMENT
================================================================ */
const NEW_BANNERS = [
  {
    id:'b1',
    bg:'linear-gradient(135deg,#020617 0%,#0f2a4a 55%,#020617 100%)',
    badge:'⚡ NEW LAUNCH',
    badgeColor:'#3b82f6',
    title:'OutfitKart Electronics',
    sub:'Earbuds, Smartwatches, Gaming & More',
    cta:'Explore Now',
    ctaBg:'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    action:"window._openElectronics&&window._openElectronics()",
    icons:['🎧','📱','⌚','🎮'],
  },
  {
    id:'b2',
    bg:'linear-gradient(135deg,#0a0010 0%,#1e0a33 55%,#0a0010 100%)',
    badge:'🔥 TRENDING',
    badgeColor:'#e11d48',
    title:"Men's Style Drop",
    sub:'T-Shirts, Oversized, Hoodies & Combos',
    cta:'Shop Men',
    ctaBg:'linear-gradient(135deg,#e11d48,#be123c)',
    action:"openSubcatProducts('Men','T-Shirts')",
    imgRight:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=280&h=180&fit=crop&q=80',
  },
  {
    id:'b3',
    bg:'linear-gradient(135deg,#00100a 0%,#052e16 55%,#00100a 100%)',
    badge:'💚 REFER & EARN',
    badgeColor:'#16a34a',
    title:'₹50+ Per Referral!',
    sub:'Dost ko refer karo — 5% commission wallet mein',
    cta:'Start Earning',
    ctaBg:'linear-gradient(135deg,#16a34a,#15803d)',
    action:"navigate('profile','referrals')",
    icons:['💸','🤝','💰','🎁'],
  },
  {
    id:'b4',
    bg:'linear-gradient(135deg,#100500 0%,#431407 55%,#100500 100%)',
    badge:'👗 NEW ARRIVALS',
    badgeColor:'#f97316',
    title:"Women's Collection",
    sub:'Sarees, Kurtis, Lehengas & Dresses',
    cta:'Shop Women',
    ctaBg:'linear-gradient(135deg,#ea580c,#c2410c)',
    action:"openCategoryPage('Women')",
    imgRight:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=280&h=180&fit=crop&q=80',
  },
];

function _buildBannerVisual(b) {
  if (b.imgRight) {
    return `<div style="position:absolute;right:0;top:0;bottom:0;width:42%;background:url('${b.imgRight}') center/cover no-repeat;mask-image:linear-gradient(to left,rgba(0,0,0,0.6),transparent);-webkit-mask-image:linear-gradient(to left,rgba(0,0,0,0.6),transparent);"></div>`;
  }
  if (b.icons) {
    const grid = b.icons.map(ic => `<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;">${ic}</div>`).join('');
    return `<div style="position:absolute;right:14px;top:50%;transform:translateY(-50%);display:grid;grid-template-columns:repeat(2,1fr);gap:6px;">${grid}</div>`;
  }
  return '';
}

function _replaceBanners() {
  const carousel = document.getElementById('banner-carousel');
  if (!carousel || carousel.getAttribute('data-newbanners2')) return;
  carousel.setAttribute('data-newbanners2', '1');

  carousel.innerHTML = NEW_BANNERS.map((b, i) => `
    <div class="banner-slide" style="
      position:absolute;inset:0;
      background:${b.bg};
      opacity:${i===0?1:0};
      z-index:${i===0?1:0};
      transition:opacity 0.55s ease;
      border-radius:1rem;
      overflow:hidden;
      display:flex;
      align-items:center;
      padding:18px 16px;
    ">
      ${_buildBannerVisual(b)}
      <div style="flex:1;position:relative;z-index:2;max-width:60%;">
        <div style="display:inline-flex;align-items:center;background:${b.badgeColor}28;border:1px solid ${b.badgeColor}55;border-radius:99px;padding:3px 9px;margin-bottom:8px;">
          <span style="font-size:9px;font-weight:900;color:${b.badgeColor};letter-spacing:0.04em;">${b.badge}</span>
        </div>
        <h3 style="font-size:1.05rem;font-weight:900;color:white;margin:0 0 4px;line-height:1.2;text-shadow:0 2px 8px rgba(0,0,0,0.6);">${b.title}</h3>
        <p style="font-size:10px;color:rgba(255,255,255,0.6);margin:0 0 12px;line-height:1.4;">${b.sub}</p>
        <button onclick="${b.action}" style="background:${b.ctaBg};color:white;border:none;padding:8px 18px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.35);">${b.cta} →</button>
      </div>
    </div>`).join('');

  let _cur = 0; const _tot = NEW_BANNERS.length;
  clearInterval(window._bannerInterval);

  function _apply(idx) {
    carousel.querySelectorAll('.banner-slide').forEach((s, i) => {
      s.style.opacity = i === idx ? '1' : '0';
      s.style.zIndex = i === idx ? '1' : '0';
    });
    document.querySelectorAll('.banner-dot').forEach((d, i) => {
      if (!d) return;
      d.style.width = i === idx ? '1.5rem' : '0.5rem';
      d.style.opacity = i === idx ? '1' : '0.4';
    });
    _cur = idx; window._bannerCurrent = idx;
  }

  window._bannerInterval = setInterval(() => _apply((_cur + 1) % _tot), 3800);
  carousel.addEventListener('touchstart', e => { window._bannerTouchX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - (window._bannerTouchX || 0);
    if (Math.abs(dx) > 45) _apply(dx < 0 ? (_cur + 1) % _tot : (_cur - 1 + _tot) % _tot);
  }, { passive: true });
  _apply(0);
}

/* ================================================================
   PART 3 — SUBCAT IMAGES FIX
================================================================ */
const FIXED_IMAGES = {
  // Men Topwear
  'Hoodies':             'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=220&fit=crop&q=80',
  'Denim Jacket':        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=220&fit=crop&q=80',
  'Oversized Tees':      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=220&fit=crop&q=80',
  'Oversized Shirts':    'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=200&h=220&fit=crop&q=80',
  'Casual Shirts':       'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=220&fit=crop&q=80',
  'Formal Shirts':       'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  'T-Shirts':            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=220&fit=crop&q=80',
  // Men Bottomwear
  'Joggers':             'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200&h=220&fit=crop&q=80',
  'Formal Pant':         'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Trousers':            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Cotton Trousers':     'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80',
  'Cargo Pants':         'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=200&h=220&fit=crop&q=80',
  'Baggy Jeans':         'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=200&h=220&fit=crop&q=80',
  'Slim Fit Jeans':      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80',
  'Straight Fit Jeans':  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&h=220&fit=crop&q=80',
  // Men Footwear
  'Sneakers':            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=220&fit=crop&q=80',
  'Formal Shoes':        'https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=200&h=220&fit=crop&q=80',
  'Sports Shoes':        'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=200&h=220&fit=crop&q=80',
  'Sandals':             'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=220&fit=crop&q=80',
  'Slippers':            'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&h=220&fit=crop&q=80',
  // Women Ethnic
  'Kurtis':              'https://images.unsplash.com/photo-1610189352649-ff58ea8ffe71?w=200&h=220&fit=crop&q=80',
  'Lehengas':            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Sarees':              'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80',
  // Women Western
  'Palazzo':             'https://images.unsplash.com/photo-1594938374182-a57f7f80b9d9?w=200&h=220&fit=crop&q=80',
  'Tops & Tunics':       'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'Tops':                'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=200&h=220&fit=crop&q=80',
  'Dresses':             'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80',
  'Skirts':              'https://images.unsplash.com/photo-1583496661160-fb5886a773ec?w=200&h=220&fit=crop&q=80',
  // Women Bottomwear
  'Skinny Fit Jeans':    'https://images.unsplash.com/photo-1548902229-a4cb9f3a3bdc?w=200&h=220&fit=crop&q=80',
  'Cargo Jeans':         'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=200&h=220&fit=crop&q=80',
  // Women Footwear
  'Heels':               'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=220&fit=crop&q=80',
  'Flats':               'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=220&fit=crop&q=80',
  'Wedges':              'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=200&h=220&fit=crop&q=80',
  // Combos
  'Casual Combo':        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=220&fit=crop&q=80',
  'Party Wear Combo':    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=220&fit=crop&q=80',
  'Gym Combo':           'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=220&fit=crop&q=80',
  'Streetwear Combo':    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&h=220&fit=crop&q=80',
  'Office Combo':        'https://images.unsplash.com/photo-1600091166971-7f9faad6c498?w=200&h=220&fit=crop&q=80',
  'Casual Outfit Combo': 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=200&h=220&fit=crop&q=80',
  'Party Combo':         'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=220&fit=crop&q=80',
  'Ethnic Combo':        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=220&fit=crop&q=80',
  'Western Combo':       'https://images.unsplash.com/photo-1564257577049-b26d2ee15f21?w=200&h=220&fit=crop&q=80',
  'College Wear Combo':  'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=200&h=220&fit=crop&q=80',
  'Couple Combo':        'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=200&h=220&fit=crop&q=80',
  'Best Friend Combo':   'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&h=220&fit=crop&q=80',
  'Matching Outfit Combo':'https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?w=200&h=220&fit=crop&q=80',
  // Perfumes
  "Women's Perfume":     'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=220&fit=crop&q=80',
  "Men's Perfume":       'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=200&h=220&fit=crop&q=80',
  'Unisex Perfume':      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=220&fit=crop&q=80',
  'Luxury Perfume':      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=200&h=220&fit=crop&q=80',
  'Budget Perfume':      'https://images.unsplash.com/photo-1547887538-047f28cce9b4?w=200&h=220&fit=crop&q=80',
  'Body Mist':           'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=220&fit=crop&q=80',
  'Attar / Ittar':       'https://images.unsplash.com/photo-1594913862946-f6da68f9bdde?w=200&h=220&fit=crop&q=80',
  'Deodorant Spray':     'https://images.unsplash.com/photo-1582903942568-e67dc6bab25d?w=200&h=220&fit=crop&q=80',
  'Gift Set':            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=220&fit=crop&q=80',
};

function _fixSubcatImages() {
  document.querySelectorAll('#ok-crp .ok-sc, #view-categories .ok-sc').forEach(card => {
    const span = card.querySelector('span');
    const img = card.querySelector('img');
    if (!span || !img) return;
    const name = span.textContent.trim();
    if (FIXED_IMAGES[name]) {
      img.src = FIXED_IMAGES[name];
      img.onerror = function() {
        this.src = 'https://placehold.co/66x74/f3f4f6/9ca3af?text=' + encodeURIComponent(name[0] || '?');
      };
    }
  });
}

/* ================================================================
   PART 4 — PDP SMART BACK BUTTON
================================================================ */
function _patchPDPBack() {
  if (window._pdpBackPatched2) return;
  if (!window.navigate || !window._navigateCore) return;
  window._pdpBackPatched2 = true;

  const origNavigate = window.navigate;

  window.navigate = function(view, cat) {
    if (view === 'product') {
      window._pdpReturnState = {
        view: window.currentView || 'home',
        cat: window.currentCategoryFilter || null,
        sub: window.currentSubFilter || null,
      };
    }
    if (view !== 'electronics') {
      const elPage = document.getElementById('view-electronics');
      if (elPage && !elPage.classList.contains('hidden')) elPage.classList.add('hidden');
    }
    return origNavigate(view, cat);
  };

  window._pdpGoBack = function() {
    const st = window._pdpReturnState;
    window._pdpReturnState = null;

    if (!st || !st.view || st.view === 'home') {
      window.navigate('home'); return;
    }
    if (st.view === 'electronics') {
      window._openElectronics && window._openElectronics(); return;
    }
    if (st.view === 'categories') {
      window._openCategories && window._openCategories(); return;
    }
    if (st.view === 'shop') {
      window.currentCategoryFilter = st.cat;
      window.currentSubFilter = st.sub || null;
      document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
      window.currentView = 'shop';
      const shopView = document.getElementById('view-shop');
      if (shopView) shopView.classList.remove('hidden');
      const titleEl = document.getElementById('shop-title');
      if (titleEl) {
        titleEl.textContent = st.sub
          ? (typeof getSubDisplayName === 'function' ? getSubDisplayName(st.sub) : st.sub)
          : (st.cat ? `${st.cat} Collection` : 'Shop All Products');
      }
      const filtersEl = document.getElementById('subcategory-filters');
      if (filtersEl) filtersEl.innerHTML = '';
      if (typeof renderShopProducts === 'function') renderShopProducts();
      if (typeof renderShopSubcategories === 'function') renderShopSubcategories();
      if (typeof updateBottomNav === 'function') updateBottomNav();
      if (typeof _initShopScrollHide === 'function') _initShopScrollHide();
      window.scrollTo(0, 0);
      try { history.pushState({ view: 'shop', cat: st.cat }, ''); } catch(e) {}
      return;
    }
    window.navigate(st.view || 'home');
  };

  // Patch _navigateCore to inject back button on product view
  const origNavCore = window._navigateCore;
  window._navigateCore = function(view, cat) {
    const result = origNavCore(view, cat);
    if (view === 'product') setTimeout(_injectPDPBackBtn, 130);
    return result;
  };
}

function _injectPDPBackBtn() {
  const productView = document.getElementById('view-product');
  if (!productView) return;
  const old = document.getElementById('ok-pdp-smart-header');
  if (old) old.remove();

  const st = window._pdpReturnState;
  let crumbText = '← Back';
  if (st) {
    if (st.view === 'home') crumbText = '🏠 Home';
    else if (st.view === 'electronics') crumbText = '⚡ Electronics';
    else if (st.view === 'categories') crumbText = '🗂️ Categories';
    else if (st.sub) {
      const dispSub = (typeof getSubDisplayName === 'function') ? getSubDisplayName(st.sub) : st.sub;
      crumbText = `${st.cat} › ${dispSub}`;
    } else if (st.cat) crumbText = `${st.cat} Collection`;
  }

  const header = document.createElement('div');
  header.id = 'ok-pdp-smart-header';
  header.innerHTML = `
    <button id="ok-pdp-back-btn" onclick="window._pdpGoBack&&window._pdpGoBack()" aria-label="Back">
      <i class="fas fa-arrow-left" style="color:#374151;font-size:13px;"></i>
    </button>
    <span id="ok-pdp-breadcrumb">${crumbText}</span>`;
  productView.insertBefore(header, productView.firstChild);
}

/* ================================================================
   PART 5 — ELECTRONICS PAGE
================================================================ */
const ELEC_GROUPS = [
  {label:'📱 Mobile',icon:'📱',subs:[
    {n:'Phone Cases',img:'https://images.unsplash.com/photo-1601593346740-925612772716?w=200&h=200&fit=crop&q=80'},
    {n:'Charging Cables',img:'https://images.unsplash.com/photo-1583863788434-e62bd2bde8f4?w=200&h=200&fit=crop&q=80'},
    {n:'Power Banks',img:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop&q=80'},
    {n:'Selfie Sticks',img:'https://images.unsplash.com/photo-1546146830-2cca9512c68e?w=200&h=200&fit=crop&q=80'},
    {n:'Screen Protectors',img:'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=200&fit=crop&q=80'},
    {n:'Mobile Holders',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop&q=80'},
    {n:'USB Hubs',img:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'🎧 Audio',icon:'🎧',subs:[
    {n:'Earbuds',img:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop&q=80'},
    {n:'Wireless Headphones',img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&q=80'},
    {n:'Wired Headphones',img:'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop&q=80'},
    {n:'Bluetooth Speakers',img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop&q=80'},
    {n:'Neckbands',img:'https://images.unsplash.com/photo-1620735692151-26a7e0748429?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'🎮 Gaming',icon:'🎮',subs:[
    {n:'Gaming Controllers',img:'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=200&h=200&fit=crop&q=80'},
    {n:'Gaming Headsets',img:'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&h=200&fit=crop&q=80'},
    {n:'Gaming Mouse',img:'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop&q=80'},
    {n:'Gaming Keyboards',img:'https://images.unsplash.com/photo-1601445638532-3a6628b7b78c?w=200&h=200&fit=crop&q=80'},
    {n:'Gaming Chairs',img:'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'⚡ Smart',icon:'⚡',subs:[
    {n:'Smartwatches',img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80'},
    {n:'Smart Bands',img:'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop&q=80'},
    {n:'Smart Glasses',img:'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop&q=80'},
    {n:'Mini Projectors',img:'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&h=200&fit=crop&q=80'},
    {n:'Smart Plugs',img:'https://images.unsplash.com/photo-1558002038-1055907df827?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'💻 Computer',icon:'💻',subs:[
    {n:'Laptop Stands',img:'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=200&h=200&fit=crop&q=80'},
    {n:'Keyboard & Mouse Combos',img:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop&q=80'},
    {n:'Webcams',img:'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=200&h=200&fit=crop&q=80'},
    {n:'USB Drives',img:'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=200&h=200&fit=crop&q=80'},
    {n:'Mouse Pads',img:'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'🏠 Home',icon:'🏠',subs:[
    {n:'LED Strip Lights',img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&q=80'},
    {n:'Table Fans',img:'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=200&h=200&fit=crop&q=80'},
    {n:'Desk Lamps',img:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&h=200&fit=crop&q=80'},
    {n:'Digital Clocks',img:'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=200&h=200&fit=crop&q=80'},
    {n:'Air Purifiers',img:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop&q=80'},
  ]},
  {label:'🎬 Creator',icon:'🎬',subs:[
    {n:'Ring Lights',img:'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop&q=80'},
    {n:'Tripods',img:'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=200&h=200&fit=crop&q=80'},
    {n:'Green Screens',img:'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=200&h=200&fit=crop&q=80'},
    {n:'Lavalier Mics',img:'https://images.unsplash.com/photo-1590602846989-55f4b27c9090?w=200&h=200&fit=crop&q=80'},
    {n:'Camera Lens Kits',img:'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=200&h=200&fit=crop&q=80'},
  ]},
];

let _elecActiveGroup = 0;

function _buildElecPage() {
  if (document.getElementById('view-electronics')) return;
  const page = document.createElement('div');
  page.id = 'view-electronics'; page.className = 'hidden';
  page.innerHTML = `
    <div id="ok-elec-header">
      <button class="ok-elec-back" onclick="window._closeElectronics()" aria-label="Back">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2>⚡ OutfitKart Electronics</h2>
    </div>
    <div id="ok-elec-body">
      <div id="ok-elec-sidebar">
        ${ELEC_GROUPS.map((g, i) => `
          <div class="ok-elec-si ${i===0?'active':''}" onclick="window._elecGroupSel(${i})">
            <div class="ok-elec-icon">${g.icon}</div>
            <span>${g.label.replace(/^[^\s]+\s/,'')}</span>
          </div>`).join('')}
      </div>
      <div id="ok-elec-right"></div>
    </div>`;
  (document.getElementById('app-content') || document.querySelector('main') || document.body).appendChild(page);
  _renderElecRight(0);
}

window._elecGroupSel = function(i) {
  _elecActiveGroup = i;
  document.querySelectorAll('.ok-elec-si').forEach((el, j) => el.classList.toggle('active', j === i));
  _renderElecRight(i);
};

function _renderElecRight(i) {
  const right = document.getElementById('ok-elec-right'); if (!right) return;
  const grp = ELEC_GROUPS[i]; if (!grp) return;
  const cards = grp.subs.map(sub => `
    <div class="ok-elec-card" onclick="openSubcatProducts('Electronics','${sub.n.replace(/'/g,"\\'")}');window._closeElectronics()">
      <img src="${sub.img}" alt="${sub.n}" loading="lazy" onerror="this.src='https://placehold.co/64x64/1e293b/60a5fa?text=⚡'">
      <span>${sub.n}</span>
    </div>`).join('');
  right.innerHTML = `
    <div class="ok-elec-vaBtn" onclick="openCategoryPage('Electronics');window._closeElectronics()">
      <span><i class="fas fa-bolt" style="margin-right:6px;"></i>View All Electronics</span>
      <i class="fas fa-chevron-right"></i>
    </div>
    <div class="ok-elec-glbl">${grp.label}</div>
    <div class="ok-elec-grid">${cards}</div>`;
  right.scrollTop = 0;
}

window._openElectronics = function() {
  if (!document.getElementById('view-electronics')) _buildElecPage();
  document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
  const catPage = document.getElementById('view-categories');
  if (catPage) catPage.classList.add('hidden');
  document.getElementById('view-electronics').classList.remove('hidden');
  window.currentView = 'electronics';
  window.scrollTo(0, 0);
  if (typeof updateBottomNav === 'function') updateBottomNav();
};

// Electronics back → Home
window._closeElectronics = function() {
  const el = document.getElementById('view-electronics');
  if (el && !el.classList.contains('hidden')) {
    el.classList.add('hidden');
    if (typeof window.navigate === 'function') window.navigate('home');
  } else if (el) {
    el.classList.add('hidden');
  }
};

/* ================================================================
   PART 6 — EXTRA CATEGORIES SIDEBAR (Bags, Jewellery, Electronics)
================================================================ */
const EXTRA_CATS = [
  {key:'Bags',label:'Bags',icon:'🎒',groups:[
    {label:"🎒 Men's Bags",subs:[
      {n:'Casual Backpacks',img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
      {n:'Laptop Backpacks',img:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&h=220&fit=crop&q=80'},
      {n:'Anti-Theft Bags', img:'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=200&h=220&fit=crop&q=80'},
    ]},
    {label:"👜 Women's Bags",subs:[
      {n:'Stylish Backpacks',img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80'},
      {n:'Tote Bags',        img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
      {n:'Handbags',         img:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200&h=220&fit=crop&q=80'},
      {n:'Clutches',         img:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=220&fit=crop&q=80'},
      {n:'Sling Bags',       img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=220&fit=crop&q=80'},
    ]},
    {label:"🧳 Travel & Gym",subs:[
      {n:'Travel Bags',img:'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=200&h=220&fit=crop&q=80'},
      {n:'Gym Bags',   img:'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=200&h=220&fit=crop&q=80'},
      {n:'Duffle Bags',img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
      {n:'Waist Bags', img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=220&fit=crop&q=80'},
    ]},
  ]},
  {key:'Jewellery',label:'Jewellery',icon:'💍',groups:[
    {label:"💍 Women's Jewelry",subs:[
      {n:'Necklaces',          img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
      {n:'Earrings',           img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
      {n:'Rings',              img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=220&fit=crop&q=80'},
      {n:'Bracelets & Bangles',img:'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=200&h=220&fit=crop&q=80'},
      {n:'Anklets',            img:'https://images.unsplash.com/photo-1624517452488-04f55dc6e4e8?w=200&h=220&fit=crop&q=80'},
      {n:'Jewelry Sets',       img:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&h=220&fit=crop&q=80'},
    ]},
    {label:"⚡ Men's Jewelry",subs:[
      {n:'Chains',       img:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=220&fit=crop&q=80'},
      {n:'Men Bracelets',img:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=220&fit=crop&q=80'},
      {n:'Men Rings',    img:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=220&fit=crop&q=80'},
      {n:'Pendants',     img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
    ]},
    {label:"🪔 Traditional",subs:[
      {n:'Kundan',        img:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&h=220&fit=crop&q=80'},
      {n:'Temple Jewelry',img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
      {n:'Bridal Sets',   img:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=220&fit=crop&q=80'},
    ]},
    {label:"✨ Modern Fashion",subs:[
      {n:'Minimal Jewelry',   img:'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&h=220&fit=crop&q=80'},
      {n:'Layered Necklaces', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
      {n:'Statement Pieces',  img:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&h=220&fit=crop&q=80'},
      {n:'Nose Pins',         img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=220&fit=crop&q=80'},
      {n:'Hair Jewelry',      img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=220&fit=crop&q=80'},
    ]},
  ]},
  {key:'Electronics',label:'Electronics',icon:'⚡',isElectronics:true,groups:[]},
];

function _patchCatsSidebar() {
  const sidebar = document.getElementById('ok-csb'); if (!sidebar) return;
  if (sidebar.getAttribute('data-extrapatched2')) return;
  sidebar.setAttribute('data-extrapatched2', '1');

  EXTRA_CATS.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'ok-si-extra';
    item.innerHTML = `<div class="ok-si-icon">${cat.icon}</div><span>${cat.label}</span>`;
    item.onclick = function() {
      if (cat.isElectronics) { window._openElectronics(); return; }
      document.querySelectorAll('.ok-si, .ok-si-extra').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      _renderExtraCatRight(cat);
    };
    sidebar.appendChild(item);
  });
}

function _renderExtraCatRight(cat) {
  const right = document.getElementById('ok-crp'); if (!right) return;
  let html = `<div class="ok-vabtn" onclick="openCategoryPage('${cat.key}');window._closeCategories()"><span><i class="fas fa-th-large" style="margin-right:6px;"></i>View All ${cat.label}</span><i class="fas fa-chevron-right"></i></div>`;
  cat.groups.forEach(grp => {
    const cards = grp.subs.map(sub =>
      `<div class="ok-sc" onclick="openSubcatProducts('${cat.key}','${sub.n.replace(/'/g,"\\'")}');window._closeCategories()"><img src="${sub.img}" alt="${sub.n}" loading="lazy" onerror="this.src='https://placehold.co/66x74/f3f4f6/9ca3af?text=${encodeURIComponent(sub.n[0])}'"><span>${sub.n}</span></div>`
    ).join('');
    html += `<div class="ok-glbl">${grp.label}</div><div class="ok-scg">${cards}</div>`;
  });
  right.innerHTML = html; right.scrollTop = 0;
}

/* ================================================================
   PART 7 — HOME BUTTONS FIX
================================================================ */
function _patchHomeButtons() {
  const _fix = () => {
    document.querySelectorAll('.ok-viewall-btn').forEach(btn => {
      if (btn.getAttribute('data-cp2')) return;
      btn.setAttribute('data-cp2', '1');
      btn.onclick = e => { e.stopPropagation(); window._openCategories && window._openCategories(); };
      btn.textContent = 'View All Categories →';
    });
  };
  _fix();
  new MutationObserver(_fix).observe(document.body, { childList: true, subtree: true });
  setTimeout(_fix, 1000); setTimeout(_fix, 2500);

  window._openCategoriesTo = function(catName) {
    if (!catName) { window._openCategories && window._openCategories(); return; }
    if (catName.toLowerCase() === 'electronics') { window._openElectronics(); return; }
    window._openCategories && window._openCategories();
    setTimeout(() => {
      const items = document.querySelectorAll('#ok-csb .ok-si[data-ci]');
      items.forEach(item => {
        const sp = (item.querySelector('span')?.textContent || '').toLowerCase().trim();
        const cl = catName.toLowerCase().trim();
        if (sp === cl || cl.startsWith(sp.substring(0, 4)) || sp.startsWith(cl.substring(0, 4))) {
          const ci = parseInt(item.getAttribute('data-ci'));
          if (!isNaN(ci) && typeof window._okCatSel === 'function') window._okCatSel(ci);
        }
      });
    }, 200);
  };
}

/* ================================================================
   BOOT
================================================================ */
function _init() {
  _buildElecPage();
  _patchHeader();
  _patchHomeButtons();

  const wNav = setInterval(() => {
    if (typeof window.navigate === 'function' && typeof window._navigateCore === 'function') {
      clearInterval(wNav); _patchPDPBack();
    }
  }, 200);

  const wBanner = setInterval(() => {
    if (document.getElementById('banner-carousel')) { clearInterval(wBanner); _replaceBanners(); }
  }, 300);

  const wCat = setInterval(() => {
    if (document.getElementById('ok-csb')) { clearInterval(wCat); setTimeout(_patchCatsSidebar, 100); }
  }, 300);

  // Fix images whenever category tab changes
  const origSel = window._okCatSel;
  if (origSel && !window._okCatSelPatched2) {
    window._okCatSelPatched2 = true;
    window._okCatSel = function(i) { origSel(i); setTimeout(_fixSubcatImages, 80); };
  }
  // Also fix on categories panel open
  new MutationObserver(() => {
    const pg = document.getElementById('view-categories');
    if (pg && !pg.classList.contains('hidden')) {
      setTimeout(_fixSubcatImages, 100);
      const sb = document.getElementById('ok-csb');
      if (sb && !sb.getAttribute('data-extrapatched2')) _patchCatsSidebar();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });

  console.log('%c⚡ OutfitKart FinalFix v2.0 ✅', 'background:#0f172a;color:#60a5fa;font-weight:900;font-size:12px;padding:4px 12px;border-radius:6px;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 750));
} else {
  setTimeout(_init, 750);
}

Object.assign(window, {
  _openElectronics: window._openElectronics,
  _closeElectronics: window._closeElectronics,
  _elecGroupSel: window._elecGroupSel,
  _pdpGoBack: window._pdpGoBack,
  _openCategoriesTo: window._openCategoriesTo,
});

})();

/* ================================================================
   SECTION: outfitkart-super-patch.js
   ================================================================ */
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
          {n:'Baggy Jeans',img:'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80'},
          {n:'Straight Fit Jeans',img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
          {n:'Slim Fit Jeans',img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
          {n:'Cotton Trousers',img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
          {n:'Joggers',img:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200&h=220&fit=crop&q=80'},
          {n:'Cargo Pants',img:'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=200&h=220&fit=crop&q=80'},
          {n:'Formal Pant',img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
          {n:'Trousers',img:'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=220&fit=crop&q=80'},
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
          {n:'Baggy Jeans',img:'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=200&h=220&fit=crop&q=80'},
          {n:'Skinny Fit Jeans',img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=220&fit=crop&q=80'},
          {n:'Cargo Jeans',img:'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=200&h=220&fit=crop&q=80'},
          {n:'Trousers',img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200&h=220&fit=crop&q=80'},
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
          {n:'Watches',img:'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=220&fit=crop&q=80'},
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

/* ================================================================
   OutfitKart V7 — REAL WORKING FEATURES
   1. Gender Filter (strict)
   2. You Might Also Like (PDP mein products)
   3. Popular Categories (category page circles)
   4. Smart Back Navigation (sub → PDP → back → sub)
   ================================================================ */
(function _v7Features() {
  'use strict';

  /* ── CSS ── */
  function _injectCSS() {
    if (document.getElementById('ok-v7-css')) return;
    const s = document.createElement('style');
    s.id = 'ok-v7-css';
    s.textContent = `
      /* You Might Also Like */
      #ok-ymla-section {
        padding: 18px 16px 20px;
        background: #f8f9fa;
        border-top: 1px solid #eee;
        margin-top: 8px;
      }
      #ok-ymla-section h3 {
        font-size: 15px; font-weight: 900; color: #111827;
        margin: 0 0 12px; display: flex; align-items: center; gap: 6px;
      }
      .ok-ymla-row {
        display: flex; gap: 10px; overflow-x: auto;
        -webkit-overflow-scrolling: touch; scrollbar-width: none;
        padding-bottom: 4px;
      }
      .ok-ymla-row::-webkit-scrollbar { display: none; }
      .ok-ymla-card {
        flex-shrink: 0; width: 120px; cursor: pointer;
        border-radius: 12px; overflow: hidden;
        background: white; border: 1px solid #e5e7eb;
        box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        transition: transform 0.18s;
      }
      .ok-ymla-card:active { transform: scale(0.96); }
      .ok-ymla-card img { width: 100%; height: 140px; object-fit: cover; display: block; }
      .ok-ymla-info { padding: 7px 8px; }
      .ok-ymla-name {
        font-size: 11px; font-weight: 700; color: #111827;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ok-ymla-price { font-size: 12px; font-weight: 900; color: #e11d48; margin-top: 2px; }

      /* Popular Categories */
      #ok-popular-cats {
        padding: 14px 16px 10px; background: #fff;
        border-bottom: 1px solid #f0f0f0;
      }
      #ok-popular-cats h3 {
        font-size: 11px; font-weight: 900; color: #374151;
        margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.08em;
        display: flex; align-items: center; gap: 5px;
      }
      .ok-popcats-row {
        display: flex; gap: 12px; overflow-x: auto;
        -webkit-overflow-scrolling: touch; scrollbar-width: none;
      }
      .ok-popcats-row::-webkit-scrollbar { display: none; }
      .ok-popcat {
        flex-shrink: 0; display: flex; flex-direction: column;
        align-items: center; gap: 5px; cursor: pointer; width: 64px;
      }
      .ok-popcat-img {
        width: 56px; height: 56px; border-radius: 50%; overflow: hidden;
        border: 2.5px solid #e5e7eb; transition: border-color 0.2s, transform 0.18s;
        position: relative;
      }
      .ok-popcat:active .ok-popcat-img { transform: scale(0.9); }
      .ok-popcat:hover .ok-popcat-img { border-color: #e11d48; }
      .ok-popcat-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .ok-popcat-lbl {
        font-size: 9px; font-weight: 800; color: #374151;
        text-align: center; line-height: 1.3; max-width: 64px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .ok-hot-dot {
        position: absolute; top: -2px; right: -2px;
        width: 14px; height: 14px; border-radius: 50%;
        background: #e11d48; border: 2px solid white;
        font-size: 7px; display: flex; align-items: center;
        justify-content: center; color: white; font-weight: 900;
      }

      /* COD Payment Toggle */
      #ok-pay-toggle {
        margin: 10px 16px 4px;
        background: #f8f9fa; border: 1.5px solid #e5e7eb;
        border-radius: 12px; padding: 10px 12px;
      }
      #ok-pay-toggle .opt-lbl {
        font-size: 9px; font-weight: 800; color: #6b7280;
        text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
      }
      .ok-pay-opts { display: flex; gap: 8px; }
      .ok-pay-btn {
        flex: 1; padding: 9px 6px; border-radius: 10px;
        border: 2px solid #e5e7eb; background: white;
        font-size: 11px; font-weight: 700; color: #374151;
        cursor: pointer; text-align: center; transition: all 0.2s;
        display: flex; flex-direction: column; align-items: center; gap: 1px;
      }
      .ok-pay-btn.sel { border-color: #e11d48; background: #fff1f2; color: #e11d48; }
      .ok-pay-sub { font-size: 9px; color: #9ca3af; font-weight: 500; }
      .ok-pay-btn.sel .ok-pay-sub { color: #f87171; }
      .ok-cod-warning {
        font-size: 10px; color: #f59e0b; font-weight: 700;
        margin-top: 7px; display: none; align-items: center; gap: 4px;
      }
      .ok-cod-warning.show { display: flex; }
    `;
    document.head.appendChild(s);
  }

  /* ══════════════════════════════════════════════════════
     1. GENDER FILTER — Women category mein sirf Women products
  ══════════════════════════════════════════════════════ */
  function _applyGenderFilter(cat) {
    if (!cat) return;
    const catL = cat.toLowerCase();
    const isWomen = catL === 'women';
    const isMen   = catL === 'men';
    if (!isWomen && !isMen) return;

    const grid = document.getElementById('shop-grid') || document.getElementById('products-grid') || document.querySelector('[id*="shop-grid"],[id*="product-grid"]');
    if (!grid) return;

    const allProds = [...(window.products||[]), ...(window.allProducts||[])];

    grid.querySelectorAll('.product-card[onclick], [class*="product"][onclick]').forEach(card => {
      const oc = card.getAttribute('onclick') || '';
      const m = oc.match(/\d+/);
      if (!m) return;
      const pid = +m[0];
      const p = allProds.find(x => x.id === pid || String(x.id) === String(pid));
      if (!p) return;
      const pCat = (p.category||'').toLowerCase();
      const wrong = (isWomen && pCat === 'men') || (isMen && pCat === 'women');
      card.style.display = wrong ? 'none' : '';
    });
  }

  /* ══════════════════════════════════════════════════════
     2. YOU MIGHT ALSO LIKE — PDP ke neeche
  ══════════════════════════════════════════════════════ */
  function _injectYMLA(product) {
    // Purana hata do
    document.getElementById('ok-ymla-section')?.remove();

    const all = [...(window.products||[]), ...(window.allProducts||[]), ...(window.goldProducts||[])];
    const seen = new Set(); const unique = all.filter(p => { if(seen.has(p.id))return false; seen.add(p.id); return true; });

    let recs = unique.filter(p =>
      p.id !== product.id &&
      p.category === product.category &&
      p.is_active !== false
    ).sort(() => Math.random() - 0.5).slice(0, 8);

    if (!recs.length) {
      // Same sub se try karo
      recs = unique.filter(p => p.id !== product.id && p.sub === product.sub && p.is_active !== false)
                   .sort(() => Math.random() - 0.5).slice(0, 8);
    }
    if (!recs.length) return;

    const cards = recs.map(p => {
      const img = p.imgs?.[0]||p.img||'https://placehold.co/120x140/f3f4f6/9ca3af?text=?';
      const isG  = !!(p.is_gold || (window.goldProducts||[]).find(g=>g.id===p.id));
      return `<div class="ok-ymla-card" onclick="openProductPage(${p.id}${isG?',true':''})">
        <img src="${img}" loading="lazy" onerror="this.src='https://placehold.co/120x140/f3f4f6/9ca3af?text=?'">
        <div class="ok-ymla-info">
          ${isG?'<div style="font-size:8px;font-weight:900;color:#B8860B;margin-bottom:1px;">⭐ GOLD</div>':''}
          <div class="ok-ymla-name">${p.name||''}</div>
          <div class="ok-ymla-price">₹${(p.price||0).toLocaleString('en-IN')}
            ${p.oldprice&&p.oldprice>p.price?`<span style="text-decoration:line-through;font-size:9px;color:#bbb;font-weight:400;margin-left:3px;">₹${p.oldprice}</span>`:''}
          </div>
        </div>
      </div>`;
    }).join('');

    const sec = document.createElement('div');
    sec.id = 'ok-ymla-section';
    sec.innerHTML = `<h3>🔥 You Might Also Like</h3><div class="ok-ymla-row">${cards}</div>`;

    // PDP ke andar sabse neeche insert karo
    const pdp = document.getElementById('pdp-container') || document.getElementById('view-product');
    if (!pdp) return;

    // Review/rating section ke baad, ya end mein
    const rev = pdp.querySelector('[id*="review"],[id*="rating"],#pdp-reviews');
    if (rev) rev.insertAdjacentElement('afterend', sec);
    else pdp.appendChild(sec);

    console.log('[YMLA] ✅ ' + recs.length + ' products inject kiye');
  }

  /* ══════════════════════════════════════════════════════
     3. POPULAR CATEGORIES — Category page par circles
  ══════════════════════════════════════════════════════ */
  const POP_CATS = [
    { lbl:'Oversized Tees', cat:'Men',         sub:'Oversized Tees',   img:'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=120&h=120&fit=crop&q=80', hot:true },
    { lbl:"Women's Kurtis", cat:'Women',       sub:'Kurtis',           img:'https://images.unsplash.com/photo-1610189352649-ff58ea8ffe71?w=120&h=120&fit=crop&q=80', hot:true },
    { lbl:'Cargo Pants',    cat:'Men',         sub:'Cargo Pants',      img:'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=120&h=120&fit=crop&q=80', hot:false },
    { lbl:'Dresses',        cat:'Women',       sub:'Dresses',          img:'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=120&h=120&fit=crop&q=80', hot:true },
    { lbl:'Sneakers',       cat:'Men',         sub:'Sneakers',         img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop&q=80', hot:false },
    { lbl:"Men's Watches",  cat:'Accessories', sub:'Watches',          img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&q=80', hot:false },
    { lbl:'Couple Combo',   cat:'Combos',      sub:'Couple Combo',     img:'https://images.unsplash.com/photo-1529111290557-82f6d5c6cf85?w=120&h=120&fit=crop&q=80', hot:true },
    { lbl:'Hoodies',        cat:'Men',         sub:'Hoodies',          img:'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=120&h=120&fit=crop&q=80', hot:false },
  ];

  function _injectPopularCats() {
    if (document.getElementById('ok-popular-cats')) return;
    const catPage = document.getElementById('view-categories');
    if (!catPage) return;

    const sec = document.createElement('div');
    sec.id = 'ok-popular-cats';

    const items = POP_CATS.map(c => `
      <div class="ok-popcat" onclick="openSubcatProducts('${c.cat}','${c.sub.replace(/'/g,"\\'")}');_closeCategories&&_closeCategories()">
        <div class="ok-popcat-img">
          <img src="${c.img}" alt="${c.lbl}" loading="lazy" onerror="this.style.display='none'">
          ${c.hot ? '<div class="ok-hot-dot">🔥</div>' : ''}
        </div>
        <div class="ok-popcat-lbl">${c.lbl}</div>
      </div>`).join('');

    sec.innerHTML = `<h3>🔥 Popular Right Now</h3><div class="ok-popcats-row">${items}</div>`;

    // Categories page ke top mein — sidebar+content ke upar
    const body = document.getElementById('ok-cpbody') || catPage.querySelector('.flex');
    if (body) catPage.insertBefore(sec, body);
    else catPage.prepend(sec);

    console.log('[PopCats] ✅ Circles injected');
  }

  /* ══════════════════════════════════════════════════════
     4. COD PRICING TOGGLE — PDP par +₹19
  ══════════════════════════════════════════════════════ */
  function _injectCODToggle(product) {
    document.getElementById('ok-pay-toggle')?.remove();
    const base = product.price || 0;
    window._pdpBasePrice = base;
    window._pdpPayMode   = 'upi';

    const toggle = document.createElement('div');
    toggle.id = 'ok-pay-toggle';
    toggle.innerHTML = `
      <div class="opt-lbl">💳 Payment Mode</div>
      <div class="ok-pay-opts">
        <div class="ok-pay-btn sel" id="ok-pay-upi" onclick="window._okPay('upi')">
          <span>📱 UPI / Online</span>
          <span class="ok-pay-sub">₹${base.toLocaleString('en-IN')} — Best Price</span>
        </div>
        <div class="ok-pay-btn" id="ok-pay-cod" onclick="window._okPay('cod')">
          <span>💵 Cash on Delivery</span>
          <span class="ok-pay-sub">₹${(base+19).toLocaleString('en-IN')} (+₹19)</span>
        </div>
      </div>
      <div class="ok-cod-warning" id="ok-cod-warn">⚠️ COD pe ₹19 extra handling charge</div>
    `;

    // Price element ke neeche insert karo
    const priceEl = document.querySelector('#pdp-container .text-3xl, #pdp-container .text-2xl.font-black, #pdp-container [class*="price"]');
    if (priceEl) {
      const sect = priceEl.closest('.px-4,.p-4,.px-3') || priceEl.parentElement?.parentElement || priceEl.parentElement;
      sect?.insertAdjacentElement('afterend', toggle);
    }

    window._okPay = function(mode) {
      window._pdpPayMode = mode;
      document.getElementById('ok-pay-upi')?.classList.toggle('sel', mode==='upi');
      document.getElementById('ok-pay-cod')?.classList.toggle('sel', mode==='cod');
      document.getElementById('ok-cod-warn')?.classList.toggle('show', mode==='cod');
      const liveP = document.querySelector('#pdp-container .text-3xl, #pdp-container .text-2xl.font-black');
      if (liveP) {
        const newP = mode==='cod' ? base+19 : base;
        liveP.textContent = '₹' + newP.toLocaleString('en-IN');
        liveP.style.color = mode==='cod' ? '#f59e0b' : '';
      }
    };
  }

  /* ══════════════════════════════════════════════════════
     5. SMART BACK NAVIGATION
     openSubcatProducts → lastSubCat save
     Back on PDP → return to subcat
  ══════════════════════════════════════════════════════ */
  function _patchSmartBack() {
    if (window._v7SmartBackDone) return;
    window._v7SmartBackDone = true;

    /* --- openSubcatProducts wrap REMOVED from here ---
       Ab yeh kaam _hookGenderFilter() karta hai (merged).
       Dono ka state-save + gender filter wahan ek saath hota hai.
    */

    /* --- navigate wrap — track view + subcat --- */
    const origNav = window.navigate;
    if (origNav && !window._v7NavDone) {
      window._v7NavDone = true;
      window.navigate = function(view, ...args) {
        const prev = window.currentView || 'home';
        if (view === 'product') {
          // PDP kholne se pehle current state save
          window._pdpBackTo = {
            view: prev,
            cat:  window._currentCatFilter || null,
            sub:  window.lastSubCat         || null,
            subCat: window.lastSubCatCat    || null,
          };
        }
        return origNav(view, ...args);
      };
    }

    /* --- PDP back button patch --- */
    function _patchPDPBack() {
      // PDP mein jo bhi back button hai
      const selectors = [
        '#view-product .back-btn',
        '#pdp-container .back-btn',
        '#view-product button[onclick*="navigate"]',
        '#view-product [onclick*="navigate(\'shop\')"]',
        '#view-product [onclick*="navigate(\'home\')"]',
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(btn => {
          if (btn.dataset.v7back) return;
          btn.dataset.v7back = '1';
          const origClick = btn.onclick;
          btn.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            const state = window._pdpBackTo;
            if (state && state.sub && state.subCat && typeof window.openSubcatProducts === 'function') {
              // Sub-category wapas jao
              if (typeof navigate === 'function') navigate('shop');
              setTimeout(() => window.openSubcatProducts(state.subCat, state.sub), 150);
            } else if (state && state.view && state.view !== 'product') {
              navigate(state.view);
            } else {
              navigate('home');
            }
          };
        });
      });
    }

    // PDP view appear hone par back button patch karo
    new MutationObserver(() => {
      const pdp = document.getElementById('view-product');
      if (pdp && !pdp.classList.contains('hidden') && !pdp.classList.contains('translate-x-full')) {
        setTimeout(_patchPDPBack, 300);
      }
    }).observe(document.body, { subtree:true, attributes:true, attributeFilter:['class'] });

    setTimeout(_patchPDPBack, 800);
  }

  /* ══════════════════════════════════════════════════════
     6. PDP HOOK — openProductPage wrap
  ══════════════════════════════════════════════════════ */
  function _hookPDP() {
    if (window._v7PDPHooked) return;

    const _tryHook = () => {
      if (typeof window.openProductPage !== 'function') return false;
      if (window._v7PDPHooked) return true;
      window._v7PDPHooked = true;

      const origPP = window.openProductPage;
      window.openProductPage = async function(id, isGold) {
        // Back state save
        window._pdpBackTo = {
          view:    window.currentView || 'home',
          cat:     window._currentCatFilter || null,
          sub:     window.lastSubCat         || null,
          subCat:  window.lastSubCatCat      || null,
        };

        const result = await origPP(id, isGold);

        setTimeout(() => {
          // Product find karo
          const allP = [...(window.products||[]),...(window.allProducts||[]),...(window.goldProducts||[])];
          const seen2 = new Set(); const uniq = allP.filter(p=>{if(seen2.has(p.id))return false;seen2.add(p.id);return true;});
          const product = uniq.find(p => p.id===id || String(p.id)===String(id));
          if (!product) return;

          // Inject features
          _injectCODToggle(product);
          setTimeout(() => _injectYMLA(product), 300);
        }, 500);

        return result;
      };
      return true;
    };

    if (!_tryHook()) {
      const iv = setInterval(() => { if (_tryHook()) clearInterval(iv); }, 250);
    }
  }

  /* ══════════════════════════════════════════════════════
     7. GENDER FILTER HOOK — openSubcatProducts ke baad
  ══════════════════════════════════════════════════════ */
  /* ══════════════════════════════════════════════════════
     7. UNIFIED SUBCAT HOOK
        - State save (lastSubCat, _currentCatFilter, etc.) — Smart Back ke liye
        - Gender filter apply — product grid filter ke liye
        Dono kaam ab ek hi wrap mein hote hain (no double-wrap)
  ══════════════════════════════════════════════════════ */
  function _hookGenderFilter() {
    if (window._v7GenderHooked) return;

    const _try = () => {
      if (typeof window.openSubcatProducts !== 'function' || window._v7GenderHooked) return false;
      window._v7GenderHooked = true;

      const origSub = window.openSubcatProducts;
      window.openSubcatProducts = function(cat, sub) {
        // ── 1. State save (Smart Back ke liye — pehle _patchSmartBack mein tha) ──
        window.lastSubCat         = sub;
        window.lastSubCatCat      = cat;
        window._currentCatFilter  = cat;
        window._currentSubFilter  = sub;

        // ── 2. Original function call ──
        const r = origSub(cat, sub);

        // ── 3. Gender filter apply (render ke baad) ──
        setTimeout(() => _applyGenderFilter(cat), 400);
        setTimeout(() => _applyGenderFilter(cat), 1000);

        return r;
      };
      return true;
    };

    if (!_try()) {
      const iv = setInterval(() => { if (_try()) clearInterval(iv); }, 250);
    }
  }

  /* ══════════════════════════════════════════════════════
     8. POPULAR CATS — categories page observe karo
  ══════════════════════════════════════════════════════ */
  function _watchCatPage() {
    new MutationObserver(() => {
      const cp = document.getElementById('view-categories');
      if (!cp) return;
      const isVisible = !cp.classList.contains('hidden') && cp.style.display !== 'none';
      if (isVisible && !document.getElementById('ok-popular-cats')) {
        setTimeout(_injectPopularCats, 200);
      }
    }).observe(document.body, { subtree:true, attributes:true, attributeFilter:['class','style'] });

    // Abhi bhi visible hai to inject karo
    setTimeout(_injectPopularCats, 500);
  }

  /* ══════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════ */
  function _init() {
    _injectCSS();
    _hookPDP();
    // _hookGenderFilter must run BEFORE _patchSmartBack
    // kyunki ab openSubcatProducts wrap sirf yahan hota hai (merged)
    // _patchSmartBack sirf navigate wrap + PDP back button karta hai
    _hookGenderFilter();
    _patchSmartBack();
    _watchCatPage();

    console.log('%c✅ V7 Features: YMLA + Gender Filter + PopCats + COD Pricing + Smart Back — ALL ACTIVE (Unified Subcat Hook)',
      'background:#16a34a;color:white;font-weight:900;font-size:11px;padding:4px 12px;border-radius:6px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 800));
  } else {
    setTimeout(_init, 800);
  }

})();
