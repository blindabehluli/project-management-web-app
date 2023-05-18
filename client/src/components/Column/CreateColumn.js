import { useRef, useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams } from "react-router-dom";

export default function CreateColumn({ onClose, selectedBoard }) {
  const modalRef = useRef(null);
  const columnStatus = useRef(null);
  const columnStatusColor = useRef(null);
  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  const colorOptions = [
    { name: "Red", color: "#C66759" },
    { name: "Orange", color: "#E1B205" },
    { name: "Green", color: "#51AC84" },
    { name: "Light Blue", color: "#5EA7AE" },
    { name: "Blue", color: "#5384CB" },
    { name: "Dark Gray", color: "#545E6E" },
    { name: "Purple", color: "#857BC1" },
  ];

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
    columnStatus.current.value = ""; // Reset form values
    columnStatusColor.current.value = "";
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const column = {
      columnStatus: columnStatus.current.value,
      columnStatusColor: columnStatusColor.current.value,
    };

    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${selectedBoard.id}/columns`,
        "POST",
        column,
        credentials
      );

      if (response.status === 201) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to create a new column");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Add New Column</div>
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
              <select className="modal-input" ref={columnStatusColor}>
                <option value="" disabled defaultValue>
                  Select a color
                </option>
                {colorOptions.map((option) => (
                  <option key={option.color} value={option.color}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Create Column
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
