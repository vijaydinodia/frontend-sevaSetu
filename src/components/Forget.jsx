import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import API_URL from '../api'

const Forget = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const res = await axios.post(`${API_URL}/user/forgetPassword`, {
        email: normalizedEmail,
      })

      localStorage.setItem('resetEmail', normalizedEmail)
      setMessage(res.data.message || 'OTP sent successfully')
      navigate('/verify-otp')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>

        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>

        {message && <p className="form-message">{message}</p>}

        <p className="form-message">
          Remember password? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  )
}

export default Forget
