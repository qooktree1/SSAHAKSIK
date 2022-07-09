import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, } from "react-router-dom"
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import store from './store'
import Eatout from "./routes/eatout"
import Mainpage from "./routes/mainPage"
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Edit from './components/auth/Edit'
import ResetPassword from './components/auth/ResetPassword'
import ChangePassword from './components/auth/ChangePassword'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<App />} >
            <Route path="/eatout" element={<Eatout />} />
            <Route path="/" element={<Mainpage />} />
          </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/change_password" element={<ChangePassword />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
