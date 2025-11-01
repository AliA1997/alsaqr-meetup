import { useCallback, useMemo, useRef, useState } from "react";
import { ModalLoader } from "./CustomLoader";
import { OptimizedImage } from "./Image";
import { ContentContainerWithRef } from "./Containers";
import { CommonLink } from "./Links";
import { NoRecordsTitle } from "./Titles";

type TabsProps = {
  tabs: {
    tabKey: string;
    title: string;
    image?: string;
    content: any[];
    noRecordsContent: string;
    renderer: (obj: any) => React.ReactNode;
  }[];
  showNumberOfRecords?: boolean;
  loading: boolean;
  loadOnTabSwitch?: (tab: string) => Promise<void>;
  containerClassNames?: string;
};

function Tabs({ tabs, showNumberOfRecords, loading, loadOnTabSwitch, containerClassNames }: TabsProps) {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].tabKey);
  const tabLinks = useMemo(
    () =>
      tabs.map((t) => ({
        tabKey: t.tabKey,
        title: t.title,
        image: t.image ?? undefined,
        numberOfRecords: t.content.length,
      })),
    [tabs]
  );
  const tabContents = useMemo(
    () =>
      tabs.map((t) => ({
        tabKey: t.tabKey,
        content: t.content,
        renderer: t.renderer,
        noRecordsContent: t.noRecordsContent
      })),
    [tabs]
  );
  const handleTabSwitch = useCallback((tab: string) => {
    setActiveTab(tab);
    if(loadOnTabSwitch)
      loadOnTabSwitch(tab);
  }, []);
  return (
    <ContentContainerWithRef
      classNames={`
          text-center overflow-y-auto scrollbar-hide
          min-h-[100vh] max-h-[100vh]
          lg:max-w-4xl 
        `}
      innerRef={containerRef}
    >
      <div className={`flex justify-around`}>
        {tabLinks.map(
          (
            tl: { tabKey: string; title: string, image?: string; numberOfRecords: number },
            tlIdx: number
          ) => (
            <CommonLink
              key={tlIdx}
              onClick={() => handleTabSwitch(tl.tabKey)}
              activeInd={activeTab === tl.tabKey}
              animatedLink={false}
            >
              {tl.image ? (
                <OptimizedImage
                  src={tl.image}
                  alt={tl.title}
                />
              ) : <>{tl.title}</>}

              {showNumberOfRecords && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs ml-2">
                  {tl.numberOfRecords}
                </span>
              )}
            </CommonLink>
          )
        )}
      </div>
      {tabContents.map(
        (
          tC: {
            tabKey: string;
            content: any[];
            renderer: (obj: any) => React.ReactNode;
            noRecordsContent: string;
          },
          tCIdx: number
        ) => (
          <div
            key={tCIdx}
            id={`${tC.tabKey}`}
            className={`tab-content p-4 ${activeTab === tC.tabKey ? "" : "hidden" }  ${containerClassNames ? containerClassNames : ''}`}
          >

            {loading 
              ? <ModalLoader />
              : tC.content && tC.content.length ? (
                  tC.content.map(tC.renderer)
                ) : (
                  <NoRecordsTitle>{tC.noRecordsContent}</NoRecordsTitle>
                )
              }
          </div>
        )
      )}
    </ContentContainerWithRef>
  );
}

export default Tabs;
