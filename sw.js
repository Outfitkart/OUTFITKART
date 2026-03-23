/* ============================================================
   OutfitKart Service Worker — v6
   ⚠️  v6: Cache purge — logo fix, script-fixes.js removed
   ============================================================ */

const STATIC_CACHE  = 'outfitkart-static-v7';
const DYNAMIC_CACHE = 'outfitkart-dynamic-v7';

const PRECACHE_URLS = [
    './index.html',
    './manifest.json',
    './styles.css',
    './script-core.js',
    './script-admin.js',
    /* script-fixes.js removed — merged into script-core.js */
];

/* ── INSTALL: cache core files ───────────────────────────── */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(c => c.addAll(PRECACHE_URLS).catch(() => {}))
    );
    /* Force new SW to activate immediately — no waiting */
    self.skipWaiting();
});

/* ── ACTIVATE: delete ALL old caches ────────────────────── */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
                    .map(k => {
                        console.log('[SW v6] Deleting old cache:', k);
                        return caches.delete(k);
                    })
            )
        )
    );
    /* Take control of all open tabs immediately */
    self.clients.claim();
});

/* ── FETCH ───────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    const url = new URL(event.request.url);

    /* ── Never cache: API / payment / upload / location ── */
    if (
        url.hostname.includes('supabase.co')            ||
        url.hostname.includes('razorpay.com')           ||
        url.hostname.includes('imgbb.com')              ||
        url.hostname.includes('api.imgbb.com')          ||
        url.hostname.includes('api.postalpincode.in')   ||
        url.hostname.includes('nominatim.openstreetmap.org')
    ) return;

    /* ── HTML: network first, fallback to cached index ── */
    if (event.request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    caches.open(STATIC_CACHE).then(c => c.put(event.request, res.clone()));
                    return res;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    /* ── JS / CSS: network first (always get fresh code) ── */
    if (url.pathname.match(/\.(js|css|woff2?)$/)) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    if (res.ok) {
                        caches.open(STATIC_CACHE).then(c => c.put(event.request, res.clone()));
                    }
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    /* ── Logo / brand images: NETWORK FIRST (never serve stale logo) ── */
    if (
        url.hostname.includes('i.ibb.co')   ||
        url.hostname.includes('ibb.co')     ||
        url.pathname.includes('IMG-20260323')   /* our specific logo filename */
    ) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    if (res.ok) {
                        /* Update cache with fresh logo */
                        caches.open(DYNAMIC_CACHE).then(c => c.put(event.request, res.clone()));
                    }
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    /* ── Other images: cache first (product photos etc.) ── */
    if (
        url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico)$/) ||
        url.hostname.includes('placehold.co')                    ||
        url.hostname.includes('unsplash.com')
    ) {
        event.respondWith(
            caches.open(DYNAMIC_CACHE).then(cache =>
                cache.match(event.request).then(cached => {
                    if (cached) return cached;
                    return fetch(event.request).then(res => {
                        if (res.ok) cache.put(event.request, res.clone());
                        return res;
                    }).catch(() => cached);
                })
            )
        );
        return;
    }

    /* ── Default: network with cache fallback ── */
    event.respondWith(
        fetch(event.request)
            .then(res => {
                if (res.ok) caches.open(DYNAMIC_CACHE).then(c => c.put(event.request, res.clone()));
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});

/* ── PUSH NOTIFICATION RECEIVE ───────────────────────────── */
self.addEventListener('push', event => {
    if (!event.data) return;
    let payload;
    try { payload = event.data.json(); }
    catch { payload = { title: 'OutfitKart', body: event.data.text() }; }

    const title   = payload.title || 'OutfitKart 🛍️';
    const options = {
        body    : payload.body  || 'Aapke liye kuch khaas hai!',
        icon    : payload.icon  || 'https://i.ibb.co/8DxtmN09/IMG-20260323-141417.png',
        badge   : payload.badge || 'https://i.ibb.co/8DxtmN09/IMG-20260323-141417.png',
        image   : payload.image || undefined,
        tag     : payload.tag   || 'outfitkart',
        renotify: true,
        vibrate : [200, 100, 200],
        requireInteraction: false,
        data: {
            url    : payload.url     || './',
            pid    : payload.pid     || null,
            orderId: payload.orderId || null,
        },
        actions: [
            { action: 'open',    title: '🛍️ Open App' },
            { action: 'dismiss', title: '✕ Dismiss'   },
        ],
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

/* ── NOTIFICATION CLICK ──────────────────────────────────── */
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'dismiss') return;

    const targetUrl = event.notification.data?.url || './';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const c of list) {
                if ('focus' in c) {
                    c.focus();
                    c.postMessage({
                        type   : 'NOTIFICATION_CLICK',
                        url    : targetUrl,
                        pid    : event.notification.data?.pid     || null,
                        orderId: event.notification.data?.orderId || null,
                    });
                    return;
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});

/* ── SW UPDATE MESSAGE (from app) ────────────────────────── */
self.addEventListener('message', event => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
