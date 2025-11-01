
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileUser } from "typings";
import TimeAgo from "react-timeago";
import { convertDateToDisplay } from "@utils/index";
import { CommonLink } from "@common/Links";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { GoBackButton } from "@common/IconButtons";
import { OptimizedImage } from "@common/Image";

type UserHeaderProps = {
  profileInfo: ProfileUser;
  refreshProfileInfo: () => Promise<void>;
  numberOfPosts: number;
  followerCount: number;
  followingCount: number;
};
const UserHeader = ({
  profileInfo,
  numberOfPosts,
  followerCount,
  followingCount
}: UserHeaderProps) => {
  const navigate = useNavigate();
  const { authStore } = useStore();
  const { currentSessionUser } = authStore;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);

  const profileIsLoggedInUser = useMemo(() => profileInfo.user.username === (currentSessionUser?.username ?? ""), [currentSessionUser, profileInfo]);
  const handleDropdownEnter = useCallback(
      () => setIsDropdownOpen(!isDropdownOpen),
      [isDropdownOpen]
    );  

  return (
    <div>
      <div>
        <div className="flex justify-start">
          <GoBackButton />
          <div className="mx-2 py-2.5">
            <h2 className="mb-0 text-xl font-bold text-gray-600 dark:text-gray-200">
              {profileInfo.user.username}
            </h2>
            <p className="mb-0 w-48 text-xs text-gray-400 dark:text-gray-300">
              {numberOfPosts ?? 0} Tweets
            </p>
          </div>
        </div>

        <hr className="border-gray-800" />
      </div>
      <div>
        <div
          className="w-full bg-cover bg-no-repeat bg-center"
          style={{
            height: "200px",
            backgroundImage: `url(${profileInfo.user.bgThumbnail ?? "Istanbul"})`,
          }}
        >
        </div>
        <div className="relative p-4">
          <div className="relative flex w-full">
            <div className="flex flex-1">
              <div className='relative' style={{ marginTop: "-6rem" }}>
                <div
                  style={{ height: "9rem", width: "9rem" }}
                  className="md rounded-full relative avatar"
                >
                  <OptimizedImage
                      src={profileInfo.user.avatar}
                      alt={profileInfo.user.username}
                      loadedHeight={150}
                      loadedWidth={150}
                      classNames="md rounded-full relative border-4 border-gray-900 h-[9rem] w-[9rem]"
                  />
                </div>
              </div>
            </div>

            <div className="absolute w-full flex justify-end top-0 right-0">
              {
                profileIsLoggedInUser
                  ? (
                    <CommonLink 
                      onClick={() => {
                        navigate('/settings');
                      }}
                      animatedLink={false}
                      classNames='border border-[0.1rem] hover:text-[#55a8c2]'
                    >
                      Edit Profile
                    </CommonLink>
                  )
                  : (
                    <>
                      <CommonLink
                        onClick={handleDropdownEnter}
                        animatedLink={false}
                        classNames='border border-[0.1rem]'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </CommonLink>
                    </>
                  )
              }
            </div>
          </div>

          <div className="space-y-1 justify-center w-full mt-3 ml-3">
            <div>
              <h2 className="text-xl leading-6 font-bold text-gray-800 dark:text-white">
                {profileInfo.user.username}
              </h2>
              <p className="text-sm leading-5 font-medium text-gray-600 dark:text-gray-400">
                @{profileInfo.user.username}
              </p>
            </div>

            <div className="mt-3">
              <p className="text-gray-500 leading-tight mb-2 dark:text-gray-300">
                {/* Company & Employment Information Version 2 */}
                {profileInfo.user?.bio ?? ''}
              </p>
              <div className="text-gray-600 flex dark:text-gray-400">
                <span className="flex mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-black dark:text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>


                  {/* Put any associated domain names for version 2 */}
                </span>
                <span className="flex mr-2">
                  <span className="leading-5 ml-1">
                    {/* Joined {profileInfo.user.createdAt ? new Date(profileInfo.user.createdAt).toLocaleString('default', { month: 'long' }) : ""} */}
                    Joined{" "}
                    <TimeAgo
                      date={convertDateToDisplay(profileInfo.user.createdAt)}
                    />
                  </span>
                </span>
              </div>
            </div>
            <div className="pt-3 flex justify-start items-start w-full divide-x divide-gray-800 dark:divide-gray-400 divide-solid">
              <div className="text-center pr-3">
                <span className="font-bold text-gray-600 dark:text-gray-200">
                  {followingCount}{" "}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  Following
                </span>
              </div>
              <div className="text-center px-3">
                <span className="font-bold text-gray-600 dark:text-gray-200">
                  {followerCount}{" "}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-gray-800" />
      </div>
    </div>
  );
};
export default observer(UserHeader);
