import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Country, State, City } from 'country-state-city'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    address: { country: '', state: '', city: '', pincode: '', fullAddress: '' },
  })
  const [locationCode, setLocationCode] = useState({ countryCode: '', stateCode: '' })
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
  const labelCls  = isLight ? 'text-zinc-500' : 'text-zinc-400'
  const textMuted = isLight ? 'text-zinc-600' : 'text-zinc-400'
  const divider   = isLight ? 'border-zinc-100' : 'border-zinc-800'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await axios.post(`${API_URL}/user/signup`, formData)
      setMessage({ text: res.data.message || 'Account created! Please log in.', type: 'success' })
      setTimeout(() => navigate('/login'), 1500)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // Shared field class
  const field = `w-full rounded-2xl border py-3 px-4 text-sm outline-none ring-0 transition focus:ring-4 ${inputCls}`

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12">
      <div className={`w-full max-w-2xl rounded-[28px] border p-8 transition-colors duration-200 ${cardBg}`}>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg">
            <PersonAddOutlinedIcon fontSize="medium" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className={`mt-1 text-sm ${labelCls}`}>Join SevaSetu as a customer today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Personal Info */}
          <div>
            <p className={`mb-3 text-xs font-bold uppercase tracking-wider ${labelCls}`}>Personal Details</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required className={field} />
              <input name="lastName"  value={formData.lastName}  onChange={handleChange} placeholder="Last name"  className={field} />
              <input name="email"  type="email"    value={formData.email}  onChange={handleChange} placeholder="Email address" required className={field} />
              <input name="phone"  value={formData.phone}  onChange={handleChange} placeholder="Phone number"   required className={field} />
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required className={`${field} sm:col-span-2`} />
            </div>
          </div>

          <div className={`border-t ${divider}`} />

          {/* Location */}
          <div>
            <p className={`mb-3 text-xs font-bold uppercase tracking-wider ${labelCls}`}>Address</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select value={locationCode.countryCode} onChange={handleCountryChange} required className={field}>
                <option value="">Select country</option>
                {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
              </select>
              <select value={locationCode.stateCode} onChange={handleStateChange} disabled={!locationCode.countryCode} required className={field}>
                <option value="">Select state</option>
                {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
              </select>
              <select value={formData.address.city} onChange={handleCityChange} disabled={!locationCode.stateCode} required className={field}>
                <option value="">Select city</option>
                {cities.map((c) => <option key={`${c.name}-${c.latitude}`} value={c.name}>{c.name}</option>)}
              </select>
              <input name="pincode" value={formData.address.pincode} onChange={handleChange} placeholder="Pincode" className={field} />
              <textarea name="fullAddress" value={formData.address.fullAddress} onChange={handleChange} placeholder="Full address (optional)" rows={2} className={`${field} sm:col-span-2 resize-none`} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 font-semibold text-white shadow-lg shadow-pink-300/30 transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <PersonAddOutlinedIcon fontSize="small" />
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          {/* Message */}
          {message.text && (
            <p className={`text-center text-sm font-semibold ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
              {message.text}
            </p>
          )}

          <p className={`text-center text-sm ${textMuted}`}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-pink-500 hover:underline">Login</Link>
          </p>
          <p className={`text-center text-sm ${textMuted}`}>
            Want to offer services?{' '}
            <Link to="/become-provider" className="font-semibold text-purple-500 hover:underline">Become a Provider →</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
