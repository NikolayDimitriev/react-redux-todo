import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { ModalTask } from "../ModalTask/ModalTask";
import styles from "./DnDBoard.module.css";

export function DnDItem({
  board,
  item,
  projectId,
  dragOverHandler,
  dragLeaveHandler,
  dragStartHandler,
  dragEndHandler,
  dragHandler,
  dateToday,
  deleteTodo,
}) {
  const [openModal, setOpenModal] = useState(false);
  const projects = useSelector((state) => state.projects);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projects) {
      setProject(projects.filter((project) => project.id === projectId)[0]);
    }
  }, [projects]);

  const handleModal = (e) => {
    const elemClassList = e.target.classList;
    if (
      elemClassList.contains(styles.todo) ||
      elemClassList.contains(styles.todoText) ||
      elemClassList.contains(styles.todoHeader)
    ) {
      setOpenModal(true);
    }
  };

  return (
    <>
      <div
        draggable
        onDragOver={(e) => dragOverHandler(e)}
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragStart={(e) => dragStartHandler(e, board, item)}
        onDragEnd={(e) => dragEndHandler(e)}
        onDrop={(e) => dragHandler(e, board, item)}
        onClick={handleModal}
        className={styles.todo}
      >
        {project && <div className={styles.todoHeader}>[{project.title}]</div>}
        <div className={styles.todoText}>{item.title}</div>
        <div className={styles.todoBtn} onClick={() => deleteTodo(item)}>
          <AiFillDelete />
        </div>
      </div>
      {openModal && (
        <ModalTask
          setOpenModal={setOpenModal}
          item={item}
          deadline={dateToday}
        />
      )}
    </>
  );
}
