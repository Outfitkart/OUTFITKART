'use strict';
/* ============================================================
   script-fixes.js — OutfitKart Enhancement Pack v2.0
   ──────────────────────────────────────────────────────────
   index.html me script-admin.js ke BAAD add karo:
   <script src="script-fixes.js"></script>
   ──────────────────────────────────────────────────────────
   1.  SPA Back / Forward Button
   2.  Referral System — Complete Robust Fix
   3.  Gender Selection (Signup + Profile)
   4.  Search → Full Product Grid (same card layout)
   5.  Smart AI-style Product Recommendations
   6.  User Level / Tier System (Bronze→Silver→Gold→Platinum)
   7.  Promotional Popup Ad (video-style rotating)
   8.  Subcategory Strip on Home Page
   9.  Referral Instructions UI
   10. Auto gender fill on profile
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   UTIL — safely wait for a global function to exist
   ──────────────────────────────────────────────────────────── */
function _waitFor(name, cb, ms, limit) {
    ms    = ms    || 400;
    limit = limit || 30;
    var n = 0;
    var t = setInterval(function () {
        if (window[name] || ++n >= limit) {
            clearInterval(t);
            if (window[name]) cb();
        }
    }, ms);
}

/* ════════════════════════════════════════════════════════════
   1.  SPA BACK / FORWARD BUTTON
   ════════════════════════════════════════════════════════════ */
_waitFor('navigate', function () {
    var _orig = window.navigate;
    try { history.replaceState({ view: 'home', cat: null }, ''); } catch (e) {}

    window.navigate = function (view, cat) {
        if (view !== 'admin') {
            try { history.pushState({ view: view, cat: cat || null }, ''); } catch (e) {}
        }
        return _orig.call(this, view, cat);
    };

    window.addEventListener('popstate', function (e) {
        var s = e.state || {};
        _orig.call(window, s.view || 'home', s.cat || null);
    });

    console.log('[Fix] SPA back-button active');
});


/* ════════════════════════════════════════════════════════════
   2.  REFERRAL SYSTEM — COMPLETE ROBUST FIX
   ════════════════════════════════════════════════════════════ */

/* Triple-layer storage so code survives page navigations */
window._getRef = function () {
    return window.activeReferralCode ||
           localStorage.getItem('outfitkart_active_referral') ||
           sessionStorage.getItem('ok_ref_bk') ||
           null;
};

window._saveRef = function (code) {
    window.activeReferralCode = code;
    localStorage.setItem('outfitkart_active_referral', code);
    sessionStorage.setItem('ok_ref_bk', code);
};

window._clearRef = function () {
    window.activeReferralCode = null;
    localStorage.removeItem('outfitkart_active_referral');
    sessionStorage.removeItem('ok_ref_bk');
};

/* Override captureReferralFromUrl */
window.captureReferralFromUrl = function () {
    var params = new URLSearchParams(window.location.search);
    var ref    = params.get('ref');
    if (ref && ref.length >= 3) {
        window._saveRef(ref.toUpperCase());
        console.log('[Ref] URL se capture kiya:', ref.toUpperCase());
    } else {
        var stored = window._getRef();
        if (stored) window.activeReferralCode = stored;
    }
};

/* Override recordReferralPurchase — THE MAIN FIX */
window.recordReferralPurchase = async function (orderId, orderTotal) {
    /* Always re-read from storage — variable resets on SPA nav */
    var code = window._getRef();
    var user = window.currentUser;

    if (!code || !user) {
        console.log('[Ref] Skip — code ya user nahi mila');
        return;
    }

    var myCode = (user.referral_code || '').toUpperCase();
    if (code === myCode) {
        console.log('[Ref] Self-referral block kiya');
        window._clearRef();
        return;
    }

    try {
        /* Step 1 — referrer dhundho */
        var findRes = await dbClient
            .from('users')
            .select('mobile, name, wallet')
            .eq('referral_code', code)
            .maybeSingle();

        var referrer = findRes.data;
        var re       = findRes.error;

        if (re)        { console.error('[Ref] DB error:', re.message); return; }
        if (!referrer) { console.warn('[Ref] Referrer nahi mila code ke liye:', code); window._clearRef(); return; }
        if (referrer.mobile === user.mobile) { window._clearRef(); return; }

        var commission = Math.max(1, Math.round(orderTotal * 0.05));

        /* Step 2 — exact schema se match karo (getReferralTableSQL columns) */
        var row = {
            referrer_mobile: referrer.mobile,
            buyer_mobile:    user.mobile,
            order_id:        String(orderId),
            order_total:     orderTotal,
            commission:      commission,
            status:          'pending',
            date:            new Date().toLocaleDateString('en-IN'),
            referral_code:   code
        };

        console.log('[Ref] Insert ho raha hai ->', row);

        var insRes = await dbClient.from('referrals').insert([row]).select().single();
        var ie     = insRes.error;

        if (ie) {
            /* Fallback — kuch schemas mein extra columns hote hain */
            var legacyRow = Object.assign({}, row, {
                commission_amount: commission,
                pending_profit:    commission
            });
            var insRes2 = await dbClient.from('referrals').insert([legacyRow]);
            var ie2     = insRes2.error;

            if (ie2) {
                console.error('[Ref] Insert dono baar fail:', ie2.message);
                console.info('[Ref] Supabase SQL Editor mein run karo: window.getReferralTableSQL()');
                if (typeof showToast === 'function')
                    showToast('Referral table missing — admin SQL run karo');
                return;
            }
        }

        console.log('[Ref] Referral saved! Commission Rs.' + commission + ' for ' + referrer.mobile);
        if (typeof showToast === 'function')
            showToast('Referral track hua! Rs.' + commission + ' referrer ke liye pending hai');
        window._clearRef();

    } catch (ex) {
        console.error('[Ref] Exception:', ex.message);
    }
};

/* Override cancelReferralForOrder */
window.cancelReferralForOrder = async function (orderId) {
    if (!orderId) return;
    try {
        await dbClient
            .from('referrals')
            .update({ status: 'cancelled' })
            .eq('order_id', String(orderId))
            .eq('status', 'pending');
    } catch (e) {}
};

/* Auto-confirm referrals older than 30 days */
async function _autoConfirmReferrals() {
    if (!window.currentUser) return;
    try {
        var res = await dbClient
            .from('referrals')
            .select('*')
            .eq('referrer_mobile', window.currentUser.mobile)
            .eq('status', 'pending');
        var rows = res.data || [];
        var now  = Date.now();
        for (var i = 0; i < rows.length; i++) {
            var ref = rows[i];
            var ts  = ref.created_at
                ? new Date(ref.created_at).getTime()
                : ref.date
                    ? new Date(ref.date.split('/').reverse().join('-')).getTime()
                    : 0;
            if (ts && (now - ts) >= 30 * 24 * 3600 * 1000) {
                await dbClient.from('referrals')
                    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
                    .eq('id', ref.id);
                var comm   = ref.commission || 0;
                var uRes   = await dbClient.from('users').select('wallet')
                    .eq('mobile', ref.referrer_mobile).maybeSingle();
                var uData  = uRes.data;
                if (uData) {
                    await dbClient.from('users')
                        .update({ wallet: (uData.wallet || 0) + comm })
                        .eq('mobile', ref.referrer_mobile);
                }
            }
        }
    } catch (e) {}
}


/* ════════════════════════════════════════════════════════════
   3.  GENDER SELECTION — SIGNUP + PROFILE
   ════════════════════════════════════════════════════════════ */

function _injectGenderSignup() {
    var form = document.getElementById('form-signup');
    if (!form || document.getElementById('ok-gender-grp')) return;

    var wrap = document.createElement('div');
    wrap.id  = 'ok-gender-grp';
    wrap.innerHTML = [
        '<div>',
        '  <p style="font-size:12px;font-weight:700;color:#374151;margin-bottom:8px;">',
        '    Main hoon <span style="color:#e11d48">*</span>',
        '  </p>',
        '  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">',
        '    <label class="ok-g-chip" data-val="male" onclick="window._pickGender(\'male\',this)"',
        '      style="display:flex;flex-direction:column;align-items:center;gap:6px;',
        '             padding:12px 6px;border:2px solid #e5e7eb;border-radius:14px;',
        '             cursor:pointer;font-size:11px;font-weight:700;color:#6b7280;',
        '             transition:all 0.2s;user-select:none;text-align:center;">',
        '      <span style="font-size:26px;">&#x1F454;</span>Male',
        '    </label>',
        '    <label class="ok-g-chip" data-val="female" onclick="window._pickGender(\'female\',this)"',
        '      style="display:flex;flex-direction:column;align-items:center;gap:6px;',
        '             padding:12px 6px;border:2px solid #e5e7eb;border-radius:14px;',
        '             cursor:pointer;font-size:11px;font-weight:700;color:#6b7280;',
        '             transition:all 0.2s;user-select:none;text-align:center;">',
        '      <span style="font-size:26px;">&#x1F457;</span>Female',
        '    </label>',
        '    <label class="ok-g-chip" data-val="other" onclick="window._pickGender(\'other\',this)"',
        '      style="display:flex;flex-direction:column;align-items:center;gap:6px;',
        '             padding:12px 6px;border:2px solid #e5e7eb;border-radius:14px;',
        '             cursor:pointer;font-size:11px;font-weight:700;color:#6b7280;',
        '             transition:all 0.2s;user-select:none;text-align:center;">',
        '      <span style="font-size:26px;">&#x2728;</span>Other',
        '    </label>',
        '  </div>',
        '  <input type="hidden" id="ok-gender-val" value="">',
        '</div>'
    ].join('');

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.insertAdjacentElement('beforebegin', wrap);
}

function _injectGenderProfile() {
    var space = document.querySelector('#tab-info .space-y-4.max-w-md');
    if (!space || document.getElementById('prof-gender')) return;

    var div = document.createElement('div');
    div.innerHTML = [
        '<div>',
        '  <label style="font-size:11px;color:#9ca3af;">Gender</label>',
        '  <select id="prof-gender"',
        '    style="width:100%;border:1px solid #d1d5db;padding:8px;border-radius:8px;',
        '           margin-top:4px;font-size:14px;outline:none;background:white;">',
        '    <option value="">Gender chuniye</option>',
        '    <option value="male">&#x1F454; Male</option>',
        '    <option value="female">&#x1F457; Female</option>',
        '    <option value="other">&#x2728; Other / Prefer not to say</option>',
        '  </select>',
        '</div>'
    ].join('');

    var emailDiv = space.querySelector('div:nth-child(2)');
    if (emailDiv) emailDiv.insertAdjacentElement('afterend', div);
    else space.appendChild(div);
}

window._pickGender = function (val, el) {
    document.querySelectorAll('.ok-g-chip').forEach(function (c) {
        c.style.borderColor = '';
        c.style.background  = '';
        c.style.color       = '';
    });
    el.style.borderColor = '#e11d48';
    el.style.background  = '#fff1f2';
    el.style.color       = '#e11d48';
    var inp = document.getElementById('ok-gender-val');
    if (inp) inp.value = val;
};

function _fillProfileGender() {
    var sel = document.getElementById('prof-gender');
    if (sel && window.currentUser && window.currentUser.gender)
        sel.value = window.currentUser.gender;
}

/* Patch handleSignup to include gender */
_waitFor('handleSignup', function () {
    window.handleSignup = async function (e) {
        e.preventDefault();
        var mobile = (document.getElementById('signup-mobile') ? document.getElementById('signup-mobile').value : '').trim();
        var name   = (document.getElementById('signup-name')   ? document.getElementById('signup-name').value   : '').trim();
        var pass   =  document.getElementById('signup-password') ? document.getElementById('signup-password').value : '';
        var email  = (document.getElementById('signup-email')  ? document.getElementById('signup-email').value  : '').trim();
        var gender =  document.getElementById('ok-gender-val') ? document.getElementById('ok-gender-val').value : null;

        if (mobile.length !== 10) return showToast('Valid 10-digit mobile enter karo');
        if (!name)                return showToast('Apna naam daalo');

        try {
            var exRes = await dbClient.from('users').select('mobile').eq('mobile', mobile).maybeSingle();
            if (exRes.data) return showToast('Mobile already registered! Login karo');

            var refCode = generateReferralCode(name, mobile);
            var insRes  = await dbClient.from('users').insert([{
                mobile: mobile, name: name, email: email, password: pass,
                wallet: 0, referral_code: refCode,
                gender: gender || null, level: 'Bronze', total_orders: 0
            }]).select().single();

            if (insRes.error) throw insRes.error;

            window.currentUser = insRes.data;
            localStorage.setItem('outfitkart_session', JSON.stringify(insRes.data));
            e.target.reset();

            document.querySelectorAll('.ok-g-chip').forEach(function (c) {
                c.style.borderColor = c.style.background = c.style.color = '';
            });
            var gv = document.getElementById('ok-gender-val');
            if (gv) gv.value = '';

            showToast('Welcome ' + name + '! Account ban gaya!');
            await fetchUserData();
            if (typeof migrateLocalCartToDB === 'function') await migrateLocalCartToDB();
            checkAuthUI();
            if (window._updateUserLevel) window._updateUserLevel();

        } catch (err) { showToast('Error: ' + (err.message || 'Try again')); }
    };
});

/* Patch saveProfile to save gender */
_waitFor('saveProfile', function () {
    window.saveProfile = async function () {
        if (!window.currentUser) return;
        var gender = document.getElementById('prof-gender') ? document.getElementById('prof-gender').value : null;
        try {
            var updates = {
                name    : document.getElementById('prof-name')    ? document.getElementById('prof-name').value    : '',
                email   : document.getElementById('prof-email')   ? document.getElementById('prof-email').value   : '',
                address : document.getElementById('prof-address') ? document.getElementById('prof-address').value : '',
                gender  : gender || null
            };
            var res = await dbClient.from('users').update(updates)
                .eq('mobile', window.currentUser.mobile).select().single();
            if (res.error) throw res.error;
            window.currentUser = res.data;
            localStorage.setItem('outfitkart_session', JSON.stringify(res.data));
            showToast('Profile Updated!');
            checkAuthUI();
        } catch (err) { showToast('Error: ' + err.message); }
    };
});


/* ════════════════════════════════════════════════════════════
   4.  SEARCH → FULL PRODUCT GRID
   ════════════════════════════════════════════════════════════ */

function _ensureSearchView() {
    if (document.getElementById('view-search')) return;
    var div = document.createElement('div');
    div.id        = 'view-search';
    div.className = 'view-section hidden';
    div.innerHTML = [
        '<div style="position:sticky;top:64px;z-index:30;background:white;',
        '     border-bottom:1px solid #f3f4f6;padding:12px 16px;',
        '     display:flex;align-items:center;gap:12px;">',
        '  <button onclick="navigate(\'home\')"',
        '    style="width:36px;height:36px;border-radius:50%;background:#f3f4f6;',
        '           border:none;cursor:pointer;display:flex;align-items:center;',
        '           justify-content:center;">',
        '    <i class="fas fa-arrow-left" style="color:#374151;font-size:13px;"></i>',
        '  </button>',
        '  <h2 id="search-results-title"',
        '    style="font-weight:900;font-size:1.1rem;color:#111827;flex:1;overflow:hidden;',
        '           white-space:nowrap;text-overflow:ellipsis;">Search Results</h2>',
        '</div>',
        '<div class="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"',
        '     id="search-results-grid"></div>'
    ].join('');
    var main = document.getElementById('app-content');
    if (main) main.appendChild(div);
}

/* Override handleSearch — keep dropdown + populate grid */
_waitFor('handleSearch', function () {
    var _origSearch = window.handleSearch;
    window.handleSearch = function (q) {
        _origSearch.call(this, q);

        var trimmed = (q || '').trim().toLowerCase();
        if (trimmed.length < 2) return;

        _ensureSearchView();
        var grid  = document.getElementById('search-results-grid');
        var title = document.getElementById('search-results-title');
        if (!grid || !title) return;

        var all  = (window.products || []).concat(window.goldProducts || []);
        var hits = all.filter(function (p) {
            return (p.name || '').toLowerCase().indexOf(trimmed) !== -1 ||
                   (p.brand || '').toLowerCase().indexOf(trimmed) !== -1 ||
                   (p.category || '').toLowerCase().indexOf(trimmed) !== -1 ||
                   (p.sub || '').toLowerCase().indexOf(trimmed) !== -1;
        });

        title.textContent = hits.length
            ? '"' + q.trim() + '" — ' + hits.length + ' results'
            : '"' + q.trim() + '" ke liye koi product nahi mila';

        if (!hits.length) {
            grid.innerHTML = [
                '<div class="col-span-full" style="text-align:center;padding:60px 0;">',
                '  <i class="fas fa-search" style="font-size:3rem;color:#d1d5db;"></i>',
                '  <p style="font-size:1.1rem;font-weight:700;color:#9ca3af;margin-top:16px;">',
                '    Koi product nahi mila',
                '  </p>',
                '  <p style="font-size:13px;color:#d1d5db;margin-top:4px;">Dusra keyword try karo</p>',
                '</div>'
            ].join('');
        } else {
            grid.innerHTML = hits.map(function (p) { return createProductCard(p); }).join('');
        }
    };

    /* Bind Enter key */
    _bindSearchEnter();
});

function _bindSearchEnter() {
    ['mobile-search', 'desktop-search'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el || el.dataset.gridBound) return;
        el.dataset.gridBound = '1';
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && el.value.trim().length >= 2) {
                ['desktop-search-results', 'mobile-search-results'].forEach(function (rid) {
                    var r = document.getElementById(rid);
                    if (r) r.classList.add('hidden');
                });
                window.handleSearch(el.value);
                document.querySelectorAll('.view-section').forEach(function (v) {
                    v.classList.add('hidden');
                });
                _ensureSearchView();
                var sv = document.getElementById('view-search');
                if (sv) sv.classList.remove('hidden');
                window.currentView = 'search';
                if (typeof updateBottomNav === 'function') updateBottomNav();
                window.scrollTo(0, 0);
                e.preventDefault();
            }
        });
    });
}


/* ════════════════════════════════════════════════════════════
   5.  SMART AI-STYLE PRODUCT RECOMMENDATIONS
   ════════════════════════════════════════════════════════════ */

function _scoreProducts(ctx, candidates) {
    if (!ctx || !candidates || !candidates.length) return candidates || [];

    var rv        = JSON.parse(localStorage.getItem('outfitkart_rv') || '[]');
    var priceLow  = ctx.price * 0.6;
    var priceHigh = ctx.price * 1.5;
    var gender    = window.currentUser ? window.currentUser.gender : null;

    var scored = candidates
        .filter(function (p) { return p.id !== ctx.id; })
        .map(function (p) {
            var s = 0;
            if (p.category === ctx.category) s += 40;
            if (p.sub      === ctx.sub)      s += 30;
            if (p.price >= priceLow && p.price <= priceHigh) s += 15;
            if (p.istrending)                s += 10;
            if (p.brand && p.brand === ctx.brand) s += 20;
            if (rv.indexOf(p.id) !== -1)     s += 8;
            if (gender === 'male'   && p.category === 'Men')   s += 5;
            if (gender === 'female' && p.category === 'Women') s += 5;
            if (p.oldprice && p.price < p.oldprice)            s += 5;
            p._score = s;
            return p;
        });

    scored.sort(function (a, b) { return b._score - a._score; });
    scored.forEach(function (p) { delete p._score; });
    return scored;
}

/* Override renderRecommendedProducts with scored version */
_waitFor('renderRecommendedProducts', function () {
    window.renderRecommendedProducts = function (category, excludeId) {
        var section = document.getElementById('recommended-section');
        var gridEl  = document.getElementById('recommended-products-grid');
        var allProd = (window.products || []).concat(window.goldProducts || []);

        var ctx = allProd.find(function (p) { return p.id === excludeId; });
        var pool = allProd.filter(function (p) {
            return p.id !== excludeId && p.category === category;
        });

        if (pool.length < 4) {
            pool = allProd.filter(function (p) { return p.id !== excludeId; });
        }

        var recs = _scoreProducts(ctx, pool).slice(0, 8);

        if (!recs.length) {
            if (section) section.style.display = 'none';
            return;
        }
        if (section) section.style.display = '';
        if (gridEl) gridEl.innerHTML = recs.map(function (p) { return createProductCard(p); }).join('');
    };
});

/* AI Recommendation strip on Home page */
function _renderHomeAIStrip() {
    var home = document.getElementById('view-home');
    if (!home) return;
    if (document.getElementById('ok-ai-strip')) {
        document.getElementById('ok-ai-strip').remove();
    }

    var rv  = JSON.parse(localStorage.getItem('outfitkart_rv') || '[]');
    var all = (window.products || []).concat(window.goldProducts || []);
    var recs = [];

    if (rv.length) {
        var lastViewed = null;
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === rv[0]) { lastViewed = all[i]; break; }
        }
        if (lastViewed) recs = _scoreProducts(lastViewed, all).slice(0, 6);
    }

    if (recs.length < 4) {
        recs = (window.products || []).filter(function (p) { return p.istrending; }).slice(0, 6);
    }
    if (!recs.length) return;

    var strip = document.createElement('div');
    strip.id        = 'ok-ai-strip';
    strip.className = 'mt-4 bg-white p-4';
    strip.innerHTML = [
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">',
        '  <h3 style="font-weight:900;font-size:1.1rem;color:#111827;">',
        '    Sirf Aapke Liye',
        '    <span style="font-size:0.75rem;font-weight:400;color:#9ca3af;margin-left:6px;">AI Picks</span>',
        '  </h3>',
        '  <button onclick="navigate(\'shop\')"',
        '    style="font-size:11px;font-weight:700;color:#e11d48;border:1px solid #fecdd3;',
        '           padding:4px 12px;border-radius:9999px;background:white;cursor:pointer;">',
        '    View All &rarr;',
        '  </button>',
        '</div>',
        '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">',
        recs.map(function (p) { return createProductCard(p); }).join(''),
        '</div>'
    ].join('');

    var trending = home.querySelector('.mt-4.bg-white.p-4');
    if (trending) trending.insertAdjacentElement('beforebegin', strip);
    else home.appendChild(strip);
}


/* ════════════════════════════════════════════════════════════
   6.  USER LEVEL / TIER SYSTEM
   ════════════════════════════════════════════════════════════ */
var USER_LEVELS = [
    { name: 'Bronze',   minOrders: 0,  color: '#CD7F32', emoji: '&#x1F949;', perks: 'COD + Free delivery' },
    { name: 'Silver',   minOrders: 3,  color: '#A8A8A8', emoji: '&#x1F948;', perks: '3% extra wallet cashback' },
    { name: 'Gold',     minOrders: 8,  color: '#C9A84C', emoji: '&#x1F947;', perks: '5% cashback + priority support' },
    { name: 'Platinum', minOrders: 20, color: '#7B2FBE', emoji: '&#x1F48E;', perks: '8% cashback + exclusive deals' }
];

function _getLevelFor(orderCount) {
    var lvl = USER_LEVELS[0];
    USER_LEVELS.forEach(function (l) {
        if (orderCount >= l.minOrders) lvl = l;
    });
    return lvl;
}

window._updateUserLevel = async function () {
    if (!window.currentUser) return;
    var count = (window.ordersDb || []).filter(function (o) {
        return o.status !== 'Cancelled';
    }).length;
    var lvl = _getLevelFor(count);

    if (window.currentUser.level !== lvl.name) {
        try {
            await dbClient.from('users')
                .update({ level: lvl.name, total_orders: count })
                .eq('mobile', window.currentUser.mobile);
            window.currentUser.level        = lvl.name;
            window.currentUser.total_orders = count;
            localStorage.setItem('outfitkart_session', JSON.stringify(window.currentUser));
        } catch (e) {}
    }

    _renderLevelBadge(lvl, count);
    _injectSidebarLevel();
};

function _renderLevelBadge(lvl, count) {
    var profInfo = document.getElementById('tab-info');
    if (!profInfo) return;

    var badge = document.getElementById('ok-level-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'ok-level-badge';
        profInfo.appendChild(badge);
    }

    var nextLvl = null;
    USER_LEVELS.forEach(function (l) {
        if (!nextLvl && l.minOrders > count) nextLvl = l;
    });

    var needed = nextLvl ? nextLvl.minOrders - count : 0;
    var pct    = nextLvl
        ? Math.min(100, Math.round(((count - lvl.minOrders) / (nextLvl.minOrders - lvl.minOrders)) * 100))
        : 100;

    badge.style.cssText = 'margin-top:20px;padding:16px;border-radius:16px;border:2px solid ' +
        lvl.color + ';background:' + lvl.color + '10;';

    badge.innerHTML = [
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">',
        '  <div style="font-size:2rem;">' + lvl.emoji + '</div>',
        '  <div style="flex:1;">',
        '    <h4 style="font-weight:900;font-size:14px;color:' + lvl.color + ';margin:0;">' + lvl.name + ' Member</h4>',
        '    <p style="font-size:11px;color:#6b7280;margin:2px 0 0;">' + lvl.perks + '</p>',
        '  </div>',
        '  <div style="font-size:11px;color:#9ca3af;font-weight:700;">' + count + ' orders</div>',
        '</div>',
        '<div style="width:100%;background:#e5e7eb;border-radius:9999px;height:8px;margin-bottom:6px;">',
        '  <div style="width:' + pct + '%;height:8px;border-radius:9999px;',
        '       background:' + lvl.color + ';transition:width 0.7s;"></div>',
        '</div>',
        '<p style="font-size:10px;color:#9ca3af;font-weight:600;text-align:right;">',
        nextLvl
            ? (needed + ' aur orders for ' + nextLvl.emoji + ' ' + nextLvl.name)
            : 'Max Level!',
        '</p>'
    ].join('');
}

function _injectSidebarLevel() {
    var sidebar = document.querySelector(
        '#user-dashboard .bg-white.rounded-lg.shadow-sm.border.overflow-hidden'
    );
    if (!sidebar || !window.currentUser) return;

    var existing = document.getElementById('ok-sidebar-level');
    if (existing) existing.remove();

    var count = (window.ordersDb || []).filter(function (o) {
        return o.status !== 'Cancelled';
    }).length;
    var lvl = _getLevelFor(count);

    var div = document.createElement('div');
    div.id  = 'ok-sidebar-level';
    div.style.cssText = 'padding:8px 12px;border-bottom:1px solid #f3f4f6;' +
        'display:flex;align-items:center;gap:8px;' +
        'background:linear-gradient(135deg,' + lvl.color + '20,' + lvl.color + '05);';
    div.innerHTML = [
        '<span style="font-size:1.3rem;">' + lvl.emoji + '</span>',
        '<div>',
        '  <div style="font-size:11px;font-weight:900;color:' + lvl.color + ';">' + lvl.name + ' Member</div>',
        '  <div style="font-size:10px;color:#9ca3af;">' + count + ' orders</div>',
        '</div>'
    ].join('');

    var tabBtns = sidebar.querySelector('.flex.flex-col');
    if (tabBtns) tabBtns.insertAdjacentElement('beforebegin', div);
}


/* ════════════════════════════════════════════════════════════
   7.  PROMOTIONAL POPUP AD (Rotating — like in-app ads)
   ════════════════════════════════════════════════════════════ */
var PROMO_ADS = [
    {
        emoji : '&#x1F381;',
        title : 'Dost ko Refer Karo, Rs.50+ Pao!',
        body  : 'Har referral par 5% commission seedha wallet mein. Abhi share karo aur kamao!',
        cta   : 'Refer Now',
        action: 'closePromoAd();navigate("profile","referrals");',
        bg    : 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
        accent: '#f9a825'
    },
    {
        emoji : '&#x2B50;',
        title : 'OutfitKart Gold — Premium Picks',
        body  : 'Curated luxury fashion at unbeatable prices. Men aur Women dono ke liye.',
        cta   : 'Explore Gold',
        action: 'closePromoAd();navigate("gold");',
        bg    : 'linear-gradient(135deg,#1a0800,#3d2c00,#6b4c00)',
        accent: '#C9A84C'
    },
    {
        emoji : '&#x1F69A;',
        title : 'COD Available — Zero Risk!',
        body  : 'Order karo, ghar par dekho, tab pay karo. No risk, full trust!',
        cta   : 'Shop Now',
        action: 'closePromoAd();navigate("shop");',
        bg    : 'linear-gradient(135deg,#134e4a,#065f46)',
        accent: '#6ee7b7'
    },
    {
        emoji : '&#x1F4B8;',
        title : 'Influencer Ban Jao — Rs.50/1K Views!',
        body  : 'OutfitKart ka video banao, social media pe daalo, paise kamao!',
        cta   : 'Join Now',
        action: 'closePromoAd();navigate("profile","influencer");',
        bg    : 'linear-gradient(135deg,#4c1d95,#7c3aed)',
        accent: '#fbbf24'
    }
];

var _promoIndex = 0;
var _promoTimer = null;

function _buildPromoOverlay() {
    if (document.getElementById('ok-promo-overlay')) return;

    var style = document.createElement('style');
    style.textContent = [
        '@keyframes okSlideUp {',
        '  from { transform: translateY(100%); opacity: 0; }',
        '  to   { transform: translateY(0);    opacity: 1; }',
        '}',
        '@keyframes okSlideDown {',
        '  from { transform: translateY(0);    opacity: 1; }',
        '  to   { transform: translateY(110%); opacity: 0; }',
        '}'
    ].join('');
    document.head.appendChild(style);

    var div = document.createElement('div');
    div.id  = 'ok-promo-overlay';
    div.style.cssText = [
        'position:fixed;inset:0;z-index:1000;',
        'display:flex;align-items:flex-end;justify-content:center;',
        'background:rgba(0,0,0,0.55);backdrop-filter:blur(6px);',
        'animation:fadeIn 0.3s ease both;'
    ].join('');

    div.innerHTML = [
        '<div id="ok-promo-card" style="',
        '  width:100%;max-width:480px;',
        '  border-radius:28px 28px 0 0;',
        '  padding:28px 24px 48px;',
        '  position:relative;',
        '  animation:okSlideUp 0.4s cubic-bezier(0.4,0,0.2,1) both;',
        '">',

        /* Drag handle */
        '<div style="width:44px;height:5px;background:rgba(255,255,255,0.3);',
        '     border-radius:9999px;margin:0 auto 22px;"></div>',

        /* Close button */
        '<button onclick="closePromoAd()" style="',
        '  position:absolute;top:18px;right:18px;',
        '  width:30px;height:30px;border-radius:50%;',
        '  background:rgba(255,255,255,0.15);border:none;',
        '  color:white;font-size:15px;cursor:pointer;',
        '  display:flex;align-items:center;justify-content:center;">&#x2715;</button>',

        '<div id="ok-promo-body"></div>',

        /* Dots */
        '<div id="ok-promo-dots" style="display:flex;justify-content:center;gap:6px;margin-top:20px;"></div>',

        '</div>'
    ].join('');

    document.body.appendChild(div);
    _renderPromoContent(0);
}

function _renderPromoContent(idx) {
    var ad   = PROMO_ADS[idx];
    var card = document.getElementById('ok-promo-card');
    var body = document.getElementById('ok-promo-body');
    var dots = document.getElementById('ok-promo-dots');
    if (!body || !dots) return;

    if (card) card.style.background = ad.bg;

    body.innerHTML = [
        '<div style="text-align:center;color:white;">',
        '  <div style="font-size:3.5rem;margin-bottom:12px;">' + ad.emoji + '</div>',
        '  <h2 style="font-size:1.25rem;font-weight:900;margin:0 0 10px;line-height:1.25;">' + ad.title + '</h2>',
        '  <p style="font-size:13.5px;opacity:0.8;margin:0 0 22px;line-height:1.55;">' + ad.body + '</p>',
        '  <button onclick="' + ad.action + '" style="',
        '    background:' + ad.accent + ';color:#1a1a1a;',
        '    font-weight:900;font-size:14px;',
        '    padding:13px 36px;border-radius:9999px;',
        '    border:none;cursor:pointer;',
        '    box-shadow:0 6px 24px rgba(0,0,0,0.3);',
        '    letter-spacing:0.04em;">',
        '    ' + ad.cta + ' &rarr;',
        '  </button>',
        '</div>'
    ].join('');

    dots.innerHTML = PROMO_ADS.map(function (_, i) {
        return [
            '<div onclick="window._goPromoSlide(' + i + ')" style="',
            '  width:' + (i === idx ? '22px' : '8px') + ';height:8px;',
            '  border-radius:9999px;cursor:pointer;',
            '  background:rgba(255,255,255,' + (i === idx ? '1' : '0.35') + ');',
            '  transition:all 0.3s ease;"></div>'
        ].join('');
    }).join('');
}

window._goPromoSlide = function (idx) {
    _promoIndex = idx;
    _renderPromoContent(idx);
    clearInterval(_promoTimer);
    _promoTimer = setInterval(_nextPromoSlide, 5000);
};

function _nextPromoSlide() {
    _promoIndex = (_promoIndex + 1) % PROMO_ADS.length;
    _renderPromoContent(_promoIndex);
}

window.closePromoAd = function () {
    clearInterval(_promoTimer);
    var card = document.getElementById('ok-promo-card');
    if (card) card.style.animation = 'okSlideDown 0.35s cubic-bezier(0.4,0,0.2,1) both';
    setTimeout(function () {
        var ov = document.getElementById('ok-promo-overlay');
        if (ov) ov.remove();
    }, 380);
    sessionStorage.setItem('ok_promo_shown', '1');
};

function _maybeShowPromo() {
    if (sessionStorage.getItem('ok_promo_shown')) return;
    setTimeout(function () {
        if (!document.getElementById('ok-promo-overlay')) {
            _buildPromoOverlay();
            _promoTimer = setInterval(_nextPromoSlide, 5000);
        }
    }, 5500);
}


/* ════════════════════════════════════════════════════════════
   8.  SUBCATEGORY STRIP ON HOME PAGE
   ════════════════════════════════════════════════════════════ */
var _HOME_STRIPS = [
    {
        label: '&#x1F454; Men',
        cat  : 'Men',
        items: ['T-Shirts', 'Baggy Jeans', 'Oversized Tees', 'Hoodies', 'Sneakers', 'Cargo Pants']
    },
    {
        label: '&#x1F457; Women',
        cat  : 'Women',
        items: ['Kurtis', 'Sarees', 'Dresses', 'Straight Fit Jeans', 'Heels', 'Palazzo']
    },
    {
        label: '&#x1F338; Perfumes',
        cat  : 'Perfumes',
        items: ["Men's Perfume", "Women's Perfume", 'Unisex Perfume', 'Attar / Ittar', 'Body Mist']
    },
    {
        label: '&#x1F576; Accessories',
        cat  : 'Accessories',
        items: ['Sunglasses', 'Watches', 'Wallets', 'Bags', 'Caps']
    }
];

function _renderHomeSubcatStrip() {
    var home = document.getElementById('view-home');
    if (!home) return;
    var existing = document.getElementById('ok-subcat-strip');
    if (existing) existing.remove();

    var wrap = document.createElement('div');
    wrap.id        = 'ok-subcat-strip';
    wrap.className = 'bg-white py-4 mt-2';

    var inner = [
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px;margin-bottom:12px;">',
        '  <h3 style="font-weight:900;font-size:1.1rem;color:#111827;">Subcategories</h3>',
        '</div>'
    ];

    _HOME_STRIPS.forEach(function (s) {
        inner.push('<div style="padding:0 16px;margin-bottom:12px;">');
        inner.push(
            '<p style="font-size:10px;font-weight:900;color:#9ca3af;',
            '   text-transform:uppercase;letter-spacing:0.12em;margin-bottom:8px;">' +
            s.label + '</p>'
        );
        inner.push(
            '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;',
            '     -webkit-overflow-scrolling:touch;scrollbar-width:none;">'
        );
        s.items.forEach(function (sub) {
            var safeSub = sub.replace(/'/g, "\\'");
            inner.push([
                '<button onclick="openSubcatProducts(\'' + s.cat + '\',\'' + safeSub + '\')"',
                '  style="flex-shrink:0;padding:8px 16px;font-size:11px;font-weight:700;',
                '         border:2px solid #e5e7eb;border-radius:9999px;',
                '         background:white;color:#374151;cursor:pointer;white-space:nowrap;',
                '         transition:border-color 0.2s,color 0.2s,background 0.2s;"',
                '  onmouseover="this.style.borderColor=\'#e11d48\';this.style.color=\'#e11d48\';this.style.background=\'#fff1f2\';"',
                '  onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.color=\'#374151\';this.style.background=\'white\';">',
                sub,
                '</button>'
            ].join(''));
        });
        /* View All pill */
        inner.push([
            '<button onclick="openCategoryPage(\'' + s.cat + '\')"',
            '  style="flex-shrink:0;padding:8px 16px;font-size:11px;font-weight:700;',
            '         border:2px solid #fecdd3;border-radius:9999px;',
            '         background:#fff1f2;color:#e11d48;cursor:pointer;white-space:nowrap;">',
            'View All &rarr;</button>'
        ].join(''));
        inner.push('</div></div>');
    });

    wrap.innerHTML = inner.join('');

    var bubbleSection = home.querySelector('.bg-white.py-4.mt-2');
    if (bubbleSection) bubbleSection.insertAdjacentElement('afterend', wrap);
    else home.prepend(wrap);
}


/* ════════════════════════════════════════════════════════════
   9.  REFERRAL INSTRUCTIONS UI
   ════════════════════════════════════════════════════════════ */
function _injectReferralInstructions() {
    var refTab = document.getElementById('tab-referrals');
    if (!refTab) return;
    if (document.getElementById('ok-ref-instructions')) return;

    var box = document.createElement('div');
    box.id  = 'ok-ref-instructions';
    box.style.cssText = [
        'background:linear-gradient(135deg,#f0fdf4,#dcfce7);',
        'border:1.5px solid #86efac;',
        'border-radius:20px;',
        'padding:20px;',
        'margin-bottom:20px;'
    ].join('');

    box.innerHTML = [
        '<h3 style="font-weight:900;font-size:14px;color:#14532d;',
        '     display:flex;align-items:center;gap:8px;margin-bottom:16px;">',
        '  <i class="fas fa-info-circle" style="color:#16a34a;"></i>',
        '  Referral Kaise Kaam Karta Hai?',
        '</h3>',

        /* Steps */
        _refStep('1', '#16a34a', 'Apna Referral Code Copy Karo',
            'Profile &rarr; Profile Info section mein milega ya yahan se copy karo'),
        _refStep('2', '#16a34a', 'Dosto ko Share Karo',
            'WhatsApp, Instagram, ya direct link share karo<br>' +
            '<code style="font-size:10px;background:white;border:1px solid #bbf7d0;' +
            'border-radius:6px;padding:2px 6px;font-family:monospace;">' +
            'site.com?ref=YOURCODE</code>'),
        _refStep('3', '#16a34a', 'Dost Order Kare',
            'Jab wo koi bhi product order karta hai, referral automatically track hoga'),
        _refStep('4', '#f59e0b', '5% Commission Milega (30 din baad)',
            'Order value ka 5% aapke wallet mein credit hoga<br>' +
            '<strong style="color:#d97706;">Example: Rs.1000 ka order &rarr; Rs.50 aapko!</strong>'),

        /* Action buttons */
        '<div style="display:flex;gap:8px;margin-top:16px;">',
        '  <button onclick="switchProfileTab(\'info\',null);setTimeout(function(){copyReferralCode();},300)"',
        '    style="flex:1;background:#16a34a;color:white;padding:10px;',
        '           border-radius:12px;font-weight:700;font-size:13px;border:none;cursor:pointer;">',
        '    <i class="fas fa-copy" style="margin-right:4px;"></i> Code Copy Karo',
        '  </button>',
        '  <button onclick="shareOutfitKart()"',
        '    style="flex:1;background:white;border:2px solid #86efac;color:#16a34a;',
        '           padding:10px;border-radius:12px;font-weight:700;font-size:13px;cursor:pointer;">',
        '    <i class="fas fa-share-alt" style="margin-right:4px;"></i> Share Karo',
        '  </button>',
        '</div>'
    ].join('');

    refTab.insertAdjacentElement('afterbegin', box);
}

function _refStep(num, color, heading, sub) {
    return [
        '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">',
        '  <div style="width:30px;height:30px;border-radius:50%;background:' + color + ';',
        '       color:white;display:flex;align-items:center;justify-content:center;',
        '       font-weight:900;font-size:13px;flex-shrink:0;">' + num + '</div>',
        '  <div style="flex:1;">',
        '    <p style="font-weight:700;font-size:13px;color:#111827;margin:0 0 3px;">' + heading + '</p>',
        '    <p style="font-size:11.5px;color:#6b7280;margin:0;line-height:1.5;">' + sub + '</p>',
        '  </div>',
        '</div>'
    ].join('');
}


/* ════════════════════════════════════════════════════════════
   PATCH checkAuthUI — re-run injections after login / logout
   ════════════════════════════════════════════════════════════ */
_waitFor('checkAuthUI', function () {
    var _origCA = window.checkAuthUI;
    window.checkAuthUI = function () {
        _origCA.call(this);
        if (window.currentUser) {
            setTimeout(function () {
                _injectGenderProfile();
                _fillProfileGender();
                _injectSidebarLevel();
                _injectReferralInstructions();
                if (window._updateUserLevel) window._updateUserLevel();
            }, 200);
        }
    };
});


/* ════════════════════════════════════════════════════════════
   PATCH switchProfileTab — refresh UI per tab
   ════════════════════════════════════════════════════════════ */
_waitFor('switchProfileTab', function () {
    var _origSP = window.switchProfileTab;
    window.switchProfileTab = function (tabId, btnEl) {
        _origSP.call(this, tabId, btnEl);
        if (tabId === 'referrals') {
            setTimeout(_injectReferralInstructions, 60);
        }
        if (tabId === 'info') {
            setTimeout(function () {
                _injectGenderProfile();
                _fillProfileGender();
                var count = (window.ordersDb || []).filter(function (o) {
                    return o.status !== 'Cancelled';
                }).length;
                _renderLevelBadge(_getLevelFor(count), count);
                _injectSidebarLevel();
            }, 60);
        }
    };
});


/* ════════════════════════════════════════════════════════════
   PATCH navigate — refresh Home strips after navigation
   ════════════════════════════════════════════════════════════ */
(function _patchNavigateForStrips() {
    var _done = false;
    var _t = setInterval(function () {
        if (!window.navigate || _done) return;
        /* Only patch if pushState is already in there (SPA fix ran first) */
        if (window.navigate.toString().indexOf('pushState') === -1) return;
        _done = true;
        clearInterval(_t);

        var _nOrig = window.navigate;
        window.navigate = function (view, cat) {
            var r = _nOrig.call(this, view, cat);
            if (view === 'home') {
                setTimeout(function () {
                    _renderHomeSubcatStrip();
                    _renderHomeAIStrip();
                }, 250);
            }
            if (view === 'profile') {
                setTimeout(function () {
                    _injectGenderProfile();
                    _fillProfileGender();
                    _injectReferralInstructions();
                    if (window.currentUser && window._updateUserLevel) window._updateUserLevel();
                }, 300);
            }
            return r;
        };
    }, 350);
})();


/* ════════════════════════════════════════════════════════════
   MAIN BOOT
   ════════════════════════════════════════════════════════════ */
function _ok_fixes_boot() {
    /* Always re-capture referral */
    if (typeof captureReferralFromUrl === 'function') captureReferralFromUrl();

    /* Static DOM injections */
    _injectGenderSignup();
    _injectGenderProfile();
    _injectReferralInstructions();
    _ensureSearchView();
    _bindSearchEnter();

    /* If already logged in */
    if (window.currentUser) {
        _fillProfileGender();
        _injectSidebarLevel();
        _autoConfirmReferrals();
        if (window._updateUserLevel) window._updateUserLevel();
    }

    /* Wait for products then build home strips + AI strip */
    var _wp = setInterval(function () {
        if ((window.products || []).length > 0) {
            clearInterval(_wp);
            _renderHomeSubcatStrip();
            _renderHomeAIStrip();
        }
    }, 700);

    /* Promo popup */
    _maybeShowPromo();

    console.log('[script-fixes.js] All features active');
}

/* Entry */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(_ok_fixes_boot, 900); });
} else {
    setTimeout(_ok_fixes_boot, 900);
}
