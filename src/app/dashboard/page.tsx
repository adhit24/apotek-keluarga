'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar, Clock, MapPin, ArrowRight, Bell,
  ChevronRight,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockAppointments, mockQueue, type Appointment, type QueueStatus } from '@/lib/data'

const STATUS_MAP: Record<Appointment['status'], { label: string; color: string }> = {
  upcoming:        { label: 'Akan Datang', color: 'bg-blush text-rose' },
  waiting:         { label: 'Menunggu',    color: 'bg-cream text-muted border border-blush' },
  called:          { label: 'Dipanggil',   color: 'bg-amber-50 text-amber-700' },
  'in-consultation': { label: 'Konsultasi', color: 'bg-rose/10 text-rose' },
  completed:       { label: 'Selesai',     color: 'bg-sage-light/60 text-sage-dark' },
  cancelled:       { label: 'Dibatalkan',  color: 'bg-muted/10 text-muted' },
}

const QUEUE_DOT: Record<QueueStatus, string> = {
  waiting: 'bg-muted',
  called: 'bg-amber-500 animate-pulse',
  'in-consultation': 'bg-rose animate-pulse',
  completed: 'bg-sage',
}

const tabs = ['Upcoming', 'Riwayat', 'Antrian', 'Pengingat'] as const
type Tab = typeof tabs[number]

function AppointmentCard({ a }: { a: Appointment }) {
  const s = STATUS_MAP[a.status]
  const dateObj = new Date(a.date)
  const dateLabel = dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const isPast = a.status === 'completed' || a.status === 'cancelled'
  return (
    <div className={`bg-surface rounded-card shadow-soft p-5 ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="font-bold text-ink text-base mb-0.5">{a.service}</div>
          <div className="text-xs text-muted">{a.doctor}</div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${s.color}`}>{s.label}</span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Calendar size={14} className="text-rose shrink-0" />
          {dateLabel}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock size={14} className="text-rose shrink-0" />
          {a.time}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin size={14} className="text-rose shrink-0" />
          {a.location}
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-blush/60">
        <div className="text-xs text-muted">
          ID: <span className="font-mono font-bold text-ink">{a.id}</span>
          {' · '}Antrian: <span className="font-mono font-bold text-rose">{a.queueNumber}</span>
        </div>
        {a.status === 'upcoming' && (
          <Link href="/queue" className="flex items-center gap-1 text-xs text-rose font-semibold hover:underline">
            Pantau <ChevronRight size={12} />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Upcoming')
  const [reminderWa, setReminderWa] = useState(true)
  const [reminder24h, setReminder24h] = useState(true)
  const [reminder3h, setReminder3h] = useState(true)

  const upcoming = mockAppointments.filter((a) => a.status === 'upcoming')
  const history = mockAppointments.filter((a) => a.status === 'completed' || a.status === 'cancelled')

  const myQueue = typeof window !== 'undefined' ? localStorage.getItem('ak_my_queue') : null
  const myQueueItem = mockQueue.find((q) => q.number === myQueue)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">

          {/* Header */}
          <div className="mb-8">
            <div className="section-tag mb-2 w-fit">Dashboard Pasien</div>
            <h1 className="text-3xl font-extrabold text-ink mb-1">Halo, Selamat Datang 👋</h1>
            <p className="text-muted text-sm">Kelola janji dan pantau antrian Anda di sini.</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Janji Aktif', value: upcoming.length, color: 'text-rose', bg: 'bg-blush/30' },
              { label: 'Total Kunjungan', value: mockAppointments.length, color: 'text-sage-dark', bg: 'bg-sage-light/30' },
              { label: 'Dokter', value: 2, color: 'text-burgundy', bg: 'bg-blush/20' },
              { label: 'Pengingat Aktif', value: [reminder24h, reminder3h].filter(Boolean).length, color: 'text-ink', bg: 'bg-cream' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-card p-4`}>
                <div className={`text-2xl font-extrabold ${s.color} mb-0.5`}>{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* My queue spotlight */}
          {myQueueItem && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-burgundy text-white rounded-2xl p-5 mb-6 shadow-float flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">Antrian Saya</div>
                <div className="text-4xl font-extrabold mb-1">{myQueueItem.number}</div>
                <div className="text-sm text-white/60">{myQueueItem.service}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`w-3 h-3 rounded-full ${QUEUE_DOT[myQueueItem.status]}`} />
                <div className="text-sm font-semibold capitalize text-white/80">
                  {myQueueItem.status === 'in-consultation' ? 'Konsultasi' :
                   myQueueItem.status === 'called' ? 'Dipanggil!' :
                   myQueueItem.status === 'completed' ? 'Selesai' : 'Menunggu'}
                </div>
                <Link href="/queue" className="text-xs text-blush hover:text-white transition-colors flex items-center gap-1">
                  Lihat Antrian <ChevronRight size={12} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-surface rounded-btn p-1 mb-6 shadow-xs">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab ? 'bg-rose text-white shadow-btn' : 'text-muted hover:text-ink'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {/* Upcoming */}
              {activeTab === 'Upcoming' && (
                <div className="space-y-4">
                  {upcoming.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">📅</div>
                      <p className="font-semibold text-ink mb-1">Belum ada janji mendatang</p>
                      <p className="text-muted text-sm mb-6">Buat janji dengan dokter sekarang.</p>
                      <Link href="/booking" className="btn-primary">Buat Janji <ArrowRight size={16} /></Link>
                    </div>
                  ) : (
                    <>
                      {upcoming.map((a) => <AppointmentCard key={a.id} a={a} />)}

                      {/* Jadwal Kontrol Berikutnya */}
                      <div className="bg-surface rounded-card shadow-soft p-5 mt-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-sage-light/40 flex items-center justify-center shrink-0">
                            <Calendar size={15} className="text-sage-dark" />
                          </div>
                          <div>
                            <div className="font-bold text-ink text-sm">Jadwal Kontrol Berikutnya</div>
                            <div className="text-xs text-muted">Jangan lewatkan jadwal kontrol rutin Anda</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted mb-4 leading-relaxed">
                          Kontrol rutin membantu dokter memantau perkembangan kesehatan Anda secara optimal.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link href="/booking" className="btn-primary text-sm flex-1 justify-center">
                            <Calendar size={14} /> Booking Kontrol
                          </Link>
                          <a
                            href={`https://wa.me/6285220024400?text=${encodeURIComponent('Halo Apotek Keluarga 👋\n\nSaya ingin menjadwalkan kunjungan kontrol berikutnya. Mohon bantu atur jadwalnya. Terima kasih 🙏')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-wa text-sm flex-1 justify-center"
                          >
                            <span>💬</span> Tanya via WA
                          </a>
                        </div>
                      </div>

                      <div className="pt-2 text-center">
                        <Link href="/booking" className="btn-outline">
                          <Calendar size={15} /> Tambah Janji Baru
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* History */}
              {activeTab === 'Riwayat' && (
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">🗒️</div>
                      <p className="text-muted text-sm">Belum ada riwayat kunjungan.</p>
                    </div>
                  ) : (
                    history.map((a) => <AppointmentCard key={a.id} a={a} />)
                  )}
                </div>
              )}

              {/* Queue live */}
              {activeTab === 'Antrian' && (
                <div>
                  <div className="bg-surface rounded-2xl shadow-soft overflow-hidden mb-4">
                    <div className="bg-rose px-5 py-3 flex items-center gap-2">
                      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2 h-2 bg-white rounded-full block" />
                      <span className="text-white font-bold text-sm">Status Antrian Live</span>
                    </div>
                    <div className="p-5 space-y-3">
                      {mockQueue.slice(0, 5).map((q) => (
                        <div key={q.number} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${QUEUE_DOT[q.status]}`} />
                            <div>
                              <span className="font-bold text-ink text-sm">{q.number}</span>
                              <span className="text-xs text-muted ml-2">{q.service}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted">{q.appointmentTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <Link href="/queue" className="btn-primary">
                      Buka Halaman Antrian <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Reminders */}
              {activeTab === 'Pengingat' && (
                <div className="space-y-4">
                  <div className="bg-surface rounded-2xl shadow-soft p-6">
                    <h3 className="font-bold text-ink mb-1">Preferensi Pengingat</h3>
                    <p className="text-muted text-sm mb-6">Pengingat membantu Anda datang tepat waktu dan mengurangi no-show.</p>

                    {[
                      { key: 'wa', label: 'Via WhatsApp', desc: 'Kirim reminder ke nomor WA terdaftar', value: reminderWa, set: setReminderWa, icon: '💬' },
                      { key: '24h', label: '24 Jam Sebelum', desc: 'Pengingat sehari sebelum jadwal', value: reminder24h, set: setReminder24h, icon: '🔔' },
                      { key: '3h', label: '3 Jam Sebelum', desc: 'Pengingat beberapa jam sebelum jadwal', value: reminder3h, set: setReminder3h, icon: '⏰' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-4 border-b border-blush last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <div className="font-semibold text-ink text-sm">{item.label}</div>
                            <div className="text-xs text-muted">{item.desc}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => item.set(!item.value)}
                          className={`w-12 h-6 rounded-full transition-all duration-200 relative ${item.value ? 'bg-sage' : 'bg-blush'}`}
                        >
                          <motion.div animate={{ x: item.value ? 24 : 2 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-soft" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-cream rounded-card p-4">
                    <div className="flex items-start gap-3">
                      <Bell size={18} className="text-rose mt-0.5 shrink-0" />
                      <p className="text-sm text-muted leading-relaxed">
                        Pengingat akan dikirim otomatis ke nomor WhatsApp yang Anda daftarkan saat booking.
                        Pastikan nomor tersebut aktif.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  )
}
