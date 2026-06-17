import React, { useState } from 'react'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'

const FAQ = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  const faqData = [
    {
      question: "How do I book a service on SevaSetu?",
      answer: "Create an account or login to your customer profile. Browse the catalog of custom service offerings on the home page, select a time slot, fill in your address details, and click 'Confirm & Book'. You can track the status in your customer dashboard."
    },
    {
      question: "How do I become a service provider?",
      answer: "Click the 'Join as Partner' button on the homepage or head to '/become-provider'. Complete the registration form, specify your category, and upload your KYC documents (self-photo, PAN card, Aadhar front/back). Once submitted, our category administrators will review and approve your application."
    },
    {
      question: "What documents are needed for partner KYC verification?",
      answer: "We require four verification files: a clear self photo, your PAN card image, and the front and back of your Aadhar card. These documents are encrypted and kept secure for trust and safety purposes."
    },
    {
      question: "Can I cancel a booking after scheduling it?",
      answer: "Yes, customers can cancel bookings from their dashboard at any time as long as the provider status is 'pending' or 'accepted'. Once the status is changed to 'on the way' or 'started', you must coordinate directly with support or the provider."
    },
    {
      question: "How are average ratings calculated for providers?",
      answer: "Every time a booking is completed, users can leave feedback. The average rating is computed by dividing the sum of all rating scores by the total number of reviews submitted. Category admins can review and remove flagged comments."
    },
    {
      question: "Who reviews partner applications?",
      answer: "Each category (e.g. Electrician, Plumbing, Carpentry) is assigned to a Category Administrator. Administrators review applications, check KYC attachments, and issue auto-generated login credentials to approved providers."
    }
  ]

  const [activeIndex, setActiveIndex] = useState(null)

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-3xl px-5 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent px-3 py-1 rounded-full border border-pink-500/20">
            Have Questions?
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className={`mt-6 text-sm max-w-xl mx-auto leading-relaxed ${textMuted}`}>
            Everything you need to know about booking services, partner onboarding, and security on the SevaSetu portal.
          </p>
        </div>

        <div className="space-y-4 mb-20">
          {faqData.map((item, idx) => {
            const isOpen = activeIndex === idx
            return (
              <Card
                key={idx}
                className={`p-5 cursor-pointer select-none transition-all duration-200 border ${cardBg} hover:shadow-md`}
                onClick={() => toggleAccordion(idx)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h4 className="text-sm md:text-base font-bold m-0 text-zinc-900 dark:text-zinc-50">
                    {item.question}
                  </h4>
                  <span className={`text-xl font-bold text-amber-500 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className={`text-xs md:text-sm leading-relaxed m-0 border-t pt-3 border-zinc-100 dark:border-zinc-800 ${textMuted}`}>
                    {item.answer}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FAQ
