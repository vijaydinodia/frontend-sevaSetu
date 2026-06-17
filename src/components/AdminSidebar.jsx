import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import useTheme from '../custom_hook/UseTheme'

const AdminSidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, pendingCount }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { key: 'applications', label: 'Applications', icon: <PendingActionsOutlinedIcon fontSize="small" />, badge: pendingCount },
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

  // Theme-aware styles
  const bgSidebar = theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-950 border-zinc-900 text-zinc-100'
  const borderCol = theme === 'light' ? 'border-zinc-200' : 'border-zinc-900'

  return (
    <>
      {/* Mobile overlay backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? '0px' : '17rem',
          minWidth: collapsed ? '0px' : undefined,
        }}
        className={`
          sidebar-col
          flex flex-col border-r transition-all duration-300
          fixed top-0 left-0 z-30
          md:relative md:z-auto md:translate-x-0
          ${bgSidebar} ${borderCol}
          ${collapsed ? '-translate-x-full md:translate-x-0 md:!w-[4.5rem]' : 'translate-x-0'}
        `}
      >
        {/* Logo + toggle */}
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
          {/* toggle button - visible on desktop */}
          <button
            className="ml-auto hidden shrink-0 items-center justify-center h-8 w-8 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition md:flex cursor-pointer"
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
              <AdminPanelSettingsOutlinedIcon style={{ fontSize: 13 }} />
              Admin Panel
            </span>
          </div>
        )}

        {/* Nav - this is the scrollable area */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2">
          {!collapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Menu
            </p>
          )}
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.key || (activeTab === 'providerBookings' && item.key === 'providers') || (activeTab === 'applicationDetail' && item.key === 'applications')
              return (
                <button
                  key={item.key}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-left transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A] border-l-4 border-[#16A34A] pl-2 shadow-sm'
                      : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  } ${collapsed ? 'justify-center pl-3' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.key)
                    if (window.innerWidth < 768) setCollapsed(true)
                  }}
                  title={collapsed ? item.label : ''}
                >
                  <span className={`shrink-0 ${isActive ? 'text-[#16A34A]' : 'text-zinc-450 dark:text-zinc-500'}`}>{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
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

      {/* Mobile menu open button (shown when sidebar is closed) */}
      {collapsed && (
        <button
          className="fixed top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-zinc-200 text-zinc-800 shadow-lg md:hidden"
          onClick={() => setCollapsed(false)}
        >
          <MenuOutlinedIcon fontSize="small" />
        </button>
      )}
    </>
  )
}

export default AdminSidebar
