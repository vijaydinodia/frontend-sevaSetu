import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'

const SuperAdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate()

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { key: 'categories', label: 'Categories', icon: <CategoryOutlinedIcon fontSize="small" /> },
    { key: 'users', label: 'Users', icon: <GroupOutlinedIcon fontSize="small" /> },
    { key: 'admins', label: 'Admins', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" /> },
    { key: 'providers', label: 'Providers', icon: <WorkOutlineOutlinedIcon fontSize="small" /> },
    { key: 'bookings', label: 'Bookings', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
    { key: 'reviews', label: 'Reviews', icon: <RateReviewOutlinedIcon fontSize="small" /> },
    { key: 'locations', label: 'Locations', icon: <LocationOnOutlinedIcon fontSize="small" /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleMenuClick = (key) => {
    if (setActiveTab) {
      setActiveTab(key)
      navigate('/super-admin-dashboard')
    } else {
      navigate('/super-admin-dashboard')
    }
  }

  return (
    <aside className="w-full border-r border-black/10 bg-black p-5 text-white md:min-h-screen md:w-72">
      <Link to="/" className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">S</span>
        <h2 className="m-0 text-xl font-semibold">SevaSetu</h2>
      </Link>

      <div className="flex flex-col gap-2 text-sm font-semibold">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-white/10 ${
              activeTab === item.key ? 'bg-white text-black hover:bg-white' : ''
            }`}
            type="button"
            onClick={() => handleMenuClick(item.key)}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <Link className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-white/10" to="/super-admin-edit-profile">
          <EditOutlinedIcon fontSize="small" /> Edit Profile
        </Link>

        <button className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-left hover:bg-white/10" onClick={handleLogout}>
          <LogoutOutlinedIcon fontSize="small" /> Logout
        </button>
      </div>
    </aside>
  )
}

export default SuperAdminSidebar
