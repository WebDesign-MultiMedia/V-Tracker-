import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt, faDashboard, faWrench, faGears, faCarSide, faSearch,
  faLocationDot, faDollarSign, faCalendarXmark, faCircleInfo, faGasPump,
  faDollar, faCheckCircle, faLocationCrosshairs, faMoneyCheckDollar,
  faGaugeHigh, faGlobeAmericas, faCar, faSortNumericAsc, faCalendarDays,
  faCarAlt, faX
} from '@fortawesome/free-solid-svg-icons'
import RecordLog from './RecordLog'

const DUMMY_MAINTENANCE = [
  { id: 1, date: '2025-03-15', mileage: 48200, maintenance_repair: 'Maintenance', parts: 'Engine Oil, Filter', vehicleSide: 'Engine', serviceProvider: 'Jiffy Lube', serviceProviderLocation: 'Austin, TX', costOfService: 89.99, nextServiceDue: '2025-09', receipt_InvoiceNumber: 'INV-3812', note_Issues: '' },
  { id: 2, date: '2025-01-10', mileage: 45100, maintenance_repair: 'Repair', parts: 'Brake Pads', vehicleSide: 'Front Driver', serviceProvider: 'Midas', serviceProviderLocation: 'Austin, TX', costOfService: 240.00, nextServiceDue: '2026-01', receipt_InvoiceNumber: 'INV-2210', note_Issues: 'Squeaking noticed before service' },
  { id: 3, date: '2024-11-05', mileage: 42000, maintenance_repair: 'Maintenance', parts: 'Tires', vehicleSide: 'Front Driver', serviceProvider: 'Discount Tire', serviceProviderLocation: 'Round Rock, TX', costOfService: 520.00, nextServiceDue: '2026-11', receipt_InvoiceNumber: 'INV-0988', note_Issues: '' },
  { id: 4, date: '2024-08-22', mileage: 39500, maintenance_repair: 'Maintenance', parts: 'Coolant Flush', vehicleSide: 'Engine', serviceProvider: 'Firestone', serviceProviderLocation: 'Cedar Park, TX', costOfService: 115.00, nextServiceDue: '2026-08', receipt_InvoiceNumber: 'INV-0541', note_Issues: 'Temperature was running slightly high' },
]

const DUMMY_FUEL = [
  { id: 1, FuelDate: '2025-06-20', gallon_LiterPurchased: 13.4, pricePerGallon_Liter: 3.29, totalCost: 44.09, fuelType: 'Regular', gasStationName: 'Shell', gasStationLocation: 'Austin, TX', paymentMethod: 'Credit Card', odometerReading: 52100, tripPurpose: 'Commute' },
  { id: 2, FuelDate: '2025-06-06', gallon_LiterPurchased: 11.8, pricePerGallon_Liter: 3.35, totalCost: 39.53, fuelType: 'Regular', gasStationName: 'Exxon', gasStationLocation: 'Austin, TX', paymentMethod: 'Debit Card', odometerReading: 51640, tripPurpose: 'Road Trip' },
  { id: 3, FuelDate: '2025-05-22', gallon_LiterPurchased: 14.2, pricePerGallon_Liter: 3.19, totalCost: 45.30, fuelType: 'Regular', gasStationName: 'BP', gasStationLocation: 'San Antonio, TX', paymentMethod: 'Cash', odometerReading: 51200, tripPurpose: 'Road Trip' },
  { id: 4, FuelDate: '2025-05-08', gallon_LiterPurchased: 12.1, pricePerGallon_Liter: 3.41, totalCost: 41.26, fuelType: 'Regular', gasStationName: 'Chevron', gasStationLocation: 'Austin, TX', paymentMethod: 'Credit Card', odometerReading: 50780, tripPurpose: 'Commute' },
]

const DUMMY_VEHICLES = [
  { id: 1, year: 2021, make: 'Toyota', model: 'Camry', vin: '4T1B11HK5MU123456' },
  { id: 2, year: 2019, make: 'Honda', model: 'Civic', vin: '2HGFC2F57KH567890' },
]

const DUMMY_INSURANCE = [
  { id: 1, provider: 'State Farm', policyNumber: 'POL-8847231', coverageDetails: 'Full Coverage – Collision & Comprehensive', premiumPayment: 134.50, renewlDate: '2026-01-15' },
  { id: 2, provider: 'Geico', policyNumber: 'POL-3302918', coverageDetails: 'Liability Only', premiumPayment: 78.00, renewlDate: '2025-12-01' },
]

const sectionOptions = [
  { id: 'maintenance', label: 'Maintenance & Repair', icon: '🔧' },
  { id: 'fuel', label: 'Fuel Tracker', icon: '⛽' },
  { id: 'vehicle', label: 'Vehicle Info', icon: '🚗' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
]

const DataCard = ({ children, onDelete }) => (
  <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-colors group">
    <button
      onClick={onDelete}
      className="absolute top-3 right-3 w-7 h-7 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
    >
      <FontAwesomeIcon icon={faX} className="text-xs" />
    </button>
    <div className="space-y-1.5 text-sm">{children}</div>
  </div>
)

const Row = ({ icon, label, value, valueClass = 'text-gray-300' }) => (
  <div className="flex items-start gap-2">
    <FontAwesomeIcon icon={icon} className="text-gray-500 mt-0.5 w-4 flex-shrink-0" />
    {label && <span className="text-gray-400 min-w-[90px]">{label}:</span>}
    <span className={valueClass}>{value}</span>
  </div>
)

function VehicleTracker() {
  const [selectedSection, setSelectedSection] = useState('maintenance')
  const [mydata, setMyData] = useState([])
  const [myveData, setMyVeData] = useState([])
  const [myFuelData, setMyFuelData] = useState([])
  const [myInsurData, setMyInsurData] = useState([])
  const [sortOption, setSortOption] = useState('date')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8080/MaintenanceRepairs').then(r => r.json()).then(setMyData).catch(() => setMyData(DUMMY_MAINTENANCE))
  }, [])
  useEffect(() => {
    fetch('http://localhost:8080/vehicleInformations').then(r => r.json()).then(setMyVeData).catch(() => setMyVeData(DUMMY_VEHICLES))
  }, [])
  useEffect(() => {
    fetch('http://localhost:8080/FuelLogs').then(r => r.json()).then(setMyFuelData).catch(() => setMyFuelData(DUMMY_FUEL))
  }, [])
  useEffect(() => {
    fetch('http://localhost:8080/InsuranceLogs').then(r => r.json()).then(setMyInsurData).catch(() => setMyInsurData(DUMMY_INSURANCE))
  }, [])

  const deleteItem = async (url, id, setter, list) => {
    try {
      await fetch(`${url}/${id}`, { method: 'DELETE' })
      setter(list.filter(item => item.id !== id))
    } catch { alert('Delete failed') }
  }

  const sortedData = [...mydata].sort((a, b) =>
    sortOption === 'date' ? new Date(b.date) - new Date(a.date) : b.mileage - a.mileage
  )
  const sortedFuelData = [...myFuelData].sort((a, b) =>
    sortOption === 'date' ? new Date(a.FuelDate || a.date) - new Date(b.FuelDate || b.date) : a.odometerReading - b.odometerReading
  )

  const emptyState = (label) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-3">📭</div>
      <p className="text-gray-400">No {label} records yet</p>
      <button onClick={() => setShowAdd(true)} className="mt-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
        Add your first record →
      </button>
    </div>
  )

  return (
    <>
      <Navbar />
      <div className="bg-gray-950 min-h-screen">
        {/* Section selector */}
        <div className="border-b border-gray-800 bg-gray-950 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
              {sectionOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSection(opt.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedSection === opt.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
              <div className="ml-auto flex-shrink-0 flex items-center gap-3">
                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="mileage">Sort by Mileage</option>
                </select>
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {showAdd ? '✕ Close' : '+ Add Record'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Record Panel */}
        {showAdd && (
          <div className="border-b border-gray-800 bg-gray-900/50">
            <RecordLog />
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Maintenance */}
          {selectedSection === 'maintenance' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Maintenance & Repair Tracker</h2>
                <p className="text-gray-400 mt-1">Keep a record of all maintenance and repairs</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedData.length === 0 ? emptyState('maintenance') : sortedData.map((item) => (
                  <DataCard key={item.id} onDelete={() => deleteItem('http://localhost:8080/MaintenanceRepairs/delete', item.id, setMyData, mydata)}>
                    <div className="text-red-400 font-semibold text-base mb-2">
                      {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <Row icon={faDashboard} label="Mileage" value={item.mileage?.toLocaleString()} />
                    <Row icon={faWrench} label="Type" value={item.maintenance_repair} />
                    <Row icon={faGears} label="Parts" value={item.parts} />
                    <Row icon={faCarSide} label="Side" value={item.vehicleSide} />
                    <Row icon={faSearch} label="Provider" value={item.serviceProvider} />
                    <Row icon={faLocationDot} label="Location" value={item.serviceProviderLocation} />
                    <Row icon={faDollarSign} label="Cost" value={`$${item.costOfService}`} valueClass="text-green-400 font-medium" />
                    <Row icon={faCalendarXmark} label="Next Due" value={item.nextServiceDue} />
                    {item.note_Issues && <Row icon={faCircleInfo} label="Notes" value={item.note_Issues} valueClass="text-yellow-300" />}
                  </DataCard>
                ))}
              </div>
            </>
          )}

          {/* Fuel */}
          {selectedSection === 'fuel' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Fuel Tracker</h2>
                <p className="text-gray-400 mt-1">Monitor all your fuel logs</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedFuelData.length === 0 ? emptyState('fuel') : sortedFuelData.map((item) => (
                  <DataCard key={item.id} onDelete={() => deleteItem('http://localhost:8080/FuelLogs/delete', item.id, setMyFuelData, myFuelData)}>
                    <div className="text-red-400 font-semibold text-base mb-2">
                      {item.FuelDate || item.date}
                    </div>
                    <Row icon={faGasPump} label="Gallons" value={item.gallon_LiterPurchased} />
                    <Row icon={faDollar} label="Price/Gal" value={`$${item.pricePerGallon_Liter}`} />
                    <Row icon={faCheckCircle} label="Total" value={`$${item.totalCost}`} valueClass="text-green-400 font-medium" />
                    <Row icon={faGasPump} label="Type" value={item.fuelType} />
                    <Row icon={faSearch} label="Station" value={item.gasStationName} />
                    <Row icon={faLocationCrosshairs} label="Location" value={item.gasStationLocation} />
                    <Row icon={faMoneyCheckDollar} label="Payment" value={item.paymentMethod} />
                    <Row icon={faGaugeHigh} label="Odometer" value={item.odometerReading?.toLocaleString()} />
                    <Row icon={faGlobeAmericas} label="Purpose" value={item.tripPurpose} valueClass="text-green-400" />
                  </DataCard>
                ))}
              </div>
            </>
          )}

          {/* Vehicle Info */}
          {selectedSection === 'vehicle' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Vehicle Information</h2>
                <p className="text-gray-400 mt-1">Your registered vehicles</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myveData.length === 0 ? emptyState('vehicle') : myveData.map((item) => (
                  <DataCard key={item.id} onDelete={() => deleteItem('http://localhost:8080/vehicleInformations/delete', item.id, setMyVeData, myveData)}>
                    <div className="text-white font-bold text-xl mb-3">{item.year} {item.make} {item.model}</div>
                    <Row icon={faCarAlt} label="Make" value={item.make} />
                    <Row icon={faCarSide} label="Model" value={item.model} />
                    <Row icon={faCalendarAlt} label="Year" value={item.year} />
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <span className="text-gray-500 text-xs">VIN: </span>
                      <span className="text-gray-300 text-xs font-mono">{item.vin}</span>
                    </div>
                  </DataCard>
                ))}
              </div>
            </>
          )}

          {/* Insurance */}
          {selectedSection === 'insurance' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Insurance Information</h2>
                <p className="text-gray-400 mt-1">Track your insurance policies</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myInsurData.length === 0 ? emptyState('insurance') : myInsurData.map((item) => (
                  <DataCard key={item.id} onDelete={() => deleteItem('http://localhost:8080/InsuranceLogs/delete', item.id, setMyInsurData, myInsurData)}>
                    <div className="text-white font-bold text-lg mb-2">{item.provider}</div>
                    <Row icon={faCar} label="Provider" value={item.provider} />
                    <Row icon={faSortNumericAsc} label="Policy #" value={item.policyNumber} valueClass="text-red-300 font-medium" />
                    <Row icon={faDollarSign} label="Premium" value={`$${item.premiumPayment}`} valueClass="text-green-400 font-medium" />
                    <Row icon={faCircleInfo} label="Coverage" value={item.coverageDetails} />
                    <Row icon={faCalendarDays} label="Renewal" value={item.renewlDate} valueClass="text-red-300 font-medium" />
                  </DataCard>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default VehicleTracker
