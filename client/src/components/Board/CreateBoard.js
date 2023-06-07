import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";

function CreateBoard({ onClose, setBoards }) {
  const modalRef = useRef(null);
  const boardTitle = useRef(null);
  const boardDescription = useRef(null);
  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    boardTitle.current.value = ""; // Reset form values
    boardDescription.current.value = "";
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const board = {
      boardTitle: boardTitle.current.value,
      boardDescription: boardDescription.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards`,
        "POST",
        board,
        credentials
      );
      if (response.status === 201) {
        onClose(); // Close the modal after successful submission
        const newBoard = await response.json();
        setBoards((prevBoards) => [...prevBoards, newBoard]);
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to create a new board");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Add New Board</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Title</div>
              <input
                className="modal-input"
                type="text"
                placeholder="Design System..."
                ref={boardTitle}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Description</div>
              <textarea
                className="text-area"
                rows="4"
                type="text"
                placeholder="This is a board for the design system of the web app..."
                ref={boardDescription}
              ></textarea>
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Create New Board
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBoard;
