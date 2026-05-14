// Service Worker para Vanocode PWA
const CACHE_NAME = 'vanocode-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/src/images/icon_logo_512x512.png',
  '/src/images/icon_logo_192x192.png'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Erro ao adicionar ao cache:', error);
      })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições e servir do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna
        if (response) {
          return response;
        }
        // Se não encontrar, busca na rede
        return fetch(event.request)
          .then(response => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clona a resposta para cachear
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          })
          .catch(error => {
            console.error('Erro ao buscar:', error);
            // Se estiver offline e não tiver cache, retorna uma página offline
            return new Response('Você está offline. Conecte-se à internet para acessar o site.', {
              status: 503,
              statusText: 'Offline'
            });
          });
      })
  );
});

// Sincronização em segundo plano (opcional)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-contacts') {
    event.waitUntil(
      // Lógica para sincronizar contactos se necessário
      console.log('Sincronização em segundo plano executada')
    );
  }
});

// Notificações push (opcional)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {
    title: 'Vanocode',
    body: 'Nova atualização disponível!'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/src/images/icon_logo_192x192.png',
      badge: '/src/images/icon_logo_192x192.png'
    })
  );
});