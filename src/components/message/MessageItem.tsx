import { OptimizedImage, OptimizedPostImage } from "@common/Image";
import { convertDateToDisplay } from "@utils/index";
import TimeAgo from "react-timeago";
import { MessageToDisplay } from "typings";

type Props = {
    loggedInUserId: string;
    messageToDisplay: MessageToDisplay;
};

function MessageItem({ loggedInUserId, messageToDisplay }: Props) {
    return (
        <div
            key={messageToDisplay.messageId}
            className={`flex ${messageToDisplay.senderId === loggedInUserId ? 'justify-end' : 'justify-start'}`}
            data-testid="messageitemcard"
        >
            {!(messageToDisplay.senderId === loggedInUserId) && (
                <OptimizedImage
                    src={messageToDisplay.senderAvatar ?? ''}
                    alt={messageToDisplay.senderUsername ?? ''}
                    classNames="w-8 h-8 rounded-full mr-2 mt-1"
                />
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg ${(messageToDisplay.senderId === loggedInUserId) ? 'flex flex-col items-end' : ''}`}>
                {!(messageToDisplay.senderId === loggedInUserId) && (
                    <span className="text-xs font-medium text-gray-700 mb-1">
                        {messageToDisplay.text}
                    </span>
                )}
                <div
                    className={`p-3 rounded-lg ${(messageToDisplay.senderId === loggedInUserId) ? 'bg-blue-500 text-white' : 'bg-[#55a8c2] text-white'}`}
                >
                    <p data-testid="messageitemtext">{messageToDisplay.text}</p>
                    {messageToDisplay.messageMedia && (
                        <OptimizedPostImage
                            src={messageToDisplay.messageMedia}
                            alt="img/message"
                            classNames="m-5 ml-0 max-h-60 rounded-lg object-cover shadow-sm"
                        />
                    )}
                </div>
                <TimeAgo
                    date={convertDateToDisplay(messageToDisplay.messageCreatedAt)}
                />
            </div>
        </div>
    );
}

export default MessageItem;