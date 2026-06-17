import React from 'react'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'

const AboutUs = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  const values = [
    {
      title: "Trust & Safety",
      desc: "Every service provider is strictly verified using standard government KYC databases and visual document checks to guarantee safety."
    },
    {
      title: "Real-time Matching",
      desc: "No long waiting times. Our dashboard links user bookings to local approved professionals instantly based on availability."
    },
    {
      title: "Fair Pricing",
      desc: "Clear upfront prices with zero hidden service charges. Customers and partners connect directly on custom terms."
    },
    {
      title: "Quality Support",
      desc: "Our active administration team is always available to resolve disputes, track orders, and coordinate details."
    }
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-5xl px-5 py-12 md:py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent px-3 py-1 rounded-full border border-pink-500/20">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4 tracking-tight">
            About SevaSetu
          </h1>
          <p className={`mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${textMuted}`}>
            Bridging the gap between home-service professionals and customers with trust, speed, and real-time dashboard scheduling.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
            <p className={`text-sm leading-relaxed mb-4 ${textMuted}`}>
              SevaSetu was built to transform how local services are discovered and booked. Traditionally, finding reliable handymen, cleaners, plumbers, or technicians has been complex and plagued with pricing uncertainty.
            </p>
            <p className={`text-sm leading-relaxed ${textMuted}`}>
              We designed a unified dashboard portal that empowers skilled professionals to showcase their offerings, price their services, and scale their business, while providing customers with a seamless, secure, and stress-free booking experience.
            </p>
          </div>
          <Card className={`p-8 ${cardBg} border shadow-lg relative overflow-hidden`}>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />
            <h3 className="text-xl font-bold mb-3">Connecting Communities</h3>
            <p className="text-sm leading-relaxed m-0 text-zinc-500">
              By providing micro-entrepreneurs with digital invoicing, direct bookings tracking, and admin authorization, we help build micro-economies that keep communities growing and self-sufficient.
            </p>
          </Card>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Our Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Card key={i} className={`p-6 ${cardBg} border hover:shadow-md transition-shadow`}>
                <h4 className="text-lg font-bold mb-2 text-amber-500">{v.title}</h4>
                <p className={`text-sm leading-relaxed m-0 ${textMuted}`}>{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs
