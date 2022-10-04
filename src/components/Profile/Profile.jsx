import { useSelector } from "react-redux";
import styles from "./Profile.module.css";

export function Profile() {
  const user = useSelector((state) => state.user);
  return (
    user && (
      <div className={styles.profile}>
        {user.photoURL ? (
          <div
            className={styles.avatar}
            style={{ backgroundImage: `url(${user.photoURL})` }}
          />
        ) : (
          <div className={styles.avatar} />
        )}

        <div>{user.name}</div>
      </div>
    )
  );
}
