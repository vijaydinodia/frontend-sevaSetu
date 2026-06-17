import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'

  // Theme classes
  const cardBg   = isLight ? 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/60'
                           : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const labelCls = isLight ? 'text-zinc-500' : 'text-zinc-400'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:ring-purple-500/20'
    : 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:ring-purple-500/20'
  const iconCls  = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-600' : 'text-zinc-400'

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await axios.post(`${API_URL}/user/login`, formData)
      if (res.data.token) localStorage.setItem('token', res.data.token)
      if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))
      setMessage({ text: res.data.message || 'Login successful', type: 'success' })
      const role = res.data.user?.role
      if (role === 'provider')   navigate('/provider-dashboard')
      else if (role === 'admin') navigate('/admin-dashboard')
      else if (role === 'superAdmin') navigate('/super-admin-dashboard')
      else navigate('/')
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
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className={`mt-1 text-sm ${labelCls}`}>Sign in to your SevaSetu account</p>
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
              className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
              <LockOutlinedIcon fontSize="small" />
            </span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
              required
              className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`}
            />
          </div>

          {/* Forgot */}
          <div className="text-right">
            <Link to="/forget-password" className="text-xs font-semibold text-pink-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 font-semibold text-white shadow-lg shadow-pink-300/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            title={loading ? 'Signing in...' : 'Login'}
          >
            {loading ? <HourglassEmptyOutlinedIcon fontSize="small" /> : <LoginOutlinedIcon fontSize="small" />}
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          {/* Sign up link */}
          <p className={`text-center text-sm ${textMuted}`}>
            New user?{' '}
            <Link to="/signup" className="font-semibold text-pink-500 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
