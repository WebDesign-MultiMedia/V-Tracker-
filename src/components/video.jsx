import React from 'react'
import HomeNavbar from './beforeLoginNav'
import { Link } from 'react-router-dom'

const Bg = () => (
  <>
    <HomeNavbar />
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <video src="/getStarted.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 text-sm tracking-widest uppercase font-medium">Live Tracking</span>
        </div>
        <h1 className="text-6xl sm:text-7xl lg:text-8xl text-white font-thin tracking-tight mb-6 drop-shadow-lg">
          V Tracker
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-10">
          Your all-in-one vehicle management platform. Log maintenance, track fuel, monitor expenses, and stay on top of your vehicle's health — all in one place.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/Login"
            className="no-underline bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/Register"
            className="no-underline border border-white/50 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
          >
            Create Account
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {/* Features section */}
    <div className="bg-gray-950 py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: '🔧', title: 'Maintenance', desc: 'Track every oil change, brake job, and repair' },
          { icon: '⛽', title: 'Fuel Logs', desc: 'Monitor fuel costs and consumption over time' },
          { icon: '💰', title: 'Expenses', desc: 'Keep a full record of all vehicle spending' },
          { icon: '📷', title: 'Captures', desc: 'Photo & video capture for damage documentation' },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </>
)

export default Bg
