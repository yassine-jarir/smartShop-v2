import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  // Show max 5 pages at a time
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(0, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="pagination-btn"
      >
        Précédent
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="pagination-btn"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
