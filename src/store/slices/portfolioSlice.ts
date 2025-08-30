import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMarketData, searchCoins, fetchTrendingCoins, fetchAllMarketData } from '../../api/coinGecko';

export interface CoinGeckoSearchResult {
  id: string;
  symbol: string;
  name: string;
  thumb: string; // API returns 'thumb' not 'image'
  market_cap_rank?: number; // Make optional to match API response
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  holdings?: number;
  value?: number;
}

export interface PortfolioState {
  tokens: Token[];
  watchlist: Token[];
  searchResults: CoinGeckoSearchResult[];
  trendingTokens: CoinGeckoSearchResult[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  connectedWallet: string | null;
}

const initialState: PortfolioState = {
  tokens: [],
  watchlist: [],
  searchResults: [],
  trendingTokens: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  connectedWallet: null,
};

// Load portfolio data from localStorage
const loadFromLocalStorage = (): Partial<PortfolioState> => {
  try {
    const saved = localStorage.getItem('tokenPortfolio');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        watchlist: parsed.watchlist || [],
        connectedWallet: parsed.connectedWallet || null,
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return {};
};

// Save portfolio data to localStorage
const saveToLocalStorage = (state: PortfolioState) => {
  try {
    const dataToSave = {
      watchlist: state.watchlist,
      connectedWallet: state.connectedWallet,
    };
    localStorage.setItem('tokenPortfolio', JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize market data
export const initializeMarketData = createAsyncThunk(
  'portfolio/initializeMarketData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllMarketData();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch market data');
    }
  }
);

// Fetch search results
export const fetchSearchResults = createAsyncThunk(
  'portfolio/fetchSearchResults',
  async (query: string, { rejectWithValue }) => {
    try {
      const data = await searchCoins(query);
      return data;
    } catch (error) {
      return rejectWithValue('Failed to search tokens');
    }
  }
);

// Fetch trending tokens
export const fetchTrendingTokens = createAsyncThunk(
  'portfolio/fetchTrendingTokens',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchTrendingCoins();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch trending tokens');
    }
  }
);

// Refresh prices
export const refreshPrices = createAsyncThunk(
  'portfolio/refreshPrices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { portfolio: PortfolioState };
      const watchlistIds = state.portfolio.watchlist.map(token => token.id);
      
      if (watchlistIds.length === 0) {
        console.log('No tokens in watchlist to refresh');
        return [];
      }
      
      console.log('Refreshing prices for tokens:', watchlistIds);
      const data = await fetchMarketData(watchlistIds);
      
      // Filter to only include tokens in watchlist
      const watchlistData = data.filter(token => watchlistIds.includes(token.id));
      console.log('Updated watchlist data:', watchlistData);
      
      return watchlistData;
    } catch (error) {
      return rejectWithValue('Failed to refresh prices');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    ...initialState,
    ...loadFromLocalStorage(),
  },
  reducers: {
    addToWatchlist: (state, action: PayloadAction<string[]>) => {
      const tokenIds = action.payload;
      console.log('Adding tokens to watchlist:', tokenIds);
      
      // Check for existing tokens first
      const existingIds = new Set(state.watchlist.map(token => token.id));
      const newTokens: Token[] = [];
      
      // Search in main tokens list
      for (const id of tokenIds) {
        if (existingIds.has(id)) {
          console.log(`Token ${id} already in watchlist, skipping`);
          continue;
        }
        
        let token: Token | undefined;
        
        // Search in state.tokens
        token = state.tokens.find(t => t.id === id);
        
        // Search in search results if not found in tokens
        if (!token) {
          const searchResult = state.searchResults.find(sr => sr.id === id);
          if (searchResult) {
            token = {
              id: searchResult.id,
              symbol: searchResult.symbol,
              name: searchResult.name,
              image: searchResult.thumb, // Use thumb from search result
              current_price: 0,
              market_cap: 0,
              market_cap_rank: searchResult.market_cap_rank || 0,
              price_change_percentage_24h: 0,
              sparkline_in_7d: { price: [] },
            };
          }
        }
        
        // Search in trending tokens if not found yet
        if (!token) {
          const trendingResult = state.trendingTokens.find(tt => tt.id === id);
          if (trendingResult) {
            token = {
              id: trendingResult.id,
              symbol: trendingResult.symbol,
              name: trendingResult.name,
              image: trendingResult.thumb, // Use thumb from trending result
              current_price: 0,
              market_cap: 0,
              market_cap_rank: trendingResult.market_cap_rank || 0,
              price_change_percentage_24h: 0,
              sparkline_in_7d: { price: [] },
            };
          }
        }
        
        if (token && token.id && token.name && token.symbol) {
          console.log(`Found token ${token.id}, adding to watchlist`);
          newTokens.push(token);
          existingIds.add(token.id);
        } else {
          console.log(`Could not find token with id: ${id}`);
        }
      }
      
      // Add new tokens to watchlist
      if (newTokens.length > 0) {
        state.watchlist.push(...newTokens);
        console.log(`Added ${newTokens.length} tokens to watchlist`);
        
        // Remove added tokens from search results and trending to avoid duplicates
        const newTokenIds = new Set(newTokens.map(t => t.id));
        state.searchResults = state.searchResults.filter(sr => !newTokenIds.has(sr.id));
        state.trendingTokens = state.trendingTokens.filter(tt => !newTokenIds.has(tt.id));
        
        // Ensure watchlist has no duplicates
        const uniqueWatchlist: Token[] = [];
        const seenIds = new Set<string>();
        for (const token of state.watchlist) {
          if (!seenIds.has(token.id)) {
            uniqueWatchlist.push(token);
            seenIds.add(token.id);
          }
        }
        state.watchlist = uniqueWatchlist;
        
        console.log(`Watchlist updated. Total tokens: ${state.watchlist.length}`);
      }
      
      saveToLocalStorage(state);
    },
    
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.watchlist = state.watchlist.filter(token => token.id !== action.payload);
      saveToLocalStorage(state);
    },
    
    updateHoldings: (state, action: PayloadAction<{ tokenId: string; holdings: number }>) => {
      const { tokenId, holdings } = action.payload;
      const token = state.watchlist.find(t => t.id === tokenId);
      if (token) {
        token.holdings = holdings;
        token.value = holdings * token.current_price;
        saveToLocalStorage(state);
      }
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    setConnectedWallet: (state, action: PayloadAction<string>) => {
      state.connectedWallet = action.payload;
      saveToLocalStorage(state);
    },
    
    clearConnectedWallet: (state) => {
      state.connectedWallet = null;
      saveToLocalStorage(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeMarketData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeMarketData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokens = action.payload;
        state.lastUpdated = new Date().toLocaleTimeString();
      })
      .addCase(initializeMarketData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTrendingTokens.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingTokens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trendingTokens = action.payload;
      })
      .addCase(fetchTrendingTokens.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshPrices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0) {
          // Update watchlist tokens with new prices
          const updatedTokens = action.payload;
          state.watchlist = state.watchlist.map(watchlistToken => {
            const updatedToken = updatedTokens.find(t => t.id === watchlistToken.id);
            if (updatedToken) {
              return {
                ...watchlistToken,
                current_price: updatedToken.current_price,
                price_change_percentage_24h: updatedToken.price_change_percentage_24h,
                sparkline_in_7d: updatedToken.sparkline_in_7d,
                value: watchlistToken.holdings ? watchlistToken.holdings * updatedToken.current_price : undefined,
              };
            }
            return watchlistToken;
          });
          state.lastUpdated = new Date().toLocaleTimeString();
        }
      })
      .addCase(refreshPrices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  updateHoldings,
  clearSearchResults,
  setConnectedWallet,
  clearConnectedWallet,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;