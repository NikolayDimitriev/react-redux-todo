import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form } from "./Form";
import { setUser } from "../../redux/user/action";

export function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleRegister = (e, email, password) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Зарегистрировался, записал данные в БД + в стейт
        const { email, uid, displayName, photoURL } = userCredential.user;
        const db = getDatabase();
        set(ref(db, `users/${uid}`), {
          email,
          commonProjects: "[]",
          countProjects: 0,
        });
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
        setError(error.message);
      });
  };

  return (
    <Form
      title="Зарегистрироваться"
      handleClick={handleRegister}
      error={error}
    />
  );
}
