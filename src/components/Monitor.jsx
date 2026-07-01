import React, { useState, useEffect, useCallback } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

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
  { id: 'd2', name: 'Brake Pads', amount: 240.00, type: 'Expense' },
  { id: 'd3', name: 'Insurance – July', amount: 134.50, type: 'Expense' },
  { id: 'd4', name: 'Mileage Reimb.', amount: 320.00, type: 'Income' },
  { id: 'd5', name: 'New Tires', amount: 520.00, type: 'Expense' },
  { id: 'd6', name: 'Fuel – June', amount: 128.92, type: 'Expense' },
  { id: 'd7', name: 'Delivery Income', amount: 450.00, type: 'Income' },
]

const PIE_COLORS = ['#dc2626', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ec4899']

const getWithExtras = (lsKey, dummy) => {
  try {
    const extras = JSON.parse(localStorage.getItem(lsKey) || '[]')
    return [...dummy, ...extras]
  } catch { return dummy }
}

const trunc = (str = '', n = 11) => str.length > n ? str.slice(0, n) + '…' : str

// Dark-themed tooltip for all charts
const DarkTooltip = ({ active, payload, label, dollar = true }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.fill || p.color || '#fff' }}>
          {p.name && <span className="text-gray-400 font-normal">{p.name}: </span>}
          {dollar && '$'}{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  )
}

const axisStyle = { fill: '#6b7280', fontSize: 11 }
const gridStyle = { stroke: '#1f2937' }

const StatCard = ({ label, value, sub, color = 'text-white' }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
  </div>
)

const ChartCard = ({ title, children }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
    <div className="px-5 py-3 border-b border-gray-800">
      <h3 className="text-gray-300 font-semibold text-xs uppercase tracking-widest">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
)

const SectionLabel = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-4 mt-8">
    <span className="text-base">{icon}</span>
    <h3 className="text-white font-bold text-base">{title}</h3>
    <div className="flex-1 h-px bg-gray-800 ml-2" />
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
      setMaintenance(m); setFuel(f); setVehicles(v); setInsurance(i); setExpenses(e)
    })
  }, [])

  useEffect(() => {
    loadData()
    window.addEventListener('vtracker-record-saved', loadData)
    return () => window.removeEventListener('vtracker-record-saved', loadData)
  }, [loadData])

  // Stat totals
  const maintenanceCost = maintenance.reduce((t, r) => t + (+r.costOfService || 0), 0)
  const fuelCost = fuel.reduce((t, r) => t + (+r.totalCost || 0), 0)
  const totalIncome = expenses.reduce((t, e) => e.type === 'Income' ? t + (+e.amount) : t, 0)
  const totalExpense = expenses.reduce((t, e) => e.type === 'Expense' ? t + (+e.amount) : t, 0)
  const balance = totalIncome - totalExpense

  // Chart data — Maintenance
  const maintBarData = maintenance.map(r => ({
    name: trunc(r.parts || r.maintenance_repair || 'Service'),
    Cost: +(r.costOfService || 0),
  }))
  const maintPieData = Object.entries(
    maintenance.reduce((acc, r) => {
      const k = r.maintenance_repair || 'Other'
      acc[k] = (acc[k] || 0) + (+r.costOfService || 0)
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Chart data — Fuel
  const fuelBarData = fuel.map(r => ({
    name: trunc(r.gasStationName || 'Fill-up', 8),
    Cost: +(r.totalCost || 0),
    Gallons: +(r.gallon_LiterPurchased || 0),
  }))
  const fuelPieData = Object.entries(
    fuel.reduce((acc, r) => {
      const k = r.fuelType || 'Unknown'
      acc[k] = (acc[k] || 0) + (+r.gallon_LiterPurchased || 0)
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Chart data — Expenses
  const expBarData = expenses.map(e => ({
    name: trunc(e.name, 13),
    Amount: +(e.amount || 0),
    type: e.type,
  }))
  const expPieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpense },
  ]

  // Chart data — Insurance
  const insurPieData = insurance.map(i => ({
    name: i.provider,
    value: +(i.premiumPayment || 0),
  }))

  const recentMaintenance = [...maintenance].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4)
  const recentFuel = [...fuel].sort((a, b) => new Date(b.FuelDate || b.date) - new Date(a.FuelDate || a.date)).slice(0, 4)

  return (
    <div className="bg-gray-950 pt-10 pb-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1 text-sm">Live summary of your vehicle data</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
          <StatCard label="Vehicles Tracked" value={vehicles.length} sub={vehicles.map(v => `${v.year} ${v.make}`).join(', ')} />
          <StatCard label="Maintenance Spend" value={`$${maintenanceCost.toFixed(2)}`} sub={`${maintenance.length} service records`} color="text-red-400" />
          <StatCard label="Fuel Spend" value={`$${fuelCost.toFixed(2)}`} sub={`${fuel.length} fill-ups logged`} color="text-yellow-400" />
          <StatCard label="Expense Balance" value={`${balance >= 0 ? '+' : ''}$${balance.toFixed(2)}`} sub={`In $${totalIncome.toFixed(2)} · Out $${totalExpense.toFixed(2)}`} color={balance >= 0 ? 'text-green-400' : 'text-red-400'} />
        </div>

        {/* ── Maintenance Charts ── */}
        <SectionLabel icon="🔧" title="Maintenance & Repairs" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <ChartCard title="Cost per Service">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={maintBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tickFormatter={v => `$${v}`} tick={axisStyle} width={48} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Cost" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Maintenance vs Repair (by spend)">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={maintPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {maintPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Fuel Charts ── */}
        <SectionLabel icon="⛽" title="Fuel Logs" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <ChartCard title="Cost per Fill-up">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fuelBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tickFormatter={v => `$${v}`} tick={axisStyle} width={48} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Gallons by Fuel Type">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={fuelPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {fuelPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip dollar={false} />} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Expense Charts ── */}
        <SectionLabel icon="💸" title="Expenses" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <ChartCard title="Income vs Expenses per Entry">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={expBarData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
                <XAxis dataKey="name" tick={axisStyle} />
                <YAxis tickFormatter={v => `$${v}`} tick={axisStyle} width={48} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="Amount" radius={[4, 4, 0, 0]}>
                  {expBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.type === 'Income' ? '#22c55e' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Total Income vs Total Expenses">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Insurance Charts ── */}
        <SectionLabel icon="🛡️" title="Insurance" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <ChartCard title="Monthly Premium by Provider">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={insurPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {insurPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800">
              <h3 className="text-gray-300 font-semibold text-xs uppercase tracking-widest">Active Policies</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {insurance.map((item, i) => (
                <div key={item.id || i} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-200 text-sm font-medium">{item.provider}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Policy #{item.policyNumber}{item.renewlDate ? ` · Renews ${item.renewlDate}` : ''}</p>
                  </div>
                  <span className="text-green-400 font-semibold text-sm">${(+item.premiumPayment || 0).toFixed(2)}<span className="text-gray-500 font-normal">/mo</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Records ── */}
        <SectionLabel icon="🕐" title="Recent Activity" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <span>🔧</span>
              <h3 className="text-white font-semibold text-sm">Recent Maintenance</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentMaintenance.map((item, i) => (
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

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
              <span>⛽</span>
              <h3 className="text-white font-semibold text-sm">Recent Fuel Fill-ups</h3>
            </div>
            <div className="divide-y divide-gray-800">
              {recentFuel.map((item, i) => (
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

      </div>
    </div>
  )
}

export default Monitor
