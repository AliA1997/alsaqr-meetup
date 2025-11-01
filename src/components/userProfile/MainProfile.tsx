import { useCallback, useLayoutEffect } from "react";
import type {
  DashboardPostToDisplay,
} from "@typings";

import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";

import CustomPageLoader from "@common/CustomLoader";
import Tabs from "@common/Tabs";
import UserHeader from "./UserHeader";
import PostComponent from "@components/posts/Post";


const MainProfile = () => {
  const { userStore } = useStore();
  const { 
    loadProfile, 
    currentUserProfile, 
    loadProfilePosts, 
    currentUserProfilePosts,
    loadingPosts
  } = userStore;
  const params = useParams();
  const { name } = params;
  const username = name as string;

  async function refreshProfileInfo() {
    await loadProfile(username);
  }

  useLayoutEffect(() => {
    async function getProfileInfo() {
      loadProfile(username)
        .then(async () => {
          await loadProfilePosts(username);
        })
      
    }

    getProfileInfo();
  }, []);
  
  const renderer = useCallback(
    (postToDisplay: DashboardPostToDisplay) => (
      <PostComponent
        key={postToDisplay.post.id}
        postToDisplay={postToDisplay}
      />
    ),
    []
  );

  if(currentUserProfile) 
    return (
      <div className="col-span-7 scrollbar-hide max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
        <div className="mb-[7rem]">
          {currentUserProfile && (
            <>
              <UserHeader
                refreshProfileInfo={refreshProfileInfo}
                profileInfo={currentUserProfile}
                numberOfPosts={currentUserProfilePosts?.userPosts?.length ?? 0}
                followerCount={currentUserProfile.followers?.length ?? 0}
                followingCount={currentUserProfile.following?.length ?? 0}
              />

              <Tabs
                tabs={[
                  {
                    tabKey: "recent",
                    title: "Recent",
                    content: currentUserProfilePosts?.userPosts ?? [],
                    renderer,
                    noRecordsContent: 'No posts'
                  },
                  {
                    tabKey: "reposts",
                    title: "Reposts",
                    content: currentUserProfilePosts?.repostedPosts ?? [],
                    renderer,
                    noRecordsContent: 'No reposts found'
                  },
                  {
                    tabKey: "bookmarks",
                    title: "Bookmarks",
                    content: currentUserProfilePosts?.bookmarkedPosts ?? [],
                    renderer,
                    noRecordsContent: `No bookmarks found`
                  },
                  {
                    tabKey: "replied-posts",
                    title: "Replies",
                    content: currentUserProfilePosts?.repliedPosts ?? [],
                    renderer,
                    noRecordsContent: `No replied posts found`
                  },
                  {
                    tabKey: "liked-posts",
                    title: "Liked Posts",
                    content: currentUserProfilePosts?.likedPosts ?? [],
                    renderer,
                    noRecordsContent: `No liked posts found`
                  },
                ]}
                loading={loadingPosts}
              />

            </>
          )}
        </div>
      </div>
  );

  return <CustomPageLoader title="Loading..." />;

};
export default observer(MainProfile);
