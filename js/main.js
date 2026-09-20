document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------
    // 1. Initialize Lenis Smooth Scroll (single instance)
    // ----------------------------------------------------
    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
    });

    gsap.registerPlugin(ScrollTrigger);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

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

    if (mobileMenuBtn && mobileMenu) {
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
    }

    // ----------------------------------------------------
    // 2b. Smooth anchor scrolling (via Lenis)
    // ----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            lenis.scrollTo(targetElement, { offset: -70, duration: 1.4 });

            if (mobileMenu && mobileMenu.classList.contains("open")) {
                mobileMenu.classList.remove("open");
                document.body.style.overflow = "";
            }
        });
    });

    // ----------------------------------------------------
    // 3. GSAP Animations & ScrollTrigger
    // ----------------------------------------------------
    const heroWords = document.querySelectorAll(".hero-word, .hero-tagline, .hero-actions");
    if (heroWords.length) {
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
    }

    const sections = document.querySelectorAll(".section");
    sections.forEach(section => {
        const targets = section.querySelectorAll(
            ".section-header, .about-text-content, .about-image-wrapper, .timeline-card, " +
            ".project-card, .edu-card, .cert-card, .family-message-card, .gallery-item, .contact-form"
        );
        if (!targets.length) return;

        gsap.fromTo(targets,
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
    // 5. Contact Form Submission (JSON POST to backend)
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
            const payload = {
                name: formData.get("name"),
                email: formData.get("email"),
                message: formData.get("message")
            };

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    formSuccess.classList.remove("hidden");
                    contactForm.reset();
                } else {
                    formError.classList.remove("hidden");
                }
            } catch (error) {
                console.error("Form submission error:", error);
                formError.classList.remove("hidden");
            } finally {
                submitBtn.textContent = "Send Message";
                submitBtn.disabled = false;
            }
        });
    }

        /* =========================================================
       5b. IMAGE LIGHTBOX
       ========================================================= */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(src, alt, caption) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // small delay so the fade-out finishes before we clear src
        setTimeout(function () {
            if (!lightbox.classList.contains('open')) {
                lightboxImg.src = '';
                lightboxCaption.textContent = '';
            }
        }, 350);
    }

    // ---- Attach click to each polaroid ----
    document.querySelectorAll('.polaroid').forEach(function (card) {
        const img = card.querySelector('.polaroid-photo img');
        const captionEl = card.querySelector('.polaroid-caption');
        if (!img) return;

        card.addEventListener('click', function (e) {
            // don't hijack clicks on the caption's link (if any)
            e.preventDefault();
            openLightbox(
                img.currentSrc || img.src,
                img.alt,
                captionEl ? captionEl.textContent.trim() : ''
            );
        });

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Enlarge photo');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(
                    img.currentSrc || img.src,
                    img.alt,
                    captionEl ? captionEl.textContent.trim() : ''
                );
            }
        });
    });

    // ---- Also make the hero photo enlarge on click ----
    const heroPhoto = document.querySelector('.hero-photo img');
    if (heroPhoto) {
        heroPhoto.parentElement.style.cursor = 'zoom-in';
        heroPhoto.parentElement.addEventListener('click', function () {
            openLightbox(heroPhoto.currentSrc || heroPhoto.src, heroPhoto.alt, 'Nur Khaizatul Neesha 💛');
            //         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            //         ⬆️ THIS is the line you're asking about — it lives here
        });
    }

    // ---- Close handlers ----
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function (e) {
            e.stopPropagation();
            closeLightbox();
        });
    }

    // Click on backdrop (not the image) to close
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
                closeLightbox();
            }
        });
    }

    // Escape to close
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    // ----------------------------------------------------
    // 6. Dynamic Footer Year
    // ----------------------------------------------------
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------
    // 7. ENVELOPE OPENING ANIMATION (family-2 → neesha.html)
    // ----------------------------------------------------
    const neeshaLink = document.getElementById('neeshaLink');
    const envelopeOverlay = document.getElementById('envelopeOverlay');
    const envelopeHearts = document.getElementById('envelopeHearts');
    const envelopeText = document.getElementById('envelopeText');

    if (neeshaLink && envelopeOverlay) {
        neeshaLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Freeze page scroll
            document.body.style.overflow = 'hidden';

            // Show overlay
            envelopeOverlay.classList.add('active');
            envelopeOverlay.setAttribute('aria-hidden', 'false');

            // Start the sequence (flap opens, letter slides out)
            setTimeout(function () {
                envelopeOverlay.classList.add('animate');
            }, 300);

            // Spawn bursting hearts
            const heartGlyphs = ['💛', '🌻', '💖', '✨', '🤍', '💫'];
            const heartCount = window.innerWidth < 520 ? 14 : 22;

            for (let i = 0; i < heartCount; i++) {
                const heart = document.createElement('span');
                heart.className = 'envelope-heart';
                heart.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];

                // Random direction & distance
                const angle = (Math.PI * 2 * i) / heartCount + (Math.random() * 0.4 - 0.2);
                const distance = 120 + Math.random() * 180;
                const dx = Math.cos(angle) * distance;
                const dy = Math.sin(angle) * distance - 60; // bias upward
                const rot = (Math.random() * 540 - 270) + 'deg';

                heart.style.setProperty('--dx', dx + 'px');
                heart.style.setProperty('--dy', dy + 'px');
                heart.style.setProperty('--rot', rot);
                heart.style.animationDelay = (Math.random() * 0.4) + 's';
                heart.style.fontSize = (14 + Math.random() * 18) + 'px';

                envelopeHearts.appendChild(heart);

                setTimeout(function () { heart.remove(); }, 2200);
            }

            // Update text partway through
            setTimeout(function () {
                if (envelopeText) envelopeText.textContent = 'Taking you there… 💛';
            }, 1400);

            // Redirect once the animation finishes (~2.6s total)
            setTimeout(function () {
                window.location.href = 'neesha.html';
            }, 2600);
        });
    }
        // ----------------------------------------------------
    // 7. ENVELOPE OPENING ANIMATION (family-2 → neesha.html)
    // Self-contained — runs regardless of other scripts
    // ----------------------------------------------------
    (function initEnvelopeAnimation() {
        const neeshaLink = document.getElementById('neeshaLink');
        const envelopeOverlay = document.getElementById('envelopeOverlay');
        const envelopeHearts = document.getElementById('envelopeHearts');
        const envelopeText = document.getElementById('envelopeText');

        console.log('[Envelope] link:', !!neeshaLink, '| overlay:', !!envelopeOverlay);

        if (!neeshaLink || !envelopeOverlay) {
            console.warn('[Envelope] Missing elements — animation disabled.');
            return;
        }

        let navigating = false;

        neeshaLink.addEventListener('click', function (e) {
            if (navigating) return;
            e.preventDefault();
            navigating = true;

            console.log('[Envelope] Starting animation…');

            // Freeze page scroll
            document.body.style.overflow = 'hidden';

            // Show overlay
            envelopeOverlay.classList.add('active');
            envelopeOverlay.setAttribute('aria-hidden', 'false');

            // Force reflow so the CSS transition triggers reliably
            void envelopeOverlay.offsetWidth;

            // Open the flap after a tiny delay
            setTimeout(function () {
                envelopeOverlay.classList.add('animate');
            }, 300);

            // Burst hearts
            if (envelopeHearts) {
                const heartGlyphs = ['💛', '🌻', '💖', '✨', '🤍', '💫'];
                const heartCount = window.innerWidth < 520 ? 14 : 22;

                for (let i = 0; i < heartCount; i++) {
                    const heart = document.createElement('span');
                    heart.className = 'envelope-heart';
                    heart.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];

                    const angle = (Math.PI * 2 * i) / heartCount + (Math.random() * 0.4 - 0.2);
                    const distance = 120 + Math.random() * 180;
                    const dx = Math.cos(angle) * distance;
                    const dy = Math.sin(angle) * distance - 60;
                    const rot = (Math.random() * 540 - 270) + 'deg';

                    heart.style.setProperty('--dx', dx + 'px');
                    heart.style.setProperty('--dy', dy + 'px');
                    heart.style.setProperty('--rot', rot);
                    heart.style.animationDelay = (Math.random() * 0.4) + 's';
                    heart.style.fontSize = (14 + Math.random() * 18) + 'px';

                    envelopeHearts.appendChild(heart);
                    setTimeout(function () { heart.remove(); }, 2200);
                }
            }

            // Update text partway through
            setTimeout(function () {
                if (envelopeText) envelopeText.textContent = 'Taking you there… 💛';
            }, 1400);

            // Redirect once the animation finishes
            setTimeout(function () {
                window.location.href = 'neesha.html';
            }, 2600);

            // Failsafe: if the redirect somehow doesn't fire, force it
            setTimeout(function () {
                if (window.location.pathname.indexOf('neesha.html') === -1) {
                    window.location.href = 'neesha.html';
                }
            }, 4500);
        });
    })();
});