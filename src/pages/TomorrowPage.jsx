import { ListTask } from "../components/ListTask/ListTask";
import { getWeekDate } from "../utils/getWeekDate";
import styles from "./Page.module.css";

export function TomorrowPage() {
  const day = getWeekDate(2);
  const deadline = day[1].fullDate;
  return (
    <div className={styles.taskBoard}>
      <h2 className={styles.title}>Задачи на завтра - {deadline}</h2>
      <ListTask deadline={deadline} />
    </div>
  );
}
