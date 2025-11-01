import React, { ReactElement, SVGProps, useMemo } from "react";
import { nonRoutableTitles } from "@utils/index";
import { CommonLink, CommonLinkProps } from "@common/Links";
import { DELETE_YOUR_ACCOUNT, ROUTES_USER_CANT_ACCESS } from "@utils/constants";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { LoginModal } from "@common/AuthModals";
import { useNavigate } from "react-router-dom";
import { supabase } from "@utils/supabase";

interface SidebarRowProps {
  Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  IconImage?: ReactElement<any, any>;
  title: string;
  active?: boolean;
  isShow?: boolean;
  href?: string;
  onClick?: Function;
  classNames?: string;
  overrideOnClick?: boolean;
}

const SIGN_OUT_TITLE = "Sign Out";
const SIGN_IN_TITLE = "Sign In";
const MORE_TITLE = "More";

function SidebarRow({
  Icon,
  IconImage,
  title,
  active,
  isShow,
  onClick,
  href,
  overrideOnClick
}: SidebarRowProps) {
  const { authStore, modalStore } = useStore();
  const { auth, currentSessionUser, setCurrentSessionUser } = authStore;
  const { showModal } = modalStore;
  const navigate = useNavigate();
  const notLoggedIn = useMemo(() => !auth?.isLoggedIn(), [currentSessionUser]);

  const sidebarOnClick = async (e: React.MouseEvent) => {
    if (e)
      e.preventDefault();

    if (!nonRoutableTitles.includes(title) && !overrideOnClick) {


      if (notLoggedIn && ROUTES_USER_CANT_ACCESS.some(r => r.includes(href!)))
        showModal(<LoginModal />)
      else
        navigate(href!);

      if(onClick)
        onClick(e);
    }
    else {
      if (title === SIGN_IN_TITLE || title === MORE_TITLE || overrideOnClick) onClick!(e);
      if (title === SIGN_OUT_TITLE) {
        await supabase.auth.signOut();
        auth?.clearUser();
        setCurrentSessionUser(undefined);
      };
    }

  };

  const commonLinkProps: CommonLinkProps = {
    onClick: sidebarOnClick,
    animatedLink: title === SIGN_IN_TITLE || title === DELETE_YOUR_ACCOUNT,
    activeInd: active ?? false,
    classNames: "py-[1rem]"
  };
  const showText = useMemo(() => [SIGN_IN_TITLE, SIGN_OUT_TITLE].some((showTextTitle: string) => showTextTitle == title) || (isShow ?? false), [title]);

  return (
    <>
      <CommonLink {...commonLinkProps}>
        {Icon && <Icon className="h-4 w-4 md:h-6 md:w-6 flex-shrink-0" />}
        {IconImage && IconImage}
        <p className={`${showText ? '' : 'hidden'} group-hover:text-[#55a8c2] md:inline-flex text-base font-light ${active ? 'text-[#55a8c2]' : ''}`}>
          {title}
        </p>
      </CommonLink>
    </>
  );
}

export default observer(SidebarRow);
