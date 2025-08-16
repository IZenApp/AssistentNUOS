// ===== SERVICE WORKER ДЛЯ АСИСТЕНТА НУОС =====

const CACHE_VERSION = 'v10.0';
const STATIC_CACHE = `assistentNUOS-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `assistentNUOS-dynamic-${CACHE_VERSION}`;
const CACHE_NAME = STATIC_CACHE;

// Додаємо timestamp для запобігання кешування SW
const SW_TIMESTAMP = Date.now();

// Ресурси для кешування
const STATIC_CACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './assets/css/components.css',
    './assets/css/index.css',
    './assets/css/main.css',
    './assets/css/pages.css',
    './assets/css/responsive.css',
    './assets/css/offline.css',
    './assets/css/about-new.css',
    './assets/css/index-new.css',
    './assets/css/leadership.css',
    './assets/css/schedule.css',
    './assets/css/university.css',
    './assets/js/app.js',
    './assets/js/pwa.js',
    './assets/images/logo.svg',
    './assets/images/pwa-icon-large.svg',
    './assets/images/apple-touch-icon.png',
    // PWA іконки
    './assets/images/icons/icon-72x72.png',
    './assets/images/icons/icon-96x96.png',
    './assets/images/icons/icon-128x128.png',
    './assets/images/icons/icon-144x144.png',
    './assets/images/icons/icon-152x152.png',
    './assets/images/icons/icon-180x180.png',
    './assets/images/icons/icon-192x192.png',
    './assets/images/icons/icon-384x384.png',
    './assets/images/icons/icon-512x512.png',
    // Аватари команди
    './assets/images/avatars/Yevhenii.png',
    './assets/images/avatars/Vova.png',
    './assets/images/avatars/Katya.png',
    './assets/images/avatars/Olena.png',
    './assets/images/avatars/Olesya.jpeg',
    './assets/images/avatars/Trushlyakov Evgen Ivanovich.png',
    './assets/images/avatars/Slobodyan Sergiy Olegovich.png',
    './assets/images/avatars/Pavlov Gennady Viktorovich.png',
    './assets/images/avatars/Dubinsky Oleg Yuriyovich.png',
    './assets/images/avatars/Mikhailov Mikhailo Serhiyovich.png',
    // Сторінки
    './pages/about.html',
    './pages/university.html',
    './pages/schedule.html',
    './pages/student-republic.html',
    './pages/leadership.html',
    './pages/offline.html',
    './tests/icon-test.html',
    './tests/offline-test.html'
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
                
                // Кешуємо ресурси по одному для кращого контролю помилок
                const cachePromises = STATIC_CACHE_URLS.map(async url => {
                    try {
                        await cache.add(url);
                        console.log(`✅ Закешовано: ${url}`);
                    } catch (error) {
                        console.warn(`⚠️ Не вдалося закешувати ${url}:`, error.message);
                        // Продовжуємо з іншими файлами
                    }
                });
                
                await Promise.allSettled(cachePromises);
                console.log('✅ Кешування завершено');
                
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
    
    // Ігноруємо запити до інших доменів та chrome-extension
    if (!event.request.url.startsWith(self.location.origin) || 
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('web-extension')) {
        return;
    }
    
    event.respondWith(handleFetch(event.request));
});

// Обробка повідомлень
self.addEventListener('message', event => {
    // Перевіряємо походження повідомлення для безпеки
    if (event.origin !== self.location.origin) {
        console.warn('⚠️ Отримано повідомлення з недовіреного джерела:', event.origin);
        return;
    }
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏩ Примусова активація Service Worker');
        self.skipWaiting();
    }
    
    // Додаємо підтримку запиту версії кешу
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            type: 'VERSION_RESPONSE',
            version: CACHE_VERSION,
            timestamp: SW_TIMESTAMP
        });
    }
    
    // Додаємо підтримку примусового оновлення
    if (event.data && event.data.type === 'FORCE_UPDATE') {
        console.log('🔄 Примусове оновлення кешу');
        event.waitUntil(forceUpdateCache());
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

// Cache First для статичних ресурсів (улучшена версія)
async function handleStaticResource(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('📦 Завантажено з кешу:', request.url);
        return cachedResponse;
    }
    
    try {
        console.log('🌐 Завантажуємо з мережі:', request.url);
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            // Клонуємо відповідь для кешування
            cache.put(request, networkResponse.clone());
            console.log('💾 Додано до кешу:', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('📱 Статичний ресурс недоступний офлайн:', request.url);
        
        // Спробуємо знайти альтернативу в кеші
        const fallbackResponse = await findFallbackResource(request);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        
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
        return await caches.match('./pages/offline.html') || await caches.match('./index.html');
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
        return await caches.match('./pages/offline.html') || await caches.match('./index.html');
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

// Функція для пошуку резервних ресурсів
async function findFallbackResource(request) {
    const url = new URL(request.url);
    
    // Для CSS файлів можемо повернути основний CSS
    if (url.pathname.includes('.css')) {
        return await caches.match('./assets/css/main.css');
    }
    
    // Для JS файлів пробуємо основний скрипт
    if (url.pathname.includes('.js')) {
        return await caches.match('./assets/js/app.js');
    }
    
    // Для зображень повертаємо логотип
    if (isImageResource(url.pathname)) {
        return await caches.match('./assets/images/logo.svg') || 
               await createOfflineImageResponse();
    }
    
    return null;
}

// Функція для примусового оновлення кешу
async function forceUpdateCache() {
    try {
        console.log('🔄 Початок примусового оновлення кешу...');
        
        // Видаляємо всі старі кеші
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        // Створюємо новий кеш з актуальними ресурсами
        const cache = await caches.open(CACHE_NAME);
        
        // Кешуємо ресурси з примусовим перезавантаженням
        const cachePromises = STATIC_CACHE_URLS.map(async url => {
            try {
                const request = new Request(url, { cache: 'no-cache' });
                const response = await fetch(request);
                if (response.ok) {
                    await cache.put(url, response);
                    console.log(`🔄 Оновлено в кеші: ${url}`);
                }
            } catch (error) {
                console.warn(`⚠️ Не вдалося оновити ${url}:`, error.message);
            }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('✅ Примусове оновлення кешу завершено');
        
        // Повідомляємо всім клієнтам про оновлення
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_UPDATED',
                version: CACHE_VERSION
            });
        });
        
    } catch (error) {
        console.error('❌ Помилка примусового оновлення кешу:', error);
    }
}

console.log(`🎯 Service Worker завантажено для Асистента НУОС (версія ${CACHE_VERSION}, timestamp: ${SW_TIMESTAMP})`);
