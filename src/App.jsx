import { Route, Routes, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./components/Hooks/useAuth";

import { Sidebar } from "./components/Sidebar/Sidebar";
import { TodayPage } from "./pages/TodayPage";
import { TomorrowPage } from "./pages/TomorrowPage";
import { WeekPage } from "./pages/WeekPage";
import { ProjectPage } from "./pages/ProjectPage";
import { HomePage } from "./pages/HomePage";

import {
  loadTodosAction,
  addTodos,
  loadTodosSuccess,
  loadTodosFailureAction,
} from "./redux/todos/actions";
import {
  loadProjectsSuccess,
  loadProjectsAction,
  loadProjectsFailureAction,
  addProject,
} from "./redux/projects/actions";

import { updateUser } from "./redux/user/action";

import styles from "./App.module.css";

export function App() {
  const user = useSelector((state) => state.user);
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else {
      // обновления стейта
      const dfRefUser = ref(db, `users/${user.id}/`);
      onValue(dfRefUser, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const updateData = {
            commonProjects: JSON.parse(data.commonProjects),
            countProjects: data.countProjects,
          };
          dispatch(updateUser(updateData));
        }
      });
    }
  }, [isAuth]);

  useEffect(() => {
    if (user) {
      // ! загрузка задач пользователя
      dispatch(loadTodosAction());

      const dbRef = ref(db, `todos/${user.id}/`);
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          dispatch(loadTodosSuccess(data));
        } else {
          dispatch(loadTodosFailureAction());
        }
      });

      // ! загрузка проектов пользователя

      dispatch(loadProjectsAction());
      const dfRefProject = ref(db, `projects/${user.id}/`);
      onValue(dfRefProject, (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          const ownProjects = data.filter(
            (project) => project.commonProjects === false
          );
          dispatch(loadProjectsSuccess(ownProjects));
        } else {
          dispatch(loadProjectsFailureAction());
        }
      });

      // ! если есть пользователь, у него есть поле с общими проектами и она не пустое
      if (user.commonProjects && user.commonProjects.length > 0) {
        const arrayProjectsId = user.commonProjects;
        arrayProjectsId.forEach((projectId) => {
          const dfRefComProject = ref(db, `commonProjects/${projectId}/`);
          onValue(dfRefComProject, (snapshot) => {
            if (snapshot.exists()) {
              const { id, title, todos, commonProjects } = snapshot.val();
              const newProject = {
                id: +id,
                title,
                commonProjects,
              };
              const newTodos = JSON.parse(todos);

              dispatch(addTodos(newTodos));
              dispatch(addProject(newProject));
            }
          });
        });
      }
    }
  }, [user]);

  return (
    <div className={styles.pages}>
      <Sidebar />
      <main className={styles.content}>
        <Routes>
          <Route path="today" element={<TodayPage />} />
          <Route path="tomorrow" element={<TomorrowPage />} />
          <Route path="week" element={<WeekPage />} />
          <Route path="project/:projectId" element={<ProjectPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}
