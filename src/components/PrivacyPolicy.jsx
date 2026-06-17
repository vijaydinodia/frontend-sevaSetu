import React from 'react'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'

const PrivacyPolicy = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-4xl px-5 py-12 md:py-20 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-zinc-400 mb-8 font-semibold">Last Updated: June 14, 2026</p>

        <Card className={`p-8 ${cardBg} border shadow-lg space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300`}>
          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">1. Introduction</h2>
            <p className={textMuted}>
              Welcome to SevaSetu ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what details we collect, how we handle them, and what rights you have when using our web portal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">2. Information We Collect</h2>
            <div className="space-y-2">
              <p className={textMuted}>
                <strong>Personal Profiles:</strong> When registering, we collect name, email, phone number, role (user or provider), and passwords.
              </p>
              <p className={textMuted}>
                <strong>KYC Documents:</strong> For service providers, we collect and store business details, experience years, skills, self-photos, PAN card copies, and Aadhar card verification documents.
              </p>
              <p className={textMuted}>
                <strong>Booking Records:</strong> We track service selections, prices, addresses, booking dates/slots, and custom instructions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-500">
              <li>To match customers with nearby verified service providers.</li>
              <li>To authorize and verify service provider accounts through admin checks.</li>
              <li>To keep booking logs updated, handle order acceptances, and track cancellations.</li>
              <li>To send credentials and registration confirmations securely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">4. Data Sharing & Security</h2>
            <p className={textMuted}>
              We do not sell or trade your personal data. Required booking information (address, name, phone) is shared exclusively with the matching service provider to complete tasks. All KYC documents are stored securely and accessed only by authorized category administrators.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">5. Your Privacy Rights</h2>
            <p className={textMuted}>
              You have the right to request access to your profile data, edit details using the profile editor, or request soft/hard deletion of your account. Under our system guidelines, Super Admins handle permanent deletion requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">6. Contact Support</h2>
            <p className={textMuted}>
              For privacy-related questions or data deletion requests, contact our privacy compliance team at compliance@sevasetu.com.
            </p>
          </section>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
