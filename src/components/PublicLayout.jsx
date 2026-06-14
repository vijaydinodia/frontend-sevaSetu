import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import useTheme from '../custom_hook/UseTheme'

// ─────────────────────────────────────────────────────────────────────────────
// PublicLayout — wraps every unprotected route with:
//   • the shared Navbar (theme-aware)
//   • a full-height background that changes with the active theme
// ─────────────────────────────────────────────────────────────────────────────
const PublicLayout = () => {
  const { theme } = useTheme()

  const bg = theme === 'light'
    ? 'bg-[#f8ebe6] text-zinc-900'
    : 'bg-zinc-950 text-zinc-100'

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bg}`}>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default PublicLayout
