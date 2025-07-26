import { getISOWeek } from "date-fns";

export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}
// export function getWeekNumber(date: Date): number {
//   const weekday = {
//     sunday: 0,
//     monday: 1,
//     tuesday: 2,
//     wednesday: 3,
//     thursday: 4,
//     friday: 5,
//     saturday: 6,
//   };

//   // get current week thursday
//   const day = (date.getDay() + 6) % 7;
//   const thursday = new Date(date);
//   thursday.setDate(date.getDate() - day + (7 - weekday.thursday));

//   // get first thursday of the year
//   const firstThursday = new Date(thursday.getFullYear(), 0, 1);
//   if (firstThursday.getDay() !== weekday.thursday) {
//     firstThursday.setMonth(
//       0,
//       1 + ((weekday.thursday + 7 - firstThursday.getDay()) % 7)
//     );
//   }

//   // calculate the number of weeks between
//   const diff = Number(thursday) - Number(firstThursday);
//   const oneDay = 1000 * 60 * 60 * 24;
//   const oneWeek = oneDay * 7;

//   const weekNum = 1 + Math.floor(diff / oneWeek);

//   return weekNum;
// }
