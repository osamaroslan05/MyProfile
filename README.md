# Apple-Inspired Personal Resume & Portfolio Website

A clean, minimalist, high-performance personal portfolio website built with pure HTML5, CSS3, and vanilla JavaScript. Features butter-smooth scrolling (Lenis), scroll-based animations (GSAP & ScrollTrigger), an emotional family section, and static GitHub Pages compatibility.

---

## 🚀 Quick Start & Customization

1. **Clone or Download** this repository.
2. Open `index.html` and replace all placeholders (e.g., `{{YOUR_NAME}}`, `{{YOUR_TITLE}}`, `{{PROJECT_1_TITLE}}`, etc.) with your personal information.
3. **Replace Images**: Place your photos in `assets/images/`:
   - `profile.jpg` (Your portrait)
   - `project-1.jpg`, `project-2.jpg`, `project-3.jpg` (Portfolio screenshots)
   - `family-1.jpg`, `family-2.jpg`, `family-3.jpg` (Family photo gallery)
4. Place your resume PDF at `assets/resume.pdf`.

---

## 📬 Contact Form Setup (Formspree)

Because GitHub Pages is entirely static, it cannot process server-side code natively. We use **Formspree** (free tier: 50 submissions/month) for zero-backend form handling.

1. Create a free account at [Formspree.io](https://formspree.io).
2. Create a new form and copy your **Form ID** (e.g., `123456789` or `xmovqwer`).
3. In `index.html`, locate the contact form action:
   ```html
   <form id="contactForm" action="[https://formspree.io/f/YOUR_FORMSPREE_ID](https://formspree.io/f/YOUR_FORMSPREE_ID)" method="POST" class="contact-form">