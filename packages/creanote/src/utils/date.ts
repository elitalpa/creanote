import { getISOWeek } from "date-fns";

export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}
