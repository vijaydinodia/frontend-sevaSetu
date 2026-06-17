import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined'
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import API_URL from '../api'
import ProviderSidebar from '../components/ProviderSidebar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import UseFetch from '../custom_hook/UseFetch'
import useTheme from '../custom_hook/UseTheme'
import { capitalize, capitalizeWords } from '../lib/utils'
import UseView from '../custom_hook/UseView'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined'

const defaultServices = [
  { name: "Hourly bookings", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Hourly+bookings", description: "Flexible hourly cleaning and housekeeping bookings.", category: "Cleaning & Housekeeping" },
  { name: "Bathroom Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Bathroom+Cleaning", description: "Deep cleaning of bathroom floors, walls, and fixtures.", category: "Cleaning & Housekeeping" },
  { name: "Fridge Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Fridge+Cleaning", description: "Thorough cleaning of refrigerator interior and exterior.", category: "Cleaning & Housekeeping" },
  { name: "Packing or Unpacking", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Packing+or+Unpacking", description: "Assistance with packing or unpacking boxes and luggage.", category: "Cleaning & Housekeeping" },
  { name: "Utensils", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Utensils", description: "Cleaning and organizing daily utensils and dishware.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Prep", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Kitchen+Prep", description: "Chopping vegetables and preparing ingredients for cooking.", category: "Cleaning & Housekeeping" },
  { name: "Dusting & Wiping", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Dusting+%26+Wiping", description: "Detailed dusting and wiping of all surfaces and furniture.", category: "Cleaning & Housekeeping" },
  { name: "Sweeping & Mopping", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Sweeping+%26+Mopping", description: "Thorough sweeping and mopping of all floor areas.", category: "Cleaning & Housekeeping" },
  { name: "Pre-Party Express Clean", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Pre-Party+Express+Clean", description: "Quick and efficient cleaning before guests arrive.", category: "Cleaning & Housekeeping" },
  { name: "Complete Wardrobe Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Complete+Wardrobe+Cleaning", description: "Organizing and cleaning the inside of wardrobes.", category: "Cleaning & Housekeeping" },
  { name: "After-Party Express Clean", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=After-Party+Express+Clean", description: "Post-party cleanup of living areas and kitchen.", category: "Cleaning & Housekeeping" },
  { name: "Ironing & Folding", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Ironing+%26+Folding", description: "Ironing and neatly folding clothes.", category: "Cleaning & Housekeeping" },
  { name: "Window Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Window+Cleaning", description: "Wiping and washing interior and exterior windows.", category: "Cleaning & Housekeeping" },
  { name: "Laundry", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Laundry", description: "Washing, drying, and basic folding of daily clothes.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Kitchen+Cleaning", description: "Deep cleaning of kitchen countertops, sinks, and floors.", category: "Cleaning & Housekeeping" },
  { name: "Balcony Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Balcony+Cleaning", description: "Cleaning of balcony floors and railings.", category: "Cleaning & Housekeeping" },
  { name: "Fan Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Fan+Cleaning", description: "Dusting and wiping down ceiling fans.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Cabinet Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Kitchen+Cabinet+Cleaning", description: "Cleaning the interior and exterior of kitchen cabinets.", category: "Cleaning & Housekeeping" },
  { name: "Plant Care", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Plant+Care", description: "Watering and basic pruning of indoor plants.", category: "Cleaning & Housekeeping" },
  { name: "Car Surface Cleaning", image: "https://placehold.co/400x300/f8ebe6/a07c42?text=Car+Surface+Cleaning", description: "Exterior wipe down and basic interior cleaning of car.", category: "Cleaning & Housekeeping" },
]

const ProviderDashborad = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const bookingsView = UseView('provider_bookings', 'card')
  const servicesView = UseView('provider_services', 'card')
  const reviewsView = UseView('provider_reviews', 'card')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)
  
  // OTP Modal state
  const [otpModal, setOtpModal] = useState({ show: false, bookingId: null, targetStatus: '', otp: '' })

  // Service management states
  const [myServices, setMyServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [customServiceName, setCustomServiceName] = useState('')
  const [customServiceDesc, setCustomServiceDesc] = useState('')
  const [customServiceCategory, setCustomServiceCategory] = useState('')
  const [customServiceImage, setCustomServiceImage] = useState('')
  
  // Datamuse API suggestions
  const [suggestedServiceNames, setSuggestedServiceNames] = useState([])
  const [isFetchingServiceNames, setIsFetchingServiceNames] = useState(false)

  // Form state for profile updating
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    profileImage: '',
    fullAddress: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    businessName: '',
    experience: '',
    skills: '',
    serviceAreas: '',
    description: '',
    category: '',
  })

  // Check auth token
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Datamuse API for related service titles
  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = customServiceName.trim()
      if (q.length < 3) {
        setSuggestedServiceNames([])
        return
      }
      setIsFetchingServiceNames(true)
      try {
        const res = await axios.get(`https://api.datamuse.com/words?ml=${encodeURIComponent(q)}&max=6`)
        if (res.data && res.data.length > 0) {
          setSuggestedServiceNames(res.data.map(item => item.word))
        } else {
          setSuggestedServiceNames([])
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      } finally {
        setIsFetchingServiceNames(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 600)
    return () => clearTimeout(debounceTimer)
  }, [customServiceName])

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  })

  // Bookings Tab Filters, Search and Sort States
  const [bookingFilter, setBookingFilter] = useState('all')
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingSort, setBookingSort] = useState('dateNewest')

  // Services Tab Search and Sort States
  const [serviceSearch, setServiceSearch] = useState('')
  const [serviceSort, setServiceSort] = useState('nameAsc')

  // Reviews Tab Search and Sort States
  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewSort, setReviewSort] = useState('dateNewest')

  // Fetch using custom hooks
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = UseFetch(`${API_URL}/provider/profile`, { autoFetch: !!token })

  const {
    data: bookingsData,
    loading: bookingsLoading,
    refetch: refetchBookings,
  } = UseFetch(`${API_URL}/provider/bookings`, { autoFetch: !!token })

  const {
    data: reviewsData,
    loading: reviewsLoading,
    refetch: refetchReviews,
  } = UseFetch(`${API_URL}/provider/reviews`, { autoFetch: !!token })

  const {
    data: categoriesData,
    loading: categoriesLoading,
  } = UseFetch(`${API_URL}/provider/categories`, { autoFetch: !!token })

  // Destructure database items
  const provider = profileData?.data
  const userDetails = provider?.user
  const bookings = bookingsData?.data || []
  const reviews = reviewsData?.data || []
  const categories = categoriesData?.data || []

  // Initialize profile update form when data is loaded
  useEffect(() => {
    if (provider && userDetails) {
      setProfileForm({
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        phone: userDetails.phone || '',
        profileImage: userDetails.profileImage || '',
        fullAddress: userDetails.address?.fullAddress || '',
        city: userDetails.address?.city || '',
        state: userDetails.address?.state || '',
        country: userDetails.address?.country || '',
        pincode: userDetails.address?.pincode || '',
        businessName: provider.businessName || '',
        experience: provider.experience || 0,
        skills: provider.skills?.join(', ') || '',
        serviceAreas: provider.serviceAreas?.join(', ') || '',
        description: provider.description || '',
        category: provider.category?._id || provider.category || '',
      })
    }
  }, [provider, userDetails])

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 4000)
  }

  const fetchProviderServices = async () => {
    setLoadingServices(true)
    try {
      const resMy = await axios.get(`${API_URL}/provider/services/my`, getHeaders())
      if (resMy.data?.success) {
        setMyServices(resMy.data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch provider services:", err)
    } finally {
      setLoadingServices(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'services') {
      fetchProviderServices()
    }
  }, [activeTab])

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault()
    if (!customServiceName || !customServiceDesc || !customServiceCategory || !customPrice) return
    setActionLoading(true)
    try {
      const payload = {
        serviceName: customServiceName,
        description: customServiceDesc,
        category: customServiceCategory,
        price: Number(customPrice),
        image: customServiceImage,
      };

      const res = await axios.post(
        `${API_URL}/provider/services/add`,
        payload,
        getHeaders()
      )
      showNotification(res.data.message || 'Service added successfully!')
      setCustomPrice('')
      setCustomServiceName('')
      setCustomServiceDesc('')
      setCustomServiceCategory('')
      setCustomServiceImage('')
      fetchProviderServices()
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveService = async (providerServiceId) => {
    if (!window.confirm("Are you sure you want to remove this service from your offerings?")) return
    setActionLoading(true)
    try {
      const res = await axios.delete(
        `${API_URL}/provider/services/remove/${providerServiceId}`,
        getHeaders()
      )
      showNotification(res.data.message || 'Service removed successfully')
      fetchProviderServices()
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle booking status updates
  const handleUpdateStatus = async (bookingId, newStatus, providedOtp = '') => {
    if ((newStatus === 'started' || newStatus === 'completed') && !providedOtp) {
      setOtpModal({ show: true, bookingId, targetStatus: newStatus, otp: '' })
      return
    }

    setActionLoading(true)
    try {
      const payload = { status: newStatus }
      if (providedOtp) payload.otp = providedOtp

      const res = await axios.put(
        `${API_URL}/provider/bookings/${bookingId}/status`,
        payload,
        getHeaders()
      )
      showNotification(res.data.message || `Booking status updated to ${newStatus}`)
      if (otpModal.show) setOtpModal({ show: false, bookingId: null, targetStatus: '', otp: '' })
      refetchBookings()
      refetchProfile() // refetch for totalEarnings / totalBookings update
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  // Upload image to cloudinary endpoint
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const imageData = new FormData()
      imageData.append('image', file)

      const res = await axios.post(`${API_URL}/user/upload/image`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setProfileForm((prev) => ({ ...prev, profileImage: res.data.data.url }))
      showNotification('Image uploaded successfully! Save changes to persist.')
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  // Submit profile edit form
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await axios.put(
        `${API_URL}/provider/profile/edit`,
        {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone,
          profileImage: profileForm.profileImage,
          address: {
            fullAddress: profileForm.fullAddress,
            city: profileForm.city,
            state: profileForm.state,
            country: profileForm.country,
            pincode: profileForm.pincode,
          },
          businessName: profileForm.businessName,
          category: profileForm.category,
          experience: profileForm.experience,
          skills: profileForm.skills,
          serviceAreas: profileForm.serviceAreas,
          description: profileForm.description,
        },
        getHeaders()
      )
      showNotification(res.data.message || 'Profile updated successfully')
      
      // Update local storage user entry too
      if (res.data.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.data.user))
      }
      refetchProfile()
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredBookings = bookings
    .filter((b) => {
      // 1. Status Filter
      if (bookingFilter !== 'all') {
        if (bookingFilter === 'pending' && b.status !== 'pending') return false
        if (bookingFilter === 'active' && !['accepted', 'on_the_way', 'started'].includes(b.status)) return false
        if (bookingFilter === 'completed' && b.status !== 'completed') return false
      }
      
      // 2. Search Text Filter
      const q = bookingSearch.toLowerCase().trim()
      if (q) {
        const bNo = b.bookingNumber?.toString() || ''
        const sTitle = b.service?.title || b.service?.serviceName || ''
        const cName = b.customer ? `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase() : ''
        if (!bNo.includes(q) && !sTitle.toLowerCase().includes(q) && !cName.includes(q)) {
          return false
        }
      }
      return true
    })
    .sort((a, b) => {
      if (bookingSort === 'dateNewest') return new Date(b.bookingDate) - new Date(a.bookingDate)
      if (bookingSort === 'dateOldest') return new Date(a.bookingDate) - new Date(b.bookingDate)
      if (bookingSort === 'amountHigh') return b.amount - a.amount
      if (bookingSort === 'amountLow') return a.amount - b.amount
      return 0
    })

  const filteredAndSortedServices = myServices
    .filter((ps) => {
      const q = serviceSearch.toLowerCase().trim()
      if (!q) return true
      const sName = ps.service?.serviceName?.toLowerCase() || ''
      const sDesc = ps.service?.description?.toLowerCase() || ''
      const sCat = ps.service?.category?.name?.toLowerCase() || ''
      return sName.includes(q) || sDesc.includes(q) || sCat.includes(q)
    })
    .sort((a, b) => {
      if (serviceSort === 'priceLow') return a.price - b.price
      if (serviceSort === 'priceHigh') return b.price - a.price
      if (serviceSort === 'nameAsc') return (a.service?.serviceName || '').localeCompare(b.service?.serviceName || '')
      if (serviceSort === 'nameDesc') return (b.service?.serviceName || '').localeCompare(a.service?.serviceName || '')
      return 0
    })

  const filteredAndSortedReviews = reviews
    .filter((r) => {
      const q = reviewSearch.toLowerCase().trim()
      if (!q) return true
      const cName = r.customer ? `${r.customer.firstName} ${r.customer.lastName}`.toLowerCase() : ''
      const reviewText = r.review?.toLowerCase() || ''
      const ratingStr = r.rating?.toString() || ''
      return cName.includes(q) || reviewText.includes(q) || ratingStr === q
    })
    .sort((a, b) => {
      if (reviewSort === 'dateNewest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (reviewSort === 'dateOldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (reviewSort === 'ratingHigh') return b.rating - a.rating
      if (reviewSort === 'ratingLow') return a.rating - b.rating
      return 0
    })

  // Loader state
  const isGlobalLoading = profileLoading || bookingsLoading || reviewsLoading || categoriesLoading

  // Dynamic CSS classes for Theme compatibility
  const bgTheme = theme === 'light' ? 'bg-[#f8ebe6] text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
  const textMuted = theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'
  const inputBg = theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-800 text-zinc-100 border-zinc-700'

  return (
    <div className={`dashboard-shell ${bgTheme}`}>
      <ProviderSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <main className="main-col p-4 md:p-8">
        {/* Header bar */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-amber-500/20 bg-zinc-100">
                {userDetails?.profileImage ? (
                  <img
                    className="h-full w-full object-cover"
                    src={userDetails.profileImage}
                    alt="profile"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white">
                    <PersonOutlineOutlinedIcon fontSize="large" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h1 className="m-0 text-3xl font-bold tracking-tight">
                {userDetails ? capitalizeWords(`${userDetails.firstName} ${userDetails.lastName}`) : 'Loading...'}
              </h1>
              <p className={`mt-1 text-sm ${textMuted}`}>
                {provider?.businessName ? capitalizeWords(provider.businessName) : 'Service Provider'}
              </p>
            </div>
          </div>

          {/* KYC Status Badge */}
          {provider && (
            <div>
              {provider.kycStatus === 'approved' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-500 border border-emerald-500/20">
                  <CheckCircleOutlineOutlinedIcon fontSize="small" /> Verified Partner
                </span>
              )}
              {provider.kycStatus === 'pending' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-500 border border-amber-500/20">
                  <InfoOutlinedIcon fontSize="small" /> KYC Verification Pending
                </span>
              )}
              {provider.kycStatus === 'rejected' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500 border border-red-500/20">
                  <HighlightOffOutlinedIcon fontSize="small" /> Verification Rejected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action / Success Notifications */}
        {notification && (
          <div className="mb-6 animate-pulse rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            {notification}
          </div>
        )}

        {/* Global Loading Spinner */}
        {isGlobalLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        )}

        {!isGlobalLoading && (
          <>
            {/* ─── TAB: DASHBOARD ─── */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Earnings */}
                  <div className={`dashboard-card flex items-center justify-between border ${cardTheme} transition-transform hover:-translate-y-1`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Total Earnings</p>
                      <h3 className="mt-1 text-2xl font-bold text-amber-500">
                        ₹{provider?.totalEarnings?.toLocaleString() || 0}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">
                      <CurrencyRupeeOutlinedIcon />
                    </div>
                  </div>

                  {/* Bookings */}
                  <div className={`dashboard-card flex items-center justify-between border ${cardTheme} transition-transform hover:-translate-y-1`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Completed Jobs</p>
                      <h3 className="mt-1 text-2xl font-bold text-amber-500">{provider?.totalBookings || 0}</h3>
                    </div>
                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">
                      <CalendarMonthOutlinedIcon />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className={`dashboard-card flex items-center justify-between border ${cardTheme} transition-transform hover:-translate-y-1`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Rating</p>
                      <h3 className="mt-1 text-2xl font-bold text-amber-500">{provider?.averageRating || 'N/A'}</h3>
                    </div>
                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">
                      <StarRateOutlinedIcon />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className={`dashboard-card flex items-center justify-between border ${cardTheme} transition-transform hover:-translate-y-1`}>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted}`}>Experience</p>
                      <h3 className="mt-1 text-2xl font-bold text-amber-500">{provider?.experience || 0} Yrs</h3>
                    </div>
                    <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-500">
                      <WorkOutlineOutlinedIcon />
                    </div>
                  </div>
                </div>

                {/* KYC Guidance Banner */}
                {provider && provider.kycStatus === 'pending' && (
                  <div className="rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-6">
                    <h4 className="text-base font-bold text-amber-500 flex items-center gap-2">
                      <InfoOutlinedIcon /> Verification Under Process
                    </h4>
                    <p className={`mt-2 text-sm leading-relaxed ${textMuted}`}>
                      We are currently verifying your professional certificates and credentials. It typically takes 24-48 hours. 
                      Once verified, you will receive confirmation by email and you will start receiving direct service queries from users.
                    </p>
                  </div>
                )}

                {/* Recent Bookings section */}
                <div className={`dashboard-card border ${cardTheme}`}>
                  <h3 className="text-xl font-bold mb-4">Recent Bookings</h3>
                  {bookings.length === 0 ? (
                    <p className={`py-6 text-center ${textMuted}`}>No bookings assigned yet.</p>
                  ) : (
                    <div className="table-scroll">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className={`border-b ${theme === 'light' ? 'border-zinc-200' : 'border-zinc-800'}`}>
                            <th className="py-3 font-semibold">Booking ID</th>
                            <th className="py-3 font-semibold">Service</th>
                            <th className="py-3 font-semibold">Customer</th>
                            <th className="py-3 font-semibold">Date & Time</th>
                            <th className="py-3 font-semibold">Amount</th>
                            <th className="py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 5).map((b) => (
                            <tr key={b._id} className={`border-b ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800/50'} hover:bg-black/5`}>
                              <td className="py-4 font-mono text-xs">{b.bookingNumber}</td>
                              <td className="py-4 font-medium">{capitalizeWords(b.service?.title) || 'N/A'}</td>
                              <td className="py-4">
                                {b.customer ? capitalizeWords(`${b.customer.firstName} ${b.customer.lastName}`) : 'Unknown'}
                              </td>
                              <td className="py-4">
                                {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                              </td>
                              <td className="py-4 font-bold text-amber-500">₹{b.amount}</td>
                              <td className="py-4">
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : b.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    : b.status === 'rejected' || b.status === 'cancelled'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                }`}>
                                  {capitalizeWords(b.status.replace(/_/g, ' '))}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB: BOOKINGS ─── */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'active', 'completed'].map((f) => (
                    <button
                      key={f}
                      className={`rounded-2xl px-4 py-1.5 text-xs font-semibold capitalize border transition-all ${
                        bookingFilter === f
                          ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                          : theme === 'light'
                          ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                      onClick={() => setBookingFilter(f)}
                    >
                      {f} Bookings
                    </button>
                  ))}
                </div>

                {/* Search and Sort controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <input
                    type="text"
                    placeholder="Search bookings by ID, customer name or service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                  />
                  <div className="flex items-center gap-3">
                    <select
                      value={bookingSort}
                      onChange={(e) => setBookingSort(e.target.value)}
                      className={`flex-1 sm:flex-initial rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                    >
                      <option value="dateNewest">Date: Newest First</option>
                      <option value="dateOldest">Date: Oldest First</option>
                      <option value="amountHigh">Price: High to Low</option>
                      <option value="amountLow">Price: Low to High</option>
                    </select>

                    {/* Layout Switcher */}
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => bookingsView.toggleView()}
                        className={`p-2 rounded-lg transition-colors ${
                          bookingsView.view === 'table'
                            ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                        title="Table View"
                      >
                        <TableRowsOutlinedIcon fontSize="small" />
                      </button>
                      <button
                        onClick={() => bookingsView.toggleView()}
                        className={`p-2 rounded-lg transition-colors ${
                          bookingsView.view === 'card'
                            ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                        title="Card View"
                      >
                        <GridViewOutlinedIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bookings cards/list */}
                {filteredBookings.length === 0 ? (
                  <div className={`dashboard-card text-center py-12 border ${cardTheme}`}>
                    <p className={textMuted}>No bookings match the filter criteria.</p>
                  </div>
                ) : bookingsView.view === 'table' ? (
                  <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full border-collapse text-left text-sm min-w-[800px]">
                      <thead>
                        <tr className={`border-b ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                          <th className="p-4 font-semibold">Booking ID</th>
                          <th className="p-4 font-semibold">Service</th>
                          <th className="p-4 font-semibold">Customer</th>
                          <th className="p-4 font-semibold">Date & Time</th>
                          <th className="p-4 font-semibold">Amount</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => (
                          <tr key={b._id} className={`border-b ${theme === 'light' ? 'border-zinc-100 hover:bg-zinc-50' : 'border-zinc-800/50 hover:bg-zinc-800/20'}`}>
                            <td className="p-4 font-mono text-xs text-amber-500 font-bold">{b.bookingNumber}</td>
                            <td className="p-4 font-medium">
                              <div>{capitalizeWords(b.service?.title) || 'N/A'}</div>
                              <div className="text-[10px] text-zinc-400">
                                Category: {capitalizeWords(b.service?.category?.title) || 'N/A'}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>{b.customer ? capitalizeWords(`${b.customer.firstName} ${b.customer.lastName}`) : 'Unknown'}</div>
                              <div className="text-xs text-zinc-400">{b.customer?.phone || 'N/A'}</div>
                            </td>
                            <td className="p-4">
                              {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                            </td>
                            <td className="p-4 font-bold text-amber-500">₹{b.amount}</td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1.5 items-start">
                                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : b.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    : b.status === 'rejected' || b.status === 'cancelled'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                                }`}>
                                  {capitalizeWords(b.status.replace(/_/g, ' '))}
                                </span>
                                {b.status === 'completed' && (
                                  <span className={`text-[10px] font-semibold ${b.paymentStatus === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {b.paymentStatus === 'completed' ? `Paid (${capitalizeWords(b.paymentMethod)})` : 'Payment Pending'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-row justify-center gap-2">
                                {b.status === 'pending' && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="gradient"
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateStatus(b._id, 'accepted')}
                                      title="Accept"
                                    >
                                      <CheckCircleOutlineOutlinedIcon fontSize="small" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={actionLoading}
                                      onClick={() => handleUpdateStatus(b._id, 'rejected')}
                                      title="Reject"
                                    >
                                      <CancelOutlinedIcon fontSize="small" />
                                    </Button>
                                  </>
                                )}

                                {b.status === 'accepted' && (
                                  <Button
                                    size="sm"
                                    variant="gradient"
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(b._id, 'on_the_way')}
                                    title="On The Way"
                                  >
                                    <DirectionsCarOutlinedIcon fontSize="small" />
                                  </Button>
                                )}

                                {b.status === 'on_the_way' && (
                                  <Button
                                    size="sm"
                                    variant="gradient"
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(b._id, 'started')}
                                    title="Start Job"
                                  >
                                    <PlayCircleOutlineOutlinedIcon fontSize="small" />
                                  </Button>
                                )}

                                {b.status === 'started' && (
                                  <Button
                                    size="sm"
                                    variant="gradient"
                                    disabled={actionLoading}
                                    onClick={() => handleUpdateStatus(b._id, 'completed')}
                                    title="Complete Job"
                                  >
                                    <TaskAltOutlinedIcon fontSize="small" />
                                  </Button>
                                )}

                                {['completed', 'rejected', 'cancelled'].includes(b.status) && (
                                  <span className={`text-xs font-semibold ${textMuted}`}>
                                    No actions
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {filteredBookings.map((b) => (
                      <div key={b._id} className={`dashboard-card border ${cardTheme} flex flex-col justify-between min-w-0`}>
                        <div>
                          <div className="flex items-center justify-between border-b pb-3 mb-3 border-zinc-100 dark:border-zinc-800">
                            <span className="font-mono text-xs text-amber-500 font-bold">{b.bookingNumber}</span>
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                              b.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : b.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-500'
                                : b.status === 'rejected' || b.status === 'cancelled'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-indigo-500/10 text-indigo-500'
                            }`}>
                              {capitalizeWords(b.status.replace(/_/g, ' '))}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold">{capitalizeWords(b.service?.title) || 'N/A'}</h4>
                          <p className={`text-xs mt-1 font-semibold text-zinc-400`}>
                            Category: {capitalizeWords(b.service?.category?.title) || 'N/A'}
                          </p>

                          <div className="mt-4 space-y-2 text-sm">
                            <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
                              <span className={textMuted}>Customer:</span>
                              <span className="font-semibold text-right break-words">
                                {b.customer ? capitalizeWords(`${b.customer.firstName} ${b.customer.lastName}`) : 'Unknown'}
                              </span>
                            </div>
                            <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
                              <span className={textMuted}>Phone:</span>
                              <span className="font-semibold text-right break-words">{b.customer?.phone || 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
                              <span className={textMuted}>Date/Time:</span>
                              <span className="font-semibold text-right break-words">
                                {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                              </span>
                            </div>
                            <div className="grid grid-cols-[90px_1fr] gap-2 items-start">
                              <span className={textMuted}>Address:</span>
                              <span className="font-semibold text-right break-words">
                                {b.address}, {capitalizeWords(b.city)}
                              </span>
                            </div>
                            <p className="flex justify-between border-t pt-2 mt-2 border-zinc-100 dark:border-zinc-800">
                              <span className="font-bold">Total Payout:</span>
                              <span className="font-bold text-amber-500">₹{b.amount}</span>
                            </p>
                            {b.status === 'completed' && (
                              <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 text-zinc-500">Payment Details</p>
                                {b.paymentStatus === 'completed' ? (
                                  <div>
                                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Paid via {capitalizeWords(b.paymentMethod)}</p>
                                    <p className="text-[10px] text-zinc-400 mt-0.5">On: {new Date(b.paymentDate).toLocaleString()}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm font-semibold text-amber-500">Pending Customer Payment</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Status Action buttons */}
                        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          {b.status === 'pending' && (
                            <>
                              <Button
                                className="flex-1 flex items-center justify-center gap-2"
                                variant="gradient"
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(b._id, 'accepted')}
                                title="Accept"
                              >
                                <CheckCircleOutlineOutlinedIcon fontSize="small" />
                                <span>Accept</span>
                              </Button>
                              <Button
                                className="flex-1 flex items-center justify-center gap-2"
                                variant="outline"
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(b._id, 'rejected')}
                                title="Reject"
                              >
                                <CancelOutlinedIcon fontSize="small" />
                                <span>Reject</span>
                              </Button>
                            </>
                          )}

                          {b.status === 'accepted' && (
                            <Button
                              className="w-full flex items-center justify-center gap-2"
                              variant="gradient"
                              disabled={actionLoading}
                              onClick={() => handleUpdateStatus(b._id, 'on_the_way')}
                              title="Mark On The Way"
                            >
                              <DirectionsCarOutlinedIcon fontSize="small" />
                              <span>On The Way</span>
                            </Button>
                          )}

                          {b.status === 'on_the_way' && (
                            <Button
                              className="w-full flex items-center justify-center gap-2"
                              variant="gradient"
                              disabled={actionLoading}
                              onClick={() => handleUpdateStatus(b._id, 'started')}
                              title="Start Job"
                            >
                              <PlayCircleOutlineOutlinedIcon fontSize="small" />
                              <span>Start Job</span>
                            </Button>
                          )}

                          {b.status === 'started' && (
                            <Button
                              className="w-full flex items-center justify-center gap-2"
                              variant="gradient"
                              disabled={actionLoading}
                              onClick={() => handleUpdateStatus(b._id, 'completed')}
                              title="Complete Job"
                            >
                              <TaskAltOutlinedIcon fontSize="small" />
                              <span>Complete Job</span>
                            </Button>
                          )}

                          {['completed', 'rejected', 'cancelled'].includes(b.status) && (
                            <span className={`text-xs text-center w-full py-1 font-semibold ${textMuted}`}>
                              No pending actions for this order.
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB: SERVICES ─── */}
            {activeTab === 'services' && (
              <div className="flex flex-col gap-8">
                {/* Serviced Categories Section */}
                <div className={`dashboard-card border rounded-[28px] p-6 md:p-8 ${cardTheme} shadow-xl relative overflow-hidden`}>
                  {/* Decorative blur gradients */}
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
                  <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Your Category Status</h3>
                    <p className={`text-sm ${textMuted}`}>
                      Manage and track your active domains and pending approvals.
                    </p>
                  </div>
                  
                  {/* Category Status list */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {provider?.categories?.map((catApp) => {
                      const isApproved = catApp.status === 'approved';
                      const isRejected = catApp.status === 'rejected';
                      const statusColor = isApproved
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : isRejected
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20';

                      const letter = catApp.category?.name ? catApp.category.name.charAt(0).toUpperCase() : '?';

                      return (
                        <div
                          key={catApp._id}
                          className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                            theme === 'light'
                              ? 'bg-zinc-50/80 border-zinc-100 hover:bg-white hover:border-zinc-200'
                              : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Avatar Category Letter or Image */}
                            {catApp.category?.image ? (
                              <img className="h-11 w-11 rounded-xl object-cover" src={catApp.category.image} alt={catApp.category.name} loading="lazy" />
                            ) : (
                              <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-base shadow-inner ${
                                isApproved
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : isRejected
                                  ? 'bg-red-500/10 text-red-500'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {letter}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-base truncate text-zinc-900 dark:text-zinc-50">
                                {catApp.category?.name ? capitalizeWords(catApp.category.name) : 'Unknown'}
                              </span>
                              <span className={`text-xs truncate max-w-[150px] ${textMuted}`}>
                                {catApp.category?.description ? capitalize(catApp.category.description) : 'Professional Domain'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                              {/* Pulse Dot Indicator */}
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                isApproved ? 'bg-emerald-500 animate-pulse' : isRejected ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                              }`} />
                              {capitalize(catApp.status)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Apply for Category Form */}
                  <div className="border-t pt-6 border-zinc-200/60 dark:border-zinc-800/80">
                    <h4 className="text-base font-bold mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
                        +
                      </span>
                      Expand Your Business Area
                    </h4>
                    <p className={`text-xs mb-4 ${textMuted}`}>
                      Select another category from the network to offer custom services there. Category admin review is required.
                    </p>
                    
                    {categories.filter(c => !provider?.categories?.some(pa => (pa.category?._id || pa.category) === c._id)).length === 0 ? (
                      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                        theme === 'light' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                      }`}>
                        <CheckCircleOutlineOutlinedIcon className="shrink-0" />
                        <span className="text-sm font-medium">
                          You have successfully registered for all available service categories in our network!
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const categoryId = e.target.categorySelect.value;
                          if (!categoryId) return;
                          setActionLoading(true);
                          try {
                            const res = await axios.post(
                              `${API_URL}/provider/profile/apply-category`,
                              { categoryId },
                              getHeaders()
                            );
                            showNotification(res.data.message || 'Application submitted!');
                            refetchProfile();
                          } catch (err) {
                            showNotification(err.response?.data?.message || err.message);
                          } finally {
                            setActionLoading(false);
                          }
                        }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                      >
                        <div className="flex-1">
                          <select
                            name="categorySelect"
                            className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                            required
                          >
                            <option value="">Select a new category...</option>
                            {categories
                              .filter(c => !provider?.categories?.some(pa => (pa.category?._id || pa.category) === c._id))
                              .map(c => (
                                <option key={c._id} value={c._id}>
                                  {capitalizeWords(c.name)}
                                </option>
                              ))}
                          </select>
                        </div>

                        <Button type="submit" variant="gradient" className="h-14 px-8 justify-center shrink-0 w-full sm:w-auto font-semibold flex items-center gap-2" title="Apply to Category">
                          <AddCircleOutlineOutlinedIcon fontSize="small" />
                          Apply to Category
                        </Button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Add Service Section */}
                <div className={`dashboard-card border rounded-[28px] p-6 md:p-8 ${cardTheme} shadow-xl relative overflow-hidden`}>
                  <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold tracking-tight mb-1">Create Custom Service Offerings</h3>
                    <p className={`text-sm ${textMuted}`}>
                      Design a custom service title, base price, and details to feature on the public catalog.
                    </p>
                  </div>

                  {/* KYC Pending Warning Banner */}
                  {categories.filter(c => provider?.categories?.some(cat => (cat.category?._id || cat.category) === c._id && cat.status === 'approved')).length === 0 ? (
                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm mb-4 leading-relaxed">
                      ⚠️ <strong>KYC Verification Required:</strong> You cannot list any service offerings until at least one of your category applications is reviewed and approved by an administrator. Please monitor your status panel above.
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-zinc-500">
                          Quick Add Standard Service
                        </label>
                        <select
                          className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                          defaultValue=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            const srv = defaultServices.find(s => s.name === e.target.value);
                            if (srv) {
                              setCustomServiceName(srv.name);
                              setCustomServiceDesc(srv.description);
                              setCustomServiceImage(srv.image);
                              const matchedCat = categories.find(c => c.name.toLowerCase() === srv.category.toLowerCase());
                              if (matchedCat) setCustomServiceCategory(matchedCat._id);
                              
                              // Reset select to default after selection so they can select again if needed
                              e.target.value = "";
                            }
                          }}
                        >
                          <option value="" disabled>Select a standard service to auto-fill...</option>
                          {defaultServices.map((srv, idx) => (
                            <option key={idx} value={srv.name}>
                              {srv.name} ({srv.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Or define it manually</h4>
                      </div>

                      <form onSubmit={handleAddServiceSubmit} className="flex flex-col gap-6">
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Service Title *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Premium Deep Sofa Cleaning"
                            value={customServiceName}
                            onChange={(e) => setCustomServiceName(e.target.value)}
                            className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                            required
                          />
                          {suggestedServiceNames.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className={`text-[10px] font-semibold ${textMuted} uppercase self-center`}>Suggestions:</span>
                              {suggestedServiceNames.map(word => (
                                <button
                                  key={word}
                                  type="button"
                                  onClick={() => setCustomServiceName(customServiceName ? `${customServiceName} ${capitalizeWords(word)}` : capitalizeWords(word))}
                                  className={`rounded-full border px-2 py-0.5 text-xs font-medium transition duration-200 ${
                                    theme === 'light'
                                      ? 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-500 hover:text-amber-500'
                                      : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-amber-500 hover:text-amber-500'
                                  }`}
                                >
                                  {capitalizeWords(word)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Service Category *
                          </label>
                          <select
                            value={customServiceCategory}
                            onChange={(e) => setCustomServiceCategory(e.target.value)}
                            className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                            required
                          >
                            <option value="">Choose category...</option>
                            {categories
                              .filter(c => provider?.categories?.some(cat => (cat.category?._id || cat.category) === c._id && cat.status === 'approved'))
                              .map((c) => (
                                <option key={c._id} value={c._id}>
                                  {capitalizeWords(c.name)}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Short Description *
                          </label>
                          <input
                            type="text"
                            placeholder="Briefly explain what is included..."
                            value={customServiceDesc}
                            onChange={(e) => setCustomServiceDesc(e.target.value)}
                            className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 border-t pt-5 border-zinc-200/60 dark:border-zinc-800/80">
                        <div className="w-full sm:w-48">
                          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
                            Your Pricing (₹) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 500"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className={`w-full rounded-2xl border p-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${inputBg}`}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="gradient"
                          disabled={actionLoading}
                          className="h-14 px-8 justify-center shrink-0 w-full sm:w-auto font-semibold flex items-center gap-2"
                          title={actionLoading ? 'Adding...' : 'Add Service to Offerings'}
                        >
                          <AddCircleOutlineOutlinedIcon fontSize="small" />
                          {actionLoading ? 'Adding...' : 'Add Service'}
                        </Button>
                      </div>
                    </form>
                    </>
                  )}
                </div>

                {/* Current Services List */}
                <div className={`dashboard-card border rounded-[28px] p-6 md:p-8 ${cardTheme} shadow-xl`}>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">Your Offered Services</h3>

                  {/* Search and Sort controls */}
                  {myServices.length > 0 && (
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        type="text"
                        placeholder="Search offered services..."
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                      />
                      <div className="flex items-center gap-3">
                        <select
                          value={serviceSort}
                          onChange={(e) => setServiceSort(e.target.value)}
                          className={`flex-1 sm:flex-initial rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                        >
                          <option value="nameAsc">Name: A to Z</option>
                          <option value="nameDesc">Name: Z to A</option>
                          <option value="priceLow">Price: Low to High</option>
                          <option value="priceHigh">Price: High to Low</option>
                        </select>

                        {/* Layout Switcher */}
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                          <button
                            onClick={() => servicesView.toggleView()}
                            className={`p-2 rounded-lg transition-colors ${
                              servicesView.view === 'table'
                                ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                            title="Table View"
                          >
                            <TableRowsOutlinedIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => servicesView.toggleView()}
                            className={`p-2 rounded-lg transition-colors ${
                              servicesView.view === 'card'
                                ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                            title="Card View"
                          >
                            <GridViewOutlinedIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {loadingServices ? (
                    <div className="flex items-center gap-3 py-6 justify-center text-sm">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span className={textMuted}>Loading offered services...</span>
                    </div>
                  ) : myServices.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className={`m-0 text-base font-semibold ${textMuted}`}>No services in your collection yet.</p>
                      <p className="text-xs text-zinc-400 mt-1">Design services using the form above to add them here.</p>
                    </div>
                  ) : filteredAndSortedServices.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className={`m-0 text-base font-semibold ${textMuted}`}>No services match your search filters.</p>
                    </div>
                  ) : servicesView.view === 'table' ? (
                    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <table className="w-full border-collapse text-left text-sm min-w-[700px]">
                        <thead>
                          <tr className={`border-b ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                            <th className="p-4 font-semibold">Service Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold">Base Price</th>
                            <th className="p-4 font-semibold">Your Price</th>
                            <th className="p-4 font-semibold text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedServices.map((ps) => (
                            <tr key={ps._id} className={`border-b ${theme === 'light' ? 'border-zinc-100 hover:bg-zinc-50' : 'border-zinc-800/50 hover:bg-zinc-800/20'}`}>
                              <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                                {capitalizeWords(ps.service?.serviceName)}
                              </td>
                              <td className="p-4">
                                {ps.service?.category && (
                                  <span className="inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    {ps.service.category.name ? capitalizeWords(ps.service.category.name) : 'General'}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 max-w-[250px] truncate" title={ps.service?.description}>
                                {capitalize(ps.service?.description)}
                              </td>
                              <td className="p-4 text-zinc-400 font-medium">₹{ps.service?.basePrice}</td>
                              <td className="p-4 font-bold text-amber-500">₹{ps.price}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleRemoveService(ps._id)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-full border border-red-200 dark:border-red-900/50 transition-colors shrink-0"
                                  title="Remove Service"
                                >
                                  <DeleteOutlineOutlinedIcon fontSize="small" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                      {filteredAndSortedServices.map((ps) => (
                        <div
                          key={ps._id}
                          className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                            theme === 'light'
                              ? 'border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300'
                              : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h4 className="font-bold text-lg m-0 text-zinc-900 dark:text-zinc-50 leading-snug">
                                  {capitalizeWords(ps.service?.serviceName)}
                                </h4>
                                {ps.service?.category && (
                                  <span className="inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-2">
                                    {ps.service.category.name ? capitalizeWords(ps.service.category.name) : 'General'}
                                  </span>
                                )}
                              </div>
                              <span className="text-xl font-bold text-amber-500 shrink-0">
                                ₹{ps.price}
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed m-0 mt-2 ${textMuted} line-clamp-3 mb-4`}>
                              {capitalize(ps.service?.description)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center border-t pt-4 border-zinc-200/60 dark:border-zinc-800/80">
                            <span className="text-xs text-zinc-400 font-medium">
                              Base Price: ₹{ps.service?.basePrice}
                            </span>
                            <button
                              onClick={() => handleRemoveService(ps._id)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded-full border border-red-200 transition-colors shrink-0"
                              title="Remove Service"
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB: REVIEWS ─── */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-6">
                <div className={`dashboard-card border ${cardTheme}`}>
                  <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

                  {/* Search and Sort controls */}
                  {reviews.length > 0 && (
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        type="text"
                        placeholder="Search reviews by customer name, rating or comment..."
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        className={`flex-1 rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                      />
                      <div className="flex items-center gap-3">
                        <select
                          value={reviewSort}
                          onChange={(e) => setReviewSort(e.target.value)}
                          className={`flex-1 sm:flex-initial rounded-2xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                        >
                          <option value="dateNewest">Date: Newest First</option>
                          <option value="dateOldest">Date: Oldest First</option>
                          <option value="ratingHigh">Rating: Highest First</option>
                          <option value="ratingLow">Rating: Lowest First</option>
                        </select>

                        {/* Layout Switcher */}
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                          <button
                            onClick={() => reviewsView.toggleView()}
                            className={`p-2 rounded-lg transition-colors ${
                              reviewsView.view === 'table'
                                ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                            title="Table View"
                          >
                            <TableRowsOutlinedIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => reviewsView.toggleView()}
                            className={`p-2 rounded-lg transition-colors ${
                              reviewsView.view === 'card'
                                ? 'bg-white text-amber-500 shadow-sm dark:bg-zinc-700'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                            }`}
                            title="Card View"
                          >
                            <GridViewOutlinedIcon fontSize="small" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <p className={`py-6 text-center ${textMuted}`}>No reviews received yet.</p>
                  ) : filteredAndSortedReviews.length === 0 ? (
                    <p className={`py-6 text-center ${textMuted}`}>No reviews match your filters.</p>
                  ) : reviewsView.view === 'table' ? (
                    <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                      <table className="w-full border-collapse text-left text-sm min-w-[700px]">
                        <thead>
                          <tr className={`border-b ${theme === 'light' ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'}`}>
                            <th className="p-4 font-semibold">Customer</th>
                            <th className="p-4 font-semibold">Rating</th>
                            <th className="p-4 font-semibold">Review</th>
                            <th className="p-4 font-semibold">Booking ID</th>
                            <th className="p-4 font-semibold">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedReviews.map((r) => (
                            <tr key={r._id} className={`border-b ${theme === 'light' ? 'border-zinc-100 hover:bg-zinc-50' : 'border-zinc-800/50 hover:bg-zinc-800/20'}`}>
                              <td className="p-4 font-semibold">
                                {r.customer ? capitalizeWords(`${r.customer.firstName} ${r.customer.lastName}`) : 'Anonymous'}
                              </td>
                              <td className="p-4">
                                <div className="flex gap-0.5 text-amber-500">
                                  {Array.from({ length: r.rating }).map((_, idx) => (
                                    <StarRateOutlinedIcon key={idx} style={{ fontSize: 16 }} />
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 italic text-zinc-600 dark:text-zinc-300">
                                "{capitalize(r.review) || 'No comment text provided'}"
                              </td>
                              <td className="p-4 font-mono text-xs">{r.booking?.bookingNumber || 'N/A'}</td>
                              <td className="p-4 text-xs text-zinc-400">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {filteredAndSortedReviews.map((r) => (
                        <div key={r._id} className={`p-5 rounded-2xl border ${theme === 'light' ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-800/40'} flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-sm">
                                {r.customer ? capitalizeWords(`${r.customer.firstName} ${r.customer.lastName}`) : 'Anonymous'}
                              </span>
                              <div className="flex gap-0.5 text-amber-500">
                                {Array.from({ length: r.rating }).map((_, idx) => (
                                  <StarRateOutlinedIcon key={idx} style={{ fontSize: 16 }} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm italic text-zinc-600 dark:text-zinc-300">
                              "{capitalize(r.review) || 'No comment text provided'}"
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between text-xs text-zinc-400">
                            <span>Booking: {r.booking?.bookingNumber || 'N/A'}</span>
                            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ─── TAB: BUSINESS PROFILE ─── */}
            {activeTab === 'profile' && (
              <div className={`dashboard-card border ${cardTheme} max-w-4xl mx-auto`}>
                <h3 className="text-2xl font-bold mb-6">Business settings</h3>
                
                <form onSubmit={handleProfileSubmit}>
                  {/* Photo Edit */}
                  <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-amber-500/20 bg-zinc-100">
                        {profileForm.profileImage ? (
                          <img
                            className="h-full w-full object-cover"
                            src={profileForm.profileImage}
                            alt="profile"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-white">
                            <PersonOutlineOutlinedIcon fontSize="large" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition"
                        onClick={() => fileInputRef.current.click()}
                        title="Upload logo"
                      >
                        <CameraAltOutlinedIcon style={{ fontSize: 16 }} />
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />

                    {uploadingImage && (
                      <p className="text-xs font-semibold text-amber-500">Uploading photo...</p>
                    )}
                    {!uploadingImage && (
                      <p className={`text-xs ${textMuted}`}>Click camera icon to change profile picture</p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* User profile details */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">First Name</label>
                      <Input
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Last Name</label>
                      <Input
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Phone</label>
                      <Input
                        name="phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className={inputBg}
                      />
                    </div>

                    {/* Business Info */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Business Name</label>
                      <Input
                        name="businessName"
                        value={profileForm.businessName}
                        onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Service Category</label>
                      <select
                        name="category"
                        value={profileForm.category}
                        onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                        className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {capitalizeWords(cat.name)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Years of Experience</label>
                      <Input
                        type="number"
                        name="experience"
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    
                    {/* Address details */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Country</label>
                      <Input
                        name="country"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">State</label>
                      <Input
                        name="state"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">City</label>
                      <Input
                        name="city"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Pincode</label>
                      <Input
                        name="pincode"
                        value={profileForm.pincode}
                        onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Full Address</label>
                      <Input
                        name="fullAddress"
                        value={profileForm.fullAddress}
                        onChange={(e) => setProfileForm({ ...profileForm, fullAddress: e.target.value })}
                        className={inputBg}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Skills (Comma separated list)</label>
                      <Input
                        name="skills"
                        placeholder="Plumbing, Leak Repair, Pipe Fitting"
                        value={profileForm.skills}
                        onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Service Areas (Comma separated list)</label>
                      <Input
                        name="serviceAreas"
                        placeholder="Downtown, North side, Green Hills"
                        value={profileForm.serviceAreas}
                        onChange={(e) => setProfileForm({ ...profileForm, serviceAreas: e.target.value })}
                        className={inputBg}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Business Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={profileForm.description}
                        onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                        className={`w-full rounded-2xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button
                      type="submit"
                      variant="gradient"
                      className="px-8 flex items-center gap-2"
                      disabled={actionLoading}
                      title={actionLoading ? 'Saving...' : 'Save Settings'}
                    >
                      <SaveOutlinedIcon fontSize="small" />
                      {actionLoading ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

      </main>

      {/* OTP Verification Modal */}
      {otpModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-zinc-900 border border-zinc-800'}`}>
            <h3 className="text-xl font-bold mb-2">OTP Verification Required</h3>
            <p className={`text-sm mb-6 ${theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Please enter the OTP provided by the user to {otpModal.targetStatus === 'started' ? 'start' : 'complete'} this job.
            </p>
            
            <input
              type="text"
              autoFocus
              placeholder="Enter 4-digit OTP"
              value={otpModal.otp}
              onChange={(e) => setOtpModal(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              className={`w-full mb-6 text-center text-2xl tracking-[0.5em] font-mono rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-800 text-zinc-100 border-zinc-700'}`}
            />
            
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOtpModal({ show: false, bookingId: null, targetStatus: '', otp: '' })}
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                disabled={actionLoading || otpModal.otp.length !== 4}
                onClick={() => handleUpdateStatus(otpModal.bookingId, otpModal.targetStatus, otpModal.otp)}
              >
                Verify & {otpModal.targetStatus === 'started' ? 'Start' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProviderDashborad
