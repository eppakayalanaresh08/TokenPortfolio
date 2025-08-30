import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { usePortfolio } from '../../hooks/usePortfolio';

interface EditHoldingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
    id: string;
    name: string;
    symbol: string;
    holdings: number;
  } | null;
}

export const EditHoldingsModal: React.FC<EditHoldingsModalProps> = ({ 
  isOpen, 
  onClose, 
  token 
}) => {
  const { updateHoldings } = usePortfolio();
  const [holdings, setHoldings] = useState(token?.holdings?.toString() || '0');

  const handleSave = () => {
    if (token) {
      const numericHoldings = parseFloat(holdings) || 0;
      updateHoldings(token.id, numericHoldings);
      onClose();
    }
  };

  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-darkbackgroundsbg-component rounded-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ffffff14]">
          <h2 className="text-lg font-semibold text-zinc-100">Edit Holdings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto hover:bg-black"
          >
            <X className="w-5 h-5" color='#fff' />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              {token.name} ({token.symbol}) Holdings
            </label>
            <input
              type="number"
              step="any"
              value={holdings}
              onChange={(e) => setHoldings(e.target.value)}
              className="w-full px-4 py-3 bg-[#212124] border border-[#ffffff14] rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#a9e851]"
              placeholder="0.0000"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#ffffff14] flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1 py-3 text-zinc-400 "
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#a9e851] hover:bg-[#98d645] text-black font-medium rounded-lg"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};