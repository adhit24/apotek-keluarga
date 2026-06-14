'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Search, X, Phone, Calendar, TrendingUp, Users, UserPlus,
  Baby, Star, MessageCircle, Clock, ChevronRight, FileText,
  Activity, Stethoscope, CalendarCheck,
} from 'lucide-react'

// ─── Mock data ────────────────────────────────────────────────────────────────

const PATIENTS = [
  { id: 'P001', name: 'Siti Nurhaliza',  age: 29, phone: '0812-3456-7890', status: 'ANC Active',        week: 28, hpl: '12 Okt 2026', visits: 12, revenue: 5250000,  lastVisit: '10 Jun 2026', tag: 'ANC' },
  { id: 'P002', name: 'Rina Dewi',        age: 32, phone: '0813-2345-6789', status: 'USG Follow-Up',     week: 20, hpl: '5 Nov 2026',  visits: 6,  revenue: 2800000,  lastVisit: '8 Jun 2026',  tag: 'Returning' },
  { id: 'P003', name: 'Ayu Lestari',      age: 27, phone: '0814-5678-9012', status: 'ANC Active',        week: 16, hpl: '28 Nov 2026', visits: 4,  revenue: 1600000,  lastVisit: '5 Jun 2026',  tag: 'ANC' },
  { id: 'P004', name: 'Dewi Rahayu',      age: 35, phone: '0815-6789-0123', status: 'High Risk',         week: 32, hpl: '25 Sep 2026', visits: 18, revenue: 8400000,  lastVisit: '12 Jun 2026', tag: 'High Risk' },
  { id: 'P005', name: 'Putri Anggraini',  age: 24, phone: '0816-7890-1234', status: 'New Patient',       week: 8,  hpl: '15 Jan 2027', visits: 1,  revenue: 350000,   lastVisit: '14 Jun 2026', tag: 'New' },
  { id: 'P006', name: 'Nur Azizah',       age: 30, phone: '0817-8901-2345', status: 'Fertility Program', week: 0,  hpl: '—',           visits: 8,  revenue: 4200000,  lastVisit: '1 Jun 2026',  tag: 'Fertility' },
  { id: 'P007', name: 'Fatimah Zahra',    age: 28, phone: '0818-9012-3456', status: 'ANC Active',        week: 36, hpl: '30 Jun 2026', visits: 14, revenue: 6100000,  lastVisit: '13 Jun 2026', tag: 'ANC' },
  { id: 'P008', name: 'Anisa Putri',      age: 31, phone: '0819-0123-4567', status: 'Post-Partum',       week: 0,  hpl: '—',           visits: 22, revenue: 9800000,  lastVisit: '2 Jun 2026',  tag: 'VIP' },
  { id: 'P009', name: 'Maya Sari',        age: 26, phone: '0821-1234-5678', status: 'ANC Active',        week: 12, hpl: '20 Des 2026', visits: 3,  revenue: 1200000,  lastVisit: '9 Jun 2026',  tag: 'ANC' },
  { id: 'P010', name: 'Indah Permata',    age: 33, phone: '0822-2345-6789', status: 'Inactive',          week: 0,  hpl: '—',           visits: 5,  revenue: 2100000,  lastVisit: '10 Mar 2026', tag: 'Inactive' },
  { id: 'P011', name: 'Sri Wahyuni',      age: 29, phone: '0823-3456-7890', status: 'ANC Active',        week: 24, hpl: '25 Okt 2026', visits: 8,  revenue: 3400000,  lastVisit: '11 Jun 2026', tag: 'ANC' },
  { id: 'P012', name: 'Ratna Sari',       age: 37, phone: '0824-4567-8901', status: 'High Risk',         week: 30, hpl: '8 Okt 2026',  visits: 20, revenue: 11200000, lastVisit: '13 Jun 2026', tag: 'VIP' },
  { id: 'P013', name: 'Wulandari',        age: 25, phone: '0825-5678-9012', status: 'New Patient',       week: 6,  hpl: '20 Jan 2027', visits: 1,  revenue: 300000,   lastVisit: '14 Jun 2026', tag: 'New' },
  { id: 'P014', name: 'Herlina Susanti',  age: 34, phone: '0826-6789-0123', status: 'Pregnancy Program', week: 0,  hpl: '—',           visits: 11, revenue: 5600000,  lastVisit: '7 Jun 2026',  tag: 'Fertility' },
  { id: 'P015', name: 'Kartini Dewi',     age: 28, phone: '0827-7890-1234', status: 'ANC Active',        week: 20, hpl: '3 Nov 2026',  visits: 6,  revenue: 2700000,  lastVisit: '10 Jun 2026', tag: 'ANC' },
  { id: 'P016', name: 'Nurul Hidayah',    age: 30, phone: '0828-8901-2345', status: 'Inactive',          week: 0,  hpl: '—',           visits: 3,  revenue: 1100000,  lastVisit: '15 Jan 2026', tag: 'Inactive' },
  { id: 'P017', name: 'Lestari Putri',    age: 27, phone: '0829-9012-3456', status: 'ANC Active',        week: 32, hpl: '22 Sep 2026', visits: 9,  revenue: 3800000,  lastVisit: '12 Jun 2026', tag: 'ANC' },
  { id: 'P018', name: 'Amelia Rosa',      age: 23, phone: '0831-0123-4567', status: 'New Patient',       week: 10, hpl: '5 Jan 2027',  visits: 2,  revenue: 700000,   lastVisit: '13 Jun 2026', tag: 'New' },
  { id: 'P019', name: 'Yuni Astuti',      age: 36, phone: '0832-1234-5678', status: 'VIP',               week: 28, hpl: '10 Okt 2026', visits: 25, revenue: 13500000, lastVisit: '14 Jun 2026', tag: 'VIP' },
  { id: 'P020', name: 'Dian Pratiwi',     age: 31, phone: '0833-2345-6789', status: 'Fertility Program', week: 0,  hpl: '—',           visits: 7,  revenue: 3200000,  lastVisit: '6 Jun 2026',  tag: 'Fertility' },
]

type Patient = (typeof PATIENTS)[number]

// Journey timeline (mocked per-patient using visits count)
function buildJourney(p: Patient) {
  const base = [
    { date: p.lastVisit, service: 'Kunjungan Terakhir', icon: CalendarCheck },
  ]
  if (p.visits > 1) base.push({ date: '2 Jun 2026', service: 'Konsultasi ANC', icon: Stethoscope })
  if (p.visits > 3) base.push({ date: '15 Mei 2026', service: 'USG 2D', icon: Activity })
  if (p.visits > 6) base.push({ date: '1 Apr 2026', service: 'Lab Darah', icon: FileText })
  return base
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtRevenue(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1).replace('.0', '')}Jt`
  return `Rp ${(n / 1000).toFixed(0)}K`
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('')
}

const TAG_COLORS: Record<string, string> = {
  ANC:        'bg-blue-50 text-blue-700',
  New:        'bg-emerald-50 text-emerald-700',
  'High Risk':'bg-red-50 text-red-700',
  VIP:        'bg-amber-50 text-amber-700',
  Fertility:  'bg-purple-50 text-purple-700',
  Inactive:   'bg-gray-100 text-gray-500',
  Returning:  'bg-teal-50 text-teal-700',
}

const FILTERS = ['Semua', 'ANC', 'New', 'High Risk', 'VIP', 'Fertility', 'Inactive'] as const

// ─── Fade-up wrapper ──────────────────────────────────────────────────────────

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

// ─── Patient 360 Modal ────────────────────────────────────────────────────────

function PatientModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const journey = buildJourney(patient)

  return (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-float w-full max-w-lg max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-blush/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-lg">{initials(patient.name)}</span>
            </div>
            <div>
              <div className="font-extrabold text-ink text-lg leading-tight">{patient.name}</div>
              <div className="text-muted text-sm">{patient.id} &middot; {patient.age} tahun</div>
              <span className={`mt-1 inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${TAG_COLORS[patient.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                {patient.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        {/* Overview cards */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {patient.week > 0 && (
            <div className="bg-cream rounded-xl p-3">
              <div className="text-xs text-muted font-medium">Usia Kehamilan</div>
              <div className="text-ink font-extrabold text-xl">{patient.week}<span className="text-sm font-medium text-muted ml-1">mgg</span></div>
            </div>
          )}
          {patient.hpl !== '—' && (
            <div className="bg-cream rounded-xl p-3">
              <div className="text-xs text-muted font-medium">HPL</div>
              <div className="text-ink font-extrabold text-base">{patient.hpl}</div>
            </div>
          )}
          <div className="bg-cream rounded-xl p-3">
            <div className="text-xs text-muted font-medium">Total Kunjungan</div>
            <div className="text-ink font-extrabold text-xl">{patient.visits}</div>
          </div>
          <div className="bg-cream rounded-xl p-3">
            <div className="text-xs text-muted font-medium">Revenue</div>
            <div className="text-ink font-extrabold text-lg">{fmtRevenue(patient.revenue)}</div>
          </div>
          <div className="bg-cream rounded-xl p-3">
            <div className="text-xs text-muted font-medium">No Show</div>
            <div className="text-ink font-extrabold text-xl">0</div>
          </div>
          <div className="bg-cream rounded-xl p-3">
            <div className="text-xs text-muted font-medium">Kunjungan Terakhir</div>
            <div className="text-ink font-bold text-sm">{patient.lastVisit}</div>
          </div>
        </div>

        {/* Contact row */}
        <div className="px-5 pb-1 flex items-center gap-2">
          <Phone size={13} className="text-muted" />
          <span className="text-sm text-ink">{patient.phone}</span>
        </div>

        {/* Journey timeline */}
        <div className="px-5 pt-4 pb-2">
          <div className="font-bold text-ink text-sm mb-3">Riwayat Kunjungan</div>
          <div className="space-y-2">
            {journey.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-blush/15 last:border-0">
                <div className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center shrink-0">
                  <item.icon size={13} className="text-sage-dark" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink">{item.service}</div>
                  <div className="text-xs text-muted">{item.date}</div>
                </div>
                <ChevronRight size={13} className="text-muted shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="p-5 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-ink text-white rounded-xl py-2.5 text-sm font-semibold"
          >
            <Calendar size={14} />
            Buat Appointment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-emerald-500 text-white rounded-xl py-2.5 text-sm font-semibold"
          >
            <MessageCircle size={14} />
            Kirim WA
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('Semua')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filtered = PATIENTS.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
    const matchFilter =
      activeFilter === 'Semua' || p.tag === activeFilter
    return matchSearch && matchFilter
  })

  const totalRevenue = PATIENTS.reduce((s, p) => s + p.revenue, 0)

  return (
    <main className="p-4 md:p-6">
      {/* Page heading */}
      <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <h1 className="font-extrabold text-ink text-2xl">Pasien</h1>
          <div className="sm:ml-auto relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor HP…"
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-blush/30 rounded-xl text-ink placeholder:text-muted focus:outline-none focus:border-blush/60"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </FadeUp>

      {/* Filter chips */}
      <FadeUp delay={0.05}>
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-ink text-white'
                  : 'bg-white text-muted border border-blush/30 hover:border-blush/60 hover:text-ink'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </FadeUp>

      {/* Stats row */}
      <FadeUp delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Pasien',   value: '20',      icon: Users,     color: 'text-ink' },
            { label: 'Pasien ANC',     value: '8',       icon: Baby,      color: 'text-sage-dark' },
            { label: 'Pasien Baru',    value: '3',       icon: UserPlus,  color: 'text-emerald-600' },
            { label: 'Lifetime Revenue', value: `Rp ${(totalRevenue/1000000).toFixed(1)}Jt`, icon: TrendingUp, color: 'text-rose' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-float">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted font-medium">{s.label}</span>
                <s.icon size={14} className={s.color} />
              </div>
              <div className={`font-extrabold text-xl ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* Table */}
      <FadeUp delay={0.15}>
        <div className="bg-white rounded-2xl shadow-float overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blush/20">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Pasien</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide hidden md:table-cell">Usia Kehamilan</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide hidden sm:table-cell">Kunjungan</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide hidden lg:table-cell">Revenue</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide hidden xl:table-cell">Terakhir Kunjungan</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <motion.tr
                    key={p.id}
                    className="border-b border-blush/10 last:border-0 group cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(255,240,245,0.5)' }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setSelectedPatient(p)}
                  >
                    {/* Pasien */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">{initials(p.name)}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{p.name}</div>
                          <div className="text-xs text-muted">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TAG_COLORS[p.tag] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    {/* Usia kehamilan */}
                    <td className="px-4 py-3 hidden md:table-cell text-ink">
                      {p.week > 0 ? `${p.week} mgg` : '—'}
                    </td>
                    {/* Kunjungan */}
                    <td className="px-4 py-3 hidden sm:table-cell text-ink font-medium">{p.visits}x</td>
                    {/* Revenue */}
                    <td className="px-4 py-3 hidden lg:table-cell text-sage-dark font-semibold">{fmtRevenue(p.revenue)}</td>
                    {/* Terakhir */}
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5 text-muted">
                        <Clock size={12} />
                        <span className="text-xs">{p.lastVisit}</span>
                      </div>
                    </td>
                    {/* Aksi */}
                    <td className="px-4 py-3 text-right">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); setSelectedPatient(p) }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        Lihat
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tidak ada pasien ditemukan</p>
            </div>
          )}
        </div>
      </FadeUp>

      {/* Patient 360 Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <PatientModal
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
