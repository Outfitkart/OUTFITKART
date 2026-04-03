/* ================================================================
   OutfitKart — PDP SUPER PATCH v2
   ================================================================
   FIXES:
   ✅ 1. PDP price display — screenshot jaise (bada price + MRP strikethrough + % off)
   ✅ 2. UPI = admin selling_price | COD = selling_price × 1.08 (8% extra)
   ✅ 3. "Deal ends in" timer + rating badge (Meesho style)
   ✅ 4. Trust box — 7 Days Return | COD | Lowest Price
   ✅ 5. Checkout mein bhi COD = 8% extra (cod-fee-row, final totals, place-order-amount)
   ================================================================ */

'use strict';

(function () {

/* ── HELPER — 8% COD price ── */
function calcCOD(base) { return Math.ceil(base * 1.08); }

/* ──────────────────────────────────────────────────────────────
   1. CSS INJECTION
────────────────────────────────────────────────────────────── */
function injectCSS() {
  if (document.getElementById('ok-pdp-sp-css')) return;
  const s = document.createElement('style');
  s.id = 'ok-pdp-sp-css';
  s.textContent = `
    /* PDP slider — container fill */
    .pdp-img-slider {
      width:100%!important; border-radius:12px!important;
      border:1px solid #e5e7eb!important; overflow:hidden!important;
      background:#f9fafb!important;
    }
    .pdp-img-slider img {
      width:100%!important; aspect-ratio:3/4!important;
      height:auto!important; min-height:0!important; max-height:none!important;
      object-fit:cover!important; object-position:top center!important;
      display:block!important; min-width:100%!important;
    }
    #pdp-container .rounded-lg.overflow-hidden img {
      width:100%!important; aspect-ratio:3/4!important;
      object-fit:cover!important; object-position:top center!important;
      border-radius:12px!important; display:block!important;
    }
    .pdp-thumb {
      width:56px!important; height:68px!important;
      object-fit:cover!important; object-position:top center!important;
    }

    /* Price block */
    #ok-pdp-price-block { padding:0 0 4px; }
    #ok-pdp-main-price  { font-size:2rem; font-weight:900; color:#111827; line-height:1; }
    #ok-pdp-mrp-row     { display:flex; align-items:center; gap:8px; margin-top:3px; flex-wrap:wrap; }
    #ok-pdp-mrp         { font-size:14px; color:#9ca3af; text-decoration:line-through; font-weight:500; }
    #ok-pdp-off-badge   { font-size:13px; font-weight:800; color:#e11d48; }
    #ok-pdp-deal-row    { margin-top:6px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    #ok-pdp-deal-timer  {
      display:inline-flex; align-items:center; gap:5px;
      background:#fff3cd; border:1px solid #ffc107; border-radius:8px;
      padding:4px 10px; font-size:12px; font-weight:800; color:#b45309;
    }
    #ok-pdp-rating-row  { display:flex; align-items:center; gap:6px; margin-top:8px; }
    #ok-pdp-rating-badge {
      background:#16a34a; color:white; font-size:11px; font-weight:900;
      padding:3px 8px; border-radius:99px; display:inline-flex; align-items:center; gap:3px;
    }
    #ok-pdp-rating-count { font-size:12px; color:#6b7280; }

    /* UPI badge */
    #ok-upi-offer-badge {
      background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px;
      padding:7px 12px; font-size:12px; font-weight:700; color:#1d4ed8;
      display:flex; align-items:center; gap:7px; margin:8px 0 4px;
    }
    /* COD line */
    #ok-pdp-cod-line { font-size:13px; color:#374151; font-weight:600; margin:2px 0 6px; }
    #ok-pdp-cod-line span { font-weight:800; }

    /* Trust box */
    #ok-pdp-trust-box {
      background:#fff0f5; border:1px solid #fecdd3; border-radius:14px;
      padding:14px 10px; display:flex; align-items:center;
      justify-content:space-around; gap:6px; margin:12px 0;
    }
    .ok-pdp-trust-item { display:flex; flex-direction:column; align-items:center; gap:5px; flex:1; text-align:center; }
    .ok-pdp-trust-item+.ok-pdp-trust-item { border-left:1px solid #fecdd3; }
    .ok-pdp-trust-icon { font-size:20px; }
    .ok-pdp-trust-label { font-size:10px; font-weight:800; color:#1f2937; line-height:1.3; }

    /* Pay toggle */
    #ok-pay-toggle { background:white; border:1px solid #e5e7eb; border-radius:14px; padding:14px; margin:10px 0; }
    .opt-lbl { font-size:10px; font-weight:800; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; }
    .ok-pay-opts { display:flex; flex-direction:column; gap:7px; }
    .ok-pay-btn {
      border:2px solid #e5e7eb; border-radius:10px; padding:10px 12px;
      cursor:pointer; display:flex; justify-content:space-between; align-items:center;
      font-size:13px; font-weight:700; color:#374151; transition:all .15s; user-select:none;
    }
    .ok-pay-btn.sel { border-color:#e11d48; background:#fff1f2; color:#e11d48; }
    .ok-pay-sub { font-size:11px; font-weight:600; color:#9ca3af; }
    .ok-pay-btn.sel .ok-pay-sub { color:#be123c; }
    .ok-cod-warning { font-size:10px; color:#d97706; font-weight:700; margin-top:6px; display:none; align-items:center; gap:4px; }
    .ok-cod-warning.show { display:flex!important; }
  `;
  document.head.appendChild(s);
}


/* ──────────────────────────────────────────────────────────────
   2. BUILD PRICE BLOCK — screenshot jaise
────────────────────────────────────────────────────────────── */
function buildPriceBlock(product) {
  const upiP   = product.price || product.selling_price || 0;
  const mrp    = product.oldprice || product.mrp || product.old_price || Math.round(upiP * 1.6);
  const codP   = calcCOD(upiP);
  const diff   = codP - upiP;
  const off    = mrp > upiP ? Math.round((1 - upiP / mrp) * 100) : 0;
  const rating = product.rating ? parseFloat(product.rating).toFixed(1)
               : (3.5 + Math.random() * 1.4).toFixed(1);
  const reviews = product.reviews || product.review_count
               || Math.floor(Math.random() * 3000 + 500);

  // Store globals
  window._pdpBasePrice = upiP;
  window._pdpCODPrice  = codP;
  window._pdpCODDiff   = diff;
  window._pdpMRP       = mrp;
  window._pdpPayMode   = window._pdpPayMode || 'upi';

  // Remove old injected blocks
  ['ok-pdp-price-block','ok-upi-offer-badge','ok-pdp-cod-line',
   'ok-pdp-trust-box','ok-pay-toggle'].forEach(id => document.getElementById(id)?.remove());

  /* -- Price block -- */
  const block = document.createElement('div');
  block.id = 'ok-pdp-price-block';
  block.innerHTML =
    '<div id="ok-pdp-main-price">₹' + upiP.toLocaleString('en-IN') + '</div>' +
    '<div id="ok-pdp-mrp-row">' +
      (mrp > upiP ? '<span id="ok-pdp-mrp">₹' + mrp.toLocaleString('en-IN') + '</span>' : '') +
      (off  > 0   ? '<span id="ok-pdp-off-badge">' + off + '% off</span>' : '') +
    '</div>' +
    '<div id="ok-pdp-deal-row">' +
      '<div id="ok-pdp-deal-timer">🔥 <span id="ok-pdp-timer-val">Loading...</span></div>' +
    '</div>' +
    '<div id="ok-pdp-rating-row">' +
      '<span id="ok-pdp-rating-badge">' + rating + ' ★</span>' +
      '<span id="ok-pdp-rating-count">(' + Number(reviews).toLocaleString('en-IN') + ')</span>' +
    '</div>';

  /* -- UPI badge -- */
  const upiBadge = document.createElement('div');
  upiBadge.id = 'ok-upi-offer-badge';
  upiBadge.innerHTML = '<span style="font-size:16px">📱</span> UPI Offer applied for you!!';

  /* -- COD line -- */
  const codLine = document.createElement('div');
  codLine.id = 'ok-pdp-cod-line';
  codLine.innerHTML = '<span>₹' + codP.toLocaleString('en-IN') + '</span> with COD';

  /* -- Trust box -- */
  const trustBox = document.createElement('div');
  trustBox.id = 'ok-pdp-trust-box';
  trustBox.innerHTML =
    '<div class="ok-pdp-trust-item"><span class="ok-pdp-trust-icon">↩️</span>' +
    '<span class="ok-pdp-trust-label">7 Days<br>Easy Return</span></div>' +
    '<div class="ok-pdp-trust-item"><span class="ok-pdp-trust-icon">💵</span>' +
    '<span class="ok-pdp-trust-label">Cash on<br>Delivery</span></div>' +
    '<div class="ok-pdp-trust-item"><span class="ok-pdp-trust-icon">🏷️</span>' +
    '<span class="ok-pdp-trust-label">Lowest<br>Price</span></div>';

  /* -- Pay toggle -- */
  const toggle = document.createElement('div');
  toggle.id = 'ok-pay-toggle';
  toggle.innerHTML =
    '<div class="opt-lbl">💳 Payment Mode</div>' +
    '<div class="ok-pay-opts">' +
      '<div class="ok-pay-btn sel" id="ok-pay-upi" onclick="window._okPay(\'upi\')">' +
        '<span>📱 UPI / Online</span>' +
        '<span class="ok-pay-sub">₹' + upiP.toLocaleString('en-IN') + ' — Best Price</span>' +
      '</div>' +
      '<div class="ok-pay-btn" id="ok-pay-cod" onclick="window._okPay(\'cod\')">' +
        '<span>💵 Cash on Delivery</span>' +
        '<span class="ok-pay-sub">₹' + codP.toLocaleString('en-IN') + ' (+₹' + diff + ')</span>' +
      '</div>' +
    '</div>' +
    '<div class="ok-cod-warning" id="ok-cod-warn">⚠️ COD pe ₹' + diff + ' extra handling charge (8%)</div>';

  /* -- _okPay function -- */
  window._okPay = function(mode) {
    window._pdpPayMode = mode;
    document.getElementById('ok-pay-upi')?.classList.toggle('sel', mode === 'upi');
    document.getElementById('ok-pay-cod')?.classList.toggle('sel', mode === 'cod');
    document.getElementById('ok-cod-warn')?.classList.toggle('show', mode === 'cod');
    const mainP = document.getElementById('ok-pdp-main-price');
    if (mainP) {
      mainP.textContent = '₹' + (mode === 'cod' ? codP : upiP).toLocaleString('en-IN');
      mainP.style.color = mode === 'cod' ? '#d97706' : '#111827';
    }
    const upiB = document.getElementById('ok-upi-offer-badge');
    if (upiB) upiB.style.display = mode === 'upi' ? 'flex' : 'none';
    const codL = document.getElementById('ok-pdp-cod-line');
    if (codL) codL.style.opacity = mode === 'cod' ? '0.4' : '1';
  };

  /* -- Insert into DOM -- */
  const pdpC = document.getElementById('pdp-container');
  if (!pdpC) return;

  // Hide script-core's original price elements
  pdpC.querySelectorAll('.text-3xl, .text-2xl.font-black, .text-2xl.font-bold').forEach(el => {
    if ((el.textContent || '').includes('₹') && !el.id.startsWith('ok-')) el.style.display = 'none';
  });
  pdpC.querySelectorAll('[style*="line-through"], .line-through').forEach(el => {
    if (!el.id.startsWith('ok-')) el.style.display = 'none';
  });

  // Insert after h1
  const h1 = pdpC.querySelector('h1, h2, [class*="product-title"], [class*="name"]');
  if (h1) {
    h1.insertAdjacentElement('afterend', block);
    block.insertAdjacentElement('afterend', upiBadge);
    upiBadge.insertAdjacentElement('afterend', codLine);
    codLine.insertAdjacentElement('afterend', toggle);
    toggle.insertAdjacentElement('afterend', trustBox);
  } else {
    const right = pdpC.querySelector('div:last-child, .space-y-4, .px-4') || pdpC;
    right.prepend(trustBox); right.prepend(toggle);
    right.prepend(codLine);  right.prepend(upiBadge); right.prepend(block);
  }

  _startTimer();
  console.log('[PDP-SP v2] ✅ UPI ₹' + upiP + ' | COD ₹' + codP + ' (+8%)');
}


/* ──────────────────────────────────────────────────────────────
   3. DEAL TIMER
────────────────────────────────────────────────────────────── */
let _tv = null;
function _startTimer() {
  if (_tv) clearInterval(_tv);
  const end = Date.now() + (Math.floor(Math.random() * 27 + 3) * 60000);
  function tick() {
    const rem = Math.max(0, end - Date.now());
    const h = Math.floor(rem / 3600000);
    const m = Math.floor((rem % 3600000) / 60000);
    const s = Math.floor((rem % 60000) / 1000);
    const p = n => String(n).padStart(2, '0');
    const el = document.getElementById('ok-pdp-timer-val');
    if (el) el.textContent = p(h) + 'h : ' + p(m) + 'm : ' + p(s) + 's';
    else clearInterval(_tv);
    if (!rem) clearInterval(_tv);
  }
  tick();
  _tv = setInterval(tick, 1000);
}


/* ──────────────────────────────────────────────────────────────
   4. CHECKOUT — 8% COD patch
────────────────────────────────────────────────────────────── */
function patchCheckout() {

  function _cartBase() {
    const cart = window.cart || window.cartItems || [];
    if (cart.length) return cart.reduce((s, i) => s + (i.price || 0) * (i.qty || i.quantity || 1), 0);
    return window._pdpBasePrice || 0;
  }

  function _updateAll(mode) {
    const base   = _cartBase();
    const codFee = calcCOD(base) - base;
    const isCOD  = mode === 'cod';
    const tot    = isCOD ? calcCOD(base) : base;

    const donChk = document.getElementById('donation-checkbox');
    const donSel = document.getElementById('donation-custom-amt');
    const donAmt = (donChk && donChk.checked && donSel) ? parseInt(donSel.value || 0) : 0;
    const final  = tot + donAmt;

    // COD fee row
    const codRow = document.getElementById('cod-fee-row');
    if (codRow) {
      codRow.classList.toggle('hidden', !isCOD);
      const sp = codRow.querySelector('.font-bold, span:last-child, span:nth-child(2)');
      if (sp && sp.textContent.includes('₹')) sp.textContent = '+₹' + codFee;
    }

    // Totals
    const s2 = document.getElementById('final-total-step2');
    const s3 = document.getElementById('final-total-step3');
    const po = document.getElementById('place-order-amount');
    if (s2) s2.textContent = '₹' + final.toLocaleString('en-IN');
    if (s3) s3.textContent = '₹' + final.toLocaleString('en-IN');
    if (po) po.textContent = final.toLocaleString('en-IN');

    window._checkoutFinalAmount = final;

    // MRP display
    const mrp  = window._pdpMRP || 0;
    const mEl  = document.getElementById('price-mrp');
    if (mEl)  mEl.textContent  = '₹' + base.toLocaleString('en-IN');
    const dEl  = document.getElementById('price-discount');
    if (dEl && mrp > base) dEl.textContent = '- ₹' + (mrp - base).toLocaleString('en-IN');
    const svEl = document.getElementById('total-save');
    if (svEl && mrp > base) svEl.textContent = '₹' + (mrp - base).toLocaleString('en-IN');

    // COD label badge text
    const codBadge = document.querySelector('#label-cod .whitespace-nowrap');
    if (codBadge) codBadge.textContent = '+₹' + codFee + ' fee';
  }

  // Override updatePaymentSelection
  const _oUPS = window.updatePaymentSelection;
  window.updatePaymentSelection = function(method) {
    window._checkoutPayMode = method;
    if (method === 'upi' || method === 'cod') window._pdpPayMode = method;
    try { if (typeof _oUPS === 'function') _oUPS(method); } catch(e) {}
    setTimeout(() => _updateAll(method), 60);
  };

  // Override updateCheckoutTotals
  const _oUCT = window.updateCheckoutTotals;
  window.updateCheckoutTotals = function() {
    try { if (typeof _oUCT === 'function') _oUCT(); } catch(e) {}
    setTimeout(() => _updateAll(window._checkoutPayMode || 'upi'), 60);
  };

  // Watch checkout steps appear
  new MutationObserver(() => {
    const mode = window._checkoutPayMode || 'upi';
    ['checkout-step-2','checkout-step-3'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden')) setTimeout(() => _updateAll(mode), 250);
    });
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  // Razorpay amount patch
  const _oIP = window.initiatePayment;
  if (_oIP && !window._okIPv2) {
    window._okIPv2 = true;
    window.initiatePayment = async function() {
      const mode  = window._checkoutPayMode || 'upi';
      const base  = _cartBase();
      const final = mode === 'cod' ? calcCOD(base) : base;
      window._checkoutFinalAmount = final;
      if (window.razorpayOptions) window.razorpayOptions.amount = final * 100;
      return _oIP.apply(this, arguments);
    };
  }

  setTimeout(() => _updateAll('upi'), 1800);
  console.log('[PDP-SP v2] ✅ Checkout patched');
}


/* ──────────────────────────────────────────────────────────────
   5. HOOK openProductPage
────────────────────────────────────────────────────────────── */
function hookOpenPP() {
  if (window._pdpSPv2Hooked) return;
  const _try = () => {
    if (typeof window.openProductPage !== 'function') return false;
    if (window._pdpSPv2Hooked) return true;
    window._pdpSPv2Hooked = true;
    const _o = window.openProductPage;
    window.openProductPage = async function(id, isGold) {
      const r = await _o(id, isGold);
      setTimeout(() => {
        const all  = [...(window.products||[]),...(window.allProducts||[]),...(window.goldProducts||[])];
        const seen = new Set();
        const uniq = all.filter(p => { if(seen.has(p.id)) return false; seen.add(p.id); return true; });
        const prod = uniq.find(p => String(p.id) === String(id));
        if (prod) buildPriceBlock(prod);
        else console.warn('[PDP-SP v2] Product not found:', id);
      }, 420);
      return r;
    };
    console.log('[PDP-SP v2] ✅ openProductPage hooked');
    return true;
  };
  if (!_try()) { const iv = setInterval(() => { if (_try()) clearInterval(iv); }, 150); }
}


/* ──────────────────────────────────────────────────────────────
   6. FALLBACK — dom-based price read
────────────────────────────────────────────────────────────── */
function watchPDP() {
  new MutationObserver(() => {
    const pdp = document.getElementById('view-product');
    if (!pdp || pdp.classList.contains('hidden')) return;
    if (document.getElementById('ok-pdp-price-block')) return;
    setTimeout(() => {
      if (document.getElementById('ok-pdp-price-block')) return;
      const domP = document.querySelector('#pdp-container .text-3xl, #pdp-container .text-2xl.font-black');
      if (!domP) return;
      const raw = parseInt((domP.textContent || '').replace(/[^\d]/g, ''));
      if (raw) buildPriceBlock({ price: raw, oldprice: Math.round(raw * 1.6) });
    }, 700);
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
}


/* ──────────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────────── */
function init() {
  injectCSS();
  hookOpenPP();
  patchCheckout();
  watchPDP();
  console.log('%c✅ PDP SUPER PATCH v2 LOADED','background:#e11d48;color:white;font-weight:900;font-size:11px;padding:4px 12px;border-radius:6px;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));
} else {
  setTimeout(init, 300);
}

})();
