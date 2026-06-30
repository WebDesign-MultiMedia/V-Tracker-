import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const DEMO = { email: 'demo@vtracker.com', password: 'demo123' }

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' })
  const [userData, setUserData] = useState([DEMO])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:8080/Logins')
        const data = await res.json()
        setUserData(Array.isArray(data) ? [...data, DEMO] : [DEMO])
      } catch {
        setUserData([DEMO])
      }
    }
    fetchUserData()
  }, [])

  const handleInput = (e) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const user = userData.find(u => u.email === values.email && u.password === values.password)
    setTimeout(() => {
      setLoading(false)
      if (user) {
        navigate('/Home')
      } else {
        setError('Invalid email or password')
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="no-underline flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h1m8-1V6l2 1 3 9M7 16h10" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">V Tracker</span>
        </Link>
        <Link to="/Register" className="no-underline text-sm text-gray-400 hover:text-white transition-colors">
          Don't have an account? <span className="text-red-400 font-medium">Sign up</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your V Tracker account</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
            {/* Demo shortcut */}
            <button
              type="button"
              onClick={() => setValues({ email: DEMO.email, password: DEMO.password })}
              className="w-full mb-5 border border-dashed border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm py-2.5 rounded-xl transition-all"
            >
              Use demo account →
            </button>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleInput}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors no-underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleInput}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-500/30"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
              <span className="text-gray-400 text-sm">
                New to V Tracker?{' '}
                <Link to="/Register" className="no-underline text-red-400 font-medium hover:text-red-300 transition-colors">
                  Create an account
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
