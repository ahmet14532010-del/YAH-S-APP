const CACHE_NAME = 'yahis-v1';
const urlsToCache = [
  './YAHİS AI DEMO.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Service Worker kurulumu
self.addEventListener('install', event => {
  console.log('Service Worker yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache'den dosya sunma
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'de varsa döndür, yoksa internetten al
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Geçerli yanıt kontrolü
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Yanıtı klonla ve cache'e ekle
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});

// Eski cache'leri temizle
self.addEventListener('activate', event => {
  console.log('Service Worker aktif');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
