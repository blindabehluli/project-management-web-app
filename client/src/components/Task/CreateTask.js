import { useRef, useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";

export default function CreateTask({ onClose, selectedBoard }) {
  const modalRef = useRef(null);
  const taskTitle = useRef(null);
  const taskDescription = useRef(null);
  const taskPriority = useRef(null);
  const taskLabel = useRef(null);
  const taskStatus = useRef(null);
  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params
  const [columns, setColumns] = useState([]);

  useClickOutside(modalRef, onClose);
  
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/boards/${selectedBoard.id}/columns`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const data = await response.json();
          setColumns(data);
        } else {
          throw new Error("Failed to fetch columns");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchColumns();
  }, [credentials, selectedBoard, workspaceId]);

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    taskTitle.current.value = ""; // Reset form values
    taskDescription.current.value = "";
    taskPriority.current.value = "";
    taskLabel.current.value = "";
    taskStatus.current.value = "";
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const task = {
      taskTitle: taskTitle.current.value,
      taskDescription: taskDescription.current.value,
      taskPriority: taskPriority.current.value,
      taskLabel: taskLabel.current.value,
      taskStatus: taskStatus.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${selectedBoard.id}/columns/${task.taskStatus}/tasks`,
        "POST",
        task,
        credentials
      );

      if (response.status === 201) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to create a new task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Add New Task</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Title</div>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter task title..."
                ref={taskTitle}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Description</div>
              <textarea
                className="text-area"
                rows="4"
                placeholder="Enter task description..."
                ref={taskDescription}
              ></textarea>
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Priority</div>
              <select className="modal-input" ref={taskPriority}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Label</div>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter task label..."
                ref={taskLabel}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Status</div>
              <select className="modal-input" ref={taskStatus}>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.columnStatus}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}