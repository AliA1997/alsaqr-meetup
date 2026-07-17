
export type CommonRecordBody = {
  text: string;
  image?: string;
};


//  Relationships for User
// user -[:FOLLOW_USER] -> followedUser
// followedUser - [:FOLLOWED] -> user
// on unfollow -> delete FOLLOW_USER and FOLLOWED relationship
export interface ProfileUser {
  userId: string;
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  bgThumbnail?: string;
  bannerImage?: string;
  bio?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt?: Date;
  bookmarks: string[];
  bookmarkCount: number;
  following?: object[];
  followingCount: number;
  followers?: object[];
  followerCount: number;
}


export interface UserItemToDisplay {
  id: string;
  username: string;
  avatar?: string;
  bgThumbnail?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  bannerImage?: string;
  countryOfOrigin?: string;
  preferredMadhab?: string;
  hobbies: string[];
  favoriteQuranReciters: string[];
  favoriteIslamicScholars: string[];
  islamicStudyTopics: string[];
  followingCount: number;
  followerCount: number;
  totalItems: number;
}

export interface UserRegisterFormDto extends UserRegisterForm {
  followingUsers: string[];
}

export interface UserRegisterForm extends UserInfo {
  walletAddress?: string;
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
  web3_address?: string;
  web3Address?: string;
  isWeb3?: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  geoId?: string;
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  hobbies?: string[];
  religion?: string;
  preferredMadhab?: string;
  frequentMasjid?: string;
  favoriteQuranReciters?: string[];
  favoriteIslamicScholars?: string[];
  islamicStudyTopics?: string[];
  following: {
    avatar?: string;
    bio?: string;
    username?: string;
    userId?: string;
  }[];
  followingCount: number;
  followers: {
    avatar?: string;
    bio?: string;
    username?: string;
    userId?: string;
  }[];
  followerCount: number;
  bookmarks: string[];
  reposts: string[];
  likedPosts: string[];
  isCompleted: boolean;
  verified: boolean;
  subscriptionId?: string;
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

export interface DashboardPostToDisplay extends PostToDisplay {
  type: string;
}

export interface SavedPostItem {
  post: PostRecord,
  username: string;
  profileImg: string;
}

export interface PostRecord extends CommonRecordBody {
  postId: string;
  content: string;
  postTags: string[];
  postCreatedAt: string;
  postUpdatedAt: string;
  userId?: string;
  username: string;
  profileImg?: string;
  authorBio?: string;
  postType?: string;
  relatedPostId?: string | null;
  postAvatar?: string | null;
  postBannerImage?: string | null;
  bannerImage?: string | null;
}
export interface PostUserInfoDto {
  id: string;
  username: string;
  profileImg?: string;
}

export interface NotificationRecord extends CommonRecordBody {
  notificationId: string;
  userId: string;
  notificationMessage: string;
  notificationType: string;
  isRead: boolean;
  link?: string;
  relatedUserId?: string;
  postId?: string;
  communityId?: string;
  communityDiscussionId?: string;
  communityDiscussionMessageId?: string;
  listId?: string;
  listItemId?: string;
  notificationCreatedAt: string;
  notificationUpdatedAt: string;
}


export interface NotificationToDisplay extends NotificationRecord {}

export interface ServerError {
  statusCode: number;
  message: string;
  details: string;
}

export interface MessageFormDto {
  senderId: string;
  senderProfileImg?: string;
  senderUsername?: string;
  recipientId?: string;
  recipientProfileImg?: string;
  recipientUsername?: string;
  text: string;
  image?: string;
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

export interface MessageRecord extends CommonRecordBody {
  messageId: string;
  senderId?: string;
  senderUsername?: string;
  senderAvatar?: string;
  recipientId?: string;
  recipientAvatar?: string;
  recipientUsername?: string;
  messageContent?: string;
  messageMedia?; string;
  isRead?: boolean;

  messageCreatedAt: Date;
  messageUpdatedAt: Date;
}

export interface MessageToDisplay extends MessageRecord {}

export interface MessageHistoryToDisplay {
  id: string;
  receiverId: string;
  receiverProfileImage: string
  receiverUsername: string;
  messageCount: any;
  lastMessageDate: any;
}
