import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import API_URL from '../api'
import AdminSidebar from '../components/AdminSidebar'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const AdminDashborad = () => {
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState(savedUser)
  const [providers, setProviders] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  // for bookings by provider view
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [providerBookings, setProviderBookings] = useState([])
  const [providerBookingsLoading, setProviderBookingsLoading] = useState(false)

  const token = localStorage.getItem('token')

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  })

  const getUserName = (item) => {
    const u = item?.user || item
    return `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || u?.email || 'N/A'
  }

  // fetch all data from admin endpoints
  const fetchData = async () => {
    setLoading(true)
    setMessage('')

    try {
      if (!token) {
        navigate('/login')
        return
      }

      const [profileRes, providerRes, bookingRes, reviewRes] = await Promise.all([
        axios.get(`${API_URL}/admin/profile`, getHeaders()),
        axios.get(`${API_URL}/admin/provider/getall`, getHeaders()),
        axios.get(`${API_URL}/admin/booking/by-category`, getHeaders()),
        axios.get(`${API_URL}/admin/review/getall`, getHeaders()),
      ])

      const profileUser = profileRes.data.data?.user || profileRes.data.data || savedUser
      setProfile(profileUser)
      setProviders(providerRes.data.data || [])
      setBookings(bookingRes.data.data || [])
      setReviews(reviewRes.data.data || [])
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
      if (error.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  // approve provider - sends email automatically from backend
  const handleApproveProvider = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/admin/provider/approve/${id}`, {}, getHeaders())
      setMessage(res.data.message || 'Provider approved and email sent')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // reject provider
  const handleRejectProvider = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/admin/provider/reject/${id}`, {}, getHeaders())
      setMessage(res.data.message || 'Provider rejected')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // change provider status active/inactive
  const handleProviderStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/admin/provider/status/${id}`, { status }, getHeaders())
      setMessage(res.data.message || 'Provider status updated')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // soft delete provider
  const handleSoftDeleteProvider = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/provider/soft-delete/${id}`, getHeaders())
      setMessage('Provider soft deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // hard delete provider
  const handleHardDeleteProvider = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/provider/hard-delete/${id}`, getHeaders())
      setMessage('Provider permanently deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // restore provider
  const handleRestoreProvider = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/provider/restore/${id}`, {}, getHeaders())
      setMessage('Provider restored')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // get bookings by a specific provider
  const handleViewProviderBookings = async (provider) => {
    setSelectedProvider(provider)
    setProviderBookingsLoading(true)
    setActiveTab('providerBookings')

    try {
      const res = await axios.get(`${API_URL}/admin/booking/by-provider/${provider._id}`, getHeaders())
      setProviderBookings(res.data.data || [])
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setProviderBookingsLoading(false)
    }
  }

  // update booking status
  const handleBookingStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/booking/status/${id}`, { status }, getHeaders())
      setMessage('Booking status updated')
      fetchData()
      // also refresh provider bookings if we are on that tab
      if (selectedProvider) {
        const res = await axios.get(`${API_URL}/admin/booking/by-provider/${selectedProvider._id}`, getHeaders())
        setProviderBookings(res.data.data || [])
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // soft delete booking
  const handleSoftDeleteBooking = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/booking/soft-delete/${id}`, getHeaders())
      setMessage('Booking soft deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // hard delete booking
  const handleHardDeleteBooking = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/booking/hard-delete/${id}`, getHeaders())
      setMessage('Booking permanently deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // restore booking
  const handleRestoreBooking = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/booking/restore/${id}`, {}, getHeaders())
      setMessage('Booking restored')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // soft delete review
  const handleSoftDeleteReview = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/review/soft-delete/${id}`, getHeaders())
      setMessage('Review soft deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // hard delete review
  const handleHardDeleteReview = async (id) => {
    try {
      await axios.delete(`${API_URL}/admin/review/hard-delete/${id}`, getHeaders())
      setMessage('Review permanently deleted')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // restore review
  const handleRestoreReview = async (id) => {
    try {
      await axios.put(`${API_URL}/admin/review/restore/${id}`, {}, getHeaders())
      setMessage('Review restored')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // computed values for stat cards
  const approvedProviders = providers.filter((p) => p.kycStatus === 'approved').length
  const pendingProviders = providers.filter((p) => p.kycStatus === 'pending').length
  const completedBookings = bookings.filter((b) => b.status === 'completed').length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : '0.0'

  const statCards = [
    {
      title: 'Providers',
      value: providers.length,
      icon: <WorkOutlineOutlinedIcon />,
      tab: 'providers',
      bg: 'bg-pink-50',
      text: 'text-pink-600',
    },
    {
      title: 'Approved',
      value: approvedProviders,
      icon: <CheckCircleOutlineOutlinedIcon />,
      tab: 'providers',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      title: 'Pending KYC',
      value: pendingProviders,
      icon: <PendingActionsOutlinedIcon />,
      tab: 'providers',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    {
      title: 'Bookings',
      value: bookings.length,
      icon: <CalendarMonthOutlinedIcon />,
      tab: 'bookings',
      bg: 'bg-orange-50',
      text: 'text-orange-500',
    },
    {
      title: 'Completed',
      value: completedBookings,
      icon: <CheckCircleOutlineOutlinedIcon />,
      tab: 'bookings',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: <PendingActionsOutlinedIcon />,
      tab: 'bookings',
      bg: 'bg-sky-50',
      text: 'text-sky-600',
    },
    {
      title: 'Reviews',
      value: reviews.length,
      icon: <RateReviewOutlinedIcon />,
      tab: 'reviews',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
    },
    {
      title: 'Avg Rating',
      value: avgRating,
      icon: <StarOutlineOutlinedIcon />,
      tab: 'reviews',
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
  ]

  const recentBookings = [...bookings].slice(0, 5)
  const recentProviders = [...providers].slice(0, 5)

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main */}
      <div className="main-col flex flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-[#f8ebe6] px-5 py-4">
          <div className="hidden items-center gap-2 text-sm font-semibold text-zinc-500 md:flex">
            <AdminPanelSettingsOutlinedIcon fontSize="small" />
            <span>Admin</span>
            <span className="text-zinc-300">/</span>
            <span className="capitalize text-black">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'providerBookings' ? 'Provider Bookings' : activeTab}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {loading && (
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-500 shadow-sm">
                Loading…
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowEditProfile(true)}>
              <PersonOutlineOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </Button>
          </div>
        </header>


        <main className="flex-1 p-5 md:p-8">
          {/* Welcome banner */}
          <Card className="mb-6 overflow-hidden p-0">
            <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                  {profile?.profileImage ? (
                    <img
                      className="h-full w-full rounded-2xl object-cover"
                      src={profile.profileImage}
                      alt="profile"
                    />
                  ) : (
                    <PersonOutlineOutlinedIcon fontSize="medium" />
                  )}
                </div>
                <div>
                  <p className="m-0 text-sm font-semibold text-zinc-500">Welcome back 👋</p>
                  <h1 className="m-0 text-2xl font-semibold text-black">
                    {`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || profile?.email || 'Admin'}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    Here's what's happening with your category today.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8ebe6] px-3 py-1.5 text-xs font-semibold text-zinc-700">
                  <AdminPanelSettingsOutlinedIcon style={{ fontSize: 14 }} />
                  Admin
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />
          </Card>

          {/* Message */}
          {message && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <p className="m-0 text-sm font-semibold text-zinc-700">{message}</p>
              <button
                className="ml-auto text-xs text-zinc-400 hover:text-zinc-700"
                onClick={() => setMessage('')}
              >
                ✕
              </button>
            </div>
          )}

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                  <button
                    key={item.title}
                    className="rounded-[28px] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    type="button"
                    onClick={() => setActiveTab(item.tab)}
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${item.bg} ${item.text}`}>
                      {item.icon}
                    </div>
                    <p className="m-0 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {item.title}
                    </p>
                    <p className="m-0 mt-1 text-3xl font-bold text-black">{item.value}</p>
                  </button>
                ))}
              </div>

              {/* Quick overview */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="m-0 text-lg font-semibold text-black">Recent Bookings</h2>
                    <button
                      className="text-xs font-semibold text-purple-600 hover:underline"
                      onClick={() => setActiveTab('bookings')}
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentBookings.length === 0 && (
                      <p className="text-sm text-zinc-400">No bookings in your category yet.</p>
                    )}
                    {recentBookings.map((b) => (
                      <div
                        key={b._id}
                        className="flex items-center justify-between rounded-2xl bg-[#f8ebe6] px-4 py-3"
                      >
                        <div>
                          <p className="m-0 text-sm font-semibold text-black">
                            #{b.bookingNumber || b._id?.slice(-6)}
                          </p>
                          <p className="m-0 text-xs text-zinc-500">{b.city || 'N/A'}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Providers */}
                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="m-0 text-lg font-semibold text-black">Recent Providers</h2>
                    <button
                      className="text-xs font-semibold text-purple-600 hover:underline"
                      onClick={() => setActiveTab('providers')}
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentProviders.length === 0 && (
                      <p className="text-sm text-zinc-400">No providers yet.</p>
                    )}
                    {recentProviders.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center gap-3 rounded-2xl bg-[#f8ebe6] px-4 py-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white">
                          {(p?.user?.firstName?.[0] || 'P').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="m-0 truncate text-sm font-semibold text-black">
                            {getUserName(p)}
                          </p>
                          <p className="m-0 truncate text-xs text-zinc-500">{p.businessName || 'N/A'}</p>
                        </div>
                        <KycBadge status={p.kycStatus} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── PROVIDERS TAB ── */}
          {activeTab === 'providers' && (
            <Card className="p-5">
              <SectionTitle title="Providers" count={providers.length} loading={loading} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead>
                    <tr className="bg-[#f8ebe6] text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <th className="rounded-l-2xl p-3 pl-4">Provider</th>
                      <th className="p-3">Business</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Deleted</th>
                      <th className="rounded-r-2xl p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-zinc-400">
                          No providers found.
                        </td>
                      </tr>
                    )}
                    {providers.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                      >
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white">
                              {(item?.user?.firstName?.[0] || 'P').toUpperCase()}
                            </div>
                            <div>
                              <p className="m-0 font-semibold text-black">{getUserName(item)}</p>
                              <p className="m-0 text-xs text-zinc-500">
                                {item?.user?.email || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-zinc-600">{item.businessName || 'N/A'}</td>
                        <td className="p-3">
                          <KycBadge status={item.kycStatus} />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 font-semibold text-yellow-500">
                            <StarOutlineOutlinedIcon style={{ fontSize: 16 }} />
                            {item.averageRating || '0'}
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${item.isDeleted ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}
                          >
                            {item.isDeleted ? 'Deleted' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {/* Approve button - only show if not yet approved */}
                            {item.kycStatus !== 'approved' && (
                              <Button
                                size="sm"
                                variant="gradient"
                                onClick={() => handleApproveProvider(item._id)}
                              >
                                <CheckOutlinedIcon fontSize="inherit" />
                                Approve
                              </Button>
                            )}

                            {/* Reject button - only show if not yet rejected */}
                            {item.kycStatus !== 'rejected' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectProvider(item._id)}
                              >
                                <CloseOutlinedIcon fontSize="inherit" />
                                Reject
                              </Button>
                            )}

                            {/* View provider bookings */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProviderBookings(item)}
                            >
                              Bookings
                            </Button>

                            {/* Status toggle */}
                            <select
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-purple-400"
                              onChange={(e) => handleProviderStatus(item._id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Status</option>
                              <option value="active">active</option>
                              <option value="inactive">inactive</option>
                            </select>

                            {/* Restore or soft delete */}
                            {item.isDeleted ? (
                              <>
                                <Button size="sm" onClick={() => handleRestoreProvider(item._id)}>
                                  Restore
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleHardDeleteProvider(item._id)}
                                >
                                  Hard Delete
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSoftDeleteProvider(item._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── BOOKINGS BY CATEGORY TAB ── */}
          {activeTab === 'bookings' && (
            <Card className="p-5">
              <SectionTitle title="Bookings (My Category)" count={bookings.length} loading={loading} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left text-sm">
                  <thead>
                    <tr className="bg-[#f8ebe6] text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <th className="rounded-l-2xl p-3 pl-4">Booking</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Provider</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="rounded-r-2xl p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-sm text-zinc-400">
                          No bookings found in your category.
                        </td>
                      </tr>
                    )}
                    {bookings.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                      >
                        <td className="p-3 pl-4 font-semibold text-black">
                          #{item.bookingNumber || item._id?.slice(-6)}
                        </td>
                        <td className="p-3 text-zinc-700">{getUserName(item.customer)}</td>
                        <td className="p-3 text-zinc-700">{getUserName(item.provider)}</td>
                        <td className="p-3 text-zinc-600">{item.city || 'N/A'}</td>
                        <td className="p-3 font-semibold text-black">₹{item.amount || 0}</td>
                        <td className="p-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-purple-400"
                              value={item.status}
                              onChange={(e) => handleBookingStatus(item._id, e.target.value)}
                            >
                              <option value="pending">pending</option>
                              <option value="accepted">accepted</option>
                              <option value="on_the_way">on the way</option>
                              <option value="started">started</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                              <option value="rejected">rejected</option>
                            </select>

                            {item.isDeleted ? (
                              <>
                                <Button size="sm" onClick={() => handleRestoreBooking(item._id)}>
                                  Restore
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleHardDeleteBooking(item._id)}
                                >
                                  Hard Delete
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSoftDeleteBooking(item._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── PROVIDER BOOKINGS TAB ── */}
          {activeTab === 'providerBookings' && (
            <Card className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <button
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
                  onClick={() => setActiveTab('providers')}
                >
                  ← Back to Providers
                </button>
                <SectionTitle
                  title={`Bookings by ${getUserName(selectedProvider)}`}
                  count={providerBookings.length}
                  loading={providerBookingsLoading}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="bg-[#f8ebe6] text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <th className="rounded-l-2xl p-3 pl-4">Booking</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="rounded-r-2xl p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerBookings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-zinc-400">
                          No bookings found for this provider.
                        </td>
                      </tr>
                    )}
                    {providerBookings.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                      >
                        <td className="p-3 pl-4 font-semibold text-black">
                          #{item.bookingNumber || item._id?.slice(-6)}
                        </td>
                        <td className="p-3 text-zinc-700">{getUserName(item.customer)}</td>
                        <td className="p-3 text-zinc-600">{item.city || 'N/A'}</td>
                        <td className="p-3 font-semibold text-black">₹{item.amount || 0}</td>
                        <td className="p-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-purple-400"
                              value={item.status}
                              onChange={(e) => handleBookingStatus(item._id, e.target.value)}
                            >
                              <option value="pending">pending</option>
                              <option value="accepted">accepted</option>
                              <option value="on_the_way">on the way</option>
                              <option value="started">started</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                              <option value="rejected">rejected</option>
                            </select>

                            {item.isDeleted ? (
                              <>
                                <Button size="sm" onClick={() => handleRestoreBooking(item._id)}>
                                  Restore
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleHardDeleteBooking(item._id)}
                                >
                                  Hard Delete
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSoftDeleteBooking(item._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <Card className="p-5">
              <SectionTitle title="Reviews & Ratings" count={reviews.length} loading={loading} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {reviews.length === 0 && (
                  <p className="col-span-3 text-center text-sm text-zinc-400">No reviews yet.</p>
                )}
                {reviews.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col gap-3 rounded-[24px] bg-[#f8ebe6] p-4"
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarOutlineOutlinedIcon
                          key={i}
                          style={{ fontSize: 16 }}
                          className={i < (item.rating || 0) ? 'text-yellow-400' : 'text-zinc-300'}
                        />
                      ))}
                      <span className="ml-1 text-xs font-semibold text-zinc-500">
                        {item.rating}/5
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="m-0 line-clamp-3 text-sm text-zinc-700">
                      {item.review || 'No review text.'}
                    </p>

                    {/* Customer and provider */}
                    <div className="flex flex-col gap-1 text-xs text-zinc-500">
                      <span>
                        By <span className="font-semibold text-black">{getUserName(item.customer)}</span>
                      </span>
                      <span>
                        For <span className="font-semibold text-black">{getUserName(item.provider)}</span>
                      </span>
                    </div>

                    {/* Status and actions */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${item.isDeleted ? 'text-red-500' : 'text-emerald-600'}`}>
                        {item.isDeleted ? 'Deleted' : 'Active'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {item.isDeleted ? (
                        <>
                          <Button size="sm" onClick={() => handleRestoreReview(item._id)}>
                            Restore
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleHardDeleteReview(item._id)}
                          >
                            Hard Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSoftDeleteReview(item._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onSuccess={(updatedUser) => {
            setProfile(updatedUser)
            setShowEditProfile(false)
          }}
          uploadEndpoint={`${API_URL}/user/upload/image`}
          profileEndpoint={`${API_URL}/user/edit-profile`}
        />
      )}
    </div>
  )
}

/* ── Helper Components ── */

const SectionTitle = ({ title, count, loading }) => (
  <div className="mb-5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h2 className="m-0 text-2xl font-semibold text-black">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-[#f8ebe6] px-3 py-1 text-sm font-semibold text-zinc-600">
          {count}
        </span>
      )}
    </div>
    {loading && (
      <span className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-400" />
        Loading…
      </span>
    )}
  </div>
)

const statusConfig = {
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-zinc-100 text-zinc-500',
  blocked: 'bg-red-50 text-red-600',
  pending: 'bg-yellow-50 text-yellow-700',
  accepted: 'bg-blue-50 text-blue-700',
  on_the_way: 'bg-sky-50 text-sky-700',
  started: 'bg-indigo-50 text-indigo-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-500',
  rejected: 'bg-red-100 text-red-700',
}

const StatusBadge = ({ status, className = '' }) => {
  const cls = statusConfig[status] || 'bg-zinc-100 text-zinc-500'
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cls} ${className}`}
    >
      {status ? status.replaceAll('_', ' ') : 'N/A'}
    </span>
  )
}

const kycConfig = {
  approved: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-yellow-50 text-yellow-700',
  rejected: 'bg-red-50 text-red-600',
}

const KycBadge = ({ status }) => {
  const cls = kycConfig[status] || 'bg-zinc-100 text-zinc-500'
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cls}`}>
      {status || 'N/A'}
    </span>
  )
}

export default AdminDashborad
