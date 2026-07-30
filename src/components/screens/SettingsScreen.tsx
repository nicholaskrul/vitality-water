import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { formatVolume, mlToOz } from '../../data';

interface SettingsScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [targetInput, setTargetInput] = useState(
    profile.preferredUnit === 'oz'
      ? Math.round(mlToOz(profile.dailyTargetMl || 2500)).toString()
      : (profile.dailyTargetMl || 2500).toString()
  );
  const [savedToast, setSavedToast] = useState(false);

  const unit = profile.preferredUnit || 'ml';

  // Handle saving daily water target
  const handleSaveTarget = (newTargetMl: number) => {
    onUpdateProfile({ dailyTargetMl: newTargetMl });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCustomTargetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (isNaN(val) || val <= 0) return;

    // Convert to mL if the user is in 'oz' mode
    const targetInMl = unit === 'oz' ? Math.round(val / 0.033814) : Math.round(val);
    handleSaveTarget(targetInMl);
  };

  const handlePresetSelect = (presetMl: number) => {
    const displayVal = unit === 'oz' ? Math.round(mlToOz(presetMl)) : presetMl;
    setTargetInput(displayVal.toString());
    handleSaveTarget(presetMl);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2 font-['Inter'] space-y-6 relative">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#00677f] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-white/20 animate-bounce">
          ✓ Daily target updated!
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
          Preferences
        </span>
        <h2 className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
          Settings
        </h2>
      </div>

      {/* 1. Daily Hydration Target Customization Card */}
      <section className="bg-[#e7eeff] rounded-3xl p-6 shadow-sm border border-white/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00677f]">target</span>
            <h3 className="font-['Montserrat'] text-sm font-bold text-[#111c2d]">
              Daily Water Target
            </h3>
          </div>
          <span className="text-xs font-extrabold text-[#00677f] bg-white px-3 py-1 rounded-full border border-[#00677f]/20">
            {formatVolume(profile.dailyTargetMl || 2500, unit)}
          </span>
        </div>

        {/* Quick Target Presets */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#3c494e] uppercase tracking-wider">
            Quick Presets
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2000, 2500, 3000, 3500].map((presetMl) => {
              const isSelected = profile.dailyTargetMl === presetMl;
              return (
                <button
                  key={presetMl}
                  type="button"
                  onClick={() => handlePresetSelect(presetMl)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#00677f] text-white border-[#00677f] shadow-sm'
                      : 'bg-white text-[#3c494e] border-white/80 hover:bg-[#d8e3fb]'
                  }`}
                >
                  {unit === 'oz' ? `${Math.round(mlToOz(presetMl))}oz` : `${(presetMl / 1000).toFixed(1)}L`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Field */}
        <form onSubmit={handleCustomTargetSubmit} className="space-y-1.5 pt-1">
          <label className="text-[10px] font-bold text-[#3c494e] uppercase tracking-wider">
            Custom Goal ({unit.toUpperCase()})
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="500"
              max="10000"
              step="50"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="flex-1 bg-white border border-[#bbc9cf]/60 rounded-xl px-4 py-2.5 text-xs font-bold text-[#111c2d] focus:outline-none focus:border-[#00677f]"
              placeholder={`Enter target in ${unit}`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#00677f] text-white rounded-xl text-xs font-bold hover:bg-[#00566a] transition-colors shadow-sm cursor-pointer"
            >
              Save Target
            </button>
          </div>
        </form>
      </section>

      {/* 2. Unit Preference Toggle */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e7eeff] flex items-center justify-between">
        <div>
          <p className="font-['Montserrat'] text-xs font-bold text-[#111c2d]">
            Preferred Unit
          </p>
          <p className="text-[10px] text-[#6c797f]">
            Choose between Milliliters (ml) and Fluid Ounces (oz)
          </p>
        </div>
        <div className="flex bg-[#f0f3ff] p-1 rounded-xl border border-white">
          <button
            type="button"
            onClick={() => onUpdateProfile({ preferredUnit: 'ml' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'ml' ? 'bg-[#00677f] text-white shadow-sm' : 'text-[#3c494e]'
            }`}
          >
            mL
          </button>
          <button
            type="button"
            onClick={() => onUpdateProfile({ preferredUnit: 'oz' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'oz' ? 'bg-[#00677f] text-white shadow-sm' : 'text-[#3c494e]'
            }`}
          >
            oz
          </button>
        </div>
      </section>

      {/* 3. Account Name Settings */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e7eeff] space-y-3">
        <p className="font-['Montserrat'] text-xs font-bold text-[#111c2d]">
          Display Name
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-[#f0f3ff] border border-[#e7eeff] rounded-xl px-4 py-2 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#00677f]"
          />
          <button
            type="button"
            onClick={() => {
              if (name.trim()) {
                onUpdateProfile({ name: name.trim() });
                setSavedToast(true);
                setTimeout(() => setSavedToast(false), 2500);
              }
            }}
            className="px-4 py-2 bg-[#f0f3ff] text-[#00677f] hover:bg-[#dee8ff] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Update
          </button>
        </div>
      </section>
    </div>
  );
};
