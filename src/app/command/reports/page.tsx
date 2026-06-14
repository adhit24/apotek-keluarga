'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  BarChart3, TrendingUp, Download, Clock, UserX, Star,
  UserPlus, RefreshCw, ChevronUp, ChevronDown, Activity,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 38200000 },
  { month: 'Feb', revenue: 41500000 },
  { month: 'Mar', revenue: 44800000 },
  { month: 'Apr', revenue: 39600000 },
  { month: 'Mei', revenue: 52100000 },
  { month: 'Jun', revenue: 58400000 },
]

const SERVICE_STATS = [
  { service: 'USG 4D',             count: 47,  revenue: 21150000, growth: '+12%' },
  { service: 'ANC Konsultasi',     count: 124, revenue: 18600000, growth: '+8%'  },
  { service: 'ANC + USG 2D',       count: 58,  revenue: 17400000, growth: '+15%' },
  { service: 'Fertility Program',  count: 18,  revenue: 15300000, growth: '+22%' },
  { service: 'USG 2D',             count: 72,  revenue: 10800000, growth: '+5%'  },
  { service: 'Konsultasi Pertama', count: 41,  revenue: 7175000,  growth: '+18%' },
]

const OPERATIONAL = {
  occupancyRate: 78,
  avgWaitTime: 14,
  noShowRate: 11,
  patientSatisfaction: 4.9,
  newPatientRate: 28,
  repeatVisitRate: 72,
}

const HOURLY_TRAFFIC = [
  { hour: '08', patients: 4  },
  { hour: '09', patients: 8  },
  { hour: '10', patients: 12 },
  { hour: '11', patients: 10 },
  { hour: '12', patients: 6  },
  { hour: '13', patients: 9  },
  { hour: '14', patients: 11 },
  { hour: '15', patients: 7  },
  { hour: '16', patients: 3  },
]

const HEALTH_SUBSCORES = [
  { label: 'Revenue Growth',   score: 92 },
  { label: 'Occupancy',        score: 78 },
  { label: 'Follow-up Rate',   score: 88 },
  { label: 'No Show Control',  score: 85 },
  { label: 'Repeat Visit',     score: 84 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtRp(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.0', '')}Jt`
  return `Rp ${(n / 1000).toFixed(0)}K`
}

// ─── FadeUp ───────────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────

function RevenueChart() {
  const maxRev = Math.max(...MONTHLY_REVENUE.map((d) => d.revenue))
  const MAX_H = 160

  return (
    <div className="flex items-end gap-3 pt-4">
      {MONTHLY_REVENUE.map((d, i) => {
        const heightPct = d.revenue / maxRev
        const targetH = Math.round(heightPct * MAX_H)
        const isLast = i === MONTHLY_REVENUE.length - 1

        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div
              className="relative w-full"
              style={{ height: MAX_H }}
            >
              <motion.div
                className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${isLast ? 'bg-rose' : 'bg-blush-deep'}`}
                initial={{ height: 0 }}
                whileInView={{ height: targetH }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-muted">{d.month}</div>
              <div className="text-[10px] font-semibold text-ink">{fmtRp(d.revenue)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Hourly Bar Chart ─────────────────────────────────────────────────────────

function HourlyChart() {
  const maxP = Math.max(...HOURLY_TRAFFIC.map((d) => d.patients))
  const MAX_H = 64

  return (
    <div className="flex items-end gap-2">
      {HOURLY_TRAFFIC.map((d) => {
        const h = Math.round((d.patients / maxP) * MAX_H)
        const isPeak = d.hour === '10'
        return (
          <div key={d.hour} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="relative w-full" style={{ height: MAX_H }}>
              <motion.div
                className={`absolute bottom-0 left-0 right-0 rounded-t-md ${isPeak ? 'bg-rose' : 'bg-blush'}`}
                initial={{ height: 0 }}
                whileInView={{ height: h }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
              />
            </div>
            <div className="text-[9px] font-medium text-muted">{d.hour}</div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Animated Progress Bar ────────────────────────────────────────────────────

function ProgressBar({ value, color = 'bg-rose' }: { value: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-cream rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SortKey = 'service' | 'count' | 'revenue'
type SortDir = 'asc' | 'desc'

export default function ReportsPage() {
  const [period, setPeriod] = useState<'Minggu Ini' | 'Bulan Ini' | 'Tahun Ini'>('Bulan Ini')
  const [sortKey, setSortKey] = useState<SortKey>('revenue')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...SERVICE_STATS].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av))
  })

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} className="opacity-30" />
    )

  return (
    <main className="p-4 md:p-6 space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="font-extrabold text-ink text-2xl">Reports</h1>
          <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
            {(['Minggu Ini', 'Bulan Ini', 'Tahun Ini'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  period === p
                    ? 'bg-ink text-white'
                    : 'bg-white text-muted border border-blush/30 hover:border-blush/60 hover:text-ink'
                }`}
              >
                {p}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5"
            >
              <Download size={13} />
              Export PDF
            </motion.button>
          </div>
        </div>
      </FadeUp>

      {/* ── Revenue Trend ───────────────────────────────────────── */}
      <FadeUp delay={0.05}>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="font-bold text-ink text-base">Revenue Trend</div>
              <div className="text-xs text-muted">Jan – Jun 2026</div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              Jun +12% vs Mei
            </span>
          </div>
          <RevenueChart />
        </div>
      </FadeUp>

      {/* ── Operational KPIs ────────────────────────────────────── */}
      <FadeUp delay={0.1}>
        <div>
          <div className="font-bold text-ink text-base mb-3">Operational KPIs</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            {/* Occupancy */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-rose" />
                <span className="text-xs text-muted font-medium">Occupancy Rate</span>
              </div>
              <div className="font-extrabold text-ink text-2xl mb-2">{OPERATIONAL.occupancyRate}%</div>
              <ProgressBar value={OPERATIONAL.occupancyRate} />
            </div>

            {/* Wait Time */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-sage-dark" />
                <span className="text-xs text-muted font-medium">Avg Wait Time</span>
              </div>
              <div className="font-extrabold text-ink text-2xl">
                {OPERATIONAL.avgWaitTime}
                <span className="text-base font-medium text-muted ml-1">mnt</span>
              </div>
            </div>

            {/* No Show */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <UserX size={14} className="text-amber-500" />
                <span className="text-xs text-muted font-medium">No Show Rate</span>
              </div>
              <div className="font-extrabold text-ink text-2xl">{OPERATIONAL.noShowRate}%</div>
              <ProgressBar value={OPERATIONAL.noShowRate} color="bg-amber-400" />
            </div>

            {/* Rating */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-amber-400" />
                <span className="text-xs text-muted font-medium">Patient Satisfaction</span>
              </div>
              <div className="font-extrabold text-ink text-2xl">
                {OPERATIONAL.patientSatisfaction}
                <span className="text-base font-medium text-muted ml-1">/5</span>
              </div>
            </div>

            {/* New Patient */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus size={14} className="text-emerald-600" />
                <span className="text-xs text-muted font-medium">New Patient Rate</span>
              </div>
              <div className="font-extrabold text-ink text-2xl">{OPERATIONAL.newPatientRate}%</div>
              <ProgressBar value={OPERATIONAL.newPatientRate} color="bg-emerald-400" />
            </div>

            {/* Repeat Visit */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={14} className="text-blue-500" />
                <span className="text-xs text-muted font-medium">Repeat Visit Rate</span>
              </div>
              <div className="font-extrabold text-ink text-2xl">{OPERATIONAL.repeatVisitRate}%</div>
              <ProgressBar value={OPERATIONAL.repeatVisitRate} color="bg-blue-400" />
            </div>

          </div>
        </div>
      </FadeUp>

      {/* ── Service Performance Table ───────────────────────────── */}
      <FadeUp delay={0.15}>
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-blush/20 flex items-center gap-2">
            <BarChart3 size={16} className="text-rose" />
            <span className="font-bold text-ink text-base">Service Performance</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blush/10">
                  {([
                    { key: 'service', label: 'Layanan' },
                    { key: 'count',   label: 'Kunjungan' },
                    { key: 'revenue', label: 'Revenue' },
                  ] as { key: SortKey; label: string }[]).map(({ key, label }) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide cursor-pointer hover:text-ink transition-colors select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <SortIcon k={key} />
                      </span>
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Growth</th>
                </tr>
              </thead>
              <AnimatePresence mode="wait">
                <motion.tbody
                  key={`${sortKey}-${sortDir}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {sorted.map((s) => (
                    <motion.tr
                      key={s.service}
                      className="border-b border-blush/10 last:border-0"
                      whileHover={{ backgroundColor: 'rgba(244,235,218,0.4)' }}
                    >
                      <td className="px-4 py-3 font-medium text-ink">{s.service}</td>
                      <td className="px-4 py-3 text-ink">{s.count}</td>
                      <td className="px-4 py-3 font-semibold text-sage-dark">{fmtRp(s.revenue)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <TrendingUp size={11} />
                          {s.growth}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </AnimatePresence>
            </table>
          </div>
        </div>
      </FadeUp>

      {/* ── Hourly Traffic ──────────────────────────────────────── */}
      <FadeUp delay={0.2}>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-ink text-base">Hourly Traffic</div>
              <div className="text-xs text-muted">Distribusi pasien per jam</div>
            </div>
            <span className="text-xs bg-rose/10 text-rose font-semibold px-2.5 py-1 rounded-full">
              Peak: 10:00
            </span>
          </div>
          <HourlyChart />
          <p className="text-xs text-muted mt-3 bg-cream rounded-lg px-3 py-2">
            Jam tersibuk: <span className="font-semibold text-ink">10:00</span> — pertimbangkan dokter tambahan
          </p>
        </div>
      </FadeUp>

      {/* ── Clinic Health Score ─────────────────────────────────── */}
      <FadeUp delay={0.25}>
        <div className="bg-white rounded-2xl p-5 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-bold text-ink text-base">Clinic Health Score</div>
              <div className="text-xs text-muted">Skor kesehatan operasional klinik</div>
            </div>
            <div className="text-center">
              <div className="font-extrabold text-4xl text-ink leading-none">87</div>
              <div className="text-xs text-muted font-medium">/100</div>
              <span className="inline-block mt-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Baik</span>
            </div>
          </div>
          <div className="space-y-4">
            {HEALTH_SUBSCORES.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink">{s.label}</span>
                  <span className="text-sm font-bold text-ink">{s.score}</span>
                </div>
                <ProgressBar value={s.score} color={s.score >= 90 ? 'bg-emerald-400' : s.score >= 80 ? 'bg-rose' : 'bg-amber-400'} />
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

    </main>
  )
}
