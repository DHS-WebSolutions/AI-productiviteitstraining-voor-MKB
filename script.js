/* ================================================================
   DHS — JavaScript
   ================================================================ */

/* ----------------------------------------------------------------
   Navigatie: frosted-glass effect bij scrollen
   ---------------------------------------------------------------- */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ----------------------------------------------------------------
   Mobiel menu
   ---------------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function toggleMenu(state) {
    menuOpen = state;
    hamburger.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', !menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!menuOpen));

// Sluit menu bij klik op een link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// Sluit menu bij Escape-toets
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});


/* ----------------------------------------------------------------
   Scroll-animaties via IntersectionObserver
   ---------------------------------------------------------------- */
const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            animObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('[data-animate]').forEach(el => {
    animObserver.observe(el);
});


/* ----------------------------------------------------------------
   Dot-grid animatie (Voor wie sectie)
   ---------------------------------------------------------------- */
const dotGrid = document.getElementById('dotGrid');

if (dotGrid) {
    const COLS = 10;
    const ROWS = 8;
    const TOTAL = COLS * ROWS;

    // Genereer stippen
    for (let i = 0; i < TOTAL; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotGrid.appendChild(dot);
    }

    const dots = dotGrid.querySelectorAll('.dot');
    const lit  = new Set();

    function tick() {
        // Verwijder willekeurig actieve stippen
        lit.forEach(idx => {
            if (Math.random() > 0.55) {
                dots[idx].classList.remove('lit');
                lit.delete(idx);
            }
        });
        // Voeg nieuwe actieve stippen toe
        const add = Math.floor(Math.random() * 7) + 4;
        for (let i = 0; i < add; i++) {
            const idx = Math.floor(Math.random() * TOTAL);
            dots[idx].classList.add('lit');
            lit.add(idx);
        }
    }

    tick();
    setInterval(tick, 900);
}


/* ----------------------------------------------------------------
   Smooth scroll voor anker-links
   ---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const id     = anchor.getAttribute('href');
        const target = id === '#' ? null : document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* ----------------------------------------------------------------
   Contact formulier

   ================================================================
   E-MAIL KOPPELING — KIES ÉÉN OPTIE

   OPTIE 1 — Formspree (eenvoudigst, aanbevolen):
     1. Maak een account op https://formspree.io
     2. Maak een nieuw formulier aan (gebruik daleboudt.thomas@gmail.com)
     3. Vervang in index.html de action van het formulier:
        action="https://formspree.io/f/JOUW_FORM_ID"
        method="POST"
     4. Verwijder dan de submit-handler hieronder (of commentarieer hem uit).
        Formspree verwerkt de redirect/bevestiging zelf.

   OPTIE 2 — EmailJS (geen server nodig, stuurt direct e-mail):
     1. Maak een account op https://www.emailjs.com
     2. Maak een e-mailservice + template aan.
     3. Voeg toe aan index.html boven </body>:
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
     4. Vervang de 'TIJDELIJKE HANDLER' hieronder door:

        emailjs.init('JOUW_EMAILJS_PUBLIC_KEY');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate()) return;
            setLoading(true);
            emailjs.sendForm('JOUW_SERVICE_ID', 'JOUW_TEMPLATE_ID', contactForm)
                .then(() => showSuccess(), () => showError('Er ging iets mis. Probeer opnieuw.'));
        });

   OPTIE 3 — Netlify Forms (alleen als je op Netlify host):
     1. Voeg toe aan <form>: data-netlify="true"
     2. Voeg toe als eerste child van <form>:
        <input type="hidden" name="form-name" value="contact">
     3. Verwijder de handler hieronder — Netlify verwerkt alles.
     4. Stel het doorstuuradres in via:
        Netlify dashboard > Forms > jouw formulier > Form notifications
        E-mailadres: daleboudt.thomas@gmail.com
   ================================================================
   ---------------------------------------------------------------- */

const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

function setLoading(active) {
    submitBtn.disabled    = active;
    submitBtn.textContent = active ? 'Versturen...' : 'Verstuur bericht';
}

function showSuccess() {
    contactForm.style.display = 'none';
    formSuccess.classList.add('visible');
}

function validate() {
    const naam    = contactForm.querySelector('#naam').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const bericht = contactForm.querySelector('#bericht').value.trim();
    const valid   = naam && email && bericht;

    formError.classList.toggle('visible', !valid);
    return valid;
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        formError.classList.remove('visible');
        if (!validate()) return;

        /* ---- TIJDELIJKE HANDLER ---- */
        /* Vervang dit blok wanneer je Formspree / EmailJS / Netlify koppelt.
           Op dit moment toont het alleen een succesbevestiging (geen e-mail verstuurd). */
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showSuccess();
        }, 850);
        /* ---- EINDE TIJDELIJKE HANDLER ---- */
    });
}
