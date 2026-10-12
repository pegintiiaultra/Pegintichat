'use strict';
/* Service worker : coquille de l'application hors ligne (CSS/JS/icônes). Les API et les pages ne sont jamais mises en cache. */
const V = 'peginti-v1';
const COQUILLE = ['/assets/css/style.css', '/assets/js/commun.js', '/assets/favicon.svg', '/assets/icons/icone-192.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(COQUILLE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).catch(() => new Response('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width"><title>Hors ligne</title><body style="font-family:system-ui;background:#0e1116;color:#e8ecf1;padding:2rem"><h1>Hors ligne</h1><p>PEGINTI IA a besoin d\'une connexion. Réessayez dans un instant.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 503 })));
    return;
  }
  if (u.pathname.startsWith('/assets/')) {
    e.respondWith(fetch(r).then((rep) => { if (rep.ok) { const c = rep.clone(); caches.open(V).then((ca) => ca.put(r, c)); } return rep; }).catch(() => caches.match(r)));
  }
});
