import React from 'react'
import {BrowserRouter , Route , Routes} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Forget from './components/Forget'
import VerifyOtp from './components/VerifyOtp'
import ResetPassword from './components/ResetPassword'
import UserDashborad from './dashborads/UserDashborad'
import ProviderDashborad from './dashborads/ProviderDashborad'
import AdminDashborad from './dashborads/AdminDashborad'
import SuperAdminDashborad from './dashborads/superAdminDashborad'
import SuperAdminEditProfile from './dashborads/SuperAdminEditProfile'
const App = () => {
  return (
   <BrowserRouter>
   
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forget-password" element={<Forget />} />
    <Route path="/verify-otp" element={<VerifyOtp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/user-dashboard" element={<UserDashborad />} />
    <Route path="/provider-dashboard" element={<ProviderDashborad />} />
    <Route path="/admin-dashboard" element={<AdminDashborad />} />
    <Route path="/super-admin-dashboard" element={<SuperAdminDashborad />} />
    <Route path="/super-admin-edit-profile" element={<SuperAdminEditProfile />} />
   </Routes>
   
   </BrowserRouter>
  )
}

export default App
