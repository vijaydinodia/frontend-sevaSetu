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
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import API_URL from '../api'
import AdminSidebar from '../components/AdminSidebar'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { capitalize, capitalizeWords } from '../lib/utils'
import UseView from '../custom_hook/UseView'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'

const AdminDashborad = () => {
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')

  const providersView = UseView('admin_providers', 'table')
  const bookingsView = UseView('admin_bookings', 'table')
  const reviewsView = UseView('admin_reviews', 'card')

  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState(savedUser)
  const [providers, setProviders] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [pendingApplications, setPendingApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [selectedDocs, setSelectedDocs] = useState(null)

  // for bookings by provider view
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [providerBookings, setProviderBookings] = useState([])
  const [providerBookingsLoading, setProviderBookingsLoading] = useState(false)

  const [locations, setLocations] = useState([])
  const [locationForm, setLocationForm] = useState({ city: '', state: '', district: '', pincodes: '' })
  const [locationLoading, setLocationLoading] = useState(false)

  // Providers tab search & sort states
  const [providerSearch, setProviderSearch] = useState('')
  const [providerSort, setProviderSort] = useState('ratingHigh')

  // Bookings tab search & sort states
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingSort, setBookingSort] = useState('dateNewest')

  // Reviews tab search & sort states
  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewSort, setReviewSort] = useState('ratingHigh')

  // Locations tab search & sort states
  const [locationSearch, setLocationSearch] = useState('')

  const token = localStorage.getItem('token')

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  })

  const getUserName = (item) => {
    const u = item?.user || item
    const fullName = `${u?.firstName || ''} ${u?.lastName || ''}`.trim()
    return fullName ? capitalizeWords(fullName) : (u?.email || 'N/A')
  }

  // Filter and sort providers
  const filteredAndSortedProviders = providers
    .filter((p) => {
      const q = providerSearch.toLowerCase().trim()
      if (!q) return true
      const pName = `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.toLowerCase()
      const pEmail = p.user?.email?.toLowerCase() || ''
      const pBusiness = p.businessName?.toLowerCase() || ''
      const pCat = p.category?.name?.toLowerCase() || ''
      const pKyc = p.kycStatus?.toLowerCase() || ''
      return pName.includes(q) || pEmail.includes(q) || pBusiness.includes(q) || pCat.includes(q) || pKyc.includes(q)
    })
    .sort((a, b) => {
      if (providerSort === 'ratingHigh') return (b.averageRating || 0) - (a.averageRating || 0)
      if (providerSort === 'ratingLow') return (a.averageRating || 0) - (b.averageRating || 0)
      if (providerSort === 'experienceHigh') return (b.experience || 0) - (a.experience || 0)
      if (providerSort === 'experienceLow') return (a.experience || 0) - (b.experience || 0)
      if (providerSort === 'nameAsc') return (a.businessName || '').localeCompare(b.businessName || '')
      return 0
    })

  // Filter and sort bookings
  const filteredAndSortedBookings = bookings
    .filter((b) => {
      const q = bookingSearch.toLowerCase().trim()
      if (!q) return true
      const bNo = b.bookingNumber?.toString() || ''
      const cName = getUserName(b.customer).toLowerCase()
      const pName = getUserName(b.provider).toLowerCase()
      const bCity = b.city?.toLowerCase() || ''
      const bStatus = b.status?.toLowerCase() || ''
      return bNo.includes(q) || cName.includes(q) || pName.includes(q) || bCity.includes(q) || bStatus.includes(q)
    })
    .sort((a, b) => {
      if (bookingSort === 'dateNewest') return new Date(b.bookingDate) - new Date(a.bookingDate)
      if (bookingSort === 'dateOldest') return new Date(a.bookingDate) - new Date(b.bookingDate)
      if (bookingSort === 'amountHigh') return b.amount - a.amount
      if (bookingSort === 'amountLow') return a.amount - b.amount
      return 0
    })

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((r) => {
      const q = reviewSearch.toLowerCase().trim()
      if (!q) return true
      const cName = getUserName(r.customer).toLowerCase()
      const pName = getUserName(r.provider).toLowerCase()
      const rText = r.review?.toLowerCase() || ''
      const rRating = r.rating?.toString() || ''
      return cName.includes(q) || pName.includes(q) || rText.includes(q) || rRating === q
    })
    .sort((a, b) => {
      if (reviewSort === 'ratingHigh') return b.rating - a.rating
      if (reviewSort === 'ratingLow') return a.rating - b.rating
      return 0
    })

  // Filter locations
  const filteredLocations = locations
    .filter((loc) => {
      const q = locationSearch.toLowerCase().trim()
      if (!q) return true
      const lCity = loc.city?.toLowerCase() || ''
      const lState = loc.state?.toLowerCase() || ''
      const lDistrict = loc.district?.toLowerCase() || ''
      const lPins = loc.pincodes ? loc.pincodes.map(p => (p.pincode || p).toString()).join(' ') : ''
      return lCity.includes(q) || lState.includes(q) || lDistrict.includes(q) || lPins.includes(q)
    })

  // fetch all data from admin endpoints
  const fetchData = async () => {
    setLoading(true)
    setMessage('')

    try {
      if (!token) {
        navigate('/login')
        return
      }

      const [profileRes, providerRes, bookingRes, reviewRes, pendingRes, locationRes] = await Promise.all([
        axios.get(`${API_URL}/admin/profile`, getHeaders()),
        axios.get(`${API_URL}/admin/provider/getall`, getHeaders()),
        axios.get(`${API_URL}/admin/booking/by-category`, getHeaders()),
        axios.get(`${API_URL}/admin/review/getall`, getHeaders()),
        axios.get(`${API_URL}/admin/provider/applications/pending`, getHeaders()),
        axios.get(`${API_URL}/location/getall`, getHeaders()),
      ])

      const profileUser = profileRes.data.data?.user || profileRes.data.data || savedUser
      setProfile(profileUser)
      setProviders(providerRes.data.data || [])
      setBookings(bookingRes.data.data || [])
      setReviews(reviewRes.data.data || [])
      setPendingApplications(pendingRes.data.data || [])
      setLocations(locationRes.data.data || [])
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

  const handleLocationFormChange = (e) => {
    const { name, value } = e.target
    setLocationForm({ ...locationForm, [name]: value })
  }

  const handleCreateLocation = async (e) => {
    e.preventDefault()
    if (!locationForm.city || !locationForm.state || !locationForm.district) return
    setLocationLoading(true)
    try {
      const res = await axios.post(`${API_URL}/location/add`, locationForm, getHeaders())
      if (res.data?.success) {
        setMessage(res.data.message || 'Location added successfully!')
        setLocationForm({ city: '', state: '', district: '', pincodes: '' })
        const locRes = await axios.get(`${API_URL}/location/getall`, getHeaders())
        setLocations(locRes.data.data || [])
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    } finally {
      setLocationLoading(false)
    }
  }

  const handleToggleLocationStatus = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/location/status/${id}`, {}, getHeaders())
      if (res.data?.success) {
        setMessage(res.data.message || 'Status updated!')
        const locRes = await axios.get(`${API_URL}/location/getall`, getHeaders())
        setLocations(locRes.data.data || [])
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    }
  }

  const handleTogglePincodeStatus = async (locationId, pincode) => {
    try {
      const res = await axios.put(`${API_URL}/location/pincode/status`, { locationId, pincode }, getHeaders())
      if (res.data?.success) {
        setMessage(res.data.message || 'Pincode status updated!')
        const locRes = await axios.get(`${API_URL}/location/getall`, getHeaders())
        setLocations(locRes.data.data || [])
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    }
  }

  // approve provider - sends email automatically from backend
  const handleApproveProvider = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/admin/provider/approve/${id}`, {}, getHeaders())
      setMessage(res.data.message || 'Provider approved and email sent')
      fetchData()
      // go back to applications list after action
      if (activeTab === 'applicationDetail') setActiveTab('applications')
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
      if (activeTab === 'applicationDetail') setActiveTab('applications')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // view full application detail
  const handleViewApplication = async (id) => {
    setApplicationLoading(true)
    setActiveTab('applicationDetail')
    try {
      const res = await axios.get(`${API_URL}/admin/provider/applications/${id}`, getHeaders())
      setSelectedApplication(res.data.data)
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setApplicationLoading(false)
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
      title: 'Applications',
      value: pendingApplications.length,
      icon: <PendingActionsOutlinedIcon />,
      tab: 'applications',
      bg: 'bg-red-50',
      text: 'text-red-500',
    },
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
      title: 'Pending Bookings',
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
        pendingCount={pendingApplications.length}
      />

      {/* Main */}
      <div className="main-col flex flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border-custom bg-card-bg px-5 py-4 transition-colors duration-200">
          <div className="hidden items-center gap-2 text-sm font-semibold text-text-muted md:flex">
            <AdminPanelSettingsOutlinedIcon fontSize="small" />
            <span>Admin</span>
            <span className="text-text-muted opacity-50">/</span>
            <span className="capitalize text-text-main">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'providerBookings' ? 'Provider Bookings' : activeTab}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {loading && (
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-zinc-500 shadow-sm">
                Loading…
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowEditProfile(true)} title="Edit Profile">
              <PersonOutlineOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} title="Logout">
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
                      loading="lazy"
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

          {/* ── APPLICATIONS TAB ── */}
          {activeTab === 'applications' && (
            <Card className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="m-0 text-2xl font-semibold text-black">Pending Applications</h2>
                  <p className="mt-1 text-sm text-zinc-500">Review provider applications in your assigned category before approving or rejecting.</p>
                </div>
                <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
                  {pendingApplications.length} Pending
                </span>
              </div>

              {pendingApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <PendingActionsOutlinedIcon style={{ fontSize: 48 }} className="mb-3 text-zinc-300" />
                  <p className="text-lg font-semibold text-zinc-400">No pending applications</p>
                  <p className="text-sm text-zinc-400">All applications in your category have been reviewed.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pendingApplications.map((app) => (
                    <div key={app._id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
                          {(app?.user?.firstName?.[0] || 'P').toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="m-0 truncate font-semibold text-black">
                            {app?.user?.firstName} {app?.user?.lastName}
                          </p>
                          <p className="m-0 truncate text-xs text-zinc-500">{app?.user?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Business</span>
                          <span className="font-semibold text-black">{app.businessName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Experience</span>
                          <span className="font-semibold text-black">{app.experience || 0} yrs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Applied</span>
                          <span className="font-semibold text-black">{new Date(app.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewApplication(app._id)}
                        className="mt-4 w-full rounded-2xl bg-black py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
                      >
                        View Full Application →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* ── APPLICATION DETAIL TAB ── */}
          {activeTab === 'applicationDetail' && (
            <div className="space-y-5">
              <button
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
                onClick={() => setActiveTab('applications')}
              >
                ← Back to Applications
              </button>

              {applicationLoading ? (
                <Card className="p-10 text-center text-sm text-zinc-400">Loading application details...</Card>
              ) : selectedApplication ? (
                <>
                  {/* Action bar */}
                  <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="m-0 text-sm text-zinc-500">Application from</p>
                      <h2 className="m-0 text-xl font-semibold text-black">
                        {selectedApplication.personalInfo?.firstName} {selectedApplication.personalInfo?.lastName}
                      </h2>
                      <p className="mt-1 text-xs text-zinc-400">
                        Submitted on {new Date(selectedApplication.submittedAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {selectedApplication.kycStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveProvider(selectedApplication.applicationId)}
                            className="rounded-2xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                            title="Approve & Send Credentials"
                          >
                            <CheckCircleOutlineOutlinedIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleRejectProvider(selectedApplication.applicationId)}
                            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                            title="Reject Application"
                          >
                            <CancelOutlinedIcon fontSize="small" />
                          </button>
                        </>
                      )}
                      {selectedApplication.kycStatus !== 'pending' && (
                        <span className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${selectedApplication.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedApplication.kycStatus}
                        </span>
                      )}
                    </div>
                  </Card>

                  <div className="grid gap-5 lg:grid-cols-2">
                    {/* Personal Info */}
                    <Card className="p-5">
                      <h3 className="mb-4 text-base font-semibold text-black">Personal Information</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          ['Full Name', `${selectedApplication.personalInfo?.firstName} ${selectedApplication.personalInfo?.lastName}`],
                          ['Email', selectedApplication.personalInfo?.email],
                          ['Phone', selectedApplication.personalInfo?.phone],
                          ['City', selectedApplication.personalInfo?.address?.city || 'N/A'],
                          ['State', selectedApplication.personalInfo?.address?.state || 'N/A'],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between rounded-xl bg-zinc-50 px-4 py-2.5">
                            <span className="text-zinc-500">{label}</span>
                            <span className="font-semibold text-black">{value || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Business Info */}
                    <Card className="p-5">
                      <h3 className="mb-4 text-base font-semibold text-black">Business Information</h3>
                      <div className="space-y-3 text-sm">
                        {[
                          ['Business Name', selectedApplication.businessInfo?.businessName],
                          ['Category', selectedApplication.businessInfo?.category?.name],
                          ['Experience', `${selectedApplication.businessInfo?.experience || 0} years`],
                          ['Skills', (selectedApplication.businessInfo?.skills || []).join(', ') || 'N/A'],
                          ['Service Areas', (selectedApplication.businessInfo?.serviceAreas || []).join(', ') || 'N/A'],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between rounded-xl bg-zinc-50 px-4 py-2.5">
                            <span className="text-zinc-500">{label}</span>
                            <span className="font-semibold text-black capitalize">{value || 'N/A'}</span>
                          </div>
                        ))}
                      </div>
                      {selectedApplication.businessInfo?.description && (
                        <div className="mt-3 rounded-xl bg-zinc-50 p-4">
                          <p className="m-0 text-xs font-semibold text-zinc-500">Description</p>
                          <p className="mt-1 text-sm text-zinc-700">{selectedApplication.businessInfo.description}</p>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* KYC Documents */}
                  <Card className="p-5">
                    <h3 className="mb-4 text-base font-semibold text-black">KYC Documents</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { label: 'Aadhar Front', url: selectedApplication.documents?.aadharFront },
                        { label: 'Aadhar Back', url: selectedApplication.documents?.aadharBack },
                        { label: 'PAN Card', url: selectedApplication.documents?.panCard },
                        { label: 'Self Photo', url: selectedApplication.documents?.selfPhoto },
                      ].map((doc) => (
                        <div key={doc.label} className="rounded-2xl border border-zinc-100 p-3">
                          <p className="mb-2 text-xs font-semibold text-zinc-500">{doc.label}</p>
                          {doc.url ? (
                            <a href={doc.url} target="_blank" rel="noreferrer">
                              <img
                                src={doc.url}
                                alt={doc.label}
                                className="h-40 w-full rounded-xl object-cover hover:opacity-90"
                                loading="lazy"
                              />
                            </a>
                          ) : (
                            <div className="flex h-40 items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-400">
                              Not uploaded
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-10 text-center text-sm text-zinc-400">Application not found.</Card>
              )}
            </div>
          )}

          {/* ── PROVIDERS TAB ── */}
          {activeTab === 'providers' && (
            <Card className="p-5">
              <SectionTitle title="Providers" count={filteredAndSortedProviders.length} loading={loading} />
              
              {/* Search and Sort controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search providers by name, email, category, business or KYC status..."
                  value={providerSearch}
                  onChange={(e) => setProviderSearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                />
                <select
                  value={providerSort}
                  onChange={(e) => setProviderSort(e.target.value)}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                >
                  <option value="ratingHigh">Rating: High to Low</option>
                  <option value="ratingLow">Rating: Low to High</option>
                  <option value="experienceHigh">Experience: High to Low</option>
                  <option value="experienceLow">Experience: Low to High</option>
                  <option value="nameAsc">Business Name: A to Z</option>
                </select>
              </div>
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                <button
                  onClick={() => providersView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${providersView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Table View"
                >
                  <TableRowsOutlinedIcon fontSize="small" />
                </button>
                <button
                  onClick={() => providersView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${providersView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Card View"
                >
                  <GridViewOutlinedIcon fontSize="small" />
                </button>
              </div>

            {providersView.view === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left text-sm">
                  <thead>
                    <tr className="bg-[#f8ebe6] text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      <th className="rounded-l-2xl p-3 pl-4">Provider</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Business</th>
                      <th className="p-3">KYC Status</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Deleted</th>
                      <th className="rounded-r-2xl p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedProviders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-sm text-zinc-400">
                          No providers found.
                        </td>
                      </tr>
                    )}
                    {filteredAndSortedProviders.map((item) => (
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
                        <td className="p-3 text-zinc-600 font-semibold text-purple-600">
                          {capitalizeWords(item.category?.name) || 'N/A'}
                        </td>
                        <td className="p-3 text-zinc-600">{capitalizeWords(item.businessName) || 'N/A'}</td>
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
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Approve button - only show if not yet approved */}
                            {item.kycStatus !== 'approved' && (
                              <button
                                onClick={() => handleApproveProvider(item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                                title="Approve Provider"
                              >
                                <CheckOutlinedIcon fontSize="small" />
                              </button>
                            )}

                            {/* Reject button - only show if not yet rejected */}
                            {item.kycStatus !== 'rejected' && (
                              <button
                                onClick={() => handleRejectProvider(item._id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                title="Reject Provider"
                              >
                                <CloseOutlinedIcon fontSize="small" />
                              </button>
                            )}

                            {/* View verification documents */}
                            <button
                              onClick={() => setSelectedDocs(item)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-full border border-blue-200 transition-colors"
                              title="View Documents"
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </button>

                            {/* View provider bookings */}
                            <button
                              onClick={() => handleViewProviderBookings(item)}
                              className="text-purple-600 hover:bg-purple-50 p-2 rounded-full border border-purple-200 transition-colors"
                              title="View Bookings"
                            >
                              <CalendarMonthOutlinedIcon fontSize="small" />
                            </button>

                            {/* Status toggle */}
                            <select
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-purple-400"
                              onChange={(e) => handleProviderStatus(item._id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Status</option>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>

                            {/* Restore or soft delete */}
                            {item.isDeleted ? (
                              <>
                                <button
                                  onClick={() => handleRestoreProvider(item._id)}
                                  className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                                  title="Restore Provider"
                                >
                                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleHardDeleteProvider(item._id)}
                                  className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                  title="Permanently Delete Provider"
                                >
                                  <DeleteForeverOutlinedIcon fontSize="small" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSoftDeleteProvider(item._id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                title="Delete Provider"
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedProviders.length === 0 && (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No providers found.</p>
                )}
                {filteredAndSortedProviders.map((item) => (
                  <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {item.user?.profileImage ? (
                          <img className="h-10 w-10 rounded-2xl object-cover" src={item.user.profileImage} alt="provider" loading="lazy" />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold text-base">
                            {(getUserName(item) || 'P')[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-base m-0 text-black dark:text-white">{getUserName(item)}</h4>
                          <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{item.user?.email || 'N/A'}</span>
                        </div>
                      </div>
                      {item.isDeleted && (
                        <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 mb-4">
                      <p><strong>Business:</strong> {capitalizeWords(item.businessName) || 'N/A'}</p>
                      <p><strong>Category:</strong> <span className="font-semibold text-purple-600">{capitalizeWords(item.category?.name) || 'N/A'}</span></p>
                      <p><strong>KYC:</strong> <span className="capitalize font-semibold">{item.kycStatus || 'N/A'}</span></p>
                      <p><strong>Rating:</strong> {item.averageRating || 0} ★</p>
                      <p><strong>Experience:</strong> {item.experience || 0} Yrs</p>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                      <div className="flex flex-wrap items-center gap-1.5 w-full justify-between">
                        <div className="flex items-center gap-1">
                          {item.kycStatus !== 'approved' && (
                            <button
                              onClick={() => handleApproveProvider(item._id)}
                              className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                              title="Approve Provider"
                            >
                              <CheckOutlinedIcon fontSize="small" />
                            </button>
                          )}
                          {item.kycStatus !== 'rejected' && (
                            <button
                              onClick={() => handleRejectProvider(item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Reject Provider"
                            >
                              <CloseOutlinedIcon fontSize="small" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedDocs(item)}
                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full border border-blue-200 transition-colors"
                            title="View Documents"
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleViewProviderBookings(item)}
                            className="text-purple-600 hover:bg-purple-50 p-1.5 rounded-full border border-purple-200 transition-colors"
                            title="View Bookings"
                          >
                            <CalendarMonthOutlinedIcon fontSize="small" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <select
                            className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-700 outline-none"
                            onChange={(e) => handleProviderStatus(item._id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestoreProvider(item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Provider"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDeleteProvider(item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Provider"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDeleteProvider(item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Provider"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            </Card>
          )}

          {/* ── BOOKINGS BY CATEGORY TAB ── */}
          {activeTab === 'bookings' && (
            <Card className="p-5">
              <SectionTitle title="Bookings (My Category)" count={filteredAndSortedBookings.length} loading={loading} />

              {/* Search and Sort controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Search bookings by number, customer, provider or city..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <select
                    value={bookingSort}
                    onChange={(e) => setBookingSort(e.target.value)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                  >
                    <option value="dateNewest">Date: Newest First</option>
                    <option value="dateOldest">Date: Oldest First</option>
                    <option value="amountHigh">Price: High to Low</option>
                    <option value="amountLow">Price: Low to High</option>
                  </select>
                </div>
                {/* Layout Switcher */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => bookingsView.toggleView()}
                    className={`p-2 rounded-lg transition-colors ${bookingsView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Table View"
                  >
                    <TableRowsOutlinedIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => bookingsView.toggleView()}
                    className={`p-2 rounded-lg transition-colors ${bookingsView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Card View"
                  >
                    <GridViewOutlinedIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {bookingsView.view === 'table' ? (
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
                      {filteredAndSortedBookings.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-sm text-zinc-400">
                            No bookings found in your category.
                          </td>
                        </tr>
                      )}
                      {filteredAndSortedBookings.map((item) => (
                        <tr
                          key={item._id}
                          className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                        >
                          <td className="p-3 pl-4 font-semibold text-black">
                            #{item.bookingNumber || item._id?.slice(-6)}
                          </td>
                          <td className="p-3 text-zinc-700">{getUserName(item.customer)}</td>
                          <td className="p-3 text-zinc-700">{getUserName(item.provider)}</td>
                          <td className="p-3 text-zinc-600">{capitalizeWords(item.city) || 'N/A'}</td>
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
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="on_the_way">On The Way</option>
                                <option value="started">Started</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="rejected">Rejected</option>
                              </select>

                              {item.isDeleted ? (
                                <>
                                  <button
                                    onClick={() => handleRestoreBooking(item._id)}
                                    className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                                    title="Restore Booking"
                                  >
                                    <RestoreFromTrashOutlinedIcon fontSize="small" />
                                  </button>
                                  <button
                                    onClick={() => handleHardDeleteBooking(item._id)}
                                    className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                    title="Permanently Delete Booking"
                                  >
                                    <DeleteForeverOutlinedIcon fontSize="small" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleSoftDeleteBooking(item._id)}
                                  className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                  title="Delete Booking"
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="small" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAndSortedBookings.length === 0 && (
                    <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No bookings found in your category.</p>
                  )}
                  {filteredAndSortedBookings.map((item) => (
                    <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-500">#{item.bookingNumber || item._id?.slice(-6)}</span>
                          <h4 className="font-bold text-base m-0 mt-0.5 text-black dark:text-white">{capitalizeWords(item.service?.title) || 'Service'}</h4>
                        </div>
                        {item.isDeleted && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 mb-4">
                        <p><strong>Customer:</strong> {getUserName(item.customer)}</p>
                        <p><strong>Provider:</strong> {getUserName(item.provider)}</p>
                        <p><strong>City:</strong> {capitalizeWords(item.city) || 'N/A'}</p>
                        <p><strong>Amount:</strong> ₹{item.amount || 0}</p>
                        <p><strong>Status:</strong> <span className="capitalize font-semibold">{capitalizeWords(item.status.replace(/_/g, ' '))}</span></p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <select
                          className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 outline-none"
                          value={item.status}
                          onChange={(e) => handleBookingStatus(item._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="on_the_way">On The Way</option>
                          <option value="started">Started</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <div className="flex items-center gap-1">
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestoreBooking(item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Booking"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDeleteBooking(item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Booking"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDeleteBooking(item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Booking"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
                                <button
                                  onClick={() => handleRestoreBooking(item._id)}
                                  className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                                  title="Restore Booking"
                                >
                                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleHardDeleteBooking(item._id)}
                                  className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                  title="Permanently Delete Booking"
                                >
                                  <DeleteForeverOutlinedIcon fontSize="small" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSoftDeleteBooking(item._id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                title="Delete Booking"
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </button>
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
              <SectionTitle title="Reviews & Ratings" count={filteredAndSortedReviews.length} loading={loading} />

               {/* Search and Sort controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Search reviews by customer, provider, comment text or rating..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                  />
                  <select
                    value={reviewSort}
                    onChange={(e) => setReviewSort(e.target.value)}
                    className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                  >
                    <option value="ratingHigh">Rating: High to Low</option>
                    <option value="ratingLow">Rating: Low to High</option>
                  </select>
                </div>
                {/* Layout Switcher */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => reviewsView.toggleView()}
                    className={`p-2 rounded-lg transition-colors ${reviewsView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Table View"
                  >
                    <TableRowsOutlinedIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => reviewsView.toggleView()}
                    className={`p-2 rounded-lg transition-colors ${reviewsView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    title="Card View"
                  >
                    <GridViewOutlinedIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {reviewsView.view === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead>
                      <tr className="bg-[#f8ebe6] text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        <th className="rounded-l-2xl p-3 pl-4">Customer</th>
                        <th className="p-3">Provider</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3">Review</th>
                        <th className="p-3">Status</th>
                        <th className="rounded-r-2xl p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedReviews.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-zinc-400">No reviews found.</td>
                        </tr>
                      ) : (
                        filteredAndSortedReviews.map((item) => (
                          <tr key={item._id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50">
                            <td className="p-3 pl-4 font-semibold text-black">{getUserName(item.customer)}</td>
                            <td className="p-3 text-zinc-700">{getUserName(item.provider)}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <StarOutlineOutlinedIcon
                                    key={i}
                                    style={{ fontSize: 16 }}
                                    className={i < (item.rating || 0) ? 'text-yellow-400' : 'text-zinc-300'}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="p-3 text-zinc-600 max-w-xs truncate" title={item.review}>{item.review || 'No review text.'}</td>
                            <td className="p-3">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.isDeleted ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                {item.isDeleted ? 'Deleted' : 'Active'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {item.isDeleted ? (
                                  <>
                                    <button
                                      onClick={() => handleRestoreReview(item._id)}
                                      className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                      title="Restore Review"
                                    >
                                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                                    </button>
                                    <button
                                      onClick={() => handleHardDeleteReview(item._id)}
                                      className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                      title="Permanently Delete Review"
                                    >
                                      <DeleteForeverOutlinedIcon fontSize="small" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleSoftDeleteReview(item._id)}
                                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                    title="Delete Review"
                                  >
                                    <DeleteOutlineOutlinedIcon fontSize="small" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredAndSortedReviews.length === 0 ? (
                    <p className="col-span-3 text-center text-sm text-zinc-400">No reviews yet.</p>
                  ) : (
                    filteredAndSortedReviews.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col gap-3 rounded-[24px] bg-[#f8ebe6] p-4 text-black"
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
                        <div className="flex items-center justify-between border-t pt-2 mt-2 border-zinc-200/40">
                          <span className={`text-xs font-semibold ${item.isDeleted ? 'text-red-500' : 'text-emerald-600'}`}>
                            {item.isDeleted ? 'Deleted' : 'Active'}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.isDeleted ? (
                              <>
                                <button
                                  onClick={() => handleRestoreReview(item._id)}
                                  className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                  title="Restore Review"
                                >
                                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleHardDeleteReview(item._id)}
                                  className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                  title="Permanently Delete Review"
                                >
                                  <DeleteForeverOutlinedIcon fontSize="small" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSoftDeleteReview(item._id)}
                                className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Delete Review"
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>
          )}

          {/* ── LOCATIONS TAB ── */}
          {activeTab === 'locations' && (
            <Card className="p-5">
              <SectionTitle title="Manage Locations" count={filteredLocations.length} loading={loading} />

              {/* Search and Sort controls */}
              <div className="mb-6 flex gap-3">
                <input
                  type="text"
                  placeholder="Search locations by city, district, state or pincode..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Locations Grid */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredLocations.length === 0 && (
                  <p className="col-span-3 text-center text-sm text-[var(--text-muted)]">No locations found.</p>
                )}
                {filteredLocations.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-shell)] p-5 transition-all"
                  >
                    <div>
                      <h4 className="m-0 text-lg font-bold text-[var(--text-main)]">{item.city}</h4>
                      <p className="m-0 mt-1 text-sm text-[var(--text-muted)] font-semibold">{item.district || 'N/A'}, {item.state}</p>
                      {item.pincodes && item.pincodes.length > 0 && (
                        <div className="mt-3">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">Serviced Pincodes:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.pincodes.map((pinObj, pidx) => {
                              const pinCode = pinObj.pincode || pinObj;
                              const isPinActive = pinObj.isActive !== false; // default to true if it is just a string
                              return (
                                <button
                                  key={pidx}
                                  onClick={() => handleTogglePincodeStatus(item._id, pinCode)}
                                  className={`rounded-lg px-2 py-0.5 text-xs font-mono border transition-all ${
                                    isPinActive
                                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                      : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20 line-through'
                                  }`}
                                  title="Click to toggle pincode status"
                                >
                                  {pinCode}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3 mt-2">
                      <button
                        onClick={() => handleToggleLocationStatus(item._id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                          item.isActive
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}
                        title="Click to toggle status"
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
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

      {/* Verification Documents Modal */}
      {selectedDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              onClick={() => setSelectedDocs(null)}
              type="button"
            >
              <CloseOutlinedIcon fontSize="small" />
            </button>
            <h3 className="mb-2 text-xl font-bold text-black">Verification Documents</h3>
            <p className="mb-4 text-sm text-zinc-500">
              Provider: <b>{getUserName(selectedDocs)}</b> | Business: <b>{selectedDocs.businessName || 'N/A'}</b>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 text-center flex flex-col items-center">
                <span className="font-bold text-xs uppercase tracking-wider mb-2 text-zinc-500 block">Self Photo</span>
                {selectedDocs.selfPhoto ? (
                  <img src={selectedDocs.selfPhoto} alt="Self Photo" className="h-48 w-auto max-w-full object-contain rounded-xl shadow" loading="lazy" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-400">No image uploaded</div>
                )}
              </div>

              <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 text-center flex flex-col items-center">
                <span className="font-bold text-xs uppercase tracking-wider mb-2 text-zinc-500 block">PAN Card</span>
                {selectedDocs.panCard ? (
                  <img src={selectedDocs.panCard} alt="PAN Card" className="h-48 w-auto max-w-full object-contain rounded-xl shadow" loading="lazy" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-400">No image uploaded</div>
                )}
              </div>

              <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 text-center flex flex-col items-center">
                <span className="font-bold text-xs uppercase tracking-wider mb-2 text-zinc-500 block">Aadhar Card Front</span>
                {selectedDocs.aadharFront ? (
                  <img src={selectedDocs.aadharFront} alt="Aadhar Front" className="h-48 w-auto max-w-full object-contain rounded-xl shadow" loading="lazy" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-400">No image uploaded</div>
                )}
              </div>

              <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 text-center flex flex-col items-center">
                <span className="font-bold text-xs uppercase tracking-wider mb-2 text-zinc-500 block">Aadhar Card Back</span>
                {selectedDocs.aadharBack ? (
                  <img src={selectedDocs.aadharBack} alt="Aadhar Back" className="h-48 w-auto max-w-full object-contain rounded-xl shadow" loading="lazy" />
                ) : (
                  <div className="h-48 flex items-center justify-center text-zinc-400">No image uploaded</div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setSelectedDocs(null)} title="Close">
                <CloseOutlinedIcon fontSize="small" />
                Close
              </Button>
            </div>
          </div>
        </div>
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
