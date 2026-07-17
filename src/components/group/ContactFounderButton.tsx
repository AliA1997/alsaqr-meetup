import { useState } from "react";
import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { useStore } from "@stores/index";
import { GroupRecord } from "@models/group";
import { LoginModal } from "@common/AuthModals";
import { ConfirmModal } from "@common/Modal";
import { CommonUpsertButton } from "@common/Buttons";
import { MessageFormDto } from "@typings";

interface ContactFounderButtonProps {
    group: GroupRecord;
}

// Default opener for a member reaching out to a group's founder.
const DEFAULT_MESSAGE = "Hello, how's the group?";

// Shown in place of "Create Event" when the viewer is not the group's founder. Sends a
// direct message to the founder pre-filled with the default body. Logged-out users get
// the login prompt instead of an authenticated action.
const ContactFounderButton = observer(({ group }: ContactFounderButtonProps) => {
    const { authStore, messageStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { sendDirectMessage, loadingUpsert } = messageStore;
    const { showModal, closeModal } = modalStore;
    const [sent, setSent] = useState(false);

    const sendMessage = async () => {
        if (!currentSessionUser || !group.founderId) return;

        const messageForm: MessageFormDto = {
            senderId: currentSessionUser.id,
            senderUsername: currentSessionUser.username,
            senderProfileImg: currentSessionUser.avatar,
            recipientId: group.founderId,
            recipientUsername: "",
            recipientProfileImg: "",
            text: DEFAULT_MESSAGE
        };

        await sendDirectMessage(messageForm);
        setSent(true);
        closeModal();
        toast("Message sent to the founder!", { icon: "✉️" });
    };

    const handleClick = () => {
        if (!currentSessionUser) {
            showModal(<LoginModal />);
            return;
        }
        if (!group.founderId) return;

        showModal(
            <ConfirmModal
                title="Contact founder"
                confirmMessage={`Send the following message to the founder?\n\n"${DEFAULT_MESSAGE}"`}
                onClose={closeModal}
                declineButtonText="Cancel"
                confirmButtonText="Send message"
                confirmButtonClassNames=""
                confirmFunc={sendMessage}
            />
        );
    };

    return (
        <CommonUpsertButton
            testId="contactFounder"
            onClick={handleClick}
            submitting={loadingUpsert}
            disabled={sent}
        >
            {sent ? "Message Sent" : "Contact founder"}
        </CommonUpsertButton>
    );
});

export default ContactFounderButton;
