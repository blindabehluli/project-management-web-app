// PhotoGrid.js
import React from "react";
import PhotoGridItem from "./PhotoGridItem";

export default function PhotoGrid({
  photos,
  onPhotoHover,
  onPhotoClick,
  hoveredPhoto,
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo, index) => (
        <PhotoGridItem
          key={`${photo.id}-${index}`}
          photo={photo}
          index={index}
          onPhotoHover={onPhotoHover}
          onPhotoClick={onPhotoClick}
          hoveredPhoto={hoveredPhoto}
        />
      ))}
    </div>
  );
}
