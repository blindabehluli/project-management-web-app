import React, { useState, useContext, useEffect, useCallback } from "react";
import CreateBoard from "./Board/CreateBoard";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import hideIcon from "../assets/hide.svg";
import showIcon from "../assets/show.svg";
import { Link, useParams } from "react-router-dom";

export default function Sidebar({ onToggleSidebar, onBoardClick }) {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  const handleToggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
    onToggleSidebar(!isSidebarHidden);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBoardClick = useCallback(
    (board) => {
      setSelectedBoard(board);
      onBoardClick(board);
    },
    [onBoardClick]
  );

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}/boards`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const boards = await response.json();
          setBoards(boards);
          console.log(boards);

          if (!selectedBoard && boards.length > 0) {
            setSelectedBoard(boards[0]);
            onBoardClick(boards[0]);
          }
        } else {
          throw new Error("Failed to fetch boards");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkspaces();
  }, [credentials, selectedBoard, onBoardClick, workspaceId]);

  return (
    <>
      <aside className={isSidebarHidden ? "aside-hide" : ""}>
        <div className="sidebar-top">
          <div className="sidebar-head font-bold">
            All Boards ({boards.length})
          </div>
          <div>
            {boards.map((board) => (
              <button
                key={board.id}
                className={`sidebar-tab ${
                  selectedBoard?.id === board.id ? "active" : ""
                }`}
                onClick={() => handleBoardClick(board)}
              >
                {board.boardTitle}
              </button>
            ))}
          </div>
          <button className="sidebar-tab add-new" onClick={handleOpenModal}>
            + Create New Board
          </button>
          {isModalOpen && (
            <CreateBoard
              onClose={handleCloseModal}
              selectedBoard={selectedBoard} // Pass the selectedBoard prop
            />
          )}
        </div>
        <div className="sidebar-bottom">
            <Link className="sidebar-signout" to="/signout">Sign out</Link>
          <button className="sidebar-hide" onClick={handleToggleSidebar}>
            <img className="mr-[15px]" src={hideIcon} alt="hide"></img>
            {isSidebarHidden ? "" : "Hide Sidebar"}
          </button>
        </div>
      </aside>
      <button
        className={isSidebarHidden ? "show-sidebar" : "show-sidebar hidden"}
        onClick={handleToggleSidebar}
      >
        <img src={showIcon} alt="show"></img>
      </button>
    </>
  );
}
