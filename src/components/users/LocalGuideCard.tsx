import { OptimizedPostImage } from "@common/Image";
import { TagOrLabel } from "@common/Titles";
import { HowSimilarKeys } from "@models/enums";
import { LocalGuideRecord } from "@models/localGuide";
import { useStore } from "@stores/index";
import { HOW_SIMILAR_LABEL_MAP } from "@utils/constants";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

interface LocalGuideProps {
  localGuide: LocalGuideRecord;
  howSimilar?: HowSimilarKeys;
  classNames?: string;
  showDistance?: boolean;
  testId?: string;
}

export default observer(function LocalGuideCard({
  localGuide,
  howSimilar,
  classNames,
  showDistance,
  testId,
}: LocalGuideProps) {
  const { localGuidesFeedStore } = useStore();
  const navigate = useNavigate();

//   const imageUrl =
//     group.images && group.images.length > 0
//       ? group.images[0]
//       : "https://via.placeholder.com/300x200";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localGuidesFeedStore.setLocalGuideToViewId?.(localGuide.id);
    navigate(`/local-guides/${localGuide.slug}`);
  };

  const SimilarLabel = () => {
    if (!howSimilar) return null;

    const label = HOW_SIMILAR_LABEL_MAP[howSimilar];
    return (
      <TagOrLabel
        className="absolute bottom-1 right-0 m-0"
        color={label.color as any}
        size="sm"
      >
        {label.text}
      </TagOrLabel>
    );
  };


  return (
    <a
      data-testid={testId ?? "localguidecard"}
      href={`/local-guides/${localGuide.slug}`}
      onClick={handleClick}
      className={`block transition-transform duration-200 hover:scale-[1.02] ${classNames ?? ""}`}
    >
      <div className="flex h-full w-fit flex-col justify-around rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="relative flex items-center justify-center p-1">
          <OptimizedPostImage
            src={""}
            alt={localGuide.name}
            classNames="rounded-md object-cover"
          />
          {howSimilar && <SimilarLabel />}
        </div>

        {/* Content */}
        <div className="p-2 pt-0">
          <h3 
            data-testid="localguidecardname"
            className="line-clamp-2 max-w-[180px] text-sm font-medium leading-tight sm:text-base"
          >
            {localGuide.name}
          </h3>
          <p className="text-sm text-gray-500">
            {(localGuide.hostedCities ?? []).map(c => `${c.city}, ${c.country}`).join(', ')}
          </p>
          {showDistance && (
            <p className="text-xs text-gray-400 mt-1">
              {localGuide.distanceKm.toFixed(1)} km away
            </p>
          )}
        </div>
      </div>
    </a>
  );
});
