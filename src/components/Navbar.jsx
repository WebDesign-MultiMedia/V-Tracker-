import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/Home' },
  { name: 'Logs', href: '/vehicleTrackerPage' },
  { name: 'Expenses', href: '/Expenses' },
  { name: 'Captures', href: '/VideoImageLog' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/Home" className="no-underline flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V6l2 1 3 9M7 16h10" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">V Tracker</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navigation.map((item) => {
              const active = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`no-underline px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/CustomerSupport" className="no-underline text-gray-400 hover:text-white text-sm transition-colors">
              Support
            </Link>
            <Link to="/" className="no-underline bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
              Sign Out
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="sm:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden bg-gray-950 border-t border-gray-800 px-4 py-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setOpen(false)}
              className={`no-underline block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.href
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-800 mt-2">
            <Link to="/CustomerSupport" onClick={() => setOpen(false)} className="no-underline block px-4 py-2.5 text-sm text-gray-400 hover:text-white">Support</Link>
            <Link to="/" onClick={() => setOpen(false)} className="no-underline block px-4 py-2.5 text-sm text-gray-400 hover:text-white">Sign Out</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
