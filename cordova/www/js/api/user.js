import { fetcher } from "../utils/requester.js";
import { events } from "../events/events.js";

const api = fetcher();
const rootPath = "http://13.39.75.52/";

// Load User
export const loadUser = () => async (dispatch) => {
  try {

    if(window.localStorage.getItem("token") === null){
      return;
    }

    const token = window.localStorage.getItem("token");
    api.use({Authorization: "Bearer " + token});
    const res = await api.post(rootPath+"/api/loadUser",{});
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));

  } catch (err) {
    window.localStorage.removeItem('token');
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};

//Signup user
export const signup = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/signup", body);
    window.localStorage.setItem("token", res.token);
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));
    dispatch(new CustomEvent(events.popUp, {
          detail: {
            title: "Success",
            content: "You have been signed up",
            temporary: true,
            accept: () => {},
            decline: () => {}
          }}));
  } catch (err) {
    window.localStorage.removeItem('token');
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};

// Login User
export const login = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/login", body);

    window.localStorage.setItem("token", res.token);
    dispatch(new CustomEvent(events.userLoaded, {detail: res.user}));
    dispatch(new CustomEvent(events.popUp, {
          detail: {
            title: "Success",
            content: "You have been logged in",
            temporary: true,
            accept: () => {},
            decline: () => {}
          }}));
  } catch (err) {
    window.localStorage.removeItem('token');
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
};


export const logout = () => async (dispatch) => {
  try {
    window.localStorage.removeItem('token');
    dispatch(new CustomEvent(events.signedOut, {detail: null}));
    dispatch(new CustomEvent(events.popUp, {
      detail: {
        title: "Success",
        content: "You have been logged out",
        temporary: true,
        accept: () => {},
        decline: () => {}
      }}));
  } catch (err) {
    console.log(err);
    dispatch(new CustomEvent(events.error, {detail: err}));

  }
}


export const befriend = (body) => async (dispatch) => {
  try{
    if(window.localStorage.getItem("token") === null){
      return;
    }

    const token = window.localStorage.getItem("token");
    api.use({Authorization: "Bearer " + token});

    const res = await api.post(rootPath+"/api/befriend", body);
    dispatch(new CustomEvent(events.popUp, {detail: {title: "Success", content: "You have befriended " +
    body.username, temporary: true, accept: () => {}, decline: () => {}}}));

  }catch(err){
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
}

export const rejectfriend = (body) => async (dispatch) => {
  try{
    if(window.localStorage.getItem("token") === null){
      return;
    }

    const token = window.localStorage.getItem("token");
    api.use({Authorization: "Bearer " + token});

    const res = await api.post(rootPath+"/api/rejectfriend", body);
    dispatch(new CustomEvent(events.popUp, {detail: {title: "Success", content: "You have rejected " +
    body.username, temporary: true, accept: () => {}, decline: () => {}}}));
  }catch(err){
    dispatch(new CustomEvent(events.error, {detail: err}));
  }
}
