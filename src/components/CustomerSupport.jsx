import React from 'react'
import Navbar from './Navbar'

function CustomerSupport() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-950 min-h-screen py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Customer Support</h1>
            <p className="text-gray-400 mt-2">We're here to help. Fill out the form and we'll get back to you.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
            <form
              action="https://public.herotofu.com/v1/77da8c70-7efa-11ef-a713-f1ff48b47695"
              method="post"
              acceptCharset="UTF-8"
              className="space-y-5"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Your Name</label>
                <input
                  name="Name"
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <input
                  name="Email"
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="issue" className="block text-sm font-medium text-gray-300 mb-1.5">Describe Your Issue</label>
                <textarea
                  name="issue"
                  id="issue"
                  required
                  rows={5}
                  placeholder="Please describe the issue you're experiencing..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20"
              >
                Send Message
              </button>

              <div className="hidden">
                <input type="text" name="_gotcha" tabIndex="-1" autoComplete="off" />
              </div>
            </form>
          </div>

          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Other ways to reach us</h3>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>(347) 490-5546</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomerSupport
