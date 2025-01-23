// Функция анимации чисел
function animateNumber(element, target) {
    let current = 0;
    const duration = 2000; // 2 секунды
    const step = target / (duration / 16); // 60 FPS
    
    const update = () => {
        current += step;
        if (current > target) {
            current = target;
        }
        element.textContent = Math.floor(current);
        
        if (current < target) {
            requestAnimationFrame(update);
        }
    };
    
    update();
}

// Функция для проверки видимости элемента
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Запуск анимации при прокрутке
let animated = false;
function handleScroll() {
    if (animated) return;
    
    const statsSection = document.querySelector('.stats');
    if (isElementInViewport(statsSection)) {
        const numbers = document.querySelectorAll('.stat-number');
        numbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            animateNumber(number, target);
        });
        animated = true;
        // Удаляем обработчик после первой анимации
        window.removeEventListener('scroll', handleScroll);
    }
}

// Добавляем обработчик прокрутки
window.addEventListener('scroll', handleScroll);
// Проверяем видимость при загрузке страницы
handleScroll();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    menuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        menuBtn.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Close menu when clicking on a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && 
            !event.target.closest('.mobile-menu-btn') && 
            mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuBtn.textContent = '☰';
        }
    });
});

// Countdown Timer
function updateCountdown() {
    // Устанавливаем конечную дату - 1 июня 2025
    const summerDate = new Date('2025-06-01T00:00:00');
    // Текущая дата
    const now = new Date();
    
    // Разница в миллисекундах
    const diff = summerDate.getTime() - now.getTime();
    
    if (diff <= 0) {
        document.getElementById('days').textContent = "00";
        document.querySelector('.days-label').textContent = "дней";
        document.querySelector('.timer-text').textContent = "Лето уже наступило!";
        document.querySelector('.progress-fill').style.width = '100%';
        return;
    }
    
    // Конвертируем разницу в дни
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    // Форматируем число дней (добавляем ведущий ноль)
    const formattedDays = days < 10 ? `0${days}` : days;
    
    // Обновляем число
    document.getElementById('days').textContent = formattedDays;
    
    // Обновляем склонение слова "дней"
    const daysText = getDaysText(days);
    document.querySelector('.days-label').textContent = daysText;
    
    // Рассчитываем прогресс (от 1 марта до 1 июня)
    const springDate = new Date('2025-03-01T00:00:00');
    const totalPeriod = summerDate.getTime() - springDate.getTime();
    const elapsedTime = now.getTime() - springDate.getTime();
    const progress = Math.min(Math.max((elapsedTime / totalPeriod) * 100, 0), 100);
    
    // Обновляем прогресс-бар
    document.querySelector('.progress-fill').style.width = `${progress}%`;
}

// Функция для правильного склонения слова "дней"
function getDaysText(days) {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'дней';
    }
    
    if (lastDigit === 1) {
        return 'день';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'дня';
    }
    
    return 'дней';
}

// Обновляем счетчик каждый день в полночь
function scheduleNextUpdate() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    // Обновляем сейчас
    updateCountdown();
    
    // Устанавливаем таймер на следующее обновление в полночь
    setTimeout(() => {
        updateCountdown();
        // Запускаем регулярное обновление каждые 24 часа
        setInterval(updateCountdown, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}

// Запускаем таймер при загрузке страницы
document.addEventListener('DOMContentLoaded', scheduleNextUpdate);

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes and observe elements
document.querySelectorAll('.benefit-card, .result-card, .criteria-item, .price-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add hover animations for cards
document.querySelectorAll('.benefit-card, .result-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Add pulse animation to CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.querySelector('i').style.transform = 'translateX(5px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.querySelector('i').style.transform = 'translateX(0)';
    });
});

// Add scroll-triggered animations
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
    
    // Animate numbers when in view
    document.querySelectorAll('.result-card h3').forEach(number => {
        const position = number.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (position < screenPosition) {
            number.classList.add('number-animation');
        }
    });
});

// Анимация иконок в карточках
function animateIcons() {
    const icons = document.querySelectorAll('.benefit-card i, .result-card i');
    icons.forEach(icon => {
        icon.style.fontSize = '2.5rem';
        icon.style.color = '#6B50F6';
        icon.style.marginBottom = '20px';
        icon.style.display = 'block';
        
        // Добавляем эффект пульсации при наведении
        icon.parentElement.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        icon.parentElement.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
        });
    });
}

// Анимация чекмарков в критериях
function animateCheckmarks() {
    const checkmarks = document.querySelectorAll('.criteria-item i');
    checkmarks.forEach(checkmark => {
        checkmark.style.color = '#6B50F6';
        checkmark.style.marginRight = '10px';
    });
}

// Анимация кнопок
function animateButtons() {
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(5px)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
        
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// Инициализация всех анимаций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    animateIcons();
    animateCheckmarks();
    animateButtons();
});

// Smooth scroll for navigation
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
