import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// UseFetch - custom hook for all API calls
// url      - full API URL
// options  - { method, body, autoFetch }
//   method    - 'GET' | 'POST' | 'PUT' | 'DELETE'  (default: 'GET')
//   body      - request body data (for POST/PUT)
//   autoFetch - if false, don't fetch on mount (default: true)

const UseFetch = (url, options = {}) => {
  const { method = 'GET', body = null, autoFetch = true } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // get token from localStorage
  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  // main fetch function - can be called manually too
  const fetchData = useCallback(async (overrideBody = null) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axios({
        url,
        method,
        data: overrideBody || body,
        headers: getHeaders(),
      })

      setData(res.data)
      return res.data
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message
      setError(errMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [url, method, body])

  // auto fetch on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [url])

  // refetch - call this to manually trigger a fresh fetch
  const refetch = () => fetchData()

  // execute - call this with a body for POST/PUT/DELETE manually
  const execute = (bodyData) => fetchData(bodyData)

  return { data, loading, error, refetch, execute }
}

export default UseFetch