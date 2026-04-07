import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const STATUS_CONFIG = {
  'Industry Ready': {
    color: 'emerald',
    icon: '✔',
    label: 'Industry Ready',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    glow: 'shadow-emerald-500/20',
    desc: 'Congratulations! You are well-prepared for the industry.',
  },
  'Almost Ready': {
    color: 'amber',
    icon: '⚠',
    label: 'Almost Ready',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    glow: 'shadow-amber-500/20',
    desc: 'Good progress! A few improvements will make you industry-ready.',
  },
  'Needs Improvement': {
    color: 'red',
    icon: '✖',
    label: 'Needs Improvement',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    glow: 'shadow-red-500/20',
    desc: 'Keep working hard! Focus on building skills and gaining experience.',
  },
}

function ScoreBar({ label, value, max, color }) {
  const pct = Math.round((Math.min(value, max) / max) * 100)
  const colorMap = {
    indigo: 'from-indigo-500 to-indigo-400',
    violet: 'from-violet-500 to-violet-400',
    sky: 'from-sky-500 to-sky-400',
    teal: 'from-teal-500 to-teal-400',
    fuchsia: 'from-fuchsia-500 to-fuchsia-400',
  }
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs w-28 text-right shrink-0">{label}</span>
      <div className="flex-1 bg-slate-700/60 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <span className="text-slate-300 text-xs w-12 font-semibold">{value}/{max}</span>
    </div>
  )
}

function HistoryCard({ record, index }) {
  const cfg = STATUS_CONFIG[record.status] || STATUS_CONFIG['Needs Improvement']
  return (
    <div className={`bg-slate-800/40 border rounded-xl p-4 flex items-center justify-between gap-4 ${cfg.border}`}>
      <div className="flex items-center gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center text-sm ${cfg.text}`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 text-sm font-semibold truncate">Assessment #{index + 1}</p>
          <p className="text-slate-500 text-xs truncate">CGPA {record.cgpa} · Internships {record.internships}</p>
          <div className="flex gap-2 mt-1">
            {record.technicalSkills && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 truncate max-w-[100px]" title={record.technicalSkills}>Tech: {record.technicalSkills}</span>}
            {record.certificationsList && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300 truncate max-w-[100px]" title={record.certificationsList}>Certs: {record.certificationsList}</span>}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xl font-bold ${cfg.text}`}>{record.totalScore}<span className="text-xs text-slate-500 font-normal">/100</span></p>
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${cfg.badge}`}>{record.status}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('irss_user') || '{}')

  const [form, setForm] = useState({
    cgpa: '',
    technicalSkills: '',
    nonTechnicalSkills: '',
    internships: 0,
    certificationsList: '',
    projectsList: '',
  })
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user.userId) { navigate('/login'); return }
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${API}/scores/${user.userId}`, { credentials: 'include' })
      const data = await res.json()
      setHistory(Array.isArray(data) ? data : [])
    } catch (e) {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch(`${API}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.userId,
          cgpa: parseFloat(form.cgpa),
          technicalSkills: form.technicalSkills,
          nonTechnicalSkills: form.nonTechnicalSkills,
          internships: parseInt(form.internships),
          certificationsList: form.certificationsList,
          projectsList: form.projectsList,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data)
        await fetchHistory()
      } else {
        setError(data.message || 'Score calculation failed.')
      }
    } catch (e) {
      setError('Unable to connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const cfg = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG['Needs Improvement']) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">Industry Readiness Dashboard</h2>
          <p className="text-slate-400 mt-1 text-sm">Fill in your academic and professional details in the form to get your readiness score.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT: Input Form ── */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              Your Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-2">
                  <span>CGPA <span className="text-slate-500 font-normal">(0.0 – 10.0)</span></span>
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">Max 25 pts</span>
                </label>
                <input
                  type="number"
                  value={form.cgpa}
                  onChange={e => setForm({ ...form, cgpa: e.target.value })}
                  min="0" max="10" step="0.01"
                  required
                  placeholder="e.g. 8.5"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-1">
                  <span>Technical Skills</span>
                  <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">Max 12 pts</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">Separate skills with commas (e.g. Java, Python, React)</p>
                <input
                  type="text"
                  value={form.technicalSkills}
                  onChange={e => setForm({ ...form, technicalSkills: e.target.value })}
                  placeholder="e.g. Java, Python, C++, React"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-1">
                  <span>Non-Technical Skills</span>
                  <span className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">Max 8 pts</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">Separate skills with commas (e.g. Leadership, Communication)</p>
                <input
                  type="text"
                  value={form.nonTechnicalSkills}
                  onChange={e => setForm({ ...form, nonTechnicalSkills: e.target.value })}
                  placeholder="e.g. Leadership, Communication, Agile"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-1">
                  <span>Certifications</span>
                  <span className="text-xs text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">Max 15 pts</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">List certificates (e.g. AWS Cloud, Oracle Java)</p>
                <input
                  type="text"
                  value={form.certificationsList}
                  onChange={e => setForm({ ...form, certificationsList: e.target.value })}
                  placeholder="e.g. AWS Certified Developer, Oracle DBA"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-1">
                  <span>Projects Finished</span>
                  <span className="text-xs text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-full">Max 20 pts</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2">List major projects (e.g. Chat App, IRSS System)</p>
                <input
                  type="text"
                  value={form.projectsList}
                  onChange={e => setForm({ ...form, projectsList: e.target.value })}
                  placeholder="e.g. React Chat App, E-commerce API"
                  className="w-full bg-slate-900/80 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-slate-300 text-sm font-medium mb-2">
                  <span>Internships Completed <span className="text-slate-500 font-normal">(0 – 5)</span></span>
                  <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">Max 20 pts</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="0" max="5" value={form.internships}
                    onChange={e => setForm({ ...form, internships: e.target.value })}
                    className="flex-1 accent-sky-500 cursor-pointer"
                  />
                  <span className="w-8 text-center text-white font-bold text-sm">{form.internships}</span>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="calculate-score-btn"
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Calculate Readiness
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: Score Result ── */}
          <div className="space-y-6">
            {result && cfg ? (
              <div className={`bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl ${cfg.border} ${cfg.glow} shadow-lg transition-all`}>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-4xl ${cfg.bg} border-2 ${cfg.border} mb-4 shadow-lg`}>
                    {cfg.icon}
                  </div>
                  <div className={`text-6xl font-black ${cfg.text} leading-none`}>
                    {result.totalScore}
                    <span className="text-xl text-slate-500 font-normal">/100</span>
                  </div>
                  <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${cfg.badge}`}>
                    {cfg.icon} {cfg.label}
                  </div>
                  <p className={`mt-3 text-sm ${cfg.text} opacity-80`}>{cfg.desc}</p>
                </div>

                <div className="border-t border-slate-700/50 pt-5 space-y-3">
                  <h4 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">Score Breakdown</h4>
                  <ScoreBar label="CGPA" value={result.breakdown.cgpaScore} max={25} color="indigo" />
                  <ScoreBar label="Skills (All)" value={result.breakdown.skillsScore} max={20} color="violet" />
                  <ScoreBar label="Internships" value={result.breakdown.internshipsScore} max={20} color="sky" />
                  <ScoreBar label="Certifications" value={result.breakdown.certScore} max={15} color="teal" />
                  <ScoreBar label="Projects" value={result.breakdown.projectsScore} max={20} color="fuchsia" />
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-slate-400 font-medium">No Score Yet</h4>
                <p className="text-slate-600 text-sm mt-1">Fill out your skills, projects, and other metrics to generate a score.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── History ── */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <span className="w-7 h-7 bg-slate-700/60 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Detailed Assessment History
            </h3>
            {history.length > 0 && (
              <span className="text-slate-500 text-sm">{history.length} record{history.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {historyLoading ? (
            <div className="text-center py-10 text-slate-500 text-sm">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-8 text-center">
              <p className="text-slate-500 text-sm">No assessments recorded. Submit your first score above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, i) => (
                <HistoryCard key={record.id} record={record} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
