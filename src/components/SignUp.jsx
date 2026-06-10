import React, { useMemo, useState } from 'react'
import axios from 'axios'
import { Country, State, City } from 'country-state-city'
import API_URL from '../api'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: {
      country: '',
      state: '',
      city: '',
      pincode: '',
      fullAddress: '',
    },
  })
  const [locationCode, setLocationCode] = useState({
    countryCode: '',
    stateCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const countries = useMemo(() => Country.getAllCountries(), [])
  const states = useMemo(() => {
    if (!locationCode.countryCode) return []
    return State.getStatesOfCountry(locationCode.countryCode)
  }, [locationCode.countryCode])
  const cities = useMemo(() => {
    if (!locationCode.countryCode || !locationCode.stateCode) return []
    return City.getCitiesOfState(locationCode.countryCode, locationCode.stateCode)
  }, [locationCode.countryCode, locationCode.stateCode])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name in formData.address) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value,
        },
      })
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const selectedCountry = countries.find((country) => country.isoCode === countryCode)

    setLocationCode({
      countryCode,
      stateCode: '',
    })
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        country: selectedCountry?.name || '',
        state: '',
        city: '',
      },
    })
  }

  const handleStateChange = (e) => {
    const stateCode = e.target.value
    const selectedState = states.find((state) => state.isoCode === stateCode)

    setLocationCode({
      ...locationCode,
      stateCode,
    })
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        state: selectedState?.name || '',
        city: '',
      },
    })
  }

  const handleCityChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        city: e.target.value,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await axios.post(`${API_URL}/user/signup`, formData);
      setMessage(res.data.message || 'Signup successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Create Account</h1>

        <div className="form-grid">
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <input name="pincode" value={formData.address.pincode} onChange={handleChange} placeholder="Pincode" />

          <select value={locationCode.countryCode} onChange={handleCountryChange} required>
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>

          <select value={locationCode.stateCode} onChange={handleStateChange} disabled={!locationCode.countryCode} required>
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>

          <select value={formData.address.city} onChange={handleCityChange} disabled={!locationCode.stateCode} required>
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={`${city.name}-${city.latitude}-${city.longitude}`} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="fullAddress"
          value={formData.address.fullAddress}
          onChange={handleChange}
          placeholder="Full address"
          rows="3"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  )
}

export default SignUp
