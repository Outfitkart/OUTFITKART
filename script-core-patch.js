'use strict';
/* ============================================================
   SCRIPT-CORE PATCH — OutfitKart
   Changes applied:
   1. openProfilePage() + closeProfilePage() — updated with stat refresh
   2. checkAuthUI() — stats update (orders count, wallet bal, referral earnings)
   3. switchProfileTab() — delegates to openProfilePage()
   4. closeSuccessAndGoToOrders() — calls openProfilePage('orders')
   5. applyPromoCode() — product-specific validation
   6. loadProductPromos() — product page pe product-specific promos
   7. openProductPage() — loads product promos
   8. adminCreatePromoCode() — admin mein product ID ke saath promo support
   ============================================================ */

/* ============================================================
   CHANGE 1 & 3: openProfilePage / closeProfilePage / switchProfileTab
   ============================================================ */
function openProfilePage(page) {
    document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`profile-page-${page}`);
    if (!target) return;
    target.classList.remove('hidden');

    // Load data for each page
    if (page === 'orders') {
        fetchUserData().then(() => renderOrdersList());
    }
    if (page === 'wallet') {
        fetchUserData().then(() => {
            const el = document.getElementById('prof-wallet');
            if (el) el.textContent = `₹${currentUser?.wallet || 0}`;
            loadWalletTransactions();
        });
    }
    if (page === 'wishlist') renderWishlist();
    if (page === 'referrals') {
        loadReferrals();
    }
    if (page === 'influencer') loadInfluencerRequests();
    if (page === 'info') {
        setTimeout(() => {
            _fillProfileGender();
            loadUserReferralCode();
            const profNameEl = document.getElementById('prof-name');
            const profEmailEl = document.getElementById('prof-email');
            const profAddrEl = document.getElementById('prof-address');
            if (profNameEl && currentUser) profNameEl.value = currentUser.name || '';
            if (profEmailEl && currentUser) profEmailEl.value = currentUser.email || '';
            if (profAddrEl && currentUser) profAddrEl.value = currentUser.address || '';
            // Sync avatar on profile info page
            const img2 = document.getElementById('prof-avatar-img2');
            if (img2 && currentUser?.profile_pic) img2.src = currentUser.profile_pic;
        }, 60);
    }
    window.scrollTo(0, 0);
}

function closeProfilePage() {
    document.querySelectorAll('.profile-page').forEach(p => p.classList.add('hidden'));
}

// switchProfileTab now delegates to openProfilePage for profile pages
function switchProfileTab(tabId, btnEl) {
    // Legacy tab system (hidden divs with .profile-tab class)
    document.querySelectorAll('.profile-tab').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');
    if (btnEl) btnEl.classList.add('active');

    // Also open the new profile page system
    const pageMap = {
        orders: 'orders',
        wallet: 'wallet',
        wishlist: 'wishlist',
        referrals: 'referrals',
        influencer: 'influencer',
        info: 'info',
        security: 'security',
        help: 'help',
    };
    if (pageMap[tabId]) openProfilePage(pageMap[tabId]);
}

/* ============================================================
   CHANGE 2: checkAuthUI — stats update kare
   ============================================================ */
async function checkAuthUI() {
    const authForms = document.getElementById('auth-forms');
    const userDash = document.getElementById('user-dashboard');
    const navText = document.getElementById('nav-profile-text');

    if (currentUser) {
        authForms?.classList.add('hidden');
        userDash?.classList.remove('hidden');

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (!el) return;
            (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') ? el.value = val : el.innerText = val;
        };

        set('user-greeting', currentUser.name || 'User');
        set('user-mobile-display', `+91 ${currentUser.mobile}`);
        set('prof-name', currentUser.name || '');
        set('prof-email', currentUser.email || '');
        set('prof-address', currentUser.address || '');
        set('prof-wallet', `₹${currentUser.wallet || 0}`);

        const avatar = document.getElementById('user-avatar-img');
        if (avatar) avatar.src = currentUser.profile_pic || `https://placehold.co/100x100/e11d48/ffffff?text=${(currentUser.name || 'U').charAt(0).toUpperCase()}`;

        if (navText) navText.innerText = (currentUser.name || 'User').split(' ')[0];

        updateHeaderWallet(currentUser.wallet || 0);
        loadUserReferralCode();
        renderSidebarReferralWidget();

        // ── STATS UPDATE (Change 2) ──
        await _refreshProfileStats();

        setTimeout(checkNotifStatus, 500);
        setTimeout(() => {
            _injectGenderProfile();
            _fillProfileGender();
            _injectSidebarLevel();
            _injectReferralInstructions();
            _updateUserLevel();
        }, 300);
    } else {
        authForms?.classList.remove('hidden');
        userDash?.classList.add('hidden');
        if (navText) navText.innerText = i18n('login');
        updateHeaderWallet(0);
    }
    setTimeout(updateHeaderProfilePhoto, 100);
}

// Helper: refresh all 3 stats (orders, wallet, referral earnings)
async function _refreshProfileStats() {
    if (!currentUser) return;
    try {
        // Orders count
        const { data: oData } = await dbClient.from('orders').select('id,status').eq('mobile', currentUser.mobile);
        ordersDb = oData || [];
        const orderCount = ordersDb.filter(o => o.status !== 'Cancelled').length;
        const statOrders = document.getElementById('stat-orders-count');
        if (statOrders) statOrders.textContent = orderCount;

        // Wallet balance (fresh from DB)
        const { data: uData } = await dbClient.from('users').select('wallet').eq('mobile', currentUser.mobile).maybeSingle();
        const walBal = uData?.wallet || 0;
        walletBalance = walBal;
        currentUser.wallet = walBal;
        localStorage.setItem('outfitkart_session', JSON.stringify(currentUser));
        updateHeaderWallet(walBal);
        const statWallet = document.getElementById('stat-wallet-bal');
        if (statWallet) statWallet.textContent = `₹${walBal}`;
        const profWallet = document.getElementById('prof-wallet');
        if (profWallet) profWallet.textContent = `₹${walBal}`;
        const menuWalletBadge = document.getElementById('menu-wallet-badge');
        if (menuWalletBadge) {
            menuWalletBadge.textContent = `₹${walBal}`;
            menuWalletBadge.classList.toggle('hidden', walBal === 0);
        }

        // Referral earnings (pending + confirmed)
        const { data: refData } = await dbClient.from('referrals').select('commission,status').eq('referrer_mobile', currentUser.mobile);
        const refs = refData || [];
        const totalRefEarnings = refs
            .filter(r => r.status === 'pending' || r.status === 'confirmed')
            .reduce((s, r) => s + (r.commission || 0), 0);
        const statRef = document.getElementById('stat-referral-earn');
        if (statRef) statRef.textContent = `₹${totalRefEarnings}`;
        const refBadge = document.getElementById('referral-earnings-badge');
        if (refBadge) refBadge.textContent = `₹${totalRefEarnings}`;

        // Wishlist count badge
        updateWishlistCount();
        const wishlistMenuCount = document.getElementById('wishlist-menu-count');
        if (wishlistMenuCount) {
            wishlistMenuCount.textContent = wishlist.length;
            wishlistMenuCount.classList.toggle('hidden', wishlist.length === 0);
        }

    } catch (e) {
        console.warn('[Stats] Could not refresh:', e.message);
    }
}

/* ============================================================
   CHANGE 4: closeSuccessAndGoToOrders
   ============================================================ */
function closeSuccessAndGoToOrders() {
    closeSuccessModal();
    navigate('profile');
    setTimeout(() => openProfilePage('orders'), 200);
}

/* ============================================================
   CHANGE 5 & 8: applyPromoCode — product-specific validation
   ============================================================ */
async function applyPromoCode(codeVal, targetProductId) {
    const code = (codeVal || document.getElementById('promo-code-input')?.value || '').trim().toUpperCase();
    if (!code) return showToast('Promo code enter karo');

    try {
        const { data, error } = await dbClient
            .from('promo_codes')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .maybeSingle();

        if (error) throw error;
        if (!data) { showToast('❌ Invalid promo code!'); return false; }
        if (new Date(data.expires_at) < new Date()) { showToast('❌ Promo code expired!'); return false; }
        if (data.used_count >= data.max_uses) { showToast('❌ Promo code limit reached!'); return false; }

        // ── Product-specific check (Change 5) ──
        const promoProductId = data.product_id || null;
        if (promoProductId) {
            // This promo is product-specific
            const currentPid = targetProductId || viewingProductId;
            if (!currentPid) {
                showToast('❌ Yeh promo code sirf ek specific product ke liye hai');
                return false;
            }
            if (String(promoProductId) !== String(currentPid)) {
                const promoProduct = products.find(p => String(p.id) === String(promoProductId))
                    || goldProducts.find(p => String(p.id) === String(promoProductId));
                const pname = promoProduct?.name || `Product #${promoProductId}`;
                showToast(`❌ Yeh promo sirf "${pname}" ke liye valid hai`);
                return false;
            }
        }

        // Minimum order check
        if (data.min_order > 0) {
            const cartTotal = currentCheckoutItems.reduce((t, i) => t + (i.price * i.qty), 0);
            if (cartTotal < data.min_order) {
                showToast(`❌ Minimum order ₹${data.min_order} chahiye. Aapka: ₹${cartTotal}`);
                return false;
            }
        }

        activePromoCode = data;
        promoDiscount = data.discount;
        showToast(`🎉 Promo applied! ₹${data.discount} discount!`);
        updateCheckoutTotals();

        const promoArea = document.getElementById('promo-section-container');
        if (promoArea) promoArea.innerHTML = _promoAppliedHtml();
        return true;

    } catch (err) {
        showToast('Error: ' + err.message);
        return false;
    }
}

/* ============================================================
   CHANGE 6: loadProductPromos — product page pe promos dikhao
   ============================================================ */
async function loadProductPromos(productId) {
    const section = document.getElementById('pdp-promo-section');
    const listEl = document.getElementById('pdp-promo-codes-list');
    if (!section || !listEl) return;

    try {
        const now = new Date().toISOString();
        // Fetch product-specific promos
        const { data, error } = await dbClient
            .from('promo_codes')
            .select('*')
            .eq('is_active', true)
            .eq('product_id', String(productId))
            .gt('expires_at', now);

        if (error) throw error;

        if (!data || data.length === 0) {
            section.classList.add('hidden');
            return;
        }

        section.classList.remove('hidden');
        listEl.innerHTML = data.map(promo => {
            const expiresAt = new Date(promo.expires_at);
            const diff = expiresAt - new Date();
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;

            return `<div class="flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-3">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="fas fa-tag text-rose-500 text-sm"></i>
                    </div>
                    <div>
                        <div class="font-black text-sm text-rose-700 tracking-widest" style="letter-spacing:0.12em;">${promo.code}</div>
                        <div class="text-xs text-gray-500">₹${promo.discount} off • Expires in ⏳ ${timeStr}</div>
                    </div>
                </div>
                <button onclick="copyAndApplyPromo('${promo.code}', ${productId})"
                    class="text-xs font-black bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap">
                    Apply
                </button>
            </div>`;
        }).join('');

    } catch (e) {
        section.classList.add('hidden');
    }
}

// Helper: copy promo code and navigate to checkout with it pre-applied
function copyAndApplyPromo(code, productId) {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast(`📋 Code copied: ${code} — Checkout mein paste karo!`);
    // Pre-fill the promo input if user goes to checkout
    window._pendingPromoCode = code;
    window._pendingPromoProductId = productId;
}

/* ============================================================
   CHANGE 7: openProductPage — loads product promos
   ============================================================ */
async function openProductPage(id, isGoldProduct = false) {
    let p = products.find(x => x.id === id);
    if (!p) p = goldProducts.find(x => x.id === id);
    if (!p) return;

    viewingProductId = p.id;
    addToRecentlyViewed(id);

    const isPerf = isPerfumeCategory(p.category);
    const sizeArray = isPerf
        ? (p.available_sizes?.length ? p.available_sizes : PERFUME_ML_SIZES)
        : (p.available_sizes?.length ? p.available_sizes : getDefaultSizes(p.sub || p.category));
    const isCombo = COMBO_SUBS.has(p.sub || '');
    selectedComboParts = null;
    selectedSize = sizeArray[1] || sizeArray[0];

    if (isCombo) {
        const groups = getComboSizeGroups(sizeArray);
        selectedComboParts = {};
        if (groups.topwear.length) selectedComboParts.topwear = groups.topwear[0];
        if (groups.bottomwear.length) selectedComboParts.bottomwear = groups.bottomwear[0];
        if (groups.footwear.length) selectedComboParts.footwear = groups.footwear[0];
        if (groups.watch.length) selectedComboParts.watch = groups.watch[0];
        _composeComboSizeLabel();
    }

    const imgList = p.imgs?.length ? p.imgs : (p.img ? [p.img] : ['https://placehold.co/600x420/eee/333?text=No+Image']);
    const sizeLabel = isPerf ? i18n('volume_select') : i18n('size_select');
    const isGold = p.is_gold || isGoldProduct || false;
    const desc = p.description || p.desc || 'Premium quality product.';

    let sliderHtml;
    if (imgList.length === 1) {
        sliderHtml = `<div class="rounded-lg overflow-hidden border shadow-sm"><img src="${imgList[0]}" class="w-full h-[420px] object-cover" alt="${p.name}"></div>`;
    } else {
        sliderHtml = `<div><div class="pdp-img-slider hide-scrollbar" id="pdp-slider-${id}">${imgList.map((src, i) => `<img src="${src}" alt="${p.name} ${i + 1}" data-index="${i}">`).join('')}</div><div class="pdp-thumb-strip mt-2" id="pdp-thumbs-${id}">${imgList.map((src, i) => `<img src="${src}" alt="thumb ${i + 1}" class="pdp-thumb ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="pdpScrollToSlide(${i})">`).join('')}</div></div>`;
    }

    document.getElementById('pdp-container').innerHTML = `${sliderHtml}
    <div class="flex flex-col justify-center">
        <div class="text-xs font-bold uppercase mb-1" style="color:${isGold ? '#B8860B' : '#e11d48'}">${isGold ? '⭐ Gold · ' : ''}${p.category}${p.sub ? ' › ' + getSubDisplayName(p.sub) : ''}</div>
        ${p.stock_qty ? `<div class="text-xs text-green-600 font-semibold mb-2">📦 ${i18n('in_stock')}: ${p.stock_qty}</div>` : ''}
        <div class="flex justify-between items-start mb-2">
            <h1 class="text-3xl font-black text-gray-800">${p.name}</h1>
            <div class="flex gap-2">
                <button onclick="shareWithReferral(${p.id},'${p.name.replace(/'/g, "\\'")}',${p.price})" class="bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"><i class="fas fa-share-alt"></i></button>
                <button onclick="nativeShareProduct(${p.id},'${p.name.replace(/'/g, "\\'")}',${p.price})" class="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"><i class="fas fa-link"></i></button>
            </div>
        </div>
        <div class="flex items-baseline gap-3 mb-4">
            <span class="text-3xl font-bold">₹${p.price}</span>
            ${p.oldprice ? `<span class="text-lg line-through font-semibold" style="color:#C8102E;opacity:0.72">₹${p.oldprice}</span>` : ''}
        </div>
        <p class="text-gray-600 text-sm mb-6">${desc}</p>
        <div class="mb-6">
            <div class="font-bold text-sm mb-2">${sizeLabel}</div>
            ${isPerf ? `<div>
                <div class="flex flex-wrap gap-2 mb-3" id="size-selector">${sizeArray.map(s => `<button onclick="selectSize('${s}')" class="size-btn ${s === selectedSize ? 'selected' : ''} w-fit px-4 py-1.5 rounded-full border-2 font-bold text-sm transition-colors">${s}</button>`).join('')}</div>
                <div class="flex items-center border-2 border-purple-200 rounded-xl overflow-hidden focus-within:border-purple-500 bg-white max-w-[220px]">
                    <span class="bg-purple-100 px-3 py-2.5 text-purple-700 font-black text-sm border-r border-purple-200 whitespace-nowrap">ml</span>
                    <input type="number" id="pdp-custom-ml" placeholder="e.g. 45" min="1" max="2000" class="flex-1 px-3 py-2.5 text-sm font-bold outline-none" style="font-size:16px;" oninput="if(this.value&&!isNaN(this.value)){selectSize(this.value+'ml');document.querySelectorAll('#size-selector .size-btn').forEach(b=>b.classList.remove('selected'));}">
                </div>
            </div>` : `${isCombo ? (()=>{
                const groups = getComboSizeGroups(sizeArray);
                const groupOrder = [['topwear','Topwear'],['bottomwear','Bottomwear'],['footwear','Footwear'],['watch','Watch']];
                const chunks = groupOrder.filter(([k]) => groups[k]?.length).map(([k, label]) =>
                    `<div class="mb-3"><div class="text-xs font-bold text-gray-500 mb-1">${label}</div><div class="flex flex-wrap gap-2" id="combo-size-${k}">${groups[k].map(s => `<button onclick="selectComboPartSize('${k}','${s}')" class="size-btn ${selectedComboParts && selectedComboParts[k] === s ? 'selected' : ''} w-fit px-4 py-2 min-w-[3rem] rounded-full border border-gray-300 font-bold transition-colors">${s}</button>`).join('')}</div></div>`
                );
                if (chunks.length) return chunks.join('');
                return `<div class="flex flex-wrap gap-3" id="size-selector">${sizeArray.map(s => `<button onclick="selectSize('${s}')" class="size-btn ${s === selectedSize ? 'selected' : ''} w-fit px-4 py-2 min-w-[3rem] rounded-full border border-gray-300 font-bold transition-colors">${s}</button>`).join('')}</div>`;
            })() : `<div class="flex flex-wrap gap-3" id="size-selector">${sizeArray.map(s => `<button onclick="selectSize('${s}')" class="size-btn ${s === selectedSize ? 'selected' : ''} w-fit px-4 py-2 min-w-[3rem] rounded-full border border-gray-300 font-bold transition-colors">${s}</button>`).join('')}</div>`}`}
        </div>
        <div class="grid grid-cols-2 gap-3 mt-auto">
            <button onclick="addToCartPDP()" class="border-2 border-gray-800 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-50 active:scale-95 transition-all">${i18n('add_to_cart')}</button>
            <button onclick="buyNowPDP()" class="bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 active:scale-95 transition-all shadow-md">${i18n('buy_now')}</button>
        </div>
    </div>`;

    navigate('product');

    // Inject safe delivery button
    requestAnimationFrame(() => setTimeout(_injectSafeDeliveryButton, 80));

    if (imgList.length > 1) {
        requestAnimationFrame(() => {
            const slider = document.getElementById(`pdp-slider-${id}`);
            if (slider) slider.addEventListener('scroll', () => {
                const idx = Math.round(slider.scrollLeft / slider.offsetWidth);
                updatePdpActiveThumbnail(id, idx);
            }, { passive: true });
        });
    }

    // ── CHANGE 7: Load product promos ──
    await loadProductPromos(p.id);

    // Pre-apply pending promo if matches this product
    if (window._pendingPromoCode && window._pendingPromoProductId === p.id) {
        const promoInput = document.getElementById('promo-code-input');
        if (promoInput) promoInput.value = window._pendingPromoCode;
        window._pendingPromoCode = null;
        window._pendingPromoProductId = null;
    }

    await loadReviews(p.id);
    renderRecommendedProducts(p.category, p.id);
}

/* ============================================================
   CHANGE 8: adminCreatePromoCode — product ID support
   Already called from admin HTML, this replaces/augments createPromoCode()
   ============================================================ */
async function adminCreatePromoCode() {
    // Read from admin promo form (works for both inline form in HTML + tab form)
    const codeEl = document.getElementById('new-promo-code');
    const discEl = document.getElementById('new-promo-discount');
    const minEl = document.getElementById('new-promo-min');
    const maxUsesEl = document.getElementById('new-promo-maxuses');
    const expiresEl = document.getElementById('new-promo-expires');
    const productIdEl = document.getElementById('new-promo-product-id');

    const code = (codeEl?.value || '').trim().toUpperCase();
    const discount = parseInt(discEl?.value) || 0;
    const minOrder = parseInt(minEl?.value) || 0;
    const maxUses = parseInt(maxUsesEl?.value) || 100;
    const expiresDate = expiresEl?.value;
    const productId = (productIdEl?.value || '').trim() || null;

    if (!code) return showToast('Promo code enter karo');
    if (!discount || discount < 1) return showToast('Discount amount enter karo (minimum ₹1)');
    if (!expiresDate) return showToast('Expiry date select karo');
    if (!/^[A-Z0-9]+$/.test(code)) return showToast('Code sirf letters aur numbers use karo (no spaces/symbols)');

    const expiresAt = new Date(expiresDate + 'T23:59:59').toISOString();

    const payload = {
        code,
        discount,
        type: 'flat',
        min_order: minOrder,
        max_uses: maxUses,
        used_count: 0,
        expires_at: expiresAt,
        is_active: true,
        created_by: localStorage.getItem('outfitkart_admin_mobile') || 'admin',
    };

    // ── Product-specific promo (Change 8) ──
    if (productId) {
        // Validate product exists
        const prod = products.find(p => String(p.id) === String(productId))
            || goldProducts.find(p => String(p.id) === String(productId));
        if (!prod) {
            const confirmAnyway = confirm(`Product ID "${productId}" products mein nahi mila. Phir bhi create karein?`);
            if (!confirmAnyway) return;
        }
        payload.product_id = productId;
    }

    try {
        const { error } = await dbClient.from('promo_codes').insert([payload]);
        if (error) throw error;

        showToast(`✅ Promo "${code}" created!${productId ? ` (Product #${productId} ke liye)` : ' (Sab products ke liye)'}`);

        // Clear form fields
        [codeEl, discEl, productIdEl].forEach(el => { if (el) el.value = ''; });
        if (minEl) minEl.value = '';
        if (maxUsesEl) maxUsesEl.value = '100';
        if (expiresEl) expiresEl.value = '';

        // Reload promo list if tab is active
        if (typeof loadAdminPromoCodes === 'function') loadAdminPromoCodes();

    } catch (err) {
        const isDuplicate = err.message.includes('duplicate') || err.message.includes('unique');
        showToast('❌ ' + err.message + (isDuplicate ? '\n(Code already exists — alag naam try karo)' : ''));
    }
}

/* ============================================================
   PROMO HELPERS (kept in sync)
   ============================================================ */
function removePromoCode() {
    activePromoCode = null;
    promoDiscount = 0;
    const promoArea = document.getElementById('promo-section-container');
    if (promoArea) promoArea.innerHTML = _promoInputHtml();
    showToast('Promo code removed');
    updateCheckoutTotals();
}

async function _incrementPromoUsage() {
    if (!activePromoCode) return;
    try {
        await dbClient.from('promo_codes')
            .update({ used_count: (activePromoCode.used_count || 0) + 1 })
            .eq('code', activePromoCode.code);
    } catch { }
}

function _promoInputHtml() {
    return `<div class="flex gap-2">
        <input type="text" id="promo-code-input" placeholder="Enter promo code" class="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-bold uppercase focus:ring-2 focus:ring-rose-400 outline-none" style="letter-spacing:0.06em;">
        <button onclick="applyPromoCode()" class="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap">Apply</button>
    </div>
    <div class="flex gap-2 mt-2">
        <a href="${TELEGRAM_CHANNEL}" target="_blank" rel="noopener" class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white active:scale-95" style="background:linear-gradient(135deg,#0088cc,#00b0f4)"><i class="fab fa-telegram text-sm"></i> Get Code on Telegram</a>
        <a href="${WHATSAPP_CHANNEL}" target="_blank" rel="noopener" class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white active:scale-95" style="background:linear-gradient(135deg,#25D366,#128C7E)"><i class="fab fa-whatsapp text-sm"></i> Get Code on WhatsApp</a>
    </div>`;
}

function _promoAppliedHtml() {
    if (!activePromoCode) return _promoInputHtml();
    const isProductSpecific = activePromoCode.product_id;
    return `<div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><i class="fas fa-tag text-green-600 text-xs"></i></div>
            <div>
                <div class="font-black text-sm text-green-800 tracking-wider">${activePromoCode.code}</div>
                <div class="text-xs text-green-600">₹${promoDiscount} discount applied! 🎉${isProductSpecific ? ' <span class="text-purple-600">(Product-specific)</span>' : ''}</div>
            </div>
        </div>
        <button onclick="removePromoCode()" class="text-red-500 text-xs font-bold hover:text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg"><i class="fas fa-times mr-1"></i>Remove</button>
    </div>`;
}

/* ============================================================
   AUTO-APPLY PROMO if pending (called after checkout loads)
   ============================================================ */
function _checkPendingPromo() {
    if (window._pendingPromoCode && currentCheckoutItems.length > 0) {
        const promoInput = document.getElementById('promo-code-input');
        if (promoInput) {
            promoInput.value = window._pendingPromoCode;
            showToast(`💡 Promo code "${window._pendingPromoCode}" ready — Apply dabao!`);
        }
    }
}

/* ============================================================
   EXPORTS — all changed functions
   ============================================================ */
Object.assign(window, {
    openProfilePage,
    closeProfilePage,
    switchProfileTab,
    checkAuthUI,
    _refreshProfileStats,
    closeSuccessAndGoToOrders,
    applyPromoCode,
    removePromoCode,
    loadProductPromos,
    copyAndApplyPromo,
    openProductPage,
    adminCreatePromoCode,
    _incrementPromoUsage,
    _promoInputHtml,
    _promoAppliedHtml,
    _checkPendingPromo,
});
