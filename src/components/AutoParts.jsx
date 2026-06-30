import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const resources = [
  {
    category: 'Parts & Supplies',
    items: [
      { name: 'AutoZone', desc: 'Auto parts, accessories & tools', link: 'https://www.autozone.com/', logo: 'https://www.autozone.com/images/az-logo-full.svg', bg: '#ff0000' },
      { name: 'RockAuto', desc: 'Discount auto parts online', link: 'https://www.rockauto.com/', logo: 'https://www.rockauto.com/Images/mobile/headertextlogo-short.png', bg: '#1a1a2e' },
    ]
  },
  {
    category: 'Performance Parts',
    items: [
      { name: 'MagnaFlow', desc: 'Exhaust systems & performance', link: 'https://www.magnaflow.com/', logo: 'https://www.magnaflow.com/cdn/shop/t/145/assets/logo-header.svg?v=154536293364626413751689267314', bg: '#111' },
      { name: 'Summit Racing', desc: 'Racing & performance equipment', link: 'https://www.summitracing.com/', logo: 'https://static.summitracing.com/global/images/mygarage/my-garage-logo.svg', bg: '#003087' },
      { name: 'Vivid Racing', desc: 'High performance parts', link: 'https://www.vividracing.com/', logo: 'https://www.vividracing.com/templates/vr23/images/vr-logo-large.webp', bg: '#111' },
    ]
  },
  {
    category: 'DIY Guides & How-To',
    items: [
      { name: 'WikiHow Auto', desc: 'Step-by-step car repair guides', link: 'https://www.wikihow.com/Category:Cars', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/WikiHow_logo_-_primary_2014.png', bg: '#00c000' },
      { name: 'Car Care Kiosk', desc: 'Free vehicle-specific how-to videos', link: 'https://www.carcarekiosk.com/', logo: 'https://storage.googleapis.com/rp-production-public-content/buxe0ku8ae1nnhdhmogmeakhxfa3', bg: '#222' },
    ]
  },
]

function AutoParts() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-950 min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Vehicle Resources</h1>
            <p className="text-gray-400 mt-1">Trusted links for parts, supplies, and repair guides</p>
          </div>

          <div className="space-y-10">
            {resources.map((section) => (
              <div key={section.category}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">{section.category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-600 hover:bg-gray-800/50 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white overflow-hidden">
                        <img src={item.logo} alt={item.name} className="w-10 h-10 object-contain" onError={e => { e.target.style.display='none' }} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">{item.name}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-600 ml-auto flex-shrink-0 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AutoParts
