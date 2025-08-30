import {
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  Edit3Icon,
  TrashIcon,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { DonutChart } from "../../../../components/DonutChart/DonutChart";
import { Sparkline } from "../../../../components/Sparkline/Sparkline";
import { AddTokenModal } from "../../../../components/AddTokenModal/AddTokenModal";
import { Pagination } from "../../../../components/ui/pagination";
import { usePortfolio } from "../../../../hooks/usePortfolio";
import { usePagination } from "../../../../hooks/usePagination";
import star from "../../../../assets/star.png";

export const WatchlistSection = (): JSX.Element => {
  const {
    watchlist,
    totalValue,
    lastUpdated,
    isLoading,
    refreshPrices,
    removeFromWatchlist,
    updateHoldings,
  } = usePortfolio();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempHoldings, setTempHoldings] = useState<string>("");

  // Pagination
  const {
    currentPage,
    totalPages,
    currentData: paginatedWatchlist,
    goToPage,
    pageInfo,
  } = usePagination({
    data: watchlist, // Use watchlist directly instead of filteredWatchlist
    itemsPerPage: 10, // Show 10 items per page by default
  });

  // chart data
  const chartData = useMemo(() => {
    // Extended color palette to support more tokens
    const colors = [
      "#10b981", "#a855f7", "#3b82f6", "#06b6d4", "#f97316", "#ec4899",
      "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#84cc16", "#14b8a6",
      "#f43f5e", "#a855f7", "#3b82f6", "#06b6d4", "#f97316", "#ec4899",
      "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#84cc16", "#14b8a6"
    ];
    
    // Generate chart data for all tokens (including those with 0 holdings)
    const data = watchlist
      .map((token, index) => {
        const value = (token.holdings || 0) * (token.current_price || 0);
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
        
        // Ensure very small percentages are preserved and not rounded to 0
        // Use more decimal places for very small values
        const displayPercentage = percentage;
        
        return {
          name: `${token.name} (${token.symbol})`,
          value: displayPercentage,
          color: colors[index % colors.length],
          percentage: displayPercentage < 0.1 ? `${displayPercentage.toFixed(2)}%` : `${displayPercentage.toFixed(1)}%`,
          tokenValue: value, // Store actual value for sorting
        };
      })
      .sort((a, b) => b.tokenValue - a.tokenValue); // Sort by value descending
    
    return data;
  }, [watchlist, totalValue]);

  // menu actions
  const handleEditHoldings = (token: any) => {
    setEditingId(token.id);
    setTempHoldings(token.holdings?.toString() ?? "0");
    setOpenMenuId(null);
  };

  const handleRemoveToken = (tokenId: string) => {
    removeFromWatchlist(tokenId);
    setOpenMenuId(null);
    if (editingId === tokenId) {
      setEditingId(null);
      setTempHoldings("");
    }
    
    // Reset to first page if current page becomes empty
    if (paginatedWatchlist.length === 1 && currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // inline edit actions
  const saveInline = (tokenId: string) => {
    const numericHoldings = parseFloat(tempHoldings);
    updateHoldings(tokenId, isNaN(numericHoldings) ? 0 : numericHoldings);
    setEditingId(null);
    setTempHoldings("");
  };

  const cancelInline = () => {
    setEditingId(null);
    setTempHoldings("");
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    goToPage(page);
    // Close any open menus when changing pages
    setOpenMenuId(null);
    setEditingId(null);
    setTempHoldings("");
  };

  return (
    <div className="flex flex-col w-full items-start gap-6 lg:gap-12 relative">
      {/* Top summary + chart */}
      <Card className="flex flex-col lg:flex-row items-start gap-4 lg:gap-[19px] p-4 lg:p-6 relative w-full bg-darkbackgroundsbg-component rounded-xl border-0">
        {/* Portfolio Summary Section */}
        <CardContent className="flex flex-col items-start gap-4 lg:gap-6 relative flex-1 p-0">
          <div className="relative w-full mt-[-1.00px] font-text-compact-txt-compact-large-plus font-[number:var(--text-compact-txt-compact-large-plus-font-weight)] text-darkforegroundsfg-subtle text-[length:var(--text-compact-txt-compact-large-plus-font-size)] tracking-[var(--text-compact-txt-compact-large-plus-letter-spacing)] leading-[var(--text-compact-txt-compact-large-plus-line-height)] [font-style:var(--text-compact-txt-compact-large-plus-font-style)]">
            Portfolio Total
          </div>

          <div className="relative w-full font-headers-webs-h2 font-[number:var(--headers-webs-h2-font-weight)] text-zinc-100 text-[length:var(--headers-webs-h2-font-size)] tracking-[var(--headers-webs-h2-letter-spacing)] leading-[var(--headers-webs-h2-line-height)] [font-style:var(--headers-webs-h2-font-style)]">
            $
            {totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>

          <div className="flex items-end justify-start gap-2.5 relative w-full">
            <div className="relative lg:mt-24 font-text-compact-txt-compact-xsmall font-[number:var(--text-compact-txt-compact-xsmall-font-weight)] text-darkforegroundsfg-subtle text-[length:var(--text-compact-txt-compact-xsmall-font-size)] tracking-[var(--text-compact-txt-compact-xsmall-letter-spacing)] leading-[var(--text-compact-txt-compact-xsmall-line-height)] [font-style:var(--text-compact-txt-compact-xsmall-font-style)]">
             <p style={{fontSize:"16px"}}>Last updated: {lastUpdated}</p> 
            </div>
          </div>
        </CardContent>

        {/* Chart and Token List Section */}
        <CardContent className="flex flex-col items-start gap-4 lg:gap-6 relative flex-1 p-0 w-full lg:w-auto">
          <div className="relative w-full  mt-[-1.00px] font-text-compact-txt-compact-large-plus font-[number:var(--text-compact-txt-compact-large-plus-font-weight)] text-darkforegroundsfg-subtle text-[length:var(--text-compact-txt-compact-large-plus-font-size)] tracking-[var(--text-compact-txt-compact-large-plus-letter-spacing)] leading-[var(--text-compact-txt-compact-large-plus-line-height)] [font-style:var(--text-compact-txt-compact-large-plus-font-style)]">
            <p className="lg:ml-[50px]">Portfolio Total</p> 
          </div>

          {/* Mobile: Vertical Stack, Desktop: Horizontal Layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 relative w-full">
            {/* DonutChart - Center on mobile, left on desktop */}
            <div className="flex justify-center lg:justify-start w-full lg:w-auto ">
              <DonutChart data={chartData} />
            </div>

            {/* Token List - Full width on mobile, flex on desktop */}
            <div className="flex flex-col gap-4 lg:gap-6 relative w-full lg:flex-1">
                             {/* Mobile: Single column with scrollable list */}
               <div className="lg:hidden w-full">
                 <div className="max-h-[200px] overflow-y-auto mobile-scroll touch-scroll">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 border-b border-[#ffffff0a] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span 
                          className="font-text-compact-txt-compact-medium-plus text-[length:var(--text-compact-txt-compact-medium-plus-font-size)] tracking-[var(--text-compact-txt-compact-medium-plus-letter-spacing)] leading-[var(--text-compact-txt-compact-medium-plus-line-height)] [font-style:var(--text-compact-txt-compact-medium-plus-font-style)]"
                          style={{ color: item.color }}
                        >
                          {item.name}
                        </span>
                      </div>
                      <span 
                        className="font-text-compact-txt-compact-small text-[length:var(--text-compact-txt-compact-small-font-size)] tracking-[var(--text-compact-txt-compact-small-letter-spacing)] leading-[var(--text-compact-txt-compact-small-line-height)] [font-style:var(--text-compact-txt-compact-small-font-style)]"
                        style={{ color: '#A1A1AA' }}
                      >
                        {item.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: Two column layout */}
              <div className="hidden lg:flex lg:flex-row gap-8 lg:gap-6 relative w-full">
                                 <div className="flex flex-col items-start justify-start gap-2.5 pt-6 pb-6 relative flex-1 h-[220px] overflow-y-auto mobile-scroll touch-scroll">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-full font-text-compact-txt-compact-medium-plus font-[number:var(--text-compact-txt-compact-medium-plus-font-weight)] text-[length:var(--text-compact-txt-compact-medium-plus-font-size)] tracking-[var(--text-compact-txt-compact-medium-plus-letter-spacing)] leading-[var(--text-compact-txt-compact-medium-plus-line-height)] [font-style:var(--text-compact-txt-compact-medium-plus-font-style)] py-1"
                      style={{ color: item.color }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>

                                 <div className="flex flex-col items-start lg:items-end justify-start gap-2.5 pt-6 pb-6 relative flex-1 h-[220px] overflow-y-auto mobile-scroll touch-scroll">
                  {chartData.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-full font-text-compact-txt-compact-small font-[number:var(--text-compact-txt-compact-small-font-weight)] text-left lg:text-right tracking-[var(--text-compact-txt-compact-small-letter-spacing)] leading-[var(--text-compact-txt-compact-small-line-height)] [font-style:var(--text-compact-txt-compact-small-font-style)] py-1"
                      style={{ color: '#A1A1AA' }}
                    >
                      {item.percentage}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist header + actions */}
      <div className="flex flex-col items-start gap-4 relative w-full">
        <div className="flex flex-row items-center gap-3 relative w-full">
          <div className="flex items-center gap-1 relative flex-1">
            <img src={star} alt="star" />
            <div className="relative w-fit mt-[-1.00px] font-headers-webs-h4 font-[number:var(--headers-webs-h4-font-weight)] text-darkforegroundsfg-base text-[length:var(--headers-webs-h4-font-size)] tracking-[var(--headers-webs-h4-letter-spacing)] leading-[var(--headers-webs-h4-line-height)] whitespace-nowrap [font-style:var(--headers-webs-h4-font-style)]">
              Watchlist
            </div>
          </div>

          {/* Action Buttons - Always horizontal */}
          <div className="flex flex-row gap-3 w-auto">
            <Button
              onClick={() => {
                if (!isLoading) {
                  refreshPrices();
                }
              }}
              disabled={isLoading}
              className="px-3 py-2 bg-[#ffffff0a] rounded-md shadow-light-buttons-neutral h-auto border-0 hover:bg-[#ffffff15] disabled:opacity-50"
            >
              <RefreshCwIcon
                className={`w-[10px] h-[10px] ${isLoading ? "animate-spin" : ""}`}
                color="#A1A1AA"
              />
              <span className="mt-[-1.00px] font-medium text-zinc-100 text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 hidden sm:inline">
                Refresh Prices
              </span>
            </Button>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-[#a9e851] rounded-md shadow-[0px_0px_0px_1px_#1f6619,0px_1px_2px_#1f661966,inset_0px_0.75px_0px_#ffffff33] h-auto border-0 hover:bg-[#98d645]"
            >
              <PlusIcon className="w-[15px] h-[15px]" color="#000" />
              <span className="mt-[-1.00px] font-medium text-darkforegroundsfg-on-inverted text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 whitespace-nowrap">
                Add Token
              </span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col items-start relative w-full rounded-xl overflow-hidden border border-solid border-[#ffffff14]">
          {/* Desktop */}
          <div className="hidden lg:block w-full">
            <Table>
              <TableHeader className="h-12 bg-zinc-800">
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="pl-6 text-zinc-400 font-text-compact-txt-compact-small-plus">
                    Token
                  </TableHead>
                  <TableHead className="text-zinc-400 font-text-compact-txt-compact-small-plus">
                    Price
                  </TableHead>
                  <TableHead className="text-zinc-400 font-text-compact-txt-compact-small-plus">
                    24h %
                  </TableHead>
                  <TableHead className="text-zinc-400 font-text-compact-txt-compact-small-plus">
                    Sparkline (7d)
                  </TableHead>
                  <TableHead className="text-zinc-400 font-text-compact-txt-compact-small-plus">
                    Holdings
                  </TableHead>
                  <TableHead className="pr-16 text-zinc-400 font-text-compact-txt-compact-small-plus">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="px-0 py-3 border border-solid border-[#ffffff14] ml-[-1.00px] mr-[-1.00px]">
                {paginatedWatchlist.map((token) => {
                  const isEditing = editingId === token.id;
                  const liveHoldings = editingId === token.id
                    ? parseFloat(tempHoldings || "0") || 0
                    : (token.holdings || 0);
                  const liveValue = liveHoldings * (token.current_price || 0);

                  return (
                    <TableRow
                      key={token.id}
                      className="h-12 bg-[#212124] border-0 hover:bg-[#2a2a2e]"
                    >
                      {/* Token */}
                      <TableCell className="flex items-center gap-3 px-6 py-0 mt-2">
                        <div className="inline-flex items-center">
                          <img
                            src={token.image}
                            alt={token.name}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <div className="flex items-center flex-1">
                          <div className="font-text-compact-txt-compact-small text-transparent">
                            <span className="text-zinc-100">
                              {token.name}{" "}
                            </span>
                            <span className="text-zinc-400">({token.symbol})</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="px-0">
                        <div className="text-zinc-400 font-text-compact-txt-compact-small">
                          $
                          {token.current_price?.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || "0.00"}
                        </div>
                      </TableCell>

                      {/* 24h% */}
                      <TableCell className="px-0">
                        <div
                          className={`font-text-compact-txt-compact-small ${
                            (token.price_change_percentage_24h || 0) >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {(token.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
                          {(token.price_change_percentage_24h || 0).toFixed(2)}%
                        </div>
                      </TableCell>

                      {/* Sparkline */}
                      <TableCell className="px-0">
                        <Sparkline
                          data={token.sparkline_in_7d?.price || []}
                          isPositive={(token.price_change_percentage_24h || 0) >= 0}
                        />
                      </TableCell>

                      {/* Holdings (inline edit here) */}
                      <TableCell className="px-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="any"
                              value={tempHoldings}
                              onChange={(e) => setTempHoldings(e.target.value)}
                              className="w-28 px-2 py-1 bg-[#212124] border border-[#ffffff14] rounded-md text-zinc-100 text-sm focus:outline-none focus:border-[#a9e851]"
                              placeholder="0.0000"
                            />
                            <Button
                              size="sm"
                              onClick={() => saveInline(token.id)}
                              className="bg-[#a9e851] hover:bg-[#98d645] text-black rounded-md"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelInline}
                              className="text-zinc-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="text-zinc-100 font-text-compact-txt-compact-small">
                            {token.holdings?.toFixed(4) || "0.0000"}
                          </div>
                        )}
                      </TableCell>

                      {/* Value + row menu */}
                      <TableCell className="px-0">
                        <div className="flex items-center justify-between">
                          <div className="text-zinc-100 font-text-compact-txt-compact-small">
                            $
                            {liveValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>

                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-[6.5px] h-auto rounded-md mr-8"
                              onClick={() =>
                                setOpenMenuId(openMenuId === token.id ? null : token.id)
                              }
                            >
                              <MoreHorizontalIcon className="w-[15px] h-[15px]" color="#A1A1AA" />
                            </Button>

                            {openMenuId === token.id && (
                              <div className="absolute right-16 top-1 bg-darkbackgroundsbg-component border border-[#ffffff14] rounded-lg shadow-lg z-10 min-w-[190px]">
                                <button
                                  onClick={() => handleEditHoldings(token)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-100 hover:bg-[#ffffff0a] rounded-t-lg"
                                >
                                  <Edit3Icon className="w-4 h-4" />
                                  Edit Holdings
                                </button>
                                <button
                                  onClick={() => handleRemoveToken(token.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[#ffffff0a] rounded-b-lg"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile (all columns with horizontal scroll) */}
          <div className="lg:hidden w-full">
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="bg-zinc-800 px-4 py-3 flex text-zinc-400 text-sm font-medium">
                  <span className="min-w-[200px]">Token</span>
                  <span className="min-w-[120px] text-right">Price</span>
                  <span className="min-w-[100px] text-right">24h %</span>
                  <span className="min-w-[120px] text-center">Sparkline (7d)</span>
                  <span className="min-w-[120px] text-right">Holdings</span>
                  <span className="min-w-[120px] text-right">Value</span>
                  <span className="min-w-[120px] text-center">Actions</span>
                </div>
                <div className="divide-y divide-[#ffffff14]">
                  {paginatedWatchlist.map((token) => {
                    const isEditing = editingId === token.id;
                    const liveHoldings = editingId === token.id
                      ? parseFloat(tempHoldings || "0") || 0
                      : (token.holdings || 0);
                    const liveValue = liveHoldings * (token.current_price || 0);

                    return (
                      <div
                        key={token.id}
                        className="bg-[#212124] p-4 flex items-center"
                      >
                        {/* Token */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div
                            className="w-8 h-8 rounded-full border border-[#ffffff1a] bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${token.image})` }}
                          />
                          <div>
                            <div className="text-zinc-100 text-sm font-medium">
                              {token.name}
                            </div>
                            <div className="text-zinc-400 text-xs">({token.symbol})</div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="min-w-[120px] text-right">
                          <div className="text-zinc-400 text-sm">
                            $
                            {token.current_price?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || "0.00"}
                          </div>
                        </div>

                        {/* 24h% */}
                        <div className="min-w-[100px] text-right">
                          <div
                            className={`text-sm font-medium ${
                              (token.price_change_percentage_24h || 0) >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {(token.price_change_percentage_24h || 0) >= 0 ? "+" : ""}
                            {(token.price_change_percentage_24h || 0).toFixed(2)}%
                          </div>
                        </div>

                        {/* Sparkline */}
                        <div className="min-w-[120px] flex justify-center">
                          <div className="w-20 h-12">
                            <Sparkline
                              data={token.sparkline_in_7d?.price || []}
                              isPositive={(token.price_change_percentage_24h || 0) >= 0}
                            />
                          </div>
                        </div>

                        {/* Holdings */}
                        <div className="min-w-[120px] text-right">
                          {isEditing ? (
                            <div className="flex flex-col gap-1">
                              <input
                                type="number"
                                step="any"
                                value={tempHoldings}
                                onChange={(e) => setTempHoldings(e.target.value)}
                                className="w-20 px-2 py-1 bg-[#212124] border border-[#ffffff14] rounded-md text-zinc-100 text-xs focus:outline-none focus:border-[#a9e851]"
                                placeholder="0.0000"
                              />
                              <div className="flex gap-1">
                                <button
                                  onClick={() => saveInline(token.id)}
                                  className="px-2 py-1 bg-[#a9e851] hover:bg-[#98d645] text-black text-xs rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelInline}
                                  className="px-2 py-1 bg-[#ffffff14] text-zinc-400 text-xs rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-zinc-100 text-sm">
                              {token.holdings?.toFixed(4) || "0.0000"}
                            </div>
                          )}
                        </div>

                        {/* Value */}
                        <div className="min-w-[120px] text-right">
                          <div className="text-zinc-100 text-sm font-medium">
                            $
                            {liveValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="min-w-[120px] flex justify-center">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-[6.5px] h-auto rounded-md"
                              onClick={() =>
                                setOpenMenuId(openMenuId === token.id ? null : token.id)
                              }
                            >
                              <MoreHorizontalIcon className="w-[15px] h-[15px]" color="#A1A1AA" />
                            </Button>

                            {openMenuId === token.id && (
                              <div className="absolute right-10 top-1 bg-darkbackgroundsbg-component border border-[#ffffff14] rounded-lg shadow-lg z-10 min-w-[190px]">
                                <button
                                  onClick={() => handleEditHoldings(token)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-100 hover:bg-[#ffffff0a] rounded-t-lg"
                                >
                                  <Edit3Icon className="w-4 h-4" />
                                  Edit Holdings
                                </button>
                                <button
                                  onClick={() => handleRemoveToken(token.id)}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[#ffffff0a] rounded-b-lg"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="w-full p-4 border-t border-[#ffffff14]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={pageInfo.totalItems}
              itemsPerPage={10} // Show 10 items per page by default
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Add Token Modal only */}
      <AddTokenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
