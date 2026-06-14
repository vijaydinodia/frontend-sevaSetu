import React from 'react'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'

const TermsConditions = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-4xl px-5 py-12 md:py-20 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Terms & Conditions</h1>
        <p className="text-xs text-zinc-400 mb-8 font-semibold">Last Updated: June 14, 2026</p>

        <Card className={`p-8 ${cardBg} border shadow-lg space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300`}>
          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">1. Agreement to Terms</h2>
            <p className={textMuted}>
              By accessing and using SevaSetu, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, you must not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">2. Customer Bookings & Scheduling</h2>
            <p className={textMuted}>
              Customers are responsible for providing correct address, pincode, contact information, and chosen time slot. Confirming a booking constitutes a commitment to pay the price shown upon completion of work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">3. Partner/Provider Guidelines</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-500">
              <li>Partners must supply accurate registration and KYC documents.</li>
              <li>Providing false information will result in immediate rejection or block.</li>
              <li>Partners must maintain high ratings and follow status flow (pending, accepted, on the way, started, completed).</li>
              <li>Custom service price listings must be fair and represent the actual work description.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">4. Cancellations & Rejections</h2>
            <p className={textMuted}>
              We reserve the right to cancel bookings or suspend user accounts if fraudulent, unsafe, or abusive behavior is detected. Providers have the right to reject orders, and customers can cancel orders before the provider marks status as 'on_the_way'.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">5. Limitation of Liability</h2>
            <p className={textMuted}>
              SevaSetu operates as a matchmaking portal. While we verify provider documentation through admin approvals, we are not directly liable for disputes, damages, or service quality issues arising during tasks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">6. Amendments</h2>
            <p className={textMuted}>
              We may update our service offerings, fees, and these terms periodically. Continuing to use the platform after modifications constitutes acceptance of the new terms.
            </p>
          </section>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default TermsConditions
