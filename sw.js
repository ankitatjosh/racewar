/* Resume World Tour Racer — service worker
 * - App shell: precached, served cache-first (works offline after first visit)
 * - Page navigations: network-first, falls back to the cached game
 * - CDN libraries (three.js, d3, tailwind, fonts, icons): stale-while-revalidate
 * Bump VERSION whenever you deploy a new index.html.
 */
const VERSION = 'resume-racer-v5-1';
const CDN_CACHE = VERSION + '-cdn';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== CDN_CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(VERSION).then((c) => c.put('./index.html', copy));
                    return res;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then((hit) => hit || fetch(req).then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(VERSION).then((c) => c.put(req, copy));
                }
                return res;
            }))
        );
        return;
    }

    // Cross-origin CDN assets: answer from cache instantly, refresh in the background
    event.respondWith(
        caches.open(CDN_CACHE).then(async (cache) => {
            const hit = await cache.match(req);
            const network = fetch(req)
                .then((res) => {
                    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
                    return res;
                })
                .catch(() => hit);
            return hit || network;
        })
    );
});
