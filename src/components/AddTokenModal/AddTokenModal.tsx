// src/components/AddTokenModal/AddTokenModal.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Search, X, Star, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Pagination } from "../ui/pagination";
import { SuccessMessage } from "../ui/success-message";
import { usePortfolio } from "../../hooks/usePortfolio";
import { usePagination } from "../../hooks/usePagination";

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTokenModal: React.FC<AddTokenModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    tokens, 
    addToWatchlist, 
    searchResults, 
    trendingTokens, 
    fetchSearchResults, 
    fetchTrendingTokens,
    clearSearchResults 
  } = usePortfolio();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination for search results
  const ITEMS_PER_PAGE = 5;
  const displayResults = searchTerm ? searchResults : trendingTokens;
  
  const {
    currentPage,
    totalPages,
    currentData: paginatedResults,
    goToPage,
    pageInfo,
  } = usePagination({
    data: displayResults,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Memoize the functions to prevent infinite loops
  const memoizedFetchTrendingTokens = useCallback(() => {
    fetchTrendingTokens();
  }, [fetchTrendingTokens]);

  const memoizedFetchSearchResults = useCallback((query: string) => {
    fetchSearchResults(query);
  }, [fetchSearchResults]);

  const memoizedClearSearchResults = useCallback(() => {
    clearSearchResults();
  }, [clearSearchResults]);

  useEffect(() => {
    if (isOpen) {
      memoizedFetchTrendingTokens();
      setSearchTerm("");
      setSelected([]);
    }
  }, [isOpen]); // Remove memoizedFetchTrendingTokens from dependencies to prevent infinite loops

  useEffect(() => {
    if (searchTerm) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        memoizedFetchSearchResults(searchTerm);
        setIsLoading(false);
      }, 500); // Debounce search

      return () => clearTimeout(timer);
    } else {
      memoizedClearSearchResults();
    }
  }, [searchTerm]); // Remove function dependencies to prevent infinite loops

  // Reset pagination when search term changes
  useEffect(() => {
    goToPage(1);
  }, [searchTerm, goToPage]);

  const available = tokens.filter((t) => !t.isInWatchlist);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const newSelection = prev.includes(id) 
        ? prev.filter((x) => x !== id) 
        : [...prev, id];
      console.log(`Token selection updated:`, { id, newSelection });
      return newSelection;
    });
  };

  const handleAdd = async () => {
    if (!selected.length) {
      console.log('No tokens selected');
      return;
    }
    
    console.log('Adding tokens to watchlist:', selected);
    console.log('Selected tokens details:', selected.map(id => {
      const token = displayResults.find(t => t.id === id);
      return token ? { id, name: token.name, symbol: token.symbol } : { id, notFound: true };
    }));
    
    try {
      // Add tokens to watchlist
      addToWatchlist(selected);
      
      // Show success feedback
      const message = selected.length === 1 
        ? `Added ${selected.length} token to watchlist`
        : `Added ${selected.length} tokens to watchlist`;
      
      setSuccessMessage(message);
      setShowSuccess(true);
      console.log(`Successfully added ${selected.length} token(s) to watchlist`);
      
      // Clear selection and close modal
      setSelected([]);
      onClose();
    } catch (error) {
      console.error('Error adding tokens to watchlist:', error);
      // You could add a toast notification here if you have a notification system
    }
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  if (!isOpen) return null;

  const COLORS = {
    panel: "#1C1D20",
    border: "#2A2B2E",
    rowHover: "#202123",
    rowActive: "#2E3426",
    input: "#222326",
    placeholder: "#8C8D92",
    text: "#E7E7EA",
    subtext: "#A1A1A6",
    btn: "#A9E851",
    btnHover: "#98D645",
  };

  const Row: React.FC<{
    id: string;
    name: string;
    symbol: string;
    icon: string;
    isTrending?: boolean;
  }> = ({ id, name, symbol, icon, isTrending }) => {
    const isSelected = selected.includes(id);
    return (
      <div
        onClick={() => toggle(id)}
        className={[
          "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition",
          isSelected ? "" : "hover:bg-[#202123]",
        ].join(" ")}
        style={{ backgroundColor: isSelected ? COLORS.rowActive : "transparent" }}
      >
        <div
          className="w-8 h-8 rounded-md border bg-center bg-cover"
          style={{
            borderColor: COLORS.border,
            backgroundImage: `url(${icon})`,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-medium" style={{ color: COLORS.text }}>
            {name} ({symbol.toUpperCase()})
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isTrending && isSelected && (
            <Star
              className="w-4 h-4"
              color="#FFD54A"
              fill="#FFD54A"
              strokeWidth={0}
            />
          )}
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 18,
              height: 18,
              border: '1px solid #A1A1AA',
              background: isSelected ? COLORS.btn : "transparent",
            }}
          >
            {isSelected ? <Check className="w-3 h-3 text-black" /> : null}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div
          className="w-full rounded-2xl shadow-2xl flex flex-col"
          style={{
            maxWidth: 700,
            maxHeight: "80vh",
            backgroundColor: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          {/* Modal content */}
          <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" color={COLORS.placeholder} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens (e.g., ETH, SOL)..."
                className="w-full rounded-lg pl-9 pr-10 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: COLORS.input,
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.text,
                  caretColor: COLORS.btn,
                  boxShadow: "none",
                }}
              />
              <button
                onClick={onClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md"
                style={{ color: COLORS.subtext }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!searchTerm && (
              <div className="px-4 pt-4 pb-2 text-[12px] font-medium" style={{ color: COLORS.subtext }}>
                Trending
              </div>
            )}

            {isLoading ? (
              <div className="px-4 py-2 text-sm" style={{ color: COLORS.subtext }}>
                Loading...
              </div>
            ) : paginatedResults.length > 0 ? (
              paginatedResults.map((token) => (
                <Row
                  key={token.id}
                  id={token.id}
                  name={token.name}
                  symbol={token.symbol}
                  icon={token.thumb}
                  isTrending={!searchTerm}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-sm" style={{ color: COLORS.subtext }}>
                No tokens found
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={pageInfo.totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div
            className="flex items-center justify-between gap-3 p-4 border-t"
            style={{ borderColor: COLORS.border }}
          >
            {/* Selection summary */}
            <div className="text-sm text-zinc-400">
              {selected.length > 0 ? (
                <span>
                  {selected.length} token{selected.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span>No tokens selected</span>
              )}
            </div>

            <Button
              onClick={handleAdd}
              disabled={!selected.length}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: selected.length ? COLORS.btn : COLORS.border,
                color: selected.length ? "#0c0c0d" : COLORS.subtext,
                cursor: selected.length ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (selected.length) (e.currentTarget.style.backgroundColor = COLORS.btnHover);
              }}
              onMouseLeave={(e) => {
                if (selected.length) (e.currentTarget.style.backgroundColor = COLORS.btn);
              }}
            >
              {selected.length > 0 
                ? `Add ${selected.length} Token${selected.length !== 1 ? 's' : ''} to Watchlist`
                : 'Add to Watchlist'
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <SuccessMessage
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
};