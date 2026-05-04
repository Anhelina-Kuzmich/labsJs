'use strict';

const gridContainer = document.getElementById('cardsGrid');
const editButton = document.getElementById('editBtn');

let cardsData = [
  { title: "JavaScript", tags: ["веб", "скрипти"] },
  { title: "Python", tags: ["дані", "AI"] },
  { title: "Java", tags: ["бекенд", "ентерпрайз"] },
  { title: "TypeScript", tags: ["типізований JS"] },
  { title: "Rust", tags: ["системи", "швидкість"] },
  { title: "Go", tags: ["хмара", "мікросервіси"] },
  { title: "Kotlin", tags: ["Android", "JVM"] },
  { title: "Swift", tags: ["iOS", "macOS"] },
  { title: "C++", tags: ["ігри", "системи"] },
  { title: "PHP", tags: ["веб", "сервер"] }
];

let isEditMode = false;
let draggedCardIndex = null;
function createCardElement(card, index) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.setAttribute('data-index', index);
  cardDiv.setAttribute('draggable', isEditMode ? 'true' : 'false');

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = card.title;

  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'card-tags';
  card.tags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.textContent = tag;
    tagsContainer.appendChild(tagSpan);
  });

  cardDiv.appendChild(title);
  cardDiv.appendChild(tagsContainer);

  if (isEditMode) {
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.className = 'delete-btn';
    delBtn.setAttribute('data-index', index);
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCardByIndex(index);
    });
    cardDiv.appendChild(delBtn);
  }

  return cardDiv;
}

function renderGrid() {
  gridContainer.innerHTML = '';
  cardsData.forEach((card, idx) => {
    const cardElement = createCardElement(card, idx);
    gridContainer.appendChild(cardElement);
  });

  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    if (isEditMode) {
      card.setAttribute('draggable', 'true');
    } else {
      card.setAttribute('draggable', 'false');
    }
  });

  if (isEditMode) {
    gridContainer.classList.add('edit-mode');
  } else {
    gridContainer.classList.remove('edit-mode');
  }
}

function deleteCardByIndex(indexToDelete) {
  if (indexToDelete < 0 || indexToDelete >= cardsData.length) return;
  const newCards = [...cardsData];
  newCards.splice(indexToDelete, 1);
  cardsData = newCards;
  renderGrid();
  draggedCardIndex = null;
}

function moveCard(oldIndex, newIndex) {
  if (oldIndex === newIndex) return;
  if (oldIndex < 0 || newIndex < 0) return;
  if (oldIndex >= cardsData.length || newIndex >= cardsData.length) return;
  const newCards = [...cardsData];
  const [movedCard] = newCards.splice(oldIndex, 1);
  newCards.splice(newIndex, 0, movedCard);
  cardsData = newCards;
  renderGrid();
}

function handleDragStart(e) {
  if (!isEditMode) {
    e.preventDefault();
    return false;
  }
  const card = e.target.closest('.card');
  if (!card) return;
  
  draggedCardIndex = parseInt(card.getAttribute('data-index'), 10);
  e.dataTransfer.setData('text/plain', draggedCardIndex);
  e.dataTransfer.effectAllowed = 'move';
  const cloneCard = card.cloneNode(true);
  cloneCard.style.position = 'absolute';
  cloneCard.style.top = '-1000px';
  cloneCard.style.opacity = '0.6';
  cloneCard.style.width = card.offsetWidth + 'px';
  document.body.appendChild(cloneCard);
  e.dataTransfer.setDragImage(cloneCard, 20, 20);
  setTimeout(() => document.body.removeChild(cloneCard), 0);
  
  card.classList.add('dragging');
}

function handleDragOver(e) {
  if (!isEditMode) {
    e.preventDefault();
    return false;
  }
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const targetCard = e.target.closest('.card');
  if (!targetCard) return;
}

function handleDrop(e) {
  if (!isEditMode) {
    e.preventDefault();
    return false;
  }
  e.preventDefault();
  const targetCard = e.target.closest('.card');
  if (!targetCard) return;
  
  const targetIndex = parseInt(targetCard.getAttribute('data-index'), 10);
  if (draggedCardIndex !== null && draggedCardIndex !== targetIndex) {
    moveCard(draggedCardIndex, targetIndex);
  }
  if (draggedCardIndex !== null) {
    const draggingCard = document.querySelector(`.card[data-index="${draggedCardIndex}"]`);
    if (draggingCard) draggingCard.classList.remove('dragging');
    draggedCardIndex = null;
  }
}

function handleDragEnd(e) {
  if (draggedCardIndex !== null) {
    const card = document.querySelector(`.card[data-index="${draggedCardIndex}"]`);
    if (card) card.classList.remove('dragging');
    draggedCardIndex = null;
  }
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  if (isEditMode) {
    editButton.textContent = 'Готово';
  } else {
    editButton.textContent = 'Редагувати';
  }
  renderGrid();
  attachDragEvents();
}

function attachDragEvents() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.removeEventListener('dragstart', handleDragStart);
    card.removeEventListener('dragend', handleDragEnd);
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });
}

function bindGlobalDragEvents() {
  gridContainer.addEventListener('dragover', handleDragOver);
  gridContainer.addEventListener('drop', handleDrop);
}

function init() {
  renderGrid();
  bindGlobalDragEvents();
  attachDragEvents();
  editButton.addEventListener('click', toggleEditMode);
}

document.addEventListener('DOMContentLoaded', init);