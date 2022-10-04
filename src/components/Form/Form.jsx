import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { setUser } from "../../redux/user/action";
import googleIcon from "./assets/google-icons.png";
import { validateEmail } from "../../utils/validateEmail";

import styles from "./Form.module.css";

export function Form({ title, handleClick, error }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passError, setPassError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Некорректный Email");
    } else {
      setEmailError(null);
    }
  };

  const handlePass = (e) => {
    setPass(e.target.value);

    if (e.target.value.length < 6) {
      setPassError("Пароль должен состоять минимум из 6 символов");
    } else {
      setPassError(null);
    }
  };

  const googleAuth = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const { uid, email, displayName, photoURL } = result.user;
        const db = getDatabase();
        const dbRef = ref(db, `users/${uid}`);
        onValue(dbRef, (snapshot) => {
          if (!snapshot.exists()) {
            // если первая авторизация, записываю данные в БД
            set(ref(db, `users/${uid}`), {
              email,
              commonProjects: "[]",
              countProjects: 0,
            });
          }
        });

        dispatch(
          setUser({
            id: uid,
            email,
            name: displayName,
            photoURL,
          })
        );
        navigate("/app");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <form className={styles.form}>
      <span className={styles.title}>{title}</span>
      <div className={styles.error}>{error}</div>
      <input
        type="email"
        value={email}
        onChange={handleEmail}
        placeholder="Email"
        className={
          emailError ? cn(styles.input, styles.inputInvalid) : styles.input
        }
      />
      <div className={styles.error}>{emailError || ""}</div>
      <input
        type="password"
        value={pass}
        onChange={handlePass}
        placeholder="Password"
        className={
          passError ? cn(styles.input, styles.inputInvalid) : styles.input
        }
      />
      <div className={styles.error}>{passError || ""}</div>
      <button
        disabled={emailError || passError}
        className={styles.button}
        onClick={(e) => handleClick(e, email, pass)}
      >
        {title}
      </button>
      <button type="button" className={styles.googleLogin} onClick={googleAuth}>
        <img src={googleIcon} alt="google icon" className={styles.googleIcon} />
        <span>войти с помощью Google</span>
      </button>
    </form>
  );
}
