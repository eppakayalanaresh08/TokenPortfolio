// src/api/coinGecko.ts
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
  market_cap_rank?: number;
}

export interface CoinGeckoSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank?: number;
}

export interface CoinGeckoTrendingCoin {
  item: CoinGeckoSearchResult;
}

// Fetch market data for specific coin IDs
export const fetchMarketData = async (coinIds: string[]): Promise<CoinGeckoCoin[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Search for coins
export const searchCoins = async (query: string): Promise<CoinGeckoSearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${query}`);
    
    if (!response.ok) {
      throw new Error('Failed to search coins');
    }
    
    const data = await response.json();
    return data.coins.slice(0, 10); // Return top 10 results
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};

// Fetch trending coins
export const fetchTrendingCoins = async (): Promise<CoinGeckoSearchResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending coins');
    }
    
    const data = await response.json();
    return data.coins.map((coin: CoinGeckoTrendingCoin) => coin.item).slice(0, 6); // Return top 6 trending coins
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw error;
  }
};

// Fetch all coins market data for the watchlist
export const fetchAllMarketData = async (): Promise<CoinGeckoCoin[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};