import { supabase } from './lib/supabase';
import {
  UserProfile,
  LogEntry,
  Friend,
  PlantChallenge,
  NotificationItem,
  FriendRequest,
  CandidateUser,
} from './types';

// ==========================================
// APP LOGO
// ==========================================

export const LOGO_URL = 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=100';

// ==========================================
// UNIT CONVERSION HELPERS
// ==========================================

export function mlToOz(ml: number): number {
  return ml * 0.033814;
}

export function ozToMl(oz: number): number {
  return oz / 0.033814;
}

export function formatVolume(amountMl: number, unit: 'ml' | 'oz' = 'ml'): string {
  if (unit === 'oz') {
    return `${Math.round(mlToOz(amountMl))} oz`;
  }
  return `${amountMl} ml`;
}

// ==========================================
// DEFAULT CHALLENGES DATA
// ==========================================

export const INITIAL_CHALLENGES: PlantChallenge[] = [
  {
    id: 'fern',
    title: 'MISTY FERN',
    subtitle: '7-Day Streak',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrUIuM9xGwmPwQpWX88lYdmt563xRyhmVkwk8aFMQNQA2hUXrpGyG4hmsJ2PO_97M2eOqugcQvXcfW7lrfeVCGsD1amSdJFZ-SdiFvKFAXbCq9M3aXS4zq9mpRcFuRCVL-JZZUZQ_oxNWi-rjDzyQ_6Ik58qWrgPd0tLmaU5rpcf8IBwnhKGW5y4-Rs1kWE0nEwKipGJT_XQtaXvNHCTETEKt5-qOYFcfw0A8Mh7Yru3UP0qyeNW8',
    alt: 'Misty Fern',
    unlocked: false,
    requirement: 'Maintained a 7-day hydration streak',
    description:
      'A vibrant fern growing from a floating clod of moist earth with glistening water droplets.',
  },
  {
    id: 'lotus',
    title: 'AQUA LOTUS',
    subtitle: 'First 3L Day',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYv5a8lwFQfXByT2hizHu8eKBIdpToWJYvdIuV6Te-7j7tIgpLW5RPLeE_JKju47MqTPGBLzxtJ3BU9D4kumItdbJkCDYHRG6EPs6JvX9iNRNJkKofmkOwl9hndoJO7XT8sr7W5fVgNTqLMDO2HLxlwtdsHv6bvS4kr3SkUpdPOuQeKeOq3TjNu8EN0vkp2-4WlX-bNdaAx1i8Oc1PGg9EkLgC5drBaPShX-5y2tzLbnQzXa33TjKO',
    alt: 'Aqua Lotus',
    unlocked: false,
    requirement: 'Logged 3.0L or more in a single day',
    description:
      'A luminous crystal lotus floating on perfectly still water with blue refractions.',
  },
  {
    id: 'sprout',
    title: 'DAWN SPROUT',
    subtitle: '30 Morning Drinks',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBuq5skUL-hIyY85TkS0QhXaDWUuyIdr_I8RYSF6ZMWJAu6V2wxsZ_klrfEv5GsNW90iUyscCxAreppAStKYU_iPSK7-z7l22hREO7-pVaM3APCZyhwzYCs-lgSevdtfN49c7WKg2h9SY3MI-RmP5lJ8-n6CdabaJa9YxcE_8gwUXSSvw4R7Nm9CD3Ym9OEsYM2rirJrXeG_xsK2ZglQAZPtqtOZj77uqjK--OHECHjnB_K1b_FTL7',
    alt: 'Dawn Sprout',
    unlocked: false,
    requirement: 'Drank water before 9:00 AM on 30 separate mornings',
    description:
      'A delicate sapling reaching toward soft morning light with fresh dew drops.',
  },
  {
    id: 'oak',
    title: 'DEEP CURRENT OAK',
    subtitle: '30-Day Goal Hit',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmhSBRpT-ZZeDyCQht040-TzoxwvzoXRSd03wLuuWpEUlUlSVZxf_DVR-0IvoZvOA5l_yDLMhpbpZM0hehEIlNXrvgumjgqM26_L4JKvT6rjw7MHma6WyFqhWGNnMOxJuG5DDZqt3PQvXr7m0y8BRIEF01rBwK-oc7rkTaVWes8z-tSw_dcsVDaoBa3Mb_TUTMA4ug-XmzYhVn3nMhN0PcwhqjLDg5fo1-1GOlKaTESRvVoCUgZYyR',
    alt: 'Deep Current Oak',
    unlocked: false,
    requirement: 'Achieve 100% daily hydration goal for 30 consecutive days',
    description:
      'A majestic ancient oak with glowing cyan fluid veins nourishing deep subterranean roots.',
    progressMl: 0,
    targetMl: 30000,
  },
  {
    id: 'bamboo',
    title: 'PRISM BAMBOO',
    subtitle: '100L Total',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0CZLFrSWPJhEk_AK3WPjFXa7pTtsmlYERYcmLdgdS0pnwKj8V2loCcVFhyxN_ncvK_YDncGb0sTUXDqOBO_h7bCRH_G4i-HlzhMcNXMNd22R-w7ZFggegkRCoZikotPNn57PGgwR5EF-5a5v8qx0zHQdIJqOIMdWIzO0CPei1T0zVZCWtoEB3myCF5i5i7m5KmSG3IUwQ-L99CSlPLPuelHUW3MWttBD6Ydyth2lrfuHSCCRGjUat',
    alt: 'Prism Bamboo',
    unlocked: false,
    requirement: 'Log a total cumulative intake of 100 Liters',
    description:
      'Crystalline bamboo stalks that split sunlight into vibrant prismatic spectrums.',
    progressMl: 0,
    targetMl: 100000,
  },
  {
    id: 'desert',
    title: 'DESERT PEARL',
    subtitle: '4 Active Weekends',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATbv2mCc54BkCHtWQXZMt2mLbtfyvJRKXReWA8_vsTXP0y81S6Mh3m_qIs2KvTRiGO2Me2OuQFLnDh3WDY4ZrSuZNyngFUKXeXJpTBnNDCE2UR_GDgRSvqX7mz34UUjtNy3VvAe3NCU-TNr3p4x17NdShVn-CpRhfBwbeA-7K_-3L52bd-RqEedYeQgHzCbpuvPD8g3Yg3N-N3bX0-09F0giD08R0ZwbHPIcejyhHTIPegJ7JjxfLf',
    alt: 'Desert Pearl',
    unlocked: false,
    requirement: 'Meet hydration goals on both Saturday and Sunday for 4 weekends',
    description:
      'Frost-textured desert succulents that hold pure moisture in geometric leaves.',
    progressMl: 0,
    targetMl: 4,
  },
];

// ==========================================
// SUPABASE DATA FETCHING & MUTATION FUNCTIONS
// ==========================================

/**
 * Fetch User Profile from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name || 'Hydration Hero',
    avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    dailyTargetMl: data.daily_target_ml || 2500,
    preferredUnit: data.preferred_unit || 'ml',
    currentStreak: data.current_streak || 1,
    longestStreak: data.longest_streak || 1,
  };
}

/**
 * Update User Profile in Supabase
 */
export async function updateUserProfileInSupabase(
  userId: string,
  updated: Partial<UserProfile> & { email?: string }
): Promise<void> {
  const payload: any = {};
  if (updated.name !== undefined) payload.name = updated.name;
  if (updated.avatarUrl !== undefined) payload.avatar_url = updated.avatarUrl;
  if (updated.dailyTargetMl !== undefined) payload.daily_target_ml = updated.dailyTargetMl;
  if (updated.preferredUnit !== undefined) payload.preferred_unit = updated.preferredUnit;
  if (updated.currentStreak !== undefined) payload.current_streak = updated.currentStreak;
  if (updated.longestStreak !== undefined) payload.longest_streak = updated.longestStreak;
  if (updated.email !== undefined) payload.email = updated.email;

  await supabase.from('profiles').update(payload).eq('id', userId);
}

/**
 * Fetch User Water Logs
 */
export async function fetchUserLogs(userId: string): Promise<LogEntry[]> {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((log) => {
    const dateObj = new Date(log.created_at);
    return {
      id: log.id,
      amountMl: log.amount_ml,
      timestamp: log.created_at,
      formattedTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });
}

/**
 * Add Water Log to Supabase
 */
export async function addWaterLogToSupabase(
  userId: string,
  amountMl: number
): Promise<LogEntry | null> {
  const { data, error } = await supabase
    .from('logs')
    .insert([{ user_id: userId, amount_ml: amountMl }])
    .select()
    .single();

  if (error || !data) return null;

  const dateObj = new Date(data.created_at);
  return {
    id: data.id,
    amountMl: data.amount_ml,
    timestamp: data.created_at,
    formattedTime: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

/**
 * Fetch User Unlocked Challenges
 */
export async function fetchUserChallenges(
  userId: string
): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('user_challenges')
    .select('challenge_id')
    .eq('user_id', userId);

  if (error || !data) return {};

  const unlockedMap: Record<string, boolean> = {};
  data.forEach((row) => {
    unlockedMap[row.challenge_id] = true;
  });

  return unlockedMap;
}

/**
 * Unlock Challenge in Supabase
 */
export async function unlockChallengeInSupabase(
  userId: string,
  challengeId: string
): Promise<void> {
  await supabase.from('user_challenges').upsert(
    [
      {
        user_id: userId,
        challenge_id: challengeId,
      },
    ],
    { onConflict: 'user_id,challenge_id' }
  );
}

/**
 * Send Notification in Supabase
 */
export async function sendNotificationInSupabase(
  senderId: string,
  recipientId: string,
  senderName: string,
  type: 'cheer' | 'nudge'
): Promise<void> {
  await supabase.from('notifications').insert([
    {
      sender_id: senderId,
      recipient_id: recipientId,
      sender_name: senderName,
      type,
    },
  ]);
}

/**
 * Fetch Unread Notifications
 */
export async function fetchUserNotifications(userId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((n) => ({
    id: n.id,
    senderId: n.sender_id,
    senderName: n.sender_name || 'A friend',
    type: n.type,
    createdAt: n.created_at,
    isRead: n.is_read,
  }));
}

/**
 * Mark Notification as Read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}

/**
 * Send Friend Request by Email
 */
export async function sendFriendRequestByEmail(
  requesterId: string,
  receiverEmail: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = receiverEmail.toLowerCase().trim();

  const { data: receiverProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, email')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (profileError) {
    return { success: false, message: `Database error: ${profileError.message}` };
  }

  if (!receiverProfile) {
    return {
      success: false,
      message: 'No user found with that email address. Check for typos or ensure they signed up!',
    };
  }

  if (receiverProfile.id === requesterId) {
    return { success: false, message: 'You cannot send a friend request to yourself!' };
  }

  const { error: insertError } = await supabase.from('friendships').insert([
    {
      requester_id: requesterId,
      receiver_id: receiverProfile.id,
      status: 'pending',
    },
  ]);

  if (insertError) {
    if (insertError.code === '23505') {
      return { success: false, message: 'A friend request or friendship already exists with this user.' };
    }
    return { success: false, message: insertError.message };
  }

  return { success: true, message: `Friend request sent to ${receiverProfile.name || 'user'}!` };
}

/**
 * Search users by display name or email
 */
export async function searchUsersByNameOrEmail(
  searchQuery: string,
  currentUserId: string
): Promise<CandidateUser[]> {
  const cleanQuery = searchQuery.trim();
  if (!cleanQuery) return [];

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .or(`name.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%`)
    .neq('id', currentUserId)
    .limit(10);

  if (error || !profiles) return [];

  const { data: friendships } = await supabase
    .from('friendships')
    .select('requester_id, receiver_id, status')
    .or(`requester_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

  const friendshipMap = new Map<string, string>();
  friendships?.forEach((f) => {
    const otherId = f.requester_id === currentUserId ? f.receiver_id : f.requester_id;
    friendshipMap.set(otherId, f.status);
  });

  return profiles.map((p) => {
    const status = friendshipMap.get(p.id);
    return {
      id: p.id,
      name: p.name || 'Hydration Hero',
      avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isFriend: status === 'accepted',
      isPending: status === 'pending',
    };
  });
}

/**
 * Send a friend request directly by user ID
 */
export async function sendFriendRequestById(
  requesterId: string,
  receiverId: string
): Promise<{ success: boolean; message: string }> {
  const { error: insertError } = await supabase.from('friendships').insert([
    {
      requester_id: requesterId,
      receiver_id: receiverId,
      status: 'pending',
    },
  ]);

  if (insertError) {
    if (insertError.code === '23505') {
      return { success: false, message: 'Request already pending.' };
    }
    return { success: false, message: insertError.message };
  }

  return { success: true, message: 'Friend request sent!' };
}

/**
 * Fetch Pending Incoming Friend Requests
 */
export async function fetchPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      requester_id,
      status,
      profiles:requester_id (name, avatar_url)
    `)
    .eq('receiver_id', userId)
    .eq('status', 'pending');

  if (error || !data) return [];

  return data.map((item: any) => ({
    id: item.id,
    requesterId: item.requester_id,
    requesterName: item.profiles?.name || 'A user',
    requesterAvatarUrl: item.profiles?.avatar_url,
    status: item.status,
  }));
}

/**
 * Accept or Decline Friend Request
 */
export async function respondToFriendRequest(
  friendshipId: string,
  accept: boolean
): Promise<boolean> {
  if (accept) {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);
    return !error;
  } else {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);
    return !error;
  }
}

/**
 * Fetch Friends Leaderboard (Only Accepted Friends + Current User)
 */
export async function fetchFriendsLeaderboard(currentUserId: string): Promise<Friend[]> {
  const { data: friendships } = await supabase
    .from('friendships')
    .select('requester_id, receiver_id')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`);

  const friendUserIds = new Set<string>([currentUserId]);

  if (friendships) {
    friendships.forEach((f) => {
      friendUserIds.add(f.requester_id);
      friendUserIds.add(f.receiver_id);
    });
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', Array.from(friendUserIds));

  if (!profiles) return [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: logs } = await supabase
    .from('logs')
    .select('user_id, amount_ml')
    .gte('created_at', todayStart.toISOString())
    .in('user_id', Array.from(friendUserIds));

  const intakeMap: Record<string, number> = {};
  logs?.forEach((log) => {
    intakeMap[log.user_id] = (intakeMap[log.user_id] || 0) + log.amount_ml;
  });

  const leaderboard: Friend[] = profiles.map((p) => {
    const totalMl = intakeMap[p.id] || 0;
    const targetMl = p.daily_target_ml || 2500;
    return {
      id: p.id,
      name: p.name || 'Water Buddy',
      avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      intakeLiters: Number((totalMl / 1000).toFixed(2)),
      targetLiters: Number((targetMl / 1000).toFixed(1)),
      goalPercentage: Math.min(100, Math.round((totalMl / targetMl) * 100)),
      rank: 1,
    };
  });

  leaderboard.sort((a, b) => b.intakeLiters - a.intakeLiters);
  return leaderboard.map((item, index) => ({ ...item, rank: index + 1 }));
}
