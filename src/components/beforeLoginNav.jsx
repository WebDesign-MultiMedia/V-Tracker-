import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HomeNavbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="no-underline flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V6l2 1 3 9M7 16h10" />
            </svg>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">V Tracker</span>
        </Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/Login" className="no-underline text-white/80 hover:text-white font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-all">
            Login
          </Link>
          <Link to="/Register" className="no-underline bg-white text-black font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-all">
            Sign Up
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="sm:hidden bg-black/90 backdrop-blur-md px-6 py-4 flex flex-col gap-3 border-t border-white/10">
          <Link to="/Login" onClick={() => setOpen(false)} className="no-underline text-white font-medium py-2">Login</Link>
          <Link to="/Register" onClick={() => setOpen(false)} className="no-underline text-white font-medium py-2">Sign Up</Link>
        </div>
      )}
    </nav>
  )
}

export default HomeNavbar
