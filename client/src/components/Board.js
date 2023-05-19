import React, { useState, useContext, useEffect } from "react";
import CreateColumn from "./Column/CreateColumn";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";
import editIcon from "../assets/edit-icon.svg";
import EditColumn from "./Column/EditColumn";
import TaskCard from "./Task/TaskCard";
import EditTask from "./Task/EditTask";
import TaskDetails from "./Task/TaskDetails";

export default function Board({ isBoardFull, selectedBoard }) {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [boardImage, setBoardImage] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();

  const handleCreateColumn = () => {
    setIsCreateColumnOpen(true);
  };

  const handleCloseCreateColumn = () => {
    setIsCreateColumnOpen(false);
  };

  const handleEditColumn = (column) => {
    setSelectedColumn(column);
  };

  const handleCloseEditColumn = () => {
    setSelectedColumn(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowEditTaskModal(false);
  };

  const handleCloseEditTask = () => {
    if (selectedTask) {
      setShowEditTaskModal(true);
    } else {
      setSelectedTask(null);
    }
  };

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

          // Fetch tasks for each column
          const columnTasksPromises = data.map(async (column) => {
            const tasksResponse = await api(
              `/workspaces/${workspaceId}/boards/${selectedBoard.id}/columns/${column.id}/tasks`,
              "GET",
              null,
              credentials
            );
            if (tasksResponse.status === 200) {
              const tasksData = await tasksResponse.json();
              column.tasks = tasksData; // Assign tasks to the column
            } else {
              throw new Error("Failed to fetch tasks");
            }
          });

          // Wait for all tasks to be fetched for each column
          await Promise.all(columnTasksPromises);

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
    const fetchBoardImages = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/boards/${selectedBoard.id}/images`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const boardImage = await response.json();
          setBoardImage(boardImage);
        } else {
          throw new Error("Failed to fetch board images");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoardImages();
  }, [credentials, selectedBoard, workspaceId]);

  return (
    <div
      className={`${isBoardFull ? "board" : "board-full"}`}
      style={
        boardImage
          ? {
              backgroundImage: `url('${boardImage.boardImageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : null
      }
    >
      {columns.map((column) => (
        <div key={column.id} className="column">
          <div className="column-header">
            <div className="flex items-center">
              <span
                className="column-label"
                style={{ backgroundColor: column.columnStatusColor }}
              ></span>
              <span className="column-title">
                {column.columnStatus} ({column.tasks.length})
              </span>
            </div>
            <img
              className="cursor-pointer"
              src={editIcon}
              alt="edit"
              onClick={() => handleEditColumn(column)}
            />
          </div>
          {column.tasks && column.tasks.length > 0 ? (
            <TaskCard tasks={column.tasks} handleEditTask={handleEditTask} />
          ) : (
            <div className="column-container-empty"></div>
          )}
        </div>
      ))}

      <div className="column">
        <div className="column-header">&nbsp;</div>
        <button className="column-add-new" onClick={handleCreateColumn}>
          + New Column
        </button>
      </div>
      {isCreateColumnOpen && (
        <CreateColumn
          onClose={handleCloseCreateColumn}
          selectedBoard={selectedBoard}
        />
      )}
      {selectedColumn && (
        <EditColumn
          board={selectedBoard}
          column={selectedColumn}
          onClose={handleCloseEditColumn}
        />
      )}
      {selectedTask && (
        <TaskDetails
          onClose={handleCloseTaskDetails}
          board={selectedBoard}
          task={selectedTask}
          columns={columns}
        />
      )}
      {showEditTaskModal && (
        <EditTask
          onClose={handleCloseEditTask}
          board={selectedBoard}
          task={selectedTask}
        />
      )}
    </div>
  );
}
