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
        className="border-2 border-gray-300 text-black py-2 px-3 rounded-md"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search image.."
      />
      <img
        className="w-[30px] h-[30px] opacity-50 cursor-pointer hover:scale-110 transition ease-in-out duration-200"
        src="https://img.uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.png"
        alt="search"
        onClick={() => onSearch(searchQuery)}
      ></img>
    </div>
  );
}
