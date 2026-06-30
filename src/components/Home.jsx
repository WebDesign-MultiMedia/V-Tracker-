import React from 'react'
import Navbar from './Navbar'
import RecordLog from './RecordLog'
import Monitor from './Monitor'
import Footer from './Footer'

const Homes = () => (
  <div className="bg-gray-950 min-h-screen">
    <Navbar />
    <Monitor />
    <RecordLog />
    <Footer />
  </div>
)

export default Homes
