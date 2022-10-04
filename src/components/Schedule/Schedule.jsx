import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Schedule.module.css";

export function Schedule() {
  return (
    <ul className={styles.list}>
      <Link to="today" className={styles.list__item}>
        <div className={cn(styles.icon, styles.iconOne)} />
        <span>Сегодня</span>
      </Link>
      <Link to="tomorrow" className={styles.list__item}>
        <div className={cn(styles.icon, styles.iconTwo)} />
        <span>Завтра</span>
      </Link>
      <Link to="week" className={styles.list__item}>
        <div className={cn(styles.icon, styles.iconThree)} />
        <span>Неделя</span>
      </Link>
    </ul>
  );
}
