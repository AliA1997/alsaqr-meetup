
import React, { useLayoutEffect, useRef } from "react";
import SideBar from "./Sidebar";
import { useStore } from "@stores/index";
import { observer } from "mobx-react-lite";

type PageContainerProps = {
  title?: string;
};


const PageContainer = ({
  children,
}: React.PropsWithChildren<PageContainerProps>) => {
  const { authStore, modalStore } = useStore();
  const { currentSessionUser } = authStore;
  const { 
    modalToShow, 
  } = modalStore;
  const retryCount = useRef(0);

  useLayoutEffect(() => {

    retryCount.current += 1;

    return () => {
      retryCount.current = 0;
    }
  }, [currentSessionUser])

  useLayoutEffect(() => {
    if (window.location.hash === "#_=_") {
      // Remove the fragment without refreshing the page
      history.replaceState 
        ? history.replaceState(null, "", " ")
        : window.location.hash = "";
    }
  }, [window.location.hash])

  return (
    <>
      <SideBar />
      <div className="col-span-7 lg:col-span-7">
        {children ? children : null}
      </div>
      {modalToShow && modalToShow}
    </>
  );
};
export default observer(PageContainer);
