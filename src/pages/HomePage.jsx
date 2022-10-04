import styles from "./Page.module.css";

export function HomePage() {
  return (
    <div className={styles.taskBoard}>
      <h2 className={styles.title}>Добро пожаловать!</h2>
    </div>
  );
}
