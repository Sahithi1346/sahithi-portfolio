document.addEventListener('DOMContentLoaded', () => {
    // INITIALIZE ICONS WITH SAFETY
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. LOADER & INITIALIZATION (With Fail-Safe)
    let isLoaded = false;
    function clearLoader() {
        if (isLoaded) return;
        isLoaded = true;
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                revealHero();
            }, 800);
        }
    }

    // Try normal load
    window.addEventListener('load', () => {
        setTimeout(clearLoader, 300);
    });

    // FAIL-SAFE: Force clear after 5 seconds
    setTimeout(clearLoader, 5000);



    // 3. REVEAL ANIMATIONS (NO AI TYPING)
    function revealHero() {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();
        tl.from(".main-title", {
            y: 100,
            skewY: 10,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        })
        .from(".description", {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=1")
        .from(".photo-frame", {
            scale: 1.2,
            opacity: 0,
            duration: 1.5,
            ease: "expo.out"
        }, "-=1");
    }

    // 4. SCROLL PROGRESS
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = scrollPct + '%';

        // Navbar scrolled state
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Detection
        const sections = document.querySelectorAll('.scene');
        const navLinks = document.querySelectorAll('.nav-links a');
        let current = '';
        sections.forEach(scene => {
            if (window.scrollY >= scene.offsetTop - 300) {
                current = scene.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. SKILL CARDS HOVER EFFECT
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        });
    });

    // 6. PROJECTS - CARD SLIDER
    const carousel = document.getElementById('project-carousel');
    const cards = document.querySelectorAll('.project-card-3d');
    let rotationAngle = 0;
    const cardCount = cards.length;

    function updateCarousel() {
        cards.forEach((card, i) => {
            const angle = (360 / cardCount) * i + rotationAngle;
            card.style.transform = `rotateY(${angle}deg) translateZ(400px)`;
            
            const normalizedAngle = ((angle % 360) + 360) % 360;
            if (normalizedAngle < 30 || normalizedAngle > 330) {
                card.style.opacity = '1';
                card.style.filter = 'blur(0px)';
            } else if (normalizedAngle > 90 && normalizedAngle < 270) {
                card.style.opacity = '0';
            } else {
                card.style.opacity = '0.3';
                card.style.filter = 'blur(5px)';
            }
        });
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        rotationAngle -= (360 / cardCount);
        updateCarousel();
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        rotationAngle += (360 / cardCount);
        updateCarousel();
    });

    updateCarousel();

    // 7. THEME TOGGLE - with localStorage persistence
    const themeBtn = document.getElementById('theme-toggle');

    // Load saved preference
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode', !isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        // Re-render icons so they adapt to color changes
        lucide.createIcons();
    });

    // 8. HIRE ME MODAL LOGIC
    const hireBtn = document.getElementById('hire-me-btn');
    const hireModal = document.getElementById('hire-modal');
    const closeBtn = document.querySelector('.close-modal');

    hireBtn.addEventListener('click', () => {
        hireModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        lucide.createIcons(); // Ensure icons are rendered
    });

    closeBtn.addEventListener('click', () => {
        hireModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === hireModal) {
            hireModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
