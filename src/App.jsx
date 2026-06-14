import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'

// Layouts
import PublicLayout from './components/PublicLayout'

// Public pages
import Home         from './components/Home'
import Login        from './components/Login'
import SignUp       from './components/SignUp'
import Forget       from './components/Forget'
import VerifyOtp    from './components/VerifyOtp'
import ResetPassword from './components/ResetPassword'
import BecomeProvider from './components/BecomeProvider'

// Protected dashboards (have their own sidebars/headers — no shared Navbar)
import UserDashborad      from './dashborads/UserDashborad'
import ProviderDashborad  from './dashborads/ProviderDashborad'
import AdminDashborad     from './dashborads/AdminDashborad'
import SuperAdminDashborad  from './dashborads/superAdminDashborad'
import SuperAdminEditProfile from './dashborads/SuperAdminEditProfile'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ─── Home (has its own built-in Navbar) ─── */}
        <Route path="/" element={<Home />} />

        {/* ─── Public pages — Navbar shown via PublicLayout ─── */}
        <Route element={<PublicLayout />}>
          <Route path="/login"           element={<Login />} />
          <Route path="/signup"          element={<SignUp />} />
          <Route path="/become-provider" element={<BecomeProvider />} />
          <Route path="/forget-password" element={<Forget />} />
          <Route path="/verify-otp"      element={<VerifyOtp />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
        </Route>

        {/* ─── Protected dashboards (their own layout) ─── */}
        <Route path="/user-dashboard"         element={<UserDashborad />} />
        <Route path="/provider-dashboard"     element={<ProviderDashborad />} />
        <Route path="/admin-dashboard"        element={<AdminDashborad />} />
        <Route path="/super-admin-dashboard"  element={<SuperAdminDashborad />} />
        <Route path="/super-admin-edit-profile" element={<SuperAdminEditProfile />} />

        {/* ─── Catch-all → home ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
