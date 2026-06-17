import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api'
import Navbar from './Navbar'
import Footer from './Footer'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import { capitalize, capitalizeWords } from '../lib/utils'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'

const CategoryProviders = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  
  const [category, setCategory] = useState(null)
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  // Dynamic CSS classes for dark theme compliance
  const bgTheme = theme === 'light' ? 'bg-[#f8ebe6] text-zinc-900' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-100'

  useEffect(() => {
    window.scrollTo(0, 0)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch categories to get current category details
        const catRes = await axios.get(`${API_URL}/user/categories`)
        const allCategories = catRes.data?.data || []
        const currentCategory = allCategories.find(c => c._id === categoryId)
        setCategory(currentCategory)

        // Fetch services to extract unique providers offering services in this category
        const srvRes = await axios.get(`${API_URL}/user/services`)
        const allServices = srvRes.data?.data || []
        
        const categoryServices = allServices.filter(
          ps => ps.service?.category?._id === categoryId || ps.service?.category === categoryId
        )

        // Extract unique providers
        const uniqueProvidersMap = new Map()
        categoryServices.forEach(ps => {
          if (ps.provider && ps.provider._id) {
            if (!uniqueProvidersMap.has(ps.provider._id)) {
              uniqueProvidersMap.set(ps.provider._id, ps.provider)
            }
          }
        })

        setProviders(Array.from(uniqueProvidersMap.values()))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-200 ${bgTheme}`}>
      <Navbar user={user} onLogout={handleLogout} />

      <section className="flex-1 px-5 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <button 
            onClick={() => navigate('/')}
            className={`mb-8 flex items-center gap-2 text-sm font-semibold transition hover:text-amber-500 ${textMuted}`}
          >
            <ArrowBackOutlinedIcon fontSize="small" /> Back to Home
          </button>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  Providers for <span className="text-amber-500">{capitalizeWords(category?.name) || 'This Category'}</span>
                </h1>
                <p className={`max-w-xl mx-auto ${textMuted}`}>
                  {capitalize(category?.description) || 'Find the best professionals available for this service.'}
                </p>
              </div>

              {providers.length === 0 ? (
                <div className={`text-center py-20 rounded-3xl border ${cardTheme}`}>
                  <p className={`text-lg font-semibold ${textMuted}`}>No providers found for this category.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {providers.map(provider => (
                    <Link to={`/provider/${provider._id}`} key={provider._id}>
                      <Card className={`group flex flex-col h-full overflow-hidden border p-0 hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 ${cardTheme}`}>
                        <div className="h-32 bg-gradient-to-br from-amber-500/20 to-pink-500/20 flex items-center justify-center">
                          {provider.user?.profileImage ? (
                            <img 
                              src={provider.user.profileImage} 
                              alt="Profile" 
                              className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-md transform group-hover:scale-110 transition duration-300" 
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-md transform group-hover:scale-110 transition duration-300">
                              <PersonOutlineOutlinedIcon className="text-amber-500" fontSize="large" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5 flex-1 flex flex-col text-center">
                          <h3 className="text-xl font-bold mb-1">
                            {provider.businessName ? capitalizeWords(provider.businessName) : capitalizeWords(`${provider.user?.firstName} ${provider.user?.lastName}`)}
                          </h3>
                          
                          <div className="flex items-center justify-center gap-1 text-amber-500 mb-3">
                            <span className="text-sm font-bold">{provider.averageRating || '0.0'}</span>
                            <span className="text-xs text-amber-500/70">★</span>
                          </div>

                          <div className={`mt-auto text-xs font-semibold ${textMuted} bg-black/5 dark:bg-white/5 py-2 px-3 rounded-xl inline-block mx-auto`}>
                            {provider.experience || 0} Years Experience
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CategoryProviders
