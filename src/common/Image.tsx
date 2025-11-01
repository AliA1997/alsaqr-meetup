import { FALLBACK_IMAGE_URL, FALLBACK_NEWS_IMAGE_URL, FALLBACK_POST_IMAGE_URL } from '@utils/constants';
import { MouseEventHandler, useState } from 'react';

type CommonImageProps = {
    src: string;
    alt: string;
    classNames?: string;
    onClick?: MouseEventHandler<HTMLImageElement> | undefined;
}

export function FallbackImage({
    src,
    alt,
    onClick
}: CommonImageProps) {
    return (
        <img
            className="h-10 w-10 rounded-full object-cover"
            src={src}
            alt={alt}
            height={50}
            width={50}
            onClick={onClick}
            loading="lazy"
        />
    );
}

export function OptimizedImage({
    src,
    alt,
    onClick,
    classNames,
    loadedHeight,
    loadedWidth
}: CommonImageProps & { loadedHeight?: number, loadedWidth?: number }) {
    const [imageUrl, setImageUrl] = useState<string>(src)

    return (
        <img
            className={classNames ? classNames : "h-10 w-10 rounded-full object-cover"}
            src={imageUrl ?? ""}
            alt={alt}
            height={loadedHeight ? loadedHeight : 50}
            width={loadedWidth ? loadedWidth : 50}
            onClick={onClick}
            onError={() => {
                if (imageUrl != FALLBACK_IMAGE_URL)
                    setImageUrl(FALLBACK_IMAGE_URL);
            }}
            loading="lazy"
        />
    );
}

export function OptimizedNewsImage({
    src,
    alt,
    onClick,
    classNames
}: CommonImageProps) {
    const [imageUrl, setImageUrl] = useState<string>(src)
    
    return (
        <img
            className={classNames ? classNames : "h-full w-full object-cover"}
            src={imageUrl ?? ""}
            alt={alt}
            height={600}
            width={600}
            onClick={onClick}
            onError={() => {
                if (imageUrl != FALLBACK_NEWS_IMAGE_URL)
                    setImageUrl(FALLBACK_NEWS_IMAGE_URL);
            }}
            loading="lazy"
        />
    );
}


export function OptimizedPostImage({
    src,
    alt,
    onClick,
    classNames
}: CommonImageProps) {
    const [imageUrl, setImageUrl] = useState<string>(src)

    return (
        <img
            className={classNames ? classNames : "h-full w-full object-cover"}
            src={imageUrl ?? ""}
            alt={alt}
            height={600}
            width={600}
            onClick={onClick}
            onError={() => {
                if (imageUrl != FALLBACK_POST_IMAGE_URL)
                    setImageUrl(FALLBACK_POST_IMAGE_URL);
            }}
            loading="lazy"
        />
    );
}
