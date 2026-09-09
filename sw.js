const CACHE_NAME = "kara-reco-v3";

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


// ===============================
// インストール
// ===============================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    // 新しいSWをすぐ待機状態にする
    self.skipWaiting();
});


// ===============================
// 有効化
// ===============================

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

    // 新しいSWをすぐページに適用
    self.clients.claim();
});


// ===============================
// ファイル取得
// ===============================

self.addEventListener("fetch", event => {

    event.respondWith(

        fetch(event.request)
            .then(response => {

                // 最新ファイルを取得できたらキャッシュも更新
                const responseClone = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });

                return response;

            })
            .catch(() => {

                // 通信できなければキャッシュを使用
                return caches.match(event.request);

            })

    );

});