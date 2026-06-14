import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Button from './ui/Button'
import useTheme from '../custom_hook/UseTheme'

// ---------------------------------------------------------------------------
// Helper — returns the correct dashboard route for each role
// ---------------------------------------------------------------------------
const getDashboardRoute = (role) => {
  if (role === 'provider')   return '/provider-dashboard'
  if (role === 'admin')      return '/admin-dashboard'
  if (role === 'superAdmin') return '/super-admin-dashboard'
  return '/user-dashboard'
}

// ---------------------------------------------------------------------------
// Navbar Component
// Props:
//   user     — user object passed from parent (optional, falls back to localStorage)
//   onLogout — optional callback fired after logout so parent can clear state
// ---------------------------------------------------------------------------
const Navbar = ({ user: userProp, onLogout }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Read logged-in user — prop takes priority, then localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
  const user = userProp || storedUser
  const role = user?.role || null          // null means guest (not logged in)

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setMobileOpen(false)
    if (onLogout) onLogout()
    navigate('/')
  }

  // ── Theme classes ─────────────────────────────────────────────────────────
  const isLight = theme === 'light'
  const navBg   = isLight ? 'bg-[#f8ebe6] border-black/10 text-zinc-900'
                          : 'bg-zinc-950 border-zinc-800 text-white'
  const dropBg  = isLight ? 'bg-[#f8ebe6] border-black/10' : 'bg-zinc-950 border-zinc-800'
  const linkCls = 'hover:text-amber-500 transition-colors duration-150'

  // ── Nav links shown to EVERYONE ───────────────────────────────────────────
  const publicLinks = (
    <>
      <Link to="/"             onClick={() => setMobileOpen(false)} className={linkCls}>Home</Link>
      <a    href="/#how"       onClick={() => setMobileOpen(false)} className={linkCls}>How it works</a>
      <a    href="/#categories" onClick={() => setMobileOpen(false)} className={linkCls}>Categories</a>
      {/* Only show "Become a Partner" to guests and regular users */}
      {role !== 'provider' && role !== 'admin' && role !== 'superAdmin' && (
        <Link to="/become-provider" onClick={() => setMobileOpen(false)} className={linkCls}>
          Become a Partner
        </Link>
      )}
    </>
  )

  // ── Right-side actions ────────────────────────────────────────────────────
  const authActions = role ? (
    // ─ LOGGED-IN USER ─
    <>
      {/* Avatar initials */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white text-xs font-bold shadow-sm">
        {user?.profileImage
          ? <img src={user.profileImage} alt="avatar" className="h-full w-full rounded-full object-cover" />
          : (user?.firstName?.[0] || 'U').toUpperCase()
        }
      </div>

      {/* Role badge */}
      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${isLight ? 'bg-white text-zinc-700' : 'bg-zinc-800 text-zinc-200'}`}>
        {role}
      </span>

      {/* Dashboard link */}
      <Link
        to={getDashboardRoute(role)}
        onClick={() => setMobileOpen(false)}
        className="flex items-center gap-1.5 text-sm font-semibold hover:text-amber-500 transition-colors"
      >
        <DashboardOutlinedIcon fontSize="small" />
        Dashboard
      </Link>

      {/* Logout */}
      <Button size="sm" onClick={handleLogout}>
        <LogoutOutlinedIcon fontSize="small" />
        Logout
      </Button>
    </>
  ) : (
    // ─ GUEST USER ─
    <>
      <Link to="/login" onClick={() => setMobileOpen(false)}>
        <Button variant="outline" size="sm">Login</Button>
      </Link>
      <Link to="/signup" onClick={() => setMobileOpen(false)}>
        <Button variant="gradient" size="sm">Sign Up</Button>
      </Link>
    </>
  )

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-200 ${navBg}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 gap-4">

        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white font-bold text-lg shadow">
            S
          </span>
          <span className="text-xl font-bold tracking-tight">SevaSetu</span>
        </Link>

        {/* ── Center links (hidden on mobile) ──────────────────────────── */}
        <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
          {publicLinks}
        </div>

        {/* ── Right actions (hidden on mobile) ─────────────────────────── */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${isLight ? 'border-zinc-300 hover:bg-zinc-100' : 'border-zinc-700 hover:bg-zinc-800'}`}
            aria-label="Toggle theme"
          >
            {isLight
              ? <DarkModeOutlinedIcon fontSize="small" />
              : <LightModeOutlinedIcon fontSize="small" />
            }
          </button>

          {authActions}
        </div>

        {/* ── Mobile: theme + hamburger ─────────────────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-zinc-300' : 'border-zinc-700'}`}
            aria-label="Toggle theme"
          >
            {isLight
              ? <DarkModeOutlinedIcon fontSize="small" />
              : <LightModeOutlinedIcon fontSize="small" />
            }
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${isLight ? 'border-zinc-300' : 'border-zinc-700'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <CloseOutlinedIcon fontSize="small" />
              : <MenuOutlinedIcon fontSize="small" />
            }
          </button>
        </div>

      </div>

      {/* ── Mobile dropdown ────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className={`border-t px-5 py-5 flex flex-col gap-4 text-sm font-semibold md:hidden ${dropBg}`}>
          {/* Public nav links */}
          <div className="flex flex-col gap-3">
            {publicLinks}
          </div>

          {/* Divider */}
          <div className={`h-px w-full ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

          {/* Auth actions */}
          <div className="flex flex-col gap-3">
            {authActions}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
