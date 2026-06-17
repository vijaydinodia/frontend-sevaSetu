import { useState } from 'react'

const UseView = (key, defaultView = 'table') => {
  const [view, setView] = useState(() => {
    try {
      const saved = localStorage.getItem(`view_${key}`)
      return saved || defaultView
    } catch (e) {
      return defaultView
    }
  })

  const toggleView = () => {
    setView((prev) => {
      const next = prev === 'table' ? 'card' : 'table'
      try {
        localStorage.setItem(`view_${key}`, next)
      } catch (e) {
        console.error("LocalStorage write failed:", e)
      }
      return next
    })
  }

  return { view, setView, toggleView }
}

export default UseView
