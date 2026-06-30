import './index.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Registers from './components/Register'
import VehicleTracker from './components/vehicleTrackerPage'
import ExpenseTracker from './components/Expenses'
import VideoImageLog from './components/VideoImageLog'
import AutoParts from './components/AutoParts'
import CustomerSupportForm from './components/CustomerSupport'
import Bg from './components/video'

const App = () => (
  <Routes>
    <Route path="/" element={<Bg />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Register" element={<Registers />} />
    <Route path="/Home" element={<Home />} />
    <Route path="/vehicleTrackerPage" element={<VehicleTracker />} />
    <Route path="/Expenses" element={<ExpenseTracker />} />
    <Route path="/VideoImageLog" element={<VideoImageLog />} />
    <Route path="/AutoParts" element={<AutoParts />} />
    <Route path="/CustomerSupport" element={<CustomerSupportForm />} />
  </Routes>
)

export default App
