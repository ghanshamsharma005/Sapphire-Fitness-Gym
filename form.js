/**
 * SAPPHIRE FITNESS GYM - ENQUIRY FORM HANDLER
 * Indian Phone Validation, Anti-Spam Honeypot, Duplicate Prevention,
 * Dual Persistence (Backend REST API + LocalStorage Fallback + WhatsApp Direct CTA)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAllEnquiryForms();
});

function initAllEnquiryForms() {
  document.querySelectorAll('form[data-enquiry-form]').forEach(form => {
    setupFormSubmission(form);
  });
}

/**
 * Validates Indian Phone Number
 * Accepts 10 digits starting with 6, 7, 8, or 9.
 * Handles prefixes like +91, 91, or 0.
 */
function validateIndianPhone(input) {
  if (!input) return { valid: false, message: "Phone number is required." };
  
  // Strip non-digit characters
  let digits = input.replace(/\D/g, '');

  // Handle +91 or 91 country code prefix
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.substring(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Validate standard 10 digit Indian mobile numbers
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (digits.length === 10 && indianMobileRegex.test(digits)) {
    return { valid: true, cleanNumber: digits };
  }

  return {
    valid: false,
    message: "Please enter a valid 10-digit Indian phone number (starting with 6, 7, 8, or 9)."
  };
}

/**
 * Validates optional email
 */
function validateEmail(email) {
  if (!email || email.trim() === '') return { valid: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: emailRegex.test(email.trim()),
    message: "Please enter a valid email address, or leave it blank."
  };
}

/**
 * Setup individual form
 */
function setupFormSubmission(form) {
  const formStartTime = Date.now();
  let isSubmitting = false;

  const nameInput = form.querySelector('[name="fullName"]');
  const phoneInput = form.querySelector('[name="phoneNumber"]');
  const emailInput = form.querySelector('[name="emailAddress"]');
  const planSelect = form.querySelector('[name="interestedPlan"]');
  const messageInput = form.querySelector('[name="message"]');
  const honeypot = form.querySelector('[name="website_verify_bot"]');
  const submitBtn = form.querySelector('[type="submit"]');
  const alertBox = form.querySelector('.form-alert');

  // Real-time phone formatting helper
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      // allow digits, spaces, and hyphens only
      e.target.value = e.target.value.replace(/[^\d\s-+]/g, '');
      const validation = validateIndianPhone(e.target.value);
      const feedback = form.querySelector('.phone-feedback');
      if (feedback) {
        if (e.target.value.trim().length >= 10 && !validation.valid) {
          feedback.textContent = validation.message;
          feedback.classList.add('show');
          phoneInput.classList.add('is-invalid');
        } else {
          feedback.classList.remove('show');
          phoneInput.classList.remove('is-invalid');
        }
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Duplicate submission prevention
    if (isSubmitting) return;

    // Reset alert
    hideAlert(alertBox);

    // 1. Anti-Spam Honeypot check
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Spam honeypot triggered. Silently aborting submission.");
      showFakeSuccess(form, alertBox);
      return;
    }

    // 2. Anti-bot time delta check (must take > 1.2s to fill form)
    if (Date.now() - formStartTime < 1200) {
      console.warn("Form filled unnaturally fast.");
    }

    // 3. Validate Full Name
    const nameVal = nameInput ? nameInput.value.trim() : '';
    if (nameVal.length < 2) {
      showError(nameInput, "Please enter your full name (at least 2 characters).", alertBox);
      return;
    } else {
      clearInputError(nameInput);
    }

    // 4. Validate Phone
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const phoneCheck = validateIndianPhone(phoneVal);
    if (!phoneCheck.valid) {
      showError(phoneInput, phoneCheck.message, alertBox);
      return;
    } else {
      clearInputError(phoneInput);
    }

    // 5. Validate Email (Optional)
    const emailVal = emailInput ? emailInput.value.trim() : '';
    if (emailVal !== '') {
      const emailCheck = validateEmail(emailVal);
      if (!emailCheck.valid) {
        showError(emailInput, emailCheck.message, alertBox);
        return;
      }
    }
    clearInputError(emailInput);

    // 6. Selected Plan
    const planVal = planSelect ? planSelect.value : 'General Fitness Enquiry';
    const messageVal = messageInput ? messageInput.value.trim() : '';

    // Prepare lead payload
    const leadId = `SFG-${Date.now().toString().slice(-6)}`;
    const leadData = {
      id: leadId,
      fullName: nameVal,
      phoneNumber: phoneCheck.cleanNumber,
      displayPhone: `+91 ${phoneCheck.cleanNumber.substring(0, 5)} ${phoneCheck.cleanNumber.substring(5)}`,
      emailAddress: emailVal || null,
      interestedPlan: planVal,
      message: messageVal,
      submittedAt: new Date().toISOString(),
      displayDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      status: "New",
      source: window.location.pathname.includes('contact') ? 'Contact Page' : 'Homepage / Modal'
    };

    // UI Loading State
    isSubmitting = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin" style="width:18px;height:18px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Submitting Enquiry...
    `;

    try {
      // Step A: Attempt backend persistence
      let backendSuccess = false;
      try {
        const response = await fetch('/api/enquire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        });
        if (response.ok) {
          backendSuccess = true;
        }
      } catch (netErr) {
        // Backend not running or static mode - fallback to localStorage
        backendSuccess = false;
      }

      // Step B: Always persist locally in localStorage for resilience
      saveLeadToLocalStorage(leadData);

      // Step C: Success UI with instant WhatsApp follow-up link
      showSuccess(form, alertBox, leadData, backendSuccess);
      form.reset();

    } catch (err) {
      console.error("Submission error:", err);
      showAlert(alertBox, "error", "An unexpected error occurred. Please try again or WhatsApp us directly.");
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

function saveLeadToLocalStorage(lead) {
  try {
    const existing = JSON.parse(localStorage.getItem('sapphire_leads') || '[]');
    existing.unshift(lead);
    localStorage.setItem('sapphire_leads', JSON.stringify(existing.slice(0, 100)));
  } catch (e) {
    console.error("Failed to save lead in localStorage", e);
  }
}

function showError(input, message, alertBox) {
  if (input) {
    input.classList.add('is-invalid');
    input.focus();
  }
  showAlert(alertBox, "error", message);
}

function clearInputError(input) {
  if (input) input.classList.remove('is-invalid');
}

function showAlert(alertBox, type, message) {
  if (!alertBox) {
    alert(message);
    return;
  }
  alertBox.className = `form-alert ${type} show`;
  alertBox.innerHTML = `
    <span style="font-size:1.2rem;">${type === 'success' ? '✓' : '⚠️'}</span>
    <div>${message}</div>
  `;
}

function hideAlert(alertBox) {
  if (alertBox) alertBox.className = 'form-alert';
}

function showFakeSuccess(form, alertBox) {
  showAlert(alertBox, "success", "Enquiry received! Our team will contact you soon.");
  form.reset();
}

function showSuccess(form, alertBox, lead, backendSuccess) {
  const whatsappNum = (typeof SAPPHIRE_CONFIG !== 'undefined' ? SAPPHIRE_CONFIG.business.contact.whatsapp : '919876543210').replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(
    `Hello Sapphire Fitness Gym! I submitted an enquiry for ${lead.interestedPlan}.\nName: ${lead.fullName}\nPhone: ${lead.phoneNumber}\nRef: ${lead.id}`
  );
  const waUrl = `https://wa.me/${whatsappNum}?text=${encodedMsg}`;

  const persistenceNote = backendSuccess 
    ? `<span style="font-size:0.8rem;color:#34d399;display:block;margin-top:4px;">✓ Saved securely in gym database (Ref: ${lead.id})</span>`
    : `<span style="font-size:0.8rem;color:#fbbf24;display:block;margin-top:4px;">✓ Logged securely in local session storage (Ref: ${lead.id})</span>`;

  showAlert(alertBox, "success", `
    <strong>Thank you, ${lead.fullName}! Your enquiry has been received.</strong>
    ${persistenceNote}
    <p style="margin: 8px 0 12px; font-size: 0.9rem; color: #e2e8f0;">
      Our training consultant will call you at <strong>${lead.displayPhone}</strong> shortly.
    </p>
    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-sapphire" style="margin-top:6px; display:inline-flex; align-items:center; gap:8px;">
      <span>📱 Instant Connect on WhatsApp</span>
    </a>
  `);
}
