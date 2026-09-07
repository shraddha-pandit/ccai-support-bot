const THEMES = {
  Excellent: { ring: 'ring-green-400', bg: 'bg-green-50', text: 'text-green-700', star: '#22c55e' },
  Good:      { ring: 'ring-blue-400',  bg: 'bg-blue-50',  text: 'text-blue-700',  star: '#3b82f6' },
  Fair:      { ring: 'ring-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', star: '#f59e0b' },
  Poor:      { ring: 'ring-red-400',   bg: 'bg-red-50',   text: 'text-red-700',   star: '#ef4444' },
}

function Stars({ score, color }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i <= Math.round(score) ? color : '#e2e8f0'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function CSATBadge({ score, label }) {
  if (score === null) {
    return (
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="w-12 h-12 rounded-full ring-2 ring-slate-300 bg-white flex items-center justify-center">
          <span className="text-slate-400 font-bold text-lg">—</span>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">CSAT Score</p>
          <p className="text-sm text-slate-400">Awaiting interaction</p>
        </div>
      </div>
    )
  }

  const theme = THEMES[label] || THEMES.Fair

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${theme.bg} ring-1 ${theme.ring}`}>
      <div className={`w-12 h-12 rounded-full ring-2 ${theme.ring} bg-white flex items-center justify-center flex-shrink-0`}>
        <span className={`font-bold text-lg ${theme.text}`}>{score}</span>
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">CSAT Score</p>
        <p className={`text-sm font-semibold ${theme.text}`}>{label}</p>
        <Stars score={score} color={theme.star} />
      </div>
    </div>
  )
}
