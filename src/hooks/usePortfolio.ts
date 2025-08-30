// src/hooks/usePortfolio.ts
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/types';
import {
  addToWatchlist,
  removeFromWatchlist,
  updateHoldings,
  refreshPrices,
  fetchSearchResults,
  fetchTrendingTokens,
  initializeMarketData,
  clearSearchResults,
  setConnectedWallet,
  clearConnectedWallet,
} from '../store/slices/portfolioSlice';

export const usePortfolio = () => {
  const dispatch = useDispatch<AppDispatch>();
  const portfolio = useSelector((state: RootState) => state.portfolio);

  // Calculate total value from watchlist
  const totalValue = portfolio.watchlist.reduce((total, token) => {
    const value = (token.holdings || 0) * (token.current_price || 0);
    return total + value;
  }, 0);

  const addToWatchlistAction = useCallback(
    (tokenIds: string[]) => dispatch(addToWatchlist(tokenIds)),
    [dispatch]
  );

  const removeFromWatchlistAction = useCallback(
    (tokenId: string) => dispatch(removeFromWatchlist(tokenId)),
    [dispatch]
  );

  const updateHoldingsAction = useCallback(
    (tokenId: string, holdings: number) => dispatch(updateHoldings({ tokenId, holdings })),
    [dispatch]
  );

  const refreshPricesAction = useCallback(
    () => dispatch(refreshPrices()),
    [dispatch]
  );

  const fetchSearchResultsAction = useCallback(
    (query: string) => dispatch(fetchSearchResults(query)),
    [dispatch]
  );

  const fetchTrendingTokensAction = useCallback(
    () => dispatch(fetchTrendingTokens()),
    [dispatch]
  );

  const initializeMarketDataAction = useCallback(
    () => dispatch(initializeMarketData()),
    [dispatch]
  );

  const clearSearchResultsAction = useCallback(
    () => dispatch(clearSearchResults()),
    [dispatch]
  );

  const setConnectedWalletAction = useCallback(
    (address: string) => dispatch(setConnectedWallet(address)),
    [dispatch]
  );

  const clearConnectedWalletAction = useCallback(
    () => dispatch(clearConnectedWallet()),
    [dispatch]
  );

  return {
    // State with defaults
    watchlist: portfolio.watchlist || [],
    tokens: portfolio.tokens || [],
    searchResults: portfolio.searchResults || [],
    trendingTokens: portfolio.trendingTokens || [],
    isLoading: portfolio.isLoading || false,
    error: portfolio.error || null,
    lastUpdated: portfolio.lastUpdated || 'Never',
    connectedWallet: portfolio.connectedWallet || null,
    
    // Calculated values
    totalValue: totalValue || 0,
    
    // Actions
    addToWatchlist: addToWatchlistAction,
    removeFromWatchlist: removeFromWatchlistAction,
    updateHoldings: updateHoldingsAction,
    refreshPrices: refreshPricesAction,
    fetchSearchResults: fetchSearchResultsAction,
    fetchTrendingTokens: fetchTrendingTokensAction,
    initializeMarketData: initializeMarketDataAction,
    clearSearchResults: clearSearchResultsAction,
    setConnectedWallet: setConnectedWalletAction,
    clearConnectedWallet: clearConnectedWalletAction,
  };
};