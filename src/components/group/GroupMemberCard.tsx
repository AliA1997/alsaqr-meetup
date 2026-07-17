import { OptimizedImage } from "@common/Image";
import { TagOrLabel } from "@common/Titles";
import type { EventMember } from "@models/event";
import type { GroupMember } from "@models/group";
import { ALSAQR_PROFILE_BASE } from "@utils/constants";
import { observer } from "mobx-react-lite";

// Group and event rosters render the same card; the DTOs differ only in which
// organizer flag they carry.
export type MemberCardRecord = GroupMember | EventMember;

interface GroupMemberCardProps {
  member: MemberCardRecord;
  classNames?: string;
  testId?: string;
}

export default observer(function GroupMemberCard({
  member,
  classNames,
  testId,
}: GroupMemberCardProps) {
  // Members whose account was removed come back without a username; there is no
  // profile to open for them, so the card renders as plain, non-clickable markup.
  const profileUrl = member.username
    ? `${ALSAQR_PROFILE_BASE}/${member.username}`
    : undefined;

  const isOrganizer =
    "isGroupOrganizer" in member ? member.isGroupOrganizer : member.isEventOrganizer;

  const content = (
    <div className="flex h-full w-fit flex-col items-center justify-around rounded-lg border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="relative flex items-center justify-center p-1">
        <OptimizedImage
          src={member.avatar ?? ""}
          alt={member.username ?? "Group member"}
          classNames="h-16 w-16 rounded-full object-cover"
          loadedHeight={64}
          loadedWidth={64}
        />
      </div>

      <h3
        data-testid="groupmembercardname"
        className="line-clamp-1 max-w-[140px] text-center text-sm font-medium leading-tight sm:text-base dark:text-gray-50"
      >
        {member.username ?? "Former member"}
      </h3>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
        {member.isLocalGuide && (
          <TagOrLabel color="gold" size="sm" rounded>
            Local Guide
          </TagOrLabel>
        )}
        {isOrganizer && (
          <TagOrLabel color="primary" size="sm" rounded>
            Organizer
          </TagOrLabel>
        )}
      </div>
    </div>
  );

  if (!profileUrl)
    return (
      <div data-testid={testId ?? "groupmembercard"} className={classNames}>
        {content}
      </div>
    );

  return (
    <a
      data-testid={testId ?? "groupmembercard"}
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block transition-transform duration-200 hover:scale-[1.02] ${classNames ?? ""}`}
    >
      {content}
    </a>
  );
});
