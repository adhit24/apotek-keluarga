'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Clock, CheckCircle2, Phone, Loader2,
  ChevronRight, Calendar, MapPin, Bell, Settings,
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

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Antrian', value: queue.length, icon: <Users size={20} />, color: 'bg-blush/30 text-rose' },
            { label: 'Menunggu', value: waiting.length, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
            { label: 'Selesai Hari Ini', value: completed.length, icon: <CheckCircle2 size={20} />, color: 'bg-sage-light/40 text-sage-dark' },
            { label: 'Total Janji', value: todayAppts.length, icon: <Calendar size={20} />, color: 'bg-cream text-ink' },
          ].map((s) => (
            <div key={s.label} className="bg-surface rounded-card shadow-soft p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                {s.icon}
              </div>
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
                ) : (
                  <div className="text-muted text-sm italic">Tidak ada</div>
                )}
              </div>

              <div className="mb-5">
                <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Dipanggil</div>
                {called ? (
                  <motion.div animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                    className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Phone size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="font-extrabold text-amber-600 text-lg">{called.number}</div>
                      <div className="text-xs text-muted">{called.patientName}</div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-muted text-sm italic">Tidak ada</div>
                )}
              </div>

              <div className="text-xs text-muted">
                Menunggu: <strong className="text-ink">{waiting.length}</strong> orang
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-surface rounded-2xl shadow-soft p-6 flex flex-col gap-4">
            <h3 className="font-bold text-ink">Kontrol Antrian</h3>

            <button
              onClick={callNext}
              disabled={waiting.length === 0 && !called && !inConsultation}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              <Bell size={16} /> Panggil Berikutnya
            </button>

            <button
              onClick={markCompleted}
              disabled={!inConsultation}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-btn bg-sage text-white font-bold text-sm shadow-btn hover:bg-sage-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle2 size={16} /> Tandai Selesai
            </button>

            {lastAction && (
              <motion.div key={lastAction} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="bg-blush/30 rounded-card px-4 py-2.5 text-sm text-ink">
                ✓ {lastAction}
              </motion.div>
            )}
          </div>

          {/* Waiting list preview */}
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
                <tr>
                  {['No. Antrian', 'Pasien', 'Layanan', 'Jam', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
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
      </div>
    </div>
  )
}
