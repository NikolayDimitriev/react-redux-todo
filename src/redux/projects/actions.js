export const loadProjectsAction = () => ({ type: "LOAD_PROJECTS" });

export const loadProjectsFailureAction = () => ({
  type: "LOAD_PROJECTS_FAILURE",
});

export const addProject = (payload) => ({
  type: "ADD_PROJECT",
  payload,
});

export const loadProjectsSuccess = (payload) => ({
  type: "LOAD_PROJECTS_SUCCESS",
  payload,
});
