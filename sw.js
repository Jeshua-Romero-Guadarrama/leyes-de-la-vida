/* ==========================================================================
   Leyes de la Vida — Service worker (funcionamiento sin conexión)
   Autor: Jeshua Romero Guadarrama
   ========================================================================== */

var CACHE = "leyes-vida-v4";
var ARCHIVOS = [
  "./",
  "./index.html",
  "./css/estilos.css",
  "./js/datos.js",
  "./js/interactivos.js",
  "./js/interactivos-extra1.js",
  "./js/interactivos-extra2.js",
  "./js/interactivos-extra3.js",
  "./js/interactivos-extra4.js",
  "./js/interactivos-extra5.js",
  "./js/quiz.js",
  "./js/app.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (resp) {
      return resp || fetch(e.request).then(function (r) {
        var copia = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
        return r;
      });
    }).catch(function () { return caches.match("./index.html"); })
  );
});
