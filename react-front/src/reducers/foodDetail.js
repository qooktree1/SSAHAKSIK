import { SET_DATE_UP, SET_DATE_DOWN } from "../actions/types"

const today = new Date()
const initialState = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
}
export default function(state=initialState, action) {
  const { type, payload } = action

  switch(type) {
    case SET_DATE_UP:
      return payload

    case SET_DATE_DOWN:
      return payload
      
    default:
      return state
  }
}