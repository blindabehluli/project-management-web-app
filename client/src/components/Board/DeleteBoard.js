import { useRef, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";

function DeleteBoard({ board, onClose }) {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  useClickOutside(modalRef, onClose);

  const handleDelete = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}`,
        "DELETE",
        null,
        credentials
      );

      if (response.status === 204) {
        onClose(); // Close the modal after successful deletion
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to delete the board");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="align-left block ">
          <div className="mb-6">
            <h2 className="text-[#ea555] mb-4">Delete this board?</h2>
            <p className="text-[#828fa3] leading-6	text-sm">
              Are you sure you want to de lete the this board? This action will
              remove all columns and tasks and cannot be reversed.
            </p>
          </div>
          <div className="flex justify-between">
            <button
              className="button button-danger button-small mr-4"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="button button-cancel button-small"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteBoard;
