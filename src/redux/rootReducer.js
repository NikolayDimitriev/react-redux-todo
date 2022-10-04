import { combineReducers } from "redux";

import todos from "./todos/reducer";
import projects from "./projects/reducer";
import user from "./user/reducer";

export default combineReducers({
  todos,
  projects,
  user,
});
