import React, { useState } from 'react';
import { LogEntry, UserProfile } from '../../types';

interface TrendsScreenProps {
  profile: UserProfile;
  logs: LogEntry[];
  onViewAllLogs: () => void;
}

interface DayData {
  day: string;
  dateStr: string;
  amountMl: number;
}

export const TrendsScreen: React.FC<TrendsScreenProps> = ({ profile, logs }) => {
  const [selectedBar, setSelectedBar] = useState<DayData | null>(null);

  // Compute last 7 days data dynamically from real logs
  const past7Days: DayData[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dateString = d.toDateString();

    const dayLogs = logs.filter(
      (l) => new Date(l.timestamp).toDateString() === dateString
    );
    const totalMl = dayLogs.reduce((sum, l) => sum + l.amountMl, 0);

    return {
      day: dayName,
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amountMl: totalMl,
    };
  });

  const maxMl = Math.max(profile.dailyTargetMl, ...past7Days.map((d) => d.amountMl), 1000);

  // Calculate real Daily Average over logged days
  const activeDays = past7Days.filter((d) => d.amountMl > 0).length || 1;
  const totalPast7Ml = past7Days.reduce((sum, d) => sum + d.amountMl, 0);
  const dailyAvgLiters = (totalPast7Ml / activeDays / 1000).toFixed(1);

  // Group logs by Date for the Daily History list
  const groupedLogs = logs.reduce((acc, log) => {
    const key = log.dateStr;
    if (!acc[key]) acc[key] = { dateStr: key, totalMl: 0, count: 0 };
    acc[key].totalMl += log.amountMl;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { dateStr: string; totalMl: number; count: number }>);

  const logsList = Object.values(groupedLogs).slice(0, 5);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-28 pt-2 font-['Inter']">
      {/* Weekly Overview Chart Section */}
      <section className="px-6 py-3">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#dee8ff] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00677f]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
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
              <span className="text-xs font-semibold text-[#3c494e]">Last 7 Days</span>
            </div>
          </div>

          {selectedBar && (
            <div className="mb-3 p-2 bg-[#00677f] text-white text-xs rounded-lg text-center font-semibold animate-fadeIn">
              {selectedBar.dateStr}: {selectedBar.amountMl} ml logged
            </div>
          )}

          {/* Bar Chart */}
          <div className="w-full h-48 relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
              <line stroke="#d8e3fb" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="0" y2="0" />
              <line stroke="#d8e3fb" strokeDasharray="4" strokeWidth="1" x1="0" x2="400" y1="100" y2="100" />
              <line stroke="#d8e3fb" strokeWidth="1" x1="0" x2="400" y1="200" y2="200" />
              {past7Days.map((d, idx) => {
                const barHeight = Math.min(200, (d.amountMl / maxMl) * 200);
                const yPos = 200 - barHeight;
                const xPos = 15 + idx * 55;
                const isGoalMet = d.amountMl >= profile.dailyTargetMl;
                return (
                  <rect
                    key={idx}
                    x={xPos}
                    y={yPos}
                    width="30"
                    height={barHeight}
                    rx="15"
                    className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${
                      isGoalMet
                        ? 'fill-[#0453cd]'
                        : d.amountMl > 0
                        ? 'fill-[#00677f]'
                        : 'fill-[#bbc9cf]/40'
                    }`}
                    onClick={() => setSelectedBar(d)}
                  />
                );
              })}
            </svg>
            <div className="flex justify-between mt-3 px-3">
              {past7Days.map((d, i) => (
                <span key={i} className="text-xs font-semibold text-[#3c494e] w-6 text-center">
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats Grid */}
      <section className="px-6 grid grid-cols-2 gap-4 mt-2">
        <div className="bg-[#00d2ff]/20 rounded-2xl p-4 flex flex-col gap-1 border border-white/60">
          <div className="w-10 h-10 rounded-full bg-[#00566a]/10 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[#00566a]">avg_pace</span>
          </div>
          <p className="text-[11px] font-semibold text-[#00566a]/80 uppercase">Daily Avg</p>
          <div className="flex items-baseline gap-1">
            <span className="font-['Montserrat'] text-2xl font-bold text-[#00566a]">{dailyAvgLiters}</span>
            <span className="text-xs font-semibold text-[#00566a]">Liters</span>
          </div>
        </div>

        <div className="bg-[#d8e3fb] rounded-2xl p-4 flex flex-col gap-1 border border-white/60">
          <div className="w-10 h-10 rounded-full bg-[#00677f]/10 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-[#00677f]">local_fire_department</span>
          </div>
          <p className="text-[11px] font-semibold text-[#3c494e] uppercase">Current Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">{profile.currentStreak}</span>
            <span className="text-xs font-semibold text-[#3c494e]">Days</span>
          </div>
        </div>
      </section>

      {/* Daily History List */}
      <section className="px-6 flex flex-col gap-3 mt-5 mb-6">
        <h3 className="font-['Montserrat'] text-xl font-bold text-[#111c2d]">Daily History</h3>
        <div className="space-y-3">
          {logsList.length === 0 ? (
            <div className="p-4 bg-white rounded-2xl text-center text-xs text-[#3c494e] border border-[#e7eeff]">
              No water logged yet! Use Quick Add on the home screen to log your first drink.
            </div>
          ) : (
            logsList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-[#e7eeff]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e7eeff] flex items-center justify-center font-bold text-[#00677f] text-sm">
                    💧
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111c2d]">{item.dateStr}</p>
                    <p className="text-xs text-[#3c494e]">
                      {item.totalMl.toLocaleString()}ml recorded ({item.count} logs)
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};