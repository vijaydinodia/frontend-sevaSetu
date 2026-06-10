import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Button from './ui/Button'

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between gap-4 border-b border-black/10 bg-[#f8ebe6] px-5 py-5">
      <Link to="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">S</span>
        <h2 className="m-0 text-xl font-semibold text-black">SevaSetu</h2>
      </Link>

      <div className="flex flex-wrap items-center justify-end gap-3 text-sm font-semibold">
        {role === 'user' && <Link to="/user-dashboard" className="flex items-center gap-1"><DashboardOutlinedIcon fontSize="small" /> User Dashboard</Link>}
        {role === 'provider' && <Link to="/provider-dashboard" className="flex items-center gap-1"><DashboardOutlinedIcon fontSize="small" /> Provider Dashboard</Link>}
        {role === 'admin' && <Link to="/admin-dashboard" className="flex items-center gap-1"><DashboardOutlinedIcon fontSize="small" /> Admin Dashboard</Link>}
        {role === 'superAdmin' && <Link to="/super-admin-dashboard" className="flex items-center gap-1"><DashboardOutlinedIcon fontSize="small" /> Super Admin Dashboard</Link>}

        <span className="rounded-full bg-white px-4 py-2 text-black">{role}</span>
        <Button onClick={handleLogout} size="sm">
          <LogoutOutlinedIcon fontSize="small" />
          Logout
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
