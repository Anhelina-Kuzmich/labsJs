'use strict';

const boardContainer = document.getElementById('board');

const initialTasks = {
  todo: [
    { id: 'task1', text: 'Зробити дизайн Kanban' },
    { id: 'task2', text: 'Налаштувати Drag & Drop' },
    { id: 'task3', text: 'Додати placeholder' }
  ],
  working: [
    { id: 'task4', text: 'Перевірити анімацію' },
    { id: 'task5', text: 'Написати документацію' }
  ],
  done: [
    { id: 'task6', text: 'Створити структуру HTML' },
    { id: 'task7', text: 'Підготувати CSS' }
  ]
};

function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.setAttribute('data-id', task.id);
  card.setAttribute('draggable', 'true');

  const handle = document.createElement('span');
  handle.className = 'drag-handle';
  handle.innerHTML = '☰';
  handle.setAttribute('aria-label', 'Перетягнути');
  
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.innerText = task.text;
  
  card.appendChild(handle);
  card.appendChild(textSpan);
  
  return card;
}

function createColumn(status, title, tasksArray) {
  const column = document.createElement('div');
  column.className = 'column';
  column.setAttribute('data-status', status);
  
  const header = document.createElement('div');
  header.className = 'column-header';
  header.innerText = title;
  
  const taskList = document.createElement('div');
  taskList.className = 'task-list';
  taskList.setAttribute('data-status', status);
  
  tasksArray.forEach(task => {
    taskList.appendChild(createTaskCardElement(task));
  });
  
  column.appendChild(header);
  column.appendChild(taskList);
  return column;
}

function getColumnStatusFromElement(element) {
  if (!element) return null;
  if (element.classList.contains('task-list')) {
    return element.getAttribute('data-status');
  }
  const parentList = element.closest('.task-list');
  return parentList ? parentList.getAttribute('data-status') : null;
}

function getTaskListFromElement(element) {
  return element.closest('.task-list');
}

let draggedItem = null;

function handleDragStart(e) {
  const card = e.target.closest('.task-card');
  if (!card) {
    e.preventDefault();
    return false;
  }
  draggedItem = card;
  e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
  e.dataTransfer.effectAllowed = 'move';
  
  const clone = card.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.top = '-1000px';
  clone.style.opacity = '0.5';
  clone.style.width = card.offsetWidth + 'px';
  document.body.appendChild(clone);
  e.dataTransfer.setDragImage(clone, 10, 10);
  setTimeout(() => document.body.removeChild(clone), 0);
  
  card.classList.add('dragging');
}

function handleDragEnd(e) {
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
  }
  document.querySelectorAll('.task-list').forEach(list => {
    list.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const targetList = getTaskListFromElement(e.target);
  if (targetList) {
    document.querySelectorAll('.task-list').forEach(list => list.classList.remove('drag-over'));
    targetList.classList.add('drag-over');
  }
}

function handleDrop(e) {
  e.preventDefault();
  const targetList = getTaskListFromElement(e.target);
  if (!targetList) return;
  
  document.querySelectorAll('.task-list').forEach(list => list.classList.remove('drag-over'));
  
  if (!draggedItem) return;
  
  const sourceList = draggedItem.parentNode;
  const targetStatus = targetList.getAttribute('data-status');
  
  if (sourceList === targetList) {
    return;
  }
  
  targetList.appendChild(draggedItem);
  
  draggedItem.classList.remove('dragging');
  draggedItem = null;
}

function renderBoard() {
  boardContainer.innerHTML = '';
  
  const todoCol = createColumn('todo', 'To do', initialTasks.todo);
  const workingCol = createColumn('working', 'Working', initialTasks.working);
  const doneCol = createColumn('done', 'Done', initialTasks.done);
  
  boardContainer.appendChild(todoCol);
  boardContainer.appendChild(workingCol);
  boardContainer.appendChild(doneCol);
  
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
  });
  
  document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('drop', handleDrop);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
});