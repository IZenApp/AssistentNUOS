// ===== ГОЛОВНИЙ JAVASCRIPT ФАЙЛ =====

// Глобальні змінні
let isOnline = navigator.onLine;
let deferredPrompt;

// ===== ІНІЦІАЛІЗАЦІЯ =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚀 Ініціалізація Асистента НУОС');
    
    // Основні функції
    initializeNavigation();
    initializeTheme();
    initializePWA();
    initializeOfflineDetection();
    initializeAccessibility();
    initializeAnalytics();
    
    // Анімації
    initializeAnimations();
    
    console.log('✅ Асистент НУОС готовий до роботи');
}

// ===== НАВІГАЦІЯ =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Підсвітка активної сторінки
    highlightCurrentPage();
    
    // Мобільне меню
    createMobileMenu();
    
    // Плавна прокрутка для якорних посилань
    initializeSmoothScroll();
}

function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            link.classList.add('active');
        }
    });
}

function createMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    // Обробник кліку на бургер меню
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Блокуємо скрол body коли меню відкрите
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Закриваємо меню при кліку на посилання
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закриваємо меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Закриваємо меню при зміні розміру екрану
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== ТЕМА =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('nuos-theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nuos-theme', theme);
    
    // Оновлюємо колір теми для PWA
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.content = theme === 'dark' ? '#212121' : '#2196F3';
    }
}

// ===== PWA ФУНКЦІЇ =====
function initializePWA() {
    // Реєстрація Service Worker
    registerServiceWorker();
    
    // Обробка встановлення PWA
    handlePWAInstall();
    
    // Обробка оновлень
    handlePWAUpdates();
}

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', {
                scope: './'
            });
            console.log('✅ Service Worker зареєстровано:', registration.scope);
            
            // Перевіряємо оновлення
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('❌ Помилка реєстрації Service Worker:', error);
        }
    }
}

function handlePWAInstall() {
    // Зберігаємо подію для пізнішого використання
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Обробляємо успішне встановлення
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA встановлено успішно');
        hideInstallPrompt();
        showNotification('Додаток встановлено!', 'success');
    });
}

function showInstallPrompt() {
    let installPrompt = document.querySelector('.pwa-install-prompt');
    
    if (!installPrompt) {
        installPrompt = createInstallPrompt();
        document.body.appendChild(installPrompt);
    }
    
    setTimeout(() => {
        installPrompt.classList.add('show');
    }, 3000); // Показуємо через 3 секунди
}

function createInstallPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'pwa-install-prompt';
    prompt.innerHTML = `
        <img src="/assets/images/logo.svg" alt="НУОС" class="pwa-install-icon">
        <div class="pwa-install-content">
            <div class="pwa-install-title">Встановити Асистент НУОС</div>
            <div class="pwa-install-description">Отримайте швидкий доступ до всіх функцій</div>
        </div>
        <div class="pwa-install-buttons">
            <button class="btn btn-primary btn-sm install-btn">Встановити</button>
            <button class="btn btn-ghost btn-sm dismiss-btn">Пізніше</button>
        </div>
    `;
    
    // Обробники подій
    const installBtn = prompt.querySelector('.install-btn');
    const dismissBtn = prompt.querySelector('.dismiss-btn');
    
    installBtn.addEventListener('click', installPWA);
    dismissBtn.addEventListener('click', hideInstallPrompt);
    
    return prompt;
}

async function installPWA() {
    if (!deferredPrompt) return;
    
    try {
        const result = await deferredPrompt.prompt();
        console.log('Результат встановлення PWA:', result.outcome);
        deferredPrompt = null;
        hideInstallPrompt();
    } catch (error) {
        console.error('Помилка встановлення PWA:', error);
    }
}

function hideInstallPrompt() {
    const installPrompt = document.querySelector('.pwa-install-prompt');
    if (installPrompt) {
        installPrompt.classList.remove('show');
        setTimeout(() => {
            installPrompt.remove();
        }, 300);
    }
}

function handlePWAUpdates() {
    let newWorkerAvailable = false;
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (newWorkerAvailable) {
                window.location.reload();
            }
        });
    }
}

function showUpdateNotification() {
    const notification = createNotification(
        'Доступне оновлення!',
        'Натисніть для оновлення додатка',
        'info',
        () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg && reg.waiting) {
                        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    }
                });
            }
        }
    );
    
    document.body.appendChild(notification);
}

// ===== ОФЛАЙН ДЕТЕКЦІЯ =====
let offlineNotificationShown = false;

function initializeOfflineDetection() {
    updateOnlineStatus();
    
    window.addEventListener('online', () => {
        isOnline = true;
        offlineNotificationShown = false;
        updateOnlineStatus();
        showNotification('🌐 З\'єднання відновлено!', 'success');
    });
    
    window.addEventListener('offline', () => {
        isOnline = false;
        updateOnlineStatus();
        if (!offlineNotificationShown) {
            showNotification('🌐 Втрачено з\'єднання з інтернетом', 'warning');
            offlineNotificationShown = true;
        }
    });
}

function updateOnlineStatus() {
    const offlineBanner = document.querySelector('.offline-banner');
    
    if (!isOnline) {
        if (!offlineBanner) {
            const banner = document.createElement('div');
            banner.className = 'offline-banner';
            banner.innerHTML = `
                <div class="offline-banner-content">
                    <div class="offline-banner-icon">
                        <i class="fas fa-wifi-slash"></i>
                    </div>
                    <div class="offline-banner-text">
                        <strong>Немає підключення до інтернету</strong>
                        <span>Не хвилюйтесь! Більшість функцій працюють офлайн завдяки PWA технології</span>
                    </div>
                    <button class="offline-banner-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            document.body.prepend(banner);
            
            setTimeout(() => banner.classList.add('show'), 100);
        }
    } else {
        if (offlineBanner) {
            offlineBanner.classList.remove('show');
            setTimeout(() => {
                if (offlineBanner.parentNode) {
                    offlineBanner.remove();
                }
            }, 300);
        }
    }
}

// ===== ДОСТУПНІСТЬ =====
function initializeAccessibility() {
    // Фокус для клавіатурної навігації
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== АНІМАЦІЇ =====
function initializeAnimations() {
    // Intersection Observer для анімацій при прокрутці
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Спостерігаємо за елементами
    document.querySelectorAll('.card, .feature-card, .team-member').forEach(el => {
        observer.observe(el);
    });
}

// ===== АНАЛІТИКА =====
function initializeAnalytics() {
    // Відстежування переглядів сторінок
    trackPageView();
    
    // Відстежування кліків
    document.addEventListener('click', (e) => {
        if (e.target.matches('a, button')) {
            trackEvent('click', {
                element: e.target.tagName,
                text: e.target.textContent.trim(),
                href: e.target.href || null
            });
        }
    });
}

function trackPageView() {
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language
    };
    
    console.log('📊 Перегляд сторінки:', pageData);
    // Тут можна додати відправку до аналітичного сервісу
}

function trackEvent(eventName, data) {
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    console.log('📊 Подія:', eventData);
    // Тут можна додати відправку до аналітичного сервісу
}

// ===== УТИЛІТИ =====
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotification(message, '', type);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function createNotification(title, message, type, onClick) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            ${message ? `<div class="notification-message">${message}</div>` : ''}
        </div>
        <button class="notification-close">✕</button>
    `;
    
    // Стилі
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : 
                   type === 'warning' ? '#FF9800' : 
                   type === 'error' ? '#F44336' : '#2196F3',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1080',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        maxWidth: '300px'
    });
    
    // Обробники
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    if (onClick) {
        notification.addEventListener('click', onClick);
        notification.style.cursor = 'pointer';
    }
    
    // Показуємо
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.classList.add('show');
    }, 100);
    
    return notification;
}

// ===== ЕКСПОРТ ФУНКЦІЙ =====
window.NuosApp = {
    showNotification,
    trackEvent,
    setTheme,
    installPWA,
    isOnline: () => isOnline
};

// ===== CSS ДЛЯ ДИНАМІЧНИХ ЕЛЕМЕНТІВ =====
const style = document.createElement('style');
style.textContent = `
    .navbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }
    
    .mobile-menu-toggle {
        display: none;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: white;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .mobile-menu-toggle:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .navbar-nav {
        display: flex;
        list-style: none;
        gap: 1rem;
        margin: 0;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
        }
        
        .navbar-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 2rem;
            transform: translateX(100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            padding: 2rem;
        }
        
        .navbar-nav.show {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
        }
        
        .navbar-nav li {
            width: 100%;
            max-width: 300px;
        }
        
        .navbar-nav .nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            width: 100%;
            font-size: 1.1rem;
        }
        
        .navbar-nav .nav-link:hover,
        .navbar-nav .nav-link.active {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .navbar-nav .nav-link i {
            font-size: 1.2rem;
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.8;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .pwa-install-prompt {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 90vw;
        width: 350px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1100;
    }
    
    .pwa-install-prompt.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .pwa-install-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
    }
    
    .pwa-install-content {
        flex: 1;
    }
    
    .pwa-install-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #333;
    }
    
    .pwa-install-description {
        font-size: 0.9rem;
        color: #666;
    }
    
    .pwa-install-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    /* Офлайн баннер стилі */
    .offline-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        z-index: 10000;
        transform: translateY(-100%);
        transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
        backdrop-filter: blur(10px);
    }
    
    .offline-banner.show {
        transform: translateY(0);
    }
    
    .offline-banner-content {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        max-width: 1200px;
        margin: 0 auto;
        gap: 15px;
    }
    
    .offline-banner-icon {
        font-size: 24px;
        color: white;
        animation: pulse-wifi 2s infinite;
    }
    
    @keyframes pulse-wifi {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
    
    .offline-banner-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .offline-banner-text strong {
        font-size: 16px;
        font-weight: 600;
    }
    
    .offline-banner-text span {
        font-size: 14px;
        opacity: 0.9;
        line-height: 1.4;
    }
    
    .offline-banner-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        font-size: 14px;
    }
    
    .offline-banner-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
    }
    
    @media (max-width: 768px) {
        .offline-banner-content {
            padding: 12px 15px;
            gap: 12px;
        }
        
        .offline-banner-text strong {
            font-size: 14px;
        }
        
        .offline-banner-text span {
            font-size: 13px;
        }
        
        .offline-banner-icon {
            font-size: 20px;
        }
    }
`;
document.head.appendChild(style);
