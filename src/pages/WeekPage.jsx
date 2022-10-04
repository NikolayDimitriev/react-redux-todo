import { Week } from "../components/Week/Week";
import styles from "./Page.module.css";

export function WeekPage() {
  return (
    <div className={styles.taskBoard}>
      <h2 className={styles.title}>Список задач на неделю</h2>
      <Week />
    </div>
  );
}
