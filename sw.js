const cacheName = "atto-cv2"; // Increment for every major change

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(cacheName).then(function(cache) {
        return cache.addAll([
            "/atto",
            "/atto/index.html",
            "/atto/style.css",
            "/atto/script.js",
            "/atto/basic.js",
            "/atto/canvas.js",
            "/atto/commands.js",
            "/atto/common.js",
            "/atto/hid.js",
            "/atto/syntax.js",
            "/atto/term.js",
            "/atto/docs.js",
            "/atto/docs",
            "/atto/docs/index.md",
            "/atto/docs/beginner.md",
            "/atto/docs/fromedu.md",
            "/atto/docs/frombasic.md",
            "/atto/docs/advanced.md",
            "/atto/docs/reference",
            "/atto/docs/reference/index.md",
            "/atto/docs/reference/control.md",
            "/atto/docs/reference/io.md",
            "/atto/docs/reference/functions.md",
            "/atto/docs/reference/constants.md",
            "/atto/docs/reference/lists.md",
            "/atto/docs/reference/operators.md",
            "/atto/docs/reference/comparators.md",
            "/atto/media/logo.svg",
            "/atto/media/logo.png",
            "/atto/media/maskable.svg",
            "/atto/media/maskable.png"
        ]).then(function() {
            self.skipWaiting();
        });
    }));
});

self.addEventListener("activate", function(event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
    event.respondWith(caches.open(cacheName).then(function(cache) {
        return cache.match(event.request, {ignoreSearch: true});
    }).then(function(response) {
        return response || fetch(event.request);
    }));
});