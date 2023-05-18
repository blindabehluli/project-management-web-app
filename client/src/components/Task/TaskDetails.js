import { useRef, useEffect, useState, useContext } from "react";
import optionsIcon from "../../assets/three-dots.svg";
import EditTask from "./EditTask";
import UserContext from "../../context/UserContext";
import { useParams } from "react-router-dom";
import { api } from "../../utils/apiHelper";

export default function TaskDetails({ onClose, board, task, columns }) {
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const credentials = useContext(UserContext);
  const { workspaceId } = useParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, dropdownRef, onClose]);

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
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${selectedColumnId}/tasks/${task.id}`,
        "PUT",
        { columnId: selectedColumnId },
        credentials
      );

      if (response.status === 204) {
      } else {
        throw new Error("Failed to update the task's status");
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
                <div className="flex justify-between space-x-8">
                  <h3 className="card-details-text text-[#828fa3]">Priority</h3>
                  <h3
                    className={`card-details-text px-2 rounded-md ${getPriorityClasses()}`}
                  >
                    {task.taskPriority}
                  </h3>
                </div>
              </div>
              <div className="modal-input-wrapper mt-16">
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
