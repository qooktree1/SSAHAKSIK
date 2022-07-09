import axios from "axios"
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken"

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }
  try {
    const res = await axios.get("https://13.125.68.125/api/v1/accounts/edit/")
    dispatch({ type: USER_LOADED, payload: res.data })
  } catch (err) {
    console.error(err)
    dispatch({ type: AUTH_ERROR })
  }
}

// Register User
export const register = ({ username, first_name, last_name, password, passwordConfirmation, email, region  }) => dispatch => {

  const body = JSON.stringify({ username, first_name, last_name, password, passwordConfirmation, email, region })
  axios({
    method: 'post',
    url: "https://13.125.68.125/api/v1/accounts/signup/",
    headers: { "Content-Type": "application/json" },
    data: body
  })
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data
      })
    })
}

// Login User
export const login = (username, password) => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  }

  const body = JSON.stringify({ username, password })
 
  try {
    const res = await axios.post("https://13.125.68.125/api/v1/accounts/login/", body, config)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.key
    })

    dispatch(loadUser())

  } catch (err) {
    dispatch({
      type: LOGIN_FAIL
    })
  }
}

// Logout
export const logout = () => async dispatch => {
  try {
    const res = await axios.post("https://13.125.68.125/api/v1/accounts/logout/")
    dispatch({ type: LOGOUT })
    dispatch({ type: CLEAR_PROFILE })
    
  } catch (err) {
    console.error(err)
  }
}