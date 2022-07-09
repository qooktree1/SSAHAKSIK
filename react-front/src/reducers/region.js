import { SET_REGION } from "../actions/types"

const initialState = {
    region: 1,
}
export default function(state=initialState, action) {
  const { type, payload } = action

  switch(type) {
    case SET_REGION:
      return payload

    default:
      return state
  }
}