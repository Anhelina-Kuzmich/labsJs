'use strict';
const elTotalCount = document.getElementById("total-count");
const elTotalPrice = document.getElementById("total-price");
const elFilterButtons = document.getElementById("filter-buttons");
const elSortButtons = document.querySelector(".sort-buttons");
const elProductList = document.getElementById("product-list");
const elEmptyState = document.getElementById("empty-state");
const elAddBtn = document.getElementById("add-btn");
const elModalOverlay = document.getElementById("modal-overlay");
const elModalClose = document.getElementById("modal-close");
const elModalCancel = document.getElementById("modal-cancel");
const elModalTitle = document.getElementById("modal-title");
const elProductForm = document.getElementById("product-form");
const elEditId = document.getElementById("edit-id");
const elFieldName = document.getElementById("field-name");
const elFieldPrice = document.getElementById("field-price");
const elFieldCategory = document.getElementById("field-category");
const elFieldImage = document.getElementById("field-image");
const elErrName = document.getElementById("err-name");
const elErrPrice = document.getElementById("err-price");
const elErrCategory = document.getElementById("err-category");
const elErrImage = document.getElementById("err-image");
const elSnackContainer = document.getElementById("snackbar-container");
const imagePath = "img/";
const INITIAL_PRODUCTS = [
  {
    id: "p-001",
    name: "Фен рожевий",
    price: 2000,
    category: "Електроніка",
    image: imagePath + "hairdryer.jpg",
    createdAt: new Date("2024-01-10").getTime(),
    updatedAt: new Date("2024-01-10").getTime(),
  },
  {
    id: "p-002",
    name: "Футболка зелена",
    price: 450,
    category: "Одяг",
    image: imagePath + "t-shirt.jpg",
    createdAt: new Date("2024-02-14").getTime(),
    updatedAt: new Date("2024-03-01").getTime(),
  },
  {
    id: "p-003",
    name: "Послухай мене",
    price: 650,
    category: "Книги",
    image: imagePath + "book.jpeg",
    createdAt: new Date("2024-02-20").getTime(),
    updatedAt: new Date("2024-02-20").getTime(),
  },
  {
    id: "p-004",
    name: "Крісло",
    price: 4300,
    category: "Меблі",
    image: imagePath + "chair.jpeg",
    createdAt: new Date("2024-03-05").getTime(),
    updatedAt: new Date("2024-04-10").getTime(),
  },
  {
    id: "p-005",
    name: "Ракетка",
    price: 3200,
    category: "Спорт",
    image: imagePath + "bat.jpeg",
    createdAt: new Date("2024-03-22").getTime(),
    updatedAt: new Date("2024-03-22").getTime(),
  },
];

let appState = {
  products: [...INITIAL_PRODUCTS],
  filterCategory: null,
  sortKey: null,
  nextId: 6,
};

const makeId = (n) => "p-" + String(n).padStart(3, "0");

const getCategories = (products) =>
  [...new Set(products.map((p) => p.category))].sort();

const filterProducts = (products, category) =>
  category ? products.filter((p) => p.category == category) : products;

const sortProducts = (products, key) => {
  if (!key) return products;
  const comparators = {
    price: (a, b) => a.price - b.price,
    created: (a, b) => a.createdAt - b.createdAt,
    updated: (a, b) => a.updatedAt - b.updatedAt,
  };
  return [...products].sort(comparators[key]);
};

const calcTotalPrice = (products) =>
  products.reduce((sum, p) => sum + p.price, 0);

const formatPrice = (n) =>
  n.toLocaleString("uk-UA", {
    style: "currency",
    currency: "UAH",
    minimumFractionDigits: 0,
  });

const getVisibleProducts = (state) =>
  sortProducts(
    filterProducts(state.products, state.filterCategory),
    state.sortKey
  );

const updateProductInList = (products, updated) =>
  products.map((p) => (p.id == updated.id ? updated : p));

const removeProductFromList = (products, id) =>
  products.filter((p) => p.id != id);

const addProductToList = (products, product) => [...products, product];

const validateField = (name, value) => {
  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Мінімум 2 символи"),
    price: (v) => (parseFloat(v) > 0 ? "" : "Ціна повинна бути більше 0"),
    category: (v) => (v != "" ? "" : "Оберіть категорію"),
    image: (v) => (v.trim().length > 0 ? "" : "Вкажіть шлях до зображення"),
  };
  return rules[name] ? rules[name](value) : "";
};

const validateForm = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, validateField(k, v)])
  );

const isFormValid = (errors) => Object.values(errors).every((e) => e == "");

const escapeHtml = (str) => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(str).replace(/[&<>"']/g, (c) => map[c]);
};

const renderStats = (state) => {
  elTotalCount.textContent = state.products.length;
  elTotalPrice.textContent = formatPrice(calcTotalPrice(state.products));
};

const renderFilterButtons = (state) => {
  const categories = getCategories(state.products);

  elFilterButtons.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className =
    "filter-btn" + (state.filterCategory == null ? " active" : "");
  allBtn.textContent = "Всі";
  allBtn.dataset.cat = "";
  allBtn.type = "button";
  elFilterButtons.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "filter-btn" + (state.filterCategory == cat ? " active" : "");
    btn.textContent = cat;
    btn.dataset.cat = cat;
    btn.type = "button";
    elFilterButtons.appendChild(btn);
  });
};

const renderSortButtons = (state) => {
  elSortButtons.querySelectorAll(".sort-btn[data-sort]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.sort == state.sortKey);
  });
};

const createCardElement = (product) => {
  const li = document.createElement("li");
  li.className = "product-card";
  li.dataset.id = product.id;

  li.innerHTML =
    '<div class="card-image-wrap">' +
    '<img src="' +
    escapeHtml(product.image) +
    '" alt="' +
    escapeHtml(product.name) +
    '" loading="lazy" />' +
    '<span class="card-category-badge">' +
    escapeHtml(product.category) +
    "</span>" +
    "</div>" +
    '<div class="card-body">' +
    '<span class="card-id">#' +
    escapeHtml(product.id) +
    "</span>" +
    '<h3 class="card-name">' +
    escapeHtml(product.name) +
    "</h3>" +
    '<span class="card-price">' +
    formatPrice(product.price) +
    "</span>" +
    "</div>" +
    '<div class="card-actions">' +
    '<button class="card-btn card-btn-edit"   data-id="' +
    product.id +
    '" data-action="edit"   type="button" aria-label="Редагувати ' +
    escapeHtml(product.name) +
    '">Редагувати</button>' +
    '<button class="card-btn card-btn-delete" data-id="' +
    product.id +
    '" data-action="delete" type="button" aria-label="Видалити ' +
    escapeHtml(product.name) +
    '">✕ Видалити</button>' +
    "</div>";

  return li;
};

const renderProductList = (state) => {
  const visible = getVisibleProducts(state);

  elProductList.innerHTML = "";

  if (visible.length == 0) {
    elEmptyState.hidden = false;
  } else {
    elEmptyState.hidden = true;
    visible.forEach((p) => elProductList.appendChild(createCardElement(p)));
  }
};

const render = (state) => {
  renderStats(state);
  renderFilterButtons(state);
  renderSortButtons(state);
  renderProductList(state);
};

const showSnackbar = (message, type) => {
  if (!type) type = "success";

  const el = document.createElement("div");
  el.className = "snackbar snackbar--" + type;
  el.innerHTML =
    '<span class="snack-dot"></span><span>' + escapeHtml(message) + "</span>";
  elSnackContainer.appendChild(el);

  setTimeout(() => {
    el.classList.add("snack-out");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  }, 3500);
};

const clearFormErrors = () => {
  elErrName.textContent = "";
  elErrPrice.textContent = "";
  elErrCategory.textContent = "";
  elErrImage.textContent = "";
};

const showFormErrors = (errors) => {
  elErrName.textContent = errors.name || "";
  elErrPrice.textContent = errors.price || "";
  elErrCategory.textContent = errors.category || "";
  elErrImage.textContent = errors.image || "";
};

const openModal = (title, data) => {
  if (!data) data = {};
  elModalTitle.textContent = title;
  elEditId.value = data.id || "";
  elFieldName.value = data.name || "";
  elFieldPrice.value = data.price || "";
  elFieldCategory.value = data.category || "";
  elFieldImage.value = data.image || "";
  clearFormErrors();
  elModalOverlay.hidden = false;
  elFieldName.focus();
};

const closeModal = () => {
  elModalOverlay.hidden = true;
  elProductForm.reset();
  clearFormErrors();
};

const readFormData = () => ({
  name: elFieldName.value,
  price: elFieldPrice.value,
  category: elFieldCategory.value,
  image: elFieldImage.value,
});

const handleAddClick = () => openModal("Новий товар");

const handleModalClose = () => closeModal();
const handleOverlayClick = (e) => {
  if (e.target == elModalOverlay) closeModal();
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const data = readFormData();
  const errors = validateForm(data);

  if (!isFormValid(errors)) {
    showFormErrors(errors);
    return;
  }

  const editId = elEditId.value;

  if (editId) {
    const existing = appState.products.find((p) => p.id == editId);
    const updated = {
      ...existing,
      name: data.name.trim(),
      price: parseFloat(data.price),
      category: data.category,
      image: data.image.trim(),
      updatedAt: Date.now(),
    };
    appState = {
      ...appState,
      products: updateProductInList(appState.products, updated),
    };
    showSnackbar(
      "✔ Оновлено: #" + updated.id + " «" + updated.name + "»",
      "info"
    );
  } else {
    const newProduct = {
      id: makeId(appState.nextId),
      name: data.name.trim(),
      price: parseFloat(data.price),
      category: data.category,
      image: data.image.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    appState = {
      ...appState,
      products: addProductToList(appState.products, newProduct),
      nextId: appState.nextId + 1,
    };
    showSnackbar("Товар «" + newProduct.name + "» додано", "success");
  }

  closeModal();
  render(appState);
};

const handleListClick = (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action == "delete") {
    const card = elProductList.querySelector('[data-id="' + id + '"]');
    const name = (appState.products.find((p) => p.id == id) || {}).name || id;

    if (card) {
      card.classList.add("removing");
      card.addEventListener(
        "animationend",
        () => {
          appState = {
            ...appState,
            products: removeProductFromList(appState.products, id),
          };
          render(appState);
          showSnackbar("Товар «" + name + "» видалено", "error");
        },
        { once: true }
      );
    }
  }

  if (action == "edit") {
    const product = appState.products.find((p) => p.id == id);
    if (product) openModal("Редагувати товар", product);
  }
};

const handleFilterClick = (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  const cat = btn.dataset.cat || null;
  appState = { ...appState, filterCategory: cat };
  render(appState);
};

const handleSortClick = (e) => {
  const btn = e.target.closest(".sort-btn[data-sort]");
  if (!btn) return;
  const key = btn.dataset.sort == "reset" ? null : btn.dataset.sort;
  appState = { ...appState, sortKey: key };
  render(appState);
};

const handleKeydown = (e) => {
  if (e.key == "Escape" && !elModalOverlay.hidden) closeModal();
};

const initEvents = () => {
  elAddBtn.addEventListener("click", handleAddClick);
  elModalClose.addEventListener("click", handleModalClose);
  elModalCancel.addEventListener("click", handleModalClose);
  elModalOverlay.addEventListener("click", handleOverlayClick);
  elProductForm.addEventListener("submit", handleFormSubmit);
  elProductList.addEventListener("click", handleListClick);
  elFilterButtons.addEventListener("click", handleFilterClick);
  elSortButtons.addEventListener("click", handleSortClick);
  document.addEventListener("keydown", handleKeydown);
};

const init = () => {
  render(appState);
  initEvents();
};

document.addEventListener("DOMContentLoaded", init);



