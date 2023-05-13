import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";

function EditColumn({ board, column, onClose }) {
  const modalRef = useRef(null);
  const columnStatus = useRef(null);
  const columnStatusColor = useRef(null);
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
    columnStatus.current.value = column.columnStatus; // Set initial form value to the existing column status
    columnStatusColor.current.value = column.columnStatusColor; // Set initial form value to the existing column status color
  }, [column]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedColumn = {
      ...column,
      columnStatus: columnStatus.current.value,
      columnStatusColor: columnStatusColor.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${column.id}`,
        "PUT",
        updatedColumn,
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

  const handleDelete = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${column.id}`,
        "DELETE",
        null,
        credentials
      );

      if (response.status === 204) {
        onClose(); // Close the modal after successful deletion
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
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
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Edit Column</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Status</div>
              <input
                className="modal-input"
                type="text"
                placeholder="To do..."
                ref={columnStatus}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Status Color</div>
              <input
                className="modal-input"
                type="text"
                placeholder="e.g #12f31"
                ref={columnStatusColor}
              />
            </div>
            <div className="flex justify-between">
              <button className="button button-small mr-4" onClick={handleSubmit}>
                Update Column
              </button>
              <button
                className="button button-danger button-small"
                onClick={handleDelete}
              >
                Delete Column
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditColumn;