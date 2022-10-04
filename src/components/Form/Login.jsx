import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/user/action";
import { Form } from "./Form";

export function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleLogin = (e, email, password) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Авторизовался, записываю в БД пользователя + данные в стейт
        const { email, uid, displayName, photoURL } = userCredential.user;

        dispatch(
          setUser({
            id: uid,
            email,
            name: displayName || email,
            photoURL,
          })
        );
        navigate("/app");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          setError("Неверный пароль.");
        } else if (errorCode === "auth/user-not-found") {
          setError("Пользователь не найден.");
        } else {
          setError(errorCode);
        }
      });
  };

  return <Form title="Войти" handleClick={handleLogin} error={error} />;
}
