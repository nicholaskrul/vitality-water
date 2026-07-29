import { useState, useEffect } from 'react';
import { UserProfile, LogEntry, Friend, PlantChallenge, TabType, NotificationItem } from './types';
import {
  fetchUserProfile,
  updateUserProfileInSupabase,
  fetchUserLogs,
  addWaterLogToSupabase,
  fetchFriendsLeaderboard,
  fetchUserChallenges,
  unlockChallengeInSupabase,
  sendNotificationInSupabase,
  fetchUserNotifications,
  markNotificationAsRead,
  INITIAL_CHALLENGES,
} from './data';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { TrendsScreen } from './components/screens/TrendsScreen';
import { FriendsScreen } from './components/screens/FriendsScreen';
import { ChallengesScreen } from './components/screens/ChallengesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { CustomAddModal } from './components/CustomAddModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [challenges, setChallenges] = useState<PlantChallenge[]>(INITIAL_CHALLENGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isCustomAddOpen, setIsCustomAddOpen] = useState(false);

  // 1. Listen for Supabase Authentication State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch User Data & Notifications when Logged In
  const loadUserData = async () => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const [userProfile, userLogs, friendsList, savedChallenges, userNotifs] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserLogs(userId),
      fetchFriendsLeaderboard(userId),
      fetchUserChallenges(userId),
      fetchUserNotifications(userId),
    ]);

    if (userProfile) setProfile(userProfile);
    setLogs(userLogs);
    setFriends(friendsList);
    setNotifications(userNotifs);

    setChallenges((prev) =>
      prev.map((c) => ({
        ...c,
        unlocked: !!savedChallenges[c.id],
      }))
    );
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadUserData();
    }
  }, [session]);

  // 3. Smart Inactivity Reminder (3-hour check between 10 AM and 8 PM)
  useEffect(() => {
    // Request permission if default
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkHydrationInactivity = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Only run between 10:00 AM (10) and 8:00 PM (20)
      if (currentHour < 10 || currentHour >= 20) return;

      if (!logs || logs.length === 0) return;

      const latestLogTime = new Date(logs[0].timestamp).getTime();
      const threeHoursInMs = 3 * 60 * 60 * 1000;
      const timeSinceLastDrink = now.getTime() - latestLogTime;

      if (timeSinceLastDrink >= threeHoursInMs) {
        const lastNotified = localStorage.getItem('last_inactivity_notif_time');
        const nowTs = now.getTime();

        // Throttle: don't notify if already alerted within the last 3 hours
        if (!lastNotified || nowTs - Number(lastNotified) >= threeHoursInMs) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Hydration Reminder', {
              body: "It's been over 3 hours since your last drink! Time to stay hydrated.",
              icon: profile?.avatarUrl || '/favicon.ico',
            });
          }

          localStorage.setItem('last_inactivity_notif_time', nowTs.toString());
        }
      }
    };

    checkHydrationInactivity();
    const intervalId = setInterval(checkHydrationInactivity, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [logs, profile]);

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00677f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <p className="font-semibold text-[#00677f]">Loading your hydration profile...</p>
      </div>
    );
  }

  const handleAddWater = async (amountMl: number) => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const newLog = await addWaterLogToSupabase(userId, amountMl);
    if (newLog) {
      setLogs((prev) => [newLog, ...prev]);
      const updatedFriends = await fetchFriendsLeaderboard(userId);
      setFriends(updatedFriends);
    }
  };

  const handleCheerFriend = async (friendId: string) => {
    if (!session?.user?.id || !profile) return;
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, cheered: !f.cheered } : f))
    );
    await sendNotificationInSupabase(session.user.id, friendId, profile.name, 'cheer');
  };

  const handleNudgeFriend = async (friendId: string) => {
    if (!session?.user?.id || !profile) return;
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, nudged: !f.nudged } : f))
    );
    await sendNotificationInSupabase(session.user.id, friendId, profile.name, 'nudge');
  };

  const handleDismissNotification = async (notificationId: string) => {
    await markNotificationAsRead(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleUnlockChallenge = async (challengeId: string) => {
    if (!session?.user?.id) return;
    await unlockChallengeInSupabase(session.user.id, challengeId);
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, unlocked: true } : c))
    );
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    if (!session?.user?.id) return;
    setProfile((prev) => (prev ? { ...prev, ...updated } : null));
    await updateUserProfileInSupabase(session.user.id, updated);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2d] flex flex-col font-['Inter'] antialiased">
      <Header
        activeTab={activeTab}
        userAvatar={profile.avatarUrl}
        onAvatarClick={() => setActiveTab('settings')}
      />

      {/* Received Notifications Popup Modal */}
      {notifications.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl relative border border-[#e7eeff] text-center space-y-4">
            <div className="w-14 h-14 bg-[#00d2ff]/20 text-[#00677f] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">
                {notifications[0].type === 'cheer' ? 'sports_score' : 'water_drop'}
              </span>
            </div>
            <div>
              <h3 className="font-['Montserrat'] text-lg font-bold text-[#111c2d]">
                {notifications[0].type === 'cheer' ? '👏 Cheer Received!' : '💧 Hydration Nudge!'}
              </h3>
              <p className="text-xs text-[#3c494e] mt-2 leading-relaxed">
                <strong>{notifications[0].senderName}</strong>{' '}
                {notifications[0].type === 'cheer'
                  ? 'cheered on your hydration progress!'
                  : 'sent you a friendly nudge to drink some water!'}
              </p>
            </div>
            <button
              onClick={() => handleDismissNotification(notifications[0].id)}
              className="w-full py-3 bg-[#00677f] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#00566a] transition-colors cursor-pointer"
            >
              {notifications[0].type === 'nudge' ? 'Drink Water Now' : 'Thanks!'}
            </button>
          </div>
        </div>
      )}

      <main className="pt-16 flex-1 flex flex-col items-center">
        {activeTab === 'home' && (
          <HomeScreen
            profile={profile}
            logs={logs}
            onAddWater={handleAddWater}
            onOpenCustomAdd={() => setIsCustomAddOpen(true)}
          />
        )}
        {activeTab === 'trends' && (
          <TrendsScreen profile={profile} logs={logs} onViewAllLogs={() => setActiveTab('home')} />
        )}
        {activeTab === 'friends' && (
          <FriendsScreen
            friends={friends}
            currentUserId={session?.user?.id}
            onCheerFriend={handleCheerFriend}
            onNudgeFriend={handleNudgeFriend}
          />
        )}
        {activeTab === 'challenges' && (
          <ChallengesScreen
            challenges={challenges}
            profile={profile}
            logs={logs}
            onUnlockChallenge={handleUnlockChallenge}
          />
        )}
        {activeTab === 'settings' && (
          <div className="w-full">
            <SettingsScreen profile={profile} onUpdateProfile={handleUpdateProfile} />
            <div className="max-w-md mx-auto px-6 -mt-20 mb-28">
              <button
                onClick={handleSignOut}
                className="w-full py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-bold text-xs border border-red-200 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </main>

      <CustomAddModal
        isOpen={isCustomAddOpen}
        onClose={() => setIsCustomAddOpen(false)}
        onAdd={handleAddWater}
        preferredUnit={profile.preferredUnit}
      />

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
