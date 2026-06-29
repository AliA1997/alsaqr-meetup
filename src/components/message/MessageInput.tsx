import { ButtonLoader, SkeletonLoader } from "@common/CustomLoader";
import UpsertBoxIconButton from "@common/UpsertBoxIconButtons";
import { motion } from "framer-motion";
import { XIcon } from '@heroicons/react/outline';
import React from "react";
import { DangerAlert } from "@common/Alerts";

type Props = {
    onSubmit: (e: React.FormEvent) => Promise<void>;
    image: string;
    setImage: (val: string) => void;
    input: string;
    setInput: (val: string) => void;
    loading: boolean;
    submitting: boolean;
    processNsfwCheck: boolean;
    nsfwAlert: string;
    setNsfwAlert: (val: string) => void;
    hasError: boolean;
}

function MessageInput({
    onSubmit,
    image,
    setImage,
    input,
    setInput,
    loading,
    submitting,
    processNsfwCheck,
    nsfwAlert,
    setNsfwAlert,
    hasError
}: Props) {
    const messageInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="bg-white p-4 border-t border-gray-200 dark:border-none dark:bg-[#0e1517]">
            <form onSubmit={onSubmit} className="flex flex-col items-start">
                {nsfwAlert && (
                    <DangerAlert
                        title="NSFW Photos Not Allowed"
                        message={nsfwAlert}
                        onClose={() => setNsfwAlert('')}
                    />
                )}
                {image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className='relative'
                    >
                        <button
                            onClick={() => setImage("")} // Replace with your close logic
                            className="absolute left-2 top-2 z-10 rounded-full bg-red-800 p-2 text-white hover:bg-red-700 focus:outline-none"
                            aria-label="Close"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                        {processNsfwCheck ? (
                            <SkeletonLoader />
                        ) :(
                            <img
                                className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
                                src={image}
                                width={20}
                                height={20}
                                alt="image/message"
                            />
                        )}
                    </motion.div>
                )}
                <div className='flex w-full'>
                    <input
                        ref={messageInputRef}
                        type="text"
                        className={`
                            flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            dark:bg-gray-900  ${hasError ? 'bg-red-200' : ''}
                        `}
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        data-testid="messageinput"
                    />
                    <button
                        data-testid="messagesubmitbutton"
                        type="submit"
                        className="ml-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                        disabled={!input.trim() || submitting || hasError}
                    >
                        {loading ? (
                            <ButtonLoader />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className='px-1'>
                    <UpsertBoxIconButton setInput={setInput} input={input} setImage={setImage} inputRef={messageInputRef} />
                </div>
            </form>
        </div>
    );
}

export default MessageInput;