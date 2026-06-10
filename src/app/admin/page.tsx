'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Clock, CheckCircle2, Phone, Loader2,
  ChevronRight, Calendar, MapPin, Bell, Settings,
  BarChart3, TrendingDown, AlertTriangle, Activity,
} from 'lucide-react'
import { mockQueue, mockAppointments, type QueueItem, type QueueStatus } from '@/lib/data'
import Link from 'next/link'

const STATUS_LABEL: Record<QueueStatus, string> = {
  waiting: 'Menunggu',
  called: 'Dipanggil',
  'in-consultation': 'Konsultasi',
  completed: 'Selesai',
}

const STATUS_COLOR: Record<QueueStatus, string> = {
  waiting: 'bg-cream text-muted border border-blush',
  called: 'bg-amber-50 text-amber-700 border border-amber-200',
  'in-consultation': 'bg-rose/10 text-rose border border-rose/20',
  completed: 'bg-sage-light/60 text-sage-dark border border-sage/20',
}

function advance(queue: QueueItem[]): QueueItem[] {
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const consulting = queue.find((q) => q.status === 'in-consultation')
  if (consulting) {
    const idx = queue.indexOf(consulting)
    return queue.map((q, i) => {
      if (i === idx) return { ...q, status: 'completed' as const }
      if (i === idx + 1 && q.status === 'called') return { ...q, status: 'in-consultation' as const, calledAt: now }
      return q
    })
  }
  const called = queue.find((q) => q.status === 'called')
  if (called) {
    return queue.map((q) =>
      q.number === called.number ? { ...q, status: 'in-consultation' as const, calledAt: now } : q
    )
  }
  const next = queue.find((q) => q.status === 'waiting')
  if (next) {
    return queue.map((q) =>
      q.number === next.number ? { ...q, status: 'called' as const, calledAt: now } : q
    )
  }
  return queue
}

export default function AdminPage() {
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue)
  const [lastAction, setLastAction] = useState('')

  const inConsultation = queue.find((q) => q.status === 'in-consultation')
  const called = queue.find((q) => q.status === 'called')
  const waiting = queue.filter((q) => q.status === 'waiting')
  const completed = queue.filter((q) => q.status === 'completed')

  const callNext = () => {
    setQueue((prev) => {
      const updated = advance(prev)
      const newCalled = updated.find((q) => q.status === 'called')
      const newConsulting = updated.find((q) => q.status === 'in-consultation')
      if (newConsulting && !queue.find((q) => q.status === 'in-consultation')) {
        setLastAction(`${newConsulting.number} mulai konsultasi`)
      } else if (newCalled) {
        setLastAction(`${newCalled.number} dipanggil`)
      }
      return updated
    })
  }

  const markCompleted = () => {
    setQueue((prev) => {
      const item = prev.find((q) => q.status === 'in-consultation')
      if (!item) return prev
      setLastAction(`${item.number} selesai`)
      return prev.map((q) => q.number === item.number ? { ...q, status: 'completed' as const } : q)
    })
  }

  const todayAppts = mockAppointments
  const [adminTab, setAdminTab] = useState<'Antrian' | 'Statistik'>('Antrian')

  // Mock stats data
  const weeklyBookings = [8, 12, 9, 15, 11, 14, 7]
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const maxBooking = Math.max(...weeklyBookings)
  const serviceDistribution = [
    { name: 'USG', pct: 38, color: 'bg-rose' },
    { name: 'Kandungan', pct: 32, color: 'bg-burgundy' },
    { name: 'Program Hamil', pct: 18, color: 'bg-sage' },
    { name: 'Lainnya', pct: 12, color: 'bg-blush' },
  ]
  const hourlyData = [
    { jam: '09', val: 3 }, { jam: '10', val: 5 }, { jam: '11', val: 8 },
    { jam: '12', val: 6 }, { jam: '13', val: 4 }, { jam: '14', val: 7 },
    { jam: '15', val: 9 }, { jam: '16', val: 5 }, { jam: '17', val: 3 },
  ]
  const maxHourly = Math.max(...hourlyData.map((h) => h.val))

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <div className="bg-burgundy text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Settings size={16} />
            </div>
            <div>
              <div className="font-extrabold text-base leading-tight">Admin Panel</div>
              <div className="text-xs text-white/50">Apotek Keluarga · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
          </div>
          <Link href="/" className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1">
            Ke Website <ChevronRight size={12} />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Tab switcher */}
        <div className="flex gap-1 bg-surface rounded-btn p-1 mb-8 shadow-soft w-fit">
          {(['Antrian', 'Statistik'] as const).map((t) => (
            <button key={t} onClick={() => setAdminTab(t)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                adminTab === t ? 'bg-burgundy text-white shadow-btn' : 'text-muted hover:text-ink'
              }`}>
              {t === 'Antrian' ? <Users size={14} /> : <BarChart3 size={14} />}
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── TAB: ANTRIAN ── */}
          {adminTab === 'Antrian' && (
            <motion.div key="antrian" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Antrian', value: queue.length, icon: <Users size={20} />, color: 'bg-blush/30 text-rose' },
                  { label: 'Menunggu', value: waiting.length, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Selesai Hari Ini', value: completed.length, icon: <CheckCircle2 size={20} />, color: 'bg-sage-light/40 text-sage-dark' },
                  { label: 'Total Janji', value: todayAppts.length, icon: <Calendar size={20} />, color: 'bg-cream text-ink' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface rounded-card shadow-soft p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                    <div className="text-2xl font-extrabold text-ink">{s.value}</div>
                    <div className="text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Queue Controls */}
              <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Current status */}
                <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
                  <div className="bg-rose px-5 py-3">
                    <span className="text-white font-bold text-sm">Status Aktif</span>
                  </div>
                  <div className="p-5">
                    <div className="mb-5">
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Konsultasi</div>
                      {inConsultation ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center">
                            <Loader2 size={20} className="text-rose animate-spin" />
                          </div>
                          <div>
                            <div className="font-extrabold text-rose text-lg">{inConsultation.number}</div>
                            <div className="text-xs text-muted">{inConsultation.patientName}</div>
                          </div>
                        </div>
                      ) : <div className="text-muted text-sm italic">Tidak ada</div>}
                    </div>
                    <div className="mb-5">
                      <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Dipanggil</div>
                      {called ? (
                        <motion.div animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Phone size={18} className="text-amber-600" />
                          </div>
                          <div>
                            <div className="font-extrabold text-amber-600 text-lg">{called.number}</div>
                            <div className="text-xs text-muted">{called.patientName}</div>
                          </div>
                        </motion.div>
                      ) : <div className="text-muted text-sm italic">Tidak ada</div>}
                    </div>
                    <div className="text-xs text-muted">Menunggu: <strong className="text-ink">{waiting.length}</strong> orang</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="bg-surface rounded-2xl shadow-soft p-6 flex flex-col gap-4">
                  <h3 className="font-bold text-ink">Kontrol Antrian</h3>
                  <button onClick={callNext} disabled={waiting.length === 0 && !called && !inConsultation}
                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
                    <Bell size={16} /> Panggil Berikutnya
                  </button>
                  <button onClick={markCompleted} disabled={!inConsultation}
                    className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-btn bg-sage text-white font-bold text-sm shadow-btn hover:bg-sage-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <CheckCircle2 size={16} /> Tandai Selesai
                  </button>
                  {lastAction && (
                    <motion.div key={lastAction} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-blush/30 rounded-card px-4 py-2.5 text-sm text-ink">
                      ✓ {lastAction}
                    </motion.div>
                  )}
                </div>

                {/* Waiting list */}
                <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
                  <div className="px-5 py-3 border-b border-blush flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">Antrean Menunggu</span>
                    <span className="text-xs text-muted">{waiting.length}</span>
                  </div>
                  <div className="divide-y divide-blush/40 max-h-[260px] overflow-y-auto">
                    {waiting.length === 0 ? (
                      <div className="px-5 py-6 text-sm text-muted text-center">Semua antrian sudah dipanggil.</div>
                    ) : waiting.map((item, i) => (
                      <div key={item.number} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blush flex items-center justify-center text-xs font-bold text-muted">{i + 1}</div>
                          <div>
                            <div className="font-semibold text-ink text-sm">{item.number}</div>
                            <div className="text-xs text-muted">{item.patientName}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted">{item.appointmentTime}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full queue table */}
              <div className="bg-surface rounded-2xl shadow-soft overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-blush flex items-center justify-between">
                  <h3 className="font-bold text-ink">Semua Antrian Hari Ini</h3>
                  <span className="text-xs text-muted">{queue.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-cream">
                      <tr>{['No. Antrian', 'Pasien', 'Layanan', 'Jam', 'Status'].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-blush/40">
                      <AnimatePresence>
                        {queue.map((q) => (
                          <motion.tr key={q.number} layout className="hover:bg-cream/50 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-bold text-ink">{q.number}</td>
                            <td className="px-5 py-3.5 text-ink">{q.patientName}</td>
                            <td className="px-5 py-3.5 text-muted">{q.service}</td>
                            <td className="px-5 py-3.5 text-muted font-mono">{q.appointmentTime}</td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[q.status]}`}>
                                {STATUS_LABEL[q.status]}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Today's appointments */}
              <div className="bg-surface rounded-2xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-blush">
                  <h3 className="font-bold text-ink">Janji Hari Ini</h3>
                </div>
                <div className="divide-y divide-blush/40">
                  {todayAppts.map((a) => (
                    <div key={a.id} className="flex items-start justify-between px-6 py-4 gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-ink text-sm mb-0.5">{a.patientName}</div>
                        <div className="text-xs text-muted">{a.service} · {a.doctor}</div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
                          <span className="flex items-center gap-1"><Clock size={11} />{a.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{a.location}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-xs text-muted mb-1">{a.id}</div>
                        <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          a.status === 'completed' ? 'bg-sage-light/60 text-sage-dark' : 'bg-blush text-rose'
                        }`}>
                          {a.status === 'completed' ? 'Selesai' : 'Akan Datang'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB: STATISTIK ── */}
          {adminTab === 'Statistik' && (
            <motion.div key="statistik" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: 'Booking Hari Ini', value: '12', sub: '+3 dari kemarin',
                    icon: <Calendar size={20} />, color: 'bg-blush/30 text-rose', trend: 'up',
                  },
                  {
                    label: 'Jam Tersibuk', value: '15:00', sub: '9 pasien/jam',
                    icon: <Activity size={20} />, color: 'bg-amber-50 text-amber-600', trend: null,
                  },
                  {
                    label: 'No-Show Rate', value: '12%', sub: '2 dari 17 janji',
                    icon: <AlertTriangle size={20} />, color: 'bg-rose/10 text-rose', trend: 'down',
                  },
                  {
                    label: 'Rata-rata/Hari', value: '10.9', sub: '7 hari terakhir',
                    icon: <TrendingDown size={20} />, color: 'bg-sage-light/40 text-sage-dark', trend: null,
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-surface rounded-card shadow-soft p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
                    <div className="text-2xl font-extrabold text-ink mb-0.5">{s.value}</div>
                    <div className="text-xs text-muted">{s.label}</div>
                    <div className={`text-xs mt-1 font-semibold ${s.trend === 'up' ? 'text-sage-dark' : s.trend === 'down' ? 'text-rose' : 'text-muted'}`}>
                      {s.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Weekly booking bar chart */}
                <div className="bg-surface rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={16} className="text-rose" />
                    <h3 className="font-bold text-ink text-sm">Booking 7 Hari Terakhir</h3>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {weeklyBookings.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted font-semibold">{val}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(val / maxBooking) * 100}%` }}
                          transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                          className={`w-full rounded-t-md ${i === 4 ? 'bg-rose' : 'bg-blush'}`}
                          style={{ minHeight: 4 }}
                        />
                        <span className="text-[10px] text-muted">{weekDays[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service distribution */}
                <div className="bg-surface rounded-2xl shadow-soft p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Activity size={16} className="text-rose" />
                    <h3 className="font-bold text-ink text-sm">Distribusi Layanan</h3>
                  </div>
                  <div className="space-y-3">
                    {serviceDistribution.map((s) => (
                      <div key={s.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink font-semibold">{s.name}</span>
                          <span className="text-muted font-mono text-xs">{s.pct}%</span>
                        </div>
                        <div className="h-2 bg-cream rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`h-full rounded-full ${s.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hourly traffic */}
              <div className="bg-surface rounded-2xl shadow-soft p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={16} className="text-rose" />
                  <h3 className="font-bold text-ink text-sm">Trafik per Jam (Hari Ini)</h3>
                </div>
                <div className="flex items-end gap-3 h-24">
                  {hourlyData.map(({ jam, val }) => (
                    <div key={jam} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted font-semibold">{val}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(val / maxHourly) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`w-full rounded-t-md ${val === maxHourly ? 'bg-rose' : 'bg-blush/70'}`}
                        style={{ minHeight: 4 }}
                      />
                      <span className="text-[10px] text-muted">{jam}:00</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-4">Jam tersibuk: <strong className="text-ink">15:00 – 16:00</strong> dengan 9 pasien</p>
              </div>

              {/* No-show alert */}
              <div className="mt-6 bg-rose/5 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-rose" />
                </div>
                <div>
                  <div className="font-bold text-ink text-sm mb-1">2 Pasien No-Show Hari Ini</div>
                  <p className="text-xs text-muted leading-relaxed">
                    Ibu Rena Kusuma (10:00) dan Ibu Tri Wahyuni (14:00) tidak hadir tanpa konfirmasi.
                    Pertimbangkan untuk mengaktifkan reminder H-1 dan H-3 jam.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs bg-rose/10 text-rose px-2.5 py-1 rounded-full font-semibold">AK-202406-003</span>
                    <span className="text-xs bg-rose/10 text-rose px-2.5 py-1 rounded-full font-semibold">AK-202406-008</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
