const reducer = (user = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "UPDATE_USER":
      return { ...user, ...action.payload };
    case "REMOVE_USER":
      return null;
    default:
      return user;
  }
};

export default reducer;
