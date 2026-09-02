import { BriefcaseIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import type { User } from "../types/search.types";
import {
  formatEducation,
  formatExperiencePeriod,
  getInitials,
  pickPrimaryEducation,
  pickPrimaryExperience,
} from "../utils/format";

const MAX_SKILLS = 5;

export function UserCard({ user }: { user: User }) {
  const experience = pickPrimaryExperience(user);
  const education = pickPrimaryEducation(user);
  const visibleSkills = user.skills.slice(0, MAX_SKILLS);
  const remainingSkills = user.skills.length - visibleSkills.length;

  return (
    <article className="rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-accent/40">
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback aria-hidden="true">{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold leading-tight">{user.fullName}</h3>
          <p className="mt-0.5 truncate text-sm text-foreground/90">{user.headline}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
            <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
            <span className="truncate">{user.locationName}</span>
            {user.currentCompanyName && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate">{user.currentCompanyName}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {user.skills.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills">
          {visibleSkills.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary">{skill}</Badge>
            </li>
          ))}
          {remainingSkills > 0 && (
            <li>
              <Badge variant="outline">+{remainingSkills} more</Badge>
            </li>
          )}
        </ul>
      )}

      {(experience || education) && (
        <div className="mt-3 space-y-1.5 border-t pt-3 text-sm text-muted-foreground">
          {experience && (
            <p className="flex items-start gap-2">
              <BriefcaseIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span>
                <span className="font-medium text-foreground">{experience.title}</span>
                {experience.company && <span> · {experience.company}</span>}
                <span className="text-xs"> — {formatExperiencePeriod(experience)}</span>
              </span>
            </p>
          )}
          {education && (
            <p className="flex items-start gap-2">
              <GraduationCapIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
              <span className="truncate">{formatEducation(education)}</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
