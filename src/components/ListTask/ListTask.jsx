import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TaskItem } from "../TaskItem/TaskItem";
import { ModalTask } from "../ModalTask/ModalTask";
import { ButtonAdd } from "../ButtonAdd/ButtonAdd";
import styles from "./ListTask.module.css";

export function ListTask({ deadline, items, projectId }) {
  const [openModal, setOpenModal] = useState(false); // модальное окно, чтобы добавлять новую задачу
  const todos = useSelector((state) => state.todos);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (deadline) {
      if (todos && todos.length > 0) {
        const newTasks = todos.filter((todo) => todo.deadline === deadline);
        setTasks(newTasks);
      }
    } else if (items) {
      setTasks(items);
    }
  }, [deadline, items, todos]);

  const handleClick = () => {
    setOpenModal(true);
  };

  return (
    <div className={styles.board}>
      {tasks.map((task) => (
        <TaskItem key={task.id} item={task} />
      ))}
      <ButtonAdd text="Добавить задачу" handleClick={handleClick} />
      {openModal && (
        <ModalTask
          setOpenModal={setOpenModal}
          deadline={deadline}
          projectId={projectId}
        />
      )}
    </div>
  );
}
