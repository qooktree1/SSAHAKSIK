import { useState} from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { MenuItem, Box, Button, CssBaseline, TextField, Grid, Typography, Container, Alert, createTheme, ThemeProvider } from '@mui/material'
import { register } from "../../actions/auth"
import "../styles.css"




function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <span>
        서울 6반 SSAHAKSIK
      </span>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

const theme = createTheme();

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
    first_name: "",
    last_name: "",
    email: "",
    region: 1,  
  })

  const errEmail = useSelector(state => state.auth.email)
  const errPassword1 = useSelector(state => state.auth.password1)
  const errPassword2 = useSelector(state => state.auth.password2)
  const errUserName = useSelector(state => state.auth.username)


  const dispatch = useDispatch()
  const isAuthenticated= useSelector(state => state.auth.isAuthenticated)
  const { username, first_name, last_name, password, passwordConfirmation, email, region } = formData
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value})
  }

  const onSubmit = async e => {
    e.preventDefault()
    dispatch(register({ username, first_name, last_name, password, passwordConfirmation, email, region }))
   }
   if (isAuthenticated) {
    navigate('/login')
   }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {errUserName?
          <Alert severity="error">{errUserName}</Alert>
          : null
        }
        {errEmail?
          <Alert severity="error">{errEmail}</Alert>
          : null
        }
        {errPassword1?
          <Alert severity="error">{errPassword1}</Alert>
          : null
        }
        {errPassword2?
          <Alert severity="error">{errPassword2}</Alert>
          : null
        }
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Link to="/">
            <img className="logoimg2" alt="logoImage" src="img/ssa_logo.png" />
          </Link>
          <h3>회원가입</h3>

          {/* <FormControl fullWidth> */}

            {/* handleSubmit을 onSubmit으로 변경함 */}
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    required
                    fullWidth="true"
                    id="username"
                    label="아이디"
                    name="username"
                    autoComplete="username"
                    onChange={onChange}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth="true"
                    id="last_name"
                    label="성"
                    name="last_name"
                    autoComplete="family-name"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth="true"
                    id="first_name"
                    label="이름"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    required
                    fullWidth="true"
                    id="email"
                    label="이메일 주소"
                    name="email"
                    autoComplete="email"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth="true"
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth="true"
                    name="passwordConfirmation"
                    label="비밀번호 확인"
                    type="password"
                    id="passwordConfirmation"
                    autoComplete="new-password"
                    onChange={onChange}
                  />
                </Grid>

                {/* 캠퍼스 */}
                <Grid item xs={12}>
                <div className="form-group">
                  <TextField
                    margin="normal"
                    fullWidth
                    id="region"
                    select
                    label="지역"
                    value={formData.region}
                    onChange={onChange}
                    sx={{ mt: 2 }}
                    name="region"
                    >
                    {regions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth="true"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                회원가입
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <p style={{ margin:0, display:'flex', justifyContent:'center', alignItems: 'center' }} > 이미 아이디가 있으신가요? 
                    <Button sx={{ mt: 0 }} 
                    component={Link} to="/login" 
                    variant="text" 
                    color="primary" 
                    style={{lineHeight: '0'}}>
                      로그인 </Button>
                  </p>
                </Grid>
              </Grid>
            </Box> {/* form 태그 끝 */}
          {/* </FormControl> */}

        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
    </ThemeProvider>
  );
}