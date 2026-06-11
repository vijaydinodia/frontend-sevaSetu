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

const AdminSidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const navigate = useNavigate()

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { key: 'providers', label: 'Providers', icon: <WorkOutlineOutlinedIcon fontSize="small" /> },
    { key: 'bookings', label: 'Bookings', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
    { key: 'reviews', label: 'Reviews', icon: <RateReviewOutlinedIcon fontSize="small" /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

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
          flex flex-col bg-black text-white
          border-r border-white/10
          transition-all duration-300
          fixed top-0 left-0 z-30
          md:relative md:z-auto md:translate-x-0
          ${collapsed ? '-translate-x-full md:translate-x-0 md:!w-[4.5rem]' : 'translate-x-0'}
        `}
      >
        {/* Logo + toggle */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-4">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                S
              </span>
              <h2 className="m-0 truncate text-base font-semibold tracking-tight">SevaSetu</h2>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                S
              </span>
            </Link>
          )}
          {/* toggle button - visible on desktop */}
          <button
            className="ml-auto hidden shrink-0 items-center justify-center h-8 w-8 rounded-xl hover:bg-white/10 transition md:flex"
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
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-400">
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
              const isActive = activeTab === item.key || activeTab === 'providerBookings' && item.key === 'providers'
              return (
                <button
                  key={item.key}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-left transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.key)
                    // close sidebar on mobile after click
                    if (window.innerWidth < 768) setCollapsed(true)
                  }}
                  title={collapsed ? item.label : ''}
                >
                  <span className={`shrink-0 ${isActive ? 'text-black' : ''}`}>{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
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
          className="fixed top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-lg md:hidden"
          onClick={() => setCollapsed(false)}
        >
          <MenuOutlinedIcon fontSize="small" />
        </button>
      )}
    </>
  )
}

export default AdminSidebar
