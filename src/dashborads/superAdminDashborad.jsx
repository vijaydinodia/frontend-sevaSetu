import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
import API_URL from '../api'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import EditProfileModal from '../components/EditProfileModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

const SuperAdminDashborad = () => {
  const navigate = useNavigate()
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState(savedUser)
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews] = useState([])
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  })
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
    return `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'N/A'
  }

  const getUserEmail = (item) => {
    const user = item?.user || item
    return user?.email || 'N/A'
  }

  const showStatus = (status) => {
    if (!status) return 'N/A'
    return status.replaceAll('_', ' ')
  }

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
      ] = await Promise.all([
        axios.get(`${API_URL}/superadmin/profile`, getHeaders()),
        axios.get(`${API_URL}/superadmin/user/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/admin/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/provider/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/category/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/booking/getall`, getHeaders()),
        axios.get(`${API_URL}/superadmin/review/getall`, getHeaders()),
        axios.get(`${API_URL}/location/getall`, getHeaders()),
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

  const statCards = [
    { title: 'Users', value: users.length, icon: <GroupOutlinedIcon />, tab: 'users' },
    { title: 'Admins', value: admins.length, icon: <AdminPanelSettingsOutlinedIcon />, tab: 'admins' },
    { title: 'Providers', value: providers.length, icon: <WorkOutlineOutlinedIcon />, tab: 'providers' },
    { title: 'Categories', value: categories.length, icon: <CategoryOutlinedIcon />, tab: 'categories' },
    { title: 'Bookings', value: bookings.length, icon: <CalendarMonthOutlinedIcon />, tab: 'bookings' },
    { title: 'Reviews', value: reviews.length, icon: <RateReviewOutlinedIcon />, tab: 'reviews' },
    { title: 'Locations', value: locations.length, icon: <LocationOnOutlinedIcon />, tab: 'locations' },
  ]

  return (
    <>
    <div className="dashboard-shell">
      <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-col p-5 md:p-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
              {profile?.profileImage ? (
                <img className="h-full w-full rounded-2xl object-cover" src={profile.profileImage} alt="profile" />
              ) : (
                <PersonOutlineOutlinedIcon />
              )}
            </div>
            <div>
              <p className="m-0 text-sm font-semibold text-zinc-500">Welcome Super Admin</p>
              <h1 className="m-0 text-2xl font-semibold text-black">{getUserName(profile)}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setShowEditProfile(true)}>
              <PersonOutlineOutlinedIcon fontSize="small" />
              Edit Profile
            </Button>
            <Button onClick={handleLogout}>
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
          </div>
        )}

        {activeTab === 'categories' && (
          <Card className="p-5">
            <SectionTitle title="Categories" loading={loading} />
            <form className="mb-6 grid gap-3 md:grid-cols-3" onSubmit={handleCreateCategory}>
              <Input name="name" value={categoryForm.name} onChange={handleCategoryChange} placeholder="Category name" required />
              <Input name="description" value={categoryForm.description} onChange={handleCategoryChange} placeholder="Description" />
              <Input type="file" accept="image/*" onChange={handleCategoryImageUpload} />
              {categoryForm.image && (
                <div className="flex items-center gap-3 rounded-2xl bg-[#f8ebe6] p-3 md:col-span-3">
                  <img className="h-16 w-16 rounded-2xl object-cover" src={categoryForm.image} alt="category" />
                  <p className="m-0 text-sm font-semibold text-zinc-700">Category image uploaded</p>
                </div>
              )}
              {uploading && <p className="m-0 text-sm font-semibold text-zinc-600 md:col-span-3">Uploading image...</p>}
              <Button className="md:col-span-3" variant="gradient">Create Category</Button>
            </form>
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
                  {categories.map((item) => (
                    <tr key={item._id} className="border-b border-zinc-100">
                      <td className="p-3">
                        {item.image ? (
                          <img className="h-12 w-12 rounded-2xl object-cover" src={item.image} alt={item.name} />
                        ) : (
                          <span>N/A</span>
                        )}
                      </td>
                      <td className="p-3 font-semibold">{item.name}</td>
                      <td className="p-3">{item.description || 'N/A'}</td>
                      <td className="p-3">{item.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
                      <td className="flex gap-2 p-3">
                        <Button size="sm" variant="outline" onClick={() => handleCategoryStatus(item._id, !item.isActive)}>
                          {item.isActive ? 'Inactive' : 'Active'}
                        </Button>
                        {item.isDeleted ? (
                          <Button size="sm" onClick={() => handleRestore('category', item._id)}>Restore</Button>
                        ) : (
                          <Button size="sm" onClick={() => handleSoftDelete('category', item._id)}>Delete</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="p-5">
            <SectionTitle title="Users" loading={loading} />
            <UserTable data={users} onStatus={handleUserStatus} onDelete={(id) => handleSoftDelete('user', id)} onRestore={(id) => handleRestore('user', id)} />
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
                  className="mt-4 rounded-2xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {adminFormLoading ? 'Creating & Sending Email...' : 'Create Admin & Send Credentials'}
                </button>
              </form>
            </div>

            <AdminTable data={admins} onStatus={handleAdminStatus} onDelete={(id) => handleSoftDelete('admin', id)} onRestore={(id) => handleRestore('admin', id)} getUserName={getUserName} getUserEmail={getUserEmail} />
          </Card>
        )}

        {activeTab === 'providers' && (
          <Card className="p-5">
            <SectionTitle title="Providers" loading={loading} />
            <ProviderTable data={providers} onDelete={(id) => handleSoftDelete('provider', id)} onRestore={(id) => handleRestore('provider', id)} getUserName={getUserName} getUserEmail={getUserEmail} />
          </Card>
        )}

        {activeTab === 'bookings' && (
          <Card className="p-5">
            <SectionTitle title="Bookings" loading={loading} />
            <BookingTable data={bookings} onStatus={handleBookingStatus} onDelete={(id) => handleSoftDelete('booking', id)} onRestore={(id) => handleRestore('booking', id)} getUserName={getUserName} showStatus={showStatus} />
          </Card>
        )}

        {activeTab === 'reviews' && (
          <Card className="p-5">
            <SectionTitle title="Reviews" loading={loading} />
            <ReviewTable data={reviews} onDelete={(id) => handleSoftDelete('review', id)} onRestore={(id) => handleRestore('review', id)} getUserName={getUserName} />
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

            {/* Locations Grid */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {locations.length === 0 && (
                <p className="col-span-3 text-center text-sm text-[var(--text-muted)]">No locations added yet.</p>
              )}
              {locations.map((item) => (
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteLocation(item._id)}
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-600 border-red-500/20"
                    >
                      Delete
                    </Button>
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

const UserTable = ({ data, onStatus, onDelete, onRestore }) => {
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
              <td className="p-3 font-semibold">{`${item.firstName || ''} ${item.lastName || ''}`.trim() || 'N/A'}</td>
              <td className="p-3">{item.email}</td>
              <td className="p-3">{item.phone}</td>
              <td className="p-3 capitalize">{item.status}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="blocked">blocked</option>
                </select>
                {item.isDeleted ? (
                  <Button size="sm" onClick={() => onRestore(item._id)}>Restore</Button>
                ) : (
                  <Button size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AdminTable = ({ data, onStatus, onDelete, onRestore, getUserName, getUserEmail }) => {
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
                  {item.category?.name || 'N/A'}
                </span>
              </td>
              <td className="p-3 capitalize">{item.status}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                {item.isDeleted ? (
                  <Button size="sm" onClick={() => onRestore(item._id)}>Restore</Button>
                ) : (
                  <Button size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ProviderTable = ({ data, onDelete, onRestore, getUserName, getUserEmail }) => {
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
              <td className="p-3">{item.businessName || 'N/A'}</td>
              <td className="p-3 capitalize">{item.kycStatus || 'N/A'}</td>
              <td className="p-3">{item.averageRating || 0}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="p-3">
                {item.isDeleted ? (
                  <Button size="sm" onClick={() => onRestore(item._id)}>Restore</Button>
                ) : (
                  <Button size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const BookingTable = ({ data, onStatus, onDelete, onRestore, getUserName, showStatus }) => {
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
              <td className="p-3">{item.city}</td>
              <td className="p-3">Rs. {item.amount}</td>
              <td className="p-3 capitalize">{showStatus(item.status)}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="flex gap-2 p-3">
                <select className="rounded-full border border-zinc-200 px-3 py-2" value={item.status} onChange={(e) => onStatus(item._id, e.target.value)}>
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="on_the_way">on the way</option>
                  <option value="started">started</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                  <option value="rejected">rejected</option>
                </select>
                {item.isDeleted ? (
                  <Button size="sm" onClick={() => onRestore(item._id)}>Restore</Button>
                ) : (
                  <Button size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const ReviewTable = ({ data, onDelete, onRestore, getUserName }) => {
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
              <td className="p-3">{item.review || 'N/A'}</td>
              <td className="p-3">{item.isDeleted ? 'Yes' : 'No'}</td>
              <td className="p-3">
                {item.isDeleted ? (
                  <Button size="sm" onClick={() => onRestore(item._id)}>Restore</Button>
                ) : (
                  <Button size="sm" onClick={() => onDelete(item._id)}>Delete</Button>
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
