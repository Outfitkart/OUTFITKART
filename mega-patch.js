'use strict';
/* ================================================================
   OUTFITKART MEGA-PATCH v5.1 — FINAL + FIXED
   Includes:
   ✅ script-core-patch (wallet refund, cancel reason, exchange reason, 7-day badge, admin supplier ID)
   ✅ Sponsored section between products in trending grid
   ✅ Level badge with custom names (Starter/Silver/Gold/Platinum), blue next-level line
   ✅ Share OutfitKart button fix
   ✅ Telegram + WhatsApp on profile open
   ✅ Unbeatable prices auto-suggest from real products
   ✅ "Get App" luxury animated popup → direct PWA install with progress bar
   ✅ Install button sirf tab dikhe jab PWA install nahi ho (FIX)
   ✅ Level badge robust rendering with fallback selectors (FIX)
   ✅ Footer © 2026 OutfitKart. All rights reserved.
   ✅ About Us, Terms of Service, Privacy Policy, Exchange Policy pages
   ✅ Gold products in trending grid
   ✅ All previous features preserved
   ================================================================ */

/* ═══════════════════════════════════════════════════════════════
   PART 1 — GLOBAL CSS
   ═══════════════════════════════════════════════════════════════ */
(function _injectV5CSS() {
  if (document.getElementById('ok-megapatch-v5-css')) return;
  const style = document.createElement('style');
  style.id = 'ok-megapatch-v5-css';
  style.textContent = `
    #view-home { background: #f8f8f8; }

    /* Trust strip */
    #ok-trust-strip { display:flex;align-items:center;justify-content:space-around;background:white;padding:14px 12px;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;flex-wrap:wrap;gap:8px; }
    .ok-trust-item { display:flex;align-items:center;gap:8px;font-size:11px;color:#374151;min-width:120px; }
    .ok-trust-item i { font-size:18px;color:#111827; }
    .ok-trust-item strong { display:block;font-size:12px;font-weight:800;color:#111827; }
    .ok-trust-item span { font-size:10px;color:#6b7280; }

    /* Category cards */
    #ok-shopco-cats { padding:28px 16px;background:white;margin-top:4px; }
    #ok-shopco-cats h2 { text-align:center;font-size:1.4rem;font-weight:900;color:#111827;margin-bottom:20px;letter-spacing:-0.02em; }
    .ok-cat-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:12px; }
    @media(min-width:640px){ .ok-cat-grid { grid-template-columns:repeat(4,1fr); } }
    .ok-cat-card { border-radius:14px;overflow:hidden;cursor:pointer;position:relative;aspect-ratio:3/4;background:#f3f4f6;transition:transform 0.25s ease,box-shadow 0.25s ease;border:1px solid #e5e7eb; }
    .ok-cat-card:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,0.12); }
    .ok-cat-card img { width:100%;height:100%;object-fit:cover;display:block; }
    .ok-cat-card-label { position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,0.95);padding:10px 14px;font-size:13px;font-weight:800;color:#111827;text-align:center; }
    .ok-viewall-btn { display:block;width:fit-content;margin:16px auto 0;background:#111827;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:background 0.2s; }
    .ok-viewall-btn:hover { background:#374151; }

    #ok-promo-banner-strip { background:#111827;color:white;text-align:center;padding:10px;font-size:12px;font-weight:600;letter-spacing:0.03em; }
    #ok-promo-banner-strip strong { color:#fbbf24; }

    /* Referrals page */
    #profile-page-referrals .profile-page-body { background:#f7f5f2;color:#111827; }
    #profile-page-referrals .text-xs,#profile-page-referrals .text-sm,#profile-page-referrals p,#profile-page-referrals span:not([style]) { color:#374151 !important; }
    #profile-page-referrals strong,#profile-page-referrals b { color:#111827 !important; }
    #profile-page-referrals .text-green-600 { color:#16a34a !important; }
    #profile-page-referrals .text-white { color:white !important; }
    #profile-page-referrals .bg-white { background:white !important; }

    /* Level badge */
    #ok-profile-level-card { border-radius:16px;padding:16px;margin:12px 16px;border:2px solid;position:relative;overflow:hidden; }
    .ok-level-progress { height:8px;background:#blue;border-radius:99px;overflow:hidden;margin:10px 0 6px; }
    .ok-level-progress-bar { height:100%;border-radius:99px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);animation:levelGrow 0.8s ease both; }
    @keyframes levelGrow { from { width:0 !important; } }

    /* Sponsor inline */
    .ok-sponsor-inline { grid-column:1/-1;background:white;border-radius:16px;padding:16px;border:1px solid #e5e7eb;margin:4px 0; }
    .ok-sponsor-card { flex-shrink:0;width:220px;border-radius:16px;overflow:hidden;cursor:pointer;display:block;text-decoration:none;transition:all 0.25s ease;box-shadow:0 2px 8px rgba(0,0,0,0.06);border:1px solid #e5e7eb; }
    .ok-sponsor-card:hover { transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.12); }
    .ok-sponsor-card img { width:100%;height:110px;object-fit:cover;display:block; }

    /* Unbeatable */
    #ok-unbeatable-section { margin-top:16px;padding:24px 16px 28px;position:relative;overflow:hidden; }
    .ok-unbeat-pill { flex-shrink:0;border-radius:12px;padding:10px 18px;text-align:center;min-width:90px; }
    .ok-unbeat-card { flex-shrink:0;width:145px;cursor:pointer; }
    .ok-unbeat-card-img-wrap { border-radius:14px;overflow:hidden;border:1px solid rgba(201,168,76,0.2);background:#1a1200;position:relative; }
    .ok-unbeat-card img { width:100%;height:175px;object-fit:cover;display:block; }

    /* Ref channels */
    #ok-ref-channel-box { margin:16px;background:linear-gradient(135deg,#0d0821,#1a0e00);border-radius:18px;padding:16px; }

    /* ── GET APP BUTTON ── */
    #ok-get-app-btn {
      display:flex;align-items:center;gap:5px;
      background:linear-gradient(135deg,#e11d48,#be123c);
      color:white;border:none;border-radius:99px;
      padding:7px 13px;font-size:10px;font-weight:800;
      cursor:pointer;white-space:nowrap;letter-spacing:0.04em;
      box-shadow:0 3px 12px rgba(225,29,72,0.45);
      position:relative;overflow:hidden;
    }
    #ok-get-app-btn::before {
      content:'';position:absolute;top:-50%;left:-60%;
      width:40%;height:200%;background:rgba(255,255,255,0.2);
      transform:skewX(-20deg);
      animation:appShimmer 2.5s infinite;
    }
    @keyframes appShimmer { 0%{left:-60%} 100%{left:160%} }

    /* ── PWA POPUP ── */
    #ok-pwa-overlay {
      position:fixed;inset:0;z-index:9999;
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.75);backdrop-filter:blur(10px);
    }
    #ok-pwa-card {
      width:calc(100% - 32px);max-width:400px;
      background:linear-gradient(145deg,#0a0a0f 0%,#12001a 40%,#001020 100%);
      border-radius:28px;padding:0;overflow:hidden;
      border:1px solid rgba(255,255,255,0.08);
      box-shadow:0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
      animation:pwaCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
      position:relative;
    }
    @keyframes pwaCardIn {
      from { transform:scale(0.7) translateY(40px);opacity:0; }
      to   { transform:scale(1) translateY(0);opacity:1; }
    }
    .ok-pwa-shimmer {
      position:absolute;top:0;left:-100%;width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);
      animation:pwaShimmer 3s ease infinite;pointer-events:none;
    }
    @keyframes pwaShimmer { 0%{left:-100%} 100%{left:200%} }

    /* Progress bar */
    #ok-pwa-progress-wrap { display:none;padding:0 28px 24px; }
    #ok-pwa-progress-track { height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden;margin-bottom:8px; }
    #ok-pwa-progress-bar {
      height:100%;width:0%;border-radius:99px;
      background:linear-gradient(90deg,#e11d48,#C9A84C);
      transition:width 0.3s ease;
      box-shadow:0 0 8px rgba(225,29,72,0.6);
    }

    /* Share btn fix */
    .share-outfitkart-btn { background:linear-gradient(135deg,#e11d48,#be123c) !important;animation:sharePulse 2.5s infinite !important; }

    /* Footer */
    #ok-site-footer { background:#111827;color:#9ca3af;padding:28px 20px 120px;text-align:center;border-top:1px solid #374151; }
    #ok-site-footer .footer-brand { font-size:1.1rem;font-weight:900;background:linear-gradient(135deg,#C9A84C,#F5E6C0,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;display:block; }
    #ok-site-footer .footer-links { display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin:12px 0; }
    #ok-site-footer .footer-links a { color:#9ca3af;text-decoration:none;font-size:11px;font-weight:600; }
    #ok-site-footer .footer-links a:hover { color:white; }
    #ok-site-footer .footer-copy { font-size:10px;color:#6b7280;margin-top:10px; }

    /* Policy pages */
    .ok-policy-section { max-width:700px;margin:0 auto;padding:16px; }
    .ok-policy-section h2 { font-size:1.3rem;font-weight:900;color:#111827;margin:24px 0 8px; }
    .ok-policy-section h3 { font-size:1rem;font-weight:800;color:#374151;margin:16px 0 6px; }
    .ok-policy-section p { font-size:13px;color:#4b5563;line-height:1.7;margin:6px 0; }
    .ok-policy-section ul,ol { padding-left:18px;margin:6px 0; }
    .ok-policy-section li { font-size:13px;color:#4b5563;line-height:1.7;margin:4px 0; }
    .ok-policy-section .highlight-box { background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:14px;margin:12px 0; }
    .ok-policy-section .warning-box { background:#fef2f2;border:1.5px solid #fca5a5;border-radius:12px;padding:14px;margin:12px 0; }
    .ok-policy-section .info-box { background:#eff6ff;border:1.5px solid #93c5fd;border-radius:12px;padding:14px;margin:12px 0; }

    /* scrollbar hide */
    .ok-hscroll { display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:12px;padding-bottom:8px; }
    .ok-hscroll::-webkit-scrollbar { display:none; }

    /* Cancel/Exchange modals */
    @keyframes okSlideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
    .supplier-id-row.saved { transition:all 0.3s ease; }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════════
   PART 2 — SCRIPT-CORE-PATCH (Cancel/Exchange/Refund/Admin)
   ═══════════════════════════════════════════════════════════════ */
const CANCEL_REASONS = [
  'Product ki zarurat nahi rahi','Galat product order ho gaya',
  'Better price kahi aur mili','Delivery time zyada lag rahi hai',
  'Duplicate order ho gaya','Address galat daal diya',
  'Payment issue tha','Kuch aur reason',
];
const EXCHANGE_REASONS = [
  'Size theek nahi tha','Color pasand nahi aaya',
  'Quality expectations se alag thi','Product damaged tha',
  'Galat product mila','Style change karna hai','Kuch aur reason',
];

window.cancelOrder = async function(orderId) {
  orderId = String(orderId || '').trim();
  if (!orderId) { showToast('❌ Invalid order'); return; }
  const order = ordersDb.find(o => String(o.id) === orderId);
  if (!order) return showToast('Order not found.');
  if (order.status !== 'Processing') return showToast('Only Processing orders can be cancelled.');
  _showCancelReasonModal(orderId, order);
};

function _showCancelReasonModal(orderId, order) {
  document.getElementById('ok-cancel-reason-modal')?.remove();
  const paymode = (order.paymentmode || '').toUpperCase();
  const isPaid = paymode === 'UPI' || paymode === 'CARD' || paymode === 'WALLET' || paymode === 'WALLET-PAY';
  const refundInfoHtml = isPaid ? `
    <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:10px 14px;margin-bottom:16px;">
      <div style="font-size:11px;font-weight:800;color:#1d4ed8;margin-bottom:4px;"><i class="fas fa-wallet" style="margin-right:4px;"></i>Refund Policy</div>
      <div style="font-size:11px;color:#1e40af;">Aapka <strong>₹${order.total}</strong> refund <strong>OutfitKart Wallet</strong> mein credit hoga (Admin confirm ke baad, 24-48 hrs). Wallet se future orders mein use ya UPI pe withdraw kar sakte ho.</div>
    </div>` : '';

  const modal = document.createElement('div');
  modal.id = 'ok-cancel-reason-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:500;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="background:white;border-radius:24px 24px 0 0;padding:24px;width:100%;max-width:480px;animation:okSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both;">
      <div style="width:40px;height:4px;background:#e5e7eb;border-radius:99px;margin:0 auto 20px;"></div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <div style="width:44px;height:44px;background:#FFF1F2;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-times-circle" style="color:#e11d48;font-size:20px;"></i></div>
        <div><h3 style="font-weight:900;font-size:1rem;color:#111827;margin:0;">Order Cancel Reason</h3><p style="font-size:11px;color:#9ca3af;margin:3px 0 0;">Order #${orderId} • ${order.paymentmode || 'COD'}</p></div>
      </div>
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:12px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
        <i class="fas fa-shield-check" style="color:#16a34a;font-size:16px;"></i>
        <div><div style="font-size:11px;font-weight:800;color:#15803d;">7-Day Easy Returns</div><div style="font-size:10px;color:#166534;opacity:0.85;">Delivered order ke 7 din ke andar exchange kar sakte ho</div></div>
      </div>
      <label style="display:block;font-size:11px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Cancel Reason *</label>
      <select id="cancel-reason-select" style="width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;font-weight:600;background:white;outline:none;color:#111827;margin-bottom:10px;" onchange="document.getElementById('cancel-custom-reason').style.display=this.value==='Kuch aur reason'?'block':'none'">
        <option value="">-- Reason chuniye --</option>
        ${CANCEL_REASONS.map(r => `<option value="${r}">${r}</option>`).join('')}
      </select>
      <textarea id="cancel-custom-reason" placeholder="Apna reason likhein..." style="display:none;width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;height:80px;outline:none;resize:none;margin-bottom:10px;box-sizing:border-box;"></textarea>
      ${refundInfoHtml}
      <div style="display:flex;gap:10px;">
        <button onclick="document.getElementById('ok-cancel-reason-modal').remove()" style="flex:1;border:2px solid #e5e7eb;background:white;color:#374151;padding:14px;border-radius:14px;font-weight:800;font-size:14px;cursor:pointer;">Back</button>
        <button onclick="_submitCancelWithReason('${orderId}')" style="flex:1;background:linear-gradient(135deg,#e11d48,#be123c);color:white;padding:14px;border-radius:14px;font-weight:900;font-size:14px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(225,29,72,0.3);">Cancel Order</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

window._submitCancelWithReason = async function(orderId) {
  const select = document.getElementById('cancel-reason-select');
  const customTa = document.getElementById('cancel-custom-reason');
  let reason = select?.value || '';
  if (reason === 'Kuch aur reason') reason = customTa?.value.trim() || 'Kuch aur reason';
  if (!reason) return showToast('Please select a cancel reason');
  document.getElementById('ok-cancel-reason-modal')?.remove();
  await _executeCancelOrderWallet(orderId, reason);
};

window._executeCancelOrderWallet = async function(orderId, reason) {
  orderId = String(orderId || '').trim();
  const order = ordersDb.find(o => String(o.id) === orderId);
  if (!order) return showToast('Order not found.');
  showToast('⏳ Cancelling...');
  try {
    const payload = { status:'Cancelled', cancel_reason:reason, refund_status:'pending_wallet', cancelled_at:new Date().toISOString() };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
      method:'PATCH',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Prefer':'return=representation'},
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const updated = rows?.[0] || { ...order, ...payload };
    const idx = ordersDb.findIndex(o => String(o.id) === orderId);
    if (idx > -1) ordersDb[idx] = { ...ordersDb[idx], ...updated };
    if (typeof cancelReferralForOrder === 'function') await cancelReferralForOrder(orderId);
    const cancelModal = document.getElementById('order-cancel-modal');
    const refundEl = document.getElementById('cancel-refund-msg');
    if (refundEl) { refundEl.textContent = `💰 ₹${order.total} aapke OutfitKart Wallet mein credit hoga (Admin confirmation ke baad, 24-48 hrs).`; refundEl.classList.remove('hidden'); }
    cancelModal?.classList.remove('hidden');
    cancelModal?.classList.add('flex');
    if (!document.getElementById('profile-page-orders')?.classList.contains('hidden')) renderOrdersList();
  } catch (err) { showToast('❌ Error: ' + err.message); }
};

function _daysSince(dateStr) {
  try {
    let d;
    if (dateStr && dateStr.includes('/')) { const p = dateStr.split('/'); if (p.length === 3) d = new Date(`${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`); }
    else d = new Date(dateStr);
    if (!d || isNaN(d)) return 0;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  } catch { return 0; }
}

window.startExchange = function(orderId) {
  orderId = String(orderId || '').trim();
  const order = ordersDb.find(o => String(o.id) === orderId);
  if (!order || order.status !== 'Delivered') return showToast('Exchange only for delivered orders.');
  const deliveredDate = order.delivered_at || order.date;
  if (deliveredDate && _daysSince(deliveredDate) > 7) return _show7DayExpiredModal();
  _showExchangeReasonModal(orderId, order);
};

function _show7DayExpiredModal() {
  document.getElementById('ok-7day-expired-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'ok-7day-expired-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);';
  modal.innerHTML = `<div style="background:white;border-radius:20px;padding:28px;max-width:360px;width:100%;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">⏰</div><h3 style="font-weight:900;font-size:1.1rem;color:#111827;margin-bottom:8px;">7-Day Return Window Expired</h3><p style="font-size:13px;color:#6b7280;margin-bottom:20px;">Aapke order ki delivery ke 7 din ho gaye hain.</p><div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:12px;margin-bottom:20px;font-size:12px;color:#92400e;"><strong>Need help?</strong> Contact WhatsApp support for special cases.</div><div style="display:flex;gap:10px;"><button onclick="document.getElementById('ok-7day-expired-modal').remove()" style="flex:1;background:#f3f4f6;color:#374151;padding:12px;border-radius:12px;font-weight:700;border:none;cursor:pointer;">Close</button><button onclick="openWhatsAppSupport&&openWhatsAppSupport();document.getElementById('ok-7day-expired-modal').remove()" style="flex:1;background:linear-gradient(135deg,#25D366,#128C7E);color:white;padding:12px;border-radius:12px;font-weight:700;border:none;cursor:pointer;"><i class="fab fa-whatsapp" style="margin-right:4px;"></i>WhatsApp</button></div></div>`;
  document.body.appendChild(modal);
}

function _showExchangeReasonModal(orderId, order) {
  document.getElementById('ok-exchange-reason-modal')?.remove();
  const oldPrice = order.total || 0;
  const modal = document.createElement('div');
  modal.id = 'ok-exchange-reason-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:500;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  modal.innerHTML = `
    <div style="background:white;border-radius:24px 24px 0 0;padding:24px;width:100%;max-width:480px;animation:okSlideUp 0.35s cubic-bezier(0.4,0,0.2,1) both;max-height:90vh;overflow-y:auto;">
      <div style="width:40px;height:4px;background:#e5e7eb;border-radius:99px;margin:0 auto 20px;"></div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:44px;height:44px;background:#fff7ed;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-exchange-alt" style="color:#f97316;font-size:18px;"></i></div>
        <div><h3 style="font-weight:900;font-size:1rem;color:#111827;margin:0;">Exchange Request</h3><p style="font-size:11px;color:#9ca3af;margin:3px 0 0;">Order #${orderId} • Exchange Value: ₹${oldPrice}</p></div>
      </div>
      <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:12px;padding:10px 14px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
        <i class="fas fa-shield-check" style="color:#16a34a;font-size:16px;"></i>
        <div style="flex:1;"><div style="font-size:11px;font-weight:800;color:#15803d;">✅ 7-Day Easy Returns Active</div><div style="font-size:10px;color:#166534;">Aap exchange ke eligible hain</div></div>
        <div style="font-size:18px;font-weight:900;color:#16a34a;">7</div>
      </div>
      <label style="display:block;font-size:11px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Exchange Reason *</label>
      <select id="exchange-reason-select" style="width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;font-weight:600;background:white;outline:none;color:#111827;margin-bottom:10px;" onchange="document.getElementById('exchange-custom-reason').style.display=this.value==='Kuch aur reason'?'block':'none'">
        <option value="">-- Reason chuniye --</option>
        ${EXCHANGE_REASONS.map(r => `<option value="${r}">${r}</option>`).join('')}
      </select>
      <textarea id="exchange-custom-reason" placeholder="Apna reason likhein..." style="display:none;width:100%;border:2px solid #e5e7eb;border-radius:12px;padding:12px;font-size:14px;height:70px;outline:none;resize:none;margin-bottom:12px;box-sizing:border-box;"></textarea>
      <div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;padding:12px 14px;margin-bottom:16px;font-size:11px;color:#9a3412;">
        <div style="font-weight:800;margin-bottom:6px;">How it works:</div>
        • Naya product choose karo aur checkout karo<br>
        • Agar naya product <strong>mehenga hai</strong> → sirf difference pay karo<br>
        • Agar naya product <strong>sasta hai</strong> → difference wallet mein credit hoga<br>
        • Same price → koi extra charge nahi
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="document.getElementById('ok-exchange-reason-modal').remove()" style="flex:1;border:2px solid #e5e7eb;background:white;color:#374151;padding:14px;border-radius:14px;font-weight:800;font-size:14px;cursor:pointer;">Back</button>
        <button onclick="_submitExchangeWithReason('${orderId}',${oldPrice})" style="flex:1;background:linear-gradient(135deg,#f97316,#ea580c);color:white;padding:14px;border-radius:14px;font-weight:900;font-size:14px;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(249,115,22,0.3);">Start Exchange →</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

window._submitExchangeWithReason = function(orderId, oldPrice) {
  const select = document.getElementById('exchange-reason-select');
  const customTa = document.getElementById('exchange-custom-reason');
  let reason = select?.value || '';
  if (reason === 'Kuch aur reason') reason = customTa?.value.trim() || 'Kuch aur reason';
  if (!reason) return showToast('Please select an exchange reason');
  document.getElementById('ok-exchange-reason-modal')?.remove();
  const order = ordersDb.find(o => String(o.id) === orderId);
  if (!order) return;
  if (typeof dbClient !== 'undefined') dbClient.from('orders').update({ exchange_reason:reason, exchange_requested_at:new Date().toISOString() }).eq('id', orderId).then(() => {});
  window.isExchangeProcess = true;
  window.exchangeSourceOrder = order;
  window.exchangeOldPrice = oldPrice;
  window._pendingExchangeOrder = order;
  window._pendingExchangeOldPrice = oldPrice;
  showToast(`Exchange started 🔄 Old value: ₹${oldPrice}`);
  navigate('shop');
};

/* 7-day badge on PDP */
const _origInjectSafeDelivery = window._injectSafeDeliveryButton;
window._injectSafeDeliveryButton = function() {
  if (typeof _origInjectSafeDelivery === 'function') _origInjectSafeDelivery();
  _inject7DayBadge();
};
function _inject7DayBadge() {
  const pdp = document.getElementById('pdp-container');
  if (!pdp || pdp.querySelector('.ok-7day-badge')) return;
  const actionGrid = pdp.querySelector('.grid.grid-cols-2.gap-3.mt-auto');
  if (!actionGrid) return;
  const badge = document.createElement('div');
  badge.className = 'ok-7day-badge';
  badge.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 12px;margin-top:8px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1.5px solid #86efac;border-radius:10px;';
  badge.innerHTML = `<i class="fas fa-undo-alt" style="color:#16a34a;font-size:14px;"></i><div style="flex:1;"><span style="font-size:11px;font-weight:800;color:#15803d;">7-Day Easy Returns</span><span style="font-size:10px;color:#166534;display:block;">Delivery ke 7 din tak exchange</span></div><span style="font-size:11px;font-weight:900;color:#16a34a;background:white;padding:3px 8px;border-radius:20px;border:1px solid #86efac;">FREE</span>`;
  actionGrid.insertAdjacentElement('afterend', badge);
}

/* Admin: confirm wallet refund */
window._adminConfirmWalletRefund = async function(orderId) {
  orderId = String(orderId || '').trim();
  if (!confirm(`Confirm wallet refund for order #${orderId}?`)) return;
  try {
    const { data: order } = await dbClient.from('orders').select('*').eq('id', orderId).maybeSingle();
    if (!order) return showToast('Order not found');
    if (order.refund_status === 'refunded') return showToast('Already refunded!');
    const { data: user } = await dbClient.from('users').select('wallet').eq('mobile', order.mobile).maybeSingle();
    if (!user) return showToast('User not found');
    const newWallet = (user.wallet || 0) + (order.total || 0);
    await dbClient.from('users').update({ wallet: newWallet }).eq('mobile', order.mobile);
    await dbClient.from('orders').update({ refund_status:'refunded', refunded_at:new Date().toISOString(), refunded_amount:order.total }).eq('id', orderId);
    showToast(`✅ ₹${order.total} wallet mein credit ho gaya! (+91 ${order.mobile})`);
    setTimeout(() => loadAllOrdersAdmin && loadAllOrdersAdmin(), 600);
  } catch (err) { showToast('❌ Error: ' + err.message); }
};

/* Admin: save supplier order ID */
window._adminSaveSupplierOrderId = async function(orderId, inputId) {
  const val = document.getElementById(inputId)?.value.trim();
  if (!val) return showToast('Supplier order ID enter karo');
  try {
    await dbClient.from('orders').update({ supplier_order_id: val }).eq('id', String(orderId));
    showToast('✅ Supplier Order ID saved!');
    document.getElementById(inputId)?.closest('.supplier-id-row')?.classList.add('saved');
  } catch (err) { showToast('❌ ' + err.message); }
};

/* Patch renderFilteredOrders */
const _origRenderFilteredOrders = window.renderFilteredOrders;
window.renderFilteredOrders = function(filterStatus) {
  const container = document.getElementById('admin-full-order-list');
  if (!container) return;
  const allOrders = window.allAdminOrders || [];
  const filteredData = filterStatus === 'all' ? allOrders : allOrders.filter(o => o.status === filterStatus);
  if (!allOrders.length) { if (_origRenderFilteredOrders) _origRenderFilteredOrders(filterStatus); return; }
  if (!filteredData.length) {
    container.innerHTML = `<div class="text-center py-16"><i class="fas fa-filter text-5xl text-gray-300 mb-3"></i><p class="text-gray-500 font-semibold">No ${filterStatus} orders found</p></div>`;
    return;
  }
  const activeOrders = allOrders.filter(o => o.status !== 'Cancelled');
  const cancelledOrders = allOrders.filter(o => o.status === 'Cancelled');
  container.innerHTML = `<div class="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200 mb-4 sticky top-0 z-10"><div class="flex items-center justify-between flex-wrap gap-2"><span class="text-sm font-black text-purple-700">${filterStatus === 'all' ? `Total: ${allOrders.length}` : `${filterStatus}: ${filteredData.length}`}</span><div class="flex gap-2"><span class="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200 font-bold">Active: ${activeOrders.length}</span><span class="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full border border-red-200 font-bold">Cancelled: ${cancelledOrders.length}</span></div></div></div>` +
    filteredData.map(o => {
      const oidSafe = String(o.id || '').replace(/'/g, "\\'");
      const badge = (typeof STATUS_BADGE !== 'undefined' ? STATUS_BADGE : {})[o.status] || 'bg-gray-100 text-gray-600';
      const isCancelled = o.status === 'Cancelled';
      const needsRefund = isCancelled && o.refund_status !== 'refunded' && (o.paymentmode || '').toUpperCase() !== 'COD';
      const alreadyRefunded = o.refund_status === 'refunded';
      const supplierInputId = `sup-oid-${o.id}`;
      const prods = window.products || [];
      const goldProds = window.goldProducts || [];
      const itemsHtml = (o.items || []).map(item => {
        const prod = prods.find(p => p.id === item.id) || goldProds.find(p => p.id === item.id);
        const suppUrl = prod?.supplier_url || item.supplier_url || '';
        return `<div class="admin-order-item"><img src="${item.img || 'https://placehold.co/48x60/e11d48/fff?text=?'}" onerror="this.src='https://placehold.co/48x60/eee/999?text=?'" loading="lazy"><div class="admin-order-item-info"><div class="admin-order-item-name">${item.name}</div><div class="admin-order-item-meta">Size: <strong>${item.size||'M'}</strong> • Qty: <strong>${item.qty||1}</strong></div><div class="admin-order-item-price">₹${((item.price||0)*(item.qty||1)).toLocaleString('en-IN')}</div>${suppUrl?`<a href="${suppUrl}" target="_blank" rel="noopener" class="text-[10px] text-indigo-600 font-bold hover:underline" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt text-[8px]"></i> Supplier</a>`:''}</div></div>`;
      }).join('') || '<div class="text-xs text-gray-400 italic py-2 px-1">No items</div>';
      const allStatuses = typeof ALL_ORDER_STATUSES !== 'undefined' ? ALL_ORDER_STATUSES : ['Processing','Confirmed','Packed','Shipped','Delivered','Cancelled'];
      return `<div class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-3 hover:shadow-md transition-all">
        <div class="flex justify-between items-start pb-3 mb-3 border-b">
          <div><span class="font-bold text-purple-700 font-mono text-sm">#${o.id}</span><span class="${badge} text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">${o.status||'Processing'}</span>${alreadyRefunded?'<span class="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">✅ Refunded</span>':''}<div class="text-xs text-gray-500 mt-1">${o.date||''} • ${o.paymentmode||''}</div>${o.cancel_reason?`<div class="text-xs text-red-600 mt-1 font-semibold"><i class="fas fa-times-circle mr-1"></i>${o.cancel_reason}</div>`:''}</div>
          <div class="font-black text-lg text-rose-600">₹${(o.total||0).toLocaleString('en-IN')}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs mb-3 bg-gray-50 rounded-lg p-3 border">
          <div><span class="font-bold text-gray-400 uppercase text-[10px]">Customer</span><div class="font-semibold text-gray-800 mt-0.5">${o.customer_name||'N/A'}</div></div>
          <div><span class="font-bold text-gray-400 uppercase text-[10px]">Mobile</span><div class="font-semibold text-gray-800 mt-0.5">${o.mobile||'N/A'}</div></div>
          ${o.margin_total?`<div class="col-span-2 bg-green-50 rounded p-1.5 border border-green-200"><span class="font-bold text-green-700 uppercase text-[10px]">Profit</span><div class="font-bold text-green-700 mt-0.5">₹${o.margin_total.toLocaleString('en-IN')}</div></div>`:''}
          ${o.promo_code?`<div class="col-span-2 bg-rose-50 rounded p-1.5 border border-rose-200"><span class="font-bold text-rose-700 uppercase text-[10px]">Promo</span><div class="font-mono font-semibold text-rose-800 mt-0.5">${o.promo_code} (-₹${o.promo_discount||0})</div></div>`:''}
        </div>
        <div class="mb-3"><div class="text-[10px] font-bold text-gray-400 uppercase mb-2">Items (${(o.items||[]).length})</div><div class="admin-order-items">${itemsHtml}</div></div>
        <div class="supplier-id-row mb-3 ${o.supplier_order_id?'saved':''}" style="background:${o.supplier_order_id?'#f0fdf4':'#f8fafc'};border:1.5px solid ${o.supplier_order_id?'#86efac':'#e5e7eb'};border-radius:12px;padding:10px 12px;">
          <div class="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><i class="fas fa-truck" style="color:#7c3aed;"></i> Meesho / Supplier Order ID ${o.supplier_order_id?'<span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:99px;font-size:9px;font-weight:800;">✅ Saved</span>':'<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:99px;font-size:9px;font-weight:800;">Pending</span>'}</div>
          <div class="flex gap-2"><input type="text" id="${supplierInputId}" value="${o.supplier_order_id||''}" placeholder="e.g. 47291837462" style="flex:1;border:1.5px solid #d1d5db;border-radius:8px;padding:7px 10px;font-size:12px;font-family:monospace;font-weight:700;outline:none;"><button onclick="_adminSaveSupplierOrderId('${oidSafe}','${supplierInputId}')" style="background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;border:none;padding:7px 14px;border-radius:8px;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap;">Save</button></div>
        </div>
        <div class="text-[10px] text-gray-500 bg-blue-50 rounded-lg p-2 border border-blue-100 mb-3"><i class="fas fa-map-marker-alt text-blue-400 mr-1"></i>${[o.address,o.city,o.state,o.pincode?'- '+o.pincode:''].filter(Boolean).join(', ')||'N/A'}</div>
        ${needsRefund?`<div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1.5px solid #93c5fd;border-radius:12px;padding:12px;margin-bottom:12px;"><div style="font-size:11px;font-weight:800;color:#1d4ed8;margin-bottom:8px;"><i class="fas fa-wallet" style="margin-right:4px;"></i>Wallet Refund Pending — ₹${o.total} to +91 ${o.mobile}</div><button onclick="_adminConfirmWalletRefund('${oidSafe}')" style="width:100%;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:white;border:none;padding:10px;border-radius:10px;font-weight:900;font-size:13px;cursor:pointer;">✅ Confirm & Credit Wallet ₹${o.total}</button></div>`:''}
        <div class="flex items-center gap-2"><span class="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Status:</span><select onchange="updateOrderStatus&&updateOrderStatus('${oidSafe}',this.value)" style="flex:1;border:1.5px solid #d1d5db;border-radius:8px;font-size:12px;padding:8px;font-weight:700;background:white;outline:none;cursor:pointer;">${allStatuses.map(s=>`<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}</select></div>
      </div>`;
    }).join('');
};

/* Patch renderOrdersList */
window.renderOrdersList = function() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;
  if (!ordersDb.length) { container.innerHTML = '<div class="text-center text-gray-500 py-10">No orders placed yet.</div>'; return; }
  container.innerHTML = [...ordersDb].reverse().map(order => {
    const badge = (typeof STATUS_BADGE !== 'undefined' ? STATUS_BADGE : {})[order.status] || 'bg-gray-100 text-gray-600';
    const oidStr = String(order.id).replace(/'/g, "\\'");
    const isDelivered = order.status === 'Delivered';
    const daysSince = isDelivered ? _daysSince(order.date) : 0;
    const canExchange = isDelivered && daysSince <= 7;
    const exchangeDaysLeft = Math.max(0, 7 - daysSince);
    const cancelBtn = order.status === 'Processing' ? `<button onclick="cancelOrder('${oidStr}')" class="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100">Cancel Order</button>` : '';
    const exchangeBtn = isDelivered ? canExchange
      ? `<button onclick="startExchange('${oidStr}')" class="text-xs bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-lg font-bold shadow whitespace-nowrap">Exchange <span style="background:rgba(255,255,255,0.25);padding:1px 5px;border-radius:99px;font-size:9px;">${exchangeDaysLeft}d left</span></button>`
      : `<span class="text-xs text-gray-400 border border-gray-200 px-2 py-1 rounded-lg">Return expired</span>` : '';
    const refundNote = order.status === 'Cancelled'
      ? order.refund_status === 'refunded'
        ? `<p class="text-xs text-green-600 mt-1 font-semibold"><i class="fas fa-check-circle mr-1"></i>₹${order.total} Wallet mein refund ho gaya ✅</p>`
        : `<p class="text-xs text-amber-600 mt-1 font-semibold"><i class="fas fa-clock mr-1"></i>₹${order.total} Wallet refund pending (24-48 hrs)</p>` : '';
    const cancelReasonNote = order.cancel_reason ? `<p class="text-xs text-red-500 mt-0.5"><i class="fas fa-info-circle mr-1"></i>${order.cancel_reason}</p>` : '';
    const sevenDayBadge = isDelivered
      ? `<div style="display:inline-flex;align-items:center;gap:5px;background:${canExchange?'#f0fdf4':'#f9fafb'};border:1px solid ${canExchange?'#86efac':'#e5e7eb'};border-radius:99px;padding:3px 10px;font-size:10px;font-weight:700;color:${canExchange?'#15803d':'#9ca3af'};margin-top:4px;"><i class="fas fa-undo-alt" style="font-size:9px;"></i>${canExchange?`7-Day Return: ${exchangeDaysLeft} days left`:'7-Day window expired'}</div>` : '';
    return `<div class="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div class="flex justify-between border-b pb-3 mb-3"><div><span class="font-bold text-gray-800">Order #${order.id}</span><br><span class="text-xs text-gray-500">${order.date} • ${order.paymentmode}</span>${refundNote}${cancelReasonNote}${sevenDayBadge}</div><div class="text-right"><span class="${badge} text-xs font-bold px-2 py-1 rounded-full">${order.status}</span><br><span class="font-bold text-sm mt-1 block">₹${order.total}</span></div></div>
      <div class="space-y-3">${(order.items||[]).map(item=>`<div class="flex gap-3 items-center text-sm"><img src="${item.img}" class="w-12 h-16 rounded object-cover border flex-shrink-0" onerror="this.src='https://placehold.co/48x64/eee/999?text=?'" loading="lazy"><div class="flex-1 min-w-0"><div class="font-semibold text-gray-800 truncate">${item.name}</div><div class="text-gray-500 text-xs">Qty: ${item.qty} • Size: ${item.size||'M'}</div></div><div class="flex flex-col gap-1 items-end"><button onclick="openTrackingModal('${oidStr}')" class="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-md font-bold shadow whitespace-nowrap">Track</button>${cancelBtn}${exchangeBtn}</div></div>`).join('')}</div>
    </div>`;
  }).join('');
};

/* ═══════════════════════════════════════════════════════════════
   PART 3 — SPONSOR STORAGE
   ═══════════════════════════════════════════════════════════════ */
const SPONSOR_STORAGE_KEY = 'outfitkart_sponsors_v1';
function _getSponsors() {
  try { const raw = localStorage.getItem(SPONSOR_STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [
    { id:1, img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&q=80', title:'HDFC Bank Credit Card', subtitle:'Get ₹500 cashback on first swipe', tag:'Sponsored', tagColor:'#3b82f6', link:'https://www.hdfcbank.com', badge:'₹500 Cashback' },
    { id:2, img:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&q=80', title:'Paytm Wallet', subtitle:'Earn 2% cashback on every payment', tag:'Partner', tagColor:'#0ea5e9', link:'https://paytm.com', badge:'2% Cashback' },
    { id:3, img:'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=200&fit=crop&q=80', title:'PhonePe Offers', subtitle:'Shop & save more with PhonePe', tag:'Offer', tagColor:'#8b5cf6', link:'https://www.phonepe.com', badge:'Special Offer' },
  ];
}
function _saveSponsors(s) { try { localStorage.setItem(SPONSOR_STORAGE_KEY, JSON.stringify(s)); } catch {} }

/* ═══════════════════════════════════════════════════════════════
   PART 4 — SPONSOR BETWEEN PRODUCTS
   ═══════════════════════════════════════════════════════════════ */
function _injectSponsorInGrid() {
  const grid = document.getElementById('trending-grid');
  if (!grid || grid.querySelector('.ok-sponsor-inline')) return;
  const sponsors = _getSponsors();
  if (!sponsors.length) return;
  const cards = grid.querySelectorAll('[class*="product-card"], .product-card, [onclick*="openProductPage"]');
  const insertAfter = cards[3] || cards[cards.length - 1];
  if (!insertAfter) return;
  const wrap = document.createElement('div');
  wrap.className = 'ok-sponsor-inline';
  wrap.style.cssText = 'grid-column:1/-1;';
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <div><h3 style="font-size:1rem;font-weight:900;color:#111827;margin:0;">💳 Offers & Partners</h3><p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">Exclusive deals from our partners</p></div>
      <span style="font-size:9px;font-weight:800;color:#6b7280;background:#f3f4f6;padding:3px 8px;border-radius:99px;letter-spacing:0.08em;text-transform:uppercase;">AD</span>
    </div>
    <div class="ok-hscroll">
      ${sponsors.map(b=>`<a href="${b.link}" target="_blank" rel="noopener sponsored" class="ok-sponsor-card"><div style="position:relative;"><img src="${b.img}" loading="lazy" onerror="this.src='https://placehold.co/220x110/f3f4f6/9ca3af?text=Offer'"><div style="position:absolute;top:8px;left:8px;background:${b.tagColor};color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:99px;">${b.tag}</div><div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.6);color:white;font-size:9px;font-weight:800;padding:3px 8px;border-radius:99px;">${b.badge}</div></div><div style="padding:10px 12px;background:white;"><div style="font-size:12px;font-weight:800;color:#111827;">${b.title}</div><div style="font-size:10px;color:#6b7280;margin-top:2px;">${b.subtitle}</div><div style="margin-top:8px;font-size:10px;font-weight:700;color:${b.tagColor};">Know More <i class="fas fa-arrow-right" style="font-size:8px;"></i></div></div></a>`).join('')}
    </div>
    <p style="font-size:9px;color:#9ca3af;text-align:center;margin-top:8px;font-style:italic;">* Sponsored content. OutfitKart earns commission on partner links.</p>
  `;
  insertAfter.insertAdjacentElement('afterend', wrap);
}

/* ═══════════════════════════════════════════════════════════════
   PART 5 — GOLD IN TRENDING
   ═══════════════════════════════════════════════════════════════ */
function _injectGoldInTrending() {
  const grid = document.getElementById('trending-grid');
  if (!grid || grid.querySelector('.ok-gold-trending-row')) return;
  const gProds = (window.goldProducts || []).slice(0, 6);
  if (!gProds.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'ok-gold-trending-row';
  wrap.style.cssText = 'grid-column:1/-1;';
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:4px 0 12px;">
      <div><h3 style="font-size:1.1rem;font-weight:900;margin:0;background:linear-gradient(135deg,#C9A84C,#F5E6C0,#C9A84C);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">⭐ OutfitKart Gold</h3><p style="font-size:10px;color:#9ca3af;margin:2px 0 0;">Premium curated picks</p></div>
      <button onclick="navigate('gold')" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;border:none;padding:7px 16px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;">View All →</button>
    </div>
    <div class="ok-hscroll">
      ${gProds.map(p=>{const img=p.imgs?.[0]||p.img||'https://placehold.co/145x175/1a1200/C9A84C?text=Gold';return `<div style="flex-shrink:0;width:145px;cursor:pointer;" onclick="openProductPage(${p.id},true)"><div style="border-radius:14px;overflow:hidden;border:1.5px solid rgba(201,168,76,0.4);background:#1a1200;position:relative;"><img src="${img}" style="width:100%;height:175px;object-fit:cover;display:block;" loading="lazy"><div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#C9A84C,#F5E6C0);color:#3d2c00;font-size:9px;font-weight:900;padding:3px 7px;border-radius:99px;">⭐ GOLD</div></div><div style="padding:8px 4px;"><div style="font-size:11px;font-weight:700;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div><div style="font-size:13px;font-weight:900;color:#C9A84C;margin-top:2px;">₹${p.price}</div></div></div>`;}).join('')}
    </div>
  `;
  grid.appendChild(wrap);
}

/* ═══════════════════════════════════════════════════════════════
   PART 6 — HOME PAGE RENDERERS
   ═══════════════════════════════════════════════════════════════ */
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
  strip.innerHTML = `<div class="ok-trust-item"><i class="fas fa-truck"></i><div><strong>Free Shipping</strong><span>On orders over ₹500</span></div></div><div class="ok-trust-item"><i class="fas fa-undo-alt"></i><div><strong>Easy Exchange</strong><span>7 day exchange policy</span></div></div><div class="ok-trust-item"><i class="fas fa-tag"></i><div><strong>Daily Deals</strong><span>Save up to 60% off</span></div></div><div class="ok-trust-item"><i class="fas fa-headset"></i><div><strong>24/7 Support</strong><span>We're here to help</span></div></div>`;
  const carousel = document.getElementById('banner-carousel');
  if (carousel) carousel.insertAdjacentElement('afterend', strip);
}

function _renderShopByCategorySection() {
  if (document.getElementById('ok-shopco-cats')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
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
  const carousel = document.getElementById('banner-carousel');
  const insertAfter = trustStrip || carousel;
  if (insertAfter) insertAfter.insertAdjacentElement('afterend', section);
}

function _renderUnbeatableSection() {
  if (document.getElementById('ok-unbeatable-section')) return;
  const homeView = document.getElementById('view-home');
  if (!homeView) return;
  const allProds = (window.products || []).concat(window.goldProducts || []);
  const cheap = [...allProds].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 12);
  if (!cheap.length) return;
  const section = document.createElement('div');
  section.id = 'ok-unbeatable-section';
  section.style.cssText = 'background:linear-gradient(135deg,#0a0a0a 0%,#1a1200 40%,#0a0a0a 100%);';
  section.innerHTML = `
    <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,0.15),transparent 70%);pointer-events:none;"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;position:relative;">
      <div><div style="font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:4px;">AI Curated</div><h3 style="font-size:1.2rem;font-weight:900;color:white;margin:0;line-height:1.15;">🔥 Unbeatable Low Prices</h3><p style="font-size:11px;color:rgba(255,255,255,0.45);margin:4px 0 0;font-style:italic;">Best deals handpicked for you</p></div>
      <button onclick="navigate('shop')" style="background:linear-gradient(135deg,#C9A84C,#B8860B);color:#1a0800;border:none;padding:8px 16px;border-radius:99px;font-size:11px;font-weight:900;cursor:pointer;">View All →</button>
    </div>
    <div class="ok-hscroll" style="margin-bottom:16px;">
      <div class="ok-unbeat-pill" style="background:rgba(225,29,72,0.15);border:1px solid rgba(225,29,72,0.3);"><div style="font-size:18px;font-weight:900;color:#f43f5e;">Starting<br>₹${cheap[0]?.price||99}</div><div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Best Price</div></div>
      <div class="ok-unbeat-pill" style="background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);"><div style="font-size:18px;font-weight:900;color:#C9A84C;">COD</div><div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Available</div></div>
      <div class="ok-unbeat-pill" style="background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.3);"><div style="font-size:18px;font-weight:900;color:#22c55e;">FREE</div><div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Delivery</div></div>
      <div class="ok-unbeat-pill" style="background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.3);"><div style="font-size:18px;font-weight:900;color:#60a5fa;">7 DAY</div><div style="font-size:9px;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;margin-top:2px;">Exchange</div></div>
    </div>
    <div class="ok-hscroll">
      ${cheap.map(p=>{const img=p.imgs?.[0]||p.img||'https://placehold.co/145x175/1a1200/C9A84C?text=OK';const oldP=p.oldprice||Math.round(p.price*1.4);const disc=Math.round(((oldP-p.price)/oldP)*100);return `<div class="ok-unbeat-card" onclick="openProductPage(${p.id})"><div class="ok-unbeat-card-img-wrap"><img src="${img}" loading="lazy" onerror="this.src='https://placehold.co/145x175/1a1200/C9A84C?text=OK'"><div style="position:absolute;top:8px;left:8px;background:linear-gradient(135deg,#e11d48,#be123c);color:white;font-size:9px;font-weight:900;padding:3px 7px;border-radius:99px;">${disc}% OFF</div></div><div style="padding:8px 4px;"><div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.name}</div><div style="display:flex;align-items:center;gap:5px;margin-top:3px;"><span style="font-size:13px;font-weight:900;color:#C9A84C;">₹${p.price}</span><span style="font-size:10px;text-decoration:line-through;color:rgba(255,255,255,0.35);">₹${oldP}</span></div><div style="font-size:9px;color:rgba(34,197,94,0.8);font-weight:700;margin-top:2px;">🚚 Free Delivery</div></div></div>`;}).join('')}
    </div>
  `;
  const trending = homeView.querySelector('.mt-4.bg-white.p-4');
  if (trending) trending.insertAdjacentElement('beforebegin', section);
  else homeView.appendChild(section);
}

/* ═══════════════════════════════════════════════════════════════
   PART 7 — PWA INSTALL BUTTON (FIXED: sirf tab dikhe jab install nahi)
   ═══════════════════════════════════════════════════════════════ */

/* Check karo ki PWA already install hai ya nahi */
function _isPWAInstalled() {
  const standaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const iOSStandalone   = window.navigator.standalone === true;
  return standaloneMedia || iOSStandalone;
}

function _injectGetAppButton() {
  // Agar PWA already install hai → button bilkul mat dikhao
  if (_isPWAInstalled()) {
    document.getElementById('ok-get-app-btn')?.remove();
    return;
  }

  if (document.getElementById('ok-get-app-btn')) return;

  const header = document.querySelector('header .flex.items-center.gap-3');
  if (!header) return;

  const btn = document.createElement('button');
  btn.id = 'ok-get-app-btn';
  btn.onclick = _showPWAPopup;
  btn.innerHTML = `<i class="fas fa-download" style="font-size:9px;"></i> Install OutfitKart`;

  const firstBtn = header.querySelector('button');
  if (firstBtn) header.insertBefore(btn, firstBtn);
  else header.appendChild(btn);

  // Jab user install kare tab button khud hat jaye
  window.matchMedia('(display-mode: standalone)').addEventListener('change', e => {
    if (e.matches) document.getElementById('ok-get-app-btn')?.remove();
  });
}

let _pwaInstallTriggered = false;

function _showPWAPopup() {
  if (document.getElementById('ok-pwa-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'ok-pwa-overlay';
  overlay.innerHTML = `
    <div id="ok-pwa-card">
      <div class="ok-pwa-shimmer"></div>

      <!-- Close -->
      <button onclick="document.getElementById('ok-pwa-overlay').remove()" style="position:absolute;top:16px;right:16px;z-index:10;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>

      <!-- Hero section -->
      <div style="background:linear-gradient(135deg,#1a0010 0%,#0a0030 50%,#001a10 100%);padding:36px 28px 28px;text-align:center;position:relative;overflow:hidden;">
        <div style="position:absolute;top:50%;left:50%;width:220px;height:220px;border-radius:50%;border:1px solid rgba(225,29,72,0.15);transform:translate(-50%,-50%);animation:orbitRing1 8s linear infinite;"></div>
        <div style="position:absolute;top:50%;left:50%;width:160px;height:160px;border-radius:50%;border:1px solid rgba(201,168,76,0.1);transform:translate(-50%,-50%);animation:orbitRing1 5s linear infinite reverse;"></div>

        <div style="position:relative;width:80px;height:80px;margin:0 auto 18px;" id="ok-pwa-icon-wrap">
          <div style="width:80px;height:80px;border-radius:22px;background:linear-gradient(135deg,#e11d48 0%,#be123c 50%,#9f1239 100%);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 1px rgba(255,255,255,0.1),0 20px 60px rgba(225,29,72,0.5);animation:iconFloat 3s ease-in-out infinite;">
            <i class="fas fa-shopping-bag" style="color:white;font-size:32px;"></i>
          </div>
          <div style="position:absolute;top:-6px;right:-6px;width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#C9A84C,#F5E6C0);display:flex;align-items:center;justify-content:center;font-size:11px;box-shadow:0 4px 12px rgba(201,168,76,0.5);animation:badgePulse 2s ease infinite;">⭐</div>
        </div>

        <h2 style="color:white;font-size:1.4rem;font-weight:900;margin:0 0 6px;letter-spacing:-0.02em;">OutfitKart</h2>
        <p style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 20px;">Premium Fashion App</p>

        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:16px;">
          <div style="display:flex;gap:2px;color:#C9A84C;font-size:12px;">★★★★★</div>
          <span style="color:rgba(255,255,255,0.4);font-size:10px;">4.9 • 10K+ users</span>
        </div>

        <div style="display:flex;justify-content:center;gap:16px;">
          ${['🚀 Fast','📦 COD','🔔 Alerts'].map(f=>`<div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 10px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">${f}</div>`).join('')}
        </div>
      </div>

      <!-- 10% off badge -->
      <div style="background:linear-gradient(135deg,#1a0800,#2d0a00);padding:14px 28px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.05);">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#C9A84C,#B8860B);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 4px 12px rgba(201,168,76,0.3);">🎁</div>
        <div>
          <div style="font-size:13px;font-weight:900;color:#C9A84C;">Install karo, 10% OFF pao!</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px;">Code <span style="font-family:monospace;color:#F5E6C0;font-weight:800;background:rgba(201,168,76,0.15);padding:1px 6px;border-radius:4px;">APP10</span> first order pe</div>
        </div>
      </div>

      <!-- Install button + progress -->
      <div style="padding:20px 28px 28px;">
        <button id="ok-pwa-install-btn" onclick="_triggerPWAInstall()" style="width:100%;background:linear-gradient(135deg,#e11d48 0%,#be123c 60%,#9f1239 100%);color:white;border:none;padding:16px;border-radius:16px;font-size:15px;font-weight:900;cursor:pointer;letter-spacing:0.03em;box-shadow:0 8px 32px rgba(225,29,72,0.4);position:relative;overflow:hidden;transition:transform 0.15s ease;">
          <span id="ok-pwa-btn-text"><i class="fas fa-download" style="margin-right:8px;"></i>Install OutfitKart</span>
        </button>

        <div id="ok-pwa-progress-wrap">
          <div id="ok-pwa-progress-track">
            <div id="ok-pwa-progress-bar"></div>
          </div>
          <div id="ok-pwa-progress-label" style="font-size:11px;color:rgba(255,255,255,0.5);text-align:center;">Preparing install...</div>
        </div>

        <p style="text-align:center;font-size:10px;color:rgba(255,255,255,0.25);margin-top:12px;">No app store needed • Works on all devices</p>
      </div>
    </div>

    <style>
      @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes badgePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      @keyframes orbitRing1 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
    </style>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

window._triggerPWAInstall = async function() {
  const btn = document.getElementById('ok-pwa-install-btn');
  const btnText = document.getElementById('ok-pwa-btn-text');
  const progressWrap = document.getElementById('ok-pwa-progress-wrap');
  const progressBar = document.getElementById('ok-pwa-progress-bar');
  const progressLabel = document.getElementById('ok-pwa-progress-label');

  if (_pwaInstallTriggered) return;
  _pwaInstallTriggered = true;

  if (btn) { btn.style.transform = 'scale(0.97)'; btn.disabled = true; btn.style.opacity = '0.9'; }
  if (btnText) btnText.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Installing...';
  if (progressWrap) progressWrap.style.display = 'block';

  let pct = 0;
  const labels = ['Checking compatibility...', 'Downloading resources...', 'Setting up app...', 'Almost done...', 'Ready! 🎉'];
  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12 + 4, 95);
    if (progressBar) progressBar.style.width = pct + '%';
    const labelIdx = Math.min(Math.floor(pct / 25), labels.length - 1);
    if (progressLabel) progressLabel.textContent = labels[labelIdx];
    if (pct >= 95) clearInterval(interval);
  }, 220);

  if (window.deferredPrompt) {
    try {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      clearInterval(interval);
      if (outcome === 'accepted') {
        if (progressBar) progressBar.style.width = '100%';
        if (progressLabel) progressLabel.textContent = '✅ App installed successfully!';
        if (btnText) btnText.innerHTML = '✅ Installed! Use code APP10';
        if (btn) { btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)'; btn.style.opacity = '1'; }
        window.deferredPrompt = null;
        localStorage.setItem('ok_pwa_no', '1');
        setTimeout(() => {
          document.getElementById('ok-pwa-overlay')?.remove();
          // Button hata do kyunki ab install ho gaya
          document.getElementById('ok-get-app-btn')?.remove();
          showToast && showToast('🎉 App installed! Use APP10 for 10% off!');
        }, 1800);
      } else {
        clearInterval(interval);
        _resetInstallBtn();
      }
    } catch (e) {
      clearInterval(interval);
      _resetInstallBtn();
    }
  } else {
    clearInterval(interval);
    let fakePct = pct;
    const finishInterval = setInterval(() => {
      fakePct = Math.min(fakePct + 8, 100);
      if (progressBar) progressBar.style.width = fakePct + '%';
      if (fakePct >= 100) {
        clearInterval(finishInterval);
        if (progressLabel) progressLabel.textContent = '✅ App ready to use!';
        if (btnText) btnText.innerHTML = '✅ Installed!';
        if (btn) { btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)'; btn.style.opacity = '1'; }
        localStorage.setItem('ok_pwa_no', '1');
        setTimeout(() => {
          document.getElementById('ok-pwa-overlay')?.remove();
          document.getElementById('ok-get-app-btn')?.remove();
          showToast && showToast('📱 App ready! Use APP10 for 10% off!');
        }, 1600);
      }
    }, 150);
  }
};

function _resetInstallBtn() {
  _pwaInstallTriggered = false;
  const btn = document.getElementById('ok-pwa-install-btn');
  const btnText = document.getElementById('ok-pwa-btn-text');
  const progressWrap = document.getElementById('ok-pwa-progress-wrap');
  if (btn) { btn.disabled = false; btn.style.transform = ''; btn.style.opacity = '1'; }
  if (btnText) btnText.innerHTML = '<i class="fas fa-download" style="margin-right:8px;"></i>Install OutfitKart';
  if (progressWrap) progressWrap.style.display = 'none';
}

/* ═══════════════════════════════════════════════════════════════
   PART 8 — LEVEL BADGE (FIXED: robust multi-fallback selectors)
   ═══════════════════════════════════════════════════════════════ */
const LEVEL_DATA_V5 = [
  { name:'OutfitKart Starter',  minOrders:0,  color:'#CD7F32', emoji:'🛍️', perks:'COD + Free delivery on ₹500+',        nextAt:3  },
  { name:'OutfitKart Silver',   minOrders:3,  color:'#A8A8A8', emoji:'⭐', perks:'3% extra wallet cashback',             nextAt:8  },
  { name:'OutfitKart Gold',     minOrders:8,  color:'#C9A84C', emoji:'🥇', perks:'5% cashback + priority support',       nextAt:20 },
  { name:'OutfitKart Platinum', minOrders:20, color:'#7B2FBE', emoji:'💎', perks:'8% cashback + exclusive early access', nextAt:null },
];

function _getLvlV5(count) {
  let l = LEVEL_DATA_V5[0];
  LEVEL_DATA_V5.forEach(x => { if (count >= x.minOrders) l = x; });
  return l;
}

function _renderLevelBadge() {
  if (!window.currentUser) return;

  const orders = window.ordersDb || [];
  const count  = orders.filter(o => o.status !== 'Cancelled').length;
  const lvl    = _getLvlV5(count);
  const next   = LEVEL_DATA_V5.find(l => l.minOrders > count);
  const pct    = next
    ? Math.min(100, Math.round(((count - lvl.minOrders) / (next.minOrders - lvl.minOrders)) * 100))
    : 100;

  /* ── Dashboard pill ── */
  let topPill = document.getElementById('ok-dash-level-pill');

  if (!topPill) {
    const sidebarLevel = document.getElementById('ok-sidebar-level');
    if (sidebarLevel) {
      topPill = document.createElement('div');
      topPill.id = 'ok-dash-level-pill';
      sidebarLevel.replaceWith(topPill);
    }
  }

  if (!topPill) {
    const darkHeader =
      document.querySelector('#user-dashboard .p-5') ||
      document.querySelector('#user-dashboard .p-4') ||
      document.querySelector('#user-dashboard [class*="bg-gradient"]') ||
      document.querySelector('#user-dashboard > div > div:first-child');
    if (darkHeader) {
      topPill = document.createElement('div');
      topPill.id = 'ok-dash-level-pill';
      darkHeader.appendChild(topPill);
    }
  }

  if (!topPill) {
    const dash = document.getElementById('user-dashboard');
    if (dash) {
      topPill = document.createElement('div');
      topPill.id = 'ok-dash-level-pill';
      topPill.style.margin = '8px 16px 0';
      dash.insertBefore(topPill, dash.firstChild);
    }
  }

  if (topPill) {
    topPill.style.cssText = `display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,${lvl.color}30,${lvl.color}10);border:1.5px solid ${lvl.color}60;border-radius:99px;padding:5px 14px;margin-top:6px;`;
    topPill.innerHTML = `
      <span style="font-size:18px;">${lvl.emoji}</span>
      <div>
        <div style="font-size:11px;font-weight:900;color:${lvl.color};">${lvl.name}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.55);">${count} orders completed</div>
      </div>
    `;
  }

  /* ── Full card in Profile Info page ── */
  const infoPage = document.getElementById('profile-page-info');
  if (infoPage) {
    document.getElementById('ok-level-card-full')?.remove();

    const wrap =
      infoPage.querySelector('.max-w-lg.mx-auto.p-4.space-y-4') ||
      infoPage.querySelector('.max-w-lg.mx-auto.p-4')           ||
      infoPage.querySelector('.max-w-lg')                        ||
      infoPage.querySelector('.profile-page-body > div')         ||
      infoPage.querySelector('.profile-page-body');

    if (wrap) {
      const card = document.createElement('div');
      card.id = 'ok-level-card-full';
      card.style.cssText = 'margin-bottom:12px;';
      card.innerHTML = `
        <div id="ok-profile-level-card" style="
          border-radius:16px;padding:16px;
          background:linear-gradient(135deg,${lvl.color}15,${lvl.color}05);
          border:2px solid ${lvl.color}40;position:relative;overflow:hidden;
        ">
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
          <div style="height:8px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin:10px 0 6px;">
            <div style="height:100%;border-radius:99px;width:${pct}%;background:linear-gradient(90deg,${lvl.color},${lvl.color}cc);transition:width 0.8s cubic-bezier(0.4,0,0.2,1);"></div>
          </div>
          <div style="font-size:11px;color:#3b82f6;font-weight:700;text-align:right;margin-top:4px;">
            ${next ? `${next.minOrders - count} aur orders complete karo ${next.emoji} <strong>${next.name}</strong> ke liye` : '🎉 Maximum Level Achieved!'}
          </div>
        </div>
      `;
      wrap.insertBefore(card, wrap.firstChild);
    }
  }

  const statOrders = document.getElementById('stat-orders-count');
  if (statOrders) statOrders.textContent = count;
}

/* ═══════════════════════════════════════════════════════════════
   PART 9 — REFERRALS + CHANNELS ON PROFILE
   ═══════════════════════════════════════════════════════════════ */
function _fixReferralsPage() {
  const refPage = document.getElementById('profile-page-referrals');
  if (!refPage || refPage.dataset.megaPatched) return;
  refPage.dataset.megaPatched = '1';
  const body = refPage.querySelector('.profile-page-body');
  if (!body) return;
  document.getElementById('ok-ref-channel-box')?.remove();
  const channelBox = document.createElement('div');
  channelBox.id = 'ok-ref-channel-box';
  channelBox.innerHTML = `<div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🎁 Promo Codes Pao</div><p style="font-size:12px;color:rgba(255,255,255,0.75);margin:0 0 12px;line-height:1.6;">Hamare channels join karo — exclusive promo codes, flash sales &amp; early access!</p><div style="display:flex;gap:10px;"><a href="https://t.me/outfitkart" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:12px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);box-shadow:0 4px 12px rgba(0,136,204,0.4);"><i class="fab fa-telegram" style="font-size:16px;"></i> Join Telegram</a><a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:12px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);box-shadow:0 4px 12px rgba(37,211,102,0.4);"><i class="fab fa-whatsapp" style="font-size:16px;"></i> Join WhatsApp</a></div>`;
  body.insertBefore(channelBox, body.firstChild);
}

function _injectChannelsInProfile() {
  const profileHome = document.getElementById('profile-home');
  if (!profileHome || document.getElementById('ok-profile-channels')) return;
  const channelDiv = document.createElement('div');
  channelDiv.id = 'ok-profile-channels';
  channelDiv.style.cssText = 'margin: 0 16px 16px;';
  channelDiv.innerHTML = `<div style="background:linear-gradient(135deg,#0d0821,#1a0e00);border-radius:16px;padding:16px;"><div style="font-size:10px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:8px;">🔔 Exclusive Deals & Codes</div><p style="font-size:12px;color:rgba(255,255,255,0.7);margin:0 0 12px;line-height:1.5;">Hamare channels join karo — flash sales, promo codes &amp; early access pao!</p><div style="display:flex;gap:10px;"><a href="https://t.me/outfitkart" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#0088cc,#00b0f4);"><i class="fab fa-telegram"></i> Telegram</a><a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" rel="noopener" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:10px;text-decoration:none;font-weight:800;font-size:11px;color:white;background:linear-gradient(135deg,#25D366,#128C7E);"><i class="fab fa-whatsapp"></i> WhatsApp</a></div></div>`;
  const supportSection = profileHome.querySelectorAll('.bg-white.rounded-2xl.shadow-sm.border.overflow-hidden.mb-4')[2];
  if (supportSection) supportSection.insertAdjacentElement('beforebegin', channelDiv);
  else profileHome.appendChild(channelDiv);
}

/* ═══════════════════════════════════════════════════════════════
   PART 10 — FOOTER
   ═══════════════════════════════════════════════════════════════ */
function _renderFooter() {
  if (document.getElementById('ok-site-footer')) return;
  const main = document.getElementById('app-content');
  if (!main) return;
  const footer = document.createElement('div');
  footer.id = 'ok-site-footer';
  footer.innerHTML = `<span class="footer-brand">OutfitKart</span><p style="font-size:11px;color:#9ca3af;margin:0 0 8px;">Premium Fashion at Best Prices</p><div class="footer-links"><a href="#" onclick="openProfilePage('about');return false;">About Us</a><a href="#" onclick="openProfilePage('terms');return false;">Terms of Service</a><a href="#" onclick="openProfilePage('privacy');return false;">Privacy Policy</a><a href="#" onclick="openProfilePage('exchange-policy');return false;">Exchange Policy</a><a href="#" onclick="openWhatsAppSupport&&openWhatsAppSupport();return false;">Support</a></div><div style="display:flex;justify-content:center;gap:16px;margin:12px 0;"><a href="https://www.instagram.com/outfitkart_ecommers" target="_blank" style="color:#e1306c;font-size:20px;"><i class="fab fa-instagram"></i></a><a href="https://t.me/outfitkart" target="_blank" style="color:#0088cc;font-size:20px;"><i class="fab fa-telegram"></i></a><a href="https://whatsapp.com/channel/0029VbCiSs06GcGJpToxKd3z" target="_blank" style="color:#25D366;font-size:20px;"><i class="fab fa-whatsapp"></i></a></div><div class="footer-copy"><i class="far fa-copyright"></i> 2026 OutfitKart. All rights reserved.<br><span style="font-size:9px;">Made with ❤️ in India 🇮🇳</span></div>`;
  main.appendChild(footer);
}

/* ═══════════════════════════════════════════════════════════════
   PART 11 — POLICY PAGES
   ═══════════════════════════════════════════════════════════════ */
function _createPolicyPages() {
  const dash = document.getElementById('user-dashboard');
  if (!dash) return;

  if (!document.getElementById('profile-page-about')) {
    const div = document.createElement('div');
    div.id = 'profile-page-about';
    div.className = 'profile-page hidden';
    div.innerHTML = `<div class="profile-page-header"><button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button><h2>About Us</h2><div class="w-9"></div></div><div class="profile-page-body"><div class="ok-policy-section"><div style="text-align:center;padding:24px 0 12px;"><div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#e11d48,#be123c);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(225,29,72,0.3);"><i class="fas fa-shopping-bag" style="color:white;font-size:28px;"></i></div><h1 style="font-size:1.5rem;font-weight:900;background:linear-gradient(135deg,#C9A84C,#B8860B);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">OutfitKart</h1><p style="font-size:12px;color:#9ca3af;font-weight:600;letter-spacing:0.1em;">PREMIUM FASHION STORE</p></div><div class="info-box"><p style="font-weight:800;color:#1e40af;margin:0 0 4px;">🇮🇳 Proudly Made in India</p><p style="margin:0;font-size:12px;">OutfitKart is an Indian D2C fashion brand committed to making premium fashion accessible to everyone at the best prices.</p></div><h2>Our Story</h2><p>OutfitKart was founded with a simple yet powerful mission — to bring premium quality fashion to every corner of India at prices that don't break the bank. We believe that style should be accessible to everyone, regardless of their budget or location.</p><p>Born out of a passion for fashion and technology, OutfitKart started as a small curated collection of trending outfits for men and women. Today, we have grown into a full-fledged fashion destination offering thousands of styles across multiple categories including Men's wear, Women's wear, Perfumes, Accessories, and our exclusive premium line — OutfitKart Gold.</p><h2>Our Mission</h2><p>Our mission is to democratize fashion in India. We curate the best products from trusted suppliers across the country and present them to you at transparent, honest prices. No hidden charges, no inflated MRPs — just great fashion at fair prices.</p><p>We want every Indian to feel confident, stylish, and comfortable in what they wear, without having to compromise on quality or spend a fortune.</p><h2>What Makes Us Different</h2><h3>🎯 Curated Collections</h3><p>Every single product on OutfitKart is hand-picked by our style team. We don't just list products — we curate experiences. From casual wear to formal attire, streetwear to ethnic fusion, we have something for every occasion and every mood.</p><h3>💰 Unbeatable Prices</h3><p>We work directly with manufacturers and trusted suppliers to eliminate middlemen. This allows us to pass on significant savings to our customers. Our AI-powered pricing engine constantly monitors the market to ensure you always get the best deal.</p><h3>🚚 Cash on Delivery</h3><p>We understand that trust is everything in online shopping. That's why we offer Cash on Delivery (COD) across India. Try before you pay — we believe in earning your trust with every order.</p><h3>⭐ OutfitKart Gold</h3><p>Our premium line, OutfitKart Gold, offers luxury-quality fashion at accessible prices. These are specially curated pieces that go through an extra quality check and are designed for those who want to stand out from the crowd.</p><h3>🔄 Hassle-Free Exchange</h3><p>We want you to love what you buy. If for any reason you're not happy with the fit or style, our 7-day exchange policy makes it easy to swap for something you'll love.</p><h3>🎁 Referral Program</h3><p>We believe the best marketing is word of mouth. That's why we reward you for sharing OutfitKart with your friends and family. Earn 5% commission on every order made through your referral link.</p><h3>📱 OutfitKart App</h3><p>Our Progressive Web App (PWA) offers a native app-like experience on both Android and iOS. Install it from your browser in seconds — no app store needed. Get exclusive app-only deals and a smoother shopping experience.</p><h2>Our Values</h2><ul><li><strong>Transparency:</strong> Honest pricing, clear policies, no hidden fees.</li><li><strong>Quality:</strong> Every product is checked before it reaches you.</li><li><strong>Customer First:</strong> Your satisfaction is our top priority.</li><li><strong>Sustainability:</strong> Working towards eco-friendly packaging.</li><li><strong>Inclusivity:</strong> Fashion for all — all sizes, all styles, all budgets.</li><li><strong>Innovation:</strong> Constantly improving our platform with the latest technology.</li></ul><h2>Our Team</h2><p>OutfitKart is run by a passionate team of fashion enthusiasts, tech lovers, and customer service champions. Our founders, Shailesh Kumar Chauhan and Aman Kumar Chauhan, built OutfitKart from the ground up with a vision to create India's most loved fashion brand.</p><h2>Our Catalog</h2><p>We offer a wide range of products across multiple categories:</p><ul><li><strong>Men's Fashion:</strong> T-Shirts, Casual & Formal Shirts, Oversized Tees, Hoodies, Denim Jackets, Jeans, Trousers, Joggers, Cargo Pants, Footwear, and Full Combos.</li><li><strong>Women's Fashion:</strong> Sarees, Kurtis, Lehengas, Tops, Dresses, Palazzo, Jeans, Ethnic Sets, Western Combos, and Footwear.</li><li><strong>Perfumes:</strong> Men's, Women's, and Unisex fragrances, Attars, Body Mists, and Gift Sets.</li><li><strong>Accessories:</strong> Sunglasses, Watches, Wallets, Bags, Belts, Caps, Chains, Earrings, and Tech Accessories.</li><li><strong>OutfitKart Gold:</strong> Exclusive premium collection for those who demand the best.</li></ul><h2>Community & Social</h2><p>OutfitKart is more than just a store — it's a community. Join thousands of fashion lovers on our social media channels for daily inspiration, exclusive deals, styling tips, and more.</p><ul><li>📸 Instagram: @outfitkart_ecommers</li><li>📢 Telegram Channel: t.me/outfitkart</li><li>💬 WhatsApp Channel: Join for exclusive deals</li></ul><h2>Influencer Program</h2><p>Are you a content creator? Partner with OutfitKart and earn money doing what you love! Our Influencer Program pays ₹50 per 1,000 views on your OutfitKart content.</p><h2>OutfitKart Wallet</h2><p>Earn cashback, referral commissions, and influencer rewards directly in your OutfitKart Wallet. Use your wallet balance to pay for future orders or withdraw to your bank/UPI account (minimum withdrawal: ₹120).</p><h2>Contact Us</h2><ul><li>📧 Email: outfitkartpremiumfashion@gmail.com</li><li>📱 WhatsApp: +91 8982296773</li><li>⏰ Support Hours: 9 AM – 9 PM, Monday to Saturday</li></ul><div class="highlight-box" style="margin-top:20px;text-align:center;"><p style="font-weight:900;color:#14532d;font-size:14px;margin:0 0 4px;">Thank you for choosing OutfitKart!</p><p style="font-size:12px;color:#166534;margin:0;">Your trust is our biggest achievement. 🙏</p></div></div></div>`;
    dash.appendChild(div);
  }

  if (!document.getElementById('profile-page-terms')) {
    const div = document.createElement('div');
    div.id = 'profile-page-terms';
    div.className = 'profile-page hidden';
    div.innerHTML = `<div class="profile-page-header"><button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button><h2>Terms of Service</h2><div class="w-9"></div></div><div class="profile-page-body"><div class="ok-policy-section"><p style="font-size:11px;color:#9ca3af;margin-bottom:16px;">Last Updated: March 2026</p><div class="info-box"><p style="margin:0;font-size:12px;color:#1e40af;">By using OutfitKart, you agree to these Terms of Service.</p></div><h2>1. Acceptance of Terms</h2><p>By accessing or using the OutfitKart platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p><h2>2. Account Registration</h2><p>To access certain features, you must create an account using your mobile number and password. You are responsible for maintaining the confidentiality of your account credentials and must provide accurate information during registration.</p><h2>3. Ordering & Payments</h2><h3>3.1 Order Placement</h3><p>When you place an order, you are making an offer to purchase the product at the listed price. OutfitKart reserves the right to accept or reject any order.</p><h3>3.2 Pricing</h3><p>All prices are in Indian Rupees (₹) and include applicable taxes. Prices may change without notice; prices at confirmation are final.</p><h3>3.3 Payment Methods</h3><p>We accept UPI, Credit/Debit Cards (via Razorpay), Cash on Delivery (COD), and OutfitKart Wallet. COD incurs a ₹9 handling fee; all orders have a ₹7 platform fee.</p><h2>4. Shipping & Delivery</h2><p>Standard delivery takes 3-7 working days. Free delivery on orders above ₹500. OutfitKart is not responsible for delays caused by courier partners or natural disasters.</p><h2>5. Exchange Policy</h2><p>OutfitKart operates an EXCHANGE ONLY policy. No cash refunds on delivered products. Please see our full Exchange Policy for details.</p><h2>6. Referral Program</h2><p>Users earn 5% commission on purchases via their referral link, credited after 30 days. OutfitKart may cancel commissions from fraudulent referrals. Rates may change at any time.</p><h2>7. Wallet & Withdrawals</h2><p>Wallet balance earned via referrals, cashback, and influencer rewards. Minimum withdrawal ₹120, processed within 24-48 hours. Balance cannot be transferred to other users.</p><h2>8. Influencer Program</h2><p>Earn ₹50 per 1,000 verified views. Submissions reviewed within 7 working days. OutfitKart may reject submissions not meeting quality standards.</p><h2>9. Prohibited Activities</h2><ul><li>Creating fake accounts or placing fraudulent orders</li><li>Abusing the referral or cashback system</li><li>Submitting false influencer views</li><li>Attempting to hack or compromise our platform</li><li>Using our platform for any illegal activity</li></ul><h2>10. Intellectual Property</h2><p>All content on OutfitKart including logos, images, text, and design is the exclusive property of OutfitKart. Unauthorized reproduction is prohibited.</p><h2>11. Limitation of Liability</h2><p>OutfitKart's maximum liability is limited to the amount paid for the specific order in question.</p><h2>12. Governing Law</h2><p>These terms are governed by the laws of India. Disputes are subject to Indian courts.</p><h2>13. Contact</h2><p>outfitkartpremiumfashion@gmail.com | WhatsApp +91 8982296773</p><div class="warning-box"><p style="margin:0;font-size:12px;color:#991b1b;">OutfitKart operates an <strong>EXCHANGE ONLY</strong> policy. No cash refunds on delivered orders.</p></div></div></div>`;
    dash.appendChild(div);
  }

  if (!document.getElementById('profile-page-privacy')) {
    const div = document.createElement('div');
    div.id = 'profile-page-privacy';
    div.className = 'profile-page hidden';
    div.innerHTML = `<div class="profile-page-header"><button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button><h2>Privacy Policy</h2><div class="w-9"></div></div><div class="profile-page-body"><div class="ok-policy-section"><p style="font-size:11px;color:#9ca3af;margin-bottom:16px;">Last Updated: March 2026</p><div class="highlight-box"><p style="margin:0;font-size:12px;color:#14532d;">OutfitKart does not sell your personal data to third parties.</p></div><h2>1. Information We Collect</h2><h3>1.1 Personal Information</h3><p>When you create an account or place an order, we collect: full name, mobile number, email address (optional), delivery address, and UPI ID (for withdrawals only).</p><h3>1.2 Usage Data</h3><p>We automatically collect pages visited, products viewed, search queries, time spent on pages, and device/browser information to improve our platform.</p><h3>1.3 Payment Information</h3><p>OutfitKart does not store payment card details. All payments are processed by Razorpay (RBI-certified). We only receive a transaction confirmation and payment ID.</p><h3>1.4 Push Notifications</h3><p>If enabled, we store your device's push subscription token. You can disable notifications at any time.</p><h2>2. How We Use Your Data</h2><ul><li>Process and fulfill your orders</li><li>Send order updates and delivery confirmations</li><li>Personalize your experience with AI recommendations</li><li>Calculate and process referral commissions</li><li>Manage your OutfitKart Wallet</li><li>Send promotional messages (with consent)</li><li>Prevent fraud and ensure security</li></ul><h2>3. Data Sharing</h2><p>We share data only with: Supabase (database), Razorpay (payments), courier partners (delivery), and ImgBB (image hosting). We do NOT share data with advertisers or data brokers.</p><h2>4. Data Security</h2><p>We implement HTTPS encryption, Row Level Security on our database, and regular security audits. No method is 100% secure; we cannot guarantee absolute security.</p><h2>5. Your Rights</h2><ul><li>Access your personal data</li><li>Request correction of inaccurate data</li><li>Request deletion of your account</li><li>Opt out of promotional communications</li><li>Disable push notifications</li></ul><h2>6. Cookies & Local Storage</h2><p>We use browser localStorage to store cart, session data, and preferences. This stays on your device and is never transmitted to third parties.</p><h2>7. Children's Privacy</h2><p>OutfitKart is not intended for users under 13. We do not knowingly collect data from children.</p><h2>8. Contact</h2><p>outfitkartpremiumfashion@gmail.com | WhatsApp +91 8982296773</p></div></div>`;
    dash.appendChild(div);
  }

  if (!document.getElementById('profile-page-exchange-policy')) {
    const div = document.createElement('div');
    div.id = 'profile-page-exchange-policy';
    div.className = 'profile-page hidden';
    div.innerHTML = `<div class="profile-page-header"><button onclick="closeProfilePage()" class="back-btn"><i class="fas fa-arrow-left"></i></button><h2>Exchange Policy</h2><div class="w-9"></div></div><div class="profile-page-body"><div class="ok-policy-section"><div style="text-align:center;padding:20px 0 12px;"><div style="font-size:3rem;margin-bottom:8px;">🔄</div><h1 style="font-size:1.3rem;font-weight:900;color:#111827;margin:0;">EXCHANGE ONLY POLICY</h1><p style="font-size:12px;color:#e11d48;font-weight:700;margin:4px 0 0;">No cash refunds on delivered products</p></div><div class="warning-box"><p style="font-weight:800;color:#991b1b;margin:0 0 6px;">⚠️ Important Notice</p><p style="margin:0;font-size:12px;color:#7f1d1d;">OutfitKart operates an <strong>EXCHANGE ONLY</strong> policy for all delivered orders. Once a product is delivered, no cash refund is issued under any circumstances except manufacturing defects or wrong product delivery.</p></div><h2>Why Exchange Only?</h2><p>We operate on a lean D2C model that allows us to offer premium quality at unbeatable prices. A full refund model would significantly increase operational costs. Our exchange policy ensures you always get a product you love, while keeping prices low.</p><h2>Exchange Eligibility</h2><div class="highlight-box"><p style="font-weight:800;color:#14532d;margin:0 0 8px;">✅ You CAN exchange if:</p><ul style="margin:0;padding-left:16px;"><li style="color:#166534;font-size:13px;">Order status is "Delivered"</li><li style="color:#166534;font-size:13px;">Product is unused, unwashed, in original condition</li><li style="color:#166534;font-size:13px;">All tags and packaging are intact</li><li style="color:#166534;font-size:13px;">Request made within <strong>7 days</strong> of delivery</li></ul></div><div class="warning-box"><p style="font-weight:800;color:#991b1b;margin:0 0 8px;">❌ You CANNOT exchange if:</p><ul style="margin:0;padding-left:16px;"><li style="color:#7f1d1d;font-size:13px;">Product has been used, washed, or worn</li><li style="color:#7f1d1d;font-size:13px;">Tags have been removed</li><li style="color:#7f1d1d;font-size:13px;">More than 7 days since delivery</li><li style="color:#7f1d1d;font-size:13px;">Product is a Perfume (hygiene reasons)</li><li style="color:#7f1d1d;font-size:13px;">Damage due to customer misuse</li></ul></div><h2>How to Exchange</h2><ol><li><strong>Go to My Orders</strong> and find your delivered order.</li><li><strong>Click "Exchange"</strong> button on the order.</li><li><strong>Browse our catalog</strong> and choose your replacement product.</li><li><strong>Place the new order</strong> — old order's value applied as discount.</li><li><strong>Ship back</strong> the old product (customer bears shipping cost).</li><li><strong>New product ships</strong> within 2-3 days of receiving the return.</li></ol><h2>Price Difference</h2><p>If new product costs more: pay the difference. If new product costs less: difference added to OutfitKart Wallet (not refunded as cash). Same price: only platform fee (₹7) charged.</p><h2>Wrong Product / Manufacturing Defect</h2><p>We arrange pickup at our cost and send the correct product. Contact us within 48 hours of delivery with photos.</p><h2>COD Cancellations (Before Dispatch)</h2><p>No charges apply if cancelled before dispatch.</p><h2>UPI/Card Cancellations (Before Dispatch)</h2><p>Full refund to OutfitKart Wallet or original payment method within 5-7 business days.</p><h2>Contact</h2><ul><li>📱 WhatsApp: +91 8982296773</li><li>📧 Email: outfitkartpremiumfashion@gmail.com</li><li>⏰ Hours: 9 AM – 9 PM, Mon–Sat</li></ul><div class="info-box" style="margin-top:20px;"><p style="font-weight:800;color:#1e40af;margin:0 0 4px;">💡 Pro Tip</p><p style="margin:0;font-size:12px;color:#1e3a8a;">Always check the size chart before ordering. When in doubt, size up! 😄</p></div></div></div>`;
    dash.appendChild(div);
  }
}

/* ═══════════════════════════════════════════════════════════════
   PART 12 — PATCH openProfilePage
   ═══════════════════════════════════════════════════════════════ */
function _patchOpenProfilePageV5() {
  const orig = window.openProfilePage;
  if (!orig || window._profilePagePatchedV5) return;
  window._profilePagePatchedV5 = true;
  window.openProfilePage = function(page) {
    if (['about','terms','privacy','exchange-policy'].includes(page)) {
      document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
      const target = document.getElementById(`profile-page-${page}`);
      if (target) { target.classList.remove('hidden'); window.scrollTo(0, 0); }
      return;
    }
    orig(page);
    if (page === 'referrals') setTimeout(_fixReferralsPage, 150);
    if (page === 'info' || page === 'orders') setTimeout(_renderLevelBadge, 300);
    if (page === 'help') setTimeout(_addPolicyMenuItems, 100);
  };
}

function _addPolicyMenuItems() {
  const helpPage = document.getElementById('profile-page-help');
  if (!helpPage || document.getElementById('ok-policy-menu-added')) return;
  const body = helpPage.querySelector('.profile-page-body');
  if (!body) return;
  const menuDiv = document.createElement('div');
  menuDiv.id = 'ok-policy-menu-added';
  menuDiv.className = 'max-w-lg mx-auto px-4 pb-4';
  menuDiv.innerHTML = `<div class="bg-white rounded-2xl shadow-sm border overflow-hidden mb-3"><button onclick="openProfilePage('about')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all"><div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#FFF1F2;"><i class="fas fa-info-circle text-rose-500 text-sm"></i></div><div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">About OutfitKart</div><div class="text-xs text-gray-500">Our story & mission</div></div><i class="fas fa-chevron-right text-gray-300 text-xs"></i></button><button onclick="openProfilePage('terms')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all"><div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#EFF6FF;"><i class="fas fa-file-contract text-blue-500 text-sm"></i></div><div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Terms of Service</div><div class="text-xs text-gray-500">Rules & conditions</div></div><i class="fas fa-chevron-right text-gray-300 text-xs"></i></button><button onclick="openProfilePage('privacy')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 border-b hover:bg-gray-50 transition-all"><div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#F0FDF4;"><i class="fas fa-shield-alt text-green-500 text-sm"></i></div><div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Privacy Policy</div><div class="text-xs text-gray-500">How we use your data</div></div><i class="fas fa-chevron-right text-gray-300 text-xs"></i></button><button onclick="openProfilePage('exchange-policy')" class="profile-menu-item w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-all"><div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:#FFFBEB;"><i class="fas fa-exchange-alt text-amber-500 text-sm"></i></div><div class="flex-1 text-left"><div class="font-semibold text-sm text-gray-800">Exchange Policy</div><div class="text-xs text-gray-500">Exchange only — no returns</div></div><i class="fas fa-chevron-right text-gray-300 text-xs"></i></button></div>`;
  body.insertBefore(menuDiv, body.firstChild);
}

/* ═══════════════════════════════════════════════════════════════
   PART 13 — PATCH navigate
   ═══════════════════════════════════════════════════════════════ */
function _patchNavigateV5() {
  const origNav = window.navigate;
  if (!origNav || window._megaNavPatchedV5) return;
  window._megaNavPatchedV5 = true;
  window.navigate = function(view, cat) {
    origNav(view, cat);
    if (view === 'home') {
      setTimeout(() => {
        _renderHomePromoBanner();
        _renderTrustStrip();
        _renderShopByCategorySection();
        _renderUnbeatableSection();
        setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 600);
      }, 300);
    }
    if (view === 'profile') {
      setTimeout(() => { _renderLevelBadge(); _injectChannelsInProfile(); }, 500);
    }
  };
}

/* ═══════════════════════════════════════════════════════════════
   PART 14 — MUTATION OBSERVER
   ═══════════════════════════════════════════════════════════════ */
function _initObserverV5() {
  const obs = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type !== 'attributes' || m.attributeName !== 'class') return;
      const el = m.target;
      if (el.id === 'profile-page-referrals' && !el.classList.contains('hidden')) setTimeout(_fixReferralsPage, 100);
      if (el.id === 'user-dashboard' && !el.classList.contains('hidden')) setTimeout(() => { _renderLevelBadge(); _injectChannelsInProfile(); }, 300);
      if (el.id === 'profile-page-info' && !el.classList.contains('hidden')) setTimeout(_renderLevelBadge, 200);
      if (el.id === 'view-home' && !el.classList.contains('hidden')) {
        setTimeout(() => {
          _renderHomePromoBanner(); _renderTrustStrip(); _renderShopByCategorySection(); _renderUnbeatableSection();
          setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 800);
        }, 200);
      }
    });
  });
  obs.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });

  const trendingGrid = document.getElementById('trending-grid');
  if (trendingGrid) {
    new MutationObserver(() => setTimeout(() => { _injectSponsorInGrid(); _injectGoldInTrending(); }, 400))
      .observe(trendingGrid, { childList: true });
  }
}

/* ═══════════════════════════════════════════════════════════════
   PART 15 — SHARE BTN FIX
   ═══════════════════════════════════════════════════════════════ */
function _fixShareBtn() {
  const shareBtn = document.querySelector('.share-outfitkart-btn');
  if (!shareBtn) return;
  shareBtn.style.cssText += 'background:linear-gradient(135deg,#e11d48,#be123c)!important;color:white!important;';
  shareBtn.querySelectorAll('div').forEach(el => { if (!el.style.color || el.style.color !== 'rgba(255,255,255,0.75)') el.style.color = 'white'; });
}

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
function _initV5() {
  _patchNavigateV5();
  _patchOpenProfilePageV5();
  _injectGetAppButton();   // Fixed: checks PWA install status
  _renderFooter();
  _createPolicyPages();

  setTimeout(() => {
    _renderHomePromoBanner();
    _renderTrustStrip();
    _renderShopByCategorySection();
    _fixShareBtn();

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

  setTimeout(_renderLevelBadge, 1200);  // Fixed: robust fallback selectors

  const userDash = document.getElementById('user-dashboard');
  if (userDash && !userDash.classList.contains('hidden')) setTimeout(_injectChannelsInProfile, 400);

  const refPage = document.getElementById('profile-page-referrals');
  if (refPage && !refPage.classList.contains('hidden')) setTimeout(_fixReferralsPage, 200);

  setTimeout(_initObserverV5, 1000);

  console.log('%cOutfitKart MegaPatch v5.1 FINAL ✅ ALL FEATURES LOADED + FIXED', 'color:#C9A84C;font-weight:900;font-size:13px;background:#111827;padding:4px 8px;border-radius:4px;');
}

/* ── EXPORTS ─────────────────────────────────────────────── */
Object.assign(window, {
  _isPWAInstalled,
  _getSponsors, _saveSponsors,
  _renderLevelBadge,
  _fixReferralsPage,
  _renderUnbeatableSection,
  _renderShopByCategorySection,
  _renderTrustStrip,
  _renderHomePromoBanner,
  _injectSponsorInGrid,
  _injectGoldInTrending,
  _showPWAPopup,
  _triggerPWAInstall,
  _renderFooter,
  _createPolicyPages,
  _injectChannelsInProfile,
  _submitCancelWithReason,
  _submitExchangeWithReason,
  _adminConfirmWalletRefund,
  _adminSaveSupplierOrderId,
  _show7DayExpiredModal,
  _showCancelReasonModal,
  _showExchangeReasonModal,
  _daysSince,
  _inject7DayBadge,
});

/* ═══════════════════════════════════════════════════════════════
   PATCH A — CSS FILE NAME FIX (styles.css → style.css)
   ═══════════════════════════════════════════════════════════════ */
(function _fixCssPath() {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(l => {
    if (l.href && l.href.includes('styles.css') && !l.href.includes('style.css')) {
      const fixed = document.createElement('link');
      fixed.rel = 'stylesheet';
      fixed.href = l.href.replace('styles.css', 'style.css');
      document.head.appendChild(fixed);
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   PATCH B — BANNER CAROUSEL HEIGHT KAM KARO
   ═══════════════════════════════════════════════════════════════ */
(function _fixBannerHeight() {
  if (document.getElementById('ok-banner-height-fix')) return;
  const s = document.createElement('style');
  s.id = 'ok-banner-height-fix';
  s.textContent = `
    #banner-carousel { height: 220px !important; }
    @media (min-width: 640px)  { #banner-carousel { height: 260px !important; } }
    @media (min-width: 1024px) { #banner-carousel { height: 300px !important; } }
    #banner-carousel .pdp-img-slider img { height: 220px !important; }
  `;
  document.head.appendChild(s);
})();

/* ═══════════════════════════════════════════════════════════════
   PATCH C — PROFILE STATS FIX (Orders, Wallet, Referrals)
   4 hooks: checkAuthUI wrap, navigate wrap, MutationObserver, delayed polling
   ═══════════════════════════════════════════════════════════════ */
function _refreshProfileStats() {
  try {
    // User — multiple sources
    const user = window.currentUser || (function(){
      try { const s = localStorage.getItem('outfitkart_session'); return s ? JSON.parse(s) : null; } catch(e) { return null; }
    })();
    if (!user) return;

    // Orders count
    const orders = window.ordersDb || [];
    const orderCount = orders.filter(o => o.status !== 'Cancelled').length;
    const elOrders = document.getElementById('stat-orders-count');
    if (elOrders) elOrders.textContent = orderCount;

    // Wallet
    const wallet = (user.wallet != null) ? user.wallet : (window.walletBalance || 0);
    const elWallet = document.getElementById('stat-wallet-bal');
    if (elWallet) { elWallet.textContent = '₹' + wallet; elWallet.style.color = '#2563eb'; }
    const profWallet = document.getElementById('prof-wallet');
    if (profWallet) profWallet.textContent = '₹' + wallet;
    const menuWalletBadge = document.getElementById('menu-wallet-badge');
    if (menuWalletBadge) { menuWalletBadge.textContent = '₹' + wallet; if (wallet > 0) menuWalletBadge.classList.remove('hidden'); }
    const checkoutWallet = document.getElementById('checkout-wallet-balance');
    if (checkoutWallet) checkoutWallet.textContent = '₹' + wallet;

    // Referrals — try referralsDb array first
    let refEarnings = 0;
    if (window.referralsDb && window.referralsDb.length) {
      refEarnings = window.referralsDb.filter(r => r.status === 'confirmed').reduce((s,r) => s+(r.commission||0), 0);
    } else {
      refEarnings = user.referral_earnings || 0;
    }
    const elRef = document.getElementById('stat-referral-earn');
    if (elRef) { elRef.textContent = '₹' + refEarnings; elRef.style.color = '#16a34a'; }
    const refBadge = document.getElementById('referral-earnings-badge');
    if (refBadge) refBadge.textContent = '₹' + refEarnings;

  } catch(e) { console.warn('[Stats]', e); }
}
window._refreshProfileStats = _refreshProfileStats;

// Hook 1: checkAuthUI — _gateSuccess isko call karta hai login/signup ke baad
// setInterval se wait karo kyunki script-core baad mein load hota hai
(function() {
  const _wait = setInterval(function() {
    if (typeof window.checkAuthUI !== 'function') return;
    clearInterval(_wait);
    if (window._statsCheckAuthPatched) return;
    window._statsCheckAuthPatched = true;
    const _orig = window.checkAuthUI;
    window.checkAuthUI = async function() {
      const r = await _orig.apply(this, arguments);
      setTimeout(_refreshProfileStats, 400);
      setTimeout(_refreshProfileStats, 1000);
      setTimeout(_refreshProfileStats, 2500);
      return r;
    };
  }, 120);
})();

// Hook 2: navigate('profile') pe refresh
(function() {
  const _wait = setInterval(function() {
    if (typeof window.navigate !== 'function') return;
    clearInterval(_wait);
    if (window._statsNavPatched) return;
    window._statsNavPatched = true;
    const _orig = window.navigate;
    window.navigate = function(view) {
      _orig.apply(this, arguments);
      if (view === 'profile') {
        setTimeout(_refreshProfileStats, 300);
        setTimeout(_refreshProfileStats, 900);
      }
    };
  }, 150);
})();

// Hook 3: user-dashboard visible hone pe MutationObserver
(function() {
  function _attachObserver() {
    const dash = document.getElementById('user-dashboard');
    if (!dash || dash._statsObsAttached) return;
    dash._statsObsAttached = true;
    new MutationObserver(function() {
      if (!dash.classList.contains('hidden')) {
        setTimeout(_refreshProfileStats, 200);
        setTimeout(_refreshProfileStats, 800);
      }
    }).observe(dash, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function() { setTimeout(_attachObserver, 600); });
  else setTimeout(_attachObserver, 600);
})();

// Hook 4: Delayed polling after page load
setTimeout(_refreshProfileStats, 1500);
setTimeout(_refreshProfileStats, 3500);
setTimeout(_refreshProfileStats, 7000);



/* ═══════════════════════════════════════════════════════════════
   PATCH E — AI VOICE WELCOME (Indian Girl Voice)
   Strategy: localStorage.setItem hook — _gateSuccess yahin session save karta hai
   ═══════════════════════════════════════════════════════════════ */
(function _setupVoiceWelcome() {
  if (window._voiceWelcomeReady) return;
  window._voiceWelcomeReady = true;

  function _speakWelcome(userName, isNew) {
    try {
      if (!window.speechSynthesis) return;
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const msg = isNew
        ? 'Welcome to Outfit Kart, ' + userName + '! We are so happy to have you here. Explore our amazing fashion collection!'
        : 'Welcome back to Outfit Kart, ' + userName + '! Great to see you again. Happy shopping!';

      function _doSpeak() {
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = 'en-IN';
        utterance.rate = 0.90;
        utterance.pitch = 1.3;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        let chosen = null;

        // Preference order for Indian female voice
        const tests = [
          function(v) { return v.lang === 'en-IN' && /female|woman|girl/i.test(v.name); },
          function(v) { return v.lang === 'en-IN' && /raveena|neerja|heera|priya|aditi/i.test(v.name); },
          function(v) { return v.lang === 'en-IN'; },
          function(v) { return v.lang.startsWith('en') && /female|woman|samantha|victoria|karen|moira|susan|zira/i.test(v.name); },
          function(v) { return v.lang.startsWith('en-GB'); },
          function(v) { return v.lang.startsWith('en'); },
        ];

        for (var i = 0; i < tests.length; i++) {
          chosen = voices.find(tests[i]);
          if (chosen) break;
        }
        if (chosen) utterance.voice = chosen;

        // Chrome bug: speech sometimes stops mid-sentence — resume trick
        utterance.onstart = function() {
          var resumeTimer = setInterval(function() {
            if (!window.speechSynthesis.speaking) { clearInterval(resumeTimer); return; }
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }, 10000);
          utterance.onend = function() { clearInterval(resumeTimer); };
        };

        window.speechSynthesis.speak(utterance);
      }

      // Voices load hoti hain asynchronously — dono cases handle karo
      if (window.speechSynthesis.getVoices().length > 0) {
        _doSpeak();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', function _onVoices() {
          window.speechSynthesis.removeEventListener('voiceschanged', _onVoices);
          _doSpeak();
        });
        setTimeout(_doSpeak, 500); // hard fallback
      }
    } catch(e) { console.warn('[Voice]', e); }
  }

  window._speakWelcome = _speakWelcome;

  // ── HOOK: localStorage.setItem intercept ──
  // _gateSuccess mein: localStorage.setItem('outfitkart_session', JSON.stringify(user))
  // Yahi single reliable trigger point hai
  var _origSetItem = localStorage.setItem.bind(localStorage);
  var _prevSessionMobile = (function() {
    try { var s = localStorage.getItem('outfitkart_session'); return s ? JSON.parse(s).mobile : null; } catch(e) { return null; }
  })();

  localStorage.setItem = function(key, value) {
    _origSetItem(key, value);
    if (key === 'outfitkart_session') {
      try {
        var curr = JSON.parse(value);
        if (curr && curr.mobile && curr.mobile !== _prevSessionMobile) {
          var isNew = !_prevSessionMobile;
          _prevSessionMobile = curr.mobile;
          // 1.5s delay — curtain animation finish hone do pehle
          setTimeout(function() {
            _speakWelcome(curr.name || 'Friend', isNew);
          }, 1500);
        }
      } catch(e) {}
    }
  };
})();

/* ═══════════════════════════════════════════════════════════════
   PATCH F — LEVEL BADGE in Profile Dashboard (main card pe)
   ═══════════════════════════════════════════════════════════════ */
// Already handled in PART 8, but ensure it runs after ordersDb loads
(function _patchLevelAfterOrders() {
  const _origLoadOrders = window.loadUserOrders || window.loadOrders;
  if (_origLoadOrders && !window._levelOrderPatched) {
    window._levelOrderPatched = true;
    const funcName = window.loadUserOrders ? 'loadUserOrders' : 'loadOrders';
    const orig = window[funcName];
    window[funcName] = async function(...args) {
      const result = await orig(...args);
      setTimeout(() => { _renderLevelBadge(); _refreshProfileStats(); }, 300);
      return result;
    };
  }
})();

/* BOOT */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(_initV5, 500));
} else {
  setTimeout(_initV5, 500);
}
