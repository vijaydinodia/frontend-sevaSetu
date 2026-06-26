import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup } from '../firebase'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loginType, setLoginType] = useState('standard') // 'standard' | 'firebase'
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'

  // Load remembered email on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Theme classes
  const containerBg = isLight ? 'bg-green-50/50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const cardBg   = isLight ? 'bg-white border-zinc-200/80 shadow-xl shadow-green-900/5'
                           : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const labelCls = isLight ? 'text-zinc-550' : 'text-zinc-400'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-600 focus:ring-green-600/10'
    : 'bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-green-500 focus:ring-green-500/10'
  const iconCls  = isLight ? 'text-zinc-400' : 'text-zinc-500'
  const textMuted = isLight ? 'text-zinc-655' : 'text-zinc-400'
  const toggleBg = isLight ? 'bg-zinc-100' : 'bg-zinc-800/80'

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      if (!auth) {
        throw new Error("Firebase Auth is not initialized. Please verify that your VITE_FIREBASE_API_KEY is configured in the environment.")
      }
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      // Store Firebase session separately
      localStorage.setItem('firebaseToken', idToken)
      localStorage.setItem('firebaseUser', JSON.stringify(result.user))

      // Send Firebase token to backend
      const res = await axios.post(`${API_URL}/auth/firebase/google`, { token: idToken })
      if (res.data.token) localStorage.setItem('token', res.data.token)
      if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))

      if (rememberMe && result.user.email) {
        localStorage.setItem('rememberedEmail', result.user.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      if (loginType === 'standard') {
        const res = await axios.post(`${API_URL}/user/login`, formData)
        if (res.data.token) localStorage.setItem('token', res.data.token)
        if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))
        setMessage({ text: res.data.message || 'Login successful', type: 'success' })
        const role = res.data.user?.role
        if (role === 'provider')   navigate('/provider-dashboard')
        else if (role === 'admin') navigate('/admin-dashboard')
        else if (role === 'superAdmin') navigate('/super-admin-dashboard')
        else navigate('/')
      } else {
        // Firebase Auth Login
        if (!auth) {
          throw new Error("Firebase Auth is not initialized. Please verify that your VITE_FIREBASE_API_KEY is configured in the environment.")
        }
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
        const idToken = await userCredential.user.getIdToken()

        // Store Firebase session separately
        localStorage.setItem('firebaseToken', idToken)
        localStorage.setItem('firebaseUser', JSON.stringify(userCredential.user))

        // Send token to backend for JWT syncing
        const res = await axios.post(`${API_URL}/auth/firebase/login`, { token: idToken })
        if (res.data.token) localStorage.setItem('token', res.data.token)
        if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))

        setMessage({ text: res.data.message || 'Login successful', type: 'success' })
        const role = res.data.user?.role
        if (role === 'provider')   navigate('/provider-dashboard')
        else if (role === 'admin') navigate('/admin-dashboard')
        else if (role === 'superAdmin') navigate('/super-admin-dashboard')
        else navigate('/')
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
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className={`mt-1 text-sm ${textMuted}`}>Sign in to your SevaSetu account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Email Address</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
                <EmailOutlinedIcon fontSize="small" />
              </span>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                autoComplete="email"
                required
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-4 ${inputCls}`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Password</label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${iconCls}`}>
                <LockOutlinedIcon fontSize="small" />
              </span>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
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
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-500 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-300 text-green-600 focus:ring-green-500 h-4 w-4 accent-green-600 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forget-password" className="text-green-600 dark:text-green-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold text-white shadow-md shadow-green-600/10 hover:from-green-700 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            title={loading ? 'Signing in...' : 'Login'}
          >
            {loading ? <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="small" /> : <LoginOutlinedIcon fontSize="small" />}
            {loading ? 'Signing in...' : 'Login'}
          </button>

          {/* Message Alert Banner */}
          {message.text && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2.5 animate-slide-fade ${
              message.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-650 dark:bg-red-950/20 dark:border-red-900/50' 
                : 'bg-emerald-50 border-emerald-250 text-emerald-650 dark:bg-emerald-950/20 dark:border-emerald-900/50'
            }`}>
              <span>{message.type === 'error' ? '⚠️' : '✅'}</span>
              <span className="flex-1 text-left">{message.text}</span>
            </div>
          )}

          {/* Continue with Google */}
          <div className="flex items-center my-1">
            <div className={`flex-grow border-t ${isLight ? 'border-zinc-150' : 'border-zinc-800'}`}></div>
            <span className={`mx-4 text-[10px] font-bold uppercase tracking-wider ${labelCls}`}>Or</span>
            <div className={`flex-grow border-t ${isLight ? 'border-zinc-150' : 'border-zinc-800'}`}></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border font-semibold transition cursor-pointer ${
              isLight
                ? 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                : 'border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-850'
            }`}
          >
            <GoogleIcon className="text-red-500" fontSize="small" />
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className={`text-center text-xs ${textMuted} mt-2`}>
            New user?{' '}
            <Link to="/signup" className="font-semibold text-green-600 dark:text-green-500 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
