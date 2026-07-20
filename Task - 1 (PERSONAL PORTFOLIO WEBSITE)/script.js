/* ============================================
   PERSONAL PORTFOLIO — JavaScript (Optimized)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav__link');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTop');
    const cursorGlow = document.getElementById('cursorGlow');
    const contactForm = document.getElementById('contactForm');
    const particleCanvas = document.getElementById('particleCanvas');

    // Mobile Nav Toggle & Overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    document.body.appendChild(overlay);

    const toggleMenu = (open) => {
        navMenu.classList.toggle('show-menu', open);
        overlay.classList.toggle('show', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMenu(true));
    [navClose, overlay].forEach(el => el.addEventListener('click', () => toggleMenu(false)));
    navLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => e.key === 'Escape' && toggleMenu(false));

    // Swipe-to-close gesture
    let touchStartX = 0;
    navMenu.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
    navMenu.addEventListener('touchmove', e => {
        const diff = e.touches[0].clientX - touchStartX;
        if (diff > 0) navMenu.style.transform = `translateX(${diff}px)`;
    }, { passive: true });
    navMenu.addEventListener('touchend', e => {
        navMenu.style.transform = '';
        if (e.changedTouches[0].clientX - touchStartX > 80) toggleMenu(false);
    }, { passive: true });

    // Scroll Effects (Header scrolled & Scroll Top Button)
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        header.classList.toggle('scrolled', scrolled > 50);
        scrollTopBtn.classList.toggle('show', scrolled > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const highlightNav = () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop, height = section.offsetHeight, id = section.id;
            if (scrollY > top && scrollY <= top + height) {
                navLinks.forEach(link => link.classList.toggle('active-link', link.dataset.section === id));
            }
        });
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    // Theme Toggle
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });

    // Cursor Glow
    if (!('ontouchstart' in window)) {
        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
        document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
        const animateGlow = () => {
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    // Typewriter Effect
    const typewriterEl = document.getElementById('typewriter');
    const phrases = ['beautiful web apps.', 'interactive UIs.', 'scalable backends.', 'engaging experiences.', 'modern solutions.'];
    let phraseIdx = 0, charIdx = 0, isDeleting = false;
    const type = () => {
        const phrase = phrases[phraseIdx];
        typewriterEl.textContent = phrase.substring(0, charIdx + (isDeleting ? -1 : 1));
        charIdx += isDeleting ? -1 : 1;
        let delay = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === phrase.length) { delay = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { delay = 500; isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
        setTimeout(type, delay);
    };
    if (typewriterEl) type();

    // Stats Counters Animation
    const animateCounters = () => {
        document.querySelectorAll('.about__stat-number').forEach(stat => {
            const target = parseInt(stat.dataset.count), increment = target / 60;
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else stat.textContent = target + '+';
            };
            updateCounter();
        });
    };

    // Skill Tabs & Bar Animations
    const animateSkillBars = (panel) => {
        const bars = panel ? panel.querySelectorAll('.skill-card__progress') : document.querySelectorAll('.skills__panel.active .skill-card__progress');
        bars.forEach(bar => {
            bar.style.width = '0%';
            setTimeout(() => bar.style.width = bar.dataset.progress + '%', 100);
        });
    };

    document.querySelectorAll('.skills__tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.skills__tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.skills__panel').forEach(panel => {
                const active = panel.id === `panel-${tab.dataset.tab}`;
                panel.classList.toggle('active', active);
                if (active) animateSkillBars(panel);
            });
        });
    });

    // Projects Filtering & Click Delegation
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', e => {
            if (!e.target.closest('.project-card__link')) card.querySelector('.project-card__link')?.click();
        });
    });

    document.querySelectorAll('.projects__filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.projects__filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.project-card').forEach(card => {
                const match = btn.dataset.filter === 'all' || card.dataset.category === btn.dataset.filter;
                card.classList.toggle('hidden', !match);
                if (match) card.style.animation = 'fadeInPanel 0.5s ease forwards';
            });
        });
    });

    // Contact Form Validation
    const fields = {
        name: [document.getElementById('contactName'), document.getElementById('nameError'), v => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : ''],
        email: [document.getElementById('contactEmail'), document.getElementById('emailError'), v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? 'Please enter a valid email' : ''],
        subject: [document.getElementById('contactSubject'), document.getElementById('subjectError'), v => !v.trim() ? 'Subject is required' : v.trim().length < 3 ? 'Subject must be at least 3 characters' : ''],
        message: [document.getElementById('contactMessage'), document.getElementById('messageError'), v => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'Message must be at least 10 characters' : '']
    };

    const validateField = (input, error, checkFn) => {
        const msg = checkFn(input.value);
        error.textContent = msg;
        input.classList.toggle('error', !!msg);
        return !msg;
    };

    Object.values(fields).forEach(([input, error, check]) => {
        input.addEventListener('blur', () => validateField(input, error, check));
        input.addEventListener('input', () => input.classList.contains('error') && validateField(input, error, check));
    });

    // Character Count for Message
    const messageInput = document.getElementById('contactMessage');
    if (messageInput) {
        const charCountEl = document.createElement('span');
        charCountEl.id = 'charCount';
        charCountEl.style.cssText = 'display:block;text-align:right;font-size:0.75rem;color:var(--text-muted);margin-top:4px;';
        messageInput.closest('.form__field').appendChild(charCountEl);
        messageInput.setAttribute('maxlength', '500');
        const updateCount = () => {
            charCountEl.textContent = `${messageInput.value.length}/500`;
            charCountEl.style.color = messageInput.value.length > 450 ? '#ef4444' : 'var(--text-muted)';
        };
        messageInput.addEventListener('input', updateCount);
        updateCount();
    }

    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const isValid = Object.values(fields).map(([i, er, c]) => validateField(i, er, c)).every(Boolean);
        if (!isValid) return;

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            document.getElementById('formSuccess').classList.add('show');
            contactForm.reset();
            if (document.getElementById('charCount')) document.getElementById('charCount').textContent = '0/500';
            setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
        }, 2000);
    });

    // Intersection Observer Animations
    let countersAnimated = false, skillsAnimated = false;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.closest('#about') && !countersAnimated) {
                    countersAnimated = true;
                    animateCounters();
                }
                if (entry.target.closest('#skills') && !skillsAnimated) {
                    skillsAnimated = true;
                    setTimeout(animateSkillBars, 300);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Particle Background
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [], animId;
        const resize = () => { particleCanvas.width = window.innerWidth; particleCanvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > particleCanvas.width || this.y < 0 || this.y > particleCanvas.height) this.reset();
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`; ctx.fill();
            }
        }

        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        const draw = () => {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 120) {
                        ctx.beginPath(); ctx.strokeStyle = `rgba(108, 99, 255, ${(1 - dist/120) * 0.15})`;
                        ctx.lineWidth = 1; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();

        new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { if (!animId) draw(); }
            else { cancelAnimationFrame(animId); animId = null; }
        }), { threshold: 0 }).observe(document.getElementById('home'));
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = target.offsetTop - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
});
