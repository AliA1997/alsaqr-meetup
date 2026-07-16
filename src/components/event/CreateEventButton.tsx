import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { ModalBody, ModalPortal } from "@common/Modal";
import { LoginModal } from "@common/AuthModals";
import { CommonUpsertButton } from "@common/Buttons";
import { PlusIcon } from "@heroicons/react/outline";
import UpsertEventForm from "./UpsertEventForm";

interface CreateEventButtonProps {
    // The group this event will belong to. Events are only created from their group's
    // details page, so the group is always known here.
    groupId: string;
    // Called after an event is successfully created so the group's details page can refresh
    // in place and show the new event.
    onUpdated?: () => void;
}

// Logged-in-only "Create Event" entry point shown on a group's details page. Hidden for
// logged-out users so they never see mutating actions.
const CreateEventButton = observer(({ groupId, onUpdated }: CreateEventButtonProps) => {
    const { authStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { showModal, closeModal } = modalStore;

    if (!currentSessionUser) return null;

    const handleClick = () => {
        if (!currentSessionUser) {
            showModal(<LoginModal />);
            return;
        }
        showModal(
            <ModalPortal>
                <ModalBody onClose={closeModal}>
                    <UpsertEventForm groupId={groupId} onClose={closeModal} onUpdated={onUpdated} />
                </ModalBody>
            </ModalPortal>
        );
    };

    return (
        <CommonUpsertButton testId="createEvent" onClick={handleClick} submitting={false}>
            <PlusIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-125 mr-3" />
            Create Event
        </CommonUpsertButton>
    );
});

export default CreateEventButton;
