import React from "react";
import { Button } from "./button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}) => {
  // Ensure currentPage is within valid bounds
  // This component always shows pagination, even with 0 items or 1 page
  const validCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const validTotalPages = Math.max(1, totalPages);
  
  const startItem = totalItems > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(validCurrentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= validTotalPages && page !== validCurrentPage) {
      onPageChange(page);
    }
  };

  // Always show pagination, even with 0 items or just 1 page
  // This ensures pagination controls are always visible for better UX
  return (
    <div className={`${className}`}>
      {/* Main pagination controls */}
      <div className="flex items-center justify-between">
        {/* Results info - left side */}
        <div className="text-zinc-400 text-sm">
          {totalItems > 0 ? `${startItem} — ${endItem} of ${totalItems} results` : '0 results'}
        </div>

        {/* Page info and navigation - right side */}
        <div className="flex items-center gap-4">
          {/* Page info */}
          <span className="text-zinc-400 text-sm">
            {validCurrentPage} of {validTotalPages} pages
          </span>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage <= 1}
              className="px-3 py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:text-zinc-100 hover:bg-[#ffffff0a]"
            >
              Prev
            </Button>

            {/* Next button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage >= validTotalPages}
              className="px-3 py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:text-zinc-100 hover:bg-[#ffffff0a]"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Helpful message when there are fewer items than itemsPerPage */}
      {totalItems > 0 && totalItems < itemsPerPage && (
        <div className="mt-2 text-center">
          <span className="text-xs text-zinc-500">
            Showing all {totalItems} items (pagination ready for more items)
          </span>
        </div>
      )}

      {/* Helpful message when there are exactly itemsPerPage items (1 full page) */}
      {totalItems > 0 && totalItems === itemsPerPage && (
        <div className="mt-2 text-center">
          <span className="text-xs text-zinc-500">
            Showing all {totalItems} items (pagination ready for more items)
          </span>
        </div>
      )}

      {/* Helpful message when there are 0 items */}
      {totalItems === 0 && (
        <div className="mt-2 text-center">
          <span className="text-xs text-zinc-500">
            No items yet (pagination ready for when items are added)
          </span>
        </div>
      )}
    </div>
  );
};
