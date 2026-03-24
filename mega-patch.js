'use strict';
/* ================================================================
   OUTFITKART MEGA-PATCH v4.0
   Fixes & Features:
   1. Sponsored section appears BETWEEN products in trending grid
   2. Level badge visible in profile with custom name system
   3. Share OutfitKart text not hidden
   4. Level names: Bronze/Silver/Gold/Platinum with order thresholds shown in blue
   5. Telegram + WhatsApp shown on profile open
   6. Unbeatable prices auto-suggest from real products
   7. "Get App" button in header + Download popup with 10% off
   8. Footer with copyright © 2026 OutfitKart. All rights reserved.
   9. Profile → About Us (200+ lines), Terms of Service, Privacy Policy, Exchange Policy
   10. Gold products shown in trending grid on home
   11. All previous v3 features preserved
   ================================================================ */

/* ── 1. INJECT GLOBAL CSS ───────────────────────────────────── */
(function _injectV4CSS() {
  if (document.getElementById('ok-megapatch-v4-css')) return;
  const style = document.createElement('style');
  style.id = 'ok-megapatch-v4-css';
  style.textContent = `
    /* ── HOME PAGE ── */
    #view-home { background: #f8f8f8; }

    /* Trust badges strip */
    #ok-trust-strip {
      display: flex; align-items: center; justify-content: space-around;
      background: white; padding: 14px 12px; border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb; flex-wrap: wrap; gap: 8px;
    }
    .ok-trust-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #374151; min-width: 120px; }
    .ok-trust-item i { font-size: 18px; color: #111827; }
    .ok-trust-item strong { display: block; font-size: 12px; font-weight: 800; color: #111827; }
    .ok-trust-item span { font-size: 10px; color: #6b7280; }

    /* Category cards */
    #ok-shopco-cats { padding: 28px 16px; background: white; margin-top: 4px; }
    #ok-shopco-cats h2 { text-align: center; font-size: 1.4rem; font-weight: 900; color: #111827; margin-bottom: 20px; letter-spacing: -0.02em; }
    .ok-cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    @media(min-width:640px){ .ok-cat-grid { grid-template-columns: repeat(4, 1fr); } }
    .ok-cat-card { border-radius: 14px; overflow: hidden; cursor: pointer; position: relative; aspect-ratio: 3/4; background: #f3f4f6; transition: transform 0.25s ease, box-shadow 0.25s ease; border: 1px solid #e5e7eb; }
    .ok-cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
    .ok-cat-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .ok-cat-card-label { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.95); padding: 10px 14px; font-size: 13px; font-weight: 800; color: #111827; text-align: center; }
    .ok-viewall-btn { display: block; width: fit-content; margin: 16px auto 0; background: #111827; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; }
    .ok-viewall-btn:hover { background: #374151; }

    /* Promo banner */
    #ok-promo-banner-strip { background: #111827; color: white; text-align: center; padding: 10px; font-size: 12px; font-weight: 600; letter-spacing: 0.03em; }
    #ok-promo-banner-strip strong { color: #fbbf24; }

    /* ── REFERRALS PAGE FIX ── */
    #profile-page-referrals .profile-page-body { background: #f7f5f2; color: #111827; }
    #profile-page-referrals .text-xs, #profile-page-referrals .text-sm, #profile-page-referrals p, #profile-page-referrals span:not([style]) { color: #374151 !important; }
    #profile-page-referrals strong, #profile-page-referrals b { color: #111827 !important; }
    #profile-page-referrals .text-green-600 { color: #16a34a !important; }
    #profile-page-referrals .text-white { color: white !important; }
    #profile-page-referrals .bg-white { background: white !important; }

    /* ── LEVEL BADGE ── */
    #ok-profile-level-card { border-radius: 16px; padding: 16px; margin: 12px 16px; border: 2px solid; position: relative; overflow: hidden; }
    .ok-level-progress { height: 8px; background: #e5e7eb; border-radius: 99px; overflow: hidden; margin: 10px 0 6px; }
    .ok-level-progress-bar { height: 100%; border-radius: 99px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); animation: levelGrow 0.8s ease both; }
    @keyframes levelGrow { from { width: 0 !important; } }
    #ok-dash-level-pill { display:inline-flex;align-items:center;gap:8px;border-radius:99px;padding:5px 14px;margin-top:6px; }

    /* ── SPONSORED SECTION (inline in grid) ── */
    .ok-sponsor-inline { grid-column: 1 / -1; background: white; border-radius: 16px; padding: 16px; border: 1px solid #e5e7eb; margin: 4px 0; }
    .ok-sponsor-card { flex-shrink: 0; width: 220px; border-radius: 16px; overflow: hidden; cursor: pointer; display: block; text-decoration: none; transition: all 0.25s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
    .ok-sponsor-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .ok-sponsor-card img { width: 100%; height: 110px; object-fit: cover; display: block; }

    /* ── UNBEATABLE PRICES ── */
    #ok-unbeatable-section { margin-top: 16px; padding: 24px 16px 28px; position: relative; overflow: hidden; }
    .ok-unbeat-pill { flex-shrink: 0; border-radius: 12px; padding: 10px 18px; text-align: center; min-width: 90px; }
    .ok-unbeat-card { flex-shrink: 0; width: 145px; cursor: pointer; }
    .ok-unbeat-card-img-wrap { border-radius: 14px; overflow: hidden; border: 1px solid rgba(201,168,76,0.2); background: #1a1200; position: relative; }
    .ok-unbeat-card img { width: 100%; height: 175px; object-fit: cover; display: block; }

    /* ── REF CHANNELS ── */
    #ok-ref-channel-box { margin: 16px; background: linear-gradient(135deg,#0d0821,#1a0e00); border-radius: 18px; padding: 16px; }

    /* ── GET APP BUTTON ── */
    #ok-get-app-btn {
      display: flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg,#e11d48,#be123c);
      color: white; border: none; border-radius: 99px;
      padding: 7px 14px; font-size: 11px; font-weight: 800;
      cursor: pointer; white-space: nowrap;
      box-shadow: 0 3px 10px rgba(225,29,72,0.4);
      animation: appPulse 2.5s infinite;
    }
    @keyframes appPulse { 0%,100%{box-shadow:0 3px 10px rgba(225,29,72,0.4);} 50%{box-shadow:0 3px 20px rgba(225,29,72,0.7);} }

    /* ── APP DOWNLOAD POPUP ── */
    #ok-app-popup {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: flex-end; justify-content: center;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
    }
    #ok-app-popup-card {
      width: 100%; max-width: 480px;
      background: white; border-radius: 28px 28px 0 0;
      padding: 28px 24px 40px; position: relative;
      animation: slideUpPopup 0.4s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes slideUpPopup { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

    /* ── FOOTER ── */
    #ok-site-footer {
      background: #111827; color: #9ca3af;
      padding: 28px 20px 120px;
      text-align: center;
      border-top: 1px solid #374151;
    }
    #ok-site-footer .footer-brand {
      font-size: 1.1rem; font-weight: 900;
      background: linear-gradient(135deg,#C9A84C,#F5E6C0,#C9A84C);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; margin-bottom: 8px; display: block;
    }
    #ok-site-footer .footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 12px 0; }
    #ok-site-footer .footer-links a { color: #9ca3af; text-decoration: none; font-size: 11px; font-weight: 600; }
    #ok-site-footer .footer-links a:hover { color: white; }
    #ok-site-footer .footer-copy { font-size: 10px; color: #6b7280; margin-top: 10px; }

    /* ── SHARE BTN FIX ── */
    .share-outfitkart-btn {
      background: linear-gradient(135deg,#e11d48,#be123c) !important;
      animation: sharePulse 2.5s infinite !important;
    }

    /* scrollbar hide */
    .ok-hscroll { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 12px; padding-bottom: 8px; }
    .ok-hscroll::-webkit-scrollbar { display: none; }

    /* Policy pages */
    .ok-policy-section { max-width: 700px; margin: 0 auto; padding: 16px; }
    .ok-policy-section h2 { font-size: 1.3rem; font-weight: 900; color: #111827; margin: 24px 0 8px; }
    .ok-policy-section h3 { font-size: 1rem; font-weight: 800; color: #374151; margin: 16px 0 6px; }
    .ok-policy-section p { font-size: 13px; color: #4b5563; line-height: 1.7; margin: 6px 0; }
    .ok-policy-section ul { padding-left: 18px; margin: 6px 0; }
    .ok-policy-section li { font-size: 13px; color: #4b5563; line-height: 1.7; margin: 4px 0; }
    .ok-policy-section .highlight-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 12px; padding: 14px; margin: 12px 0; }
    .ok-policy-section .warning-box { background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 14px; margin: 12px 0; }
    .ok-policy-section .info-box { background: #eff6ff; border: 1.5px solid #93c5fd; border-radius: 12px; padding: 14px; margin: 12px 0; }
  `;
  document.head.appendChild(style);
})();

/* ── 2. SPONSOR STORAGE ─────────────────────────────────── */
const SPONSOR_STORAGE_KEY = 'outfitkart_sponsors_v1';
function _getSponsors() {
  try { const raw = localStorage.getItem(SPONSOR_STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [
    { id: 1, img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&q=80', title: 'HDFC Bank Credit Card', subtitle: 'Get ₹500 cashback on first swipe', tag: 'Sponsored', tagColor: '#3b82f6', link: 'https://www.hdfcbank.com', badge: '₹500 Cashback' },
    { id: 2, img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&q=80', title: 'Paytm Wallet', subtitle: 'Earn 2% cashback on every payment', tag: 'Partner', tagColor: '#0ea5e9', link: 'https://paytm.com', badge: '2% Cashback' },
    { id: 3, img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop&q=80', title: 'PhonePe Offers', subtitle: 'Shop & save more with PhonePe', tag: 'Offer', tagColor: '#8b5cf6', link: 'https://www.phonepe.com', badge: 'Special Offer' },
  ];
}
function _saveSponsors(s) { try { localStorage.setItem(SPONSOR_STORAGE_KEY, JSON.stringify(s)); } catch {} }

/* ── 3. INJECT SPONSORED BETWEEN PRODUCTS ───────────────── */
function _injectSponsorInGrid() {
  const trendingGrid = document.getElementById('trending-grid');
  if (!trendingGrid) return;
  if (trendingGrid.querySelector('.ok-sponsor-inline')) return;

  const sponsors = _getSponsors();
  if (!sponsors.length) return;

  const cards = trendingGrid.querySelectorAll('.product-card, [class*="product-card"]');
  // Insert after 4th product card
  const insertAfter = cards[3] || cards[cards.length - 1];
  if (!insertAfter) return;

  const wrap = document.createElement('div');
  wrap.className = 'ok-sponsor-inline';
  wrap.style.cssText = 'grid-column:1/-1;';
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <div>
        <h3 style="font-size:1rem;font-weight:900;color:#111827;margin:0;">💳 Offers & Partners</h3>
        <p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">Exclusive deals from our partners</p>
      </div>
      <span style="font-size:9px;font-weight:800;color:#6b7280;background:#f3f4f6;padding:3px 8px;border-radius:99px;letter-spacing:0.08em;text-transform:uppercase;">AD</span>
    </div>
    <div class="ok-hscroll">
      ${sponsors.map(b => `
        <a href="${b.link}" target="_blank" rel="noopener sponsored" class="ok-sponsor-card">
          <div style="position:relative;">
            <img src="${b.img}" loading="lazy" onerror="this.src='https://placehold.co/220x110/f3f4f6/9ca3af?text=${encodeURIComponent(b.title)}'">
            <div style="position:absolute;top:8px;left:8px;background:${b.tagColor};color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:99px;">${b.tag}</div>
            <div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:99px;">${b.badge}</div>
          </div>
          <div style="padding:10px 12px;background:white;">
            <div style="font-size:12px;font-weight:800;color:#111827;">${b.title}</div>
            <div style="font-size:10px;color:#6b7280;margin-top:2px;">${b.subtitle}</div>
            <div style="margin-top:8px;display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:${b.tagColor};">Know More <i class="fas fa-arrow-right" style="font-size:8px;"></i></div>
          </div>
        </a>
      `).join('')}
    </div>
    <p style="font-size:9px;color:#9ca3af;text-align:center;margin-top:8px;font-style:italic;">* Sponsored content. OutfitKart earns commission on partner links.</p>
  `;

  insertAfter.insertAdjacentElement('afterend', wrap);
}

/* ── 4. GOLD PRODUCTS IN TRENDING GRID ──────────────────── */
function _injectGoldInTrending() {
  const trendingGrid = document.getElementById('trending-grid');
  if (!trendingGrid) return;
  if (trendingGrid.querySelector('.ok-gold-trending-row')) return;

  const gProds = (window.goldProducts || []).slice(0, 6);
  if (!gProds.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'ok-gold-trending-row';
  wrap.style.cssText = 'grid-column:1/-1;';
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0 12px;">
      <div>
        <h3 style="font-size:1.1rem;font-weight:900;margin:0;background:linear-gradient(135deg,#C9A84C,#F5E6C0,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">⭐ OutfitKart Gold</h3>
        <p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">Premium curated picks</p>
      </div>
      <button onclick="navigate('gold')" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;border:none;padding:7px 16px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;">View All →</button>
    </div>
    <div class="ok-hscroll">
      ${gProds.map(p => {
        const img = p.imgs?.[0] || p.img || 'https://placehold.co/145x175/1a1200/C9A84C?text=Gold';
        return `<div style="flex-shrink:0;width:145px;cursor:pointer;" onclick="openProductPage(${p.id},true)">
          <div style="border-radius:14px;overflow:hidden;border:1.5px solid rgba(201,168,76,0.4);background:#1a1200;position:relative;">
            <img src="${img}" style="width:100%;height:175px;object-fit:cover;display:block;" loading="lazy">
            <div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#C9A84C,#F5E6C0);color:#3d2c00;font-size:9px;font-weight:900;padding:3px 7px;border-radius:99px;">⭐ GOLD</div>
          </div>
          <div style="padding:8px 4px;">
            <div style="font-size:11px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
            <div style="font-size:13px;font-weight:900;color:#C9A84C;margin-top:2px;">₹${p.price}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  trendingGrid.appendChild(wrap);
}

/* ── 5. HOME PAGE RENDERERS ─────────────────────────────── */
function _renderHomePromoBanner() {
  if (document.getElementById('ok-promo-banner-strip')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const banner = document.createElement('div');
  banner.id = 'ok-promo-banner-strip';
  banner.innerHTML = `<strong>FREE SHIPPING</strong> ON ORDERS OVER <strong>₹500</strong> &nbsp;•&nbsp; NEW STYLES JUST ARRIVED! &nbsp;•&nbsp; <strong>COD AVAILABLE</strong>`;
  homeView.insertBefore(banner, homeView.firstChild);
}

function _renderTrustStrip() {
  if (document.getElementById('ok-trust-strip')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const strip = document.createElement('div');
  strip.id = 'ok-trust-strip';
  strip.innerHTML = `
    <div class="ok-trust-item"><i class="fas fa-truck"></i><div><strong>Free Shipping</strong><span>On orders over ₹500</span></div></div>
    <div class="ok-trust-item"><i class="fas fa-undo-alt"></i><div><strong>Easy Exchange</strong><span>7 day exchange policy</span></div></div>
    <div class="ok-trust-item"><i class="fas fa-tag"></i><div><strong>Daily Deals</strong><span>Save up to 60% off</span></div></div>
    <div class="ok-trust-item"><i class="fas fa-headset"></i><div><strong>24/7 Support</strong><span>We're here to help</span></div></div>
  `;
  const carousel = document.getElementById('banner-carousel');
  if (carousel) carousel.insertAdjacentElement('afterend', strip);
}

function _renderShopByCategorySection() {
  if (document.getElementById('ok-shopco-cats')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const catData = [
    { name: 'Men', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=533&fit=crop&q=80', action: "openCategoryPage('Men')" },
    { name: 'Women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=533&fit=crop&q=80', action: "openCategoryPage('Women')" },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop&q=80', action: "openSubcatProducts('Men','Sneakers')" },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=533&fit=crop&q=80', action: "openCategoryPage('Accessories')" },
  ];
  const section = document.createElement('div');
  section.id = 'ok-shopco-cats';
  section.innerHTML = `
    <h2>Shop By Category</h2>
    <div class="ok-cat-grid">
      ${catData.map(c => `
        <div class="ok-cat-card" onclick="${c.action}">
          <img src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.src='https://placehold.co/300x400/f3f4f6/9ca3af?text=${c.name}'">
          <div class="ok-cat-card-label">${c.name}</div>
        </div>
      `).join('')}
    </div>
    <button class="ok-viewall-btn" onclick="navigate('shop')">View All Categories</button>
  `;
  const trustStrip = document.getElementById('ok-trust-strip');
  const carousel = document.getElementById('banner-carousel');
  const insertAfter = trustStrip || carousel;
  if (insertAfter) insertAfter.insertAdjacentElement('afterend', section);
}

/* ── 6. UNBEATABLE PRICES ───────────────────────────────── */
function _renderUnbeatableSection() {
  if (document.getElementById('ok-unbeatable-section')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;

  const allProds = (window.products || []).concat(window.goldProducts || []);
  const cheap = [...allProds].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 12);
  if (cheap.length === 0) return;

  const section = document.createElement('div');
  section.id = 'ok-unbeatable-section';
  section.style.cssText = 'background:linear-gradient(135deg,#0a0a0a 0%,#1a1200 40%,#0a0a0a 100%);';

  section.innerHTML = `
    <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.15),transparent 70%);pointer-events:none;"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;position:relative;">
      <div>
        <div style="font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:4px;">AI Curated</div>
        <h3 style="font-size:1.2rem;font-weight:900;color:white;margin:0;line-height:1.15;">🔥 Unbeatable Low Prices</h3>
        <p style="font-size:11px;color:rgba(255,255,255,0.45);margin:4px 0 0;font-style:italic;">Best deals handpicked for you</p>
      </div>
      <button onclick="navigate('shop')" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;border:none;padding:8px 16px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(201,168,76,0.4);">View All →</button>
    </div>
    <div class="ok-hscroll" style="margin-bottom:16px;">
      <div class="ok-unbeat-pill" style="background:rgba(225,29,72,0.15);border:1px solid rgba(225,29,72,0.3);">
        <div style="font-size:18px;font-weight:900;color:#f43f5e;">Starting<br>₹${cheap[0]?.price||99}</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Best Price</div>
      </div>
      <div class="ok-unbeat-pill" style="background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);">
        <div style="font-size:18px;font-weight:900;color:#C9A84C;">COD</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Available</div>
      </div>
      <div class="ok-unbeat-pill" style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);">
        <div style="font-size:18px;font-weight:900;color:#22c55e;">FREE</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Delivery</div>
      </div>
      <div class="ok-unbeat-pill" style="background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.3);">
        <div style="font-size:18px;font-weight:900;color:#60a5fa;">7 DAY</div>
        <div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Exchange</div>
      </div>
    </div>
    <div class="ok-hscroll">
      ${cheap.map(p => {
        const img = p.imgs?.[0] || p.img || 'https://placehold.co/145x175/1a1200/C9A84C?text=OK';
        const oldP = p.oldprice || Math.round(p.price * 1.4);
        const disc = Math.round(((oldP - p.price) / oldP) * 100);
        return `<div class="ok-unbeat-card" onclick="openProductPage(${p.id})">
          <div class="ok-unbeat-card-img-wrap">
            <img src="${img}" loading="lazy" onerror="this.src='https://placehold.co/145x175/1a1200/C9A84C?text=OK'">
            <div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#e11d48,#be123c);color:white;font-size:9px;font-weight:900;padding:3px 7px;border-radius:99px;">${disc}% OFF</div>
          </div>
          <div style="padding:8px 4px;">
            <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div>
            <div style="display:flex;align-items:center;gap:5px;margin-top:3px;">
              <span style="font-size:13px;font-weight:900;color:#C9A84C;">₹${p.price}</span>
              <span style="font-size:10px;text-decoration:line-through;color:rgba(255,255,255,0.35);">₹${oldP}</span>
            </div>
            <div style="font-size:9px;color:rgba(34,197,94,0.8);font-weight:700;margin-top:2px;">🚚 Free Delivery</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;

  const trending = homeView.querySelector('.mt-4.bg-white.p-4');
  if (trending) trending.insertAdjacentElement('beforebegin', section);
  else homeView.appendChild(section);
}

/* ── 7. GET APP BUTTON IN HEADER ─────────────────────────── */
function _injectGetAppButton() {
  if (document.getElementById('ok-get-app-btn')) return;
  const header = document.querySelector('header .flex.items-center.gap-3');
  if (!header) return;

  const btn = document.createElement('button');
  btn.id = 'ok-get-app-btn';
  btn.onclick = _showAppPopup;
  btn.innerHTML = `<i class="fas fa-download" style="font-size:10px;"></i> Get App`;
  btn.title = 'Download OutfitKart App & get 10% off!';

  // Insert before the first button in header
  const firstBtn = header.querySelector('button');
  if (firstBtn) header.insertBefore(btn, firstBtn);
  else header.appendChild(btn);
}

function _showAppPopup() {
  if (document.getElementById('ok-app-popup')) return;
  const popup = document.createElement('div');
  popup.id = 'ok-app-popup';
  popup.innerHTML = `
    <div id="ok-app-popup-card">
      <button onclick="document.getElementById('ok-app-popup').remove()" style="position:absolute;top:16px;right:16px;width:30px;height:30px;border-radius:50%;background:#f3f4f6;border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#374151;">✕</button>
      <div style="width:44px;height:5px;background:#e5e7eb;border-radius:99px;margin:0 auto 20px;"></div>
      <div style="text-align:center;margin-bottom:20px;">
        <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#e11d48,#be123c);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(225,29,72,0.35);">
          <i class="fas fa-shopping-bag" style="color:white;font-size:28px;"></i>
        </div>
        <h2 style="font-size:1.3rem;font-weight:900;color:#111827;margin:0 0 6px;">OutfitKart App</h2>
        <p style="font-size:13px;color:#6b7280;margin:0;">Premium fashion at your fingertips</p>
      </div>
      <div style="background:linear-gradient(135deg,#fef2f2,#fff1f2);border:2px solid #fecdd3;border-radius:16px;padding:16px;margin-bottom:20px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:6px;">🎁</div>
        <div style="font-size:1.1rem;font-weight:900;color:#e11d48;">10% OFF on first order!</div>
        <div style="font-size:12px;color:#6b7280;margin-top:4px;">Download now and use code <strong style="color:#e11d48;letter-spacing:0.1em;">APP10</strong></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="ok-install-pwa-btn" onclick="_handleAppInstall()" style="width:100%;background:linear-gradient(135deg,#e11d48,#be123c);color:white;border:none;padding:14px;border-radius:14px;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 6px 20px rgba(225,29,72,0.4);">
          <i class="fas fa-download" style="margin-right:8px;"></i>Install App (PWA)
        </button>
        <button onclick="applyPromoCode&&applyPromoCode('APP10');document.getElementById('ok-app-popup').remove();window.showToast&&showToast('🎉 10% off code APP10 applied!');" style="width:100%;background:#f9fafb;border:2px solid #e5e7eb;color:#374151;padding:12px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;">
          Use Code APP10 Without Installing
        </button>
      </div>
      <p style="text-align:center;font-size:10px;color:#9ca3af;margin-top:12px;">Add to home screen for the best experience</p>
    </div>
  `;
  document.body.appendChild(popup);
  popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
}

window._handleAppInstall = function() {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then(result => {
      if (result.outcome === 'accepted') {
        window.showToast && showToast('✅ App installed! Use APP10 for 10% off!');
      }
      document.getElementById('ok-app-popup')?.remove();
    });
  } else {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      window.showToast && showToast('📱 Safari → Share → "Add to Home Screen"');
    } else {
      window.showToast && showToast('📱 Browser menu → "Add to Home Screen"');
    }
    document.getElementById('ok-app-popup')?.remove();
  }
};

/* ── 8. LEVEL BADGE SYSTEM ──────────────────────────────── */
const LEVEL_DATA_V4 = [
  { name: 'OutfitKart Starter', minOrders: 0,  color: '#CD7F32', emoji: '🛍️', perks: 'COD + Free delivery on orders ₹500+', nextAt: 3 },
  { name: 'OutfitKart Silver',  minOrders: 3,  color: '#A8A8A8', emoji: '⭐', perks: '3% extra wallet cashback on orders', nextAt: 8 },
  { name: 'OutfitKart Gold',    minOrders: 8,  color: '#C9A84C', emoji: '🥇', perks: '5% cashback + priority support', nextAt: 20 },
  { name: 'OutfitKart Platinum',minOrders: 20, color: '#7B2FBE', emoji: '💎', perks: '8% cashback + exclusive early access', nextAt: null },
];

function _getLvlV4(count) {
  let l = LEVEL_DATA_V4[0];
  LEVEL_DATA_V4.forEach(x => { if (count >= x.minOrders) l = x; });
  return l;
}

function _renderLevelBadgeV4() {
  if (!window.currentUser) return;
  const orders = window.ordersDb || [];
  const count = orders.filter(o => o.status !== 'Cancelled').length;
  const lvl = _getLvlV4(count);
  const next = LEVEL_DATA_V4.find(l => l.minOrders > count);
  const pct = next ? Math.min(100, Math.round(((count - lvl.minOrders) / (next.minOrders - lvl.minOrders)) * 100)) : 100;

  // Dashboard pill
  let topPill = document.getElementById('ok-dash-level-pill');
  if (!topPill) {
    const sidebarLevel = document.getElementById('ok-sidebar-level');
    if (sidebarLevel) {
      topPill = document.createElement('div');
      topPill.id = 'ok-dash-level-pill';
      sidebarLevel.replaceWith(topPill);
    } else {
      const darkHeader = document.querySelector('#user-dashboard .p-5');
      if (darkHeader) {
        topPill = document.createElement('div');
        topPill.id = 'ok-dash-level-pill';
        darkHeader.appendChild(topPill);
      }
    }
  }
  if (topPill) {
    topPill.style.cssText = `display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,${lvl.color}30,${lvl.color}10);border:1.5px solid ${lvl.color}60;border-radius:99px;padding:5px 14px;margin-top:6px;`;
    topPill.innerHTML = `<span style="font-size:18px;">${lvl.emoji}</span><div><div style="font-size:11px;font-weight:900;color:${lvl.color};">${lvl.name}</div><div style="font-size:10px;color:rgba(255,255,255,0.55);">${count} orders completed</div></div>`;
  }

  // Full card in profile info
  const infoPage = document.getElementById('profile-page-info');
  if (infoPage) {
    document.getElementById('ok-level-card-full')?.remove();
    const wrap = infoPage.querySelector('.max-w-lg.mx-auto.p-4.space-y-4') || infoPage.querySelector('.max-w-lg.mx-auto.p-4');
    if (wrap) {
      const card = document.createElement('div');
      card.id = 'ok-level-card-full';
      card.innerHTML = `
        <div id="ok-profile-level-card" style="background:linear-gradient(135deg,${lvl.color}15,${lvl.color}05);border-color:${lvl.color}40;color:${lvl.color};">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <span style="font-size:2.5rem;">${lvl.emoji}</span>
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:900;color:${lvl.color};">${lvl.name}</div>
              <div style="font-size:11px;color:#6b7280;margin-top:2px;">${lvl.perks}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:24px;font-weight:900;color:${lvl.color};">${count}</div>
              <div style="font-size:10px;color:#9ca3af;">orders</div>
            </div>
          </div>
          <div class="ok-level-progress">
            <div class="ok-level-progress-bar" style="width:${pct}%;background:linear-gradient(90deg,${lvl.color},${lvl.color}cc);"></div>
          </div>
          <div style="font-size:11px;color:#3b82f6;font-weight:700;text-align:right;margin-top:4px;">
            ${next ? `${next.minOrders - count} aur orders complete karo ${next.emoji} ${next.name} ke liye` : '🎉 Maximum Level Achieved!'}
          </div>
        </div>
      `;
      wrap.insertBefore(card, wrap.firstChild);
    }
  }

  // Stat counter
  const statOrders = document.getElementById('stat-orders-count');
  if (statOrders) statOrders.textContent = count;
}

/* ── 9. REFERRALS PAGE FIXES ────────────────────────────── */
function _fixReferralsPage() {
  const refPage = document.getElementById('profile-page-referrals');
  if (!refPage || refPage.dataset.megaPatched) return;
  refPage.dataset.megaPatched = '1';

  const body = refPage.querySelector('.profile-page-body');
  if (!body) return;

  document.getElementById('ok-ref-channels')?.remove();
  document.getElementById('ok-ref-channel-box')?.remove();

  const channelBox = document.createElement('div');
  channelBox.id = 'ok-ref-channel-box';
  channelBox.innerHTML = `
    <div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🎁 Promo Codes Pao</div>
    <p style="font-size:12px;color:rgba(255,255,255,0.75);margin:0 0 12px;line-height:1.6;">Hamare channels join karo — exclusive promo codes, flash sales &amp; early access!</p>
    <div style="display:flex;gap:10px;">
      <a href="https://t.me/outfitkart" target="_blank" rel="noopener"
         style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:12px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);box-shadow:0 4px 12px rgba(0,136,204,0.4);">
        <i class="fab fa-telegram" style="font-size:16px;"></i> Join Telegram
      </a>
      <a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener"
         style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:12px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);box-shadow:0 4px 12px rgba(37,211,102,0.4);">
        <i class="fab fa-whatsapp" style="font-size:16px;"></i> Join WhatsApp
      </a>
    </div>
  `;
  body.insertBefore(channelBox, body.firstChild);
}

/* ── 10. TELEGRAM/WHATSAPP ON PROFILE OPEN ───────────────── */
function _injectChannelsInProfile() {
  const profileHome = document.getElementById('profile-home');
  if (!profileHome || document.getElementById('ok-profile-channels')) return;

  const channelDiv = document.createElement('div');
  channelDiv.id = 'ok-profile-channels';
  channelDiv.style.cssText = 'margin: 0 16px 16px;';
  channelDiv.innerHTML = `
    <div style="background:linear-gradient(135deg,#0d0821,#1a0e00);border-radius:16px;padding:16px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🔔 Exclusive Deals & Codes</div>
      <p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0 0 12px;line-height:1.5;">Hamare channels join karo — flash sales, promo codes &amp; early access pao!</p>
      <div style="display:flex;gap:10px;">
        <a href="https://t.me/outfitkart" target="_blank" rel="noopener"
           style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);">
          <i class="fab fa-telegram"></i> Telegram
        </a>
        <a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener"
           style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    </div>
  `;

  // Insert before support section
  const supportSection = profileHome.querySelector('.bg-white.rounded-2xl.shadow-sm.border.overflow-hidden.mb-4:nth-child(3)');
  if (supportSection) supportSection.insertAdjacentElement('beforebegin', channelDiv);
  else profileHome.appendChild(channelDiv);
}

/* ── 11. FOOTER ─────────────────────────────────────────── */
function _renderFooter() {
  if (document.getElementById('ok-site-footer')) return;
  const main = document.getElementById('app-content');
  if (!main) return;

  const footer = document.createElement('div');
  footer.id = 'ok-site-footer';
  footer.innerHTML = `
    <span class="footer-brand">OutfitKart</span>
    <p style="font-size:11px;color:#9ca3af;margin:0 0 8px;">Premium Fashion at Best Prices</p>
    <div class="footer-links">
      <a href="#" onclick="openProfilePage('about');return false;">About Us</a>
      <a href="#" onclick="openProfilePage('terms');return false;">Terms of Service</a>
      <a href="#" onclick="openProfilePage('privacy');return false;">Privacy Policy</a>
      <a href="#" onclick="openProfilePage('exchange-policy');return false;">Exchange Policy</a>
      <a href="#" onclick="openWhatsAppSupport&&openWhatsAppSupport();return false;">Support</a>
    </div>
    <div style="display:flex;justify-content:center;gap:16px;margin:12px 0;">
      <a href="https://www.instagram.com/outfitkart_ecommers" target="_blank" style="color:#e1306c;font-size:20px;"><i class="fab fa-instagram"></i></a>
      <a href="https://t.me/outfitkart" target="_blank" style="color:#0088cc;font-size:20px;"><i class="fab fa-telegram"></i></a>
      <a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" style="color:#25D366;font-size:20px;"><i class="fab fa-whatsapp"></i></a>
    </div>
    <div class="footer-copy">
      <i class="far fa-copyright"></i> 2026 OutfitKart. All rights reserved.<br>
      <span style="font-size:9px;">Made with ❤️ in India 🇮🇳</span>
    </div>
  `;
  main.appendChild(footer);
}

/* ── 12. POLICY PAGES ───────────────────────────────────── */
function _createPolicyPages() {
  // About Us
  if (!document.getElementById('profile-page-about')) {
    const div = document.createElement('div');
    div.id = 'profile-page-about';
    div.className = 'profile-page hidden';
    div.innerHTML = `
      <div class="profile-page-header">
        <button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button>
        <h2>About Us</h2>
        <div class="w-9"></div>
      </div>
      <div class="profile-page-body">
        <div class="ok-policy-section">
          <div style="text-align:center;padding:24px 0 12px;">
            <div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#e11d48,#be123c);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(225,29,72,0.3);">
              <i class="fas fa-shopping-bag" style="color:white;font-size:28px;"></i>
            </div>
            <h1 style="font-size:1.5rem;font-weight:900;background:linear-gradient(135deg,#C9A84C,#B8860B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">OutfitKart</h1>
            <p style="font-size:12px;color:#9ca3af;font-weight:600;letter-spacing:0.1em;">PREMIUM FASHION STORE</p>
          </div>

          <div class="info-box">
            <p style="font-weight:800;color:#1e40af;margin:0 0 4px;">🇮🇳 Proudly Made in India</p>
            <p style="margin:0;font-size:12px;">OutfitKart is an Indian D2C fashion brand committed to making premium fashion accessible to everyone at the best prices.</p>
          </div>

          <h2>Our Story</h2>
          <p>OutfitKart was founded with a simple yet powerful mission — to bring premium quality fashion to every corner of India at prices that don't break the bank. We believe that style should be accessible to everyone, regardless of their budget or location.</p>
          <p>Born out of a passion for fashion and technology, OutfitKart started as a small curated collection of trending outfits for men and women. Today, we have grown into a full-fledged fashion destination offering thousands of styles across multiple categories including Men's wear, Women's wear, Perfumes, Accessories, and our exclusive premium line — OutfitKart Gold.</p>

          <h2>Our Mission</h2>
          <p>Our mission is to democratize fashion in India. We curate the best products from trusted suppliers across the country and present them to you at transparent, honest prices. No hidden charges, no inflated MRPs — just great fashion at fair prices.</p>
          <p>We want every Indian to feel confident, stylish, and comfortable in what they wear, without having to compromise on quality or spend a fortune.</p>

          <h2>What Makes Us Different</h2>
          <h3>🎯 Curated Collections</h3>
          <p>Every single product on OutfitKart is hand-picked by our style team. We don't just list products — we curate experiences. From casual wear to formal attire, streetwear to ethnic fusion, we have something for every occasion and every mood.</p>

          <h3>💰 Unbeatable Prices</h3>
          <p>We work directly with manufacturers and trusted suppliers to eliminate middlemen. This allows us to pass on significant savings to our customers. Our AI-powered pricing engine constantly monitors the market to ensure you always get the best deal.</p>

          <h3>🚚 Cash on Delivery</h3>
          <p>We understand that trust is everything in online shopping. That's why we offer Cash on Delivery (COD) across India. Try before you pay — we believe in earning your trust with every order.</p>

          <h3>⭐ OutfitKart Gold</h3>
          <p>Our premium line, OutfitKart Gold, offers luxury-quality fashion at accessible prices. These are specially curated pieces that go through an extra quality check and are designed for those who want to stand out from the crowd. Gold products are marked with our signature gold star and come with premium packaging.</p>

          <h3>🔄 Hassle-Free Exchange</h3>
          <p>We want you to love what you buy. If for any reason you're not happy with the fit or style, our 7-day exchange policy makes it easy to swap for something you'll love. We believe in building long-term relationships with our customers.</p>

          <h3>🎁 Referral Program</h3>
          <p>We believe the best marketing is word of mouth. That's why we reward you for sharing OutfitKart with your friends and family. Earn 5% commission on every order made through your referral link. The more you share, the more you earn!</p>

          <h3>📱 OutfitKart App</h3>
          <p>Our Progressive Web App (PWA) offers a native app-like experience on both Android and iOS. Install it from your browser in seconds — no app store needed. Get exclusive app-only deals and a smoother shopping experience.</p>

          <h2>Our Values</h2>
          <ul>
            <li><strong>Transparency:</strong> Honest pricing, clear policies, no hidden fees.</li>
            <li><strong>Quality:</strong> Every product is checked before it reaches you.</li>
            <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
            <li><strong>Sustainability:</strong> We are working towards eco-friendly packaging.</li>
            <li><strong>Inclusivity:</strong> Fashion for all — all sizes, all styles, all budgets.</li>
            <li><strong>Innovation:</strong> Constantly improving our platform with the latest technology.</li>
          </ul>

          <h2>Our Team</h2>
          <p>OutfitKart is run by a passionate team of fashion enthusiasts, tech lovers, and customer service champions. Our founders, Shailesh Kumar Chauhan and Aman Kumar Chauhan, built OutfitKart from the ground up with a vision to create India's most loved fashion brand.</p>
          <p>Our team works tirelessly to source the best products, ensure timely delivery, and provide world-class customer support. We are a small but mighty team, united by our love for fashion and our commitment to making you look and feel great.</p>

          <h2>Our Catalog</h2>
          <p>We offer a wide range of products across multiple categories:</p>
          <ul>
            <li><strong>Men's Fashion:</strong> T-Shirts, Casual & Formal Shirts, Oversized Tees, Hoodies, Denim Jackets, Jeans, Trousers, Joggers, Cargo Pants, Footwear, and Full Combos.</li>
            <li><strong>Women's Fashion:</strong> Sarees, Kurtis, Lehengas, Tops, Dresses, Palazzo, Jeans, Ethnic Sets, Western Combos, and Footwear.</li>
            <li><strong>Perfumes:</strong> Men's, Women's, and Unisex fragrances from premium brands. Including Attars, Body Mists, and Gift Sets.</li>
            <li><strong>Accessories:</strong> Sunglasses, Watches, Wallets, Bags, Belts, Caps, Chains, Earrings, and Tech Accessories.</li>
            <li><strong>OutfitKart Gold:</strong> Exclusive premium collection curated for those who demand the best.</li>
          </ul>

          <h2>Community & Social</h2>
          <p>OutfitKart is more than just a store — it's a community. Join thousands of fashion lovers on our social media channels for daily inspiration, exclusive deals, styling tips, and more.</p>
          <ul>
            <li>📸 Instagram: @outfitkart_ecommers</li>
            <li>📢 Telegram Channel: t.me/outfitkart</li>
            <li>💬 WhatsApp Channel: Join for exclusive deals</li>
          </ul>

          <h2>Influencer Program</h2>
          <p>Are you a content creator? Partner with OutfitKart and earn money doing what you love! Our Influencer Program pays ₹50 per 1,000 views on your OutfitKart content. Create reels, videos, or posts featuring our products and submit them through the app to earn rewards directly in your OutfitKart Wallet.</p>

          <h2>OutfitKart Wallet</h2>
          <p>Earn cashback, referral commissions, and influencer rewards directly in your OutfitKart Wallet. Use your wallet balance to pay for future orders or withdraw to your bank/UPI account (minimum withdrawal: ₹120). Your money, your way.</p>

          <h2>Contact Us</h2>
          <p>We'd love to hear from you! Whether you have a question, a complaint, or just want to say hi, reach out to us:</p>
          <ul>
            <li>📧 Email: outfitkartpremiumfashion@gmail.com</li>
            <li>📱 WhatsApp: +91 8982296773</li>
            <li>⏰ Support Hours: 9 AM – 9 PM, Monday to Saturday</li>
          </ul>

          <div class="highlight-box" style="margin-top:20px;text-align:center;">
            <p style="font-weight:900;color:#14532d;font-size:14px;margin:0 0 4px;">Thank you for choosing OutfitKart!</p>
            <p style="font-size:12px;color:#166534;margin:0;">Your trust is our biggest achievement. 🙏</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById('user-dashboard')?.appendChild(div);
  }

  // Terms of Service
  if (!document.getElementById('profile-page-terms')) {
    const div = document.createElement('div');
    div.id = 'profile-page-terms';
    div.className = 'profile-page hidden';
    div.innerHTML = `
      <div class="profile-page-header">
        <button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button>
        <h2>Terms of Service</h2>
        <div class="w-9"></div>
      </div>
      <div class="profile-page-body">
        <div class="ok-policy-section">
          <p style="font-size:11px;color:#9ca3af;margin-bottom:16px;">Last Updated: March 2026 | Effective: Immediately</p>

          <div class="info-box"><p style="margin:0;font-size:12px;color:#1e40af;">By using OutfitKart, you agree to these Terms of Service. Please read them carefully.</p></div>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the OutfitKart platform (website, mobile app, or PWA), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our services.</p>

          <h2>2. Account Registration</h2>
          <p>To access certain features, you must create an account using your mobile number and password. You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate and complete information during registration. OutfitKart reserves the right to terminate accounts that violate these terms.</p>

          <h2>3. Ordering & Payments</h2>
          <h3>3.1 Order Placement</h3>
          <p>When you place an order, you are making an offer to purchase the product at the listed price. OutfitKart reserves the right to accept or reject any order. Orders are confirmed only upon receipt of payment (for UPI/card) or order confirmation (for COD).</p>
          <h3>3.2 Pricing</h3>
          <p>All prices are listed in Indian Rupees (₹) and include applicable taxes. OutfitKart reserves the right to change prices at any time without notice. Prices at the time of order confirmation are final.</p>
          <h3>3.3 Payment Methods</h3>
          <p>We accept UPI, Credit/Debit Cards (via Razorpay), Cash on Delivery (COD), and OutfitKart Wallet. A handling fee of ₹9 applies to COD orders. A platform fee of ₹7 applies to all orders.</p>

          <h2>4. Shipping & Delivery</h2>
          <p>Standard delivery takes 3-7 working days depending on your location. Free delivery on orders above ₹500. OutfitKart is not responsible for delays caused by courier partners, natural disasters, or other unforeseen circumstances. Delivery is attempted 3 times before the order is returned.</p>

          <h2>5. Exchange Policy</h2>
          <p>OutfitKart operates an EXCHANGE ONLY policy. We do not offer cash refunds on products. Please read our full Exchange Policy for details on eligibility, process, and timelines.</p>

          <h2>6. Referral Program</h2>
          <p>Users may earn 5% commission on purchases made through their referral link. Commissions are credited to your OutfitKart Wallet after a 30-day waiting period. OutfitKart reserves the right to cancel commissions from fraudulent or suspicious referrals. Commission rates may change at any time.</p>

          <h2>7. Wallet & Withdrawals</h2>
          <p>OutfitKart Wallet balance can be earned through referrals, cashback, and influencer rewards. Minimum withdrawal amount is ₹120. Withdrawals are processed within 24-48 hours to your UPI/bank account. Wallet balance cannot be transferred to other users.</p>

          <h2>8. Influencer Program</h2>
          <p>Content creators can earn ₹50 per 1,000 verified views. Submissions are reviewed within 7 working days. OutfitKart reserves the right to reject submissions that don't meet quality standards. Earnings are credited to the OutfitKart Wallet upon approval.</p>

          <h2>9. Prohibited Activities</h2>
          <ul>
            <li>Creating fake accounts or placing fraudulent orders</li>
            <li>Abusing the referral or cashback system</li>
            <li>Submitting false influencer views</li>
            <li>Attempting to hack or compromise our platform</li>
            <li>Using our platform for any illegal activity</li>
            <li>Copying our product catalog or platform design</li>
          </ul>

          <h2>10. Intellectual Property</h2>
          <p>All content on OutfitKart including logos, images, text, and design is the exclusive property of OutfitKart. Unauthorized reproduction or distribution is strictly prohibited.</p>

          <h2>11. Limitation of Liability</h2>
          <p>OutfitKart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our maximum liability is limited to the amount paid for the specific order in question.</p>

          <h2>12. Privacy</h2>
          <p>Your use of OutfitKart is also governed by our Privacy Policy. By using our platform, you consent to the collection and use of your data as described in the Privacy Policy.</p>

          <h2>13. Changes to Terms</h2>
          <p>OutfitKart reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>

          <h2>14. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.</p>

          <h2>15. Contact</h2>
          <p>For any questions about these Terms, contact us at outfitkartpremiumfashion@gmail.com or WhatsApp +91 8982296773.</p>

          <div class="warning-box"><p style="margin:0;font-size:12px;color:#991b1b;">OutfitKart operates an <strong>EXCHANGE ONLY</strong> policy. No cash refunds are offered except in cases where payment was made via UPI/card and the order was cancelled before dispatch.</p></div>
        </div>
      </div>
    `;
    document.getElementById('user-dashboard')?.appendChild(div);
  }

  // Privacy Policy
  if (!document.getElementById('profile-page-privacy')) {
    const div = document.createElement('div');
    div.id = 'profile-page-privacy';
    div.className = 'profile-page hidden';
    div.innerHTML = `
      <div class="profile-page-header">
        <button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button>
        <h2>Privacy Policy</h2>
        <div class="w-9"></div>
      </div>
      <div class="profile-page-body">
        <div class="ok-policy-section">
          <p style="font-size:11px;color:#9ca3af;margin-bottom:16px;">Last Updated: March 2026 | We take your privacy seriously.</p>

          <div class="highlight-box"><p style="margin:0;font-size:12px;color:#14532d;">OutfitKart does not sell your personal data to third parties. Your information is used only to improve your shopping experience.</p></div>

          <h2>1. Information We Collect</h2>
          <h3>1.1 Personal Information</h3>
          <p>When you create an account or place an order, we collect: full name, mobile number, email address (optional), delivery address (pincode, city, state), and UPI ID (for withdrawals only).</p>
          <h3>1.2 Usage Data</h3>
          <p>We automatically collect: pages visited, products viewed, search queries, time spent on pages, and device/browser information. This data is used to improve our platform and personalize your experience.</p>
          <h3>1.3 Payment Information</h3>
          <p>OutfitKart does not store payment card details. All payments are processed securely by Razorpay, a RBI-certified payment gateway. We only receive a transaction confirmation and payment ID.</p>
          <h3>1.4 Push Notifications</h3>
          <p>If you enable push notifications, we store your device's push subscription token to send you order updates and promotions. You can disable notifications at any time.</p>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To send order updates, shipping notifications, and delivery confirmations</li>
            <li>To personalize your shopping experience with AI-powered recommendations</li>
            <li>To calculate and process referral commissions</li>
            <li>To manage your OutfitKart Wallet</li>
            <li>To send promotional messages (with your consent)</li>
            <li>To improve our platform and fix bugs</li>
            <li>To prevent fraud and ensure platform security</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>We share your data only with trusted partners who help us deliver our services:</p>
          <ul>
            <li><strong>Supabase:</strong> Our database provider (data stored in secure cloud)</li>
            <li><strong>Razorpay:</strong> Payment processing (PCI-DSS compliant)</li>
            <li><strong>Courier Partners:</strong> Your name, address, and phone for delivery</li>
            <li><strong>ImgBB:</strong> Image hosting for profile pictures</li>
          </ul>
          <p>We do NOT share your data with advertisers, data brokers, or any unauthorized third parties.</p>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures including HTTPS encryption, Row Level Security (RLS) on our database, and regular security audits. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data stored by OutfitKart</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt out of promotional communications</li>
            <li>Disable push notifications at any time</li>
          </ul>
          <p>To exercise these rights, contact us at outfitkartpremiumfashion@gmail.com</p>

          <h2>6. Cookies & Local Storage</h2>
          <p>OutfitKart uses browser localStorage to store your cart, session data, and preferences. This data stays on your device and is never transmitted to third parties. You can clear this data at any time through your browser settings.</p>

          <h2>7. Children's Privacy</h2>
          <p>OutfitKart is not intended for users under the age of 13. We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.</p>

          <h2>8. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email. Continued use after changes constitutes acceptance.</p>

          <h2>9. Contact</h2>
          <p>For privacy concerns: outfitkartpremiumfashion@gmail.com | WhatsApp: +91 8982296773</p>
        </div>
      </div>
    `;
    document.getElementById('user-dashboard')?.appendChild(div);
  }

  // Exchange Policy
  if (!document.getElementById('profile-page-exchange-policy')) {
    const div = document.createElement('div');
    div.id = 'profile-page-exchange-policy';
    div.className = 'profile-page hidden';
    div.innerHTML = `
      <div class="profile-page-header">
        <button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button>
        <h2>Exchange Policy</h2>
        <div class="w-9"></div>
      </div>
      <div class="profile-page-body">
        <div class="ok-policy-section">
          <div style="text-align:center;padding:20px 0 12px;">
            <div style="font-size:3rem;margin-bottom:8px;">🔄</div>
            <h1 style="font-size:1.3rem;font-weight:900;color:#111827;margin:0;">EXCHANGE ONLY POLICY</h1>
            <p style="font-size:12px;color:#e11d48;font-weight:700;margin:4px 0 0;">OutfitKart does not offer cash refunds on delivered products</p>
          </div>

          <div class="warning-box">
            <p style="font-weight:800;color:#991b1b;margin:0 0 6px;">⚠️ Important Notice</p>
            <p style="margin:0;font-size:12px;color:#7f1d1d;">OutfitKart operates an <strong>EXCHANGE ONLY</strong> policy for all delivered orders. We believe in giving you the best product, not taking back your order. Once a product is delivered, no cash refund is issued under any circumstances except manufacturing defects or wrong product delivery.</p>
          </div>

          <h2>Why Exchange Only?</h2>
          <p>We operate on a lean D2C (Direct-to-Consumer) model that allows us to offer premium quality at unbeatable prices. A full refund model would significantly increase our operational costs, which would ultimately be passed on to you as the customer. Our exchange policy ensures you always get a product you love, while keeping prices low for everyone.</p>

          <h2>Exchange Eligibility</h2>
          <div class="highlight-box">
            <p style="font-weight:800;color:#14532d;margin:0 0 8px;">✅ You CAN exchange if:</p>
            <ul style="margin:0;padding-left:16px;">
              <li style="color:#166534;font-size:13px;">The order status is "Delivered"</li>
              <li style="color:#166534;font-size:13px;">The product is unused, unwashed, and in original condition</li>
              <li style="color:#166534;font-size:13px;">All tags and packaging are intact</li>
              <li style="color:#166534;font-size:13px;">Exchange request is made within <strong>7 days</strong> of delivery</li>
              <li style="color:#166534;font-size:13px;">Size or color doesn't fit (for clothing items)</li>
            </ul>
          </div>
          <div class="warning-box">
            <p style="font-weight:800;color:#991b1b;margin:0 0 8px;">❌ You CANNOT exchange if:</p>
            <ul style="margin:0;padding-left:16px;">
              <li style="color:#7f1d1d;font-size:13px;">The product has been used, washed, or worn</li>
              <li style="color:#7f1d1d;font-size:13px;">Tags have been removed</li>
              <li style="color:#7f1d1d;font-size:13px;">More than 7 days have passed since delivery</li>
              <li style="color:#7f1d1d;font-size:13px;">The product is a Perfume (hygiene reasons)</li>
              <li style="color:#7f1d1d;font-size:13px;">Damage is due to customer misuse</li>
              <li style="color:#7f1d1d;font-size:13px;">The product was purchased during a sale (unless wrong product)</li>
            </ul>
          </div>

          <h2>How to Exchange</h2>
          <p>The exchange process is simple:</p>
          <ol style="padding-left:20px;">
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>Go to My Orders</strong> in the app and find your delivered order.</li>
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>Click "Exchange"</strong> button on the order.</li>
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>Browse our catalog</strong> and choose your replacement product.</li>
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>Place the new order.</strong> Your old order's value will be applied as a discount.</li>
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>Ship back</strong> the old product to our address (shipping cost: customer's responsibility).</li>
            <li style="font-size:13px;color:#374151;margin:6px 0;line-height:1.6;"><strong>New product ships</strong> within 2-3 days of receiving the returned item.</li>
          </ol>

          <h2>Price Difference in Exchange</h2>
          <p>If your exchange product costs more than the original: You pay the difference (+ platform fee).</p>
          <p>If your exchange product costs less than the original: The extra value is added to your OutfitKart Wallet as credit (not refunded as cash).</p>
          <p>If the prices are equal: Only the platform fee (₹7) is charged for the new order.</p>

          <h2>Wrong Product / Manufacturing Defect</h2>
          <p>In the rare case that you receive a wrong product or a product with a manufacturing defect, we will arrange a pickup at our cost and send you the correct product as quickly as possible. Please contact us within 48 hours of delivery with photos of the issue.</p>

          <h2>COD Order Cancellations</h2>
          <p>For COD orders cancelled before dispatch: No charges apply.</p>
          <p>For COD orders cancelled after dispatch but before delivery: A ₹50 return shipping fee applies, debited from your OutfitKart Wallet if sufficient balance exists.</p>

          <h2>UPI/Card Order Cancellations (Before Dispatch)</h2>
          <p>If you cancel a UPI/Card paid order before it is dispatched, the full amount will be refunded to your original payment method within 5-7 business days, or immediately to your OutfitKart Wallet if you prefer.</p>

          <h2>Contact for Exchange</h2>
          <p>Need help with an exchange? Contact us:</p>
          <ul>
            <li>📱 WhatsApp: +91 8982296773</li>
            <li>📧 Email: outfitkartpremiumfashion@gmail.com</li>
            <li>⏰ Hours: 9 AM – 9 PM, Mon–Sat</li>
          </ul>

          <div class="info-box" style="margin-top:20px;">
            <p style="font-weight:800;color:#1e40af;margin:0 0 4px;">💡 Pro Tip</p>
            <p style="margin:0;font-size:12px;color:#1e3a8a;">Always check the size chart before ordering. Our size guide is available on every product page. When in doubt, size up! Oversized fits are always in trend. 😄</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById('user-dashboard')?.appendChild(div);
  }
}

/* ── 13. ADD ABOUT/TERMS/PRIVACY/EXCHANGE TO HELP PAGE ──── */
function _addPolicyMenuItems() {
  const helpPage = document.getElementById('profile-page-help');
  if (!helpPage || document.getElementById('ok-policy-menu-added')) return;
  document.getElementById('ok-policy-menu-injected')?.remove();

  const body = helpPage.querySelector('.profile-page-body');
  if (!body) return;

  const menuDiv = document.createElement('div');
  menuDiv.id = 'ok-policy-menu-added';
  menuDiv.className = 'max-w-lg mx-auto px-4 pb-4';

  menuDiv.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border overflow-hidden mb-3">
      <button onclick="openProfilePage('about')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#FFF1F2;"><i class="fas fa-info-circle text-rose-500 text-sm"></i></div>
        <div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">About OutfitKart</div><div class="text-xs text-gray-500">Our story & mission</div></div>
        <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
      </button>
      <button onclick="openProfilePage('terms')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#EFF6FF;"><i class="fas fa-file-contract text-blue-500 text-sm"></i></div>
        <div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Terms of Service</div><div class="text-xs text-gray-500">Rules & conditions</div></div>
        <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
      </button>
      <button onclick="openProfilePage('privacy')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#F0FDF4;"><i class="fas fa-shield-alt text-green-500 text-sm"></i></div>
        <div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Privacy Policy</div><div class="text-xs text-gray-500">How we use your data</div></div>
        <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
      </button>
      <button onclick="openProfilePage('exchange-policy')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-all">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#FFFBEB;"><i class="fas fa-exchange-alt text-amber-500 text-sm"></i></div>
        <div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Exchange Policy</div><div class="text-xs text-gray-500">Exchange only — no returns</div></div>
        <i class="fas fa-chevron-right text-gray-300 text-xs"></i>
      </button>
    </div>
  `;

  body.insertBefore(menuDiv, body.firstChild);
}

/* ── 14. PATCH openProfilePage ───────────────────────────── */
function _patchOpenProfilePageV4() {
  const orig = window.openProfilePage;
  if (!orig || window._profilePagePatchedV4) return;
  window._profilePagePatchedV4 = true;

  window.openProfilePage = function(page) {
    // Handle new policy pages
    if (['about','terms','privacy','exchange-policy'].includes(page)) {
      document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
      const target = document.getElementById(`profile-page-${page}`);
      if (target) {
        target.classList.remove('hidden');
        window.scrollTo(0, 0);
      }
      return;
    }

    orig(page);

    if (page === 'referrals') setTimeout(_fixReferralsPage, 150);
    if (page === 'info') setTimeout(_renderLevelBadgeV4, 300);
    if (page === 'orders') setTimeout(_renderLevelBadgeV4, 300);
    if (page === 'help') setTimeout(_addPolicyMenuItems, 100);
  };
}

/* ── 15. PATCH navigate FOR HOME RE-RENDER ──────────────── */
function _patchNavigateV4() {
  const origNav = window.navigate;
  if (!origNav || window._megaNavPatchedV4) return;
  window._megaNavPatchedV4 = true;

  window.navigate = function(view, cat) {
    origNav(view, cat);
    if (view === 'home') {
      setTimeout(() => {
        _renderHomePromoBanner();
        _renderTrustStrip();
        _renderShopByCategorySection();
        _renderUnbeatableSection();
        // Inject sponsor + gold in trending
        setTimeout(() => {
          _injectSponsorInGrid();
          _injectGoldInTrending();
        }, 600);
      }, 300);
    }
    if (view === 'profile') {
      setTimeout(() => {
        _renderLevelBadgeV4();
        _injectChannelsInProfile();
      }, 500);
    }
  };
}

/* ── 16. MutationObserver ───────────────────────────────── */
function _initObserverV4() {
  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type !== 'attributes' || m.attributeName !== 'class') return;
      const el = m.target;
      if (el.id === 'profile-page-referrals' && !el.classList.contains('hidden')) {
        setTimeout(_fixReferralsPage, 100);
      }
      if (el.id === 'user-dashboard' && !el.classList.contains('hidden')) {
        setTimeout(() => { _renderLevelBadgeV4(); _injectChannelsInProfile(); }, 300);
      }
      if (el.id === 'profile-page-info' && !el.classList.contains('hidden')) {
        setTimeout(_renderLevelBadgeV4, 200);
      }
      if (el.id === 'view-home' && !el.classList.contains('hidden')) {
        setTimeout(() => {
          _renderHomePromoBanner();
          _renderTrustStrip();
          _renderShopByCategorySection();
          _renderUnbeatableSection();
          setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 800);
        }, 200);
      }
      if (el.id === 'trending-grid') {
        setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 500);
      }
    });
  });
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

  // Also watch trending-grid for childList changes (products loading in)
  const trendingGrid = document.getElementById('trending-grid');
  if (trendingGrid) {
    const gridObs = new MutationObserver(() => {
      setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 400);
    });
    gridObs.observe(trendingGrid, { childList: true });
  }
}

/* ── 17. SHARE BTN FIX ──────────────────────────────────── */
function _fixShareBtn() {
  const shareBtn = document.querySelector('.share-outfitkart-btn');
  if (!shareBtn) return;
  shareBtn.style.cssText += 'background:linear-gradient(135deg,#e11d48,#be123c)!important;color:white!important;';
  const textEl = shareBtn.querySelector('div div:first-child');
  if (textEl) textEl.style.color = 'white';
  const subEl = shareBtn.querySelector('div div:last-child');
  if (subEl) subEl.style.color = 'rgba(255,255,255,0.8)';
}

/* ── 18. INIT ────────────────────────────────────────────── */
function _initV4() {
  _patchNavigateV4();
  _patchOpenProfilePageV4();
  _injectGetAppButton();
  _renderFooter();
  _createPolicyPages();

  // Home page initial render
  setTimeout(() => {
    _renderHomePromoBanner();
    _renderTrustStrip();
    _renderShopByCategorySection();
    _fixShareBtn();

    // Wait for products before rendering price sections
    let attempts = 0;
    const waitProds = setInterval(() => {
      attempts++;
      const hasProds = (window.products || []).length > 0 || (window.goldProducts || []).length > 0;
      if (hasProds || attempts > 10) {
        clearInterval(waitProds);
        _renderUnbeatableSection();
        setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 600);
      }
    }, 500);
  }, 800);

  // Level badge
  setTimeout(_renderLevelBadgeV4, 1200);

  // Channels in profile if visible
  const userDash = document.getElementById('user-dashboard');
  if (userDash && !userDash.classList.contains('hidden')) {
    setTimeout(_injectChannelsInProfile, 400);
  }

  // Referrals page if visible
  const refPage = document.getElementById('profile-page-referrals');
  if (refPage && !refPage.classList.contains('hidden')) setTimeout(_fixReferralsPage, 200);

  // Init observer
  setTimeout(_initObserverV4, 1000);

  // Add help policy menu on help page
  const helpPage = document.getElementById('profile-page-help');
  if (helpPage && !helpPage.classList.contains('hidden')) setTimeout(_addPolicyMenuItems, 100);

  console.log('%cOutfitKart MegaPatch v4 ✅ — Sponsor in Grid | Gold in Trending | Level Badge | Footer | Policy Pages | Get App Button', 'color:#C9A84C;font-weight:900;font-size:12px;');
}

/* ── EXPORTS ─────────────────────────────────────────────── */
Object.assign(window, {
  _getSponsors, _saveSponsors,
  _renderLevelBadgeV4,
  _fixReferralsPage,
  _renderUnbeatableSection,
  _renderShopByCategorySection,
  _renderTrustStrip,
  _renderHomePromoBanner,
  _injectSponsorInGrid,
  _injectGoldInTrending,
  _showAppPopup,
  _renderFooter,
  _createPolicyPages,
  _injectChannelsInProfile,
});

/* Boot */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_initV4, 500));
} else {
  setTimeout(_initV4, 500);
}
