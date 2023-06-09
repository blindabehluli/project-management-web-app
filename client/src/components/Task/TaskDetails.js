import { useRef, useEffect, useState, useContext } from "react";
import optionsIcon from "../../assets/three-dots.svg";
import EditTask from "./EditTask";
import UserContext from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { api } from "../../utils/apiHelper";
import useClickOutside from "../../hooks/useClickOutside";

export default function TaskDetails({ onClose, board, task, columns }) {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();

  const [subtasks, setSubtasks] = useState([]);

  useClickOutside(modalRef, onClose);

  const onClickEdit = () => {
    setShowEditTaskModal(true);
    setShowTaskDetails(false);
  };

  const onCloseEditTaskModal = () => {
    setShowEditTaskModal(false);
    setShowTaskDetails(true);
  };

  const toggleDropdown = () => setShowDropdown((prevState) => !prevState);

  const getPriorityClasses = () => {
    if (task.taskPriority === "High") {
      return "text-red-500 bg-red-200";
    } else if (task.taskPriority === "Medium") {
      return "text-orange-500 bg-orange-200";
    } else if (task.taskPriority === "Low") {
      return "text-green-500 bg-green-200";
    }
    return ""; // Default classes if priority is not set
  };

  const onChangeStatus = async (event) => {
    const selectedColumnId = event.target.value;

    try {
      // Make an API call to update the task's columnId
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}`,
        "PUT",
        { columnId: selectedColumnId },
        credentials
      );

      if (response.status === 204) {
        onClose();
        // Task status updated successfully
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
      } else {
        throw new Error("Failed to update the task's status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const data = await response.json();
          setSubtasks(data);
        } else {
          throw new Error("Failed to fetch subtasks");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubtasks();
  }, [credentials, task, board.id, workspaceId]);

  const handleSubtaskCheckboxChange = async (subtaskId, isComplete) => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks/${subtaskId}`,
        "PUT",
        { isComplete },
        credentials
      );
      if (response.status === 204) {
        // Subtask updated successfully
        const updatedSubtasks = subtasks.map((subtask) => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              isComplete: isComplete,
            };
          }
          return subtask;
        });
        setSubtasks(updatedSubtasks);
      } else {
        throw new Error("Failed to update the subtask");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {showTaskDetails && (
        <div className="overlay">
          <div className="modal" ref={modalRef}>
            <div className="card-details">
              <div key={task.id} className="card-details-top-wrapper">
                <h2 className="card-details-title">{task.taskTitle}</h2>
                <div className="dropdown" ref={dropdownRef}>
                  <button
                    className="button-three-dots hover:bg-slate-200"
                    onClick={toggleDropdown}
                  >
                    <img alt="options" src={optionsIcon} />
                  </button>
                  {showDropdown && (
                    <div className="dropdown-wrapper">
                      <button
                        type="button"
                        className="dropdown-text"
                        onClick={onClickEdit}
                      >
                        Edit Task
                      </button>
                      <button
                        type="button"
                        className="dropdown-text dropdown-text-warning"
                      >
                        Delete Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {task.taskDescription && (
                <div className="flex justify-between mb-8">
                  <h3 className="card-details-text text-[#828fa3]">
                    {task.taskDescription}
                  </h3>
                </div>
              )}
              <div className="flex flex-col space-y-4 flex-start w-1/2">
                {task.taskLabel && (
                  <div className="flex justify-between space-x-8">
                    <h3 className="card-details-text text-[#828fa3]">Label</h3>
                    <h3 className="card-details-text">{task.taskLabel}</h3>
                  </div>
                )}
                {task.taskPriority && (
                  <div className="flex justify-between space-x-8">
                    <h3 className="card-details-text text-[#828fa3]">
                      Priority
                    </h3>
                    <h3
                      className={`card-details-text px-2 rounded-md ${getPriorityClasses()}`}
                    >
                      {task.taskPriority}
                    </h3>
                  </div>
                )}
              </div>
              <div className="view-subtasks-wrapper">
                <p className="view-subtasks-subtitle">
                  Subtasks (
                  {subtasks.filter((subtask) => subtask.isComplete).length} of{" "}
                  {subtasks.length})
                </p>
                {subtasks.map((subtask) => (
                  <label
                    key={subtask.id}
                    className={`checkbox mt-2 ${
                      subtask.isComplete ? "completed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.isComplete}
                      onChange={(e) =>
                        handleSubtaskCheckboxChange(
                          subtask.id,
                          e.target.checked
                        )
                      }
                    />{" "}
                    {subtask.subtaskTitle}
                  </label>
                ))}
              </div>
              <div className="modal-input-wrapper mt-8">
                <div className="modal-input-label">Current Status</div>
                <select
                  className="modal-input"
                  value={task.columnId}
                  onChange={onChangeStatus}
                >
                  {columns.map((column) => (
                    <option key={column.id} value={column.id}>
                      {column.columnStatus}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditTaskModal && (
        <EditTask
          onClose={() => {
            onCloseEditTaskModal();
            onClose();
          }}
          board={board}
          task={task}
        />
      )}
    </>
  );
}
