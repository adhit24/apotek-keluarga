'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Users, RefreshCw, MessageCircle, Search, Globe, PhoneCall, ArrowRight, Share2, Video } from 'lucide-react'

interface Source {
  source: string; patients: number; pct: number; color: string
  newPatients: number; cost: number; iconKey: string
}

const SOURCES: Source[] = [
  { source:'Google Search', patients:43, pct:34, color:'bg-rose',         iconKey:'search',    newPatients:28, cost:0 },
  { source:'Instagram',     patients:21, pct:17, color:'bg-blush',        iconKey:'instagram', newPatients:15, cost:850000 },
  { source:'Referral',      patients:16, pct:13, color:'bg-sage',         iconKey:'users',     newPatients:12, cost:0 },
  { source:'WhatsApp',      patients:14, pct:11, color:'bg-emerald-400',  iconKey:'wa',        newPatients:8,  cost:0 },
  { source:'TikTok',        patients:12, pct:10, color:'bg-burgundy/70',  iconKey:'tiktok',    newPatients:9,  cost:600000 },
  { source:'Facebook',      patients:9,  pct:7,  color:'bg-amber-400',    iconKey:'globe',     newPatients:6,  cost:400000 },
  { source:'Direct/Walk-in',patients:11, pct:8,  color:'bg-ink/30',       iconKey:'walk',      newPatients:4,  cost:0 },
]

const LOST_PATIENTS = [
  { name:'Indah Permata',  lastVisit:'10 Mar 2026', daysInactive:97,  phone:'0822-2345-6789' },
  { name:'Nurul Hidayah',  lastVisit:'15 Jan 2026', daysInactive:151, phone:'0828-8901-2345' },
  { name:'Eka Wulandari',  lastVisit:'5 Feb 2026',  daysInactive:130, phone:'0834-3456-7890' },
  { name:'Sari Dewi',      lastVisit:'20 Feb 2026', daysInactive:115, phone:'0835-4567-8901' },
  { name:'Nur Fitria',     lastVisit:'28 Feb 2026', daysInactive:107, phone:'0836-5678-9012' },
]

function SourceIcon({ iconKey }: { iconKey: string }) {
  const map: Record<string, React.ReactNode> = {
    search:    <Search size={14} />,
    instagram: <Share2 size={14} />,
    users:     <Users size={14} />,
    wa:        <MessageCircle size={14} />,
    tiktok:    <Video size={14} />,
    globe:     <Globe size={14} />,
    walk:      <PhoneCall size={14} />,
  }
  return <>{map[iconKey] ?? <Globe size={14} />}</>
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  )
}

export default function MarketingPage() {
  const [sentWA, setSentWA] = useState<string[]>([])

  const totalPatients = SOURCES.reduce((s, x) => s + x.patients, 0)
  const totalAdCost = SOURCES.reduce((s, x) => s + x.cost, 0)

  const handleSendWA = (phone: string, name: string) => {
    const num = phone.replace(/-/g, '').replace(/^0/, '62')
    const text = encodeURIComponent(`Halo ${name} 👋\n\nKami dari Apotek Keluarga rindu dengan Anda! Sudah lama tidak bertemu 😊\n\nYuk jadwalkan kembali kunjungan Anda bersama dr. Wildan, SpOG.\n\nHubungi kami untuk booking: wa.me/6285220024400`)
    window.open(`https://wa.me/${num}?text=${text}`, '_blank')
    setSentWA(prev => [...prev, phone])
  }

  return (
    <main className="p-4 md:p-6">
      {/* Header */}
      <FadeUp className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Marketing</h1>
        <p className="text-sm text-muted mt-0.5">Akuisisi & retensi pasien</p>
      </FadeUp>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Pasien/Bln', value: totalPatients.toString(), sub: 'Juni 2026', color: 'text-ink' },
          { label: 'Pasien Baru', value: '48', sub: '+12% vs Mei', color: 'text-emerald-600' },
          { label: 'Repeat Rate', value: '72%', sub: 'Di atas rata-rata 65%', color: 'text-sage-dark' },
          { label: 'Budget Iklan', value: `Rp ${(totalAdCost/1000).toFixed(0)}rb`, sub: 'Bulan ini', color: 'text-ink' },
        ].map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.05}>
            <div className="bg-white rounded-2xl p-4 shadow-float">
              <div className="text-xs text-muted mb-1">{s.label}</div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted mt-1">{s.sub}</div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Acquisition Sources */}
      <FadeUp delay={0.1}>
        <div className="bg-white rounded-2xl p-5 shadow-float mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-ink">Sumber Pasien</h2>
            <span className="text-xs text-muted">{totalPatients} pasien total bulan ini</span>
          </div>
          <div className="space-y-3">
            {SOURCES.map((src, i) => (
              <motion.div
                key={src.source}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-cream flex items-center justify-center text-ink/50 shrink-0">
                  <SourceIcon iconKey={src.iconKey} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-ink">{src.source}</span>
                    <span className="text-xs text-muted tabular-nums">{src.patients} pasien · {src.pct}%</span>
                  </div>
                  <div className="h-2 bg-cream rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${src.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${src.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.04, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Repeat Visit Engine */}
      <FadeUp delay={0.15} className="mb-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-float">
            <h2 className="font-bold text-ink mb-4">Repeat Visit Engine</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pasien Baru', value: '48', color: 'text-ink' },
                { label: 'Pasien Kembali', value: '124', color: 'text-ink' },
                { label: 'Repeat Rate', value: '72%', color: 'text-emerald-600' },
                { label: 'Churn Rate', value: '8%', color: 'text-rose' },
              ].map(stat => (
                <div key={stat.label} className="bg-cream rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">{stat.label}</div>
                  <div className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-emerald-50 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-800">72% Repeat Rate — di atas rata-rata klinik 65%</span>
              </div>
            </div>
          </div>

          {/* CPA table */}
          <div className="bg-white rounded-2xl p-5 shadow-float">
            <h2 className="font-bold text-ink mb-4">Cost Per Acquisition</h2>
            <div className="space-y-2">
              {SOURCES.filter(s => s.cost > 0).map(src => (
                <div key={src.source} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-ink">{src.source}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-ink">
                      Rp {Math.round(src.cost / src.newPatients).toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-muted">per pasien baru</div>
                  </div>
                </div>
              ))}
              {SOURCES.filter(s => s.cost === 0).slice(0, 2).map(src => (
                <div key={src.source} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-ink">{src.source}</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Organik</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Lost Patient Recovery */}
      <FadeUp delay={0.2}>
        <div className="bg-white rounded-2xl p-5 shadow-float">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-ink">Lost Patient Recovery</h2>
              <p className="text-xs text-muted mt-0.5">35 pasien tidak aktif &gt;90 hari</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-ink bg-cream px-3 py-2 rounded-xl"
            >
              <RefreshCw size={12} /> Buat Campaign
            </motion.button>
          </div>
          <div className="space-y-2">
            {LOST_PATIENTS.map((p, i) => (
              <motion.div
                key={p.phone}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center justify-between p-3 bg-cream rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-ink">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{p.name}</div>
                    <div className="text-xs text-muted">Terakhir: {p.lastVisit}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-rose/10 text-rose px-2 py-0.5 rounded-full font-semibold">
                    {p.daysInactive} hari
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendWA(p.phone, p.name)}
                    className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      sentWA.includes(p.phone)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-ink text-white'
                    }`}
                  >
                    {sentWA.includes(p.phone) ? '✓ Terkirim' : <><MessageCircle size={11} /> WA</>}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-ink bg-cream py-3 rounded-xl hover:bg-blush/20 transition-colors"
          >
            Lihat 30 Pasien Lainnya <ArrowRight size={14} />
          </motion.button>
        </div>
      </FadeUp>
    </main>
  )
}
