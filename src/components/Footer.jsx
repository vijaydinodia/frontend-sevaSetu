import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-[#9CA3AF] py-20 px-6 md:px-10 border-t border-zinc-900 mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-zinc-900">
          
          {/* Column 1: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Company</h4>
            <div className="flex flex-col gap-2.5 text-[15px]">
              <Link to="/about" className="hover:text-white transition duration-200">About Us</Link>
              <Link to="/become-provider" className="hover:text-white transition duration-200">Careers</Link>
              <Link to="/" className="hover:text-white transition duration-200">Blog</Link>
              <Link to="/contact" className="hover:text-white transition duration-200">Contact Us</Link>
            </div>
          </div>

          {/* Column 2: Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Support</h4>
            <div className="flex flex-col gap-2.5 text-[15px]">
              <Link to="/faq" className="hover:text-white transition duration-200">Help Center</Link>
              <Link to="/faq" className="hover:text-white transition duration-200">FAQs</Link>
              <Link to="/terms" className="hover:text-white transition duration-200">Safety & Trust</Link>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Legal</h4>
            <div className="flex flex-col gap-2.5 text-[15px]">
              <Link to="/privacy" className="hover:text-white transition duration-200">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition duration-200">Terms & Conditions</Link>
              <Link to="/cookie-policy" className="hover:text-white transition duration-200">Cookie Policy</Link>
            </div>
          </div>

          {/* Column 4: Cities */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Cities</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Delhi NCR', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Kolkata'].map((city) => (
                <span key={city} className="bg-zinc-900 text-zinc-400 px-3 py-1.5 rounded-full border border-zinc-800">
                  {city}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#16A34A] text-white text-base font-bold shadow">
              S
            </span>
            <div>
              <p className="text-white font-bold text-[15px]">SevaSetu Portal</p>
              <p className="text-xs text-[#6B7280] mt-0.5">&copy; {new Date().getFullYear()} SevaSetu. All rights reserved.</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-[#6B7280]">
              Need direct support? Email us at{" "}
              <a href="mailto:support@sevasetu.com" className="text-[#16A34A] hover:text-[#15803D] font-semibold transition-colors duration-200">
                support@sevasetu.com
              </a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
