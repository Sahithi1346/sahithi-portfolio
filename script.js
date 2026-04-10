document.addEventListener('DOMContentLoaded', () => {
    // INITIALIZE ICONS WITH SAFETY
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. LOADER & INITIALIZATION
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

    window.addEventListener('load', () => setTimeout(clearLoader, 300));
    setTimeout(clearLoader, 5000); // Fail-safe

    // 3. REVEAL ANIMATIONS
    function revealHero() {
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline();
        tl.from(".main-title", { y: 100, skewY: 10, opacity: 0, duration: 1.5, ease: "power4.out" })
          .from(".description", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=1")
          .from(".photo-frame", { scale: 1.2, opacity: 0, duration: 1.5, ease: "expo.out" }, "-=1");
    }

    // 4. SCROLL PROGRESS & NAVBAR
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollProgress) scrollProgress.style.width = scrollPct + '%';

        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
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
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });

    // 5. SKILL CARDS HOVER
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', () => gsap.to(card, { y: -10, duration: 0.3, ease: 'power2.out' }));
        card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' }));
    });

    // 6. PROJECTS - 3D CAROUSEL WITH GESTURES
    const carousel = document.getElementById('project-carousel');
    const cards = document.querySelectorAll('.project-card-3d');
    const carouselWrapper = document.querySelector('.carousel-3d-wrapper');
    let rotationAngle = 0;
    const cardCount = cards.length;

    function updateCarousel() {
        if (!carousel) return;
        cards.forEach((card, i) => {
            const angle = (360 / cardCount) * i + rotationAngle;
            card.style.transform = `rotateY(${angle}deg) translateZ(450px)`;
            const normalizedAngle = ((angle % 360) + 360) % 360;
            if (normalizedAngle < 25 || normalizedAngle > 335) {
                card.style.opacity = '1'; card.style.filter = 'blur(0px)'; card.style.zIndex = '10'; card.style.pointerEvents = 'auto';
            } else if (normalizedAngle > 90 && normalizedAngle < 270) {
                card.style.opacity = '0'; card.style.pointerEvents = 'none';
            } else {
                card.style.opacity = '0.2'; card.style.filter = 'blur(4px)'; card.style.zIndex = '1'; card.style.pointerEvents = 'none';
            }
        });
    }

    let isDragging = false;
    let startX = 0;
    const handleDragStart = (x) => { isDragging = true; startX = x; carousel.style.transition = 'none'; };
    const handleDragMove = (x) => {
        if (!isDragging) return;
        rotationAngle += (x - startX) * 0.15;
        startX = x;
        updateCarousel();
    };
    const handleDragEnd = () => {
        isDragging = false;
        const cardAngle = 360 / cardCount;
        rotationAngle = Math.round(rotationAngle / cardAngle) * cardAngle;
        carousel.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        updateCarousel();
    };

    if (carouselWrapper) {
        carouselWrapper.addEventListener('mousedown', (e) => handleDragStart(e.clientX));
        window.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
        window.addEventListener('mouseup', handleDragEnd);
        carouselWrapper.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX), { passive: true });
        carouselWrapper.addEventListener('touchmove', (e) => handleDragMove(e.touches[0].clientX), { passive: true });
        carouselWrapper.addEventListener('touchend', handleDragEnd);
        carouselWrapper.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                rotationAngle -= e.deltaX * 0.1;
                updateCarousel();
                clearTimeout(window.snapTimeout);
                window.snapTimeout = setTimeout(handleDragEnd, 200);
            }
        }, { passive: false });
    }

    document.getElementById('next-btn')?.addEventListener('click', () => { rotationAngle -= (360 / cardCount); updateCarousel(); });
    document.getElementById('prev-btn')?.addEventListener('click', () => { rotationAngle += (360 / cardCount); updateCarousel(); });
    updateCarousel();

    // 7. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'light') { document.body.classList.add('light-mode'); document.body.classList.remove('dark-mode'); }
    themeBtn?.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode', !isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        lucide.createIcons();
    });

    // MOBILE HAMBURGER LOGIC
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // 8. HIRE ME & RESUME MODALS
    const hireBtn = document.getElementById('hire-me-btn');
    const hireModal = document.getElementById('hire-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    const resumeBtn = document.getElementById('view-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const closeResume = document.querySelector('.close-resume');
    const downloadResumeBtn = document.getElementById('download-resume-btn');

    // Handle Hire Me Modal
    hireBtn?.addEventListener('click', () => { hireModal.classList.add('active'); document.body.style.overflow = 'hidden'; lucide.createIcons(); });
    closeBtn?.addEventListener('click', () => { hireModal.classList.remove('active'); document.body.style.overflow = 'auto'; });

    // Handle Resume Modal
    resumeBtn?.addEventListener('click', () => { 
        resumeModal.classList.add('active'); 
        hireModal.classList.remove('active'); 
        document.body.style.overflow = 'hidden'; 
    });
    closeResume?.addEventListener('click', () => { resumeModal.classList.remove('active'); document.body.style.overflow = 'auto'; });

    // Handle PDF Download (Generation)
    downloadResumeBtn?.addEventListener('click', () => {
        const originalText = downloadResumeBtn.innerText;
        downloadResumeBtn.innerText = 'Creating PDF...';
        downloadResumeBtn.disabled = true;

        // Clone the modal content to avoid affecting the live UI
        const resumeModalContent = document.querySelector('#resume-modal .modal-content');
        if (!resumeModalContent) {
            alert('Error: Resume content not found.');
            downloadResumeBtn.innerText = originalText;
            downloadResumeBtn.disabled = false;
            return;
        }

        const element = resumeModalContent.cloneNode(true);
        
        // STRICTION: Remove UI elements from the PDF version
        const uiElements = element.querySelectorAll('.close-resume, .no-print, button');
        uiElements.forEach(el => el.remove());

        // Configuration for a clean 2-page PDF
        const opt = {
            margin:       [0.5, 0.5, 0.5, 0.5],
            filename:     'Sahithi_Thavishi_Resume.pdf',
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { 
                scale: 1.5, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate the PDF from the cleaned clone
        html2pdf().set(opt).from(element).save().then(() => {
            downloadResumeBtn.innerText = originalText;
            downloadResumeBtn.disabled = false;
        }).catch(err => {
            console.error('PDF Generation Failed:', err);
            downloadResumeBtn.innerText = 'Error! Try again';
            downloadResumeBtn.disabled = false;
        });
    });

    window.addEventListener('click', (e) => { 
        if (e.target === hireModal) { hireModal.classList.remove('active'); document.body.style.overflow = 'auto'; }
        if (e.target === resumeModal) { resumeModal.classList.remove('active'); document.body.style.overflow = 'auto'; }
    });

    // 9. CONTACT FORM SUBMISSION
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        setTimeout(() => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5 });
        }, 1500);
    });
});
