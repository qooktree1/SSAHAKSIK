/* global kakao */
import './eatout.css'
import React, { useState, useEffect } from 'react'
import "../components/styles.css"
import { useSelector } from 'react-redux'
import Box2 from '@mui/material/Box'
import { Container, Select, FormControl, MenuItem, InputLabel, Grid } from '@mui/material'
import ScrollableTabsButtonForce from '../components/navbar/tab'
import LocationOnIcon from '@mui/icons-material/LocationOn'

export default function Eatout() {

  // 지역
  const initialRegion = useSelector(state => state.region.region)
  const userRegion = useSelector(state => state.auth.user.region) 
  const [region, setRegion] = useState(initialRegion)

  const [serviceShow, setServiceShow] = useState({display: ''})
  const [serviceErrorShow, setServiceErrorShow] = useState({display: ''})

  useEffect(() => {
    if (region === 1) {
      setServiceShow({display: ''})
      setServiceErrorShow({display: 'none'})
    } else {
      setServiceShow({display: 'none'})
      setServiceErrorShow({display: ''})
    }
  }, [region])
  
  
  const chageRegion = (e) => {
    setRegion(e.target.value)
  }
  
  useEffect(() => {
    if (userRegion) {
      setRegion(userRegion)
    }
  }, [userRegion])
  
  useEffect(() => {
    
    let multiCampusPosition = [37.5013, 127.0396]
    let markers = []
    let mapContainer = document.getElementById('map') // 지도를 표시할 div 
    
    const mapOption = {
      center: new kakao.maps.LatLng(multiCampusPosition[0], multiCampusPosition[1]), // 지도의 중심좌표(멀티캠퍼스)
      level: 3 // 지도의 확대 레벨
    }
    
    // 지도를 생성합니다
    const map = new kakao.maps.Map(mapContainer, mapOption)
    
    // 장소 검색 객체를 생성합니다
    const ps = new kakao.maps.services.Places(map)
    
    // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
    const infowindow = new kakao.maps.InfoWindow({zIndex:1})
  
    ps.categorySearch('FD6', placesSearchCB, {useMapBounds:true})
    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      // 정상적으로 검색이 완료됐으면 검색 목록과 마커를 표출합니다
      displayPlaces(data);
      // 페이지 번호를 표출합니다
      displayPagination(pagination);
    }
    
    function displayPlaces(places) {
    
      let listEl = document.getElementById('placesList'), 
      menuEl = document.getElementById('menu-wrap'),
      fragment = document.createDocumentFragment(), 
      bounds = new kakao.maps.LatLngBounds(), 
      listStr = ''
        
      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl)
         // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker()
      
      for ( let i=0; i<places.length; i++ ) {
        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = addMarker(placePosition, i),
        itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title) {
          kakao.maps.event.addListener(marker, 'mouseover', function() {
            displayInfowindow(marker, title)

          })
          kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close()
          })
          
          itemEl.onclick =  function () {
            displayInfowindow(marker, title)
          }
          itemEl.onmouseout =  function () {
            infowindow.close()
          }
        })(marker, places[i].place_name)
        fragment.appendChild(itemEl)
      }
           // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment)
      menuEl.scrollTop = 0
    
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds)
    }

    // 위도 경도 계산
    const lat1 = multiCampusPosition[1] // 멀티캠퍼스 위치
    const lon1 = multiCampusPosition[0] // 멀티캠퍼스 위치
    let lat2, lon2
    
    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {
      
      // 거리 계산
      lat2 = places.x
      lon2 = places.y
      const R = 6371e3; // metres
      let φ1 = lat1 * Math.PI/180; // φ, λ in radians
      let φ2 = lat2 * Math.PI/180;
      let Δφ = (lat2-lat1) * Math.PI/180
      let Δλ = (lon2-lon1) * Math.PI/180

      let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ/2) * Math.sin(Δλ/2)
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      let d = R * c; // in metres
      let time = String(Math.round(d / 61) + 2) + '분' 
      
      let el = document.createElement('li'),
      itemStr = '<div class="row">' + '<div class="column1" style="display:flex; justify-content:center;">' + '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<p style="position:absolute; top:70%; margin-left:2px;">' +  time + '</p>' + '</div>' + '<div class="column2">' +
                '  <div class="info">' +
                '    <h5>' + places.place_name + '</h5>'


    // 도로명 주소
      if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' 
      } 
        let category_name = places.category_name.split('음식점 > ')
        itemStr += '<span class="food">' + category_name[1] + '</span>' + '</div>' + "</div>" + "</div>"
        

        el.innerHTML = itemStr
        el.className = 'item'
        return el
      }

      let campusImageSize = new kakao.maps.Size(24, 35)
      let campusImageSrc = 'img/multiPin.png'
      const markerImage = new kakao.maps.MarkerImage(campusImageSrc, campusImageSize)
      
      const multiCampusMarker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도 [37.5013, 127.0396]
        position: new kakao.maps.LatLng(37.5013, 127.0396), // 마커를 표시할 위치 
        title : '멀티캠퍼스', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage // 마커 이미지 
        })
    


      // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
      function addMarker(position, idx, title) {
        let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage
        })
        
        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers.push(marker);  // 배열에 생성된 마커를 추가합니다
        
        return marker
      }
    
      
      // 지도 위에 표시되고 있는 마커를 모두 제거합니다
      function removeMarker() {
        for ( let i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null)
      }   
      markers = []
    }
  
    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination) {
      let paginationEl = document.getElementById('pagination'),
      fragment = document.createDocumentFragment(),
      i
  
        // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild)
      }
  
      for (i=1; i<=pagination.last; i++) {
        let el = document.createElement('a')
        el.href = "#"
        el.innerHTML = i
  
      if (i===pagination.current) {
        el.className = 'on';
        } else {
          el.onclick = (function(i) {
            return function() {
              pagination.gotoPage(i)
            }
          })(i);
        }
  
        fragment.appendChild(el)
        }
      paginationEl.appendChild(fragment)
    }
  
    // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
    // 인포윈도우에 장소명을 표시합니다
    function displayInfowindow(marker, title) {
      let content = '<div style="padding:5px;z-index:1;">' + title + '</div>'
  
      infowindow.setContent(content)
      infowindow.open(map, marker)

    }
    
    function removeAllChildNods(el) {   
      while (el.hasChildNodes()) {
        el.removeChild (el.lastChild)
      }
    }
  }, [])

  return (
    <div>
      <Box2>
        <Grid container spacing={0}>
          <Grid item xs={0} xl={2}></Grid>
          <Grid item xs={12} xl={8}>
            <Container sx={{marginBottom: 8}}>
              <Box2 sx={{marginLeft: 3, marginBottom: 2}} style={{display:'flex', justifyContent: 'space-between'}}>
                <Box2 style={{ display:'flex', alignItems: 'end'}}>
                  <LocationOnIcon className="locationicon" style={{color:'gold'}}/>

                  <FormControl variant="standard">
                  <InputLabel id="demo-simple-select-standard-label" />
                    <Select
                      sx={{ fontSize:'0.875rem'}}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select"
                      value={region}
                      label="region"
                      onChange={chageRegion}
                    >
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={1}>서울 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={2}>구미 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={3}>대전 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={4}>부울경 캠퍼스</MenuItem>
                      <MenuItem sx={{ fontSize:'0.875rem'}} value={5}>광주 캠퍼스</MenuItem>
                    </Select>
                  </FormControl>
                </Box2>
                {/* <SwitchesGroup /> */}
                <ScrollableTabsButtonForce />
              </Box2>  
              <Box2
                id="box4-background"
                sx={{

                  borderRadius: '20px',
                }}
              >
              <img id="imgsize" src='img/noServiceMap.png' alt="서비스 준비중입니다" style={serviceErrorShow}></img>
              <div style={serviceShow}> 
                {/* 여기서부터 카카오 맵 */}
                <Grid container spacing={0}>
                  <Grid item xs={12} xl={12}>
                    <Container style={{marginTop:"50px", marginBottom:"50px", paddingLeft:"50px", paddingRight:"50px"}}>
                    <div className="map-wrap">
                      <div id="map" style={{width:'100%',height:'100%', position:'relative', overflow:'hidden'}}></div> 
                      <div id="menu-wrap" className="bg-white">
                        <hr/>
                        <ul id="placesList"></ul>
                        <div id="pagination"></div>
                      </div>
                    </div>
                    </Container>
                  </Grid>
                </Grid>
                </div>
              </Box2>
            </Container>
          </Grid>
          <Grid item xs={0} xl={2}></Grid>
        </Grid>
      </Box2>
    </div>
  )
}
