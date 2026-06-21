/**
 * Karthik Ethamukkala Portfolio - Core Interactions
 * Vanilla JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Set Current Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Glass Toggle Interaction (Visual Only) ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeToggle.classList.toggle('is-light');
        });
    }

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const logo = document.querySelector('.logo');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            if (logo) logo.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                if (logo) logo.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when logo is clicked
        if (logo) {
            logo.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
                logo.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    // --- Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after revealing to animate only once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Link Tracking (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Interactive Mouse Blob Effect (Optional enhancement for desktop) ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && window.innerWidth > 768) {
        const bgElements = document.querySelector('.bg-elements');
        if (bgElements) {
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                // Subtle parallax movement based on mouse position
                bgElements.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
            });
        }
    }
    
    // --- Certifications Interactive Carousel ---
    const track = document.getElementById('cert-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const paginationContainer = document.getElementById('cert-pagination');
        const currentSlideCounter = document.getElementById('current-slide');
        const totalSlidesCounter = document.getElementById('total-slides');
        
        let currentIndex = 0;
        let isAnimating = false;
        let autoAdvanceInterval;
        const autoAdvanceDelay = 5000; // 5 seconds
        
        // Setup initial counters
        if (totalSlidesCounter) {
            totalSlidesCounter.textContent = slides.length.toString().padStart(2, '0');
        }

        // Create pagination dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (paginationContainer) {
                paginationContainer.appendChild(dot);
            }
        });
        
        const dots = paginationContainer ? Array.from(paginationContainer.children) : [];

        function updateCarousel(index) {
            if (isAnimating) return;
            isAnimating = true;
            
            // Move track
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update classes
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // Update counter
            if (currentSlideCounter) {
                currentSlideCounter.textContent = (index + 1).toString().padStart(2, '0');
            }
            
            currentIndex = index;
            
            setTimeout(() => {
                isAnimating = false;
            }, 500); // match transition duration in CSS
            
            resetAutoAdvance();
        }

        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                updateCarousel(currentIndex + 1);
            } else {
                updateCarousel(0); // loop back
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                updateCarousel(currentIndex - 1);
            } else {
                updateCarousel(slides.length - 1); // loop to end
            }
        }

        function goToSlide(index) {
            updateCarousel(index);
        }

        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });

        // Touch Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;
        
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            pauseAutoAdvance();
        }, { passive: true });
        
        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoAdvance();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) nextSlide();
            if (touchEndX > touchStartX + threshold) prevSlide();
        }

        // Auto Advance
        function startAutoAdvance() {
            autoAdvanceInterval = setInterval(nextSlide, autoAdvanceDelay);
        }
        
        function pauseAutoAdvance() {
            clearInterval(autoAdvanceInterval);
        }
        
        function resetAutoAdvance() {
            pauseAutoAdvance();
            startAutoAdvance();
        }

        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', pauseAutoAdvance);
            carouselContainer.addEventListener('mouseleave', startAutoAdvance);
        }

        // Start auto-advancing
        startAutoAdvance();
    }
});

// 3D Tilt Effect for Contact Buttons
const contactBoxes = document.querySelectorAll('.contact-box');

contactBoxes.forEach(box => {
    box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation based on cursor position (-15 to +15 degrees)
        const xRotation = ((y - rect.height / 2) / rect.height) * -15;
        const yRotation = ((x - rect.width / 2) / rect.width) * 15;
        
        // Remove CSS transition for instant cursor tracking
        box.style.transition = 'none';
        box.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) translateY(-5px) scale(1.02)`;
    });
    
    box.addEventListener('mouseleave', () => {
        // Restore CSS transition for a smooth reset to resting state
        box.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        box.style.transform = '';
    });
});
