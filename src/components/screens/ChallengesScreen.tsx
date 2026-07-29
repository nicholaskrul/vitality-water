import React, { useState } from 'react';
import { PlantChallenge, UserProfile, LogEntry } from '../../types';

interface ChallengesScreenProps {
  challenges: PlantChallenge[];
  profile: UserProfile;
  logs: LogEntry[];
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  challenges,
  profile,
  logs,
}) => {
  const [selectedChallenge, setSelectedChallenge] = useState<PlantChallenge | null>(null);

  // 1. Calculate Real Stats from Supabase Logs
  const totalCumulativeMl = logs.reduce((sum, l) => sum + l.amountMl, 0);

  // Group logs by day to calculate best single-day intake
  const dayTotals = logs.reduce((acc, log) => {
    const dayKey = new Date(log.timestamp).toDateString();
    acc[dayKey] = (acc[dayKey] || 0) + log.amountMl;
    return acc;
  }, {} as Record<string, number>);

  const maxSingleDayMl = Math.max(0, ...Object.values(dayTotals));

  // Count morning drinks (logged before 9:00 AM)
  const morningDrinksCount = logs.filter((l) => new Date(l.timestamp).getHours() < 9).length;

  // 2. Map Dynamic Progress & Lock/Unlock state
  const dynamicChallenges = challenges.map((item) => {
    let progressMl = item.progressMl || 0;
    let targetMl = item.targetMl || 100;
    let autoUnlocked = item.unlocked;

    if (item.id === 'fern') {
      progressMl = Math.min(7, profile.longestStreak || profile.currentStreak || 1);
      targetMl = 7;
      if (progressMl >= 7) autoUnlocked = true;
    } else if (item.id === 'lotus') {
      progressMl = maxSingleDayMl;
      targetMl = 3000;
      if (maxSingleDayMl >= 3000) autoUnlocked = true;
    } else if (item.id === 'sprout') {
      progressMl = morningDrinksCount;
      targetMl = 30;
      if (morningDrinksCount >= 30) autoUnlocked = true;
    } else if (item.id === 'bamboo') {
      progressMl = totalCumulativeMl;
      targetMl = 100000; // 100L
      if (totalCumulativeMl >= 100000) autoUnlocked = true;
    }

    return {
      ...item,
      unlocked: autoUnlocked,
      progressMl,
      targetMl,
    };
  });

  const unlockedCount = dynamicChallenges.filter((c) => c.unlocked).length;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2 font-['Inter']">
      {/* Header Section with Forest Summary */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
              Your Oasis
            </span>
            <h2 className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
              Water Forest
            </h2>
          </div>
          <div className="bg-[#00d2ff]/30 px-4 py-2 rounded-full flex items-center gap-2 border border-white/50">
            <span
              className="material-symbols-outlined text-[#00677f] text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
            <span className="font-['Montserrat'] text-lg font-bold text-[#00677f]">
              {unlockedCount * 4} PTS
            </span>
          </div>
        </div>
        <p className="text-xs text-[#3c494e] leading-relaxed">
          Every drop you drink nourishes your virtual garden. Reach milestones to see your forest bloom.
        </p>
      </div>

      {/* Forest Grid */}
      <div className="grid grid-cols-2 gap-4">
        {dynamicChallenges.map((item) => {
          const progressPct = Math.min(
            100,
            Math.round(((item.progressMl || 0) / (item.targetMl || 1)) * 100)
          );

          if (item.unlocked) {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedChallenge(item)}
                className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <div className="bg-[#f0f3ff] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-white/60 shadow-sm hover:shadow-md">
                  <div className="w-full h-24 relative flex items-center justify-center overflow-hidden rounded-xl bg-white/40">
                    <img src={item.imgUrl} alt={item.alt} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[10px] font-bold text-[#00677f] tracking-wide block uppercase">
                      {item.title}
                    </span>
                    <span className="font-['Montserrat'] text-xs font-semibold text-[#111c2d]">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="absolute -top-1.5 -right-1.5 bg-[#00677f] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => setSelectedChallenge(item)}
              className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="bg-[#d8e3fb]/50 rounded-2xl p-4 flex flex-col items-center justify-between aspect-square grayscale opacity-70 border border-white/40">
                <div className="w-full h-24 relative flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                  <img src={item.imgUrl} alt={item.alt} className="w-full h-full object-contain p-1" />
                </div>
                <div className="text-center mt-2 w-full">
                  <span className="text-[10px] font-bold text-[#3c494e] tracking-wide block uppercase">
                    {item.title}
                  </span>
                  <div className="w-full bg-[#bbc9cf]/40 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-[#00677f] h-full rounded-full"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full shadow-md backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#6c797f] text-sm">lock</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-[#e7eeff]">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f0f3ff] text-[#3c494e] flex items-center justify-center font-bold hover:bg-[#dee8ff] cursor-pointer"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-2xl bg-[#f0f3ff] p-2 mb-4 overflow-hidden shadow-inner border border-[#dee8ff]">
                <img
                  src={selectedChallenge.imgUrl}
                  alt={selectedChallenge.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-bold text-[#00677f] tracking-widest uppercase">
                {selectedChallenge.title}
              </span>
              <h3 className="font-['Montserrat'] text-xl font-bold text-[#111c2d] mt-1">
                {selectedChallenge.subtitle}
              </h3>
              <div className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e7eeff] text-[#00677f]">
                {selectedChallenge.unlocked ? 'Unlocked Achievement' : 'Locked Plant Seed'}
              </div>
              <p className="text-xs text-[#3c494e] mt-4 leading-relaxed">
                {selectedChallenge.description}
              </p>

              {/* Dynamic Progress Bar inside modal */}
              {!selectedChallenge.unlocked && (
                <div className="w-full mt-4 p-3 bg-[#f0f3ff] rounded-xl text-left border border-white/60">
                  <div className="flex justify-between text-xs font-semibold text-[#3c494e] mb-1">
                    <span>Progress</span>
                    <span>
                      {selectedChallenge.targetMl && selectedChallenge.targetMl >= 1000
                        ? `${((selectedChallenge.progressMl || 0) / 1000).toFixed(2)}L / ${(selectedChallenge.targetMl / 1000).toFixed(1)}L`
                        : `${selectedChallenge.progressMl || 0} / ${selectedChallenge.targetMl}`}
                    </span>
                  </div>
                  <div className="w-full bg-[#d8e3fb] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00677f] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((selectedChallenge.progressMl || 0) / (selectedChallenge.targetMl || 1)) * 100
                          )
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedChallenge(null)}
                className="mt-6 w-full py-3 bg-[#00677f] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#00566a] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
