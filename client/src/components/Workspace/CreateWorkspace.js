import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import useClickOutside from "../../hooks/useClickOutside";

function CreateWorkspace({ onClose }) {
  const modalRef = useRef(null);
  const workspaceTitle = useRef(null);
  const workspaceDescription = useRef(null);
  const workspaceLogoUrl = useRef(null);

  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    workspaceTitle.current.value = ""; // Reset form values
    workspaceDescription.current.value = "";
    workspaceLogoUrl.current.value = "";
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workspace = {
      workspaceTitle: workspaceTitle.current.value,
      workspaceDescription: workspaceDescription.current.value,
      workspaceLogoUrl: workspaceLogoUrl.current.value,
    };
    try {
      const response = await api(`/workspaces`, "POST", workspace, credentials);
      if (response.status === 201) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        throw new Error("Failed to create a new workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Create New Worksapce</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Title</div>
              <input
                className="modal-input"
                type="text"
                placeholder="My Workspace..."
                ref={workspaceTitle}
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Description</div>
              <textarea
                className="modal-input"
                type="text"
                placeholder="This is a description for my workspace..."
                ref={workspaceDescription}
              ></textarea>
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Logo Url</div>
              <input
                className="modal-input"
                type="text"
                placeholder="e.g https://example.com/default-logo.png"
                ref={workspaceLogoUrl}
              />
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Create New Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
