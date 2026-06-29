import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "@stores/index";
import { GroupRecord } from "@models/group";
import { ModalBody, ModalPortal, ConfirmModal } from "@common/Modal";
import { AbsoluteDangerButton, InfoButton } from "@common/Buttons";
import UpsertGroupForm from "./UpsertGroupForm";

interface GroupOwnerActionsProps {
    group: GroupRecord;
    // Called after a successful edit when viewing this group's own details page, so the
    // page can refetch and show the updated record. On the /admin route the founded-groups
    // list is reloaded instead, so this is ignored there.
    onUpdated?: () => void;
}

// Renders edit/delete controls only when the logged-in user founded the group.
// The API enforces this server-side too; this only hides controls from non-owners.
const GroupOwnerActions = observer(({ group, onUpdated }: GroupOwnerActionsProps) => {
    const { authStore, groupsFeedStore, myGroupsFeedStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { deleteGroup } = groupsFeedStore;
    const { loadMyGroups } = myGroupsFeedStore;
    const { showModal, closeModal } = modalStore;
    const navigate = useNavigate();
    const location = useLocation();

    const isFounder = !!currentSessionUser && currentSessionUser.id === group.founderId;
    if (!isFounder) return null;

    // After a successful edit: on the admin dashboard reload the founded-groups list;
    // on the group's details page refresh the loaded record.
    const handleUpdated = () => {
        if (location.pathname.startsWith("/admin")) loadMyGroups();
        else onUpdated?.();
    };

    const openEdit = () =>
        showModal(
            <ModalPortal>
                <ModalBody onClose={closeModal}>
                    <UpsertGroupForm group={group} onClose={closeModal} onUpdated={handleUpdated} />
                </ModalBody>
            </ModalPortal>
        );

    const openDelete = () =>
        showModal(
            <ConfirmModal
                title="Delete group"
                confirmMessage={`Are you sure you want to delete "${group.name}"? This cannot be undone.`}
                onClose={closeModal}
                declineButtonText="Cancel"
                confirmButtonText="Delete"
                confirmButtonClassNames="bg-red-500"
                confirmFunc={async () => {
                    await deleteGroup(group.id);
                    closeModal();
                    navigate("/admin");
                }}
            />
        );

    return (
        <div className="flex gap-2 px-2 py-2">
            <InfoButton classNames="bg-[#55a8c2] text-white" onClick={openEdit}>Edit</InfoButton>
            <AbsoluteDangerButton onClick={openDelete}>Delete</AbsoluteDangerButton>
        </div>
    );
});

export default GroupOwnerActions;
