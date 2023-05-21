import React from "react";

const TaskCard = ({ tasks, handleEditTask }) => {
  const getSubtasksCount = (subtasks) => {
    const completedSubtasks = subtasks.filter((subtask) => subtask.isComplete);
    return `${completedSubtasks.length} of ${subtasks.length} subtasks`;
  };

  return (
    <div className="tasks-container">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="card"
          onClick={() => handleEditTask(task)}
        >
          <div className="card-subtitle">{task.taskLabel}</div>
          <div className="card-title">{task.taskTitle}</div>
          {task.subtasks ? (
            <div className="subtasks-count">
              {getSubtasksCount(task.subtasks)}
            </div>
          ) : (
            <div className="subtasks-count">No subtasks</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskCard;