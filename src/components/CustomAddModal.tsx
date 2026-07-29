import React, { useState } from 'react';

interface CustomAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amountMl: number) => void;
  preferredUnit: 'ml' | 'oz';
}

export const CustomAddModal: React.FC<CustomAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  preferredUnit,
}) => {
  const [value, setValue] = useState<string>('350');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!num || num <= 0) return;

    // Convert if unit is oz
    const amountMl = preferredUnit === 'oz' ? Math.round(num * 29.5735) : Math.round(num);
    onAdd(amountMl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-[#e7eeff] space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">Log Custom Intake</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6c797f] hover:text-[#111c2d] font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-['Inter'] text-xs font-semibold text-[#3c494e]">
            Amount ({preferredUnit})
          </label>
          <div className="relative">
            <input
              type="number"
              step="any"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-12 bg-[#f0f3ff] rounded-2xl px-4 font-['Montserrat'] text-lg font-bold text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 border border-[#dee8ff]"
            />
            <span className="absolute right-4 top-3 font-['Inter'] text-sm font-semibold text-[#3c494e]">
              {preferredUnit}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[150, 330, 500].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setValue(preferredUnit === 'oz' ? Math.round(preset * 0.033814).toString() : preset.toString())}
              className="py-1.5 bg-[#e7eeff] rounded-xl text-xs font-semibold text-[#00677f] hover:bg-[#d8e3fb]"
            >
              +{preset}ml
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#00677f] text-white rounded-2xl font-['Inter'] text-xs font-bold shadow-md hover:bg-[#00566a] transition-colors cursor-pointer"
        >
          Add to Daily Intake
        </button>
      </form>
    </div>
  );
};
