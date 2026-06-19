import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api'
import Navbar from './Navbar'
import Footer from './Footer'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import { capitalize, capitalizeWords } from '../lib/utils'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import Button from './ui/Button'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'

const ProviderDetails = () => {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  
  const [providerData, setProviderData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Booking states
  const [selectedService, setSelectedService] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    address: '', city: '', state: '', pincode: '', bookingDate: '', bookingTime: '', notes: ''
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

  // Dynamic CSS classes for dark theme compliance
  const bgTheme = theme === 'light' ? 'bg-[#f8ebe6] text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'

  useEffect(() => {
    window.scrollTo(0, 0)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const fetchProviderData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/user/provider/${providerId}`)
        if (res.data?.success) {
          setProviderData(res.data.data.provider)
          setReviews(res.data.data.reviews || [])
          setServices(res.data.data.services || [])
        }
      } catch (err) {
        console.error("Error fetching provider data:", err)
        setError(err.response?.data?.message || 'Failed to load provider profile')
      } finally {
        setLoading(false)
      }
    }

    if (providerId) {
      fetchProviderData()
    }
  }, [providerId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  // Booking handlers
  const handleBookClick = (provService) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please login first to book a service.")
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

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
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

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-200 ${bgTheme}`}>
      <Navbar user={user} onLogout={handleLogout} />

      <section className="flex-1 px-5 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <button 
            onClick={() => navigate(-1)}
            className={`mb-8 flex items-center gap-2 text-sm font-semibold transition hover:text-amber-500 ${textMuted}`}
          >
            <ArrowBackOutlinedIcon fontSize="small" /> Go Back
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className={`text-center py-20 rounded-3xl border ${cardTheme}`}>
              <p className="text-lg font-bold text-red-500 mb-2">Oops!</p>
              <p className={`text-sm ${textMuted}`}>{error}</p>
            </div>
          ) : providerData && (
            <div className="flex flex-col gap-8">
              
              {/* Header Card */}
              <Card className={`overflow-hidden border p-0 ${cardTheme}`}>
                <div className="h-48 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500"></div>
                <div className="px-8 pb-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20">
                    <div className="relative">
                      {providerData.user?.profileImage ? (
                        <img 
                          src={providerData.user.profileImage} 
                          alt="Profile" 
                          className={`w-32 h-32 rounded-3xl object-cover border-8 ${theme === 'light' ? 'border-white' : 'border-zinc-900'} shadow-lg`} 
                        />
                      ) : (
                        <div className={`w-32 h-32 rounded-3xl flex items-center justify-center border-8 ${theme === 'light' ? 'border-white bg-zinc-100' : 'border-zinc-900 bg-zinc-800'} shadow-lg`}>
                          <PersonOutlineOutlinedIcon className="text-amber-500" style={{ fontSize: 60 }} />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1 border-4 border-white dark:border-zinc-900 shadow-sm" title="Verified">
                        <VerifiedRoundedIcon fontSize="small" />
                      </div>
                    </div>
                    
                    <div className="flex-1 pb-2">
                      <h1 className="text-3xl font-bold mb-1">
                        {providerData.businessName ? capitalizeWords(providerData.businessName) : capitalizeWords(`${providerData.user?.firstName} ${providerData.user?.lastName}`)}
                      </h1>
                      <div className={`flex flex-wrap items-center gap-4 text-sm font-semibold ${textMuted}`}>
                        <span>{capitalizeWords(providerData.category?.name) || 'Service Provider'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                          <StarRateRoundedIcon fontSize="small" />
                          <span>{providerData.averageRating || '0.0'}</span>
                          <span className={`text-xs ml-1 ${textMuted}`}>({reviews.length} reviews)</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                        <span>{providerData.experience || 0} Years Exp.</span>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-8 pt-8 border-t ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800'}`}>
                    <h3 className="text-lg font-bold mb-3">About</h3>
                    <p className={`text-sm leading-relaxed ${textMuted}`}>
                      {providerData.description || 'No description provided by this partner.'}
                    </p>
                    
                    {providerData.serviceAreas && (
                      <div className="mt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-zinc-500">Service Areas</h4>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(providerData.serviceAreas) ? providerData.serviceAreas : providerData.serviceAreas.split(',')).map((area, idx) => (
                            <span key={idx} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${theme === 'light' ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-800 bg-zinc-800'}`}>
                              {capitalizeWords(area.trim())}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Services Section */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-6">Available Services</h2>
                
                {services.length === 0 ? (
                  <Card className={`p-8 text-center border ${cardTheme}`}>
                    <p className={`text-sm font-semibold ${textMuted}`}>No services listed by this provider.</p>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {services.map(ps => (
                      <Card key={ps._id} className={`flex flex-col border p-4 ${cardTheme} hover:shadow-xl transition-all duration-300 rounded-[28px] overflow-hidden group hover:-translate-y-1 hover:border-amber-500/30`}>
                        {ps.service?.image && (
                          <div className="w-full aspect-square bg-zinc-50 dark:bg-zinc-800/50 mb-4 overflow-hidden rounded-2xl flex items-center justify-center">
                            <img src={ps.service.image} alt={ps.service.serviceName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{capitalizeWords(ps.service?.serviceName)}</h3>
                            
                            <div className="flex items-center justify-between mt-3 mb-2">
                              <span className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                                {capitalizeWords(ps.service?.category?.name) || 'Service'}
                              </span>
                            </div>
                            
                            <p className={`text-sm ${textMuted} mb-4 line-clamp-2`}>
                              {capitalize(ps.service?.description)}
                            </p>

                            <div className={`mt-auto border-t pt-4 flex items-center justify-between ${theme === 'light' ? 'border-zinc-100' : 'border-zinc-800'}`}>
                              <div className="text-left">
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Price</p>
                                <span className="text-xl font-bold text-amber-500">
                                  ₹{ps.price || ps.service?.basePrice}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5">
                            <Button
                              onClick={() => handleBookClick(ps)}
                              variant="gradient"
                              className="w-full justify-between items-center px-5 h-12"
                              title="Book Service"
                            >
                              <span className="font-semibold text-sm">Book Service</span>
                              <BookmarkAddOutlinedIcon fontSize="small" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

                {reviews.length === 0 ? (
                  <Card className={`p-8 text-center border ${cardTheme}`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <StarRateRoundedIcon className="text-amber-400" style={{ fontSize: 36 }} />
                      </div>
                      <p className="font-bold text-base">No reviews yet</p>
                      <p className={`text-sm ${textMuted}`}>Be the first to review this provider after booking!</p>
                    </div>
                  </Card>
                ) : (() => {
                  // Compute rating breakdown
                  const avgRating = providerData.averageRating || (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
                  const starCounts = [5, 4, 3, 2, 1].map(star => ({
                    star,
                    count: reviews.filter(r => r.rating === star).length,
                    pct: Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100)
                  }))

                  return (
                    <div className="flex flex-col gap-6">
                      {/* Rating Summary Banner */}
                      <Card className={`border p-6 ${cardTheme}`}>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          {/* Big score */}
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-6xl font-black text-amber-500">{avgRating}</span>
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1,2,3,4,5].map(s => (
                                <StarRateRoundedIcon
                                  key={s}
                                  fontSize="small"
                                  className={parseFloat(avgRating) >= s ? 'text-amber-500' : parseFloat(avgRating) >= s - 0.5 ? 'text-amber-300' : 'text-zinc-300'}
                                />
                              ))}
                            </div>
                            <p className={`text-xs mt-1 font-semibold ${textMuted}`}>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                          </div>

                          {/* Divider */}
                          <div className={`hidden sm:block w-px h-24 ${theme === 'light' ? 'bg-zinc-200' : 'bg-zinc-700'}`} />

                          {/* Star breakdown bars */}
                          <div className="flex-1 w-full space-y-2">
                            {starCounts.map(({ star, count, pct }) => (
                              <div key={star} className="flex items-center gap-3">
                                <div className="flex items-center gap-0.5 shrink-0 w-[60px] justify-end">
                                  <span className="text-xs font-bold">{star}</span>
                                  <StarRateRoundedIcon className="text-amber-500" style={{ fontSize: 14 }} />
                                </div>
                                <div className={`flex-1 h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-semibold shrink-0 w-8 ${textMuted}`}>{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>

                      {/* Review Cards */}
                      <div className="grid gap-4 md:grid-cols-2">
                        {reviews.map(review => (
                          <Card key={review._id} className={`p-5 border flex flex-col gap-4 ${cardTheme}`}>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {review.customer?.profileImage ? (
                                  <img
                                    src={review.customer.profileImage}
                                    alt="Customer"
                                    className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-amber-500/20"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-base shrink-0">
                                    {review.customer?.firstName?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-sm leading-tight">
                                    {capitalizeWords(`${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`).trim() || 'Anonymous'}
                                  </p>
                                  <p className={`text-[11px] mt-0.5 ${textMuted}`}>
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>

                              {/* Star rating badge */}
                              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl shrink-0">
                                <StarRateRoundedIcon className="text-amber-500" style={{ fontSize: 15 }} />
                                <span className="text-sm font-bold text-amber-600">{review.rating}</span>
                              </div>
                            </div>

                            {/* Star row */}
                            <div className="flex items-center gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <StarRateRoundedIcon
                                  key={s}
                                  style={{ fontSize: 16 }}
                                  className={review.rating >= s ? 'text-amber-500' : 'text-zinc-300 dark:text-zinc-600'}
                                />
                              ))}
                            </div>

                            {/* Review text */}
                            <p className={`text-sm leading-relaxed ${textMuted}`}>
                              {review.review
                                ? `"${capitalize(review.review)}"`
                                : <span className="italic opacity-60">No written feedback.</span>
                              }
                            </p>

                            {/* Verified badge */}
                            <div className="flex items-center gap-1.5 mt-auto">
                              <VerifiedRoundedIcon className="text-green-500" style={{ fontSize: 14 }} />
                              <span className="text-[11px] font-semibold text-green-600">Verified Booking</span>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>


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
                <h3 className="text-lg font-bold">Book {capitalizeWords(selectedService.service?.serviceName)}</h3>
                <p className={`text-xs ${textMuted}`}>
                  Provider: {providerData.businessName ? capitalizeWords(providerData.businessName) : capitalizeWords(`${providerData.user?.firstName || ''} ${providerData.user?.lastName || ''}`)}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-600 font-semibold text-sm transition flex items-center gap-1"
                title="Close"
              >
                <CloseOutlinedIcon fontSize="small" />
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
                    title="Cancel"
                  >
                    <CancelOutlinedIcon fontSize="small" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={bookingLoading}
                    title={bookingLoading ? 'Booking...' : 'Confirm & Book'}
                  >
                    <CheckCircleOutlineOutlinedIcon fontSize="small" />
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

export default ProviderDetails
