import React, { useState } from 'react';
import { PlantChallenge } from '../../types';

interface ChallengesScreenProps {
  challenges: PlantChallenge[];
}

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ challenges }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<PlantChallenge | null>(null);

  const unlockedCount = challenges.filter((c) => c.unlocked).length;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2">
      {/* Header Section with Forest Summary */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-['Inter'] text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
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
              {unlockedCount * 4}
            </span>
          </div>
        </div>
        <p className="font-['Inter'] text-xs text-[#3c494e] leading-relaxed">
          Every drop you drink nourishes your virtual garden. Reach milestones to see your forest bloom.
        </p>
      </div>

      {/* Forest Grid */}
      <div className="grid grid-cols-2 gap-4">
        {challenges.map((item) => {
          if (item.unlocked) {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedChallenge(item)}
                className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <div className="bg-[#f0f3ff] rounded-2xl p-4 flex flex-col items-center justify-between aspect-square border border-white/60 shadow-sm hover:shadow-md">
                  <div className="w-full h-24 relative flex items-center justify-center overflow-hidden rounded-xl bg-white/40">
                    <img
                      src={item.imgUrl}
                      alt={item.alt}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="font-['Inter'] text-[10px] font-bold text-[#00677f] tracking-wide block uppercase">
                      {item.title}
                    </span>
                    <span className="font-['Montserrat'] text-xs font-semibold text-[#111c2d]">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <div className="absolute -top-1.5 -right-1.5 bg-[#00677f] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  <span
                    className="material-symbols-outlined text-sm font-bold"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
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
              <div className="bg-[#d8e3fb]/50 rounded-2xl p-4 flex flex-col items-center justify-between aspect-square grayscale opacity-60 border border-white/40">
                <div className="w-full h-24 relative flex items-center justify-center overflow-hidden rounded-xl bg-white/20">
                  <img
                    src={item.imgUrl}
                    alt={item.alt}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="font-['Inter'] text-[10px] font-bold text-[#3c494e] tracking-wide block uppercase">
                    {item.title}
                  </span>
                  <span className="font-['Montserrat'] text-xs font-semibold text-[#3c494e]">
                    {item.subtitle}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2 bg-white/80 rounded-full shadow-md backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[#6c797f] text-2xl">
                    lock
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth Progress Card */}
      <div className="mt-6 bg-[#356ee7] rounded-2xl p-6 relative overflow-hidden shadow-lg text-white">
        <div className="relative z-10">
          <h3 className="font-['Montserrat'] text-xl font-bold mb-1">Next Bloom</h3>
          <p className="font-['Inter'] text-xs text-white/90 mb-5 leading-relaxed">
            Drink 1.2L more today to unlock the 'Raindrop Lily'.
          </p>
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-[#47d6ff] h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: '65%' }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-['Inter'] text-xs font-semibold text-white/90">
              1.8L / 3.0L
            </span>
            <span className="font-['Inter'] text-xs font-bold text-white">
              65%
            </span>
          </div>
        </div>

        {/* Decorative Wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-15 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 400 100"
        >
          <path d="M0,50 C150,100 250,0 400,50 L400,100 L0,100 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Encouragement Footer */}
      <div className="mt-6 flex flex-col items-center text-center p-6 bg-[#e7eeff]/60 rounded-3xl border border-white/60">
        <div className="w-14 h-14 bg-[#e7eeff] flex items-center justify-center rounded-full mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[#00677f] text-3xl">
            psychology_alt
          </span>
        </div>
        <span className="font-['Montserrat'] text-base font-bold text-[#111c2d]">
          Keep Hydrating
        </span>
        <p className="font-['Inter'] text-xs text-[#3c494e] max-w-xs mt-1.5 leading-relaxed">
          Your forest grows with every glass. New seeds arrive every Monday.
        </p>
      </div>

      {/* Challenge Details Modal */}
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

              <span className="font-['Inter'] text-xs font-bold text-[#00677f] tracking-widest uppercase">
                {selectedChallenge.title}
              </span>
              <h3 className="font-['Montserrat'] text-xl font-bold text-[#111c2d] mt-1">
                {selectedChallenge.subtitle}
              </h3>

              <div className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e7eeff] text-[#00677f] border border-[#00677f]/20">
                {selectedChallenge.unlocked ? '✨ Unlocked Achievement' : '🔒 Locked Plant Seed'}
              </div>

              <p className="font-['Inter'] text-xs text-[#3c494e] mt-4 leading-relaxed">
                {selectedChallenge.description}
              </p>

              <div className="mt-4 p-3 bg-[#f0f3ff] rounded-xl w-full text-left border border-white/60">
                <span className="font-['Inter'] text-[10px] font-bold text-[#3c494e] uppercase block mb-1">
                  Requirement
                </span>
                <span className="font-['Inter'] text-xs text-[#111c2d] font-medium">
                  {selectedChallenge.requirement}
                </span>
              </div>

              <button
                onClick={() => setSelectedChallenge(null)}
                className="mt-6 w-full py-3 bg-[#00677f] text-white rounded-xl font-['Inter'] text-xs font-bold shadow-md hover:bg-[#00566a] transition-colors cursor-pointer"
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
