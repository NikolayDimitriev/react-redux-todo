import { useSelector } from "react-redux";
import { DnDBoard } from "../components/DnDBoard/DnDBoard";

import styles from "./Page.module.css";

export function TodayPage() {
  return (
    <div className={styles.dndBoard}>
      <h2 className={styles.title}>Список задач на сегодня</h2>
      <DnDBoard />
    </div>
  );
}
