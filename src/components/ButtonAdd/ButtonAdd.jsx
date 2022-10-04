import styles from "./ButtonAdd.module.css";

export function ButtonAdd({ text, handleClick }) {
  return (
    <button className={styles.button} onClick={handleClick}>
      <span className={styles.plus}>+</span>
      <span className={styles.text}>{text}</span>
    </button>
  );
}
