export const loadTodosAction = () => ({ type: "LOAD_TODOS" });

export const loadTodosFailureAction = () => ({
  type: "LOAD_TODOS_FAILURE",
});

export const addTodos = (payload) => ({
  type: "ADD_TODOS",
  payload,
});

export const loadTodosSuccess = (payload) => ({
  type: "LOAD_TODOS_SUCCESS",
  payload,
});
