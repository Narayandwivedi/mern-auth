import React from 'react'
import {Routes, Route} from 'react-router-dom'

import Home from "./pages/Home"
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPass from './pages/ResetPass'

const App = () => {
  return (
    <div className=''>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-pass' element={<ResetPass/>}/>
        
      </Routes>
    </div>
  )
}

export default App
