/**
 * RM Health – Main JavaScript
 * Handles: navigation, scroll effects, animations,
 * booking form, today's hours display
 */

(function () {
  'use strict';

  /* ----------------------------------------
     1. NAV – scroll effect + mobile toggle
  ---------------------------------------- */
  const header    = document.getElementById('site-header');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNavLink();
  }, { passive: true });

  // Mobile toggle
  navToggle && navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Highlight active section in nav
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 120) currentId = section.id;
    });
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }

  /* ----------------------------------------
     2. INTERSECTION OBSERVER – animations
  ---------------------------------------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers – show all immediately
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
  }

  /* ----------------------------------------
     3. FAQ ACCORDION
  ---------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all
      document.querySelectorAll('.faq-question').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const otherAnswer = other.nextElementSibling;
        if (otherAnswer) otherAnswer.hidden = true;
      });

      // Toggle clicked
      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        // Smooth height animation
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });

  /* ----------------------------------------
     4. TODAY'S HOURS
  ---------------------------------------- */
  function renderTodaysHours() {
    const el = document.getElementById('todays-hours');
    if (!el) return;

    const now   = new Date();
    const day   = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hour  = now.getHours();
    const min   = now.getMinutes();
    const time  = hour + min / 60;

    let dayName, opensAt, closesAt, isOpen;

    if (day >= 1 && day <= 5) {
      dayName  = 'Monday – Friday';
      opensAt  = 8; closesAt = 17;
    } else if (day === 6) {
      dayName  = 'Saturday';
      opensAt  = 8; closesAt = 13;
    } else {
      // Sunday
      el.innerHTML = `
        <div class="open-status closed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          Closed Today (Sunday)
        </div>
        <p>We reopen Monday at 08:00.</p>`;
      return;
    }

    isOpen = time >= opensAt && time < closesAt;
    const statusText = isOpen ? 'Open Now' : 'Closed Now';
    const statusCls  = isOpen ? 'open' : 'closed';
    const statusIcon = isOpen
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

    el.innerHTML = `
      <div class="open-status ${statusCls}">${statusIcon} ${statusText}</div>
      <p><strong>Today (${dayName}):</strong></p>
      <p>0${opensAt}:00 – ${closesAt}:00</p>
      ${!isOpen && day >= 1 && day <= 5 ? '<p style="font-size:.8rem;color:var(--text-muted)">Opens tomorrow at 08:00</p>' : ''}
      ${!isOpen && day === 6 ? '<p style="font-size:.8rem;color:var(--text-muted)">Reopens Monday at 08:00</p>' : ''}
    `;
  }
  renderTodaysHours();

  /* ----------------------------------------
     5. DATE INPUT – set minimum to today
  ---------------------------------------- */
  const dateInput = document.getElementById('book-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ----------------------------------------
     6. BOOKING FORM
  ---------------------------------------- */
  const bookingForm    = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  const bookingSubmit  = document.getElementById('booking-submit');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateBookingForm()) return;

      // Show loading state
      const btnText    = bookingSubmit.querySelector('.btn-text');
      const btnSpinner = bookingSubmit.querySelector('.btn-spinner');
      bookingSubmit.disabled = true;
      if (btnSpinner) btnSpinner.classList.add('is-spinning');
      if (btnText) btnText.textContent = 'Sending…';

      // Collect form data
      const formData = {
        name:    sanitise(document.getElementById('book-name').value),
        phone:   sanitise(document.getElementById('book-phone').value),
        email:   sanitise(document.getElementById('book-email').value),
        service: sanitise(document.getElementById('book-service').value),
        date:    sanitise(document.getElementById('book-date').value),
        type:    sanitise(document.getElementById('book-type').value),
        message: sanitise(document.getElementById('book-message').value),
        submitted: new Date().toISOString()
      };

      // Save lead to localStorage
      saveLead(formData, 'booking');

      // Build WhatsApp fallback message
      const waText = encodeURIComponent(
        `*New Appointment Request – RM Health*\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Service: ${formData.service}\n` +
        `Type: ${formData.type}\n` +
        `Date: ${formData.date || 'Flexible'}\n` +
        `Notes: ${formData.message || 'None'}`
      );

      // Simulate submission (1.2s) then show success
      setTimeout(() => {
        bookingSubmit.disabled = false;
        if (btnSpinner) btnSpinner.classList.remove('is-spinning');
        if (btnText) btnText.textContent = 'Request Appointment';
        bookingForm.reset();
        if (bookingSuccess) bookingSuccess.hidden = false;
        bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Optionally open WhatsApp after 2s
        setTimeout(() => {
          window.open(`https://wa.me/27818018853?text=${waText}`, '_blank', 'noopener,noreferrer');
        }, 2000);
      }, 1200);
    });
  }

  function validateBookingForm() {
    let valid = true;
    const required = bookingForm.querySelectorAll('[required]');
    required.forEach(field => {
      field.classList.remove('error');
      const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (isEmpty) {
        field.classList.add('error');
        valid = false;
      }
    });

    // Phone format check
    const phone = document.getElementById('book-phone');
    if (phone && phone.value && !/^[\d\s\+\-]{9,15}$/.test(phone.value.trim())) {
      phone.classList.add('error');
      valid = false;
    }

    // Email format check
    const email = document.getElementById('book-email');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('error');
      valid = false;
    }

    if (!valid) {
      const first = bookingForm.querySelector('.error');
      if (first) first.focus();
    }
    return valid;
  }

  /* ----------------------------------------
     7. LEAD STORAGE (localStorage)
  ---------------------------------------- */
  function saveLead(data, type) {
    try {
      const key   = 'rmhealth_leads';
      const leads = JSON.parse(localStorage.getItem(key) || '[]');
      leads.push({ type, ...data });
      localStorage.setItem(key, JSON.stringify(leads.slice(-100))); // keep last 100
    } catch (_) { /* storage may be unavailable */ }
  }

  /* ----------------------------------------
     8. SANITISE helper (basic XSS prevention)
  ---------------------------------------- */
  function sanitise(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .trim()
      .slice(0, 500);
  }

  /* ----------------------------------------
     9. FOOTER YEAR
  ---------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------
     10. SMOOTH SCROLL for anchor links
  ---------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72', 10);
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
