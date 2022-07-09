import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowBackIosNew, ArrowForwardIos, LocationOn, ThumbUpOffAlt, ThumbDownOffAlt } from '@mui/icons-material'
import { Box, Container, Grid, InputLabel, MenuItem, FormControl, Select, IconButton } from '@mui/material'
import axios from 'axios'
import "../styles.css"
import Box1 from '@mui/joy/Box'
import { setDateUp, setDateDown } from '../../actions/foodDetail'
import Comments from './comments'
import ScrollableTabsButtonForce from '../navbar/tab'

// 좋아요 싫어요 버튼
import { makeStyles } from '@material-ui/core/styles'
import { pink } from '@mui/material/colors'
import Avatar from '@material-ui/core/Avatar'

// import Swiper core and required modules
import { Navigation, Pagination, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.grey[700],
  },
}))

export default function FoodDetail() {
  // 버튼 색깔
  const [likeStatus, setLikeStatus] = useState()
  const [dislikeStatus, setDislikeStatus] = useState()
  const classes = useStyles()

  // 날짜
  const year = useSelector(state => state.foodDetail.year)
  const month = useSelector(state => state.foodDetail.month)
  const day = useSelector(state => state.foodDetail.day)

  // 지역
  const initialRegion = useSelector(state => state.region.region)
  const UserRegion = useSelector(state => state.auth.user.region) // 사용자가 설정한 지역

  const dispatch = useDispatch()

  const [region, setRegion] = useState(initialRegion)
  
  const [foodDetail, setFoodDetail] = useState([])
  const [foodShow, setFoodShow] = useState({display: ''})
  const [foodErrorShow404, setFoodErrorShow404] = useState({display: 'none'})
  const [notService, setNotService] = useState({display: 'none'})

  const foodErrorDisplay404 = {
    ...foodErrorShow404,
    objectFit: 'none',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '20px'
  }
  const notServiceDisplay = {
    ...notService,
    objectFit: 'none',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '20px'
  }

  // 음식 평가
  const [foodComment, setFoodComment] = useState('')
  const [foodColor, setFoodColor] = useState({position: 'absolute', height: '100%', width: '100%'})
  const [foodImg, setFoodImg] = useState({zIndex: '11'})
  const [foodClick, setFoodClick] = useState(0)
  const [foodIndex, setFoodIndex] = useState(0)
  const [time, setTime] = useState()
  const [foodId, setFoodId] = useState()
  
  
  const dislikeColor = {
    position:'absolute',
    backgroundColor: 'rgba(244, 51, 51, 0.5)',
    height: '100%',
    width: '100%',
    zIndex:'10',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const likeColor = {
    position:'absolute',
    backgroundColor: 'rgba(0, 56, 255, 0.15)',
    height: '100%',
    width: '100%',
    zIndex:'10',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
  const pressLike = () => {
    clearTimeout(time)
    setFoodClick(e => e + 1)
    axios({
      method:'post',
      url: `http://13.125.68.125/api/v1/foods/${foodDetail[foodIndex]?.id}/like/` // ${foodDetail[foodIndex]?.id}
    })
      .then(res => {
        if (res.data.user_like_status) {
          setLikeStatus("primary")
        } else {
          setLikeStatus()
        }
        setDislikeStatus()
      })
    }
    
  const pressDislike = () => {
    clearTimeout(time)
    setFoodClick(e => e + 1)
    axios({
      method:'post',
      url: `http://13.125.68.125/api/v1/foods/${foodDetail[foodIndex]?.id}/dislike/`
    })
    .then(res => {
      if (res.data.user_like_status) {
        setDislikeStatus({ color: pink[500] })
      } else {
        setDislikeStatus()
      }
      setLikeStatus()
    })
  }
  
  const changeRegion = e => {
    clearTimeout(time)
    setRegion(e.target.value)
  }

  useEffect(() => {
    if (UserRegion) {
      clearTimeout(time)
      setRegion(UserRegion)
    }
  }, [UserRegion])

  useEffect(() => {
    setFoodComment()
    setFoodColor({position: 'absolute', height: '100%', width: '100%'})
    setFoodImg({zIndex: '11'})
    axios({
      method: 'get',
      url: `http://13.125.68.125/api/v1/foods/${region}/${year}/${month}/${day}/`
    })
      .then(res => {
        clearTimeout(time)
        setFoodDetail(res.data)
        if (res.data[foodIndex].user_like_status === 1) {
          setLikeStatus("primary")
          setDislikeStatus()
        } else if (res.data[foodIndex].user_like_status === 2) {
          setDislikeStatus({ color: pink[500] })
          setLikeStatus()
        } else {
          setLikeStatus()
          setDislikeStatus()
        
        }
        setFoodClick(0)

        setFoodShow({display: ''})
        setFoodErrorShow404({display: 'none'})
        setNotService({display: 'none'})
      })
      .catch(err => {
        if (err.response.data.error === 'weekend') {
          setFoodShow({display: 'none'})
          setFoodErrorShow404({display: ''})
          setNotService({display: 'none'})
        } else if (err.response.data.error === 'not yet') {
          setFoodShow({display: 'none'})
          setFoodErrorShow404({display: 'none'})
          setNotService({display: ''})
        }
      })
    }, [year, month, day, region, foodId, foodIndex])
  

  useEffect(() => {
    axios({
      method: 'get',
      url: `http://13.125.68.125/api/v1/foods/${region}/${year}/${month}/${day}/`
    })
    .then(res => {
      if (foodClick) {
        clearTimeout(time)
        setFoodImg({zIndex: '11', opacity: '0.5'})
        // 음식 평가
        setFoodComment(res.data[foodIndex].food.sentence)
        // 음식 따봉 사진 변화 빨강, 파랑
        if (res.data[foodIndex].food.like_count < res.data[foodIndex].food.dislike_count) {
          setFoodColor(dislikeColor)
        } else {
          setFoodColor(likeColor)
        }
      }
      setTime(
        setTimeout(() => {
          setFoodComment()
          setFoodColor({position: 'absolute', height: '100%', width: '100%'})
          setFoodImg({zIndex: '11'})
        }, 3000)
      )
    })

  }, [foodClick])

  function imageClick() {
    clearTimeout(time)
    setFoodClick(e => e + 1)
  }
  

  return (
    <div>
      <Box>
        <Grid container spacing={0}>
          <Grid item xs={0} xl={2}></Grid>
          <Grid item xs={12} xl={8}>
            <Container sx={{marginBottom: 8}}>
              <Box sx={{marginLeft: 3, marginBottom: 2}} style={{display:'flex', justifyContent: 'space-between'}}>
                <Box style={{ display:'flex', alignItems: 'end'}}>
                  <LocationOn className="locationicon" color="primary"/>
                  <FormControl variant="standard">
                  <InputLabel id="demo-simple-select-standard-label" />
                    <Select
                      sx={{ fontSize:'0.875rem'}} 
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select"
                      value={region}
                      label="region"
                      onChange={e => changeRegion(e)}
                    >
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={1}>서울 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={2}>구미 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={3}>대전 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={4}>부울경 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={5}>광주 캠퍼스</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ScrollableTabsButtonForce />
              </Box>  
              <Box
                id="box1-background"
                sx={{borderRadius: '20px'}}
              >
                <Grid item xs={12} xl={12}>
                  <div id="box5-background" style={{display: 'flex', justifyContent: 'center', borderRadius:"20px 20px 0px 0px"}}>
                    <IconButton style={{ color: '#fff', opacity:'0.7' }} onClick={() => dispatch(setDateDown(year, month, day))}><ArrowBackIosNew /></IconButton>
                    <h3>{`${year}년 ${month}월 ${day}일`}</h3>
                    <IconButton style={{ color: '#fff', opacity:'0.7' }} onClick={() => dispatch(setDateUp(year, month, day))}><ArrowForwardIos /></IconButton>
                  </div>
                </Grid>

                {/* 404 에러 사진 */}
                <img src='img/notProvide.png' alt="foodError404" style={foodErrorDisplay404}></img>
                {/* 500 에러 사진 */}
                <img src='img/readysikdan.png' alt="식단 준비중입니다" style={notServiceDisplay}></img>

                {/* Swiper 시작 - Swiper 시작 - Swiper 시작 - Swiper 시작 - Swiper 시작 - Swiper 시작 - Swiper 시작 - */}
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  onSlideChange={e => setFoodIndex(e.activeIndex)}
                  touchRatio={0} // 드래그 금지 코드
                >
                  {foodDetail.map(food => 
                  <SwiperSlide key={food.id}>
                  <div style={foodShow} className="food-contents">
                    <Grid container spacing={0}>
                      <Grid item xs={12} xl={6}>
                        <Container style={{ display:'flex', justifyContent:'center'}}>
                          <div className="centerdiv">
                            <div className="cropped" style={{position:'relative', cursor: 'pointer'}} onClick={imageClick}>
                              {/* 음식 사진!!!! */}
                              <div style={foodColor} >
                                <p style={{color: 'white', fontSize:'1rem', fontWeight:'bold'}}>{foodComment}</p>
                              </div>
                              {/* 각 음식당 map */}
                              <img id="mainimg" src={`http://52.78.222.136${food.food.food_img}`} style={foodImg}></img>

                            </div>
                          </div>
                        </Container>
                        <Box1 sx={{ justifyContent: 'space-evenly', mx: -1, my: 1 }}>
                          <IconButton onClick={pressLike}><Avatar className={classes.avatar}><ThumbUpOffAlt color={likeStatus} /></Avatar></IconButton>
                          <IconButton onClick={pressDislike}><Avatar className={classes.avatar}><ThumbDownOffAlt sx={dislikeStatus} /></Avatar></IconButton>
                        </Box1>
                      </Grid>
                      <Grid item xs={12} xl={6}>
                        <Container style={{ display:'flex', justifyContent:'center'}}>
                          <div className="centerdiv" style={{ width:'380px'}}>
                            <h3 className="box-title">Menu</h3>
                            <Box
                              id="box2-background"
                              sx={{
                                width: '100%',
                                height: 200,
                                borderRadius: '40px',
                              }}
                            >
                              <Grid container spacing={0}>
                                <Grid item xs={6} style={{ display:'flex', justifyContent:'center'}}>
                                  <div className="centerdiv">
                                    <p><b>{food.food.name}</b></p>
                                    {food.side_dish.slice(0,4).map(side => <p key={side.id}>{side.name}</p>)}
                                  </div>
                                </Grid>
                                <Grid item xs={6} style={{ display:'flex', justifyContent:'center'}}>
                                  <div className="centerdiv">
                                    {food.side_dish.slice(4).map(side => <p key={side.id}>{side.name}</p>)}
                                  </div>
                                </Grid>
                              </Grid>
                            </Box>
                          </div>
                        </Container>
                      </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                      <Grid item xs={1} xl={1}></Grid>
                        <Grid item xs={10} xl={10} id="commenttop">
                          <h3 className="box-title">Review</h3>
                          <Box
                            id="box3-background"
                            sx={{
                              borderRadius: '20px',
                            }}
                          >
                          <Comments foodId={foodDetail[foodIndex]?.id}></Comments>
                          <br />
                          <br />
                          </Box>
                        </Grid>
                      <Grid item xs={1} xl={1}></Grid>
                    </Grid>
                  </div>
                </SwiperSlide>
                  )}
                </Swiper>
                {/* Swiper 끝 - Swiper 끝 - Swiper 끝 - Swiper 끝 - Swiper 끝 - Swiper 끝 - Swiper 끝 - Swiper 끝 -  */}
              </Box>
            </Container>
          </Grid>
          <Grid item xs={0} xl={2}></Grid>
        </Grid>
      </Box>
    </div>
  )
}