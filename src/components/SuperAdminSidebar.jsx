import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import useTheme from '../custom_hook/UseTheme'

const SuperAdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

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
    if (setActiveTab) setActiveTab(key)

    setMobileOpen(false)
  }

  const isOpen = window.innerWidth >= 768 ? true : mobileOpen

  // Theme-aware styles
  const bgSidebar = theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-950 border-zinc-900 text-zinc-100'
  const borderCol = theme === 'light' ? 'border-zinc-200' : 'border-zinc-900'

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          sidebar-col
          flex flex-col border-r transition-all duration-300
          fixed top-0 left-0 z-30
          md:relative md:z-auto
          ${bgSidebar} ${borderCol}
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
          md:translate-x-0
          ${collapsed ? 'md:w-[4.5rem]' : 'md:w-72'}
        `}
      >
        {/* Logo + desktop toggle */}
        <div className={`flex shrink-0 items-center justify-between border-b ${borderCol} p-4 h-[70px]`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-500/10">
                S
              </span>
              <h2 className="m-0 truncate text-base font-semibold tracking-tight text-zinc-900 dark:text-white">SevaSetu</h2>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-500/10">
                S
              </span>
            </Link>
          )}
          {/* toggle - desktop only */}
          <button
            className="ml-auto hidden h-8 w-8 shrink-0 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition md:flex cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
            title="Toggle sidebar"
          >
            {collapsed
              ? <MenuOutlinedIcon fontSize="small" />
              : <MenuOpenOutlinedIcon fontSize="small" />
            }
          </button>
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="shrink-0 px-4 py-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-650 dark:text-zinc-400">
              <SecurityOutlinedIcon style={{ fontSize: 13 }} />
              Super Admin
            </span>
          </div>
        )}

        {/* Nav - scrollable area only */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Menu
            </p>
          )}
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.key
              return (
                <button
                  key={item.key}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A] border-l-4 border-[#16A34A] pl-2 shadow-sm'
                      : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  } ${collapsed ? 'justify-center pl-3' : ''}`}
                  type="button"
                  onClick={() => handleMenuClick(item.key)}
                  title={collapsed ? item.label : ''}
                >
                  <span className={`shrink-0 ${isActive ? 'text-[#16A34A]' : 'text-zinc-450 dark:text-zinc-500'}`}>{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Theme Toggle & Logout section */}
        <div className={`shrink-0 border-t ${borderCol} p-3 flex flex-col gap-1`}>
          {/* Theme Toggle */}
          <button
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all ${collapsed ? 'justify-center pl-3' : ''}`}
            onClick={toggleTheme}
            title={collapsed ? 'Toggle Theme' : `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <DarkModeOutlinedIcon fontSize="small" />
            ) : (
              <LightModeOutlinedIcon fontSize="small" />
            )}
            {!collapsed && <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>

          {/* Logout */}
          <button
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 dark:hover:text-red-450 transition-all ${collapsed ? 'justify-center pl-3' : ''}`}
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
          >
            <LogoutOutlinedIcon fontSize="small" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile hamburger button */}
      {!mobileOpen && (
        <button
          className="fixed top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-800 shadow-lg md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <MenuOutlinedIcon fontSize="small" />
        </button>
      )}
    </>
  )
}

export default SuperAdminSidebar
