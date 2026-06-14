import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const Forget = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'
  const cardBg  = isLight ? 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/60'
                          : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500/20'
    : 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500/20'
  const iconCls   = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-500' : 'text-zinc-400'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const res = await axios.post(`${API_URL}/user/forgetPassword`, { email: normalizedEmail })
      localStorage.setItem('resetEmail', normalizedEmail)
      setMessage({ text: res.data.message || 'OTP sent to your email', type: 'success' })
      setTimeout(() => navigate('/verify-otp'), 1200)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12">
      <div className={`w-full max-w-md rounded-[28px] border p-8 transition-colors duration-200 ${cardBg}`}>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xl font-bold shadow-lg">
            S
          </div>
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className={`mt-1 text-sm ${textMuted}`}>Enter your email and we'll send an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <EmailOutlinedIcon fontSize="small" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoComplete="email"
              required
              className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 font-semibold text-white shadow-lg shadow-pink-300/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <SendOutlinedIcon fontSize="small" />
            {loading ? 'Sending...' : 'Send OTP'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-sm ${textMuted}`}>
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-pink-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Forget
