import React, { useState, useEffect, useRef, useContext } from "react";
import optionsIcon from "../assets/three-dots.svg";
import EditBoard from "./Board/EditBoard";
import DeleteBoard from "./Board/DeleteBoard";
import CreateTask from "./Task/CreateTask";
import BoardImage from "./BoardImage";
import UserContext from "../context/UserContext";
import { api } from "../utils/apiHelper";
import { useParams, Link } from "react-router-dom";
import useClickOutside from "../hooks/useClickOutside";

export default function Header({ selectedBoard, setBoards }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isBoardImageOpen, setIsBoardImageOpen] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceLogoUrl, setWorkspaceLogoUrl] = useState("");

  const dropdownRef = useRef(null);
  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();

  useClickOutside(dropdownRef, () => {
    setIsDropdownOpen(false);
  });

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleEditBoard = () => {
    setIsEditBoardOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseEditBoard = () => {
    setIsEditBoardOpen(false);
  };

  const handleDeleteBoard = () => {
    setIsDeleteBoardOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCloseDeleteBoard = () => {
    setIsDeleteBoardOpen(false);
  };

  const handleCreateTask = () => {
    setIsCreateTaskOpen(true);
  };

  const handleCloseCreateTask = () => {
    setIsCreateTaskOpen(false);
  };

  const handleOpenBoardImage = () => {
    setIsBoardImageOpen(true);
    setIsDropdownOpen(false);
  };
  
  const handleCloseBoardImage = () => {
    setIsBoardImageOpen(false);
  };

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      try {
        const response = await api(
          `/workspaces/${workspaceId}`,
          "GET",
          null,
          credentials
        );
        if (response.status === 200) {
          const workspace = await response.json();
          setWorkspaceTitle(workspace.workspaceTitle);
          setWorkspaceLogoUrl(workspace.workspaceLogoUrl);
        } else {
          throw new Error("Failed to fetch the workspace details");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkspaceDetails();
  }, [workspaceId, credentials]);

  return (
    <>
      <header>
        <Link to="/workspace" className="header-logo">
          <picture>
            {workspaceLogoUrl ? (
              <img
                className="h-[45px] w-[45px] rounded-md"
                alt="workspace-logo"
                src={workspaceLogoUrl}
              />
            ) : (
              <div className="h-[45px] rounded-md w-[45px] bg-primary-600 text-white flex justify-center items-center text-2xl">
                {workspaceTitle && workspaceTitle.substring(0, 2)}
              </div>
            )}
          </picture>
          <h1>{workspaceTitle}</h1>
        </Link>
        <div className="header-content">
          <h1 className="header-title">{selectedBoard?.boardTitle}</h1>
          <div className="header-buttons">
            <button className="button" onClick={handleCreateTask}>
              + Add New Task
            </button>
            {selectedBoard && (
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="button-three-dots hover:bg-slate-200"
                  onClick={handleDropdownToggle}
                >
                  <img alt="options" src={optionsIcon}></img>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-wrapper">
                    <button type="button" className="dropdown-text" onClick={handleOpenBoardImage}>
                      Background Image
                    </button>

                    <button
                      type="button"
                      className="dropdown-text mt-2"
                      onClick={handleEditBoard}
                    >
                      Edit Board
                    </button>
                    <button
                      type="button"
                      className="dropdown-text dropdown-text-warning"
                      onClick={handleDeleteBoard}
                    >
                      Delete Board
                    </button>
                    <Link to="/signout" className="dropdown-signout">
                      Sign Out
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {isCreateTaskOpen && (
        <CreateTask
          onClose={handleCloseCreateTask}
          selectedBoard={selectedBoard}
        />
      )}
      {isEditBoardOpen && (
        <EditBoard board={selectedBoard} onClose={handleCloseEditBoard} setBoards={setBoards} />
      )}
      {isDeleteBoardOpen && (
        <DeleteBoard board={selectedBoard} onClose={handleCloseDeleteBoard} />
      )}
      {isBoardImageOpen && <BoardImage board={selectedBoard} onClose={handleCloseBoardImage} />}
    </>
  );
}
