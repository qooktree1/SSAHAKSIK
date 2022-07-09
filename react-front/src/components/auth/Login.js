import React, { useState, Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { login } from "../../actions/auth"
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'




export default function Login() {
  const navigate = useNavigate()
  const theme = createTheme()

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  const { username, password } = formData

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async e => {
    e.preventDefault()
    dispatch(login(username, password))
  }

/* 인증된 사용자는 다시 메인페이지로 */
useEffect(() => {
  if (token) {
    navigate('/')
  }
}, [token])

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {token === false ?
          <Alert severity="error">아이디나 비밀번호를 확인해주세요!</Alert>
          : null
        }
        
      <Box
          sx={{
            mt : 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
      <Link to="/">
        <img className="logoimg2" alt="logoImage" src="img/ssa_logo.png" />
      </Link>
      <h3>로그인</h3>
        <Box noValidate >
        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <TextField
              margin="normal"
              required
              fullwidth="true"
              type="username"
              label="아이디"
              name="username"
              value={username}
              onChange={onChange}
              autoFocus
            />
          </div>
          <div className="form-group">
            <TextField
              margin="normal"
              required
              fullwidth="true"
              type="password"
              label="비밀번호"
              name="password"
              minLength="6"
              value={password}
              onChange={onChange}
            />
          </div>
          <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ my: 2 }}
              >
                로그인
              </Button>
        </form>
        </Box>
      <div>

        <p style={{ margin:0, display:'flex', justifyContent:'center', alignItems: 'center' }} > 아직 회원이 아니신가요? 
          <Button sx={{ mt:0.5 }} component={Link} to="/register" variant="text" color="primary" style={{lineHeight: '0'}}>
            회원가입
          </Button>
        </p>
        <p style={{ mt:1, display:'flex', justifyContent:'center', alignItems: 'center' }} > 비밀번호를 잊으셨나요? 
          <Button sx={{ mt:0.5 }} component={Link} to="/reset_password" variant="text" color="primary" style={{lineHeight: '0'}}>
            비밀번호 재설정
          </Button>
        </p>
      </div>
      </Box>
      </Container>
      </ThemeProvider>
    </Fragment>
  )
}


