import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import Button from './ui/Button'
import useTheme from '../custom_hook/UseTheme'

const getDashboardRoute = (role) => {
  if (role === 'provider')   return '/provider-dashboard'
  if (role === 'admin')      return '/admin-dashboard'
  if (role === 'superAdmin') return '/super-admin-dashboard'
  return '/user-dashboard'
}

const Navbar = ({ user: userProp, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Read logged-in user — prop takes priority, then localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const user = userProp || storedUser
  const role = user?.role || null        

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setMobileOpen(false)
    if (onLogout) onLogout()
    navigate('/')
  }

  const handleMenuClick = (anchorId) => {
    setMobileOpen(false)
    if (location.pathname === '/') {
      const element = document.getElementById(anchorId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const isLight = theme === 'light'
  const navBg = isLight 
    ? 'bg-white/80 border-zinc-200 text-[#111827]'
    : 'bg-zinc-950/80 border-zinc-800 text-white'
  const dropBg = isLight ? 'bg-white border-zinc-200' : 'bg-zinc-950 border-zinc-800'

  const menuItems = [
    { label: 'Why Us', id: 'why-us' },
    { label: 'Services', id: 'services' },
    { label: 'Cities', id: 'cities' },
    { label: 'How It Works', id: 'how' },
    { label: 'FAQs', id: 'faq' }
  ]

  // Right-side actions 
  const authActions = role ? (
    <div className="flex items-center gap-4">
      {/* Avatar initials */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white text-xs font-bold shadow-sm">
        {user?.profileImage
          ? <img src={user.profileImage} alt="avatar" className="h-full w-full rounded-full object-cover" loading="lazy" />
          : (user?.firstName?.[0] || 'U').toUpperCase()
        }
      </div>

      {/* Role badge */}
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${isLight ? 'bg-zinc-100 text-zinc-700' : 'bg-zinc-850 text-zinc-300'}`}>
        {role}
      </span>

      {/* Dashboard link */}
      <Link
        to={getDashboardRoute(role)}
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-1.5 text-sm font-semibold hover:text-[#16A34A] transition-colors"
        title="Dashboard"
      >
        <DashboardOutlinedIcon fontSize="small" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      {/* Logout */}
      <Button size="sm" variant="outline" onClick={handleLogout} title="Logout" className="border-zinc-200 text-[#111827] hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900">
        <LogoutOutlinedIcon fontSize="small" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2.5">
      <Link to="/login" onClick={() => setMobileOpen(false)}>
        <Button variant="outline" size="sm" title="Login" className="border-zinc-200 text-[#111827] hover:bg-zinc-50">
          <LoginOutlinedIcon fontSize="small" />
          Login
        </Button>
      </Link>
      <Link to="/signup" onClick={() => setMobileOpen(false)}>
        <Button variant="gradient" size="sm" title="Sign Up" className="bg-[#16A34A] hover:bg-[#15803D] text-white">
          <PersonAddOutlinedIcon fontSize="small" />
          Sign Up
        </Button>
      </Link>
    </div>
  )

  return (
    <nav className={`sticky top-0 z-50 h-20 w-full border-b backdrop-blur-md transition-colors duration-200 ${navBg}`}>
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16A34A] text-white font-extrabold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            S
          </span>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#111827] to-[#374151] dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
            SevaSetu
          </span>
        </Link>

        {/* Center Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/#${item.id}`}
              onClick={() => handleMenuClick(item.id)}
              className="text-[#6B7280] hover:text-[#16A34A] dark:text-zinc-300 dark:hover:text-[#16A34A] text-sm font-semibold transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer ${isLight ? 'border-zinc-200 hover:bg-zinc-50' : 'border-zinc-800 hover:bg-zinc-900'}`}
            aria-label="Toggle theme"
          >
            {isLight
              ? <DarkModeOutlinedIcon fontSize="small" className="text-zinc-600" />
              : <LightModeOutlinedIcon fontSize="small" className="text-zinc-300" />
            }
          </button>

          {authActions}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}
            aria-label="Toggle theme"
          >
            {isLight
              ? <DarkModeOutlinedIcon fontSize="small" className="text-zinc-600" />
              : <LightModeOutlinedIcon fontSize="small" className="text-zinc-300" />
            }
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-zinc-200' : 'border-zinc-800'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <CloseOutlinedIcon fontSize="small" />
              : <MenuOutlinedIcon fontSize="small" />
            }
          </button>
        </div>

      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className={`absolute top-20 left-0 w-full border-b shadow-lg flex flex-col p-6 gap-6 text-sm font-semibold transition-all duration-300 animate-fade-up md:hidden ${dropBg}`}>
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                onClick={() => handleMenuClick(item.id)}
                className="text-[#6B7280] hover:text-[#16A34A] dark:text-zinc-300 dark:hover:text-[#16A34A] py-2 transition-colors border-b border-zinc-100 dark:border-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {authActions}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
