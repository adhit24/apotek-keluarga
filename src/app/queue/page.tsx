'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Clock, CheckCircle2, ArrowRight, RefreshCw, Search, Phone, Loader2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockQueue, type QueueItem, type QueueStatus } from '@/lib/data'

const STATUS_CONFIG: Record<QueueStatus, { label: string; color: string; dot: string }> = {
  waiting:         { label: 'Menunggu',         color: 'bg-cream text-muted border border-blush',         dot: 'bg-muted' },
  called:          { label: 'Dipanggil',         color: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  'in-consultation': { label: 'Konsultasi',     color: 'bg-rose/10 text-rose border border-rose/20',      dot: 'bg-rose animate-pulse' },
  completed:       { label: 'Selesai',           color: 'bg-sage-light/60 text-sage-dark border border-sage/20', dot: 'bg-sage' },
}

function StatusBadge({ status }: { status: QueueStatus }) {
  const { label, color, dot } = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

// Simulate queue progression: waiting → called → in-consultation → completed
function advanceQueue(prev: QueueItem[]): QueueItem[] {
  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  // find in-consultation → move to completed
  const consulting = prev.find((q) => q.status === 'in-consultation')
  if (consulting) {
    return prev.map((q) => {
      if (q.number === consulting.number) return { ...q, status: 'completed' as const }
      const idx = prev.indexOf(consulting)
      if (prev[idx + 1]?.number === q.number && q.status === 'called')
        return { ...q, status: 'in-consultation' as const, calledAt: now }
      return q
    })
  }
  // find called → move to in-consultation
  const called = prev.find((q) => q.status === 'called')
  if (called) {
    return prev.map((q) => {
      if (q.number === called.number) return { ...q, status: 'in-consultation' as const, calledAt: now }
      return q
    })
  }
  // call next waiting
  const nextWaiting = prev.find((q) => q.status === 'waiting')
  if (nextWaiting) {
    return prev.map((q) =>
      q.number === nextWaiting.number ? { ...q, status: 'called' as const, calledAt: now } : q
    )
  }
  return prev
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue)
  const [myQueue, setMyQueue] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('ak_my_queue')
    if (stored) setMyQueue(stored)
  }, [])

  // Auto-advance every 25s for demo realism
  useEffect(() => {
    const id = setInterval(() => {
      setQueue((prev) => advanceQueue(prev))
      setLastUpdated(new Date())
    }, 25000)
    return () => clearInterval(id)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((r) => setTimeout(r, 700))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const saveMyQueue = () => {
    const v = searchInput.trim().toUpperCase()
    if (v) { setMyQueue(v); localStorage.setItem('ak_my_queue', v); setSearchInput('') }
  }

  const inConsultation = queue.find((q) => q.status === 'in-consultation')
  const called = queue.find((q) => q.status === 'called')
  const waiting = queue.filter((q) => q.status === 'waiting')
  const completed = queue.filter((q) => q.status === 'completed')
  const myItem = queue.find((q) => q.number === myQueue)
  const myPosition = waiting.findIndex((q) => q.number === myQueue) + 1

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="section-tag mb-3 mx-auto w-fit">Live</div>
            <h1 className="text-3xl font-extrabold text-ink mb-2">Status Antrian</h1>
            <p className="text-muted text-sm">Pantau posisi antrian tanpa perlu menunggu di klinik</p>
          </div>

          {/* My Queue Card */}
          <AnimatePresence mode="wait">
            {myItem ? (
              <motion.div key="my-queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-burgundy text-white rounded-2xl p-6 mb-6 shadow-float">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Antrian Saya</span>
                  <button onClick={() => { setMyQueue(''); localStorage.removeItem('ak_my_queue') }}
                    className="text-xs text-white/40 hover:text-white/60 transition-colors">Hapus</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-extrabold tracking-wide mb-1">{myItem.number}</div>
                    <div className="text-sm text-white/60">{myItem.service}</div>
                    <div className="text-xs text-white/40 mt-1">{myItem.appointmentTime}</div>
                  </div>
                  <div className="text-right">
                    {myItem.status === 'waiting' && (
                      <div>
                        <div className="text-3xl font-bold">#{myPosition}</div>
                        <div className="text-xs text-white/50">dalam antrean</div>
                        <div className="text-xs text-blush mt-1">~{myPosition * 15} menit</div>
                      </div>
                    )}
                    {myItem.status === 'called' && (
                      <div className="flex flex-col items-end gap-1">
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                          className="text-amber-300 font-extrabold text-lg">Dipanggil!</motion.div>
                        <div className="text-xs text-white/50">Segera ke ruang dokter</div>
                        <Phone size={20} className="text-amber-300 mt-1" />
                      </div>
                    )}
                    {myItem.status === 'in-consultation' && (
                      <div className="flex flex-col items-end gap-1">
                        <Loader2 size={24} className="text-rose-300 animate-spin" />
                        <div className="text-sm font-bold text-rose-200">Konsultasi</div>
                      </div>
                    )}
                    {myItem.status === 'completed' && (
                      <div className="flex flex-col items-end gap-1">
                        <CheckCircle2 size={24} className="text-sage-light" />
                        <div className="text-sm font-bold text-sage-light">Selesai</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-surface rounded-2xl p-5 mb-6 shadow-soft">
                <p className="text-sm font-semibold text-ink mb-1">Pantau antrian Anda</p>
                <p className="text-xs text-muted mb-3">Masukkan nomor antrian (contoh: A-005)</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="A-005" value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && saveMyQueue()}
                      className="w-full pl-9 pr-4 py-2.5 rounded-card border border-blush text-sm text-ink focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10" />
                  </div>
                  <button onClick={saveMyQueue} className="btn-primary px-4 py-2.5 text-sm">Pantau</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Status Panel */}
          <div className="bg-surface rounded-2xl shadow-soft mb-4 overflow-hidden">
            <div className="bg-rose px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-2.5 bg-white rounded-full block" />
                Status Live
              </div>
              <button onClick={handleRefresh} className="text-white/70 hover:text-white transition-colors">
                <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={{ duration: 0.5 }}>
                  <RefreshCw size={15} />
                </motion.div>
              </button>
            </div>

            <div className="grid grid-cols-2 divide-x divide-blush border-b border-blush">
              {/* In consultation */}
              <div className="p-5">
                <div className="text-xs text-muted font-semibold mb-2 uppercase tracking-wider">Konsultasi</div>
                {inConsultation ? (
                  <div>
                    <div className="text-2xl font-extrabold text-rose mb-0.5">{inConsultation.number}</div>
                    <div className="text-xs text-muted truncate">{inConsultation.service}</div>
                  </div>
                ) : (
                  <div className="text-muted text-sm">–</div>
                )}
              </div>
              {/* Called */}
              <div className="p-5">
                <div className="text-xs text-muted font-semibold mb-2 uppercase tracking-wider">Dipanggil</div>
                {called ? (
                  <motion.div animate={{ opacity: [1, 0.6, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                    <div className="text-2xl font-extrabold text-amber-600 mb-0.5">{called.number}</div>
                    <div className="text-xs text-muted truncate">{called.service}</div>
                  </motion.div>
                ) : (
                  <div className="text-muted text-sm">–</div>
                )}
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 divide-x divide-blush/60 text-center py-3">
              <div>
                <div className="text-lg font-extrabold text-ink">{waiting.length}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Menunggu</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-sage-dark">{completed.length}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Selesai</div>
              </div>
              <div>
                <div className="text-lg font-extrabold text-rose">{queue.length}</div>
                <div className="text-[10px] text-muted uppercase tracking-wider">Total Hari Ini</div>
              </div>
            </div>
          </div>

          {/* Waiting List */}
          {waiting.length > 0 && (
            <div className="bg-surface rounded-2xl shadow-soft mb-4 overflow-hidden">
              <div className="px-5 py-3 border-b border-blush flex items-center justify-between">
                <span className="text-sm font-bold text-ink">Menunggu</span>
                <span className="text-xs text-muted">{waiting.length} orang</span>
              </div>
              <div className="divide-y divide-blush/40">
                {waiting.map((item, i) => (
                  <motion.div key={item.number} layout
                    className={`flex items-center justify-between px-5 py-3.5 ${item.number === myQueue ? 'bg-rose/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blush flex items-center justify-center text-xs font-bold text-muted shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-ink text-sm">{item.number}</div>
                        <div className="text-xs text-muted">{item.service}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={11} />
                        {item.appointmentTime}
                      </div>
                      <StatusBadge status={item.status} />
                      {item.number === myQueue && <span className="text-xs font-bold text-rose">← Anda</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Called list */}
          {called && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Dipanggil Sekarang</div>
                  <div className="text-xl font-extrabold text-amber-700">{called.number}</div>
                  <div className="text-xs text-amber-600">{called.service}</div>
                </div>
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Phone size={28} className="text-amber-500" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="bg-surface rounded-2xl shadow-soft overflow-hidden mb-6">
              <div className="px-5 py-3 border-b border-blush">
                <span className="text-sm font-bold text-muted">Selesai ({completed.length})</span>
              </div>
              <div className="divide-y divide-blush/40">
                {completed.map((item) => (
                  <div key={item.number} className="flex items-center justify-between px-5 py-3 opacity-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-sage-dark" />
                      <div>
                        <div className="font-semibold text-ink text-sm">{item.number}</div>
                        <div className="text-xs text-muted">{item.service}</div>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted mb-8">
            Diperbarui: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            {' · '}
            <button onClick={handleRefresh} className="text-rose hover:underline">Perbarui sekarang</button>
          </p>

          <div className="text-center">
            <p className="text-muted text-sm mb-4">Belum punya janji?</p>
            <Link href="/booking" className="btn-primary">
              Buat Janji Sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
