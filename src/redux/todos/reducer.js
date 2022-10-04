function reducer(todos = null, action) {
  switch (action.type) {
    case "LOAD_TODOS":
    case "LOAD_TODOS_FAILURE":
      return null;
    case "ADD_TODOS":
      return todos ? [...todos, ...action.payload] : action.payload;
    case "LOAD_TODOS_SUCCESS":
      return action.payload;
    default:
      return todos;
  }
}

export default reducer;
