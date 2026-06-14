'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, Clock, Users, DollarSign, Package, Send, ChevronDown } from 'lucide-react'

type AIPriority = 'high' | 'medium' | 'low'
type AICategory = 'Revenue' | 'Operasional' | 'Retensi' | 'Growth'

interface AICard {
  category: AICategory; priority: AIPriority; iconKey: string
  title: string; insight: string; action: string; impact: string; data: string
}

const AI_CARDS: AICard[] = [
  {
    category: 'Revenue', priority: 'high', iconKey: 'trending',
    title: 'USG 4D adalah layanan dengan ROI tertinggi',
    insight: 'USG 4D berkontribusi 34% dari total revenue dengan hanya 47 kunjungan bulan ini. Rata-rata revenue per kunjungan Rp 450.000 — tertinggi di antara semua layanan.',
    action: 'Pertimbangkan menambah slot USG 4D di Selasa & Kamis sore yang masih kosong.',
    impact: '+Rp 4,5Jt/bulan estimasi',
    data: '47 kunjungan · Rp 21,1Jt revenue',
  },
  {
    category: 'Operasional', priority: 'medium', iconKey: 'clock',
    title: 'Jam 10:00 adalah jam tersibuk — risiko no-show meningkat',
    insight: 'Peak traffic jam 10:00 dengan 12 pasien/jam. No-show rate pada jam ini 15% — lebih tinggi dari rata-rata 11%.',
    action: 'Kirim reminder WA H-2 dan H-1 untuk appointment jam 10:00. Pertimbangkan overbooking 1 slot.',
    impact: '-2 no-show/minggu estimasi',
    data: '12 pasien/jam · No-show 15%',
  },
  {
    category: 'Retensi', priority: 'high', iconKey: 'users',
    title: '12 pasien ANC butuh follow-up aktif',
    insight: '12 pasien ANC belum menjadwalkan kontrol berikutnya sesuai protokol. Jika tidak di-follow-up dalam 7 hari, risiko churn 35%.',
    action: 'Aktifkan campaign WA otomatis untuk 12 pasien ini dengan template pesan yang dipersonalisasi.',
    impact: 'Cegah kehilangan Rp 6,8Jt revenue potensial',
    data: '12 pasien · 7 hari window',
  },
  {
    category: 'Revenue', priority: 'medium', iconKey: 'dollar',
    title: 'Fertility Program menunjukkan pertumbuhan 22%',
    insight: 'Program fertilitas tumbuh 22% MoM dengan hanya 18 pasien. Revenue per pasien Rp 850.000 — tertinggi kedua. Demand dari digital marketing meningkat.',
    action: 'Tambahkan konten edukasi fertility di Instagram dan TikTok untuk meningkatkan inbound leads.',
    impact: '+5-8 pasien baru/bulan estimasi',
    data: '18 pasien · +22% growth',
  },
  {
    category: 'Operasional', priority: 'low', iconKey: 'package',
    title: '3 item inventaris kritis perlu reorder segera',
    insight: 'Vitamin B Complex (6 strip), Sarung Tangan Latex (3 kotak), Kertas CTG (4 roll) berada di bawah stok minimum. Estimasi habis dalam 3-5 hari.',
    action: 'Hubungi supplier dan lakukan pemesanan darurat untuk 3 item kritis ini.',
    impact: 'Cegah gangguan operasional',
    data: '3 item kritis · <5 hari stok',
  },
  {
    category: 'Growth', priority: 'medium', iconKey: 'trending',
    title: 'Google Search adalah sumber pasien terbaik — perlu investasi SEO',
    insight: 'Google menghasilkan 43 pasien/bulan dengan biaya Rp 0 (organik). Namun website belum teroptimasi untuk kata kunci "dokter kandungan Cirebon".',
    action: 'Tambahkan 2-3 artikel blog per bulan tentang kehamilan untuk meningkatkan ranking Google.',
    impact: '+15-20 pasien organik/bulan estimasi',
    data: '43 pasien · 100% organik',
  },
]

const QUICK_QUESTIONS = [
  'Apa yang bisa meningkatkan revenue?',
  'Siapa pasien yang perlu difollow-up?',
  'Jam berapa paling sibuk?',
]

const MOCK_ANSWERS: Record<string, string> = {
  'Apa yang bisa meningkatkan revenue?': 'Berdasarkan data klinik, ada 3 peluang utama: (1) Tambah slot USG 4D di Selasa & Kamis sore — estimasi +Rp 4,5Jt/bulan. (2) Aktifkan follow-up ANC untuk 12 pasien yang belum kontrol — potensi Rp 6,8Jt. (3) Scale Fertility Program yang tumbuh 22% MoM dengan konten marketing digital.',
  'Siapa pasien yang perlu difollow-up?': 'Ada 12 pasien ANC yang belum jadwalkan kontrol berikutnya. Prioritas tertinggi: Dewi Rahayu (pre-eklampsia, risiko tinggi), Fatimah Zahra (HPL 30 Jun, perlu persiapan persalinan), dan Maya Sari (no-show 15 Jun). Disarankan hubungi dalam 24 jam.',
  'Jam berapa paling sibuk?': 'Jam 10:00 adalah peak traffic dengan rata-rata 12 pasien/jam. No-show rate tertinggi juga di jam ini (15%). Rekomendasikan: kirim reminder WA H-1 untuk semua appointment jam 10:00, dan pertimbangkan 1 slot buffer untuk walk-in.',
}

function IconFor({ iconKey }: { iconKey: string }) {
  const map: Record<string, React.ReactNode> = {
    trending: <TrendingUp size={16} />,
    clock:    <Clock size={16} />,
    users:    <Users size={16} />,
    dollar:   <DollarSign size={16} />,
    package:  <Package size={16} />,
  }
  return <>{map[iconKey] ?? <Sparkles size={16} />}</>
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

export default function AIPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua')
  const [chatInput, setChatInput] = useState('')
  const [chatAnswer, setChatAnswer] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set())

  const categories = ['Semua', 'Revenue', 'Operasional', 'Retensi', 'Growth']

  const filtered = AI_CARDS.filter(c =>
    activeCategory === 'Semua' || c.category === activeCategory
  )

  const priorityColor: Record<AIPriority, string> = {
    high:   'text-rose bg-rose/10',
    medium: 'text-amber-700 bg-amber-50',
    low:    'text-sage-dark bg-sage/20',
  }
  const priorityLabel: Record<AIPriority, string> = {
    high: 'Penting', medium: 'Sedang', low: 'Rendah',
  }
  const categoryColor: Record<AICategory, string> = {
    Revenue:     'bg-rose/10 text-rose',
    Operasional: 'bg-blush/20 text-ink',
    Retensi:     'bg-sage/20 text-sage-dark',
    Growth:      'bg-amber-50 text-amber-700',
  }

  const handleQuickQ = (q: string) => {
    setChatInput(q)
    setChatAnswer(MOCK_ANSWERS[q] ?? 'Sedang menganalisis data klinik...')
  }

  const handleSend = () => {
    if (!chatInput.trim()) return
    const ans = MOCK_ANSWERS[chatInput] ?? 'Berdasarkan analisis data klinik Anda, saya merekomendasikan untuk fokus pada 3 area: retensi pasien ANC, optimasi jadwal jam sibuk, dan scaling layanan USG 4D yang paling profitable.'
    setChatAnswer(ans)
  }

  const toggleExpand = (i: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <main className="p-4 md:p-6">
      {/* Hero header */}
      <FadeUp className="mb-6">
        <div className="bg-ink rounded-2xl px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blush/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-blush" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">AI Advisor</h1>
            <p className="text-sm text-white/50 mt-0.5">Analisis berbasis data klinik Anda — powered by real clinic data</p>
          </div>
          <div className="ml-auto text-right hidden md:block">
            <div className="text-xs text-white/40">Terakhir dianalisis</div>
            <div className="text-sm font-semibold text-white">16 Jun 2026, 08:00</div>
          </div>
        </div>
      </FadeUp>

      {/* Revenue Forecast */}
      <FadeUp delay={0.05} className="mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-float">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-ink">Forecast Revenue Bulan Ini</h2>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">+6% vs target</span>
          </div>
          <div className="flex items-end gap-4 mb-3">
            <div>
              <div className="text-3xl font-extrabold text-ink">Rp 68,5Jt</div>
              <div className="text-xs text-muted mt-0.5">Estimasi akhir bulan</div>
            </div>
            <div className="text-right ml-auto">
              <div className="text-sm font-semibold text-ink">Rp 58,4Jt</div>
              <div className="text-xs text-muted">Saat ini (90%)</div>
            </div>
          </div>
          <div className="h-3 bg-cream rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-dark rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '90%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted">Target Rp 65Jt</span>
            <span className="text-xs text-emerald-600 font-semibold">Tracking baik 🎯</span>
          </div>
        </div>
      </FadeUp>

      {/* Category filter */}
      <FadeUp delay={0.08} className="flex gap-2 flex-wrap mb-4">
        {categories.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              activeCategory === cat ? 'bg-ink text-white' : 'bg-white text-muted shadow-float hover:text-ink'
            }`}
          >{cat}</motion.button>
        ))}
      </FadeUp>

      {/* AI Insight Cards */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-3 mb-6">
          {filtered.map((card, i) => {
            const expanded = expandedCards.has(i)
            return (
              <motion.div
                key={card.title}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl shadow-float overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(i)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center text-ink/60 shrink-0 mt-0.5">
                        <IconFor iconKey={card.iconKey} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${categoryColor[card.category]}`}>{card.category}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${priorityColor[card.priority]}`}>{priorityLabel[card.priority]}</span>
                        </div>
                        <div className="text-sm font-bold text-ink leading-snug">{card.title}</div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expanded ? 180 : 0 }}
                      className="text-muted shrink-0 mt-1"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-ink/70 leading-relaxed">{card.insight}</p>
                        <div className="bg-cream rounded-xl px-4 py-3">
                          <div className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">Rekomendasi Aksi</div>
                          <p className="text-sm text-ink">{card.action}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{card.impact}</span>
                          </div>
                          <span className="text-xs text-muted">{card.data}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>

      {/* AI Chat */}
      <FadeUp delay={0.15}>
        <div className="bg-white rounded-2xl p-5 shadow-float">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-blush" />
            <h2 className="font-bold text-ink">Tanya AI Advisor</h2>
          </div>

          {/* Quick questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_QUESTIONS.map(q => (
              <motion.button
                key={q}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickQ(q)}
                className="text-xs bg-cream text-ink px-3 py-2 rounded-xl font-medium hover:bg-blush/20 transition-colors"
              >{q}</motion.button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-4">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Tanya sesuatu tentang klinik..."
              className="flex-1 bg-cream rounded-xl px-4 py-2.5 text-sm text-ink outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              className="w-10 h-10 bg-ink rounded-xl flex items-center justify-center text-white shrink-0"
            >
              <Send size={15} />
            </motion.button>
          </div>

          {/* Answer */}
          <AnimatePresence>
            {chatAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-ink rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={13} className="text-blush" />
                  <span className="text-xs font-semibold text-white/60">AI Advisor</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{chatAnswer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>
    </main>
  )
}
