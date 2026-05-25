// script.js
let usersStore = JSON.parse(localStorage.getItem("app_users") || "[]");
let currentUser = null;
let currentUsers = [];
let currentPage = 1;
let totalPages = 100;
let isLoading = false;
let currentFilters = { search: "", sort: "name_asc", minAge: "", maxAge: "", country: "" };
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const authContainer = document.getElementById("authContainer");
const appContainer = document.getElementById("appContainer");
const friendsGrid = document.getElementById("friendsGrid");
const paginationDiv = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const minAgeInput = document.getElementById("minAge");
const maxAgeInput = document.getElementById("maxAge");
const countryFilter = document.getElementById("countryFilter");
const clearBtn = document.getElementById("clearFiltersBtn");
const logoutBtn = document.getElementById("logoutBtn");

function saveUsersToStorage() { localStorage.setItem("app_users", JSON.stringify(usersStore)); }
function saveFavorites() { localStorage.setItem("favorites", JSON.stringify(favorites)); }
function setCurrentUser(user) { localStorage.setItem("currentUser", JSON.stringify(user)); currentUser = user; }
function getCurrentUser() { return JSON.parse(localStorage.getItem("currentUser")); }
function clearCurrentUser() { localStorage.removeItem("currentUser"); currentUser = null; }

function validateName(name) {
    if (!name || name.trim().length === 0) return { isValid: false, error: "Обов'язкове поле" };
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return { isValid: false, error: "2-20 символів" };
    const regex = /^[A-Za-zА-Яа-яЄєІіЇїҐґ' -]+$/;
    return regex.test(trimmed) ? { isValid: true, error: "" } : { isValid: false, error: "Тільки літери, дефіс, апостроф" };
}

function validateEmail(email) {
    if (!email) return { isValid: false, error: "Email обов'язковий" };
    const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return re.test(email) ? { isValid: true, error: "" } : { isValid: false, error: "Неправильний формат email" };
}

function validatePassword(password) {
    if (!password) return { isValid: false, error: "Пароль обов'язковий" };
    return password.length >= 6 ? { isValid: true, error: "" } : { isValid: false, error: "Мінімум 6 символів" };
}

function validateConfirm(password, confirm) {
    if (!confirm) return { isValid: false, error: "Підтвердіть пароль" };
    return password === confirm ? { isValid: true, error: "" } : { isValid: false, error: "Паролі не співпадають" };
}

function validatePhone(phone) {
    if (!phone) return { isValid: false, error: "Телефон обов'язковий" };
    const cleaned = phone.replace(/\s/g, "");
    const regex = /^\+380\d{9}$/;
    return regex.test(cleaned) ? { isValid: true, error: "" } : { isValid: false, error: "Формат: +380XXXXXXXXX" };
}

function validateAge(dateStr) {
    if (!dateStr) return { isValid: false, error: "Дата народження обов'язкова" };
    const birth = new Date(dateStr);
    const today = new Date();
    if (birth > today) return { isValid: false, error: "Дата не може бути в майбутньому" };
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 12 ? { isValid: true, error: "" } : { isValid: false, error: "Має бути не менше 12 років" };
}

function setFieldValidity(input, errorEl, result) {
    if (!input) return;
    if (result.isValid) {
        input.classList.add("valid");
        input.classList.remove("invalid");
        errorEl.textContent = "";
    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
        errorEl.textContent = result.error;
    }
}

function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById("regFirstName").value.trim();
    const lastName = document.getElementById("regLastName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirmPassword").value;
    const phone = document.getElementById("regPhone").value.trim();
    const dob = document.getElementById("regDob").value;
    const sex = document.querySelector('input[name="sex"]:checked')?.value || "";
    const nameValid = validateName(firstName);
    const lastValid = validateName(lastName);
    const emailValid = validateEmail(email);
    const pwdValid = validatePassword(password);
    const confirmValid = validateConfirm(password, confirm);
    const phoneValid = validatePhone(phone);
    const ageValid = validateAge(dob);
    const sexValid = sex ? { isValid: true } : { isValid: false, error: "Виберіть стать" };
    setFieldValidity(document.getElementById("regFirstName"), document.getElementById("firstNameError"), nameValid);
    setFieldValidity(document.getElementById("regLastName"), document.getElementById("lastNameError"), lastValid);
    setFieldValidity(document.getElementById("regEmail"), document.getElementById("emailError"), emailValid);
    setFieldValidity(document.getElementById("regPassword"), document.getElementById("passwordError"), pwdValid);
    setFieldValidity(document.getElementById("regConfirmPassword"), document.getElementById("confirmPasswordError"), confirmValid);
    setFieldValidity(document.getElementById("regPhone"), document.getElementById("phoneError"), phoneValid);
    setFieldValidity(document.getElementById("regDob"), document.getElementById("dobError"), ageValid);
    const sexError = document.getElementById("sexError");
    if (!sexValid.isValid) sexError.textContent = sexValid.error;
    else sexError.textContent = "";
    if (nameValid.isValid && lastValid.isValid && emailValid.isValid && pwdValid.isValid && confirmValid.isValid && phoneValid.isValid && ageValid.isValid && sexValid.isValid) {
        const newUser = { id: Date.now(), firstName, lastName, email, password, phone, dob, sex, registeredAt: new Date().toISOString() };
        usersStore.push(newUser);
        saveUsersToStorage();
        setCurrentUser({ email, name: firstName + " " + lastName });
        showAppAfterAuth();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const loginVal = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const pwdValid = validatePassword(password);
    const emailValid = validateEmail(loginVal);
    const usernameError = document.getElementById("loginUsernameError");
    const passwordError = document.getElementById("loginPasswordError");
    let isValid = true;
    if (!emailValid.isValid) {
        usernameError.textContent = emailValid.error;
        isValid = false;
    } else {
        usernameError.textContent = "";
    }
    if (!pwdValid.isValid) {
        passwordError.textContent = pwdValid.error;
        isValid = false;
    } else {
        passwordError.textContent = "";
    }
    if (isValid) {
        let user = usersStore.find(u => u.email === loginVal);
        if (!user) {
            user = { id: Date.now(), firstName: "Користувач", lastName: "", email: loginVal, password: password };
            usersStore.push(user);
            saveUsersToStorage();
        }
        setCurrentUser({ email: user.email, name: (user.firstName || "Користувач") + " " + (user.lastName || "") });
        showAppAfterAuth();
    }
}

function showAppAfterAuth() {
    authContainer.style.display = "none";
    appContainer.style.display = "block";
    initApp();
}

function logout() {
    clearCurrentUser();
    authContainer.style.display = "block";
    appContainer.style.display = "none";
    window.location.reload();
}

function toggleFavorite(uuid) {
    if (favorites.includes(uuid)) favorites = favorites.filter(id => id !== uuid);
    else favorites.push(uuid);
    saveFavorites();
    renderCards(currentUsers);
}

function applyFiltersAndSort(usersArray) {
    let filtered = [...usersArray];
    const search = currentFilters.search.toLowerCase();
    if (search) {
        filtered = filtered.filter(u => u.name.first.toLowerCase().includes(search) || u.name.last.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    }
    if (currentFilters.minAge) {
        const min = parseInt(currentFilters.minAge);
        if (!isNaN(min) && min >= 0) filtered = filtered.filter(u => u.dob.age >= min);
    }
    if (currentFilters.maxAge) {
        const max = parseInt(currentFilters.maxAge);
        if (!isNaN(max) && max >= 0) filtered = filtered.filter(u => u.dob.age <= max);
    }
    if (currentFilters.country) {
        filtered = filtered.filter(u => u.location.country === currentFilters.country);
    }
    const [field, order] = currentFilters.sort.split('_');
    filtered.sort((a, b) => {
        if (field === "name") {
            const valA = (a.name.first + a.name.last).toLowerCase();
            const valB = (b.name.first + b.name.last).toLowerCase();
            return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else if (field === "age") {
            return order === "asc" ? a.dob.age - b.dob.age : b.dob.age - a.dob.age;
        } else if (field === "registered") {
            const dateA = new Date(a.registered.date);
            const dateB = new Date(b.registered.date);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        }
        return 0;
    });
    return filtered;
}

function renderCards(usersRaw) {
    const filteredList = applyFiltersAndSort(usersRaw);
    if (filteredList.length === 0) {
        friendsGrid.innerHTML = `<div style="color:white; grid-column:1/-1; text-align:center;">Немає користувачів за критеріями</div>`;
        return;
    }
    friendsGrid.innerHTML = filteredList.map(user => {
        const fullName = `${user.name.first} ${user.name.last}`;
        const isFav = favorites.includes(user.login.uuid);
        return `
            <div class="friend-card">
                <div class="card-img"><img src="${user.picture.large}" alt="photo" loading="lazy"></div>
                <div class="card-info">
                    <h3>${fullName} <button class="favorite-btn ${isFav ? 'active' : ''}" data-uuid="${user.login.uuid}"><i class="fas fa-heart"></i></button></h3>
                    <div class="info-row"><i class="fas fa-calendar-alt"></i> Вік: ${user.dob.age} р.</div>
                    <div class="info-row"><i class="fas fa-phone"></i> ${user.phone}</div>
                    <div class="info-row"><i class="fas fa-envelope"></i> ${user.email}</div>
                    <div class="info-row"><i class="fas fa-map-marker-alt"></i> ${user.location.city}, ${user.location.country}</div>
                    <div class="info-row"><i class="fas fa-clock"></i> Реєстрація: ${new Date(user.registered.date).toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }).join('');
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const uuid = btn.getAttribute('data-uuid');
            toggleFavorite(uuid);
        });
    });
}

async function fetchUsers(page = 1) {
    isLoading = true;
    friendsGrid.innerHTML = '<div class="loader"><i class="fas fa-spinner fa-pulse"></i> Завантаження...</div>';
    try {
        const res = await fetch(`https://randomuser.me/api/?page=${page}&results=30&seed=lab10seed&inc=name,email,phone,picture,location,dob,registered,login`);
        if (!res.ok) throw new Error("Помилка API");
        const data = await res.json();
        currentUsers = data.results;
        const countriesSet = new Set(currentUsers.map(u => u.location.country));
        const currentCountry = countryFilter.value;
        countryFilter.innerHTML = '<option value="">Всі країни</option>' + Array.from(countriesSet).map(c => `<option value="${c}">${c}</option>`).join('');
        if (currentCountry && countriesSet.has(currentCountry)) countryFilter.value = currentCountry;
        else countryFilter.value = currentFilters.country = "";
        renderCards(currentUsers);
    } catch (err) {
        friendsGrid.innerHTML = `<div class="error-toast">Помилка завантаження: ${err.message}</div>`;
    } finally {
        isLoading = false;
    }
}

function updateURLAndHistory() {
    const params = new URLSearchParams();
    params.set('page', currentPage);
    if (currentFilters.search) params.set('search', currentFilters.search);
    if (currentFilters.sort !== "name_asc") params.set('sort', currentFilters.sort);
    if (currentFilters.minAge) params.set('minAge', currentFilters.minAge);
    if (currentFilters.maxAge) params.set('maxAge', currentFilters.maxAge);
    if (currentFilters.country) params.set('country', currentFilters.country);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
}

function loadFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    currentPage = parseInt(urlParams.get('page')) || 1;
    currentFilters.search = urlParams.get('search') || "";
    currentFilters.sort = urlParams.get('sort') || "name_asc";
    currentFilters.minAge = urlParams.get('minAge') || "";
    currentFilters.maxAge = urlParams.get('maxAge') || "";
    currentFilters.country = urlParams.get('country') || "";
    searchInput.value = currentFilters.search;
    sortSelect.value = currentFilters.sort;
    minAgeInput.value = currentFilters.minAge;
    maxAgeInput.value = currentFilters.maxAge;
    if (currentFilters.country) setTimeout(() => { if(countryFilter) countryFilter.value = currentFilters.country; }, 100);
}

function updateFromUIAndFetch() {
    currentFilters.search = searchInput.value;
    currentFilters.sort = sortSelect.value;
    let minAge = minAgeInput.value;
    let maxAge = maxAgeInput.value;
    if (minAge !== "") {
        let min = parseInt(minAge);
        if (isNaN(min) || min < 0) minAge = "";
        else minAge = min.toString();
    }
    if (maxAge !== "") {
        let max = parseInt(maxAge);
        if (isNaN(max) || max < 0) maxAge = "";
        else maxAge = max.toString();
    }
    currentFilters.minAge = minAge;
    currentFilters.maxAge = maxAge;
    currentFilters.country = countryFilter.value;
    updateURLAndHistory();
    fetchUsers(currentPage);
}

function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function renderPagination() {
    let pagesHtml = `<button class="page-btn" data-page="${currentPage-1}" ${currentPage<=1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    let start = Math.max(1, currentPage-2);
    let end = Math.min(totalPages, currentPage+2);
    for(let i=start; i<=end; i++) {
        pagesHtml += `<button class="page-btn ${i===currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pagesHtml += `<button class="page-btn" data-page="${currentPage+1}" ${currentPage>=totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    paginationDiv.innerHTML = pagesHtml;
    document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let newPage = parseInt(btn.getAttribute('data-page'));
            if(!isNaN(newPage) && newPage>=1 && newPage<=totalPages && newPage !== currentPage) {
                currentPage = newPage;
                updateURLAndHistory();
                fetchUsers(currentPage).then(() => renderPagination());
            }
        });
    });
}

function setupEventListeners() {
    const debouncedSearch = debounce(() => { currentPage = 1; updateFromUIAndFetch(); }, 350);
    searchInput.addEventListener('input', debouncedSearch);
    sortSelect.addEventListener('change', () => { currentPage = 1; updateFromUIAndFetch(); });
    minAgeInput.addEventListener('input', () => { currentPage = 1; updateFromUIAndFetch(); });
    maxAgeInput.addEventListener('input', () => { currentPage = 1; updateFromUIAndFetch(); });
    countryFilter.addEventListener('change', () => { currentPage = 1; updateFromUIAndFetch(); });
    clearBtn.addEventListener('click', () => {
        searchInput.value = "";
        sortSelect.value = "name_asc";
        minAgeInput.value = "";
        maxAgeInput.value = "";
        countryFilter.value = "";
        currentFilters = { search: "", sort: "name_asc", minAge: "", maxAge: "", country: "" };
        currentPage = 1;
        updateFromUIAndFetch();
    });
}

async function initApp() {
    loadFromURL();
    await fetchUsers(currentPage);
    setupEventListeners();
    renderPagination();
    favorites = JSON.parse(localStorage.getItem("favorites")) || [];
}

window.addEventListener('popstate', () => {
    loadFromURL();
    fetchUsers(currentPage).then(() => renderPagination());
});

document.addEventListener("DOMContentLoaded", () => {
    if (getCurrentUser()) {
        authContainer.style.display = "none";
        appContainer.style.display = "block";
        initApp();
    } else {
        authContainer.style.display = "block";
        appContainer.style.display = "none";
    }
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.querySelectorAll(".toggle-password").forEach(icon => {
        icon.addEventListener("click", function() {
            const target = document.getElementById(this.getAttribute("data-target"));
            if (target.type === "password") {
                target.type = "text";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            } else {
                target.type = "password";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            }
        });
    });
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".form-container").forEach(c => c.classList.remove("active"));
            document.getElementById(btn.getAttribute("data-tab") + "-tab").classList.add("active");
        });
    });
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
});