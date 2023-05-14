import { useRef, useEffect, useState, useContext, useCallback } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useParams, useNavigate } from "react-router-dom";

function EditWorkspaceMember({ memberId, onClose }) {
  const modalRef = useRef(null);
  const roleRef = useRef(null);

  const [errors, setErrors] = useState([]);

  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams();
  const navigate = useNavigate();

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

  const fetchMemberData = useCallback(async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/members/${memberId}`,
        "GET",
        null,
        credentials
      );
      if (response.status === 200) {
        const { role } = await response.json();
        roleRef.current.value = role;
      } else {
        throw new Error("Failed to fetch member data");
      }
    } catch (error) {
      console.error(error);
    }
  }, [workspaceId, memberId, credentials]);

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    fetchMemberData(); // Fetch and populate member data when the modal is opened
  }, [fetchMemberData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const member = {
      role: roleRef.current.value,
    };
    try {
      const response = await api(
        `/workspaces/${workspaceId}/members/${memberId}`,
        "PUT",
        member,
        credentials
      );
      if (response.status === 204) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to update workspace member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/members/${memberId}`,
        "DELETE",
        null,
        credentials
      );
      if (response.status === 204) {
        onClose(); // Close the modal after successful deletion
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to delete workspace member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Edit Workspace Member</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Role</div>
              <select className="modal-input" ref={roleRef} required>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                className="button button-small mr-4"
                onClick={handleSubmit}
              >
                Update Role
              </button>
              <button
                className="button button-danger button-small"
                onClick={handleDelete}
              >
                Delete Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditWorkspaceMember;
