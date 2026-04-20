const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const itemTemplate = document.querySelector("#to-do__item-template");
const storageKey = "toDoTasks";
const defaultTaskTexts = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду"
];

let tasks = [];

function generateTaskId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTask(text) {
  return {
    id: generateTaskId(),
    text
  };
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function getDefaultTasks() {
  const defaultTasks = [];
  for (const text of defaultTaskTexts) {
    defaultTasks.push(createTask(text));
  }
  return defaultTasks;
}

function loadTasks() {
  const rawTasks = localStorage.getItem(storageKey);
  if (!rawTasks) {
    const defaultTasks = getDefaultTasks();
    tasks = defaultTasks;
    saveTasks();
    return;
  }
  try {
    const parsedTasks = JSON.parse(rawTasks);
    if (!Array.isArray(parsedTasks)) {
      tasks = getDefaultTasks();
      saveTasks();
      return;
    }
    const normalizedTasks = [];
    for (const parsedTask of parsedTasks) {
      if (typeof parsedTask === "string") {
        const text = parsedTask.trim();
        if (text) {
          normalizedTasks.push(createTask(text));
        }
      } else if (parsedTask && typeof parsedTask.text === "string") {
        const text = parsedTask.text.trim();
        if (text) {
          normalizedTasks.push({
            id: typeof parsedTask.id === "string" && parsedTask.id ? parsedTask.id : generateTaskId(),
            text
          });
        }
      }
    }
    tasks = normalizedTasks.length > 0 ? normalizedTasks : getDefaultTasks();
    saveTasks();
  } catch {
    tasks = getDefaultTasks();
    saveTasks();
  }
}

function findTaskIndexById(taskId) {
  return tasks.findIndex((task) => task.id === taskId);
}

function createItem(task) {
  const itemElement = itemTemplate.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = itemElement.querySelector(".to-do__item-text");
  const deleteButton = itemElement.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = itemElement.querySelector(".to-do__item-button_type_duplicate");
  const editButton = itemElement.querySelector(".to-do__item-button_type_edit");

  itemElement.dataset.taskId = task.id;
  textElement.textContent = task.text;
  textElement.setAttribute("contenteditable", "false");

  deleteButton.addEventListener("click", () => {
    const taskId = itemElement.dataset.taskId;
    const taskIndex = findTaskIndexById(taskId);
    if (taskIndex === -1) {
      return;
    }
    tasks.splice(taskIndex, 1);
    itemElement.remove();
    saveTasks();
  });

  duplicateButton.addEventListener("click", () => {
    const sourceTaskId = itemElement.dataset.taskId;
    const sourceTaskIndex = findTaskIndexById(sourceTaskId);
    if (sourceTaskIndex === -1) {
      return;
    }
    const duplicatedTask = createTask(tasks[sourceTaskIndex].text);
    tasks.unshift(duplicatedTask);
    const duplicatedItemElement = createItem(duplicatedTask);
    listElement.prepend(duplicatedItemElement);
    saveTasks();
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    const taskId = itemElement.dataset.taskId;
    const taskIndex = findTaskIndexById(taskId);
    if (taskIndex === -1) {
      return;
    }
    const editedText = textElement.textContent.trim();
    if (!editedText) {
      textElement.textContent = tasks[taskIndex].text;
      return;
    }
    tasks[taskIndex].text = editedText;
    textElement.textContent = editedText;
    saveTasks();
  });

  return itemElement;
}

function renderTasks() {
  listElement.textContent = "";
  for (const task of tasks) {
    const itemElement = createItem(task);
    listElement.append(itemElement);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const taskText = inputElement.value.trim();
  if (!taskText) {
    return;
  }
  const newTask = createTask(taskText);
  tasks.unshift(newTask);
  const newItemElement = createItem(newTask);
  listElement.prepend(newItemElement);
  saveTasks();
  formElement.reset();
}

function initializeTodoApp() {
  loadTasks();
  renderTasks();
  formElement.addEventListener("submit", handleFormSubmit);
}

initializeTodoApp();
