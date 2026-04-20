"use client";

import { useState } from "react";

export default function TodoItem({ task, onDelete, onDuplicate, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);

  function handleBlur() {
    const nextText = draft.trim();

    if (!nextText) {
      setDraft(task.text);
      setIsEditing(false);
      return;
    }

    if (nextText !== task.text) {
      onUpdate(task.id, nextText);
    }

    setIsEditing(false);
  }

  return (
    <li className="to-do__item">
      {isEditing ? (
        <input
          className="to-do__item-text to-do__item-text_input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          autoFocus
        />
      ) : (
        <span className="to-do__item-text">{task.text}</span>
      )}
      <button
        className="to-do__item-button to-do__item-button_type_edit"
        aria-label="Редактировать"
        type="button"
        onClick={() => setIsEditing(true)}
      />
      <button
        className="to-do__item-button to-do__item-button_type_duplicate"
        aria-label="Копировать"
        type="button"
        onClick={() => onDuplicate(task.id)}
      />
      <button
        className="to-do__item-button to-do__item-button_type_delete"
        aria-label="Удалить"
        type="button"
        onClick={() => onDelete(task.id)}
      />
    </li>
  );
}
