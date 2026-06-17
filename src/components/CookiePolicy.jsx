import React from 'react'
import Card from './ui/Card'
import useTheme from '../custom_hook/UseTheme'
import Footer from './Footer'

const CookiePolicy = () => {
  const { theme } = useTheme()
  const textMuted = theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'
  const cardBg = theme === 'light' ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 mx-auto max-w-4xl px-5 py-12 md:py-20 w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Cookie Policy</h1>
        <p className="text-xs text-zinc-400 mb-8 font-semibold">Last Updated: June 14, 2026</p>

        <Card className={`p-8 ${cardBg} border shadow-lg space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300`}>
          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">1. What are Cookies?</h2>
            <p className={textMuted}>
              Cookies are small text files stored on your computer or mobile device when you visit websites. They are widely used to make websites work more efficiently and provide a customized experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">2. How We Use Cookies</h2>
            <p className={textMuted}>
              We use standard browser local storage (`localStorage`) and essential cookies to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-500 mt-2">
              <li><strong>Authentication:</strong> Keep you logged in to your account and remember your session token securely.</li>
              <li><strong>Preferences:</strong> Remember your active theme preferences (light mode vs. dark mode).</li>
              <li><strong>UI State:</strong> Maintain collapsed sidebar states or active dashboard selection tabs while navigating.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">3. Types of Cookies We Use</h2>
            <div className="space-y-2 text-zinc-500">
              <p>
                <strong>Strictly Necessary:</strong> Required for the basic functioning of the website (logging in, booking services, admin panel state). Without these, the site cannot operate correctly.
              </p>
              <p>
                <strong>Functional:</strong> Used to remember customization choices (like dark theme).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">4. Managing Your Preferences</h2>
            <p className={textMuted}>
              You can control and manage cookies through your web browser settings. Most browsers allow you to block cookies, clear local storage cache, or delete current history. Note that blocking essential cookies will break the login and dashboard functionality of SevaSetu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-amber-500">5. Updates to This Policy</h2>
            <p className={textMuted}>
              We may update this Cookie Policy from time to time to reflect modifications in local storage keys or policy changes. Please review this page regularly for the latest details.
            </p>
          </section>
        </Card>
      </div>
      <Footer />
    </div>
  )
}

export default CookiePolicy
