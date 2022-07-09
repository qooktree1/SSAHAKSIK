import { SET_REGION } from "./types"

export const setRegion = region => dispatch => {

  dispatch({
    type: SET_REGION,
    payload: {region}
  })
}