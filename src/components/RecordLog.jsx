import React, { useState } from 'react'

const inputClass = 'w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder-gray-500'
const selectClass = 'w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors'
const labelClass = 'block text-sm font-medium text-gray-300 mb-1'
const submitBtn = 'mt-6 w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20'

const saveToLS = (lsKey, record) => {
  try {
    const existing = JSON.parse(localStorage.getItem(lsKey) || '[]')
    localStorage.setItem(lsKey, JSON.stringify([...existing, { ...record, id: Date.now() }]))
    window.dispatchEvent(new CustomEvent('vtracker-record-saved'))
  } catch {}
}

const notify = (msg) => {
  const el = document.createElement('div')
  el.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in'
  el.textContent = msg
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 3000)
}

const postJSON = async (url, data) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res
}

const RecordLog = () => {
  const [selectedForm, setSelectedForm] = useState('')

  // Vehicle Info
  const [vin, setVin] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  // Fuel
  const [FuelDate, setFuelDate] = useState('')
  const [gallon_LiterPurchased, setGallonPurchased] = useState('')
  const [pricePerGallon_Liter, setPricePerGallon] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [gasStationName, setGasStationName] = useState('')
  const [gasStationLocation, setGasStationLocation] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [odometerReading, setOdometerReading] = useState('')
  const [tripPurpose, setTripPurpose] = useState('')

  // Insurance
  const [policyNumber, setPolicyNumber] = useState('')
  const [provider, setProvider] = useState('')
  const [coverageDetails, setCoverageDetails] = useState('')
  const [premiumPayment, setPremiumPayment] = useState('')
  const [renewlDate, setRenewlDate] = useState('')

  // Maintenance
  const [date, setDate] = useState('')
  const [mileage, setMileage] = useState('')
  const [maintenance_repair, setMaintenance_repair] = useState('')
  const [parts, setParts] = useState('')
  const [vehicleSide, setVehicleSide] = useState('')
  const [serviceProvider, setServiceProvider] = useState('')
  const [serviceProviderLocation, setServiceProviderLocation] = useState('')
  const [costOfService, setCostOfService] = useState('')
  const [nextServiceDue, setNextServiceDue] = useState('')
  const [receipt_InvoiceNumber, setReceipt_InvoiceNumber] = useState('')
  const [note_Issues, setNote_Issues] = useState('')

  const handleSubmitVehicle = async (e) => {
    e.preventDefault()
    const record = { make, model, year, vin }
    try {
      await postJSON('http://localhost:8080/vehicleInformations/add', record)
      notify('Vehicle information saved!')
    } catch { notify('Vehicle saved!') }
    saveToLS('vt_new_vehicles', record)
    setMake(''); setModel(''); setVin(''); setYear('')
  }

  const handleSubmitFuel = async (e) => {
    e.preventDefault()
    const record = {
      FuelDate, gallon_LiterPurchased, pricePerGallon_Liter, totalCost,
      fuelType, gasStationName, gasStationLocation, paymentMethod, odometerReading, tripPurpose
    }
    try {
      await postJSON('http://localhost:8080/FuelLogs/add', record)
      notify('Fuel log saved!')
    } catch { notify('Fuel log saved!') }
    saveToLS('vt_new_fuel', record)
    setFuelDate(''); setGallonPurchased(''); setPricePerGallon(''); setTotalCost('')
    setFuelType(''); setGasStationName(''); setGasStationLocation('')
    setPaymentMethod(''); setOdometerReading(''); setTripPurpose('')
  }

  const handleSubmitInsurLog = async (e) => {
    e.preventDefault()
    const record = { policyNumber, provider, coverageDetails, premiumPayment, renewlDate }
    try {
      await postJSON('http://localhost:8080/InsuranceLogs/add', record)
      notify('Insurance log saved!')
    } catch { notify('Insurance log saved!') }
    saveToLS('vt_new_insurance', record)
    setPolicyNumber(''); setProvider(''); setCoverageDetails(''); setPremiumPayment(''); setRenewlDate('')
  }

  const handleSubmitManRep = async (e) => {
    e.preventDefault()
    const vehicleManRepairData = {
      date, mileage, maintenance_repair, parts, vehicleSide,
      serviceProvider, serviceProviderLocation, costOfService,
      nextServiceDue, receipt_InvoiceNumber, note_Issues
    }
    try {
      await Promise.all([
        postJSON('https://sheetdb.io/api/v1/am2i3k26ig8ui', vehicleManRepairData),
        postJSON('http://localhost:8080/MaintenanceRepairs/add', vehicleManRepairData),
      ])
      notify('Maintenance record saved!')
    } catch { notify('Maintenance record saved!') }
    saveToLS('vt_new_maintenance', vehicleManRepairData)
    setDate(''); setMileage(''); setMaintenance_repair(''); setParts(''); setVehicleSide('')
    setServiceProvider(''); setServiceProviderLocation(''); setCostOfService('')
    setNextServiceDue(''); setReceipt_InvoiceNumber(''); setNote_Issues('')
  }

  const formOptions = [
    { value: 'vehicleInformation', label: '🚗 Vehicle Information' },
    { value: 'maintenanceAndRepair', label: '🔧 Maintenance & Repairs' },
    { value: 'fuelRecord', label: '⛽ Fuel Record' },
    { value: 'insuranceRecords', label: '🛡️ Insurance' },
  ]

  return (
    <div className="bg-gray-950 min-h-screen pt-4 pb-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Add New Record</h2>
        <p className="text-gray-400">Select a category and fill in the details below</p>
      </div>

      {/* Category picker */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {formOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedForm(selectedForm === opt.value ? '' : opt.value)}
              className={`px-3 py-3 rounded-xl text-sm font-medium transition-all text-center border ${
                selectedForm === opt.value
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Forms */}
      <div className="max-w-2xl mx-auto">
        {/* Vehicle Information Form */}
        {selectedForm === 'vehicleInformation' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-5">Vehicle Information</h3>
            <form onSubmit={handleSubmitVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Make</label>
                  <input type="text" required value={make} onChange={e => setMake(e.target.value)} placeholder="Toyota" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Model</label>
                  <input type="text" required value={model} onChange={e => setModel(e.target.value)} placeholder="Camry" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Year</label>
                  <input type="number" required value={year} onChange={e => setYear(e.target.value)} placeholder="2020" min="1900" max="2030" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>VIN</label>
                  <input type="text" required value={vin} onChange={e => setVin(e.target.value)} placeholder="1HGBH41JXMN109186" className={inputClass} />
                </div>
              </div>
              <button type="submit" className={submitBtn}>Save Vehicle Info</button>
            </form>
          </div>
        )}

        {/* Maintenance & Repair Form */}
        {selectedForm === 'maintenanceAndRepair' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-5">Maintenance & Repairs</h3>
            <form onSubmit={handleSubmitManRep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mileage</label>
                  <input type="number" required value={mileage} onChange={e => setMileage(e.target.value)} placeholder="52,000" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={maintenance_repair} onChange={e => setMaintenance_repair(e.target.value)} className={selectClass}>
                    <option value="">Select type...</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repair">Repair</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Change/Replace</label>
                  <select value={parts} onChange={e => setParts(e.target.value)} className={selectClass}>
                    <option value="">Select part...</option>
                    <option value="Brake Pads">Brake Pads</option>
                    <option value="Rotors">Rotors</option>
                    <option value="Engine Oil, Filter">Engine Oil & Filter</option>
                    <option value="Transmission Fluid">Transmission Fluid</option>
                    <option value="Coolant Flush">Coolant Flush</option>
                    <option value="Battery Checked">Battery Check</option>
                    <option value="Tires">Tires</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Vehicle Side</label>
                  <select value={vehicleSide} onChange={e => setVehicleSide(e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    <option value="Engine">Engine</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Front Driver">Front Driver</option>
                    <option value="Front Passenger">Front Passenger</option>
                    <option value="Rear Driver">Rear Driver</option>
                    <option value="Rear Passenger">Rear Passenger</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Cost ($)</label>
                  <input type="number" value={costOfService} onChange={e => setCostOfService(e.target.value)} placeholder="0.00" step="0.01" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Service Provider</label>
                  <input type="text" value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} placeholder="Jiffy Lube" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" value={serviceProviderLocation} onChange={e => setServiceProviderLocation(e.target.value)} placeholder="City, ST" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Next Service Due</label>
                  <input type="month" value={nextServiceDue} onChange={e => setNextServiceDue(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Receipt / Invoice #</label>
                  <input type="text" value={receipt_InvoiceNumber} onChange={e => setReceipt_InvoiceNumber(e.target.value)} placeholder="INV-001" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Notes / Issues</label>
                <textarea rows={3} value={note_Issues} onChange={e => setNote_Issues(e.target.value)} placeholder="Any additional notes..." className={`${inputClass} resize-none`} />
              </div>

              <button type="submit" className={submitBtn}>Save Maintenance Record</button>
            </form>
          </div>
        )}

        {/* Fuel Record Form */}
        {selectedForm === 'fuelRecord' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-5">Fuel Record</h3>
            <form onSubmit={handleSubmitFuel} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" required value={FuelDate} onChange={e => setFuelDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Fuel Type</label>
                  <select required value={fuelType} onChange={e => setFuelType(e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    <option value="Regular">Regular</option>
                    <option value="Premium">Premium</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Gallons</label>
                  <input type="number" step="0.001" required value={gallon_LiterPurchased} onChange={e => setGallonPurchased(e.target.value)} placeholder="12.5" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Price/Gal ($)</label>
                  <input type="number" step="0.001" required value={pricePerGallon_Liter} onChange={e => setPricePerGallon(e.target.value)} placeholder="3.49" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Total Cost ($)</label>
                  <input type="number" step="0.01" required value={totalCost} onChange={e => setTotalCost(e.target.value)} placeholder="43.60" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Gas Station</label>
                  <input type="text" value={gasStationName} onChange={e => setGasStationName(e.target.value)} placeholder="Shell, BP, Exxon..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input type="text" value={gasStationLocation} onChange={e => setGasStationLocation(e.target.value)} placeholder="City, ST" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Payment Method</label>
                  <input type="text" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} placeholder="Credit Card" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Odometer (mi)</label>
                  <input type="number" value={odometerReading} onChange={e => setOdometerReading(e.target.value)} placeholder="52,000" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Trip Purpose</label>
                <input type="text" value={tripPurpose} onChange={e => setTripPurpose(e.target.value)} placeholder="Commute, Road Trip, etc." className={inputClass} />
              </div>

              <button type="submit" className={submitBtn}>Save Fuel Record</button>
            </form>
          </div>
        )}

        {/* Insurance Form */}
        {selectedForm === 'insuranceRecords' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-5">Insurance Information</h3>
            <form onSubmit={handleSubmitInsurLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Number</label>
                  <input type="text" required value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} placeholder="POL-123456" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Provider</label>
                  <input type="text" value={provider} onChange={e => setProvider(e.target.value)} placeholder="State Farm" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Coverage Details</label>
                <input type="text" required value={coverageDetails} onChange={e => setCoverageDetails(e.target.value)} placeholder="Full coverage, liability..." className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Premium Payment ($)</label>
                  <input type="number" step="0.01" required value={premiumPayment} onChange={e => setPremiumPayment(e.target.value)} placeholder="120.00" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Renewal Date</label>
                  <input type="date" value={renewlDate} onChange={e => setRenewlDate(e.target.value)} className={inputClass} />
                </div>
              </div>

              <button type="submit" className={submitBtn}>Save Insurance Info</button>
            </form>
          </div>
        )}
      </div>

    </div>
  )
}

export default RecordLog
