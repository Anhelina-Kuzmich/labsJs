"use strict";
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const validationMsg = document.getElementById("validationMsg");
const taskList = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const sortSelect = document.getElementById("sortSelect");
const snackbar = document.getElementById("snackbar");
const editModal = document.getElementById("editModal");
const modalOverlay = document.getElementById("modalOverlay");
const editInput = document.getElementById("editInput");
const editValidationMsg = document.getElementById("editValidationMsg");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let state = {
  tasks: [],
  sortBy: "date-added",
  editingId: null,
};

const createTask = (text) => ({
  id: Date.now(),
  text: text.trim(),
  done: false,
  dateAdded: new Date(),
  dateUpdated: new Date(),
});

const addTask = (tasks, task) => [...tasks, task];

const deleteTask = (tasks, id) => tasks.filter((task) => task.id !== id);

const toggleTask = (tasks, id) =>
  tasks.map((task) =>
    task.id === id
      ? { ...task, done: !task.done, dateUpdated: new Date() }
      : task
  );

const updateTask = (tasks, id, newText) =>
  tasks.map((task) =>
    task.id === id
      ? { ...task, text: newText.trim(), dateUpdated: new Date() }
      : task
  );

const sortTasks = (tasks, sortBy) => {
  const copy = [...tasks];

  if (sortBy === "date-added") {
    return copy.sort((a, b) => a.id - b.id);
  }

  if (sortBy === "date-updated") {
    return copy.sort(
      (a, b) => new Date(b.dateUpdated) - new Date(a.dateUpdated)
    );
  }

  if (sortBy === "status") {
    return copy.sort((a, b) => Number(a.done) - Number(b.done));
  }
  return copy;
};

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const validateText = (text) => {
  if (!text || text.trim().length === 0) {
    return "Будь ласка, введіть текст завдання.";
  }
  if (text.trim().length < 2) {
    return "Завдання має містити щонайменше 2 символи.";
  }
  if (text.trim().length > 200) {
    return "Завдання не може бути довшим за 200 символів.";
  }
  return "";
};

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const createTaskElement = (task) => {
  const li = document.createElement("li");
  li.className = "task-item" + (task.done ? " done" : "");
  li.dataset.id = task.id;

  li.innerHTML = `
    <input type="checkbox" ${
      task.done ? "checked" : ""
    } aria-label="Позначити як виконане" />
    <div style="flex:1">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <div class="task-meta">
        Додано: ${formatDate(task.dateAdded)}
        ${
          task.dateAdded.toString() !== task.dateUpdated.toString()
            ? ` · Оновлено: ${formatDate(task.dateUpdated)}`
            : ""
        }
      </div>
    </div>
    <div class="task-actions">
      <button class="btn-edit" aria-label="Редагувати">✏️ Ред.</button>
      <button class="btn-delete" aria-label="Видалити">🗑 Вид.</button>
    </div>
  `;

  return li;
};

const render = () => {
  const sorted = sortTasks(state.tasks, state.sortBy);

  taskList.innerHTML = "";

  if (sorted.length === 0) {
    emptyMsg.classList.add("visible");
  } else {
    emptyMsg.classList.remove("visible");
    sorted.forEach((task) => {
      taskList.appendChild(createTaskElement(task));
    });
  }
};

let snackbarTimer = null;

const showSnackbar = (message) => {
  snackbar.textContent = message;
  snackbar.classList.add("show");

  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
};

const openModal = (taskId, currentText) => {
  state.editingId = taskId;

  editInput.value = currentText;
  editValidationMsg.textContent = "";
  editInput.classList.remove("invalid");

  editModal.classList.add("active");
  modalOverlay.classList.add("active");
  editInput.focus();
};

const closeModal = () => {
  state.editingId = null;

  editModal.classList.remove("active");
  modalOverlay.classList.remove("active");
};

const handleAddTask = (event) => {
  event.preventDefault();

  const text = taskInput.value;
  const error = validateText(text);

  if (error) {
    validationMsg.textContent = error;
    taskInput.classList.add("invalid");
    return;
  }

  validationMsg.textContent = "";
  taskInput.classList.remove("invalid");

  const newTask = createTask(text);
  state = { ...state, tasks: addTask(state.tasks, newTask) };

  taskInput.value = "";
  render();
  showSnackbar("Завдання додано!");
};

const handleListClick = (event) => {
  const li = event.target.closest(".task-item");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (event.target.matches("input[type='checkbox']")) {
    state = { ...state, tasks: toggleTask(state.tasks, id) };
    render();
    const task = state.tasks.find((t) => t.id === id);
    showSnackbar(task.done ? "Завдання виконано!" : "Завдання відновлено.");
    return;
  }

  if (event.target.matches(".btn-edit")) {
    const task = state.tasks.find((t) => t.id === id);
    openModal(id, task.text);
    return;
  }

  if (event.target.matches(".btn-delete")) {
    li.classList.add("removing");
    li.addEventListener(
      "animationend",
      () => {
        state = { ...state, tasks: deleteTask(state.tasks, id) };
        render();
        showSnackbar("🗑 Завдання видалено.");
      },
      { once: true }
    );
    return;
  }

  if (event.target.matches(".task-text")) {
    state = { ...state, tasks: toggleTask(state.tasks, id) };
    render();
  }
};

const handleSaveEdit = () => {
  const newText = editInput.value;
  const error = validateText(newText);

  if (error) {
    editValidationMsg.textContent = error;
    editInput.classList.add("invalid");
    return;
  }

  editValidationMsg.textContent = "";
  editInput.classList.remove("invalid");

  state = {
    ...state,
    tasks: updateTask(state.tasks, state.editingId, newText),
  };
  closeModal();
  render();
  showSnackbar("Завдання оновлено!");
};

const handleSortChange = (event) => {
  state = { ...state, sortBy: event.target.value };
  render();
};

const handleTaskInputChange = () => {
  validationMsg.textContent = "";
  taskInput.classList.remove("invalid");
};

const handleEditKeydown = (event) => {
  if (event.key === "Enter") handleSaveEdit();
  if (event.key === "Escape") closeModal();
};

const init = () => {
  taskForm.addEventListener("submit", handleAddTask);
  taskList.addEventListener("click", handleListClick);
  saveEditBtn.addEventListener("click", handleSaveEdit);
  cancelEditBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  editInput.addEventListener("keydown", handleEditKeydown);
  sortSelect.addEventListener("change", handleSortChange);
  taskInput.addEventListener("input", handleTaskInputChange);

  render();
};

document.addEventListener("DOMContentLoaded", init);
