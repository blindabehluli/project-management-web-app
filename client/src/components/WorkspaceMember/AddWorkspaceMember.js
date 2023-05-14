import { useRef, useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import ErrorsDisplay from "../ErrorsDisplay";
import { useNavigate, useParams } from "react-router-dom";

function AddWorkspaceMember({ onClose }) {
  const modalRef = useRef(null);
  const emailRef = useRef(null);
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

  useEffect(() => {
    setErrors([]); // Reset errors when the modal is reopened
    emailRef.current.value = ""; // Reset form values
    roleRef.current.value = "";
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const member = {
      email: emailRef.current.value,
      role: roleRef.current.value
    };
    try {
      const response = await api(
        `/workspaces/${workspaceId}/members`,
        "POST",
        member,
        credentials
      );
      if (response.status === 201) {
        onClose(); // Close the modal after successful submission
      } else if (response.status === 400) {
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        navigate("/forbidden");
      } else if (response.status === 500) {
        navigate("/error");
      } else {
        throw new Error("Failed to add workspace member");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-add-new">
          <div className="modal-add-new mb-4">Add Workspace Member</div>
          <ErrorsDisplay errors={errors} />
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Email</div>
              <input
                className="modal-input"
                type="email"
                placeholder="example@example.com"
                ref={emailRef}
                required
              />
            </div>
            <div className="modal-input-wrapper">
              <div className="modal-input-label">Role</div>
              <select className="modal-input" ref={roleRef}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="modal-input-wrapper">
              <button type="submit" className="button button-small">
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddWorkspaceMember;