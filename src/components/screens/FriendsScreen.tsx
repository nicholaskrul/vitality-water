import React, { useState } from 'react';
import { Friend } from '../../types';

interface FriendsScreenProps {
  friends: Friend[];
  onCheerFriend: (id: string) => void;
  onNudgeFriend: (id: string) => void;
  onDrinkNow: () => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  friends,
  onCheerFriend,
  onNudgeFriend,
  onDrinkNow,
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const firstPlace = filteredFriends.find((f) => f.rank === 1) || friends[0];
  const secondPlace = filteredFriends.find((f) => f.rank === 2) || friends[1];
  const thirdPlace = filteredFriends.find((f) => f.rank === 3) || friends[2];

  const handleAction = (msg: string, actionFn: () => void) => {
    actionFn();
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-32 pt-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 glass bg-[#111c2d] text-white px-6 py-3 rounded-full font-['Inter'] text-xs font-semibold z-50 animate-bounce shadow-2xl border border-white/20">
          {toastMessage}
        </div>
      )}

      {/* Header & Search Section */}
      <section className="px-6 space-y-4">
        {/* Toggle */}
        <div className="flex items-center justify-between bg-[#f0f3ff] p-1 rounded-full border border-white/50">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 py-2 px-4 rounded-full font-['Inter'] text-xs font-semibold transition-all cursor-pointer ${
              timeframe === 'weekly'
                ? 'bg-[#00677f] text-white shadow-sm'
                : 'text-[#3c494e] hover:text-[#00677f]'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`flex-1 py-2 px-4 rounded-full font-['Inter'] text-xs font-semibold transition-all cursor-pointer ${
              timeframe === 'monthly'
                ? 'bg-[#00677f] text-white shadow-sm'
                : 'text-[#3c494e] hover:text-[#00677f]'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6c797f]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a friend..."
            className="w-full pl-12 pr-4 py-3 bg-[#d8e3fb] rounded-2xl font-['Inter'] text-sm text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 transition-all border border-white/40"
          />
        </div>
      </section>

      {/* Podium Section */}
      <section className="px-6 mt-6">
        <div className="flex items-end justify-center gap-3 h-64">
          {/* Rank 2 */}
          {secondPlace && (
            <div className="flex flex-col items-center flex-1 pb-2">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full border-4 border-[#d8e3fb] overflow-hidden shadow-md">
                  <img
                    src={secondPlace.avatarUrl}
                    alt={secondPlace.name}
                    className="w-full h-full object-cover scale-150 origin-top-left"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#d8e3fb] text-[#3c494e] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                  2nd
                </div>
              </div>
              <span className="font-['Montserrat'] text-xs font-bold text-[#111c2d] truncate w-20 text-center">
                {secondPlace.name}
              </span>
              <span className="font-['Inter'] text-[11px] font-semibold text-[#00677f]">
                {secondPlace.intakeLiters}L
              </span>
            </div>
          )}

          {/* Rank 1 */}
          {firstPlace && (
            <div className="flex flex-col items-center flex-1 relative z-10">
              <div className="absolute -top-10 w-32 h-32 bg-[#00677f]/10 blur-3xl rounded-full animate-pulse pointer-events-none"></div>
              <div className="relative mb-4 scale-110">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-amber-400 animate-bounce">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    workspace_premium
                  </span>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-[#00677f] overflow-hidden shadow-xl ring-4 ring-[#00677f]/20">
                  <img
                    src={firstPlace.avatarUrl}
                    alt={firstPlace.name}
                    className="w-full h-full object-cover scale-150 origin-bottom-right"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#00677f] text-white font-bold text-[11px] px-3 py-0.5 rounded-full shadow-lg">
                  1st
                </div>
              </div>
              <span className="font-['Montserrat'] text-sm font-bold text-[#111c2d] truncate w-24 text-center">
                {firstPlace.name}
              </span>
              <div className="flex items-center gap-1 my-0.5">
                <span
                  className="material-symbols-outlined text-[#00677f] text-xs"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
                <span className="font-['Inter'] text-[10px] font-medium text-[#3c494e]">
                  {firstPlace.streakDays} Day Streak
                </span>
              </div>
              <span className="font-['Montserrat'] text-xl font-bold text-[#00677f]">
                {firstPlace.intakeLiters}L
              </span>
            </div>
          )}

          {/* Rank 3 */}
          {thirdPlace && (
            <div className="flex flex-col items-center flex-1 pb-2">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full border-4 border-[#d8e3fb] overflow-hidden shadow-md">
                  <img
                    src={thirdPlace.avatarUrl}
                    alt={thirdPlace.name}
                    className="w-full h-full object-cover scale-150 origin-center"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#d8e3fb] text-[#3c494e] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
                  3rd
                </div>
              </div>
              <span className="font-['Montserrat'] text-xs font-bold text-[#111c2d] truncate w-20 text-center">
                {thirdPlace.name}
              </span>
              <span className="font-['Inter'] text-[11px] font-semibold text-[#00677f]">
                {thirdPlace.intakeLiters}L
              </span>
            </div>
          )}
        </div>
      </section>

      {/* List View */}
      <section className="mt-6 px-6 space-y-3">
        {filteredFriends.slice(3).map((friend) => {
          const isUser = friend.id === 'alex';

          if (isUser) {
            return (
              <div
                key={friend.id}
                className="flex items-center gap-4 bg-[#00d2ff]/20 p-4 rounded-2xl border-l-4 border-[#00677f] shadow-sm"
              >
                <span className="font-['Montserrat'] font-bold text-[#00677f] w-5 text-center text-lg">
                  {friend.rank}
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#bbc9cf] shrink-0">
                  <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Montserrat'] text-sm font-bold text-[#111c2d] truncate">
                    {friend.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 flex-1 bg-[#d8e3fb] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00677f] rounded-full transition-all duration-500"
                        style={{ width: `${friend.goalPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-['Inter'] text-[10px] font-semibold text-[#3c494e] whitespace-nowrap">
                      {friend.goalPercentage}% of goal
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-['Inter'] text-[11px] font-semibold text-[#3c494e]">
                    {friend.streakDays} Day Streak
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={friend.id}
              className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#e7eeff]"
            >
              <span className="font-['Montserrat'] font-bold text-[#6c797f] w-5 text-center text-lg">
                {friend.rank}
              </span>
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#e7eeff]">
                <img
                  src={friend.avatarUrl}
                  alt={friend.name}
                  className="w-full h-full object-cover scale-150 origin-bottom-left"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-['Montserrat'] text-sm font-bold text-[#111c2d] truncate">
                  {friend.name}
                </h4>
                <span className="font-['Inter'] text-xs font-medium text-[#3c494e]">
                  {friend.goalPercentage}% of goal
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleAction(`Cheered ${friend.name}!`, () => onCheerFriend(friend.id))
                  }
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
                    friend.cheered
                      ? 'bg-[#00677f] text-white shadow-md'
                      : 'bg-[#356ee7]/10 text-[#0453cd] hover:bg-[#356ee7]/20'
                  }`}
                  title={`Cheer ${friend.name}`}
                >
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </button>
                <button
                  onClick={() =>
                    handleAction(`Nudged ${friend.name}!`, () => onNudgeFriend(friend.id))
                  }
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
                    friend.nudged
                      ? 'bg-[#00677f] text-white shadow-md'
                      : 'bg-[#b9c2c8]/20 text-[#576065] hover:bg-[#b9c2c8]/40'
                  }`}
                  title={`Nudge ${friend.name}`}
                >
                  <span className="material-symbols-outlined text-xl">notifications_active</span>
                </button>
              </div>
            </div>
          );
        })}

        <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-60">
          <span className="material-symbols-outlined text-3xl text-[#6c797f]">waves</span>
          <p className="font-['Inter'] text-xs text-[#3c494e]">More friends are hydrating...</p>
        </div>
      </section>

      {/* Floating User Ranking Context Bar */}
      <div className="fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto">
        <div className="glass bg-[#00677f]/95 rounded-2xl p-4 flex items-center justify-between shadow-xl shadow-[#00677f]/25 border border-white/20 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-['Montserrat'] font-bold text-lg">
              4
            </div>
            <div>
              <p className="font-['Montserrat'] text-sm font-bold">You're in 4th place!</p>
              <p className="font-['Inter'] text-xs text-white/80">Just 0.2L behind Elena</p>
            </div>
          </div>
          <button
            onClick={onDrinkNow}
            className="bg-white text-[#00677f] hover:bg-slate-100 active:scale-95 px-4 py-2 rounded-full font-['Inter'] text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Drink Now
          </button>
        </div>
      </div>
    </div>
  );
};
