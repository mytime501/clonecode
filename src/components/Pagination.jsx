import React from "react";

const Pagination = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        Previous
      </button>
      <span>Page {currentPage}</span>
      <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
    </div>
  );
};

export default Pagination;
