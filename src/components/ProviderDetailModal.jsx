import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../api'
import { capitalize, capitalizeWords } from '../lib/utils'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined'

const ProviderDetailModal = ({ providerId, onClose }) => {
  const [providerData, setProviderData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!providerId) return
    const fetch = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await axios.get(`${API_URL}/user/provider/${providerId}`)
        if (res.data?.success) {
          setProviderData(res.data.data.provider)
          setReviews(res.data.data.reviews || [])
          setServices(res.data.data.services || [])
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider profile')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [providerId])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const avgRating = providerData?.averageRating ||
    (reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0.0')

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
  }))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <PersonOutlineOutlinedIcon style={{ fontSize: 16 }} /> },
    { id: 'services', label: `Services (${services.length})`, icon: <WorkOutlineOutlinedIcon style={{ fontSize: 16 }} /> },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <RateReviewOutlinedIcon style={{ fontSize: 16 }} /> },
  ]

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
          style={{ background: 'var(--bg-shell)', color: 'var(--text-muted)' }}
          title="Close"
        >
          <CloseOutlinedIcon fontSize="small" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p style={{ color: 'var(--text-muted)' }} className="text-sm font-medium">Loading provider profile…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-red-500 font-bold text-lg">Error</p>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">{error}</p>
          </div>
        ) : providerData && (
          <>
            {/* Hero Banner */}
            <div className="relative h-28 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 shrink-0">
              {/* Avatar */}
              <div className="absolute -bottom-10 left-6">
                {providerData.user?.profileImage ? (
                  <img
                    src={providerData.user.profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover border-4 shadow-lg"
                    style={{ borderColor: 'var(--bg-card)' }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center border-4 shadow-lg"
                    style={{ background: 'var(--bg-shell)', borderColor: 'var(--bg-card)' }}
                  >
                    <PersonOutlineOutlinedIcon className="text-amber-500" style={{ fontSize: 40 }} />
                  </div>
                )}
                {/* Verified badge */}
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2" style={{ borderColor: 'var(--bg-card)' }}>
                  <VerifiedRoundedIcon style={{ fontSize: 12 }} />
                </div>
              </div>
            </div>

            {/* Header info */}
            <div className="px-6 pt-12 pb-4 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold leading-tight">
                    {providerData.businessName
                      ? capitalizeWords(providerData.businessName)
                      : capitalizeWords(`${providerData.user?.firstName || ''} ${providerData.user?.lastName || ''}`)}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium text-amber-500">{capitalizeWords(providerData.category?.name) || 'Provider'}</span>
                    <span className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg font-semibold text-xs">
                      <StarRateRoundedIcon style={{ fontSize: 14 }} />
                      {avgRating}
                      <span style={{ color: 'var(--text-muted)' }} className="font-normal">({reviews.length})</span>
                    </span>
                    <span>{providerData.experience || 0} yrs exp.</span>
                    {providerData.user?.email && (
                      <span className="text-xs">{providerData.user.email}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    providerData.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    providerData.kycStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    KYC: {capitalize(providerData.kycStatus || 'unknown')}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-3 shrink-0" style={{ borderBottom: '1px solid var(--border-color)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-xl transition-colors"
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-shell)' : 'transparent',
                    color: activeTab === tab.id ? '#f59e0b' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* ── OVERVIEW TAB ── */}
              {activeTab === 'overview' && (
                <div className="space-y-5">
                  {/* About */}
                  <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                    <h3 className="font-bold text-sm mb-2 text-amber-500 uppercase tracking-wide">About</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {providerData.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Rating', value: `${avgRating} ★`, color: 'text-amber-500' },
                      { label: 'Reviews', value: reviews.length, color: 'text-indigo-500' },
                      { label: 'Services', value: services.length, color: 'text-emerald-500' },
                      { label: 'Experience', value: `${providerData.experience || 0} yrs`, color: 'text-pink-500' },
                    ].map(stat => (
                      <div key={stat.label} className="p-3 rounded-2xl text-center" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                        <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Service Areas */}
                  {providerData.serviceAreas && (
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <LocationOnOutlinedIcon className="text-amber-500" style={{ fontSize: 16 }} />
                        <h3 className="font-bold text-sm text-amber-500 uppercase tracking-wide">Service Areas</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(providerData.serviceAreas) ? providerData.serviceAreas : providerData.serviceAreas.split(','))
                          .map((area, idx) => (
                            <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                              {capitalizeWords(area.trim())}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {providerData.skills?.length > 0 && (
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                      <h3 className="font-bold text-sm mb-3 text-amber-500 uppercase tracking-wide">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {providerData.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600">
                            {capitalizeWords(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── SERVICES TAB ── */}
              {activeTab === 'services' && (
                <div>
                  {services.length === 0 ? (
                    <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                      <WorkOutlineOutlinedIcon style={{ fontSize: 48, opacity: 0.3 }} />
                      <p className="mt-3 font-semibold">No services listed yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {services.map(ps => (
                        <div key={ps._id} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                          {ps.service?.image && (
                            <div className="h-36 overflow-hidden">
                              <img src={ps.service.image} alt={ps.service.serviceName} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-bold text-sm mb-1">{capitalizeWords(ps.service?.serviceName)}</h4>
                            <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{capitalize(ps.service?.description)}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600">
                                {capitalizeWords(ps.service?.category?.name) || 'Service'}
                              </span>
                              <span className="text-lg font-black text-amber-500">₹{ps.price || ps.service?.basePrice}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── REVIEWS TAB ── */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                      <StarRateRoundedIcon style={{ fontSize: 48, opacity: 0.3 }} />
                      <p className="mt-3 font-semibold">No reviews yet</p>
                    </div>
                  ) : (
                    <>
                      {/* Rating summary */}
                      <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-5xl font-black text-amber-500">{avgRating}</span>
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1,2,3,4,5].map(s => (
                                <StarRateRoundedIcon
                                  key={s}
                                  style={{ fontSize: 16 }}
                                  className={parseFloat(avgRating) >= s ? 'text-amber-500' : 'text-zinc-300'}
                                />
                              ))}
                            </div>
                            <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--text-muted)' }}>{reviews.length} reviews</p>
                          </div>
                          <div className="flex-1 w-full space-y-1.5">
                            {starCounts.map(({ star, count, pct }) => (
                              <div key={star} className="flex items-center gap-3">
                                <div className="flex items-center gap-0.5 shrink-0 w-12 justify-end">
                                  <span className="text-xs font-bold">{star}</span>
                                  <StarRateRoundedIcon className="text-amber-500" style={{ fontSize: 13 }} />
                                </div>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold shrink-0 w-6" style={{ color: 'var(--text-muted)' }}>{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Individual reviews */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        {reviews.map(review => (
                          <div key={review._id} className="p-4 rounded-2xl flex flex-col gap-3" style={{ background: 'var(--bg-shell)', border: '1px solid var(--border-color)' }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                {review.customer?.profileImage ? (
                                  <img src={review.customer.profileImage} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-amber-500/20" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {review.customer?.firstName?.[0]?.toUpperCase() || 'U'}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-sm leading-tight">
                                    {capitalizeWords(`${review.customer?.firstName || ''} ${review.customer?.lastName || ''}`).trim() || 'Anonymous'}
                                  </p>
                                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-xl shrink-0">
                                <StarRateRoundedIcon className="text-amber-500" style={{ fontSize: 13 }} />
                                <span className="text-xs font-bold text-amber-600">{review.rating}</span>
                              </div>
                            </div>
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(s => (
                                <StarRateRoundedIcon key={s} style={{ fontSize: 14 }} className={review.rating >= s ? 'text-amber-500' : 'text-zinc-300'} />
                              ))}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                              {review.review ? `"${capitalize(review.review)}"` : <span className="italic opacity-60">No written feedback.</span>}
                            </p>
                            <div className="flex items-center gap-1 mt-auto">
                              <VerifiedRoundedIcon className="text-green-500" style={{ fontSize: 13 }} />
                              <span className="text-[11px] font-semibold text-green-600">Verified Booking</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProviderDetailModal
