import React, { useState } from 'react';
import { LogEntry, UserProfile } from '../../types';

interface TrendsScreenProps {
  profile: UserProfile;
  logs: LogEntry[];
  onViewAllLogs: () => void;
}

interface DayData {
  day: string;
  amountMl: number;
  highlight?: boolean;
}

export const TrendsScreen: React.FC<TrendsScreenProps> = ({ profile, logs, onViewAllLogs }) => {
  const [selectedBar, setSelectedBar] = useState<DayData | null>(null);

  const weeklyData: DayData[] = [
    { day: 'M', amountMl: 1600 },
    { day: 'T', amountMl: 2200, highlight: true },
    { day: 'W', amountMl: 1400 },
    { day: 'T', amountMl: 1900 },
    { day: 'F', amountMl: 1200 },
    { day: 'S', amountMl: 2400, highlight: true },
    { day: 'S', amountMl: 1000 },
  ];

  const maxMl = 2500;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-28 pt-2">
      {/* Weekly Overview Chart Section */}
      <section className="px-6 py-3">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#dee8ff] relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00677f]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="font-['Inter'] text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
                Weekly Trends
              </p>
              <h2 className="font-['Montserrat'] text-2xl font-bold text-[#111c2d]">
                Hydration Flow
              </h2>
            </div>
            <div className="flex items-center gap-1.5 bg-[#e7eeff] px-3 py-1.5 rounded-full border border-white/50">
              <span className="material-symbols-outlined text-[#00677f] text-[18px]">
                calendar_today
              </span>
              <span className="font-['Inter'] text-xs font-semibold text-[#3c494e]">
                Oct 12 - 18
              </span>
            </div>
          </div>

          {/* Selected Bar Tooltip */}
          {selectedBar && (
            <div className="mb-3 p-2 bg-[#00677f] text-white text-xs rounded-lg text-center font-semibold animate-fadeIn">
              {selectedBar.day}: {selectedBar.amountMl} ml logged
            </div>
          )}

          {/* Bar Chart */}
          <div className="w-full h-48 relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
              {/* Grid Lines */}
              <line stroke="#d8e3fb" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="0" y2="0" />
              <line stroke="#d8e3fb" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="100" y2="100" />
              <line stroke="#d8e3fb" strokeWidth="1" x1="0" x2="400" y1="200" y2="200" />

              {/* Bars */}
              {weeklyData.map((d, idx) => {
                const barHeight = Math.min(200, (d.amountMl / maxMl) * 200);
                const yPos = 200 - barHeight;
                const xPos = 15 + idx * 55;
                const isSat = d.day === 'S' && idx === 5;

                return (
                  <rect
                    key={idx}
                    x={xPos}
                    y={yPos}
                    width="30"
                    height={barHeight}
                    rx="15"
                    className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${
                      isSat
                        ? 'fill-[#0453cd]'
                        : d.highlight
                        ? 'fill-[#00677f]'
                        : 'fill-[#00677f]/50'
                    }`}
                    onClick={() => setSelectedBar(d)}
                  />
                );
              })}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-3 px-3">
              {weeklyData.map((d, i) => (
                <span key={i} className="font-['Inter'] text-xs font-semibold text-[#3c494e] w-6 text-center">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats Bento Grid */}
      <section className="px-6 grid grid-cols-2 gap-4 mt-2">
        <div className="bg-[#00d2ff]/20 rounded-2xl p-4 flex flex-col gap-1 border border-white/60">
          <div className="w-10 h-10 rounded-full bg-[#00566a]/10 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[#00566a]">avg_pace</span>
          </div>
          <p className="font-['Inter'] text-[11px] font-semibold text-[#00566a]/80 uppercase">Daily Avg</p>
          <div className="flex items-baseline gap-1">
            <span className="font-['Montserrat'] text-2xl font-bold text-[#00566a]">2.1</span>
            <span className="font-['Inter'] text-xs font-semibold text-[#00566a]">Liters</span>
          </div>
        </div>

        <div className="bg-[#dee8ff] rounded-2xl p-4 flex flex-col gap-1 border border-white/60">
          <div className="w-10 h-10 rounded-full bg-[#0453cd]/10 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[#0453cd]">schedule</span>
          </div>
          <p className="font-['Inter'] text-[11px] font-semibold text-[#3c494e] uppercase">Peak Time</p>
          <div className="flex items-baseline gap-1">
            <span className="font-['Montserrat'] text-2xl font-bold text-[#111c2d]">10:45</span>
            <span className="font-['Inter'] text-xs font-semibold text-[#3c494e]">AM</span>
          </div>
        </div>

        <div className="col-span-2 bg-[#d8e3fb] rounded-2xl p-5 flex items-center justify-between border border-white/60">
          <div className="flex flex-col">
            <p className="font-['Inter'] text-[11px] font-semibold text-[#3c494e] uppercase">Longest Streak</p>
            <span className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
              {profile.longestStreak} Days
            </span>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-[#bbc9cf]"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <circle
                className="text-[#00677f]"
                cx="18"
                cy="18"
                fill="none"
                r="16"
                stroke="currentColor"
                strokeDasharray="100"
                strokeDashoffset="20"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[#00677f] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Card */}
      <section className="px-6 py-4">
        <div className="bg-[#e7eeff] rounded-2xl p-5 flex gap-4 items-start border border-white/60 shadow-sm">
          <div className="p-2.5 bg-[#00677f]/10 rounded-xl text-[#00677f] shrink-0">
            <span className="material-symbols-outlined text-2xl">lightbulb</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-['Montserrat'] text-base font-bold text-[#111c2d]">Hydration Insight</h3>
            <p className="font-['Inter'] text-sm text-[#3c494e] leading-relaxed">
              Your intake peaks during mid-morning. Try carrying a larger bottle during your 3 PM meetings to avoid the afternoon slump.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Logs Section */}
      <section className="px-6 flex flex-col gap-3 mb-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-['Montserrat'] text-xl font-bold text-[#111c2d]">Daily Logs</h3>
          <button
            onClick={onViewAllLogs}
            className="text-[#00677f] font-['Inter'] text-xs font-semibold cursor-pointer hover:underline"
          >
            VIEW ALL
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#e7eeff]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e7eeff] flex items-center justify-center font-bold text-[#00677f] text-sm">
                18
              </div>
              <div>
                <p className="font-['Inter'] text-sm font-semibold text-[#111c2d]">Today, Oct 18</p>
                <p className="font-['Inter'] text-xs text-[#3c494e]">1,850ml recorded</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#bbc9cf]">chevron_right</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#e7eeff]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e7eeff] flex items-center justify-center font-bold text-[#00677f] text-sm">
                17
              </div>
              <div>
                <p className="font-['Inter'] text-sm font-semibold text-[#111c2d]">Thursday, Oct 17</p>
                <p className="font-['Inter'] text-xs text-[#3c494e]">2,400ml recorded</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#bbc9cf]">chevron_right</span>
          </div>
        </div>
      </section>

      {/* Decorative Wave Component */}
      <div className="w-full h-16 overflow-hidden relative opacity-30 mt-auto">
        <svg className="absolute bottom-0 w-[200%] h-full animate-wave-slow" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,96C960,107,1056,117,1152,106.7C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="#00677f" />
        </svg>
      </div>
    </div>
  );
};
