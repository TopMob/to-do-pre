import { DEFAULT_TASK_TEXTS } from "./constants.js";
import { createItem } from "./item.js";
import { loadTasks, saveTasks } from "./storage.js";
import { createTask } from "./utils.js";

export function initializeApp() {
  const listElement = document.querySelector(".to-do__list");
  const formElement = document.querySelector(".to-do__form");
  const inputElement = document.querySelector(".to-do__input");
  const itemTemplate = document.querySelector("#to-do__item-template");

  let tasks = loadTasks(DEFAULT_TASK_TEXTS);

  renderTasks();

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskText = inputElement.value.trim();

    if (!taskText) {
      return;
    }

    const newTask = createTask(taskText);
    tasks = [newTask, ...tasks];
    saveTasks(tasks);
    renderTasks();
    formElement.reset();
  });

  function renderTasks() {
    listElement.textContent = "";

    tasks.forEach((task) => {
      const taskElement = createItem(task, itemTemplate, {
        onDelete: handleDeleteTask,
        onDuplicate: handleDuplicateTask,
        onUpdate: handleUpdateTask
      });

      listElement.append(taskElement);
    });
  }

  function handleDeleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(tasks);
    renderTasks();
  }

  function handleDuplicateTask(taskId) {
    const sourceTask = tasks.find((task) => task.id === taskId);

    if (!sourceTask) {
      return;
    }

    const duplicatedTask = createTask(sourceTask.text);
    tasks = [duplicatedTask, ...tasks];
    saveTasks(tasks);
    renderTasks();
  }

  function handleUpdateTask(taskId, nextText) {
    tasks = tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        text: nextText
      };
    });

    saveTasks(tasks);
    renderTasks();
  }
}
