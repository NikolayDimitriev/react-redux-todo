import { useSelector } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";
import { toCommentFormat } from "../../utils/date";
import styles from "./CommentBlock.module.css";
import buttonSubmit from "./assets/buttonSubmit.svg";

export function CommentBlock({ item, comments, commentText, setCommentText }) {
  const commentsNew = JSON.parse(comments);
  const user = useSelector((state) => state.user);
  const tasks = useSelector((state) => state.todos);
  const db = getDatabase();

  const commentChange = (e) => {
    setCommentText(e.target.value);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (commentText === "") {
      return;
    }
    const comments = [...commentsNew];
    comments.push({
      id: Date.now(),
      author: user.name,
      date: toCommentFormat(new Date()),
      text: commentText,
    });

    // if (item.inCommonProject) {
    //   const projectTodos = tasks.filter(
    //     (todo) => todo.projectId === +item.projectId
    //   );
    //   const updateTodo = {
    //     ...item,
    //     comments: JSON.stringify(comments),
    //   };
    //   const uplodeTodo = projectTodos.push(updateTodo);
    //   set(ref(db, `commonProjects/${item.projectId}/todos/`), {
    //     todos: JSON.stringify(uplodeTodo),
    //   });
    // } else {

    // }

    set(ref(db, `todos/${user.id}/${item.id}`), {
      ...item,
      comments: JSON.stringify(comments),
    });

    setCommentText("");
  };

  return (
    <div className={styles.comments}>
      <div className={styles.commentsTitle}>
        Комментарии {commentsNew.length > 0 && commentsNew.length}
      </div>
      <div className={styles.commentsBlock}>
        {commentsNew.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <span className={styles.commentAuthor}>{comment.author}</span>
              <span className={styles.commentDate}>{comment.date}</span>
            </div>
            <div className={styles.commentText}>{comment.text}</div>
          </div>
        ))}
      </div>
      <form className={styles.form}>
        <textarea
          className={styles.formInput}
          placeholder="Комментарий"
          maxLength={70}
          value={commentText}
          onChange={commentChange}
        />
        <button
          type="submit"
          onClick={submitComment}
          className={styles.buttonSubmit}
        >
          <img src={buttonSubmit} alt="иконка отправить" />
        </button>
      </form>
    </div>
  );
}
