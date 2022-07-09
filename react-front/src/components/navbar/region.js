import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import '../navbar/styles.css'

import { useSelector, useDispatch } from 'react-redux'
import { seoul, daejeon, gwangju, gumi, busan } from '../../module/region'


export default function Region() {
  const [region, setRegion] = useState('seoul')
  const handleChange = e => { setRegion(e.target.value) }


  const selectedRegion = useSelector(state => state.counter.region)
  const dispatch = useDispatch()

  return (
    <div className="region">
      <LocationOnIcon sx={{color: '#3396F4', fontSize: '10'}}  />

      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small">캠퍼스</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={region}
          label="캠퍼스"
          onChange={handleChange}
          className="select"
          selected="seoul"
        >
          <MenuItem value="seoul" >서울캠퍼스</MenuItem>
          <MenuItem value="gumi">구미캠퍼스</MenuItem>
          <MenuItem value="daejeon">대전캠퍼스</MenuItem>
          <MenuItem value="busan">부울경캠퍼스</MenuItem>
          <MenuItem value="gwangju">광주캠퍼스</MenuItem>
      </Select>
      </FormControl>
    </div>
  )
} 