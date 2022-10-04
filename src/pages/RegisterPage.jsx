import { Link } from "react-router-dom";
import { SignUp } from "../components/Form/SignUp";
import styles from "./Page.module.css";

export function RegisterPage() {
  return (
    <div className={styles.auth}>
      <div className={styles.center}>
        <SignUp />
        <p>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
