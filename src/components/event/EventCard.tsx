import { OptimizedPostImage } from "@common/Image";
import { TagOrLabel } from "@common/Titles";
import { HowSimilarKeys } from "@models/enums";
import type { EventRecord } from "@models/event";
import { useStore } from "@stores/index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";

interface EventCardProps {
  event: EventRecord;
  howSimilar?: HowSimilarKeys;
  classNames?: string;
  showDistance?: boolean;
}

export default observer(function EventCard({
  event,
  howSimilar,
  classNames,
  showDistance,
}: EventCardProps) {
  const { eventsFeedStore } = useStore();
  const navigate = useNavigate();

  const imageUrl =
    event.images && event.images.length > 0
      ? event.images[0]
      : "https://via.placeholder.com/300x200";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    eventsFeedStore?.setEventToViewId?.(event.id);
    navigate(`/events/${event.id}`);
  };

  const SimilarLabel = () => {
    if (!howSimilar) return null;

    const labelMap = {
      [HowSimilarKeys.NotSimilar]: { text: "Not a Match", color: "danger" },
      [HowSimilarKeys.KindaSimilar]: { text: "Ok Match", color: "info" },
      [HowSimilarKeys.MostSimilar]: { text: "Good Match", color: "success" },
    };

    const label = labelMap[howSimilar];
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

  const hostedCities =
    event.citiesHosted && event.citiesHosted.length > 0
      ? event.citiesHosted.map((c: any) => c.name).join(", ")
      : "Online";

  return (
    <a
      href={`/events/${event.id}`}
      onClick={handleClick}
      className={`block transition-transform duration-200 hover:scale-[1.02] ${classNames ?? ""}`}
    >
      <div className="flex h-full w-fit flex-col justify-around rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="relative flex items-center justify-center p-1">
          <OptimizedPostImage
            src={imageUrl}
            alt={event.name}
            classNames="rounded-md object-cover"
          />
          {howSimilar && <SimilarLabel />}
        </div>

        {/* Content */}
        <div className="p-2 pt-0">
          <h3 className="line-clamp-2 max-w-[180px] text-sm font-medium leading-tight sm:text-base">
            {event.name}
          </h3>
          <p className="text-sm text-gray-500">{hostedCities}</p>
          <p className="text-xs text-gray-400 mt-1">
            Hosted by {event.groupName}
          </p>
          {showDistance && (
            <p className="text-xs text-gray-400 mt-1">
              {event.distanceKm.toFixed(1)} km away
            </p>
          )}
        </div>
      </div>
    </a>
  );
});
