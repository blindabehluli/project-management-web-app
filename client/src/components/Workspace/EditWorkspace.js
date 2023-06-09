import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useNavigate } from "react-router-dom";
import useClickOutside from "../../hooks/useClickOutside";

function EditWorkspace({ workspaceId, onClose, setWorkspaces }) {
  const modalRef = useRef(null);
  const workspaceTitle = useRef(null);
  const workspaceDescription = useRef(null);
  const workspaceLogoUrl = useRef(null);

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const { credentials } = useContext(UserContext);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    setErrors([]);
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
          workspaceTitle.current.value = workspace.workspaceTitle;
          workspaceDescription.current.value = workspace.workspaceDescription;
          workspaceLogoUrl.current.value = workspace.workspaceLogoUrl;
        } else if (response.status === 403) {
          navigate("/forbidden");
        } else if (response.status === 500) {
          navigate("/error");
        } else {
          throw new Error("Failed to fetch the workspace details");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchWorkspaceDetails();
  }, [workspaceId, credentials, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workspace = {
      workspaceTitle: workspaceTitle.current.value,
      workspaceDescription: workspaceDescription.current.value,
      workspaceLogoUrl: workspaceLogoUrl.current.value,
    };
    try {
      const response = await api(
        `/workspaces/${workspaceId}`,
        "PUT",
        workspace,
        credentials
      );
      if (response.status === 204) {
        onClose();
        // Update the existing workspace in the state
        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.map((prevWorkspace) =>
            prevWorkspace.id === workspaceId
              ? { ...prevWorkspace, ...workspace }
              : prevWorkspace
          )
        );
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to update the workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}`,
        "DELETE",
        null,
        credentials
      );
      if (response.status === 204) {
        onClose();
        const newWorkspace = await response.json();
        setWorkspaces((prevWorkspaces) => [...prevWorkspaces, newWorkspace]);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to delete the workspace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Edit Workspace</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6">
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
                className="text-area"
                type="text"
                rows="4"
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
            <div className="flex justify-between">
              <button
                className="button button-small mr-4"
                onClick={handleSubmit}
              >
                Update Workspace
              </button>
              <button
                className="button button-danger button-small"
                onClick={handleDelete}
              >
                Delete Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditWorkspace;
