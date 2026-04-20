import TodoItem from "@/components/todo/TodoItem";

export default function TodoList({ tasks, onDelete, onDuplicate, onUpdate }) {
  return (
    <ul className="to-do__list">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
