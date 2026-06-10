import React, { useState } from 'react'
import axios from 'axios'
import API_URL from '../api'
import SuperAdminSidebar from '../components/SuperAdminSidebar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

const SuperAdminEditProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    profileImage: user.profileImage || '',
    fullAddress: user.address?.fullAddress || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    country: user.address?.country || '',
    pincode: user.address?.pincode || '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]

    if (!file) return

    setUploading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const imageData = new FormData()
      imageData.append('image', file)

      const res = await axios.post(`${API_URL}/superadmin/upload/image`, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setFormData({ ...formData, profileImage: res.data.data.url })
      setMessage(res.data.message || 'Image uploaded successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const res = await axios.put(
        `${API_URL}/superadmin/profile`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          profileImage: formData.profileImage,
          address: {
            fullAddress: formData.fullAddress,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      localStorage.setItem('user', JSON.stringify(res.data.data))
      setMessage(res.data.message || 'Profile updated successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8ebe6] md:flex-row">
      <SuperAdminSidebar />
      <main className="flex-1 p-5 md:p-10">
        <Card className="mx-auto max-w-3xl p-7">
          <h1 className="mb-6 text-4xl font-semibold text-black">Edit Profile</h1>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" />
            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Profile Image</label>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {formData.profileImage && (
                  <img className="h-20 w-20 rounded-2xl object-cover" src={formData.profileImage} alt="profile" />
                )}
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              {uploading && <p className="mt-2 text-sm font-semibold text-zinc-600">Uploading image...</p>}
            </div>
            <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
            <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            <Input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
            <Input className="md:col-span-2" name="fullAddress" value={formData.fullAddress} onChange={handleChange} placeholder="Full address" />

            <Button className="md:col-span-2" variant="gradient" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>

          {message && <p className="mt-5 text-center text-sm font-semibold text-zinc-700">{message}</p>}
        </Card>
      </main>
    </div>
  )
}

export default SuperAdminEditProfile
