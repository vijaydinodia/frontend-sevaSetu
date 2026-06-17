import React, { useMemo, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Country, State, City } from 'country-state-city'
import API_URL from '../api'

/* ── tiny icon SVGs ─────────────────────────────────── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const BecomeProvider = () => {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const [showForm, setShowForm] = useState(false)

  // State for form data — no password field (auto-generated via UUID on approval)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    experience: '',
    skills: '',
    serviceAreas: '',
    description: '',
    category: '',
    selfPhoto: '',
    aadharFront: '',
    aadharBack: '',
    panCard: '',
    address: {
      country: '',
      state: '',
      city: '',
      pincode: '',
      fullAddress: '',
    },
  })

  const [locationCode, setLocationCode] = useState({ countryCode: '', stateCode: '' })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [uploadsLoading, setUploadsLoading] = useState({
    selfPhoto: false, aadharFront: false, aadharBack: false, panCard: false,
  })
  const [activeStep, setActiveStep] = useState(0)

  const selfPhotoRef = useRef(null)
  const aadharFrontRef = useRef(null)
  const aadharBackRef = useRef(null)
  const panCardRef = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/categories`)
        if (res.data?.success) setCategories(res.data.data || [])
      } catch (err) { console.error('Error fetching categories:', err) }
    }
    fetchCategories()
  }, [])

  // Scroll to form when revealed
  useEffect(() => {
    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [showForm])

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
      setFormData({ ...formData, address: { ...formData.address, [name]: value } })
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const selectedCountry = countries.find(c => c.isoCode === countryCode)
    setLocationCode({ countryCode, stateCode: '' })
    setFormData({ ...formData, address: { ...formData.address, country: selectedCountry?.name || '', state: '', city: '' } })
  }

  const handleStateChange = (e) => {
    const stateCode = e.target.value
    const selectedState = states.find(s => s.isoCode === stateCode)
    setLocationCode({ ...locationCode, stateCode })
    setFormData({ ...formData, address: { ...formData.address, state: selectedState?.name || '', city: '' } })
  }

  const handleCityChange = (e) => {
    setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
  }

  const handleDocumentUpload = async (e, fieldKey) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadsLoading(prev => ({ ...prev, [fieldKey]: true }))
    try {
      const imageData = new FormData()
      imageData.append('image', file)
      const res = await axios.post(`${API_URL}/user/upload-public`, imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data?.success) {
        setFormData(prev => ({ ...prev, [fieldKey]: res.data.data.url }))
        setMessage({ text: `${fieldKey.replace(/([A-Z])/g, ' $1')} uploaded!`, type: 'success' })
      }
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message, type: 'error' })
    } finally {
      setUploadsLoading(prev => ({ ...prev, [fieldKey]: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category) {
      setMessage({ text: 'Please select a service category', type: 'error' })
      return
    }
    if (!formData.selfPhoto || !formData.aadharFront || !formData.aadharBack || !formData.panCard) {
      setMessage({ text: 'Please upload all required verification documents', type: 'error' })
      return
    }
    setLoading(true)
    setMessage({ text: '', type: '' })
    const signupData = { ...formData, role: 'provider', profileImage: formData.selfPhoto }
    try {
      const res = await axios.post(`${API_URL}/user/signup`, signupData)
      setMessage({ text: res.data.message || 'Application submitted! Redirecting…', type: 'success' })
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      setMessage({ text: error.response?.data?.message || error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  /* ── perks shown on intro ── */
  const perks = [
    {
      icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      title: 'Zero Setup Cost',
      desc: 'Register for free. No hidden charges or subscription fees to get started.',
      color: '#f59e0b',
    },
    {
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      title: 'Instant Bookings',
      desc: 'Customers find and book you in real-time. Your dashboard tracks every request live.',
      color: '#8b5cf6',
    },
    {
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      title: 'Verified Badge',
      desc: 'Get a verified partner badge after KYC. Build trust and win more customers.',
      color: '#10b981',
    },
    {
      icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
      title: 'Earn More',
      desc: 'Manage your own pricing, track earnings, and grow your business on your terms.',
      color: '#ef4444',
    },
  ]

  const steps = [
    { n: '01', label: 'Register', sub: 'Fill your profile & upload docs' },
    { n: '02', label: 'KYC Review', sub: 'Admin verifies your credentials' },
    { n: '03', label: 'Get Approved', sub: 'Credentials sent to your email' },
    { n: '04', label: 'Start Earning', sub: 'Accept bookings via dashboard' },
  ]

  /* ── form steps ── */
  const STEPS = ['Personal Info', 'Business Profile', 'Documents']

  return (
    <div style={styles.page}>

      {/* ══════════════════ HERO INTRO ══════════════════ */}
      <section style={styles.hero}>

        {/* background blobs */}
        <div style={{ ...styles.blob, top: '-120px', left: '-80px', background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)' }} />
        <div style={{ ...styles.blob, bottom: '-100px', right: '-60px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }} />

        <div style={styles.heroBadge}>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 12 }}>● PARTNER PROGRAM</span>
        </div>

        <h1 style={styles.heroTitle}>
          Grow Your Business<br />
          <span style={styles.heroGradient}>with SevaSetu</span>
        </h1>

        <p style={styles.heroSub}>
          Join thousands of skilled professionals who manage bookings, earn more, and build
          their brand — all through one powerful dashboard. Registration is <strong>100% free</strong>.
          Your login credentials are sent to your email upon admin approval.
        </p>

        {/* stats row */}
        <div style={styles.statsRow}>
          {[['2,400+', 'Active Providers'], ['98%', 'Approval Rate'], ['₹0', 'Registration Fee'], ['24h', 'Avg. Approval Time']].map(([val, lab]) => (
            <div key={lab} style={styles.stat}>
              <span style={styles.statVal}>{val}</span>
              <span style={styles.statLab}>{lab}</span>
            </div>
          ))}
        </div>

        {/* perk cards */}
        <div style={styles.perksGrid}>
          {perks.map(p => (
            <div key={p.title} style={styles.perkCard}>
              <div style={{ ...styles.perkIcon, background: p.color + '20', color: p.color }}>
                <Icon d={p.icon} size={22} />
              </div>
              <h3 style={styles.perkTitle}>{p.title}</h3>
              <p style={styles.perkDesc}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* how it works */}
        <div style={styles.howBox}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#9ca3af', marginBottom: 20, textTransform: 'uppercase' }}>How It Works</p>
          <div style={styles.stepsRow}>
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={styles.step}>
                  <div style={styles.stepNum}>{s.n}</div>
                  <div style={styles.stepLabel}>{s.label}</div>
                  <div style={styles.stepSub}>{s.sub}</div>
                </div>
                {i < steps.length - 1 && <div style={styles.stepArrow}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            style={styles.ctaBtn}
            onClick={() => setShowForm(true)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(245,158,11,0.35)' }}
            title="Apply to Become a Provider"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            Apply to Become a Provider
          </button>
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 12 }}>
            Already applied? <Link to="/login" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Log in here →</Link>
          </p>
        </div>
      </section>

      {/* ══════════════════ REGISTRATION FORM ══════════════════ */}
      {showForm && (
        <section ref={formRef} style={styles.formSection}>
          <div style={styles.formCard}>

            {/* form header */}
            <div style={styles.formHeader}>
              <div style={styles.formHeaderIcon}>
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--text-main)' }}>Provider Registration</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                  Fill in your details below. Approval credentials will be emailed to you.
                </p>
              </div>
            </div>

            {/* step progress */}
            <div style={styles.progress}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      ...styles.progressDot,
                      background: i <= activeStep ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : '#e5e7eb',
                      color: i <= activeStep ? '#fff' : '#9ca3af',
                    }}>{i + 1}</div>
                    <span style={{ fontSize: 11, color: i <= activeStep ? '#f59e0b' : '#9ca3af', fontWeight: i === activeStep ? 700 : 400 }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < activeStep ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : '#e5e7eb', marginBottom: 20, borderRadius: 2 }} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 0: Personal Info ── */}
              {activeStep === 0 && (
                <div style={styles.stepPane}>
                  <div style={styles.sectionLabel}>
                    <span style={styles.sectionNum}>01</span> Personal Details
                  </div>
                  <div style={styles.grid2}>
                    <div style={styles.field}>
                      <label style={styles.label}>First Name *</label>
                      <input style={styles.input} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. Rahul" required />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Last Name</label>
                      <input style={styles.input} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Sharma" />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Email Address *</label>
                      <input style={styles.input} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Phone Number *</label>
                      <input style={styles.input} name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
                    </div>
                  </div>

                  {/* info notice */}
                  <div style={styles.notice}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>No password needed! Once admin approves your application, your login credentials will be sent to your registered email.</span>
                  </div>

                  <div style={styles.navRow}>
                    <div />
                    <button type="button" style={styles.nextBtn} onClick={() => setActiveStep(1)} title="Next: Business Profile">
                      Next: Business Profile →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Business Profile ── */}
              {activeStep === 1 && (
                <div style={styles.stepPane}>
                  <div style={styles.sectionLabel}>
                    <span style={styles.sectionNum}>02</span> Business Profile
                  </div>
                  <div style={styles.grid2}>
                    <div style={styles.field}>
                      <label style={styles.label}>Business / Brand Name *</label>
                      <input style={styles.input} name="businessName" value={formData.businessName} onChange={handleChange} placeholder="e.g. Rahul Electricals" required />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Years of Experience *</label>
                      <input style={styles.input} name="experience" type="number" min="0" value={formData.experience} onChange={handleChange} placeholder="e.g. 5" required />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Service Category *</label>
                      <select style={styles.input} name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Pincode</label>
                      <input style={styles.input} name="pincode" value={formData.address.pincode} onChange={handleChange} placeholder="e.g. 400001" />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Country *</label>
                      <select style={styles.input} value={locationCode.countryCode} onChange={handleCountryChange} required>
                        <option value="">Select country</option>
                        {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                      </select>
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>State *</label>
                      <select style={styles.input} value={locationCode.stateCode} onChange={handleStateChange} disabled={!locationCode.countryCode} required>
                        <option value="">Select state</option>
                        {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                      </select>
                    </div>
                    <div style={{ ...styles.field, gridColumn: 'span 2' }}>
                      <label style={styles.label}>City *</label>
                      <select style={styles.input} value={formData.address.city} onChange={handleCityChange} disabled={!locationCode.stateCode} required>
                        <option value="">Select city</option>
                        {cities.map(c => <option key={`${c.name}-${c.latitude}`} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Skills <span style={{ color: '#9ca3af' }}>(comma separated)</span></label>
                    <input style={styles.input} name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Plumbing, Leak Fixing, Pipe Installation" />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Service Areas <span style={{ color: '#9ca3af' }}>(comma separated)</span></label>
                    <input style={styles.input} name="serviceAreas" value={formData.serviceAreas} onChange={handleChange} placeholder="e.g. Andheri, Bandra, Dadar" />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>About Your Services</label>
                    <textarea style={{ ...styles.input, resize: 'vertical', minHeight: 90 }} name="description" value={formData.description} onChange={handleChange} placeholder="Describe your services, working hours, specialties…" />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.label}>Full Operational Address</label>
                    <textarea style={{ ...styles.input, resize: 'vertical', minHeight: 70 }} name="fullAddress" value={formData.address.fullAddress} onChange={handleChange} placeholder="Complete address where you operate…" />
                  </div>

                  <div style={styles.navRow}>
                    <button type="button" style={styles.backBtn} onClick={() => setActiveStep(0)} title="Back">← Back</button>
                    <button type="button" style={styles.nextBtn} onClick={() => setActiveStep(2)} title="Next: Documents">Next: Documents →</button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Documents ── */}
              {activeStep === 2 && (
                <div style={styles.stepPane}>
                  <div style={styles.sectionLabel}>
                    <span style={styles.sectionNum}>03</span> Verification Documents
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>
                    Upload clear, high-quality images of the documents below. These are used for KYC verification only.
                  </p>

                  <div style={styles.docsGrid}>
                    {[
                      { key: 'selfPhoto', label: 'Self Photo', ref: selfPhotoRef, isCircle: true, emoji: '👤' },
                      { key: 'aadharFront', label: 'Aadhar Front', ref: aadharFrontRef, isCircle: false, emoji: '🪪' },
                      { key: 'aadharBack', label: 'Aadhar Back', ref: aadharBackRef, isCircle: false, emoji: '🪪' },
                      { key: 'panCard', label: 'PAN Card', ref: panCardRef, isCircle: false, emoji: '💳' },
                    ].map(({ key, label, ref, isCircle, emoji }) => (
                      <div key={key} style={styles.docSlot}>
                        <span style={styles.docLabel}>{label} <span style={{ color: '#ef4444' }}>*</span></span>

                        {formData[key] ? (
                          <img
                            src={formData[key]}
                            alt={label}
                            loading="lazy"
                            style={{
                              width: isCircle ? 90 : '100%',
                              height: 90,
                              objectFit: isCircle ? 'cover' : 'contain',
                              borderRadius: isCircle ? '50%' : 8,
                              margin: isCircle ? '0 auto 10px' : '0 0 10px',
                              display: 'block',
                              border: '2px solid #f59e0b',
                            }}
                          />
                        ) : (
                          <div style={{
                            width: isCircle ? 90 : '100%',
                            height: 90,
                            borderRadius: isCircle ? '50%' : 8,
                            background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: isCircle ? '0 auto 10px' : '0 0 10px',
                            fontSize: 28,
                            color: '#9ca3af',
                          }}>{emoji}</div>
                        )}

                        <input type="file" ref={ref} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleDocumentUpload(e, key)} />
                        <button
                          type="button"
                          onClick={() => ref.current.click()}
                          style={{
                            ...styles.uploadBtn,
                            background: formData[key] ? '#d1fae5' : '#111827',
                            color: formData[key] ? '#065f46' : '#fff',
                            border: formData[key] ? '1px solid #6ee7b7' : 'none',
                          }}
                        >
                          {uploadsLoading[key] ? '⏳ Uploading…' : formData[key] ? '✓ Uploaded' : 'Upload'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* message */}
                  {message.text && (
                    <div style={{
                      ...styles.msgBox,
                      background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                      border: `1px solid ${message.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
                      color: message.type === 'success' ? '#065f46' : '#991b1b',
                    }}>
                      {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
                    </div>
                  )}

                  <div style={styles.navRow}>
                    <button type="button" style={styles.backBtn} onClick={() => setActiveStep(1)} title="Back">← Back</button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ ...styles.nextBtn, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 200 }}
                      title={loading ? 'Submitting Application…' : 'Submit Application'}
                    >
                      {loading ? '⏳ Submitting Application…' : '🚀 Submit Application'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      )}

    </div>
  )
}

/* ── Styles ─────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: '#f9fafb',
  },
  hero: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '80px 24px 60px',
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: 999,
    padding: '6px 16px',
    fontSize: 11,
    marginBottom: 24,
    position: 'relative',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 'clamp(36px, 6vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    margin: '0 0 20px',
    position: 'relative',
    zIndex: 1,
  },
  heroGradient: {
    background: 'linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSub: {
    fontSize: 16,
    lineHeight: 1.7,
    color: '#9ca3af',
    maxWidth: 600,
    margin: '0 0 40px',
    position: 'relative',
    zIndex: 1,
  },
  statsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 48,
    position: 'relative',
    zIndex: 1,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statVal: {
    fontSize: 28,
    fontWeight: 800,
    background: 'linear-gradient(90deg,#f59e0b,#ef4444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLab: {
    fontSize: 12,
    color: '#6b7280',
  },
  perksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 48,
    position: 'relative',
    zIndex: 1,
  },
  perkCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '22px 20px',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  perkIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  perkTitle: {
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 8px',
    color: '#f9fafb',
  },
  perkDesc: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 1.6,
    margin: 0,
  },
  howBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: '28px 24px',
    position: 'relative',
    zIndex: 1,
  },
  stepsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 100,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 800,
    color: '#f59e0b',
    letterSpacing: 1,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: '#f9fafb',
  },
  stepSub: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  stepArrow: {
    color: '#374151',
    fontSize: 18,
    flexShrink: 0,
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    padding: '16px 36px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(245,158,11,0.35)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    letterSpacing: 0.2,
  },

  // FORM SECTION
  formSection: {
    padding: '20px 24px 80px',
    maxWidth: 800,
    margin: '0 auto',
  },
  formCard: {
    background: 'var(--bg-card)',
    borderRadius: 24,
    padding: '40px 36px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    color: 'var(--text-main)',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: '1px solid var(--border-color)',
  },
  formHeaderIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 36,
  },
  progressDot: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    transition: 'background 0.3s',
    flexShrink: 0,
  },
  stepPane: {
    animation: 'fadeIn 0.3s ease',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-main)',
    marginBottom: 20,
  },
  sectionNum: {
    fontSize: 11,
    fontWeight: 800,
    color: '#f59e0b',
    background: '#fef3c7',
    padding: '3px 8px',
    borderRadius: 6,
    letterSpacing: 1,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px 20px',
    marginBottom: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--text-main)',
    outline: 'none',
    background: 'var(--bg-input)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  notice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
    padding: '14px 16px',
    fontSize: 13,
    color: '#92400e',
    lineHeight: 1.5,
    marginTop: 8,
    marginBottom: 8,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    paddingTop: 24,
    borderTop: '1px solid var(--border-color)',
  },
  nextBtn: {
    background: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  backBtn: {
    background: 'var(--bg-input)',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  docsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  docSlot: {
    border: '2px dashed var(--border-color)',
    borderRadius: 14,
    padding: '18px 14px',
    textAlign: 'center',
    background: 'var(--bg-input)',
    transition: 'border-color 0.2s',
  },
  docLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--text-main)',
    display: 'block',
    marginBottom: 12,
  },
  uploadBtn: {
    width: '100%',
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  msgBox: {
    borderRadius: 12,
    padding: '14px 18px',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 16,
    lineHeight: 1.5,
  },
}

export default BecomeProvider
