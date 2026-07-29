import { useState, useEffect } from 'react';
import { UserProfile, LogEntry, Friend, PlantChallenge, TabType } from './types';
import {
  fetchUserProfile,
  updateUserProfileInSupabase,
  fetchUserLogs,
  addWaterLogToSupabase,
  fetchFriendsLeaderboard,
  fetchUserChallenges,
  unlockChallengeInSupabase,
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

  // 2. Fetch User Data when Logged In
  const loadUserData = async () => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const [userProfile, userLogs, friendsList, savedChallenges] = await Promise.all([
      fetchUserProfile(userId),
      fetchUserLogs(userId),
      fetchFriendsLeaderboard(userId),
      fetchUserChallenges(userId),
    ]);

    if (userProfile) setProfile(userProfile);
    setLogs(userLogs);
    setFriends(friendsList);

    // Merge saved Supabase challenge unlocks
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

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00677f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, render Auth Screen
  if (!session) {
    return <AuthScreen />;
  }

  // Fallback loading while profile loads
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center">
        <p className="font-semibold text-[#00677f]">Loading your hydration profile...</p>
      </div>
    );
  }

  // Handle Adding Water
  const handleAddWater = async (amountMl: number) => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const newLog = await addWaterLogToSupabase(userId, amountMl);
    if (newLog) {
      setLogs((prev) => [newLog, ...prev]);
      // Refresh friends leaderboard live
      const updatedFriends = await fetchFriendsLeaderboard(userId);
      setFriends(updatedFriends);
    }
  };

  // Handle Unlocking Challenges in Supabase
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
            onCheerFriend={(id) =>
              setFriends((prev) =>
                prev.map((f) => (f.id === id ? { ...f, cheered: !f.cheered } : f))
              )
            }
            onNudgeFriend={(id) =>
              setFriends((prev) =>
                prev.map((f) => (f.id === id ? { ...f, nudged: !f.nudged } : f))
              )
            }
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
