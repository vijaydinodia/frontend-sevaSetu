import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    otp: localStorage.getItem('resetOtp') || '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight  = theme === 'light'
  const cardBg   = isLight ? 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/60'
                           : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500/20'
    : 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500/20'
  const iconCls   = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-500' : 'text-zinc-400'

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' })
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
      setMessage({ text: res.data.message || 'Password reset! Redirecting...', type: 'success' })
      setTimeout(() => navigate('/login'), 1500)
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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg">
            <LockResetOutlinedIcon fontSize="medium" />
          </div>
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className={`mt-1 text-sm ${textMuted}`}>Create a strong new password</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* New Password */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <LockOutlinedIcon fontSize="small" />
            </span>
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New password"
              autoComplete="new-password"
              required
              className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <LockOutlinedIcon fontSize="small" />
            </span>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
              className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Password match indicator */}
          {formData.newPassword && formData.confirmPassword && (
            <p className={`text-xs font-semibold ${formData.newPassword === formData.confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
              {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 font-semibold text-white shadow-lg shadow-pink-300/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            <LockResetOutlinedIcon fontSize="small" />
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-sm ${textMuted}`}>
            Back to{' '}
            <Link to="/login" className="font-semibold text-pink-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
