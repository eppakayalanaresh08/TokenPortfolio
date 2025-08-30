import React, { useEffect } from "react";
import { PortfolioSection } from "./sections/PortfolioSection/PortfolioSection";
import { WatchlistSection } from "./sections/WatchlistSection/WatchlistSection";

export const Home = (): JSX.Element => {
  // Close any open menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // This will be handled by individual components
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <main className="w-full min-h-screen bg-darkbackgroundsbg-base flex flex-col">
      <PortfolioSection />
      <div className="mt-8 mx-4 lg:mx-8 flex-1 pb-8">
        <WatchlistSection />
      </div>
    </main>
  );
};