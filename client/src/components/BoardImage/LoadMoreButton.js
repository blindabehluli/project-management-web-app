import React from "react";

export default function LoadMoreButton({ onLoadMore }) {
  return (
    <div className="flex justify-center p-4">
      <button
        className="text-black bg-white border border-[#EAEAEA] hover:border-black py-2 px-3 rounded-lg transition ease-in-out duration-200"
        onClick={onLoadMore}
      >
        Load More
      </button>
    </div>
  );
}
