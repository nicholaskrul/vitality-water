import React, { useState } from 'react';
import { UserProfile, LogEntry } from '../../types';
import { formatVolume } from '../../data';

interface HomeScreenProps {
  profile: UserProfile;
  logs: LogEntry[];
  onAddWater: (amountMl: number) => void;
  onOpenCustomAdd: () => void;
  onDeleteLog?: (logId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  logs,
  onAddWater,
  onOpenCustomAdd,
  onDeleteLog,
}) => {
  // State for handling confirmation modal before logging water
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  // Filter logs for today only
  const todayStr = new Date().toDateString();
  const todayLogs = logs.filter(
    (l) => new Date(l.timestamp).toDateString() === todayStr
  );

  // Total volume today in mL
  const todayTotalMl = todayLogs.reduce((sum, l) => sum + l.amountMl, 0);

  // Target volume in mL
  const targetMl = profile.dailyTargetMl || 2500;

  // Percentage complete (capped at 100 for display)
  const percentComplete = Math.min(100, Math.round((todayTotalMl / targetMl) * 100));

  // Liters consumed display (formatted to 2 decimal places)
  const currentLiters = (todayTotalMl / 1000).toFixed(2);
  const targetLiters = (targetMl / 1000).toFixed(1);

  // Handle confirming the log action
  const handleConfirmAdd = () => {
    if (pendingAmount !== null) {
      onAddWater(pendingAmount);
      setPendingAmount(null);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2 font-['Inter'] space-y-6">
      {/* Dynamic Bottle & Progress Section */}
      <section className="bg-[#e7eeff] rounded-3xl p-6 relative overflow-hidden shadow-sm border border-white/60">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {/* Animated Water Graphic Container */}
          <div className="relative w-44 h-56 rounded-3xl bg-white/60 p-3 shadow-inner border border-white flex flex-col justify-end overflow-hidden">
            {/* Water Fill Level */}
            <div
              className="w-full bg-[#00677f]/80 rounded-2xl transition-all duration-700 ease-out relative"
              style={{ height: `${percentComplete}%` }}
            >
              {/* Animated surface wave effect */}
              {percentComplete > 0 && percentComplete < 100 && (
                <div className="absolute -top-2 left-0 right-0 h-4 bg-[#00d2ff]/40 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Overlaid Stats inside Bottle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <span className="font-['Montserrat'] text-3xl font-extrabold text-[#111c2d]">
                {currentLiters}L
              </span>
              <span className="text-xs font-semibold text-[#3c494e]">
                of {targetLiters}L Goal
              </span>
              <span className="mt-2 bg-[#00677f] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                {percentComplete}% Reached
              </span>
            </div>
          </div>

          <p className="text-xs font-medium text-[#3c494e]">
            {percentComplete >= 100
              ? '🎉 Daily hydration goal achieved!'
              : `Keep going! ${formatVolume(Math.max(0, targetMl - todayTotalMl), profile.preferredUnit)} remaining today.`}
          </p>
        </div>
      </section>

      {/* Quick Add Water Presets */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-[#3c494e] uppercase tracking-wider ml-1">
            Quick Log
          </h3>
          <button
            onClick={onOpenCustomAdd}
            className="text-[11px] font-bold text-[#00677f] hover:underline cursor-pointer"
          >
            + Custom Amount
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[250, 500, 750].map((amount) => (
            <button
              key={amount}
              onClick={() => setPendingAmount(amount)}
              className="bg-[#f0f3ff] hover:bg-[#d8e3fb] active:scale-95 transition-all p-4 rounded-2xl flex flex-col items-center justify-center border border-white/60 shadow-sm cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[#00677f] text-2xl group-hover:scale-110 transition-transform">
                water_drop
              </span>
              <span className="font-['Montserrat'] text-sm font-bold text-[#111c2d] mt-1">
                +{formatVolume(amount, profile.preferredUnit)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Today's Logged History */}
      <section className="space-y-3">
        <h3 className="text-[11px] font-bold text-[#3c494e] uppercase tracking-wider ml-1">
          Today's Logs
        </h3>

        {todayLogs.length === 0 ? (
          <div className="bg-[#f0f3ff] rounded-2xl p-6 text-center text-xs text-[#6c797f] border border-white/60">
            No water logged yet today. Tap a button above to record your first drink!
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm border border-[#e7eeff]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#00677f]/10 text-[#00677f] rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">local_drink</span>
                  </div>
                  <div>
                    <p className="font-['Montserrat'] text-sm font-bold text-[#111c2d]">
                      {formatVolume(log.amountMl, profile.preferredUnit)}
                    </p>
                    <p className="text-[10px] text-[#6c797f] font-medium">{log.formattedTime}</p>
                  </div>
                </div>

                {onDeleteLog && (
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Log Confirmation Pop-up Modal */}
      {pendingAmount !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl relative border border-[#e7eeff] text-center space-y-4">
            <div className="w-14 h-14 bg-[#00d2ff]/20 text-[#00677f] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">
                Confirm Hydration
              </h3>
              <p className="text-xs text-[#3c494e] mt-1 leading-relaxed">
                Log <strong>{formatVolume(pendingAmount, profile.preferredUnit)}</strong> of water to your daily total?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingAmount(null)}
                className="flex-1 py-2.5 bg-[#f0f3ff] text-[#3c494e] rounded-xl text-xs font-semibold hover:bg-[#dee8ff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 py-2.5 bg-[#00677f] text-white rounded-xl text-xs font-bold hover:bg-[#00566a] shadow-md cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
