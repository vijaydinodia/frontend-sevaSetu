import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    otp: '',
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
    setLoading(true)
    setMessage('')

    try {
      const email = formData.email.trim().toLowerCase()
      const otp = formData.otp.trim()
      const res = await axios.post(`${API_URL}/user/verifyOtp`, { email, otp })

      localStorage.setItem('resetEmail', email)
      localStorage.setItem('resetOtp', otp)
      setMessage(res.data.message || 'OTP verified successfully')
      navigate('/reset-password')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Verify OTP</h1>

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
          placeholder="Enter OTP"
          inputMode="numeric"
          maxLength="6"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {message && <p className="form-message">{message}</p>}

        <p className="form-message">
          Did not get OTP? <Link to="/forget-password">Send again</Link>
        </p>
      </form>
    </section>
  )
}

export default VerifyOtp
