let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const itemsPerPage = 12;
let currentSort = 'name_asc';
let favorites = new Set();
let authUser = null;

const authContainer = document.getElementById('authContainer');
const mainApp = document.getElementById('mainApp');
const cardsContainer = document.getElementById('cardsContainer');
const searchInput = document.getElementById('searchName');
const filterLocation = document.getElementById('filterLocation');
const filterEmail = document.getElementById('filterEmail');
const ageMin = document.getElementById('ageMin');
const ageMax = document.getElementById('ageMax');
const yearMin = document.getElementById('yearMin');
const yearMax = document.getElementById('yearMax');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetFiltersBtn');
const paginationControls = document.getElementById('paginationControls');
const paginationBottom = document.getElementById('paginationBottom');
const statsInfo = document.getElementById('statsInfo');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorToast = document.getElementById('errorToast');
const currentUserDisplay = document.getElementById('currentUserDisplay');

function showError(message) {
    errorToast.textContent = message;
    errorToast.classList.remove('hidden');
    setTimeout(() => errorToast.classList.add('hidden'), 3500);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function validateYearInput(inputEl) {
    let value = parseInt(inputEl.value);
    const currentYear = new Date().getFullYear();
    if (isNaN(value)) return '';
    if (value < 1900) value = 1900;
    if (value > currentYear) value = currentYear;
    inputEl.value = value;
    return value;
}

function validateAgeInput(inputEl) {
    let value = parseInt(inputEl.value);
    if (isNaN(value)) return '';
    if (value < 18) value = 18;
    if (value > 120) value = 120;
    inputEl.value = value;
    return value;
}

[yearMin, yearMax].forEach(inp => {
    if (inp) {
        inp.addEventListener('blur', () => validateYearInput(inp));
        inp.addEventListener('input', function() {
            let v = parseInt(this.value);
            if (!isNaN(v) && (v < 1900 || v > new Date().getFullYear())) {
                this.style.borderColor = '#f87171';
            } else { this.style.borderColor = '#2c4c5e'; }
        });
    }
});
[ageMin, ageMax].forEach(inp => {
    if (inp) inp.addEventListener('blur', () => validateAgeInput(inp));
});

async function fetchUsers() {
    loadingIndicator.classList.remove('hidden');
    try {
        const response = await fetch('https://randomuser.me/api/?results=200&inc=gender,name,location,email,phone,cell,picture,dob,registered,login,id&nat=us,fr,gb,ua');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        allUsers = data.results.map(user => {
            const age = user.dob.age;
            const birthYear = new Date(user.dob.date).getFullYear();
            const registeredDate = new Date(user.registered.date);
            return { ...user, age, birthYear, registeredDate };
        });
        applyFiltersAndSort();
    } catch (err) {
        showError('Помилка завантаження даних. Спробуйте пізніше.');
        console.error(err);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

function filterUsers(users, filters) {
    return users.filter(user => {
        const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
        if (filters.search && !fullName.includes(filters.search.toLowerCase())) return false;
        const locationStr = `${user.location.city}, ${user.location.country}`.toLowerCase();
        if (filters.location && !locationStr.includes(filters.location.toLowerCase())) return false;
        if (filters.email && !user.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
        if (filters.ageMin !== '' && user.age < parseInt(filters.ageMin)) return false;
        if (filters.ageMax !== '' && user.age > parseInt(filters.ageMax)) return false;
        if (filters.yearMin !== '' && user.birthYear < parseInt(filters.yearMin)) return false;
        if (filters.yearMax !== '' && user.birthYear > parseInt(filters.yearMax)) return false;
        return true;
    });
}

function sortUsers(users, sortKey) {
    const sorted = [...users];
    switch (sortKey) {
        case 'name_asc': sorted.sort((a,b) => (a.name.first+' '+a.name.last).localeCompare(b.name.first+' '+b.name.last)); break;
        case 'name_desc': sorted.sort((a,b) => (b.name.first+' '+b.name.last).localeCompare(a.name.first+' '+a.name.last)); break;
        case 'age_asc': sorted.sort((a,b) => a.age - b.age); break;
        case 'age_desc': sorted.sort((a,b) => b.age - a.age); break;
        case 'registered_asc': sorted.sort((a,b) => b.registeredDate - a.registeredDate); break;
        case 'registered_desc': sorted.sort((a,b) => a.registeredDate - b.registeredDate); break;
        default: return sorted;
    }
    return sorted;
}

function getFilters() {
    let ageMinVal = ageMin.value ? parseInt(ageMin.value) : '';
    let ageMaxVal = ageMax.value ? parseInt(ageMax.value) : '';
    let yearMinVal = yearMin.value ? parseInt(yearMin.value) : '';
    let yearMaxVal = yearMax.value ? parseInt(yearMax.value) : '';
    if (ageMinVal !== '' && (ageMinVal < 18 || ageMinVal > 120)) ageMinVal = 18;
    if (ageMaxVal !== '' && (ageMaxVal < 18 || ageMaxVal > 120)) ageMaxVal = 120;
    const currentYear = new Date().getFullYear();
    if (yearMinVal !== '' && (yearMinVal < 1900 || yearMinVal > currentYear)) yearMinVal = 1900;
    if (yearMaxVal !== '' && (yearMaxVal < 1900 || yearMaxVal > currentYear)) yearMaxVal = currentYear;
    return {
        search: searchInput.value,
        location: filterLocation.value,
        email: filterEmail.value,
        ageMin: ageMinVal,
        ageMax: ageMaxVal,
        yearMin: yearMinVal,
        yearMax: yearMaxVal,
    };
}

function updateURL() {
    const filters = getFilters();
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (currentSort !== 'name_asc') params.set('sort', currentSort);
    if (filters.search) params.set('search', filters.search);
    if (filters.location) params.set('loc', filters.location);
    if (filters.email) params.set('email', filters.email);
    if (filters.ageMin) params.set('ageMin', filters.ageMin);
    if (filters.ageMax) params.set('ageMax', filters.ageMax);
    if (filters.yearMin) params.set('yearMin', filters.yearMin);
    if (filters.yearMax) params.set('yearMax', filters.yearMax);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ page: currentPage, sort: currentSort, filters }, '', newUrl);
}

function applyFiltersAndSort() {
    if (!allUsers.length) return;
    const filters = getFilters();
    let filtered = filterUsers(allUsers, filters);
    filtered = sortUsers(filtered, currentSort);
    filteredUsers = filtered;
    renderPagination();
    renderCurrentPage();
    updateStats();
    updateURL();
}

function renderCurrentPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageUsers = filteredUsers.slice(start, end);
    renderCards(pageUsers);
}

function renderCards(users) {
    if (!users.length) {
        cardsContainer.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem;">😢 Друзів не знайдено за критеріями</div>`;
        return;
    }
    const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%2314b8a6'/%3E%3Ctext x='50' y='67' font-size='50' text-anchor='middle' fill='white'%3E📷%3C/text%3E%3C/svg%3E";
    cardsContainer.innerHTML = users.map(user => {
        const fullName = `${user.name.first} ${user.name.last}`;
        const locationStr = `${user.location?.city || '?'}, ${user.location?.country || '?'}`;
        const isFav = favorites.has(user.login.uuid);
        const avatarUrl = user.picture?.large || '';
        return `
            <div class="user-card" data-id="${user.login.uuid}">
                <div class="card-header">
                    <img class="user-avatar" src="${avatarUrl}" alt="${fullName}" 
                         onerror="this.onerror=null; this.src='${fallbackImg}';">
                    <button class="fav-btn ${isFav ? 'favorited' : ''}" data-uuid="${user.login.uuid}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="user-name">${escapeHtml(fullName)}</div>
                    <div class="user-age">${user.age ?? '?'} років</div>
                    <div class="user-detail"><i class="fas fa-phone"></i> ${user.phone || '—'}</div>
                    <div class="user-detail"><i class="fas fa-envelope"></i> ${user.email || '—'}</div>
                    <div class="user-detail"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(locationStr)}</div>
                    <div class="user-detail"><i class="fas fa-calendar-alt"></i> Рік народж.: ${user.birthYear ?? '—'}</div>
                </div>
            </div>
        `;
    }).join('');
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const uuid = btn.dataset.uuid;
            toggleFavorite(uuid);
        });
    });
}

function toggleFavorite(uuid) {
    if (favorites.has(uuid)) favorites.delete(uuid);
    else favorites.add(uuid);
    localStorage.setItem(`favorites_${authUser}`, JSON.stringify([...favorites]));
    renderCurrentPage();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        paginationBottom.innerHTML = '';
        return;
    }
    const createButtons = (container) => {
        let html = '';
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${currentPage === i ? 'active-page' : ''}" data-page="${i}">${i}</button>`;
        }
        container.innerHTML = html;
        container.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderCurrentPage();
                renderPagination();
                updateURL();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                addUIFeedback(btn);
            });
        });
    };
    createButtons(paginationControls);
    createButtons(paginationBottom);
}

function addUIFeedback(element) {
    if (!element) return;
    element.style.transform = 'scale(0.96)';
    setTimeout(() => { if(element) element.style.transform = ''; }, 150);
}

function updateStats() {
    statsInfo.innerHTML = `<i class="fas fa-users"></i> Показано ${filteredUsers.length} з ${allUsers.length} друзів | Сторінка ${currentPage}`;
}

let isLoadingMore = false;
function handleScroll() {
    if (filteredUsers.length === 0) return;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (currentPage >= totalPages) return;
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 300;
    if (scrollPosition >= threshold && !isLoadingMore) {
        isLoadingMore = true;
        currentPage++;
        renderCurrentPage();
        renderPagination();
        updateURL();
        setTimeout(() => { isLoadingMore = false; }, 300);
    }
}

// ========== DEBOUNCE exactly as in pizza search example ==========
function debounce(callee, timeoutMs) {
    return function perform(...args) {
        let previousCall = this.lastCall;
        this.lastCall = Date.now();
        if (previousCall && ((this.lastCall - previousCall) <= timeoutMs)) {
            clearTimeout(this.lastCallTimer);
        }
        this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
}
// =================================================================

function handleSearchInput(e) {
    currentPage = 1;
    applyFiltersAndSort();
    addUIFeedback(searchInput);
}
const debouncedSearch = debounce(handleSearchInput, 250);
searchInput.addEventListener('input', debouncedSearch);

function syncFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('page')) currentPage = parseInt(params.get('page')) || 1;
    if (params.has('sort')) currentSort = params.get('sort');
    sortSelect.value = currentSort;
    if (params.has('search')) searchInput.value = params.get('search');
    if (params.has('loc')) filterLocation.value = params.get('loc');
    if (params.has('email')) filterEmail.value = params.get('email');
    if (params.has('ageMin')) ageMin.value = params.get('ageMin');
    if (params.has('ageMax')) ageMax.value = params.get('ageMax');
    if (params.has('yearMin')) yearMin.value = params.get('yearMin');
    if (params.has('yearMax')) yearMax.value = params.get('yearMax');
    applyFiltersAndSort();
}

function triggerSortEffect() {
    sortSelect.classList.add('sort-effect');
    setTimeout(() => sortSelect.classList.remove('sort-effect'), 300);
}

filterLocation.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(filterLocation); });
filterEmail.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(filterEmail); });
ageMin.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(ageMin); });
ageMax.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(ageMax); });
yearMin.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(yearMin); });
yearMax.addEventListener('input', () => { currentPage = 1; applyFiltersAndSort(); addUIFeedback(yearMax); });
sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; currentPage = 1; applyFiltersAndSort(); triggerSortEffect(); });
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    filterLocation.value = '';
    filterEmail.value = '';
    ageMin.value = '';
    ageMax.value = '';
    yearMin.value = '';
    yearMax.value = '';
    currentSort = 'name_asc';
    sortSelect.value = 'name_asc';
    currentPage = 1;
    applyFiltersAndSort();
    addUIFeedback(resetBtn);
});

window.addEventListener('popstate', (e) => {
    if (e.state) {
        currentPage = e.state.page || 1;
        currentSort = e.state.sort || 'name_asc';
        sortSelect.value = currentSort;
        syncFromURL();
    } else {
        syncFromURL();
    }
});
window.addEventListener('scroll', handleScroll);

function loadFavorites() {
    const stored = localStorage.getItem(`favorites_${authUser}`);
    if (stored) favorites = new Set(JSON.parse(stored));
    else favorites = new Set();
}

function initAuth() {
    const storedUser = localStorage.getItem('friendfinder_user');
    if (storedUser) {
        authUser = storedUser;
        authContainer.classList.add('hidden');
        mainApp.classList.remove('hidden');
        currentUserDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${authUser}`;
        loadFavorites();
        fetchUsers();
    } else {
        authContainer.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.getElementById('loginForm').classList.toggle('active', tab === 'login');
        document.getElementById('registerForm').classList.toggle('active', tab === 'register');
        addUIFeedback(btn);
    });
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const username = document.getElementById('loginUsername').value.trim();
    if (!username) { showError('Введіть ім\'я'); return; }
    localStorage.setItem('friendfinder_user', username);
    authUser = username;
    authContainer.classList.add('hidden');
    mainApp.classList.remove('hidden');
    currentUserDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${authUser}`;
    loadFavorites();
    fetchUsers();
    addUIFeedback(document.getElementById('loginBtn'));
});
document.getElementById('registerBtn').addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    if (!username) { showError('Введіть ім\'я'); return; }
    localStorage.setItem('friendfinder_user', username);
    authUser = username;
    authContainer.classList.add('hidden');
    mainApp.classList.remove('hidden');
    currentUserDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${authUser}`;
    loadFavorites();
    fetchUsers();
    addUIFeedback(document.getElementById('registerBtn'));
});
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('friendfinder_user');
    authUser = null;
    authContainer.classList.remove('hidden');
    mainApp.classList.add('hidden');
    allUsers = [];
    filteredUsers = [];
    favorites.clear();
    addUIFeedback(document.getElementById('logoutBtn'));
});

initAuth();