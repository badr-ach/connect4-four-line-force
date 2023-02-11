import { fetcher } from "../utils/requester.js";
import { events } from "../events/events.js";

const api = fetcher();
const rootPath = "http://localhost:3000";

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(events.loadUser, { token: token });
    }
  } catch (err) {
    console.log(err);
    dispatch(events.error, err);
  }
};

//Signup user
export const signup = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/signin", body);
    console.log(res);

  } catch (err) {
    console.log(err);
    dispatch(events.error, err);
  }
};

// Login User
export const login = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/login", body);
    console.log(res);
  } catch (err) {
    console.log(err);
    dispatch(events.error, err);
  }
};
