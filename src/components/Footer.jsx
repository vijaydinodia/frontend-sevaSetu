import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 px-5 border-t border-zinc-800 mt-auto">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white text-lg font-bold">S</span>
          <p className="text-sm font-semibold text-white">SevaSetu Portal</p>
          <p className="text-xs">
            Bridging the gap between talented service providers and customers in real time.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-amber-500 transition">Home</Link>
            <Link to="/#how" className="hover:text-amber-500 transition">How it works</Link>
            <Link to="/#categories" className="hover:text-amber-500 transition">Categories</Link>
            <Link to="/become-provider" className="hover:text-amber-500 transition">Become a Partner</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company & Legal</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" className="hover:text-amber-500 transition">About Us</Link>
            <Link to="/contact" className="hover:text-amber-500 transition">Contact Us</Link>
            <Link to="/faq" className="hover:text-amber-500 transition">FAQ</Link>
            <Link to="/privacy" className="hover:text-amber-500 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-500 transition">Terms & Conditions</Link>
            <Link to="/cookie-policy" className="hover:text-amber-500 transition">Cookie Policy</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support</h4>
          <p className="text-xs leading-relaxed">
            Have questions? Contact our operations support team anytime at support@sevasetu.com
          </p>
          <p className="text-xs mt-4">
            &copy; {new Date().getFullYear()} SevaSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
