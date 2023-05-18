const TaskCard = ({ tasks, handleEditTask }) => {
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
          {task.taskDescription && (
            <div className="subtasks-count">{task.taskDescription}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskCard;
