/**
 * SAPPHIRE FITNESS GYM - MAIN JAVASCRIPT
 * Handles Navigation, Header Scroll, Dynamic Config Rendering, and Global Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeaderScroll();
  initDynamicConfig();
  initEnquiryModal();
});

/**
 * Mobile Navigation Drawer & Hamburger
 */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close when clicking nav links
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

/**
 * Header Scroll Appearance
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Dynamically Populate Config Elements (phone, whatsapp, hours, year)
 */
function initDynamicConfig() {
  if (typeof SAPPHIRE_CONFIG === 'undefined') return;

  // Set current year
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Populate phone numbers
  document.querySelectorAll('.gym-phone-display').forEach(el => {
    el.textContent = SAPPHIRE_CONFIG.business.contact.phone;
  });
  document.querySelectorAll('a.gym-phone-link').forEach(el => {
    el.href = `tel:${SAPPHIRE_CONFIG.business.contact.phoneRaw}`;
  });

  // Populate WhatsApp
  document.querySelectorAll('a.gym-whatsapp-link').forEach(el => {
    const defaultMsg = encodeURIComponent("Hello Sapphire Fitness Gym! I'm interested in joining and would like to know more about your facilities and membership plans.");
    el.href = `https://wa.me/${SAPPHIRE_CONFIG.business.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${defaultMsg}`;
  });

  // Populate Address
  document.querySelectorAll('.gym-address-display').forEach(el => {
    el.textContent = SAPPHIRE_CONFIG.business.location.fullAddress;
  });
}

/**
 * Global Quick Enquiry Modal
 */
function initEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.modal-close, .modal-backdrop-close');
  const planSelect = modal.querySelector('#modalMembershipPlan');

  // Open modal triggers
  document.querySelectorAll('[data-open-enquiry]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedPlan = btn.getAttribute('data-plan') || '';
      if (planSelect && preselectedPlan) {
        planSelect.value = preselectedPlan;
      }
      openModal(modal);
    });
  });

  // Close triggers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal(modal);
    }
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const firstInput = modal.querySelector('input:not([type="hidden"])');
  if (firstInput) setTimeout(() => firstInput.focus(), 150);
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Global modal triggers exposed
window.openEnquiryWithPlan = function(planId) {
  const modal = document.getElementById('enquiryModal');
  if (modal) {
    const planSelect = modal.querySelector('#modalMembershipPlan');
    if (planSelect && planId) {
      planSelect.value = planId;
    }
    openModal(modal);
  }
};
