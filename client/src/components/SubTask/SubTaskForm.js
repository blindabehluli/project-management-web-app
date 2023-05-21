import React from "react";

export default function SubTaskForm({ handleAddSubtask }) {
  return (
    <>
      <button
        type="button"
        className="button-small button-theme mt-4"
        onClick={handleAddSubtask}
      >
        + Add New Subtask
      </button>
    </>
  );
}