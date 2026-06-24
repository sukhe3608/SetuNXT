(function() {
  document.addEventListener('DOMContentLoaded', function() {

    /* ══ HAMBURGER MENU ══ */
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var mobileNav    = document.getElementById('mobile-nav');
    if (hamburgerBtn && mobileNav) {
      hamburgerBtn.addEventListener('click', function() {
        var isOpen = mobileNav.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
      // Close on mobile nav link click
      mobileNav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          mobileNav.classList.remove('open');
          hamburgerBtn.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* ══ AD CAROUSEL ══ */
    var slides = document.querySelectorAll('.ad-slide');
    var dots   = document.querySelectorAll('.ad-dot');
    var current = 0;
    var isAnimating = false;
    var carouselTimer;

    function restartDotAnimation(dot) {
      // Force CSS animation restart by removing and re-adding the active class
      dot.classList.remove('active');
      void dot.offsetWidth; // reflow
      dot.classList.add('active');
    }

    function goToSlide(index) {
      if (isAnimating || index === current) return;
      isAnimating = true;

      var prevSlide = slides[current];
      var prevDot   = dots[current];

      current = (index + slides.length) % slides.length;

      var nextSlide = slides[current];
      var nextDot   = dots[current];

      // Outgoing: add leaving class
      prevSlide.classList.add('leaving');
      prevDot.classList.remove('active');

      // Incoming: make visible and animate in
      nextSlide.classList.add('active', 'entering');
      restartDotAnimation(nextDot);

      // After slide-out completes, clean up leaving slide
      setTimeout(function() {
        prevSlide.classList.remove('active', 'leaving');
        nextSlide.classList.remove('entering');
        isAnimating = false;
      }, 480);
    }

    function startCarousel() {
      carouselTimer = setInterval(function() {
        goToSlide(current + 1);
      }, 3000);
    }

    function resetCarousel() {
      clearInterval(carouselTimer);
      startCarousel();
    }

    if (slides.length > 0) {
      // Initialise first dot progress animation
      restartDotAnimation(dots[0]);
      // Dot click navigation
      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          goToSlide(parseInt(dot.dataset.index));
          resetCarousel();
        });
      });
      startCarousel();
    }


    /* ══ USE CASE CATEGORY TAGGING ══ */
    var cards = document.querySelectorAll('.usecase-card');
    cards.forEach(function(card) {
      var titleEl = card.querySelector('h4');
      if (!titleEl) return;
      var title = titleEl.innerText.trim().toLowerCase();

      var category = 'all';
      if (title.includes('order') || title.includes('delivery') || title.includes('cart')) {
        category = 'e-commerce';
      } else if (title.includes('banking') || title.includes('otp') || title.includes('account')) {
        category = 'banking-finance';
      } else if (title.includes('appointment') || title.includes('clinic') || title.includes('hospital')) {
        category = 'healthcare';
      } else if (title.includes('travel') || title.includes('itineraries') || title.includes('flight')) {
        category = 'travel';
      } else if (title.includes('student') || title.includes('course') || title.includes('education')) {
        category = 'education';
      } else if (title.includes('promotional') || title.includes('campaigns') || title.includes('catalogs')) {
        category = 'e-commerce';
      }
      card.dataset.category = category;
    });

    /* ══ TAB FILTER ══ */
    var tabButtons = document.querySelectorAll('.tab-btn');
    var useCaseGrid = document.querySelector('.usecase-grid');
    if (tabButtons.length && useCaseGrid) {
      var categoryMap = {
        'All Industries':   'all',
        'E-Commerce':       'e-commerce',
        'Banking & Finance':'banking-finance',
        'Healthcare':       'healthcare',
        'Travel':           'travel',
        'Education':        'education'
      };

      function filterCards(category) {
        cards.forEach(function(card) {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }

      tabButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          tabButtons.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var category = categoryMap[btn.innerText.trim()] || 'all';
          filterCards(category);
        });
      });
    }

    /* ══ SMOOTH SCROLL ══ */
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var targetId = a.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ══ BAR ANIMATION ON SCROLL ══ */
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar-fill').forEach(function(bar) {
            var w = bar.style.width;
            bar.style.width = '0';
            setTimeout(function() { bar.style.width = w; }, 100);
          });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.why-visual').forEach(function(el) { observer.observe(el); });

  });
})();



/* ══ SERVICE MODAL ══ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     RICH SERVICE DATA
  ══════════════════════════════════════════ */
  var SERVICES = {
    RCS: {
      themeClass: 'snp-theme-rcs',
      icon: 'fas fa-mobile-alt',
      label: 'RCS Business Messaging',
      heroTitle: 'The Next Generation<br>of Business SMS',
      heroDesc: "Go beyond plain text. Deliver rich, branded, interactive messages straight to your customer's native messaging app &mdash; verified, engaging, and zero app installs needed.",
      pills: [
        { num:'85%',  lbl:'Avg. Open Rate' },
        { num:'3x',   lbl:'Higher CTR vs SMS' },
        { num:'98%',  lbl:'Delivery SLA' },
        { num:'0',    lbl:'App Installs' }
      ],
      featTag: 'What You Get',
      featTitle: 'Everything RCS Can Do for You',
      featSub: 'RCS transforms your messaging into a full brand experience &mdash; rich, interactive, and trusted.',
      features: [
        { ico:'fas fa-images',          cls:'ico-blue',   title:'Rich Media Messaging',     desc:'Send images, videos, GIFs, and PDFs directly in the native messages app.' },
        { ico:'fas fa-hand-pointer',    cls:'ico-blue',   title:'Interactive Buttons',      desc:'Quick-reply and action buttons let customers respond in one tap.' },
        { ico:'fas fa-shield-alt',      cls:'ico-blue',   title:'Verified Brand Identity',  desc:'Blue checkmark and brand logo builds instant trust with recipients.' },
        { ico:'fas fa-check-double',    cls:'ico-blue',   title:'Read Receipts',            desc:'Know exactly when your message was delivered and read.' },
        { ico:'fas fa-th-large',        cls:'ico-blue',   title:'Carousel Cards',           desc:'Showcase products, offers, or stories in swipeable card carousels.' },
        { ico:'fas fa-comments',        cls:'ico-blue',   title:'Two-Way Conversations',    desc:'Real-time back-and-forth with customers within the messaging thread.' }
      ],
      howTag: 'How It Works',
      howTitle: 'Start Sending RCS in 4 Steps',
      steps: [
        { num:'01', title:'Register Brand',  desc:'Verify your business and set up your branded sender profile.' },
        { num:'02', title:'Design Messages', desc:'Build rich templates with our drag-and-drop message builder.' },
        { num:'03', title:'Segment & Send',  desc:'Target the right audience and launch your RCS campaign.' },
        { num:'04', title:'Track Results',   desc:'Monitor delivery, reads, and clicks in real-time.' }
      ],
      trustIco: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a6fd4" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><path d="M6 3h12v10a6 6 0 0 1-12 0V3z"/><path d="M9 21h6"/><path d="M12 17v4"/></svg>',
      trustTitle: 'Trusted by 99+ Businesses',
      trustDesc: 'SetuNxt RCS customers report 3x higher engagement vs traditional SMS &mdash; with zero additional apps for end users.'
    },

    Email: {
      themeClass: 'snp-theme-email',
      icon: 'fas fa-envelope-open-text',
      label: 'Enterprise Email',
      heroTitle: 'High-Impact Email<br>at Massive Scale',
      heroDesc: 'Send transactional triggers and bulk promotional blasts with industry-leading deliverability, deep personalisation, and real-time analytics &mdash; all from one platform.',
      pills: [
        { num:'98%',  lbl:'Delivery Rate' },
        { num:'10M+', lbl:'Emails / Day' },
        { num:'40%',  lbl:'Avg. Open Rate' },
        { num:'<1s',  lbl:'Send Latency' }
      ],
      featTag: 'What You Get',
      featTitle: 'Enterprise-Grade Email Features',
      featSub: 'Every tool you need to send, personalise, and optimise email at scale.',
      features: [
        { ico:'fas fa-paper-plane',     cls:'ico-orange', title:'Transactional Emails',     desc:'Order confirmations, OTPs, and receipts delivered in milliseconds.' },
        { ico:'fas fa-bullhorn',        cls:'ico-orange', title:'Promotional Campaigns',    desc:'Bulk blasts with smart segmentation for maximum relevance.' },
        { ico:'fas fa-sliders-h',       cls:'ico-orange', title:'Drag-and-Drop Builder',    desc:'Design pixel-perfect emails without writing a single line of code.' },
        { ico:'fas fa-chart-line',      cls:'ico-orange', title:'Real-Time Analytics',      desc:'Open rates, click maps, and conversions tracked live per campaign.' },
        { ico:'fas fa-server',          cls:'ico-orange', title:'Dedicated IPs',            desc:'Dedicated sending IPs and guided domain warmup for inbox placement.' },
        { ico:'fas fa-flask',           cls:'ico-orange', title:'A/B Testing',              desc:'Test subject lines, content, and CTAs to maximise performance.' }
      ],
      howTag: 'How It Works',
      howTitle: 'Launch Your First Campaign in 4 Steps',
      steps: [
        { num:'01', title:'Connect Domain',  desc:'Authenticate your sending domain for maximum deliverability.' },
        { num:'02', title:'Build Template',  desc:'Use the visual editor or import your existing HTML templates.' },
        { num:'03', title:'Segment List',    desc:'Upload contacts, build segments, and personalise at scale.' },
        { num:'04', title:'Send & Optimise', desc:'Launch, monitor opens & clicks, and A/B test continuously.' }
      ],
      trustIco: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f07c1a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
      trustTitle: '98% Inbox Delivery Guarantee',
      trustDesc: 'Our dedicated IP infrastructure and warmup process ensures your emails land in the inbox, not spam &mdash; every time.'
    },

    WhatsApp: {
      themeClass: 'snp-theme-whatsapp',
      icon: 'fab fa-whatsapp',
      label: 'WhatsApp Business API',
      heroTitle: 'Reach 500M+ Users<br>on WhatsApp',
      heroDesc: "Engage India's largest messaging audience with automated conversations, interactive templates, and seamless two-way support flows &mdash; all via the official WhatsApp Business API.",
      pills: [
        { num:'78%',   lbl:'Message Read Rate' },
        { num:'500M+', lbl:'Users in India' },
        { num:'2x',    lbl:'Higher Conversions' },
        { num:'24/7',  lbl:'Bot Automation' }
      ],
      featTag: 'What You Get',
      featTitle: 'Full-Power WhatsApp for Business',
      featSub: 'From broadcasts to chatbots &mdash; everything you need to build WhatsApp into your customer journey.',
      features: [
        { ico:'fas fa-broadcast-tower', cls:'ico-green',  title:'Broadcast Messaging',      desc:'Send approved template messages to unlimited opted-in contacts.' },
        { ico:'fas fa-list-ul',         cls:'ico-green',  title:'Interactive Lists & Buttons', desc:'Let customers pick options from menus and tap reply buttons.' },
        { ico:'fas fa-robot',           cls:'ico-green',  title:'Chatbot Automation',       desc:'24/7 automated flows for FAQs, lead capture, and order updates.' },
        { ico:'fas fa-store',           cls:'ico-green',  title:'WhatsApp Commerce',        desc:'Share product catalogs and take orders directly in the chat.' },
        { ico:'fas fa-headset',         cls:'ico-green',  title:'Shared Team Inbox',        desc:'Multiple agents handle customer chats from one shared dashboard.' },
        { ico:'fas fa-lock',            cls:'ico-green',  title:'End-to-End Encryption',    desc:'All messages are encrypted in transit &mdash; private and secure.' }
      ],
      howTag: 'How It Works',
      howTitle: 'Go Live on WhatsApp in 4 Steps',
      steps: [
        { num:'01', title:'Verify Business', desc:'Submit your Facebook Business Manager details for API access.' },
        { num:'02', title:'Create Templates',desc:'Design and get approved message templates from Meta.' },
        { num:'03', title:'Build Flows',     desc:'Set up automated chatbot flows and broadcast lists.' },
        { num:'04', title:'Go Live',         desc:'Launch campaigns and manage conversations in real time.' }
      ],
      trustIco: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>',
      trustTitle: 'Official Meta Business Partner',
      trustDesc: 'SetuNxt is an official WhatsApp Business Solution Provider &mdash; giving you reliable, high-throughput access to the WhatsApp API.'
    }
  };

  /* ── DOM refs ── */
  var backdrop     = document.getElementById('sn-modal-backdrop');
  var closeBtn     = document.getElementById('sn-modal-close');
  var heroSection  = document.getElementById('snp-hero-section');
  var featSection  = document.getElementById('snp-features-section');
  var howSection   = document.getElementById('snp-howto-section');
  var trustSection = document.getElementById('snp-trust-section');
  var selService   = document.getElementById('sn-service');
  var form         = document.getElementById('sn-form');

  /* ── Build full-page content ── */
  function buildPage(key) {
    var d = SERVICES[key];

    /* HERO */
    var pillsHTML = d.pills.map(function(p) {
      return '<div class="snp-pill"><span class="snp-pill-num">' + p.num + '</span><span class="snp-pill-lbl">' + p.lbl + '</span></div>';
    }).join('');
    heroSection.innerHTML =
      '<div class="snp-hero ' + d.themeClass + '">' +
        '<div class="snp-hero-orb1"></div><div class="snp-hero-orb2"></div>' +
        '<div class="snp-hero-badge"><i class="' + d.icon + '"></i>&nbsp;' + d.label + '</div>' +
        '<h1>' + d.heroTitle + '</h1>' +
        '<p class="snp-hero-desc">' + d.heroDesc + '</p>' +
        '<div class="snp-hero-pills">' + pillsHTML + '</div>' +
      '</div>';

    /* FEATURES */
    var featsHTML = d.features.map(function(f) {
      return '<div class="snp-feat-item">' +
        '<div class="snp-feat-ico ' + f.cls + '"><i class="' + f.ico + '"></i></div>' +
        '<div class="snp-feat-body"><h5>' + f.title + '</h5><p>' + f.desc + '</p></div>' +
      '</div>';
    }).join('');
    featSection.innerHTML =
      '<div class="snp-section">' +
        '<span class="snp-section-tag">' + d.featTag + '</span>' +
        '<h2>' + d.featTitle + '</h2>' +
        '<p class="snp-section-sub">' + d.featSub + '</p>' +
        '<div class="snp-feat-grid">' + featsHTML + '</div>' +
      '</div>';

    /* HOW IT WORKS */
    var stepsHTML = d.steps.map(function(s) {
      return '<div class="snp-step">' +
        '<div class="snp-step-num">' + s.num + '</div>' +
        '<h5>' + s.title + '</h5><p>' + s.desc + '</p>' +
      '</div>';
    }).join('');
    howSection.innerHTML =
      '<div class="snp-section">' +
        '<span class="snp-section-tag">' + d.howTag + '</span>' +
        '<h2>' + d.howTitle + '</h2>' +
        '<div class="snp-steps" style="margin-top:1.4rem;">' + stepsHTML + '</div>' +
      '</div>';

    /* TRUST STRIP */
    trustSection.innerHTML =
      '<div class="snp-section" style="border-bottom:none;padding-bottom:2rem;">' +
        '<div class="snp-trust">' +
          '<div class="snp-trust-ico">' + d.trustIco + '</div>' +
          '<div class="snp-trust-text">' +
            '<strong>' + d.trustTitle + '</strong>' +
            '<span>' + d.trustDesc + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /* ── Set service dropdown ── */
  function setService(key) {
    selService.value = key;
    selService.classList.toggle('sn-has-val', !!key);
  }

  /* ── Open modal ── */
  function openModal(key) {
    buildPage(key);
    form.reset();
    setService(key);
    backdrop.style.display = 'flex';
    backdrop.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        backdrop.classList.add('sn-open');
      });
    });
  }

  /* ── Close modal ── */
  function closeModal() {
    backdrop.classList.remove('sn-open');
    document.body.style.overflow = '';
    setTimeout(function() { backdrop.style.display = 'none'; }, 340);
  }

  /* ── Card clicks ── */
  document.querySelectorAll('.sn-clickable-card').forEach(function(card) {
    card.addEventListener('click', function() { openModal(card.getAttribute('data-service')); });
  });

  /* ── Close triggers ── */
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', function(e) { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && backdrop.classList.contains('sn-open')) closeModal();
  });
  selService.addEventListener('change', function() { setService(selService.value); });

  /* ── Form submit ── */
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var fname   = document.getElementById('sn-fname').value.trim();
    var lname   = document.getElementById('sn-lname').value.trim();
    var email   = document.getElementById('sn-email').value.trim();
    var phone   = document.getElementById('sn-phone').value.trim();
    var service = selService.value;
    var msg     = document.getElementById('sn-msg').value.trim();

    if (!fname || !lname || !email || !phone || !service || !msg) {
      Swal.fire({ icon:'error', title:'Oops…', text:'Please fill in all required fields.', confirmButtonColor:'#1a6fd4', customClass:{popup:'sn-swal'} });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({ icon:'error', title:'Invalid Email', text:'Please enter a valid email address.', confirmButtonColor:'#1a6fd4', customClass:{popup:'sn-swal'} });
      return;
    }
    Swal.fire({
      icon:'success', title:'Enquiry Sent!',
      html:'<div style="text-align:left;margin-top:0.5rem;">' +
           '<p><strong>Name:</strong> ' + fname + ' ' + lname + '</p>' +
           '<p><strong>Email:</strong> ' + email + '</p>' +
           '<p><strong>Service:</strong> ' + service + '</p>' +
           '<p style="margin-top:0.75rem;font-style:italic;color:#64748b;">We\'ll contact you shortly.</p></div>',
      confirmButtonColor:'#1a6fd4', confirmButtonText:'OK', customClass:{popup:'sn-swal'}
    }).then(function() {
      form.reset(); selService.classList.remove('sn-has-val'); closeModal();
    });
  });

})();

/* ══ CTA REDIRECT ══ */
/* ── CTA "Get Started" → redirect to contact.html with email pre-filled ── */
(function () {
  var btn   = document.getElementById('cta-get-started');
  var input = document.getElementById('cta-email-input');
  if (!btn || !input) return;

  btn.addEventListener('click', function () {
    var email = input.value.trim();

    /* Basic format check */
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.location.href = 'contact.html?email=' + encodeURIComponent(email);
    } else {
      /* If empty or invalid, just go to contact page without param */
      window.location.href = 'contact.html';
    }
  });

  /* Also allow pressing Enter inside the input */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btn.click();
  });
})();