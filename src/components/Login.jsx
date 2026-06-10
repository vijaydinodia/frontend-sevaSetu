import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import API_URL from '../api'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await axios.post(`${API_URL}/user/login`, formData)

      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }

      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
      }

      setMessage(res.data.message || 'Login successful')

      if (res.data.user?.role === 'provider') {
        navigate('/provider-dashboard')
      } else if (res.data.user?.role === 'admin') {
        navigate('/admin-dashboard')
      } else if (res.data.user?.role === 'superAdmin') {
        navigate('/super-admin-dashboard')
      } else {
        navigate('/user-dashboard')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f8ebe6] px-5 py-10">
      <Card className="w-full max-w-md p-7">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Link to="/" className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
            S
          </Link>
          <h1 className="text-center text-4xl font-semibold text-black">Login</h1>

          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="email"
            required
          />

          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <Button type="submit" variant="gradient" className="h-12" disabled={loading}>
            <LoginOutlinedIcon fontSize="small" />
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          {message && <p className="text-center text-sm font-semibold text-zinc-700">{message}</p>}

          <p className="text-center text-sm text-zinc-700">
            <Link to="/forget-password" className="font-semibold text-pink-500">Forgot password?</Link>
          </p>

          <p className="text-center text-sm text-zinc-700">
            New user? <Link to="/signup" className="font-semibold text-pink-500">Create an account</Link>
          </p>
        </form>
      </Card>
    </section>
  )
}

export default Login
