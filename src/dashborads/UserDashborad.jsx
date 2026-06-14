import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import API_URL from '../api'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import axios from 'axios'

const UserDashborad = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [profile, setProfile] = useState(user)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/bookings`, getHeaders())
      if (res.data?.success) {
        setBookings(res.data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err)
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [])

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'accepted':
      case 'on_the_way':
      case 'started':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-zinc-100 text-zinc-800'
    }
  }

  return (
    <>
      <Navbar user={profile} />
      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-[var(--border-color)] bg-[var(--bg-shell)] shrink-0">
                {profile?.profileImage ? (
                  <img
                    className="h-full w-full object-cover"
                    src={profile.profileImage}
                    alt="profile"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-black text-white">
                    <PersonOutlineOutlinedIcon />
                  </div>
                )}
              </div>

              <div>
                <h1 className="m-0 text-2xl font-bold text-[var(--text-main)]">User Dashboard</h1>
                <p className="text-sm text-[var(--text-muted)] m-0 mt-1">
                  Welcome, {`${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User'}
                </p>
                <p className="text-xs text-[var(--text-muted)] m-0">
                  {profile?.email} | {profile?.phone}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => setShowEditProfile(true)} className="self-start sm:self-center">
              <EditOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Bookings Section */}
        <h2 className="text-xl font-bold mb-4 text-[var(--text-main)]">Your Service Bookings</h2>
        
        {loadingBookings ? (
          <p className="text-sm text-[var(--text-muted)]">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <Card className="p-8 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-color)]">
            <p className="m-0 text-sm mb-4">You have not booked any services yet.</p>
            <Button variant="gradient" onClick={() => navigate('/')}>
              Browse & Book Services
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking._id} className="p-5 border border-[var(--border-color)]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[var(--text-muted)]">
                        #{booking.bookingNumber}
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold m-0 text-[var(--text-main)]">
                      {booking.service?.serviceName || 'Service'}
                    </h3>
                    
                    <p className="text-xs text-[var(--text-muted)] m-0 mt-2">
                      <strong>Provider:</strong> {booking.provider?.businessName || `${booking.provider?.user?.firstName || ''} ${booking.provider?.user?.lastName || ''}`}
                    </p>
                    
                    <p className="text-xs text-[var(--text-muted)] m-0 mt-1">
                      <strong>Schedule:</strong> {new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}
                    </p>
                    
                    <p className="text-xs text-[var(--text-muted)] m-0 mt-1">
                      <strong>Address:</strong> {booking.address}, {booking.city}, {booking.state} - {booking.pincode}
                    </p>

                    {booking.notes && (
                      <p className="text-xs text-[var(--text-muted)] italic m-0 mt-1.5 bg-[var(--bg-shell)] p-2 rounded-lg border border-[var(--border-color)] max-w-xl">
                        Note: {booking.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-[var(--border-color)]">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] m-0 md:text-right">Price Paid</p>
                      <p className="text-lg font-bold text-amber-500 m-0">₹{booking.amount}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
    </>
  )
}

export default UserDashborad
