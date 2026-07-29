import React, { useState } from 'react';
import { UserProfile, LogEntry } from '../../types';
import { formatVolume } from '../../data';

interface HomeScreenProps {
  profile: UserProfile;
  logs: LogEntry[];
  onAddWater: (amountMl: number) => void;
  onOpenCustomAdd: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  logs,
  onAddWater,
  onOpenCustomAdd,
}) => {
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  // Compute today's total intake
  const todayTotalMl = logs
    .filter((log) => log.dateStr.includes('Today'))
    .reduce((sum, log) => sum + log.amountMl, 0);

  const fillPercentage = Math.min(100, Math.max(0, (todayTotalMl / profile.dailyTargetMl) * 100));
  const currentLiters = (todayTotalMl / 1000).toFixed(2);
  const targetLitersFormatted = formatVolume(profile.dailyTargetMl, profile.preferredUnit);

  // Calculate time since last drink
  const latestLog = logs[0];
  const lastDrinkTime = latestLog ? latestLog.timeAgo : 'No logs today';

  // Calculate hydration level label
  const getHydrationStatus = (pct: number) => {
    if (pct >= 100) return 'Optimal';
    if (pct >= 70) return 'Good';
    if (pct >= 40) return 'Fair';
    return 'Low';
  };

  const handleQuickAdd = (amount: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({ x: rect.left + rect.width / 2, y: rect.top });
    onAddWater(amount);
    setTimeout(() => setRipplePos(null), 1000);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 gap-6 pb-28 pt-2">
      {/* Daily Streak Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#356ee7] p-5 shadow-xl transition-all active:scale-[0.98]">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-['Inter'] text-[11px] font-semibold text-white/80 uppercase tracking-widest">
              Current Momentum
            </span>
            <span className="font-['Montserrat'] text-2xl font-bold text-white mt-0.5">
              {profile.currentStreak} Day Streak
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <span
              className="material-symbols-outlined text-white text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
        </div>
        {/* Animated background glow */}
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-2xl animate-pulse"></div>
      </div>

      {/* Hero Progress Section */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex h-72 w-72 items-center justify-center">
          {/* Outer Glass Ring */}
          <div className="absolute inset-0 rounded-full border-[12px] border-[#e7eeff] shadow-inner"></div>

          {/* Progress SVG Ring */}
          <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-[#00d2ff] transition-all duration-1000 ease-out"
              cx="50"
              cy="50"
              fill="transparent"
              r="44"
              stroke="currentColor"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * fillPercentage) / 100}
              strokeLinecap="round"
              strokeWidth="12"
            />
          </svg>

          {/* Central Fluid Bottle */}
          <div className="relative flex h-52 w-32 flex-col items-center justify-end overflow-hidden rounded-3xl bg-[#d8e3fb] shadow-sm border border-white/50">
            {/* Liquid Fill */}
            <div
              className="relative w-full transition-all duration-1000 ease-out"
              style={{
                height: `${fillPercentage}%`,
                background: 'linear-gradient(180deg, #47d6ff 0%, #00677f 100%)',
              }}
            >
              {/* Wave Overlays */}
              <div className="absolute -top-4 left-0 w-[200%] opacity-40">
                <svg className="animate-wave fill-white" viewBox="0 0 100 20">
                  <path d="M0 10 Q 25 20 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
              </div>
              <div className="absolute -top-3 left-[-50%] w-[200%] opacity-25">
                <svg className="animate-wave fill-white" style={{ animationDirection: 'reverse', animationDuration: '5s' }} viewBox="0 0 100 20">
                  <path d="M0 10 Q 25 0 50 10 T 100 10 V 20 H 0 Z" />
                </svg>
              </div>
            </div>

            {/* Measurement Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none">
              <span className="font-['Montserrat'] text-3xl font-bold text-[#111c2d]">
                {profile.preferredUnit === 'oz' ? (todayTotalMl * 0.033814).toFixed(1) : currentLiters}
              </span>
              <span className="font-['Inter'] text-[12px] font-semibold text-[#3c494e]">
                {profile.preferredUnit === 'oz' ? 'Ounces' : 'Liters'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="font-['Inter'] text-base text-[#3c494e]">
            Daily Goal: <span className="font-semibold text-[#00677f]">{targetLitersFormatted}</span>
          </p>
        </div>
      </div>

      {/* Quick Add Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Montserrat'] text-xl font-bold text-[#111c2d]">Quick Add</h3>
          <button
            onClick={onOpenCustomAdd}
            className="text-xs font-semibold text-[#00677f] hover:underline cursor-pointer"
          >
            + Custom Amount
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* 250ml */}
          <button
            onClick={(e) => handleQuickAdd(250, e)}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-[#f0f3ff] p-4 transition-all hover:bg-[#dee8ff] active:scale-95 cursor-pointer shadow-sm border border-white/60"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00677f]/10 text-[#00677f] transition-colors group-hover:bg-[#00677f] group-hover:text-white">
              <span className="material-symbols-outlined text-2xl">local_drink</span>
            </div>
            <span className="font-['Inter'] text-xs font-semibold text-[#3c494e]">250ml</span>
          </button>

          {/* 500ml */}
          <button
            onClick={(e) => handleQuickAdd(500, e)}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-[#f0f3ff] p-4 transition-all hover:bg-[#dee8ff] active:scale-95 cursor-pointer shadow-sm border border-white/60"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00677f]/10 text-[#00677f] transition-colors group-hover:bg-[#00677f] group-hover:text-white">
              <span className="material-symbols-outlined text-2xl">water_bottle</span>
            </div>
            <span className="font-['Inter'] text-xs font-semibold text-[#3c494e]">500ml</span>
          </button>

          {/* 750ml */}
          <button
            onClick={(e) => handleQuickAdd(750, e)}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-[#f0f3ff] p-4 transition-all hover:bg-[#dee8ff] active:scale-95 cursor-pointer shadow-sm border border-white/60"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00677f]/10 text-[#00677f] transition-colors group-hover:bg-[#00677f] group-hover:text-white">
              <span className="material-symbols-outlined text-2xl">liquor</span>
            </div>
            <span className="font-['Inter'] text-xs font-semibold text-[#3c494e]">750ml</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#e7eeff] p-4 shadow-sm border border-white/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#00677f] text-sm">schedule</span>
            <span className="font-['Inter'] text-[11px] font-semibold text-[#3c494e]">Last Drink</span>
          </div>
          <p className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">{lastDrinkTime}</p>
        </div>

        <div className="rounded-2xl bg-[#e7eeff] p-4 shadow-sm border border-white/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#00677f] text-sm">battery_charging_full</span>
            <span className="font-['Inter'] text-[11px] font-semibold text-[#3c494e]">Hydration</span>
          </div>
          <p className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">
            {getHydrationStatus(fillPercentage)}
          </p>
        </div>
      </div>

      {/* Ripple Animation */}
      {ripplePos && (
        <div
          className="fixed w-6 h-6 bg-[#00d2ff] rounded-full animate-ping pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: ripplePos.x, top: ripplePos.y }}
        />
      )}
    </div>
  );
};
