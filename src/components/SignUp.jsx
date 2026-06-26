import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Country, State, City } from 'country-state-city'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import GoogleIcon from '@mui/icons-material/Google'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'
import { auth, googleProvider, createUserWithEmailAndPassword, signInWithPopup } from '../firebase'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
    address: { country: '', state: '', city: '', pincode: '', fullAddress: '' },
  })
  const [signUpType, setSignUpType] = useState('standard') // 'standard' | 'firebase'
  const [currentStep, setCurrentStep] = useState(1)
  const [locationCode, setLocationCode] = useState({ countryCode: '', stateCode: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'
  const containerBg = isLight ? 'bg-green-50/50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const cardBg      = isLight ? 'bg-white border-zinc-200/80 shadow-xl shadow-green-900/5' : 'bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40'
  const inputCls = isLight
    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-green-600 focus:ring-green-600/10'
    : 'bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-green-500 focus:ring-green-500/10'
  const textTitle   = isLight ? 'text-zinc-850' : 'text-white'
  const labelCls    = isLight ? 'text-zinc-500' : 'text-zinc-400'
  const textMuted   = isLight ? 'text-zinc-550' : 'text-zinc-400'
  const divider     = isLight ? 'border-zinc-150' : 'border-zinc-800'
  const toggleBg    = isLight ? 'bg-zinc-100' : 'bg-zinc-800/80'


  const countries = useMemo(() => Country.getAllCountries(), [])
  const states    = useMemo(() => locationCode.countryCode ? State.getStatesOfCountry(locationCode.countryCode) : [], [locationCode.countryCode])
  const cities    = useMemo(() => (locationCode.countryCode && locationCode.stateCode) ? City.getCitiesOfState(locationCode.countryCode, locationCode.stateCode) : [], [locationCode.countryCode, locationCode.stateCode])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name in formData.address) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const selected = countries.find((c) => c.isoCode === countryCode)
    setLocationCode({ countryCode, stateCode: '' })
    setFormData({ ...formData, address: { ...formData.address, country: selected?.name || '', state: '', city: '' } })
  }

  const handleStateChange = (e) => {
    const stateCode = e.target.value
    const selected  = states.find((s) => s.isoCode === stateCode)
    setLocationCode({ ...locationCode, stateCode })
    setFormData({ ...formData, address: { ...formData.address, state: selected?.name || '', city: '' } })
  }

  const handleCityChange = (e) => {
    setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
  }

  const handleGoogleSignUp = async () => {
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

      // Google signup automatically creates or logs in the user on the backend
      const res = await axios.post(`${API_URL}/auth/firebase/google`, {
        token: idToken,
        role: 'user', // Default customer role
        address: formData.address,
        phone: formData.phone || undefined,
      })

      if (res.data.token) localStorage.setItem('token', res.data.token)
      if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))

      setMessage({ text: res.data.message || 'Registration successful', type: 'success' })
      setTimeout(() => navigate('/'), 1200)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      setMessage({ text: 'First name is required.', type: 'error' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ text: 'Email address is required.', type: 'error' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return false;
    }
    if (signUpType === 'standard' && !formData.phone.trim()) {
      setMessage({ text: 'Phone number is required for standard signup.', type: 'error' });
      return false;
    }
    if (!formData.password) {
      setMessage({ text: 'Password is required.', type: 'error' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters.', type: 'error' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return false;
    }
    setMessage({ text: '', type: '' });
    return true;
  }

  const validateStep2 = () => {
    if (!formData.address.country) {
      setMessage({ text: 'Country is required.', type: 'error' });
      return false;
    }
    if (!formData.address.state) {
      setMessage({ text: 'State is required.', type: 'error' });
      return false;
    }
    if (!formData.address.city) {
      setMessage({ text: 'City is required.', type: 'error' });
      return false;
    }
    setMessage({ text: '', type: '' });
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep1() || !validateStep2()) {
      return;
    }
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      if (signUpType === 'standard') {
        const res = await axios.post(`${API_URL}/user/signup`, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
        })
        setMessage({ text: res.data.message || 'Account created! Please log in.', type: 'success' })
        setTimeout(() => navigate('/login'), 1500)
      } else {
        // Firebase Signup
        if (!auth) {
          throw new Error("Firebase Auth is not initialized. Please verify that your VITE_FIREBASE_API_KEY is configured in the environment.")
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        const idToken = await userCredential.user.getIdToken()

        // Store Firebase session separately
        localStorage.setItem('firebaseToken', idToken)
        localStorage.setItem('firebaseUser', JSON.stringify(userCredential.user))

        // Call backend to sync MongoDB
        const res = await axios.post(`${API_URL}/auth/firebase/signup`, {
          token: idToken,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          role: 'user'
        })

        if (res.data.token) localStorage.setItem('token', res.data.token)
        if (res.data.user)  localStorage.setItem('user', JSON.stringify(res.data.user))

        setMessage({ text: res.data.message || 'Account created successfully!', type: 'success' })
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Shared field class
  const field = `w-full h-11 px-4 rounded-xl border text-sm outline-none transition focus:ring-4 ${inputCls}`
  const textareaField = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-4 resize-none ${inputCls}`

  return (
    <div className={`min-h-[calc(100vh-72px)] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${containerBg}`}>
      <div className="max-w-lg mx-auto">
        
        {/* Header Block */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#16A34A] to-emerald-500 text-white shadow-md shadow-green-600/10 animate-slide-fade">
            <PersonAddOutlinedIcon fontSize="medium" />
          </div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${textTitle} animate-slide-fade`}>Create Your Account</h1>
          <p className={`mt-1 text-sm ${textMuted} animate-slide-fade`}>Join SevaSetu to access premium local services</p>
        </div>

        {/* Step Indicator Header */}
        <div className="mb-8 max-w-md mx-auto animate-slide-fade">
          {/* Step Text Progress Indicator */}
          <div className="text-center mb-4">
            <span className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3.5 py-1.5 rounded-full border border-green-100 dark:border-green-900/50">
              Step {currentStep} of 3: {currentStep === 1 ? 'Personal Details' : currentStep === 2 ? 'Address Details' : 'Review & Submit'}
            </span>
          </div>

          <div className="flex items-center justify-between relative">
            {/* Background progress bar line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full z-0"></div>
            
            {/* Active progress bar line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-600 rounded-full transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {/* Step 1 Button */}
            <div className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                disabled={currentStep === 1}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                  currentStep >= 1
                    ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-250 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                }`}
              >
                <LockOutlinedIcon style={{ fontSize: '16px' }} />
              </button>
              <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${currentStep === 1 ? 'text-green-600 dark:text-green-500 font-extrabold' : 'text-zinc-500'}`}>
                Setup
              </span>
            </div>

            {/* Step 2 Button */}
            <div className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => {
                  if (currentStep > 2) setCurrentStep(2);
                  else if (currentStep === 1 && validateStep1()) setCurrentStep(2);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                  currentStep >= 2
                    ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-250 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                }`}
              >
                <HomeOutlinedIcon style={{ fontSize: '16px' }} />
              </button>
              <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${currentStep === 2 ? 'text-green-600 dark:text-green-500 font-extrabold' : 'text-zinc-500'}`}>
                Address
              </span>
            </div>

            {/* Step 3 Button */}
            <div className="flex flex-col items-center z-10">
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && validateStep2()) setCurrentStep(3);
                }}
                disabled={currentStep < 3}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                  currentStep >= 3
                    ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20'
                    : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-250 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                }`}
              >
                <CheckCircleOutlinedIcon style={{ fontSize: '16px' }} />
              </button>
              <span className={`text-[10px] font-bold mt-1.5 uppercase tracking-wider ${currentStep === 3 ? 'text-green-600 dark:text-green-500 font-extrabold' : 'text-zinc-500'}`}>
                Review
              </span>
            </div>

          </div>
        </div>

        {/* Wizard Form Wrapper */}
        <form onSubmit={handleSubmit} className={`border rounded-xl p-6 sm:p-8 shadow-xl ${cardBg}`}>
          
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4 animate-slide-fade">
              <div className="mb-2">
                <h3 className={`text-lg font-bold ${textTitle}`}>Personal Details</h3>
                <p className={`text-xs ${textMuted}`}>Create your login credentials and profile</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className={field} />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={field} />
                </div>
              </div>

              <div>
                <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required className={field} />
              </div>

              <div>
                <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required={signUpType === 'standard'} className={field} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className={field}
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
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Confirm Password</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className={field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition text-zinc-400 hover:text-green-600 dark:hover:text-green-500`}
                    >
                      {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                    </button>
                  </div>
                </div>
              </div>

              {message.text && message.type === 'error' && (
                <div className="p-3 text-xs font-semibold text-red-650 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
                  {message.text}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) {
                    setCurrentStep(2);
                  }
                }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-semibold text-white transition shadow-md shadow-green-600/15 cursor-pointer mt-2"
              >
                Next
                <ArrowForwardOutlinedIcon style={{ fontSize: '16px' }} />
              </button>

              <div className="flex items-center my-2">
                <div className={`flex-grow border-t ${divider}`}></div>
                <span className={`mx-4 text-[10px] font-bold uppercase tracking-wider ${labelCls}`}>Or Sign in with</span>
                <div className={`flex-grow border-t ${divider}`}></div>
              </div>

              <div className="flex justify-center mt-1">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition hover:scale-105 cursor-pointer shadow-sm ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800'
                  }`}
                  title="Sign up with Google"
                >
                  <GoogleIcon className="text-red-500" fontSize="medium" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Address Details */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4 animate-slide-fade">
              <div className="mb-2">
                <h3 className={`text-lg font-bold ${textTitle}`}>Address Details</h3>
                <p className={`text-xs ${textMuted}`}>Tell us where you would like services delivered</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Country</label>
                  <select value={locationCode.countryCode} onChange={handleCountryChange} required className={field}>
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>State</label>
                  <select value={locationCode.stateCode} onChange={handleStateChange} disabled={!locationCode.countryCode} required className={field}>
                    <option value="">Select state</option>
                    {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>City</label>
                  <select value={formData.address.city} onChange={handleCityChange} disabled={!locationCode.stateCode} required className={field}>
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={`${c.name}-${c.latitude}`} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Pincode</label>
                  <input name="pincode" value={formData.address.pincode} onChange={handleChange} placeholder="123456" className={field} />
                </div>
              </div>

              <div>
                <label className={`text-xs font-semibold ${labelCls} mb-1 block`}>Full Address</label>
                <textarea name="fullAddress" value={formData.address.fullAddress} onChange={handleChange} placeholder="Street, block, apartment number..." rows={3} className={textareaField} />
              </div>

              {message.text && message.type === 'error' && (
                <div className="p-3 text-xs font-semibold text-red-650 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
                  {message.text}
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border font-semibold transition cursor-pointer ${
                    isLight ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <ArrowBackOutlinedIcon style={{ fontSize: '16px' }} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) {
                      setCurrentStep(3);
                    }
                  }}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 font-semibold text-white transition shadow-md shadow-green-600/15 cursor-pointer"
                >
                  Next
                  <ArrowForwardOutlinedIcon style={{ fontSize: '16px' }} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review Details & Submit */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5 animate-slide-fade">
              <div className="mb-2">
                <h3 className={`text-lg font-bold ${textTitle}`}>Review Details</h3>
                <p className={`text-xs ${textMuted}`}>Confirm your info before completing signup</p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Account Details Details Grid */}
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-850/50 border-zinc-800'}`}>
                  <div className="flex items-center justify-between mb-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-500">Account Details</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs flex items-center gap-1 font-semibold text-green-600 hover:text-green-700 cursor-pointer"
                    >
                      <EditOutlinedIcon style={{ fontSize: '12px' }} />
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">First Name</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.firstName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Last Name</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.lastName || '—'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Email Address</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200 break-all">{formData.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Phone Number</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Signup Type</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200 capitalize">{signUpType}</span>
                    </div>
                  </div>
                </div>

                {/* Address Details Grid */}
                <div className={`p-4 rounded-xl border ${isLight ? 'bg-zinc-50 border-zinc-150' : 'bg-zinc-850/50 border-zinc-800'}`}>
                  <div className="flex items-center justify-between mb-2.5 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-500">Address Details</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs flex items-center gap-1 font-semibold text-green-600 hover:text-green-700 cursor-pointer"
                    >
                      <EditOutlinedIcon style={{ fontSize: '12px' }} />
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Country</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.address.country}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">State</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.address.state}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">City</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.address.city}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Pincode</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.address.pincode || '—'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">Full Address</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-200">{formData.address.fullAddress || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {message.text && (
                <div className={`p-3 rounded-xl text-center text-xs font-semibold border ${
                  message.type === 'error' 
                    ? 'bg-red-50 border-red-200 text-red-650 dark:bg-red-950/20 dark:border-red-900/50' 
                    : 'bg-emerald-50 border-emerald-250 text-emerald-650 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setCurrentStep(2)}
                  className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border font-semibold transition cursor-pointer ${
                    isLight ? 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <ArrowBackOutlinedIcon style={{ fontSize: '16px' }} />
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#16A34A] to-[#22C55E] font-semibold text-white shadow-lg shadow-green-600/10 hover:from-[#15803D] hover:to-[#16A34A] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="small" /> : <PersonAddOutlinedIcon fontSize="small" />}
                  {loading ? 'Submitting...' : 'Sign Up'}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4 border-t border-zinc-150 dark:border-zinc-800/80 pt-4">
            <p className={`text-center text-xs ${textMuted}`}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-green-600 dark:text-green-500 hover:underline">Login</Link>
            </p>
            <p className={`text-center text-xs ${textMuted}`}>
              Want to offer services?{' '}
              <Link to="/become-provider" className="font-semibold text-emerald-600 dark:text-emerald-500 hover:underline">Become a Provider →</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
