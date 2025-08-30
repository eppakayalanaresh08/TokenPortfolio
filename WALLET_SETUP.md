# Wallet Connection Setup Guide

## Overview
This project now integrates wallet connection using **wagmi + RainbowKit** for a seamless Web3 experience.

## Features Implemented

### ✅ Wallet Connection
- **Connect Wallet Button**: Click to open RainbowKit modal
- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, etc.
- **Chain Support**: Ethereum, Polygon, Optimism, Arbitrum, Base, Zora
- **Auto-reconnection**: Remembers wallet connection on page refresh

### ✅ Connected State Display
- **Wallet Address**: Shows truncated address (0x1234...5678)
- **ETH Balance**: Real-time balance display
- **Connection Status**: Green dot indicator
- **Copy Address**: Click to copy full address
- **Disconnect**: Easy wallet disconnection

### ✅ Data Persistence
- **Watchlist**: Automatically restores from localStorage
- **Wallet State**: Remembers connection across sessions
- **Portfolio Data**: Maintains token holdings and preferences

## Setup Requirements

### 1. WalletConnect Project ID
You need to get a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/):

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up/Login
3. Create a new project
4. Copy the Project ID
5. Update `src/lib/wagmi.ts`:

```typescript
export const config = getDefaultConfig({
  appName: 'Token Portfolio',
  projectId: 'YOUR_ACTUAL_PROJECT_ID_HERE', // Replace this
  chains: [mainnet, polygon, optimism, arbitrum, base, zora],
  ssr: true,
});
```

### 2. Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

Then update the config:

```typescript
projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
```

## How It Works

### Connection Flow
1. User clicks "Connect Wallet"
2. RainbowKit modal opens with wallet options
3. User selects and connects their wallet
4. Wallet address and balance are displayed
5. Connection state is saved to Redux + localStorage

### Data Persistence
- **Watchlist**: Stored in localStorage as `tokenPortfolio`
- **Wallet Connection**: Remembers connected address
- **Auto-restore**: Automatically loads saved data on page refresh

### State Management
- **Redux Store**: Manages wallet connection state
- **Wallet Context**: Provides wallet functions to components
- **Local Storage**: Persists data across browser sessions

## Supported Wallets

### Desktop
- MetaMask
- WalletConnect
- Coinbase Wallet
- Rainbow
- Trust Wallet

### Mobile
- MetaMask Mobile
- WalletConnect
- Rainbow Mobile
- Trust Wallet Mobile
- Coinbase Wallet Mobile

## Chain Support

Currently supports:
- **Ethereum Mainnet** (ETH)
- **Polygon** (MATIC)
- **Optimism** (OP)
- **Arbitrum** (ARB)
- **Base** (ETH)
- **Zora** (ETH)

## Troubleshooting

### Common Issues

1. **"Project ID not found"**
   - Ensure you've set the correct Project ID in `wagmi.ts`
   - Check that the Project ID is valid in WalletConnect Cloud

2. **Wallet not connecting**
   - Check browser console for errors
   - Ensure wallet extension is installed and unlocked
   - Try refreshing the page

3. **Balance not showing**
   - Ensure wallet is connected to supported chain
   - Check if wallet has ETH/tokens on that chain

4. **LocalStorage errors**
   - Check browser storage permissions
   - Clear browser data if needed

### Development Tips

- Use browser dev tools to monitor Redux state
- Check Network tab for API calls
- Monitor Console for any errors
- Test with different wallet types

## Testing

### Manual Testing
1. **Connect Wallet**: Click button, select wallet, approve connection
2. **Display State**: Verify address and balance are shown
3. **Disconnect**: Click disconnect, verify state clears
4. **Refresh**: Reload page, verify wallet state restores
5. **Watchlist**: Add tokens, refresh page, verify persistence

### Automated Testing
- Wallet connection state management
- Redux store integration
- LocalStorage persistence
- Error handling scenarios

## Security Considerations

- **No Private Keys**: Never store or transmit private keys
- **Read-Only**: Only reads wallet address and balance
- **User Consent**: All connections require user approval
- **Secure Storage**: Uses browser's secure localStorage

## Future Enhancements

- **Multi-chain Portfolio**: Support for tokens across different chains
- **Transaction History**: View past transactions
- **Gas Estimation**: Calculate transaction costs
- **NFT Support**: Display NFT collections
- **DeFi Integration**: Connect to DeFi protocols

## Support

For issues or questions:
1. Check browser console for errors
2. Verify WalletConnect Project ID is correct
3. Ensure all dependencies are installed
4. Check network connectivity

---

**Note**: This integration provides a secure, user-friendly way to connect Web3 wallets while maintaining all existing portfolio functionality.






