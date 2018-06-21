importScripts('cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('soundboard').then(function(cache) {
     return cache.addAll([
       'index.html',
       'style.css',
       'scripts.js',
       'sounds.json',
       'sw.js',
       './sounds/am-1.mp3',
       './sounds/am-2.mp3',
       './sounds/am-3.mp3',
       './sounds/am-4.mp3',
       './sounds/am-5.mp3',
       './sounds/am-6.mp3',
       './sounds/am-7.mp3',
       './sounds/am-8.mp3',
       './sounds/am-9.mp3',
       './sounds/am-10.mp3',
       './sounds/am-11.mp3',
       './sounds/am-12.mp3',
       './sounds/ss-1.mp3',
       './sounds/ss-2.mp3',
       './sounds/ss-3.mp3',
       './sounds/ss-4.mp3',
       './sounds/ss-5.mp3',
       './sounds/ss-6.mp3',
       './sounds/ss-7.mp3',
       './sounds/ss-8.mp3',
       './sounds/ss-9.mp3',
       './sounds/ss-10.mp3',
       './sounds/ss-11.mp3',
       './sounds/ss-12.mp3',

       './images/am-1.jpg',
       './images/am-2.jpg',
       './images/am-3.jpg',
       './images/am-4.png',
       './images/am-5.png',
       './images/am-6.jpg',
       './images/am-7.jpg',
       './images/am-8.jpg',
       './images/am-9.jpg',
       './images/am-10.jpg',
       './images/am-11.jpg',
       './images/am-12.jpg',
       './images/ss-1.png',
       './images/ss-2.jpg',
       './images/ss-3.jpg',
       './images/ss-4.jpg',
       './images/ss-5.jpg',
       './images/ss-6.jpg',
       './images/ss-7.jpg',
       './images/ss-8.png',
       './images/ss-9.jpg',
       './images/ss-10.jpg',
       './images/ss-11.jpg',
       './images/ss-12.jpg',

       'images/icon-192.png',
       'images/icon-144.png',
       'images/icon-96.png',
       'images/icon-48.png'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});