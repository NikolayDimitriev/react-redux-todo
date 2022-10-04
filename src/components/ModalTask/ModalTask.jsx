import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";
import { toLocaleFormat } from "../../utils/date";
import { CommentBlock } from "../CommentsBlock/CommentsBlock";
import styles from "./ModalTask.module.css";

export function ModalTask({ setOpenModal, item, deadline, projectId, board }) {
  const user = useSelector((state) => state.user);
  const dateNow = new Date();
  const dateAfterMonth = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth() + 2,
    dateNow.getDate()
  );

  const titleTaskInput = useRef();
  const deadlineTaskInput = useRef();
  const [newDeadline, setNewDeadline] = useState(
    deadline || toLocaleFormat(dateNow)
  );
  const [titleTask, setTitleTask] = useState(item ? item.title : "");
  const [description, setDescription] = useState(item ? item.description : "");
  const [commentText, setCommentText] = useState("");

  const titleTaskChange = (e) => {
    setTitleTask(e.target.value);
    titleTaskInput.current.classList.remove(styles.invalidInput);
  };

  const descriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const deadlineChange = (e) => {
    setNewDeadline(e.target.value);
    deadlineTaskInput.current.classList.remove(styles.invalidInput);
  };

  const closeModal = (e) => {
    if (
      e.target.classList.contains(styles.overlay) ||
      e.target.classList.contains(styles.cancel)
    ) {
      setOpenModal(false);
    }
  };

  const saveChanges = () => {
    const db = getDatabase();
    let isDataInvalid = false;
    if (titleTask === "") {
      titleTaskInput.current.classList.add(styles.invalidInput);
      isDataInvalid = true;
    }
    if (newDeadline === "" || newDeadline < toLocaleFormat(dateNow)) {
      deadlineTaskInput.current.classList.add(styles.invalidInput);
      isDataInvalid = true;
    }

    if (isDataInvalid) {
      return;
    }

    if (item) {
      // редактирование
      const postData = {
        ...item,
        title: titleTask,
        description,
        deadline: newDeadline,
      };
      set(ref(db, `todos/${user.id}/${item.id}`), postData);
    } else {
      const id = Date.now();
      set(ref(db, `todos/${user.id}/${id}`), {
        id,
        title: titleTask,
        description,
        deadline: newDeadline,
        done: board ? board.done : false,
        inProgress: board ? board.inProgress : false,
        projectId: +projectId || "null",
        comments: "[]",
        inCommonProject: false,
      });
    }
    setOpenModal(false);
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.content}>
        <input
          className={styles.title}
          placeholder="Название"
          value={titleTask}
          onChange={titleTaskChange}
          ref={titleTaskInput}
        />
        <textarea
          className={styles.description}
          placeholder="Описание"
          maxLength={300}
          value={description}
          onChange={descriptionChange}
        />
        <input
          type="date"
          value={newDeadline}
          min={toLocaleFormat(dateNow)}
          max={toLocaleFormat(dateAfterMonth)}
          className={styles.deadline}
          onChange={deadlineChange}
          ref={deadlineTaskInput}
        />
        {item && (
          <CommentBlock
            item={item}
            comments={item ? item.comments : []}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        )}

        <div className={styles.buttons}>
          <button className={styles.confirm} onClick={saveChanges}>
            Сохранить
          </button>
          <button className={styles.cancel} onClick={closeModal}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
