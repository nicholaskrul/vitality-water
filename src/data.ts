import { UserProfile, Friend, PlantChallenge, LogEntry } from './types';
import { supabase } from './lib/supabase';

// --- Static Image Assets ---

export const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD6r06pDFLM_y5Xqvtzm7If5HZljPbtklFlDHRXkd_QGWFOmNkQ8jRL3T0T2LmHaQ9DgddeEE6Ne_X5EU8u2XyZEYHsv4632e_zZiUXd093jyIywdcHnOk6LH4kD6cmgKjFvRnf2Pm0YOjNWxkVyeOo9TXSFOLigYmVwvHwANlirzu2ujuIXVjJGcBluxrvUZKSFnoe3oBdKct1TWoCDCVWdDY5GqAgzC6QVB7Qjw1ylrPIFOzSNExF';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD30H7AetrI1yfWFVX2Z-ZQRBQlaCsXuOASiptnLOOnyzz_WdpEdRqUy-lojVSxIdUbTU89lb5NqmDxbYIDk6HZDa-zRWAJ2YcSMk3fyaCuZ9TqNGCu7KE7XLELByfzn86BvlPOd9AL-IDJpSOfebeXJQwNu6P91k4YldviHkvRpsXC2ZE68NRpRvrAjNIXR-ibGqb_WmjF9kf5IuRXG5XUh79PMxBfhugLYCH5jNUi-6ZF9HvQMJel';

export const FRIENDS_AVATAR_BASE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB0gggSCRYLzvwe_cSXax6MFxVvVMlZgIk1pZ-lX2MBovjawhZNXe6QLSV1-V2NCWTx3F1ORr8tggK0TEy5m_-BfPB9QW-k3hm2fok-SaaNuFbAhL9ZlVf9BbcdnJFJ4EUeaem0hSUlaZZtgcs8GhdfHWz_AERtAfe1WzZFAd6G2M_yHLy7CTJfHghpXMZJYdaAvvCyqGQfrTc-7X9Cp70EFVtgP1JwjqbgCHUXp9BTF1cDnoNy0g6-';

// --- Water Forest Challenges Definition ---

export const INITIAL_CHALLENGES: PlantChallenge[] = [
  {
    id: 'fern',
    title: 'MISTY FERN',
    subtitle: '7-Day Streak',
    imgUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrUIuM9xGwmPwQpWX88lYdmt563xRyhmVkwk8aFMQNQA2hUXrpGyG4hmsJ2PO_97M2eOqugcQvXcfW7lrfeVCGsD1amSdJFZ-SdiFvKFAXbCq9M3aXS4zq9mpRcFuRCVL-JZZUZQ_oxNWi-rjDzyQ_6Ik58qWrgPd0tLmaU5rpcf8IBwnhKGW5y4-Rs1kWE0nEwKipGJT_XQtaXvNHCTETEKt5-qOYFcfw0A8Mh7Yru3UP0qyeNW8',
    alt: 'Misty Fern',
    unlocked: false, // Changed from true
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
    unlocked: false, // Changed from true
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
    unlocked: false, // Changed from true
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
// --- Supabase Async API Queries ---

/**
 * Upload an avatar image file to Supabase Storage 'avatars' bucket
 */
export async function uploadAvatarImage(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err: any) {
    console.error('Avatar upload failed:', err.message);
    return null;
  }
}

/**
 * Fetch the profile record for a given user
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) return null;

  return {
    name: data.name,
    status: data.status,
    avatarUrl: data.avatar_url,
    weightKg: Number(data.weight_kg),
    activityLevel: data.activity_level,
    dailyTargetMl: data.daily_target_ml,
    preferredUnit: data.preferred_unit,
    smartReminders: data.smart_reminders,
    currentStreak: data.current_streak,
    longestStreak: data.longest_streak,
  };
}

/**
 * Update user profile fields in Supabase
 */
export async function updateUserProfileInSupabase(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const payload: any = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.weightKg !== undefined) payload.weight_kg = updates.weightKg;
  if (updates.activityLevel !== undefined) payload.activity_level = updates.activityLevel;
  if (updates.dailyTargetMl !== undefined) payload.daily_target_ml = updates.dailyTargetMl;
  if (updates.preferredUnit !== undefined) payload.preferred_unit = updates.preferredUnit;
  if (updates.smartReminders !== undefined) payload.smart_reminders = updates.smartReminders;

  await supabase.from('profiles').update(payload).eq('id', userId);
}

/**
 * Fetch water logs for a specific user ordered by created_at desc
 */
export async function fetchUserLogs(userId: string): Promise<LogEntry[]> {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((item) => {
    const timestamp = new Date(item.created_at);
    const isToday = timestamp.toDateString() === new Date().toDateString();

    return {
      id: item.id,
      amountMl: item.amount_ml,
      timestamp,
      formattedTime: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: isToday ? 'Today' : timestamp.toLocaleDateString(),
      dateStr: isToday
        ? `Today, ${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}`
        : timestamp.toLocaleDateString(),
    };
  });
}

/**
 * Insert a new water entry log for a user
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

  const timestamp = new Date(data.created_at);
  return {
    id: data.id,
    amountMl: data.amount_ml,
    timestamp,
    formattedTime: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeAgo: 'Just now',
    dateStr: `Today, ${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
  };
}

/**
 * Fetch leaderboard ranking calculated across all registered user profiles
 */
export async function fetchFriendsLeaderboard(currentUserId: string): Promise<Friend[]> {
  const { data: profiles } = await supabase.from('profiles').select('*');
  const { data: allLogs } = await supabase.from('logs').select('*');

  if (!profiles) return [];

  const todayStr = new Date().toDateString();

  const friendsData = profiles.map((p) => {
    const userTodayLogs = (allLogs || []).filter(
      (l) => l.user_id === p.id && new Date(l.created_at).toDateString() === todayStr
    );
    const totalMlToday = userTodayLogs.reduce((sum, l) => sum + l.amount_ml, 0);
    const intakeLiters = Number((totalMlToday / 1000).toFixed(2));
    const targetLiters = Number(((p.daily_target_ml || 2500) / 1000).toFixed(2));
    const goalPercentage = Math.min(
      100,
      Math.round((totalMlToday / (p.daily_target_ml || 2500)) * 100)
    );

    return {
      id: p.id,
      name: p.id === currentUserId ? `You (${p.name})` : p.name,
      avatarUrl: p.avatar_url || USER_AVATAR_URL,
      rank: 1,
      streakDays: p.current_streak || 1,
      intakeLiters,
      targetLiters,
      goalPercentage,
      cheered: false,
      nudged: false,
    };
  });

  // Sort by highest intake
  friendsData.sort((a, b) => b.intakeLiters - a.intakeLiters);
  friendsData.forEach((f, idx) => {
    f.rank = idx + 1;
  });

  return friendsData;
}

/**
 * Fetch user unlocked challenge IDs from database
 */
export async function fetchUserChallenges(userId: string): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from('user_challenges')
    .select('challenge_id, unlocked')
    .eq('user_id', userId);

  if (error || !data) return {};

  return data.reduce((acc, row) => {
    acc[row.challenge_id] = row.unlocked;
    return acc;
  }, {} as Record<string, boolean>);
}

/**
 * Unlock a specific challenge for a user in database
 */
export async function unlockChallengeInSupabase(
  userId: string,
  challengeId: string
): Promise<void> {
  await supabase.from('user_challenges').upsert(
    {
      user_id: userId,
      challenge_id: challengeId,
      unlocked: true,
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: 'user_id, challenge_id' }
  );
}

// --- Utility Functions ---

export function mlToOz(ml: number): number {
  return Number((ml * 0.033814).toFixed(1));
}

export function formatVolume(ml: number, unit: 'ml' | 'oz'): string {
  if (unit === 'oz') {
    return `${mlToOz(ml)} oz`;
  }
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(2)}L`;
  }
  return `${Math.round(ml)}ml`;
}
import { NotificationItem } from './types'; // Make sure NotificationItem is imported

/**
 * Send a cheer or nudge notification to a friend in Supabase
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
 * Fetch unread notifications for the current user
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
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}
import { FriendRequest } from './types';

/**
 * Send a friend request by email
 */
export async function sendFriendRequestByEmail(
  requesterId: string,
  receiverEmail: string
): Promise<{ success: boolean; message: string }> {
  const cleanEmail = receiverEmail.toLowerCase().trim();

  // Find user profile by email
  const { data: receiverProfile, error: profileError } = await supabase
    .from('profiles')
    .select('id, name')
    .ilike('email', cleanEmail)
    .single();

  if (profileError || !receiverProfile) {
    return { success: false, message: 'No user found with that email address.' };
  }

  if (receiverProfile.id === requesterId) {
    return { success: false, message: 'You cannot send a friend request to yourself!' };
  }

  // Insert friend request
  const { error: insertError } = await supabase.from('friendships').insert([
    {
      requester_id: requesterId,
      receiver_id: receiverProfile.id,
      status: 'pending',
    },
  ]);

  if (insertError) {
    if (insertError.code === '23505') {
      return { success: false, message: 'A friend request or friendship already exists.' };
    }
    return { success: false, message: insertError.message };
  }

  return { success: true, message: `Friend request sent to ${receiverProfile.name}!` };
}

/**
 * Fetch pending incoming friend requests for a user
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
 * Accept or decline a friend request
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
