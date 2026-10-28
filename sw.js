// FT Premium · recebe os avisos (notificações) e abre o app no lugar certo.
// Não guarda nada em cache: o app continua sempre atualizado.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { texto: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Fabiano Teles', {
    body: d.texto || '',
    icon: '/selo-192.png',
    badge: '/selo-192.png',
    tag: d.tag || 'ft',
    renotify: true,
    data: { url: d.url || '/' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil((async () => {
    const abertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const doApp = url.startsWith(self.location.origin);
    const w = doApp && abertas.find((x) => x.url.startsWith(self.location.origin));
    if (w) { await w.focus(); try { await w.navigate(url); } catch { /* fica na tela aberta */ } return; }
    await self.clients.openWindow(url);
  })());
});
