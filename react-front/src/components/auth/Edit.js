import React, { useState, Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import { TextField, Container, Box, Button, CssBaseline, Alert, MenuItem } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import "../styles.css"

export default function Edit() {
  const [confirm, setConfirm] = useState(false)
  const theme = createTheme()
  const [formData, setFormData] = useState({
    username: "",
    region: "", 
    last_name: "",
    first_name: "",
    email: "",
  })

  const [selectRegion, setSelectRegion] = useState(formData.region)

  const regions = [
    {
      value: 1,
      label: '서울 캠퍼스',
    },
    {
      value: 2,
      label: '구미 캠퍼스',
    },
    {
      value: 3,
      label: '대전 캠퍼스',
    },
    {
      value: 4,
      label: '부울경 캠퍼스',
    },
    {
      value: 5,
      label: '광주 캠퍼스',
    },
  ]

  const { username, region, first_name, last_name, email } = formData

  const onSignout = e => {
    e.preventDefault()
    if(window.confirm('정말 회원탈퇴 하시겠습니까?')){
      axios({
        method: 'delete',
        url: `https://13.125.68.125/api/v1/accounts/delete/`,
      })
        .then(res => {
          localStorage.removeItem('token')
          window.location.replace("/")
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://13.125.68.125/api/v1/accounts/edit/'
    })
      .then(res => {
        setFormData({
          ...formData,
          username: res.data.username,
          region: res.data.region,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email
        })
        setSelectRegion(res.data.region)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const onChange = e => {
    setSelectRegion(e.target.value)
  }

  const onSubmit = async e => {
    e.preventDefault()

    axios({
      method: 'put',
      url: "https://13.125.68.125/api/v1/accounts/edit/",
      data: { region: selectRegion }
    })
      .then(res => {
        setConfirm(true)
      })
      .catch(err => {
        console.error(err)
      })
  }


  return (
    <Fragment>
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    {confirm
      ?<Alert severity="success">수정이 완료되었습니다!</Alert>
      : null
      }   
    <Box
      sx={{
        marginTop: 8,
        marginBottom: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
      <Link to="/">
        <img className="logoimg2" alt="logoImage" src="img/ssa_logo.png"/>
      </Link>
      <h3 className="edit-subtitle">{ username }님의 회원정보 수정</h3>
    <Box noValidate sx={{ mt: 0 }}>
      {/* <p>{username}</p>
      <p>{first_name}</p>
      <p>{email}</p> */}

    <form className="form" onSubmit={onSubmit}>
      <Container>
        <Box>
     
      <div className="form-group">
        <TextField
          variant="filled"
          margin="normal"
          required
          type="email"
          label="이메일"
          name="email"
          value={email}
          onChange={onChange}
          // disabled
          InputProps={{
            readOnly: true,
          }}
          sx={{ width:"280px;", my:2}}
        />
      </div>
      <div className="form-group">
        <TextField
          margin="normal"
          fullwidth="true"
          id="region"
          select
          label="지역"
          value={selectRegion}
          onChange={onChange}
          sx={{width:"280px;"}}

        >
          {regions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <p className="edit-line">* 소속 캠퍼스 정보만 수정이 가능합니다.</p>

        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ my: 1 }}
          >
            확인
          </Button>
        </Box>
        <Box>
        <Button component={Link} to="/" variant="outlined" color="primary" fullWidth>
        메인으로 이동 </Button>
        </Box>
      </Container>
      </form>
      </Box>
      <div>
      </div>
      <div className="editbottom">
        <Button component={Link} to="/change_password" variant="text" color="primary">
        비밀번호 변경 </Button>
        <Button variant="text" color="error" sx={{m:1}} onClick={onSignout}>
        회원탈퇴 </Button>
      </div>
      </Box>
    </Container>
    </ThemeProvider>
    </Fragment>
)
}

  
  