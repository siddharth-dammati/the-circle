export type Campus = "HYDERABAD" | "BENGALURU" | "VIZAG";
export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
export type ConnectionType = "FRIENDS" | "STUDY_PARTNER" | "NETWORKING" | "RELATIONSHIP";
export type EventCategory = "TECHNICAL" | "CULTURAL" | "SPORTS" | "CLUBS" | "WORKSHOPS";
export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  coverImage?: string | null;
  bio?: string | null;
  branch?: string | null;
  year?: number | null;
  campus?: Campus | null;
  gender?: Gender | null;
  interests: string[];
  connectionType: ConnectionType;
  isVerified: boolean;
  isApproved: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  isOnboarded: boolean;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  imageUrl?: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: Date;
  venue: string;
  campus: Campus;
  imageUrl?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  link?: string | null;
  createdAt: Date;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  isSuperLike: boolean;
  createdAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface SecretCrush {
  id: string;
  fromUserId: string;
  toUserId: string;
  isRevealed: boolean;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  createdAt: Date;
}

export type UserWithProfile = User & {
  _count?: {
    matchesA: number;
    matchesB: number;
    likesReceived: number;
  };
};

export type MatchWithUser = Match & {
  userA: User;
  userB: User;
  messages: Message[];
};

export type MessageWithSender = Message & {
  sender: User;
};

export type EventWithDetails = Event & {
  createdBy: User;
  participants: { userId: string }[];
  _count: { participants: number };
};

