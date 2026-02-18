/* ============================================
   DOLCE VITA - Animation Engine
   ============================================ */

/* Utility throttle function */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

class AnimationEngine {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupRevealAnimations();
        this.setupImageReveals();
        this.setupCounterAnimations();
        this.setupParallax();
    }

    /* --- SCROLL REVEAL --- */
    setupRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, parseFloat(delay) * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    /* --- IMAGE REVEAL --- */
    setupImageReveals() {
        const images = document.querySelectorAll('.reveal-image');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -80px 0px'
        });

        images.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    /* --- COUNTER ANIMATION --- */
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(el => observer.observe(el));
        this.observers.push(observer);
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }

    /* --- PARALLAX --- */
    setupParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = document.querySelector('.hero-section')?.offsetHeight || 0;

                    if (scrolled < heroHeight) {
                        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(1.1)`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

/* --- MAGNETIC BUTTON EFFECT --- */
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-btn');
        this.init();
    }

    init() {
        if (window.innerWidth < 992) return;

        this.buttons.forEach(btn => {
            const throttledMousemove = throttle((e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }, 16);

            btn.addEventListener('mousemove', throttledMousemove);

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

/* --- TEXT SPLIT ANIMATION --- */
class TextSplitter {
    constructor() {
        this.elements = document.querySelectorAll('[data-splitting]');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            const text = el.innerHTML;
            const words = text.split(' ');
            el.innerHTML = words.map((word, i) =>
                `<span class="split-word" style="animation-delay: ${i * 0.05}s">${word}</span>`
            ).join(' ');
        });
    }
}

/* --- SMOOTH SECTION TRANSITIONS --- */
class SmoothSections {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, {
            threshold: 0.05
        });

        this.sections.forEach(section => observer.observe(section));
    }
}

/* --- TITLE WORD ANIMATIONS FOR SUBPAGES --- */
class PageTitleAnimator {
    constructor() {
        this.titles = document.querySelectorAll('.page-hero-title .title-word');
        this.init();
    }

    init() {
        this.titles.forEach((word, i) => {
            word.style.animationDelay = `${0.3 + i * 0.15}s`;
        });
    }
}

/* --- Initialize on DOM Ready --- */
document.addEventListener('DOMContentLoaded', () => {
    new AnimationEngine();
    new MagneticButtons();
    new TextSplitter();
    new SmoothSections();
    new PageTitleAnimator();
});