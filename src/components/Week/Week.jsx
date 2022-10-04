import { useState } from "react";
import cn from "classnames";
import { getWeekDate } from "../../utils/getWeekDate";
import { ListTask } from "../ListTask/ListTask";

import styles from "./Week.module.css";

export function Week() {
  const week = getWeekDate(7);
  const [currentItem, setCurrentItem] = useState(0);
  const [deadline, setDeadline] = useState(week[0].fullDate);

  const buttonHandler = (index, date) => {
    setCurrentItem(index);
    setDeadline(date);
  };

  return (
    <>
      <div className={styles.calendar}>
        {week.map((btn, index) => (
          <button
            key={btn.id}
            type="button"
            className={
              currentItem === index
                ? cn(styles.calendarDay, styles.activeDay)
                : styles.calendarDay
            }
            onClick={() => buttonHandler(index, btn.fullDate)}
          >
            <span>{btn.day}</span>
            <span>{btn.date}</span>
          </button>
        ))}
      </div>
      <ListTask deadline={deadline} />
    </>
  );
}
