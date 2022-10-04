import styles from "./Projects.module.css";

export function ProjectModal({
  text,
  onChange,
  projectName,
  inputRef,
  confirmAdd,
  cancelAdd,
}) {
  return (
    <div className={styles.modal}>
      <form className={styles.form}>
        <label htmlFor="inputText">Название</label>
        <input
          id="inputText"
          onChange={onChange}
          value={projectName}
          className={styles.input}
          maxLength={50}
          ref={inputRef}
        />
        <div className={styles.formButtons}>
          <button className={styles.confirm} onClick={confirmAdd}>
            Добавить
          </button>
          <button className={styles.cancel} onClick={cancelAdd}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
