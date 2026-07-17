
import { useNavigate } from "react-router-dom";
import {
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import {UserItemToDisplay } from "@typings";
import {
    stopPropagationOnClick,
} from "@utils/index";
import { useStore } from "@stores/index";
import { LoginModal } from "@common/AuthModals";
import { shortenText } from "@utils/index";
import { MAX_BIO_LENGTH_FEED } from "@utils/constants";
import { AddOrFollowButton } from "@common/IconButtons";
import { OptimizedImage } from "@common/Image";
import { FilterKeys } from '@enums';


interface Props {
    filterKey?: FilterKeys;
    userItemToDisplay: UserItemToDisplay;
    usersAlreadyFollowedOrAddedIds: string[];
    canAddOrFollow: boolean;
    onModal: boolean;
    onAddOrFollow?: Function;
    loggedInUserId?: string;
    justDisplay?: boolean;
}

function UserItemComponent({
    userItemToDisplay,
    usersAlreadyFollowedOrAddedIds = [],
    filterKey = FilterKeys.Normal,
    onModal,
    onAddOrFollow,
    canAddOrFollow,
    loggedInUserId,
}: Props) {
    const navigate = useNavigate();
    const { modalStore } = useStore();
    const { showModal, closeModal } = modalStore;

    const userItemInfo = userItemToDisplay;
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    // For cases such as adding users to communities or lists.
    const [isAdded, setIsAdded] = useState<boolean>(false);

    const initiallyBooleanValues = useRef<{
        following: boolean;
        added: boolean;
    }>({
        following: false,
        added: false
    });

    const checkUserIsLoggedInBeforeUpdatingUserItem = async (
        callback: () => Promise<void>
    ) => {
        if (!loggedInUserId) return showModal(<LoginModal />)

        await callback();
    };

    useLayoutEffect(() => {
        if (loggedInUserId) {
            // alert(JSON)
            const alreadyFollowedOrAdded = usersAlreadyFollowedOrAddedIds?.some((userById: string) => userById == userItemInfo.id) ?? false;

            if (filterKey === FilterKeys.SearchUsers) {
                initiallyBooleanValues.current.added = alreadyFollowedOrAdded;
                setIsAdded(alreadyFollowedOrAdded);
            }
            else {
                initiallyBooleanValues.current.following = alreadyFollowedOrAdded;
                setIsFollowing(alreadyFollowedOrAdded);
            }
        }
    }, []);


    const navigateToUser = () => {
        if (onModal)
            closeModal();

        navigate(`users/${userItemInfo.username}`);
    };

    const onIsAlreadyAdded = async () => {
        const beforeUpdate = isAdded;
        try {
            await checkUserIsLoggedInBeforeUpdatingUserItem(async () => {
                setIsAdded(!isAdded);
                onAddOrFollow!(userItemToDisplay);
            });
        } catch {
            setIsAdded(beforeUpdate);
        }
    };

    const onIsAlreadyFollowing = async () => {
        const beforeUpdate = isFollowing;
        try {
            await checkUserIsLoggedInBeforeUpdatingUserItem(async () => {
                setIsFollowing(!isFollowing);
                await onAddOrFollow!(userItemToDisplay);
            });
        } catch {
            setIsFollowing(beforeUpdate);
        }
    };

    return (
        <>
            <div
                className={
                    `flex relative space-x-3 border-y border-gray-100 p-5 dark:border-gray-800
                    rounded-sm w-full h-[7em]
                `}
            >
                {canAddOrFollow && (
                    <AddOrFollowButton
                     isAdded={isAdded}
                     isFollowing={isFollowing}
                     filterKey={filterKey}
                     onIsAlreadyAdded={onIsAlreadyAdded}
                     onIsAlreadyFollowing={onIsAlreadyFollowing}
                    />
                )}

                <div className="flex flex-col justify-self-stretch grow justify-start h-full space-x-3 cursor-pointer">
                    <div className="flex justify-items-start items-end align-items-end space-x-2 text-gray-900 dark:text-gray-50">
                        <OptimizedImage
                            classNames="h-10 w-10 rounded-full object-cover"
                            src={userItemInfo.avatar ?? ''}
                            alt={userItemInfo.username}
                            onClick={(e) => stopPropagationOnClick(e, navigateToUser)}
                        />
                        <div className='flex flex-col items-start'>
                            <h6>
                                {userItemInfo.username}
                            </h6>
                            <p className='italic text-gray-400 text-sm'>
                                {shortenText(userItemInfo.bio ?? "", MAX_BIO_LENGTH_FEED)}
                            </p>
                            <div className='flex item-center justify-items-start space-x-3'>
                                <p className='italic text-gray-400 text-sm'>
                                    {userItemToDisplay.followingCount} Following
                                </p>
                                <p className='italic text-gray-400 text-sm'>
                                    {userItemToDisplay.followerCount} Followers
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserItemComponent;