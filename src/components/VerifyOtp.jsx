import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import PinOutlinedIcon from '@mui/icons-material/PinOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const VerifyOtp = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    otp: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight  = theme === 'light'
  const containerBg = isLight ? 'bg-green-50/50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const cardBg   = isLight ? 'bg-white border-zinc-200/80 shadow-xl shadow-green-900/5'
                           : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-600 focus:ring-green-600/10'
    : 'bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-green-500 focus:ring-green-500/10'
  const iconCls   = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-550' : 'text-zinc-400'

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const email = formData.email.trim().toLowerCase()
      const otp = formData.otp.trim()
      const res = await axios.post(`${API_URL}/user/verifyOtp`, { email, otp })
      localStorage.setItem('resetEmail', email)
      localStorage.setItem('resetOtp', otp)
      setMessage({ text: res.data.message || 'OTP verified!', type: 'success' })
      setTimeout(() => navigate('/reset-password'), 1000)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12 transition-colors duration-200 ${containerBg}`}>
      <div className={`w-full max-w-md rounded-xl border p-8 shadow-xl animate-slide-fade ${cardBg}`}>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16A34A] to-emerald-500 text-white shadow-md shadow-green-600/10">
            <PinOutlinedIcon fontSize="medium" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Verify OTP</h1>
          <p className={`mt-1 text-sm ${textMuted}`}>Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <EmailOutlinedIcon fontSize="small" />
            </span>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              autoComplete="email"
              required
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* OTP */}
          <input
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            inputMode="numeric"
            maxLength="6"
            required
            className={`w-full rounded-xl border py-3 px-4 text-center text-2xl font-bold tracking-[0.3em] outline-none transition focus:ring-4 ${inputCls}`}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold text-white shadow-md shadow-green-600/10 hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="small" /> : <CheckCircleOutlineOutlinedIcon fontSize="small" />}
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-xs font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-xs ${textMuted}`}>
            Didn't receive the OTP?{' '}
            <Link to="/forget-password" className="font-semibold text-green-600 dark:text-green-500 hover:underline">
              Resend
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default VerifyOtp
