import React, { useState, useContext, useEffect } from "react";
import CreateColumn from "./Column/CreateColumn";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import { useParams } from "react-router-dom";
import editIcon from "../assets/edit-icon.svg";
import EditBoard from "./Column/EditColumn";

export default function Board({ isBoardFull, selectedBoard }) {
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);

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
          console.log(data);
        } else {
          throw new Error("Failed to fetch columns");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchColumns();
  }, [credentials, selectedBoard, workspaceId]);

  return (
    <div className={`${isBoardFull ? "board" : "board-full"}`}>
      {columns.map((column) => (
        <div key={column.id} className="column">
          <div className="column-header">
            <div className="flex items-center">
              <span
                className="column-label"
                style={{ backgroundColor: column.columnStatusColor }}
              ></span>
              <span className="column-title">{column.columnStatus}</span>
            </div>
            <img
              className="cursor-pointer"
              src={editIcon}
              alt="edit"
              onClick={() => handleEditColumn(column)}
            />
          </div>
          <div className="column-container-empty"></div>
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
        <EditBoard
          board={selectedBoard}
          column={selectedColumn}
          onClose={handleCloseEditColumn}
        />
      )}
    </div>
  );
}