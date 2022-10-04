import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
import cn from "classnames";
import { FaChevronDown } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ProjectModal } from "./ProjectsModal";
import { updateUser } from "../../redux/user/action";
import styles from "./Projects.module.css";

export function Projects() {
  const navigate = useNavigate();
  const db = getDatabase();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const todos = useSelector((state) => state.todos);
  const inputRef = useRef();
  const [openProjects, setOpenProjects] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const unfurlButtonClick = () => {
    setOpenProjects(!openProjects);
  };
  const deleteButtonClick = (projectId) => {
    // TODO: окно подтверждения
    if (todos) {
      todos.forEach((todo) => {
        if (todo.projectId === projectId) {
          set(ref(db, `todos/${user.id}/${todo.id}`), null);
        }
      });
    }
    navigate("/app");

    set(ref(db, `users/${user.id}/`), {
      ...user,
      commonProjects: JSON.stringify(user.commonProjects),
      countProjects: user.countProjects - 1,
    });

    dispatch(
      updateUser({
        countProjects: user.countProjects - 1,
      })
    );

    set(ref(db, `projects/${user.id}/${projectId}`), null);
  };
  const addButtonClick = () => {
    // TODO: достигнут лимит нельзя больше добавить
    setOpenModal(true);
  };
  const changeInput = (e) => {
    setProjectName(e.target.value);
    inputRef.current.classList.remove(styles.inputInvalid);
  };
  const confirmAdd = (e) => {
    e.preventDefault();
    if (projectName === "") {
      inputRef.current.classList.add(styles.inputInvalid);
      return;
    }
    setProjectName("");
    setOpenModal(false);
    const id = Date.now();
    set(ref(db, `projects/${user.id}/${id}`), {
      id,
      title: projectName,
      commonProjects: false,
    });
    // ! Связано с общим доступом
    // set(ref(db, `users/${user.id}/`), {
    //   ...user,
    //   commonProjects: JSON.stringify(user.commonProjects),
    //   countProjects: user.countProjects + 1,
    // });
    // dispatch(
    //   updateUser({
    //     countProjects: user.countProjects + 1,
    //   })
    // );
  };
  const cancelAdd = (e) => {
    e.preventDefault();
    setProjectName("");
    setOpenModal(false);
  };

  return (
    <div className={styles.projects}>
      <div className={styles.projectsHeader}>
        <button className={styles.projectsButton} onClick={unfurlButtonClick}>
          <span
            className={
              openProjects
                ? styles.projectsIcon
                : cn(styles.projectsIcon, styles.projectIconActive)
            }
          >
            <FaChevronDown />
          </span>
          <span className={styles.title}>Проекты</span>
        </button>
        <button className={styles.projectsAdd} onClick={addButtonClick}>
          +
        </button>
      </div>
      {openModal && (
        <ProjectModal
          onChange={changeInput}
          projectName={projectName}
          inputRef={inputRef}
          confirmAdd={confirmAdd}
          cancelAdd={cancelAdd}
        />
      )}
      {openProjects && (
        <ul className={styles.list}>
          {projects &&
            projects.map((project) => (
              <div className={styles.listItem} key={project.id}>
                <Link to={`project/${project.id}`} className={styles.itemName}>
                  <span className={styles.itemIcon} />
                  <span className={styles.itemText}>{project.title}</span>
                </Link>
                <button
                  className={styles.itemDelete}
                  onClick={() => deleteButtonClick(project.id)}
                >
                  <AiFillDelete />
                </button>
              </div>
            ))}
        </ul>
      )}
    </div>
  );
}
