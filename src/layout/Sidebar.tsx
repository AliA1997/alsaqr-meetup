import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  DotsCircleHorizontalIcon,
  LoginIcon,
  LogoutIcon,
  CogIcon,
} from "@heroicons/react/outline";
import { getEmailUsername } from "@utils/index";
import { useStore } from "@stores/index";
import { useLocation, useNavigate } from 'react-router-dom';

import { observer } from "mobx-react-lite";
import { LoginModal } from "@common/AuthModals";

import { ROUTE_TO_SHOW_SETTINGS_SIDEBAR, ROUTES_USER_CANT_ACCESS } from "@utils/constants";
import { SettingsTabs, SidebarTabs } from "@models/enums";
import { OptimizedImage } from "@common/Image";
import SidebarRow from "./SidebarRow";
import Collapsible from "@common/Collapsible";

type SideBarProps = {};

const SideBar = ({ }: SideBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authStore, commonStore, modalStore, settingsStore } = useStore();
  const { auth, currentSessionUser } = authStore;
  const { userIpInfo } = commonStore;
  const { closeModal, showModal } = modalStore;
  const { currentTabIdx, setCurrentTabIdx } = settingsStore;
  const [activeTab, setActiveTab] = useState<SidebarTabs | undefined>();
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false);
  const notLoggedIn = useMemo(() => mounted && !auth?.isLoggedIn(), [auth?.isLoggedIn(), mounted]);
  const hideSidebar = useMemo(() => ROUTE_TO_SHOW_SETTINGS_SIDEBAR === location.pathname, [location.pathname]);
  const registrationNotCompleted = useMemo(() => !(currentSessionUser?.isCompleted ?? false), [mounted, currentSessionUser])

  const openModal = () => showModal(<LoginModal />)
  const handleDropdownEnter = useCallback(
    () => setIsDropdownOpen(!isDropdownOpen),
    [isDropdownOpen]
  );

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    }
  }, []);

  useLayoutEffect(() => {
    const showLoginModal = ROUTES_USER_CANT_ACCESS.some((r: string) => location.pathname.includes(r));

    if (notLoggedIn && showLoginModal) {
      showModal(<LoginModal />);
    }

    if (!registrationNotCompleted && currentSessionUser)
      closeModal();

  }, [currentSessionUser?.id, mounted]);

  // const onTabSelect = (tab: SidebarTabs) => setActiveTab(tab);

  return (
    <>
      <div className={`
          ${hideSidebar ? 'col-span-2' : 'col-span-1 md:col-span-2'}
          flex flex-col item-center mt-2 md:mt-0 md:px-4 md:items-start
          overflow-y-auto scrollbar-hide
          max-h-[70vh]
        `}
        onClick={() => setIsDropdownOpen(false)}
      >          
          <div className="flex justify-start">
            <img
              className={`
                m-0 h-full w-full md:w-[90%] transition-all duration-200 
                sidebarLogo
                cursor-pointer
            `}
              alt=""
              style={{ maxWidth: "unset" }}
              onClick={() => navigate("/")}
            />
          </div>
          <>
            {hideSidebar
              ? (
                <>
                  <SidebarRow active={currentTabIdx === SettingsTabs.PersonalInfo} overrideOnClick={true} isShow={true} title="Personal Info" onClick={() => setCurrentTabIdx(SettingsTabs.PersonalInfo)} />
                  <SidebarRow active={currentTabIdx === SettingsTabs.PersonalizeAccount} overrideOnClick={true} isShow={true} title="Peronalize Account" onClick={() => setCurrentTabIdx(SettingsTabs.PersonalizeAccount)} />
                  <SidebarRow active={currentTabIdx === SettingsTabs.DeleteYourAccount} overrideOnClick={true} isShow={true} title="Delete Your Account" onClick={() => setCurrentTabIdx(SettingsTabs.DeleteYourAccount)} />
                </>
              )
              : (
                <>
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/notification.svg"
                          alt="Notification Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Notifications"
                    href="/notifications"
                    onClick={() => setActiveTab(SidebarTabs.Notifications)}
                    active={activeTab === SidebarTabs.Notifications}
                  />
                  <SidebarRow 
                    IconImage={
                      <>
                        <img
                          src="/icons/inbox.svg"
                          alt="Inbox Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Inbox" 
                    href="/messages" 
                    onClick={() => setActiveTab(SidebarTabs.Inbox)}
                    active={activeTab === SidebarTabs.Inbox}
                  />
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/my-groups.svg"
                          alt="My Groups Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="My Groups"
                    href="/my-groups"
                    onClick={() => setActiveTab(SidebarTabs.MyGroups)}
                    active={activeTab === SidebarTabs.MyGroups}
                  />
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/my-events.svg"
                          alt="My Events Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="My Events"
                    href="/my-events"
                    onClick={() => setActiveTab(SidebarTabs.MyEvents)}
                    active={activeTab === SidebarTabs.MyEvents}
                  />
                  <br />
                  <Collapsible defaultOpen title="Location">
                    <SidebarRow
                      IconImage={
                        <>
                          <img
                            src="/icons/location.svg"
                            alt="Location Icon"
                            className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                          />
                        </>
                      }
                      title={userIpInfo?.countryName ?? "United States"}
                      onClick={() => setActiveTab(SidebarTabs.Location)}
                      active={activeTab === SidebarTabs.Location}
                      overrideOnClick={true}
                    />
                  </Collapsible>
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/groups.svg"
                          alt="Groups Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Groups"
                    href="/groups"
                    onClick={() => setActiveTab(SidebarTabs.Groups)}
                    active={activeTab === SidebarTabs.Groups}
                  />
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/events.svg"
                          alt="Events Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Events"
                    href="/events"
                    onClick={() => setActiveTab(SidebarTabs.Events)}
                    active={activeTab === SidebarTabs.Events}
                  />
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/online-events.svg"
                          alt="Online Events Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Online Events"
                    href="/online-events"
                    onClick={() => setActiveTab(SidebarTabs.OnlineEvents)}
                    active={activeTab === SidebarTabs.OnlineEvents}
                  />
                  <SidebarRow
                    IconImage={
                      <>
                        <img
                          src="/icons/local-guides.svg"
                          alt="Local Guides Icon"
                          className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0 mr-2 p-0"
                        />
                      </>
                    }
                    title="Local Guides"
                    href="/local-guides"
                    onClick={() => setActiveTab(SidebarTabs.LocalGuides)}
                    active={activeTab === SidebarTabs.LocalGuides}
                  />
                  <div className="relative more-container">
                    <SidebarRow
                      Icon={DotsCircleHorizontalIcon}
                      title="More"
                      onClick={handleDropdownEnter}
                    />
                    {isDropdownOpen && (
                      <div className="absolute left-0 bottom-[-10] mt-2 w-48 rounded-md shadow-lg ring-1 bg-white dark:bg-[#000000] ring-black ring-opacity-5 z-[800]">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {currentSessionUser ? (
                            <>
                              <SidebarRow 
                                Icon={CogIcon} 
                                title="Settings" 
                                isShow={true} 
                                overrideOnClick={true}
                                onClick={() => {
                                  window.location.href = `${import.meta.env.VITE_PUBLIC_ALSAQR_URL}/settings`;
                                }}
                              />
                              <SidebarRow Icon={LogoutIcon} title="Sign Out" />
                            </>
                          ) : (
                            <SidebarRow
                              Icon={LoginIcon}
                              title="Sign In"
                              onClick={openModal}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {currentSessionUser && currentSessionUser.id && (
                    <>
                      <hr />
                      {/* <div className="flex align-center p-2 cursor-pointer hover:opacity-75"> */}
                      <div
                        onClick={() =>{
                          setActiveTab(undefined);
                          window.open(`${import.meta.env.VITE_PUBLIC_ALSAQR_URL}/users/${currentSessionUser?.username}`);
                        }}
                        className={`
                            group flex max-w-fit
                            cursor-pointer items-center space-x-2 rounded-full px-1 md:px-4 py-1 py-3
                            transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 mb-1 mt-1 
                          `}
                      >
                        <OptimizedImage
                          classNames="m-0 mt-3 w-full h-8 md:h-14 md:w-14 rounded-full"
                          src={currentSessionUser?.avatar ?? ''}
                          alt="Avatar"
                        />
                        {/* <div className="flex flex-col justify-center  p-3 opacity-50 text-xs sm:text-sm lg:text-md"> */}
                        <div className={`
                            flex flex-col display-none md:display-initial hidden 
                            group-hover:text-[#55a8c2] dark:text-gray-50
                            md:inline-flex text-base font-light text-xs lg:text-sm
                          `}>
                          <p>{currentSessionUser?.username}</p>
                          <p className="ml-2">@{getEmailUsername(currentSessionUser?.username)}</p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
          </>
      </div>
    </>
  );
};
export default observer(SideBar);
