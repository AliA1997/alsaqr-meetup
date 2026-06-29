import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { ModalBody, ModalPortal } from "@common/Modal";
import { LoginModal } from "@common/AuthModals";
import UpsertEventForm from "@components/event/UpsertEventForm";
import UpsertGroupForm from "@components/group/UpsertGroupForm";
import LocalGuideWizard from "@components/users/LocalGuideWizard";
import { TypeOfFeeds } from "@models/enums";
import { PlusIcon } from "@heroicons/react/outline";
import { CommonUpsertButton } from "./Buttons";


interface CreateEntityButtonProps {
    typeOfFeed: TypeOfFeeds;
    label?: string;
}

const defaultLabels: Record<string, string> = {
    [TypeOfFeeds.MyEvents.toString()]: "Create Event",
    [TypeOfFeeds.MyGroups.toString()]: "Create Group",
    [TypeOfFeeds.LocalGuides.toString()]: "Register As Local Guide",
};

// Logged-in-only entry point for create flows. Hidden entirely when logged out so
// unauthenticated users never see mutating actions.
const CreateEntityButton = observer(({ typeOfFeed, label }: CreateEntityButtonProps) => {
    const { authStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { showModal, closeModal } = modalStore;

    if (!currentSessionUser) return null;

    const renderForm = () => {
        switch (typeOfFeed) {
            case TypeOfFeeds.MyEvents:
                return <UpsertEventForm onClose={closeModal} />;
            case TypeOfFeeds.MyGroups:
                return <UpsertGroupForm onClose={closeModal} />;
            case TypeOfFeeds.LocalGuides:
            default:
                return <LocalGuideWizard onClose={closeModal} />;
        }
    };

    const handleClick = () => {
        if (!currentSessionUser) {
            showModal(<LoginModal />);
            return;
        }
        showModal(
            <ModalPortal>
                <ModalBody onClose={closeModal}>{renderForm()}</ModalBody>
            </ModalPortal>
        );
    };

    return (
        <CommonUpsertButton
            testId="createEntity"
            classNames="py-3 text-md lg:text-lg"
            onClick={handleClick}
            submitting={false}
        >
            <PlusIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-125 mr-3" />
            {label ?? defaultLabels[typeOfFeed]}
        </CommonUpsertButton>
    );
});

export default CreateEntityButton;
