import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import API_URL from '../api'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import { capitalize, capitalizeWords } from '../lib/utils'
import UseView from '../custom_hook/UseView'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'

const SuperAdminDashborad = () => {
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState(savedUser)

  const categoriesView = UseView('superadmin_categories', 'table')
  const usersView = UseView('superadmin_users', 'table')
  const adminsView = UseView('superadmin_admins', 'table')
  const providersView = UseView('superadmin_providers', 'table')
  const bookingsView = UseView('superadmin_bookings', 'table')
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [locations, setLocations] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  })
  // Datamuse API suggestions
  const [suggestedCategoryNames, setSuggestedCategoryNames] = useState([])
  const [isFetchingCategoryNames, setIsFetchingCategoryNames] = useState(false)
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    category: '',
    city: '',
    permissions: [],
  })
  const [adminFormLoading, setAdminFormLoading] = useState(false)
  const [locationForm, setLocationForm] = useState({ city: '', state: '', district: '', pincodes: '' })
  const [locationLoading, setLocationLoading] = useState(false)
  const [lookupPincode, setLookupPincode] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)

  // Search & Sort states
  const [categorySearch, setCategorySearch] = useState('')
  const [categorySort, setCategorySort] = useState('nameAsc')

  const [userSearch, setUserSearch] = useState('')
  const [userSort, setUserSort] = useState('nameAsc')

  const [adminSearch, setAdminSearch] = useState('')
  const [adminSort, setAdminSort] = useState('nameAsc')

  const [providerSearch, setProviderSearch] = useState('')
  const [providerSort, setProviderSort] = useState('ratingHigh')

  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingSort, setBookingSort] = useState('dateNewest')

  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewSort, setReviewSort] = useState('ratingHigh')

  const [locationSearch, setLocationSearch] = useState('')

  const token = localStorage.getItem('token')

  const getHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  }

  const getUserName = (item) => {
    const user = item?.user || item
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    return fullName ? capitalizeWords(fullName) : (user?.email || 'N/A')
  }

  const getUserEmail = (item) => {
    const user = item?.user || item
    return user?.email || 'N/A'
  }

  const showStatus = (status) => {
    if (!status) return 'N/A'
    return capitalizeWords(status.replaceAll('_', ' '))
  }

  // Categories filter & sort
  const filteredAndSortedCategories = categories
    .filter((cat) => {
      const q = categorySearch.toLowerCase().trim()
      if (!q) return true
      const cName = cat.name?.toLowerCase() || ''
      const cDesc = cat.description?.toLowerCase() || ''
      return cName.includes(q) || cDesc.includes(q)
    })
    .sort((a, b) => {
      if (categorySort === 'nameAsc') return (a.name || '').localeCompare(b.name || '')
      if (categorySort === 'nameDesc') return (b.name || '').localeCompare(b.name || '')
      return 0
    })

  // Users filter & sort
  const filteredAndSortedUsers = users
    .filter((u) => {
      const q = userSearch.toLowerCase().trim()
      if (!q) return true
      const uName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
      const uEmail = u.email?.toLowerCase() || ''
      const uPhone = u.phone?.toLowerCase() || ''
      const uStatus = u.status?.toLowerCase() || ''
      return uName.includes(q) || uEmail.includes(q) || uPhone.includes(q) || uStatus.includes(q)
    })
    .sort((a, b) => {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim()
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim()
      if (userSort === 'nameAsc') return nameA.localeCompare(nameB)
      if (userSort === 'nameDesc') return nameB.localeCompare(nameA)
      return 0
    })

  // Admins filter & sort
  const filteredAndSortedAdmins = admins
    .filter((adm) => {
      const q = adminSearch.toLowerCase().trim()
      if (!q) return true
      const aName = getUserName(adm).toLowerCase()
      const aEmail = getUserEmail(adm).toLowerCase()
      const aEmpId = adm.employeeId?.toLowerCase() || ''
      const aCat = adm.category?.name?.toLowerCase() || ''
      const aCity = adm.city?.toLowerCase() || ''
      const aStatus = adm.status?.toLowerCase() || ''
      return aName.includes(q) || aEmail.includes(q) || aEmpId.includes(q) || aCat.includes(q) || aCity.includes(q) || aStatus.includes(q)
    })
    .sort((a, b) => {
      const nameA = getUserName(a)
      const nameB = getUserName(b)
      if (adminSort === 'nameAsc') return nameA.localeCompare(nameB)
      if (adminSort === 'nameDesc') return nameB.localeCompare(nameA)
      return 0
    })

  // Providers filter & sort
  const filteredAndSortedProviders = providers
    .filter((p) => {
      const q = providerSearch.toLowerCase().trim()
      if (!q) return true
      const pName = getUserName(p).toLowerCase()
      const pEmail = getUserEmail(p).toLowerCase()
      const pBusiness = p.businessName?.toLowerCase() || ''
      const pKyc = p.kycStatus?.toLowerCase() || ''
      return pName.includes(q) || pEmail.includes(q) || pBusiness.includes(q) || pKyc.includes(q)
    })
    .sort((a, b) => {
      if (providerSort === 'ratingHigh') return (b.averageRating || 0) - (a.averageRating || 0)
      if (providerSort === 'ratingLow') return (a.averageRating || 0) - (b.averageRating || 0)
      if (providerSort === 'experienceHigh') return (b.experience || 0) - (a.experience || 0)
      if (providerSort === 'experienceLow') return (a.experience || 0) - (b.experience || 0)
      return 0
    })

  // Bookings filter & sort
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

  // Reviews filter & sort
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

  // Locations filter
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

  const fetchData = async () => {
    setLoading(true)
    setMessage('')

    try {
      if (!token) {
        navigate('/login')
        return
      }

      const [
        profileRes,
        userRes,
        adminRes,
        providerRes,
        categoryRes,
        bookingRes,
        reviewRes,
        locationRes,
        statsRes,
      ] = await Promise.all([
        axios.get(`${API_URL}/superadmin/profile`, getHeaders()),
        axios.get(`${API_URL}/superadmin/user/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/admin/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/provider/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/category/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/booking/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/review/getall`, getHeaders()),
        axios.get(`${API_URL}/location/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/dashboard-stats`, getHeaders()),
      ])

      const profileUser = profileRes.data.data?.user || profileRes.data.data || savedUser
      setProfile(profileUser)
      localStorage.setItem('user', JSON.stringify(profileUser))
      setUsers(userRes.data.data || [])
      setAdmins(adminRes.data.data || [])
      setProviders(providerRes.data.data || [])
      setCategories(categoryRes.data.data || [])
      setBookings(bookingRes.data.data || [])
      setReviews(reviewRes.data.data || [])
      setLocations(locationRes.data.data || [])
      setDashboardStats(statsRes.data.data || null)
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Datamuse API for related category names
  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = categoryForm.name.trim()
      if (q.length < 3) {
        setSuggestedCategoryNames([])
        return
      }
      setIsFetchingCategoryNames(true)
      try {
        const res = await axios.get(`https://api.datamuse.com/words?ml=${encodeURIComponent(q)}&max=6`)
        if (res.data && res.data.length > 0) {
          setSuggestedCategoryNames(res.data.map(item => item.word))
        } else {
          setSuggestedCategoryNames([])
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      } finally {
        setIsFetchingCategoryNames(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 600)
    return () => clearTimeout(debounceTimer)
  }, [categoryForm.name])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setCategoryForm({ ...categoryForm, [name]: value })
  }

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    setUploading(true)
    setMessage('')

    try {
      const imageData = new FormData()
      imageData.append('image', file)

      const res = await axios.post(`${API_URL}/superadmin/upload/image`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setCategoryForm({ ...categoryForm, image: res.data.data.url })
      setMessage(res.data.message || 'Image uploaded successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!categoryForm.image) {
      setMessage('Category image is required. Please upload an image first.')
      return
    }

    try {
      const res = await axios.post(`${API_URL}/superadmin/category/create`, categoryForm, getHeaders())
      setMessage(res.data.message || 'Category created')
      setCategoryForm({ name: '', description: '', image: '' })
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleUserStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/superadmin/user/status/${id}`, { status }, getHeaders())
      setMessage(res.data.message || 'User status updated')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleAdminStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/superadmin/admin/status/${id}`, { status }, getHeaders())
      setMessage(res.data.message || 'Admin status updated')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleBookingStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/superadmin/booking/update/${id}`, { status }, getHeaders())
      setMessage(res.data.message || 'Booking status updated')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleCategoryStatus = async (id, isActive) => {
    try {
      const res = await axios.put(`${API_URL}/superadmin/category/update/${id}`, { isActive }, getHeaders())
      setMessage(res.data.message || 'Category updated')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleSoftDelete = async (type, id) => {
    try {
      const res = await axios.delete(`${API_URL}/superadmin/${type}/soft-delete/${id}`, getHeaders())
      setMessage(res.data.message || 'Deleted successfully')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleRestore = async (type, id) => {
    try {
      const res = await axios.put(`${API_URL}/superadmin/${type}/restore/${id}`, {}, getHeaders())
      setMessage(res.data.message || 'Restored successfully')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleHardDelete = async (type, id) => {
    if (!window.confirm(`Are you absolutely sure you want to PERMANENTLY delete this ${type}? This action cannot be undone.`)) return
    try {
      const res = await axios.delete(`${API_URL}/superadmin/${type}/hard-delete/${id}`, getHeaders())
      setMessage(res.data.message || 'Permanently deleted successfully')
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // handle admin form input change
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target
    setAdminForm({ ...adminForm, [name]: value })
  }

  const handleLocationFormChange = (e) => {
    const { name, value } = e.target
    setLocationForm({ ...locationForm, [name]: value })
  }

  const handleLookupPincode = async () => {
    if (!lookupPincode.trim()) return
    setLookupLoading(true)
    try {
      const res = await axios.get(`${API_URL}/location/pincode-lookup/${lookupPincode.trim()}`, getHeaders())
      if (res.data?.success) {
        const { city, state, district } = res.data.data
        setLocationForm({
          city: city || '',
          state: state || '',
          district: district || '',
          pincodes: ''
        })
        setMessage(`Successfully resolved pincode ${lookupPincode}!`)
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    } finally {
      setLookupLoading(false)
    }
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
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
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
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return
    try {
      const res = await axios.delete(`${API_URL}/location/delete/${id}`, getHeaders())
      if (res.data?.success) {
        setMessage(res.data.message || 'Location deleted!')
        const locRes = await axios.get(`${API_URL}/location/getall`, getHeaders())
        setLocations(locRes.data.data || [])
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
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
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    }
  }

  // create admin — superAdmin only
  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    setAdminFormLoading(true)
    setMessage('')
    try {
      const res = await axios.post(`${API_URL}/superadmin/admin/createAdmin`, adminForm, getHeaders())
      setMessage(res.data.message || 'Admin created and credentials sent to email')
      setAdminForm({ firstName: '', lastName: '', email: '', phone: '', employeeId: '', category: '', city: '', permissions: [] })
      fetchData()
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setAdminFormLoading(false)
    }
  }

  const statCards = dashboardStats ? [
    { title: 'Users', value: dashboardStats.users || 0, icon: <GroupOutlinedIcon />, tab: 'users' },
    { title: 'Admins', value: dashboardStats.admins || 0, icon: <AdminPanelSettingsOutlinedIcon />, tab: 'admins' },
    { title: 'Providers', value: dashboardStats.providers || 0, icon: <WorkOutlineOutlinedIcon />, tab: 'providers' },
    { title: 'Categories', value: dashboardStats.categories || 0, icon: <CategoryOutlinedIcon />, tab: 'categories' },
    { title: 'Bookings', value: dashboardStats.bookings || 0, icon: <CalendarMonthOutlinedIcon />, tab: 'bookings' },
    { title: 'Reviews', value: dashboardStats.reviews || 0, icon: <RateReviewOutlinedIcon />, tab: 'reviews' },
    { title: 'Locations', value: dashboardStats.locations || 0, icon: <LocationOnOutlinedIcon />, tab: 'locations' },
  ] : []

  const recentBookings = dashboardStats?.recentBookings || []
  const recentProviders = dashboardStats?.recentProviders || []

  return (
    <>
    <div className="dashboard-shell">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-col p-5 md:p-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-card-bg p-5 border border-border-custom shadow-sm md:flex-row md:items-center md:justify-between transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16A34A] text-white">
              {profile?.profileImage ? (
                <img className="h-full w-full rounded-2xl object-cover" src={profile.profileImage} alt="profile" loading="lazy" />
              ) : (
                <PersonOutlineOutlinedIcon />
              )}
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-text-muted">Welcome Super Admin</p>
              <h1 className="m-0 text-2xl font-semibold text-text-main">{getUserName(profile)}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowEditProfile(true)} title="Edit Profile">
              <PersonOutlineOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
            <Button onClick={handleLogout} title="Logout">
              <LogoutOutlinedIcon fontSize="small" />
              Logout
            </Button>
          </div>
        </header>

        {message && <p className="mb-5 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-700">{message}</p>}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                  <SecurityOutlinedIcon />
                </div>
                <div>
                  <h2 className="m-0 text-3xl font-semibold text-black">Super Admin Dashboard</h2>
                  <p className="mt-2 text-zinc-600">Manage complete SevaSetu application data.</p>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((item) => (
                <button
                  key={item.title}
                  className="rounded-[28px] bg-white p-5 text-left shadow-sm hover:bg-zinc-50"
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8ebe6] text-black">
                    {item.icon}
                  </div>
                  <p className="m-0 text-sm font-semibold text-zinc-500">{item.title}</p>
                  <h3 className="m-0 text-3xl font-semibold text-black">{item.value}</h3>
                </button>
              ))}
            </div>

            {/* Quick overview layout similar to Admin Dashboard */}
            <div className="grid gap-5 lg:grid-cols-2 mt-6">
              {/* Chart */}
              {dashboardStats?.chartData && (
                <Card className="p-5 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Platform Revenue & Bookings Trend</h3>
                      <p className="text-xs text-zinc-400">6-Month historical data</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-[#16A34A] rounded-full" /> Revenue (₹)</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-indigo-500 rounded-full" /> Bookings</span>
                    </div>
                  </div>
                  
                  <div className="relative pt-4 w-full">
                    <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible">
                      <defs>
                        <linearGradient id="superChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="30" y1="20" x2="480" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="30" y1="70" x2="480" y2="70" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="30" y1="120" x2="480" y2="120" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" />
                      <line x1="30" y1="170" x2="480" y2="170" stroke="#E5E7EB" strokeWidth="0.5" />
                      
                      {dashboardStats.chartData.length > 0 && (
                        <path
                          d={`M ${dashboardStats.chartData[0].x} 170 L ` + dashboardStats.chartData.map(p => `${p.x} ${p.yRev}`).join(' L ') + ` L ${dashboardStats.chartData[dashboardStats.chartData.length-1].x} 170 Z`}
                          fill="url(#superChartGrad)"
                        />
                      )}
                      {dashboardStats.chartData.length > 0 && (
                        <path
                          d={`M ${dashboardStats.chartData[0].x} ${dashboardStats.chartData[0].yRev} ` + dashboardStats.chartData.slice(1).map(p => `L ${p.x} ${p.yRev}`).join(' ')}
                          stroke="#16A34A"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        />
                      )}
                      {dashboardStats.chartData.length > 0 && (
                        <path
                          d={`M ${dashboardStats.chartData[0].x} ${dashboardStats.chartData[0].yBook} ` + dashboardStats.chartData.slice(1).map(p => `L ${p.x} ${p.yBook}`).join(' ')}
                          stroke="#6366F1"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="1"
                        />
                      )}
                      {dashboardStats.chartData.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.yRev} r="4" fill="#16A34A" />
                          <circle cx={p.x} cy={p.yBook} r="4" fill="#6366F1" />
                          <text x={p.x} y="190" textAnchor="middle" fontSize="10" fill="#9CA3AF">{p.monthName}</text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </Card>
              )}

              {/* Recent Bookings */}
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="m-0 text-lg font-semibold text-black">Recent Bookings</h2>
                  <button
                    className="text-xs font-semibold text-zinc-500 hover:text-black"
                    onClick={() => setActiveTab('bookings')}
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-2">
                  {recentBookings.length === 0 && (
                    <p className="text-sm text-zinc-400">No recent bookings.</p>
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
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        b.status === 'completed' ? 'bg-emerald-100 text-emerald-600'
                        : b.status === 'pending' ? 'bg-amber-100 text-amber-600'
                        : b.status === 'rejected' || b.status === 'cancelled' ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                      }`}>
                        {capitalize(b.status?.replace(/_/g, ' ') || 'N/A')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Providers */}
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="m-0 text-lg font-semibold text-black">Recent Providers</h2>
                  <button
                    className="text-xs font-semibold text-zinc-500 hover:text-black"
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
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-black text-xs font-bold text-white">
                        {(p?.user?.firstName?.[0] || 'P').toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-sm font-semibold text-black">
                          {getUserName(p)}
                        </p>
                        <p className="m-0 truncate text-xs text-zinc-500">{p.businessName || 'N/A'}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-600'
                        : p.kycStatus === 'pending' ? 'bg-amber-100 text-amber-600'
                        : 'bg-red-100 text-red-600'
                      }`}>
                        {capitalize(p.kycStatus || 'N/A')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <Card className="p-5">
            <SectionTitle title="Categories" loading={loading} />
            <form className="mb-6 grid gap-3 md:grid-cols-3" onSubmit={handleCreateCategory}>
              <div>
                <Input name="name" value={categoryForm.name} onChange={handleCategoryChange} placeholder="Category name" required />
                {suggestedCategoryNames.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase self-center">Suggestions:</span>
                    {suggestedCategoryNames.map(word => (
                      <button
                        key={word}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, name: capitalizeWords(word) })}
                        className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700 hover:border-amber-500 hover:text-amber-500 transition duration-200"
                      >
                        {capitalizeWords(word)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input name="description" value={categoryForm.description} onChange={handleCategoryChange} placeholder="Description" />
              <Input type="file" accept="image/*" onChange={handleCategoryImageUpload} required={!categoryForm.image} />
              {categoryForm.image && (
                <div className="flex items-center gap-3 rounded-2xl bg-[#f8ebe6] p-3 md:col-span-3">
                  <img className="h-16 w-16 rounded-2xl object-cover" src={categoryForm.image} alt="category" loading="lazy" />
                  <p className="m-0 text-sm font-semibold text-zinc-700">Category image uploaded</p>
                </div>
              )}
              {uploading && <p className="m-0 text-sm font-semibold text-zinc-600 md:col-span-3">Uploading image...</p>}
              <Button className="md:col-span-3" variant="gradient" title="Create Category">
                <AddCircleOutlineOutlinedIcon fontSize="small" />
                Create Category
              </Button>
            </form>

            {/* Search and Sort controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                />
                <select
                  value={categorySort}
                  onChange={(e) => setCategorySort(e.target.value)}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                >
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
              </div>
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                <button
                  onClick={() => categoriesView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${categoriesView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Table View"
                >
                  <TableRowsOutlinedIcon fontSize="small" />
                </button>
                <button
                  onClick={() => categoriesView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${categoriesView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Card View"
                >
                  <GridViewOutlinedIcon fontSize="small" />
                </button>
              </div>
            </div>

            {categoriesView.view === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="bg-[#f8ebe6] text-zinc-700">
                    <tr>
                      <th className="p-3">Image</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Deleted</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedCategories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-3 text-center text-zinc-400">No categories found.</td>
                      </tr>
                    ) : (
                      filteredAndSortedCategories.map((item) => (
                        <tr key={item._id} className="border-b border-zinc-100">
                          <td className="p-3">
                            {item.image ? (
                              <img className="h-12 w-12 rounded-2xl object-cover" src={item.image} alt={item.name} loading="lazy" />
                            ) : (
                              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                                {(item.name || 'C')[0].toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-semibold">{capitalizeWords(item.name)}</td>
                          <td className="p-3">{capitalize(item.description) || 'N/A'}</td>
                          <td className="p-3">{item.isActive ? 'Active' : 'Inactive'}</td>
                          <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
                          <td className="flex items-center gap-2 p-3">
                            <button
                              onClick={() => handleCategoryStatus(item._id, !item.isActive)}
                              className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors"
                              title={item.isActive ? 'Deactivate Category' : 'Activate Category'}
                            >
                              {item.isActive ? (
                                <ToggleOnOutlinedIcon className="text-emerald-500" fontSize="medium" />
                              ) : (
                                <ToggleOffOutlinedIcon className="text-zinc-400" fontSize="medium" />
                              )}
                            </button>
                            {item.isDeleted ? (
                              <>
                                <button
                                  onClick={() => handleRestore('category', item._id)}
                                  className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                                  title="Restore Category"
                                >
                                  <RestoreFromTrashOutlinedIcon fontSize="small" />
                                </button>
                                <button
                                  onClick={() => handleHardDelete('category', item._id)}
                                  className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                  title="Permanently Delete Category"
                                >
                                  <DeleteForeverOutlinedIcon fontSize="small" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleSoftDelete('category', item._id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                                title="Delete Category"
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedCategories.length === 0 ? (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No categories found.</p>
                ) : (
                  filteredAndSortedCategories.map((item) => (
                    <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img className="h-12 w-12 rounded-2xl object-cover" src={item.image} alt={item.name} loading="lazy" />
                          ) : (
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                              {(item.name || 'C')[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-base m-0 text-black dark:text-white">{capitalizeWords(item.name)}</h4>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold mt-1.5 ${item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        {item.isDeleted && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-1 mb-4">{capitalize(item.description) || 'No description provided.'}</p>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCategoryStatus(item._id, !item.isActive)}
                            className="p-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 transition-colors"
                            title={item.isActive ? 'Deactivate Category' : 'Activate Category'}
                          >
                            {item.isActive ? (
                              <ToggleOnOutlinedIcon className="text-emerald-500" fontSize="small" />
                            ) : (
                              <ToggleOffOutlinedIcon className="text-zinc-400" fontSize="small" />
                            )}
                          </button>
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore('category', item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Category"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDelete('category', item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Category"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDelete('category', item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Category"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="p-5">
            <SectionTitle title="Users" loading={loading} />

            {/* Search and Sort controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Search users by name, email, phone or status..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                />
                <select
                  value={userSort}
                  onChange={(e) => setUserSort(e.target.value)}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                >
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
              </div>
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                <button
                  onClick={() => usersView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${usersView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Table View"
                >
                  <TableRowsOutlinedIcon fontSize="small" />
                </button>
                <button
                  onClick={() => usersView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${usersView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Card View"
                >
                  <GridViewOutlinedIcon fontSize="small" />
                </button>
              </div>
            </div>

            {usersView.view === 'table' ? (
              <UserTable data={filteredAndSortedUsers} onStatus={handleUserStatus} onDelete={(id) => handleSoftDelete('user', id)} onRestore={(id) => handleRestore('user', id)} onHardDelete={(id) => handleHardDelete('user', id)} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedUsers.length === 0 ? (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No users found.</p>
                ) : (
                  filteredAndSortedUsers.map((item) => (
                    <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold text-base">
                            {(item.firstName || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-base m-0 text-black dark:text-white">{capitalizeWords(`${item.firstName || ''} ${item.lastName || ''}`.trim()) || 'N/A'}</h4>
                            <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{item.email}</span>
                          </div>
                        </div>
                        {item.isDeleted && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 mb-4">
                        <p><strong>Phone:</strong> {item.phone || 'N/A'}</p>
                        <p><strong>Status:</strong> <span className="capitalize font-semibold">{item.status}</span></p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <select
                          className="rounded-full border border-zinc-200 px-3 py-1.5 bg-white text-zinc-700 text-xs"
                          value={item.status}
                          onChange={(e) => handleUserStatus(item._id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                        </select>
                        <div className="flex items-center gap-1">
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore('user', item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore User"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDelete('user', item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete User"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDelete('user', item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete User"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'admins' && (
          <Card className="p-5">
            <SectionTitle title="Admins" loading={loading} />

            {/* Create Admin Form */}
            <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-black">Create New Admin</h3>
              <form onSubmit={handleCreateAdmin}>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">First Name *</label>
                    <input
                      name="firstName" value={adminForm.firstName} onChange={handleAdminFormChange}
                      placeholder="First name" required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Last Name</label>
                    <input
                      name="lastName" value={adminForm.lastName} onChange={handleAdminFormChange}
                      placeholder="Last name"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Email *</label>
                    <input
                      name="email" value={adminForm.email} onChange={handleAdminFormChange}
                      type="email" placeholder="admin@example.com" required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Phone *</label>
                    <input
                      name="phone" value={adminForm.phone} onChange={handleAdminFormChange}
                      placeholder="10-digit phone" required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Employee ID *</label>
                    <input
                      name="employeeId" value={adminForm.employeeId} onChange={handleAdminFormChange}
                      placeholder="e.g. EMP-001" required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Assign Category *</label>
                    <select
                      name="category" value={adminForm.category} onChange={handleAdminFormChange} required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    >
                      <option value="">Select a category</option>
                      {categories.filter(c => c.isActive && !c.isDeleted).map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Assign City (Location) *</label>
                    <select
                      name="city" value={adminForm.city} onChange={handleAdminFormChange} required
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                    >
                      <option value="">Select a city</option>
                      {locations.filter(loc => loc.isActive).map((loc) => (
                        <option key={loc._id} value={loc.city}>{loc.city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-400">* A random password will be auto-generated and sent to the admin's email. One category can only have one admin.</p>
                <button
                  type="submit" disabled={adminFormLoading}
                  className="mt-4 rounded-2xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  title={adminFormLoading ? 'Creating...' : 'Create Admin & Send Credentials'}
                >
                  {adminFormLoading ? <HourglassEmptyOutlinedIcon fontSize="small" /> : <SendOutlinedIcon fontSize="small" />}
                  {adminFormLoading ? 'Creating...' : 'Create Admin & Send Credentials'}
                </button>
              </form>
            </div>

            {/* Search and Sort controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Search admins by name, email, employee ID, city or category..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                />
                <select
                  value={adminSort}
                  onChange={(e) => setAdminSort(e.target.value)}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black"
                >
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
              </div>
              {/* Layout Switcher */}
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 self-end sm:self-center">
                <button
                  onClick={() => adminsView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${adminsView.view === 'table' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Table View"
                >
                  <TableRowsOutlinedIcon fontSize="small" />
                </button>
                <button
                  onClick={() => adminsView.toggleView()}
                  className={`p-2 rounded-lg transition-colors ${adminsView.view === 'card' ? 'bg-white text-amber-500 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Card View"
                >
                  <GridViewOutlinedIcon fontSize="small" />
                </button>
              </div>
            </div>

            {adminsView.view === 'table' ? (
              <AdminTable data={filteredAndSortedAdmins} onStatus={handleAdminStatus} onDelete={(id) => handleSoftDelete('admin', id)} onRestore={(id) => handleRestore('admin', id)} onHardDelete={(id) => handleHardDelete('admin', id)} getUserName={getUserName} getUserEmail={getUserEmail} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedAdmins.length === 0 ? (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No admins found.</p>
                ) : (
                  filteredAndSortedAdmins.map((item) => (
                    <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold text-base">
                            {(getUserName(item) || 'A')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-base m-0 text-black dark:text-white">{getUserName(item)}</h4>
                            <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{getUserEmail(item)}</span>
                          </div>
                        </div>
                        {item.isDeleted && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 mb-4">
                        <p><strong>Employee ID:</strong> {item.employeeId || 'N/A'}</p>
                        <p><strong>City:</strong> {capitalizeWords(item.city) || 'N/A'}</p>
                        <p>
                          <strong>Category: </strong>
                          <span className="rounded-full bg-[#f8ebe6] px-2 py-0.5 text-[10px] font-semibold capitalize text-zinc-700">
                            {capitalizeWords(item.category?.name) || 'N/A'}
                          </span>
                        </p>
                        <p><strong>Status:</strong> <span className="capitalize font-semibold">{item.status}</span></p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <select
                          className="rounded-full border border-zinc-200 px-3 py-1.5 bg-white text-zinc-700 text-xs"
                          value={item.status}
                          onChange={(e) => handleAdminStatus(item._id, e.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <div className="flex items-center gap-1">
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore('admin', item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Admin"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDelete('admin', item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Admin"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDelete('admin', item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Admin"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'providers' && (
          <Card className="p-5">
            <SectionTitle title="Providers" loading={loading} />
            
            {/* Search and Sort controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                <input
                  type="text"
                  placeholder="Search providers by name, email, business name or KYC status..."
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
            </div>

            {providersView.view === 'table' ? (
              <ProviderTable data={filteredAndSortedProviders} onDelete={(id) => handleSoftDelete('provider', id)} onRestore={(id) => handleRestore('provider', id)} onHardDelete={(id) => handleHardDelete('provider', id)} getUserName={getUserName} getUserEmail={getUserEmail} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedProviders.length === 0 ? (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No providers found.</p>
                ) : (
                  filteredAndSortedProviders.map((item) => (
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
                            <span className="text-xs text-zinc-400 font-mono mt-0.5 block">{getUserEmail(item)}</span>
                          </div>
                        </div>
                        {item.isDeleted && (
                          <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">Deleted</span>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 mt-2 mb-4">
                        <p><strong>Business:</strong> {capitalizeWords(item.businessName) || 'N/A'}</p>
                        <p><strong>KYC:</strong> <span className="capitalize font-semibold">{item.kycStatus || 'N/A'}</span></p>
                        <p><strong>Rating:</strong> {item.averageRating || 0} ★</p>
                        <p><strong>Experience:</strong> {item.experience || 0} Yrs</p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <span className="text-[10px] text-zinc-400">Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          {item.isDeleted ? (
                            <>
                              <button
                                onClick={() => handleRestore('provider', item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Provider"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDelete('provider', item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Provider"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDelete('provider', item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Provider"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'bookings' && (
          <Card className="p-5">
            <SectionTitle title="Bookings" loading={loading} />

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
              <BookingTable data={filteredAndSortedBookings} onStatus={handleBookingStatus} onDelete={(id) => handleSoftDelete('booking', id)} onRestore={(id) => handleRestore('booking', id)} onHardDelete={(id) => handleHardDelete('booking', id)} getUserName={getUserName} showStatus={showStatus} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedBookings.length === 0 ? (
                  <p className="text-center text-zinc-400 py-6 sm:col-span-2 lg:col-span-3">No bookings found.</p>
                ) : (
                  filteredAndSortedBookings.map((item) => (
                    <Card key={item._id} className="p-5 border border-zinc-100 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-500">#{item.bookingNumber}</span>
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
                        <p><strong>Payout:</strong> ₹{item.amount}</p>
                        <p><strong>Status:</strong> <span className="capitalize font-semibold">{showStatus(item.status)}</span></p>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 border-zinc-100 dark:border-zinc-800">
                        <select
                          className="rounded-full border border-zinc-200 px-3 py-1.5 bg-white text-zinc-700 text-xs"
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
                                onClick={() => handleRestore('booking', item._id)}
                                className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full border border-emerald-200 transition-colors"
                                title="Restore Booking"
                              >
                                <RestoreFromTrashOutlinedIcon fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleHardDelete('booking', item._id)}
                                className="text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                                title="Permanently Delete Booking"
                              >
                                <DeleteForeverOutlinedIcon fontSize="small" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSoftDelete('booking', item._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-full border border-red-200 transition-colors"
                              title="Delete Booking"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'reviews' && (
          <Card className="p-5">
            <SectionTitle title="Reviews" loading={loading} />

            {/* Search and Sort controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search reviews by customer, provider, rating or comment..."
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

            <ReviewTable data={filteredAndSortedReviews} onDelete={(id) => handleSoftDelete('review', id)} onRestore={(id) => handleRestore('review', id)} onHardDelete={(id) => handleHardDelete('review', id)} getUserName={getUserName} />
          </Card>
        )}

        {activeTab === 'locations' && (
          <Card className="p-5">
            <SectionTitle title="Manage Locations" loading={loading} />

            {/* Add Location Form */}
            <div className="mb-8 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-shell)] p-5">
              <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">Add New Location</h3>
              
              {/* Optional Pincode Search Section */}
              <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] p-4">
                <label className="mb-1 block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Search Location by Pincode (Optional Auto-Fill)</label>
                <div className="flex gap-2">
                  <input
                    value={lookupPincode}
                    onChange={(e) => setLookupPincode(e.target.value)}
                    placeholder="e.g. 302001"
                    className="w-[180px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-shell)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                  />
                  <Button
                    type="button"
                    disabled={lookupLoading}
                    onClick={handleLookupPincode}
                    variant="outline"
                    className="h-[46px] px-4"
                  >
                    {lookupLoading ? 'Searching...' : 'Search Location'}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleCreateLocation} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">City Name *</label>
                    <input
                      name="city"
                      value={locationForm.city}
                      onChange={handleLocationFormChange}
                      placeholder="e.g. Jaipur"
                      required
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">District Name *</label>
                    <input
                      name="district"
                      value={locationForm.district}
                      onChange={handleLocationFormChange}
                      placeholder="e.g. Jaipur District"
                      required
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-muted)]">State *</label>
                    <input
                      name="state"
                      value={locationForm.state}
                      onChange={handleLocationFormChange}
                      placeholder="e.g. Rajasthan"
                      required
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-black focus:ring-4 focus:ring-black/5"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={locationLoading} variant="gradient" className="h-[46px] px-6 self-start">
                  {locationLoading ? 'Adding...' : 'Add Location'}
                </Button>
              </form>
            </div>

            {/* Search filter for locations */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search locations by city, state, district or pincode..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-black"
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
                            const isPinActive = pinObj.isActive !== false;
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
                    <button
                      onClick={() => handleDeleteLocation(item._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Delete Location"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
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
        uploadEndpoint={`${API_URL}/superadmin/upload/image`}
        profileEndpoint={`${API_URL}/superadmin/profile`}
      />
    )}
  </>
  )
}

const SectionTitle = ({ title, loading }) => {
  return (
    <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <h2 className="m-0 text-3xl font-semibold text-black">{title}</h2>
      {loading && <p className="m-0 text-sm font-semibold text-zinc-500">Loading...</p>}
    </div>
  )
}

const UserTable = ({ data, onStatus, onDelete, onRestore, onHardDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[940px] text-left text-sm">
        <thead className="bg-[#f8ebe6] text-zinc-700">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Status</th>
            <th className="p-3">Deleted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b border-zinc-100">
              <td className="p-3 font-semibold">{capitalizeWords(`${item.firstName || ''} ${item.lastName || ''}`.trim()) || 'N/A'}</td>
              <td className="p-3">{item.email}</td>
              <td className="p-3">{item.phone}</td>
              <td className="p-3 capitalize">{item.status}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex items-center gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2 bg-white text-zinc-700" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
                {item.isDeleted ? (
                  <>
                    <button
                      onClick={() => onRestore(item._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                      title="Restore User"
                    >
                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onHardDelete(item._id)}
                      className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Permanently Delete User"
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                    title="Delete User"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AdminTable = ({ data, onStatus, onDelete, onRestore, onHardDelete, getUserName, getUserEmail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1060px] text-left text-sm">
        <thead className="bg-[#f8ebe6] text-zinc-700">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Employee ID</th>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Deleted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b border-zinc-100">
              <td className="p-3 font-semibold">{getUserName(item)}</td>
              <td className="p-3">{getUserEmail(item)}</td>
              <td className="p-3">{item.employeeId || 'N/A'}</td>
              <td className="p-3">
                <span className="rounded-full bg-[#f8ebe6] px-3 py-1 text-xs font-semibold capitalize text-zinc-700">
                  {capitalizeWords(item.category?.name) || 'N/A'}
                </span>
              </td>
              <td className="p-3 capitalize">{item.status}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex items-center gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2 bg-white text-zinc-700" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {item.isDeleted ? (
                  <>
                    <button
                      onClick={() => onRestore(item._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                      title="Restore Admin"
                    >
                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onHardDelete(item._id)}
                      className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Permanently Delete Admin"
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                    title="Delete Admin"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ProviderTable = ({ data, onDelete, onRestore, onHardDelete, getUserName, getUserEmail }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[940px] text-left text-sm">
        <thead className="bg-[#f8ebe6] text-zinc-700">
          <tr>
            <th className="p-3">Provider</th>
            <th className="p-3">Email</th>
            <th className="p-3">Business</th>
            <th className="p-3">KYC</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Deleted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b border-zinc-100">
              <td className="p-3 font-semibold">{getUserName(item)}</td>
              <td className="p-3">{getUserEmail(item)}</td>
              <td className="p-3">{capitalizeWords(item.businessName) || 'N/A'}</td>
              <td className="p-3 capitalize">{item.kycStatus || 'N/A'}</td>
              <td className="p-3">{item.averageRating || 0}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="p-3 flex items-center gap-2">
                {item.isDeleted ? (
                  <>
                    <button
                      onClick={() => onRestore(item._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                      title="Restore Provider"
                    >
                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onHardDelete(item._id)}
                      className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Permanently Delete Provider"
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                    title="Delete Provider"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const BookingTable = ({ data, onStatus, onDelete, onRestore, onHardDelete, getUserName, showStatus }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1060px] text-left text-sm">
        <thead className="bg-[#f8ebe6] text-zinc-700">
          <tr>
            <th className="p-3">Booking No.</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Provider</th>
            <th className="p-3">City</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Deleted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b border-zinc-100">
              <td className="p-3 font-semibold">{item.bookingNumber}</td>
              <td className="p-3">{getUserName(item.customer)}</td>
              <td className="p-3">{getUserName(item.provider)}</td>
              <td className="p-3">{capitalizeWords(item.city)}</td>
              <td className="p-3">₹{item.amount}</td>
              <td className="p-3 capitalize">{showStatus(item.status)}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex items-center gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2 bg-white text-zinc-700" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
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
                      onClick={() => onRestore(item._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                      title="Restore Booking"
                    >
                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onHardDelete(item._id)}
                      className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Permanently Delete Booking"
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                    title="Delete Booking"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ReviewTable = ({ data, onDelete, onRestore, onHardDelete, getUserName }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead className="bg-[#f8ebe6] text-zinc-700">
          <tr>
            <th className="p-3">Customer</th>
            <th className="p-3">Provider</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Review</th>
            <th className="p-3">Deleted</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id} className="border-b border-zinc-100">
              <td className="p-3 font-semibold">{getUserName(item.customer)}</td>
              <td className="p-3">{getUserName(item.provider)}</td>
              <td className="p-3">{item.rating}</td>
              <td className="p-3">{capitalize(item.review) || 'N/A'}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="p-3 flex items-center gap-2">
                {item.isDeleted ? (
                  <>
                    <button
                      onClick={() => onRestore(item._id)}
                      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full border border-emerald-200 transition-colors"
                      title="Restore Review"
                    >
                      <RestoreFromTrashOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onHardDelete(item._id)}
                      className="text-red-700 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                      title="Permanently Delete Review"
                    >
                      <DeleteForeverOutlinedIcon fontSize="small" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors"
                    title="Delete Review"
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SuperAdminDashborad
