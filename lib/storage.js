import { createTask, STORAGE_KEY } from "@/lib/tasks";

export function loadTasks(defaultTaskTexts) {
  if (typeof window === "undefined") {
    return defaultTaskTexts.map((text) => createTask(text));
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    const defaultTasks = defaultTaskTexts.map((text) => createTask(text));
    saveTasks(defaultTasks);
    return defaultTasks;
  }

  try {
    const parsedTasks = JSON.parse(rawValue);

    if (!Array.isArray(parsedTasks)) {
      const fallbackTasks = defaultTaskTexts.map((text) => createTask(text));
      saveTasks(fallbackTasks);
      return fallbackTasks;
    }

    return parsedTasks
      .filter((task) => task && typeof task.text === "string")
      .map((task) => ({
        id: typeof task.id === "string" ? task.id : createTask(task.text).id,
        text: task.text
      }));
  } catch {
    const fallbackTasks = defaultTaskTexts.map((text) => createTask(text));
    saveTasks(fallbackTasks);
    return fallbackTasks;
  }
}

export function saveTasks(tasks) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
