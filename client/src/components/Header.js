import React, { useState, useEffect, useRef, useContext } from "react";
import optionsIcon from "../assets/three-dots.svg";
import EditBoard from "./Board/EditBoard";
import DeleteBoard from "./Board/DeleteBoard";
import UserContext from "../context/UserContext";
import { api } from "../utils/apiHelper";
import { useParams, Link } from "react-router-dom";

export default function Header({ selectedBoard }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceLogoUrl, setWorkspaceLogoUrl] = useState("");

  const dropdownRef = useRef(null);
  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Get the current workspace details from the API
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
          // Set the form values with the current workspace details
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
            <button className="button">+ Add New Task</button>
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
                    <button
                      type="button"
                      className="dropdown-text"
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {isEditBoardOpen && (
        <EditBoard board={selectedBoard} onClose={handleCloseEditBoard} />
      )}
      {isDeleteBoardOpen && (
        <DeleteBoard board={selectedBoard} onClose={handleCloseDeleteBoard} />
      )}
    </>
  );
}
