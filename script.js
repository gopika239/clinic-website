/* ==========================================================
   PREMA DENTAL CARE - JavaScript Features
   script.js
   ========================================================== */

/* ── Central Clinic Configuration ── */
const clinicConfig = {
    name: "Prema Dental Care",
    phone: "+919000012345",
    whatsapp: "919000012345",
    address: "Old Bus Stand, Arani Palayam, Arani, Tamil Nadu 632301"
};

document.addEventListener('DOMContentLoaded', () => {
    
    /* ── Sticky Navigation ── */
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    /* ── Mobile Menu Toggle ── */
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    const toggleMenu = () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileNav.classList.add('open');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    if (hamburger && mobileNav && mobileNavClose) {
        hamburger.addEventListener('click', toggleMenu);
        mobileNavClose.addEventListener('click', toggleMenu);
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    /* ── Active Navigation State & Smooth Scrolling ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const checkActiveSection = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150; // Offset for fixed nav
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', checkActiveSection, { passive: true });

    /* ── Scroll Reveal Animations ── */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ── Animated Counters ── */
    const statNumbers = document.querySelectorAll('.stat-number span:first-child');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            // Adjust step for large numbers
            const increment = target > 1000 ? Math.ceil(target / 100) : 1;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target;
                    clearInterval(timer);
                } else {
                    counter.innerText = current;
                }
            }, stepTime);
        });
    };

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersAnimated) {
                animateCounters();
                countersAnimated = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    /* ── Review Carousel ── */
    const track = document.querySelector('.reviews-track');
    if (track) {
        const cards = document.querySelectorAll('.review-card');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dots = document.querySelectorAll('.carousel-dot');
        
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 22; // width + gap
        const maxIndex = cards.length - 1;

        const updateCarousel = () => {
            // Adjust max translation so we don't scroll past the end
            const containerWidth = document.querySelector('.reviews-carousel-wrapper').offsetWidth;
            const trackWidth = cards.length * cardWidth - 22;
            const maxTranslate = Math.max(0, trackWidth - containerWidth);
            
            let translateX = currentIndex * cardWidth;
            if (translateX > maxTranslate) translateX = maxTranslate;

            track.style.transform = `translateX(-${translateX}px)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });

        // Touch swipe support
        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, {passive: true});

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex < maxIndex) {
                    // Swipe left
                    currentIndex++;
                    updateCarousel();
                    isDragging = false;
                } else if (diff < 0 && currentIndex > 0) {
                    // Swipe right
                    currentIndex--;
                    updateCarousel();
                    isDragging = false;
                }
            }
        }, {passive: true});
        
        track.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Handle resize
        window.addEventListener('resize', updateCarousel);
    }

    /* ── FAQ Accordion ── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all
            faqItems.forEach(fi => {
                fi.classList.remove('open');
                fi.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    /* ── Booking Form Validation & Success ── */
    const bookingForm = document.getElementById('bookingForm');
    const successMsg = document.getElementById('bookingSuccess');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Simulate form submission
                const btn = bookingForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    bookingForm.style.display = 'none';
                    successMsg.classList.add('show');
                    
                    // Reset form conceptually
                    bookingForm.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });

        // Remove error class on input
        bookingForm.querySelectorAll('input, select, textarea').forEach(el => {
            el.addEventListener('input', () => {
                el.classList.remove('error');
            });
        });
    }

    /* ── WhatsApp Integration ── */
    const generateWhatsAppLink = (message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${clinicConfig.whatsapp}?text=${encodedMessage}`;
    };

    // Update global generic WhatsApp links
    document.querySelectorAll('.btn-whatsapp, .bql-item[href*="wa.me"], .mobile-bar-btn.wa, .whatsapp-float-btn').forEach(btn => {
        // Only update if it doesn't have a specific service message already set via a data attribute or specific class
        if(!btn.classList.contains('service-wa-btn')) {
             btn.setAttribute('href', generateWhatsAppLink("Hello Prema Dental Care, I would like to book a dental consultation. Please share the available appointment slots."));
             btn.setAttribute('target', '_blank');
        }
    });

    // Update Phone links
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.setAttribute('href', `tel:${clinicConfig.phone}`);
    });

    /* ── Back to Top Button ── */
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
