import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const DUMMY_EXPENSES = [
  { id: 1, name: 'Oil Change', amount: 89.99, type: 'Expense' },
  { id: 2, name: 'Brake Pads Replacement', amount: 240.00, type: 'Expense' },
  { id: 3, name: 'Insurance Premium – July', amount: 134.50, type: 'Expense' },
  { id: 4, name: 'Mileage Reimbursement', amount: 320.00, type: 'Income' },
  { id: 5, name: 'New Tires (Set of 4)', amount: 520.00, type: 'Expense' },
  { id: 6, name: 'Fuel – June', amount: 128.92, type: 'Expense' },
  { id: 7, name: 'Weekend Delivery Income', amount: 450.00, type: 'Income' },
]

const ExpenseTracker = () => {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [itemType, setItemType] = useState('')
  const [mydata, setMyData] = useState([])
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })

  useEffect(() => {
    fetch('http://localhost:8080/ExpensesLogs')
      .then(r => r.json())
      .then(setMyData)
      .catch(() => setMyData(DUMMY_EXPENSES))
  }, [])

  useEffect(() => {
    const totalIncome = mydata.reduce((t, e) => (e.type === 'Income' ? t + (+e.amount) : t), 0)
    const totalExpense = mydata.reduce((t, e) => (e.type === 'Expense' ? t + (+e.amount) : t), 0)
    setSummary({ totalIncome, totalExpense, balance: totalIncome - totalExpense })
  }, [mydata])

  const handleAddItem = async () => {
    if (!name || !amount || +amount <= 0 || !itemType) {
      alert('Please fill in all fields')
      return
    }
    const newItem = { name, amount: +amount, type: itemType }
    try {
      await Promise.all([
        fetch('https://sheetdb.io/api/v1/a270zvbrqge0t', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        }),
        fetch('http://localhost:8080/ExpensesLogs/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        }),
      ])
    } catch {}
    const saved = { ...newItem, id: Date.now() }
    setMyData(prev => [...prev, saved])
    try {
      const existing = JSON.parse(localStorage.getItem('vt_new_expenses') || '[]')
      localStorage.setItem('vt_new_expenses', JSON.stringify([...existing, saved]))
      window.dispatchEvent(new CustomEvent('vtracker-record-saved'))
    } catch {}
    setName(''); setAmount(''); setItemType('')
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/ExpensesLogs/delete/${id}`, { method: 'DELETE' })
    } catch {}
    setMyData(prev => prev.filter(e => e.id !== id))
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-950 min-h-screen pb-16">
        {/* Summary cards */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-white mb-6">Expense Tracker</h1>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${summary.balance.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Income</p>
              <p className="text-2xl font-bold text-green-400">${summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
              <p className="text-gray-400 text-sm mb-1">Expenses</p>
              <p className="text-2xl font-bold text-red-400">${summary.totalExpense.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add new entry */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">Add Entry</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                  <select
                    value={itemType}
                    onChange={e => setItemType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Select type...</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Oil change, Car wash..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-500"
                  />
                </div>
                <button
                  onClick={handleAddItem}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20"
                >
                  Add Entry
                </button>
              </div>

              {/* Spending breakdown chart */}
              {mydata.length > 0 && (() => {
                const max = Math.max(...mydata.map(e => +e.amount))
                return (
                  <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-3">Breakdown</p>
                    <div className="space-y-2">
                      {[...mydata]
                        .sort((a, b) => +b.amount - +a.amount)
                        .slice(0, 6)
                        .map((entry, i) => (
                          <div key={entry.id || i}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300 truncate max-w-[65%]">{entry.name}</span>
                              <span className={entry.type === 'Income' ? 'text-green-400' : 'text-red-400'}>
                                {entry.type === 'Income' ? '+' : '-'}${parseFloat(entry.amount).toFixed(2)}
                              </span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${entry.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: `${(+entry.amount / max) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Transactions table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-5">Transactions</h2>
              {mydata.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">💸</div>
                  No entries yet
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-800">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left text-gray-400 font-medium px-4 py-3">#</th>
                        <th className="text-left text-gray-400 font-medium px-4 py-3">Description</th>
                        <th className="text-right text-gray-400 font-medium px-4 py-3">Amount</th>
                        <th className="text-center text-gray-400 font-medium px-4 py-3">Type</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {mydata.map((entry, i) => (
                        <tr key={entry.id || i} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                          <td className="px-4 py-3 text-gray-200">{entry.name}</td>
                          <td className={`px-4 py-3 text-right font-medium ${entry.type === 'Income' ? 'text-green-400' : 'text-red-400'}`}>
                            ${parseFloat(entry.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              entry.type === 'Income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-gray-600 hover:text-red-500 transition-colors"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ExpenseTracker
