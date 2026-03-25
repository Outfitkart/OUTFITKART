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
window.openProfilePage = function(pageName) {
  document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
  const page = document.getElementById('profile-page-' + pageName);
  if (!page) { console.warn('[OutfitKart] Profile page not found:', pageName); return; }
  page.classList.remove('hidden');
  page.style.zIndex = '200';

  const loaders = {
    orders:     () => _loadProfileOrders(),
    wishlist:   () => _loadProfileWishlist(),
    wallet:     () => _loadProfileWallet(),
    referrals:  () => _loadProfileReferrals(),
    influencer: () => _loadProfileInfluencer(),
    info:       () => _loadProfileInfo(),
  };
  if (loaders[pageName]) loaders[pageName]();
  window.scrollTo(0, 0);
};

window.closeProfilePage = function() {
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
function _okSearchHandler(e) {
  const q = (e.target?.value || '').trim();
  const panel = document.getElementById('ok-search-results-panel');
  if (!panel) return;
  if (q.length < 2) {
    panel.innerHTML = `<div style="text-align:center;padding:40px 16px;color:#A09D98;"><i class="fas fa-magic" style="font-size:2.5rem;color:#FECDD3;display:block;margin-bottom:10px;"></i>Search karo — kurta, jeans, perfume, shirt...</div>`;
    return;
  }
  clearTimeout(_searchDebounce);
  panel.innerHTML = `<div style="text-align:center;padding:24px;color:#9ca3af;"><i class="fas fa-spinner fa-spin" style="color:#e11d48;font-size:1.5rem;display:block;margin-bottom:8px;"></i>Searching...</div>`;
  _searchDebounce = setTimeout(() => {
    const products = _getAllProducts();
    if (products.length > 0) {
      _renderSearchResults(_searchProductsMain(q), q);
    } else {
      _waitForProducts(() => _renderSearchResults(_searchProductsMain(q), q));
    }
  }, 280);
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
  footer.innerHTML = `<span class="footer-brand" style="font-size:1.1rem;font-weight:900;display:block;margin-bottom:8px;">OutfitKart</span><p style="font-size:11px;color:#9ca3af;margin:0 0 8px;">Premium Fashion at Best Prices</p><div class="footer-links" style="display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 0;"><a href="#" onclick="openProfilePage('about');return false;">About Us</a><a href="#" onclick="openProfilePage('terms');return false;">Terms</a><a href="#" onclick="openProfilePage('privacy');return false;">Privacy</a><a href="#" onclick="openProfilePage('exchange-policy');return false;">Exchange Policy</a><a href="#" onclick="openWhatsAppSupport&&openWhatsAppSupport();return false;">Support</a></div><div style="display:flex;justify-content:center;gap:16px;margin:12px 0;"><a href="https://www.instagram.com/outfitkart_ecommers" target="_blank" style="color:#e1306c;font-size:20px;"><i class="fab fa-instagram"></i></a><a href="https://t.me/outfitkart" target="_blank" style="color:#0088cc;font-size:20px;"><i class="fab fa-telegram"></i></a></div><div class="footer-copy" style="font-size:10px;margin-top:10px;">© 2026 OutfitKart. All rights reserved. Made with ❤️ in India 🇮🇳</div>`;
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
  channelDiv.innerHTML = `<div id="ok-ref-channel-box"><div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🔔 Exclusive Deals & Codes</div><p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0 0 12px;line-height:1.5;">Hamare channels join karo — flash sales, promo codes & early access pao!</p><div style="display:flex;gap:10px;"><a href="https://t.me/outfitkart" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);"><i class="fab fa-telegram"></i> Telegram</a><a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);"><i class="fab fa-whatsapp"></i> WhatsApp</a></div></div>`;
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
