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
  }
};

//Signup user
export const signup = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/signin", body);
    console.log(res);
    // const res = await axios.post('/users/register',body,config)
    // dispatch({
    //     type:REGISTER_SUCCESS,
    //     payload:res.data
    // })
    // dispatch(setAlert('Signed Up succesfully','success'))
    // dispatch(loadUser())
  } catch (err) {
    console.log(err);
    // if (errors) {
    //     errors.forEach(error => dispatch(setAlert(error.message, 'danger')))
    // }
    // dispatch({
    //     type: REGISTER_FAIL
    // })
  }
};

// Login User
export const login = (body) => async (dispatch) => {
  try {
    const res = await api.post(rootPath+"/api/login", body);
    console.log(res);
    // dispatch({
    //     type: LOGIN_SUCCESS,
    //     payload: res.data
    // })
    // dispatch(loadUser())
    // dispatch(setAlert('Logged in successfully',"success"))
  } catch (err) {
    console.log(err);
    // if (errors) {
    //     errors.forEach(error => dispatch(setAlert(error.message, 'danger')))
    // }
    // dispatch({
    //         type: LOGIN_FAIL
    // })
  }
};
