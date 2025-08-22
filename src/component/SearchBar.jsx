import React from "react";

function SearchBar({ searchTerm, onSearchChange }) {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full flex justify-center">
      <input
        type="text"
        placeholder="원하시는 것을 검색해주세요."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
      />
    </div>
  );
}

export default SearchBar;
