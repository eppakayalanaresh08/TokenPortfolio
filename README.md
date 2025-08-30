# TokenPortfolio 📊

A modern, responsive cryptocurrency portfolio tracking application built with React, TypeScript, and Tailwind CSS. Track your crypto investments, view portfolio breakdowns, and manage your watchlist with real-time data.

## ✨ Features

### 🎯 Portfolio Management
- **Portfolio Overview**: View total portfolio value with real-time calculations
- **Donut Chart Visualization**: Beautiful chart showing portfolio breakdown by token
- **Holdings Management**: Edit token holdings with inline editing
- **Value Tracking**: Real-time calculation of token values

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices with horizontal scrolling tables
- **Desktop Experience**: Full-featured table view with all columns
- **Adaptive Layout**: Responsive design that works on all screen sizes

### 🔄 Real-Time Data
- **Live Prices**: Real-time cryptocurrency price updates
- **24h Changes**: Track price movements and percentage changes
- **Sparkline Charts**: 7-day price trend visualization
- **Auto-Refresh**: Manual refresh button for latest data

### 📋 Watchlist Management
- **Add Tokens**: Easily add new cryptocurrencies to your watchlist
- **Remove Tokens**: Remove tokens you no longer want to track
- **Edit Holdings**: Update token quantities with inline editing
- **Pagination**: Navigate through large watchlists efficiently

## 🏗️ Project Structure

```
TokenPortfolio/
├── src/
│   ├── api/
│   │   └── coinGecko.ts          # CoinGecko API integration
│   ├── components/
│   │   ├── AddTokenModal/        # Add new tokens modal
│   │   ├── DonutChart/           # Portfolio breakdown chart
│   │   ├── EditHoldingsModal/    # Edit token holdings
│   │   ├── Sparkline/            # Price trend charts
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx        # Button components
│   │   │   ├── card.tsx          # Card components
│   │   │   ├── pagination.tsx    # Pagination controls
│   │   │   ├── success-message.tsx # Success notifications
│   │   │   └── table.tsx         # Table components
│   │   └── WalletConnect/        # Wallet connection
│   ├── contexts/
│   │   └── WalletContext.tsx     # Wallet state management
│   ├── hooks/
│   │   ├── usePagination.ts      # Pagination logic
│   │   └── usePortfolio.ts       # Portfolio data management
│   ├── lib/
│   │   ├── utils.ts              # Utility functions
│   │   └── wagmi.ts              # Web3 configuration
│   ├── screens/
│   │   └── Home/
│   │       ├── Home.tsx          # Main home screen
│   │       └── sections/
│   │           ├── PortfolioSection/    # Portfolio overview
│   │           └── WatchlistSection/    # Token watchlist
│   ├── store/
│   │   ├── slices/
│   │   │   └── portfolioSlice.ts # Redux portfolio state
│   │   ├── store.ts              # Redux store configuration
│   │   └── types.ts              # TypeScript type definitions
│   ├── App.tsx                   # Main application component
│   └── index.tsx                 # Application entry point
├── public/                       # Static assets
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite build configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Technologies Used

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

### State Management
- **Redux Toolkit**: Predictable state management
- **React Context**: Local state management for wallet

### UI Components
- **Recharts**: Beautiful chart components (DonutChart, Sparkline)
- **Lucide React**: Modern icon library
- **Custom UI Components**: Reusable button, card, and table components

### API Integration
- **CoinGecko API**: Real-time cryptocurrency data
- **Fetch API**: Modern HTTP requests

### Web3 (Optional)
- **Wagmi**: React hooks for Ethereum
- **WalletConnect**: Multi-wallet support

## 📱 Mobile-First Design

### Responsive Breakpoints
- **Mobile**: `< 768px` - Horizontal scrolling tables, compact layout
- **Tablet**: `768px - 1024px` - Adaptive layout
- **Desktop**: `> 1024px` - Full table view with all columns

### Mobile Features
- **Horizontal Scrolling**: Tables scroll horizontally on mobile
- **Touch-Friendly**: Optimized touch targets and interactions
- **Compact Layout**: Efficient use of mobile screen space
- **Responsive Charts**: DonutChart adapts to screen size

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd TokenPortfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_COINGECKO_API_KEY=your_api_key_here
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
```

## 📊 API Integration

### CoinGecko API
- **Endpoint**: `https://api.coingecko.com/api/v3/`
- **Features**: Real-time prices, market data, sparkline data
- **Rate Limiting**: Free tier with reasonable limits
- **Data**: 24h changes, current prices, historical data

### Data Flow
1. **Portfolio Data**: Fetched from Redux store
2. **Price Updates**: Real-time from CoinGecko API
3. **Chart Data**: Processed for visualization
4. **State Management**: Redux for global state, Context for local

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark interface
- **Color Palette**: Consistent color scheme throughout
- **Typography**: Hierarchical text system
- **Spacing**: Consistent spacing using Tailwind utilities

### Interactive Elements
- **Hover Effects**: Subtle hover states
- **Loading States**: Loading indicators for async operations
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions

## 📈 Portfolio Features

### Portfolio Overview
- **Total Value**: Real-time calculation of portfolio worth
- **Token Breakdown**: Visual representation of holdings
- **Last Updated**: Timestamp of latest data refresh
- **Performance Tracking**: 24h changes and trends

### Watchlist Management
- **Add Tokens**: Search and add new cryptocurrencies
- **Edit Holdings**: Update quantities with inline editing
- **Remove Tokens**: Remove from watchlist
- **Pagination**: Navigate large lists efficiently

## 🔄 State Management

### Redux Store
- **Portfolio Slice**: Manages portfolio data and watchlist
- **Async Actions**: API calls and data updates
- **Persistent State**: Local storage for user preferences

### React Context
- **Wallet Context**: Manages wallet connection state
- **Local State**: Component-specific state management

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting

### Performance
- **React.memo**: Optimized re-renders
- **Lazy Loading**: Code splitting for better performance
- **Optimized Charts**: Efficient chart rendering

## 🚀 Deployment

### Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Easy static site deployment
- **GitHub Pages**: Free hosting for open source
- **Custom Server**: Any Node.js hosting platform

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS utilities
- Maintain responsive design principles
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CoinGecko**: For providing excellent cryptocurrency data API
- **Recharts**: For beautiful chart components
- **Tailwind CSS**: For the utility-first CSS framework
- **React Community**: For the amazing ecosystem

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
