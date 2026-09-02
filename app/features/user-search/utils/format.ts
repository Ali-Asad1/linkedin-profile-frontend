import type { Education, Experience, User } from "../types/search.types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** "2019-10" -> "Oct 2019"; returns the raw string when unparseable. */
export function formatMonthYear(value: string): string {
  const match = /^(\d{4})-(\d{1,2})$/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  const monthIndex = Number(month) - 1;
  const monthName = MONTHS[monthIndex] ?? "";
  return monthName ? `${monthName} ${year}` : year;
}

/** Formats an experience period, e.g. "Oct 2019 – Apr 2023" or "Oct 2019 – Present". */
export function formatExperiencePeriod(experience: Experience): string {
  const start = formatMonthYear(experience.startDate);
  const end = experience.isCurrent || !experience.endDate ? "Present" : formatMonthYear(experience.endDate);
  return `${start} – ${end}`;
}

/** Picks the current experience, or the most recent one, for compact display. */
export function pickPrimaryExperience(user: User): Experience | undefined {
  if (user.experiences.length === 0) return undefined;
  const current = user.experiences.find((e) => e.isCurrent);
  if (current) return current;
  return [...user.experiences].sort((a, b) =>
    (b.startDate ?? "").localeCompare(a.startDate ?? ""),
  )[0];
}

/** Picks the most recent education for compact display. */
export function pickPrimaryEducation(user: User): Education | undefined {
  if (user.educations.length === 0) return undefined;
  return [...user.educations].sort((a, b) => (b.endDate ?? 0) - (a.endDate ?? 0))[0];
}

/** Formats an education line, e.g. "Computer Engineering, University of Tehran (2016)". */
export function formatEducation(education: Education): string {
  const parts = [education.degree, education.school].filter(Boolean);
  if (education.endDate) parts.push(String(education.endDate));
  return parts.join(" · ");
}

/** Initials for the avatar fallback, e.g. "Ali Asad" -> "AA". */
export function getInitials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
