'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp, DollarSign, CreditCard, AlertTriangle,
  BarChart3, Users, ChevronUp,
} from 'lucide-react'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const REVENUE_TODAY  = 4200000
const REVENUE_WEEK   = 22800000
const REVENUE_MONTH  = 58400000
const REVENUE_YEAR   = 412000000

const SERVICE_BREAKDOWN = [
  { service: 'USG 4D',             revenue: 19856000, pct: 34, count: 47,  color: 'bg-rose' },
  { service: 'ANC Konsultasi',     revenue: 11680000, pct: 20, count: 124, color: 'bg-blush' },
  { service: 'ANC + USG 2D',       revenue: 8760000,  pct: 15, count: 58,  color: 'bg-sage' },
  { service: 'Fertility Program',  revenue: 7008000,  pct: 12, count: 18,  color: 'bg-burgundy/70' },
  { service: 'USG 2D',             revenue: 5840000,  pct: 10, count: 72,  color: 'bg-amber-400' },
  { service: 'Konsultasi Pertama', revenue: 2920000,  pct: 5,  count: 41,  color: 'bg-emerald-400' },
  { service: 'Lainnya',            revenue: 2336000,  pct: 4,  count: 22,  color: 'bg-ink/30' },
]

const TOP_PATIENTS = [
  { rank: 1, name: 'Yuni Astuti',    revenue: 13500000, visits: 25, tag: 'VIP' },
  { rank: 2, name: 'Ratna Sari',     revenue: 11200000, visits: 20, tag: 'VIP' },
  { rank: 3, name: 'Anisa Putri',    revenue: 9800000,  visits: 22, tag: 'VIP' },
  { rank: 4, name: 'Dewi Rahayu',    revenue: 8400000,  visits: 18, tag: 'High Risk' },
  { rank: 5, name: 'Siti Nurhaliza', revenue: 5250000,  visits: 12, tag: 'ANC' },
]

const WEEKLY_CHART = [
  { day: 'Sen', amount: 22800 },
  { day: 'Sel', amount: 31200 },
  { day: 'Rab', amount: 18600 },
  { day: 'Kam', amount: 27400 },
  { day: 'Jum', amount: 24100 },
  { day: 'Sab', amount: 15800 },
]

const PAYMENT_METHODS = [
  { method: 'Transfer Bank', pct: 42, amount: 24528000 },
  { method: 'QRIS',          pct: 28, amount: 16352000 },
  { method: 'Cash',          pct: 18, amount: 10512000 },
  { method: 'Kartu Debit',   pct: 8,  amount: 4672000  },
  { method: 'Asuransi',      pct: 4,  amount: 2336000  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function fmtShort(n: number) {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1_000_000)     return 'Rp ' + (n / 1_000_000).toFixed(1).replace('.', ',') + ' Jt'
  if (n >= 1_000)         return 'Rp ' + (n / 1_000).toFixed(0) + ' Rb'
  return fmt(n)
}

// ─── Animation Helpers ────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Tag badge for patients ───────────────────────────────────────────────────

function PatientTag({ tag }: { tag: string }) {
  const styles: Record<string, string> = {
    'VIP':       'bg-rose/10 text-rose',
    'High Risk': 'bg-amber-50 text-amber-700',
    'ANC':       'bg-sage/20 text-sage-dark',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[tag] ?? 'bg-cream text-muted'}`}>
      {tag}
    </span>
  )
}

// ─── Bar chart bar ────────────────────────────────────────────────────────────

function WeeklyBar({
  item,
  max,
  delay,
}: {
  item: typeof WEEKLY_CHART[0]
  max: number
  delay: number
}) {
  const [tooltip, setTooltip] = useState(false)
  const pct = (item.amount / max) * 100
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 flex-1 relative">
      {tooltip && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap z-10">
          Rp {item.amount.toLocaleString('id-ID')}
        </div>
      )}
      <div
        className="w-full flex items-end justify-center"
        style={{ height: 120 }}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={inView ? { height: `${pct}%` } : { height: 0 }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-t-lg bg-rose/80 hover:bg-rose cursor-pointer transition-colors"
          style={{ minHeight: 4 }}
        />
      </div>
      <span className="text-[11px] text-muted font-medium">{item.day}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Period = 'today' | 'week' | 'month' | 'year'

const PERIOD_TABS: { id: Period; label: string; value: number }[] = [
  { id: 'today', label: 'Hari Ini',   value: REVENUE_TODAY  },
  { id: 'week',  label: 'Minggu Ini', value: REVENUE_WEEK   },
  { id: 'month', label: 'Bulan Ini',  value: REVENUE_MONTH  },
  { id: 'year',  label: 'Tahun Ini',  value: REVENUE_YEAR   },
]

const weeklyMax = Math.max(...WEEKLY_CHART.map((d) => d.amount))

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>('month')
  const activeRevenue = PERIOD_TABS.find((t) => t.id === period)?.value ?? REVENUE_MONTH

  return (
    <main className="p-4 md:p-6">

      {/* ─── Header ─── */}
      <FadeUp className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h1 className="font-extrabold text-ink text-2xl">Revenue Center</h1>
            <p className="text-sm text-muted mt-0.5">Gambaran keuangan klinik secara lengkap</p>
          </div>
          {/* Period tabs */}
          <div className="flex items-center gap-1 sm:ml-auto bg-white rounded-xl p-1 border border-blush/30">
            {PERIOD_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  period === t.id
                    ? 'bg-rose text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── KPI Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: 'Revenue',
            value: fmtShort(activeRevenue),
            sub: PERIOD_TABS.find((t) => t.id === period)?.label,
            icon: TrendingUp,
            color: 'text-rose',
            bg: 'bg-rose/8',
            trend: '+18% vs periode lalu',
            up: true,
          },
          {
            label: 'Outstanding',
            value: 'Rp 850 Rb',
            sub: '2 invoice belum lunas',
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '>3 hari',
            up: false,
          },
          {
            label: 'Transaksi',
            value: '18',
            sub: 'hari ini',
            icon: CreditCard,
            color: 'text-sage-dark',
            bg: 'bg-sage/10',
            trend: '+3 dari kemarin',
            up: true,
          },
          {
            label: 'Forecast Bulan Ini',
            value: 'Rp 68,5 Jt',
            sub: 'tracking 6% di atas target',
            icon: BarChart3,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+6% dari target',
            up: true,
          },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <FadeUp key={card.label} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(58,42,44,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="bg-white rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon size={18} className={card.color} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-bold ${card.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {card.up ? <ChevronUp size={12} /> : null}
                    <span>{card.trend}</span>
                  </div>
                </div>
                <div className="font-extrabold text-ink text-xl mb-0.5 leading-none">{card.value}</div>
                <div className="text-sm font-semibold text-ink/70 mb-0.5">{card.label}</div>
                <div className="text-xs text-muted">{card.sub}</div>
              </motion.div>
            </FadeUp>
          )
        })}
      </div>

      {/* ─── Service Breakdown ─── */}
      <FadeUp delay={0.1} className="mb-6">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-blush/20">
            <DollarSign size={16} className="text-rose" />
            <h2 className="font-bold text-ink text-sm">Breakdown per Layanan</h2>
            <span className="text-xs text-muted ml-auto">Bulan Ini</span>
          </div>
          <div className="px-5 py-4 space-y-4">
            {SERVICE_BREAKDOWN.map((s, i) => (
              <ServiceBarRow key={s.service} item={s} delay={0.1 + i * 0.06} />
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ─── Weekly Bar Chart ─── */}
      <FadeUp delay={0.15} className="mb-6">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-blush/20">
            <BarChart3 size={16} className="text-rose" />
            <h2 className="font-bold text-ink text-sm">Revenue Harian (Minggu Ini)</h2>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-end gap-2">
              {WEEKLY_CHART.map((item, i) => (
                <WeeklyBar key={item.day} item={item} max={weeklyMax} delay={0.1 + i * 0.06} />
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ─── Bottom Two-Column ─── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Top Revenue Patients */}
        <FadeUp delay={0.2}>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-blush/20">
              <Users size={16} className="text-rose" />
              <h2 className="font-bold text-ink text-sm">Top Revenue Pasien</h2>
            </div>
            <div className="divide-y divide-blush/10">
              {TOP_PATIENTS.map((p, i) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: 'rgba(244,235,218,0.4)' }}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-default"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      p.rank === 1 ? 'bg-rose text-white' :
                      p.rank === 2 ? 'bg-blush text-burgundy' :
                      p.rank === 3 ? 'bg-sage/30 text-sage-dark' :
                      'bg-cream text-muted'
                    }`}
                  >
                    {p.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink truncate">{p.name}</span>
                      <PatientTag tag={p.tag} />
                    </div>
                    <div className="text-xs text-muted">{p.visits} kunjungan</div>
                  </div>
                  <div className="text-sm font-bold text-ink shrink-0">{fmtShort(p.revenue)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Payment Methods */}
        <FadeUp delay={0.22}>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-blush/20">
              <CreditCard size={16} className="text-rose" />
              <h2 className="font-bold text-ink text-sm">Metode Pembayaran</h2>
              <span className="text-xs text-muted ml-auto">Bulan Ini</span>
            </div>
            <div className="px-5 py-4 space-y-4">
              {PAYMENT_METHODS.map((m, i) => (
                <PaymentMethodRow key={m.method} item={m} delay={0.28 + i * 0.06} />
              ))}
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="h-6" />
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ServiceBarRow({
  item,
  delay,
}: {
  item: typeof SERVICE_BREAKDOWN[0]
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="w-36 shrink-0 text-sm font-medium text-ink/80 truncate">{item.service}</div>
      <div className="flex-1 h-2.5 bg-cream rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${item.pct}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${item.color}`}
        />
      </div>
      <div className="w-8 text-right text-xs font-bold text-ink/60 shrink-0">{item.pct}%</div>
      <div className="w-28 text-right text-xs font-semibold text-ink shrink-0 hidden sm:block">
        {fmt(item.revenue)}
      </div>
      <div className="w-16 text-right text-[11px] text-muted shrink-0 hidden md:block">
        {item.count} pasien
      </div>
    </div>
  )
}

function PaymentMethodRow({
  item,
  delay,
}: {
  item: typeof PAYMENT_METHODS[0]
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-ink">{item.method}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted hidden sm:block">{fmt(item.amount)}</span>
          <span className="text-sm font-bold text-ink w-8 text-right">{item.pct}%</span>
        </div>
      </div>
      <div className="h-2 bg-cream rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${item.pct}%` } : { width: 0 }}
          transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-rose"
        />
      </div>
    </div>
  )
}
