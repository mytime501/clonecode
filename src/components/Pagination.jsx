// components/Pagination.js

import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="pagination-arrow"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
      >
        &lt; Prev
      </button>

      <span>
        {currentPage} / {totalPages}
      </span>

      <button
        className="pagination-arrow"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
      >
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
