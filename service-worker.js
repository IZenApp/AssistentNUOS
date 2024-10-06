const CACHE_NAME = 'assistant-cache-v2'; // Новая версия кеша

self.addEventListener('install', (event) => {
    const htmlFiles = [
        './index.html',
        './html/About Home.html',
        './html/About the University.html',
        './html/Call schedule.html',
        './html/Contacts Dean of faculties.html',
        './html/Leadership of the student republic.html',
        './html/Manual.html',
        './html/Structure of the University.html',
        './html/Student republic.html',
        './html/Student.html'
    ];

    const cssFiles = [
        './css/global/global1.css',
        './css/global/global2.css',
        './css/global/global3.css',
        './css/global/global4.css',
        './css/global/global5.css',
        './css/global/global6.css',
        './css/global/global7.css',
        './css/global/global8.css',
        './css/global/global9.css',
        './css/global/global10.css',
        './css/index1.css',
        './css/gl.css',
        './css/About Home.css',
        './css/About the University.css',
        './css/Call schedule.css',
        './css/Leadership of the student republic.css',
        './css/Structure of the University.css',
        './css/Student republic.css',
        './css/Student.css',
        './css/Contacts Dean of faculties.css',
        './css/Manual.css'
    ];

    const imageFiles = [
        './img/1.png',
        './img/2.png',
        './img/3.png',
        './img/5.png',
        './img/4.png',
        './img/6.png',
        './img/7.png',
        './img/8.png',
        './img/9.png',
        './img/Fon1.png',
        './img/Fon2.png',
        './img/Fon3.png',
        './img/Fon4.png',
        './img/Fon5.png',
        './img/Fon6.png',
        './img/Fon7.png',
        './img/Fon8.png',
        './img/Fon9.png',
        './img/Fon10.png',
        './img/LogoMain.png',
        './img/Logo1.png',
        './img/Logo2.png',
        './img/Logo.png',
        './img/Avatar/Illia.png',
        './img/Avatar/Katya.png'
    ];

    const allFiles = [...htmlFiles, ...cssFiles, ...imageFiles, './index.html'];

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(allFiles);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});