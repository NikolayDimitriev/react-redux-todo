import { toLocaleFormat } from "./date";

export const getWeekDate = (countDays = 1) => {
  const now = new Date();
  const day = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  const week = [];
  for (let i = 0; i < countDays; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    week.push({
      id: i,
      date: date.getDate(),
      day: day[date.getDay()],
      fullDate: toLocaleFormat(date),
    });
  }

  return week;
};
