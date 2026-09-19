document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Initialize Lenis Smooth Scroll
    // ----------------------------------------------------
    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ----------------------------------------------------
    // 2. Navigation Blur & Mobile Menu
    // ----------------------------------------------------
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(10, 10, 10, 0.9)";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
        } else {
            navbar.style.background = "rgba(10, 10, 10, 0.75)";
            navbar.style.boxShadow = "none";
        }
    });

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
        document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            document.body.style.overflow = "";
        });
    });

    // ----------------------------------------------------
    // 3. GSAP Animations & ScrollTrigger
    // ----------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Word-by-Word Animation
    const heroWords = document.querySelectorAll(".hero-word, .hero-tagline, .hero-actions");
    gsap.fromTo(heroWords, 
        { y: 40, opacity: 0 }, 
        { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power3.out",
            delay: 0.2
        }
    );

    // General Section Reveals
    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        gsap.fromTo(section.querySelectorAll(".section-header, .about-text-content, .about-image-wrapper, .timeline-card, .project-card, .edu-card, .cert-card, .family-message-card, .gallery-item, .contact-form"),
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // ----------------------------------------------------
    // 4. Floating Hearts Generator for Family Section
    // ----------------------------------------------------
    const heartsContainer = document.getElementById("floatingHearts");
    if (heartsContainer) {
        const heartSymbols = ["❤️", "✨", "💖", "💫", "🤍"];
        for (let i = 0; i < 15; i++) {
            const span = document.createElement("span");
            span.className = "heart-particle";
            span.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            span.style.left = `${Math.random() * 100}%`;
            span.style.animationDuration = `${6 + Math.random() * 6}s`;
            span.style.animationDelay = `${Math.random() * 5}s`;
            heartsContainer.appendChild(span);
        }
    }

    // ----------------------------------------------------
    // 5. Contact Form Submission (AJAX via Formspree)
    // ----------------------------------------------------
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formSuccess = document.getElementById("formSuccess");
    const formError = document.getElementById("formError");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            formSuccess.classList.add("hidden");
            formError.classList.add("hidden");

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formSuccess.classList.remove("hidden");
                    contactForm.reset();
                } else {
                    formError.classList.remove("hidden");
                }
            } catch (error) {
                formError.classList.remove("hidden");
            } finally {
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = false;
            }
        });
    }

    // ----------------------------------------------------
    // 6. Dynamic Footer Year
    // ----------------------------------------------------
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});