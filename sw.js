const cacheName = "atto-cv9"; // Increment for every major change

self.addEventListener("install", function(event) {
    event.waitUntil(caches.open(cacheName).then(function(cache) {
        return cache.addAll([
            "/",
            "/index.html",
            "/docspopout.html",
            "/style.css",
            "/script.js",
            "/audio.js",
            "/basic.js",
            "/bot.js",
            "/canvas.js",
            "/commands.js",
            "/core.js",
            "/common.js",
            "/hid.js",
            "/syntax.js",
            "/term.js",
            "/docs.js",
            "/docspopout.js",
            "/docs",
            "/docs/index.md",
            "/docs/beginner.md",
            "/docs/fromedu.md",
            "/docs/frombasic.md",
            "/docs/advanced.md",
            "/docs/tweet.md",
            "/docs/acknowledgements.md",
            "/docs/courses",
            "/docs/courses/index.md",
            "/docs/courses/turtle.md",
            "/docs/reference",
            "/docs/reference/index.md",
            "/docs/reference/shell.md",
            "/docs/reference/control.md",
            "/docs/reference/io.md",
            "/docs/reference/functions.md",
            "/docs/reference/constants.md",
            "/docs/reference/lists.md",
            "/docs/reference/turtle.md",
            "/docs/reference/audio.md",
            "/docs/reference/operators.md",
            "/docs/reference/comparators.md",
            "/lib/showdown.min.js",
            "/lib/base2048.js",
            "/lib/tone.js",
            "/media/logo.svg",
            "/media/logo.png",
            "/media/maskable.svg",
            "/media/maskable.png",
            "/media/icons/close.svg",
            "/media/icons/home.svg",
            "/media/icons/popout.svg",
            "/media/docs/turtle1.png",
            "/media/docs/turtle2.png",
            "/media/docs/turtle3.png",
            "/media/docs/turtle4.png",
            "/media/docs/turtle5.png"
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