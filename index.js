const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document.querySelector("#to-do__item-template");
const STORAGE_KEY = "toDoTasks";

const defaultItems = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду"
];

let items = [];

function getTasksFromDOM() {
  const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
  const tasks = [];

  itemsNamesElements.forEach((itemElement) => {
    tasks.push(itemElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function syncTasks() {
  items = getTasksFromDOM();
  saveTasks(items);
}

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return defaultItems;
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return defaultItems;
    }

    return parsedTasks;
  } catch {
    return defaultItems;
  }
}

function enableEditMode(textElement) {
  textElement.setAttribute("contenteditable", "true");
  textElement.focus();
}

function disableEditMode(textElement) {
  textElement.setAttribute("contenteditable", "false");
  syncTasks();
}

function createItem(item) {
  const clone = itemTemplate.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    syncTasks();
  });

  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    syncTasks();
  });

  editButton.addEventListener("click", () => {
    enableEditMode(textElement);
  });

  textElement.addEventListener("blur", () => {
    disableEditMode(textElement);
  });

  return clone;
}

function renderTasks(tasks) {
  tasks.forEach((item) => {
    listElement.append(createItem(item));
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const itemName = inputElement.value.trim();

  if (!itemName) {
    return;
  }

  listElement.prepend(createItem(itemName));
  syncTasks();
  formElement.reset();
}

items = loadTasks();
renderTasks(items);
formElement.addEventListener("submit", handleFormSubmit);
