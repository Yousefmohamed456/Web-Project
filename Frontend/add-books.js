/**
 * add-books.js
 * Frontend validation, button actions & navigation for the Add New Book page.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|''} type
 */
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'show' + (type ? ` toast-${type}` : '');

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.className = '';
  }, 3500);
}

/**
 * Mark a field as invalid and show its error message.
 * @param {HTMLElement} field
 * @param {string}      msg
 */
function setInvalid(field, msg) {
  field.classList.remove('valid');
  field.classList.add('invalid');

  const errEl = field.parentElement.querySelector('.field-error');
  if (errEl) {
    errEl.textContent = msg;
    errEl.classList.add('visible');
  }
}

/**
 * Mark a field as valid and hide its error message.
 * @param {HTMLElement} field
 */
function setValid(field) {
  field.classList.remove('invalid');
  field.classList.add('valid');

  const errEl = field.parentElement.querySelector('.field-error');
  if (errEl) errEl.classList.remove('visible');
}

/**
 * Remove all validation classes (reset state).
 * @param {HTMLElement} field
 */
function clearValidation(field) {
  field.classList.remove('valid', 'invalid');
  const errEl = field.parentElement?.querySelector('.field-error');
  if (errEl) errEl.classList.remove('visible');
}

// ── Validation Rules ──────────────────────────────────────────────────────────

/** Minimum / maximum constants */
const RULES = {
  book_id:     { min: 2,  max: 20,  pattern: /^[A-Za-z0-9\-_]+$/, patternMsg: 'Only letters, numbers, hyphens and underscores.' },
  book_name:   { min: 2,  max: 150 },
  book_author: { min: 2,  max: 100 },
  description: { min: 10, max: 1000 },
};

/**
 * Validate a single field and update its UI state.
 * @param {HTMLElement} field
 * @returns {boolean} true when valid
 */
function validateField(field) {
  const id    = field.id || field.name;
  const value = field.value.trim();
  const rule  = RULES[id];

  if (!rule) {
    // For select / textarea not listed in RULES, just check non-empty.
    if (field.hasAttribute('required') && !value) {
      setInvalid(field, 'This field is required.');
      return false;
    }
    setValid(field);
    return true;
  }

  if (field.hasAttribute('required') && !value) {
    setInvalid(field, 'This field is required.');
    return false;
  }

  if (value.length < rule.min) {
    setInvalid(field, `Must be at least ${rule.min} characters.`);
    return false;
  }

  if (value.length > rule.max) {
    setInvalid(field, `Must not exceed ${rule.max} characters.`);
    return false;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    setInvalid(field, rule.patternMsg || 'Invalid format.');
    return false;
  }

  setValid(field);
  return true;
}

/**
 * Validate the entire form.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
  let allValid = true;

  fields.forEach(field => {
    if (field.type === 'radio') return; // handled separately
    if (!validateField(field)) allValid = false;
  });

  return allValid;
}

// ── DOM Ready ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form');
  if (!form) return;

  // ── 1. Highlight active nav link ──────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ── 2. Inject error message spans & wrap radio buttons ───────────────────
  const requiredFields = form.querySelectorAll('input[required]:not([type="radio"]), select[required], textarea[required]');

  requiredFields.forEach(field => {
    // Add error span if not already present
    const wrap = field.parentElement;
    if (!wrap.querySelector('.field-error')) {
      const span = document.createElement('span');
      span.className = 'field-error';
      span.setAttribute('role', 'alert');
      field.after(span);
    }
  });

  // Wrap radio buttons in a styled group
  const fieldset = form.querySelector('fieldset');
  if (fieldset) {
    // Build .radio-group wrapper
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';

    const radios = fieldset.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      const label = fieldset.querySelector(`label[for="${radio.id}"]`);
      const optionDiv = document.createElement('label');
      optionDiv.className = 'radio-option';
      if (label) {
        const span = document.createElement('span');
        span.textContent = label.textContent;
        label.remove();
        radio.after(span); // temporary
        optionDiv.appendChild(radio);
        optionDiv.appendChild(span);
      }
      radioGroup.appendChild(optionDiv);
    });

    // Remove leftover text nodes in fieldset then append group
    [...fieldset.childNodes].forEach(node => {
      if (node !== fieldset.querySelector('legend') && !radioGroup.contains(node)) {
        node.remove?.();
      }
    });
    fieldset.appendChild(radioGroup);
  }

  // ── 3. Wrap form actions ──────────────────────────────────────────────────
  const cancelLink = form.querySelector('a[href]');
  if (cancelLink) cancelLink.classList.add('btn-cancel');

  // Wrap last 3 elements (submit, reset, cancel) into .form-actions div
  const submitBtn = form.querySelector('button[type="submit"]');
  const resetBtn  = form.querySelector('button[type="reset"]');
  if (submitBtn && resetBtn && cancelLink) {
    const actions = document.createElement('div');
    actions.className = 'form-actions';
    submitBtn.after(actions);
    actions.appendChild(submitBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(cancelLink);
  }

  // ── 4. Wrap form in a card ────────────────────────────────────────────────
  const card = document.createElement('div');
  card.className = 'form-card';
  form.parentNode.insertBefore(card, form);
  card.appendChild(form);

  // ── 5. Add breadcrumb ────────────────────────────────────────────────────
  const main = document.querySelector('main');
  const h1   = main?.querySelector('h1');
  if (main && h1) {
    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'breadcrumb');
    breadcrumb.innerHTML = `
      <a href="admin-dashboard.html">Dashboard</a>
      <span>›</span>
      <span>Add New Book</span>
    `;
    main.insertBefore(breadcrumb, h1);
  }

  // ── 6. Add toast element to page ─────────────────────────────────────────
  if (!document.getElementById('toast')) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  // ── 7. Real-time validation (blur) ────────────────────────────────────────
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));

    field.addEventListener('input', () => {
      // Clear invalid state while the user is typing
      if (field.classList.contains('invalid')) {
        clearValidation(field);
      }
    });
  });

  // ── 8. Submit handler ─────────────────────────────────────────────────────
  form.addEventListener('submit', event => {
    event.preventDefault();

    const isValid = validateForm(form);

    if (!isValid) {
      // Scroll to the first invalid field
      const firstInvalid = form.querySelector('.invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus();

      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    // Gather data
    const data = {
      bookId:       form.book_id.value.trim(),
      bookName:     form.book_name.value.trim(),
      bookAuthor:   form.book_author.value.trim(),
      category:     form.category.value,
      description:  form.description.value.trim(),
      status:       form.status.value,
    };

    console.log('Book submitted:', data);

    // Simulate saving (would be replaced with a real API call)
    showToast(`"${data.bookName}" added to the catalog!`, 'success');

    // Optionally redirect after a short delay
    setTimeout(() => {
      // window.location.href = 'admin-dashboard.html';
      form.reset();
      form.querySelectorAll('input, select, textarea').forEach(clearValidation);
    }, 1800);
  });

  // ── 9. Reset handler ─────────────────────────────────────────────────────
  form.addEventListener('reset', () => {
    setTimeout(() => {
      form.querySelectorAll('input, select, textarea').forEach(clearValidation);
    }, 0);
    showToast('Form cleared.', '');
  });

  // ── 10. Character counter for description ─────────────────────────────────
  const descField = form.querySelector('#description');
  if (descField) {
    const counter = document.createElement('small');
    counter.style.cssText = 'display:block;text-align:right;color:var(--gray-500);font-size:0.78rem;margin-top:0.3rem;';
    counter.textContent = `0 / ${RULES.description.max} characters`;
    descField.parentElement.appendChild(counter);

    descField.addEventListener('input', () => {
      const len = descField.value.length;
      counter.textContent = `${len} / ${RULES.description.max} characters`;
      counter.style.color = len > RULES.description.max ? 'var(--error)' : 'var(--gray-500)';
    });
  }

  // ── 11. Book ID — auto-uppercase suggestion ───────────────────────────────
  const bookIdField = form.querySelector('#book_id');
  if (bookIdField) {
    bookIdField.addEventListener('input', () => {
      const pos = bookIdField.selectionStart;
      bookIdField.value = bookIdField.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '');
      bookIdField.setSelectionRange(pos, pos);
    });
  }

});
