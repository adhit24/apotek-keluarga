'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Clock, CheckCircle2, Loader2, ArrowRight, RefreshCw, Search } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { mockQueue, type QueueItem } from '@/lib/data'

function QueueBadge({ status }: { status: QueueItem['status'] }) {
  const map = {
    done: { label: 'Selesai', color: 'bg-sage-light text-sage-dark' },
    'in-progress': { label: 'Sedang Dilayani', color: 'bg-rose/10 text-rose animate-pulse' },
    waiting: { label: 'Menunggu', color: 'bg-cream text-muted' },
  }
  const { label, color } = map[status]
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>{label}</span>
  )
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(mockQueue)
  const [myQueue, setMyQueue] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Load user's queue from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ak_my_queue')
    if (stored) setMyQueue(stored)
  }, [])

  // Auto-advance simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prev) => {
        const inProgress = prev.find((q) => q.status === 'in-progress')
        if (!inProgress) return prev
        const idx = prev.indexOf(inProgress)
        const newQueue = prev.map((q, i) => {
          if (i === idx) return { ...q, status: 'done' as const }
          if (i === idx + 1 && q.status === 'waiting')
            return { ...q, status: 'in-progress' as const, estimatedTime: undefined }
          return q
        })
        return newQueue
      })
      setLastUpdated(new Date())
    }, 20000) // advance every 20s for demo

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((r) => setTimeout(r, 800))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const handleSaveMyQueue = () => {
    if (searchInput.trim()) {
      const normalized = searchInput.trim().toUpperCase()
      setMyQueue(normalized)
      localStorage.setItem('ak_my_queue', normalized)
      setSearchInput('')
    }
  }

  const currentlyServed = queue.find((q) => q.status === 'in-progress')
  const waiting = queue.filter((q) => q.status === 'waiting')
  const done = queue.filter((q) => q.status === 'done')
  const myItem = queue.find((q) => q.number === myQueue)
  const myPosition = waiting.findIndex((q) => q.number === myQueue) + 1

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="section-tag mb-4 mx-auto w-fit">Real-time</div>
            <h1 className="text-3xl font-extrabold text-ink mb-2">Status Antrian</h1>
            <p className="text-muted">Pantau posisi antrian Anda tanpa perlu menunggu di klinik</p>
          </div>

          {/* My queue card */}
          {myItem ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-burgundy text-white rounded-2xl p-6 mb-6 shadow-float"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Nomor Antrian Anda
                </div>
                <button
                  onClick={() => {
                    setMyQueue('')
                    localStorage.removeItem('ak_my_queue')
                  }}
                  className="text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  Hapus
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-extrabold tracking-wide mb-1">{myItem.number}</div>
                  <div className="text-sm text-white/70">{myItem.service}</div>
                </div>

                <div className="text-right">
                  {myItem.status === 'in-progress' && (
                    <div className="flex items-center gap-2 text-sage-light font-bold">
                      <Loader2 size={18} className="animate-spin" />
                      Giliran Anda!
                    </div>
                  )}
                  {myItem.status === 'waiting' && (
                    <div>
                      <div className="text-2xl font-bold">#{myPosition}</div>
                      <div className="text-xs text-white/60">dalam antrean</div>
                      {myItem.estimatedTime && (
                        <div className="text-xs text-blush mt-1">
                          ~{myItem.estimatedTime}
                        </div>
                      )}
                    </div>
                  )}
                  {myItem.status === 'done' && (
                    <div className="flex items-center gap-2 text-sage-light font-bold">
                      <CheckCircle2 size={18} />
                      Selesai
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-surface rounded-2xl p-5 mb-6 shadow-soft">
              <p className="text-sm text-muted mb-3">Masukkan nomor antrian untuk memantau posisi Anda:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="AK-001"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveMyQueue()}
                    className="w-full pl-10 pr-4 py-2.5 rounded-card border border-blush text-sm text-ink focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/10"
                  />
                </div>
                <button onClick={handleSaveMyQueue} className="btn-primary px-4 py-2.5 text-sm">
                  Pantau
                </button>
              </div>
            </div>
          )}

          {/* Currently Served */}
          <div className="bg-surface rounded-2xl shadow-soft mb-4 overflow-hidden">
            <div className="bg-rose px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2.5 h-2.5 bg-white rounded-full"
                />
                Sedang Dilayani
              </div>
              <button
                onClick={handleRefresh}
                className="text-white/70 hover:text-white transition-colors"
              >
                <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={{ duration: 0.5 }}>
                  <RefreshCw size={15} />
                </motion.div>
              </button>
            </div>

            {currentlyServed ? (
              <div className="px-6 py-5 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-rose mb-1">
                    {currentlyServed.number}
                  </div>
                  <div className="text-sm text-muted">{currentlyServed.service}</div>
                </div>
                <Loader2 size={28} className="text-rose animate-spin" />
              </div>
            ) : (
              <div className="px-6 py-5 text-muted text-sm">Tidak ada antrian aktif saat ini.</div>
            )}
          </div>

          {/* Waiting list */}
          {waiting.length > 0 && (
            <div className="bg-surface rounded-2xl shadow-soft mb-4 overflow-hidden">
              <div className="px-6 py-3 border-b border-blush">
                <span className="text-sm font-bold text-ink">
                  Menunggu ({waiting.length})
                </span>
              </div>
              <div className="divide-y divide-blush/40">
                {waiting.map((item, i) => (
                  <motion.div
                    key={item.number}
                    layout
                    className={`flex items-center justify-between px-6 py-4 ${
                      item.number === myQueue ? 'bg-rose/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-sm font-bold text-muted">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-ink text-sm">{item.number}</div>
                        <div className="text-xs text-muted">{item.service}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.estimatedTime && (
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Clock size={12} />
                          ~{item.estimatedTime}
                        </div>
                      )}
                      <QueueBadge status={item.status} />
                      {item.number === myQueue && (
                        <span className="text-xs font-bold text-rose">← Anda</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {done.length > 0 && (
            <div className="bg-surface rounded-2xl shadow-soft overflow-hidden mb-6">
              <div className="px-6 py-3 border-b border-blush">
                <span className="text-sm font-bold text-muted">Selesai ({done.length})</span>
              </div>
              <div className="divide-y divide-blush/40">
                {done.map((item) => (
                  <div
                    key={item.number}
                    className="flex items-center justify-between px-6 py-3 opacity-50"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle2 size={18} className="text-sage-dark" />
                      <div>
                        <div className="font-semibold text-ink text-sm">{item.number}</div>
                        <div className="text-xs text-muted">{item.service}</div>
                      </div>
                    </div>
                    <QueueBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last updated */}
          <p className="text-center text-xs text-muted mb-8">
            Diperbarui:{' '}
            {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            {' · '}
            <button onClick={handleRefresh} className="text-rose hover:underline">
              Perbarui sekarang
            </button>
          </p>

          {/* No queue yet CTA */}
          <div className="text-center">
            <p className="text-muted text-sm mb-4">Belum punya antrian?</p>
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
