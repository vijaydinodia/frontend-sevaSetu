import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
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
  { name: "Hourly bookings", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80", description: "Flexible hourly cleaning and housekeeping bookings.", category: "Cleaning & Housekeeping" },
  { name: "Bathroom Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80", description: "Deep cleaning of bathroom floors, walls, and fixtures.", category: "Cleaning & Housekeeping" },
  { name: "Fridge Cleaning", image: "https://images.unsplash.com/photo-1571175432290-ef026cbe6822?auto=format&fit=crop&w=400&q=80", description: "Thorough cleaning of refrigerator interior and exterior.", category: "Cleaning & Housekeeping" },
  { name: "Packing or Unpacking", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80", description: "Assistance with packing or unpacking boxes and luggage.", category: "Cleaning & Housekeeping" },
  { name: "Utensils", image: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=400&q=80", description: "Cleaning and organizing daily utensils and dishware.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Prep", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80", description: "Chopping vegetables and preparing ingredients for cooking.", category: "Cleaning & Housekeeping" },
  { name: "Dusting & Wiping", image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=400&q=80", description: "Detailed dusting and wiping of all surfaces and furniture.", category: "Cleaning & Housekeeping" },
  { name: "Sweeping & Mopping", image: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=400&q=80", description: "Thorough sweeping and mopping of all floor areas.", category: "Cleaning & Housekeeping" },
  { name: "Pre-Party Express Clean", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=400&q=80", description: "Quick and efficient cleaning before guests arrive.", category: "Cleaning & Housekeeping" },
  { name: "Complete Wardrobe Cleaning", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80", description: "Organizing and cleaning the inside of wardrobes.", category: "Cleaning & Housekeeping" },
  { name: "After-Party Express Clean", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80", description: "Post-party cleanup of living areas and kitchen.", category: "Cleaning & Housekeeping" },
  { name: "Ironing & Folding", image: "https://images.unsplash.com/photo-1489008777659-ad1fc8e07097?auto=format&fit=crop&w=400&q=80", description: "Ironing and neatly folding clothes.", category: "Cleaning & Housekeeping" },
  { name: "Window Cleaning", image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=400&q=80", description: "Wiping and washing interior and exterior windows.", category: "Cleaning & Housekeeping" },
  { name: "Laundry", image: "https://images.unsplash.com/photo-1545173168-9f19472ef7f4?auto=format&fit=crop&w=400&q=80", description: "Washing, drying, and basic folding of daily clothes.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Cleaning", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80", description: "Deep cleaning of kitchen countertops, sinks, and floors.", category: "Cleaning & Housekeeping" },
  { name: "Balcony Cleaning", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80", description: "Cleaning of balcony floors and railings.", category: "Cleaning & Housekeeping" },
  { name: "Fan Cleaning", image: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=400&q=80", description: "Dusting and wiping down ceiling fans.", category: "Cleaning & Housekeeping" },
  { name: "Kitchen Cabinet Cleaning", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80", description: "Cleaning the interior and exterior of kitchen cabinets.", category: "Cleaning & Housekeeping" }
]

const ProviderDashborad = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  // States
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)
  
  // Online / Availability State (Synced with sidebar)
  const [isOnline, setIsOnline] = useState(() => {
    return localStorage.getItem('provider_online') !== 'false'
  })

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(localStorage.getItem('provider_online') !== 'false')
    }
    window.addEventListener('provider_online_change', handleStatusChange)
    return () => window.removeEventListener('provider_online_change', handleStatusChange)
  }, [])

  const toggleOnlineStatus = () => {
    const nextState = !isOnline
    setIsOnline(nextState)
    localStorage.setItem('provider_online', String(nextState))
    window.dispatchEvent(new Event('provider_online_change'))
  }

  // OTP Modal state
  const [otpModal, setOtpModal] = useState({ show: false, bookingId: null, targetStatus: '', otp: '' })

  // Drawer details panel state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Invoice Simulator state
  const [invoiceModal, setInvoiceModal] = useState({ show: false, bookingNumber: '', customerName: '', serviceName: '', amount: 0, tax: 0, total: 0 })

  // Calendar tab states
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Chats Tab Simulator states
  const [messagesList, setMessagesList] = useState([
    { id: 1, sender: "Aarav Sharma", text: "Hello, are you on the way for the kitchen cleaning?", time: "09:15 AM", unread: true },
    { id: 2, sender: "Sneha Patel", text: "Thank you for the laundry service! It was perfect.", time: "Yesterday", unread: false },
    { id: 3, sender: "Rohan Verma", text: "Can we reschedule the bathroom cleaning to 3 PM?", time: "2 days ago", unread: false }
  ])
  const [selectedChat, setSelectedChat] = useState(1)
  const [replyText, setReplyText] = useState('')
  const [chatHistories, setChatHistories] = useState({
    1: [
      { sender: "customer", text: "Hello, are you on the way for the kitchen cleaning?", time: "09:15 AM" }
    ],
    2: [
      { sender: "customer", text: "Hi, just wanted to check if you do delicate fabrics too?", time: "Yesterday" },
      { sender: "provider", text: "Yes, we handle delicate garments with special care.", time: "Yesterday" },
      { sender: "customer", text: "Thank you for the laundry service! It was perfect.", time: "Yesterday" }
    ],
    3: [
      { sender: "customer", text: "Can we reschedule the bathroom cleaning to 3 PM?", time: "2 days ago" }
    ]
  })

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
    firstName: '', lastName: '', phone: '', profileImage: '',
    fullAddress: '', city: '', state: '', country: '', pincode: '',
    businessName: '', experience: '', skills: '', serviceAreas: '', description: '', category: '',
  })

  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // Datamuse API suggestions logic
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

  // Bookings Tab Filters & Search States
  const [bookingFilter, setBookingFilter] = useState('all') // 'all', 'Today', 'This Week', 'This Month'
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all') // 'all', 'pending', 'active', 'completed'

  // Services Tab Search & Sort States
  const [serviceSearch, setServiceSearch] = useState('')
  const [serviceSort, setServiceSort] = useState('nameAsc')

  // Reviews Tab Search & Sort States
  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewSort, setReviewSort] = useState('dateNewest')

  // Fetch Hooks
  const { data: profileData, loading: profileLoading, refetch: refetchProfile } = UseFetch(`${API_URL}/provider/profile`, { autoFetch: !!token })
  const { data: bookingsData, loading: bookingsLoading, refetch: refetchBookings } = UseFetch(`${API_URL}/provider/bookings`, { autoFetch: !!token })
  const { data: reviewsData, loading: reviewsLoading, refetch: refetchReviews } = UseFetch(`${API_URL}/provider/reviews`, { autoFetch: !!token })
  const { data: categoriesData, loading: categoriesLoading } = UseFetch(`${API_URL}/provider/categories`, { autoFetch: !!token })

  const provider = profileData?.data
  const userDetails = provider?.user
  const bookings = bookingsData?.data || []
  const reviews = reviewsData?.data || []
  const categories = categoriesData?.data || []

  // Sync profile details form
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
    if (activeTab === 'services' || activeTab === 'dashboard') {
      fetchProviderServices()
    }
  }, [activeTab])

  // Handlers
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
      }
      const res = await axios.post(`${API_URL}/provider/services/add`, payload, getHeaders())
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
    if (!window.confirm("Are you sure you want to remove this service?")) return
    setActionLoading(true)
    try {
      const res = await axios.delete(`${API_URL}/provider/services/remove/${providerServiceId}`, getHeaders())
      showNotification(res.data.message || 'Service removed successfully')
      fetchProviderServices()
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateStatus = async (bookingId, newStatus, providedOtp = '') => {
    if ((newStatus === 'started' || newStatus === 'completed') && !providedOtp) {
      setOtpModal({ show: true, bookingId, targetStatus: newStatus, otp: '' })
      return
    }
    setActionLoading(true)
    try {
      const payload = { status: newStatus }
      if (providedOtp) payload.otp = providedOtp
      const res = await axios.put(`${API_URL}/provider/bookings/${bookingId}/status`, payload, getHeaders())
      showNotification(res.data.message || `Booking status updated to ${newStatus}`)
      
      // Update drawer state if open
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }))
      }

      setOtpModal({ show: false, bookingId: null, targetStatus: '', otp: '' })
      refetchBookings()
      refetchProfile()
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const imageData = new FormData()
      imageData.append('image', file)
      const res = await axios.post(`${API_URL}/user/upload/image`, imageData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      })
      setProfileForm(prev => ({ ...prev, profileImage: res.data.data.url }))
      showNotification('Photo uploaded successfully! Save settings to persist.')
    } catch (err) {
      showNotification(err.response?.data?.message || err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    try {
      const res = await axios.put(`${API_URL}/provider/profile/edit`, {
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
      }, getHeaders())
      showNotification(res.data.message || 'Settings saved successfully')
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

  // Filter Bookings by Search query and Date range filter
  const getFilteredBookings = (list) => {
    return list.filter(b => {
      // 1. Search Query
      const q = bookingSearch.toLowerCase().trim()
      if (q) {
        const bNum = b.bookingNumber?.toString() || ''
        const custName = `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.toLowerCase()
        const sName = (b.service?.serviceName || b.service?.title || '').toLowerCase()
        if (!bNum.includes(q) && !custName.includes(q) && !sName.includes(q)) return false
      }

      // 2. Date Filter
      const bDate = new Date(b.bookingDate)
      const today = new Date()
      if (bookingFilter === 'Today') {
        if (bDate.toDateString() !== today.toDateString()) return false
      } else if (bookingFilter === 'This Week') {
        const diff = today.getTime() - bDate.getTime()
        const days = diff / (1000 * 3600 * 24)
        if (days > 7 || days < -7) return false
      } else if (bookingFilter === 'This Month') {
        if (bDate.getMonth() !== today.getMonth() || bDate.getFullYear() !== today.getFullYear()) return false
      }

      // 3. Status tab filter
      if (bookingStatusFilter !== 'all') {
        if (bookingStatusFilter === 'pending' && b.status !== 'pending') return false
        if (bookingStatusFilter === 'active' && !['accepted', 'on_the_way', 'started'].includes(b.status)) return false
        if (bookingStatusFilter === 'completed' && b.status !== 'completed') return false
      }

      return true
    })
  }

  // Statistics computed directly from database data
  const totalBookingsCount = bookings.length
  const todayBookingsCount = bookings.filter(b => new Date(b.bookingDate).toDateString() === new Date().toDateString()).length
  const customersCount = new Set(bookings.map(b => b.customer?._id).filter(Boolean)).size
  const earningsSum = bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + (b.amount || 0), 0)
  const ratingScore = provider?.averageRating || '0.0'

  // Helper to generate dynamic 6-month chart data
  const getChartData = () => {
    const months = []
    const now = new Date()
    // Generate last 6 months list
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        revenue: 0,
        bookingsCount: 0
      })
    }

    // Accumulate actual booking data
    bookings.forEach(b => {
      const bDate = new Date(b.bookingDate)
      months.forEach(m => {
        if (bDate.getFullYear() === m.year && bDate.getMonth() === m.monthIndex) {
          m.bookingsCount++
          if (b.status === 'completed') {
            m.revenue += (b.amount || 0)
          }
        }
      })
    })

    // Find maximums for scaling (avoid division by 0)
    const maxRev = Math.max(...months.map(m => m.revenue), 1000)
    const maxBook = Math.max(...months.map(m => m.bookingsCount), 5)

    // Compute coordinates
    const points = months.map((m, idx) => {
      const x = 45 + idx * 80
      const yRev = 170 - (m.revenue / maxRev) * 140 // scale to height 140 (leaves 30px padding at top)
      const yBook = 170 - (m.bookingsCount / maxBook) * 140
      return { x, yRev, yBook, monthName: m.name }
    })

    // Generate SVG path string for Revenue Line
    const revPath = points.length > 0 
      ? `M ${points[0].x} ${points[0].yRev} ` + points.slice(1).map(p => `L ${p.x} ${p.yRev}`).join(' ') 
      : ''
    
    // Generate SVG path string for Revenue Fill Area
    const revFillPath = points.length > 0 
      ? `M ${points[0].x} 170 L ` + points.map(p => `${p.x} ${p.yRev}`).join(' L ') + ` L ${points[points.length-1].x} 170 Z`
      : ''

    // Generate SVG path string for Bookings Line
    const bookPath = points.length > 0 
      ? `M ${points[0].x} ${points[0].yBook} ` + points.slice(1).map(p => `L ${p.x} ${p.yBook}`).join(' ') 
      : ''

    return { points, revPath, revFillPath, bookPath, months }
  }

  const chartData = getChartData()

  // Helper to generate dynamic notifications from database bookings
  const getDynamicNotifications = () => {
    const alerts = []
    
    // Sort bookings by creation date or just date to get recent updates
    const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
    
    sortedBookings.slice(0, 5).forEach(b => {
      const custName = b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest User'
      const servName = capitalizeWords(b.service?.serviceName || b.service?.title || 'service')
      const timeStr = new Date(b.createdAt || b.bookingDate).toLocaleDateString()
      
      if (b.status === 'pending') {
        alerts.push({
          text: `New service booking request received from ${custName} for ${servName}.`,
          time: `Slot: ${b.bookingTime}`,
          type: 'new'
        })
      } else if (b.status === 'completed') {
        alerts.push({
          text: `Service request for ${servName} completed successfully for ${custName}.`,
          time: `Date: ${timeStr}, Amount: ₹${b.amount}`,
          type: 'payment'
        })
      } else if (b.status === 'cancelled') {
        alerts.push({
          text: `Service request for ${servName} was cancelled.`,
          time: `Slot: ${b.bookingTime}`,
          type: 'reschedule'
        })
      } else {
        alerts.push({
          text: `Booking request for ${servName} is in progress (${b.status?.replace(/_/g, ' ')}).`,
          time: `Slot: ${b.bookingTime}`,
          type: 'reschedule'
        })
      }
    })
    
    // Fallback notice
    alerts.push({
      text: "Congratulations! Your partner account is active and verified on SevaSetu.",
      time: "Welcome Alert",
      type: "kyc"
    })
    
    return alerts
  }

  const dynamicAlerts = getDynamicNotifications()

  // Styles based on theme
  const bgMain = theme === 'light' ? 'bg-[#FFFFFF] text-[#111827]' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-[#E5E7EB]' : 'bg-zinc-900 border-zinc-800'
  const borderCol = theme === 'light' ? 'border-[#E5E7EB]' : 'border-zinc-850'
  const inputBg = theme === 'light' ? 'bg-white text-zinc-900 border-zinc-200' : 'bg-zinc-900 text-zinc-100 border-zinc-850'

  // Trigger Booking Detail Drawer
  const openBookingDetails = (b) => {
    setSelectedBooking(b)
    setDrawerOpen(true)
  }

  // Message chat sender handler
  const sendChatMessage = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    const newMsg = { sender: "provider", text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setChatHistories(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }))
    // update messagesList preview
    setMessagesList(prev => prev.map(m => m.id === selectedChat ? { ...m, text: replyText, time: "Just now", unread: false } : m))
    setReplyText('')
  }

  // Invoice creator generator
  const triggerInvoiceModal = (b) => {
    const custName = b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest Customer'
    const sName = b.service?.serviceName || b.service?.title || 'Home Service'
    const baseAmt = b.amount || 1500
    const calculatedTax = Math.round(baseAmt * 0.18)
    const finalTotal = baseAmt + calculatedTax
    setInvoiceModal({
      show: true,
      bookingNumber: b.bookingNumber || 'B-MOCK',
      customerName: custName,
      serviceName: sName,
      amount: baseAmt,
      tax: calculatedTax,
      total: finalTotal
    })
  }

  // Calendar logic helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))
  }

  // RENDER SECTIONS
  const renderDashboardTab = () => {
    const filteredDashBookings = getFilteredBookings(bookings).slice(0, 10)
    
    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Today's Bookings", val: todayBookingsCount, change: "+2 from yesterday", icon: <CalendarMonthOutlinedIcon className="text-[#16A34A]" /> },
            { label: "Total Customers", val: customersCount, change: "Active this month", icon: <PersonOutlineOutlinedIcon className="text-[#16A34A]" /> },
            { label: "Monthly Earnings", val: `₹${earningsSum.toLocaleString()}`, change: "Updated live", icon: <CurrencyRupeeOutlinedIcon className="text-[#16A34A]" /> },
            { label: "Average Rating", val: `${ratingScore}★`, change: `${reviews.length} total reviews`, icon: <StarRateOutlinedIcon className="text-amber-500" /> }
          ].map((stat, idx) => (
            <Card key={idx} className={`p-4 border ${cardTheme} rounded-[16px] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between`}>
              <div>
                <p className={`text-xs font-semibold ${textMuted}`}>{stat.label}</p>
                <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{stat.val}</h3>
                <span className="text-[10px] text-zinc-400 font-medium">{stat.change}</span>
              </div>
              <div className="h-10 w-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
            </Card>
          ))}
        </div>

        {/* Dynamic Inner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main left content pane */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Recent Bookings Table */}
            <Card className={`p-5 border ${cardTheme} rounded-[16px] shadow-sm`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Recent Bookings</h3>
                  <p className="text-xs text-zinc-400">Review status and confirm client booking slots</p>
                </div>
                
                {/* Search & date filter inside dashboard card */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-[#16A34A] w-[160px] sm:w-[200px] ${inputBg}`}
                    />
                    <SearchOutlinedIcon className="absolute left-2.5 top-2 text-zinc-400" style={{ fontSize: 14 }} />
                  </div>
                  
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className={`rounded-lg border px-2 py-1.5 text-xs focus:outline-none ${inputBg}`}
                  >
                    <option value="all">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className={`text-center py-12 ${textMuted} text-sm`}>No bookings assigned.</div>
              ) : filteredDashBookings.length === 0 ? (
                <div className={`text-center py-12 ${textMuted} text-sm`}>No matching results found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className={`border-b ${borderCol} ${theme === 'light' ? 'bg-zinc-50/50' : 'bg-zinc-900/30'} text-zinc-500 font-semibold`}>
                        <th className="py-2.5 px-3">Booking ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Service</th>
                        <th className="py-2.5 px-3">Schedule</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDashBookings.map((b) => (
                        <tr key={b._id} className={`border-b ${borderCol} hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors`}>
                          <td className="py-3 px-3 font-mono font-bold text-zinc-500">{b.bookingNumber}</td>
                          <td className="py-3 px-3">
                            <span className="font-semibold block">{b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest'}</span>
                            <span className="text-[10px] text-zinc-400">{b.customer?.phone || 'No phone'}</span>
                          </td>
                          <td className="py-3 px-3 font-medium">
                            {capitalizeWords(b.service?.serviceName || b.service?.title)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="block font-medium">{new Date(b.bookingDate).toLocaleDateString()}</span>
                            <span className="text-[10px] text-zinc-400">{b.bookingTime}</span>
                          </td>
                          <td className="py-3 px-3 font-bold text-[#16A34A]">₹{b.amount}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              b.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                                : b.status === 'pending'
                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                                : b.status === 'rejected' || b.status === 'cancelled'
                                ? 'bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                            }`}>
                              {capitalize(b.status.replace(/_/g, ' '))}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => openBookingDetails(b)}
                              className="text-xs font-bold text-[#16A34A] hover:text-[#15803D] hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Upcoming Bookings cards */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-zinc-400">Upcoming Requests</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {bookings.filter(b => b.status === 'pending').slice(0, 2).map((b) => (
                  <Card key={b._id} className={`p-4 border ${cardTheme} rounded-[16px] flex flex-col justify-between hover:shadow-md transition-shadow`}>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold rounded-xl text-sm shrink-0">
                        {b.customer?.firstName?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                          {b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Customer'}
                        </h5>
                        <p className="text-[10px] text-[#16A34A] font-bold truncate mt-0.5">
                          {capitalizeWords(b.service?.serviceName || b.service?.title)}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          {new Date(b.bookingDate).toLocaleDateString()} at {b.bookingTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'accepted')}
                        className="flex-1 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-[10px] font-bold rounded-lg cursor-pointer text-center"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'rejected')}
                        className="flex-1 py-1.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[10px] font-bold rounded-lg cursor-pointer text-center"
                      >
                        Decline
                      </button>
                    </div>
                  </Card>
                ))}
                {bookings.filter(b => b.status === 'pending').length === 0 && (
                  <div className={`col-span-2 text-center p-4 border border-dashed ${borderCol} rounded-[16px] text-xs ${textMuted}`}>
                    No new pending booking requests.
                  </div>
                )}
              </div>
            </div>

            {/* Earnings Line Chart SVG widget */}
            <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Earnings Overview</h3>
                  <p className="text-xs text-zinc-400">6-Month revenue & booking chart</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-[#16A34A] rounded-full" /> Revenue (₹)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 bg-indigo-500 rounded-full" /> Bookings</span>
                </div>
              </div>
              
              <div className="relative pt-4 w-full">
                {/* SVG Graph */}
                <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16A34A" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="480" y2="20" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" className="dark:stroke-zinc-800" />
                  <line x1="30" y1="70" x2="480" y2="70" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" className="dark:stroke-zinc-800" />
                  <line x1="30" y1="120" x2="480" y2="120" stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="3" className="dark:stroke-zinc-800" />
                  <line x1="30" y1="170" x2="480" y2="170" stroke="#E5E7EB" strokeWidth="0.5" className="dark:stroke-zinc-800" />
                  
                  {/* Revenue Curve */}
                  {chartData.revFillPath && (
                    <path
                      d={chartData.revFillPath}
                      fill="url(#chartGrad)"
                    />
                  )}
                  {chartData.revPath && (
                    <path
                      d={chartData.revPath}
                      stroke="#16A34A"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}
                  
                  {/* Booking Curve */}
                  {chartData.bookPath && (
                    <path
                      d={chartData.bookPath}
                      stroke="#6366F1"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="1"
                    />
                  )}

                  {/* Dynamic Data Dots */}
                  {chartData.points.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.yRev} r="4" fill="#16A34A" />
                      <circle cx={p.x} cy={p.yBook} r="4" fill="#6366F1" />
                    </g>
                  ))}
                  
                  {/* X Labels */}
                  {chartData.points.map((p, idx) => (
                    <text key={idx} x={p.x} y="190" textAnchor="middle" fontSize="10" fill="#9CA3AF">{p.monthName}</text>
                  ))}
                </svg>
              </div>
            </Card>

            {/* Quick Actions Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-zinc-400">Quick Actions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Create Service", icon: <EngineeringOutlinedIcon className="text-[#16A34A] text-lg" />, act: () => setActiveTab('services') },
                  { label: "Update Availability", icon: <EventAvailableOutlinedIcon className="text-[#16A34A] text-lg" />, act: toggleOnlineStatus },
                  { label: "View Calendar", icon: <CalendarMonthOutlinedIcon className="text-[#16A34A] text-lg" />, act: () => setActiveTab('calendar') },
                  { label: "Manage Profile", icon: <PersonOutlineOutlinedIcon className="text-[#16A34A] text-lg" />, act: () => setActiveTab('profile') },
                  { label: "Create Invoice", icon: <DescriptionOutlinedIcon className="text-[#16A34A] text-lg" />, act: () => setInvoiceModal({ show: true, bookingNumber: 'B-QUICK', customerName: 'Client Partner', serviceName: 'General Maintenance', amount: 2500, tax: 450, total: 2950 }) }
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.act}
                    className={`p-3.5 border ${cardTheme} rounded-xl hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-center gap-2 cursor-pointer w-full`}
                  >
                    <div className="h-9 w-9 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center justify-center">
                      {action.icon}
                    </div>
                    <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar column inside Dashboard */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Today's Schedule Card */}
            <Card className={`p-4 border ${cardTheme} rounded-[16px]`}>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Today's Schedule</h4>
              {bookings.filter(b => new Date(b.bookingDate).toDateString() === new Date().toDateString()).length === 0 ? (
                <p className="text-xs text-zinc-400 italic py-2 pl-3">No bookings scheduled for today.</p>
              ) : (
                <div className="relative border-l-2 border-zinc-150 dark:border-zinc-800 ml-3 pl-5 space-y-6">
                  {bookings
                    .filter(b => new Date(b.bookingDate).toDateString() === new Date().toDateString())
                    .map((b, idx) => {
                      const isUpcoming = ['pending', 'accepted', 'on_the_way', 'started'].includes(b.status)
                      const dotColor = b.status === 'pending' ? 'bg-amber-400' : isUpcoming ? 'bg-[#16A34A] animate-pulse' : 'bg-zinc-350'
                      return (
                        <div key={b._id || idx} className="relative">
                          <span className={`absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950 ${dotColor}`} />
                          <span className="text-[10px] font-bold text-zinc-400 block">{b.bookingTime}</span>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">
                            {capitalizeWords(b.service?.serviceName || b.service?.title)}
                          </span>
                        </div>
                      )
                    })}
                </div>
              )}
            </Card>

            {/* Customer Reviews card */}
            <Card className={`p-4 border ${cardTheme} rounded-[16px]`}>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Customer Reviews</h4>
              {reviews.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-4">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r) => (
                    <div key={r._id} className="text-xs border-b border-zinc-100 dark:border-zinc-850 pb-3 last:border-none last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">
                          {r.customer ? `${r.customer.firstName} ${r.customer.lastName}` : 'Anonymous'}
                        </span>
                        <div className="flex text-amber-500 font-medium items-center gap-0.5">
                          <StarRateOutlinedIcon style={{ fontSize: 13 }} />
                          <span>{r.rating}</span>
                        </div>
                      </div>
                      <p className={`mt-1 italic ${textMuted} leading-relaxed`}>
                        "{capitalize(r.review || 'Excellent service support.')}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Notifications panel widget */}
            <Card className={`p-4 border ${cardTheme} rounded-[16px]`}>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Recent Alerts</h4>
              <div className="space-y-3">
                {dynamicAlerts.map((alert, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-650 dark:text-zinc-350">
                    <span className={`mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full ${alert.type === 'kyc' ? 'bg-blue-500' : alert.type === 'payment' ? 'bg-[#16A34A]' : 'bg-amber-400'}`} />
                    <div>
                      <p className="font-medium leading-tight">{alert.text}</p>
                      <span className="text-[10px] text-zinc-400 mt-1 block">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderBookingsTab = () => {
    const filteredList = getFilteredBookings(bookings)
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['all', 'pending', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setBookingStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize border cursor-pointer transition-colors ${
                  bookingStatusFilter === status
                    ? 'bg-[#16A34A] border-[#16A34A] text-white'
                    : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800'
                }`}
              >
                {status} Bookings
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search bookings..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#16A34A] w-[180px] ${inputBg}`}
            />
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              className={`rounded-lg border px-2 py-1.5 text-xs focus:outline-none ${inputBg}`}
            >
              <option value="all">All Dates</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
        </div>

        <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
          {filteredList.length === 0 ? (
            <p className={`text-center py-10 ${textMuted} text-sm`}>No bookings match the search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead>
                  <tr className={`border-b ${borderCol} text-zinc-500 font-semibold bg-zinc-50/50 dark:bg-zinc-900/30`}>
                    <th className="py-3 px-4">Booking ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Service Required</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((b) => (
                    <tr key={b._id} className={`border-b ${borderCol} hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors`}>
                      <td className="py-4 px-4 font-mono font-bold text-zinc-500">{b.bookingNumber}</td>
                      <td className="py-4 px-4">
                        <span className="font-semibold block">{b.customer ? `${b.customer.firstName} ${b.customer.lastName}` : 'Guest User'}</span>
                        <span className="text-[10px] text-zinc-400">{b.customer?.phone || 'No phone'}</span>
                      </td>
                      <td className="py-4 px-4 font-medium">{capitalizeWords(b.service?.serviceName || b.service?.title)}</td>
                      <td className="py-4 px-4">
                        <span className="block font-semibold">{new Date(b.bookingDate).toLocaleDateString()}</span>
                        <span className="text-[10px] text-zinc-400">{b.bookingTime}</span>
                      </td>
                      <td className="py-4 px-4 font-bold text-[#16A34A]">₹{b.amount}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20'
                            : b.status === 'pending'
                            ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/20'
                            : b.status === 'rejected' || b.status === 'cancelled'
                            ? 'bg-red-100 text-red-600 dark:bg-red-950/20'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-950/20'
                        }`}>
                          {capitalize(b.status.replace(/_/g, ' '))}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => openBookingDetails(b)}
                            className="px-2.5 py-1 text-[10px] font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md cursor-pointer border border-zinc-200"
                          >
                            Manage
                          </button>
                          {b.status === 'completed' && (
                            <button
                              onClick={() => triggerInvoiceModal(b)}
                              className="px-2.5 py-1 text-[10px] font-bold text-[#16A34A] bg-green-50 hover:bg-green-100 rounded-md cursor-pointer border border-green-200"
                            >
                              Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderCalendarTab = () => {
    const days = getDaysInMonth(calendarDate)
    const monthName = calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })

    return (
      <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">{monthName} Calendar</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
              className="p-1 border border-zinc-200 hover:bg-zinc-100 rounded-lg cursor-pointer text-xs"
            >
              Prev
            </button>
            <button
              onClick={() => setCalendarDate(new Date())}
              className="p-1 border border-zinc-200 hover:bg-zinc-100 rounded-lg cursor-pointer text-xs font-semibold"
            >
              Today
            </button>
            <button
              onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
              className="p-1 border border-zinc-200 hover:bg-zinc-100 rounded-lg cursor-pointer text-xs"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-400 mb-2">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {/* Pad offset days */}
          {Array.from({ length: new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay() }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-16 bg-zinc-50/30 rounded-xl" />
          ))}

          {days.map((day) => {
            const hasBooking = bookings.some(b => new Date(b.bookingDate).toDateString() === day.toDateString())
            const activeBookings = bookings.filter(b => new Date(b.bookingDate).toDateString() === day.toDateString())
            return (
              <div
                key={day.getDate()}
                className={`h-16 border ${borderCol} rounded-xl p-1.5 flex flex-col justify-between items-start transition-colors hover:border-[#16A34A] cursor-pointer bg-white dark:bg-zinc-900`}
              >
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{day.getDate()}</span>
                {hasBooking && (
                  <div className="w-full flex gap-1 mt-auto">
                    {activeBookings.slice(0, 2).map((ab, idx) => (
                      <span
                        key={idx}
                        onClick={() => openBookingDetails(ab)}
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          ab.status === 'completed' ? 'bg-emerald-500' : ab.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        title={ab.service?.title || 'Booking slot'}
                      />
                    ))}
                    {activeBookings.length > 2 && (
                      <span className="text-[8px] font-black text-[#16A34A]">+{activeBookings.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  const renderCustomersTab = () => {
    // Unique list of customers from actual bookings
    const customerMap = {}
    bookings.forEach(b => {
      if (b.customer && !customerMap[b.customer._id]) {
        customerMap[b.customer._id] = {
          info: b.customer,
          totalSpend: 0,
          totalBookingsCount: 0
        }
      }
      if (b.customer) {
        customerMap[b.customer._id].totalSpend += b.amount || 0
        customerMap[b.customer._id].totalBookingsCount += 1
      }
    })

    const list = Object.values(customerMap)

    return (
      <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">My Customers Directory</h3>
        {list.length === 0 ? (
          <p className="text-xs text-zinc-400 py-6 text-center">No customers directory available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className={`border-b ${borderCol} text-zinc-500 font-semibold bg-zinc-50/50`}>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Contact Phone</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4 text-center">Bookings Count</th>
                  <th className="py-2.5 px-4 text-right">Total Payments</th>
                </tr>
              </thead>
              <tbody>
                {list.map((cust) => (
                  <tr key={cust.info._id} className={`border-b ${borderCol} hover:bg-zinc-50/50 transition-colors`}>
                    <td className="py-3 px-4 font-bold text-zinc-850 dark:text-zinc-150">
                      {capitalizeWords(`${cust.info.firstName} ${cust.info.lastName}`)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-zinc-600 dark:text-zinc-350">{cust.info.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-zinc-500">{cust.info.email || 'N/A'}</td>
                    <td className="py-3 px-4 text-center font-bold text-zinc-700 dark:text-zinc-300">{cust.totalBookingsCount}</td>
                    <td className="py-3 px-4 text-right font-black text-[#16A34A]">₹{cust.totalSpend.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    )
  }

  const renderServicesTab = () => {
    return (
      <div className="space-y-6">
        {/* Your Category Status info */}
        <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">Professional Categories</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {provider?.categories?.map((catApp) => (
              <div key={catApp._id} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs block text-zinc-800 dark:text-zinc-200">
                    {catApp.category?.name ? capitalizeWords(catApp.category.name) : 'Category'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{catApp.category?.description || 'Active Domain'}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                  catApp.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {catApp.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Add and Manual Create Service card */}
        <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Add Service to Public Catalog</h3>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Select standard template</label>
              <select
                className={`w-full rounded-xl border p-3.5 text-xs focus:outline-none ${inputBg}`}
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return
                  const s = defaultServices.find(ds => ds.name === e.target.value)
                  if (s) {
                    setCustomServiceName(s.name)
                    setCustomServiceDesc(s.description)
                    setCustomServiceImage(s.image)
                    const catObj = categories.find(c => c.name.toLowerCase() === s.category.toLowerCase())
                    if (catObj) setCustomServiceCategory(catObj._id)
                  }
                  e.target.value = ""
                }}
              >
                <option value="" disabled>Choose a template to auto-fill...</option>
                {defaultServices.map((ds, i) => (
                  <option key={i} value={ds.name}>{ds.name} ({ds.category})</option>
                ))}
              </select>
            </div>
            
            <form onSubmit={handleAddServiceSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Category *</label>
                  <select
                    required
                    value={customServiceCategory}
                    onChange={(e) => setCustomServiceCategory(e.target.value)}
                    className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{capitalizeWords(c.name)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Short Description *</label>
                <input
                  type="text"
                  required
                  value={customServiceDesc}
                  onChange={(e) => setCustomServiceDesc(e.target.value)}
                  className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
                />
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="w-28">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
                  />
                </div>
                <Button type="submit" variant="gradient" className="bg-[#16A34A] text-white px-5 py-2.5 text-xs font-bold rounded-lg cursor-pointer h-10 w-full justify-center">
                  Add Service
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* List of offered services */}
        <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">My Service Offerings</h3>
          {myServices.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">No service offerings listed yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {myServices.map((ps) => (
                <div key={ps._id} className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white truncate">{capitalizeWords(ps.service?.serviceName)}</h5>
                    <span className="inline-block text-[8px] bg-green-50 text-[#16A34A] font-bold px-2 py-0.5 rounded-full mt-1.5">
                      {ps.service?.category?.name ? capitalizeWords(ps.service.category.name) : 'General'}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2">{ps.service?.description}</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-4">
                    <span className="font-black text-[#16A34A] text-sm">₹{ps.price}</span>
                    <button
                      onClick={() => handleRemoveService(ps._id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded-lg border border-red-200 cursor-pointer"
                    >
                      <DeleteOutlineOutlinedIcon style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderReviewsTab = () => {
    return (
      <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Reviews & Comments Ledger</h3>
        {reviews.length === 0 ? (
          <p className="text-xs text-zinc-400 py-10 text-center">No customer feedback has been log yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-zinc-50/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-xs rounded-full">
                      {r.customer?.firstName?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                        {r.customer ? `${r.customer.firstName} ${r.customer.lastName}` : 'Anonymous Customer'}
                      </span>
                      <span className="text-[9px] text-zinc-400 block mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <StarRateOutlinedIcon key={i} style={{ fontSize: 14 }} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-350 italic mt-3 leading-relaxed">
                  "{capitalize(r.review || 'No comment message entered by user.')}"
                </p>
                {r.booking && (
                  <span className="inline-block text-[9px] text-zinc-400 mt-2 font-mono">Booking ID: {r.booking.bookingNumber}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    )
  }

  const renderEarningsTab = () => {
    const comBookings = bookings.filter(b => b.status === 'completed')
    return (
      <div className="space-y-6">
        {/* Stats card */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className={`p-4 border ${cardTheme} rounded-[16px] text-center`}>
            <span className="text-[10px] font-bold text-zinc-450 uppercase block">Total Net Revenue</span>
            <h3 className="text-2xl font-black text-[#16A34A] mt-1.5">₹{earningsSum.toLocaleString()}</h3>
          </Card>
          <Card className={`p-4 border ${cardTheme} rounded-[16px] text-center`}>
            <span className="text-[10px] font-bold text-zinc-450 uppercase block">Settled Payouts</span>
            <h3 className="text-2xl font-black text-[#16A34A] mt-1.5">₹{(earningsSum * 0.95).toLocaleString()}</h3>
            <span className="text-[9px] text-zinc-400">95% split, 5% admin fee</span>
          </Card>
          <Card className={`p-4 border ${cardTheme} rounded-[16px] text-center`}>
            <span className="text-[10px] font-bold text-zinc-450 uppercase block">Pending Settlement</span>
            <h3 className="text-2xl font-black text-amber-500 mt-1.5">₹{(earningsSum * 0.05).toLocaleString()}</h3>
          </Card>
        </div>

        {/* Ledger list */}
        <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">Payout Transactions Ledger</h3>
          {comBookings.length === 0 ? (
            <p className="text-xs text-zinc-400 py-10 text-center">No completed transactions ledger yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${borderCol} text-zinc-500 font-semibold bg-zinc-50/50`}>
                    <th className="py-2.5 px-4">Booking Number</th>
                    <th className="py-2.5 px-4">Service</th>
                    <th className="py-2.5 px-4">Completion Date</th>
                    <th className="py-2.5 px-4 text-center">Payment Method</th>
                    <th className="py-2.5 px-4 text-right">Payout Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {comBookings.map((b) => (
                    <tr key={b._id} className={`border-b ${borderCol} hover:bg-zinc-50/50 transition-colors`}>
                      <td className="py-3 px-4 font-mono font-bold text-zinc-500">{b.bookingNumber}</td>
                      <td className="py-3 px-4 font-semibold">{capitalizeWords(b.service?.serviceName || b.service?.title)}</td>
                      <td className="py-3 px-4">{b.completedAt ? new Date(b.completedAt).toLocaleDateString() : new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-center font-bold text-indigo-500 capitalize">{b.paymentMethod || 'Cash'}</td>
                      <td className="py-3 px-4 text-right font-black text-[#16A34A]">₹{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderMessagesTab = () => {
    const selectedHistory = chatHistories[selectedChat] || []
    const senderName = messagesList.find(m => m.id === selectedChat)?.sender || "Chat User"

    return (
      <Card className={`p-0 border ${cardTheme} rounded-[16px] overflow-hidden flex h-[500px]`}>
        {/* Left Side: Users list */}
        <div className="w-1/3 border-r border-zinc-100 dark:border-zinc-850 flex flex-col">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/40 font-bold text-xs text-zinc-500 uppercase tracking-wider">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto">
            {messagesList.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedChat(msg.id)}
                className={`p-3.5 border-b border-zinc-100 dark:border-zinc-850 cursor-pointer transition-colors flex flex-col gap-1.5 ${
                  selectedChat === msg.id ? 'bg-green-50/30 border-l-4 border-[#16A34A]' : 'hover:bg-zinc-50/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-850 dark:text-zinc-150">{msg.sender}</span>
                  <span className="text-[9px] text-zinc-400">{msg.time}</span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-50/40 flex items-center justify-between">
            <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{senderName}</span>
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
          </div>
          
          {/* History */}
          <div className="flex-1 p-4 overflow-y-auto bg-zinc-50/20 space-y-3">
            {selectedHistory.map((h, i) => {
              const isCust = h.sender === 'customer'
              return (
                <div key={i} className={`flex ${isCust ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-2xl max-w-xs text-xs font-medium ${
                    isCust ? 'bg-zinc-100 text-zinc-800' : 'bg-[#16A34A] text-white'
                  }`}>
                    <p className="leading-relaxed">{h.text}</p>
                    <span className={`text-[8px] text-right block mt-1 ${isCust ? 'text-zinc-400' : 'text-zinc-200'}`}>
                      {h.time}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={sendChatMessage} className="p-3 border-t border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-950 flex gap-2">
            <input
              type="text"
              placeholder="Type message response..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className={`flex-grow rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputBg}`}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      </Card>
    )
  }

  const renderNotificationsTab = () => {
    return (
      <Card className={`p-5 border ${cardTheme} rounded-[16px]`}>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-4">System Alerts & Notifications Log</h3>
        <div className="space-y-3">
          {dynamicAlerts.map((n, i) => (
            <div key={i} className="p-3 border-b border-zinc-100 dark:border-zinc-850 last:border-none flex gap-3 items-start text-xs">
              <span className={`h-2 w-2 rounded-full mt-1 shrink-0 ${n.type === 'kyc' ? 'bg-blue-500' : n.type === 'payment' ? 'bg-[#16A34A]' : 'bg-amber-400'}`} />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{n.text}</p>
                <span className="text-[10px] text-zinc-400 mt-1 block">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const renderProfileTab = () => {
    return (
      <Card className={`p-6 border ${cardTheme} rounded-[16px] max-w-3xl mx-auto shadow-sm`}>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-6">Business Settings & Profile details</h3>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
            <div className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 flex items-center justify-center">
                {profileForm.profileImage ? (
                  <img className="h-full w-full object-cover" src={profileForm.profileImage} alt="profile" />
                ) : (
                  <PersonOutlineOutlinedIcon style={{ fontSize: 32 }} className="text-zinc-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-md hover:bg-[#15803D] cursor-pointer border border-white"
                title="Change image"
              >
                <CameraAltOutlinedIcon style={{ fontSize: 13 }} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div>
              <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200 block">Avatar logo</span>
              <span className="text-[10px] text-zinc-400 block mt-1">Recommended size 200x200px. JPG, PNG formats.</span>
              {uploadingImage && <span className="text-[10px] font-bold text-[#16A34A] block mt-1">Uploading...</span>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Phone Contact</label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Business / Shop Name</label>
              <input
                type="text"
                value={profileForm.businessName}
                onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Years Experience</label>
              <input
                type="number"
                value={profileForm.experience}
                onChange={(e) => setProfileForm({ ...profileForm, experience: Number(e.target.value) })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">City</label>
              <input
                type="text"
                required
                value={profileForm.city}
                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Full Address</label>
              <input
                type="text"
                required
                value={profileForm.fullAddress}
                onChange={(e) => setProfileForm({ ...profileForm, fullAddress: e.target.value })}
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="submit"
              variant="gradient"
              disabled={actionLoading}
              className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
            >
              {actionLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab()
      case 'bookings':
        return renderBookingsTab()
      case 'calendar':
        return renderCalendarTab()
      case 'customers':
        return renderCustomersTab()
      case 'services':
        return renderServicesTab()
      case 'reviews':
        return renderReviewsTab()
      case 'earnings':
        return renderEarningsTab()
      case 'messages':
        return renderMessagesTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'profile':
        return renderProfileTab()
      default:
        return renderDashboardTab()
    }
  }

  return (
    <div className={`dashboard-shell ${bgMain} font-sans flex h-screen overflow-hidden`}>
      {/* Redesigned Premium Sidebar */}
      <ProviderSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        provider={provider}
        userDetails={userDetails}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Sticky Top Navbar */}
        <header className="h-[70px] shrink-0 border-b border-border-custom flex items-center justify-between px-6 bg-card-bg sticky top-0 z-30 transition-colors duration-200">
          <div>
            <h2 className="text-sm font-extrabold text-text-main uppercase tracking-wider">
              {activeTab === 'dashboard' ? 'Overview Dashboard' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search input in navbar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-border-custom bg-input-bg text-text-main text-xs focus:outline-none w-[200px]"
              />
              <SearchOutlinedIcon className="absolute left-2.5 top-2.5 text-text-muted" style={{ fontSize: 13 }} />
            </div>

            {/* Notification triggers */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="h-8 w-8 rounded-lg hover:bg-shell-bg flex items-center justify-center text-text-muted relative cursor-pointer"
            >
              <NotificationsOutlinedIcon fontSize="small" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Message triggers */}
            <button
              onClick={() => setActiveTab('messages')}
              className="h-8 w-8 rounded-lg hover:bg-shell-bg flex items-center justify-center text-text-muted relative cursor-pointer"
            >
              <MessageOutlinedIcon fontSize="small" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#16A34A] rounded-full animate-pulse" />
            </button>
            
            {/* User Profile initials */}
            <div
              onClick={() => setActiveTab('profile')}
              className="h-8 w-8 rounded-full bg-green-50 text-[#16A34A] flex items-center justify-center font-bold text-xs border border-green-200 cursor-pointer"
              title="Go to settings"
            >
              {userDetails?.firstName?.charAt(0).toUpperCase() || 'P'}
            </div>
          </div>
        </header>

        {/* Dynamic scrollable body panel */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden p-6">
          
          {/* Notification toast */}
          {notification && (
            <div className="mb-4 bg-[#16A34A] text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md border-l-4 border-emerald-600 animate-fade-up">
              {notification}
            </div>
          )}

          {/* Tab Header Greeting (Only for dashboard Overview) */}
          {activeTab === 'dashboard' && (
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                  Welcome Back, {userDetails ? capitalizeWords(userDetails.firstName) : 'Vijay'} 👋
                </h1>
                <p className={`text-xs mt-1 leading-relaxed ${textMuted}`}>
                  Manage your bookings and services efficiently.
                </p>
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-bold ${isOnline ? 'text-[#16A34A]' : 'text-zinc-400'}`}>
                  {isOnline ? 'Available Today' : 'Unavailable'}
                </span>
                <button
                  onClick={toggleOnlineStatus}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOnline ? 'bg-[#16A34A]' : 'bg-zinc-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Render Tab Contents */}
          {renderTabContent()}

        </div>
      </div>

      {/* Booking Details Right-Side Drawer */}
      {drawerOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => setDrawerOpen(false)}
          />
          <div className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-zinc-950'} h-full shadow-2xl border-l ${borderCol} p-6 flex flex-col justify-between z-10 relative overflow-y-auto animate-slide-left`}>
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4 mb-5 border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">Booking Details</h3>
                  <span className="font-mono text-xs text-zinc-400">Order: {selectedBooking.bookingNumber}</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-8 w-8 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 cursor-pointer"
                >
                  <CloseOutlinedIcon fontSize="small" />
                </button>
              </div>

              {/* Status block */}
              <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">Current Status</span>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    selectedBooking.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {capitalize(selectedBooking.status.replace(/_/g, ' '))}
                  </span>
                  <span className="text-xs font-black text-[#16A34A]">₹{selectedBooking.amount}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Customer Details</h4>
                <div className="grid grid-cols-[100px_1fr] text-xs gap-y-2.5">
                  <span className={textMuted}>Name:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {selectedBooking.customer ? `${selectedBooking.customer.firstName} ${selectedBooking.customer.lastName}` : 'Guest User'}
                  </span>

                  <span className={textMuted}>Phone:</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.customer?.phone || 'N/A'}</span>

                  <span className={textMuted}>Email:</span>
                  <span className="text-zinc-850 dark:text-zinc-250">{selectedBooking.customer?.email || 'N/A'}</span>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Service details</h4>
                <div className="grid grid-cols-[100px_1fr] text-xs gap-y-2.5">
                  <span className={textMuted}>Service:</span>
                  <span className="font-bold text-zinc-850 dark:text-zinc-200">
                    {capitalizeWords(selectedBooking.service?.serviceName || selectedBooking.service?.title)}
                  </span>

                  <span className={textMuted}>Date:</span>
                  <span className="font-semibold text-zinc-850 dark:text-zinc-200">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</span>

                  <span className={textMuted}>Time Slot:</span>
                  <span className="font-semibold text-zinc-850 dark:text-zinc-200">{selectedBooking.bookingTime}</span>

                  <span className={textMuted}>Address:</span>
                  <span className="font-semibold text-zinc-850 dark:text-zinc-200 leading-relaxed">
                    {selectedBooking.address}, {capitalizeWords(selectedBooking.city)}, {selectedBooking.state} - {selectedBooking.pincode}
                  </span>

                  <span className={textMuted}>Client Notes:</span>
                  <span className="italic text-zinc-500">{selectedBooking.notes || 'No notes left by client.'}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="border-t pt-4 border-zinc-150 dark:border-zinc-800 flex gap-2.5">
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, 'accepted')}
                    className="flex-1 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, 'rejected')}
                    className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-350 text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    Decline
                  </button>
                </>
              )}

              {selectedBooking.status === 'accepted' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'on_the_way')}
                  className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                >
                  Mark On The Way
                </button>
              )}

              {selectedBooking.status === 'on_the_way' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'started')}
                  className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                >
                  Verify Start OTP
                </button>
              )}

              {selectedBooking.status === 'started' && (
                <button
                  onClick={() => handleUpdateStatus(selectedBooking._id, 'completed')}
                  className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
                >
                  Verify End OTP & Complete
                </button>
              )}

              {['completed', 'rejected', 'cancelled'].includes(selectedBooking.status) && (
                <span className="w-full text-center text-xs text-zinc-400 py-2.5 font-bold bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  Transaction finalized. No actions pending.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {otpModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-up">
          <div className={`w-full max-w-sm rounded-[16px] p-6 shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-zinc-900 border border-zinc-800'}`}>
            <h3 className="text-base font-extrabold mb-1">OTP Verification Required</h3>
            <p className={`text-xs mb-5 ${theme === 'light' ? 'text-zinc-650' : 'text-zinc-400'}`}>
              Please enter the OTP provided by the client to {otpModal.targetStatus === 'started' ? 'start' : 'complete'} this service.
            </p>
            
            <input
              type="text"
              autoFocus
              placeholder="Enter 4-digit OTP"
              value={otpModal.otp}
              onChange={(e) => setOtpModal(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              className={`w-full mb-6 text-center text-xl tracking-[0.5em] font-mono rounded-xl border px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#16A34A] ${theme === 'light' ? 'bg-zinc-50 text-zinc-900 border-zinc-200' : 'bg-zinc-800 text-zinc-100 border-zinc-700'}`}
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 py-2 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-bold rounded-lg cursor-pointer text-center text-zinc-650 dark:text-zinc-350"
                onClick={() => setOtpModal({ show: false, bookingId: null, targetStatus: '', otp: '' })}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading || otpModal.otp.length !== 4}
                className="flex-1 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg cursor-pointer text-center disabled:opacity-50"
                onClick={() => handleUpdateStatus(otpModal.bookingId, otpModal.targetStatus, otpModal.otp)}
              >
                Confirm OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal Dialog */}
      {invoiceModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-up">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
                <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200">Invoice Statement</h4>
                <button
                  onClick={() => setInvoiceModal(prev => ({ ...prev, show: false }))}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <CloseOutlinedIcon style={{ fontSize: 16 }} />
                </button>
              </div>

              {/* Body details */}
              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Booking Reference:</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-250">{invoiceModal.bookingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-250">{invoiceModal.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Service Task:</span>
                  <span className="font-semibold text-zinc-850 dark:text-zinc-200">{invoiceModal.serviceName}</span>
                </div>
                
                <hr className="border-zinc-100 dark:border-zinc-800 my-2" />
                
                <div className="flex justify-between">
                  <span className="text-zinc-400">Base Cost:</span>
                  <span className="font-semibold">₹{invoiceModal.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">GST Tax (18%):</span>
                  <span className="font-semibold text-zinc-550">₹{invoiceModal.tax}</span>
                </div>
                
                <hr className="border-zinc-100 dark:border-zinc-800 my-2" />
                
                <div className="flex justify-between text-sm font-black text-[#16A34A]">
                  <span>Total Bill Amount:</span>
                  <span>₹{invoiceModal.total}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t pt-4 border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setInvoiceModal(prev => ({ ...prev, show: false }))}
                className="flex-1 py-2.5 border border-zinc-200 text-xs font-bold rounded-xl cursor-pointer text-center text-zinc-650"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("Invoice PDF created and emailed to customer!")
                  setInvoiceModal(prev => ({ ...prev, show: false }))
                }}
                className="flex-1 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-xl cursor-pointer text-center"
              >
                Email Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderDashborad
