import { useEffect } from 'react'
import { loadUser } from './actions/auth'
import './App.css'
import Navbar from "./components/navbar"
import store from './store'
import setAuthToken from './utils/setAuthToken'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

export default function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <div className="App">
      <Navbar className="d-flex"/>
    </div>
  );
}