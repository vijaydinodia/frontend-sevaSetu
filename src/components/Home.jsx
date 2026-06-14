import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import axios from 'axios'
import API_URL from '../api'
import Button from './ui/Button'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Navbar from './Navbar'

const Home = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
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

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM"
  ]

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

  const handleBookClick = (provService) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please login first to book a service.")
      navigate('/login')
      return
    }

    // Prefill form from current user's profile address details
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

  // Dynamic CSS classes for dark theme compliance
  const bgTheme = theme === 'light' ? 'bg-[#f8ebe6] text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/'
    if (user.role === 'provider') return '/provider-dashboard'
    if (user.role === 'admin') return '/admin-dashboard'
    if (user.role === 'superAdmin') return '/super-admin-dashboard'
    return '/user-dashboard'
  }

  // Search filtering logic
  const filteredServices = services.filter((ps) => {
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

  return (
    <main className={`min-h-screen transition-colors duration-200 ${bgTheme}`}>
      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Hero section */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
        <div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-normal md:text-7xl">
            <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              SevaSetu
            </span>
            <br />
            for real-time services
          </h1>

          <p className={`mt-7 max-w-lg text-sm leading-6 ${textMuted}`}>
            Book local verified service providers, manage bookings, review performance, and keep every workflow unified in a sleek dashboard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {user ? (
              <Link to={getDashboardLink()}>
                <Button variant="gradient" className="h-14 px-7">
                  <ArrowForwardOutlinedIcon fontSize="small" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button variant="gradient" className="h-14 px-7">
                  <ArrowForwardOutlinedIcon fontSize="small" />
                  Start for free
                </Button>
              </Link>
            )}
            <Link to="/become-provider">
              <Button variant="outline" className="h-14 px-7">
                Join as Partner
              </Button>
            </Link>
          </div>

          <div className={`mt-7 flex flex-wrap gap-5 text-xs font-semibold ${theme === 'light' ? 'text-black' : 'text-zinc-300'}`}>
            <span>Verified Professionals</span>
            <span>Real-time booking tracking</span>
            <span>Secure payments</span>
          </div>
        </div>

        <div className="relative min-h-[540px]">
          <Card className="absolute left-2 top-24 hidden w-40 overflow-hidden p-2 md:block">
            <div className="h-24 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-500" />
          </Card>

          <Card className="absolute left-[25%] top-0 w-64 bg-zinc-950 p-5 text-white md:w-72">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold leading-6">Service Request</p>
                <p className="text-xs text-zinc-400">Live request match</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs">...</span>
            </div>
            <div className="mt-8 flex h-20 items-center gap-1">
              {Array.from({ length: 38 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-white/70"
                  style={{ height: `${12 + (index % 7) * 7}px` }}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-3 text-xs text-black">
              <span>00:05:39</span>
              <span className="text-pink-500 font-semibold">Matching...</span>
            </div>
          </Card>

          <Card className="absolute right-0 top-20 w-36 overflow-hidden p-2 md:w-44 bg-zinc-800">
            <div className="flex h-24 items-center justify-center rounded-3xl bg-[#d9c1aa]">
              <PersonOutlineOutlinedIcon style={{ color: '#000' }} />
            </div>
          </Card>

          <Card className="absolute right-12 top-56 w-72 p-5 md:w-80 bg-zinc-900 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                <VerifiedRoundedIcon fontSize="small" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-500">Consent Verified</p>
                <p className="text-sm font-semibold">The partner is verified and ready for work.</p>
              </div>
            </div>
          </Card>

          <Card className="absolute bottom-0 left-[12%] w-44 overflow-hidden p-2 bg-zinc-800">
            <div className="flex h-28 items-center justify-center rounded-3xl bg-[#cbd7c6]">
              <PlayArrowRoundedIcon style={{ color: '#000' }} />
            </div>
          </Card>

          <Card className="absolute bottom-3 right-2 w-44 overflow-hidden p-2 bg-zinc-800">
            <div className="flex h-28 items-center justify-center rounded-3xl bg-[#b7d7da]">
              <GraphicEqRoundedIcon style={{ color: '#000' }} />
            </div>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`px-5 py-16 ${theme === 'light' ? 'bg-[#faf6f0]' : 'bg-zinc-900'} border-t border-b ${theme === 'light' ? 'border-zinc-200' : 'border-zinc-800'}`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Services Offered by Partners</h2>
          <p className={`text-center text-sm ${textMuted} mb-8 max-w-md mx-auto`}>
            Book verified local professionals with secure time slots and transparent pricing.
          </p>

          {/* Search bar */}
          <div className="mb-10 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search services, categories or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-2xl border px-5 py-3.5 text-sm outline-none transition duration-150 ${
                theme === 'light'
                  ? 'border-zinc-200 bg-white text-zinc-900 focus:border-black shadow-sm'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-100 focus:border-white shadow-md'
              }`}
            />
          </div>

          {filteredServices.length === 0 ? (
            <p className={`text-center text-sm ${textMuted} py-12`}>
              No services matching your search found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((ps) => (
                <Card
                  key={ps._id}
                  className={`flex flex-col justify-between border p-5 ${cardTheme} hover:shadow-lg transition duration-200`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 capitalize">
                        {ps.service?.category?.name || 'Service'}
                      </span>
                      <span className="text-lg font-bold text-amber-500">
                        ₹{ps.price || ps.service?.basePrice}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{ps.service?.serviceName}</h3>
                    <p className={`text-xs ${textMuted} mb-4 line-clamp-3`}>
                      {ps.service?.description}
                    </p>

                    <div className={`mt-auto border-t pt-4 ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800'}`}>
                      <p className="text-xs text-zinc-400 font-medium">Provider Info</p>
                      <p className="text-sm font-semibold m-0 mt-0.5">
                        {ps.provider?.businessName || `${ps.provider?.user?.firstName} ${ps.provider?.user?.lastName || ''}`}
                      </p>
                      <p className={`text-xs ${textMuted}`}>
                        Experience: {ps.provider?.experience || 0} years
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button
                      onClick={() => handleBookClick(ps)}
                      variant="gradient"
                      className="w-full justify-center"
                    >
                      Book Service
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Categories list section */}
      <section id="categories" className={`${theme === 'light' ? 'bg-white' : 'bg-zinc-950'} px-5 py-16`}>
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-2 text-center">Our Service Categories</h2>
          <p className={`text-center text-sm ${textMuted} mb-8 max-w-md mx-auto`}>
            Explore and book skilled local professionals registered and verified on SevaSetu.
          </p>
          
          {categories.length === 0 ? (
            <p className={`text-center text-sm ${textMuted} py-6`}>
              No active categories. Contact Admin to create new categories.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Card key={cat._id} className={`p-5 text-center flex flex-col items-center gap-3 border ${cardTheme} hover:-translate-y-1 transition duration-200`}>
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                    {(cat.name || 'C')[0]}
                  </div>
                  <h4 className="font-bold text-base m-0">{cat.name || 'N/A'}</h4>
                  <p className={`text-xs m-0 ${textMuted} line-clamp-2`}>{cat.description || 'Verified local services'}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className={`w-full max-w-lg overflow-y-auto max-h-[90vh] p-6 shadow-2xl border ${cardTheme}`}>
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold">Book {selectedService.service?.serviceName}</h3>
                <p className={`text-xs ${textMuted}`}>
                  Provider: {selectedService.provider?.businessName}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-600 font-semibold text-sm transition"
              >
                Close
              </button>
            </div>

            {bookingMessage && (
              <p className="mb-4 text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-xl">
                {bookingMessage}
              </p>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-500">Booking Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                      theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-500">Time Slot *</label>
                  <select
                    required
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                      theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                    }`}
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
                <label className="mb-1 block text-xs font-semibold text-zinc-500">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, building, apartment"
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                    theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                  }`}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-500">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                      theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-500">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={bookingForm.state}
                    onChange={(e) => setBookingForm({ ...bookingForm, state: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                      theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-zinc-500">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={bookingForm.pincode}
                    onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                      theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-zinc-500">Additional Notes</label>
                <textarea
                  rows="3"
                  placeholder="Any specific requests or instructions..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-black ${
                    theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-900'
                  }`}
                />
              </div>

              <div className="flex justify-between items-center border-t pt-4 mt-6">
                <div>
                  <p className="text-xs text-zinc-400">Total Price</p>
                  <p className="text-lg font-bold text-amber-500">
                    ₹{selectedService.price || selectedService.service?.basePrice}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm & Book'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 px-5 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white text-lg font-bold">S</span>
            <p className="text-sm font-semibold text-white">SevaSetu Portal</p>
            <p className="text-xs">
              Bridging the gap between talented service providers and customers in real time.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#how" className="hover:text-amber-500 transition">How it works</a>
              <a href="#services" className="hover:text-amber-500 transition">Services</a>
              <a href="#categories" className="hover:text-amber-500 transition">Categories</a>
              <Link to="/login" className="hover:text-amber-500 transition">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Partner Program</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/become-provider" className="text-amber-500 font-semibold hover:underline flex items-center gap-1.5">
                Become a Provider &rarr;
              </Link>
              <p className="text-xs leading-relaxed">
                Grow your business, manage bookings, and increase your earnings with our dashboard.
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support</h4>
            <p className="text-xs leading-relaxed">
              Have questions? Contact our operations support team anytime at support@sevasetu.com
            </p>
            <p className="text-xs mt-4">
              &copy; {new Date().getFullYear()} SevaSetu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
