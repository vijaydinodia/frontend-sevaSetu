import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import axios from 'axios'
import API_URL from '../api'
import Button from './ui/Button'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Navbar from './Navbar'
import Footer from './Footer'
import { capitalize, capitalizeWords } from '../lib/utils'

const Home = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestedKeywords, setSuggestedKeywords] = useState([])
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('priceLow')
  const [selectedService, setSelectedService] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    bookingDate: '',
    bookingTime: '',
    notes: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM"
  ]

  const serviceDirectory = [
    { name: "Hourly Booking", dbSearch: "Hourly bookings", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80" },
    { name: "Bathroom Cleaning", dbSearch: "Bathroom Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80" },
    { name: "Fridge Cleaning", dbSearch: "Fridge Cleaning", image: "https://images.unsplash.com/photo-1571175432290-ef026cbe6822?auto=format&fit=crop&w=500&q=80" },
    { name: "Packing & Unpacking", dbSearch: "Packing or Unpacking", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=500&q=80" },
    { name: "Kitchen Prep", dbSearch: "Kitchen Prep", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80" },
    { name: "Utensils", dbSearch: "Utensils", image: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=500&q=80" },
    { name: "Dusting & Wiping", dbSearch: "Dusting & Wiping", image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=500&q=80" },
    { name: "Sweeping & Mopping", dbSearch: "Sweeping & Mopping", image: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=500&q=80" },
    { name: "Pre Party Clean", dbSearch: "Pre-Party Express Clean", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=500&q=80" },
    { name: "Wardrobe Cleaning", dbSearch: "Complete Wardrobe Cleaning", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500&q=80" },
    { name: "After Party Clean", dbSearch: "After-Party Express Clean", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80" },
    { name: "Ironing & Folding", dbSearch: "Ironing & Folding", image: "https://images.unsplash.com/photo-1489008777659-ad1fc8e07097?auto=format&fit=crop&w=500&q=80" },
    { name: "Window Cleaning", dbSearch: "Window Cleaning", image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=500&q=80" },
    { name: "Laundry", dbSearch: "Laundry", image: "https://images.unsplash.com/photo-1545173168-9f19472ef7f4?auto=format&fit=crop&w=500&q=80" },
    { name: "Kitchen Cleaning", dbSearch: "Kitchen Cleaning", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80" },
    { name: "Balcony Cleaning", dbSearch: "Balcony Cleaning", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80" },
    { name: "Fan Cleaning", dbSearch: "Fan Cleaning", image: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=500&q=80" },
    { name: "Kitchen Cabinet Cleaning", dbSearch: "Kitchen Cabinet Cleaning", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=500&q=80" }
  ]

  const faqData = [
    {
      question: "How do I book a service on SevaSetu?",
      answer: "Create an account or log in to your profile. Select a task from the services catalog above, choose a convenient date and time slot, fill in your address, and click 'Confirm & Book'. You can track and manage booking requests directly in your dashboard."
    },
    {
      question: "Are the service providers verified?",
      answer: "Yes. Every partner registered on SevaSetu must undergo a complete KYC process. Our administrators verify their government identities (Aadhar & PAN) and credentials before approval."
    },
    {
      question: "How do I join SevaSetu as a service provider?",
      answer: "Click the 'Join as Partner' button in the navbar or head to '/become-provider'. Complete the partner registration form, upload your KYC documents, and specify your services. Our admins will verify and approve your profile."
    },
    {
      question: "Can I cancel or reschedule a booking?",
      answer: "Yes. Bookings can be cancelled or rescheduled from your personal customer dashboard as long as the booking status is 'pending' or 'accepted'. For in-progress tasks, please coordinate with support."
    }
  ]

  // Handle hash scrolling
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

  // On mount check login and fetch data
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/categories`)
        if (res.data?.success) {
          setCategories(res.data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/services`)
        if (res.data?.success) {
          setServices(res.data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch services:', err)
      }
    }

    fetchCategories()
    fetchServices()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  // Datamuse API for related keywords
  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = searchQuery.trim()
      if (q.length < 3) {
        setSuggestedKeywords([])
        return
      }
      setIsFetchingSuggestions(true)
      try {
        const res = await axios.get(`https://api.datamuse.com/words?ml=${encodeURIComponent(q)}&max=6`)
        if (res.data && res.data.length > 0) {
          setSuggestedKeywords(res.data.map(item => item.word))
        } else {
          setSuggestedKeywords([])
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err)
      } finally {
        setIsFetchingSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 600)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleBookClick = (provService) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please log in first to book a service.")
      navigate('/login')
      return
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    setBookingForm({
      address: storedUser.address?.fullAddress || '',
      city: storedUser.address?.city || '',
      state: storedUser.address?.state || '',
      pincode: storedUser.address?.pincode || '',
      bookingDate: '',
      bookingTime: '',
      notes: ''
    })
    setSelectedService(provService)
    setBookingMessage('')
  }

  const handleServiceCardClick = (dbSearch) => {
    const mapping = {
      "Hourly bookings": "hourly-booking",
      "Bathroom Cleaning": "bathroom-cleaning",
      "Fridge Cleaning": "fridge-cleaning",
      "Packing or Unpacking": "packing-unpacking",
      "Kitchen Prep": "kitchen-prep",
      "Utensils": "utensils",
      "Dusting & Wiping": "dusting-wiping",
      "Sweeping & Mopping": "sweeping-mopping",
      "Pre-Party Express Clean": "pre-party-clean",
      "Complete Wardrobe Cleaning": "wardrobe-cleaning",
      "After-Party Express Clean": "after-party-clean",
      "Ironing & Folding": "ironing-folding",
      "Window Cleaning": "window-cleaning",
      "Laundry": "laundry",
      "Kitchen Cleaning": "kitchen-cleaning",
      "Balcony Cleaning": "balcony-cleaning",
      "Fan Cleaning": "fan-cleaning",
      "Kitchen Cabinet Cleaning": "kitchen-cabinet-cleaning"
    }
    const key = mapping[dbSearch] || dbSearch.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    navigate(`/service/${key}`)
  }

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingMessage('')
    try {
      const payload = {
        providerServiceId: selectedService._id,
        address: bookingForm.address,
        city: bookingForm.city,
        state: bookingForm.state,
        pincode: bookingForm.pincode,
        bookingDate: bookingForm.bookingDate,
        bookingTime: bookingForm.bookingTime,
        notes: bookingForm.notes
      }

      const res = await axios.post(`${API_URL}/user/booking`, payload, getHeaders())
      if (res.data?.success) {
        alert("Service booked successfully! Redirecting to dashboard...")
        setSelectedService(null)
        navigate('/user-dashboard')
      }
    } catch (error) {
      setBookingMessage(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  const bgTheme = theme === 'light' ? 'bg-white text-[#111827]' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'provider') return '/provider-dashboard'
    if (user.role === 'admin') return '/admin-dashboard'
    if (user.role === 'superAdmin') return '/super-admin-dashboard'
    return '/user-dashboard'
  }

  // Search filtering and sorting logic
  const filteredServices = services
    .filter((ps) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      
      const serviceName = ps.service?.serviceName?.toLowerCase() || ''
      const categoryName = ps.service?.category?.name?.toLowerCase() || ''
      const providerBusiness = ps.provider?.businessName?.toLowerCase() || ''
      const providerName = `${ps.provider?.user?.firstName || ''} ${ps.provider?.user?.lastName || ''}`.toLowerCase()

      return (
        serviceName.includes(q) ||
        categoryName.includes(q) ||
        providerBusiness.includes(q) ||
        providerName.includes(q)
      )
    })
    .sort((a, b) => {
      const priceA = a.price || a.service?.basePrice || 0
      const priceB = b.price || b.service?.basePrice || 0
      if (sortBy === 'priceLow') {
        return priceA - priceB
      }
      if (sortBy === 'priceHigh') {
        return priceB - priceA
      }
      if (sortBy === 'experience') {
        return (b.provider?.experience || 0) - (a.provider?.experience || 0)
      }
      return 0
    })

  return (
    <main className={`min-h-screen transition-colors duration-200 ${bgTheme} font-sans`}>
      <Navbar user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-[120px] pb-[100px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col items-start animate-fade-up">
          <h1 className="text-[52px] md:text-[72px] font-extrabold leading-[1.1] text-[#111827] dark:text-white tracking-tight">
            Book trusted <br />
            <span className="text-[#16A34A]">house help.</span>
          </h1>

          <p className="mt-6 text-lg md:text-[18px] leading-[1.8] text-[#6B7280] max-w-xl">
            From hourly bookings to express cleans to daily upkeep. Professional, verified and reliable service providers.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 w-full sm:w-auto">
            {user ? (
              <Link to={getDashboardLink()} className="w-full sm:w-auto">
                <Button variant="gradient" className="h-14 px-8 bg-[#16A34A] hover:bg-[#15803D] text-white w-full sm:w-auto" title="Go to Dashboard">
                  Go to Dashboard
                  <ArrowForwardOutlinedIcon fontSize="small" />
                </Button>
              </Link>
            ) : (
              <a href="#services" className="w-full sm:w-auto">
                <Button variant="gradient" className="h-14 px-8 bg-[#16A34A] hover:bg-[#15803D] text-white w-full sm:w-auto" title="Book Now">
                  Book Now
                  <ArrowForwardOutlinedIcon fontSize="small" />
                </Button>
              </a>
            )}
            <a href="#services" className="w-full sm:w-auto">
              <Button variant="outline" className="h-14 px-8 border-zinc-200 text-[#111827] dark:text-zinc-200 w-full sm:w-auto" title="Explore Services">
                Explore Services
              </Button>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#6B7280]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Verified Professionals
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Transparent Pricing
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Secure Payments
            </span>
          </div>
        </div>

        {/* Hero Collage Illustration */}
        <div className="lg:col-span-6 relative w-full h-[400px] md:h-[500px] hidden lg:block animate-fade-up">
          {/* Main Backdrop */}
          <div className="absolute inset-0 bg-[#F9FAFB] dark:bg-zinc-900/40 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/40 -z-10" />
          
          {/* Card 1: Partner profile card */}
          <Card className="absolute top-12 left-10 w-[300px] p-5 border border-zinc-200/80 bg-white/95 shadow-lg shadow-zinc-100/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-zinc-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" alt="Sunita" className="object-cover h-full w-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">Sunita Sharma</h4>
                <p className="text-xs text-[#6B7280]">Housekeeping Expert</p>
              </div>
              <span className="ml-auto bg-green-50 text-[#16A34A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-[#6B7280]">
              <span>Experience: 4 Yrs</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <StarRateOutlinedIcon fontSize="inherit" /> 4.9 (318 reviews)
              </span>
            </div>
          </Card>

          {/* Card 2: Pulse Dot Live Matching */}
          <Card className="absolute top-1/2 -translate-y-1/2 right-12 w-[240px] p-4 bg-zinc-950 text-white shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
              </span>
              <p className="text-xs font-bold text-zinc-300">Matching Live</p>
            </div>
            <p className="text-xl font-bold mt-2">3,492 active pros</p>
            <p className="text-[10px] text-zinc-400 mt-1">Available in Delhi NCR, Mumbai, Bangalore...</p>
          </Card>

          {/* Card 3: Success Confirmation */}
          <Card className="absolute bottom-12 left-16 w-[280px] p-4 border border-zinc-200/80 bg-white/95 shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#111827]">Express Clean Booked</p>
                <p className="text-[10px] text-[#6B7280]">Partner matches in 12s</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="border-t border-zinc-100 dark:border-zinc-900 py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            Why Us
          </span>
          <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
            Designed for trust.
          </h2>
          <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
            SevaSetu matches you with premium local service partners instantly with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Verified Professionals",
              desc: "Every provider undergoes background checks and complete KYC verification for your safety.",
              icon: <ShieldOutlinedIcon className="text-[#16A34A]" fontSize="large" />
            },
            {
              title: "Affordable Pricing",
              desc: "Standard flat rates with zero hidden charges. Know exactly what you pay before booking.",
              icon: <LocalAtmOutlinedIcon className="text-[#16A34A]" fontSize="large" />
            },
            {
              title: "Quick Booking",
              desc: "Browse providers, pick dates, select dynamic time slots, and schedule in seconds.",
              icon: <BoltOutlinedIcon className="text-[#16A34A]" fontSize="large" />
            },
            {
              title: "Trusted Services",
              desc: "Rated 4.9+ by thousands of homeowners. Absolute satisfaction or we fix it.",
              icon: <ThumbUpOutlinedIcon className="text-[#16A34A]" fontSize="large" />
            }
          ].map((feat, idx) => (
            <Card key={idx} className={`p-8 border ${cardTheme} rounded-[24px] hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 flex flex-col gap-5`}>
              <div className="h-14 w-14 rounded-2xl bg-[#16A34A]/10 flex items-center justify-center">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#111827] dark:text-white">{feat.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-[#6B7280]">{feat.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="bg-[#F9FAFB] dark:bg-zinc-900/30 border-t border-b border-zinc-100 dark:border-zinc-900 py-24 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
              Services
            </span>
            <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
              Book a service.
            </h2>
            <p className="mt-4 text-sm text-[#6B7280] leading-relaxed">
              Explore our range of premium, vetted housekeeping and cleaning services. Click a card to filter available local partners below.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceDirectory.map((srv, idx) => (
              <div
                key={idx}
                onClick={() => handleServiceCardClick(srv.dbSearch)}
                className="bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-4 cursor-pointer hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-lg hover:border-[#16A34A]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Area */}
                <div className="w-full h-[220px] bg-[#F9FAFB] dark:bg-zinc-800/50 rounded-[18px] overflow-hidden relative">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[15px] font-bold text-[#111827] dark:text-white truncate pr-2 group-hover:text-[#16A34A] transition-colors duration-200">
                    {srv.name}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 group-hover:bg-[#16A34A] text-zinc-400 group-hover:text-white transition-colors duration-200 shrink-0">
                    <ArrowForwardOutlinedIcon fontSize="inherit" className="text-[14px]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            How It Works
          </span>
          <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
            Book in 3 simple steps.
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Getting reliable service support is simple, streamlined, and direct.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Select Service",
              desc: "Choose a cleaning task from the grid above or search using keywords. Click to narrow down."
            },
            {
              step: "02",
              title: "Choose Time Slot",
              desc: "Select a date and time slot that fits your schedule. Input your home address details."
            },
            {
              step: "03",
              title: "Relax",
              desc: "Our automated dispatch matching connects you to a verified local professional. Track live."
            }
          ].map((item, idx) => (
            <Card key={idx} className={`p-8 border ${cardTheme} rounded-[24px] hover:shadow-md transition-shadow duration-300 relative flex flex-col gap-4`}>
              <span className="text-[42px] font-black text-[#16A34A]/10 absolute top-4 right-6 select-none">
                {item.step}
              </span>
              <h3 className="text-[18px] font-bold text-[#111827] dark:text-white mt-2">{item.title}</h3>
              <p className="text-xs leading-relaxed text-[#6B7280]">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Cities Covered Section */}
      <section id="cities" className="bg-[#F9FAFB] dark:bg-zinc-900/30 border-t border-b border-zinc-100 dark:border-zinc-900 py-24 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            Cities
          </span>
          <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
            We are operating in.
          </h2>
          <p className="mt-4 text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed mb-12">
            Expanding quickly across major metropolitan regions. Find vetted partners near you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Kolkata'].map((city, idx) => (
              <span
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#111827] dark:text-zinc-200 px-6 py-3.5 rounded-full text-base font-semibold shadow-sm hover:border-[#16A34A] transition-colors duration-200"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            Testimonials
          </span>
          <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
            Loved by users.
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Read what our customers say about their booking experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "SevaSetu has made finding home cleaning help so straightforward. The hourly rate is clear and the provider arrived exactly on time. I can't recommend it enough!",
              author: "Priya R.",
              location: "Bangalore",
              rating: 5
            },
            {
              quote: "I booked a deep bathroom cleaning before a pre-party, and the express clean was phenomenal. Absolute lifesaver and very professional.",
              author: "Amit K.",
              location: "Delhi NCR",
              rating: 5
            },
            {
              quote: "The packing and kitchen prep assistance has been extremely helpful for my parents. Reliable service providers and easy bookings!",
              author: "Sneha M.",
              location: "Mumbai",
              rating: 5
            }
          ].map((item, idx) => (
            <Card key={idx} className={`p-8 border ${cardTheme} rounded-[24px] hover:shadow-lg transition-all duration-300 relative flex flex-col justify-between gap-6`}>
              <span className="absolute top-6 right-6 text-zinc-100 dark:text-zinc-800 -z-10">
                <FormatQuoteRoundedIcon style={{ fontSize: '64px' }} />
              </span>
              <div>
                <div className="flex gap-0.5 text-amber-500 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <StarRateOutlinedIcon key={i} fontSize="small" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#6B7280] italic">"{item.quote}"</p>
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-850 pt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-sm">
                  {item.author[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827] dark:text-white">{item.author}</h4>
                  <p className="text-xs text-[#6B7280]">{item.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="bg-[#F9FAFB] dark:bg-zinc-900/30 border-t border-b border-zinc-100 dark:border-zinc-900 py-24 px-6 md:px-10">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
            <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
              FAQs
            </span>
            <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
              Frequently asked.
            </h2>
            <p className="mt-4 text-sm text-[#6B7280]">
              Quick answers to common questions about bookings and partner verification.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                  >
                    <span className="font-bold text-[#111827] dark:text-white text-[16px] pr-4">
                      {faq.question}
                    </span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#16A34A]' : ''}`}>
                      <ExpandMoreOutlinedIcon fontSize="small" />
                    </span>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-zinc-100 dark:border-zinc-800' : 'max-h-0'}`}>
                    <p className="p-6 text-xs md:text-sm leading-relaxed text-[#6B7280] bg-zinc-50/50 dark:bg-zinc-900/50">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Available Partner Services Booking Section */}
      <section id="booking-section" className="mx-auto max-w-[1400px] px-6 md:px-10 py-24">
        <div className="text-center max-w-xl mx-auto mb-16 animate-fade-up">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            Partners
          </span>
          <h2 className="text-[42px] font-bold text-[#111827] dark:text-white mt-4 tracking-tight">
            Vetted active partners.
          </h2>
          <p className="mt-4 text-sm text-[#6B7280]">
            Browse direct services offered by verified local professionals near you.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-12 max-w-2xl mx-auto animate-fade-up">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search services, categories or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-full border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 text-sm outline-none focus:border-[#16A34A] transition duration-200 text-[#111827] dark:text-zinc-100 shadow-sm"
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 px-5 py-3.5 text-xs font-bold transition duration-200 cursor-pointer shrink-0 text-[#111827] dark:text-zinc-300"
              >
                Clear Filter
              </button>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-full border border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3.5 text-sm outline-none focus:border-[#16A34A] transition duration-200 text-[#111827] dark:text-zinc-100 shadow-sm cursor-pointer"
            >
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="experience">Experience: Highest First</option>
            </select>
          </div>

          {/* Suggested chips */}
          {suggestedKeywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
              <span className="text-xs font-semibold text-[#6B7280]">Suggested:</span>
              {suggestedKeywords.map((word) => (
                <button
                  key={word}
                  onClick={() => setSearchQuery(word)}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-[#16A34A] hover:text-[#16A34A] transition duration-200 cursor-pointer"
                >
                  {capitalizeWords(word)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Available services list */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/10 rounded-[32px] border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-[#6B7280]">
              No active providers match your filter query. Pick another service above.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((ps) => (
              <Card
                key={ps._id}
                className={`flex flex-col border p-5 ${cardTheme} hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 rounded-[28px] overflow-hidden group`}
              >
                {ps.service?.image && (
                  <div 
                    className="w-full aspect-video bg-[#F9FAFB] dark:bg-zinc-800/50 mb-5 overflow-hidden rounded-2xl flex items-center justify-center cursor-pointer"
                    onClick={() => handleServiceCardClick(ps.service?.serviceName)}
                  >
                    <img
                      src={ps.service.image}
                      alt={ps.service.serviceName}
                      className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-[#16A34A]">
                        {capitalizeWords(ps.service?.category?.name) || 'Service'}
                      </span>
                    </div>

                    <h3 
                      className="text-xl font-bold mb-2 text-[#111827] dark:text-white cursor-pointer hover:text-[#16A34A] transition-colors"
                      onClick={() => handleServiceCardClick(ps.service?.serviceName)}
                    >
                      {capitalizeWords(ps.service?.serviceName)}
                    </h3>

                    <p className="text-xs leading-relaxed text-[#6B7280] mb-5 line-clamp-2">
                      {capitalize(ps.service?.description)}
                    </p>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Provider</p>
                        <p className="text-xs font-bold text-[#111827] dark:text-white mt-0.5 truncate max-w-[130px]">
                          {ps.provider?.businessName 
                            ? capitalizeWords(ps.provider.businessName) 
                            : capitalizeWords(`${ps.provider?.user?.firstName || ''} ${ps.provider?.user?.lastName || ''}`)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Starts at</p>
                        <span className="text-lg font-black text-[#16A34A] block mt-0.5">
                          ₹{ps.price || ps.service?.basePrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => handleBookClick(ps)}
                      variant="gradient"
                      className="w-full justify-between items-center px-6 h-12 bg-[#16A34A] hover:bg-[#15803D] text-white"
                      title="Book Service"
                    >
                      <span className="font-bold text-sm">Book Service</span>
                      <BookmarkAddOutlinedIcon fontSize="small" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Booking Form Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <Card className={`w-full max-w-lg overflow-y-auto max-h-[90vh] p-6 shadow-2xl border ${cardTheme} rounded-[28px]`}>
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white">
                  Book {capitalizeWords(selectedService.service?.serviceName)}
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Provider: {selectedService.provider?.businessName 
                    ? capitalizeWords(selectedService.provider.businessName) 
                    : capitalizeWords(`${selectedService.provider?.user?.firstName || ''} ${selectedService.provider?.user?.lastName || ''}`)}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-650 cursor-pointer transition flex items-center gap-1 text-xs font-bold"
                title="Close"
              >
                <CloseOutlinedIcon fontSize="small" />
                Close
              </button>
            </div>

            {bookingMessage && (
              <p className="mb-4 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-500/20">
                {bookingMessage}
              </p>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Booking Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Time Slot *</label>
                  <select
                    required
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="">Select a Slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-500">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, building, apartment"
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={bookingForm.state}
                    onChange={(e) => setBookingForm({ ...bookingForm, state: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={bookingForm.pincode}
                    onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-500">Additional Notes</label>
                <textarea
                  rows="3"
                  placeholder="Any specific requests or instructions..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                <div>
                  <p className="text-xs text-zinc-400">Total Price</p>
                  <p className="text-xl font-black text-[#16A34A]">
                    ₹{selectedService.price || selectedService.service?.basePrice}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    title="Cancel"
                    className="border-zinc-200 text-[#111827] dark:text-zinc-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={bookingLoading}
                    title={bookingLoading ? 'Booking...' : 'Confirm & Book'}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm & Book'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </main>
  )
}

export default Home
