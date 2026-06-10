import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    otp: localStorage.getItem('resetOtp') || '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/user/resetPassword`, {
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp.trim(),
        newPassword: formData.newPassword,
      })

      localStorage.removeItem('resetEmail')
      localStorage.removeItem('resetOtp')
      setMessage(res.data.message || 'Password reset successfully')
      navigate('/login')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
          required
        />

        <input
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="OTP"
          inputMode="numeric"
          maxLength="6"
          required
        />

        <input
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New password"
          autoComplete="new-password"
          required
        />

        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && <p className="form-message">{message}</p>}

        <p className="form-message">
          Back to <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}

export default ResetPassword
