import * as React from 'react'
import { Tab, Tabs, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function ScrollableTabsButtonForce() {
  const [value, setValue] = useState(0)
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/') {
      setValue(0)
    } else {
      setValue(1)
    }
  }, [ location ])

  return (
    <div>
    <Box>
      <Tabs
        value={value}
        variant="standard"
      > 
        <Tab value={0} label="싸학식" component={Link} to="/" />
        <Tab value={1} label="싸밖식" component={Link} to="/eatout" />
      </Tabs>
    </Box>
    </div>
  )
}