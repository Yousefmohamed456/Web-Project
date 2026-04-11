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