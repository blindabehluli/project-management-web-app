import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { api } from "../../utils/apiHelper";
import { useParams } from "react-router-dom";

export default function DeleteTask({ onClose, board, task }) {
  const { credentials } = useContext(UserContext);
  const { workspaceId } = useParams(); // Access the workspaceId from params

  const handleDelete = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/columns/${task.columnId}/tasks/${task.id}`,
        "DELETE",
        null,
        credentials
      );

      if (response.status === 204) {
        onClose(); // Close the modal after successful deletion
      } else {
        throw new Error("Failed to delete the task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      className="dropdown-text dropdown-text-warning"
      onClick={handleDelete}
    >
      Delete Task
    </button>
  );
}