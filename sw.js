// Service worker: guarda la "cáscara" de la app para que abra rápido y se pueda instalar.
const CACHE = 'servet-slu2-v1';
const ARCHIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // los datos de Google siempre van directo
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('./'))));
});
