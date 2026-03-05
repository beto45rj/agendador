const CACHE = 'agendador-v1';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Notificações agendadas via BroadcastChannel
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE') {
    const { id, titulo, msg, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification('🔔 ' + titulo, {
        body: msg,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag: id,
        requireInteraction: true
      });
    }, delay);
  }
});
