export type TabType = 'home' | 'trends' | 'friends' | 'challenges' | 'settings';

export type ActivityLevel = 'Low' | 'Med' | 'High';
export type UnitType = 'ml' | 'oz';

export interface LogEntry {
  id: string;
  amountMl: number;
  timestamp: Date;
  formattedTime: string;
  timeAgo: string;
  dateStr: string; // e.g. "Today, Oct 18"
}

export interface UserProfile {
  name: string;
  status: string;
  avatarUrl: string;
  weightKg: number;
  activityLevel: ActivityLevel;
  dailyTargetMl: number;
  preferredUnit: UnitType;
  smartReminders: boolean;
  currentStreak: number;
  longestStreak: number;
}

export interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  rank: number;
  streakDays: number;
  intakeLiters: number;
  targetLiters: number;
  goalPercentage: number;
  cheered: boolean;
  nudged: boolean;
}

export interface PlantChallenge {
  id: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  alt: string;
  unlocked: boolean;
  requirement: string;
  description: string;
  progressMl?: number;
  targetMl?: number;
}
export interface NotificationItem {
  id: string;
  senderId: string;
  senderName: string;
  type: 'cheer' | 'nudge';
  createdAt: string;
  isRead: boolean;
}
export interface FriendRequest {
  id: string; // Friendship row ID
  requesterId: string;
  requesterName: string;
  requesterAvatarUrl?: string;
  status: 'pending' | 'accepted';
}
