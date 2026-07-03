import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import API_URL from '../api'
import useTheme from '../custom_hook/UseTheme'

const GitHubCallback = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()
  const { theme } = useTheme()

  const isLight = theme === 'light'

  useEffect(() => {
    const code = searchParams.get('code')

    if (!code) {
      setStatus('error')
      setErrorMsg('No authorization code received from GitHub. Please try again.')
      return
    }

    const exchangeCode = async () => {
      try {
        const res = await axios.post(`${API_URL}/auth/github/callback`, { code })

        if (res.data.token) localStorage.setItem('token', res.data.token)
        if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user))

        // Redirect based on role
        const role = res.data.user?.role
        if (role === 'provider') navigate('/provider-dashboard', { replace: true })
        else if (role === 'admin') navigate('/admin-dashboard', { replace: true })
        else if (role === 'superAdmin') navigate('/super-admin-dashboard', { replace: true })
        else navigate('/', { replace: true })
      } catch (error) {
        setStatus('error')
        setErrorMsg(
          error.response?.data?.message ||
          error.message ||
          'GitHub authentication failed. Please try again.'
        )
      }
    }

    exchangeCode()
  }, [searchParams, navigate])

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-5 transition-colors duration-200 ${
        isLight ? 'bg-green-50/50 text-zinc-900' : 'bg-zinc-950 text-zinc-100'
      }`}
    >
      <div
        className={`w-full max-w-sm rounded-xl border p-8 text-center shadow-xl animate-slide-fade ${
          isLight
            ? 'bg-white border-zinc-200/80 shadow-green-900/5'
            : 'bg-zinc-900 border-zinc-800 shadow-black/40'
        }`}
      >
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#24292e] to-[#40464d] text-white shadow-md">
              <HourglassEmptyOutlinedIcon className="animate-spin" fontSize="medium" />
            </div>
            <h2 className="text-xl font-bold mb-2">Authenticating with GitHub</h2>
            <p className={`text-sm ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Please wait while we verify your account...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md">
              <ErrorOutlineOutlinedIcon fontSize="medium" />
            </div>
            <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
            <p
              className={`text-sm mb-5 ${
                isLight ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              {errorMsg}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 font-semibold text-white shadow-md shadow-green-600/10 hover:from-green-700 hover:to-green-600 transition cursor-pointer"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default GitHubCallback
