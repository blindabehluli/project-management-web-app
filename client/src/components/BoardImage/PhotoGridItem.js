import React from "react";

export default function PhotoGridItem({
  photo,
  index,
  onPhotoHover,
  onPhotoClick,
  hoveredPhoto,
}) {
  const handleMouseEnter = () => {
    onPhotoHover(photo);
  };

  const handleMouseLeave = () => {
    onPhotoHover(null);
  };

  const handleClick = () => {
    onPhotoClick(photo);
  };

  return (
    <div
      key={`${photo.id}-${index}`}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <img
        className="rounded-lg w-[252px] h-[168px] bg-center bg-cover cursor-pointer"
        src={photo.urls.regular}
        alt={photo.alt_description}
        style={{ opacity: hoveredPhoto === photo ? 0.5 : 1 }}
      />
      {hoveredPhoto === photo && (
        <div className="absolute bottom-0 left-0 bg-gray-400 text-white p-2">
          {photo.alt_description}
        </div>
      )}
    </div>
  );
}
