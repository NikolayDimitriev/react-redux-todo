import { useState } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import cn from "classnames";
import { getDatabase, ref, set } from "firebase/database";

import { ModalTask } from "../ModalTask/ModalTask";

import styles from "./TaskItem.module.css";

export function TaskItem({ item }) {
  const [openModal, setOpenModal] = useState(false); // модальное окно, что бы редактировать задачи
  const user = useSelector((state) => state.user);
  const db = getDatabase();

  const handleModal = () => {
    setOpenModal(true);
  };
  const handleDone = () => {
    const postData = {
      ...item,
      done: !item.done,
    };
    set(ref(db, `todos/${user.id}/${item.id}`), postData);
  };
  const deleteTodo = () => {
    // ! сделать проверку на то что задача в общем проекте
    set(ref(db, `todos/${user.id}/${item.id}`), null);
  };
  return (
    <>
      <div className={styles.task}>
        <div
          className={
            item.done ? cn(styles.handleDone, styles.done) : styles.handleDone
          }
          onClick={handleDone}
        />
        <div className={styles.text} onClick={handleModal}>
          {item.title}
        </div>
        <div className={styles.buttons}>
          <span
            className={cn(styles.buttonEdit, styles.button)}
            onClick={handleModal}
          >
            <AiOutlineEdit />
          </span>
          <span
            className={cn(styles.buttonDelete, styles.button)}
            onClick={deleteTodo}
          >
            <RiDeleteBin6Line />
          </span>
        </div>
      </div>
      {openModal && (
        <ModalTask
          setOpenModal={setOpenModal}
          item={item}
          deadline={item.deadline}
        />
      )}
    </>
  );
}
