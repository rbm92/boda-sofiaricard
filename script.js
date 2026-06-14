// CONFIGURACIÓN
const targetDate = new Date('September 12, 2026 16:00:00').getTime();

// 1. UNIFICACIÓN DE EVENTOS (Optimizado para FPS)
let isScrolling = false;

const handleScroll = () => {
    if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
            reveal();
            updateActiveMenu();
            toggleBackToTop();
            isScrolling = false;
        });
    }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// 2. COUNTDOWN (Sin romper el DOM)
function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const now = new Date().getTime();
    const gap = targetDate - now;

    if (gap <= 0) {
        const cd = document.getElementById('countdown');
        if (cd) cd.textContent = "¡Ha llegado el día!";
        return;
    }

    const hour = 1000 * 60 * 60;
    const day = hour * 24;

    if (daysEl && hoursEl) {
        daysEl.textContent = Math.floor(gap / day).toString().padStart(2, '0');
        hoursEl.textContent = Math.floor((gap % day) / hour).toString().padStart(2, '0');
    }
}
setInterval(updateCountdown, 1000);

// 3. REVEAL Y MENÚ ACTIVO (Combinados)
function reveal() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
}

function updateActiveMenu() {
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('nav ul li a');
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // Ajuste elástico de 120px para que cambie justo cuando el título asoma
        if (window.scrollY >= (sectionTop - 120)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
}

function toggleBackToTop() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        btn.style.display = (window.scrollY > 400) ? 'block' : 'none';
    }
}

// 4. COPY TO CLIPBOARD (Mejorado con feedback visual)
async function copyToClipboard(elementId, btnElement) {
    const text = document.getElementById(elementId).innerText;
    try {
        await navigator.clipboard.writeText(text);
        const originalIcon = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.classList.add('copy-success');

        setTimeout(() => {
            btnElement.innerHTML = originalIcon;
            btnElement.classList.remove('copy-success');
        }, 2000);
    } catch (err) {
        console.error('Error al copiar', err);
    }
}

// --- SINCRONIZACIÓN DE SLIDER DOTS ---
const slider = document.querySelector('.story-slider');
const dots = document.querySelectorAll('.dot');

if (slider && dots.length > 0) {
    const updateActiveDot = (index) => {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    };

    let isScrollingSlider;
    slider.addEventListener('scroll', () => {
        window.clearTimeout(isScrollingSlider);
        isScrollingSlider = setTimeout(() => {
            const width = slider.getBoundingClientRect().width;
            const index = Math.round(slider.scrollLeft / width);
            updateActiveDot(index);
        }, 50);
    }, { passive: true });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const width = slider.getBoundingClientRect().width;

            slider.scrollTo({
                left: width * index,
                behavior: 'smooth'
            });
            updateActiveDot(index);
        });
    });
}

// --- CONTROL DEL MENÚ HAMBURGUESA MÓVIL (CORREGIDO) ---
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.querySelector('nav'); // CORREGIDO: Selecciona la etiqueta <nav> directamente
const navLinks = document.querySelectorAll('nav ul li a');

if (menuToggle && mainNav) {
    // Alternar menú al pulsar el botón
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el click se propague al documento
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Cerrar menú automáticamente al pulsar cualquier enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // MEJORA: Cierra la cortina si el invitado pulsa fuera del menú móvil
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
}

// Función para volver arriba
function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    // Respaldo para navegadores antiguos
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// INICIO
window.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    reveal();
});
