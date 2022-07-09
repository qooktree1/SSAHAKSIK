import { TextField, InputAdornment } from "@material-ui/core"
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import "../styles.css"
import Alert from '@mui/material/Alert';

export default function Comments(props) {
  const foodId = props.foodId
  const token = useSelector(state => state.auth.token)
  const userPk = useSelector(state => state.auth.user?.pk)
  const [review, setReview] = useState("")
  const [reviewList, setReviewList] = useState([])

  const writeReview = (event) => {
    setReview(event.target.value)
  }
  
  const createReview = (e) => {
    e.preventDefault()
    axios({
      method: 'post',
      url: `http://13.125.68.125/api/v1/communities/${foodId}/create/`,
      headers: { Authorization: `Token ${localStorage.getItem('token')}`},
      data: {review},
    }) 
    .then(res => {
      axios({
        method: 'get',
        url: `http://13.125.68.125/api/v1/communities/${foodId}/review/`,
      })
      .then(res => {
        setReviewList(res.data)
        setReview("")
        })
    })
  }
      
  const deleteReview = reviewPk => {
    axios({
      method: 'delete',
      url: `http://13.125.68.125/api/v1/communities/${reviewPk}/`,
      headers: { Authorization: `Token ${localStorage.getItem('token')}`},
    })
    .then(res => {
      axios({
        method: 'get',
        url: `http://13.125.68.125/api/v1/communities/${foodId}/review/`,
      })
        .then(res => {
          setReviewList(res.data)
        })
    })
  
  }


  useEffect(() => {
    axios({
      method: 'get',
      url: `http://13.125.68.125/api/v1/communities/${foodId}/review/`, 
    })
      .then(res => {
        setReviewList(res.data)
        setReview("")
      })
      .catch(err => console.error(err))
    }, [foodId])
    
    return (
      <div>
          <br />
          <div className="commentdiv">
          {token
          ? null
          : <Alert severity="error">리뷰 작성을 위해 로그인을 해주세요!</Alert>
          }
          <form onSubmit={createReview}>
          <TextField
            placeholder="리뷰를 남겨주세요!"
            onChange={writeReview}
            value={review}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    sx={{color: '#3396F4'}}
                    onClick={createReview}
                    >
                    게시</Button>
                </InputAdornment>
              )
            }}
            />
          </form>
          </div>
          <br />

        {
          reviewList.map(review =>
            <div key={review.id} className="commentdiv">
              <br />
              <span><b>{review.user.username}   </b></span>

              <span>{review.review}</span>
              { userPk === review.user.id
              ? <IconButton onClick={() => deleteReview(review.id)}><HighlightOffIcon /></IconButton>
              : null
              }
              

            </div>
          )
        }
    </div>
  )
}