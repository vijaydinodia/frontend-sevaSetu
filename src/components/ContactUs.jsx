import React, { useState } from 'react'
import Card from './ui/Card'
import Button from './ui/Button'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined'
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined'

const ContactUs = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
  const inputStyle = `w-full rounded-2xl border px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors ${
    theme === 'light' ? 'border-zinc-200 bg-white' : 'border-zinc-800 bg-zinc-800'
  }`

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-5xl px-5 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent px-3 py-1 rounded-full border border-pink-500/20">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight">
            Contact Us
          </h1>
          <p className={`mt-6 text-base max-w-xl mx-auto leading-relaxed ${textMuted}`}>
            Have questions about SevaSetu? Feedback or business inquiries? Drop us a line and our operations team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-10 items-start">
          {/* Info Side */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Card className={`p-6 ${cardBg} border shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 text-amber-500">Corporate Support</h3>
              <p className="text-sm m-0 font-semibold">support@sevasetu.com</p>
              <p className={`text-xs mt-1 ${textMuted}`}>General queries & KYC help</p>
            </Card>

            <Card className={`p-6 ${cardBg} border shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 text-amber-500">Phone Support</h3>
              <p className="text-sm m-0 font-semibold">+91 98765 43210</p>
              <p className={`text-xs mt-1 ${textMuted}`}>Mon - Sat, 9:00 AM to 6:00 PM</p>
            </Card>

            <Card className={`p-6 ${cardBg} border shadow-sm`}>
              <h3 className="text-lg font-bold mb-4 text-amber-500">HQ Office Address</h3>
              <p className="text-sm m-0 leading-relaxed text-zinc-500">
                SevaSetu Operations Center<br />
                Sector 5, Mansarovar<br />
                Jaipur, Rajasthan, 302020
              </p>
            </Card>
          </div>

          {/* Form Side */}
          <div className="md:col-span-7">
            <Card className={`p-8 ${cardBg} border shadow-xl`}>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                    <CheckCircleOutlineOutlinedIcon fontSize="large" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className={`text-sm mb-6 ${textMuted}`}>
                    Thank you for contacting us. We've received your query and will respond shortly.
                  </p>
                  <Button variant="outline" onClick={() => setSubmitted(false)} title="Send Another Message">
                    <ReplayOutlinedIcon fontSize="small" />
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold mb-2">Send us a Message</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-500">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-zinc-500">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Subject *</label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="KYC verification, business inquiry, etc."
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-zinc-500">Your Message *</label>
                    <textarea
                      required
                      rows="5"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Type details of your request here..."
                      className={inputStyle}
                    />
                  </div>

                  <Button type="submit" variant="gradient" className="h-12 justify-center font-semibold mt-2" disabled={loading} title={loading ? 'Sending...' : 'Submit Message'}>
                    {loading ? <HourglassEmptyOutlinedIcon fontSize="small" /> : <SendOutlinedIcon fontSize="small" />}
                    {loading ? 'Sending...' : 'Submit Message'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ContactUs
