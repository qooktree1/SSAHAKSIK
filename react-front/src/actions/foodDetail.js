import { SET_DATE_UP, SET_DATE_DOWN } from "./types"

const month31 = [1, 3, 5, 7, 8, 10]
const month30 = [4, 6, 9, 11]

export const setDateUp = (year, month, day) => dispatch => {
  if (month31.includes(month) && day === 31) {
    month += 1
    day = 1
  } else if (month30.includes(month) && day === 30) {
    month += 1
    day = 1
  } else if (month === 2 && day === 28) {
    month += 1
    day = 1
  } else if (month === 12 && day === 31) {
    year += 1
    month += 1
    day = 1
  } else {
    day += 1
  }

  dispatch({
    type: SET_DATE_UP,
    payload: { year, month, day }
  })
}

export const setDateDown = (year, month, day) => dispatch => {
  if (month31.includes(month - 1) && day === 1) {
    day = 31
    month -= 1
  } else if (month30.includes(month - 1) && day === 1) {
    day = 30
    month -= 1
  } else if (month === 3 && day === 1) {
    day = 28
    month = 2
  } else {
    day -= 1
  }

  dispatch({
    type: SET_DATE_DOWN,
    payload: { year, month, day }
  })
}