import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { BiExit } from "react-icons/bi";
import { Profile } from "../Profile/Profile";
import { Schedule } from "../Schedule/Schedule";
import { Projects } from "../Projects/Projects";
import { removeUser } from "../../redux/user/action";
import styles from "./Sidebar.module.css";
import logo from "./assets/logo.svg";

export function Sidebar() {
  const dispatch = useDispatch();
  const logOutClick = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <section className={styles.sidebar}>
      <img src={logo} alt="логотип" className={styles.logo} />
      <div className={styles.sidebarUp}>
        <Profile />
        <Schedule />
        <Projects />
      </div>
      <button className={styles.login} onClick={logOutClick}>
        <span className={styles.loginIcon}>
          <BiExit />
        </span>
        <span className={styles.loginText}>Выйти</span>
      </button>
    </section>
  );
}
