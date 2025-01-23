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

// Функция для обновления счетчика до лета
function updateCountdown() {
    const now = new Date();
    const summerStart = new Date(now.getFullYear(), 5, 1); // 1 июня текущего года
    
    // Если текущая дата после 1 июня, берем 1 июня следующего года
    if (now > summerStart) {
        summerStart.setFullYear(summerStart.getFullYear() + 1);
    }
    
    const diff = summerStart - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = days;
    }
}

// Анимация появления элементов при скролле
function animateOnScroll() {
    const elements = document.querySelectorAll('.benefit-card, .result-card, .criteria-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

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
    updateCountdown();
    animateOnScroll();
    animateIcons();
    animateCheckmarks();
    animateButtons();
    
    // Обновляем счетчик каждый день в полночь
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateCountdown();
        }
    }, 60000); // Проверяем каждую минуту
});
