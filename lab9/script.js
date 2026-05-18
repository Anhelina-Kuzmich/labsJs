// script.js
let regFirstName,
  regLastName,
  regEmail,
  regPassword,
  regConfirmPassword,
  regPhone,
  regDob,
  regCountry,
  regCity;
let firstNameError,
  lastNameError,
  emailError,
  passwordError,
  confirmPasswordError,
  phoneError,
  dobError,
  sexError,
  countryError,
  cityError;
let regForm,
  registerMessage,
  loginUsername,
  loginPassword,
  loginRemember,
  loginForm,
  loginMessage,
  loginUsernameError,
  loginPasswordError;
let tabBtns, forms;

const validateName = (name) => {
  if (!name || name.trim().length === 0)
    return { isValid: false, error: "Поле обов'язкове" };
  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 15)
    return { isValid: false, error: "Має бути від 3 до 15 символів" };
  const regex = /^[A-Za-zА-Яа-яЄєІіЇїҐґ'\- ]+$/;
  if (!regex.test(trimmed))
    return { isValid: false, error: "Тільки літери, пробіли, дефіс, апостроф" };
  return { isValid: true, error: "" };
};

const validateEmail = (email) => {
  if (!email) return { isValid: false, error: "Email обов'язковий" };
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!re.test(email))
    return {
      isValid: false,
      error: "Введіть коректний email (user@domain.com)",
    };
  return { isValid: true, error: "" };
};

const validatePassword = (password) => {
  if (!password) return { isValid: false, error: "Пароль обов'язковий" };
  if (password.length < 6)
    return { isValid: false, error: "Пароль має містити мінімум 6 символів" };
  return { isValid: true, error: "" };
};

const validateConfirmPassword = (password, confirm) => {
  if (confirm === undefined || confirm === "")
    return { isValid: false, error: "Підтвердіть пароль" };
  if (password !== confirm)
    return { isValid: false, error: "Паролі не співпадають" };
  return { isValid: true, error: "" };
};

const validatePhone = (phone) => {
  if (!phone) return { isValid: false, error: "Номер телефону обов'язковий" };
  const cleaned = phone.replace(/\s+/g, "");
  const regex = /^\+380\d{9}$/;
  if (!regex.test(cleaned))
    return { isValid: false, error: "Формат: +380XXXXXXXXX (9 цифр)" };
  return { isValid: true, error: "" };
};

const validateAge = (dateString) => {
  if (!dateString)
    return { isValid: false, error: "Дата народження обов'язкова" };
  const birthDate = new Date(dateString);
  const today = new Date();
  if (birthDate > today)
    return { isValid: false, error: "Дата не може бути в майбутньому" };
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  )
    age--;
  if (age < 12)
    return {
      isValid: false,
      error: "Вам має бути не менше 12 років для реєстрації",
    };
  return { isValid: true, error: "" };
};

const validateSex = (sexValue) => {
  return { isValid: true, error: "" };
};

const validateCountry = (country) => {
  if (!country) return { isValid: false, error: "Виберіть країну" };
  return { isValid: true, error: "" };
};

const validateCity = (city) => {
  if (!city) return { isValid: false, error: "Виберіть місто" };
  return { isValid: true, error: "" };
};

const validateUsername = (username) => {
  if (!username || username.trim() === "")
    return { isValid: false, error: "Введіть логін" };
  return { isValid: true, error: "" };
};

function setFieldValidity(inputElement, errorElement, validationResult) {
  if (validationResult.isValid) {
    inputElement.classList.remove("invalid");
    inputElement.classList.add("valid");
    errorElement.textContent = "";
  } else {
    inputElement.classList.remove("valid");
    inputElement.classList.add("invalid");
    errorElement.textContent = validationResult.error;
  }
}

const citiesMap = {
  ukraine: ["Київ", "Львів", "Одеса", "Харків", "Дніпро"],
  usa: ["Нью-Йорк", "Лос-Анджелес", "Чикаго", "Х'юстон"],
  germany: ["Берлін", "Мюнхен", "Гамбург", "Кельн"],
};

function updateCityOptions(countryValue) {
  if (!countryValue) {
    regCity.disabled = true;
    regCity.innerHTML =
      '<option value="" selected>Спочатку оберіть країну</option>';
    return;
  }
  const cities = citiesMap[countryValue] || [];
  regCity.disabled = false;
  regCity.innerHTML =
    '<option value="" disabled selected>Оберіть місто</option>';
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    regCity.appendChild(option);
  });
  regCity.classList.remove("valid", "invalid");
  cityError.textContent = "";
}

function validateRegistrationForm() {
  const firstNameVal = regFirstName.value.trim();
  const lastNameVal = regLastName.value.trim();
  const emailVal = regEmail.value.trim();
  const passwordVal = regPassword.value;
  const confirmVal = regConfirmPassword.value;
  const phoneVal = regPhone.value.trim();
  const dobVal = regDob.value;
  const sexVal =
    document.querySelector('input[name="sex"]:checked')?.value || "";

  const countryVal = regCountry.value;
  const cityVal = regCity.value;
  const nameValid = validateName(firstNameVal);
  const lastNameValid = validateName(lastNameVal);
  const emailValid = validateEmail(emailVal);
  const passwordValid = validatePassword(passwordVal);
  const confirmValid = validateConfirmPassword(passwordVal, confirmVal);
  const phoneValid = validatePhone(phoneVal);
  const ageValid = validateAge(dobVal);
  const sexValid = validateSex(sexVal);
  const countryValid = validateCountry(countryVal);
  const cityValid = validateCity(cityVal);

  setFieldValidity(regFirstName, firstNameError, nameValid);
  setFieldValidity(regLastName, lastNameError, lastNameValid);
  setFieldValidity(regEmail, emailError, emailValid);
  setFieldValidity(regPassword, passwordError, passwordValid);
  setFieldValidity(regConfirmPassword, confirmPasswordError, confirmValid);
  setFieldValidity(regPhone, phoneError, phoneValid);
  setFieldValidity(regDob, dobError, ageValid);

  sexError.textContent = "";

  setFieldValidity(regCountry, countryError, countryValid);
  setFieldValidity(regCity, cityError, cityValid);

  return (
    nameValid.isValid &&
    lastNameValid.isValid &&
    emailValid.isValid &&
    passwordValid.isValid &&
    confirmValid.isValid &&
    phoneValid.isValid &&
    ageValid.isValid &&
    countryValid.isValid &&
    cityValid.isValid
  );
}

function clearRegistrationForm() {
  regFirstName.value = "";
  regLastName.value = "";
  regEmail.value = "";
  regPassword.value = "";
  regConfirmPassword.value = "";
  regPhone.value = "";
  regDob.value = "";
  document
    .querySelectorAll('input[name="sex"]')
    .forEach((radio) => (radio.checked = false));
  regCountry.value = "";
  regCity.disabled = true;
  regCity.innerHTML =
    '<option value="" selected>Спочатку оберіть країну</option>';
  const allInputs = document.querySelectorAll(
    "#registerForm input, #registerForm select"
  );
  allInputs.forEach((inp) => inp.classList.remove("valid", "invalid"));
  const errorDivs = document.querySelectorAll("#registerForm .error-msg");
  errorDivs.forEach((div) => (div.textContent = ""));
  registerMessage.textContent = "";
  registerMessage.className = "form-message";
}

function validateLoginForm() {
  const usernameVal = loginUsername.value.trim();
  const passwordVal = loginPassword.value;
  const usernameValid = validateUsername(usernameVal);
  const passwordValid = validatePassword(passwordVal);
  setFieldValidity(loginUsername, loginUsernameError, usernameValid);
  setFieldValidity(loginPassword, loginPasswordError, passwordValid);
  return usernameValid.isValid && passwordValid.isValid;
}

function showLoginSuccess() {
  loginMessage.textContent = "Вхід успішний! (демо-режим)";
  loginMessage.className = "form-message success-message";
  loginUsername.value = "";
  loginPassword.value = "";
  loginRemember.checked = false;
  loginUsername.classList.remove("valid", "invalid");
  loginPassword.classList.remove("valid", "invalid");
  loginUsernameError.textContent = "";
  loginPasswordError.textContent = "";
  setTimeout(() => {
    if (loginMessage) loginMessage.textContent = "";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  regFirstName = document.getElementById("regFirstName");
  regLastName = document.getElementById("regLastName");
  regEmail = document.getElementById("regEmail");
  regPassword = document.getElementById("regPassword");
  regConfirmPassword = document.getElementById("regConfirmPassword");
  regPhone = document.getElementById("regPhone");
  regDob = document.getElementById("regDob");
  regCountry = document.getElementById("regCountry");
  regCity = document.getElementById("regCity");
  firstNameError = document.getElementById("firstNameError");
  lastNameError = document.getElementById("lastNameError");
  emailError = document.getElementById("emailError");
  passwordError = document.getElementById("passwordError");
  confirmPasswordError = document.getElementById("confirmPasswordError");
  phoneError = document.getElementById("phoneError");
  dobError = document.getElementById("dobError");
  sexError = document.getElementById("sexError");
  countryError = document.getElementById("countryError");
  cityError = document.getElementById("cityError");
  regForm = document.getElementById("registerForm");
  registerMessage = document.getElementById("registerMessage");
  loginUsername = document.getElementById("loginUsername");
  loginPassword = document.getElementById("loginPassword");
  loginRemember = document.getElementById("loginRemember");
  loginForm = document.getElementById("loginForm");
  loginMessage = document.getElementById("loginMessage");
  loginUsernameError = document.getElementById("loginUsernameError");
  loginPasswordError = document.getElementById("loginPasswordError");
  tabBtns = document.querySelectorAll(".tab-btn");
  forms = document.querySelectorAll(".form-container");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      forms.forEach((form) => form.classList.remove("active"));
      if (tabId === "register") {
        document.getElementById("register-tab").classList.add("active");
      } else {
        document.getElementById("login-tab").classList.add("active");
      }
    });
  });

  regCountry.addEventListener("change", (e) => {
    updateCityOptions(e.target.value);
    const countryValid = validateCountry(e.target.value);
    setFieldValidity(regCountry, countryError, countryValid);
  });

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });

  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateRegistrationForm()) {
      registerMessage.textContent = "Реєстрація успішна! Вітаємо!";
      registerMessage.className = "form-message success-message";
      clearRegistrationForm();
      updateCityOptions("");
      setTimeout(() => {
        registerMessage.textContent = "";
      }, 4000);
    } else {
      registerMessage.textContent = "Будь ласка, виправте помилки у формі";
      registerMessage.className = "form-message error-message";
      setTimeout(() => {
        if (registerMessage.textContent.includes("виправте"))
          registerMessage.textContent = "";
      }, 3000);
    }
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      showLoginSuccess();
    } else {
      loginMessage.textContent = "Невірний логін або пароль (мін. 6 символів)";
      loginMessage.className = "form-message error-message";
      setTimeout(() => {
        if (loginMessage.textContent.includes("Невірний"))
          loginMessage.textContent = "";
      }, 3000);
    }
  });

  const addBlurValidation = (id, validatorFunc, errorId, transform = null) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur", () => {
      let value = el.value;
      if (transform) value = transform(value);
      const result = validatorFunc(value);
      setFieldValidity(el, document.getElementById(errorId), result);
    });
  };
  addBlurValidation(
    "regFirstName",
    (v) => validateName(v),
    "firstNameError",
    (v) => v.trim()
  );
  addBlurValidation(
    "regLastName",
    (v) => validateName(v),
    "lastNameError",
    (v) => v.trim()
  );
  addBlurValidation(
    "regEmail",
    (v) => validateEmail(v),
    "emailError",
    (v) => v.trim()
  );
  addBlurValidation("regPassword", validatePassword, "passwordError");
  addBlurValidation(
    "regConfirmPassword",
    (v) => validateConfirmPassword(regPassword.value, v),
    "confirmPasswordError"
  );
  addBlurValidation(
    "regPhone",
    (v) => validatePhone(v),
    "phoneError",
    (v) => v.trim()
  );
  addBlurValidation("regDob", validateAge, "dobError");
  addBlurValidation("regCountry", validateCountry, "countryError");
  addBlurValidation("regCity", validateCity, "cityError");
  addBlurValidation(
    "loginUsername",
    (v) => validateUsername(v),
    "loginUsernameError",
    (v) => v.trim()
  );
  addBlurValidation("loginPassword", validatePassword, "loginPasswordError");
});
