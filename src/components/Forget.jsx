import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'
import { auth, sendPasswordResetEmail } from '../firebase'


const Forget = () => {
  const [email, setEmail] = useState('')
  const [resetType, setResetType] = useState('standard') // 'standard' | 'firebase'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'
  const containerBg = isLight ? 'bg-green-50/50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const cardBg   = isLight ? 'bg-white border-zinc-200/80 shadow-xl shadow-green-900/5'
                           : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-600 focus:ring-green-600/10'
    : 'bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-green-500 focus:ring-green-500/10'
  const iconCls   = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-550' : 'text-zinc-400'
  const toggleBg  = isLight ? 'bg-zinc-100' : 'bg-zinc-800/80'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const normalizedEmail = email.trim().toLowerCase()
      if (resetType === 'standard') {
        const res = await axios.post(`${API_URL}/user/forgetPassword`, { email: normalizedEmail })
        localStorage.setItem('resetEmail', normalizedEmail)
        setMessage({ text: res.data.message || 'OTP sent to your email', type: 'success' })
        setTimeout(() => navigate('/verify-otp'), 1200)
      } else {
        // Firebase Password Reset Link
        if (!auth) {
          throw new Error("Firebase Auth is not initialized. Please verify that your VITE_FIREBASE_API_KEY is configured in the environment.")
        }
        await sendPasswordResetEmail(auth, normalizedEmail)
        setMessage({ text: 'Firebase password reset email has been sent successfully!', type: 'success' })
      }
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
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16A34A] to-emerald-500 text-white text-xl font-bold shadow-md shadow-green-600/10">
            S
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Forgot Password</h1>
          <p className={`mt-1 text-sm ${textMuted}`}>
            {resetType === 'standard' ? 'Enter your email and we\'ll send an OTP' : 'Enter your email and we\'ll send a reset link'}
          </p>
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
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold text-white shadow-md shadow-green-600/10 hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="small" /> : <SendOutlinedIcon fontSize="small" />}
            {loading ? 'Sending...' : resetType === 'standard' ? 'Send OTP' : 'Send Reset Link'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-xs font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-xs ${textMuted} mt-2`}>
            Remembered it?{' '}
            <Link to="/login" className="font-semibold text-green-600 dark:text-green-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Forget
