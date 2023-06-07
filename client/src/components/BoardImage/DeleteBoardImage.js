// DeleteBoardImage.js
import React, { useContext } from "react";
import { api } from "../../utils/apiHelper";
import UserContext from "../../context/UserContext";

export default function DeleteBoardImage({ workspaceId, board, onClose }) {
  const { credentials } = useContext(UserContext);

  const handleDeleteBoardImage = async () => {
    try {
      const response = await api(
        `/workspaces/${workspaceId}/boards/${board.id}/images`,
        "PUT",
        { boardImageUrl: "" },
        credentials
      );

      if (response.status === 200) {
        onClose(); // Close the modal after successful update
        window.location.reload();
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
      } else {
        throw new Error("Failed to update the board image");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className="button-cancel hover:primary-700" style={{width: "auto"}}
      onClick={handleDeleteBoardImage}
    >
      Remove Background
    </button>
  );
}
