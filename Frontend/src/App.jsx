import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home.jsx'
import Rental from './components/rentals.jsx'
import Signup from './components/authentication/Signup.jsx'
import Login from './components/authentication/Login.jsx'
import OwnerDashboard from './components/OwnerDashboard.jsx'
import RenterDashboard from './components/RenterDashboard.jsx'
import Fleet from './components/Fleet.jsx'
import CarDetails from './components/CarDetails.jsx'
import BookingPage from './components/BookingPage.jsx'
import Profile from './components/Profile.jsx'
import { Toaster } from 'react-hot-toast'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/owner-dashboard' element={<OwnerDashboard />}></Route>
        <Route path='/renter-dashboard' element={<RenterDashboard />}></Route>
        <Route path='/showroom' element={<Rental />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/fleet' element={<Fleet />}></Route>
        <Route path='/car-details/:id' element={<CarDetails />}></Route>
        <Route path='/book/:id' element={<BookingPage />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </div>
  )
}

export default App
