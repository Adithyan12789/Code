/* eslint-disable no-unused-vars */
import React from "react";
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconChevronsLeft, 
  IconChevronsRight,
  IconPlayerTrackPrev,
  IconPlayerTrackNext
} from "@tabler/icons-react";

export default function Pagination(props) {
  const { 
    type, 
    setPage, 
    userTotal = 0, 
    rowsPerPage = 10, 
    activePage = 1,
    className = "",
    variant = "default", // 'default' or 'minimal'
    showInfo = true,
    showRowsSelector = false,
    onRowsPerPageChange
  } = props;

  const totalPages = Math.ceil(userTotal / rowsPerPage) || 1;
  const startItem = Math.min((activePage - 1) * rowsPerPage + 1, userTotal);
  const endItem = Math.min(activePage * rowsPerPage, userTotal);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const handleRowsPerPage = (value) => {
    if (onRowsPerPageChange) {
      onRowsPerPageChange(Number(value));
      setPage(1);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (activePage > 3) pages.push('...');
    
    for (let i = Math.max(2, activePage - 1); i <= Math.min(totalPages - 1, activePage + 1); i++) {
      pages.push(i);
    }
    
    if (activePage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  if (userTotal <= 0) return null;

  if (variant === "minimal") {
    return (
      <div className={`flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg ${className}`}>
        {showInfo && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{startItem}-{endItem}</span> of{" "}
            <span className="font-semibold text-gray-800">{userTotal}</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              activePage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <IconChevronLeft size={20} />
          </button>

          <div className="flex items-center space-x-1 text-sm font-medium">
            <span className="text-gray-600">Page</span>
            <span className="text-gray-800">{activePage}</span>
            <span className="text-gray-600">of</span>
            <span className="text-gray-800">{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className={`p-2 rounded-lg transition-all duration-200 ${
              activePage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm">
        {/* Left Info Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {showInfo && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{startItem}-{endItem}</span> of{" "}
              <span className="font-semibold text-gray-800">{userTotal}</span> items
            </div>
          )}

          {showRowsSelector && onRowsPerPageChange && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => handleRowsPerPage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">entries</span>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={activePage === 1}
              className={`p-2 rounded-lg transition-all duration-200 ${
                activePage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              title="First page"
            >
              <IconChevronsLeft size={18} />
            </button>

            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
              className={`p-2 rounded-lg transition-all duration-200 ${
                activePage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              title="Previous page"
            >
              <IconChevronLeft size={18} />
            </button>
          </div>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`min-w-[42px] h-10 rounded-lg transition-all duration-200 font-medium ${
                  page === '...'
                    ? "text-gray-500 cursor-default"
                    : page === activePage
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
              className={`p-2 rounded-lg transition-all duration-200 ${
                activePage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              title="Next page"
            >
              <IconChevronRight size={18} />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={activePage === totalPages}
              className={`p-2 rounded-lg transition-all duration-200 ${
                activePage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              title="Last page"
            >
              <IconChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}