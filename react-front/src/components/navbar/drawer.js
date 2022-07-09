import * as React from 'react'
import { Box, SwipeableDrawer, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { logout } from '../../actions/auth'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import Grid from '@mui/material/Grid'


export default function SwipeableTemporaryDrawer() {
  const [logoutShow, setLogoutShow] = useState({display: 'visible'})
  const [token, setToken] = useState(localStorage.token)  
  const [registerShow, setRegisterShow] = useState({display: 'visible'})
  const [loginShow, setLoginShow] = useState({display: 'visible'})
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.auth.token)
  const username = useSelector(state => state.auth.user.username)
  const email = useSelector(state => state.auth.user.email)
  const firstName = useSelector(state => state.auth.user.first_name)
  const lastName = useSelector(state => state.auth.user.last_name)
  const regionNum = useSelector(state => state.auth.user.region)
  const regionArr = ['서울캠퍼스', '서울캠퍼스', '구미캠퍼스', '대전캠퍼스', '부울경캠퍼스', '광주캠퍼스']
  const [emailArr, setEmailArr] = useState([])
  const [regionName, setRegionName] = useState('')


  useEffect(() => {
    if (email) {
      setEmailArr(email.split('@'))
    }
    if (regionNum) {
      setRegionName(regionArr[regionNum])
    }
  }, [email, regionNum])

  useEffect(() => {
    if (token) {
      setLogoutShow({display: 'visible'})
      setLoginShow({display: 'hidden'})
      setRegisterShow({display: 'hidden'})
    } else {
      setLogoutShow({display: 'hidden'})
      setLoginShow({display: 'visible'})
      setRegisterShow({display: 'visible'})
    }
  }, [token])

  const onLogout = e => {
    e.preventDefault()
    axios({
      method: 'post',
      url: `https://13.125.68.125/api/v1/accounts/logout/`,
    })
    .then(res => {
    })
    .catch(err =>console.error(err))

    setToken('')
    dispatch(logout())
    localStorage.removeItem('token')

    window.location.reload()
  }

  const [state, setState] = useState({
    right: false,
  })

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }
  useEffect(() => {
    if (isLoggedIn) {
      setLogoutShow({display: 'visible'})
    } else {
      setLogoutShow({display: 'hidden'})
    }
  }, [isLoggedIn])
  

  const LoginList = (anchor) => (
    <Box
    sx={{ m: 2, width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    role="presentation"
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
      <span className="mypage"><b>{username}</b>님</span>
      <Button onClick={onLogout} variant="outlined" color="error" style={logoutShow}>
        Logout
      </Button>
      </Box>
      <hr className="mypageline" />


      <h3 className="mypage">회원정보</h3>
      <Grid container>
        <Grid item xs="4">
          <span className="mypage">이름</span>
          <p className="mypage">지역</p>

          <p className="mypage">이메일</p>
        </Grid>
        <Grid item xs="8">
          <span className="mypage-content">{lastName}{firstName}</span>
          <p className="mypage=content">{regionName}</p>

          <p className="mypage-email">{emailArr[0]}</p>
          <p className="mypage-email2">@{emailArr[1]}</p>
        </Grid>
      </Grid>

      <Button sx={{ m:1 }} component={Link} to="/edit" variant="contained" color="primary">
      회원정보 수정</Button>
      <hr className="mypageline" />

      <div className="footer">
        <p className="mypage-footer"><b>Contact</b></p>
        <p className="mypage-footer-contents">ssahaksik@gmail.com</p>
        <p className="mypage-footer"><b>Developers</b></p>
        <p className="mypage-footer-contents2">한지운 최희선 임상빈</p>
        <p className="mypage-footer-contents2">이영주 김신철 박종민</p>
      </div>
    </Box>
  )
  
  const LogoutList = (anchor) => (
    <Box
    sx={{ m : 2, width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
    role="presentation"
    onClick={toggleDrawer(anchor, false)}
    onKeyDown={toggleDrawer(anchor, false)}
    >

      <Button sx={{ m:2 }} component={Link} to="/register" variant="contained" color="primary" style={registerShow}>
        회원가입</Button>
      <Button component={Link} to="/login" variant="contained" color="primary" style={loginShow}>
        로그인</Button>
    </Box>
  )


  return (
    <div>
      {/* Menu ICon을 넣어야 함 */}
      {['right'].map(anchor => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><MenuIcon /></Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {isLoggedIn
            ? <LoginList anchor={anchor} />
            : <LogoutList anchor={anchor} />
            }
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
