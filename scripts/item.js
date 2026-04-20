export function createItem(task, template, actions) {
  const itemElement = template.content
    .querySelector(".to-do__item")
    .cloneNode(true);

  const textElement = itemElement.querySelector(".to-do__item-text");
  const deleteButton = itemElement.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = itemElement.querySelector(".to-do__item-button_type_duplicate");
  const editButton = itemElement.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = task.text;

  deleteButton.addEventListener("click", () => {
    actions.onDelete(task.id);
  });

  duplicateButton.addEventListener("click", () => {
    actions.onDuplicate(task.id);
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();
    placeCaretAtEnd(textElement);
  });

  textElement.addEventListener("blur", () => {
    textElement.setAttribute("contenteditable", "false");
    const nextText = textElement.textContent.trim();

    if (!nextText) {
      textElement.textContent = task.text;
      return;
    }

    if (nextText !== task.text) {
      actions.onUpdate(task.id, nextText);
    }
  });

  return itemElement;
}

function placeCaretAtEnd(element) {
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}
