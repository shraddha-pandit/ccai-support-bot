import { CUSTOMERS } from '../constants/customers'

const PLAN_COLORS = {
  Premium: 'bg-blue-100 text-blue-700',
  Enterprise: 'bg-purple-100 text-purple-700',
  Standard: 'bg-slate-100 text-slate-600',
  Basic: 'bg-green-100 text-green-700',
}

const STATUS_DOT = {
  Active: 'bg-green-500',
  Overdue: 'bg-red-500',
  Locked: 'bg-orange-500',
  'Pending Cancellation': 'bg-amber-500',
}

export function CustomerSelector({ selectedCustomerId, onSwitch }) {
  const selected = CUSTOMERS.find((c) => c.id === selectedCustomerId)

  return (
    <div className="p-3 border-b border-slate-200 bg-slate-50">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        Active Customer
      </label>
      <select
        value={selectedCustomerId}
        onChange={(e) => onSwitch(e.target.value)}
        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {CUSTOMERS.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.plan} ({c.status})
          </option>
        ))}
      </select>

      {selected && (
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${PLAN_COLORS[selected.plan] || 'bg-slate-100 text-slate-600'}`}
          >
            {selected.plan}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span
              className={`inline-block w-2 h-2 rounded-full ${STATUS_DOT[selected.status] || 'bg-slate-400'}`}
            />
            {selected.status}
          </span>
          <span className="text-xs text-slate-400 ml-auto font-mono">{selected.id}</span>
        </div>
      )}
    </div>
  )
}
