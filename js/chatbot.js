/**
 * RM Health – Chatbot (FAQ + Lead Capture)
 * Keyword-matching FAQ engine with lead capture trigger
 */

(function () {
  'use strict';

  /* ------------------------------------------
     FAQ Knowledge Base
  ------------------------------------------ */
  const FAQ = [
    {
      triggers: ['service', 'offer', 'do you do', 'what can', 'treat', 'help with'],
      response: `RM Health offers 6 services:<br>
        <strong>1. Acute Care</strong> – Illness & injury treatment<br>
        <strong>2. Chronic Care</strong> – Diabetes, hypertension, HIV & more<br>
        <strong>3. Family Planning</strong> – Contraception & reproductive health<br>
        <strong>4. Women's Health</strong> – Pap smears, menstrual & hormonal health<br>
        <strong>5. Virtual Consults</strong> – Video/phone appointments<br>
        <strong>6. IV Therapy</strong> – Vitamin & hydration drips<br><br>
        Would you like to book for any of these? 😊`
    },
    {
      triggers: ['hours', 'open', 'close', 'time', 'when', 'operating'],
      response: `We're open:<br>
        📅 <strong>Mon – Fri:</strong> 08:00 – 17:00<br>
        📅 <strong>Saturday:</strong> 08:00 – 13:00<br>
        🚫 <strong>Sunday:</strong> Closed<br><br>
        Walk-ins are welcome, but booking ahead is recommended to avoid waiting.`
    },
    {
      triggers: ['location', 'where', 'address', 'directions', 'find you', 'situated', 'hazyview', 'lowveld'],
      response: `We're located at:<br>
        📍 <strong>Local Choice Pharmacy Mahumani</strong><br>
        Lowveld Mall, Hazyview, Mpumalanga<br><br>
        <a href="https://maps.google.com/?q=Lowveld+Mall+Hazyview+Mpumalanga" target="_blank" rel="noopener noreferrer" style="color:#1565c0;font-weight:600;">Get Directions on Google Maps →</a>`
    },
    {
      triggers: ['book', 'appointment', 'schedule', 'consult', 'visit', 'see the doctor', 'reserve'],
      response: `You can book an appointment in 3 ways:<br>
        📞 <strong>Call:</strong> <a href="tel:0818018853" style="color:#1565c0;">081 801 8853</a><br>
        💬 <strong>WhatsApp:</strong> <a href="https://wa.me/27818018853" target="_blank" rel="noopener noreferrer" style="color:#25d366;">Chat Now</a><br>
        📝 <strong>Online Form:</strong> Scroll down to the "Book Appointment" section<br><br>
        Would you like to leave your details so we can call <em>you</em> back?`,
      leadCapture: true
    },
    {
      triggers: ['virtual', 'online', 'video', 'remote', 'teleconsult', 'phone consult'],
      response: `Yes! We offer <strong>virtual consultations</strong> via video or phone. 💻<br><br>
        Just book your virtual appointment, and you'll receive a link at the agreed time. Prescriptions and referral letters can be sent electronically.<br><br>
        <strong>Virtual consults are ideal for:</strong> script renewals, follow-ups, chronic condition check-ins, and minor complaints.`
    },
    {
      triggers: ['iv', 'drip', 'infusion', 'vitamin', 'hydrat', 'wellness drip'],
      response: `<strong>IV Therapy</strong> at RM Health involves:<br><br>
        💉 Intravenous vitamins, minerals & fluids administered directly by Dr Maluleke.<br>
        ⏱️ Sessions take approximately 30–60 minutes.<br>
        ✅ Great for rehydration, immune support, fatigue, and general wellness.<br><br>
        Contact us to discuss which IV drip is right for you.`
    },
    {
      triggers: ['medical aid', 'aid', 'scheme', 'insurance', 'cover', 'payment', 'cost', 'price', 'fee'],
      response: `We accept most major medical aids. 🏥<br><br>
        Please contact us directly to confirm your specific scheme is accepted.<br><br>
        💳 <strong>Cash and EFT payments are also accepted.</strong><br>
        📞 Call us: <a href="tel:0818018853" style="color:#1565c0;">081 801 8853</a>`
    },
    {
      triggers: ['sick note', 'certificate', 'medical certificate', 'letter', 'sick leave'],
      response: `Yes! Dr Maluleke issues <strong>medical certificates and sick notes</strong> following a proper consultation. 📄<br><br>
        These can also be provided after virtual consultations where clinically appropriate. Contact us to book.`
    },
    {
      triggers: ['child', 'baby', 'kid', 'paediatric', 'pediatric', 'family'],
      response: `Absolutely! RM Health provides <strong>family healthcare</strong> including consultations for children. 👨‍👩‍👧<br><br>
        We cover paediatric acute care, immunisation advice, and family planning.`
    },
    {
      triggers: ['women', 'pap', 'smear', 'menstrual', 'period', 'hormonal', 'menopause', 'contraception', 'pill', 'female'],
      response: `Dr Maluleke offers <strong>dedicated women's health services</strong>, including:<br><br>
        👩 Pap smears & cervical health<br>
        💊 Contraception (pill, injection, IUD advice)<br>
        🩸 Menstrual health & hormonal concerns<br>
        🌡️ Menopause management<br>
        🩺 Breast health<br><br>
        All consultations are confidential and handled with care.`
    },
    {
      triggers: ['chronic', 'diabetes', 'hypertension', 'asthma', 'hiv', 'long term', 'ongoing'],
      response: `Dr Maluleke provides ongoing <strong>chronic disease management</strong> for:<br><br>
        🩸 Diabetes (Type 1 & 2)<br>
        ❤️ Hypertension (high blood pressure)<br>
        💨 Asthma & respiratory conditions<br>
        💊 HIV management<br>
        📋 Repeat prescriptions & script renewals<br><br>
        Regular monitoring and personalised treatment plans are available.`
    },
    {
      triggers: ['contact', 'phone', 'call', 'email', 'whatsapp', 'reach'],
      response: `You can reach us through:<br><br>
        📞 <a href="tel:0818018853" style="color:#1565c0;font-weight:600;">081 801 8853</a><br>
        📧 <a href="mailto:rmhealth26@gmail.com" style="color:#1565c0;font-weight:600;">rmhealth26@gmail.com</a><br>
        💬 <a href="https://wa.me/27818018853" target="_blank" rel="noopener noreferrer" style="color:#25d366;font-weight:600;">WhatsApp: 081 801 8853</a><br><br>
        We typically respond within a few hours during working hours.`
    },
    {
      triggers: ['doctor', 'dr', 'maluleke', 'rirhandzu', 'who', 'qualification', 'mbchb'],
      response: `<strong>Dr Rirhandzu Maluleke</strong> is a qualified general practitioner. 👩‍⚕️<br><br>
        🎓 MBChB – Sefako Makgatho Health Sciences University (SMU)<br>
        🏥 HPCSA Registered – PR No: 1317512<br><br>
        Dr Maluleke is committed to compassionate, evidence-based care for every patient.`
    },
    {
      triggers: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'howzit', 'hola'],
      response: `Hello! 👋 Welcome to RM Health.<br><br>
        I'm here to help with questions about our services, hours, location, and bookings.<br>
        <strong>How can I assist you today?</strong>`
    },
    {
      triggers: ['thank', 'thanks', 'great', 'perfect', 'awesome'],
      response: `You're welcome! 😊<br><br>
        Is there anything else I can help you with? For direct assistance:<br>
        📞 <a href="tel:0818018853" style="color:#1565c0;">081 801 8853</a> | 
        💬 <a href="https://wa.me/27818018853" target="_blank" rel="noopener noreferrer" style="color:#25d366;">WhatsApp</a>`
    }
  ];

  const DEFAULT_RESPONSE = `I'm not sure about that specific question. 🤔<br><br>
    For the most accurate answer, please:<br>
    📞 Call us: <a href="tel:0818018853" style="color:#1565c0;font-weight:600;">081 801 8853</a><br>
    💬 <a href="https://wa.me/27818018853" target="_blank" rel="noopener noreferrer" style="color:#25d366;font-weight:600;">WhatsApp</a><br><br>
    Or try asking about: <em>services, hours, location, booking, or IV therapy</em>.`;

  /* ------------------------------------------
     Find matching FAQ
  ------------------------------------------ */
  function findAnswer(query) {
    const q = query.toLowerCase().trim();
    for (const item of FAQ) {
      if (item.triggers.some(trigger => q.includes(trigger))) {
        return item;
      }
    }
    return { response: DEFAULT_RESPONSE, leadCapture: false };
  }

  /* ------------------------------------------
     Sanitise user input (prevent XSS)
  ------------------------------------------ */
  function sanitiseText(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML.slice(0, 300);
  }

  /* ------------------------------------------
     Render message
  ------------------------------------------ */
  function appendMessage(container, html, role) {
    const msgEl = document.createElement('div');
    msgEl.className = `message message--${role}`;
    const bubble = document.createElement('p');
    if (role === 'bot') {
      bubble.innerHTML = html; // bot HTML is controlled (no user content)
    } else {
      bubble.textContent = html; // user input as text only
    }
    msgEl.appendChild(bubble);
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
    return msgEl;
  }

  function showTypingIndicator(container) {
    const el = document.createElement('div');
    el.className = 'message message--bot typing-indicator';
    el.innerHTML = '<p style="letter-spacing:.2em;color:var(--text-muted)">●●●</p>';
    el.id = 'typing-' + container.id;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator(container) {
    const el = document.getElementById('typing-' + container.id);
    if (el) el.remove();
  }

  /* ------------------------------------------
     Show lead capture form in the inline panel
  ------------------------------------------ */
  function showLeadForm(leadFormEl) {
    if (!leadFormEl || !leadFormEl.hidden) return;
    leadFormEl.hidden = false;
    leadFormEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setupLeadForm(leadFormEl.querySelector('form'));
  }

  function setupLeadForm(form) {
    if (!form || form._rmSetup) return;
    form._rmSetup = true;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl    = form.querySelector('[name="name"]');
      const phoneEl   = form.querySelector('[name="phone"]');
      const emailEl   = form.querySelector('[name="email"]');
      const serviceEl = form.querySelector('[name="service"]');
      const msgEl     = form.querySelector('[name="message"]');

      // Validate
      let valid = true;
      [nameEl, phoneEl].forEach(f => {
        if (f && !f.value.trim()) { f.classList.add('error'); valid = false; }
        else if (f) f.classList.remove('error');
      });
      if (phoneEl && phoneEl.value && !/^[\d\s\+\-]{9,15}$/.test(phoneEl.value.trim())) {
        phoneEl.classList.add('error'); valid = false;
      }
      if (!valid) return;

      const lead = {
        name:    sanitiseText(nameEl ? nameEl.value : ''),
        phone:   sanitiseText(phoneEl ? phoneEl.value : ''),
        email:   sanitiseText(emailEl ? emailEl.value : ''),
        service: sanitiseText(serviceEl ? serviceEl.value : ''),
        message: sanitiseText(msgEl ? msgEl.value : ''),
        submitted: new Date().toISOString()
      };

      // Save to localStorage
      try {
        const key = 'rmhealth_leads';
        const leads = JSON.parse(localStorage.getItem(key) || '[]');
        leads.push({ type: 'chatbot', ...lead });
        localStorage.setItem(key, JSON.stringify(leads.slice(-100)));
      } catch (_) {}

      // Build WhatsApp message
      const waText = encodeURIComponent(
        `*New Enquiry – RM Health Website*\n` +
        `Name: ${lead.name}\nPhone: ${lead.phone}\nService: ${lead.service || 'Not specified'}\nMessage: ${lead.message || 'None'}`
      );

      // Replace form with thank-you message
      form.closest('.chatbot-lead-form').innerHTML = `
        <div style="text-align:center;padding:1rem">
          <div style="font-size:2rem;margin-bottom:.5rem">✅</div>
          <strong style="color:var(--text-dark)">Thank you, ${lead.name}!</strong>
          <p style="color:var(--text-muted);font-size:.875rem;margin-top:.4rem">We'll call you back shortly on <strong>${lead.phone}</strong>.</p>
          <a href="https://wa.me/27818018853?text=${waText}" target="_blank" rel="noopener noreferrer"
             style="display:inline-flex;align-items:center;gap:.4rem;margin-top:1rem;padding:.6rem 1.25rem;background:var(--whatsapp);color:white;border-radius:50px;font-weight:600;font-size:.875rem;text-decoration:none;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Also send via WhatsApp
          </a>
        </div>`;
    });
  }

  /* ------------------------------------------
     Core chat handler
  ------------------------------------------ */
  function handleChat(inputEl, messagesEl, leadFormEl) {
    const query = inputEl.value.trim();
    if (!query) return;

    inputEl.value = '';
    appendMessage(messagesEl, sanitiseText(query), 'user');
    showTypingIndicator(messagesEl);

    setTimeout(() => {
      removeTypingIndicator(messagesEl);
      const item = findAnswer(query);
      appendMessage(messagesEl, item.response, 'bot');

      if (item.leadCapture && leadFormEl) {
        setTimeout(() => {
          appendMessage(messagesEl, 'Fill in your details below and we\'ll call you back 👇', 'bot');
          showLeadForm(leadFormEl);
        }, 600);
      }
    }, 750 + Math.random() * 400);
  }

  /* ------------------------------------------
     Quick reply handler
  ------------------------------------------ */
  function bindQuickReplies(container, inputEl, messagesEl, leadFormEl) {
    container.addEventListener('click', e => {
      const btn = e.target.closest('.quick-reply');
      if (!btn) return;
      inputEl.value = btn.dataset.query || btn.textContent;
      handleChat(inputEl, messagesEl, leadFormEl);
    });
  }

  /* ------------------------------------------
     INLINE CHATBOT (FAQ section, desktop)
  ------------------------------------------ */
  const inlineMessages  = document.getElementById('chatbot-messages');
  const inlineInput     = document.getElementById('chatbot-input');
  const inlineSendBtn   = document.getElementById('chatbot-send');
  const inlineLeadForm  = document.getElementById('chatbot-lead-form');

  if (inlineMessages && inlineInput && inlineSendBtn) {
    inlineSendBtn.addEventListener('click', () => handleChat(inlineInput, inlineMessages, inlineLeadForm));
    inlineInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(inlineInput, inlineMessages, inlineLeadForm); }
    });
    bindQuickReplies(inlineMessages, inlineInput, inlineMessages, inlineLeadForm);
    setupLeadForm(inlineLeadForm && inlineLeadForm.querySelector('form'));
  }

  /* ------------------------------------------
     FLOATING CHATBOT (mobile FAB)
  ------------------------------------------ */
  const fab          = document.getElementById('chatbot-fab');
  const floatWindow  = document.getElementById('chatbot-float-window');
  const floatClose   = document.getElementById('chatbot-close-float');
  const floatMsgs    = document.getElementById('chatbot-messages-float');
  const floatInput   = document.getElementById('chatbot-input-float');
  const floatSend    = document.getElementById('chatbot-send-float');
  let floatInit      = false;

  function closeFloatBot() {
    if (!floatWindow) return;
    floatWindow.hidden = true;

    if (fab) {
      fab.setAttribute('aria-expanded', 'false');
      const chatIcon  = fab.querySelector('.fab-chat-icon');
      const closeIcon = fab.querySelector('.fab-close-icon');
      if (chatIcon) chatIcon.hidden = false;
      if (closeIcon) closeIcon.hidden = true;
    }
  }

  function initFloatBot() {
    if (floatInit) return;
    floatInit = true;
    appendMessage(floatMsgs,
      `👋 Hi! I'm the RM Health assistant. Ask me about services, hours, location, or booking.<br><div class="quick-replies"><button class="quick-reply" data-query="What services do you offer?">Services</button><button class="quick-reply" data-query="What are your hours?">Hours</button><button class="quick-reply" data-query="How do I book an appointment?">Book</button></div>`,
      'bot');
    bindQuickReplies(floatMsgs, floatInput, floatMsgs, null);
  }

  if (fab && floatWindow) {
    fab.addEventListener('click', () => {
      const isOpen = floatWindow.hidden;
      floatWindow.hidden = !isOpen;
      fab.setAttribute('aria-expanded', isOpen.toString());
      const chatIcon  = fab.querySelector('.fab-chat-icon');
      const closeIcon = fab.querySelector('.fab-close-icon');
      if (chatIcon)  chatIcon.hidden  = isOpen;
      if (closeIcon) closeIcon.hidden = !isOpen;
      if (isOpen) { initFloatBot(); floatInput && floatInput.focus(); }
    });
  }

  if (floatClose) {
    // Use both click and touchend to support mobile browsers consistently.
    floatClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeFloatBot();
    });
    floatClose.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeFloatBot();
    }, { passive: false });
  }

  if (floatSend && floatInput && floatMsgs) {
    floatSend.addEventListener('click', () => handleChat(floatInput, floatMsgs, null));
    floatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(floatInput, floatMsgs, null); }
    });
  }

  // Close float window on outside click
  document.addEventListener('click', e => {
    if (floatWindow && !floatWindow.hidden &&
        !floatWindow.contains(e.target) && (!fab || !fab.contains(e.target))) {
      closeFloatBot();
    }
  });

  // Keyboard close support for accessibility.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && floatWindow && !floatWindow.hidden) {
      closeFloatBot();
    }
  });

})();
