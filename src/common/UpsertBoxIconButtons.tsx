import React from 'react';
import { EmojiHappyIcon, PhotographIcon } from "@heroicons/react/outline";
import { useCallback, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

type Props = {
    setInput: (val: string) => void;
    input: string;
    setImage: (val: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
};


function UpsertBoxIconButton({ input, setInput, setImage, inputRef }: Props) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleShowEmojiPicker = (e: React.MouseEvent) => {
        // Stop the opening click from reaching the document, otherwise the
        // picker's own onClickOutside handler treats it as an outside click and
        // closes immediately (most visible inside the portaled modal).
        e.stopPropagation();
        setShowEmojiPicker((prev) => !prev);
    };

    const handleEmojiSelect = (iValue: string) => (emoji: any) => {
        const newInputValue = iValue + emoji.native;
        setInput(newInputValue);
        setShowEmojiPicker(false);
    };

    const handleEmojiSelectClickOutside = useCallback(
        () => setShowEmojiPicker(false),
        []
    );

    const handleUploadImage = useCallback(() => {
        imageInputRef?.current?.click();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                // Move focus back to the message field so the user can keep
                // typing right after the image is attached.
                inputRef?.current?.focus();
            };
            reader.readAsDataURL(file);
        }
        // Reset so selecting the same file again still fires onChange.
        event.target.value = "";
    };

    return (
        <div className="flex flex-1 space-x-2 text-[#55a8c2] z-3">
            <PhotographIcon
                onClick={handleUploadImage}
                className="h-5 w-5 cursor-pointer
              transition-transform duration-150 ease-out
              hover:scale-150"
            />
            <input
                type="file"
                ref={imageInputRef}
                hidden
                onChange={handleFileChange}
            />
            <EmojiHappyIcon
                onClick={handleShowEmojiPicker}
                className="h-5 w-5 cursor-pointer
              transition-transform duration-150 ease-out
              hover:scale-150"
            />
            <div style={{  position: "absolute", zIndex: 1000 }}>
                {showEmojiPicker && (
                    <Picker
                        data={emojiData}
                        onEmojiSelect={handleEmojiSelect(input)}
                        onClickOutside={handleEmojiSelectClickOutside}

                    />
                )}
            </div>
        </div>
    );
}

export default UpsertBoxIconButton;