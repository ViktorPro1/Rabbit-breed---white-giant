'use strict';

// ==============================
// NAV — scroll state
// ==============================
const nav = document.querySelector('.nav');

function handleNavScroll() {
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ==============================
// NAV — mobile burger
// ==============================
const burger = document.getElementById('burger');

// Створюємо мобільне оверлей-меню
const overlay = document.createElement('div');
overlay.className = 'nav__mobile-overlay';
overlay.innerHTML = `
  <button class="nav__mobile-close" id="mobileClose" aria-label="Закрити меню">✕</button>
  <a href="#about"          data-mobile-link>Про породу</a>
  <a href="#characteristics" data-mobile-link>Стандарт</a>
  <a href="#housing"        data-mobile-link>Утримання</a>
  <a href="#feeding"        data-mobile-link>Годування</a>
  <a href="#breeding"       data-mobile-link>Розведення</a>
  <a href="#health"         data-mobile-link>Здоров'я</a>
`;
document.body.appendChild(overlay);

const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

burger.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);

overlay.querySelectorAll('[data-mobile-link]').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
});

// Закрити по Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
});

// ==============================
// BACK TO TOP
// ==============================
const backToTop = document.getElementById('backToTop');

function handleBackToTop() {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleBackToTop, { passive: true });

backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==============================
// SCROLL REVEAL
// ==============================
function initReveal() {
    // Додаємо клас .reveal до потрібних елементів
    var targets = [
        '.fact-card',
        '.housing__card',
        '.feeding__col',
        '.health__card',
        '.timeline__item',
        '.pros-cons__col',
        '.gallery__item',
        '.section__lead',
        '.about__text p',
        '.breeding__intro-text p',
        '.health__vaccine-note',
        '.housing__img-row figure'
    ];

    targets.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
            }
        });
    });

    // IntersectionObserver для reveal
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var delay = el.dataset.delay || 0;
                setTimeout(function () {
                    el.classList.add('visible');
                }, parseInt(delay, 10));
                revealObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
    });
}

// ==============================
// CHAR ITEMS — окремий observer
// ==============================
function initCharItems() {
    var charObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var delay = el.dataset.delay || 0;
                setTimeout(function () {
                    el.classList.add('visible');
                }, parseInt(delay, 10));
                charObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.char__item').forEach(function (el) {
        charObserver.observe(el);
    });
}

// ==============================
// STAGGERED DELAY для grid-карток
// ==============================
function applyStaggerDelay(selector, delayStep) {
    document.querySelectorAll(selector).forEach(function (el, i) {
        if (!el.dataset.delay) {
            el.dataset.delay = i * delayStep;
        }
    });
}

applyStaggerDelay('.fact-card', 70);
applyStaggerDelay('.housing__card', 80);
applyStaggerDelay('.feeding__col', 70);
applyStaggerDelay('.health__card', 80);
applyStaggerDelay('.gallery__item', 60);
applyStaggerDelay('.timeline__item', 90);

// ==============================
// ACTIVE NAV LINK (поточна секція)
// ==============================
var navLinks = document.querySelectorAll('.nav__links a');
var sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    var scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
        var sTop = section.offsetTop;
        var sBottom = sTop + section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollY >= sTop && scrollY < sBottom) {
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ==============================
// GALLERY LIGHTBOX (простий)
// ==============================
function initLightbox() {
    var items = document.querySelectorAll('.gallery__item');
    if (!items.length) return;

    // Створюємо lightbox DOM
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Перегляд зображення');
    lb.innerHTML = `
    <div class="lb__backdrop"></div>
    <div class="lb__inner">
      <button class="lb__close" aria-label="Закрити">✕</button>
      <button class="lb__prev" aria-label="Попереднє">‹</button>
      <button class="lb__next" aria-label="Наступне">›</button>
      <figure class="lb__figure">
        <img class="lb__img" src="" alt="" />
        <figcaption class="lb__caption"></figcaption>
      </figure>
    </div>
  `;
    document.body.appendChild(lb);

    var lbImg = lb.querySelector('.lb__img');
    var lbCaption = lb.querySelector('.lb__caption');
    var lbClose = lb.querySelector('.lb__close');
    var lbPrev = lb.querySelector('.lb__prev');
    var lbNext = lb.querySelector('.lb__next');
    var lbBackdrop = lb.querySelector('.lb__backdrop');

    var currentIndex = 0;
    var images = [];

    items.forEach(function (item) {
        var img = item.querySelector('img');
        var span = item.querySelector('span');
        if (img) {
            images.push({ src: img.src, alt: img.alt, caption: span ? span.textContent : '' });
        }
    });

    function openAt(index) {
        currentIndex = (index + images.length) % images.length;
        var data = images[currentIndex];
        lbImg.src = data.src;
        lbImg.alt = data.alt;
        lbCaption.textContent = data.caption;
        lb.classList.add('lb--open');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function close() {
        lb.classList.remove('lb--open');
        document.body.style.overflow = '';
    }

    items.forEach(function (item, i) {
        item.addEventListener('click', function () { openAt(i); });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(i); }
        });
    });

    lbClose.addEventListener('click', close);
    lbBackdrop.addEventListener('click', close);
    lbPrev.addEventListener('click', function () { openAt(currentIndex - 1); });
    lbNext.addEventListener('click', function () { openAt(currentIndex + 1); });

    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('lb--open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
        if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    });

    // Стилі lightbox — додаємо динамічно щоб не захаращувати CSS
    var lbStyles = document.createElement('style');
    lbStyles.textContent = `
    #lightbox {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 2000;
      align-items: center;
      justify-content: center;
    }
    #lightbox.lb--open { display: flex; }
    .lb__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,.88);
      backdrop-filter: blur(6px);
    }
    .lb__inner {
      position: relative;
      z-index: 1;
      max-width: 92vw;
      max-height: 92vh;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .lb__figure {
      margin: 0;
      text-align: center;
    }
    .lb__img {
      display: block;
      max-width: 80vw;
      max-height: 80vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .lb__caption {
      margin-top: .6rem;
      color: rgba(255,255,255,.6);
      font-family: 'Lora', serif;
      font-size: .85rem;
      font-style: italic;
    }
    .lb__close {
      position: absolute;
      top: -2.5rem;
      right: 0;
      background: none;
      border: 1px solid rgba(255,255,255,.3);
      color: #fff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background .2s;
    }
    .lb__close:hover { background: rgba(255,255,255,.15); }
    .lb__prev, .lb__next {
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.2);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      font-size: 1.6rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background .2s;
      line-height: 1;
    }
    .lb__prev:hover, .lb__next:hover { background: rgba(255,255,255,.2); }
    @media (max-width: 600px) {
      .lb__img { max-width: 96vw; max-height: 70vh; }
      .lb__prev, .lb__next { display: none; }
    }
  `;
    document.head.appendChild(lbStyles);
}

// ==============================
// ACTIVE NAV LINK — стиль
// ==============================
(function addActiveNavStyle() {
    var s = document.createElement('style');
    s.textContent = `.nav__links a.active { color: #b8860b; }`;
    document.head.appendChild(s);
})();

// ==============================
// INIT
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCharItems();
    initLightbox();
});