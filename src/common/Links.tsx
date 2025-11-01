import { stopPropagationOnClick } from "@utils/index";

export interface CommonLinkProps {
  animatedLink: boolean;
  onClick: Function;
  activeInd?: boolean;
  classNames?: string;
}

export function CommonLink(props: React.PropsWithChildren<CommonLinkProps>) {
  return (
    <div
      onClick={(e) => stopPropagationOnClick(e, props.onClick)}
      className={`
        ${
          props.animatedLink
            ? `group flex md:max-w-fit w-100 md:w-unset 
      cursor-pointer items-center space-x-2 px-4 py-3  dark:text-gray-50
      transition-all duration-200 animate-pulse text-[#55a8c2] hover:bg-[#55a8c2]-100 dark:hover:bg-[#000000] dark:hover:opacity-50 dark:text-[#55a8c2]`
            : `group flex max-w-fit 
            justify-center
      cursor-pointer items-center space-x-2 rounded-full px-4 py-3 dark:text-gray-50
      transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600`
        }
        ${props.activeInd ? "bg-gray-100 dark:bg-gray-600 text-[#55a8c2]" : ""}
        ${props.classNames ?? ""}
        `}
    >
      {props.children}
    </div>
  );
}
