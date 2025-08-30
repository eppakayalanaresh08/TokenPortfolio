import React from "react";
import { WalletConnect } from "../../../../components/WalletConnect/WalletConnect";
import logo from '/src/assets/logo.png'

export const PortfolioSection = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-between gap-1.5 p-3 relative">
      <div className="flex items-center gap-3 flex-1">
        <img
          className="relative flex-[0_0_auto]"
          alt="Frame"
          src={logo}
        />

        <h1 className="relative flex-1 [font-family:'Inter',Helvetica] font-semibold text-white text-xl tracking-[0] leading-6">
          Token Portfolio
        </h1>
      </div>

      <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
        <WalletConnect />
      </div>
    </header>
  );
};