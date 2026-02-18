/* ============================================
   DOLCE VITA - Main Application
   ============================================ */

(function() {
    'use strict';

    /* ========================================
       LENIS SMOOTH SCROLL
       ======================================== */
    let lenis = null;
    let hasLenis = false;
    
    // Initialize Lenis after page load
    function initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis library not loaded');
            return;
        }
        
        try {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            // Raf loop
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            hasLenis = true;
            console.log('✓ Lenis initialized successfully');
        } catch(e) {
            console.warn('Lenis initialization error:', e);
            hasLenis = false;
        }
    }

    /* ========================================
       UTILITY FUNCTIONS
       ======================================== */
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

    /* ========================================
       PRELOADER
       ======================================== */
    class Preloader {
        constructor() {
            this.preloader = document.getElementById('preloader');
            this.counter = document.getElementById('preloader-number');
            this.progress = 0;
            this.init();
        }

        init() {
            this.animate();
        }

        animate() {
            // Smooth progress increment
            const interval = setInterval(() => {
                // Slower increment for smoother effect
                this.progress += 1.5; 
                
                if (this.progress >= 100) {
                    this.progress = 100;
                    clearInterval(interval);
                    // Slight delay before hiding to ensure 100% is visible
                    setTimeout(() => this.hide(), 500);
                }
                
                if (this.counter) {
                    this.counter.textContent = Math.floor(this.progress);
                }
            }, 30); // Faster interval update for smoothness
        }

        hide() {
            if (this.preloader) {
                this.preloader.classList.add('loaded');
                // Cambio il background del body al colore chiaro
                document.body.classList.add('loaded');
                // Unlock scroll when preloader disappears
                document.body.style.overflow = '';
                // Remove from DOM after transition completes
                setTimeout(() => {
                    this.preloader.style.display = 'none';
                }, 1000);
            }
        }
    }

    /* ========================================
       NAVBAR
       ======================================== */
    class Navbar {
        constructor() {
            this.navbar = document.getElementById('navbar');
            this.lastScroll = 0;
            this.init();
        }

        init() {
            if (hasLenis && lenis) {
                // Se Lenis è attivo, ascolta su Lenis per il scroll
                lenis.on('scroll', () => this.onScroll());
            } else {
                // Altrimenti usa scroll event normale con throttle
                const throttledScroll = throttle(() => this.onScroll(), 50);
                window.addEventListener('scroll', throttledScroll);
            }
            this.onScroll();
        }

        onScroll() {
            const scrollY = window.pageYOffset;

            if (scrollY > 80) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            this.lastScroll = scrollY;
        }
    }

    /* ========================================
       MOBILE MENU
       ======================================== */
    class MobileMenu {
        constructor() {
            this.toggle = document.getElementById('menuToggle');
            this.menu = document.getElementById('mobileMenu');
            this.isOpen = false;
            this.init();
        }

        init() {
            if (!this.toggle || !this.menu) return;

            this.toggle.addEventListener('click', () => this.toggleMenu());

            const links = this.menu.querySelectorAll('.mobile-link');
            links.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeMenu();
                }
            });
        }

        toggleMenu() {
            this.isOpen = !this.isOpen;
            this.toggle.classList.toggle('active', this.isOpen);
            this.menu.classList.toggle('active', this.isOpen);
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        }

        closeMenu() {
            this.isOpen = false;
            this.toggle.classList.remove('active');
            this.menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* ========================================
       TESTIMONIALS SLIDER
       ======================================== */
    class TestimonialsSlider {
        constructor() {
            this.slider = document.getElementById('testimonialsSlider');
            this.prevBtn = document.getElementById('testimonialPrev');
            this.nextBtn = document.getElementById('testimonialNext');
            this.dotsContainer = document.getElementById('testimonialDots');

            if (!this.slider) return;

            this.slides = this.slider.querySelectorAll('.testimonial-slide');
            this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
            this.currentIndex = 0;
            this.autoplayTimer = null;
            this.init();
        }

        init() {
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });

            this.startAutoplay();

            this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
            this.slider.addEventListener('mouseleave', () => this.startAutoplay());
        }

        goTo(index) {
            this.slides[this.currentIndex].classList.remove('active');
            if (this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.remove('active');
            }

            this.currentIndex = index;

            this.slides[this.currentIndex].classList.add('active');
            if (this.dots[this.currentIndex]) {
                this.dots[this.currentIndex].classList.add('active');
            }
        }

        next() {
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.goTo(nextIndex);
        }

        prev() {
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.goTo(prevIndex);
        }

        startAutoplay() {
            this.autoplayTimer = setInterval(() => this.next(), 5000);
        }

        stopAutoplay() {
            clearInterval(this.autoplayTimer);
        }
    }

    /* ========================================
       MENU FILTER
       ======================================== */
    class MenuFilter {
        constructor() {
            this.filterBtns = document.querySelectorAll('.filter-btn');
            this.menuItems = document.querySelectorAll('.menu-item');

            if (this.filterBtns.length === 0) return;
            this.init();
        }

        init() {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const filter = btn.dataset.filter;
                    this.filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.filterItems(filter);
                });
            });
        }

        filterItems(filter) {
            this.menuItems.forEach((item, index) => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        }
    }

    /* ========================================
       GALLERY LIGHTBOX
       ======================================== */
    class Lightbox {
        constructor() {
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImg = document.getElementById('lightboxImg');
            this.lightboxTitle = document.getElementById('lightboxTitle');
            this.lightboxCat = document.getElementById('lightboxCat');
            this.closeBtn = document.getElementById('lightboxClose');
            this.galleryItems = document.querySelectorAll('.gallery-item');

            if (!this.lightbox || this.galleryItems.length === 0) return;
            this.init();
        }

        init() {
            this.galleryItems.forEach(item => {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    const img = item.querySelector('img');
                    const title = item.querySelector('.gallery-item-title');
                    const cat = item.querySelector('.gallery-item-cat');

                    if (this.lightboxImg) this.lightboxImg.src = img.src;
                    if (this.lightboxTitle) this.lightboxTitle.textContent = title ? title.textContent : '';
                    if (this.lightboxCat) this.lightboxCat.textContent = cat ? cat.textContent : '';

                    this.open();
                });
            });

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) this.close();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
            });
        }

        open() {
            this.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        close() {
            this.lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* ========================================
       CONTACT FORM
       ======================================== */
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.success = document.getElementById('formSuccess');

            if (!this.form) return;
            this.init();
        }

        init() {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        handleSubmit() {
            const submitBtn = this.form.querySelector('.form-submit');
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Invio in corso...</span>';
                submitBtn.disabled = true;
            }

            // Simulate form submission
            setTimeout(() => {
                this.form.reset();
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Invia Messaggio</span>';
                    submitBtn.disabled = false;
                }
                if (this.success) {
                    this.success.classList.add('show');
                    setTimeout(() => {
                        this.success.classList.remove('show');
                    }, 5000);
                }
            }, 1500);
        }
    }

    /* ========================================
       SMOOTH ANCHOR SCROLLING
       ======================================== */
    class SmoothAnchors {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        const offset = 100;
                        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }

    /* ========================================
       TILT EFFECT ON CARDS
       ======================================== */
    class CardTilt {
        constructor() {
            if (window.innerWidth < 992) return;
            this.cards = document.querySelectorAll('.product-card, .team-card');
            this.init();
        }

        init() {
            this.cards.forEach(card => {
                const throttledMousemove = throttle((e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / centerY * -3;
                    const rotateY = (x - centerX) / centerX * 3;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                }, 16);

                card.addEventListener('mousemove', throttledMousemove);

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                    card.style.transition = 'transform 0.5s ease';
                });

                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'none';
                });
            });
        }
    }

    /* ========================================
       HEADER TITLE PARALLAX
       ======================================== */
    class HeroParallaxText {
        constructor() {
            this.heroContent = document.querySelector('.hero-content');
            if (!this.heroContent) return;
            this.init();
        }

        init() {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrollY = window.pageYOffset;
                        const heroHeight = document.querySelector('.hero-section')?.offsetHeight || window.innerHeight;
                        if (scrollY < heroHeight) {
                            const opacity = 1 - (scrollY / heroHeight) * 1.5;
                            const translateY = scrollY * 0.4;
                            this.heroContent.style.opacity = Math.max(0, opacity);
                            this.heroContent.style.transform = `translateY(${translateY}px)`;
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    /* ========================================
       DYNAMIC YEAR
       ======================================== */
    class DynamicYear {
        constructor() {
            const yearElements = document.querySelectorAll('.current-year');
            yearElements.forEach(el => {
                el.textContent = new Date().getFullYear();
            });
        }
    }

    /* ========================================
       LAZY LOAD IMAGES
       ======================================== */
    class LazyLoader {
        constructor() {
            this.images = document.querySelectorAll('img[data-src]');
            if (this.images.length === 0) return;
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '200px'
            });

            this.images.forEach(img => observer.observe(img));
        }
    }

    /* ========================================
       SCROLL PROGRESS BAR
       ======================================== */
    class ScrollProgress {
        constructor() {
            this.createBar();
            this.init();
        }

        createBar() {
            this.bar = document.createElement('div');
            this.bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, #c9a96e, #d4b87a);
                z-index: 10001;
                transition: width 0.1s linear;
                pointer-events: none;
            `;
            document.body.appendChild(this.bar);
        }

        init() {
            const updateProgress = () => {
                const scrollTop = hasLenis ? lenis.scroll : window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                this.bar.style.width = `${progress}%`;
            };
            
            if (hasLenis && lenis) {
                lenis.on('scroll', updateProgress);
            } else {
                const throttledScroll = throttle(updateProgress, 16);
                window.addEventListener('scroll', throttledScroll);
            }
        }
    }

    /* ========================================
       PAGE TRANSITION EFFECT
       ======================================== */
    class PageTransition {
        constructor() {
            this.createOverlay();
            this.init();
        }

        createOverlay() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'page-transition-overlay';
            this.overlay.style.cssText = `
                position: fixed;
                inset: 0;
                background: #1a1a1a;
                z-index: 99998;
                transform: scaleY(0);
                transform-origin: bottom;
                pointer-events: none;
            `;
            document.body.appendChild(this.overlay);
        }

        init() {
            // Animate in on page load
            document.body.style.opacity = '0';
            window.addEventListener('load', () => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            });

            // Navigate with transition
            const links = document.querySelectorAll('a[href]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (
                    href &&
                    !href.startsWith('#') &&
                    !href.startsWith('mailto:') &&
                    !href.startsWith('tel:') &&
                    !href.startsWith('http') &&
                    href !== '' &&
                    !link.hasAttribute('target')
                ) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.navigateTo(href);
                    });
                }
            });
        }

        navigateTo(url) {
            this.overlay.style.transition = 'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)';
            this.overlay.style.transformOrigin = 'bottom';
            this.overlay.style.transform = 'scaleY(1)';

            setTimeout(() => {
                window.location.href = url;
            }, 500);
        }
    }

    /* ========================================
       INITIALIZE EVERYTHING
       ======================================== */
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize Lenis first
        initLenis();
        
        // Prevent scroll during preload
        document.body.style.overflow = 'hidden';

        // Core features
        new Preloader();
        new Navbar();
        new MobileMenu();
        new SmoothAnchors();
        new ScrollProgress();
        new PageTransition();
        new DynamicYear();
        new LazyLoader();
        new HeroParallaxText();

        // Page-specific features
        new TestimonialsSlider();
        new MenuFilter();
        new Lightbox();
        new ContactForm();
        new CardTilt();
    });

})();