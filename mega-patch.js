'use strict';
/* ================================================================
   OUTFITKART MEGA-PATCH v3.0
   Fixes:
   1. Home page styling matching shop.co design (banner, categories, trust badges)
   2. Oversized Shirts removed from Men's category
   3. Referrals page text color fix + Telegram/WhatsApp channels
   4. Level badge showing in profile
   5. Admin-configurable sponsored/affiliate section
   6. Unbeatable prices section
   7. All previous features preserved
   ================================================================ */

/* ── 1. INJECT GLOBAL CSS FIXES ─────────────────────────────── */
(function _injectGlobalCSS() {
  if (document.getElementById('ok-megapatch-v3-css')) return;
  const style = document.createElement('style');
  style.id = 'ok-megapatch-v3-css';
  style.textContent = `
    /* ── HOME PAGE - SHOP.CO INSPIRED DESIGN ── */
    #view-home { background: #f8f8f8; }

    /* Trust badges strip */
    #ok-trust-strip {
      display: flex; align-items: center; justify-content: space-around;
      background: white; padding: 14px 12px; border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb; flex-wrap: wrap; gap: 8px;
    }
    .ok-trust-item {
      display: flex; align-items: center; gap: 8px;
      font-size: 11px; color: #374151; min-width: 120px;
    }
    .ok-trust-item i { font-size: 18px; color: #111827; }
    .ok-trust-item strong { display: block; font-size: 12px; font-weight: 800; color: #111827; }
    .ok-trust-item span { font-size: 10px; color: #6b7280; }

    /* Category cards - shop.co style */
    #ok-shopco-cats { padding: 28px 16px; background: white; margin-top: 4px; }
    #ok-shopco-cats h2 { text-align: center; font-size: 1.4rem; font-weight: 900; color: #111827; margin-bottom: 20px; letter-spacing: -0.02em; }
    .ok-cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    @media(min-width: 640px) { .ok-cat-grid { grid-template-columns: repeat(4, 1fr); } }
    .ok-cat-card {
      border-radius: 14px; overflow: hidden; cursor: pointer; position: relative;
      aspect-ratio: 3/4; background: #f3f4f6;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      border: 1px solid #e5e7eb;
    }
    .ok-cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
    .ok-cat-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .ok-cat-card-label {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(255,255,255,0.95); padding: 10px 14px;
      font-size: 13px; font-weight: 800; color: #111827; text-align: center;
      letter-spacing: 0.01em;
    }
    .ok-viewall-btn {
      display: block; width: fit-content; margin: 16px auto 0;
      background: #111827; color: white; border: none;
      padding: 12px 32px; border-radius: 8px; font-size: 13px;
      font-weight: 700; cursor: pointer; letter-spacing: 0.04em;
      transition: background 0.2s;
    }
    .ok-viewall-btn:hover { background: #374151; }

    /* Promo banner strip - shop.co style */
    #ok-promo-banner-strip {
      background: #111827; color: white;
      text-align: center; padding: 10px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.03em;
    }
    #ok-promo-banner-strip strong { color: #fbbf24; }

    /* ── REFERRALS PAGE FIX ── */
    #profile-page-referrals,
    #profile-page-referrals * {
      color: inherit;
    }
    #profile-page-referrals .profile-page-body {
      background: #f7f5f2;
      color: #111827;
    }
    #profile-page-referrals .space-y-2 > div,
    #profile-page-referrals .text-xs,
    #profile-page-referrals .text-sm,
    #profile-page-referrals p,
    #profile-page-referrals span:not([style]) {
      color: #374151 !important;
    }
    #profile-page-referrals strong,
    #profile-page-referrals b {
      color: #111827 !important;
    }
    #profile-page-referrals .text-green-600 { color: #16a34a !important; }
    #profile-page-referrals .text-amber-600 { color: #d97706 !important; }
    #profile-page-referrals .text-red-400 { color: #f87171 !important; }
    #profile-page-referrals .text-white { color: white !important; }
    #profile-page-referrals .bg-green-50 { background: #f0fdf4 !important; }
    #profile-page-referrals .bg-amber-50 { background: #fffbeb !important; }
    #profile-page-referrals .bg-red-50 { background: #fef2f2 !important; }
    #profile-page-referrals .bg-white { background: white !important; }

    /* referral how it works box */
    #profile-page-referrals .bg-gradient-to-br.from-green-50 { background: linear-gradient(135deg,#f0fdf4,#dcfce7) !important; }
    #profile-page-referrals .bg-gradient-to-br.from-green-50 * { color: #166534 !important; }
    #profile-page-referrals .bg-gradient-to-br.from-green-50 strong { color: #14532d !important; }

    /* ── LEVEL BADGE ── */
    #ok-profile-level-card {
      border-radius: 16px; padding: 16px; margin: 12px 16px;
      border: 2px solid; position: relative; overflow: hidden;
    }
    #ok-profile-level-card::before {
      content: '';
      position: absolute; top: -30px; right: -30px;
      width: 120px; height: 120px; border-radius: 50%;
      background: currentColor; opacity: 0.06;
    }
    .ok-level-progress {
      height: 8px; background: #e5e7eb; border-radius: 99px;
      overflow: hidden; margin: 10px 0 6px;
    }
    .ok-level-progress-bar {
      height: 100%; border-radius: 99px;
      transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
      animation: levelGrow 0.8s ease both;
    }
    @keyframes levelGrow { from { width: 0 !important; } }

    /* ── SPONSORED SECTION ── */
    #ok-sponsored-section { margin-top: 16px; background: white; padding: 20px 16px; }
    .ok-sponsor-card {
      flex-shrink: 0; width: 220px; border-radius: 16px; overflow: hidden;
      border: 1px solid #e5e7eb; cursor: pointer; display: block;
      text-decoration: none; transition: all 0.25s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .ok-sponsor-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .ok-sponsor-card img { width: 100%; height: 110px; object-fit: cover; display: block; }

    /* ── UNBEATABLE PRICES ── */
    #ok-unbeatable-section { margin-top: 16px; padding: 24px 16px 28px; position: relative; overflow: hidden; }
    .ok-unbeat-pill {
      flex-shrink: 0; border-radius: 12px; padding: 10px 18px;
      text-align: center; min-width: 90px;
    }
    .ok-unbeat-card {
      flex-shrink: 0; width: 145px; cursor: pointer;
    }
    .ok-unbeat-card-img-wrap {
      border-radius: 14px; overflow: hidden;
      border: 1px solid rgba(201,168,76,0.2);
      background: #1a1200; position: relative;
    }
    .ok-unbeat-card img { width: 100%; height: 175px; object-fit: cover; display: block; }

    /* ── TRENDING SECTION HEADER ── */
    .ok-section-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 16px 12px; background: white;
    }
    .ok-section-header h3 {
      font-size: 1.15rem; font-weight: 900; color: #111827; margin: 0;
      letter-spacing: -0.02em;
    }
    .ok-section-viewall {
      font-size: 12px; font-weight: 700; color: #111827;
      text-decoration: none; display: flex; align-items: center; gap: 4px;
      background: none; border: none; cursor: pointer;
    }

    /* ── REFERRALS CHANNELS ── */
    #ok-ref-channel-box {
      margin: 16px;
      background: linear-gradient(135deg,#0d0821,#1a0e00);
      border-radius: 18px; padding: 16px;
    }
    #ok-ref-channel-box * { box-sizing: border-box; }

    /* ── ADMIN SPONSOR PANEL ── */
    #admin-tab-sponsors { background: white; }
    .ok-sponsor-admin-row {
      background: white; border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 14px; margin-bottom: 10px; display: flex; gap: 12px; align-items: center;
    }
    .ok-sponsor-admin-row img { width: 60px; height: 44px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }

    /* ── CATEGORY BUBBLES FIX - keep original but style ── */
    #category-bubbles .rounded-full { border-radius: 14px !important; }

    /* scrollbar hide */
    .ok-hscroll { display: flex; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 12px; padding-bottom: 8px; }
    .ok-hscroll::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
})();

/* ── 2. FIX CATEGORIES ──────────────────────────────────────── */
function _fixCategories() {
  if (!window.CATEGORIES) return;
  const men = window.CATEGORIES.find(c => c.name === 'Men');
  if (men) {
    // Remove Oversized Shirts
    men.subs = men.subs.filter(s => s !== 'Oversized Shirts');
    if (men.groups) men.groups.forEach(g => { g.items = g.items.filter(s => s !== 'Oversized Shirts'); });
  }
  const women = window.CATEGORIES.find(c => c.name === 'Women');
  if (women && !women.subs.includes('Trousers')) {
    women.subs.push('Trousers');
    if (women.groups) {
      const bg = women.groups.find(g => g.label?.toLowerCase().includes('bottom'));
      if (bg && !bg.items.includes('Trousers')) bg.items.push('Trousers');
    }
  }
}

/* ── 3. HOME PAGE REDESIGN ──────────────────────────────────── */
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
    <div class="ok-trust-item">
      <i class="fas fa-truck"></i>
      <div><strong>Free Shipping</strong><span>On orders over ₹500</span></div>
    </div>
    <div class="ok-trust-item">
      <i class="fas fa-undo-alt"></i>
      <div><strong>Easy Returns</strong><span>Hassle free 7 day returns</span></div>
    </div>
    <div class="ok-trust-item">
      <i class="fas fa-tag"></i>
      <div><strong>Daily Deals</strong><span>Save up to 60% off</span></div>
    </div>
    <div class="ok-trust-item">
      <i class="fas fa-headset"></i>
      <div><strong>24/7 Support</strong><span>We're here to help</span></div>
    </div>
  `;
  // Insert after banner carousel
  const carousel = document.getElementById('banner-carousel');
  if (carousel && carousel.nextSibling) carousel.insertAdjacentElement('afterend', strip);
  else if (carousel) carousel.after(strip);
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

  // Insert after trust strip or carousel
  const trustStrip = document.getElementById('ok-trust-strip');
  const carousel = document.getElementById('banner-carousel');
  const insertAfter = trustStrip || carousel;
  if (insertAfter) insertAfter.insertAdjacentElement('afterend', section);
}

/* ── 4. UNBEATABLE PRICES SECTION ───────────────────────────── */
function _renderUnbeatableSection() {
  if (document.getElementById('ok-unbeatable-section')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;

  const allProds = window.products || [];
  const cheap = [...allProds].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 10);
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
        <div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Returns</div>
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

  // Insert before trending section
  const trending = homeView.querySelector('.mt-4.bg-white.p-4');
  if (trending) trending.insertAdjacentElement('beforebegin', section);
  else homeView.appendChild(section);
}

/* ── 5. SPONSORED / AFFILIATE SECTION ──────────────────────── */
const SPONSOR_STORAGE_KEY = 'outfitkart_sponsors_v1';

function _getSponsors() {
  try {
    const raw = localStorage.getItem(SPONSOR_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default demo sponsors
  return [
    {
      id: 1,
      img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&q=80',
      title: 'HDFC Bank Credit Card',
      subtitle: 'Get ₹500 cashback on first swipe',
      tag: 'Sponsored', tagColor: '#3b82f6',
      link: 'https://www.hdfcbank.com',
      badge: '₹500 Cashback',
    },
    {
      id: 2,
      img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&q=80',
      title: 'Paytm Wallet',
      subtitle: 'Earn 2% cashback on every payment',
      tag: 'Partner', tagColor: '#0ea5e9',
      link: 'https://paytm.com',
      badge: '2% Cashback',
    },
    {
      id: 3,
      img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop&q=80',
      title: 'PhonePe Offers',
      subtitle: 'Shop & save more with PhonePe',
      tag: 'Offer', tagColor: '#8b5cf6',
      link: 'https://www.phonepe.com',
      badge: 'Special Offer',
    },
  ];
}

function _saveSponsors(sponsors) {
  try { localStorage.setItem(SPONSOR_STORAGE_KEY, JSON.stringify(sponsors)); } catch {}
}

function _renderSponsoredSection() {
  document.getElementById('ok-sponsored-section')?.remove();
  const homeView = document.getElementById('view-home');
  if (!homeView) return;

  const sponsors = _getSponsors();
  if (!sponsors.length) return;

  const section = document.createElement('div');
  section.id = 'ok-sponsored-section';
  section.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div>
        <h3 style="font-size:1.1rem;font-weight:900;color:#111827;margin:0;letter-spacing:-0.02em;">💳 Offers & Partners</h3>
        <p style="font-size:11px;color:#9ca3af;margin:3px 0 0;">Exclusive deals from our partners</p>
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
  homeView.appendChild(section);
}

/* Admin: Sponsors Management Panel */
function _injectSponsorAdminTab() {
  // Add tab button to sidebar
  if (!document.getElementById('btn-admin-sponsors')) {
    const refBtn = document.getElementById('btn-admin-influencer');
    if (refBtn) {
      const btn = document.createElement('button');
      btn.id = 'btn-admin-sponsors';
      btn.onclick = () => window.switchAdminTab('sponsors');
      btn.className = 'admin-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all';
      btn.innerHTML = `<span class="nav-icon"><i class="fas fa-ad"></i></span><span class="flex-1 text-left">Sponsors / Ads</span>`;
      refBtn.insertAdjacentElement('afterend', btn);
    }
  }

  // Tab content
  if (!document.getElementById('admin-tab-sponsors')) {
    const adminContent = document.querySelector('.flex-1.p-4.md\\:p-6, .flex-1.p-4');
    if (!adminContent) return;
    const tab = document.createElement('div');
    tab.id = 'admin-tab-sponsors';
    tab.className = 'admin-content-tab hidden space-y-3';
    tab.innerHTML = `
      <div class="bg-white p-4 md:p-6 rounded-xl shadow-md border">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg text-blue-700 flex items-center gap-2"><i class="fas fa-ad"></i> Sponsored Banners</h3>
          <button onclick="_renderAdminSponsors()" class="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-bold border border-blue-200">Refresh</button>
        </div>
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-xs text-blue-800">
          <i class="fas fa-info-circle mr-1"></i>
          <strong>Aap yahan sponsored banners manage kar sakte ho.</strong><br>
          ImgBB pe image upload karo, link daalo, aur home page pe display hoga.
        </div>
        <!-- Add Form -->
        <div class="bg-gray-50 border rounded-xl p-4 mb-4">
          <h4 class="font-bold text-sm mb-3 flex items-center gap-2"><i class="fas fa-plus-circle text-blue-500"></i> New Sponsor Banner</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Brand Name *</label>
              <input type="text" id="sp-title" placeholder="HDFC Bank" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Subtitle *</label>
              <input type="text" id="sp-subtitle" placeholder="₹500 cashback on first order" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Redirect Link *</label>
              <input type="url" id="sp-link" placeholder="https://affiliate-link.com/..." class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Badge Text</label>
              <input type="text" id="sp-badge" placeholder="₹500 Cashback" class="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300">
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Tag (Sponsored/Partner/Offer)</label>
              <select id="sp-tag" class="w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-300">
                <option value="Sponsored">Sponsored</option>
                <option value="Partner">Partner</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Tag Color</label>
              <select id="sp-tagcolor" class="w-full border rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-300">
                <option value="#3b82f6">Blue</option>
                <option value="#0ea5e9">Sky Blue</option>
                <option value="#8b5cf6">Purple</option>
                <option value="#16a34a">Green</option>
                <option value="#e11d48">Red</option>
                <option value="#f97316">Orange</option>
                <option value="#C9A84C">Gold</option>
              </select>
            </div>
          </div>
          <div class="mt-3">
            <label class="text-[10px] font-black text-gray-500 uppercase mb-1 block">Banner Image (ImgBB URL) *</label>
            <div class="flex gap-2">
              <input type="url" id="sp-img" placeholder="https://i.ibb.co/..." class="flex-1 border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300">
              <label class="cursor-pointer bg-purple-600 text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-purple-700 flex items-center gap-1">
                <i class="fas fa-upload"></i> Upload
                <input type="file" accept="image/*" class="hidden" onchange="_uploadSponsorImg(event)">
              </label>
            </div>
            <div id="sp-img-preview" class="hidden mt-2"><img id="sp-img-preview-img" src="" class="h-20 rounded-lg object-cover border"></div>
          </div>
          <button onclick="_adminAddSponsor()" class="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all">
            <i class="fas fa-plus mr-2"></i>Add Sponsor Banner
          </button>
        </div>
        <div id="admin-sponsors-list" class="space-y-2">
          <div class="text-center text-gray-400 py-8"><i class="fas fa-ad text-4xl mb-3"></i><p>Click Refresh to load sponsors</p></div>
        </div>
      </div>
    `;
    adminContent.appendChild(tab);
  }
}

window._uploadSponsorImg = async function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const IMGBB_KEY = window.IMGBB_KEY || '3949e4873d8510691ee63026d22eeb75';
  const fd = new FormData(); fd.append('image', file);
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
    const json = await res.json();
    if (json.success) {
      const input = document.getElementById('sp-img');
      const preview = document.getElementById('sp-img-preview');
      const previewImg = document.getElementById('sp-img-preview-img');
      if (input) input.value = json.data.url;
      if (preview) preview.classList.remove('hidden');
      if (previewImg) previewImg.src = json.data.url;
      window.showToast?.('✅ Image uploaded!');
    }
  } catch (e) { window.showToast?.('❌ Upload failed'); }
};

window._adminAddSponsor = function() {
  const title = document.getElementById('sp-title')?.value.trim();
  const subtitle = document.getElementById('sp-subtitle')?.value.trim();
  const link = document.getElementById('sp-link')?.value.trim();
  const badge = document.getElementById('sp-badge')?.value.trim() || 'Offer';
  const tag = document.getElementById('sp-tag')?.value || 'Sponsored';
  const tagColor = document.getElementById('sp-tagcolor')?.value || '#3b82f6';
  const img = document.getElementById('sp-img')?.value.trim();
  if (!title || !link || !img) return window.showToast?.('Title, Link aur Image required hai');
  const sponsors = _getSponsors();
  sponsors.push({ id: Date.now(), img, title, subtitle, tag, tagColor, link, badge });
  _saveSponsors(sponsors);
  window.showToast?.('✅ Sponsor banner added!');
  ['sp-title','sp-subtitle','sp-link','sp-badge','sp-img'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('sp-img-preview')?.classList.add('hidden');
  _renderAdminSponsors();
  _renderSponsoredSection();
};

window._adminDeleteSponsor = function(id) {
  if (!confirm('Delete this sponsor banner?')) return;
  const sponsors = _getSponsors().filter(s => s.id !== id);
  _saveSponsors(sponsors);
  window.showToast?.('🗑️ Deleted');
  _renderAdminSponsors();
  _renderSponsoredSection();
};

window._renderAdminSponsors = function() {
  const container = document.getElementById('admin-sponsors-list');
  if (!container) return;
  const sponsors = _getSponsors();
  if (!sponsors.length) {
    container.innerHTML = '<div class="text-center text-gray-400 py-8"><i class="fas fa-ad text-4xl mb-3"></i><p>Koi sponsor nahi hai — upar se add karo</p></div>';
    return;
  }
  container.innerHTML = sponsors.map(s => `
    <div class="ok-sponsor-admin-row">
      <img src="${s.img}" onerror="this.src='https://placehold.co/60x44/f3f4f6/9ca3af?text=IMG'" loading="lazy">
      <div style="flex:1;min-width:0;">
        <div class="font-bold text-sm text-gray-800 truncate">${s.title}</div>
        <div class="text-xs text-gray-500">${s.subtitle}</div>
        <a href="${s.link}" target="_blank" class="text-xs text-blue-600 hover:underline truncate block">${s.link}</a>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">
        <span style="background:${s.tagColor};color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:99px;">${s.tag}</span>
        <button onclick="_adminDeleteSponsor(${s.id})" class="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg font-bold hover:bg-red-100">Delete</button>
      </div>
    </div>
  `).join('');
};

/* ── 6. REFERRALS PAGE FIXES ────────────────────────────────── */
function _fixReferralsPage() {
  const refPage = document.getElementById('profile-page-referrals');
  if (!refPage || refPage.dataset.megaPatched) return;
  refPage.dataset.megaPatched = '1';

  const body = refPage.querySelector('.profile-page-body');
  if (!body) return;

  // Remove old channel box if exists
  document.getElementById('ok-ref-channels')?.remove();
  document.getElementById('ok-ref-channel-box')?.remove();

  // Add channel box at top
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

/* ── 7. LEVEL BADGE IN PROFILE ──────────────────────────────── */
const LEVEL_DATA = [
  { name: 'Bronze',   minOrders: 0,  color: '#CD7F32', emoji: '🥉', perks: 'COD + Free delivery' },
  { name: 'Silver',   minOrders: 3,  color: '#A8A8A8', emoji: '🥈', perks: '3% extra cashback' },
  { name: 'Gold',     minOrders: 8,  color: '#C9A84C', emoji: '🥇', perks: '5% cashback + priority support' },
  { name: 'Platinum', minOrders: 20, color: '#7B2FBE', emoji: '💎', perks: '8% cashback + exclusive deals' },
];

function _getLvl(count) {
  let l = LEVEL_DATA[0];
  LEVEL_DATA.forEach(x => { if (count >= x.minOrders) l = x; });
  return l;
}

function _renderLevelBadge() {
  if (!window.currentUser) return;
  const orders = window.ordersDb || [];
  const count = orders.filter(o => o.status !== 'Cancelled').length;
  const lvl = _getLvl(count);
  const next = LEVEL_DATA.find(l => l.minOrders > count);
  const pct = next ? Math.min(100, Math.round(((count - lvl.minOrders) / (next.minOrders - lvl.minOrders)) * 100)) : 100;

  // 1. In dashboard header card (dark bg area)
  let topPill = document.getElementById('ok-dash-level-pill');
  if (!topPill) {
    const sidebarLevel = document.getElementById('ok-sidebar-level');
    if (sidebarLevel) {
      topPill = document.createElement('div');
      topPill.id = 'ok-dash-level-pill';
      sidebarLevel.replaceWith(topPill);
    } else {
      // Inject in the dark header area of dashboard
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
    topPill.innerHTML = `<span style="font-size:18px;">${lvl.emoji}</span><div><div style="font-size:11px;font-weight:900;color:${lvl.color};">${lvl.name} Member</div><div style="font-size:10px;color:rgba(255,255,255,0.55);">${count} orders</div></div>`;
  }

  // 2. Full card in profile info page
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
            <span style="font-size:2.2rem;">${lvl.emoji}</span>
            <div style="flex:1;">
              <div style="font-size:15px;font-weight:900;color:${lvl.color};">${lvl.name} Member</div>
              <div style="font-size:11px;color:#6b7280;margin-top:2px;">${lvl.perks}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:22px;font-weight:900;color:${lvl.color};">${count}</div>
              <div style="font-size:10px;color:#9ca3af;">orders</div>
            </div>
          </div>
          <div class="ok-level-progress">
            <div class="ok-level-progress-bar" style="width:${pct}%;background:linear-gradient(90deg,${lvl.color},${lvl.color}cc);"></div>
          </div>
          <div style="font-size:10px;color:#9ca3af;font-weight:600;text-align:right;margin-top:4px;">
            ${next ? `${next.minOrders - count} aur orders for ${next.emoji} ${next.name}` : '🎉 Maximum Level!'}
          </div>
        </div>
      `;
      wrap.insertBefore(card, wrap.firstChild);
    }
  }

  // 3. Stat counters
  const statOrders = document.getElementById('stat-orders-count');
  if (statOrders) statOrders.textContent = count;
}

/* ── 8. PATCH switchAdminTab TO INCLUDE SPONSORS ────────────── */
function _patchAdminTab() {
  const origSwitch = window.switchAdminTab;
  if (!origSwitch || window._sponsorTabPatched) return;
  window._sponsorTabPatched = true;
  window.switchAdminTab = function(tab) {
    origSwitch(tab);
    if (tab === 'sponsors') {
      _renderAdminSponsors();
      // Make sure our tab is shown
      document.querySelectorAll('.admin-content-tab').forEach(el => { el.style.display = 'none'; el.classList.add('hidden'); });
      const t = document.getElementById('admin-tab-sponsors');
      if (t) { t.style.display = 'block'; t.classList.remove('hidden'); }
      document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('btn-admin-sponsors')?.classList.add('active');
    }
  };
}

/* ── 9. PATCH openProfilePage FOR LEVEL + REFERRALS ─────────── */
function _patchOpenProfilePage() {
  const orig = window.openProfilePage;
  if (!orig || window._profilePagePatched) return;
  window._profilePagePatched = true;
  window.openProfilePage = function(page) {
    orig(page);
    if (page === 'referrals') setTimeout(_fixReferralsPage, 150);
    if (page === 'info') setTimeout(_renderLevelBadge, 300);
    if (page === 'orders') setTimeout(_renderLevelBadge, 300);
  };
}

/* ── 10. PATCH navigate FOR HOME RE-RENDER ──────────────────── */
function _patchNavigate() {
  const origNav = window.navigate;
  if (!origNav || window._megaNavPatched) return;
  window._megaNavPatched = true;
  window.navigate = function(view, cat) {
    origNav(view, cat);
    if (view === 'home') {
      setTimeout(() => {
        _renderHomePromoBanner();
        _renderTrustStrip();
        _renderShopByCategorySection();
        _renderUnbeatableSection();
        _renderSponsoredSection();
      }, 300);
    }
    if (view === 'profile' || view === 'admin') {
      setTimeout(_injectSponsorAdminTab, 600);
      setTimeout(_renderLevelBadge, 500);
    }
  };
}

/* ── 11. MutationObserver FOR DYNAMIC PAGE VISIBILITY ───────── */
function _initObserver() {
  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type !== 'attributes' || m.attributeName !== 'class') return;
      const el = m.target;
      if (el.id === 'profile-page-referrals' && !el.classList.contains('hidden')) {
        setTimeout(_fixReferralsPage, 100);
      }
      if (el.id === 'user-dashboard' && !el.classList.contains('hidden')) {
        setTimeout(_renderLevelBadge, 300);
      }
      if (el.id === 'profile-page-info' && !el.classList.contains('hidden')) {
        setTimeout(_renderLevelBadge, 200);
      }
      if (el.id === 'view-home' && !el.classList.contains('hidden')) {
        setTimeout(() => {
          _renderHomePromoBanner();
          _renderTrustStrip();
          _renderShopByCategorySection();
          _renderUnbeatableSection();
          _renderSponsoredSection();
        }, 200);
      }
      if (el.id === 'view-admin' && !el.classList.contains('hidden')) {
        setTimeout(() => { _injectSponsorAdminTab(); _patchAdminTab(); }, 500);
      }
    });
  });
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
}

/* ── 12. ALSO PATCH _updateUserLevel ────────────────────────── */
function _patchUpdateUserLevel() {
  const orig = window._updateUserLevel;
  if (!orig || window._levelPatched) return;
  window._levelPatched = true;
  window._updateUserLevel = async function() {
    if (orig) await orig();
    setTimeout(_renderLevelBadge, 200);
  };
}

/* ── 13. FETCH USER DATA PATCH FOR STATS ────────────────────── */
function _patchFetchUserData() {
  const orig = window.fetchUserData;
  if (!orig || window._fetchUserDataPatched) return;
  window._fetchUserDataPatched = true;
  window.fetchUserData = async function() {
    await orig();
    setTimeout(_renderLevelBadge, 300);
  };
}

/* ── INIT ───────────────────────────────────────────────────── */
function _init() {
  _fixCategories();
  _patchNavigate();
  _patchOpenProfilePage();
  _patchUpdateUserLevel();
  _patchFetchUserData();
  _initObserver();

  // Home page initial render
  setTimeout(() => {
    _renderHomePromoBanner();
    _renderTrustStrip();
    _renderShopByCategorySection();
    // Wait for products
    const waitProds = setInterval(() => {
      if ((window.products || []).length > 0) {
        clearInterval(waitProds);
        _renderUnbeatableSection();
        _renderSponsoredSection();
      }
    }, 600);
    setTimeout(() => { clearInterval(waitProds); _renderUnbeatableSection(); _renderSponsoredSection(); }, 5000);
  }, 800);

  // Admin tab - wait for admin panel to exist
  setTimeout(() => {
    _injectSponsorAdminTab();
    _patchAdminTab();
  }, 1500);

  // Level badge
  setTimeout(_renderLevelBadge, 1000);

  // Referrals page if visible
  const refPage = document.getElementById('profile-page-referrals');
  if (refPage && !refPage.classList.contains('hidden')) setTimeout(_fixReferralsPage, 200);

  console.log('%cOutfitKart MegaPatch v3 ✅ — Home Redesign | Level Badge | Referrals Fix | Sponsors Admin', 'color:#C9A84C;font-weight:900;font-size:12px;');
}

/* Exports */
Object.assign(window, {
  _getSponsors, _saveSponsors, _renderSponsoredSection,
  _renderLevelBadge, _fixReferralsPage,
  _renderUnbeatableSection, _renderShopByCategorySection,
  _renderTrustStrip, _renderHomePromoBanner,
  _renderAdminSponsors, _adminAddSponsor, _adminDeleteSponsor,
  _injectSponsorAdminTab,
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(_init, 500));
else setTimeout(_init, 500);
