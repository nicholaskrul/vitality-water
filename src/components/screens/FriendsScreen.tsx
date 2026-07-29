import React from 'react';
import { Friend } from '../../types';

interface FriendsScreenProps {
  friends: Friend[];
  currentUserId?: string;
  onCheerFriend: (id: string) => void;
  onNudgeFriend: (id: string) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  friends,
  currentUserId,
  onCheerFriend,
  onNudgeFriend,
}) => {
  const topThree = friends.slice(0, 3);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
          Community
        </span>
        <h2 className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
          Leaderboard
        </h2>
      </div>

      {/* Podium (Top 3) */}
      {topThree.length > 0 && (
        <div className="bg-[#e7eeff] rounded-3xl p-6 shadow-sm border border-white/60 flex items-end justify-center gap-4 pt-8">
          {topThree.map((friend) => (
            <div
              key={friend.id}
              className={`flex flex-col items-center relative ${
                friend.rank === 1 ? '-translate-y-2 order-2 scale-105' : 'order-1'
              }`}
            >
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden border-2 bg-white ${
                    friend.rank === 1 ? 'border-amber-400 shadow-md' : 'border-[#00677f]/30'
                  }`}
                >
                  <img
                    src={friend.avatarUrl}
                    alt={friend.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-1 w-5 h-5 bg-[#00677f] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  #{friend.rank}
                </div>
              </div>

              <span className="font-['Montserrat'] text-xs font-bold text-[#111c2d] mt-2 truncate max-w-[80px]">
                {friend.name}
              </span>
              <span className="text-[10px] font-bold text-[#00677f]">
                {friend.intakeLiters}L
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Friends List */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-[#3c494e] uppercase tracking-wider ml-1">
          All Friends
        </h3>

        <div className="space-y-2">
          {friends.map((friend) => {
            const isUser = friend.id === currentUserId;

            return (
              <div
                key={friend.id}
                className={`p-4 rounded-2xl flex items-center justify-between border transition-all ${
                  isUser
                    ? 'bg-[#00677f]/10 border-[#00677f]/30 shadow-sm'
                    : 'bg-white border-[#e7eeff] shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-['Montserrat'] text-xs font-bold text-[#3c494e] w-4">
                    #{friend.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e7eeff] bg-slate-100 shrink-0">
                    <img
                      src={friend.avatarUrl}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-['Montserrat'] text-xs font-bold text-[#111c2d]">
                      {friend.name}
                    </p>
                    <p className="text-[10px] text-[#6c797f] font-semibold">
                      {friend.intakeLiters}L / {friend.targetLiters}L ({friend.goalPercentage}%)
                    </p>
                  </div>
                </div>

                {!isUser && (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onCheerFriend(friend.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        friend.cheered
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-[#f0f3ff] text-[#00677f] hover:bg-[#dee8ff]'
                      }`}
                    >
                      {friend.cheered ? '👏 Cheered' : '👏 Cheer'}
                    </button>
                    <button
                      onClick={() => onNudgeFriend(friend.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        friend.nudged
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-[#f0f3ff] text-[#3c494e] hover:bg-[#dee8ff]'
                      }`}
                    >
                      {friend.nudged ? '💧 Nudged' : '💧 Nudge'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
