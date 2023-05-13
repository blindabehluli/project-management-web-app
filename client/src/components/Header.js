import React, { useState, useEffect, useRef } from "react";
import kanbanLogo from "../assets/logo.svg";
import optionsIcon from "../assets/three-dots.svg";
import EditBoard from "./Board/EditBoard";
import DeleteBoard from "./Board/DeleteBoard";

export default function Header({ selectedBoard }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [isDeleteBoardOpen, setIsDeleteBoardOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  return (
    <>
      <header>
        <picture className="header-logo">
          <source srcSet={kanbanLogo} media="(max-width: 767px)"></source>
          <img src={kanbanLogo} alt="logo" />
        </picture>
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