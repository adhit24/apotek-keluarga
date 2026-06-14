'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Bell, Phone, Calendar, CheckCircle2,
  MessageCircle, AlertTriangle, Clock, Filter,
  ChevronDown, Users,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const FOLLOWUPS = [
  { id: 1,  patient: 'Siti Nurhaliza',  phone: '0812-3456-7890', category: 'ANC Follow-Up',       dueDate: '16 Jun 2026', week: 28, lastVisit: '10 Jun 2026', priority: 'high',   status: 'pending', reason: 'ANC kontrol minggu 28 belum dijadwalkan' },
  { id: 2,  patient: 'Dewi Rahayu',     phone: '0815-6789-0123', category: 'High Risk Monitor',   dueDate: '16 Jun 2026', week: 32, lastVisit: '12 Jun 2026', priority: 'urgent', status: 'pending', reason: 'Pre-eklampsia ringan — pantau TD minggu ini' },
  { id: 3,  patient: 'Fatimah Zahra',   phone: '0818-9012-3456', category: 'ANC Follow-Up',       dueDate: '17 Jun 2026', week: 36, lastVisit: '13 Jun 2026', priority: 'high',   status: 'pending', reason: 'HPL 30 Jun — persiapan persalinan' },
  { id: 4,  patient: 'Maya Sari',       phone: '0821-1234-5678', category: 'Missed Appointment',  dueDate: '15 Jun 2026', week: 12, lastVisit: '9 Jun 2026',  priority: 'high',   status: 'overdue', reason: 'No-show appointment 08:30' },
  { id: 5,  patient: 'Ayu Lestari',     phone: '0814-5678-9012', category: 'Missed Appointment',  dueDate: '15 Jun 2026', week: 16, lastVisit: '5 Jun 2026',  priority: 'medium', status: 'overdue', reason: 'No-show appointment 09:00' },
  { id: 6,  patient: 'Sri Wahyuni',     phone: '0823-3456-7890', category: 'ANC Follow-Up',       dueDate: '18 Jun 2026', week: 24, lastVisit: '11 Jun 2026', priority: 'medium', status: 'pending', reason: 'Jadwal kontrol ANC minggu 24' },
  { id: 7,  patient: 'Nur Azizah',      phone: '0817-8901-2345', category: 'Fertility Follow-Up', dueDate: '19 Jun 2026', week: 0,  lastVisit: '1 Jun 2026',  priority: 'medium', status: 'pending', reason: 'Evaluasi program fertilitas bulan 3' },
  { id: 8,  patient: 'Indah Permata',   phone: '0822-2345-6789', category: 'Inactive Patient',    dueDate: '20 Jun 2026', week: 0,  lastVisit: '10 Mar 2026', priority: 'low',    status: 'pending', reason: 'Tidak kunjungan >90 hari' },
  { id: 9,  patient: 'Nurul Hidayah',   phone: '0828-8901-2345', category: 'Inactive Patient',    dueDate: '22 Jun 2026', week: 0,  lastVisit: '15 Jan 2026', priority: 'low',    status: 'pending', reason: 'Tidak kunjungan >150 hari' },
  { id: 10, patient: 'Lestari Putri',   phone: '0829-9012-3456', category: 'ANC Follow-Up',       dueDate: '20 Jun 2026', week: 32, lastVisit: '12 Jun 2026', priority: 'medium', status: 'pending', reason: 'Jadwal kontrol ANC minggu 32' },
]

type FollowUp = typeof FOLLOWUPS[0]

// ─── Priority config ──────────────────────────────────────────────────────────

const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-rose',
  high:   'bg-amber-500',
  medium: 'bg-sage-dark',
  low:    'bg-muted',
}

const PRIORITY_LABEL: Record<string, string> = {
  urgent: 'Urgent',
  high:   'High',
  medium: 'Medium',
  low:    'Low',
}

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'bg-rose/10 text-rose font-bold',
  high:   'bg-amber-50 text-amber-700 font-semibold',
  medium: 'bg-sage/10 text-sage-dark font-semibold',
  low:    'bg-cream text-muted',
}

// ─── Category tab config ──────────────────────────────────────────────────────

const CATEGORY_TABS = ['Semua', 'ANC', 'Missed', 'Fertility', 'Inactive']

function matchCategory(item: FollowUp, tab: string) {
  if (tab === 'Semua') return true
  if (tab === 'ANC') return item.category.includes('ANC')
  if (tab === 'Missed') return item.category.includes('Missed')
  if (tab === 'Fertility') return item.category.includes('Fertility')
  if (tab === 'Inactive') return item.category.includes('Inactive')
  return true
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
  const inView = useInView(ref, { once: true, margin: '-20px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Follow-up card ───────────────────────────────────────────────────────────

function FollowUpCard({ item, delay, onDone }: { item: FollowUp; delay: number; onDone: (id: number) => void }) {
  const waPhone = item.phone.replace(/-/g, '').replace(/^0/, '62')
  const weekText = item.week > 0 ? `minggu+${item.week}` : 'program+anda'
  const waLink = `https://wa.me/${waPhone}?text=Halo+${encodeURIComponent(item.patient)}+...kontrol+kehamilan+${weekText}`

  return (
    <FadeUp delay={delay}>
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(58,42,44,0.08)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="bg-white rounded-2xl p-5"
      >
        {/* Top row */}
        <div className="flex items-start gap-3 mb-3">
          {/* Priority dot */}
          <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
            <div className={`w-2 h-2 rounded-full ${PRIORITY_DOT[item.priority]}`} />
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-ink text-sm">{item.patient}</span>
              {item.week > 0 && (
                <span className="text-xs bg-blush/20 text-burgundy font-semibold px-2 py-0.5 rounded-full">
                  Minggu {item.week}
                </span>
              )}
              <span className="text-xs bg-cream text-muted px-2 py-0.5 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">{item.reason}</p>
          </div>

          {/* Status + priority badges */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                item.status === 'overdue'
                  ? 'bg-rose/10 text-rose font-bold'
                  : 'bg-amber-50 text-amber-700 font-semibold'
              }`}
            >
              {item.status === 'overdue' ? 'Overdue' : 'Pending'}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_BADGE[item.priority]}`}>
              {PRIORITY_LABEL[item.priority]}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-muted mb-4 pl-5">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Jatuh tempo: <span className="font-semibold text-ink/70 ml-0.5">{item.dueDate}</span>
          </span>
          <span className="text-muted/40">·</span>
          <span>Terakhir: {item.lastVisit}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pl-5 flex-wrap">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle size={13} />
            Kirim WA
          </a>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose/8 text-rose px-3 py-1.5 rounded-xl hover:bg-rose/15 transition-colors">
            <Calendar size={13} />
            Buat Appointment
          </button>
          <button
            onClick={() => onDone(item.id)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-cream text-muted px-3 py-1.5 rounded-xl hover:bg-sage/10 hover:text-sage-dark transition-colors"
          >
            <CheckCircle2 size={13} />
            Tandai Selesai
          </button>
        </div>
      </motion.div>
    </FadeUp>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FollowUpCenter() {
  const [categoryTab, setCategoryTab] = useState('Semua')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [done, setDone] = useState<Set<number>>(new Set())

  function markDone(id: number) {
    setDone((prev) => new Set([...prev, id]))
  }

  const filtered = FOLLOWUPS.filter((item) => {
    if (done.has(item.id)) return false
    if (!matchCategory(item, categoryTab)) return false
    if (priorityFilter !== 'All' && item.priority !== priorityFilter.toLowerCase()) return false
    return true
  })

  const urgent  = FOLLOWUPS.filter((f) => f.priority === 'urgent').length
  const overdue = FOLLOWUPS.filter((f) => f.status === 'overdue').length
  const selesai = done.size

  const STATS = [
    { label: 'Total Follow-Up', value: FOLLOWUPS.length,   color: 'text-ink',         bg: 'bg-cream',       icon: Users },
    { label: 'Urgent',          value: urgent,              color: 'text-rose',        bg: 'bg-rose/8',      icon: AlertTriangle },
    { label: 'Overdue',         value: overdue,             color: 'text-amber-600',   bg: 'bg-amber-50',    icon: Clock },
    { label: 'Selesai Minggu Ini', value: selesai,          color: 'text-emerald-600', bg: 'bg-emerald-50',  icon: CheckCircle2 },
  ]

  return (
    <main className="p-4 md:p-6">

      {/* Header */}
      <FadeUp className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-extrabold text-ink text-xl leading-none mb-1">Follow Up Center</h1>
            <p className="text-xs text-muted">Manajemen tindak lanjut pasien</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-ink text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-ink/85 transition-colors">
            <MessageCircle size={15} />
            Kirim Semua WA
          </button>
        </div>
      </FadeUp>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STATS.map((s, i) => {
          const Icon = s.icon
          return (
            <FadeUp key={s.label} delay={i * 0.05}>
              <div className="bg-white rounded-2xl p-4">
                <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={s.color} />
                </div>
                <div className={`font-extrabold text-2xl ${s.color} leading-none mb-1`}>{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            </FadeUp>
          )
        })}
      </div>

      {/* Filters */}
      <FadeUp delay={0.1} className="mb-4">
        <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setCategoryTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                  categoryTab === tab
                    ? 'bg-ink text-white'
                    : 'bg-cream text-muted hover:text-ink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1 sm:ml-auto flex-wrap">
            <span className="text-xs text-muted flex items-center gap-1 mr-1">
              <Filter size={11} /> Prioritas:
            </span>
            {['All', 'Urgent', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  priorityFilter === p
                    ? 'bg-rose/10 text-rose'
                    : 'bg-cream text-muted hover:text-ink'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Result count */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <ChevronDown size={13} className="text-muted" />
        <span className="text-xs text-muted">
          Menampilkan <span className="font-semibold text-ink">{filtered.length}</span> follow-up
        </span>
      </div>

      {/* Cards */}
      <AnimatePresence mode="popLayout">
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <FadeUp>
              <div className="bg-white rounded-2xl p-10 text-center">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-3" />
                <p className="font-semibold text-ink mb-1">Semua selesai!</p>
                <p className="text-xs text-muted">Tidak ada follow-up tersisa untuk filter ini.</p>
              </div>
            </FadeUp>
          )}
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <FollowUpCard item={item} delay={i * 0.04} onDone={markDone} />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="h-8" />
    </main>
  )
}
