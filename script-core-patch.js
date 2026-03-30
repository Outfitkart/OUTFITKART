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
