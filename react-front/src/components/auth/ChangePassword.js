import React, { useState, Fragment, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { login } from "../../actions/auth"
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import axios from 'axios'

export default function ChangePassword() {
  const navigate = useNavigate()
  const theme = createTheme()
  const [formData, setFormData] = useState({
    old_password: "",
    password: "",
    passwordConfirmation: ""
  })
  const [userPk, setUserPk] = useState(0)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const [passwordErr, setpasswordErr] = useState(0)
  const [oldPasswordErr, setOldPasswordErr] = useState(0)



  const { old_password, password, passwordConfirmation } = formData

  useEffect(() => {
    axios({
      method: 'get',
      url: "https://13.125.68.125/api/v1/accounts/user/"
    })
      .then(res => {
        setUserPk(res.data.pk)
      })
    }, [])

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    axios({
      method: 'put',
      url: `https://13.125.68.125/api/v1/accounts/change_password/${userPk}/`,
      data: { old_password, password, passwordConfirmation }
    })
      .then(res => {
        navigate('/')
      })
      .catch(err => {
        if (err.response.data.old_password){
          setOldPasswordErr(err.response.data.old_password)
          setpasswordErr(0)
        } else if (err.response.data.password) {
          setOldPasswordErr(0)
          setpasswordErr(err.response.data.password)
        }
      })
      
  }

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      {passwordErr
          ? <Alert severity="error">{passwordErr}</Alert>
          : null
      }
      {oldPasswordErr
          ? <Alert severity="error">{oldPasswordErr}</Alert>
          : null
      }
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
      <Link to="/">
        <img className="logoimg2" alt="logoImage" src="img/ssa_logo.png"/>
      </Link>
      <h3>비밀번호 변경</h3>
      <Box noValidate sx={{ mt: 1 }}>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <TextField
            margin='normal'
            required
            fullwidth='true'
            type='password'
            label='이전 비밀번호'
            name='old_password'
            value={old_password}
            onChange={onChange}
            autoFocus
          />
        </div>
        <div className="form-group">
          <TextField
            margin='normal'
            required
            fullwidth='true'
            type='password'
            label='새 비밀번호'
            name='password'
            minLength='8'
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <TextField
            margin='normal'
            required
            fullwidth='true'
            type='password'
            label='새 비밀번호 확인'
            name='passwordConfirmation'
            minLength='8'
            value={passwordConfirmation}
            onChange={onChange}
          />
        </div>
        <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ my: 1 }}
            >
          확인
        </Button>
      </form>
      <Button component={Link} to="/" variant="outlined" color="primary" fullWidth>
        취소 </Button>
      </Box>
      </Box>
      </ThemeProvider>
    </Fragment>
    
  )
}