/* ============================================================
   AVENTRO EDUCATIONAL TECH SOLUTIONS — script.js
   ============================================================ */

   'use strict';

   /* ============================================================
      1. CUSTOM CURSOR (scope-target with lerp lag)
      ============================================================ */
   (function initCursor() {
     const ring = document.getElementById('cursor-ring');
     const dot  = document.getElementById('cursor-dot');
     if (!ring || !dot) return;
   
     // Skip on touch devices
     if (window.matchMedia('(pointer: coarse)').matches) return;
   
     let mouseX = 0, mouseY = 0;
     let ringX  = 0, ringY  = 0;
     const LERP = 0.12; // lower = more lag
   
     document.addEventListener('mousemove', (e) => {
       mouseX = e.clientX;
       mouseY = e.clientY;
       // Dot follows instantly
       dot.style.left  = mouseX + 'px';
       dot.style.top   = mouseY + 'px';
     });
   
     // Lerp animation loop for ring
     function animateCursor() {
       ringX += (mouseX - ringX) * LERP;
       ringY += (mouseY - ringY) * LERP;
       ring.style.left = ringX + 'px';
       ring.style.top  = ringY + 'px';
       requestAnimationFrame(animateCursor);
     }
     animateCursor();
   
     // Lock / unlock on interactive elements
     const interactives = document.querySelectorAll('.interactive');
     interactives.forEach((el) => {
       el.addEventListener('mouseenter', () => ring.classList.add('locked'));
       el.addEventListener('mouseleave', () => ring.classList.remove('locked'));
     });
   
     // Expand target on click / selection
     document.addEventListener('mousedown', (e) => {
       if (e.button !== 0) return; // left button only
       ring.classList.add('active');
       dot.classList.add('active');
     });
   
     document.addEventListener('mouseup', () => {
       ring.classList.remove('active');
       dot.classList.remove('active');
     });
   
     // Hide cursor when leaving window
     document.addEventListener('mouseleave', () => {
       ring.style.opacity = '0';
       dot.style.opacity  = '0';
     });
     document.addEventListener('mouseenter', () => {
       ring.style.opacity = '1';
       dot.style.opacity  = '1';
     });
   })();
   
   /* ============================================================
      2. STICKY NAV — glassmorphism on scroll
      ============================================================ */
   (function initNav() {
     const navbar = document.getElementById('navbar');
     if (!navbar) return;
   
     const SCROLL_THRESHOLD = 60;
   
     const handleScroll = () => {
       if (window.scrollY > SCROLL_THRESHOLD) {
         navbar.classList.add('scrolled');
       } else {
         navbar.classList.remove('scrolled');
       }
     };
   
     window.addEventListener('scroll', handleScroll, { passive: true });
     handleScroll(); // run once on load
   })();
   
   /* ============================================================
      3. HAMBURGER MENU (mobile)
      ============================================================ */
   (function initHamburger() {
     const hamburger = document.getElementById('hamburger');
     const navLinks  = document.getElementById('nav-links');
     if (!hamburger || !navLinks) return;
   
     hamburger.addEventListener('click', () => {
       const isOpen = navLinks.classList.toggle('open');
       hamburger.classList.toggle('open', isOpen);
       hamburger.setAttribute('aria-expanded', isOpen);
     });
   
     // Close menu when a link is clicked
     navLinks.querySelectorAll('.nav-link').forEach((link) => {
       link.addEventListener('click', () => {
         navLinks.classList.remove('open');
         hamburger.classList.remove('open');
         hamburger.setAttribute('aria-expanded', 'false');
       });
     });
   
     // Close on outside click
     document.addEventListener('click', (e) => {
       if (!navbar.contains(e.target)) {
         navLinks.classList.remove('open');
         hamburger.classList.remove('open');
       }
     });
   })();
   
   /* ============================================================
      4. SCROLL ANIMATIONS — Intersection Observer
      Fade-in + slide-up on enter, subtle fade-out on exit.
      ============================================================ */
   (function initScrollAnimations() {
     const revealEls = document.querySelectorAll('.reveal');
     if (!revealEls.length) return;
   
     // Stagger delays from data attributes
     revealEls.forEach((el) => {
       const delay = el.dataset.delay;
       if (delay) {
         el.style.transitionDelay = delay + 'ms';
       }
     });
   
     const observerOptions = {
       threshold: 0.12,
       rootMargin: '0px 0px -60px 0px',
     };
   
     const observer = new IntersectionObserver((entries) => {
       entries.forEach((entry) => {
         const el = entry.target;
         if (entry.isIntersecting) {
           el.classList.add('visible');
           el.classList.remove('exiting');
         } else {
           // Only apply exit animation if element has been visible before
           if (el.classList.contains('visible')) {
             el.classList.add('exiting');
             el.classList.remove('visible');
           }
         }
       });
     }, observerOptions);
   
     revealEls.forEach((el) => observer.observe(el));
   })();
   
   /* ============================================================
      5. ACTIVE NAV LINK — highlight based on scroll position
      ============================================================ */
   (function initActiveNav() {
     const sections = document.querySelectorAll('section[id], footer[id]');
     const navLinks = document.querySelectorAll('.nav-link');
     if (!sections.length || !navLinks.length) return;
   
     const observer = new IntersectionObserver((entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting) {
           const id = entry.target.getAttribute('id');
           navLinks.forEach((link) => {
             link.classList.toggle(
               'active',
               link.getAttribute('href') === '#' + id
             );
           });
         }
       });
     }, { threshold: 0.4 });
   
     sections.forEach((section) => observer.observe(section));
   })();
   
   /* ============================================================
      6. SMOOTH ANCHOR SCROLL with navbar offset
      ============================================================ */
   (function initSmoothScroll() {
    const NAV_HEIGHT = 0;
   
     document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
       anchor.addEventListener('click', (e) => {
         const targetId = anchor.getAttribute('href').slice(1);
         if (!targetId) return;
         const target = document.getElementById(targetId);
         if (!target) return;
   
         e.preventDefault();

        // If WhatsApp chat anchor, also try to open the widget
        if (targetId === 'whatsapp-chat') {
          const widgetRoot = document.querySelector('.elfsight-app-9c9a18af-2414-4caf-8795-f4992d4823e8');
          if (widgetRoot) {
            widgetRoot.click();
          }
        }

         const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
         window.scrollTo({ top, behavior: 'smooth' });
       });
     });
   })();
   
   /* ============================================================
      7. DIAGRAM NODE PULSE — subtle attention animation
      ============================================================ */
   (function initDiagramPulse() {
     const nodes = document.querySelectorAll('.diagram-node');
     if (!nodes.length) return;
   
     const pulseOrder = [0, 2, 1, 3]; // order of pulsing
     let current = 0;
   
     function pulse() {
       nodes.forEach((n) => n.classList.remove('pulse'));
       const idx = pulseOrder[current % pulseOrder.length];
       if (nodes[idx]) nodes[idx].classList.add('pulse');
       current++;
     }
   
     // Add pulse keyframe dynamically
     const style = document.createElement('style');
     style.textContent = `
       .diagram-node.pulse {
         background: #e8f0fe;
         border-color: #004a99;
         color: #003366;
         box-shadow: 0 0 0 6px rgba(0,74,153,0.08);
       }
       .diagram-node {
         transition: background 0.5s, border-color 0.5s, color 0.5s, box-shadow 0.5s, transform 0.3s, box-shadow 0.3s;
       }
     `;
     document.head.appendChild(style);
   
     pulse();
     setInterval(pulse, 1800);
   })();
   
   /* ============================================================
      8. SCROLL PROGRESS INDICATOR
      ============================================================ */
   (function initScrollProgress() {
     const bar = document.createElement('div');
     bar.id = 'scroll-progress';
     Object.assign(bar.style, {
       position: 'fixed',
       top: '0',
       left: '0',
       height: '3px',
       width: '0%',
       background: 'linear-gradient(90deg, #003366, #0066cc)',
       zIndex: '2000',
       transition: 'width 0.1s linear',
       pointerEvents: 'none',
     });
     document.body.prepend(bar);
   
     window.addEventListener('scroll', () => {
       const scrolled = window.scrollY;
       const total = document.documentElement.scrollHeight - window.innerHeight;
       const pct = total > 0 ? (scrolled / total) * 100 : 0;
       bar.style.width = pct.toFixed(2) + '%';
     }, { passive: true });
   })();

  /* ============================================================
     9. EMAILJS CONTACT FORM
     ============================================================ */
  (function initEmailForm() {
    const form = document.getElementById('emailjs-form');
    const statusEl = document.getElementById('emailjs-status');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    if (!form || !statusEl || !submitBtn) return;

    const PUBLIC_KEY = 'O2vPEN0KlxbGKZEW1';
    const SERVICE_ID = 'service_jvpljwg';
    const TEMPLATE_ID = 'template_0vecfl1';

    const setStatus = (message, type) => {
      statusEl.textContent = message || '';
      statusEl.classList.remove('success', 'error');
      if (type) statusEl.classList.add(type);
    };

    try {
      if (window.emailjs && typeof window.emailjs.init === 'function') {
        window.emailjs.init({ publicKey: PUBLIC_KEY });
      }
    } catch (e) {
      // If EmailJS fails to init, form will show error on submit.
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('Sending…', null);
      submitBtn.disabled = true;

      try {
        if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
          throw new Error('Email service unavailable.');
        }

        // Mirror fields for EmailJS templates that use {{name}} / {{email}}
        const fd = new FormData(form);
        const nameValue = String(fd.get('from_name') || '').trim();
        const emailValue = String(fd.get('reply_to') || '').trim();
        const nameField = form.querySelector('input[name="name"]');
        const emailField = form.querySelector('input[name="email"]');
        if (nameField) nameField.value = nameValue;
        if (emailField) emailField.value = emailValue;

        await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);

        form.reset();
        setStatus('Message sent successfully. We’ll reply soon.', 'success');
      } catch (err) {
        setStatus('Failed to send. Please try again or email us directly.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  })();