'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Rina Anggraeni',
    initials: 'RA',
    avatarBg: 'bg-rose/20',
    avatarColor: 'text-rose',
    rating: 5,
    date: '2 minggu lalu',
    text: 'Dokter Wildan sangat sabar dan teliti dalam menjelaskan kondisi kehamilan saya. Pertama kali periksa langsung merasa nyaman dan tidak canggung sama sekali. Fasilitasnya bersih, antriannya teratur dengan sistem digital. Pasti balik lagi!',
    tag: 'Pemeriksaan Kehamilan',
  },
  {
    name: 'Dewi Kusumawati',
    initials: 'DK',
    avatarBg: 'bg-sage/20',
    avatarColor: 'text-sage-dark',
    rating: 5,
    date: '1 bulan lalu',
    text: 'Alhamdulillah sudah 3x kontrol di sini. Dokternya ramah, penjelasannya mudah dipahami. USG 4D hasilnya sangat jelas. Sistem booking online sangat membantu, tidak perlu lama menunggu. Terima kasih dokter Wildan!',
    tag: 'USG Kehamilan',
  },
  {
    name: 'Siti Rahayu',
    initials: 'SR',
    avatarBg: 'bg-burgundy/10',
    avatarColor: 'text-burgundy',
    rating: 5,
    date: '3 minggu lalu',
    text: 'Program hamil saya berhasil setelah konsultasi intensif dengan dokter Wildan. Beliau sangat supportif dan memberikan panduan yang jelas. Sekarang sudah 20 minggu kehamilan. Sangat rekomendasikan untuk pasangan yang sedang program!',
    tag: 'Program Kehamilan',
  },
  {
    name: 'Nur Amaliya',
    initials: 'NA',
    avatarBg: 'bg-blush/40',
    avatarColor: 'text-rose',
    rating: 5,
    date: '5 hari lalu',
    text: 'Pelayanannya luar biasa. Dokter mau meluangkan waktu ekstra untuk menjawab semua pertanyaan saya yang banyak. Staf di kliniknya juga ramah-ramah. Antrian digitalnya bagus, saya bisa pantau dari rumah.',
    tag: 'Konsultasi Kandungan',
  },
  {
    name: 'Yuliana Pratiwi',
    initials: 'YP',
    avatarBg: 'bg-sage/20',
    avatarColor: 'text-sage-dark',
    rating: 5,
    date: '2 bulan lalu',
    text: 'Pertama kali periksa kandungan dan senang sekali dengan pengalaman di sini. Dokter Wildan menjelaskan hasil USG dengan detail dan sabar. Tidak ada rasa takut atau canggung. Ruangan bersih dan nyaman. Pasti akan terus kontrol di sini.',
    tag: 'Kunjungan Pertama',
  },
  {
    name: 'Hana Permatasari',
    initials: 'HP',
    avatarBg: 'bg-rose/20',
    avatarColor: 'text-rose',
    rating: 5,
    date: '1 minggu lalu',
    text: 'Booking online sangat mudah. Dokter Wildan sangat kompeten dan memberikan rasa tenang. Saya yang tadinya cemas dengan kehamilan trimester pertama, langsung merasa lebih percaya diri setelah konsultasi. Sangat direkomendasikan!',
    tag: 'Kehamilan Trimester 1',
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  )
}

export default function GoogleReviews() {
  const [page, setPage] = useState(0)
  const perPage = 3
  const totalPages = Math.ceil(reviews.length / perPage)
  const visible = reviews.slice(page * perPage, page * perPage + perPage)
  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' })

  return (
    <section className="py-10 md:py-16 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag w-fit mb-3">Ulasan Pasien</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
              Apa Kata{' '}
              <span className="text-rose">Pasien Kami</span>
            </h2>
            <p className="text-muted max-w-md leading-relaxed">
              Kepercayaan yang diberikan pasien adalah penghargaan terbesar bagi kami.
            </p>
          </div>

          {/* Overall rating */}
          <div className="bg-white rounded-2xl shadow-card px-6 py-4 flex items-center gap-4 shrink-0">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-ink">4.9</div>
              <StarRow count={5} />
              <div className="text-xs text-muted mt-1">dari 120+ ulasan</div>
            </div>
            <div className="w-px h-12 bg-blush" />
            <div className="flex flex-col gap-1">
              {[5, 4, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="text-xs text-muted w-3">{s}</div>
                  <div className="w-20 h-1.5 bg-blush/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: s === 5 ? '92%' : s === 4 ? '6%' : '2%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Reviews grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            ref={gridRef}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-3 gap-5 mb-8"
          >
            {visible.map((r) => (
              <motion.div
                key={r.name}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -5, boxShadow: '0 14px 36px rgba(58,42,44,0.09)' }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                className="bg-white rounded-2xl p-5 shadow-card flex flex-col"
              >
                {/* Google badge + stars */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full ${r.avatarBg} flex items-center justify-center shrink-0`}>
                      <span className={`text-xs font-extrabold ${r.avatarColor}`}>{r.initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-ink text-sm leading-tight">{r.name}</div>
                      <div className="text-xs text-muted">{r.date}</div>
                    </div>
                  </div>
                  {/* Google "G" */}
                  <div className="text-xs font-extrabold text-muted/40 select-none">G</div>
                </div>

                <StarRow count={r.rating} />

                <blockquote className="text-sm text-ink/70 leading-relaxed mt-3 flex-1">
                  {r.text}
                </blockquote>

                <div className="mt-4 pt-3 border-t border-blush/40">
                  <span className="text-xs text-sage-dark font-semibold bg-sage-light/30 px-2.5 py-1 rounded-full">
                    {r.tag}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <FadeUp delay={0.15} className="flex items-center justify-center gap-3">
          <motion.button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-ink disabled:opacity-30 transition-opacity"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-rose w-5' : 'bg-blush'}`}
                aria-label={`Halaman ${i + 1}`}
              />
            ))}
          </div>
          <motion.button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-ink disabled:opacity-30 transition-opacity"
            aria-label="Berikutnya"
          >
            <ChevronRight size={18} />
          </motion.button>
        </FadeUp>

      </div>
    </section>
  )
}
