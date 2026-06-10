import React from 'react'
import { Link } from 'react-router-dom'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import Button from './ui/Button'
import Card from './ui/Card'

const Home = () => {
  return (
    <main className="min-h-screen bg-[#f8ebe6]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-7">
        <Link to="/" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
          S
        </Link>

        <div className="hidden items-center gap-9 text-sm font-semibold text-black md:flex">
          <a href="#how">How it works</a>
          <a href="#use">Use cases</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" size="icon" aria-label="Login">
              <LoginOutlinedIcon fontSize="small" />
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" size="icon" aria-label="Sign up">
              <PersonOutlineOutlinedIcon fontSize="small" />
            </Button>
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
        <div>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-normal text-black md:text-7xl">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              SevaSetu
            </span>
            <br />
            for real-time services
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-6 text-zinc-700">
            Book services, manage providers, track users, and keep every role in one simple dashboard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/signup">
              <Button variant="gradient" className="h-14 px-7">
                <ArrowForwardOutlinedIcon fontSize="small" />
                Start for free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="h-14 px-7">
                Contact us
              </Button>
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-xs font-semibold text-black">
            <span>30-day free trial</span>
            <span>No credit card required</span>
            <span>Cancel anytime</span>
          </div>
        </div>

        <div className="relative min-h-[540px]">
          <Card className="absolute left-2 top-24 hidden w-40 overflow-hidden p-2 md:block">
            <div className="h-24 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-500" />
          </Card>

          <Card className="absolute left-[25%] top-0 w-64 bg-black p-5 text-white md:w-72">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold leading-6">Service Meeting</p>
                <p className="text-xs text-zinc-400">Live request analysis</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs">...</span>
            </div>
            <div className="mt-8 flex h-20 items-center gap-1">
              {Array.from({ length: 38 }).map((_, index) => (
                <span
                  key={index}
                  className="w-1 rounded-full bg-white/70"
                  style={{ height: `${12 + (index % 7) * 7}px` }}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-3 text-xs text-black">
              <span>00:05:39</span>
              <span className="text-pink-500">Analysing...</span>
            </div>
          </Card>

          <Card className="absolute right-0 top-20 w-36 overflow-hidden p-2 md:w-44">
            <div className="flex h-24 items-center justify-center rounded-3xl bg-[#d9c1aa]">
              <PersonOutlineOutlinedIcon />
            </div>
          </Card>

          <Card className="absolute right-12 top-56 w-72 p-5 md:w-80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
                <VerifiedRoundedIcon fontSize="small" />
              </div>
              <div>
                <p className="text-xs font-semibold text-purple-600">Consent</p>
                <p className="text-sm font-semibold text-black">The provider is ready for booking.</p>
              </div>
            </div>
          </Card>

          <Card className="absolute bottom-0 left-[12%] w-44 overflow-hidden p-2">
            <div className="flex h-28 items-center justify-center rounded-3xl bg-[#cbd7c6]">
              <PlayArrowRoundedIcon />
            </div>
          </Card>

          <Card className="absolute bottom-3 right-2 w-44 overflow-hidden p-2">
            <div className="flex h-28 items-center justify-center rounded-3xl bg-[#b7d7da]">
              <GraphicEqRoundedIcon />
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-white px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 text-center md:flex-row md:text-left">
          <p className="text-sm">
            <b>Enjoy 50% off premium features</b> for first 3 months - 21 days remaining
          </p>
          <Link to="/signup" className="text-sm font-semibold text-pink-500">
            Start 14 days trial
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home
