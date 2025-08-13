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
    const navbar = document.querySelector('.navbar');
    const navList = document.querySelector('.navbar-nav');
    
    if (!navbar || !navList) return;
    
    // Створюємо кнопку мобільного меню
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle btn btn-ghost';
    mobileToggle.innerHTML = '☰';
    mobileToggle.setAttribute('aria-label', 'Відкрити меню');
    
    // Додаємо обробник
    mobileToggle.addEventListener('click', () => {
        navList.classList.toggle('show');
        const isOpen = navList.classList.contains('show');
        mobileToggle.innerHTML = isOpen ? '✕' : '☰';
        mobileToggle.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    });
    
    navbar.appendChild(mobileToggle);
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
            const registration = await navigator.serviceWorker.register('/service-worker.js');
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
        <img src="/assets/images/logo.png" alt="НУОС" class="pwa-install-icon">
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
function initializeOfflineDetection() {
    updateOnlineStatus();
    
    window.addEventListener('online', () => {
        isOnline = true;
        updateOnlineStatus();
        showNotification('З\'єднання відновлено!', 'success');
    });
    
    window.addEventListener('offline', () => {
        isOnline = false;
        updateOnlineStatus();
        showNotification('Немає з\'єднання з інтернетом', 'warning');
    });
}

function updateOnlineStatus() {
    const offlineBanner = document.querySelector('.offline-banner');
    
    if (!isOnline) {
        if (!offlineBanner) {
            const banner = document.createElement('div');
            banner.className = 'offline-banner';
            banner.textContent = '📴 Немає з\'єднання з інтернетом. Деякі функції можуть бути недоступні.';
            document.body.prepend(banner);
            
            setTimeout(() => banner.classList.add('show'), 100);
        }
    } else {
        if (offlineBanner) {
            offlineBanner.classList.remove('show');
            setTimeout(() => offlineBanner.remove(), 300);
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
    .mobile-menu-toggle {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-toggle {
            display: flex;
        }
        
        .navbar-nav {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card);
            flex-direction: column;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all var(--transition-normal);
        }
        
        .navbar-nav.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
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
`;
document.head.appendChild(style);
