const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document.querySelector("#to-do__item-template");
const STORAGE_KEY = "toDoTasks";

let items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду"
];

function createItem(item) {
  const clone = itemTemplate.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    items = getTasksFromDOM();
    saveTasks(items);
  });

  duplicateButton.addEventListener("click", () => {
    const itemName = textElement.textContent;
    const newItem = createItem(itemName);
    listElement.prepend(newItem);
    items = getTasksFromDOM();
    saveTasks(items);
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    items = getTasksFromDOM();
    saveTasks(items);
  });

  return clone;
}

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

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (!savedTasks) {
    return items;
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return items;
    }

    return parsedTasks;
  } catch {
    return items;
  }
}

items = loadTasks();

items.forEach((item) => {
  const taskElement = createItem(item);
  listElement.append(taskElement);
});

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemName = inputElement.value.trim();

  if (!itemName) {
    return;
  }

  const taskElement = createItem(itemName);
  listElement.prepend(taskElement);

  items = getTasksFromDOM();
  saveTasks(items);
  formElement.reset();
});
