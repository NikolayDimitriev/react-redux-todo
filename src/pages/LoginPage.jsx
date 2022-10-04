import { Link } from "react-router-dom";
import { Login } from "../components/Form/Login";
import styles from "./Page.module.css";

export function LoginPage() {
  return (
    <div className={styles.auth}>
      <div className={styles.center}>
        <Login />
        <div>
          Или <Link to="/register">зарегистрируйтесь</Link>
        </div>
      </div>
    </div>
  );
}
