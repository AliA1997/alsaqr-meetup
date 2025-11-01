
export enum TypeOfFeed {
  Feed = "feed",
  Explore = "explore",
  Search = "search"
}

export enum NotificationType {
  Normal = "normal",
  Mentioned = "mentioned",
  Verified = "verified",
  YourAccount = "your_account",
  FollowUser = "follow_user",
  BookmarkedPost = 'bookmarked_post',
  LikedPost = 'liked_post',
  RePostedPost = 'reposted_post',
  CommentedPost = 'commented_post',
  NewList = "new_list",
  NewCommunity = "new_community",
  UnjoinedCommunity = "user_unjoined",
  JoinedCommunity = "user_joined",
  RequestJoinCommunity = "user_request_join",
  UnjoinedCommunityDiscussion = "user_unjoined_discussion",
  JoinedCommunityDiscussion = "user_joined_discussion",
  RequestJoinCommunityDiscussion = "user_request_join_discussion",
  NewPost = "new_post",
}

export enum MessageType {
  All = "All",
  Sent = "Sent",
  Direct = "Direct"
}


export type CommonRecordBody = {
  text: string;
  image?: string;
};


//  Relationships for User
// user -[:FOLLOW_USER] -> followedUser
// followedUser - [:FOLLOWED] -> user
// on unfollow -> delete FOLLOW_USER and FOLLOWED relationship
export interface ProfileUser {
  user: User;
  bookmarks: string[];
  following?: User[];
  followers?: User[];
}


export interface UserItemToDisplay {
  user: User;
  following?: User[];
  followers?: User[];
}

export interface UserRegisterFormDto extends UserRegisterForm {
  followingUsers: string[];
}

export interface UserRegisterForm extends UserInfo {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hobbies?: string[];
  religion?: string;
  countryOfOrigin?: string;
  followingUsers: UserItemToDisplay[];
}

export interface User extends UserInfo {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  geoId?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hobbies?: string[];
  religion?: "Christian" | "Muslim" | "Atheist" | "Agnostic" | "Jew" | "Prefer Not To Disclose";
  preferredMadhab?: 'Hanafi' | "Shafi'i" | 'Maliki' | 'Hanbali' | "Salafi" | "Prefer Not To Disclose";
  frequentMasjid?: string;
  favoriteQuranReciters?: string[];
  favoriteIslamicScholars?: string[];
  islamicStudyTopics?: string[];
  followingUsers: string[];
  followedByUsers: string[];
  isCompleted: boolean;
  verified: boolean;
}

export type UserInfo = {
  username: string;
  bio?: string;
  countryOfOrigin: string;
  avatar: string;
  bgThumbnail: string;
  email: string;
  phone?: string;
  personalInfo?: PersonalInfo;
  personalInterests?: PersonalInterests;
};

export interface UserProfileDashboardPosts {
  userPosts: DashboardPostToDisplay[];
  bookmarkedPosts: DashboardPostToDisplay[];
  likedPosts: DashboardPostToDisplay[];
  repostedPosts: DashboardPostToDisplay[];
  repliedPosts: DashboardPostToDisplay[];
  success: boolean;
}

export interface DashboardPostToDisplay extends PostToDisplay {
  type: string;
}

export interface PostToDisplay {
  post: PostRecord,
  username: string;
  profileImg: string;
  comments: Comment[],
  commenters: User[],
  reposters: User[],
  likers: User[]
}

export interface SavedPostItem {
  post: PostRecord,
  username: string;
  profileImg: string;
}

export interface PostRecord extends CommonRecordBody {
  id: string;
  createdAt: string;
  updatedAt: string;
  _rev: string;
  _type: "post";
  blockTweet: boolean;
  tags: string[];
  likes?: string[];
  userId?: string;
}

export interface CommentForm extends Comment {
  commentToCommentOnId?: string;
};

export interface Comment extends CommonRecordBody {
  id: string;
  postId: string;
  userId: string;
  image: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentToDisplay extends Comment {
  username: string;
  profileImg: string;
  comments: Comment[],
  commenters: User[],
  reposters: User[],
  likers: User[]
}

export enum  RelationshipType {
  Joined = 'JOINED',
  Invited = 'INVITED',
  Founder = 'FOUNDER',
  InviteRequested = 'INVITE_REQUESTED',
  InviteRequestedForCommunityDiscussion = 'INVITE_REQUESTED_FOR_DISCUSSION',
  None = 'NONE'
};

export interface NotificationRecord extends CommonRecordBody {
  id: string;
  message: string;
  read: boolean;
  relatedEntityId?: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
  _rev: string;
  _type: "notification";
  notificationType: NotificationType;
}

export interface NotificationToDisplay {
  notification: NotificationRecord,
}

export interface ServerError {
  statusCode: number;
  message: string;
  details: string;
}

// Direct Message Relationships
// Sender -> SEND_MESSAGE -> Recipient
// Recipient -> RECEIVED_MESSAGE -> Sender
export interface MessageFormDto extends CommonRecordBody {
  messageType: MessageType;
  senderId: string;
  senderProfileImg?: string;
  senderUsername?: string;
  recipientId?: string;
  recipientProfileImg?: string;
  recipientUsername?: string;
}

export interface MessageRecord extends CommonRecordBody {
  id: string;
  createdAt: string;
  updatedAt: string;
  _rev: string;
  _type: "message";
  messageType: MessageType;
  senderId?: string;
  senderProfileImg?: string;
  senderUsername?: string;
  recipientId?: string;
  recipientProfileImg?: string;
  recipientUsername?: string;
}

export interface MessageToDisplay {
  message: MessageRecord,
}

export interface MessageHistoryToDisplay {
  id: string;
  receiverId: string;
  receiverProfileImage: string
  receiverUsername: string;
  messageCount: any;
  lastMessageDate: any;
}

// New types based on the code snippets
export interface PersonalInfo {
  dateOfBirth?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
}

export interface PersonalInterests {
  hobbies?: string[];
  preferredMadhab?: 'Hanafi' | "Shafi'i" | 'Maliki' | 'Hanbali' | "Salafi";
  frequentMasjid?: string;
  favoriteQuranReciters?: string[];
  favoriteIslamicScholars?: string[];
  islamicStudyTopics?: string[];
}

// Relationship types
export interface PostedRelationship {
  timestamp: string;
}

export interface CommentedRelationship {
  timestamp: string;
}
export interface LikedPostParams {
    statusId: string;
    userId: string;
    liked: boolean;
}
export interface LikedCommentParams extends LikedPostParams {};

export interface RePostParams {
    statusId: string;
    userId: string;
    reposted: boolean;
}
export interface RePostCommentParams extends RePostParams {};
