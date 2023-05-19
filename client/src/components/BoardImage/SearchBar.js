import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex space-x-4 items-center">
      <input
        type="text"
        className="border border-black text-black py-2 px-3 rounded-md"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search image.."
      />
      <img
        className="w-[28px] h-[28px] cursor-pointer hover:scale-110 transition ease-in-out duration-200"
        src="https://img.uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.png"
        alt="search"
        onClick={() => onSearch(searchQuery)}
      ></img>
    </div>
  );
}
