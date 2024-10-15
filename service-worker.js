// Имя кеша. Увеличивай номер версии при каждом обновлении файлов.
const CACHE_NAME = 'assistant-cache-v4.0'; 

// Обработчик события установки service worker
self.addEventListener('install', (event) => {
    // Массивы файлов для кэширования
    const htmlFiles = [
        'index.html',
        '/html/About Home.html',
        '/html/About the University.html',
        '/html/Call schedule.html',
        '/html/Leadership of the student republic.html',
        '/html/Manual.html',
        '/html/Structure of the University.html',
        '/html/Student republic.html',
        '/html/Student.html'
    ];

    const cssFiles = [
        '/css/global/global1.css',
        '/css/global/global2.css',
        '/css/global/global3.css',
        '/css/global/global4.css',
        '/css/global/global5.css',
        '/css/global/global6.css',
        '/css/global/global7.css',
        '/css/global/global8.css',
        '/css/global/global9.css',
        '/css/global/global10.css',
        '/css/index1.css',
        '/css/gl.css',
        '/css/About Home.css',
        '/css/About the University.css',
        '/css/Call schedule.css',
        '/css/Leadership of the student republic.css',
        '/css/Structure of the University.css',
        '/css/Student republic.css',
        '/css/Student.css',
        '/css/Contacts Dean of faculties.css',
        '/css/Manual.css'
    ];

    const imageFiles = [
        '/img/Avatar/Dubinsky Oleg Yuriyovich.png',
        '/img/Avatar/Mikhailov Mikhailo Serhiyovich.png',
        '/img/Avatar/Olena.png',
        '/img/Avatar/Pavlov Gennady Viktorovich.png',
        '/img/Avatar/Slobodyan Sergiy Olegovich.png',
        '/img/Avatar/Trushlyakov Evgen Ivanovich.png',
        '/img/Avatar/Vova.png',
        '/img/Avatar/Yevhenii.png',
        '/img/Avatar/Illia.png',
        '/img/Avatar/Katya.png',
        '/img/Social/ElectroNEWS.png',
        '/img/Social/Instagram.png',
        '/img/Social/TikTok.png',
        '/img/Social/voiceNUOS.png',
        '/img/Fon1.png',
        '/img/Fon2.png',
        '/img/LogoPWA.png',
        '/img/Email.png',
        '/img/Phone.png',
        '/img/logo_small.svg',
        '/img/LogoMain.png',
        '/img/Logo.png',
        '/img/Logo1.png'
    ];

    // Объединяем все файлы в один массив
    const allFiles = [...htmlFiles, ...cssFiles, ...imageFiles, 'index.html'];

    // Кэшируем файлы
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(allFiles);
        })
    );
});

// Обработчик события активации service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Список актуальных кешей
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Удаляем старые кеши
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработчик события fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.error(`Fetch failed for ${event.request.url}`);
            });
        })
    );
});