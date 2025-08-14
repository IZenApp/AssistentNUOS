//const CACHE_VERSION = 'v7.0';===== SERVICE WORKER ДЛЯ АСИСТЕНТА НУОС =====

const CACHE_VERSION = 'v6.6';
const STATIC_CACHE = `assistentNUOS-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `assistentNUOS-dynamic-${CACHE_VERSION}`;

// Ресурси для кешування
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/components.css',
    '/assets/css/index.css',
    '/assets/css/main.css',
    '/assets/css/pages.css',
    '/assets/css/responsive.css',
    '/assets/css/offline.css',
    '/assets/css/about-new.css',
    '/assets/js/app.js',
    '/assets/js/pwa.js',
    '/assets/images/logo.svg',
    '/assets/images/logo.png',
    '/assets/images/background-primary.png',
    '/assets/images/background-secondary.png',
    // Аватари команди
    '/assets/images/avatars/Yevhenii.png',
    '/assets/images/avatars/Vova.png',
    '/assets/images/avatars/Katya.png',
    '/assets/images/avatars/Olena.png',
    '/assets/images/avatars/Olesya.jpeg',
    '/assets/images/avatars/Trushlyakov Evgen Ivanovich.png',
    '/assets/images/avatars/Slobodyan Sergiy Olegovich.png',
    '/assets/images/avatars/Pavlov Gennady Viktorovich.png',
    '/assets/images/avatars/Dubinsky Oleg Yuriyovich.png',
    '/assets/images/avatars/Mikhailov Mikhailo Serhiyovich.png',
    // Сторінки
    '/pages/about.html',
    '/pages/university.html',
    '/pages/schedule.html',
    '/pages/student-republic.html',
    '/pages/leadership.html',
    '/pages/offline.html'
];

// ===== ПОДІЇ SERVICE WORKER =====

// Встановлення
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Встановлення');
    
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(CACHE_NAME);
                console.log('📦 Кешування статичних ресурсів...');
                await cache.addAll(STATIC_CACHE_URLS);
                console.log('✅ Статичні ресурси закешовано');
                
                // Форсуємо активацію нового SW
                self.skipWaiting();
            } catch (error) {
                console.error('❌ Помилка кешування:', error);
            }
        })()
    );
});

// Активація
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Активація');
    
    event.waitUntil(
        (async () => {
            try {
                // Очищуємо старі кеші
                const cacheNames = await caches.keys();
                const deletePromises = cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => {
                        console.log('🗑️ Видаляємо старий кеш:', name);
                        return caches.delete(name);
                    });
                
                await Promise.all(deletePromises);
                
                // Берем контроль над всіма клієнтами
                await self.clients.claim();
                
                console.log('✅ Service Worker активовано');
            } catch (error) {
                console.error('❌ Помилка активації:', error);
            }
        })()
    );
});

// Перехоплення мережевих запитів
self.addEventListener('fetch', event => {
    // Ігноруємо не-GET запити
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ігноруємо запити до інших доменів
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(handleFetch(event.request));
});

// Обробка повідомлень
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏩ Примусова активація Service Worker');
        self.skipWaiting();
    }
});

// ===== СТРАТЕГІЇ КЕШУВАННЯ =====

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Стратегія для HTML сторінок
        if (request.headers.get('accept')?.includes('text/html')) {
            return await handlePageRequest(request);
        }
        
        // Стратегія для статичних ресурсів (CSS, JS, зображення)
        if (isStaticResource(url.pathname)) {
            return await handleStaticResource(request);
        }
        
        // Стратегія для зображень
        if (isImageResource(url.pathname)) {
            return await handleImageResource(request);
        }
        
        // За замовчуванням - мережа з фолбеком на кеш
        return await networkFirst(request);
        
    } catch (error) {
        console.error('❌ Помилка обробки запиту:', error);
        return await handleOfflineResponse(request);
    }
}

// Cache First для статичних ресурсів
async function handleStaticResource(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('📱 Статичний ресурс недоступний офлайн:', request.url);
        throw error;
    }
}

// Network First для HTML сторінок
async function handlePageRequest(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('📱 Сторінка недоступна, завантажуємо з кешу:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Повертаємо офлайн сторінку як fallback
        return await caches.match('/pages/offline.html') || await caches.match('/index.html');
    }
}

// Stale While Revalidate для зображень
async function handleImageResource(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.ok) {
                const cache = caches.open(CACHE_NAME);
                cache.then(c => c.put(request, response.clone()));
            }
            return response;
        })
        .catch(() => null);
    
    return cachedResponse || await fetchPromise || await createOfflineImageResponse();
}

// Network First з фолбеком на кеш
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// ===== ДОПОМІЖНІ ФУНКЦІЇ =====

function isStaticResource(pathname) {
    return pathname.includes('.css') || 
           pathname.includes('.js') || 
           pathname.includes('.woff') || 
           pathname.includes('.woff2') ||
           pathname.includes('.ttf');
}

function isImageResource(pathname) {
    return pathname.includes('.png') || 
           pathname.includes('.jpg') || 
           pathname.includes('.jpeg') || 
           pathname.includes('.svg') || 
           pathname.includes('.webp') ||
           pathname.includes('.gif');
}

async function handleOfflineResponse(request) {
    // Для HTML сторінок повертаємо офлайн сторінку
    if (request.headers.get('accept')?.includes('text/html')) {
        return await caches.match('/pages/offline.html') || await caches.match('/index.html');
    }
    
    // Для зображень повертаємо заглушку
    if (isImageResource(request.url)) {
        return await createOfflineImageResponse();
    }
    
    // Для інших ресурсів повертаємо помилку
    return new Response('Офлайн - ресурс недоступний', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

async function createOfflineImageResponse() {
    // Створюємо простий SVG як заглушку
    const svg = `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666">
                📱 Офлайн
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

console.log('🎯 Service Worker завантажено для Асистента НУОС');
