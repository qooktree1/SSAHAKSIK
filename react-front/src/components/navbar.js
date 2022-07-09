import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Box from '@mui/joy/Box'
import SwipeableTemporaryDrawer from './navbar/drawer'
import './styles.css'



export default function Navbar() {
  
  return (
    <div>
      <Box sx={{marginTop: 4}} style={{display:'flex', justifyContent: 'center'}}>
        <Link to="/"><img className="logoimg" alt="logoImage" src="img/ssa_logo.png" /></Link>
        <SwipeableTemporaryDrawer />
      </Box>
      <br/>
      <Outlet />
    </div>
  )
}

