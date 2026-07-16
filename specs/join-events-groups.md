# Overview
- Users can join groups or events
- Admins for Groups can remove users from their group.
- Admins for Groups can remove users from events in their group.


## Implementation Steps
- Update the groupApiClient, and eventApiClient to include endpoints for joining groups or events.
- Update the Group page for a user to join an event, or leave depending if they're already joined or not.
- Update the Event page for a user to join an event, or leave depending if they're already joined or not.
- Create an interface for a user that if a logged user is a founder of a group, he can remove members from a group, or an event in that group.
- Create corresponding components to view users that are in the group, with the timestamp on when they joined the group.


## Rules
- Do not see admin ui for group, if you are not a founder.
- You can't join a group twice,meaning that if you join group and didn't leave. You can't join again, because you are already in the group.
- You can't join a event twice,meaning that if you join group and didn't leave. You can't join again, because you are already in the group.


## Acceptance
- Pass Tests
1) Founder of group see users in the group
2) Founder of group remove users from the group
3) Founder of group see all events for the group
4) Founder of a group remove user from a particular event.
5) Joins a a group, and see an indicator, indicating they are part of that group
- Fail tests
1) A non-founder of a group can't see the admin ui
2) A user can't joined a group he already joined.



## Out of Scope
- Nothing is out of scope.

## Reference Code
1) Code from the main social media app, UI for Join communities:
```typescript
import { useNavigate } from "react-router-dom";
import {
  useMemo,
  useState,
} from "react";
import TimeAgo from "react-timeago";

import type { CommunityToDisplay } from "@typings";
import { RelationshipType } from '@enums';
import {
  stopPropagationOnClick,
} from "@utils/index";
import { useStore } from "@stores/index";
import { convertDateToDisplay } from "@utils/index";
import { TagOrLabel } from "@common/Titles";
import { ButtonLoader } from "@common/CustomLoader";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { OptimizedImage } from "@common/Image";
import { InfoButton } from "@common/Buttons";

interface Props {
  community: CommunityToDisplay;
  // Fill the parent cell instead of self-sizing (used inside virtualized grid feeds).
  fitParent?: boolean;
}

function CommunityItemComponent({
  community,
  fitParent
}: Props) {
  const navigate = useNavigate();
  const { communityFeedStore } = useStore();

  const {
    setNavigateCommunity,
    joinPublicCommunity,
    unjoinPublicCommunity,
    requestToJoinPrivateCommunity,
  } = communityFeedStore;


  const communityInfo = community;
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentRelationshipType, setCurrentRelationshipType] = useState<RelationshipType>(communityInfo.relationshipType as RelationshipType)
  const [joined, setJoined] = useState<boolean>(false);

  const navigateToCommunity = () => {
    setNavigateCommunity(community);
    navigate(`/communities/${communityInfo.communityId}`);
  };

  const hasToRequestPermissionToJoin = useMemo(() => {
    return ((community.isPrivate ?? false) && currentRelationshipType === RelationshipType.None)
  }, [community.relationshipType, currentRelationshipType])

  const hasToJoin = useMemo(() => currentRelationshipType === RelationshipType.None, [community.relationshipType, currentRelationshipType]);
  const requestedInvite = useMemo(() => currentRelationshipType === RelationshipType.Requested, [community.relationshipType, currentRelationshipType]);
  const canUnJoin = useMemo(() => currentRelationshipType === RelationshipType.Member || joined, [community.relationshipType, currentRelationshipType, joined]);

  return (
    <>
      <div
        className={`
          flex flex-col relative justify-between space-x-3 border-y border-gray-100 p-5
          hover:shadow-lg dark:border-gray-800 dark:hover:bg-[#000000] rounded-full hover:underline
          p-2 hover:shadow-lg dark:border-gray-800 dark:hover:bg-[#0e1517] rounded-full
          h-[7.5rem]
          ${fitParent
            ? 'w-full'
            : `w-full       /* Full width on mobile */
               mb-2
               lg:w-[49%]
               3xl:w-[30%]`}
        `}
        data-testid="communitycard"
      >
        <div className="flex flex-col justify-between h-full space-x-3">
          <div className="flex item-center justify-between space-x-1 ">
            <div 
              className='flex cursor-pointer' 
              data-testid='communitylink'
              onClick={(e) => stopPropagationOnClick(e, navigateToCommunity)}
            >
              <OptimizedImage
                src={communityInfo.communityAvatar ?? ''}
                alt={communityInfo.communityName}
              />
              <p  data-testid="communitytext" className='text-sm ml-2 text-black dark:text-gray-50'>
                {communityInfo.communityName}
              </p>
            </div>

            {communityInfo.communityCreatedAt && (
              <TimeAgo
                className="text-xs text-gray-500 dark:text-gray-400 hidden md:block"
                date={convertDateToDisplay(communityInfo.communityCreatedAt)}
              />
            )}
          </div>
          <TagOrLabel
            color={
              (currentRelationshipType as RelationshipType) === RelationshipType.Founder ? 'gold'
                : (currentRelationshipType as RelationshipType) === RelationshipType.Invited ? 'success'
                  : (currentRelationshipType as RelationshipType) === RelationshipType.Member ? 'primary'
                    : (currentRelationshipType as RelationshipType) === RelationshipType.Invited ? 'secondary'
                      : 'neutral'
            }
            size="sm"
            className='mt-[-1rem] min-w-[3rem] ml-1 max-w-fit self-end'
          >
            {requestedInvite ? 'PENDING REQUEST TO JOIN' : currentRelationshipType.toUpperCase()}
          </TagOrLabel>
          <TagOrLabel
            color={(community.isPrivate ?? false) ? 'danger' : 'info'}
            size="sm"
            className='mt-[0.5rem] min-w-[3rem] max-w-fit self-end ml-1 mr-3 md:mr-3'
          >
            {(community.isPrivate) ? 'Private' : 'Public'}
          </TagOrLabel>
        </div>
        {(hasToJoin || canUnJoin) && (
          <div className="flex absolute top-[4.5rem] left-[4rem] justify-center h-full space-x-3 z-[100]">
            <InfoButton
              disabled={submitting}
              onClick={async (e: any) => {
                e.stopPropagation();
                setSubmitting(true);
                if (hasToRequestPermissionToJoin) {
                  await requestToJoinPrivateCommunity(communityInfo.communityId);
                  setCurrentRelationshipType(RelationshipType.Requested);
                }
                else if (canUnJoin) {
                  await unjoinPublicCommunity(communityInfo.communityId);
                  setCurrentRelationshipType(RelationshipType.None);
                  setJoined(false);
                }
                else {
                  await joinPublicCommunity(communityInfo.communityId);
                  setCurrentRelationshipType(RelationshipType.Member);
                  setJoined(true);
                }
                setSubmitting(false);
              }}
              classNames="px-0 cursor-default"
            >
              {submitting ? (
                <ButtonLoader />
              ) : (
                <p className={`
                  flex
                  min-w-[4rem] max-w-[12rem] cursor-pointer hover:underline ${canUnJoin ? 'hover:text-red-400' : 'hover:text-[#55a8c2]'}
                `}>
                  <span className={`mt-1 text-inherit`}>
                    {canUnJoin ? 'Leave' : hasToRequestPermissionToJoin ? 'Request to Join' : 'Join'}
                  </span>
                  {!canUnJoin && <PlusCircleIcon className="ml-0 h-[1.5rem] w-[1.5rem] py-1" />}
                </p>
              )}
            </InfoButton>
          </div>
        )}
      </div>
    </>
  );
}

export default CommunityItemComponent;
```
2) Reference mobx store for join communities, joining groups, and events would be similar:
```typescript
import { makeAutoObservable, runInAction } from "mobx";
import type { CommunityToDisplay, CreateListOrCommunityForm, CreateListOrCommunityFormDto } from "@typings";
import { RelationshipType } from "@enums";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/api/agent";
import { DEFAULT_CREATED_LIST_OR_COMMUNITY_FORM } from "@utils/constants";
import { store } from ".";
import type { AcceptOrDenyCommunityInviteConfirmationDto, UpdateCommunityForm, UpdateCommunityFormDto } from "@models/community";

export default class CommunityFeedStore {

    constructor() {
        makeAutoObservable(this);
    }

    loadingInitial = false;
    loadingUpsert = false;
    loadingJoinCommunity = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        debugger;
        if (value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagination: Pagination | undefined = undefined;
    pagingParams: PagingParams = new PagingParams(1, 25);

    communityRegistry: Map<string, CommunityToDisplay> = new Map<string, CommunityToDisplay>();
    currentStepInCommunityCreation: number | undefined = undefined;
    communityCreationForm: CreateListOrCommunityForm = DEFAULT_CREATED_LIST_OR_COMMUNITY_FORM;
    currentStepInCommunityUpdate: number | undefined = undefined;
    updateCommunityForm: UpdateCommunityForm | undefined = undefined;


    navigatedCommunity: CommunityToDisplay | undefined = undefined;
    setNavigateCommunity = (val: CommunityToDisplay | undefined) => {
        this.navigatedCommunity = val;
    }
    setLoadingJoinCommunity = (val: boolean) => {
        this.loadingJoinCommunity = val;
    }
    setLoadingInitial = (val: boolean) => {
        this.loadingInitial = val;
    }
    setLoadingUpsert = (val: boolean) => {
        this.loadingUpsert = val;
    }
    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setCommunity = (communityId: string, community: CommunityToDisplay) => {
        this.communityRegistry.set(communityId, community);
    }
    private updateCommunityRelationship = (communityId: string, newStatus: RelationshipType) => {
        if (this.communityRegistry.has(communityId)) {
            const communityInfo = this.communityRegistry.get(communityId);
            communityInfo!.relationshipType = newStatus;
            this.setCommunity(communityId, communityInfo!);
        }
    }
    setCurrentStepInCommunityCreation = (currentStep: number) => {
        this.currentStepInCommunityCreation = currentStep;
    }
    setCommunityCreationForm = (val: CreateListOrCommunityForm) => {
        this.communityCreationForm = val;
    }
    setCurrentStepInCommunityUpdate = (currentStep: number) => {
        this.currentStepInCommunityUpdate = currentStep;
    }
    setUpdateCommunityForm = (val: UpdateCommunityForm | undefined) => {
        this.updateCommunityForm = val;
    }

    resetListsState = () => {
        this.predicate.clear();
        this.communityRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    updateCommunity = async (values: UpdateCommunityForm, communityId: string) => {

        this.setLoadingUpsert(true);
        try {
            const updatedCommunityDto: UpdateCommunityFormDto = values;
            await agent.communityApiClient.updateCommunity(updatedCommunityDto, communityId);

            runInAction(() => {
                store.modalStore.closeModal();
                this.setCurrentStepInCommunityUpdate(0);
                this.setUpdateCommunityForm(undefined);
            });
        } finally {
            this.setLoadingUpsert(false);
        }

    }

    deleteCommunity = async (communityId: string) => {

        this.setLoadingUpsert(true);
        try {
            await agent.communityApiClient.deleteCommunity(communityId);

            runInAction(() => {
                this.communityRegistry.delete(communityId);
                store.modalStore.closeModal();
            });
        } finally {
            this.setLoadingUpsert(false);
        }

    }

    unjoinPublicCommunity = async (communityId: string) => {

        this.setLoadingJoinCommunity(true);
        try {
            const authUserSession = store.authStore.currentSessionUser;
            const joinCommunityDto = {
                username: authUserSession?.username ?? "",
                email: authUserSession?.email ?? "",
            }
            await agent.communityApiClient.unjoinCommunity(joinCommunityDto, communityId)

            runInAction(() => {
                this.updateCommunityRelationship(communityId, RelationshipType.None);
            });
        } finally {
            this.setLoadingJoinCommunity(false);
        }

    }
    joinPublicCommunity = async (communityId: string) => {

        this.setLoadingJoinCommunity(true);
        try {
            const authUserSession = store.authStore.currentSessionUser;

            const joinCommunityDto = {
                username: authUserSession?.username ?? "",
                email: authUserSession?.email ?? "",
            }
            await agent.communityApiClient.joinCommunity(joinCommunityDto, communityId)

            runInAction(() => {
                this.updateCommunityRelationship(communityId, RelationshipType.Member);
            });
        } finally {
            this.setLoadingJoinCommunity(false);
        }

    }
    requestToJoinPrivateCommunity = async (communityId: string) => {

        this.setLoadingJoinCommunity(true);
        try {
            const authUserSession = store.authStore.currentSessionUser;
            const joinCommunityDto = {
                username: authUserSession?.username ?? "",
                email: authUserSession?.email ?? "",
            }
            await agent.communityApiClient.requestToJoinCommunity(joinCommunityDto, communityId)

            runInAction(() => {
                this.updateCommunityRelationship(communityId, RelationshipType.Requested);
            });
        } finally {
            this.setLoadingJoinCommunity(false);
        }

    }
    acceptRequestToJoinPrivateCommunity = async (
        communityId: string,
        invitedUserId: string,
        acceptToDenyRequest: AcceptOrDenyCommunityInviteConfirmationDto) => {

        this.setLoadingJoinCommunity(true);
        try {
            acceptToDenyRequest.invitedUserId = invitedUserId;
            await agent.communityApiClient.acceptOrDenyToJoinRequestToCommunity(acceptToDenyRequest, communityId)

            runInAction(async () => {
                await this.loadCommunities();
            });
        } finally {
            this.setLoadingJoinCommunity(false);
        }

    }

    addCommunity = async (newCommunity: CreateListOrCommunityForm) => {

        this.setLoadingUpsert(true);
        try {
            const newCommunityDto: CreateListOrCommunityFormDto = {
                ...newCommunity,
                usersAdded: newCommunity.usersAdded.map(u => u.id),
                postsAdded: newCommunity.postsAdded.map(p => p.postId)
            };
            await agent.communityApiClient.addCommunity(newCommunityDto)

            runInAction(() => {
                this.setCurrentStepInCommunityCreation(0);
                this.setCommunityCreationForm(DEFAULT_CREATED_LIST_OR_COMMUNITY_FORM);
            });

            store.modalStore.closeModal();
            await this.loadCommunities(true);
        } finally {
            this.setLoadingUpsert(false);
        }

    }

    loadCommunities = async (refresh?: boolean) => {

        this.setLoadingInitial(true);
        if (refresh) {
            this.communityRegistry.clear();
            this.setPagingParams(new PagingParams(1, 25));
        }
        try {
            const { items, pagination } = await agent.communityApiClient.getCommunities(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((community: CommunityToDisplay) => {
                    this.setCommunity(community.communityId, community)
                });
            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }

    get communities() {
        return Array.from(this.communityRegistry.values());
    }
}
```

3) Reference code from the backend, endpoints for joining groups and events:
```csharp

        /// <summary>
        /// Join a group as the logged-in user.
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        [HttpPut("{groupId:guid}/join")]
        public async Task<IActionResult> JoinGroup(Guid groupId)
        {
            var authError = ValidateAccessToken();
            if (authError != null)
                return authError;

            using var cts = new CancellationTokenSource();
            CancellationToken ct = cts.Token;

            var loggedInUser = _userCacheService.GetLoggedInUser();
            Guid.TryParse(loggedInUser?.Id?.ToString(), out var userId);
            if (userId == Guid.Empty)
                return Unauthorized("User must be logged in to join a group.");

            try
            {
                await _groupMemberRepository.JoinGroup(_supabase, userId, groupId, ct);

                _logger.LogInformation("User {userId} joined group {groupId}", userId, groupId);
                return Ok(new { success = true, message = "Joined Successfully" });
            }
            catch (Exception err)
            {
                Console.WriteLine($"Error joining group: {err.Message}");
                return StatusCode(500, new { message = "Join group error!", success = false });
            }
        }

        /// <summary>
        /// Remove a member from a group. Only the group founder may do this.
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="memberUserId"></param>
        /// <returns></returns>
        [HttpDelete("{groupId:guid}/members/{memberUserId:guid}")]
        public async Task<IActionResult> RemoveGroupMember(Guid groupId, Guid memberUserId)
        {
            var authError = ValidateAccessToken();
            if (authError != null)
                return authError;

            using var cts = new CancellationTokenSource();
            CancellationToken ct = cts.Token;

            var loggedInUser = _userCacheService.GetLoggedInUser();
            Guid.TryParse(loggedInUser?.Id?.ToString(), out var userId);
            if (userId == Guid.Empty)
                return Unauthorized("User must be logged in to remove a group member.");

            try
            {
                await _groupMemberRepository.RemoveGroupMember(
                    _supabase,
                    userId,
                    groupId,
                    memberUserId,
                    ct
                );

                _logger.LogInformation(
                    "User {memberUserId} removed from group {groupId}",
                    memberUserId,
                    groupId
                );
                return Ok(new { success = true });
            }
            catch (Exception err)
            {
                Console.WriteLine($"Error removing group member: {err.Message}");
                return StatusCode(
                    500,
                    new { message = "Remove group member error!", success = false }
                );
            }
        }
```
4) Reference code for an example admin section:
```typescript
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import type { CommunityAdminInfo } from "typings";
import { convertDateToDisplay } from "@utils/index";
import { useStore } from "@stores/index";
import RequestedInvitesModal from "@common/RequestedInvitesModal";
import { CommonLink } from "@common/Links";
import UpdateCommunityModal from "@common/UpdateCommunityModal";
import { InfoCardContainer } from "@common/Containers";
import { ConfirmModal } from "@common/Modal";
import { TagOrLabel } from "@common/Titles";
import { useEffect, useState } from "react";
import { communityApiClient } from "@utils/api/communityApiClient";
import { SkeletonLoader } from "@common/CustomLoader";
import { FilterKeys } from '@enums';

type Props = {
  communityId: string;
};

function CommunityAdminView({ communityId }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [adminCommunityInfo, setAdminCommunityInfo] = useState<
    CommunityAdminInfo | undefined
  >(undefined);

  async function loadAdminCommunityInfo() {
    const communityAdminInfoResult =
      await communityApiClient.getAdminCommunityInfo(
        undefined,
        communityId!,
      );

    setAdminCommunityInfo(communityAdminInfoResult);
    setLoading(false);
  }

  async function refreshAdminCommunityInfo(communityId: string) {
    setLoading(true);
    const communityInfoResult = await communityApiClient.getAdminCommunityInfo(
      undefined,
      communityId,
    );

    setAdminCommunityInfo(communityInfoResult);
    setLoading(false);
  }

  const navigate = useNavigate();
  const { modalStore, communityFeedStore } = useStore();
  const { showModal, closeModal } = modalStore;

  useEffect(() => {
    loadAdminCommunityInfo();
  }, [communityId]);

  if (loading) <SkeletonLoader />;

  if (adminCommunityInfo)
    return (
      <>
        <div className="flex justify-between items-center p-5">
          <h1 className="text-4xl">{`A Founder's Welcome `}</h1>
          <div className="flex space-x-2">
            <CommonLink
              onClick={() =>
                showModal(
                  <UpdateCommunityModal
                    communityAdminInfo={adminCommunityInfo}
                    refreshCommunityAdminInfo={refreshAdminCommunityInfo}
                  />,
                )
              }
              animatedLink={false}
              classNames="border border-[0.1rem] hover:text-[#55a8c2]"
            >
              Edit Community
            </CommonLink>
            <CommonLink
              onClick={() =>
                showModal(
                  <ConfirmModal
                    title="Delete Community"
                    confirmMessage="Are you sure you want to delete this community? This action cannot be undone."
                    onClose={() => closeModal()}
                    declineButtonText="Cancel"
                    confirmButtonText="Delete"
                    confirmButtonClassNames="bg-red-600"
                    confirmFunc={async () => {
                      await communityFeedStore.deleteCommunity(
                        adminCommunityInfo.communityId,
                      );
                      navigate(-1);
                    }}
                  />,
                )
              }
              animatedLink={false}
              classNames="border border-[0.1rem] text-red-600 hover:text-red-700"
            >
              Delete Community
            </CommonLink>
          </div>
        </div>
        <div className="relative flex">
          <img
            className="p-1 h-[5rem] w-[5rem] rounded-full object-cover "
            src={adminCommunityInfo.communityAvatar}
            alt={adminCommunityInfo.communityName}
          />
          <InfoCardContainer>
            <h1 className="text-3xl">{adminCommunityInfo.communityName}</h1>
          </InfoCardContainer>
          <TagOrLabel
            color={adminCommunityInfo.isPrivate ? "danger" : "info"}
            size="sm"
            className="absolute bottom-0 right-0"
          >
            {adminCommunityInfo.isPrivate ? "Private" : "Public"}
          </TagOrLabel>
        </div>
        <div className="flex flex-5">
          <InfoCardContainer>
            <p className="absolute left-0 top-0 w-full text-center text-sm text-gray-700 dark:text-gray-100">
              Invited Users:
            </p>
            <h1 className="w-full text-center text-3xl">
              {adminCommunityInfo.invitedCount}
            </h1>
          </InfoCardContainer>
          <InfoCardContainer>
            <p className="absolute left-0 top-0 w-full text-center text-sm text-gray-700 dark:text-gray-100">
              Joined Users:
            </p>
            <h1 className="w-full text-center text-3xl">
              {adminCommunityInfo.joinedCount}
            </h1>
          </InfoCardContainer>
          {adminCommunityInfo.isPrivate && (
            <InfoCardContainer>
              <p className="absolute left-0 top-0 w-full text-center text-sm text-gray-700 dark:text-gray-100">
                Pending Invites:
              </p>
              <h1 className="w-full text-center text-3xl">
                {adminCommunityInfo.inviteRequestedUsers?.length ?? 0}
              </h1>
              <button
                type="button"
                onClick={async (e) => {
                  e.stopPropagation();
                  showModal(
                    <RequestedInvitesModal
                      invitedUsers={adminCommunityInfo.inviteRequestedUsers}
                      title="Pending Invite Requests"
                      filterKey={FilterKeys.Community}
                      entityInvitedToId={adminCommunityInfo.communityId}
                    />,
                  );
                }}
                className={`
                                min-w-[4rem] max-w-[12rem] max-h-[3rem] border px-3 py-1 
                                font-bold 
                                text-gray-900
                                dark:text-white 
                                hover:text-[#55a8c2]
                                hover:opacity-90
                                disabled:opacity-40
                                text-xs
                                flex
                                `}
              >
                Accept Or Deny Invites
              </button>
            </InfoCardContainer>
          )}
          <InfoCardContainer>
            <p className="absolute left-0 top-0 w-full text-center text-sm text-gray-700 dark:text-gray-100">
              Created on:{" "}
            </p>
            <h1 className="w-full text-center mt-2">
              {new Date(
                convertDateToDisplay(adminCommunityInfo.communityCreatedAt),
              ).toLocaleString("default", { dateStyle: "short" })}
            </h1>
          </InfoCardContainer>
        </div>
      </>
    );

  return <></>;
}

export default observer(CommunityAdminView);
```
