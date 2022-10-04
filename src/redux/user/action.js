export const setUser = (payload) => ({
  type: "SET_USER",
  payload,
});

export const updateUser = (payload) => ({
  type: "UPDATE_USER",
  payload,
});

export const removeUser = () => ({
  type: "REMOVE_USER",
});
