import React from "react";
import Lottie from "lottie-react";
import featherConfig from "../animated-icons/feather.json";

export const SuspenseLoader = React.memo(function () {
  return (
    <div className='flex flex-row justify-center items-center w-full h-full'>
      <img
        data-testid="navlogo"
        src="https://res.cloudinary.com/aa1997/image/upload/v1751518818/new-desktop-logo_ocwyft.svg"
        className={`
        m-0 h-42 md:h-48 lg:h-60 2xl:h-82 w-42 md:w-48 lg:w-60 2xl:w-82 transition-all duration-200
        cursor-pointer
    `}
        alt="AlSaqr Logo"
        style={{ maxWidth: "unset" }}
      />
      <Lottie
        animationData={featherConfig}
        className="h-[5rem] w-[5rem] md:h-[8rem] md:w-[8rem] 2xl:h-[9.5rem] 2xl:w-[9.5rem] text-[#55a8c2] mt-[2rem]"
        loop={true}
      />
    </div>
  );
});


interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

export const SkeletonLoader = React.memo(function SkeletonLoader({
  count = 1,
  className,
}: SkeletonLoaderProps) {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse flex flex-col space-y-3 dark:bg-[#1d2a2e] bg-gray-100 p-4 rounded-md w-full ${className && className}`}
        >
          <div className="h-6 dark:bg-[#0e1517] bg-gray-300 rounded w-3/4" />
          <div className="h-4 dark:bg-[#0e1517] bg-gray-300 rounded w-full" />
          <div className="h-4 dark:bg-[#0e1517] bg-gray-300 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
});


export const ModalLoader = () => (
  <svg
    aria-hidden="true"
    className="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#55a8c2]"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);

export const ButtonLoader = () => (
  <svg
    aria-hidden="true"
    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#55a8c2]"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);