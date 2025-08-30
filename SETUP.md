# Wallet Connection Setup

## Quick Setup

1. **Get WalletConnect Project ID**:
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create project and copy Project ID

2. **Update Configuration**:
   - Edit `src/lib/wagmi.ts`
   - Replace `YOUR_PROJECT_ID` with your actual Project ID

3. **Install Dependencies**:
   ```bash
   npm install wagmi viem @rainbow-me/rainbowkit
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Features

- ✅ Connect any Web3 wallet (MetaMask, WalletConnect, etc.)
- ✅ Display wallet address and ETH balance
- ✅ Persistent connection across page refreshes
- ✅ Watchlist data saved to localStorage
- ✅ Support for multiple chains (Ethereum, Polygon, etc.)

## Usage

1. Click "Connect Wallet" button
2. Select your preferred wallet
3. Approve connection
4. View your wallet address and balance
5. Your watchlist persists automatically

## Troubleshooting

- Ensure Project ID is set correctly
- Check browser console for errors
- Make sure wallet extension is installed
- Try refreshing the page if connection fails






