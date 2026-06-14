import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute Component
 * This component acts as a shield for private pages (dashboards).
 * It checks localStorage for authentication token and user data.
 * If the user is not logged in, it redirects them to the /login page.
 * If allowedRoles is provided, it verifies the user's role and redirects them
 * to their respective dashboard if they don't have permission.
 */
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

  // 2. Role authorization check (if allowedRoles is defined)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user's role is not allowed, redirect them to their correct page based on role
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

  // 3. Authorized user - render the requested page component
  return children
}

export default ProtectedRoute
