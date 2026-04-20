"use client";

import { useState } from "react";

export default function TodoForm({ onAddTask }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onAddTask(value);
    setValue("");
  }

  return (
    <form className="to-do__form" onSubmit={handleSubmit}>
      <input
        className="to-do__input"
        name="task"
        placeholder="Следующее дело..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button className="to-do__submit" type="submit">
        Добавить
      </button>
    </form>
  );
}
