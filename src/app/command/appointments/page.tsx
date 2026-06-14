'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Plus, MapPin, User, CheckCircle2, Clock, AlertCircle,
  XCircle, Calendar, BarChart2, Percent,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const APPOINTMENTS = [
  { id: 'AK-202606-001', time: '08:00', patient: 'Fatimah Zahra',   service: 'ANC Konsultasi',       location: 'Apotek Keluarga', status: 'completed',      doctor: 'dr. Wildan', duration: '20 mnt', week: 36 },
  { id: 'AK-202606-002', time: '08:30', patient: 'Siti Nurhaliza',  service: 'ANC + USG 2D',         location: 'Apotek Keluarga', status: 'completed',      doctor: 'dr. Wildan', duration: '25 mnt', week: 28 },
  { id: 'AK-202606-003', time: '09:00', patient: 'Rina Dewi',       service: 'USG 4D',               location: 'Apotek Keluarga', status: 'in-consultation', doctor: 'dr. Wildan', duration: '—',      week: 20 },
  { id: 'AK-202606-004', time: '09:30', patient: 'Dewi Rahayu',     service: 'Konsultasi Kehamilan', location: 'Apotek Keluarga', status: 'called',         doctor: 'dr. Wildan', duration: '—',      week: 32 },
  { id: 'AK-202606-005', time: '10:00', patient: 'Putri Anggraini', service: 'USG 4D',               location: 'Apotek Keluarga', status: 'waiting',        doctor: 'dr. Wildan', duration: '—',      week: 8  },
  { id: 'AK-202606-006', time: '10:30', patient: 'Nur Azizah',      service: 'Fertility Program',    location: 'Apotek Keluarga', status: 'waiting',        doctor: 'dr. Wildan', duration: '—',      week: 0  },
  { id: 'AK-202606-007', time: '11:00', patient: 'Maya Sari',       service: 'ANC Konsultasi',       location: 'Apotek Keluarga', status: 'scheduled',      doctor: 'dr. Wildan', duration: '—',      week: 12 },
  { id: 'AK-202606-008', time: '11:30', patient: 'Sri Wahyuni',     service: 'ANC + USG 2D',         location: 'Apotek Keluarga', status: 'scheduled',      doctor: 'dr. Wildan', duration: '—',      week: 24 },
  { id: 'AK-202606-009', time: '13:00', patient: 'Lestari Putri',   service: 'ANC Konsultasi',       location: 'RS Medimas',      status: 'scheduled',      doctor: 'dr. Wildan', duration: '—',      week: 32 },
  { id: 'AK-202606-010', time: '13:30', patient: 'Kartini Dewi',    service: 'USG 4D',               location: 'RS Medimas',      status: 'scheduled',      doctor: 'dr. Wildan', duration: '—',      week: 20 },
  { id: 'AK-202606-011', time: '14:00', patient: 'Amelia Rosa',     service: 'Konsultasi Pertama',   location: 'RS Medimas',      status: 'scheduled',      doctor: 'dr. Wildan', duration: '—',      week: 10 },
  { id: 'AK-202606-012', time: '09:00', patient: 'Ayu Lestari',     service: 'ANC Konsultasi',       location: 'Apotek Keluarga', status: 'no-show',        doctor: 'dr. Wildan', duration: '—',      week: 16 },
  { id: 'AK-202606-013', time: '10:00', patient: 'Herlina Susanti', service: 'Fertility Consult',    location: 'Apotek Keluarga', status: 'cancelled',      doctor: 'dr. Wildan', duration: '—',      week: 0  },
]

type Appointment = (typeof APPOINTMENTS)[number]
type StatusKey = Appointment['status']

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusKey, { label: string; bg: string; text: string; dot: string; icon: React.ElementType }> = {
  completed:        { label: 'Selesai',       bg: 'bg-emerald-50',   text: 'text-emerald-700', dot: 'bg-emerald-500', icon: CheckCircle2 },
  'in-consultation':{ label: 'Konsultasi',    bg: 'bg-rose/10',      text: 'text-rose',        dot: 'bg-rose',        icon: User },
  called:           { label: 'Dipanggil',     bg: 'bg-amber-50',     text: 'text-amber-700',   dot: 'bg-amber-400',   icon: Clock },
  waiting:          { label: 'Menunggu',      bg: 'bg-cream',        text: 'text-ink',         dot: 'bg-blush',       icon: Clock },
  scheduled:        { label: 'Terjadwal',     bg: 'bg-blue-50',      text: 'text-blue-700',    dot: 'bg-blue-400',    icon: Calendar },
  'no-show':        { label: 'No Show',       bg: 'bg-burgundy/8',   text: 'text-burgundy',    dot: 'bg-burgundy',    icon: AlertCircle },
  cancelled:        { label: 'Dibatalkan',    bg: 'bg-gray-50',      text: 'text-gray-500',    dot: 'bg-gray-300',    icon: XCircle },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('')
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

// ─── Appointment row ──────────────────────────────────────────────────────────

function AppointmentRow({ appt }: { appt: Appointment }) {
  const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled
  const Icon = cfg.icon

  return (
    <motion.div
      className="flex gap-3 md:gap-4 py-3 px-4 rounded-xl"
      whileHover={{ y: -1, backgroundColor: 'rgba(255,240,245,0.6)' }}
      transition={{ duration: 0.15 }}
    >
      {/* Time column */}
      <div className="w-14 shrink-0 text-right">
        <span className="text-sm font-bold text-ink">{appt.time}</span>
      </div>

      {/* Connector dot */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1 ${cfg.dot} shrink-0`} />
        <div className="w-px flex-1 bg-blush/30 mt-1" />
      </div>

      {/* Card */}
      <div className={`flex-1 rounded-xl p-3 mb-2 ${cfg.bg}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{initials(appt.patient)}</span>
            </div>
            <div>
              <div className="font-semibold text-ink text-sm">{appt.patient}</div>
              <div className="text-xs text-muted">{appt.service}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Icon size={12} className={cfg.text} />
            <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-muted">
            <MapPin size={11} />
            <span className="text-xs">{appt.location}</span>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <User size={11} />
            <span className="text-xs">{appt.doctor}</span>
          </div>
          {appt.duration !== '—' && (
            <div className="flex items-center gap-1 text-muted">
              <Clock size={11} />
              <span className="text-xs">{appt.duration}</span>
            </div>
          )}
          {appt.week > 0 && (
            <span className="text-xs bg-white/70 text-ink px-2 py-0.5 rounded-full font-medium">
              {appt.week} mgg
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Service breakdown ────────────────────────────────────────────────────────

function ServiceBreakdown() {
  const services = [
    { label: 'ANC Konsultasi', count: 5, pct: 38 },
    { label: 'USG 4D',         count: 3, pct: 23 },
    { label: 'ANC + USG 2D',   count: 2, pct: 15 },
    { label: 'Fertility',      count: 2, pct: 15 },
    { label: 'Lainnya',        count: 1, pct: 9  },
  ]
  const colors = ['bg-rose', 'bg-blue-400', 'bg-amber-400', 'bg-purple-400', 'bg-gray-300']

  return (
    <div className="bg-white rounded-2xl shadow-float p-5">
      <div className="font-bold text-ink text-sm mb-4">Distribusi Layanan</div>
      <div className="space-y-2.5">
        {services.map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="text-xs text-muted w-28 truncate">{s.label}</div>
            <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${colors[i]}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
            </div>
            <div className="text-xs font-semibold text-ink w-8 text-right">{s.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_FILTERS = ['Semua', 'Hari Ini', 'Menunggu', 'Selesai'] as const

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<string>('Semua')

  const counts = {
    Semua:     APPOINTMENTS.length,
    'Hari Ini':APPOINTMENTS.length,
    Menunggu:  APPOINTMENTS.filter((a) => ['waiting', 'called'].includes(a.status)).length,
    Selesai:   APPOINTMENTS.filter((a) => a.status === 'completed').length,
  }

  const filtered = APPOINTMENTS.filter((a) => {
    if (activeTab === 'Menunggu') return ['waiting', 'called'].includes(a.status)
    if (activeTab === 'Selesai')  return a.status === 'completed'
    return true
  })

  const stats = [
    { label: 'Total Hari Ini', value: APPOINTMENTS.length, color: 'text-ink',         icon: Calendar },
    { label: 'Selesai',        value: APPOINTMENTS.filter((a) => a.status === 'completed').length, color: 'text-emerald-600', icon: CheckCircle2 },
    { label: 'Menunggu',       value: APPOINTMENTS.filter((a) => ['waiting', 'called', 'in-consultation'].includes(a.status)).length, color: 'text-amber-600', icon: Clock },
    { label: 'No Show',        value: APPOINTMENTS.filter((a) => a.status === 'no-show').length, color: 'text-burgundy', icon: AlertCircle },
  ]

  return (
    <main className="p-4 md:p-6">
      {/* Top bar */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div>
            <h1 className="font-extrabold text-ink text-2xl">Appointments</h1>
            <p className="text-xs text-muted mt-0.5">Senin, 16 Juni 2026</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="sm:ml-auto flex items-center gap-2 bg-ink text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
          >
            <Plus size={15} />
            Buat Appointment
          </motion.button>
        </div>
      </FadeUp>

      {/* Status tabs */}
      <FadeUp delay={0.05}>
        <div className="flex gap-1.5 mb-5 bg-white rounded-xl p-1 shadow-float w-fit">
          {TAB_FILTERS.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-ink text-white'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-cream'}`}>
                {counts[tab as keyof typeof counts]}
              </span>
            </motion.button>
          ))}
        </div>
      </FadeUp>

      {/* Stats row */}
      <FadeUp delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-float">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted font-medium">{s.label}</span>
                <s.icon size={14} className={s.color} />
              </div>
              <div className={`font-extrabold text-2xl ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Timeline */}
      <FadeUp delay={0.15}>
        <div className="bg-white rounded-2xl shadow-float overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-blush/20">
            <div className="font-bold text-ink text-sm">Jadwal Hari Ini</div>
          </div>
          <div className="p-2">
            {filtered.map((appt) => (
              <AppointmentRow key={appt.id} appt={appt} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted">
                <Calendar size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Tidak ada appointment</p>
              </div>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Analytics section */}
      <FadeUp delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceBreakdown />

          {/* Occupancy */}
          <div className="bg-white rounded-2xl shadow-float p-5">
            <div className="font-bold text-ink text-sm mb-4">Tingkat Kepadatan</div>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f5eaee" strokeWidth="4" />
                  <motion.circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="#c0392b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="87.96"
                    initial={{ strokeDashoffset: 87.96 }}
                    animate={{ strokeDashoffset: 87.96 * (1 - 0.72) }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Percent size={12} className="text-rose mb-0.5" />
                  <span className="font-extrabold text-ink text-xl leading-none">72</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-muted">Slot Terisi</div>
                  <div className="font-bold text-ink">13 / 18 slot</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Slot Tersedia</div>
                  <div className="font-bold text-sage-dark">5 slot</div>
                </div>
                <div>
                  <div className="text-xs text-muted">Rata-rata Durasi</div>
                  <div className="font-bold text-ink">22 mnt</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blush/20">
              <div className="text-xs text-muted mb-2 font-medium">Status Ringkasan</div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(STATUS_CONFIG) as [StatusKey, typeof STATUS_CONFIG[StatusKey]][]).map(([key, cfg]) => {
                  const c = APPOINTMENTS.filter((a) => a.status === key).length
                  if (c === 0) return null
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className="text-xs text-muted">{cfg.label}</span>
                      <span className="text-xs font-bold text-ink ml-auto">{c}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Empty analytics placeholder when filtered */}
      {activeTab !== 'Semua' && activeTab !== 'Hari Ini' && (
        <FadeUp delay={0.25}>
          <div className="mt-4 bg-white rounded-2xl shadow-float p-4 flex items-center gap-3 text-muted">
            <BarChart2 size={16} />
            <span className="text-sm">Analytics ditampilkan untuk semua appointment hari ini</span>
          </div>
        </FadeUp>
      )}
    </main>
  )
}
