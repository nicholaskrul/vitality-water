export type TabType = 'home' | 'trends' | 'friends' | 'challenges' | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  dailyTargetMl: number;
  preferredUnit: 'ml' | 'oz';
  currentStreak: number;
  longestStreak: number;
}

export interface LogEntry {
  id: string;
  amountMl: number;
  timestamp: string;
  formattedTime: string;
}

export interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  intakeLiters: number;
  targetLiters: number;
  goalPercentage: number;
  rank: number;
  cheered?: boolean;
  nudged?: boolean;
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
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatarUrl?: string;
  status: 'pending' | 'accepted';
}
export interface CandidateUser {
  id: string;
  name: string;
  avatarUrl: string;
  isFriend?: boolean;
  isPending?: boolean;
}
