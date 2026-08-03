// Este service worker existe só pra "desligar" o PWA antigo.
// O app já teve um service worker de verdade (vite-plugin-pwa), removido
// nessa migração — mas quem já tinha instalado o app antigo continua com
// aquele service worker rodando no navegador, servindo a versão em cache
// pra sempre, mesmo com o site já atualizado no servidor.
//
// Este arquivo substitui aquele antigo: ao ativar, ele apaga todo o cache,
// se desregistra sozinho e recarrega as abas abertas — depois disso, o
// navegador volta a buscar tudo direto do servidor, como um site normal.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});
