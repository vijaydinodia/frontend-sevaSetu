import React, { useState, useRef } from 'react'
import axios from 'axios'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import API_URL from '../api'
import Button from './ui/Button'
import Input from './ui/Input'

const EditProfileModal = ({ onClose, onSuccess, uploadEndpoint, profileEndpoint }) => {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const [formData, setFormData] = useState({
    firstName: savedUser.firstName || '',
    lastName: savedUser.lastName || '',
    phone: savedUser.phone || '',
    profileImage: savedUser.profileImage || '',
    fullAddress: savedUser.address?.fullAddress || '',
    city: savedUser.address?.city || '',
    state: savedUser.address?.state || '',
    country: savedUser.address?.country || '',
    pincode: savedUser.address?.pincode || '',
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const fileInputRef = useRef(null)

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  })

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
      const imageData = new FormData()
      imageData.append('image', file)

      const res = await axios.post(uploadEndpoint, imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setFormData({ ...formData, profileImage: res.data.data.url })
      setMessage('Image uploaded successfully')
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
      const res = await axios.put(
        profileEndpoint,
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
        getHeaders()
      )

      // save updated user to localStorage
      const updatedUser = res.data.data
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setMessage(res.data.message || 'Profile updated successfully')

      // tell parent to refresh data
      if (onSuccess) onSuccess(updatedUser)
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* modal box */}
      <div className="relative w-full max-w-2xl rounded-[28px] bg-white shadow-2xl">
        {/* close button */}
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
          onClick={onClose}
          type="button"
        >
          <CloseOutlinedIcon fontSize="small" />
        </button>

        {/* gradient top bar */}
        <div className="h-1.5 w-full rounded-t-[28px] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500" />

        <div className="p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-semibold text-black">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            {/* profile image circle */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="relative">
                {/* circle image */}
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#f8ebe6] bg-zinc-100">
                  {formData.profileImage ? (
                    <img
                      className="h-full w-full object-cover"
                      src={formData.profileImage}
                      alt="profile"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black text-white">
                      <PersonOutlineOutlinedIcon fontSize="medium" />
                    </div>
                  )}
                </div>

                {/* camera icon overlay */}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-md hover:bg-zinc-800"
                  onClick={() => fileInputRef.current.click()}
                  title="Change photo"
                >
                  <CameraAltOutlinedIcon style={{ fontSize: 16 }} />
                </button>
              </div>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              {uploading && (
                <p className="text-xs font-semibold text-zinc-500">Uploading image...</p>
              )}

              {!uploading && (
                <p className="text-xs text-zinc-400">Click the camera icon to change photo</p>
              )}
            </div>

            {/* form fields grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
              <Input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              <Input
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
              />
              <Input
                className="md:col-span-2"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Full address"
              />
            </div>

            {/* message */}
            {message && (
              <p className="mt-4 text-center text-sm font-semibold text-zinc-700">{message}</p>
            )}

            {/* buttons */}
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
