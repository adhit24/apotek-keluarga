'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Calendar, FileText, Baby,
  Bell, DollarSign, ShoppingCart,
  BarChart3, Sparkles,
  Activity, Clock, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight, ChevronRight,
  Phone, Zap, CircleDot, Users, Package,
} from 'lucide-react'
import Link from 'next/link'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { label: 'Appointments Hari Ini', value: '18', icon: Calendar,      color: 'text-rose',       bg: 'bg-rose/8',       trend: '+3 dari kemarin',      up: true  },
  { label: 'Sudah Check-In',        value: '12', icon: CheckCircle2,  color: 'text-sage-dark',  bg: 'bg-sage/10',      trend: '4 belum hadir',        up: null  },
  { label: 'Menunggu',              value: '4',  icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50',     trend: '~15 mnt rata-rata',    up: null  },
  { label: 'Konsultasi Selesai',    value: '8',  icon: CheckCircle2,  color: 'text-emerald-600',bg: 'bg-emerald-50',   trend: '44% dari target',      up: true  },
  { label: 'No Show',               value: '2',  icon: XCircle,       color: 'text-burgundy',   bg: 'bg-burgundy/8',   trend: '-1 dari kemarin',      up: true  },
  { label: 'Revenue Hari Ini',      value: 'Rp 4,2 Jt', icon: TrendingUp, color: 'text-rose',  bg: 'bg-rose/8',       trend: '+18% vs hari ini',     up: true  },
  { label: 'Outstanding',           value: 'Rp 850 Rb', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', trend: '2 invoice > 3 hari', up: false },
  { label: 'Follow-Up Jatuh Tempo', value: '7',  icon: Bell,          color: 'text-burgundy',   bg: 'bg-burgundy/8',   trend: '3 urgent hari ini',    up: false },
  { label: 'Antrian Aktif',         value: '4',  icon: Activity,      color: 'text-rose',       bg: 'bg-rose/8',       trend: 'A-009 sedang dilayani',up: null  },
]

const ACTION_ITEMS = [
  { level: 'urgent', icon: Baby,       label: '3 pasien ANC melewatkan jadwal kontrol',  action: 'Kirim WA' },
  { level: 'urgent', icon: XCircle,    label: '2 appointment no-show belum difollow-up', action: 'Hubungi' },
  { level: 'warn',   icon: DollarSign, label: 'Invoice Siti N. outstanding 4 hari',      action: 'Tagih' },
  { level: 'warn',   icon: Package,    label: 'Stok Vitamin B Complex < 10 pcs',         action: 'Order' },
  { level: 'info',   icon: Bell,       label: '5 pasien butuh follow-up minggu ini',      action: 'Lihat' },
]

const AI_INSIGHTS = [
  { icon: TrendingUp, text: 'USG 4D berkontribusi 34% dari revenue bulan ini — performa tertinggi', highlight: '34%' },
  { icon: Clock,      text: 'Selasa pagi (08-11) adalah jam paling padat — pertimbangkan slot tambahan', highlight: 'Selasa pagi' },
  { icon: FileText,   text: '12 pasien ANC membutuhkan follow-up aktif minggu ini', highlight: '12 pasien' },
  { icon: TrendingUp, text: 'Forecast revenue bulan ini: Rp 68.500.000 — tracking 6% di atas target', highlight: 'Rp 68,5 Jt' },
  { icon: Users,      text: 'Pasien baru dari Google meningkat 23% dibanding bulan lalu', highlight: '+23%' },
]

const QUEUE_LIVE = [
  { num: 'A-007', name: 'Rina Dewi',       service: 'USG 4D',               status: 'completed',       duration: '18 mnt' },
  { num: 'A-008', name: 'Ayu Lestari',     service: 'ANC Konsultasi',       status: 'completed',       duration: '22 mnt' },
  { num: 'A-009', name: 'Siti Nurhaliza',  service: 'ANC + USG 2D',         status: 'in-consultation', duration: '12 mnt' },
  { num: 'A-010', name: 'Dewi Rahayu',     service: 'Konsultasi Kehamilan', status: 'called',          duration: '—' },
  { num: 'A-011', name: 'Putri Anggraini', service: 'USG 4D',               status: 'waiting',         duration: '—' },
  { num: 'A-012', name: 'Nur Azizah',      service: 'Fertility Program',    status: 'waiting',         duration: '—' },
]

const STATUS_STYLE: Record<string, string> = {
  'completed':       'bg-emerald-50 text-emerald-700',
  'in-consultation': 'bg-rose/10 text-rose font-bold',
  'called':          'bg-amber-50 text-amber-700',
  'waiting':         'bg-cream text-muted',
}
const STATUS_LABEL: Record<string, string> = {
  'completed':       'Selesai',
  'in-consultation': 'Konsultasi',
  'called':          'Dipanggil',
  'waiting':         'Menunggu',
}

// ─── Animation helpers ────────────────────────────────────────────────────────

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

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ card, delay }: { card: typeof KPI_CARDS[0]; delay: number }) {
  const Icon = card.icon
  return (
    <FadeUp delay={delay}>
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(58,42,44,0.08)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-white rounded-2xl p-5 h-full"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
            <Icon size={18} className={card.color} />
          </div>
          {card.up !== null && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                card.up ? 'text-emerald-600' : 'text-burgundy'
              }`}
            >
              {card.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            </div>
          )}
        </div>
        <div className="font-extrabold text-ink text-2xl mb-1 leading-none">{card.value}</div>
        <div className="text-sm font-semibold text-ink/70 mb-2">{card.label}</div>
        <div className="text-xs text-muted">{card.trend}</div>
      </motion.div>
    </FadeUp>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandCenter() {
  return (
    <main className="px-4 md:px-6 py-6">

      {/* ─── Today's Overview ─── */}
      <FadeUp className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-ink text-lg">Overview Hari Ini</h2>
            <p className="text-xs text-muted">Minggu, 15 Juni 2026 · Update otomatis setiap menit</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted bg-white px-3 py-1.5 rounded-full border border-blush/30">
            <Clock size={11} />
            <span>08:00 – 16:00</span>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mb-8">
        {KPI_CARDS.map((card, i) => (
          <KpiCard key={card.label} card={card} delay={i * 0.04} />
        ))}
        {/* Clinic Health Score card */}
        <FadeUp delay={0.36}>
          <motion.div
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(194,104,94,0.12)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="bg-ink rounded-2xl p-5 h-full col-span-2 md:col-span-1"
          >
            <div className="text-xs text-white/40 uppercase tracking-widest mb-3">
              Clinic Health Score
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="font-extrabold text-white text-4xl leading-none">87</span>
              <span className="text-white/40 text-sm mb-1">/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="h-full rounded-full bg-blush"
              />
            </div>
            <div className="text-xs text-emerald-400 font-semibold">Sangat Baik</div>
          </motion.div>
        </FadeUp>
      </div>

      {/* ─── Live Status + Action Center ─── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">

        {/* Live Clinic Status */}
        <FadeUp delay={0.1}>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-blush/20">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-rose" />
                <h3 className="font-bold text-ink text-sm">Live Clinic Status</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <CircleDot size={10} className="animate-pulse" />
                Live
              </div>
            </div>

            {/* Status row */}
            <div className="grid grid-cols-3 divide-x divide-blush/20 border-b border-blush/20">
              {[
                { label: 'Dokter',     value: 'Aktif',   sub: 'dr. Wildan',   color: 'text-emerald-600' },
                { label: 'Antrian ke-',value: 'A-009',   sub: 'Dari 12 nomor',color: 'text-rose' },
                { label: 'Est. Tunggu',value: '~15 mnt', sub: 'Per pasien',   color: 'text-ink' },
              ].map((s) => (
                <div key={s.label} className="px-4 py-3 text-center">
                  <div className={`font-extrabold text-sm ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-muted">{s.label}</div>
                  <div className="text-[10px] text-muted/60">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Queue list */}
            <div className="divide-y divide-blush/10">
              {QUEUE_LIVE.map((q) => (
                <div
                  key={q.num}
                  className={`flex items-center gap-3 px-5 py-3 ${
                    q.status === 'in-consultation' ? 'bg-rose/4' : ''
                  }`}
                >
                  <div className="font-extrabold text-xs text-rose/70 w-10 shrink-0">{q.num}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{q.name}</div>
                    <div className="text-xs text-muted truncate">{q.service}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {q.duration !== '—' && (
                      <span className="text-xs text-muted">{q.duration}</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[q.status]}`}>
                      {STATUS_LABEL[q.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-blush/20">
              <Link
                href="/admin"
                className="text-xs text-rose font-semibold hover:underline flex items-center gap-1"
              >
                Kelola antrian <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Action Center */}
        <FadeUp delay={0.15}>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-blush/20">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <h3 className="font-bold text-ink text-sm">Action Center</h3>
              </div>
              <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                5 items
              </span>
            </div>

            <div className="divide-y divide-blush/10">
              {ACTION_ITEMS.map((item, i) => {
                const Icon = item.icon
                const colors = {
                  urgent: { bg: 'bg-rose/8',   dot: 'bg-rose',      text: 'text-rose' },
                  warn:   { bg: 'bg-amber-50', dot: 'bg-amber-400', text: 'text-amber-700' },
                  info:   { bg: 'bg-sage/10',  dot: 'bg-sage-dark', text: 'text-sage-dark' },
                }[item.level] ?? { bg: '', dot: '', text: '' }

                return (
                  <motion.div
                    key={i}
                    whileHover={{ x: 2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="flex items-center gap-3 px-5 py-3.5 group cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={13} className={colors.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink/80 leading-snug">{item.label}</p>
                    </div>
                    <button
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colors.bg} ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`}
                    >
                      {item.action}
                    </button>
                    <ChevronRight size={14} className="text-muted/40 shrink-0" />
                  </motion.div>
                )
              })}
            </div>

            <div className="px-5 py-3 border-t border-blush/20">
              <Link
                href="/command/followup"
                className="text-xs text-rose font-semibold hover:underline flex items-center gap-1"
              >
                Lihat semua follow-up <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ─── AI Insights ─── */}
      <FadeUp delay={0.2}>
        <div className="bg-ink rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blush" />
              <h3 className="font-bold text-white text-sm">AI Advisor Insights</h3>
            </div>
            <span className="text-xs text-white/30">Update harian</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
            {AI_INSIGHTS.map((ins, i) => {
              const Icon = ins.icon
              const beforeHighlight = ins.text.slice(0, ins.text.indexOf(ins.highlight))
              const afterHighlight = ins.text.slice(
                ins.text.indexOf(ins.highlight) + ins.highlight.length
              )
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  className="px-5 py-4 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center mb-3">
                    <Icon size={14} className="text-blush" />
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {beforeHighlight}
                    <span className="text-blush font-semibold">{ins.highlight}</span>
                    {afterHighlight}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <div className="px-5 py-3 border-t border-white/8">
            <Link
              href="/command/ai"
              className="text-xs text-blush font-semibold hover:underline flex items-center gap-1"
            >
              Lihat semua rekomendasi AI <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </FadeUp>

      {/* ─── Quick Access ─── */}
      <FadeUp delay={0.25}>
        <div className="mb-4">
          <h3 className="font-bold text-ink text-sm mb-3">Akses Cepat</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Pasien Baru',      Icon: Users,        href: '/command/patients',  color: 'text-rose',      bg: 'bg-rose/8' },
              { label: 'Buat Appointment', Icon: Calendar,     href: '/booking',           color: 'text-sage-dark', bg: 'bg-sage/10' },
              { label: 'Kasir / POS',      Icon: ShoppingCart, href: '/command/pos',       color: 'text-burgundy',  bg: 'bg-burgundy/8' },
              { label: 'Follow Up',        Icon: Phone,        href: '/command/followup',  color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Cek Antrian',      Icon: Activity,     href: '/queue',             color: 'text-rose',      bg: 'bg-rose/8' },
              { label: 'Laporan Harian',   Icon: BarChart3,    href: '/command/reports',   color: 'text-ink',       bg: 'bg-cream' },
            ].map((item) => (
              <Link key={item.label} href={item.href}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(58,42,44,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.Icon size={18} className={item.color} />
                  </div>
                  <span className="text-xs font-semibold text-ink/70 leading-snug">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Bottom spacer */}
      <div className="h-6" />
    </main>
  )
}
