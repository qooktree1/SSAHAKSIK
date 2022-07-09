import { combineReducers } from "redux"
import auth from "./auth"
import foodDetail from "./foodDetail"
import region from "./region"

export default combineReducers({ auth, foodDetail, region })