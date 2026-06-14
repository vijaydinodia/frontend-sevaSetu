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
import AboutUs      from './components/AboutUs'
import ContactUs    from './components/ContactUs'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsConditions from './components/TermsConditions'
import CookiePolicy from './components/CookiePolicy'
import FAQ          from './components/FAQ'

// Protected dashboards (have their own sidebars/headers — no shared Navbar)
import UserDashborad      from './dashborads/UserDashborad'
import ProviderDashborad  from './dashborads/ProviderDashborad'
import AdminDashborad     from './dashborads/AdminDashborad'
import SuperAdminDashborad  from './dashborads/superAdminDashborad'
import SuperAdminEditProfile from './dashborads/SuperAdminEditProfile'
import ProtectedRoute from './components/ProtectedRoute'

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
          <Route path="/about"           element={<AboutUs />} />
          <Route path="/contact"         element={<ContactUs />} />
          <Route path="/privacy"         element={<PrivacyPolicy />} />
          <Route path="/terms"           element={<TermsConditions />} />
          <Route path="/cookie-policy"   element={<CookiePolicy />} />
          <Route path="/faq"             element={<FAQ />} />
        </Route>

        {/* ─── Protected dashboards (their own layout) ─── */}
        <Route 
          path="/user-dashboard"         
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashborad />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider-dashboard"     
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <ProviderDashborad />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard"        
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashborad />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/super-admin-dashboard"  
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <SuperAdminDashborad />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/super-admin-edit-profile" 
          element={
            <ProtectedRoute allowedRoles={['superAdmin']}>
              <SuperAdminEditProfile />
            </ProtectedRoute>
          } 
        />

        {/* ─── Catch-all → home ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
