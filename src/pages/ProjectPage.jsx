import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDatabase, ref, child, get, set, onValue } from "firebase/database";
import { AiOutlineUserAdd } from "react-icons/ai";
import { ListTask } from "../components/ListTask/ListTask";
import { validateEmail } from "../utils/validateEmail";
import styles from "./Page.module.css";
import buttonSubmit from "./assets/buttonSubmit.svg";
import { addTodos } from "../redux/todos/actions";
import { addProject } from "../redux/projects/actions";

export function ProjectPage() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);
  const projects = useSelector((state) => state.projects);
  const currentUser = useSelector((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState("");
  const [openForm, setOpenForm] = useState("");
  const inputRef = useRef();
  const db = getDatabase();

  useEffect(() => {
    if (todos) {
      const newTodos = todos.filter((todo) => todo.projectId === +projectId);
      setTasks(newTodos);
    }
  }, [todos, projectId]);

  let project = { title: "" };
  if (projects) {
    project = projects.filter((project) => project.id === +projectId)[0];
  }

  const handleOpen = () => {
    setOpenForm(true);
  };

  const handleEmail = (e) => {
    inputRef.current.classList.remove(styles.inputInvalid);
    setEmail(e.target.value);
  };

  const submitAddUser = (e) => {
    // ! Описываю логику
    // * Проверка валидности введного email
    // * Запрос к БД -> ответ список пользователей
    // * Ищешь совпадение email пользователей и введеного
    // * Если есть: берем уник.id приглашаемого пользователя, создаем массив со списком всех id общих проектов
    // * В БД у приглашенного создается поле, со списком id общих проектов
    // * Создаю общий проект, записываю в него список todos, title
    // * Записываю в БД
    // TODO: при добавление, дублируется все
    e.preventDefault();
    if (validateEmail(email)) {
      const dbRef = ref(db);
      get(child(dbRef, `users`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const usersId = Object.keys(snapshot.val());
            const users = Object.values(snapshot.val());
            users.forEach((user, index) => {
              if (user.email === email) {
                const guestUserId = usersId[index];
                const commonProjectsIds = JSON.parse(user.commonProjects);
                commonProjectsIds.push(projectId);
                // ! приглашенному юзеру дали id проекта
                set(
                  ref(db, `users/${guestUserId}/commonProjects/`),
                  JSON.stringify(commonProjectsIds)
                );
                // ! себе дали id проекта
                set(
                  ref(db, `users/${currentUser.id}/commonProjects/`),
                  JSON.stringify(commonProjectsIds)
                );
                // ! скопипастили в задачи из этого проекта в новый
                let todosProject = [];
                if (todos) {
                  todosProject = todos.filter((todo) => {
                    if (todo.projectId !== +projectId) {
                      // eslint-disable-next-line no-param-reassign
                      todo.inCommonProject = true;
                      return true;
                    }
                    return false;
                  });
                }
                const postData = {
                  id: projectId,
                  title: project.title,
                  todos: JSON.stringify(todosProject),
                  commonProjects: true,
                };
                set(ref(db, `commonProjects/${projectId}/`), postData);
                // ! удаление всех задач связанных с этим проектом и смена значение переменной commonProject в true
                todosProject.forEach((todo) => {
                  set(ref(db, `todos/${currentUser.id}/${todo.id}`), null);
                });
                const updateProject = {
                  id: projectId,
                  title: project.title,
                  commonProjects: true,
                };
                set(
                  ref(db, `projects/${currentUser.id}/${projectId}/`),
                  updateProject
                );
              } else {
                // нет такого пользователя
                console.error("Нет такого пользователя");
              }
            });
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setEmail("");
    } else {
      inputRef.current.classList.add(styles.inputInvalid);
    }
  };

  return (
    <div className={styles.taskBoard}>
      <div className={styles.projectHeader}>
        <h2 className={styles.projectTitle}>{project ? project.title : ""}</h2>
        {/* <button className={styles.commonBtn} onClick={handleOpen}>
          <span className={styles.commonBtnIcon}>
            <AiOutlineUserAdd />
          </span>
          <span>Общий доступ</span>
        </button> */}
        {openForm && (
          <form className={styles.form}>
            <input
              type="email"
              className={styles.formInput}
              placeholder="Email"
              value={email}
              onChange={handleEmail}
              ref={inputRef}
            />
            <button className={styles.buttonSubmit} onClick={submitAddUser}>
              <img src={buttonSubmit} alt="иконка отправить" />
            </button>
          </form>
        )}
      </div>
      <ListTask items={tasks} projectId={projectId} />
    </div>
  );
}
