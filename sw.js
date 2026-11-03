const CACHE_NAME = "kara-reco-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",

    "./style.css",
    "./home.css",
    "./history.css",
    "./analysis.css",
    "./record.css",
    "./setlist.css",
    "./setting.css",
    "./song-detail.css",

    "./script.js",
    "./data.js",
    "./home.js",
    "./history.js",
    "./analysis.js",
    "./record.js",
    "./search.js",
    "./setlist.js",
    "./setlist-create.js",
    "./setlist-detail.js",
    "./setting.js"
];


// インストール
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


// 起動時
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys => {

            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );

        })
    );

    self.clients.claim();
});


// ファイル取得
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })

    );

});