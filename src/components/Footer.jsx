import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V6l2 1 3 9M7 16h10" />
            </svg>
          </div>
          <span className="text-gray-400 text-sm">© {new Date().getFullYear()} V Tracker. All Rights Reserved.</span>
        </div>
        <ul className="flex items-center gap-5 text-sm text-gray-500">
          <li><a href="#" className="hover:text-white transition-colors no-underline">About</a></li>
          <li><a href="#" className="hover:text-white transition-colors no-underline">Privacy</a></li>
          <li><Link to="/CustomerSupport" className="hover:text-white transition-colors no-underline">Support</Link></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
