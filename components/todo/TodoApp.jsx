"use client";

import TodoForm from "@/components/todo/TodoForm";
import TodoList from "@/components/todo/TodoList";
import useTasks from "@/hooks/useTasks";

export default function TodoApp() {
  const { tasks, addTask, deleteTask, duplicateTask, updateTask } = useTasks();

  return (
    <>
      <main className="main">
        <section className="to-do">
          <h1 className="to-do__title">Список дел</h1>
          <TodoForm onAddTask={addTask} />
          <TodoList
            tasks={tasks}
            onDelete={deleteTask}
            onDuplicate={duplicateTask}
            onUpdate={updateTask}
          />
        </section>
      </main>
      <footer className="footer">© Yandex.Praktikum 2026</footer>
    </>
  );
}
