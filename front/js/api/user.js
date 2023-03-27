import { fetcher } from "../utils/requester.js";
import { events } from "../events/events.js";

const api = fetcher();
const rootPath = "http://localhost:8000";

// Load User
export const loadUser = () => async (dispatch) => {
  try {

    if(localStorage.getItem("token") === null){
      // api.delete(Authorization);
      return;
    }

    const token = localStorage.getItem("token");
    api.use({Authorization: "Bearer " + token});
    const res = await api.post(rootPath+"/api/loadUser",{});
    console.log(res)
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));

  } catch (err) {
    localStorage.removeItem('token');
    console.log(err);
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};

//Signup user
export const signup = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/signup", body);
    localStorage.setItem("token", res.token);
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));
    alert("You have been registered successfully");
  } catch (err) {
    localStorage.removeItem('token');
    console.log(err);
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};

// Login User
export const login = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/login", body);
    localStorage.setItem("token", res.token);
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));
    alert("You have been logged in");
  } catch (err) {
    localStorage.removeItem('token');
    console.log(err);
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};


export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem('token');
    dispatch(new CustomEvent(events.signedOut, {detail: null}));
    alert("You have been logged out");
  } catch (err) {
    console.log(err);
    dispatch(new CustomEvent(events.error, {detail: err}));

  }
}
