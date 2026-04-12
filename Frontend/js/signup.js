// Wait until the page loads
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");

  // Create an error message element
  const errorMsg = document.createElement("p");
  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "14px";

  form.appendChild(errorMsg);

  form.addEventListener("submit", function (event) {
    errorMsg.textContent = ""; // clear old messages

    // Check if passwords match
    if (password.value !== confirmPassword.value) {
      event.preventDefault(); // stop form submission
      errorMsg.textContent = "Passwords do not match!";
      confirmPassword.focus();
      return;
    }

    // Optional: Password strength check
    if (password.value.length < 6) {
      event.preventDefault();
      errorMsg.textContent = "Password must be at least 6 characters long.";
      password.focus();
      return;
    }

    // If everything is valid
    alert("Account created successfully!");
  });
});
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
// Correct Coding
/*
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const passwordInput = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm_password");
  const nameInput = document.getElementById("user_name");
  const emailInput = document.getElementById("email");

  // ── Helpers ──
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    clearError(input);
    const wrap = input.closest(".form-group") || input.parentElement;
    input.style.borderColor = "#e53e3e";
    input.style.boxShadow = "0 0 0 3px rgba(229,62,62,0.12)";
    const err = document.createElement("p");
    err.className = "field-error";
    err.textContent = message;
    err.style.cssText = "color:#e53e3e;font-size:0.82rem;margin-top:5px;";
    wrap.appendChild(err);
  }

  function clearError(input) {
    input.style.borderColor = "";
    input.style.boxShadow = "";
    const wrap = input.closest(".form-group") || input.parentElement;
    const err = wrap.querySelector(".field-error");
    if (err) err.remove();
  }

  // Clear errors on typing
  form.querySelectorAll("input").forEach((inp) =>
    inp.addEventListener("input", () => clearError(inp))
  );

  // ── Form Submit ──
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let valid = true;

    [nameInput, emailInput, passwordInput, confirmPassword]
      .filter(Boolean)
      .forEach(clearError);

    // Username
    if (nameInput && !nameInput.value.trim()) {
      showError(nameInput, "Username is required.");
      valid = false;
    }

    // Email
    const emailVal = emailInput ? emailInput.value.trim() : "";
    if (!emailVal) {
      showError(emailInput, "Email is required.");
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(emailInput, "Please enter a valid email address.");
      valid = false;
    }

    // Password
    if (!passwordInput.value) {
      showError(passwordInput, "Password is required.");
      valid = false;
    } else if (passwordInput.value.length < 6) {
      showError(passwordInput, "Password must be at least 6 characters.");
      valid = false;
    }

    // Confirm Password
    if (!confirmPassword.value) {
      showError(confirmPassword, "Please confirm your password.");
      valid = false;
    } else if (passwordInput.value !== confirmPassword.value) {
      showError(confirmPassword, "Passwords do not match.");
      valid = false;
    }

    // Account Type
    const roleInput = document.querySelector('input[name="account_type"]:checked');
    if (!roleInput) {
      alert("Please select an account type.");
      valid = false;
    }

    if (!valid) return;

    // ── Save to localStorage ──
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    // Check if email already exists
    if (users.find((u) => u.email === emailVal)) {
      showError(emailInput, "An account with this email already exists.");
      return;
    }

    const newUser = {
      name: nameInput ? nameInput.value.trim() : "",
      email: emailVal,
      password: passwordInput.value,
      role: roleInput ? roleInput.value : "user",
    };

    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Account created successfully! Redirecting to login…");
    window.location.href = "Login.html";
  });
});
*/
