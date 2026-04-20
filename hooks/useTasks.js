"use client";

import { useEffect, useState } from "react";
import { DEFAULT_TASK_TEXTS, createTask } from "@/lib/tasks";
import { loadTasks, saveTasks } from "@/lib/storage";

export default function useTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(loadTasks(DEFAULT_TASK_TEXTS));
  }, []);

  useEffect(() => {
    if (tasks.length === 0) {
      return;
    }

    saveTasks(tasks);
  }, [tasks]);

  function addTask(text) {
    const nextText = text.trim();

    if (!nextText) {
      return;
    }

    setTasks((prevTasks) => [createTask(nextText), ...prevTasks]);
  }

  function deleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }

  function duplicateTask(taskId) {
    setTasks((prevTasks) => {
      const sourceTask = prevTasks.find((task) => task.id === taskId);

      if (!sourceTask) {
        return prevTasks;
      }

      return [createTask(sourceTask.text), ...prevTasks];
    });
  }

  function updateTask(taskId, nextText) {
    const value = nextText.trim();

    if (!value) {
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          text: value
        };
      })
    );
  }

  return {
    tasks,
    addTask,
    deleteTask,
    duplicateTask,
    updateTask
  };
}
