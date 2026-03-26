// ===== PASSWORD TOGGLE =====
const passwordInput = document.getElementById('password');
const toggleBtn = document.querySelector('.toggle-pw');
const eyeIcon = document.getElementById('eye-icon');

const eyeOpenSVG = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  <circle cx="12" cy="12" r="3" />
`;

const eyeClosedSVG = `
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

let passwordVisible = false;

toggleBtn.addEventListener('click', () => {
  passwordVisible = !passwordVisible;
  passwordInput.type = passwordVisible ? 'text' : 'password';
  eyeIcon.innerHTML = passwordVisible ? eyeOpenSVG : eyeClosedSVG;
  toggleBtn.setAttribute('aria-label', passwordVisible ? 'Hide password' : 'Show password');
});


// ===== FORM VALIDATION & LOGIN =====
const form = document.querySelector('form');
const emailInput = document.getElementById('username');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  clearError(emailInput);
  clearError(passwordInput);

  const emailVal = emailInput.value.trim();
  const passVal  = passwordInput.value;

  // Email validation
  if (!emailVal) {
    showError(emailInput, 'Email is required.');
    valid = false;
  } else if (!isValidEmail(emailVal)) {
    showError(emailInput, 'Please enter a valid email address.');
    valid = false;
  }

  // Password validation
  if (!passVal) {
    showError(passwordInput, 'Password is required.');
    valid = false;
  } else if (passVal.length < 6) {
    showError(passwordInput, 'Password must be at least 6 characters.');
    valid = false;
  }

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const found = users.find(u => u.email === emailVal && u.password === passVal);

  if (found) {
    if (found.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-dashboard.html';
    }
  } else {
    showError(passwordInput, 'Invalid email or password.');
  }
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  const wrap = input.closest('.input-wrap') || input.parentElement;
  input.style.borderColor = '#e53e3e';
  input.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.12)';

  const err = document.createElement('p');
  err.className = 'field-error';
  err.textContent = message;
  err.style.cssText = 'color:#e53e3e; font-size:0.82rem; margin-top:5px;';
  wrap.after(err);
}

function clearError(input) {
  input.style.borderColor = '';
  input.style.boxShadow = '';
  const group = input.closest('.form-group');
  const err = group.querySelector('.field-error');
  if (err) err.remove();
}

// Clear errors on input
emailInput.addEventListener('input', () => clearError(emailInput));
passwordInput.addEventListener('input', () => clearError(passwordInput));


// ===== FORGOT PASSWORD =====
const forgotBtn = document.querySelector('.forgot');
let answersDisabled = false;

forgotBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();

  if (email && isValidEmail(email)) {
    alert(`Password reset link sent to: ${email}`);
    clearError(emailInput);
    answersDisabled = false;
  } else if (!answersDisabled) {
    emailInput.focus();
    showError(emailInput, 'Enter your email first to reset your password.');
    answersDisabled = true;
  }
});


// ===== GOOGLE SIGN IN =====
const GOOGLE_CLIENT_ID = '915115141931-d1sveostmvvgokm28p1a3a7qlpfla543.apps.googleusercontent.com';

function handleGoogleResponse(response) {
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  const user = {
    name:    payload.name,
    email:   payload.email,
    picture: payload.picture
  };
  sessionStorage.setItem('googleUser', JSON.stringify(user));
  window.location.href = 'user-dashboard.html';
}

window.handleGoogleResponse = handleGoogleResponse;

window.addEventListener('load', () => {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    ux_mode: 'popup',
    use_fedcm_for_prompt: false
  });
});

document.querySelector('.btn-google').addEventListener('click', (e) => {
  e.preventDefault();

  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'none';
  document.body.appendChild(tempDiv);

  google.accounts.id.renderButton(tempDiv, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
  });

  tempDiv.querySelector('div[role="button"]')?.click();
  setTimeout(() => document.body.removeChild(tempDiv), 3000);
});


// ===== REMEMBER ME =====
const rememberCheckbox = document.querySelector('input[name="remember"]');

window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('rememberedEmail');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
});

form.addEventListener('submit', () => {
  if (rememberCheckbox.checked) {
    localStorage.setItem('rememberedEmail', emailInput.value.trim());
  } else {
    localStorage.removeItem('rememberedEmail');
  }
});
