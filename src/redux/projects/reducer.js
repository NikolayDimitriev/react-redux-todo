const reducer = (projects = null, action) => {
  switch (action.type) {
    case "LOAD_PROJECTS":
    case "LOAD_PROJECTS_FAILURE":
      return null;
    case "ADD_PROJECT":
      return projects ? [...projects, action.payload] : [action.payload];
    case "LOAD_PROJECTS_SUCCESS":
      return action.payload;
    default:
      return projects;
  }
};

export default reducer;
