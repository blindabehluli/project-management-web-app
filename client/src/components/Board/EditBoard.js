import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";

function EditBoard({ board, onClose }) {
  const modalRef = useRef(null);
  const boardTitle = useRef(null);
  const boardDescription = useRef(null);
  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, onClose]);

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    boardTitle.current.value = board.boardTitle; // Set initial form value to the existing board title
    boardDescription.current.value = board.boardDescription; // Set initial form value to the existing board description
  }, [board]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedBoard = {
      ...board,
      boardTitle: boardTitle.current.value,
      boardDescription: boardDescription.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}`,
        "PUT",
        updatedBoard,
        credentials
      );

      if (response.status === 204) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to update the board");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Edit Board</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Title</div>
              <input
                className="modal-input-edit"
                type="text"
                placeholder="Design System..."
                ref={boardTitle}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Description</div>
              <textarea
                className="text-area"
                type="text"
                placeholder="This is a board for the design system of the web app..."
                ref={boardDescription}
              ></textarea>
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Update Board
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBoard;
