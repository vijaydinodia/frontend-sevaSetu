import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MenuOpenOutlinedIcon from '@mui/icons-material/MenuOpenOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import useTheme from '../custom_hook/UseTheme'

const ProviderSidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, provider, userDetails }) => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [isOnline, setIsOnline] = useState(() => {
    return localStorage.getItem('provider_online') !== 'false'
  })

  const toggleOnlineStatus = () => {
    const nextState = !isOnline
    setIsOnline(nextState)
    localStorage.setItem('provider_online', String(nextState))
    // Trigger custom event so other components know status updated
    window.dispatchEvent(new Event('provider_online_change'))
  }

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
    { key: 'bookings', label: 'Bookings', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
    { key: 'calendar', label: 'Calendar', icon: <CalendarMonthOutlinedIcon fontSize="small" /> },
    { key: 'customers', label: 'Customers', icon: <PersonOutlineOutlinedIcon fontSize="small" /> },
    { key: 'services', label: 'Services', icon: <EngineeringOutlinedIcon fontSize="small" /> },
    { key: 'reviews', label: 'Reviews', icon: <RateReviewOutlinedIcon fontSize="small" /> },
    { key: 'earnings', label: 'Earnings', icon: <CurrencyRupeeOutlinedIcon fontSize="small" /> },
    { key: 'messages', label: 'Messages', icon: <MessageOutlinedIcon fontSize="small" /> },
    { key: 'notifications', label: 'Notifications', icon: <NotificationsOutlinedIcon fontSize="small" /> },
    { key: 'profile', label: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // Styles based on theme (SaaS theme emphasizes white clean light-mode)
  const bgSidebar = theme === 'light' ? 'bg-white border-zinc-200/80 text-zinc-900' : 'bg-zinc-950 border-zinc-900 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'
  const borderCol = theme === 'light' ? 'border-zinc-150' : 'border-zinc-900'

  return (
    <>
      {/* Mobile overlay backdrop */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-45 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col h-screen shrink-0 border-r transition-all duration-300 ease-in-out
          fixed top-0 left-0 z-50 md:relative md:z-auto md:translate-x-0
          ${bgSidebar} ${borderCol}
          ${collapsed ? '-translate-x-full md:translate-x-0 md:w-[70px]' : 'translate-x-0 w-[260px]'}
        `}
      >
        {/* Logo and collapse button */}
        <div className={`flex shrink-0 items-center justify-between p-5 border-b ${borderCol} h-[70px]`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-500/10">
                S
              </span>
              <h2 className="m-0 truncate text-lg font-black tracking-tight text-zinc-900 dark:text-white">SevaSetu</h2>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="mx-auto">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-emerald-600 text-sm font-extrabold text-white shadow-md shadow-emerald-500/10">
                S
              </span>
            </Link>
          )}
          
          <button
            className={`hidden shrink-0 items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors md:flex cursor-pointer ${collapsed ? 'mx-auto' : 'ml-auto'}`}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <MenuOutlinedIcon fontSize="small" /> : <MenuOpenOutlinedIcon fontSize="small" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                className={`
                  flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-left transition-all duration-150 cursor-pointer
                  ${isActive 
                    ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A] border-l-4 border-[#16A34A] pl-2' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                  ${collapsed ? 'justify-center pl-3' : ''}
                `}
                type="button"
                onClick={() => {
                  setActiveTab(item.key)
                  if (window.innerWidth < 768) setCollapsed(true)
                }}
                title={collapsed ? item.label : ''}
              >
                <span className={`shrink-0 ${isActive ? 'text-[#16A34A]' : 'text-zinc-450 dark:text-zinc-500'}`}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Theme Toggle & Logout section */}
        <div className={`shrink-0 border-t ${borderCol} p-3 flex flex-col gap-1`}>
          {/* Theme Toggle */}
          <button
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-left transition-all duration-150 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 ${collapsed ? 'justify-center pl-3' : ''}`}
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
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-left transition-all duration-150 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 dark:hover:text-red-400 ${collapsed ? 'justify-center pl-3' : ''}`}
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
          >
            <LogoutOutlinedIcon fontSize="small" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Profile Card & Quick settings bottom */}
        <div className={`shrink-0 border-t ${borderCol} p-4 bg-zinc-50/50 dark:bg-zinc-900/10`}>
          {!collapsed ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100">
                    {userDetails?.profileImage ? (
                      <img className="h-full w-full object-cover" src={userDetails.profileImage} alt="profile" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-850 text-white font-bold text-sm">
                        {userDetails?.firstName?.charAt(0).toUpperCase() || 'P'}
                      </div>
                    )}
                  </div>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950 ${isOnline ? 'bg-[#10B981]' : 'bg-zinc-400'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-100">
                    {userDetails ? `${userDetails.firstName} ${userDetails.lastName}` : 'Vijay Sharma'}
                  </h4>
                  <p className="text-[10px] truncate text-zinc-400 font-semibold uppercase tracking-wider">
                    {provider?.businessName ? provider.businessName : 'Service Expert'}
                  </p>
                </div>

                {/* Online toggle */}
                <button
                  onClick={toggleOnlineStatus}
                  className={`text-zinc-400 hover:text-[#16A34A] dark:hover:text-[#10B981] cursor-pointer p-1 rounded-lg hover:bg-zinc-150/40`}
                  title={isOnline ? "Switch to Offline" : "Switch to Online"}
                >
                  {isOnline ? (
                    <ToggleOnIcon style={{ color: '#10B981', fontSize: 32 }} />
                  ) : (
                    <ToggleOffIcon style={{ color: '#9CA3AF', fontSize: 32 }} />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3.5">
              <div className="relative cursor-pointer" onClick={toggleOnlineStatus} title={isOnline ? "Online (Click to toggle)" : "Offline (Click to toggle)"}>
                <div className="h-9 w-9 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100">
                  {userDetails?.profileImage ? (
                    <img className="h-full w-full object-cover" src={userDetails.profileImage} alt="profile" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white font-bold text-xs">
                      {userDetails?.firstName?.charAt(0).toUpperCase() || 'P'}
                    </div>
                  )}
                </div>
                <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white dark:border-zinc-950 ${isOnline ? 'bg-[#10B981]' : 'bg-zinc-400'}`} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile drawer open button (shown when sidebar is closed on mobile) */}
      {collapsed && (
        <button
          className="fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-800 shadow-md hover:bg-zinc-50 md:hidden cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <MenuOutlinedIcon fontSize="small" />
        </button>
      )}
    </>
  )
}

export default ProviderSidebar
