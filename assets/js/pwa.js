// ===== PWA ФУНКЦІОНАЛЬНІСТЬ ДЛЯ АСИСТЕНТА НУОС =====

console.log('🚀 PWA скрипт завантажено');

// Перевірка підтримки PWA функцій
if ('serviceWorker' in navigator) {
    console.log('✅ Service Worker підтримується');
    
    // Реєстрація Service Worker
    registerServiceWorker();
} else {
    console.log('❌ Service Worker не підтримується');
}

// ===== SERVICE WORKER РЕЄСТРАЦІЯ =====
async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('./service-worker.js', {
            scope: './'
        });
        console.log('✅ Service Worker зареєстровано:', registration.scope);
        
        // Обробка оновлень
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 Знайдено оновлення Service Worker');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    showUpdateNotification();
                }
            });
        });
        
        // Перевіряємо чи є активний SW
        if (registration.active) {
            console.log('✅ Service Worker активний та готовий до роботи');
        }
        
        return registration;
    } catch (error) {
        console.error('❌ Помилка реєстрації Service Worker:', error);
        showNotification('Помилка ініціалізації офлайн режиму', 'error');
        return null;
    }
}

function showUpdateNotification() {
    const updateBtn = document.createElement('button');
    updateBtn.textContent = 'Оновити додаток';
    updateBtn.style.cssText = `
        background: white;
        color: #667eea;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        margin-left: 10px;
    `;
    
    updateBtn.addEventListener('click', () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg?.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                }
            });
        }
    });
    
    showNotification('🔄 Доступне оновлення додатка!', 'info', updateBtn);
}

// ===== INSTALL PROMPT =====
let deferredPrompt;
let installButton;

// Перехоплюємо подію встановлення PWA
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA можна встановити');
    
    // Запобігаємо автоматичному показу
    e.preventDefault();
    
    // Зберігаємо подію для пізнішого використання
    deferredPrompt = e;
    
    // Показуємо кнопку встановлення
    showInstallButton();
});

// Відстежуємо успішне встановлення
window.addEventListener('appinstalled', (evt) => {
    console.log('🎉 PWA успішно встановлено');
    hideInstallButton();
    
    // Показуємо повідомлення
    showNotification('Асистент НУОС встановлено!', 'success');
});

// ===== ФУНКЦІЇ ВСТАНОВЛЕННЯ =====

function showInstallButton() {
    // Створюємо кнопку встановлення якщо її немає
    if (!installButton) {
        createInstallButton();
    }
    
    if (installButton) {
        installButton.style.display = 'block';
        
        // Автоматично приховуємо через 10 секунд
        setTimeout(() => {
            if (installButton) {
                installButton.style.display = 'none';
            }
        }, 10000);
    }
}

function hideInstallButton() {
    if (installButton) {
        installButton.style.display = 'none';
    }
}

function createInstallButton() {
    // Створюємо стильну кнопку встановлення
    installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.innerHTML = `
        <i class="fas fa-download"></i>
        Встановити додаток
    `;
    
    // Стилізуємо кнопку
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        display: none;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    // Додаємо hover ефект
    installButton.addEventListener('mouseenter', () => {
        installButton.style.transform = 'translateY(-2px)';
        installButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
    });
    
    installButton.addEventListener('mouseleave', () => {
        installButton.style.transform = 'translateY(0)';
        installButton.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
    });
    
    // Обробник кліку
    installButton.addEventListener('click', installPWA);
    
    // Додаємо до сторінки
    document.body.appendChild(installButton);
}

async function installPWA() {
    if (!deferredPrompt) {
        console.log('❌ Prompt недоступний');
        return;
    }
    
    // Показуємо prompt
    deferredPrompt.prompt();
    
    // Чекаємо на вибір користувача
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`👤 Користувач ${outcome} встановлення`);
    
    if (outcome === 'accepted') {
        showNotification('Встановлення почалося...', 'info');
    }
    
    // Очищуємо змінну
    deferredPrompt = null;
    hideInstallButton();
}

// ===== ПОВІДОМЛЕННЯ =====

function showNotification(message, type = 'info', extraElement = null) {
    // Створюємо контейнер для повідомлень якщо його немає
    let container = document.getElementById('pwa-notifications');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pwa-notifications';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 350px;
        `;
        document.body.appendChild(container);
    }
    
    // Створюємо повідомлення
    const notification = document.createElement('div');
    
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        info: '#2196F3',
        warning: '#FF9800'
    };
    
    notification.style.cssText = `
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    `;
    
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    notification.appendChild(messageDiv);
    
    if (extraElement) {
        notification.appendChild(extraElement);
    }
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        margin-left: 10px;
    `;
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    notification.appendChild(closeBtn);
    
    container.appendChild(notification);
    
    // Анімація появи
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматичне приховування
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, extraElement ? 10000 : 5000); // Більше часу якщо є кнопка
}

// ===== OFFLINE ІНДИКАТОР =====

function createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.innerHTML = `
        <div class="offline-indicator-content">
            <div class="offline-indicator-icon">
                <i class="fas fa-wifi-slash"></i>
            </div>
            <div class="offline-indicator-text">
                <span class="offline-indicator-title">Офлайн режим</span>
                <span class="offline-indicator-subtitle">PWA активний</span>
            </div>
            <div class="offline-indicator-pulse"></div>
        </div>
    `;
    
    indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        z-index: 10000;
        transform: translateY(-100%);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        backdrop-filter: blur(10px);
    `;
    
    // Добавляем стили для содержимого
    const style = document.createElement('style');
    style.textContent = `
        .offline-indicator-content {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            max-width: 1200px;
            margin: 0 auto;
            gap: 12px;
            position: relative;
        }
        
        .offline-indicator-icon {
            font-size: 18px;
            color: #fff;
            animation: offline-pulse 2s infinite;
        }
        
        @keyframes offline-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        
        .offline-indicator-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .offline-indicator-title {
            font-size: 14px;
            font-weight: 600;
        }
        
        .offline-indicator-subtitle {
            font-size: 12px;
            opacity: 0.8;
        }
        
        .offline-indicator-pulse {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #4CAF50;
            margin-left: auto;
            animation: status-pulse 1.5s infinite;
        }
        
        @keyframes status-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        @media (max-width: 768px) {
            .offline-indicator-content {
                padding: 10px 15px;
                gap: 10px;
            }
            
            .offline-indicator-title {
                font-size: 13px;
            }
            
            .offline-indicator-subtitle {
                font-size: 11px;
            }
        }
    `;
    
    if (!document.getElementById('offline-indicator-styles')) {
        style.id = 'offline-indicator-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
    return indicator;
}

// Моніторинг з'єднання
let offlineIndicator;
let pwaNотificationShown = false;

window.addEventListener('online', () => {
    console.log('🌐 З\'єднання відновлено');
    pwaNотificationShown = false;
    if (offlineIndicator) {
        offlineIndicator.style.transform = 'translateY(-100%)';
    }
    // Уведомление показывается только в app.js
});

window.addEventListener('offline', () => {
    console.log('📱 Режим офлайн');
    if (!offlineIndicator) {
        offlineIndicator = createOfflineIndicator();
    }
    offlineIndicator.style.transform = 'translateY(0)';
    // Уведомление показывается только в app.js, избегаем дублирования
});

// ===== ОНОВЛЕННЯ PWA =====

// Відстежування оновлень Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker оновлено');
        showNotification('Додаток оновлено!', 'success');
        
        // Опціонально перезавантажуємо сторінку
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// ===== ІНШІ PWA ФУНКЦІЇ =====

// Попередження про закриття в standalone режимі
window.addEventListener('beforeunload', (e) => {
    // Перевіряємо чи додаток запущено в standalone режимі
    if (window.matchMedia('(display-mode: standalone)').matches) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Приховування адресного рядка на мобільних
function hideAddressBar() {
    if (window.innerHeight < window.outerHeight) {
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 100);
    }
}

// Запускаємо при завантаженні
window.addEventListener('load', () => {
    hideAddressBar();
    
    // Перевіряємо чи PWA вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 PWA запущено в standalone режимі');
    }
});

console.log('✅ PWA функціональність ініціалізовано');
