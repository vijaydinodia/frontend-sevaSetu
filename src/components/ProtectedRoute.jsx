import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Retrieve token and user details from localStorage
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')

  // 1. Check if token or user info is missing
  if (!token || !userJson) {
    // Redirect to login page
    return <Navigate to="/login" replace />
  }

  let user = {}
  try {
    user = JSON.parse(userJson)
  } catch (error) {
    // If user JSON is corrupt or invalid, clear localStorage and redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  // 2. Role authorization check 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'provider') {
      return <Navigate to="/provider-dashboard" replace />
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />
    } else if (user.role === 'superAdmin') {
      return <Navigate to="/super-admin-dashboard" replace />
    } else {
      return <Navigate to="/user-dashboard" replace />
    }
  }
  
  return children
}

export default ProtectedRoute
