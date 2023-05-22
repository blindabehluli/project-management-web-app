import { React, useRef, useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";
import SubTaskForm from "../SubTask/SubTaskForm";
import SubTaskList from "../SubTask/SubTaskList";
import useClickOutside from "../../hooks/useClickOutside";

export default function EditTask({ onClose, board, task }) {
  const modalRef = useRef(null);
  const taskTitleRef = useRef(null);
  const taskDescriptionRef = useRef(null);
  const taskPriorityRef = useRef(null);
  const taskLabelRef = useRef(null);
  const taskStatusRef = useRef(null);
  const subtaskTitleRef = useRef(null);
  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();
  const [columns, setColumns] = useState([]);

  const [subtasks, setSubtasks] = useState([]);

  const subtaskTitleRefs = useRef([]); // Array of refs for subtask input fields

  useClickOutside(modalRef, onClose);

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

  const handleAddSubtask = async () => {
    const subtask = {
      subtaskTitle: "",
      isComplete: false,
    };
  
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks`,
        "POST",
        subtask,
        credentials
      );
  
      if (response.status === 201) {
        // Fetch the updated subtasks from the server
        const updatedSubtasksResponse = await api(
          `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks`,
          "GET",
          null,
          credentials
        );
  
        if (updatedSubtasksResponse.status === 200) {
          const data = await updatedSubtasksResponse.json();
          setSubtasks(data);
  
          // Check if the ref is available before setting its value
          if (subtaskTitleRef.current) {
            subtaskTitleRef.current.value = "";
          }
        } else {
          throw new Error("Failed to fetch updated subtasks");
        }
      } else {
        throw new Error("Failed to add subtask");
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleUpdateSubtask = async (id, updatedTitle) => {
    const updatedSubtask = {
      subtaskTitle: updatedTitle,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks/${id}`,
        "PUT",
        updatedSubtask,
        credentials
      );

      if (response.status === 204) {
        // Subtask updated successfully
      } else {
        throw new Error("Failed to update subtask");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSubtask = async (id) => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}/subtasks/${id}`,
        "DELETE",
        null,
        credentials
      );

      if (response.status === 204) {
        const updatedSubtasks = subtasks.filter((subtask) => subtask.id !== id);
        setSubtasks(updatedSubtasks);
      } else {
        throw new Error("Failed to delete subtask");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/boards/${board.id}/columns`,
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
  }, [credentials, board, workspaceId]);

  useEffect(() => {
    setErrors([]);
    taskTitleRef.current.value = task.taskTitle;
    taskDescriptionRef.current.value = task.taskDescription;
    taskPriorityRef.current.value = task.taskPriority;
    taskLabelRef.current.value = task.taskLabel;
    taskStatusRef.current.value = task.columnId;

    const selectedColumn = columns.find(
      (column) => column.id === task.columnId
    );

    if (selectedColumn) {
      taskStatusRef.current.value = selectedColumn.id;
    }
  }, [onClose, task, columns]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      ...task,
      taskTitle: taskTitleRef.current.value,
      taskDescription: taskDescriptionRef.current.value,
      taskPriority: taskPriorityRef.current.value,
      taskLabel: taskLabelRef.current.value,
      columnId: taskStatusRef.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}`,
        "PUT",
        updatedTask,
        credentials
      );

      if (response.status === 204) {
        // Update the subtasks
        const updatedSubtasks = subtasks.map((subtask, index) => {
          const updatedTitle = subtaskTitleRefs.current[index].value;
          return { ...subtask, subtaskTitle: updatedTitle };
        });
        setSubtasks(updatedSubtasks);

        // Update subtask titles
        for (let i = 0; i < subtasks.length; i++) {
          const id = subtasks[i].id;
          const updatedTitle = subtaskTitleRefs.current[i].value;
          await handleUpdateSubtask(id, updatedTitle);
        }

        onClose();
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to update the task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Edit Task</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Title</div>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter task title..."
                ref={taskTitleRef}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Label</div>
              <input
                className="modal-input"
                type="text"
                placeholder="Enter task label..."
                ref={taskLabelRef}
              />
            </div>
            <div className="modal-input-wrapper">
              <p className="text-[#828fa3] font-bold text-[.75rem]">Subtasks</p>
              <SubTaskList
                subtasks={subtasks}
                handleDeleteSubtask={handleDeleteSubtask}
                subtaskTitleRefs={subtaskTitleRefs}
              />
              <SubTaskForm handleAddSubtask={handleAddSubtask} />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Description</div>
              <textarea
                className="text-area"
                rows="4"
                placeholder="Enter task description..."
                ref={taskDescriptionRef}
              ></textarea>
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Priority</div>
              <select className="modal-input" ref={taskPriorityRef}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Current Status</div>
              <select className="modal-input" ref={taskStatusRef}>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.columnStatus}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-input-wrapper">
              <button className="button button-small mr-4" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
