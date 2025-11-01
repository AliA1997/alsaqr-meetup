import { OptimizedPostImage } from "@common/Image";
import type { LocalGuideDetailsRecord } from "@models/localGuide";
import { useMemo } from "react";

export default function LocalGuideDetailsCard({
  localGuide
}: {
  localGuide: LocalGuideDetailsRecord
}) {
  const userInfo = useMemo(() => localGuide.userInfo, [localGuide]);
  
  return (
    <div className="flex flex-col">
      <section className="flex w-full flex-col py-4">
        {/* Header with name and basic info */}
        <div className="flex w-full flex-col space-y-4 px-4 py-2 lg:px-12">
          <div className="relative flex items-center justify-center p-1">
            <OptimizedPostImage
              src={userInfo.avatar}
              alt={localGuide.name}
              classNames="rounded-md object-cover  h-[12.5rem] w-[12.5rem]"
            />
          </div>
          <h3 className="text-xl font-bold md:text-4xl">{localGuide.name}</h3>
          
          {/* Contact Information */}
          {(userInfo.email || userInfo.phone) && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
              {userInfo.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {userInfo.email}
                </p>
              )}
              {userInfo.phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {userInfo.phone}
                </p>
              )}
            </div>
          )}

          {/* Bio/Description */}
          {userInfo.bio && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-700">About</h2>
              <p className="text-gray-600 leading-relaxed">{userInfo.bio}</p>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Location</h2>
            {(localGuide.hostedCities ?? []).map((hc: any, hcIdx: number) => (
              <p key={hcIdx} className="text-gray-600">{hc.city}, {hc.country}</p>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}