import React from "react";
import closeButton from "../../assets/close-button.svg";

export default function SubTaskList({ subtasks, handleDeleteSubtask, subtaskTitleRefs }) {
  return (
    <ul className="subtasks-list">
      {subtasks.map((subtask, index) => (
        <li className="subtasks-item mt-4" key={subtask.id}>
          <input
            className="modal-input w-full mr-2"
            type="text"
            defaultValue={subtask.subtaskTitle}
            ref={(ref) => (subtaskTitleRefs.current[index] = ref)}
            required
          ></input>
          <button
            type="button"
            onClick={() => handleDeleteSubtask(subtask.id)}
          >
            <img alt="close" src={closeButton}></img>
          </button>
        </li>
      ))}
    </ul>
  );
}
