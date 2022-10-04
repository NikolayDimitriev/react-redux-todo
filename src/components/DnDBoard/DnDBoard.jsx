import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDatabase, ref, set } from "firebase/database";
import cn from "classnames";

import { toLocaleFormat } from "../../utils/date";

import { ButtonAdd } from "../ButtonAdd/ButtonAdd";
import { ModalTask } from "../ModalTask/ModalTask";
import { DnDItem } from "./DnDItem";

import styles from "./DnDBoard.module.css";

export function DnDBoard() {
  const user = useSelector((state) => state.user);
  const todos = useSelector((state) => state.todos);
  const db = getDatabase();
  const stateBoard = [
    {
      id: 1,
      title: "Сделать",
      done: false,
      inProgress: false,
      items: [],
    },
    {
      id: 2,
      title: "В процессе",
      done: false,
      inProgress: true,
      items: [],
    },
    {
      id: 3,
      title: "Сделано",
      done: true,
      inProgress: false,
      items: [],
    },
  ];
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const dateToday = toLocaleFormat(new Date());

  useEffect(() => {
    if (todos) {
      const todayTodos = todos.filter(
        (todo) => todo.deadline === toLocaleFormat(new Date())
      );
      todayTodos.forEach((todo) => {
        if (todo.inProgress) {
          stateBoard[1].items.push(todo); // state: inProgress
          return;
        }
        if (todo.done) {
          stateBoard[2].items.push(todo); // state: done
          return;
        }
        stateBoard[0].items.push(todo); // state: to do
      });
    }
    setBoards(stateBoard);
  }, [todos]);

  const dragOverHandler = (e) => {
    e.preventDefault();
    if (e.target.classList.contains(styles.todo)) {
      e.target.style.boxShadow = "0 4px 3px gray";
    }
  };

  const dragLeaveHandler = (e) => {
    e.target.style.boxShadow = "none";
  };

  const dragStartHandler = (e, board, item) => {
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const dragEndHandler = (e) => {
    e.target.style.boxShadow = "none";
  };

  const dragHandler = (e, board, item) => {
    e.preventDefault();
    e.target.style.boxShadow = "none";
    if (
      currentItem.done === board.done &&
      currentItem.inProgress === board.inProgress
    ) {
      const currentIndex = currentBoard.items.indexOf(currentItem);
      currentBoard.items.splice(currentIndex, 1);
      const dropIndex = board.items.indexOf(item);
      board.items.splice(dropIndex + 1, 0, currentItem);
      setBoards(
        boards.map((b) => {
          if (board.id === b.id) {
            return board;
          }
          if (currentBoard.id === b.id) {
            return currentBoard;
          }
          return b;
        })
      );
    } else {
      const postData = {
        ...currentItem,
        done: board.done,
        inProgress: board.inProgress,
      };
      set(ref(db, `todos/${user.id}/${currentItem.id}`), postData);
    }
  };

  const dropBoardHandler = (e, board) => {
    if (board.items.length === 0) {
      const postData = {
        ...currentItem,
        done: board.done,
        inProgress: board.inProgress,
      };
      set(ref(db, `todos/${user.id}/${currentItem.id}`), postData);
    }
  };

  const handleModal = (board) => {
    setCurrentBoard(board);
    setOpenModal(true);
  };

  const deleteTodo = (item) => {
    set(ref(db, `todos/${user.id}/${item.id}`), null);
  };

  return (
    <div className={styles.board}>
      {boards.map((board) => (
        <div
          key={board.id}
          className={cn(styles.boardItem, styles[`boardItem-${board.id}`])}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropBoardHandler(e, board)}
        >
          <div className={styles.boardTitle}>{board.title}</div>
          {board.items.map((item) => (
            <DnDItem
              key={item.id}
              board={board}
              item={item}
              projectId={item.projectId}
              dragOverHandler={dragOverHandler}
              dragLeaveHandler={dragLeaveHandler}
              dragStartHandler={dragStartHandler}
              dragEndHandler={dragEndHandler}
              dragHandler={dragHandler}
              dateToday={dateToday}
              deleteTodo={deleteTodo}
            />
          ))}
          <ButtonAdd
            text="Добавить задачу"
            handleClick={() => handleModal(board)}
          />
        </div>
      ))}
      {openModal && (
        <ModalTask
          setOpenModal={setOpenModal}
          deadline={dateToday}
          board={currentBoard}
        />
      )}
    </div>
  );
}
