import React from "react";

export default function LoadMoreButton({ onLoadMore }) {
  return (
    <div className="flex justify-center p-4">
      <button
        className="button" style={{width: "auto"}}
        onClick={onLoadMore}
      >
        Load More
      </button>
    </div>
  );
}
