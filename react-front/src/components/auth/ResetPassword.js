import React, { useState, Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { login } from "../../actions/auth"
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import axios from 'axios'

export default function ResetPassword() {
  const theme = createTheme()
  const [formData, setFormData] = useState({
    email: "",
  })

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const [err, setErr] = useState(0)

  const { email } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    axios({
      method: 'post',
      url: "http://13.125.68.125/api/v1/accounts/password_reset/",
      data: { email }
    })
      .then(res => {
        setErr(1)
      })
      .catch(err => {
        setErr(2)
      })

  }

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      {err === 1 && <Alert severity="success">전송이 완료되었습니다.</Alert>}
      {err === 2 && <Alert severity="error">존재하지 않는 이메일입니다.</Alert>}
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
      <h3>비밀번호 재설정</h3>
      <Box noValidate sx={{ mt: 1 }}>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <TextField
            sx={{ width:"280px" }}
            margin="normal"
            required
            fullwidth
            type="email"
            label="이메일"
            name="email"
            minLength="6"
            value={email}
            onChange={onChange}
            autoFocus
          />
        </div>
        <p className="reset-line">* 가입 시 입력한 이메일로 재설정 메일이 발송됩니다.</p>

        <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
          인증메일 받기
        </Button>
      </form>
      </Box>
      <div className="editbottom">
        <Button component={Link} to="/login" variant="text" color="primary">
        로그인 하러가기 </Button>
      </div>
      {/* <p className="my-1">로그인 하러가기 <Link to="/login">Login</Link></p> */}
      </Box>
      </ThemeProvider>
    </Fragment>
    
  )
}