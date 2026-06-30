import React, { useState, useEffect, useCallback } from 'react'

const DUMMY_MAINTENANCE = [
  { id: 'd1', date: '2025-03-15', mileage: 48200, maintenance_repair: 'Maintenance', parts: 'Engine Oil, Filter', serviceProvider: 'Jiffy Lube', costOfService: 89.99 },
  { id: 'd2', date: '2025-01-10', mileage: 45100, maintenance_repair: 'Repair', parts: 'Brake Pads', serviceProvider: 'Midas', costOfService: 240.00 },
  { id: 'd3', date: '2024-11-05', mileage: 42000, maintenance_repair: 'Maintenance', parts: 'Tires', serviceProvider: 'Discount Tire', costOfService: 520.00 },
  { id: 'd4', date: '2024-08-22', mileage: 39500, maintenance_repair: 'Maintenance', parts: 'Coolant Flush', serviceProvider: 'Firestone', costOfService: 115.00 },
]

const DUMMY_FUEL = [
  { id: 'd1', FuelDate: '2025-06-20', totalCost: 44.09, fuelType: 'Regular', gasStationName: 'Shell', gallon_LiterPurchased: 13.4 },
  { id: 'd2', FuelDate: '2025-06-06', totalCost: 39.53, fuelType: 'Regular', gasStationName: 'Exxon', gallon_LiterPurchased: 11.8 },
  { id: 'd3', FuelDate: '2025-05-22', totalCost: 45.30, fuelType: 'Regular', gasStationName: 'BP', gallon_LiterPurchased: 14.2 },
  { id: 'd4', FuelDate: '2025-05-08', totalCost: 41.26, fuelType: 'Regular', gasStationName: 'Chevron', gallon_LiterPurchased: 12.1 },
]

const DUMMY_VEHICLES = [
  { id: 'd1', year: 2021, make: 'Toyota', model: 'Camry' },
  { id: 'd2', year: 2019, make: 'Honda', model: 'Civic' },
]

const DUMMY_INSURANCE = [
  { id: 'd1', provider: 'State Farm', policyNumber: 'POL-8847231', premiumPayment: 134.50, renewlDate: '2026-01-15' },
  { id: 'd2', provider: 'Geico', policyNumber: 'POL-3302918', premiumPayment: 78.00, renewlDate: '2025-12-01' },
]

const DUMMY_EXPENSES = [
  { id: 'd1', name: 'Oil Change', amount: 89.99, type: 'Expense' },
  { id: 'd2', name: 'Brake Pads Replacement', amount: 240.00, type: 'Expense' },
  { id: 'd3', name: 'Insurance Premium – July', amount: 134.50, type: 'Expense' },
  { id: 'd4', name: 'Mileage Reimbursement', amount: 320.00, type: 'Income' },
  { id: 'd5', name: 'New Tires (Set of 4)', amount: 520.00, type: 'Expense' },
  { id: 'd6', name: 'Fuel – June', amount: 128.92, type: 'Expense' },
  { id: 'd7', name: 'Weekend Delivery Income', amount: 450.00, type: 'Income' },
]

const getWithExtras = (lsKey, dummy) => {
  try {
    const extras = JSON.parse(localStorage.getItem(lsKey) || '[]')
    return [...dummy, ...extras]
  } catch { return dummy }
}

const StatCard = ({ label, value, sub, color = 'text-white' }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
  </div>
)

const Monitor = () => {
  const [maintenance, setMaintenance] = useState([])
  const [fuel, setFuel] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [insurance, setInsurance] = useState([])
  const [expenses, setExpenses] = useState([])

  const loadData = useCallback(() => {
    const tryFetch = (url, lsKey, dummy) =>
      fetch(url).then(r => r.json()).catch(() => getWithExtras(lsKey, dummy))

    Promise.all([
      tryFetch('http://localhost:8080/MaintenanceRepairs', 'vt_new_maintenance', DUMMY_MAINTENANCE),
      tryFetch('http://localhost:8080/FuelLogs', 'vt_new_fuel', DUMMY_FUEL),
      tryFetch('http://localhost:8080/vehicleInformations', 'vt_new_vehicles', DUMMY_VEHICLES),
      tryFetch('http://localhost:8080/InsuranceLogs', 'vt_new_insurance', DUMMY_INSURANCE),
      tryFetch('http://localhost:8080/ExpensesLogs', 'vt_new_expenses', DUMMY_EXPENSES),
    ]).then(([m, f, v, i, e]) => {
      setMaintenance(m)
      setFuel(f)
      setVehicles(v)
      setInsurance(i)
      setExpenses(e)
    })
  }, [])

  useEffect(() => {
    loadData()
    window.addEventListener('vtracker-record-saved', loadData)
    return () => window.removeEventListener('vtracker-record-saved', loadData)
  }, [loadData])

  const maintenanceCost = maintenance.reduce((t, r) => t + (+r.costOfService || 0), 0)
  const fuelCost = fuel.reduce((t, r) => t + (+r.totalCost || 0), 0)
  const totalIncome = expenses.reduce((t, e) => e.type === 'Income' ? t + (+e.amount) : t, 0)
  const totalExpense = expenses.reduce((t, e) => e.type === 'Expense' ? t + (+e.amount) : t, 0)
  const balance = totalIncome - totalExpense

  const recentMaintenance = [...maintenance]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  const recentFuel = [...fuel]
    .sort((a, b) => new Date(b.FuelDate || b.date) - new Date(a.FuelDate || a.date))
    .slice(0, 4)

  return (
    <div className="bg-gray-950 pt-10 pb-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1 text-sm">Live summary of your vehicle data</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Vehicles Tracked"
            value={vehicles.length}
            sub={vehicles.map(v => `${v.year} ${v.make}`).join(', ')}
          />
          <StatCard
            label="Maintenance Spend"
            value={`$${maintenanceCost.toFixed(2)}`}
            sub={`${maintenance.length} service records`}
            color="text-red-400"
          />
          <StatCard
            label="Fuel Spend"
            value={`$${fuelCost.toFixed(2)}`}
            sub={`${fuel.length} fill-ups logged`}
            color="text-yellow-400"
          />
          <StatCard
            label="Expense Balance"
            value={`${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}`}
            sub={`Income $${totalIncome.toFixed(2)} · Out $${totalExpense.toFixed(2)}`}
            color={balance >= 0 ? 'text-green-400' : 'text-red-400'}
          />
        </div>

        {/* Recent records grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Maintenance */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <span>🔧</span>
              <h3 className="text-white font-semibold text-sm">Recent Maintenance</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentMaintenance.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No records yet</p>
              ) : recentMaintenance.map((item, i) => (
                <div key={item.id || i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm font-medium">{item.parts || item.maintenance_repair}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      {item.serviceProvider ? ` · ${item.serviceProvider}` : ''}
                    </p>
                  </div>
                  <span className="text-red-400 font-semibold text-sm">${(+item.costOfService || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Fuel */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <span>⛽</span>
              <h3 className="text-white font-semibold text-sm">Recent Fuel Fill-ups</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentFuel.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">No records yet</p>
              ) : recentFuel.map((item, i) => (
                <div key={item.id || i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm font-medium">
                      {item.gasStationName || item.fuelType || 'Fill-up'}
                      {item.gallon_LiterPurchased ? ` · ${item.gallon_LiterPurchased} gal` : ''}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.FuelDate || item.date || '—'}
                      {item.fuelType ? ` · ${item.fuelType}` : ''}
                    </p>
                  </div>
                  <span className="text-yellow-400 font-semibold text-sm">${(+item.totalCost || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insurance summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <span>🛡️</span>
            <h3 className="text-white font-semibold text-sm">Active Insurance Policies</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {insurance.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No policies added yet</p>
            ) : insurance.map((item, i) => (
              <div key={item.id || i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-gray-200 text-sm font-medium">{item.provider}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Policy #{item.policyNumber}
                    {item.renewlDate ? ` · Renews ${item.renewlDate}` : ''}
                  </p>
                </div>
                <span className="text-green-400 font-semibold text-sm">${(+item.premiumPayment || 0).toFixed(2)}<span className="text-gray-500 font-normal">/mo</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitor
