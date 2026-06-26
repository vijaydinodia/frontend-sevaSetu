import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <div className={`flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12 transition-colors duration-200 ${containerBg}`}>
      <div className={`w-full max-w-md rounded-xl border p-8 shadow-xl animate-slide-fade ${cardBg}`}>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16A34A] to-emerald-500 text-white shadow-md shadow-green-600/10">
            <LockResetOutlinedIcon fontSize="medium" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Reset Password</h1>
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
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New password"
              autoComplete="new-password"
              required
              className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition focus:ring-4 ${inputCls}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition text-zinc-400 hover:text-green-600 dark:hover:text-green-500`}
            >
              {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <LockOutlinedIcon fontSize="small" />
            </span>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              autoComplete="new-password"
              required
              className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm outline-none transition focus:ring-4 ${inputCls}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition text-zinc-400 hover:text-green-600 dark:hover:text-green-500`}
            >
              {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
            </button>
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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold text-white shadow-md shadow-green-600/10 hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="small" /> : <LockResetOutlinedIcon fontSize="small" />}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-xs font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-xs ${textMuted}`}>
            Back to{' '}
            <Link to="/login" className="font-semibold text-green-600 dark:text-green-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
