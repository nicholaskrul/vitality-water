import React, { useState } from 'react';
import { Friend, FriendRequest } from '../../types';

interface FriendsScreenProps {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  currentUserId?: string;
  onCheerFriend: (id: string) => void;
  onNudgeFriend: (id: string) => void;
  onSendInvite: (email: string) => Promise<{ success: boolean; message: string }>;
  onRespondRequest: (requestId: string, accept: boolean) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  friends,
  pendingRequests,
  currentUserId,
  onCheerFriend,
  onNudgeFriend,
  onSendInvite,
  onRespondRequest,
}) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const topThree = friends.slice(0, 3);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setLoading(true);
    setInviteStatus(null);
    const result = await onSendInvite(emailInput);
    setLoading(false);
    setInviteStatus(result);

    if (result.success) {
      setEmailInput('');
      setTimeout(() => {
        setIsInviteOpen(false);
        setInviteStatus(null);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-6 pb-28 pt-2 font-['Inter'] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-[#3c494e] uppercase tracking-wider">
            Community
          </span>
          <h2 className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
            Leaderboard
          </h2>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="bg-[#00677f] text-white px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#00566a] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          Add Friend
        </button>
      </div>

      {/* Pending Invitations Section */}
      {pendingRequests.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">mail</span>
            Pending Friend Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-3 rounded-xl flex items-center justify-between shadow-sm border border-amber-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                    <img
                      src={req.requesterAvatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={req.requesterName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-['Montserrat'] text-xs font-bold text-[#111c2d]">
                    {req.requesterName}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onRespondRequest(req.id, true)}
                    className="bg-[#00677f] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#00566a] cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRespondRequest(req.id, false)}
                    className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
          Your Friends
        </h3>

        {friends.length <= 1 ? (
          <div className="bg-[#f0f3ff] rounded-2xl p-6 text-center text-xs text-[#6c797f] border border-white/60">
            You don't have any added friends yet. Tap <strong>+ Add Friend</strong> above to invite your buddies!
          </div>
        ) : (
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
                      <p className="font-[#111c2d] font-['Montserrat'] text-xs font-bold">
                        {friend.name} {isUser && '(You)'}
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
        )}
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl relative border border-[#e7eeff] text-center space-y-4">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#f0f3ff] text-[#3c494e] flex items-center justify-center font-bold text-xs"
            >
              ✕
            </button>

            <div className="w-12 h-12 bg-[#00d2ff]/20 text-[#00677f] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>

            <div>
              <h3 className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">
                Invite a Friend
              </h3>
              <p className="text-xs text-[#3c494e] mt-1">
                Enter your friend's registered email address to send an invitation.
              </p>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3 pt-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="friend@example.com"
                className="w-full bg-[#f0f3ff] border border-[#e7eeff] rounded-xl px-4 py-2.5 text-xs font-semibold text-[#111c2d] focus:outline-none focus:border-[#00677f]"
              />

              {inviteStatus && (
                <p className={`text-xs font-bold ${inviteStatus.success ? 'text-green-600' : 'text-red-500'}`}>
                  {inviteStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00677f] text-white rounded-xl text-xs font-bold hover:bg-[#00566a] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Friend Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
