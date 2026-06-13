document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. THEME TOGGLE (DARK / LIGHT MODE)
     ========================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const iconSun = themeToggleBtn.querySelector('.icon-sun');
  const iconMoon = themeToggleBtn.querySelector('.icon-moon');
  
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  setTheme(initialTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  }

  /* ==========================================
     2. FIXED HEADER TRANSFORMATION & MOBILE NAV MENU
     ========================================== */
  const headerContainer = document.querySelector('.header-container');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerContainer.classList.add('header-scrolled');
    } else {
      headerContainer.classList.remove('header-scrolled');
    }
  });
  
  menuToggleBtn.addEventListener('click', () => {
    const isOpen = menuToggleBtn.classList.toggle('open');
    menuToggleBtn.setAttribute('aria-expanded', isOpen);
    mobileNavDrawer.classList.toggle('open', isOpen);
  });
  
  mobileNavDrawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('open');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.classList.remove('open');
    });
  });

  /* ==========================================
     3. SCROLLSPY (ACTIVE SECTIONS ACCURATE HIGHLIGHTING)
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-nav .nav-link');
  
  const scrollspyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, scrollspyOptions);
  
  sections.forEach(section => observer.observe(section));

  /* ==========================================
     4. LIVE CLINIC STATUS TRACKER (LAGOS WAT UTC+1)
     ========================================== */
  /* ==========================================
     0. LUXURY PAGE PRELOADER SEQUENCE
     ========================================== */
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    const fill = preloader.querySelector('.preloader-bar-fill');
    if (fill) {
      setTimeout(() => {
        fill.style.width = '100%';
      }, 100);
    }
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          preloader.setAttribute('aria-hidden', 'true');
        }, 500);
      }, 1200); // Fades out after 1.2s of clean loading sequence
    });
  }

  /* ==========================================
     4. LIVE CLINIC STATUS TRACKER (SURULERE WAT UTC+1)
     ========================================== */
  const liveStatusText = document.getElementById('live-status-text');
  const liveDotIndicator = document.getElementById('live-dot-indicator');
  
  function updateLiveClinicStatus() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const lagosOffset = 1; // WAT is UTC+1
    const lagosTime = new Date(utcTime + (3600000 * lagosOffset));
    
    const currentDay = lagosTime.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const currentHour = lagosTime.getHours();
    const currentMinutes = lagosTime.getMinutes();
    
    // Open Monday (1) through Saturday (6) from 9:00 AM to 5:30 PM (17:30)
    const isOpenDay = currentDay >= 1 && currentDay <= 6;
    const isOpenHour = (currentHour >= 9 && currentHour < 17) || (currentHour === 17 && currentMinutes <= 30);
    
    if (isOpenDay && isOpenHour) {
      liveDotIndicator.className = 'live-dot active';
      liveStatusText.textContent = 'Open Now · Clinic Closes at 5:30 PM';
    } else {
      liveDotIndicator.className = 'live-dot inactive';
      
      if (currentDay === 0) {
        liveStatusText.textContent = 'Closed · Opens Monday at 9:00 AM';
      } else if (currentDay === 6 && (currentHour > 17 || (currentHour === 17 && currentMinutes > 30))) {
        liveStatusText.textContent = 'Closed for the weekend · Opens Monday at 9:00 AM';
      } else if (currentHour < 9) {
        liveStatusText.textContent = `Closed · Opens Today at 9:00 AM`;
      } else {
        liveStatusText.textContent = `Closed · Opens Tomorrow at 9:00 AM`;
      }
    }
    
    // Weekly hours block highlights
    const monSatRow = document.getElementById('cday-mon');
    const sunRow = document.getElementById('cday-sun');
    if (monSatRow && sunRow) {
      if (currentDay >= 1 && currentDay <= 6) {
        monSatRow.classList.add('current-day');
        sunRow.classList.remove('current-day');
      } else {
        sunRow.classList.add('current-day');
        monSatRow.classList.remove('current-day');
      }
    }
  }
  
  updateLiveClinicStatus();
  setInterval(updateLiveClinicStatus, 60000);

  /* ==========================================
     5. SERVICES SECTION MODAL SYSTEM
     ========================================== */
  const servicesData = [
    {
      title: "General Dentistry",
      desc: "Complete visual oral examinations, low-radiation digital scans/X-rays, gum tissue evaluations, preventative sealants, and direct aesthetic fillings. We detect oral anomalies early to construct transparent, personalized preventative roadmaps.",
      price: "₦10,000+",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      title: "Teeth Cleaning",
      desc: "Deep Scaling and Polishing clinical treatments. Using advanced ultrasonic scalers, we remove stubborn calculus layers, eliminate bacterial plaque build-ups from tight root surfaces, wash dental stains, and reverse early-stage gingivitis.",
      price: "₦25,000",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    {
      title: "Teeth Whitening",
      desc: "Laser enamel brightening therapies. We coat discolored enamel surfaces with professional-grade whitening peroxide gel and activate it using a safe laser light source. Safely lifts teeth up to eight full shade tiers in under an hour.",
      price: "₦85,000",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>`
    },
    {
      title: "Dental Implants",
      desc: "Surgical titanium implant replacements. We securely anchor sterile titanium root pegs directly into the jaw bone, allowing them to integrate naturally with bone tissue, then seal the anchor with a highly robust handcrafted porcelain crown.",
      price: "₦350,000+",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.65 2.65 0 0021 17.25l-5.83-5.83m-3.75 3.75L6.25 10A2.65 2.65 0 012.5 13.75L8.33 19.58m3.09-4.41L12 14.25" /></svg>`
    },
    {
      title: "Orthodontics",
      desc: "Braces, ceramic brackets, alignment wires, and clear aesthetic aligner plans. Designed to correct crowded arches, bite discrepancies, and deep vertical overlays for young teens and adult professionals alike.",
      price: "₦450,000+",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25" /></svg>`
    },
    {
      title: "Root Canal Treatment",
      desc: "Deep root cavity pulpal removal. When severe decay invades inner nerve dockets, our specialists extract diseased organic pulps under full local block, disinfect the root tunnels completely, and apply biological hermetic fillings to save the tooth.",
      price: "₦65,000",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25" /></svg>`
    },
    {
      title: "Pediatric Dentistry",
      desc: "Friendly, gentle children's dentistry. We apply protective decay sealants, custom-fitted space maintainers for premature baby tooth extractions, minor orthodontic guidance, and gentle oral hygiene education in a fun, non-scary clinic room.",
      price: "₦15,000+",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75" /></svg>`
    },
    {
      title: "Cosmetic Dentistry",
      desc: "Porcelain cosmetic veneers and complete smile makeovers. We custom craft ultra-thin dental laminate shells to cover chipped margins, mask intrinsic tooth discolorations, close gap diastemas, and build symmetric facial harmony.",
      price: "₦180,000+",
      iconHtml: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px; height: 24px; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21l5.096-.813a2 2 0 001.414-.586l6.903-6.903a2 2 0 000-2.828l-4.243-4.243" /></svg>`
    }
  ];

  const modalOverlay = document.getElementById('service-modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalIcon = document.getElementById('modal-icon-container');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalPrice = document.getElementById('modal-price');
  const modalBookBtn = document.getElementById('modal-book-btn');
  const serviceLearnBtns = document.querySelectorAll('.service-btn-v8');
  
  function openServiceModal(index) {
    const data = servicesData[index];
    if (!data) return;
    
    modalIcon.innerHTML = data.iconHtml;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalPrice.textContent = data.price;
    
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
  }
  
  function closeServiceModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }
  
  serviceLearnBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-service-index'));
      openServiceModal(index);
    });
  });
  
  modalClose.addEventListener('click', closeServiceModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeServiceModal();
  });
  modalBookBtn.addEventListener('click', closeServiceModal);

  /* ==========================================
     6. BEFORE & AFTER RESULTS INTERACTIVE SLIDERS
     ========================================== */
  const baContainers = document.querySelectorAll('.ba-container');
  
  baContainers.forEach(container => {
    const afterImg = container.querySelector('.ba-after-img');
    const handle = container.querySelector('.ba-handle');
    
    function setSplitPosition(clientX) {
      const rect = container.getBoundingClientRect();
      let percentage = ((clientX - rect.left) / rect.width) * 100;
      
      // Enforce bounds
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      // Adjusts full-bleed right-side reveal clip-path dynamically
      afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
      handle.style.left = `${percentage}%`;
    }
    
    // Smooth hover/movement-based split viewer
    container.addEventListener('mousemove', (e) => {
      setSplitPosition(e.clientX);
    });
    
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        setSplitPosition(e.touches[0].clientX);
      }
    });
  });

  /* ==========================================
     7. PATIENT TESTIMONIALS CAROUSEL ROTATION
     ========================================== */
  /* ==========================================
     7. PATIENT TESTIMONIALS CAROUSEL ROTATION
     ========================================== */
  const updatedTestimonials = [
    {
      text: "I just got my teeth pampered at Decrest Dental Clinic, and I'm truly impressed. Scaling and polishing was seamless, and the doctor was extremely gentle and professional.",
      name: "Maria Udoh",
      badge: "Scaling & Polishing",
      initials: "MU"
    },
    {
      text: "This is the best dental care experience I've so far had. Dr. Oyebisi would make you feel like at home, explaining every single detail before every procedure...",
      name: "Ogbonna Ahunanya",
      badge: "Local Guide · General Checkup",
      initials: "OA"
    },
    {
      text: "I had a scaling and polishing session. Friendly staff, professional environment, very neat and clean. A seamless experience indeed!",
      name: "Nonso Akujieze",
      badge: "Scaling & Polishing",
      initials: "NA"
    },
    {
      text: "Great response time, welcoming staff, polite nurses, and a very gentle doctor. Highly recommended Surulere dental clinic.",
      name: "Mayowa Okunade",
      badge: "General Consultation",
      initials: "MO"
    },
    {
      text: "Very polite nurses and welcoming environment. The response time was fast, and they accepted my HMO without issues. Had scaling and polishing and extraction.",
      name: "Chukwudubem Nwankwo",
      badge: "HMO Billing · Extraction",
      initials: "CN"
    },
    {
      text: "The team made me feel comfortable from my first visit. My smile has never looked better. Professional service at its best!",
      name: "Chioma Adebayo",
      badge: "Teeth Whitening",
      initials: "CA"
    }
  ];

  const testSlide = document.getElementById('testimonial-slide');
  const carouselNavBar = document.querySelector('.carousel-nav-bar');
  if (carouselNavBar) {
    carouselNavBar.innerHTML = updatedTestimonials.map((_, idx) => `
      <button class="carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Testimonial Slide ${idx + 1}"></button>
    `).join('');
  }

  const dynamicDots = document.querySelectorAll('.carousel-nav-bar .carousel-dot');
  let currentSlideIndex = 0;
  let testimonialInterval;

  function goToSlide(index) {
    if (!testSlide || !dynamicDots.length) return;
    dynamicDots.forEach(dot => dot.classList.remove('active'));
    
    if (index >= updatedTestimonials.length) index = 0;
    if (index < 0) index = updatedTestimonials.length - 1;
    
    currentSlideIndex = index;
    const dotToActivate = document.querySelector(`.carousel-nav-bar .carousel-dot[data-index="${index}"]`);
    if (dotToActivate) dotToActivate.classList.add('active');

    const data = updatedTestimonials[index];
    
    testSlide.style.opacity = '0';
    testSlide.style.transform = 'translateY(8px)';
    testSlide.style.transition = 'all 200ms ease';
    
    setTimeout(() => {
      testSlide.querySelector('.test-quote').textContent = `"${data.text}"`;
      testSlide.querySelector('.test-avatar').textContent = data.initials;
      testSlide.querySelector('.test-name').textContent = data.name;
      testSlide.querySelector('.test-badge').textContent = data.badge;
      
      testSlide.style.opacity = '1';
      testSlide.style.transform = 'translateY(0)';
    }, 200);
  }

  if (dynamicDots.length > 0) {
    dynamicDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        clearInterval(testimonialInterval);
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        goToSlide(idx);
        startAutoPlay();
      });
    });
  }

  function startAutoPlay() {
    testimonialInterval = setInterval(() => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= updatedTestimonials.length) nextIndex = 0;
      goToSlide(nextIndex);
    }, 6000);
  }

  if (testSlide && updatedTestimonials.length > 0) {
    testSlide.querySelector('.test-quote').textContent = `"${updatedTestimonials[0].text}"`;
    testSlide.querySelector('.test-avatar').textContent = updatedTestimonials[0].initials;
    testSlide.querySelector('.test-name').textContent = updatedTestimonials[0].name;
    testSlide.querySelector('.test-badge').textContent = updatedTestimonials[0].badge;
    startAutoPlay();
  }


  /* ==========================================
     8. APPOINTMENT FORM RESERVATIONS ENGINE (LOCAL STORAGE SYNC)
     ========================================== */
  const bookingForm = document.getElementById('clinic-booking-form');
  const bookDateInput = document.getElementById('book-date');
  const successOverlay = document.getElementById('booking-success-overlay');
  const successClose = document.getElementById('sp-close');
  const successPortal = document.getElementById('sp-portal');
  
  // Pop-up Scheduler Modal References
  const bookingModalOverlay = document.getElementById('booking-modal-overlay');
  const bookingModalClose = document.getElementById('booking-modal-close');
  
  function openBookingModal() {
    bookingModalOverlay.classList.add('active');
    bookingModalOverlay.setAttribute('aria-hidden', 'false');
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookDateInput) bookDateInput.setAttribute('min', todayStr);
  }
  
  function closeBookingModal() {
    bookingModalOverlay.classList.remove('active');
    bookingModalOverlay.setAttribute('aria-hidden', 'true');
  }
  
  // Delegated click observer to capture all "Book", "Schedule", and "#booking" triggers
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    const href = target.getAttribute('href');
    const text = target.textContent.toLowerCase();
    
    // Catch nav triggers, CTA links, portal anchors, or text targets containing book/schedule
    if (href === '#booking' || text.includes('book') || text.includes('schedule') || text.includes('appointment')) {
      e.preventDefault();
      openBookingModal();
    }
  });
  
  bookingModalClose.addEventListener('click', closeBookingModal);
  bookingModalOverlay.addEventListener('click', (e) => {
    if (e.target === bookingModalOverlay) closeBookingModal();
  });
  
  // Exit Intent Sensor: Fires whenever user mouse leaves viewport top towards browser tabs/controls
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 20) {
      const isBookingActive = bookingModalOverlay.classList.contains('active');
      const isSuccessActive = successOverlay.classList.contains('active');
      
      if (!isBookingActive && !isSuccessActive) {
        openBookingModal();
      }
    }
  });
  
  // Set date calendar min selector starting today
  const todayString = new Date().toISOString().split('T')[0];
  if (bookDateInput) bookDateInput.setAttribute('min', todayString);
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('book-name').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const service = document.getElementById('book-service').value;
    const dateVal = bookDateInput.value;
    const message = document.getElementById('book-message').value.trim();
    
    // Live validations
    if (!name) {
      alert('Please fill in your name.');
      return;
    }
    
    if (!phone || phone.length < 8) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!service) {
      alert('Please choose a dental service treatment.');
      return;
    }
    
    if (!dateVal) {
      alert('Please select your preferred clinic date.');
      return;
    }
    
    // Block Sundays and Mondays (clinic closed)
    const dayOfWeek = new Date(dateVal).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 1) {
      alert('Sundays & Mondays are clinical rest days. Please select a Tuesday through Saturday.');
      return;
    }
    
    // Generate Random Confirmation Code
    const bookingCode = `DCR-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const record = {
      id: bookingCode,
      service: service,
      date: dateVal,
      time: "9:00 AM (Confirmed Slot)", // Default slot
      name: name,
      email: email,
      phone: phone,
      notes: message,
      timestamp: new Date().toISOString()
    };
    
    // Retrieve, append, and save in localStorage
    const currentList = JSON.parse(localStorage.getItem('perissos_bookings') || '[]');
    currentList.push(record);
    localStorage.setItem('perissos_bookings', JSON.stringify(currentList));
    
    // Populate Success splash
    document.getElementById('sp-code').textContent = bookingCode;
    document.getElementById('sp-service').textContent = service;
    
    const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    document.getElementById('sp-date').textContent = `${formattedDate} at 9:00 AM`;
    
    // Render Patient Portal Ledger list
    renderPatientPortalBookings();
    
    // Show splash overlay
    successOverlay.classList.add('active');
    successOverlay.setAttribute('aria-hidden', 'false');
    
    // Hide scheduler pop-up
    closeBookingModal();
    
    // Reset form
    bookingForm.reset();
  });
}
  
  successClose.addEventListener('click', () => {
    successOverlay.classList.remove('active');
    successOverlay.setAttribute('aria-hidden', 'true');
  });
  
  successPortal.addEventListener('click', () => {
    successOverlay.classList.remove('active');
    successOverlay.setAttribute('aria-hidden', 'true');
    openPortalDrawer();
  });

  /* ==========================================
     9. FAQ ACCORDION TRIGGER PANELS
     ========================================== */
  const faqTriggers = document.querySelectorAll('.faq-trigger-v8');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isActive = item.classList.contains('active');
      
      document.querySelectorAll('.faq-item-v8').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-trigger-v8').setAttribute('aria-expanded', 'false');
      });
      
      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================
     10. LOCATION MAP BLOCK SATELLITE SWITCHER
     ========================================== */
  const mapSwitcher = document.getElementById('map-switcher-v8');
  const vectorMap = document.getElementById('vector-map-v8');
  const googleMapIframe = document.getElementById('google-iframe-v8');
  
  mapSwitcher.addEventListener('click', () => {
    const isShowingGoogle = googleMapIframe.classList.contains('active');
    
    if (isShowingGoogle) {
      googleMapIframe.classList.remove('active');
      vectorMap.classList.remove('hidden');
      mapSwitcher.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px; margin-right: 4px; display: inline; stroke-width: 2;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75V15m6-6v8.25" />
        </svg>
        Switch to Google Maps Navigation
      `;
    } else {
      googleMapIframe.classList.add('active');
      vectorMap.classList.add('hidden');
      mapSwitcher.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px; margin-right: 4px; display: inline; stroke-width: 2;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
        </svg>
        Switch to Custom Road Map Location
      `;
    }
  });

  /* ==========================================
     11. SLIDING PATIENT PORTAL DRAWER
     ========================================== */
  const portalToggle = document.getElementById('portal-toggle');
  const portalClose = document.getElementById('portal-close');
  const portalDrawer = document.getElementById('patient-portal-drawer');
  const portalBackdrop = document.getElementById('portal-backdrop');
  const portalListContainer = document.getElementById('portal-appointment-list');
  
  function openPortalDrawer() {
    portalDrawer.classList.add('open');
    portalBackdrop.classList.add('open');
    portalDrawer.setAttribute('aria-hidden', 'false');
    portalBackdrop.setAttribute('aria-hidden', 'false');
    renderPatientPortalBookings();
  }
  
  function closePortalDrawer() {
    portalDrawer.classList.remove('open');
    portalBackdrop.classList.remove('open');
    portalDrawer.setAttribute('aria-hidden', 'true');
    portalBackdrop.setAttribute('aria-hidden', 'true');
  }
  
  if (portalToggle) portalToggle.addEventListener('click', openPortalDrawer);
  if (portalClose) portalClose.addEventListener('click', closePortalDrawer);
  if (portalBackdrop) portalBackdrop.addEventListener('click', closePortalDrawer);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (portalDrawer.classList.contains('open')) {
        closePortalDrawer();
      }
      if (bookingModalOverlay.classList.contains('active')) {
        closeBookingModal();
      }
    }
  });
  
  function renderPatientPortalBookings() {
    const list = JSON.parse(localStorage.getItem('perissos_bookings') || '[]');
    portalListContainer.innerHTML = '';
    
    if (list.length === 0) {
      portalListContainer.innerHTML = `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 40px; height: 40px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25" />
          </svg>
          <p>No active reservations found.</p>
          <a href="#booking" id="drawer-book-link" class="btn btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Book Session Now</a>
        </div>
      `;
      
      const drawerBookLink = document.getElementById('drawer-book-link');
      if (drawerBookLink) {
        drawerBookLink.addEventListener('click', closePortalDrawer);
      }
      return;
    }
    
    list.forEach(booking => {
      const apptCard = document.createElement('div');
      apptCard.className = 'appointment-item';
      
      const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      apptCard.innerHTML = `
        <div class="appt-service-name">${booking.service}</div>
        <div class="appt-meta-row">
          <div class="appt-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            ${formattedDate}
          </div>
          <div class="appt-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" /></svg>
            ${booking.time}
          </div>
          <div class="appt-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" /></svg>
            ID: ${booking.id}
          </div>
        </div>
        <button class="appt-cancel-btn" data-id="${booking.id}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 12px; height: 12px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862" /></svg>
          Cancel Appointment
        </button>
      `;
      
      apptCard.querySelector('.appt-cancel-btn').addEventListener('click', (e) => {
        const idToCancel = e.currentTarget.getAttribute('data-id');
        if (confirm(`Are you sure you want to cancel appointment ${idToCancel}?`)) {
          cancelBookingRecord(idToCancel, apptCard);
        }
      });
      
      portalListContainer.appendChild(apptCard);
    });
  }
  
  function cancelBookingRecord(bookingId, cardElement) {
    const list = JSON.parse(localStorage.getItem('perissos_bookings') || '[]');
    const updatedList = list.filter(b => b.id !== bookingId);
    localStorage.setItem('perissos_bookings', JSON.stringify(updatedList));
    
    cardElement.style.opacity = '0';
    cardElement.style.transform = 'scale(0.9)';
    cardElement.style.transition = 'all 300ms ease';
    
    setTimeout(() => {
      renderPatientPortalBookings();
    }, 300);
  }
  
  /* ==========================================
     12. PREMIUM SCROLL REVEALS (INTERSECTION OBSERVER)
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal-element, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserverOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);
  
  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================
     14. DENTIST BIOGRAPHY DETAIL MODAL POPUP
     ========================================== */
  const dentistsData = [
    {
      name: "Dr. Sarah Johnson",
      degree: "BDS, MSc Orthodontics",
      bio: "Dr. Sarah Johnson has over 15 years of orthodontic experience, specializing in advanced teeth alignment, bracket systems, and clear aligners. She holds degrees from premier institutions and is a registered member of the Medical and Dental Council of Nigeria (MDCN).",
      approach: "I believe in alignment that promotes functional oral health and boosts patient self-esteem. Every alignment plan is custom-tailored to the patient's individual facial structure.",
      hours: "Tuesday - Friday: 9:00 AM - 5:00 PM",
      img: "dr_sarah_johnson.png"
    },
    {
      name: "Dr. Oyebisi",
      degree: "BDS, DDS - Lead Restorative Dentist",
      bio: "Dr. Oyebisi serves as the Clinical Director at De-Crest Dental Clinic. With over 12 years of general and restorative dental practice, he is highly praised by patients for his extremely patient, informative checkup sessions and gentle handling of procedures.",
      approach: "My clinical philosophy centers on patient-first diagnostics. I walk patients through every detail of their dental profiles, ensuring they are fully relaxed and informed before we begin any treatment.",
      hours: "Monday - Saturday: 9:00 AM - 5:30 PM",
      img: "dr_olumide_awosika.png"
    },
    {
      name: "Dr. Amara Eze",
      degree: "BDS (Paediatrics)",
      bio: "Dr. Amara Eze specializes in pediatric dentistry, bringing 8 years of child-friendly clinical expertise. She has crafted comforting, anxiety-reducing protocols that make children feel happy and zero-fear during checkups.",
      approach: "I focus on prevention, early interception, and creating positive dental memories for children. Educating parents and kids on habits in a fun way is my priority.",
      hours: "Monday - Thursday: 9:00 AM - 4:30 PM",
      img: "dr_amara_eze.png"
    }
  ];

  const dentistModalOverlay = document.getElementById('dentist-modal-overlay');
  const dentistModalClose = document.getElementById('dentist-modal-close');
  const dentistModalImg = document.getElementById('dentist-modal-img');
  const dentistModalName = document.getElementById('dentist-modal-name');
  const dentistModalDegree = document.getElementById('dentist-modal-degree');
  const dentistModalBio = document.getElementById('dentist-modal-bio');
  const dentistModalApproach = document.getElementById('dentist-modal-approach');
  const dentistModalHours = document.getElementById('dentist-modal-hours');
  const dentistModalBookBtn = document.getElementById('dentist-modal-book-btn');
  const dentistDetailBtns = document.querySelectorAll('.dentist-detail-btn');

  function openDentistModal(index) {
    const data = dentistsData[index];
    if (!data) return;

    dentistModalImg.src = data.img;
    dentistModalImg.alt = `${data.name}, ${data.degree}`;
    dentistModalName.textContent = data.name;
    dentistModalDegree.textContent = data.degree;
    dentistModalBio.textContent = data.bio;
    dentistModalApproach.textContent = data.approach;
    dentistModalHours.textContent = data.hours;

    dentistModalOverlay.classList.add('active');
    dentistModalOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeDentistModal() {
    dentistModalOverlay.classList.remove('active');
    dentistModalOverlay.setAttribute('aria-hidden', 'true');
  }

  dentistDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-dentist-index'));
      openDentistModal(idx);
    });
  });

  if (dentistModalClose) dentistModalClose.addEventListener('click', closeDentistModal);
  if (dentistModalOverlay) {
    dentistModalOverlay.addEventListener('click', (e) => {
      if (e.target === dentistModalOverlay) closeDentistModal();
    });
  }
  if (dentistModalBookBtn) {
    dentistModalBookBtn.addEventListener('click', () => {
      closeDentistModal();
      openBookingModal();
    });
  }


  /* ==========================================
     15. INLINE APPOINTMENT FORM RESERVATIONS
     ========================================== */
  const inlineBookingForm = document.getElementById('inline-booking-form');
  const inlineBookDateInput = document.getElementById('inline-book-date');

  if (inlineBookDateInput) {
    const inlineTodayString = new Date().toISOString().split('T')[0];
    inlineBookDateInput.setAttribute('min', inlineTodayString);
  }

  if (inlineBookingForm) {
    inlineBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('inline-book-name').value.trim();
      const phone = document.getElementById('inline-book-phone').value.trim();
      const email = document.getElementById('inline-book-email').value.trim();
      const service = document.getElementById('inline-book-service').value;
      const dateVal = inlineBookDateInput.value;
      const timeVal = document.getElementById('inline-book-time').value;
      const message = document.getElementById('inline-book-message').value.trim();
      
      if (!name) { alert('Please enter your name.'); return; }
      if (!phone || phone.length < 8) { alert('Please enter a valid phone number.'); return; }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) { alert('Please enter a valid email address.'); return; }
      if (!service) { alert('Please select a service procedure.'); return; }
      if (!dateVal) { alert('Please select a date.'); return; }
      if (!timeVal) { alert('Please select a preferred time slot.'); return; }

      const dayOfWeek = new Date(dateVal).getDay();
      if (dayOfWeek === 0) { // Sunday closed
        alert('De-Crest Dental is closed on Sundays. Please choose a Monday through Saturday.');
        return;
      }

      const bookingCode = `DCR-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const record = {
        id: bookingCode,
        service: service,
        date: dateVal,
        time: timeVal,
        name: name,
        email: email,
        phone: phone,
        notes: message,
        timestamp: new Date().toISOString()
      };
      
      const currentList = JSON.parse(localStorage.getItem('perissos_bookings') || '[]');
      currentList.push(record);
      localStorage.setItem('perissos_bookings', JSON.stringify(currentList));
      
      // Populate and trigger success overlay
      document.getElementById('sp-code').textContent = bookingCode;
      document.getElementById('sp-service').textContent = service;
      
      const formattedDate = new Date(dateVal).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      document.getElementById('sp-date').textContent = `${formattedDate} at ${timeVal}`;
      
      renderPatientPortalBookings();
      
      successOverlay.classList.add('active');
      successOverlay.setAttribute('aria-hidden', 'false');
      inlineBookingForm.reset();
    });
  }


  /* ==========================================
     16. PATIENT INTAKE WIZARD CONTROLLER
     ========================================== */
  const intakeModalOverlay = document.getElementById('intake-modal-overlay');
  const intakeModalClose = document.getElementById('intake-modal-close');
  const portalIntakeBtn = document.getElementById('portal-intake-btn');
  const intakeForm = document.getElementById('patient-intake-form');
  const intakeSteps = document.querySelectorAll('.intake-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressFill = document.getElementById('intake-progress-fill');
  const btnPrev = document.getElementById('intake-prev');
  const btnNext = document.getElementById('intake-next');
  const btnSubmit = document.getElementById('intake-submit');
  const intakeSuccessOverlay = document.getElementById('intake-success-overlay');
  const intakeSuccessClose = document.getElementById('intake-success-close');

  let currentIntakeStep = 1;

  function openIntakeModal() {
    intakeModalOverlay.classList.add('active');
    intakeModalOverlay.setAttribute('aria-hidden', 'false');
    currentIntakeStep = 1;
    updateIntakeWizard();
  }

  function closeIntakeModal() {
    intakeModalOverlay.classList.remove('active');
    intakeModalOverlay.setAttribute('aria-hidden', 'true');
  }

  if (portalIntakeBtn) {
    portalIntakeBtn.addEventListener('click', () => {
      closePortalDrawer();
      openIntakeModal();
    });
  }

  if (intakeModalClose) intakeModalClose.addEventListener('click', closeIntakeModal);
  if (intakeModalOverlay) {
    intakeModalOverlay.addEventListener('click', (e) => {
      if (e.target === intakeModalOverlay) closeIntakeModal();
    });
  }

  function updateIntakeWizard() {
    // Hide all steps, show current step
    intakeSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.getAttribute('data-step')) === currentIntakeStep) {
        step.classList.add('active');
      }
    });

    // Update progress steps status
    progressSteps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active', 'completed');
      if (stepNum === currentIntakeStep) {
        step.classList.add('active');
      } else if (stepNum < currentIntakeStep) {
        step.classList.add('completed');
      }
    });

    // Update progress fill bar
    const percentage = ((currentIntakeStep - 1) / (progressSteps.length - 1)) * 100;
    progressFill.style.width = `${percentage}%`;

    // Navigation buttons toggle
    if (currentIntakeStep === 1) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = 'block';
    }

    if (currentIntakeStep === 4) {
      btnNext.style.display = 'none';
      btnSubmit.style.display = 'block';
    } else {
      btnNext.style.display = 'block';
      btnSubmit.style.display = 'none';
    }
  }

  function validateIntakeStep(stepNum) {
    if (stepNum === 1) {
      const dob = document.getElementById('intake-dob').value;
      const gender = document.getElementById('intake-gender').value;
      const emergName = document.getElementById('intake-emerg-name').value.trim();
      const emergPhone = document.getElementById('intake-emerg-phone').value.trim();

      if (!dob) { alert('Please enter your Date of Birth.'); return false; }
      if (!gender) { alert('Please select your gender.'); return false; }
      if (!emergName) { alert('Please enter emergency contact name.'); return false; }
      if (!emergPhone) { alert('Please enter emergency contact phone number.'); return false; }
    } else if (stepNum === 3) {
      const checkup = document.getElementById('intake-last-visit').value;
      if (!checkup) { alert('Please select your last checkup timing.'); return false; }
    }
    return true;
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateIntakeStep(currentIntakeStep)) {
        currentIntakeStep++;
        updateIntakeWizard();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      currentIntakeStep--;
      updateIntakeWizard();
    });
  }

  if (intakeForm) {
    intakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const sigName = document.getElementById('intake-sig-name').value.trim();
      const consentChecked = document.getElementById('intake-consent').checked;

      if (!sigName) { alert('Please sign the consent form by typing your full name.'); return; }
      if (!consentChecked) { alert('You must consent to proceed with diagnostic dental assessments.'); return; }

      // Package intake data
      const dob = document.getElementById('intake-dob').value;
      const gender = document.getElementById('intake-gender').value;
      const emergName = document.getElementById('intake-emerg-name').value;
      const emergPhone = document.getElementById('intake-emerg-phone').value;
      const allergies = document.getElementById('intake-allergies').value;
      const meds = document.getElementById('intake-meds').value;
      const checkup = document.getElementById('intake-last-visit').value;
      
      const conditions = [];
      if (document.getElementById('cond-heart').checked) conditions.push('Heart Conditions');
      if (document.getElementById('cond-diabetes').checked) conditions.push('Diabetes');
      if (document.getElementById('cond-bp').checked) conditions.push('High Blood Pressure');
      if (document.getElementById('cond-preg').checked) conditions.push('Pregnant');

      const dentalIssues = [];
      if (document.getElementById('dent-bleeding').checked) dentalIssues.push('Bleeding Gums');
      if (document.getElementById('dent-pain').checked) dentalIssues.push('Acute Pain');

      const fearScore = document.getElementById('intake-fear').value;

      const intakeRecord = {
        dob,
        gender,
        emergName,
        emergPhone,
        allergies,
        meds,
        conditions,
        checkup,
        dentalIssues,
        fearScore,
        signature: sigName,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('decrest_patient_intake', JSON.stringify(intakeRecord));
      
      // Update Intake CTA status inside the drawer
      if (portalIntakeBtn) {
        portalIntakeBtn.textContent = 'Intake Submitted ✔';
        portalIntakeBtn.disabled = true;
        portalIntakeBtn.style.backgroundColor = 'rgba(5, 150, 105, 0.15)';
        portalIntakeBtn.style.color = 'var(--color-cta)';
      }

      closeIntakeModal();
      
      // Trigger success window
      if (intakeSuccessOverlay) {
        intakeSuccessOverlay.classList.add('active');
        intakeSuccessOverlay.setAttribute('aria-hidden', 'false');
      }

      intakeForm.reset();
    });
  }

  if (intakeSuccessClose) {
    intakeSuccessClose.addEventListener('click', () => {
      intakeSuccessOverlay.classList.remove('active');
      intakeSuccessOverlay.setAttribute('aria-hidden', 'true');
      openPortalDrawer();
    });
  }


  /* ==========================================
     17. QUICK MESSAGE SUPPORT (CONTACT INQUIRY)
     ========================================== */
  const contactInquiryForm = document.getElementById('contact-inquiry-form');
  if (contactInquiryForm) {
    contactInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inquiry-name').value.trim();
      const email = document.getElementById('inquiry-email').value.trim();
      const message = document.getElementById('inquiry-message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields in the inquiry form.');
        return;
      }

      alert(`Thank you, ${name}! Your inquiry has been sent to our Surulere support desk. We will reply to ${email} within 2 hours.`);
      contactInquiryForm.reset();
    });
  }


  /* ==========================================
     18. INTERACTIVE FLOATING LIVE CHAT BOT
     ========================================== */
  const chatBubbleToggle = document.getElementById('chat-bubble-toggle');
  const chatWindowPanel = document.getElementById('chat-window-panel');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatTextInput = document.getElementById('chat-text-input');
  const chatQuickReplies = document.getElementById('chat-quick-replies');
  const chatTypingIndicator = document.getElementById('chat-typing-indicator');

  // Toggle chat window open/closed
  if (chatBubbleToggle) {
    chatBubbleToggle.addEventListener('click', () => {
      const isActive = chatWindowPanel.classList.toggle('active');
      chatWindowPanel.setAttribute('aria-hidden', !isActive);
      
      // Hide unread dot notification once opened
      const unreadDot = chatBubbleToggle.querySelector('.chat-unread-dot');
      if (unreadDot) unreadDot.style.display = 'none';

      if (isActive) {
        chatTextInput.focus();
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      }
    });
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindowPanel.classList.remove('active');
      chatWindowPanel.setAttribute('aria-hidden', 'true');
    });
  }

  // Predefined Q&A bot responses matching client questions
  const botAnswers = {
    hours: "De-Crest Dental Clinic is open from Monday through Saturday, 9:00 AM to 5:30 PM. We are closed on Sundays for clinic sterilization and rest.",
    location: "Our office is located at 28 Ishaga Road, Mabo St, Surulere, Lagos. It is easily reachable from all areas in Surulere. You can click 'Directions' on the page maps to navigate directly via Google Maps.",
    pricing: "General consultation is ₦10,000+. Professional Scaling & Polishing is ₦25,000. Laser Teeth Whitening is ₦85,000. We accept various local HMOs (AXA Mansard, Reliance HMO, Hygeia, AIICO) and support 0% interest-free installments for complex procedures.",
    intake: "You can fill out your Patient Intake Form before your visit inside the Patient Portal. Just open the portal drawer (top right button) and click 'Fill Intake Form' to complete it in 3 minutes.",
    book: "To secure a timing slot, select one of the Book Appointment CTAs on the page. You can choose your preferred date and time, and our system confirms it instantly.",
    default: "Thank you for reaching out to De-Crest Support! For immediate queues or acute treatments, please call our front desk directly at +234 806 630 1794. How else can I help you?"
  };

  // Bot message rendering function with dynamic scroll
  function addMessage(text, isUser = false) {
    const msgRow = document.createElement('div');
    msgRow.className = `chat-message-row ${isUser ? 'user-msg-row' : 'bot-msg-row'}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.textContent = text;
    
    msgRow.appendChild(bubble);
    chatMessagesContainer.insertBefore(msgRow, chatTypingIndicator);
    
    // Smooth scroll down
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function simulateBotReply(replyKey) {
    // Show typing bubble indicator
    chatTypingIndicator.classList.remove('hidden');
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Simulate variable latency delay
    const latency = 1000 + Math.random() * 1200; 

    setTimeout(() => {
      chatTypingIndicator.classList.add('hidden');
      const botResponse = botAnswers[replyKey] || botAnswers.default;
      addMessage(botResponse, false);
    }, latency);
  }

  // Handle Quick chip replies
  if (chatQuickReplies) {
    chatQuickReplies.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-reply-chip');
      if (!chip) return;

      const topic = chip.getAttribute('data-topic');
      const text = chip.textContent;

      addMessage(text, true);
      simulateBotReply(topic);
    });
  }

  // Parse text input to match questions keywords
  function parseUserText(text) {
    const cleanText = text.toLowerCase().trim();
    
    if (cleanText.includes('hour') || cleanText.includes('time') || cleanText.includes('open') || cleanText.includes('close') || cleanText.includes('saturday') || cleanText.includes('sunday')) {
      return 'hours';
    }
    if (cleanText.includes('locat') || cleanText.includes('address') || cleanText.includes('where') || cleanText.includes('surulere') || cleanText.includes('ishaga') || cleanText.includes('road')) {
      return 'location';
    }
    if (cleanText.includes('price') || cleanText.includes('cost') || cleanText.includes('hmo') || cleanText.includes('insurance') || cleanText.includes('pay') || cleanText.includes('card') || cleanText.includes('naira') || cleanText.includes('amount') || cleanText.includes('scaling')) {
      return 'pricing';
    }
    if (cleanText.includes('intake') || cleanText.includes('form') || cleanText.includes('wizard') || cleanText.includes('consent') || cleanText.includes('details')) {
      return 'intake';
    }
    if (cleanText.includes('book') || cleanText.includes('appointment') || cleanText.includes('schedule') || cleanText.includes('consultation') || cleanText.includes('doctor')) {
      return 'book';
    }
    
    return 'default';
  }

  // Handle message submission
  if (chatInputForm) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const queryText = chatTextInput.value.trim();
      if (!queryText) return;

      addMessage(queryText, true);
      chatTextInput.value = '';

      const topic = parseUserText(queryText);
      simulateBotReply(topic);
    });
  }

  renderPatientPortalBookings();
});

