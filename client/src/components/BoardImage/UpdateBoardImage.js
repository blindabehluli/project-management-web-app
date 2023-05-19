import { api } from "../../utils/apiHelper";

export const handlePhotoClick = async (
  workspaceId,
  board,
  photo,
  onClose,
  credentials
) => {
  try {
    const response = await api(
      `/workspaces/${workspaceId}/boards/${board.id}/images`,
      "PUT",
      { boardImageUrl: photo.urls.regular },
      credentials
    );

    if (response.status === 200) {
      onClose();
    } else if (response.status === 400) {
      const data = await response.json();
      console.log("Error:", data.errors);
    } else {
      throw new Error("Failed to update the board image");
    }
  } catch (error) {
    console.error(error);
  }
};
