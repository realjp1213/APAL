// Sign up form in signup.html

// supabase client setup
const supabaseUrl = "https://yheeuynijsdlmnuopvbl.supabase.co";
const supabaseKey = "sb_publishable_6AmnKbTcF-0h40TE2RwUsQ_j9IvJttA";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const signupBtn = document.getElementById("signupBtn");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const globalError = document.getElementById("formError");

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8 && /\d/.test(password);
  }

  function showError(input, errorElement, message) {
    input.classList.add("is-invalid");
    errorElement.textContent = message;
  }

  function clearError(input, errorElement) {
    input.classList.remove("is-invalid");
    errorElement.textContent = "";
  }

  function validateEmailField() {
    const email = emailInput.value.trim();

    if (!email) {
      showError(emailInput, emailError, "Please enter your email");
      return false;
    }

    if (!isValidEmail(email)) {
      showError(emailInput, emailError, "Enter a valid email address");
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  function validatePasswordField() {
    const password = passwordInput.value;

    if (!password) {
      showError(passwordInput, passwordError, "Please enter a password");
      return false;
    }

    if (!isValidPassword(password)) {
      showError(passwordInput, passwordError, "Use at least 8 characters and 1 number");
      return false;
    }

    clearError(passwordInput, passwordError);
    return true;
  }

  function validateConfirmPasswordField() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!confirmPassword) {
      showError(confirmPasswordInput, confirmPasswordError, "Please confirm your password");
      return false;
    }

    if (password !== confirmPassword) {
      showError(confirmPasswordInput, confirmPasswordError, "Passwords must match");
      return false;
    }

    clearError(confirmPasswordInput, confirmPasswordError);
    return true;
  }

  emailInput.addEventListener("blur", validateEmailField);
  passwordInput.addEventListener("blur", validatePasswordField);
  confirmPasswordInput.addEventListener("blur", validateConfirmPasswordField);

  emailInput.addEventListener("input", function () {
    if (emailInput.classList.contains("is-invalid")) {
      validateEmailField();
    }
  });

  passwordInput.addEventListener("input", function () {
    if (passwordInput.classList.contains("is-invalid")) {
      validatePasswordField();
    }

    if (confirmPasswordInput.value) {
      validateConfirmPasswordField();
    }
  });

  confirmPasswordInput.addEventListener("input", function () {
    if (confirmPasswordInput.classList.contains("is-invalid")) {
      validateConfirmPasswordField();
    }
  });

    // Supabase sign up logic
    signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  globalError.textContent = "";
  globalError.style.color = "";

  const isEmailValid = validateEmailField();
  const isPasswordValid = validatePasswordField();
  const isConfirmPasswordValid = validateConfirmPasswordField();

  if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  signupBtn.disabled = true;
  signupBtn.textContent = "Creating account...";

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "http://127.0.0.1:5500/pages/auth/auth-callback.html"
      }
    });

    if (error) {
      globalError.textContent = error.message;
      return;
    }

    // Redirect to confirmation page after successful signup
  signupForm.reset();
  clearError(emailInput, emailError);
  clearError(passwordInput, passwordError);
  clearError(confirmPasswordInput, confirmPasswordError);
  console.log("Supabase signup success:", data);
  window.location.href = `confirm-email.html?email=${encodeURIComponent(email)}`;
  } catch (err) {
    globalError.textContent = "Something went wrong. Please try again.";
    console.error("Unexpected signup error:", err);
  } finally {
    signupBtn.disabled = false;
    signupBtn.textContent = "Create account";
  }
});
}

