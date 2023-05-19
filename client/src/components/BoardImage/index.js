import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import SearchBar from "./SearchBar";
import PhotoGrid from "./PhotoGrid";
import LoadMoreButton from "./LoadMoreButton";
import DeleteBoardImage from "./DeleteBoardImage";
import { handlePhotoClick } from "./UpdateBoardImage";
import UserContext from "../../context/UserContext";

const AccessKey = "j_wh1cRHUm3GFGOOjLhnhtGp5squVwmbSC3zbfm_2pI";
const perPage = 9; // Number of photos to fetch per page

export default function BoardImage({ board, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredPhoto, setHoveredPhoto] = useState(null); // Track the currently hovered photo
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const modalRef = useRef(null);
  const searchQueryRef = useRef(""); // Use ref to track the search query

  const { workspaceId } = useParams();
  const { credentials } = useContext(UserContext);

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

  const fetchPhotos = useCallback(() => {
    setIsLoading(true);
    const apiUrl = `https://api.unsplash.com/search/photos?&query=${encodeURIComponent(
      searchQueryRef.current || "wallpaper"
    )}&per_page=${perPage}&page=${currentPage}`; // Use currentPage in the API URL
    console.log(apiUrl);

    fetch(apiUrl, {
      headers: {
        Authorization: `Client-ID ${AccessKey}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Increment the current page when the button is clicked
  };

  const handleSearch = (searchQuery) => {
    searchQueryRef.current = searchQuery;
    setPhotos([]);
    fetchPhotos();
  };

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handlePhotoHover = (photo) => {
    setHoveredPhoto(photo);
  };

  return (
    <div className="overlay py-8">
      <div className="bg-image-modal rounded-lg" ref={modalRef}>
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between">
            <SearchBar onSearch={handleSearch} />
            <DeleteBoardImage
              workspaceId={workspaceId}
              board={board}
              onClose={onClose}
            />
          </div>
          <PhotoGrid
            photos={photos}
            onPhotoHover={handlePhotoHover}
            hoveredPhoto={hoveredPhoto}
            onPhotoClick={() =>
              handlePhotoClick(
                workspaceId,
                board,
                hoveredPhoto,
                onClose,
                credentials
              )
            }
          />
          {isLoading && <p>Loading...</p>}
          <LoadMoreButton onLoadMore={handleLoadMore} />
        </div>
      </div>
    </div>
  );
}
