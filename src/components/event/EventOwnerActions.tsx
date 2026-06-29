import { observer } from "mobx-react-lite";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "@stores/index";
import { EventRecord } from "@models/event";
import { ModalBody, ModalPortal, ConfirmModal } from "@common/Modal";
import { AbsoluteDangerButton, InfoButton } from "@common/Buttons";
import UpsertEventForm from "./UpsertEventForm";

interface EventOwnerActionsProps {
    event: EventRecord;
    // Called after a successful edit when viewing this event's own details page, so the
    // page can refetch and show the updated record. On the /admin route the founded-events
    // list is reloaded instead, so this is ignored there.
    onUpdated?: () => void;
}

// Renders edit/delete controls only when the logged-in user founded the event's
// parent group (event ownership is inherited from the group founder).
const EventOwnerActions = observer(({ event, onUpdated }: EventOwnerActionsProps) => {
    const { authStore, eventsFeedStore, myEventsFeedStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { deleteEvent } = eventsFeedStore;
    const { loadMyEvents } = myEventsFeedStore;
    const { showModal, closeModal } = modalStore;
    const navigate = useNavigate();
    const location = useLocation();

    const isFounder = !!currentSessionUser && currentSessionUser.id === event.groupFounderId;
    if (!isFounder) return null;

    // After a successful edit: on the admin dashboard reload the founded-events list;
    // on the event's details page refresh the loaded record.
    const handleUpdated = () => {
        if (location.pathname.startsWith("/admin")) loadMyEvents();
        else onUpdated?.();
    };

    const openEdit = () =>
        showModal(
            <ModalPortal>
                <ModalBody onClose={closeModal}>
                    <UpsertEventForm event={event} onClose={closeModal} onUpdated={handleUpdated} />
                </ModalBody>
            </ModalPortal>
        );

    const openDelete = () =>
        showModal(
            <ConfirmModal
                title="Delete event"
                confirmMessage={`Are you sure you want to delete "${event.name}"? This cannot be undone.`}
                onClose={closeModal}
                declineButtonText="Cancel"
                confirmButtonText="Delete"
                confirmButtonClassNames="bg-red-500"
                confirmFunc={async () => {
                    await deleteEvent(event.id);
                    closeModal();
                    navigate("/admin");
                }}
            />
        );

    return (
        <div className="flex justify-around gap-2 px-2 py-2">
            <InfoButton classNames="bg-[#55a8c2] text-white" onClick={openEdit}>Edit</InfoButton>
            <AbsoluteDangerButton onClick={openDelete}>Delete</AbsoluteDangerButton>
        </div>
    );
});

export default EventOwnerActions;
