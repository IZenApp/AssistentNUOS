# 🚢 AssistentNUOS - Студентський помічник НУК

<div align="center">

![AssistentNUOS Logo](assets/images/logo.svg)

**🎓 Прогресивний веб-додаток для студентів НУК імені адмірала Макарова**

[![🌐 Website](https://img.shields.io/badge/Website-Live-success?style=for-the-badge&logo=github-pages)](https://izenapp.github.io/AssistentNUOS/)
[![📱 PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen?style=for-the-badge&logo=pwa)](https://developers.google.com/web/progressive-web-apps/)
[![⚡ Performance](https://img.shields.io/badge/Performance-A+-orange?style=for-the-badge&logo=lighthouse)](https://pagespeed.web.dev/)
[![🔒 MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&logo=open-source-initiative)](LICENSE)

### 🌟 [**Відкрити додаток →**](https://izenapp.github.io/AssistentNUOS/)

*Ваш надійний супутник у навчальному процесі*

</div>

---

## 🎯 Про проект

> **AssistentNUOS** - це інноваційний прогресивний веб-додаток, розроблений студентами для студентів Національного університету кораблебудування імені адмірала Макарова. Наша місія - спростити та покращити університетське життя за допомогою сучасних веб-технологій.

### 💡 Чому AssistentNUOS?

- 🚀 **Швидкість** - Миттєве завантаження завдяки PWA технологіям
- 📱 **Зручність** - Працює на всіх пристроях як нативний додаток  
- 🌐 **Доступність** - Офлайн підтримка для роботи без інтернету
- 🎨 **Сучасність** - Елегантний Glassmorphism дизайн
- 🔒 **Надійність** - Безпечне HTTPS з'єднання та кешування

## ✨ Основні можливості

### 📚 Розділи додатку

| 🔗 Розділ | 📋 Опис | 🎯 Призначення |
|-----------|---------|----------------|
| 🏠 **Головна** | Центр управління всіма функціями | Швидкий доступ та навігація |
| 👥 **Про нас** | Команда розробників та історія проекту | Знайомство з авторами |
| 🏛️ **Університет** | Повна інформація про НУК | Історія, факультети, контакти |
| 📅 **Розклад** | Розклад дзвінків та календар | Планування навчального дня |
| 👔 **Керівництво** | Адміністрація та управління | Контакти керівництва |
| 🏛️ **Студсамоврядування** | Органи студентського представництва | Громадське життя |

### 🚀 PWA супер-функції

<div align="center">

| Функція | Переваги | Статус |
|---------|----------|--------|
| 📱 **Встановлення** | Працює як нативний додаток | ✅ Готово |
| 🌐 **Офлайн режим** | Повний доступ без інтернету | ✅ Готово |
| ⚡ **Швидке завантаження** | Кешування всіх ресурсів | ✅ Готово |
| � **Push-сповіщення** | Важливі оновлення | 🔧 В розробці |
| 🔄 **Автооновлення** | Завжди остання версія | ✅ Готово |

</div>

## 🛠️ Технологічний стек

<div align="center">

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)

### Стилізація
![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=flat-square&logo=fontawesome&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Glassmorphism](https://img.shields.io/badge/Glassmorphism-667eea?style=flat-square&logo=css3&logoColor=white)

### Інструменти
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)
![Service Worker](https://img.shields.io/badge/Service_Worker-FF6B6B?style=flat-square&logo=pwa&logoColor=white)
![Web Manifest](https://img.shields.io/badge/Web_Manifest-4285F4?style=flat-square&logo=google-chrome&logoColor=white)

</div>

## 🎨 Дизайн-система

### 🌟 Glassmorphism UI
Сучасний дизайн з напівпрозорими елементами, blur-ефектами та елегантними градієнтами:

- **🔍 Прозорість** - Багатошарові glassmorphism ефекти
- **🌊 Анімації** - Плавні переходи та інтерактивні елементи  
- **📱 Адаптивність** - Ідеальний вигляд на всіх пристроях
- **🌙 Темна тема** - Елегантна кольорова палітра
- **✨ Інтерактивність** - Floating particles та hover ефекти

## � Архітектура проекту

```
📁 AssistentNUOS/
├── 📄 index.html                 # 🏠 Головна сторінка
├── 📄 manifest.json              # 📱 PWA конфігурація
├── 📄 service-worker.js          # ⚡ Кешування та офлайн (v7.6)
├── 📁 assets/
│   ├── 🎨 css/                   # Стилі та компоненти
│   │   ├── components.css        # 🧩 UI компоненти
│   │   ├── index.css            # 🏠 Головна сторінка
│   │   ├── about.css            # 👥 Сторінка команди
│   │   ├── university.css       # 🏛️ Університет
│   │   ├── schedule.css         # 📅 Розклад
│   │   └── leadership.css       # 👔 Керівництво
│   ├── ⚙️ js/                    # JavaScript модулі
│   │   ├── app.js              # 🚀 Основна логіка
│   │   └── pwa.js              # 📱 PWA функції
│   └── 🖼️ images/               # Медіафайли
│       ├── logo.svg            # 🎯 Основний логотип
│       ├── logo.png            # 🖼️ Fallback логотип
│       ├── icons/              # 📱 PWA іконки (72-512px)
│       └── avatars/            # 👤 Фото команди
└── 📁 pages/                     # 📑 Всі сторінки
    ├── about.html              # 👥 Команда розробників
    ├── university.html         # 🏛️ Про університет
    ├── schedule.html           # 📅 Розклад дзвінків
    ├── leadership.html         # 👔 Керівництво НУК
    ├── student-republic.html   # 🏛️ Студсамоврядування
    └── offline.html           # 📶 Офлайн режим
```

## 🚀 Швидкий старт

### 🌐 Використання
**[🔗 Відкрити AssistentNUOS →](https://izenapp.github.io/AssistentNUOS/)**

### 💻 Локальна розробка

```bash
# 📥 Клонування репозиторію
git clone https://github.com/IZenApp/AssistentNUOS.git
cd AssistentNUOS

# 🚀 Запуск локального сервера
python3 -m http.server 8080
# або
npx serve -l 8080

# 🌍 Відкрити в браузері
open http://localhost:8080
```

### 📱 Встановлення PWA

<div align="center">

| Платформа | Інструкція |
|-----------|------------|
| 🖥️ **Desktop** | Натисніть іконку "Встановити" в адресному рядку |
| 🤖 **Android** | Chrome → Меню → "Додати на головний екран" |
| 🍎 **iOS** | Safari → Поділитися → "На екран 'Домой'" |

</div>

### 🔧 Налаштування GitHub Pages

Якщо сайт показує 404 помилку:

1. **Settings** → **Pages**
2. **Source**: "Deploy from a branch"  
3. **Branch**: "main" + "/ (root)"
4. **Save** і зачекайте 5-10 хвилин ⏰

## 👥 Наша команда

<div align="center">

### 🎯 Керівництво проекту

| 👤 Особа | 🎓 Посада | 📧 Контакт |
|----------|-----------|-----------|
| **Олексюк Олеся** | 🏛️ Керівник Центру молодіжної політики | [📧 Email](mailto:center@nuos.edu.ua) |
| **Смалієвський Володимир** | 👥 Голова Студентської ради НУК | [📧 Email](mailto:studrada@nuos.edu.ua) |
| **Моісеєнко Катерина** | 🤝 Голова ППОС НУК | [📧 Email](mailto:profkom@nuos.edu.ua) |

### 💻 Команда розробки

| 👤 Розробник | 🛠️ Роль | 🌟 Внесок |
|--------------|---------|----------|
| **Бачула Євгеній** | 🚀 Lead Developer & Project Manager | Архітектура, PWA, Backend |
| **Гаврилюк Олена** | ✍️ Content Manager & UI/UX | Контент, дизайн, тестування |

</div>

## 🚀 Швидкий старт

### 🌐 Живий сайт
**[Відкрити AssistentNUOS →](https://izenapp.github.io/AssistentNUOS/)**

### Локальна розробка

#### Крок 1: Завантаження
```bash
git clone https://github.com/IZenApp/AssistentNUOS.git
cd AssistentNUOS
```

#### Крок 2: Запуск сервера
```bash
# 🐍 Python (рекомендовано)
python3 -m http.server 8080

# 📦 Node.js
npx serve -l 8080

# 🔧 PHP
php -S localhost:8080
```

#### Крок 3: Відкриття
Перейдіть за адресою: **http://localhost:8080**

### 🔧 Налаштування GitHub Pages

Якщо сайт не працює (404 помилка), виконайте ці кроки:

1. **Перейдіть в Settings репозиторію**
2. **Знайдіть розділ "Pages" в лівому меню**
3. **В "Source" оберіть "Deploy from a branch"**
4. **В "Branch" оберіть "main" та "/ (root)"**
5. **Натисніть "Save"**
6. **Зачекайте 5-10 хвилин для розгортання**

#### 🚨 Якщо PWA не встановлюється:

1. **Перевірте HTTPS:** Сайт має бути доступний по HTTPS
2. **Очистіть кеш:** Ctrl+Shift+R або Cmd+Shift+R
3. **Перевірте в інших браузерах:** Chrome, Firefox, Safari
4. **Мобільні пристрої:** Додайте на головний екран через меню браузера

## 📱 Встановлення PWA

### 🖥️ Десктоп (Chrome/Edge)
1. 🌐 Відкрийте сайт у браузері
2. 📲 Натисніть іконку "Встановити" в адресному рядку
3. ✅ Підтвердіть встановлення
4. 🎉 Користуйтесь як нативним додатком!

### 📱 Мобільні пристрої

#### Android (Chrome):
1. Відкрийте сайт в Chrome
2. Натисніть меню (три крапки)
3. Оберіть "Додати на головний екран"
4. Підтвердіть встановлення

#### iOS (Safari):
1. Відкрийте сайт в Safari
2. Натисніть кнопку "Поділитися"
3. Оберіть "На екран 'Домой'"
4. Натисніть "Добавить"

### 🔧 Вирішення проблем

#### Не показується кнопка встановлення:
- ✅ Перевірте, що сайт відкрито по HTTPS
- 🔄 Оновіть сторінку (Ctrl+F5)
- 🧹 Очистіть кеш браузера
- ⏳ Зачекайте кілька секунд після завантаження

#### Мобільне меню не відкривається:
- 🖱️ Натисніть на іконку ☰ (три лінії)
- 📱 Переконайтесь що JavaScript увімкнений
- 🔄 Перезавантажте сторінку

## 👥 Наша команда

<div align="center">

### 🎯 Керівництво проекту

| Посада | Ім'я | Роль |
|--------|------|------|
| 🏛️ | **Олексюк Олеся** | Керівник Центру молодіжної політики |
| 👥 | **Смалієвський Володимир** | Голова Студентської ради НУК |
| 🤝 | **Моісеєнко Катерина** | Голова ППОС НУК |

### 💻 Команда розробки

| Роль | Ім'я | Відповідальність |
|------|------|------------------|
| 🚀 | **Бачула Євгеній** | Lead Developer |
| ✍️ | **Гаврилюк Олена** | Content Manager |

</div>

## 🏛️ Університет

**Національний університет кораблебудування імені адмірала Макарова** - провідний морський університет України з багаторічною історією та традиціями.

[🔗 Детальніше про університет →](pages/university.html)

## 🤝 Як долучитися

Ми завжди раді новим учасникам проекту!

### 🛠️ Для розробників:
1. 🍴 Зробіть Fork репозиторію
2. 🌿 Створіть гілку: `git checkout -b feature/amazing-feature`
3. 💻 Внесіть зміни та зробіть commit
4. 📤 Відправте Pull Request
5. 🎉 Обговоримо та додамо!

## 🐛 Знайшли помилку?
- 📝 Створіть Issue з детальним описом
- 🔍 Додайте скріншоти якщо можливо
- 🏷️ Вкажіть браузер та пристрій

### 🔧 Відомі проблеми та рішення

#### 🚫 404 помилка при відкритті сайту:
**Причина:** GitHub Pages не налаштований
**Рішення:** 
1. Repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main" + "/ (root)"
4. Зачекайте 5-10 хвилин

#### 📱 Не працює мобільне меню:
**Причина:** JavaScript помилки або неправильна структура
**Рішення:**
1. Відкрийте Developer Tools (F12)
2. Перевірте Console на помилки
3. Оновіть сторінку

#### 🔄 PWA не оновлюється:
**Причина:** Старий Service Worker у кеші
**Рішення:**
1. Application → Storage → Clear storage
2. Або F12 → Application → Service Workers → Update

#### 📵 Не працює офлайн режим:
**Причина:** Service Worker не зареєстрований
**Рішення:**
1. Перевірте F12 → Application → Service Workers
2. Якщо немає - перезавантажте сторінку

### 💡 Є ідея?
- 💬 Обговоріть в Issues
- 📋 Опишіть функціонал
- 🎯 Поясніть користь для студентів

## 🏛️ Національний університет кораблебудування

<div align="center">

**🎓 Провідний морський університет України з багаторічною історією та традиціями**

� **Адреса:** пр. Героїв України, 9, Миколаїв, 54025  
☎️ **Телефон:** +38 (0512) 76-48-70  
🌐 **Сайт:** [nuos.edu.ua](https://nuos.edu.ua)  
📧 **Email:** info@nuos.edu.ua

</div>

## �📊 Статистика проекту

<div align="center">

| 📈 Метрика | 🔢 Значення | 📅 Статус |
|------------|-------------|-----------|
| 📄 **Сторінок** | 6 активних | ✅ Готово |
| 🎨 **CSS файлів** | 8 оптимізованих | ✅ Готово |
| ⚙️ **JS модулів** | 2 основних | ✅ Готово |
| 🖼️ **PWA іконок** | 9 розмірів | ✅ Готово |
| 📱 **PWA Score** | 100/100 | ✅ Ідеально |
| ⚡ **Performance** | A+ рейтинг | ✅ Швидко |
| 🔒 **Security** | HTTPS + CSP | ✅ Безпечно |

</div>

## 🌐 Сумісність браузерів

<div align="center">

| 🌍 Браузер | 📱 Версія | 🚀 PWA | 📶 Офлайн | 📊 Підтримка |
|------------|-----------|--------|-----------|--------------|
| ![Chrome](https://img.shields.io/badge/Chrome-67+-4285F4?style=flat-square&logo=google-chrome&logoColor=white) | 67+ | ✅ | ✅ | 🟢 Повна |
| ![Firefox](https://img.shields.io/badge/Firefox-44+-FF7139?style=flat-square&logo=firefox-browser&logoColor=white) | 44+ | ✅ | ✅ | 🟢 Повна |
| ![Safari](https://img.shields.io/badge/Safari-11.1+-000000?style=flat-square&logo=safari&logoColor=white) | 11.1+ | ✅ | ✅ | 🟢 Повна |
| ![Edge](https://img.shields.io/badge/Edge-17+-0078D4?style=flat-square&logo=microsoft-edge&logoColor=white) | 17+ | ✅ | ✅ | � Повна |

</div>

## 🏆 Ключові особливості

### 🎨 **Сучасний дизайн**
- ✨ **Glassmorphism UI** - Напівпрозорі елементи з blur-ефектами
- 🌙 **Темна тема** - Елегантна кольорова палітра з градієнтами
- 🎭 **Анімовані елементи** - Плавні переходи та інтерактивні ефекти
- 📱 **Адаптивна верстка** - Ідеальний вигляд на всіх пристроях

### ⚡ **Висока продуктивність**
- 🗄️ **Service Worker кешування** - Миттєве завантаження повторних візитів
- 🖼️ **Оптимізовані зображення** - SVG + WebP формати для швидкості
- ⏱️ **Мінімальний час завантаження** - < 3 секунд на 3G з'єднанні
- 🔄 **Smooth animations** - 60 FPS анімації з GPU прискоренням

### 📱 **Мобільна зручність**
- 🚀 **PWA технології** - Встановлення як нативний додаток
- 📶 **Офлайн доступ** - Повна функціональність без інтернету
- 👆 **Touch-friendly інтерфейс** - Великі touch targets (44px+)
- 🔄 **Автооновлення** - Завжди остання версія без перезавантаження

## 📄 Ліцензія

```
MIT License

Copyright (c) 2025 AssistentNUOS Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

**[📋 Повний текст ліцензії →](LICENSE)**

---

<div align="center">

## 🚢 Створено з ❤️ для студентів НУК

### 📊 **Версія 7.6** | 🗓️ **2025** | 📄 **MIT License**

[![⭐ Star on GitHub](https://img.shields.io/github/stars/IZenApp/AssistentNUOS?style=social)](https://github.com/IZenApp/AssistentNUOS)
[![🍴 Fork](https://img.shields.io/github/forks/IZenApp/AssistentNUOS?style=social)](https://github.com/IZenApp/AssistentNUOS/fork)
[![👀 Watch](https://img.shields.io/github/watchers/IZenApp/AssistentNUOS?style=social)](https://github.com/IZenApp/AssistentNUOS)

**🌟 Підтримайте проект - поставте зірку на GitHub!**

### 📞 Контакти проекту

[![📧 Email](https://img.shields.io/badge/Email-assistentnuos%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:assistentnuos@gmail.com)
[![💬 Telegram](https://img.shields.io/badge/Telegram-%40AssistentNUOS-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/AssistentNUOS)
[![🐙 GitHub](https://img.shields.io/badge/GitHub-IZenApp%2FAssistentNUOS-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/IZenApp/AssistentNUOS)

---

*💭 Маєте ідеї для покращення? [Створіть Issue](https://github.com/IZenApp/AssistentNUOS/issues/new) або надішліть [Pull Request](https://github.com/IZenApp/AssistentNUOS/compare)*

**🎓 Зроби свій внесок у розвиток університетського життя!**

</div>
